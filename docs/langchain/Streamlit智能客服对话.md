---
title: Streamlit智能客服对话
date: 2025-06-15 11:15:53
permalink: /langchain/Streamlit智能客服对话
categories:
  - AI
tags:
  - Streamlit
author: zhuib
---

# Streamlit智能客服对话——RAG问答的流式输出

在RAG智能客服系统中，用户体验的关键之一是响应速度。传统的一次性返回完整答案会让用户在等待期间感到焦虑，尤其是当大模型推理时间较长时。流式输出（Streaming）通过逐字逐句地展示生成内容，显著改善了交互体验。本文将介绍如何使用Streamlit的聊天组件与LangChain的流式接口，构建一个支持流式输出的RAG智能客服对话界面。

## 核心概念

- **st.chat_message**：Streamlit的聊天气泡组件，通过`role`参数区分用户和助手的消息样式，自动渲染为左右对齐的对话气泡。
- **st.chat_input**：聊天输入框组件，固定在页面底部，用户输入后返回文本内容，页面自动重新渲染。
- **chain.stream()**：LangChain LCEL链的流式调用方法，返回一个生成器（Generator），每次yield一个文本片段（chunk），实现逐步输出。
- **capture生成器包装器**：自定义的生成器包装函数，在转发流式chunk的同时将其缓存到列表中，解决生成器只能遍历一次的问题，实现"边输出边保存"。
- **session_state消息历史**：将对话消息列表存储在`st.session_state`中，确保页面重渲染时聊天记录不丢失。

## 代码示例

```python
import time
from rag import RagService
import streamlit as st
import config_data as config

st.title("智能客服")
st.divider()

if "message" not in st.session_state:
    st.session_state["message"] = [{"role": "assistant", "content": "你好，有什么可以帮助你？"}]

if "rag" not in st.session_state:
    st.session_state["rag"] = RagService()

for message in st.session_state["message"]:
    st.chat_message(message["role"]).write(message["content"])

prompt = st.chat_input()

if prompt:
    st.chat_message("user").write(prompt)
    st.session_state["message"].append({"role": "user", "content": prompt})

    ai_res_list = []
    with st.spinner("AI思考中..."):
        res_stream = st.session_state["rag"].chain.stream({"input": prompt}, config.session_config)

        def capture(generator, cache_list):
            for chunk in generator:
                cache_list.append(chunk)
                yield chunk

        st.chat_message("assistant").write_stream(capture(res_stream, ai_res_list))
        st.session_state["message"].append({"role": "assistant", "content": "".join(ai_res_list)})
```

## 代码解析

**1. 页面初始化与欢迎消息**

```python
st.title("智能客服")
st.divider()
```
设置页面标题和分隔线，`st.divider()`渲染一条水平分割线，增强视觉层次感。

**2. 会话状态初始化**

```python
if "message" not in st.session_state:
    st.session_state["message"] = [{"role": "assistant", "content": "你好，有什么可以帮助你？"}]

if "rag" not in st.session_state:
    st.session_state["rag"] = RagService()
```
初始化两个关键状态：`message`存储对话历史（首次加载时包含助手欢迎语），`rag`存储RAG服务实例。两者都通过条件判断确保只初始化一次。

**3. 历史消息渲染**

```python
for message in st.session_state["message"]:
    st.chat_message(message["role"]).write(message["content"])
```
遍历消息历史列表，使用`st.chat_message`根据角色（user/assistant）渲染不同样式的聊天气泡，`write`方法将内容写入气泡中。

**4. 用户输入处理**

```python
prompt = st.chat_input()

if prompt:
    st.chat_message("user").write(prompt)
    st.session_state["message"].append({"role": "user", "content": prompt})
```
`st.chat_input()`在页面底部渲染输入框，用户提交后返回输入文本。将用户消息立即渲染并追加到历史记录中。

**5. 流式输出与缓存**

```python
res_stream = st.session_state["rag"].chain.stream({"input": prompt}, config.session_config)

def capture(generator, cache_list):
    for chunk in generator:
        cache_list.append(chunk)
        yield chunk

st.chat_message("assistant").write_stream(capture(res_stream, ai_res_list))
st.session_state["message"].append({"role": "assistant", "content": "".join(ai_res_list)})
```
这是代码的核心部分。`chain.stream()`返回流式生成器，`capture`函数是一个包装器：
- 遍历生成器的每个chunk
- 将chunk追加到`cache_list`中缓存
- 通过`yield`转发chunk给`write_stream`

`write_stream`接收生成器并实时渲染流式内容。流式输出完成后，将缓存的chunk列表拼接为完整字符串，存入消息历史。

## 关键要点

- `st.chat_message`和`st.chat_input`是Streamlit专用的聊天界面组件，自动处理气泡样式和输入框布局，极大简化了对话UI的开发。
- `chain.stream()`是LangChain LCEL链的流式调用接口，返回Generator，每个yield的chunk是模型生成的一个文本片段。
- `capture`生成器包装器是流式输出与消息持久化之间的桥梁——生成器只能遍历一次，通过在转发chunk的同时缓存到列表，实现了"边流式输出边保存完整回复"。
- `write_stream`是Streamlit专门为流式内容设计的渲染方法，接收Generator后逐chunk更新界面，实现打字机效果。
- 对话历史必须存储在`st.session_state`中，否则页面重渲染时所有消息都会丢失。

## 小结

本文详细介绍了如何使用Streamlit构建支持流式输出的RAG智能客服对话界面。核心在于`chain.stream()`与`write_stream`的配合实现实时内容渲染，以及`capture`生成器包装器解决流式输出与消息持久化的矛盾。通过`st.chat_message`和`st.chat_input`组件，无需任何前端开发即可构建专业的聊天界面，配合`session_state`实现对话历史的持久化管理，为用户提供流畅的交互体验。

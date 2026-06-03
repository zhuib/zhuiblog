---
title: Streamlit文件上传服务
date: 2025-06-15 11:15:53
permalink: /langchain/Streamlit文件上传服务
categories:
  - AI
tags:
  - Streamlit
author: zhuib
---

# Streamlit文件上传服务——知识库文档入库界面

在RAG（检索增强生成）项目中，知识库的文档入库是整个系统的起点。用户需要将文本文件上传至系统，经过文本分割、向量化后存入向量数据库。Streamlit作为Python领域最受欢迎的数据应用框架之一，能够快速构建交互式的Web界面，非常适合作为知识库管理的入口。本文将详细介绍如何使用Streamlit构建一个文件上传服务，实现知识库文档的在线入库功能。

## 核心概念

- **Streamlit框架**：一个开源的Python库，用于快速构建数据科学和机器学习的Web应用，无需前端开发经验。
- **st.file_uploader**：Streamlit提供的文件上传组件，支持限制文件类型、是否允许多文件上传等配置。
- **st.session_state**：Streamlit的会话状态管理机制，用于在页面重新渲染时保持数据不丢失。每次用户交互都会触发脚本重新执行，session_state确保关键对象不会被重复创建。
- **st.spinner**：加载动画组件，在耗时操作期间向用户展示友好的等待提示。
- **getvalue().decode()**：UploadedFile对象的二进制内容读取方法，getvalue()返回bytes类型，decode("utf-8")将其转为字符串。

## 代码示例

```python
import time
import streamlit as st
from knowledge_base import KnowledgeBaseService

st.title("知识库更新服务")

uploader_file = st.file_uploader(
    "请上传TXT文件",
    type=['txt'],
    accept_multiple_files=False,
)

if "service" not in st.session_state:
    st.session_state["service"] = KnowledgeBaseService()

if uploader_file is not None:
    file_name = uploader_file.name
    file_type = uploader_file.type
    file_size = uploader_file.size / 1024

    st.subheader(f"文件名：{file_name}")
    st.write(f"格式：{file_type} | 大小：{file_size:.2f} KB")

    text = uploader_file.getvalue().decode("utf-8")

    with st.spinner("载入知识库中。。。"):
        time.sleep(1)
        result = st.session_state["service"].upload_by_str(text, file_name)
        st.write(result)
```

## 代码解析

**1. 页面标题与文件上传组件**

```python
st.title("知识库更新服务")
```
使用`st.title()`设置页面大标题，Streamlit会自动将其渲染为H1样式。

```python
uploader_file = st.file_uploader(
    "请上传TXT文件",
    type=['txt'],
    accept_multiple_files=False,
)
```
`st.file_uploader`创建文件上传区域，`type=['txt']`限制只能上传TXT格式文件，`accept_multiple_files=False`表示一次只能上传一个文件。当用户未上传文件时，`uploader_file`为`None`。

**2. 会话状态管理**

```python
if "service" not in st.session_state:
    st.session_state["service"] = KnowledgeBaseService()
```
这是Streamlit中非常关键的模式。由于Streamlit每次交互都会重新执行整个脚本，如果不使用`session_state`，`KnowledgeBaseService`会在每次渲染时被重新创建，导致向量数据库连接等资源被反复初始化。通过`session_state`，服务对象只在首次创建并持久保存。

**3. 文件信息展示与内容读取**

```python
file_name = uploader_file.name
file_type = uploader_file.type
file_size = uploader_file.size / 1024
```
`UploadedFile`对象提供了`name`、`type`、`size`等属性，分别获取文件名、MIME类型和文件大小（字节）。将`size`除以1024转换为KB单位。

```python
text = uploader_file.getvalue().decode("utf-8")
```
`getvalue()`读取文件的二进制内容，`decode("utf-8")`将bytes解码为UTF-8字符串，这是处理文本文件的标准方式。

**4. 加载动画与入库操作**

```python
with st.spinner("载入知识库中。。。"):
    time.sleep(1)
    result = st.session_state["service"].upload_by_str(text, file_name)
    st.write(result)
```
`st.spinner`在上下文管理器内显示旋转加载动画，直到代码块执行完毕。`time.sleep(1)`模拟短暂延迟（实际项目中可去掉），`upload_by_str`将文本内容入库，返回操作结果。

## 关键要点

- `st.file_uploader`是Streamlit文件上传的核心组件，通过`type`参数限制文件格式，通过`accept_multiple_files`控制是否允许多文件上传。
- `st.session_state`是Streamlit会话持久化的关键机制，避免服务对象在每次页面重渲染时被重复创建，保证资源高效利用。
- `UploadedFile.getvalue()`返回bytes类型，需要调用`.decode("utf-8")`转为字符串才能进行后续文本处理。
- `st.spinner`为耗时操作提供用户友好的等待反馈，提升交互体验。
- 文件上传后应立即读取内容，因为`UploadedFile`对象在脚本重新执行后可能失效。

## 小结

本文介绍了如何使用Streamlit构建知识库文档入库的文件上传界面。通过`st.file_uploader`接收用户上传的TXT文件，利用`st.session_state`保持服务对象的持久化，使用`st.spinner`提供加载反馈，最终调用`KnowledgeBaseService`完成文档入库。这个简洁的界面为RAG系统的知识管理提供了便捷的入口，是整个知识库更新流程的前端门户。

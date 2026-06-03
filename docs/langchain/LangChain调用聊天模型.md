---
title: LangChain调用聊天模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain调用聊天模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain调用聊天模型——消息类型体系

LangChain 中的大模型接口分为两类：LLM（纯文本输入输出）和 Chat Model（消息类型输入输出）。聊天模型通过结构化的消息类型来组织对话，支持系统提示、多轮对话等高级功能，是构建对话式 AI 应用的基础。

## 核心概念

**Chat Model（聊天模型）** 与 LLM 的核心区别在于输入输出格式：LLM 接收和返回纯字符串，而 Chat Model 接收消息列表、返回消息对象。这种设计更贴合实际对话场景。

LangChain 定义了三种核心消息类型：

- **SystemMessage**：系统消息，设定模型的角色和行为规则（如"你是一个翻译助手"）
- **HumanMessage**：用户消息，代表用户的输入
- **AIMessage**：AI 消息，代表模型的回复，用于传递历史对话记录

通过将这三种消息类型组合成列表，可以构建完整的对话上下文，让模型理解系统设定、历史交互和当前问题。

## 代码示例

```python
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

model = ChatTongyi(model="qwen3-max")

messages = [
    SystemMessage(content="你是一个边塞诗人。"),
    HumanMessage(content="写一首唐诗"),
    AIMessage(content="锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"),
    HumanMessage(content="按照你上一个回复的格式，在写一首唐诗。")
]

res = model.stream(input=messages)
for chunk in res:
    print(chunk.content, end="", flush=True)
```

## 代码解析

1. **导入模块**：从 `langchain_community.chat_models.tongyi` 导入 `ChatTongyi`（聊天版通义千问），从 `langchain_core.messages` 导入三种消息类型。

2. **创建聊天模型实例**：`ChatTongyi(model="qwen3-max")` 创建聊天模型，注意使用的是 `ChatTongyi` 而非 `Tongyi`。

3. **构建消息列表**：
   - `SystemMessage`：设定模型角色为"边塞诗人"，引导模型以特定风格回复
   - `HumanMessage`：用户的第一次提问
   - `AIMessage`：模型的上一轮回复，作为对话历史传入
   - `HumanMessage`：用户的当前提问，引用了上一轮回复的格式

4. **流式调用**：`model.stream(input=messages)` 对消息列表进行流式调用，返回的每个 `chunk` 是一个 `AIMessageChunk` 对象，通过 `chunk.content` 获取文本内容。

## 关键要点

- Chat Model 使用 `SystemMessage`、`HumanMessage`、`AIMessage` 三种消息类型组织对话
- `SystemMessage` 设定模型角色和行为规则，是构建专业 AI 应用的关键
- `AIMessage` 用于传入历史对话，使模型能理解上下文关系
- Chat Model 的流式输出中，每个 chunk 需要通过 `.content` 属性获取文本内容
- `ChatTongyi` 是聊天版通义千问，与 `Tongyi`（LLM 版）属于不同的类

## 小结

聊天模型的消息类型体系是构建对话式 AI 应用的基础。通过 SystemMessage 设定角色、HumanMessage 传递用户输入、AIMessage 保存历史对话，可以构建出具有上下文理解能力的智能对话系统。掌握消息类型的使用，是深入学习 LangChain 对话链、Agent 等高级功能的前提。

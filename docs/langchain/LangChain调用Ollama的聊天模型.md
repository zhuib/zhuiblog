---
title: LangChain调用Ollama的聊天模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain调用Ollama的聊天模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain调用Ollama的聊天模型

在前面的文章中，我们分别介绍了 LangChain 调用云端聊天模型和 Ollama 本地 LLM。本文将两者结合，介绍如何通过 LangChain 调用 Ollama 部署的本地聊天模型，实现本地化的多轮对话能力。

## 核心概念

**ChatOllama** 是 LangChain 对 Ollama 聊天模型的封装，与 `OllamaLLM`（纯文本模型）相对应。它支持与云端聊天模型完全相同的消息类型体系，可以使用 `SystemMessage`、`HumanMessage`、`AIMessage` 构建对话上下文。

关键要素：

- **ChatOllama vs OllamaLLM**：`ChatOllama` 是聊天模型接口，接收消息列表；`OllamaLLM` 是 LLM 接口，接收纯文本字符串
- **统一的消息格式**：与 `ChatTongyi` 使用完全相同的 `SystemMessage`/`HumanMessage`/`AIMessage` 消息类型
- **统一的接口设计**：`invoke()`、`stream()` 等方法与云端聊天模型行为一致
- **本地运行**：所有计算在本地完成，数据不出本机，保障隐私安全

## 代码示例

```python
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

model = ChatOllama(model="qwen3:4b")

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

1. **导入模块**：从 `langchain_ollama` 导入 `ChatOllama`，从 `langchain_core.messages` 导入消息类型。注意 `ChatOllama` 和 `OllamaLLM` 在同一个包中。

2. **创建聊天模型实例**：`ChatOllama(model="qwen3:4b")` 创建本地聊天模型实例，使用 `qwen3:4b` 模型。

3. **构建消息列表**：消息结构与使用 `ChatTongyi` 时完全相同——`SystemMessage` 设定角色、`HumanMessage` 和 `AIMessage` 构建对话历史。

4. **流式输出**：`model.stream(input=messages)` 返回流式迭代器，每个 `chunk` 通过 `.content` 获取文本内容，与云端聊天模型的处理方式一致。

## 关键要点

- `ChatOllama` 位于 `langchain_ollama` 包中，与 `OllamaLLM` 是同一包的不同类
- `ChatOllama` 接收消息列表，`OllamaLLM` 接收纯文本字符串，适用场景不同
- 消息格式与云端聊天模型（如 `ChatTongyi`）完全一致，切换只需更改模型类
- 本地聊天模型支持流式输出，通过 `chunk.content` 获取文本
- 本地运行的优势：无需 API 密钥、无调用费用、数据隐私安全

## 小结

通过 `ChatOllama`，我们可以在本地部署具有多轮对话能力的聊天模型，同时享受 LangChain 统一接口带来的便利。无论是云端模型还是本地模型，消息类型和调用方式完全一致，开发者可以根据实际需求灵活选择部署方式，在模型能力、成本和隐私之间取得最佳平衡。

---
title: OpenAI库的基础使用
date: 2025-06-15 11:15:53
permalink: /langchain/OpenAI库的基础使用
categories:
  - AI
tags:
  - OpenAI
author: zhuib
---

# OpenAI库的基础使用——从创建客户端到处理响应

掌握OpenAI库的基础使用是开发大模型应用的核心技能。本文将完整介绍从创建客户端、构造消息、调用模型到处理响应的全流程，帮助你快速上手大模型API调用。

## 核心概念

### 客户端创建

OpenAI库的一切操作都始于创建一个`OpenAI`客户端实例。客户端负责管理与API服务的连接、认证和请求发送。通过`base_url`参数，我们可以将客户端指向任何兼容OpenAI API格式的服务，包括阿里云DashScope等国内平台。

### DashScope兼容API

阿里云DashScope提供了兼容OpenAI API格式的接口，地址为：

```
https://dashscope.aliyuncs.com/compatible-mode/v1
```

通过这个地址，我们可以使用OpenAI库直接调用通义千问等模型，无需学习新的SDK。

### 三种消息角色

在OpenAI的Chat Completions API中，消息通过`messages`列表传递，每条消息都有一个`role`字段：

- **system**（系统角色）：设定模型的行为、性格和回答风格。类似于给AI设定一个"人设"。
- **assistant**（助手角色）：代表模型之前的回复，用于多轮对话中传递历史上下文。
- **user**（用户角色）：用户的提问或输入内容。

### 非流式响应

非流式模式下（默认），模型会等待全部内容生成完毕后一次性返回完整的响应。响应对象中包含`choices`列表，通过`response.choices[0].message.content`即可获取模型生成的完整文本。

## 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "你是一个Python编程专家，并且不说废话简单回答"},
        {"role": "assistant", "content": "好的，我是编程专家，并且话不多，你要问什么？"},
        {"role": "user", "content": "输出1-10的数字，使用python代码"}
    ]
)

print(response.choices[0].message.content)
```

## 代码解析

### 1. 创建客户端

```python
client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
```

- 指定`base_url`为DashScope的兼容模式地址，使客户端连接到阿里云的模型服务。
- 未传入`api_key`参数时，OpenAI库会自动从环境变量`OPENAI_API_KEY`中读取。使用DashScope时，需确保该环境变量已设置为你的DashScope API Key。

### 2. 构造消息列表

```python
messages=[
    {"role": "system", "content": "你是一个Python编程专家，并且不说废话简单回答"},
    {"role": "assistant", "content": "好的，我是编程专家，并且话不多，你要问什么？"},
    {"role": "user", "content": "输出1-10的数字，使用python代码"}
]
```

- **system消息**：设定模型为Python编程专家，并要求回答简洁。这直接影响模型的输出风格和内容倾向。
- **assistant消息**：模拟模型之前的回复，建立对话上下文。这里助手已经确认了自己的角色定位。
- **user消息**：用户的实际请求，要求用Python代码输出1-10的数字。

### 3. 调用模型

```python
response = client.chat.completions.create(
    model="qwen3-max",
    messages=...
)
```

- `model`参数指定使用`qwen3-max`模型，这是通义千问的高性能版本。
- 未设置`stream`参数，默认为非流式模式，模型会一次性返回完整响应。

### 4. 处理响应

```python
print(response.choices[0].message.content)
```

- `response.choices`是一个列表，包含模型生成的候选回复（默认只有一个）。
- `choices[0]`取第一个候选回复。
- `message.content`获取回复的文本内容。
- 由于system消息要求简洁回答，模型的输出会直接给出Python代码，不会附带冗长的解释。

## 关键要点

- **base_url指定服务地址**：通过`base_url`参数，OpenAI库可以连接任何兼容OpenAI API格式的服务，如DashScope的`https://dashscope.aliyuncs.com/compatible-mode/v1`。
- **三种消息角色各司其职**：`system`设定行为，`user`传递提问，`assistant`承载历史回复，三者配合构成完整的对话上下文。
- **非流式模式为默认**：不设置`stream`参数时，模型等待全部内容生成后一次性返回。
- **通过choices[0].message.content获取结果**：非流式模式下，响应的文本内容位于`response.choices[0].message.content`。
- **system消息影响输出风格**：合理设置system消息可以有效控制模型的回答风格和内容倾向。

## 小结

本文介绍了OpenAI库的基础使用流程：创建客户端、构造消息、调用模型、处理响应。核心在于理解三种消息角色的作用以及非流式响应的数据结构。掌握这些基础知识后，你就可以开始构建各种大模型应用了。

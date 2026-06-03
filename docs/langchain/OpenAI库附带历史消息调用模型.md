---
title: OpenAI库附带历史消息调用模型
date: 2025-06-15 11:15:53
permalink: /langchain/OpenAI库附带历史消息调用模型
categories:
  - AI
tags:
  - 模型调用
author: zhuib
---

# OpenAI库附带历史消息调用模型——实现多轮对话记忆

大语言模型本身是无状态的——每次调用都是独立的，模型不会记住之前的对话。要实现多轮对话的"记忆"效果，必须在每次请求时将完整的对话历史传递给模型。本文将介绍如何通过附带历史消息来实现多轮对话。

## 核心概念

### LLM的无状态特性

大语言模型的每次API调用都是完全独立的，模型不会在请求之间保存任何状态或记忆。这意味着：

- 每次调用时，模型对之前的对话一无所知。
- 如果不传递历史消息，模型无法理解上下文中的指代关系。
- "记忆"效果完全依赖于开发者在每次请求中手动传递对话历史。

### 历史消息的传递方式

实现多轮对话的关键是将所有之前的对话内容放入`messages`列表中，按照时间顺序排列：

```
system → user → assistant → user → assistant → user（当前问题）
```

每一轮的user提问和assistant回复都需要包含在消息列表中，模型才能理解完整的对话上下文。

### 上下文窗口限制

每个模型都有一个上下文窗口（Context Window）的限制，即一次请求中能处理的最大token数量。这意味着：

- 传递的历史消息越多，消耗的token越多。
- 当对话历史超出上下文窗口时，需要采取截断、摘要等策略。
- 在实际应用中，需要平衡对话记忆的完整性和token消耗的成本。

### 消息角色的交替模式

在多轮对话中，消息角色遵循严格的交替模式：

1. **system**：始终在最前面，设定模型行为（只有一条）。
2. **user与assistant交替出现**：先user后assistant，模拟真实的对话流程。
3. **最后一条通常是user**：代表当前的用户输入。

## 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "你是AI助理，回答很简洁"},
        {"role": "user", "content": "小明有2条宠物狗"},
        {"role": "assistant", "content": "好的"},
        {"role": "user", "content": "小红有3只宠物猫"},
        {"role": "assistant", "content": "好的"},
        {"role": "user", "content": "总共有几个宠物？"}
    ],
    stream=True
)

for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

## 代码解析

### 1. 创建客户端

```python
client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
```

- 客户端创建方式与之前相同，连接到DashScope兼容API。

### 2. 构造包含历史消息的消息列表

```python
messages=[
    {"role": "system", "content": "你是AI助理，回答很简洁"},
    {"role": "user", "content": "小明有2条宠物狗"},
    {"role": "assistant", "content": "好的"},
    {"role": "user", "content": "小红有3只宠物猫"},
    {"role": "assistant", "content": "好的"},
    {"role": "user", "content": "总共有几个宠物？"}
]
```

这是实现多轮对话的核心部分，消息列表的结构如下：

- **第1条（system）**：设定模型为简洁回答的AI助理。
- **第2条（user）**：第一轮对话——用户告知"小明有2条宠物狗"。
- **第3条（assistant）**：第一轮对话——模型回复"好的"，确认已记录信息。
- **第4条（user）**：第二轮对话——用户告知"小红有3只宠物猫"。
- **第5条（assistant）**：第二轮对话——模型回复"好的"，再次确认。
- **第6条（user）**：当前问题——用户询问"总共有几个宠物？"。

由于模型能够看到之前的对话历史，它可以正确回答"5个宠物"（2条狗+3只猫），而不是反问"什么宠物？"。

### 3. 调用模型并启用流式输出

```python
response = client.chat.completions.create(
    model="qwen3-max",
    messages=...,
    stream=True
)
```

- 使用`qwen3-max`模型，启用流式输出以获得实时响应体验。

### 4. 处理流式响应

```python
for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

- 流式响应的处理方式与之前相同，逐片段输出增量内容。

## 关键要点

- **LLM是无状态的**：每次API调用都是独立的，模型不会自动记住之前的对话，必须手动传递历史消息。
- **历史消息必须完整传递**：每次请求都需要将完整的对话历史放入`messages`列表，包括之前的user提问和assistant回复。
- **消息角色需交替排列**：user和assistant消息按照对话的时间顺序交替出现，形成自然的对话流。
- **注意上下文窗口限制**：对话历史越长，消耗的token越多。当历史超出模型上下文窗口时，需要考虑截断或摘要策略。
- **多轮对话的"记忆"是伪记忆**：模型并非真正记住了对话，而是通过重新阅读完整历史来理解上下文。这意味着每次请求的token消耗会随对话轮次增加而增长。

## 小结

本文介绍了如何通过附带历史消息实现多轮对话记忆。核心在于理解LLM的无状态特性——每次调用都需要传递完整的对话历史，模型才能理解上下文。在实际应用中，还需要关注上下文窗口限制和token消耗，合理管理对话历史的长度。这是构建聊天机器人和对话系统的关键技术基础。

---
title: Chain的基础使用
date: 2025-06-15 11:15:53
permalink: /langchain/Chain的基础使用
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# Chain的基础使用——LCEL链式调用

LCEL（LangChain Expression Language）是 LangChain 的核心设计理念，通过管道符 `|` 将多个组件串联成处理链。本文在前文 `ChatPromptTemplate` 的基础上，介绍如何使用 LCEL 构建完整的聊天链，并实现流式输出。

## 核心概念

**LCEL 链式调用**的核心思想是：将复杂的数据处理流程拆分为多个独立组件，通过管道符 `|` 串联，数据自动从前一个组件流向后一个组件。每个组件都实现了 `Runnable` 接口，支持 `invoke()`、`stream()` 等统一方法。

关键要素：

- **管道符 `|`**：LCEL 的核心语法，`a | b` 表示将 a 的输出作为 b 的输入
- **`template | model`**：将提示词模板和模型串联，自动完成模板填充和模型调用
- **自动数据流转**：链内部自动传递数据，无需手动调用中间步骤
- **`stream()` 支持**：链也支持流式输出，与单个组件的 `stream()` 用法一致

## 代码示例

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_models.tongyi import ChatTongyi

chat_prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一个边塞诗人，可以作诗。"),
        MessagesPlaceholder("history"),
        ("human", "请再来一首唐诗"),
    ]
)

history_data = [
    ("human", "你来写一个唐诗"),
    ("ai", "床前明月光，疑是地上霜，举头望明月，低头思故乡"),
    ("human", "好诗再来一个"),
    ("ai", "锄禾日当午，汗滴禾下锄，谁知盘中餐，粒粒皆辛苦"),
]

model = ChatTongyi(model="qwen3-max")

chain = chat_prompt_template | model

for chunk in chain.stream({"history": history_data}):
    print(chunk.content, end="", flush=True)
```

## 代码解析

1. **创建提示词模板**：与前一篇文章相同，使用 `ChatPromptTemplate.from_messages()` 创建包含系统设定、历史占位符和用户提问的模板。

2. **准备对话历史**：`history_data` 包含两轮历史对话，与模板中的 `MessagesPlaceholder("history")` 对应。

3. **创建模型实例**：`ChatTongyi(model="qwen3-max")` 创建聊天模型实例。

4. **构建链**：`chain = chat_prompt_template | model` 使用管道符将模板和模型串联。这等价于创建了一个 `RunnableSequence`，数据流为：
   - 输入 `{"history": history_data}` → 模板填充 → 生成消息列表 → 模型调用 → 返回响应

5. **流式调用链**：`chain.stream({"history": history_data})` 对整个链进行流式调用。链内部自动完成：
   - 将 `{"history": history_data}` 传给模板，填充生成消息列表
   - 将消息列表传给模型，启动流式生成
   - 返回流式迭代器，每个 `chunk` 通过 `.content` 获取文本

6. **与手动调用的对比**：不使用链时，需要手动分步操作：
   ```python
   prompt_value = chat_prompt_template.invoke({"history": history_data})
   res = model.stream(input=prompt_value)
   ```
   使用链后，一行代码即可完成，且支持 `stream()` 和 `invoke()` 等所有 Runnable 方法。

## 关键要点

- LCEL 管道符 `|` 将组件串联成链，数据自动流转
- `template | model` 是最基本的链结构，自动完成模板填充和模型调用
- 链支持 `invoke()`、`stream()` 等 Runnable 接口的所有方法
- 流式输出时，`chain.stream()` 返回的每个 chunk 需通过 `.content` 获取文本
- 链可以继续扩展，如 `template | model | output_parser`，实现更复杂的处理流程

## 小结

LCEL 链式调用是 LangChain 的核心编程范式，它将组件组合变得简洁直观。通过管道符 `|`，模板、模型、输出解析器等组件可以像搭积木一样自由组合，数据在链中自动流转。这种设计不仅简化了代码，还使得组件的替换和扩展变得非常灵活，是构建复杂 AI 应用的基础。

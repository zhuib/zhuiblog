---
title: ChatPromptTemplate的使用
date: 2025-06-15 11:15:53
permalink: /langchain/ChatPromptTemplate的使用
categories:
  - AI
tags:
  - 提示词
author: zhuib
---

# ChatPromptTemplate的使用——构建聊天提示词

与 `PromptTemplate` 用于纯文本提示词不同，`ChatPromptTemplate` 专门用于构建聊天模型的提示词。它支持消息类型的模板化，包括系统消息、历史对话占位符等，是构建对话式 AI 应用的核心工具。

## 核心概念

**ChatPromptTemplate** 是 LangChain 为聊天模型设计的提示词模板类。它将聊天消息的结构（系统设定、历史对话、用户输入）模板化，使得对话上下文的构建更加规范和灵活。

关键要素：

- **`ChatPromptTemplate.from_messages()`**：从消息列表创建聊天提示词模板
- **消息格式**：支持元组写法 `("role", "content")` 和消息类写法
- **`MessagesPlaceholder`**：消息占位符，用于动态插入对话历史，是构建多轮对话的关键
- **`invoke().to_string()`**：填充模板并转为字符串，用于查看完整提示词

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

prompt_text = chat_prompt_template.invoke({"history": history_data}).to_string()

model = ChatTongyi(model="qwen3-max")
res = model.invoke(prompt_text)
print(res.content, type(res))
```

## 代码解析

1. **创建聊天提示词模板**：`ChatPromptTemplate.from_messages()` 接收消息列表：
   - `("system", "你是一个边塞诗人，可以作诗。")`：固定的系统设定
   - `MessagesPlaceholder("history")`：对话历史占位符，运行时动态插入
   - `("human", "请再来一首唐诗")`：固定的用户当前提问

2. **准备对话历史**：`history_data` 是一个元组列表，模拟了之前的对话记录，包含两轮问答。

3. **填充模板**：`chat_prompt_template.invoke({"history": history_data})` 传入变量字典，`MessagesPlaceholder("history")` 被替换为 `history_data` 中的消息。`.to_string()` 将填充后的 `PromptValue` 转为字符串，方便查看和调试。

4. **调用模型**：将填充后的提示词传给 `ChatTongyi` 模型，`res.content` 获取 AI 回复的文本内容，`type(res)` 显示返回类型为 `AIMessage`。

5. **模板优势**：系统设定和当前提问是固定的模板部分，只有对话历史是动态的，这使得模板可以复用于不同的对话场景。

## 关键要点

- `ChatPromptTemplate.from_messages()` 从消息列表创建聊天提示词模板
- `MessagesPlaceholder` 是动态插入对话历史的关键组件
- 元组写法 `("role", "content")` 在模板定义和对话历史中都可使用
- `invoke()` 返回 `PromptValue`，通过 `.to_string()` 转为字符串
- `MessagesPlaceholder` 使得多轮对话的上下文管理变得结构化

## 小结

`ChatPromptTemplate` 是构建聊天模型提示词的专业工具，它将系统设定、对话历史和用户提问统一模板化。`MessagesPlaceholder` 的引入使得动态对话历史的插入变得优雅，为构建多轮对话系统提供了坚实基础。结合 LCEL 链式调用，`ChatPromptTemplate` 可以与模型无缝串联，实现完整的对话处理管道。

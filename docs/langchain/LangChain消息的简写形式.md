---
title: LangChain消息的简写形式
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain消息的简写形式
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain消息的简写形式——元组写法

在使用 LangChain 的聊天模型时，我们通常需要导入 `SystemMessage`、`HumanMessage`、`AIMessage` 等消息类来构建对话。LangChain 还提供了一种更简洁的元组写法，无需导入消息类即可完成相同的对话构建。

## 核心概念

**元组简写形式**是用 `("role", "content")` 二元组来替代消息类的写法。LangChain 在内部会自动将元组转换为对应的消息对象，因此功能完全等价，但代码更加简洁。

角色字符串与消息类的对应关系：

- `("system", "内容")` 等价于 `SystemMessage(content="内容")`
- `("human", "内容")` 等价于 `HumanMessage(content="内容")`
- `("ai", "内容")` 等价于 `AIMessage(content="内容")`

这种简写在构建对话历史时特别方便，减少了导入语句和代码量。

## 代码示例

```python
from langchain_community.chat_models.tongyi import ChatTongyi

model = ChatTongyi(model="qwen3-max")

messages = [
    ("system", "你是一个边塞诗人。"),
    ("human", "写一首唐诗。"),
    ("ai", "锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"),
    ("human", "按照你上一个回复的格式，在写一首唐诗。")
]

res = model.stream(input=messages)
for chunk in res:
    print(chunk.content, end="", flush=True)
```

## 代码解析

1. **简化导入**：只需导入 `ChatTongyi`，无需再导入 `SystemMessage`、`HumanMessage`、`AIMessage`，减少了导入语句。

2. **元组写法**：每条消息用 `("role", "content")` 格式表示：
   - `("system", "你是一个边塞诗人。")` 替代 `SystemMessage(content="你是一个边塞诗人。")`
   - `("human", "写一首唐诗。")` 替代 `HumanMessage(content="写一首唐诗。")`
   - `("ai", "锄禾日当午...")` 替代 `AIMessage(content="锄禾日当午...")`

3. **功能等价**：LangChain 在内部自动将元组转换为对应的消息对象，调用方式和输出结果与使用消息类完全一致。

4. **流式输出**：调用和输出方式不变，`model.stream()` 返回的 chunk 仍需通过 `.content` 获取文本。

## 关键要点

- 元组简写 `("role", "content")` 与消息类写法功能完全等价
- 角色字符串：`"system"`、`"human"`、`"ai"` 分别对应三种消息类型
- 简写形式减少了导入语句，代码更简洁，适合快速构建对话
- LangChain 内部自动完成元组到消息对象的转换，开发者无需关心
- 在 `ChatPromptTemplate.from_messages()` 中也广泛使用元组写法

## 小结

元组简写是 LangChain 提供的一种语法糖，让对话构建更加简洁直观。虽然功能上与消息类写法完全等价，但在实际开发中，元组写法更常用于快速原型开发和对话历史构建，而消息类写法则在需要更精细控制（如附加元数据）时使用。两种写法可以混合使用，根据场景灵活选择。

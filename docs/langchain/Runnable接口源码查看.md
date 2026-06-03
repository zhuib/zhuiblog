---
title: Runnable接口
date: 2025-06-15 11:15:53
permalink: /langchain/Runnable接口源码查看
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# Runnable接口——LangChain组件的统一抽象

在LangChain的架构设计中，`Runnable`接口是最核心的抽象之一。它为所有组件（Prompt、Model、Parser等）提供了统一的调用协议，使得不同类型的组件能够无缝地组合成链（Chain）。本文将深入探讨Runnable接口的设计理念和核心方法。

## 核心概念

`Runnable`接口是LangChain中所有可执行组件的基类，它定义了一套标准化的调用协议。无论是提示词模板、大语言模型还是输出解析器，都实现了这个接口，从而具备了统一的行为模式。

Runnable接口的核心方法包括：

- **`invoke()`**：同步调用，接收单个输入，返回单个输出。这是最基础的执行方式。
- **`stream()`**：流式调用，逐块返回输出结果，适用于需要实时展示生成内容的场景。
- **`ainvoke()`**：异步版本的`invoke()`，适用于异步编程环境，避免阻塞。
- **`astream()`**：异步版本的`stream()`，结合了流式输出和异步执行的优势。

通过`|`操作符，多个Runnable组件可以串联组合，形成`RunnableSequence`类型的链。这种管道式的设计灵感来源于Unix管道，让数据在组件之间自然流动。

## 代码示例

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.llms.tongyi import Tongyi

prompt = PromptTemplate.from_template("你是一个AI助手")
model = Tongyi(model="qwen3-max")

chain = prompt | model | prompt | model
chain.invoke()
chain.stream()
print(type(chain))
```

## 代码解析

1. **创建Prompt和Model**：使用`PromptTemplate.from_template()`创建提示词模板，使用`Tongyi`初始化通义千问模型实例。

2. **链式组合**：通过`|`操作符将prompt和model交替串联，形成`prompt | model | prompt | model`的链式结构。这种写法简洁直观，前一个组件的输出自动成为下一个组件的输入。

3. **调用方式**：
   - `chain.invoke()`：同步执行整条链，等待完整结果返回。
   - `chain.stream()`：流式执行，逐步返回生成的内容，适合需要实时反馈的场景。

4. **类型检查**：`print(type(chain))`会输出`<class 'langchain_core.runnables.base.RunnableSequence'>`，说明通过`|`操作符组合的链本质上是一个`RunnableSequence`对象。

## 关键要点

- LangChain中所有核心组件（Prompt、Model、Parser等）都实现了`Runnable`接口
- `Runnable`接口提供`invoke()`、`stream()`、`ainvoke()`、`astream()`四种调用方法
- 通过`|`操作符可以将多个Runnable组件串联组合成链
- 组合后的链类型为`RunnableSequence`，它本身也实现了`Runnable`接口
- `RunnableSequence`支持嵌套组合，即链可以作为更大链的一部分

## 小结

`Runnable`接口是LangChain实现组件化编程的基石。通过统一的调用协议和管道式组合语法，开发者可以像搭积木一样灵活地构建复杂的AI应用。理解`Runnable`接口的工作原理，是掌握LangChain框架的关键一步。无论是简单的单步调用，还是复杂的多组件链式处理，`Runnable`都提供了一致且优雅的编程体验。

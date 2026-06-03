---
title: Agent的stream流式输出
date: 2025-06-15 11:15:53
permalink: /langchain/Agent的stream流式输出
categories:
  - AI
tags:
  - Agent
author: zhuib
---

# Agent的stream流式输出——实时监控智能体执行过程

在Agent智能体的实际应用中，一个请求可能涉及多次工具调用和模型推理，整个过程可能持续数秒甚至数十秒。如果采用传统的`invoke()`一次性返回结果，用户在等待期间无法获得任何反馈。`stream()`方法通过流式输出，让开发者能够实时监控Agent的每一步执行——何时调用工具、调用了哪个工具、模型正在生成什么内容。本文将介绍如何使用`agent.stream()`实现Agent执行过程的实时可视化。

## 核心概念

- **agent.stream()**：Agent的流式调用方法，返回一个迭代器，每次yield一个执行步骤的状态快照，而非等待全部完成后一次性返回。
- **stream_mode="values"**：流式输出模式之一，每次输出Agent当前状态的完整快照（包含所有消息），而非增量差异。
- **多工具协作**：Agent可以在一次请求中依次调用多个工具，每个工具的调用和结果都会在流式输出中体现。
- **tool_calls属性**：AIMessage对象的属性，包含模型决定调用的工具列表，每个工具调用包含`name`（工具名）和`args`（参数）。
- **try/except处理AttributeError**：并非所有消息类型都有`tool_calls`属性（如HumanMessage、ToolMessage），需要异常处理来安全访问。

## 代码示例

```python
from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.tools import tool

@tool(description="获取股价，传入股票名称，返回字符串信息")
def get_price(name: str) -> str:
    return f"股票{name}的价格是20元"

@tool(description="获取股票信息，传入股票名称，返回字符串信息")
def get_info(name: str) -> str:
    return f"股票{name}，是一家A股上市公司，专注于IT职业教育。"

agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_price, get_info],
    system_prompt="你是一个智能助手，可以回答股票相关问题，记住请告知我思考过程，让我知道你为什么调用某个工具"
)

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "传智教育股价多少，并介绍一下"}]},
    stream_mode="values"
):
    latest_message = chunk['messages'][-1]
    if latest_message.content:
        print(type(latest_message).__name__, latest_message.content)
    try:
        if latest_message.tool_calls:
            print(f"工具调用： { [tc['name'] for tc in latest_message.tool_calls] }")
    except AttributeError as e:
        pass
```

## 代码解析

**1. 定义多工具**

```python
@tool(description="获取股价，传入股票名称，返回字符串信息")
def get_price(name: str) -> str:
    return f"股票{name}的价格是20元"

@tool(description="获取股票信息，传入股票名称，返回字符串信息")
def get_info(name: str) -> str:
    return f"股票{name}，是一家A股上市公司，专注于IT职业教育。"
```
定义了两个工具：`get_price`获取股价，`get_info`获取公司介绍。用户的问题"传智教育股价多少，并介绍一下"需要同时调用两个工具，Agent会自主决策调用顺序。

**2. 流式调用**

```python
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "传智教育股价多少，并介绍一下"}]},
    stream_mode="values"
):
```
`stream()`方法返回迭代器，`stream_mode="values"`表示每次输出完整的状态快照。对于"股价+介绍"的复合问题，Agent的执行流程可能为：
1. 模型分析问题，决定调用`get_price`和`get_info`。
2. 执行`get_price("传智教育")`，获得股价信息。
3. 执行`get_info("传智教育")`，获得公司介绍。
4. 模型综合两个工具的结果，生成最终回答。

每个步骤完成后都会yield一个chunk。

**3. 提取最新消息**

```python
latest_message = chunk['messages'][-1]
if latest_message.content:
    print(type(latest_message).__name__, latest_message.content)
```
`chunk['messages']`包含到当前步骤为止的所有消息，`[-1]`取最新一条。`content`属性包含消息的文本内容，打印消息类型和内容可以清晰追踪执行过程。

**4. 检测工具调用**

```python
try:
    if latest_message.tool_calls:
        print(f"工具调用： { [tc['name'] for tc in latest_message.tool_calls] }")
except AttributeError as e:
    pass
```
当模型决定调用工具时，AIMessage的`tool_calls`属性会包含工具调用列表。每个`tc`是一个字典，包含`name`（工具名）和`args`（参数）。由于HumanMessage和ToolMessage没有`tool_calls`属性，使用`try/except`安全处理。

## 关键要点

- `agent.stream()`实现流式输出，每次yield一个执行步骤的状态快照，让开发者能实时监控Agent的执行过程。
- `stream_mode="values"`输出完整状态快照，通过`messages[-1]`获取最新消息，追踪每一步的进展。
- 多工具协作是Agent的核心能力，模型自主决策调用哪些工具以及调用顺序，无需人工编排。
- `tool_calls`属性只在AIMessage中存在，访问时需要`try/except`处理其他消息类型的`AttributeError`。
- 流式输出在UI集成中尤为重要——可以在Streamlit等前端实时展示工具调用过程，提升用户体验。

## 小结

本文介绍了Agent智能体的流式输出机制。通过`agent.stream()`和`stream_mode="values"`，可以实时获取Agent执行过程的每个步骤，包括模型推理、工具调用和结果生成。`tool_calls`属性让开发者能够监控模型调用了哪些工具，`try/except`处理了不同消息类型的属性差异。流式输出不仅改善了用户等待体验，更为Agent执行过程的调试和可视化提供了基础。

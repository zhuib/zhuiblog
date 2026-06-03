---
title: Agent智能体初体验
date: 2025-06-15 11:15:53
permalink: /langchain/Agent智能体初体验
categories:
  - AI
tags:
  - Agent
author: zhuib
---

# Agent智能体初体验——创建你的第一个智能体

Agent（智能体）是大模型应用的高级形态，它不再局限于单次问答，而是能够自主思考、选择工具、执行操作，最终完成复杂任务。一个Agent由三个核心要素构成：大模型（大脑）、工具（手脚）和系统提示词（行为准则）。LangChain提供了`create_agent()`函数，只需三行核心代码即可创建一个功能完整的智能体。本文将从零开始，带你创建第一个Agent智能体。

## 核心概念

- **create_agent()**：LangChain提供的智能体创建工厂函数，接收模型、工具列表和系统提示词，返回一个可调用的Agent实例。
- **@tool装饰器**：LangChain的工具定义装饰器，将普通Python函数注册为Agent可调用的工具，`description`参数描述工具功能，帮助模型决策何时调用。
- **Agent三要素**：LLM大脑（推理决策）+ 工具集（感知与行动）+ 系统提示词（行为约束），三者缺一不可。
- **Agent输入格式**：`{"messages": [{"role": "user", "content": "..."}]}`，以消息列表的形式传入用户输入。
- **Agent输出格式**：返回包含完整对话历史的字典，`messages`键中记录了用户消息、工具调用和AI回复的完整链路。

## 代码示例

```python
from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.tools import tool

@tool(description="查询天气")
def get_weather() -> str:
    return "晴天"

agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_weather],
    system_prompt="你是一个聊天助手，可以回答用户问题。",
)

res = agent.invoke({
    "messages": [
        {"role": "user", "content": "明天深圳的天气如何？"},
    ]
})

for msg in res["messages"]:
    print(type(msg).__name__, msg.content)
```

## 代码解析

**1. 定义工具**

```python
@tool(description="查询天气")
def get_weather() -> str:
    return "晴天"
```
`@tool`装饰器将`get_weather`函数注册为Agent工具。`description="查询天气"`是关键——模型根据描述判断何时调用此工具。当用户询问天气相关问题时，模型会识别并调用`get_weather`。函数返回值为字符串，作为工具执行结果反馈给模型。

**2. 创建Agent**

```python
agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_weather],
    system_prompt="你是一个聊天助手，可以回答用户问题。",
)
```
三个参数对应Agent的三要素：
- `model`：大模型，这里使用通义千问`qwen3-max`，负责理解用户意图、决策工具调用、生成最终回答。
- `tools`：工具列表，Agent可调用的工具集合。模型会根据用户问题自主选择合适的工具。
- `system_prompt`：系统提示词，定义Agent的角色和行为边界，引导模型以特定方式回应。

**3. 调用Agent**

```python
res = agent.invoke({
    "messages": [
        {"role": "user", "content": "明天深圳的天气如何？"},
    ]
})
```
Agent的输入是一个字典，`messages`键包含消息列表。当用户问"明天深圳的天气如何？"时，Agent的执行流程为：
1. 模型分析用户意图，判断需要调用`get_weather`工具。
2. 执行`get_weather()`，获得返回值"晴天"。
3. 模型结合工具结果，生成最终回答。

**4. 查看执行结果**

```python
for msg in res["messages"]:
    print(type(msg).__name__, msg.content)
```
遍历输出消息历史，可以看到完整的执行链路：HumanMessage（用户提问）→ AIMessage（工具调用决策）→ ToolMessage（工具返回结果）→ AIMessage（最终回答）。每条消息的`type`标识了消息类型，`content`包含消息内容。

## 关键要点

- Agent由LLM（大脑）、工具集（手脚）和系统提示词（行为准则）三个核心要素构成，缺一不可。
- `@tool`装饰器的`description`参数至关重要，它帮助模型理解工具的功能和适用场景，直接影响工具调用的准确性。
- `create_agent()`是LangChain的智能体创建入口，只需指定模型、工具和提示词即可创建功能完整的Agent。
- Agent的输入输出都采用消息列表格式，输出中包含完整的执行链路（用户消息→工具调用→工具结果→AI回答）。
- Agent的核心优势是自主决策——模型根据用户问题自动选择合适的工具，无需人工编排调用顺序。

## 小结

本文从零开始介绍了Agent智能体的创建过程。通过`@tool`定义工具、`create_agent()`组装三要素、`invoke()`调用执行，三步即可构建一个能自主调用工具的智能体。Agent的核心价值在于自主决策能力——模型根据用户意图自动选择和调用工具，将大模型的推理能力与外部工具的执行能力结合，实现了从"问答"到"行动"的跨越。

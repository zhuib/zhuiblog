---
title: ReAct案例
date: 2025-06-15 11:15:53
permalink: /langchain/ReAct案例
categories:
  - AI
tags:
  - Agent
author: zhuib
---

# ReAct案例——推理与行动交织的智能体框架

ReAct（Reasoning + Acting）是Agent智能体领域最经典的框架之一，其核心思想是让模型在"推理"和"行动"之间交替进行：先思考当前应该做什么（Thought），再执行具体操作（Action），然后观察执行结果（Observation），基于观察再进行下一轮思考。这种"思考→行动→观察→再思考"的循环，使Agent能够逐步解决复杂的多步骤问题。本文将通过BMI计算的案例，展示如何使用系统提示词约束Agent遵循ReAct框架。

## 核心概念

- **ReAct框架**：Reasoning（推理）+ Acting（行动）的交织模式，通过Thought-Action-Observation循环逐步解决问题。
- **Thought（思考）**：模型对当前状态的推理分析，判断下一步应该做什么，是ReAct框架的"大脑"环节。
- **Action（行动）**：基于思考结果执行的具体操作，即调用某个工具获取信息或执行任务。
- **Observation（观察）**：工具执行后返回的结果，作为下一轮思考的输入，形成闭环。
- **系统提示词约束**：通过精心设计的系统提示词，约束模型严格遵循"每轮仅调用1个工具"的ReAct规则，避免一次性调用多个工具跳过推理过程。

## 代码示例

```python
from langchain.agents import create_agent
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.tools import tool

@tool(description="获取体重，返回值是整数，单位千克")
def get_weight() -> int:
    return 90

@tool(description="获取身高，返回值是整数，单位厘米")
def get_height() -> int:
    return 172

agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_weight, get_height],
    system_prompt="""你是严格遵循ReAct框架的智能体，必须按「思考→行动→观察→再思考」的流程解决问题，
    且**每轮仅能思考并调用1个工具**，禁止单次调用多个工具。
    并告知我你的思考过程，工具的调用原因，按思考、行动、观察三个结构告知我""",
)

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "计算我的BMI"}]},
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

**1. 定义获取身体数据的工具**

```python
@tool(description="获取体重，返回值是整数，单位千克")
def get_weight() -> int:
    return 90

@tool(description="获取身高，返回值是整数，单位厘米")
def get_height() -> int:
    return 172
```
两个工具分别返回体重（90kg）和身高（172cm）。BMI的计算公式为：体重(kg) / 身高(m)²，需要同时获取两个数据。在ReAct框架下，Agent需要分两轮分别调用这两个工具。

**2. ReAct系统提示词**

```python
system_prompt="""你是严格遵循ReAct框架的智能体，必须按「思考→行动→观察→再思考」的流程解决问题，
且**每轮仅能思考并调用1个工具**，禁止单次调用多个工具。
并告知我你的思考过程，工具的调用原因，按思考、行动、观察三个结构告知我"""
```
提示词的关键约束：
- **流程约束**：必须按"思考→行动→观察→再思考"的循环执行。
- **单工具约束**：每轮只能调用1个工具，这是ReAct的核心规则——强制模型在每次行动前进行独立思考。
- **输出格式约束**：要求按思考、行动、观察三个结构输出，使推理过程透明可追踪。

**3. BMI计算的ReAct执行流程**

当用户要求"计算我的BMI"时，Agent的执行流程如下：

**第一轮：**
- **思考**：计算BMI需要体重和身高，我先获取体重。
- **行动**：调用`get_weight()`。
- **观察**：体重为90千克。

**第二轮：**
- **思考**：已获取体重，还需要身高来计算BMI。
- **行动**：调用`get_height()`。
- **观察**：身高为172厘米。

**第三轮：**
- **思考**：已获得体重90kg和身高172cm（1.72m），计算BMI = 90 / 1.72² ≈ 30.4。
- **行动**：无需调用工具，直接输出结果。
- **回答**：您的BMI约为30.4，属于肥胖范围。

**4. 流式输出监控**

```python
for chunk in agent.stream(...):
    latest_message = chunk['messages'][-1]
    if latest_message.content:
        print(type(latest_message).__name__, latest_message.content)
    try:
        if latest_message.tool_calls:
            print(f"工具调用： { [tc['name'] for tc in latest_message.tool_calls] }")
    except AttributeError as e:
        pass
```
通过流式输出，可以清晰看到Agent的每一步推理和工具调用过程，验证其是否严格遵循了ReAct框架的单工具调用规则。

## 关键要点

- ReAct框架通过Thought-Action-Observation循环，让Agent在推理和行动之间交替，逐步解决复杂问题。
- 系统提示词是实现ReAct行为约束的关键，"每轮仅调用1个工具"的规则强制模型在每次行动前进行独立思考。
- 多步骤推理是ReAct的核心优势——BMI计算需要先获取体重、再获取身高、最后计算结果，每一步都有明确的推理依据。
- 流式输出让ReAct的推理过程完全透明，便于调试和验证Agent是否遵循了预期的行为模式。
- ReAct框架的"单工具每轮"约束虽然增加了步骤数，但使推理过程更可解释、更可控，适合需要透明决策的场景。

## 小结

本文通过BMI计算案例展示了ReAct框架的实践应用。通过精心设计的系统提示词，约束Agent严格遵循"思考→行动→观察→再思考"的循环，每轮仅调用一个工具。这种推理与行动交织的模式，使Agent的决策过程透明可解释——每一步工具调用都有明确的思考依据，每次观察都为下一步推理提供信息。ReAct框架特别适合需要多步骤推理且要求决策过程可追溯的应用场景。

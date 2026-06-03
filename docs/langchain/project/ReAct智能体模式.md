---
title: ReAct智能体模式
date: 2025-06-15 11:15:53
permalink: /langchain/project/ReAct智能体模式
categories:
  - AI
tags:
  - Agent
author: zhuib
---

# ReAct智能体模式：让AI学会"思考-行动-观察"

## 什么是ReAct模式？

ReAct（Reasoning + Acting）是一种让大语言模型具备自主推理与工具调用能力的智能体设计模式。它的核心思想是让模型遵循**「思考 → 行动 → 观察 → 再思考」**的循环流程来回答用户问题，而不是一次性给出答案。

在传统的大模型对话中，模型只能基于自身知识回答问题，遇到知识盲区就会"胡编乱造"。而ReAct模式赋予了模型**自主调用外部工具**的能力，让它能够主动获取信息，从而给出更准确、更专业的回答。

## ReAct的工作流程

```
用户提问
  ↓
思考（Reasoning）：分析用户需求，判断是否需要调用工具
  ↓
行动（Acting）：调用合适的工具获取信息
  ↓
观察（Observation）：分析工具返回的结果
  ↓
再思考：信息是否足够？不够则继续调用工具，足够则生成最终回答
```

## 项目中的实现

在本项目中，我们使用LangGraph的`create_agent`函数创建了一个ReAct智能体：

```python
from langchain.agents import create_agent
from model.factory import chat_model
from utils.prompt_loader import load_system_prompts
from agent.tools.agent_tools import (rag_summarize, get_weather, get_user_location, get_user_id,
                                     get_current_month, fetch_external_data, fill_context_for_report)
from agent.tools.middleware import monitor_tool, log_before_model, report_prompt_switch


class ReactAgent:
    def __init__(self):
        self.agent = create_agent(
            model=chat_model,
            system_prompt=load_system_prompts(),
            tools=[rag_summarize, get_weather, get_user_location, get_user_id,
                   get_current_month, fetch_external_data, fill_context_for_report],
            middleware=[monitor_tool, log_before_model, report_prompt_switch],
        )
```

### 关键组成部分

1. **模型（model）**：使用Ollama部署的本地大模型（如llama3.1:8b），负责推理和决策
2. **系统提示词（system_prompt）**：定义了智能体的行为准则，包括思考规则、工具使用规范等
3. **工具列表（tools）**：智能体可以调用的外部能力，如RAG检索、天气查询、数据获取等
4. **中间件（middleware）**：在工具调用和模型推理前后插入的自定义逻辑

## 流式输出

智能体支持流式输出，用户可以实时看到模型的思考过程和回答：

```python
def execute_stream(self, query: str):
    input_dict = {
        "messages": [
            {"role": "user", "content": query},
        ]
    }

    # context参数用于运行时上下文信息，支持提示词动态切换
    for chunk in self.agent.stream(input_dict, stream_mode="values", context={"report": False}):
        latest_message = chunk["messages"][-1]
        if latest_message.content:
            yield latest_message.content.strip() + "\n"
```

注意`context={"report": False}`参数，这是运行时的上下文标记，用于支持中间件中的动态提示词切换功能。

## 系统提示词中的ReAct约束

项目中的系统提示词明确规定了ReAct的思考准则：

1. **先判断核心需求**：分析当前信息是否足够直接回答，若不足则思考需要调用什么工具
2. **工具调用后再判断**：工具返回信息后，再次判断是否完整回答了用户问题
   - 信息足够 → 整合生成最终回答
   - 信息不足 → 自主判断再次调用工具
   - 5次调用仍不足 → 回复"我不知道"
3. **工具调用入参必须精准**：与工具定义完全一致，字符串参数为纯文本
4. **报告生成强约束**：识别到报告需求时，必须遵循固定执行流程

## ReAct模式的优势

| 特性 | 传统对话 | ReAct模式 |
|------|---------|-----------|
| 知识来源 | 仅模型自身知识 | 模型知识 + 外部工具 |
| 准确性 | 容易产生幻觉 | 基于工具返回的事实信息 |
| 可扩展性 | 无法扩展 | 通过添加工具扩展能力 |
| 透明度 | 黑盒 | 思考过程可见 |
| 专业性 | 通用 | 可接入专业数据源 |

## 总结

ReAct模式是构建智能Agent的核心范式。它通过"思考-行动-观察"的循环，让大模型从被动的问答工具转变为能够主动获取信息、自主决策的智能体。结合工具调用和中间件机制，ReAct智能体可以应对复杂的业务场景，如本项目中同时支持智能客服问答和个性化报告生成。

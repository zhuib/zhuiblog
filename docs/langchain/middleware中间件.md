---
title: middleware中间件
date: 2025-06-15 11:15:53
permalink: /langchain/middleware中间件
categories:
  - AI
tags:
  - 中间件
author: zhuib
---

# middleware中间件——Agent生命周期的拦截与监控

在Agent智能体的开发和运维中，了解Agent的执行过程至关重要——何时启动、何时调用模型、调用了哪个工具、何时结束。这些信息不仅用于调试，更是生产环境中监控和审计的基础。LangChain的middleware（中间件）机制提供了六个生命周期钩子，允许开发者在Agent执行的关键节点插入自定义逻辑，实现日志记录、性能监控、权限控制等横切关注点。本文将详细介绍六个中间件钩子的使用方法和应用场景。

## 核心概念

- **六个中间件钩子**：`@before_agent`（Agent启动前）、`@after_agent`（Agent结束后）、`@before_model`（模型调用前）、`@after_model`（模型调用后）、`@wrap_model_call`（模型调用包装）、`@wrap_tool_call`（工具调用包装），覆盖Agent生命周期的所有关键节点。
- **AgentState**：Agent的状态对象，包含`messages`等字段，中间件通过读取和修改状态实现拦截逻辑。
- **Runtime**：Agent的运行时对象，提供执行上下文信息，与AgentState一起作为中间件参数。
- **handler(request)链式模式**：`@wrap_model_call`和`@wrap_tool_call`采用包装器模式，接收`request`和`handler`，调用`handler(request)`将控制权传递给下一个中间件或实际执行逻辑。
- **middleware参数**：`create_agent()`的`middleware`参数接收中间件函数列表，按顺序注册，Agent执行时自动在对应节点调用。

## 代码示例

```python
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_agent, after_agent, before_model, after_model, wrap_model_call, wrap_tool_call
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.tools import tool
from langgraph.runtime import Runtime

@tool(description="查询天气，传入城市名称字符串，返回字符串天气信息")
def get_weather(city: str) -> str:
    return f"{city}天气：晴天"

@before_agent
def log_before_agent(state: AgentState, runtime: Runtime) -> None:
    print(f"[before agent]agent启动，并附带{len(state['messages'])}消息")

@after_agent
def log_after_agent(state: AgentState, runtime: Runtime) -> None:
    print(f"[after agent]agent结束，并附带{len(state['messages'])}消息")

@before_model
def log_before_model(state: AgentState, runtime: Runtime) -> None:
    print(f"[before_model]模型即将调用，并附带{len(state['messages'])}消息")

@after_model
def log_after_model(state: AgentState, runtime: Runtime) -> None:
    print(f"[after_model]模型调用结束，并附带{len(state['messages'])}消息")

@wrap_model_call
def model_call_hook(request, handler):
    print("模型调用啦")
    return handler(request)

@wrap_tool_call
def monitor_tool(request, handler):
    print(f"工具执行：{request.tool_call['name']}")
    print(f"工具执行传入参数：{request.tool_call['args']}")
    return handler(request)

agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_weather],
    middleware=[log_before_agent, log_after_agent, log_before_model, log_after_model, model_call_hook, monitor_tool]
)

res = agent.invoke({"messages": [{"role": "user", "content": "深圳今天的天气如何呀，如何穿衣"}]})
print("**********\n", res)
```

## 代码解析

**1. 生命周期钩子：before/after类型**

```python
@before_agent
def log_before_agent(state: AgentState, runtime: Runtime) -> None:
    print(f"[before agent]agent启动，并附带{len(state['messages'])}消息")

@after_agent
def log_after_agent(state: AgentState, runtime: Runtime) -> None:
    print(f"[after agent]agent结束，并附带{len(state['messages'])}消息")
```
`@before_agent`和`@after_agent`分别在Agent启动前和结束后触发，接收`AgentState`和`Runtime`两个参数。通过`state['messages']`可以获取当前消息数量，追踪Agent执行过程中消息的增长情况。

`@before_model`和`@after_model`类似，但在每次模型调用前后触发。一个Agent执行过程中可能多次调用模型（如ReAct框架中每轮推理都会调用模型），因此这两个钩子可能被触发多次。

**2. 包装器钩子：wrap类型**

```python
@wrap_model_call
def model_call_hook(request, handler):
    print("模型调用啦")
    return handler(request)
```
`@wrap_model_call`采用装饰器/包装器模式，接收`request`（模型调用请求）和`handler`（下一个处理器）。调用`handler(request)`将请求传递给实际的模型执行逻辑，返回值为模型的输出。这种模式允许在调用前后添加逻辑，甚至修改请求或响应。

```python
@wrap_tool_call
def monitor_tool(request, handler):
    print(f"工具执行：{request.tool_call['name']}")
    print(f"工具执行传入参数：{request.tool_call['args']}")
    return handler(request)
```
`@wrap_tool_call`是最实用的监控钩子。`request.tool_call`包含工具调用的详细信息：
- `name`：被调用的工具名称。
- `args`：传入工具的参数。

这使得工具调用的监控和日志记录变得非常简单。

**3. 注册中间件**

```python
agent = create_agent(
    model=ChatTongyi(model="qwen3-max"),
    tools=[get_weather],
    middleware=[log_before_agent, log_after_agent, log_before_model, log_after_model, model_call_hook, monitor_tool]
)
```
通过`middleware`参数将所有中间件函数注册到Agent。执行时，Agent会在对应的生命周期节点自动调用这些中间件。

**4. 执行流程示例**

当用户问"深圳今天的天气如何呀，如何穿衣"时，中间件的触发顺序为：
1. `@before_agent`：Agent启动，1条消息。
2. `@before_model`：模型即将调用，1条消息。
3. `@wrap_model_call`：模型调用啦。
4. `@after_model`：模型调用结束，2条消息（增加了AI的工具调用决策）。
5. `@wrap_tool_call`：工具执行：get_weather，参数：{"city": "深圳"}。
6. `@before_model`：模型即将调用，3条消息（增加了工具结果）。
7. `@wrap_model_call`：模型调用啦。
8. `@after_model`：模型调用结束，4条消息（增加了AI的最终回答）。
9. `@after_agent`：Agent结束，4条消息。

## 关键要点

- 六个中间件钩子覆盖Agent生命周期的所有关键节点：启动/结束、模型调用前后、工具调用，实现全方位的执行监控。
- `@before_*`和`@after_*`类型钩子接收`AgentState`和`Runtime`参数，适合日志记录和状态监控。
- `@wrap_*`类型钩子采用包装器模式，接收`request`和`handler`，可在调用前后添加逻辑，甚至修改请求或响应。
- `@wrap_tool_call`是最实用的监控钩子，`request.tool_call`包含工具名称和参数，便于审计和日志记录。
- 中间件通过`create_agent()`的`middleware`参数注册，按列表顺序执行，支持灵活组合。

## 小结

本文详细介绍了Agent中间件的六个生命周期钩子及其使用方法。`@before_agent`/`@after_agent`监控Agent的启停，`@before_model`/`@after_model`追踪模型调用，`@wrap_model_call`/`@wrap_tool_call`以包装器模式拦截具体的调用过程。中间件机制为Agent的日志记录、性能监控、权限控制等横切关注点提供了优雅的解决方案，是Agent从开发调试走向生产运维的关键基础设施。

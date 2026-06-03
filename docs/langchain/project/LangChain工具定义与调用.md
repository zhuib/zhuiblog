---
title: LangChain工具定义与调用
date: 2025-06-15 11:15:53
permalink: /langchain/project/LangChain工具定义与调用
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain工具定义与调用：为智能体赋予外部能力

## 为什么需要工具？

大语言模型虽然拥有丰富的知识，但存在明显的局限性：

- **知识有截止日期**：无法获取实时信息（如天气、用户数据）
- **无法访问私有数据**：企业内部知识库、用户个人记录等
- **无法执行操作**：查询数据库、调用API等

工具（Tools）机制让模型从"只会说话"进化为"能做事"的智能体。

## LangChain工具定义方式

LangChain提供了`@tool`装饰器，可以将普通Python函数快速转化为智能体可调用的工具：

```python
from langchain_core.tools import tool

@tool(description="获取指定城市的天气，以消息字符串的形式返回")
def get_weather(city: str) -> str:
    return f"城市{city}天气为晴天，气温26摄氏度，空气湿度50%，南风1级，AQI21，最近6小时降雨概率极低"
```

### 关键要素

1. **`@tool`装饰器**：将函数注册为LangChain工具
2. **`description`参数**：告诉模型这个工具的功能，模型根据描述决定是否调用
3. **函数签名**：参数名和类型注解是模型生成调用参数的依据
4. **返回值**：工具执行的结果，会作为观察信息反馈给模型

## 项目中的7个工具

本项目为扫地机器人智能客服定义了7个工具，覆盖了不同的能力需求：

### 1. RAG知识检索工具

```python
@tool(description="从向量存储中检索参考资料")
def rag_summarize(query: str) -> str:
    return rag.rag_summarize(query)
```

从向量数据库中检索与用户问题相关的专业资料，是智能客服回答专业问题的核心能力。

### 2. 天气查询工具

```python
@tool(description="获取指定城市的天气，以消息字符串的形式返回")
def get_weather(city: str) -> str:
    return f"城市{city}天气为晴天，气温26摄氏度..."
```

获取指定城市的天气信息，用于判断环境是否适合使用扫地机器人。

### 3. 用户位置获取工具

```python
@tool(description="获取用户所在城市的名称，以纯字符串形式返回")
def get_user_location() -> str:
    return random.choice(["深圳", "合肥", "杭州"])
```

无入参工具，获取用户所在城市，通常作为`get_weather`的前置调用。

### 4. 用户ID获取工具

```python
@tool(description="获取用户的ID，以纯字符串形式返回")
def get_user_id() -> str:
    return random.choice(user_ids)
```

获取当前用户ID，是报告生成流程的必要前置步骤。

### 5. 当前月份获取工具

```python
@tool(description="获取当前月份，以纯字符串形式返回")
def get_current_month() -> str:
    return random.choice(month_arr)
```

获取当前月份，与用户ID配合用于查询特定月份的使用记录。

### 6. 外部数据获取工具

```python
@tool(description="从外部系统中获取指定用户在指定月份的使用记录，以纯字符串形式返回，如果未检索到返回空字符串")
def fetch_external_data(user_id: str, month: str) -> str:
    generate_external_data()
    try:
        return external_data[user_id][month]
    except KeyError:
        logger.warning(f"[fetch_external_data]未能检索到用户：{user_id}在{month}的使用记录数据")
        return ""
```

这是最复杂的工具，需要两个参数（user_id和month），从CSV文件中加载外部数据并检索。

### 7. 报告上下文注入工具

```python
@tool(description="无入参，无返回值，调用后触发中间件自动为报告生成的场景动态注入上下文信息")
def fill_context_for_report():
    return "fill_context_for_report已调用"
```

这个工具本身不执行业务逻辑，它的作用是**触发中间件**，将运行时上下文中的`report`标记设为`True`，从而激活动态提示词切换。

## 工具分类

| 类型 | 工具 | 特点 |
|------|------|------|
| 信息检索 | rag_summarize | 从向量库检索知识 |
| 实时查询 | get_weather | 获取实时外部信息 |
| 上下文获取 | get_user_location, get_user_id, get_current_month | 无入参，获取运行时上下文 |
| 数据获取 | fetch_external_data | 多参数，从外部系统获取结构化数据 |
| 流程控制 | fill_context_for_report | 触发中间件逻辑，改变执行流程 |

## 工具设计的最佳实践

1. **描述要精确**：`description`是模型选择工具的唯一依据，必须清晰说明工具的功能、入参含义和返回值类型
2. **入参类型注解**：使用Python类型注解（如`str`），帮助模型生成正确格式的参数
3. **返回纯字符串**：工具返回值最终会作为文本反馈给模型，纯字符串最易被理解
4. **异常处理**：工具内部应做好异常处理，返回有意义的错误信息而非抛出异常
5. **单一职责**：每个工具只做一件事，复杂流程由智能体通过多步工具调用完成

## 工具与ReAct的协作

工具不是孤立存在的，它们通过ReAct的"思考-行动-观察"循环协同工作。例如用户问"今天适合用扫地机器人吗"：

```
思考：需要知道用户所在城市的天气 → 调用get_user_location
观察：用户在"深圳"
思考：需要获取深圳的天气 → 调用get_weather("深圳")
观察：深圳晴天，湿度50%
思考：信息足够，生成回答
回答：深圳今天天气晴朗，湿度适中，非常适合使用扫地机器人...
```

这种多步工具调用正是ReAct模式的精髓所在。

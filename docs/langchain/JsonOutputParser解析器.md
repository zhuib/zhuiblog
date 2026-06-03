---
title: JsonOutputParser解析器
date: 2025-06-15 11:15:53
permalink: /langchain/JsonOutputParser解析器
categories:
  - AI
tags:
  - 解析器
author: zhuib
---

# JsonOutputParser解析器——将模型输出解析为字典

在实际开发中，我们经常需要大语言模型返回结构化的JSON数据，以便后续程序处理。`JsonOutputParser`正是为此而生，它能将模型输出的JSON字符串自动解析为Python字典，并支持字典的键自动注入到下一个提示词模板中。本文将深入讲解`JsonOutputParser`的使用方法和数据流转机制。

## 核心概念

`JsonOutputParser`是LangChain提供的输出解析器之一，专门用于将模型输出的JSON格式字符串解析为Python的`dict`对象。

与`StrOutputParser`的不同之处在于：
- `StrOutputParser`输出`str`类型，后续组件收到的是纯文本
- `JsonOutputParser`输出`dict`类型，后续组件收到的是结构化数据

`JsonOutputParser`的强大之处在于与`PromptTemplate`的联动：当解析后的`dict`作为输入传递给下一个`PromptTemplate`时，字典的键会自动匹配模板中的变量占位符，实现数据的自动注入。

数据流转过程：`AIMessage` → `dict`（JsonOutputParser解析） → `PromptValue`（字典键注入模板） → `AIMessage` → `str`

## 代码示例

```python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.prompts import PromptTemplate

str_parser = StrOutputParser()
json_parser = JsonOutputParser()

model = ChatTongyi(model="qwen3-max")

first_prompt = PromptTemplate.from_template(
    "我邻居姓：{lastname}，刚生了{gender}，请帮忙起名字，"
    "并封装为JSON格式返回给我。要求key是name，value就是你起的名字，请严格遵守格式要求。"
)

second_prompt = PromptTemplate.from_template(
    "姓名：{name}，请帮我解析含义。"
)

chain = first_prompt | model | json_parser | second_prompt | model | str_parser

for chunk in chain.stream({"lastname": "张", "gender": "女儿"}):
    print(chunk, end="", flush=True)
```

## 代码解析

1. **初始化解析器**：分别创建`StrOutputParser`和`JsonOutputParser`两个解析器实例。

2. **设计提示词**：
   - `first_prompt`：要求模型返回JSON格式，指定key为`name`。这里的关键是明确告诉模型返回格式，确保JSON解析成功。
   - `second_prompt`：使用`{name}`变量占位符，它将自动接收`json_parser`解析出的字典中`name`键对应的值。

3. **链式组合**：`first_prompt | model | json_parser | second_prompt | model | str_parser`
   - `first_prompt`：填充`lastname`和`gender`，生成提示词
   - `model`：调用大模型，返回`AIMessage`（内容为JSON字符串，如`{"name": "张婉清"}`）
   - `json_parser`：将JSON字符串解析为Python字典`{"name": "张婉清"}`
   - `second_prompt`：字典的`name`键自动注入模板的`{name}`占位符，生成"姓名：张婉清，请帮我解析含义。"
   - `model`：再次调用大模型解析名字含义
   - `str_parser`：将最终结果转为纯字符串

4. **流式输出**：使用`chain.stream()`逐块输出结果，`end=""`和`flush=True`确保输出连贯无换行。

## 关键要点

- `JsonOutputParser`将模型输出的JSON字符串解析为Python的`dict`对象
- 解析后的`dict`的键会自动注入到下一个`PromptTemplate`的对应变量中
- 提示词中需要明确要求模型返回JSON格式，并指定具体的key名称
- 完整数据流：`AIMessage` → `dict` → `PromptValue` → `AIMessage` → `str`
- `JsonOutputParser`与`StrOutputParser`可以组合使用，各司其职

## 小结

`JsonOutputParser`是构建多步骤链式调用的利器。它不仅将非结构化的文本输出转化为结构化的字典数据，更重要的是实现了字典键到模板变量的自动映射，让数据在不同组件之间无缝流转。这种"JSON解析→自动注入"的机制，使得我们可以轻松构建"信息提取→信息处理"的多阶段AI应用，是RAG和智能体开发中的重要工具。

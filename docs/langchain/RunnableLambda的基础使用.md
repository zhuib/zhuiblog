---
title: RunnableLambda的基础使用
date: 2025-06-15 11:15:53
permalink: /langchain/RunnableLambda的基础使用
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# RunnableLambda的基础使用——在链中使用自定义函数

LangChain的链式调用虽然强大，但有时我们需要在链中插入自定义的数据处理逻辑，比如格式转换、数据清洗等。`RunnableLambda`正是为此而设计，它可以将任意Python函数包装为`Runnable`对象，使其能够融入链式调用流程。本文将介绍`RunnableLambda`的基础使用方法。

## 核心概念

`RunnableLambda`是LangChain提供的一个工具类，它可以将普通的Python函数（包括lambda表达式）包装为`Runnable`对象。这样，自定义函数就能像Prompt、Model、Parser一样，通过`|`操作符参与链式组合。

在实际使用中，Lambda表达式会被自动包装为`RunnableLambda`，无需显式导入和创建。这意味着你可以直接在链中使用lambda表达式，LangChain会自动处理类型转换。

`RunnableLambda`的典型应用场景：

- **数据格式转换**：在链中转换数据格式，如将`AIMessage`转为字典
- **自定义处理逻辑**：插入业务逻辑，如数据过滤、格式化等
- **桥接不兼容组件**：当两个组件的数据格式不匹配时，用自定义函数做中间转换

## 代码示例

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_models.tongyi import ChatTongyi

model = ChatTongyi(model="qwen3-max")
str_parser = StrOutputParser()

first_prompt = PromptTemplate.from_template(
    "我邻居姓：{lastname}，刚生了{gender}，请帮忙起名字，仅生成一个名字，并告知我名字，不要额外信息。"
)

second_prompt = PromptTemplate.from_template(
    "姓名{name}，请帮我解析含义。"
)

chain = first_prompt | model | (lambda ai_msg: {"name": ai_msg.content}) | second_prompt | model | str_parser

for chunk in chain.stream({"lastname": "曹", "gender": "女孩"}):
    print(chunk, end="", flush=True)
```

## 代码解析

1. **组件初始化**：创建模型、解析器和两个提示词模板。注意`second_prompt`使用`{name}`变量，但输入数据中并没有`name`字段。

2. **Lambda表达式的作用**：`lambda ai_msg: {"name": ai_msg.content}`是这个链的关键。它接收模型输出的`AIMessage`对象，提取`.content`属性，并将其包装为`{"name": ...}`字典格式。

3. **数据流转**：
   - `first_prompt`：填充`lastname`和`gender`，生成提示词
   - `model`：调用大模型，返回`AIMessage`（如内容为"曹雨薇"）
   - `lambda`：将`AIMessage`转为`{"name": "曹雨薇"}`
   - `second_prompt`：字典的`name`键自动注入模板的`{name}`占位符
   - `model`：调用大模型解析名字含义
   - `str_parser`：转为纯字符串输出

4. **自动包装**：lambda表达式在链中会被自动包装为`RunnableLambda`，无需手动导入`RunnableLambda`类。

5. **流式输出**：使用`stream()`方法逐块输出，实现打字机效果。

## 关键要点

- `RunnableLambda`可以将Python函数包装为`Runnable`对象，使其能参与链式调用
- Lambda表达式在链中会被自动包装为`RunnableLambda`，无需显式创建
- 常用于链中的数据格式转换，如将`AIMessage`转为字典以匹配下一个模板的变量
- 自定义函数的返回值会作为下一个组件的输入
- `RunnableLambda`保持了链的`invoke()`/`stream()`等调用能力

## 小结

`RunnableLambda`为LangChain的链式调用提供了极大的灵活性。当标准组件无法满足数据处理需求时，我们可以通过自定义函数来桥接不同组件之间的数据格式差异。本文示例中，lambda表达式将`AIMessage`转换为字典，实现了与`JsonOutputParser`类似的效果，但更加灵活可控。掌握`RunnableLambda`的使用，能够让我们在构建复杂链时游刃有余，应对各种数据转换场景。

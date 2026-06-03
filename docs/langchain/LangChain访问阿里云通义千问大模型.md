---
title: LangChain访问阿里云通义千问大模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain访问阿里云通义千问大模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain访问阿里云通义千问大模型

LangChain 提供了统一的大模型调用接口，让开发者可以方便地接入各种大语言模型。本文介绍如何通过 LangChain 访问阿里云通义千问大模型，这是国内最常用的大模型服务之一。

## 核心概念

**通义千问**是阿里云推出的大语言模型服务，提供了多种模型规格（如 qwen-max、qwen-plus 等）。LangChain 通过 `langchain_community` 包中的 `Tongyi` 类封装了对通义千问的调用。

关键要素：

- **Tongyi 类**：来自 `langchain_community.llms.tongyi` 模块，是 LangChain 对通义千问大模型的封装
- **model 参数**：指定使用的模型名称，如 `qwen-max`（最强能力）、`qwen-plus`（均衡性价比）等
- **invoke() 方法**：LangChain 统一的模型调用方法，传入 prompt 字符串即可获得模型响应
- **环境变量**：需要设置 `DASHSCOPE_API_KEY` 环境变量来提供 API 密钥

使用前需要安装依赖：`pip install langchain-community dashscope`

## 代码示例

```python
from langchain_community.llms.tongyi import Tongyi

model = Tongyi(model="qwen-max")
res = model.invoke(input="你是谁呀能做什么？")
print(res)
```

## 代码解析

1. **导入模块**：从 `langchain_community.llms.tongyi` 导入 `Tongyi` 类，这是 LangChain 社区包中对通义千问的封装。

2. **创建模型实例**：`Tongyi(model="qwen-max")` 创建一个通义千问模型实例，`model` 参数指定使用 `qwen-max` 模型。该模型会自动从环境变量 `DASHSCOPE_API_KEY` 中读取 API 密钥。

3. **调用模型**：`model.invoke(input="你是谁呀能做什么？")` 使用 `invoke` 方法向模型发送提问，`input` 参数接收字符串类型的提示词，模型返回生成的文本响应。

4. **输出结果**：打印模型返回的响应内容。

## 关键要点

- `Tongyi` 类位于 `langchain_community.llms.tongyi` 模块中，属于 LangChain 的社区集成包
- 通过 `model` 参数选择不同的模型规格，如 `qwen-max`、`qwen-plus` 等
- `invoke()` 是 LangChain 统一的模型调用接口，所有 LLM 都支持此方法
- 使用前需确保已设置 `DASHSCOPE_API_KEY` 环境变量
- Tongyi 属于 LLM 类型（纯文本输入输出），区别于 Chat Model（消息类型输入输出）

## 小结

通过 LangChain 的 Tongyi 类，我们可以用极简的代码访问阿里云通义千问大模型。LangChain 的统一接口设计使得切换不同模型只需更改类名和参数，无需修改业务逻辑代码，这为后续的模型切换和对比测试提供了极大的便利。

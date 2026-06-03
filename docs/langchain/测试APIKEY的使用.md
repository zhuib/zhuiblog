---
title: 测试APIKEY的使用
date: 2025-06-15 11:15:53
permalink: /langchain/测试APIKEY的使用
categories:
  - AI
tags:
  - 测试
author: zhuib
---

# 测试APIKEY的使用——OpenAI库连接本地大模型

在使用大语言模型进行开发时，第一步往往是验证API连接是否正常。本文将介绍如何使用OpenAI库连接本地运行的Ollama服务，实现快速测试本地大模型的连通性。

## 核心概念

### 本地大模型与Ollama

Ollama是一个轻量级的本地大模型运行框架，它兼容OpenAI的API接口格式，使得我们可以直接使用OpenAI库来调用本地模型。这意味着你无需依赖云端API，即可在本地完成大模型的调用与测试。

### base_url参数

OpenAI库的`base_url`参数用于指定API的服务地址。默认情况下，它指向OpenAI的官方API地址。当我们需要连接本地Ollama服务时，只需将`base_url`设置为Ollama的本地地址即可：

- 本地Ollama地址：`http://localhost:11434/v1`
- 其中`11434`是Ollama的默认端口
- `/v1`是兼容OpenAI API格式的路径前缀

### 本地模型无需API Key

与云端API不同，本地运行的Ollama服务不需要API Key进行身份验证。因此，在创建客户端时，无需传入`api_key`参数，OpenAI库会使用默认值。

### 流式输出

流式输出（Streaming）是指模型生成文本时，逐字或逐词实时返回结果，而非等待全部内容生成完毕后一次性返回。通过设置`stream=True`，可以实现类似打字机效果的实时响应体验。

## 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
)
completion = client.chat.completions.create(
    model="qwen3:4b",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "你是谁，能做什么？"},
    ],
    stream=True
)
for chunk in completion:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

## 代码解析

### 1. 导入库与创建客户端

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
)
```

- 导入`OpenAI`类，这是与兼容OpenAI API格式的服务交互的核心类。
- 创建客户端实例，将`base_url`指向本地Ollama服务的地址。
- 无需传入`api_key`，因为本地Ollama服务不需要身份验证。

### 2. 构造请求消息

```python
messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "你是谁，能做什么？"},
],
```

- `system`角色：设定模型的行为和角色定位，这里指定为一个有帮助的助手。
- `user`角色：用户的实际提问内容。

### 3. 调用模型并启用流式输出

```python
completion = client.chat.completions.create(
    model="qwen3:4b",
    messages=...,
    stream=True
)
```

- `model`参数指定要使用的本地模型名称，这里是`qwen3:4b`（需确保Ollama中已拉取该模型）。
- `stream=True`启用流式输出，模型会逐步返回生成的内容。

### 4. 处理流式响应

```python
for chunk in completion:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

- 流式响应返回的是一个迭代器，每个`chunk`是模型生成的一个片段。
- `chunk.choices[0].delta.content`获取当前片段的文本内容。注意流式模式下使用的是`delta`而非`message`。
- `end=""`：不换行，使输出连续显示。
- `flush=True`：立即刷新输出缓冲区，确保内容实时显示在终端。

## 关键要点

- **base_url指向本地**：连接本地Ollama时，`base_url`设置为`http://localhost:11434/v1`，这是Ollama兼容OpenAI API的默认地址。
- **无需API Key**：本地模型不需要身份验证，创建客户端时省略`api_key`参数即可。
- **stream=True启用流式**：设置`stream=True`后，响应变为迭代器，可以逐片段获取生成内容。
- **delta.content获取流式片段**：流式模式下，通过`chunk.choices[0].delta.content`获取每个片段的文本，区别于非流式模式的`message.content`。
- **flush=True实现实时显示**：配合`print`的`flush=True`参数，确保每个片段立即显示，实现打字机效果。

## 小结

本文介绍了如何使用OpenAI库连接本地Ollama服务来测试API连通性。核心在于将`base_url`指向本地Ollama地址，并利用流式输出实现实时响应。这种方式非常适合在本地开发环境中快速验证模型是否正常运行，是开发大模型应用的第一步。

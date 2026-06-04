---
title: LangChain学习笔记
date: 2025-06-15 11:15:53
permalink: /langchain/
categories:
  - AI
tags:
  - LangChain
author: zhuib
---

## 第一章：OpenAI库基础

### 1.1 OpenAI库的基础使用

掌握OpenAI库的基础使用是开发大模型应用的核心技能。本文将完整介绍从创建客户端、构造消息、调用模型到处理响应的全流程，帮助你快速上手大模型API调用。

#### 核心概念

**客户端创建**

OpenAI库的一切操作都始于创建一个`OpenAI`客户端实例。客户端负责管理与API服务的连接、认证和请求发送。通过`base_url`参数，我们可以将客户端指向任何兼容OpenAI API格式的服务，包括阿里云DashScope等国内平台。

**DashScope兼容API**

阿里云DashScope提供了兼容OpenAI API格式的接口，地址为：

```
https://dashscope.aliyuncs.com/compatible-mode/v1
```

通过这个地址，我们可以使用OpenAI库直接调用通义千问等模型，无需学习新的SDK。

**三种消息角色**

在OpenAI的Chat Completions API中，消息通过`messages`列表传递，每条消息都有一个`role`字段：

- **system**（系统角色）：设定模型的行为、性格和回答风格。类似于给AI设定一个"人设"。
- **assistant**（助手角色）：代表模型之前的回复，用于多轮对话中传递历史上下文。
- **user**（用户角色）：用户的提问或输入内容。

**非流式响应**

非流式模式下（默认），模型会等待全部内容生成完毕后一次性返回完整的响应。响应对象中包含`choices`列表，通过`response.choices[0].message.content`即可获取模型生成的完整文本。

#### 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "你是一个Python编程专家，并且不说废话简单回答"},
        {"role": "assistant", "content": "好的，我是编程专家，并且话不多，你要问什么？"},
        {"role": "user", "content": "输出1-10的数字，使用python代码"}
    ]
)

print(response.choices[0].message.content)
```

#### 代码解析

**1. 创建客户端**

```python
client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
```

- 指定`base_url`为DashScope的兼容模式地址，使客户端连接到阿里云的模型服务。
- 未传入`api_key`参数时，OpenAI库会自动从环境变量`OPENAI_API_KEY`中读取。使用DashScope时，需确保该环境变量已设置为你的DashScope API Key。

**2. 构造消息列表**

```python
messages=[
    {"role": "system", "content": "你是一个Python编程专家，并且不说废话简单回答"},
    {"role": "assistant", "content": "好的，我是编程专家，并且话不多，你要问什么？"},
    {"role": "user", "content": "输出1-10的数字，使用python代码"}
]
```

- **system消息**：设定模型为Python编程专家，并要求回答简洁。这直接影响模型的输出风格和内容倾向。
- **assistant消息**：模拟模型之前的回复，建立对话上下文。这里助手已经确认了自己的角色定位。
- **user消息**：用户的实际请求，要求用Python代码输出1-10的数字。

**3. 调用模型**

```python
response = client.chat.completions.create(
    model="qwen3-max",
    messages=...
)
```

- `model`参数指定使用`qwen3-max`模型，这是通义千问的高性能版本。
- 未设置`stream`参数，默认为非流式模式，模型会一次性返回完整响应。

**4. 处理响应**

```python
print(response.choices[0].message.content)
```

- `response.choices`是一个列表，包含模型生成的候选回复（默认只有一个）。
- `choices[0]`取第一个候选回复。
- `message.content`获取回复的文本内容。
- 由于system消息要求简洁回答，模型的输出会直接给出Python代码，不会附带冗长的解释。

#### 关键要点

- **base_url指定服务地址**：通过`base_url`参数，OpenAI库可以连接任何兼容OpenAI API格式的服务，如DashScope的`https://dashscope.aliyuncs.com/compatible-mode/v1`。
- **三种消息角色各司其职**：`system`设定行为，`user`传递提问，`assistant`承载历史回复，三者配合构成完整的对话上下文。
- **非流式模式为默认**：不设置`stream`参数时，模型等待全部内容生成后一次性返回。
- **通过choices[0].message.content获取结果**：非流式模式下，响应的文本内容位于`response.choices[0].message.content`。
- **system消息影响输出风格**：合理设置system消息可以有效控制模型的回答风格和内容倾向。

#### 小结

本文介绍了OpenAI库的基础使用流程：创建客户端、构造消息、调用模型、处理响应。核心在于理解三种消息角色的作用以及非流式响应的数据结构。掌握这些基础知识后，你就可以开始构建各种大模型应用了。

### 1.2 OpenAI库附带历史消息调用模型

大语言模型本身是无状态的——每次调用都是独立的，模型不会记住之前的对话。要实现多轮对话的"记忆"效果，必须在每次请求时将完整的对话历史传递给模型。本文将介绍如何通过附带历史消息来实现多轮对话。

#### 核心概念

**LLM的无状态特性**

大语言模型的每次API调用都是完全独立的，模型不会在请求之间保存任何状态或记忆。这意味着：

- 每次调用时，模型对之前的对话一无所知。
- 如果不传递历史消息，模型无法理解上下文中的指代关系。
- "记忆"效果完全依赖于开发者在每次请求中手动传递对话历史。

**历史消息的传递方式**

实现多轮对话的关键是将所有之前的对话内容放入`messages`列表中，按照时间顺序排列：

```
system → user → assistant → user → assistant → user（当前问题）
```

每一轮的user提问和assistant回复都需要包含在消息列表中，模型才能理解完整的对话上下文。

**上下文窗口限制**

每个模型都有一个上下文窗口（Context Window）的限制，即一次请求中能处理的最大token数量。这意味着：

- 传递的历史消息越多，消耗的token越多。
- 当对话历史超出上下文窗口时，需要采取截断、摘要等策略。
- 在实际应用中，需要平衡对话记忆的完整性和token消耗的成本。

**消息角色的交替模式**

在多轮对话中，消息角色遵循严格的交替模式：

1. **system**：始终在最前面，设定模型行为（只有一条）。
2. **user与assistant交替出现**：先user后assistant，模拟真实的对话流程。
3. **最后一条通常是user**：代表当前的用户输入。

#### 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "你是AI助理，回答很简洁"},
        {"role": "user", "content": "小明有2条宠物狗"},
        {"role": "assistant", "content": "好的"},
        {"role": "user", "content": "小红有3只宠物猫"},
        {"role": "assistant", "content": "好的"},
        {"role": "user", "content": "总共有几个宠物？"}
    ],
    stream=True
)

for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

#### 代码解析

**1. 创建客户端**

```python
client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
```

- 客户端创建方式与之前相同，连接到DashScope兼容API。

**2. 构造包含历史消息的消息列表**

```python
messages=[
    {"role": "system", "content": "你是AI助理，回答很简洁"},
    {"role": "user", "content": "小明有2条宠物狗"},
    {"role": "assistant", "content": "好的"},
    {"role": "user", "content": "小红有3只宠物猫"},
    {"role": "assistant", "content": "好的"},
    {"role": "user", "content": "总共有几个宠物？"}
]
```

这是实现多轮对话的核心部分，消息列表的结构如下：

- **第1条（system）**：设定模型为简洁回答的AI助理。
- **第2条（user）**：第一轮对话——用户告知"小明有2条宠物狗"。
- **第3条（assistant）**：第一轮对话——模型回复"好的"，确认已记录信息。
- **第4条（user）**：第二轮对话——用户告知"小红有3只宠物猫"。
- **第5条（assistant）**：第二轮对话——模型回复"好的"，再次确认。
- **第6条（user）**：当前问题——用户询问"总共有几个宠物？"。

由于模型能够看到之前的对话历史，它可以正确回答"5个宠物"（2条狗+3只猫），而不是反问"什么宠物？"。

**3. 调用模型并启用流式输出**

```python
response = client.chat.completions.create(
    model="qwen3-max",
    messages=...,
    stream=True
)
```

- 使用`qwen3-max`模型，启用流式输出以获得实时响应体验。

**4. 处理流式响应**

```python
for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

- 流式响应的处理方式与之前相同，逐片段输出增量内容。

#### 关键要点

- **LLM是无状态的**：每次API调用都是独立的，模型不会自动记住之前的对话，必须手动传递历史消息。
- **历史消息必须完整传递**：每次请求都需要将完整的对话历史放入`messages`列表，包括之前的user提问和assistant回复。
- **消息角色需交替排列**：user和assistant消息按照对话的时间顺序交替出现，形成自然的对话流。
- **注意上下文窗口限制**：对话历史越长，消耗的token越多。当历史超出模型上下文窗口时，需要考虑截断或摘要策略。
- **多轮对话的"记忆"是伪记忆**：模型并非真正记住了对话，而是通过重新阅读完整历史来理解上下文。这意味着每次请求的token消耗会随对话轮次增加而增长。

#### 小结

本文介绍了如何通过附带历史消息实现多轮对话记忆。核心在于理解LLM的无状态特性——每次调用都需要传递完整的对话历史，模型才能理解上下文。在实际应用中，还需要关注上下文窗口限制和token消耗，合理管理对话历史的长度。这是构建聊天机器人和对话系统的关键技术基础。

### 1.3 OpenAI库的流式输出

在与大语言模型交互时，等待模型生成完整回复可能需要较长时间，尤其是长文本场景。流式输出（Streaming）通过逐步返回生成内容，显著改善了用户体验。本文将详细介绍如何使用OpenAI库实现流式输出。

#### 核心概念

**流式输出 vs 非流式输出**

| 特性 | 非流式输出 | 流式输出 |
|------|-----------|---------|
| 参数 | `stream=False`（默认） | `stream=True` |
| 返回类型 | 完整的响应对象 | 迭代器 |
| 内容获取 | `choices[0].message.content` | `choices[0].delta.content` |
| 用户体验 | 等待后一次性显示 | 逐字实时显示 |
| 适用场景 | 后台处理、批量任务 | 聊天界面、实时交互 |

**delta.content与message.content的区别**

- **message.content**：非流式模式下使用，包含模型生成的完整文本内容。
- **delta.content**：流式模式下使用，仅包含当前片段的增量文本。每个chunk的`delta.content`是新生成的部分，需要拼接起来才能得到完整内容。

**flush=True的作用**

Python的`print`函数默认会缓冲输出，直到遇到换行符或缓冲区满才刷新。在流式输出场景中，如果不使用`flush=True`，内容可能不会立即显示在终端上，导致"打字机效果"不流畅。`flush=True`强制立即刷新输出缓冲区，确保每个片段实时可见。

**end参数的作用**

`print`函数的`end`参数控制输出末尾的字符，默认为换行符`\n`。在流式输出中，通常设置为空字符串`""`或空格`" "`，避免每个片段后换行，使输出连续显示。

#### 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen3-max",
    messages=[
        {"role": "system", "content": "你是一个Python编程专家，并且话非常多"},
        {"role": "assistant", "content": "好的，我是编程专家，并且话非常多，你要问什么？"},
        {"role": "user", "content": "输出1-10的数字，使用python代码"}
    ],
    stream=True
)

for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

#### 代码解析

**1. 创建客户端**

```python
client = OpenAI(
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)
```

- 与非流式调用相同，客户端创建方式不变，连接到DashScope的兼容API。

**2. 构造消息**

```python
messages=[
    {"role": "system", "content": "你是一个Python编程专家，并且话非常多"},
    {"role": "assistant", "content": "好的，我是编程专家，并且话非常多，你要问什么？"},
    {"role": "user", "content": "输出1-10的数字，使用python代码"}
]
```

- 这里故意将system消息设定为"话非常多"，与基础使用篇的"不说废话"形成对比，便于观察流式输出效果——模型会生成更多文本，流式输出的优势更加明显。

**3. 启用流式输出**

```python
response = client.chat.completions.create(
    model="qwen3-max",
    messages=...,
    stream=True
)
```

- 关键参数：`stream=True`，将响应模式从一次性返回切换为流式迭代。
- 此时`response`不再是一个完整的响应对象，而是一个迭代器。

**4. 逐片段处理响应**

```python
for chunk in response:
    print(
        chunk.choices[0].delta.content,
        end=" ",
        flush=True
    )
```

- `for chunk in response`：遍历流式响应的每个片段。
- `chunk.choices[0].delta.content`：获取当前片段的增量文本内容。注意使用的是`delta`而非`message`。
- `end=" "`：每个片段后输出一个空格而非换行，使文本连续显示。注意最后一个片段的`delta.content`可能为`None`，需要留意。
- `flush=True`：立即刷新输出，确保每个片段实时显示在终端，实现打字机效果。

#### 关键要点

- **stream=True是核心开关**：只需在调用时添加`stream=True`参数，即可将响应模式切换为流式输出。
- **delta.content获取增量内容**：流式模式下，每个chunk通过`choices[0].delta.content`获取，这是增量文本而非完整文本。
- **flush=True确保实时显示**：配合`print`的`flush=True`参数，强制立即刷新输出缓冲区，实现真正的实时显示效果。
- **end参数控制输出格式**：设置`end=""`或`end=" "`避免片段间换行，使输出连续流畅。
- **流式输出改善用户体验**：对于长文本生成场景，流式输出让用户无需等待全部内容生成完毕，即可开始阅读，显著提升交互体验。

#### 小结

本文介绍了OpenAI库的流式输出功能。通过设置`stream=True`，响应变为可迭代的流，每个片段通过`delta.content`获取增量文本。配合`flush=True`和适当的`end`参数，可以实现流畅的打字机效果。流式输出是构建聊天应用和实时交互系统的关键技术，掌握它能让你的大模型应用体验更上一层楼。

### 1.4 测试APIKEY的使用

在使用大语言模型进行开发时，第一步往往是验证API连接是否正常。本文将介绍如何使用OpenAI库连接本地运行的Ollama服务，实现快速测试本地大模型的连通性。

#### 核心概念

**本地大模型与Ollama**

Ollama是一个轻量级的本地大模型运行框架，它兼容OpenAI的API接口格式，使得我们可以直接使用OpenAI库来调用本地模型。这意味着你无需依赖云端API，即可在本地完成大模型的调用与测试。

**base_url参数**

OpenAI库的`base_url`参数用于指定API的服务地址。默认情况下，它指向OpenAI的官方API地址。当我们需要连接本地Ollama服务时，只需将`base_url`设置为Ollama的本地地址即可：

- 本地Ollama地址：`http://localhost:11434/v1`
- 其中`11434`是Ollama的默认端口
- `/v1`是兼容OpenAI API格式的路径前缀

**本地模型无需API Key**

与云端API不同，本地运行的Ollama服务不需要API Key进行身份验证。因此，在创建客户端时，无需传入`api_key`参数，OpenAI库会使用默认值。

**流式输出**

流式输出（Streaming）是指模型生成文本时，逐字或逐词实时返回结果，而非等待全部内容生成完毕后一次性返回。通过设置`stream=True`，可以实现类似打字机效果的实时响应体验。

#### 代码示例

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

#### 代码解析

**1. 导入库与创建客户端**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
)
```

- 导入`OpenAI`类，这是与兼容OpenAI API格式的服务交互的核心类。
- 创建客户端实例，将`base_url`指向本地Ollama服务的地址。
- 无需传入`api_key`，因为本地Ollama服务不需要身份验证。

**2. 构造请求消息**

```python
messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "你是谁，能做什么？"},
],
```

- `system`角色：设定模型的行为和角色定位，这里指定为一个有帮助的助手。
- `user`角色：用户的实际提问内容。

**3. 调用模型并启用流式输出**

```python
completion = client.chat.completions.create(
    model="qwen3:4b",
    messages=...,
    stream=True
)
```

- `model`参数指定要使用的本地模型名称，这里是`qwen3:4b`（需确保Ollama中已拉取该模型）。
- `stream=True`启用流式输出，模型会逐步返回生成的内容。

**4. 处理流式响应**

```python
for chunk in completion:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

- 流式响应返回的是一个迭代器，每个`chunk`是模型生成的一个片段。
- `chunk.choices[0].delta.content`获取当前片段的文本内容。注意流式模式下使用的是`delta`而非`message`。
- `end=""`：不换行，使输出连续显示。
- `flush=True`：立即刷新输出缓冲区，确保内容实时显示在终端。

#### 关键要点

- **base_url指向本地**：连接本地Ollama时，`base_url`设置为`http://localhost:11434/v1`，这是Ollama兼容OpenAI API的默认地址。
- **无需API Key**：本地模型不需要身份验证，创建客户端时省略`api_key`参数即可。
- **stream=True启用流式**：设置`stream=True`后，响应变为迭代器，可以逐片段获取生成内容。
- **delta.content获取流式片段**：流式模式下，通过`chunk.choices[0].delta.content`获取每个片段的文本，区别于非流式模式的`message.content`。
- **flush=True实现实时显示**：配合`print`的`flush=True`参数，确保每个片段立即显示，实现打字机效果。

#### 小结

本文介绍了如何使用OpenAI库连接本地Ollama服务来测试API连通性。核心在于将`base_url`指向本地Ollama地址，并利用流式输出实现实时响应。这种方式非常适合在本地开发环境中快速验证模型是否正常运行，是开发大模型应用的第一步。

## 第二章：LangChain调用模型

### 2.1 LangChain调用聊天模型

LangChain 中的大模型接口分为两类：LLM（纯文本输入输出）和 Chat Model（消息类型输入输出）。聊天模型通过结构化的消息类型来组织对话，支持系统提示、多轮对话等高级功能，是构建对话式 AI 应用的基础。

#### 核心概念

**Chat Model（聊天模型）** 与 LLM 的核心区别在于输入输出格式：LLM 接收和返回纯字符串，而 Chat Model 接收消息列表、返回消息对象。这种设计更贴合实际对话场景。

LangChain 定义了三种核心消息类型：

- **SystemMessage**：系统消息，设定模型的角色和行为规则（如"你是一个翻译助手"）
- **HumanMessage**：用户消息，代表用户的输入
- **AIMessage**：AI 消息，代表模型的回复，用于传递历史对话记录

通过将这三种消息类型组合成列表，可以构建完整的对话上下文，让模型理解系统设定、历史交互和当前问题。

#### 代码示例

```python
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

model = ChatTongyi(model="qwen3-max")

messages = [
    SystemMessage(content="你是一个边塞诗人。"),
    HumanMessage(content="写一首唐诗"),
    AIMessage(content="锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"),
    HumanMessage(content="按照你上一个回复的格式，在写一首唐诗。")
]

res = model.stream(input=messages)
for chunk in res:
    print(chunk.content, end="", flush=True)
```

#### 代码解析

1. **导入模块**：从 `langchain_community.chat_models.tongyi` 导入 `ChatTongyi`（聊天版通义千问），从 `langchain_core.messages` 导入三种消息类型。

2. **创建聊天模型实例**：`ChatTongyi(model="qwen3-max")` 创建聊天模型，注意使用的是 `ChatTongyi` 而非 `Tongyi`。

3. **构建消息列表**：
   - `SystemMessage`：设定模型角色为"边塞诗人"，引导模型以特定风格回复
   - `HumanMessage`：用户的第一次提问
   - `AIMessage`：模型的上一轮回复，作为对话历史传入
   - `HumanMessage`：用户的当前提问，引用了上一轮回复的格式

4. **流式调用**：`model.stream(input=messages)` 对消息列表进行流式调用，返回的每个 `chunk` 是一个 `AIMessageChunk` 对象，通过 `chunk.content` 获取文本内容。

#### 关键要点

- Chat Model 使用 `SystemMessage`、`HumanMessage`、`AIMessage` 三种消息类型组织对话
- `SystemMessage` 设定模型角色和行为规则，是构建专业 AI 应用的关键
- `AIMessage` 用于传入历史对话，使模型能理解上下文关系
- Chat Model 的流式输出中，每个 chunk 需要通过 `.content` 属性获取文本内容
- `ChatTongyi` 是聊天版通义千问，与 `Tongyi`（LLM 版）属于不同的类

#### 小结

聊天模型的消息类型体系是构建对话式 AI 应用的基础。通过 SystemMessage 设定角色、HumanMessage 传递用户输入、AIMessage 保存历史对话，可以构建出具有上下文理解能力的智能对话系统。掌握消息类型的使用，是深入学习 LangChain 对话链、Agent 等高级功能的前提。

### 2.2 LangChain调用Ollama的聊天模型

在前面的文章中，我们分别介绍了 LangChain 调用云端聊天模型和 Ollama 本地 LLM。本文将两者结合，介绍如何通过 LangChain 调用 Ollama 部署的本地聊天模型，实现本地化的多轮对话能力。

#### 核心概念

**ChatOllama** 是 LangChain 对 Ollama 聊天模型的封装，与 `OllamaLLM`（纯文本模型）相对应。它支持与云端聊天模型完全相同的消息类型体系，可以使用 `SystemMessage`、`HumanMessage`、`AIMessage` 构建对话上下文。

关键要素：

- **ChatOllama vs OllamaLLM**：`ChatOllama` 是聊天模型接口，接收消息列表；`OllamaLLM` 是 LLM 接口，接收纯文本字符串
- **统一的消息格式**：与 `ChatTongyi` 使用完全相同的 `SystemMessage`/`HumanMessage`/`AIMessage` 消息类型
- **统一的接口设计**：`invoke()`、`stream()` 等方法与云端聊天模型行为一致
- **本地运行**：所有计算在本地完成，数据不出本机，保障隐私安全

#### 代码示例

```python
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

model = ChatOllama(model="qwen3:4b")

messages = [
    SystemMessage(content="你是一个边塞诗人。"),
    HumanMessage(content="写一首唐诗"),
    AIMessage(content="锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"),
    HumanMessage(content="按照你上一个回复的格式，在写一首唐诗。")
]

res = model.stream(input=messages)
for chunk in res:
    print(chunk.content, end="", flush=True)
```

#### 代码解析

1. **导入模块**：从 `langchain_ollama` 导入 `ChatOllama`，从 `langchain_core.messages` 导入消息类型。注意 `ChatOllama` 和 `OllamaLLM` 在同一个包中。

2. **创建聊天模型实例**：`ChatOllama(model="qwen3:4b")` 创建本地聊天模型实例，使用 `qwen3:4b` 模型。

3. **构建消息列表**：消息结构与使用 `ChatTongyi` 时完全相同——`SystemMessage` 设定角色、`HumanMessage` 和 `AIMessage` 构建对话历史。

4. **流式输出**：`model.stream(input=messages)` 返回流式迭代器，每个 `chunk` 通过 `.content` 获取文本内容，与云端聊天模型的处理方式一致。

#### 关键要点

- `ChatOllama` 位于 `langchain_ollama` 包中，与 `OllamaLLM` 是同一包的不同类
- `ChatOllama` 接收消息列表，`OllamaLLM` 接收纯文本字符串，适用场景不同
- 消息格式与云端聊天模型（如 `ChatTongyi`）完全一致，切换只需更改模型类
- 本地聊天模型支持流式输出，通过 `chunk.content` 获取文本
- 本地运行的优势：无需 API 密钥、无调用费用、数据隐私安全

#### 小结

通过 `ChatOllama`，我们可以在本地部署具有多轮对话能力的聊天模型，同时享受 LangChain 统一接口带来的便利。无论是云端模型还是本地模型，消息类型和调用方式完全一致，开发者可以根据实际需求灵活选择部署方式，在模型能力、成本和隐私之间取得最佳平衡。

### 2.3 LangChain访问阿里云通义千问大模型

LangChain 提供了统一的大模型调用接口，让开发者可以方便地接入各种大语言模型。本文介绍如何通过 LangChain 访问阿里云通义千问大模型，这是国内最常用的大模型服务之一。

#### 核心概念

**通义千问**是阿里云推出的大语言模型服务，提供了多种模型规格（如 qwen-max、qwen-plus 等）。LangChain 通过 `langchain_community` 包中的 `Tongyi` 类封装了对通义千问的调用。

关键要素：

- **Tongyi 类**：来自 `langchain_community.llms.tongyi` 模块，是 LangChain 对通义千问大模型的封装
- **model 参数**：指定使用的模型名称，如 `qwen-max`（最强能力）、`qwen-plus`（均衡性价比）等
- **invoke() 方法**：LangChain 统一的模型调用方法，传入 prompt 字符串即可获得模型响应
- **环境变量**：需要设置 `DASHSCOPE_API_KEY` 环境变量来提供 API 密钥

使用前需要安装依赖：`pip install langchain-community dashscope`

#### 代码示例

```python
from langchain_community.llms.tongyi import Tongyi

model = Tongyi(model="qwen-max")
res = model.invoke(input="你是谁呀能做什么？")
print(res)
```

#### 代码解析

1. **导入模块**：从 `langchain_community.llms.tongyi` 导入 `Tongyi` 类，这是 LangChain 社区包中对通义千问的封装。

2. **创建模型实例**：`Tongyi(model="qwen-max")` 创建一个通义千问模型实例，`model` 参数指定使用 `qwen-max` 模型。该模型会自动从环境变量 `DASHSCOPE_API_KEY` 中读取 API 密钥。

3. **调用模型**：`model.invoke(input="你是谁呀能做什么？")` 使用 `invoke` 方法向模型发送提问，`input` 参数接收字符串类型的提示词，模型返回生成的文本响应。

4. **输出结果**：打印模型返回的响应内容。

#### 关键要点

- `Tongyi` 类位于 `langchain_community.llms.tongyi` 模块中，属于 LangChain 的社区集成包
- 通过 `model` 参数选择不同的模型规格，如 `qwen-max`、`qwen-plus` 等
- `invoke()` 是 LangChain 统一的模型调用接口，所有 LLM 都支持此方法
- 使用前需确保已设置 `DASHSCOPE_API_KEY` 环境变量
- Tongyi 属于 LLM 类型（纯文本输入输出），区别于 Chat Model（消息类型输入输出）

#### 小结

通过 LangChain 的 Tongyi 类，我们可以用极简的代码访问阿里云通义千问大模型。LangChain 的统一接口设计使得切换不同模型只需更改类名和参数，无需修改业务逻辑代码，这为后续的模型切换和对比测试提供了极大的便利。

### 2.4 LangChain消息的简写形式

在使用 LangChain 的聊天模型时，我们通常需要导入 `SystemMessage`、`HumanMessage`、`AIMessage` 等消息类来构建对话。LangChain 还提供了一种更简洁的元组写法，无需导入消息类即可完成相同的对话构建。

#### 核心概念

**元组简写形式**是用 `("role", "content")` 二元组来替代消息类的写法。LangChain 在内部会自动将元组转换为对应的消息对象，因此功能完全等价，但代码更加简洁。

角色字符串与消息类的对应关系：

- `("system", "内容")` 等价于 `SystemMessage(content="内容")`
- `("human", "内容")` 等价于 `HumanMessage(content="内容")`
- `("ai", "内容")` 等价于 `AIMessage(content="内容")`

这种简写在构建对话历史时特别方便，减少了导入语句和代码量。

#### 代码示例

```python
from langchain_community.chat_models.tongyi import ChatTongyi

model = ChatTongyi(model="qwen3-max")

messages = [
    ("system", "你是一个边塞诗人。"),
    ("human", "写一首唐诗。"),
    ("ai", "锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"),
    ("human", "按照你上一个回复的格式，在写一首唐诗。")
]

res = model.stream(input=messages)
for chunk in res:
    print(chunk.content, end="", flush=True)
```

#### 代码解析

1. **简化导入**：只需导入 `ChatTongyi`，无需再导入 `SystemMessage`、`HumanMessage`、`AIMessage`，减少了导入语句。

2. **元组写法**：每条消息用 `("role", "content")` 格式表示：
   - `("system", "你是一个边塞诗人。")` 替代 `SystemMessage(content="你是一个边塞诗人。")`
   - `("human", "写一首唐诗。")` 替代 `HumanMessage(content="写一首唐诗。")`
   - `("ai", "锄禾日当午...")` 替代 `AIMessage(content="锄禾日当午...")`

3. **功能等价**：LangChain 在内部自动将元组转换为对应的消息对象，调用方式和输出结果与使用消息类完全一致。

4. **流式输出**：调用和输出方式不变，`model.stream()` 返回的 chunk 仍需通过 `.content` 获取文本。

#### 关键要点

- 元组简写 `("role", "content")` 与消息类写法功能完全等价
- 角色字符串：`"system"`、`"human"`、`"ai"` 分别对应三种消息类型
- 简写形式减少了导入语句，代码更简洁，适合快速构建对话
- LangChain 内部自动完成元组到消息对象的转换，开发者无需关心
- 在 `ChatPromptTemplate.from_messages()` 中也广泛使用元组写法

#### 小结

元组简写是 LangChain 提供的一种语法糖，让对话构建更加简洁直观。虽然功能上与消息类写法完全等价，但在实际开发中，元组写法更常用于快速原型开发和对话历史构建，而消息类写法则在需要更精细控制（如附加元数据）时使用。两种写法可以混合使用，根据场景灵活选择。

### 2.5 LangChain的流式输出

大语言模型生成文本是一个逐 token 生成的过程，传统的 `invoke()` 方法会等待完整响应后才返回，这在生成长文本时会导致用户等待时间过长。流式输出（Streaming）通过逐步返回生成内容，显著改善了用户体验。

#### 核心概念

**流式输出**是指模型在生成文本的过程中，每生成一个 token（或一小段文本）就立即返回给调用方，而不是等待整个响应完成后一次性返回。这种方式让用户可以实时看到模型的输出过程，就像打字一样逐字显示。

关键要素：

- **`model.stream()` vs `model.invoke()`**：`stream()` 返回一个迭代器，`invoke()` 返回完整结果
- **迭代器模式**：`stream()` 返回的是一个可迭代对象，通过 `for` 循环逐块获取内容
- **`end=""`**：`print()` 默认会换行，设置 `end=""` 阻止自动换行，使输出连续
- **`flush=True`**：强制刷新输出缓冲区，确保每个 chunk 立即显示在终端上，而非等待缓冲区满

#### 代码示例

```python
from langchain_ollama import OllamaLLM

model = OllamaLLM(model="qwen3:4b")
res = model.stream(input="你是谁呀能做什么？")

for chunk in res:
    print(chunk, end="", flush=True)
```

#### 代码解析

1. **创建模型实例**：与 `invoke()` 方式相同，创建 OllamaLLM 模型实例。

2. **调用 `stream()` 方法**：`model.stream(input="你是谁呀能做什么？")` 返回一个迭代器对象 `res`，每次迭代产生一个文本片段（chunk）。

3. **遍历迭代器**：`for chunk in res` 逐个获取模型生成的文本片段。每个 `chunk` 是一个字符串，通常包含一个或几个 token。

4. **实时输出**：`print(chunk, end="", flush=True)` 中：
   - `end=""`：取消 `print` 默认的换行行为，使所有 chunk 在同一行连续输出
   - `flush=True`：立即将内容输出到终端，不等待缓冲区满，实现真正的实时显示效果

#### 关键要点

- `stream()` 返回迭代器，`invoke()` 返回完整字符串，两者适用不同场景
- 流式输出通过 `for chunk in res` 逐块获取内容，实现逐步响应
- `print()` 中 `end=""` 阻止自动换行，`flush=True` 强制刷新缓冲区，两者配合实现连续实时输出
- 流式输出适用于聊天界面、实时交互等需要即时反馈的场景
- 所有 LangChain 的 LLM 和 Chat Model 都支持 `stream()` 方法

#### 小结

流式输出是提升大模型应用用户体验的关键技术。通过 `stream()` 方法获取迭代器，配合 `for` 循环逐块输出，可以实现类似 ChatGPT 的打字效果。在实际的 Web 应用和聊天界面开发中，流式输出几乎是标配功能，它让用户无需漫长等待，就能实时看到模型的思考过程。

### 2.6 LangChain访问Ollama本地模型

除了调用云端大模型，LangChain 同样支持访问本地部署的大模型。Ollama 是目前最流行的本地大模型运行工具之一，本文介绍如何通过 LangChain 访问 Ollama 部署的本地模型。

#### 核心概念

**Ollama** 是一个轻量级的本地大模型运行框架，支持在本地机器上快速部署和运行各种开源大模型（如 DeepSeek、Qwen、Llama 等）。LangChain 通过 `langchain_ollama` 包提供了对 Ollama 的集成。

关键要素：

- **OllamaLLM 类**：来自 `langchain_ollama` 模块，封装了对 Ollama 本地模型的调用
- **本地部署**：模型运行在本地机器上，无需网络请求，数据不出本机
- **统一接口**：`invoke()` 方法与云端模型完全一致，实现无缝切换
- **model 参数**：指定 Ollama 中已安装的模型名称，如 `deepseek-r1:7b`、`qwen3:4b` 等

使用前需要：1) 安装 Ollama 并下载模型；2) 安装依赖 `pip install langchain-ollama`

#### 代码示例

```python
from langchain_ollama import OllamaLLM

model = OllamaLLM(model="deepseek-r1:7b")
res = model.invoke(input="你是谁呀能做什么？")
print(res)
```

#### 代码解析

1. **导入模块**：从 `langchain_ollama` 导入 `OllamaLLM` 类，这是 LangChain 对 Ollama 本地模型的封装。

2. **创建模型实例**：`OllamaLLM(model="deepseek-r1:7b")` 创建一个本地模型实例，`model` 参数指定使用 `deepseek-r1:7b` 模型（DeepSeek 推理模型，7B 参数量）。Ollama 默认连接 `http://localhost:11434`。

3. **调用模型**：`model.invoke(input="你是谁呀能做什么？")` 使用与云端模型完全相同的 `invoke` 方法调用本地模型，无需修改任何调用逻辑。

4. **输出结果**：打印本地模型返回的响应内容。

#### 关键要点

- `OllamaLLM` 类位于 `langchain_ollama` 模块中，是 LangChain 对 Ollama 的官方集成
- 本地模型运行无需网络请求，响应速度取决于本机硬件性能
- `invoke()` 接口与云端模型（如 Tongyi）完全一致，切换模型只需更改类名
- 使用前需确保 Ollama 服务已启动且指定模型已下载（`ollama pull deepseek-r1:7b`）
- 本地部署的优势：数据隐私安全、无 API 费用、离线可用

#### 小结

通过 LangChain 的 OllamaLLM 类，我们可以像调用云端模型一样方便地访问本地部署的大模型。LangChain 的统一接口设计使得云端模型和本地模型的使用方式完全一致，开发者可以根据场景需求灵活选择，在数据隐私和模型能力之间取得平衡。

## 第三章：嵌入模型

### 3.1 LangChain访问Ollama的本地嵌入模型

与本地大模型类似，Ollama 也支持运行本地嵌入模型。本文介绍如何通过 LangChain 访问 Ollama 部署的本地嵌入模型，实现完全本地化的文本向量化。

#### 核心概念

**OllamaEmbeddings** 是 LangChain 对 Ollama 嵌入模型的封装，与 `DashScopeEmbeddings`（云端嵌入模型）提供完全相同的接口。这意味着在嵌入模型层面，云端和本地的切换也只需更改类名，无需修改业务代码。

关键要素：

- **OllamaEmbeddings**：来自 `langchain_ollama` 模块，封装了对 Ollama 嵌入模型的调用
- **相同的接口**：`embed_query()` 和 `embed_documents()` 方法与云端嵌入模型完全一致
- **本地部署**：嵌入计算在本地完成，无需网络请求，适合数据隐私敏感场景
- **model 参数**：指定 Ollama 中已安装的嵌入模型名称

使用前需要确保 Ollama 服务已启动且嵌入模型已下载（如 `ollama pull qwen3-embedding:4b`）。

#### 代码示例

```python
from langchain_ollama import OllamaEmbeddings

model = OllamaEmbeddings(model="qwen3-embedding:4b")

print(model.embed_query("我喜欢你"))
print(model.embed_documents(["我喜欢你", "我稀饭你", "晚上吃啥"]))
```

#### 代码解析

1. **导入模块**：从 `langchain_ollama` 导入 `OllamaEmbeddings` 类，与 `OllamaLLM` 和 `ChatOllama` 在同一个包中。

2. **创建嵌入模型实例**：`OllamaEmbeddings(model="qwen3-embedding:4b")` 创建本地嵌入模型实例，使用 `qwen3-embedding:4b` 嵌入模型。

3. **`embed_query("我喜欢你")`**：将单条文本转换为向量，返回浮点数列表。接口与 `DashScopeEmbeddings` 完全一致。

4. **`embed_documents([...])`**：批量将多条文本转换为向量，返回嵌套列表。同样与云端嵌入模型接口一致。

5. **本地计算**：所有嵌入计算在本地 GPU/CPU 上完成，无需发送数据到云端，保障数据隐私。

#### 关键要点

- `OllamaEmbeddings` 位于 `langchain_ollama` 包中，与 `OllamaLLM` 同包
- `embed_query()` 和 `embed_documents()` 接口与云端嵌入模型完全一致
- 本地嵌入模型无需 API 密钥，无调用费用，数据不出本机
- 使用前需确保 Ollama 服务已启动且嵌入模型已下载
- 注意：不同嵌入模型输出的向量维度可能不同，同一系统中应使用同一嵌入模型

#### 小结

通过 `OllamaEmbeddings`，我们可以实现完全本地化的文本嵌入，无需依赖任何云端服务。LangChain 统一的嵌入接口设计使得云端和本地嵌入模型可以无缝切换。在实际项目中，开发阶段可使用云端嵌入模型快速验证，生产环境可根据隐私和成本需求切换到本地嵌入模型。

### 3.2 LangChain访问阿里云嵌入模型

嵌入模型（Embedding Model）是将文本转换为向量的核心组件，是 RAG（检索增强生成）系统的基石。本文介绍如何通过 LangChain 访问阿里云的 DashScope 嵌入模型，将文本转换为高维向量表示。

#### 核心概念

**嵌入（Embedding）** 是将文本映射到高维向量空间的过程。语义相近的文本在向量空间中的距离也更近，这使得我们可以通过向量相似度计算来实现语义检索。阿里云的 DashScope 平台提供了高质量的中文嵌入模型。

关键要素：

- **DashScopeEmbeddings**：来自 `langchain_community.embeddings` 模块，封装了阿里云 DashScope 嵌入模型的调用
- **`embed_query()`**：将单条文本转换为向量，通常用于嵌入用户查询
- **`embed_documents()`**：将多条文本批量转换为向量，通常用于嵌入文档库
- **向量维度**：嵌入模型输出的向量维度是固定的（如 1536 维），不同模型维度可能不同

使用前需要设置 `DASHSCOPE_API_KEY` 环境变量。

#### 代码示例

```python
from langchain_community.embeddings import DashScopeEmbeddings

model = DashScopeEmbeddings()

print(model.embed_query("我喜欢你"))
print(model.embed_documents(["我喜欢你", "我稀饭你", "晚上吃啥"]))
```

#### 代码解析

1. **导入模块**：从 `langchain_community.embeddings` 导入 `DashScopeEmbeddings` 类。

2. **创建嵌入模型实例**：`DashScopeEmbeddings()` 创建阿里云嵌入模型实例，默认使用 DashScope 的文本嵌入模型。

3. **`embed_query("我喜欢你")`**：将单条文本转换为向量，返回一个浮点数列表（如 `[0.123, -0.456, ...]`），向量维度取决于模型。该方法专为嵌入用户查询设计。

4. **`embed_documents([...])`**：将多条文本批量转换为向量，返回一个嵌套列表，每个元素是一条文本对应的向量。该方法专为嵌入文档库设计，支持批量处理以提高效率。

5. **语义相似性**：`"我喜欢你"` 和 `"我稀饭你"` 语义相近，它们的向量在空间中距离会很近；而 `"晚上吃啥"` 语义不同，向量距离会较远。

#### 关键要点

- `DashScopeEmbeddings` 封装了阿里云的文本嵌入模型，适合中文场景
- `embed_query()` 嵌入单条文本，`embed_documents()` 批量嵌入多条文本
- 嵌入模型将文本转换为固定维度的浮点数向量
- 语义相近的文本在向量空间中距离更近，这是语义检索的基础
- 嵌入模型是 RAG 系统的核心组件，用于将文档和查询向量化

#### 小结

嵌入模型是连接自然语言与向量空间的桥梁，它将文本转换为机器可计算的向量表示。通过 `DashScopeEmbeddings`，我们可以方便地使用阿里云的高质量中文嵌入模型。在 RAG 系统中，文档先通过 `embed_documents()` 向量化并存入向量数据库，查询时通过 `embed_query()` 向量化后进行相似度检索，从而实现语义级别的文档召回。

## 第四章：提示词模板

### 4.1 通用提示词模板

在实际应用中，提示词通常需要动态填充变量（如用户名、问题内容等）。LangChain 的 `PromptTemplate` 提供了模板化提示词的能力，配合 LCEL（LangChain Expression Language）的管道符 `|`，可以优雅地构建提示词到模型的调用链。

#### 核心概念

**PromptTemplate** 是 LangChain 的提示词模板类，支持在提示词中定义变量占位符（如 `{lastname}`），运行时动态填充。**LCEL（LangChain Expression Language）** 是 LangChain 的链式调用语法，通过管道符 `|` 将多个组件串联成处理管道。

关键要素：

- **`PromptTemplate.from_template()`**：从模板字符串创建提示词模板，`{变量名}` 为占位符
- **变量占位符**：用花括号 `{}` 包裹的变量名，如 `{lastname}`、`{gender}`，运行时被实际值替换
- **LCEL 管道符 `|`**：将模板和模型串联，数据自动从前一个组件流向后一个组件
- **`chain.invoke()`**：调用整个链，传入变量字典，自动完成模板填充和模型调用

#### 代码示例

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.llms.tongyi import Tongyi

prompt_template = PromptTemplate.from_template(
    "我的邻居姓{lastname}, 刚生了{gender}, 你帮我起个名字，简单回答。"
)
model = Tongyi(model="qwen-max")

chain = prompt_template | model
res = chain.invoke(input={"lastname": "张", "gender": "女儿"})
print(res)
```

#### 代码解析

1. **创建提示词模板**：`PromptTemplate.from_template("我的邻居姓{lastname}, 刚生了{gender}, 你帮我起个名字，简单回答。")` 定义了一个包含两个变量占位符的模板：`{lastname}` 和 `{gender}`。

2. **创建模型实例**：`Tongyi(model="qwen-max")` 创建通义千问模型实例。

3. **构建链**：`chain = prompt_template | model` 使用 LCEL 管道符将模板和模型串联。数据流为：输入字典 → 模板填充 → 生成提示词 → 模型调用 → 返回结果。

4. **调用链**：`chain.invoke(input={"lastname": "张", "gender": "女儿"})` 传入变量字典，链自动完成：
   - 将 `{"lastname": "张", "gender": "女儿"}` 填充到模板中，生成完整提示词
   - 将填充后的提示词发送给模型
   - 返回模型的响应结果

#### 关键要点

- `PromptTemplate.from_template()` 从字符串创建模板，`{变量名}` 为占位符
- LCEL 管道符 `|` 将组件串联成链，数据自动流转
- `chain.invoke()` 传入变量字典，自动完成模板填充和模型调用
- 模板与模型解耦，修改模板不影响模型代码，修改模型不影响模板
- LCEL 链也支持 `stream()` 方法实现流式输出

#### 小结

`PromptTemplate` 配合 LCEL 链式调用，提供了一种优雅且灵活的提示词管理方式。模板化使得提示词的维护和修改变得简单，管道符 `|` 让组件的组合直观自然。这种设计模式是 LangChain 的核心理念之一，后续的 ChatPromptTemplate、FewShot 模板等都遵循相同的模式。

### 4.2 ChatPromptTemplate的使用

与 `PromptTemplate` 用于纯文本提示词不同，`ChatPromptTemplate` 专门用于构建聊天模型的提示词。它支持消息类型的模板化，包括系统消息、历史对话占位符等，是构建对话式 AI 应用的核心工具。

#### 核心概念

**ChatPromptTemplate** 是 LangChain 为聊天模型设计的提示词模板类。它将聊天消息的结构（系统设定、历史对话、用户输入）模板化，使得对话上下文的构建更加规范和灵活。

关键要素：

- **`ChatPromptTemplate.from_messages()`**：从消息列表创建聊天提示词模板
- **消息格式**：支持元组写法 `("role", "content")` 和消息类写法
- **`MessagesPlaceholder`**：消息占位符，用于动态插入对话历史，是构建多轮对话的关键
- **`invoke().to_string()`**：填充模板并转为字符串，用于查看完整提示词

#### 代码示例

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_models.tongyi import ChatTongyi

chat_prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一个边塞诗人，可以作诗。"),
        MessagesPlaceholder("history"),
        ("human", "请再来一首唐诗"),
    ]
)

history_data = [
    ("human", "你来写一个唐诗"),
    ("ai", "床前明月光，疑是地上霜，举头望明月，低头思故乡"),
    ("human", "好诗再来一个"),
    ("ai", "锄禾日当午，汗滴禾下锄，谁知盘中餐，粒粒皆辛苦"),
]

prompt_text = chat_prompt_template.invoke({"history": history_data}).to_string()

model = ChatTongyi(model="qwen3-max")
res = model.invoke(prompt_text)
print(res.content, type(res))
```

#### 代码解析

1. **创建聊天提示词模板**：`ChatPromptTemplate.from_messages()` 接收消息列表：
   - `("system", "你是一个边塞诗人，可以作诗。")`：固定的系统设定
   - `MessagesPlaceholder("history")`：对话历史占位符，运行时动态插入
   - `("human", "请再来一首唐诗")`：固定的用户当前提问

2. **准备对话历史**：`history_data` 是一个元组列表，模拟了之前的对话记录，包含两轮问答。

3. **填充模板**：`chat_prompt_template.invoke({"history": history_data})` 传入变量字典，`MessagesPlaceholder("history")` 被替换为 `history_data` 中的消息。`.to_string()` 将填充后的 `PromptValue` 转为字符串，方便查看和调试。

4. **调用模型**：将填充后的提示词传给 `ChatTongyi` 模型，`res.content` 获取 AI 回复的文本内容，`type(res)` 显示返回类型为 `AIMessage`。

5. **模板优势**：系统设定和当前提问是固定的模板部分，只有对话历史是动态的，这使得模板可以复用于不同的对话场景。

#### 关键要点

- `ChatPromptTemplate.from_messages()` 从消息列表创建聊天提示词模板
- `MessagesPlaceholder` 是动态插入对话历史的关键组件
- 元组写法 `("role", "content")` 在模板定义和对话历史中都可使用
- `invoke()` 返回 `PromptValue`，通过 `.to_string()` 转为字符串
- `MessagesPlaceholder` 使得多轮对话的上下文管理变得结构化

#### 小结

`ChatPromptTemplate` 是构建聊天模型提示词的专业工具，它将系统设定、对话历史和用户提问统一模板化。`MessagesPlaceholder` 的引入使得动态对话历史的插入变得优雅，为构建多轮对话系统提供了坚实基础。结合 LCEL 链式调用，`ChatPromptTemplate` 可以与模型无缝串联，实现完整的对话处理管道。

### 4.3 FewShot提示词模板

FewShot（少样本）提示是一种通过提供少量示例来引导大模型学习特定任务模式的技巧。LangChain 的 `FewShotPromptTemplate` 将这种技巧模板化，让示例管理和提示词构建更加规范和灵活。

#### 核心概念

**FewShot Prompting** 的核心思想是：与其告诉模型"怎么做"，不如直接展示几个示例让模型"看怎么做"。通过在提示词中包含少量输入-输出对（示例），模型可以快速理解任务模式并泛化到新的输入。

`FewShotPromptTemplate` 的关键组成部分：

- **`examples`**：示例数据列表，每个示例是一个字典，包含输入和输出字段
- **`example_prompt`**：单个示例的格式模板，定义如何将示例字典格式化为文本
- **`prefix`**：示例之前的提示文本，通常描述任务要求
- **`suffix`**：示例之后的提示文本，包含实际问题的占位符
- **`input_variables`**：后缀中需要动态填充的变量名列表

#### 代码示例

```python
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
from langchain_community.llms.tongyi import Tongyi

example_template = PromptTemplate.from_template("单词：{word}, 反义词：{antonym}")

examples_data = [
    {"word": "大", "antonym": "小"},
    {"word": "上", "antonym": "下"},
]

few_shot_template = FewShotPromptTemplate(
    example_prompt=example_template,
    examples=examples_data,
    prefix="告知我单词的反义词，我提供如下的示例：",
    suffix="基于前面的示例告知我，{input_word}的反义词是？",
    input_variables=['input_word']
)

prompt_text = few_shot_template.invoke(input={"input_word": "左"}).to_string()
print(prompt_text)

model = Tongyi(model="qwen-max")
print(model.invoke(input=prompt_text))
```

#### 代码解析

1. **定义示例模板**：`example_template = PromptTemplate.from_template("单词：{word}, 反义词：{antonym}")` 定义了每个示例的展示格式，`{word}` 和 `{antonym}` 是示例字典中的键。

2. **准备示例数据**：`examples_data` 包含两个示例，每个示例是一个字典，键名与示例模板中的占位符对应。

3. **构建 FewShot 模板**：`FewShotPromptTemplate` 将各部分组合：
   - `example_prompt`：单个示例的格式
   - `examples`：示例数据列表
   - `prefix`：放在所有示例之前的说明文字
   - `suffix`：放在所有示例之后的问题模板，包含 `{input_word}` 占位符
   - `input_variables`：声明 suffix 中的动态变量

4. **生成提示词**：`few_shot_template.invoke(input={"input_word": "左"}).to_string()` 填充模板并转为字符串，最终生成的提示词为：
   ```
   告知我单词的反义词，我提供如下的示例：
   单词：大, 反义词：小
   单词：上, 反义词：下
   基于前面的示例告知我，左的反义词是？
   ```

5. **调用模型**：将生成的提示词传给模型，模型根据示例模式推断出"左"的反义词是"右"。

#### 关键要点

- `FewShotPromptTemplate` 将 FewShot 提示技巧模板化，支持灵活管理示例
- `example_prompt` 定义单个示例的格式，`examples` 提供示例数据
- `prefix` 在示例前提供任务说明，`suffix` 在示例后提出实际问题
- `input_variables` 声明 suffix 中的动态变量，确保模板正确填充
- FewShot 适用于模型对任务理解不足的场景，通过示例引导比纯指令更有效

#### 小结

FewShot 提示模板是提升大模型任务表现的重要工具。通过提供少量示例，模型可以快速理解任务模式，减少对详细指令的依赖。`FewShotPromptTemplate` 将示例管理结构化，使得添加、修改示例变得简单，也为后续的示例选择器（ExampleSelector）等高级功能打下了基础。

### 4.4 模板类的format和invoke方法

LangChain 的提示词模板类提供了两种填充变量的方法：`format()` 和 `invoke()`。虽然两者都能完成变量替换，但返回类型和适用场景有所不同，理解它们的区别对于正确使用模板至关重要。

#### 核心概念

**`format()` 方法**和 **`invoke()` 方法**是模板填充的两种方式，核心区别在于返回类型：

- **`format()`**：返回 `str` 类型，是 Python 字符串格式化的扩展，结果就是纯文本字符串
- **`invoke()`**：返回 `PromptValue` 类型，是 LangChain 的 `Runnable` 接口方法，结果是一个可传递给链的对象

这涉及到 LangChain 的类继承体系：

- `PromptTemplate` 继承自 `RunnableSerializable`
- `RunnableSerializable` 继承自 `Runnable`
- `Runnable` 定义了 `invoke()`、`stream()` 等方法
- `format()` 是 `PromptTemplate` 自身的方法，不涉及 Runnable 体系

#### 代码示例

```python
from langchain_core.prompts import PromptTemplate

template = PromptTemplate.from_template("我的邻居是：{lastname}，最喜欢：{hobby}")

res = template.format(lastname="张大明", hobby="钓鱼")
print(res, type(res))

res2 = template.invoke({"lastname": "周杰轮", "hobby": "唱歌"})
print(res2, type(res2))
```

#### 代码解析

1. **创建模板**：`PromptTemplate.from_template("我的邻居是：{lastname}，最喜欢：{hobby}")` 定义包含两个占位符的模板。

2. **`format()` 方法**：
   - `template.format(lastname="张大明", hobby="钓鱼")` 使用关键字参数填充变量
   - 返回值是 `str` 类型，即 `"我的邻居是：张大明，最喜欢：钓鱼"`
   - 适合只需要纯文本字符串的场景

3. **`invoke()` 方法**：
   - `template.invoke({"lastname": "周杰轮", "hobby": "唱歌"})` 使用字典填充变量
   - 返回值是 `PromptValue` 类型，这是 LangChain 的 Runnable 体系中的对象
   - `PromptValue` 可以通过 `.to_string()` 转为字符串，也可以通过 `.to_messages()` 转为消息列表
   - 适合在 LCEL 链中使用的场景，因为 `invoke()` 是 `Runnable` 接口的标准方法

4. **参数传递方式**：
   - `format()` 使用关键字参数：`format(lastname="张大明", hobby="钓鱼")`
   - `invoke()` 使用字典：`invoke({"lastname": "周杰轮", "hobby": "唱歌"})`

#### 关键要点

- `format()` 返回 `str` 类型，`invoke()` 返回 `PromptValue` 类型
- `format()` 使用关键字参数传值，`invoke()` 使用字典传值
- `invoke()` 是 `Runnable` 接口方法，支持在 LCEL 链中自动流转
- `PromptValue` 可通过 `.to_string()` 转字符串，`.to_messages()` 转消息列表
- 在 LCEL 链中（如 `template | model`），内部使用 `invoke()` 传递数据

#### 小结

`format()` 和 `invoke()` 是模板填充的两种方式，各有适用场景。如果只需要获取填充后的字符串，使用 `format()` 更直接；如果需要在 LCEL 链中使用模板，`invoke()` 是标准方式，因为它是 `Runnable` 接口的一部分，支持链式调用和数据自动流转。理解两者的区别，有助于在实际开发中做出正确选择。

## 第五章：提示词优化案例

### 5.1 金融信息抽取

信息抽取（Information Extraction）是自然语言处理中的核心任务，目标是从非结构化文本中提取出结构化的关键信息。在金融领域，我们经常需要从新闻报道、公告等文本中抽取日期、股票名称、价格、成交量等字段。结合 Few-Shot Prompting 与 JSON 结构化输出，我们可以让大语言模型高效地完成信息抽取任务，并以标准化的 JSON 格式返回结果。本文将详细介绍这一技术的实现方法。

#### 核心概念

**Schema 定义**

Schema（模式）是信息抽取的灵魂，它定义了需要从文本中抽取哪些字段。在本例中，Schema 为 `['日期', '股票名称', '开盘价', '收盘价', '成交量']`，明确了抽取目标。Schema 的设计需要：
- 覆盖业务所需的关键字段
- 字段命名清晰无歧义
- 避免冗余或过于细粒度的字段

**JSON 结构化输出**

要求模型以 JSON 格式输出抽取结果，有以下优势：
- **结构化**：字段与值一一对应，便于程序解析和后续处理
- **标准化**：统一的输出格式降低了下游系统的解析复杂度
- **可验证**：可以通过 JSON Schema 验证输出是否符合预期结构

**缺失值处理**

在实际文本中，并非所有字段都能被抽取到。例如某段新闻可能只提到开盘价而未提及收盘价。通过在提示词中明确指定"如果某些信息不存在，用'原文未提及'表示"，可以：
- 避免模型编造不存在的数据（幻觉问题）
- 区分"字段值为空"和"字段未提及"两种情况
- 为下游系统提供明确的信号，便于进一步处理

**示例数据结构**

每个示例包含两个字段：
- `content`：原始文本内容
- `answers`：期望的抽取结果，以字典形式呈现，键为 Schema 字段，值为抽取结果

这种结构化的示例设计，使模型能够清晰地理解输入文本与输出结果之间的对应关系。

#### 代码示例

```python
from openai import OpenAI
import json

client = OpenAI(
    base_url="http://localhost:11434/v1"
)

schema = ['日期', '股票名称', '开盘价', '收盘价', '成交量']
examples_data = [
    {
        "content": "2023-01-10，股市震荡。股票强大科技A股今日开盘价100人民币，收盘价102人民币，成交量520000手。",
        "answers": {
            "日期": "2023-01-10",
            "股票名称": "强大科技A股",
            "开盘价": "100人民币",
            "收盘价": "102人民币",
            "成交量": "520000"
        }
    },
    {
        "content": "2023-02-15，股市大涨。股票智慧科技A股今日开盘价200人民币，收盘价210人民币。",
        "answers": {
            "日期": "2023-02-15",
            "股票名称": "智慧科技A股",
            "开盘价": "200人民币",
            "收盘价": "210人民币",
            "成交量": "原文未提及"
        }
    },
    {
        "content": "2023-03-20，股市微跌。股票创新科技A股今日开盘价150人民币，成交量300000手。",
        "answers": {
            "日期": "2023-03-20",
            "股票名称": "创新科技A股",
            "开盘价": "150人民币",
            "收盘价": "原文未提及",
            "成交量": "300000"
        }
    }
]
questions = [
    "2025-06-16，股市利好。股票传智教育A股今日开盘价66人民币，收盘价70人民币，成交量800000手。",
    "2025-06-06，股市利好。股票黑马程序员A股今日开盘价200人民币，成交量600000手。"
]

messages = [
    {"role": "system", "content": f"你帮我完成信息抽取，我给你句子，你抽取{schema}信息，按JSON字符串输出，如果某些信息不存在，用'原文未提及'表示，请参考如下示例："}
]

for example in examples_data:
    messages.append({"role": "user", "content": example["content"]})
    messages.append({"role": "assistant", "content": json.dumps(example["answers"], ensure_ascii=False)})

for q in questions:
    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=messages + [{"role": "user", "content": f"按照上述的示例，现在抽取这个句子的信息：{q}"}]
    )
    print(response.choices[0].message.content)
```

#### 代码解析

**1. 定义 Schema**

```python
schema = ['日期', '股票名称', '开盘价', '收盘价', '成交量']
```

Schema 以列表形式定义了需要抽取的所有字段名称，并在 system 消息中通过 f-string 注入，使模型明确知道需要抽取哪些信息。

**2. 构建示例数据**

每个示例包含 `content`（原始文本）和 `answers`（抽取结果字典）。注意第二个和第三个示例中，部分字段的值设为"原文未提及"，这正是缺失值处理的示范——模型通过这些示例学会在信息缺失时返回"原文未提及"而非编造数据。

**3. 构建消息列表**

```python
messages = [
    {"role": "system", "content": f"你帮我完成信息抽取，我给你句子，你抽取{schema}信息，按JSON字符串输出，如果某些信息不存在，用'原文未提及'表示，请参考如下示例："}
]
```

System 消息中包含了三个关键信息：任务描述（信息抽取）、输出格式（JSON 字符串）和缺失值策略（"原文未提及"）。

**4. 注入示例**

```python
for example in examples_data:
    messages.append({"role": "user", "content": example["content"]})
    messages.append({"role": "assistant", "content": json.dumps(example["answers"], ensure_ascii=False)})
```

将每个示例的文本作为 `user` 消息，抽取结果通过 `json.dumps(ensure_ascii=False)` 序列化为 JSON 字符串后作为 `assistant` 消息。`ensure_ascii=False` 确保中文字段名和值正常显示。

**5. 推理抽取**

对于每条待抽取的文本，将完整的示例消息与新的查询拼接后发送给模型。模型会参照示例的模式，输出结构化的 JSON 结果。

#### 关键要点

- **Schema 定义** 是信息抽取的起点，明确了抽取目标，应注入到 system 消息中
- **JSON 结构化输出** 使抽取结果标准化，便于程序解析和下游处理
- **缺失值处理** 使用"原文未提及"标记，有效避免模型幻觉，区分"值为空"和"未提及"
- **示例设计** 应覆盖正常情况和缺失值情况，让模型学会不同的处理策略
- **json.dumps(ensure_ascii=False)** 确保中文在 JSON 字符串中正常显示

#### 小结

Few-Shot Prompting 结合 JSON 结构化输出，为大语言模型的信息抽取任务提供了一种高效且可靠的方案。通过精心设计 Schema、示例数据和缺失值处理策略，我们可以让模型准确地从非结构化文本中提取关键信息，并以标准化的 JSON 格式返回。这种方法无需模型微调，只需通过提示词工程即可实现，具有极高的灵活性和实用性，是金融领域信息抽取任务的首选方案。

### 5.2 金融文本分类

在自然语言处理领域，文本分类是最基础也最常见的任务之一。在金融场景中，我们经常需要将海量文本自动归类到"新闻报道"、"财务报告"、"公司公告"、"分析师报告"等类别中。借助大语言模型的 Few-Shot Prompting 技术，我们无需训练模型，只需在提示词中提供少量示例，即可让模型理解分类规则并完成推理。本文将详细介绍如何利用 Few-Shot Prompting 实现金融文本分类。

#### 核心概念

**Few-Shot Prompting**

Few-Shot Prompting（少样本提示）是一种提示词工程技巧，通过在提示词中提供少量"输入-输出"示例对，引导大语言模型理解任务模式，从而在无需微调模型的情况下完成特定任务。与 Zero-Shot（零样本）相比，Few-Shot 能够显著提升模型在特定领域任务上的准确率。

**System 角色定义分类类别**

在 OpenAI 的 Chat Completions API 中，`system` 角色的消息用于设定模型的行为和角色。通过 system 消息，我们可以：
- 定义模型的角色身份（如"金融专家"）
- 明确分类的类别列表
- 设定兜底策略（如遇到无法判断的文本返回"不清楚类别"）

**User/Assistant 消息构建示例对**

Few-Shot 的核心在于构建"用户输入-助手输出"的对话示例对。每对示例中：
- `user` 消息：展示一段待分类的文本
- `assistant` 消息：展示正确的分类结果

模型通过这些示例学习到文本特征与类别之间的映射关系。

**兜底策略**

在实际应用中，总会遇到不属于任何预定义类别的文本。通过在 system 消息中明确指定兜底类别（如"不清楚类别"），可以让模型在遇到无法判断的文本时给出合理的回复，而非强行归类。

#### 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1"
)

examples_data = {
    '新闻报道': '今日，股市经历了一轮震荡...',
    '财务报告': '本公司年度财务报告显示...',
    '公司公告': '本公司高兴地宣布成功完成最新一轮并购交易...',
    '分析师报告': '最新的行业分析报告指出...'
}
examples_types = ['新闻报道', '财务报道', '公司公告', '分析师报告']

questions = [
    "今日，央行发布公告宣布降低利率...",
    "ABC公司今日发布公告称...",
    "公司资产负债表显示...",
    "最新的分析报告指出...",
    "小明喜欢小新哟"
]

messages = [
    {"role": "system", "content": "你是金融专家，将文本分类为['新闻报道', '财务报道', '公司公告', '分析师报告']，不清楚的分类为'不清楚类别' 下面有示例："},
]

for key, value in examples_data.items():
    messages.append({"role": "user", "content": value})
    messages.append({"role": "assistant", "content": key})

for q in questions:
    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=messages + [{"role": "user", "content": f"按照示例，回答这段文本的分类类别：{q}"}]
    )
    print(response.choices[0].message.content)
```

#### 代码解析

**1. 初始化客户端**

```python
client = OpenAI(base_url="http://localhost:11434/v1")
```

使用本地部署的 Ollama 服务作为推理后端，通过兼容 OpenAI 的 API 接口进行调用。`base_url` 指向本地 Ollama 服务的地址。

**2. 准备示例数据**

`examples_data` 是一个字典，键为分类类别，值为该类别下的典型文本。这些示例将作为 Few-Shot 的示范数据注入到提示词中，帮助模型理解每个类别的文本特征。

**3. 构建消息列表**

首先添加 `system` 消息，定义模型角色、分类类别列表以及兜底策略。然后遍历 `examples_data`，将每个示例拆分为 `user` 和 `assistant` 消息对，依次追加到消息列表中。这样模型在推理时就能"看到"这些示例，从而理解分类规则。

**4. 逐条推理**

对于每条待分类的问题文本，将已有的示例消息与新的 `user` 消息拼接后发送给模型。注意这里使用 `messages + [...]` 的方式，不会修改原始的 `messages` 列表，确保每次推理都基于相同的示例上下文。

**5. 兜底验证**

最后一条问题 `"小明喜欢小新哟"` 与金融领域无关，模型应返回"不清楚类别"，验证兜底策略是否生效。

#### 关键要点

- **Few-Shot Prompting** 通过在提示词中嵌入少量示例，使模型在不微调的情况下学会特定任务
- **System 消息** 是设定模型行为的关键，应明确角色、类别和兜底策略
- **示例对** 以 `user`/`assistant` 交替排列，模拟对话过程，帮助模型理解输入输出的映射关系
- **兜底策略** 是生产环境中的必要设计，避免模型对未知文本强行归类
- **消息拼接** 使用 `messages + [...]` 方式，保证每次推理的上下文一致性

#### 小结

Few-Shot Prompting 是一种简单而高效的提示词优化技术，特别适用于文本分类等结构化输出任务。通过精心设计 system 消息和示例对，我们可以在不训练模型的前提下，让大语言模型准确理解分类规则并完成推理。同时，兜底策略的引入使得系统在面对边界情况时也能给出合理的响应，提升了系统的鲁棒性和实用性。

### 5.3 金融文本匹配判断

文本匹配（Text Matching）是自然语言处理中的基础任务，旨在判断两段文本在语义上是否相关或相似。在金融领域，文本匹配可用于信息去重、关联分析、问答匹配等场景。通过 Few-Shot Prompting 技术，结合分隔符技巧和正负示例设计，我们可以让大语言模型高效地完成文本匹配判断任务。本文将详细介绍这一方法的实现。

#### 核心概念

**文本匹配任务**

文本匹配的核心目标是判断两段文本之间的语义关系。与关键词匹配不同，文本匹配关注的是语义层面的相似性。例如：
- "公司ABC发布了季度财报，显示盈利增长" 与 "财报披露，公司ABC利润上升" 语义匹配
- "央行降息，刺激经济增长" 与 "新能源技术的创新" 语义不匹配

**分隔符技巧**

在提示词中使用分隔符（如方括号 `[]`）将两段文本明确区分，有以下好处：
- **边界清晰**：模型能够准确识别每段文本的起止位置
- **避免混淆**：防止两段文本内容相互干扰
- **格式统一**：示例和查询使用相同的分隔格式，降低模型的解析难度

在本例中，使用格式 `句子1：[文本1]，句子2：[文本2]` 来组织输入，方括号清晰地标示了每段文本的边界。

**正负示例设计**

Few-Shot 的效果很大程度上取决于示例的质量。在文本匹配任务中，需要同时提供正例（匹配）和负例（不匹配）：
- **正例**：让模型学习什么样的文本对是"匹配"的，理解语义等价、同义替换等关系
- **负例**：让模型学习什么样的文本对是"不匹配"的，避免模型过度宽松地判断匹配

正负例的平衡设计，有助于模型建立准确的判断边界。

**二分类输出**

文本匹配判断是一个典型的二分类任务，输出为"是"或"不是"。简洁的输出格式有以下优势：
- **明确无歧义**：模型不需要生成复杂的长文本，降低出错概率
- **便于解析**：下游系统可以直接根据输出字符串进行判断
- **减少幻觉**：简短的分类输出比开放式生成更可控

#### 代码示例

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1"
)

examples_data = {
    "是": [
        ("公司ABC发布了季度财报，显示盈利增长。", "财报披露，公司ABC利润上升。"),
        ("公司ITCAST发布了年度财报，显示盈利大幅度增长。", "财报披露，公司ITCAST更赚钱了。")
    ],
    "不是": [
        ("黄金价格下跌，投资者抛售。", "外汇市场交易额创下新高。"),
        ("央行降息，刺激经济增长。", "新能源技术的创新。")
    ]
}

questions = [
    ("利率上升，影响房地产市场。", "高利率对房地产有一定的冲击。"),
    ("油价大幅度下跌，能源公司面临挑战。", "未来智能城市的建设趋势越加明显。"),
    ("股票市场今日大涨，投资者乐观。", "持续上涨的市场让投资者感到满意。")
]

messages = [
    {"role": "system", "content": f"你帮我完成文本匹配，我给你2个句子，被[]包围，你判断它们是否匹配，回答是或不是，请参考如下示例："},
]

for key, value in examples_data.items():
    for t in value:
        messages.append({"role": "user", "content": f"句子1：[{t[0]}]，句子2：[{t[1]}]"})
        messages.append({"role": "assistant", "content": key})

for q in questions:
    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=messages + [{"role": "user", "content": f"句子1：[{q[0]}]，句子2：[{q[1]}]"}]
    )
    print(response.choices[0].message.content)
```

#### 代码解析

**1. 组织示例数据**

```python
examples_data = {
    "是": [
        ("公司ABC发布了季度财报，显示盈利增长。", "财报披露，公司ABC利润上升。"),
        ("公司ITCAST发布了年度财报，显示盈利大幅度增长。", "财报披露，公司ITCAST更赚钱了。")
    ],
    "不是": [
        ("黄金价格下跌，投资者抛售。", "外汇市场交易额创下新高。"),
        ("央行降息，刺激经济增长。", "新能源技术的创新。")
    ]
}
```

示例数据以字典形式组织，键为分类标签（"是"或"不是"），值为文本对列表。正例展示了语义相同但表述不同的文本对，负例展示了语义无关的文本对。这种正负例平衡的设计，帮助模型建立准确的判断标准。

**2. 构建消息列表**

```python
messages = [
    {"role": "system", "content": f"你帮我完成文本匹配，我给你2个句子，被[]包围，你判断它们是否匹配，回答是或不是，请参考如下示例："},
]
```

System 消息中明确了三个要点：任务描述（文本匹配）、输入格式（被 `[]` 包围的两个句子）和输出格式（回答"是"或"不是"）。

**3. 注入示例**

```python
for key, value in examples_data.items():
    for t in value:
        messages.append({"role": "user", "content": f"句子1：[{t[0]}]，句子2：[{t[1]}]"})
        messages.append({"role": "assistant", "content": key})
```

遍历示例数据，将每对文本用方括号包裹后作为 `user` 消息，对应的标签作为 `assistant` 消息。注意正例和负例交替出现，使模型同时学习匹配和不匹配的模式。

**4. 推理判断**

```python
for q in questions:
    response = client.chat.completions.create(
        model="qwen3:4b",
        messages=messages + [{"role": "user", "content": f"句子1：[{q[0]}]，句子2：[{q[1]}]"}]
    )
    print(response.choices[0].message.content)
```

对于每对待判断的文本对，使用与示例相同的格式发送给模型。模型会参照示例中的判断模式，输出"是"或"不是"。

#### 关键要点

- **分隔符技巧** 使用 `[]` 等符号明确标示文本边界，帮助模型准确区分两段输入
- **正负示例平衡** 同时提供匹配和不匹配的示例，帮助模型建立准确的判断边界
- **二分类输出** 简洁的"是/不是"输出格式，降低模型出错概率，便于下游解析
- **格式一致性** 示例和查询使用相同的输入格式，确保模型推理时的行为一致
- **语义匹配** 正例中的文本对展示了同义替换、不同表述等语义等价关系

#### 小结

文本匹配判断是金融 NLP 应用中的常见任务，通过 Few-Shot Prompting 结合分隔符技巧和正负示例设计，我们可以高效地实现这一功能。关键在于：使用分隔符清晰标示输入边界，平衡设计正负示例以建立准确的判断标准，以及采用简洁的二分类输出格式。这种方法无需模型微调，灵活性强，适用于各类文本匹配场景，是提示词工程在语义理解任务中的典型应用。

## 第六章：输出解析器

### 6.1 StrOutputParser解析器

在LangChain的链式调用中，大语言模型的输出通常是`AIMessage`对象，而非纯文本字符串。`StrOutputParser`的作用就是将`AIMessage`对象转换为纯字符串，使得链中的后续组件能够更方便地处理输出结果。本文将详细介绍`StrOutputParser`的使用方法和应用场景。

#### 核心概念

`StrOutputParser`是LangChain中最简单也是最常用的输出解析器之一。它的核心功能是从`AIMessage`对象中提取`.content`属性，将其转换为Python的`str`类型。

为什么需要这个解析器？因为大语言模型的输出类型是`AIMessage`，它包含了丰富的元信息（如角色、函数调用等），但在很多场景下，我们只需要其中的文本内容。`StrOutputParser`正是为此而设计的。

`StrOutputParser`的关键特性：

- **提取`.content`**：从`AIMessage`对象中提取文本内容部分
- **类型转换**：将输出从`AIMessage`类型转换为`str`类型
- **链式串联**：转换后的字符串可以作为下一个模型或组件的输入，实现多模型串联

#### 代码示例

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_models.tongyi import ChatTongyi

parser = StrOutputParser()
model = ChatTongyi(model="qwen3-max")
prompt = PromptTemplate.from_template(
    "我邻居姓：{lastname}，刚生了{gender}，请起名，仅告知我名字无需其它内容。"
)

chain = prompt | model | parser | model | parser

res: str = chain.invoke({"lastname": "张", "gender": "女儿"})
print(res)
print(type(res))
```

#### 代码解析

1. **初始化组件**：创建`StrOutputParser`解析器、`ChatTongyi`模型和`PromptTemplate`提示词模板。

2. **构建链**：`prompt | model | parser | model | parser`，这条链的工作流程为：
   - `prompt`：将输入变量填充到模板中，生成`PromptValue`
   - `model`：调用大模型，返回`AIMessage`
   - `parser`：提取`AIMessage.content`，得到`str`（第一次起名结果）
   - `model`：将字符串作为输入再次调用大模型
   - `parser`：再次提取`AIMessage.content`，得到最终的`str`

3. **类型验证**：`print(type(res))`会输出`<class 'str'>`，确认经过`StrOutputParser`处理后，输出确实是纯字符串类型。

4. **多模型串联**：通过在两个模型之间插入`StrOutputParser`，实现了"起名→再处理"的两阶段流程，第一个模型负责起名，第二个模型可以基于名字做进一步处理。

#### 关键要点

- `StrOutputParser`从`AIMessage`对象中提取`.content`属性，返回纯字符串
- 解析后的结果类型为`str`，便于后续组件直接使用
- 在链中使用`StrOutputParser`可以实现多个模型的串联调用
- `StrOutputParser`是最基础的输出解析器，也是构建复杂链的常用组件
- 流式调用`stream()`同样支持，会逐字符返回字符串片段

#### 小结

`StrOutputParser`虽然功能简单，但在LangChain链式编程中扮演着不可或缺的角色。它解决了`AIMessage`到`str`的类型转换问题，使得不同组件之间的数据流转更加顺畅。特别是在多模型串联的场景下，`StrOutputParser`作为中间桥梁，确保了数据格式的兼容性。掌握`StrOutputParser`的使用，是构建LangChain应用的基本功。

### 6.2 JsonOutputParser解析器

在实际开发中，我们经常需要大语言模型返回结构化的JSON数据，以便后续程序处理。`JsonOutputParser`正是为此而生，它能将模型输出的JSON字符串自动解析为Python字典，并支持字典的键自动注入到下一个提示词模板中。本文将深入讲解`JsonOutputParser`的使用方法和数据流转机制。

#### 核心概念

`JsonOutputParser`是LangChain提供的输出解析器之一，专门用于将模型输出的JSON格式字符串解析为Python的`dict`对象。

与`StrOutputParser`的不同之处在于：
- `StrOutputParser`输出`str`类型，后续组件收到的是纯文本
- `JsonOutputParser`输出`dict`类型，后续组件收到的是结构化数据

`JsonOutputParser`的强大之处在于与`PromptTemplate`的联动：当解析后的`dict`作为输入传递给下一个`PromptTemplate`时，字典的键会自动匹配模板中的变量占位符，实现数据的自动注入。

数据流转过程：`AIMessage` → `dict`（JsonOutputParser解析） → `PromptValue`（字典键注入模板） → `AIMessage` → `str`

#### 代码示例

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

#### 代码解析

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

#### 关键要点

- `JsonOutputParser`将模型输出的JSON字符串解析为Python的`dict`对象
- 解析后的`dict`的键会自动注入到下一个`PromptTemplate`的对应变量中
- 提示词中需要明确要求模型返回JSON格式，并指定具体的key名称
- 完整数据流：`AIMessage` → `dict` → `PromptValue` → `AIMessage` → `str`
- `JsonOutputParser`与`StrOutputParser`可以组合使用，各司其职

#### 小结

`JsonOutputParser`是构建多步骤链式调用的利器。它不仅将非结构化的文本输出转化为结构化的字典数据，更重要的是实现了字典键到模板变量的自动映射，让数据在不同组件之间无缝流转。这种"JSON解析→自动注入"的机制，使得我们可以轻松构建"信息提取→信息处理"的多阶段AI应用，是RAG和智能体开发中的重要工具。

### 6.3 Json的基础使用

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，因其简洁、易读的特点，已成为前后端数据交互和配置文件存储的事实标准。在 Python 中，标准库 `json` 模块提供了完整的 JSON 序列化与反序列化支持，使我们能够轻松地在 Python 对象与 JSON 字符串之间进行转换。本文将系统介绍 JSON 在 Python 中的基础使用方法。

#### 核心概念

**JSON 序列化（json.dumps）**

序列化是指将 Python 对象转换为 JSON 格式字符串的过程。`json.dumps()` 是最常用的序列化函数，其名称中的 `dumps` 意为"dump string"，即输出为字符串。

关键参数：
- `ensure_ascii`：默认为 `True`，会将非 ASCII 字符（如中文）转义为 Unicode 编码。设置为 `False` 时，中文字符将原样输出，这在处理中文数据时尤为重要。
- `indent`：设置缩进空格数，用于美化输出。
- `sort_keys`：设置为 `True` 时，按键名字母顺序排序输出。

**JSON 反序列化（json.loads）**

反序列化是指将 JSON 格式字符串转换回 Python 对象的过程。`json.loads()` 是最常用的反序列化函数，其名称中的 `loads` 意为"load string"，即从字符串加载。

**数据类型映射**

JSON 与 Python 之间的数据类型存在如下对应关系：

| JSON 类型 | Python 类型 |
|-----------|------------|
| object    | dict       |
| array     | list       |
| string    | str        |
| number    | int/float  |
| true      | True       |
| false     | False      |
| null      | None       |

**字典与列表结构**

JSON 最常用的两种数据结构：
- **对象（object）**：对应 Python 的字典（dict），使用花括号 `{}`，由键值对组成
- **数组（array）**：对应 Python 的列表（list），使用方括号 `[]`，由有序元素组成

#### 代码示例

```python
import json

d = {
    "name": "周杰轮",
    "age": 11,
    "gender": "男"
}

s = json.dumps(d, ensure_ascii=False)
print(s)

l = [
    {"name": "周杰轮", "age": 11, "gender": "男"},
    {"name": "蔡依临", "age": 12, "gender": "女"},
    {"name": "小明", "age": 16, "gender": "男"}
]

print(json.dumps(l, ensure_ascii=False))

json_str = '{"name": "周杰轮", "age": 11, "gender": "男"}'
json_array_str = '[{"name": "周杰轮", "age": 11, "gender": "男"}, {"name": "蔡依临", "age": 12, "gender": "女"}, {"name": "小明", "age": 16, "gender": "男"}]'

res_dict = json.loads(json_str)
print(res_dict, type(res_dict))

res_list = json.loads(json_array_str)
print(res_list, type(res_list))
```

#### 代码解析

**1. 字典序列化**

```python
d = {"name": "周杰轮", "age": 11, "gender": "男"}
s = json.dumps(d, ensure_ascii=False)
```

将 Python 字典 `d` 序列化为 JSON 字符串。`ensure_ascii=False` 确保中文字符"周杰轮"和"男"不会被转义为 `\uXXXX` 格式，而是原样输出。输出结果为：`{"name": "周杰轮", "age": 11, "gender": "男"}`

**2. 列表序列化**

```python
l = [
    {"name": "周杰轮", "age": 11, "gender": "男"},
    {"name": "蔡依临", "age": 12, "gender": "女"},
    {"name": "小明", "age": 16, "gender": "男"}
]
print(json.dumps(l, ensure_ascii=False))
```

将包含多个字典的 Python 列表序列化为 JSON 数组字符串。JSON 数组用方括号 `[]` 包裹，每个元素是一个 JSON 对象。`ensure_ascii=False` 同样确保中文正常显示。

**3. JSON 字符串反序列化为字典**

```python
json_str = '{"name": "周杰轮", "age": 11, "gender": "男"}'
res_dict = json.loads(json_str)
print(res_dict, type(res_dict))
```

将 JSON 对象字符串反序列化为 Python 字典。`json.loads()` 会自动识别 JSON 中的数据类型并转换为对应的 Python 类型。输出结果为字典对象，`type()` 验证其类型为 `<class 'dict'>`。

**4. JSON 数组字符串反序列化为列表**

```python
json_array_str = '[{"name": "周杰轮", ...}, ...]'
res_list = json.loads(json_array_str)
print(res_list, type(res_list))
```

将 JSON 数组字符串反序列化为 Python 列表。列表中的每个元素都是字典对象，`type()` 验证其类型为 `<class 'list'>`。

#### 关键要点

- **json.dumps()** 将 Python 对象序列化为 JSON 字符串，**json.loads()** 将 JSON 字符串反序列化为 Python 对象
- **ensure_ascii=False** 是处理中文数据时的必备参数，否则中文字符会被转义为 Unicode 编码
- JSON 对象对应 Python 字典（dict），JSON 数组对应 Python 列表（list）
- 序列化与反序列化是互逆操作，可以无损地完成 Python 对象与 JSON 字符串之间的转换
- `json` 模块是 Python 标准库的一部分，无需额外安装

#### 小结

JSON 是现代软件开发中最常用的数据交换格式之一，Python 的 `json` 模块提供了简洁高效的序列化与反序列化接口。掌握 `json.dumps()` 和 `json.loads()` 的基本用法，特别是 `ensure_ascii=False` 参数的使用，是处理中文 JSON 数据的基础。在实际的大模型应用开发中，JSON 更是结构化输出的核心格式，后续的信息抽取等任务都将依赖 JSON 来组织数据。

## 第七章：LCEL链式调用

### 7.1 Chain的基础使用

LCEL（LangChain Expression Language）是 LangChain 的核心设计理念，通过管道符 `|` 将多个组件串联成处理链。本文在前文 `ChatPromptTemplate` 的基础上，介绍如何使用 LCEL 构建完整的聊天链，并实现流式输出。

#### 核心概念

**LCEL 链式调用**的核心思想是：将复杂的数据处理流程拆分为多个独立组件，通过管道符 `|` 串联，数据自动从前一个组件流向后一个组件。每个组件都实现了 `Runnable` 接口，支持 `invoke()`、`stream()` 等统一方法。

关键要素：

- **管道符 `|`**：LCEL 的核心语法，`a | b` 表示将 a 的输出作为 b 的输入
- **`template | model`**：将提示词模板和模型串联，自动完成模板填充和模型调用
- **自动数据流转**：链内部自动传递数据，无需手动调用中间步骤
- **`stream()` 支持**：链也支持流式输出，与单个组件的 `stream()` 用法一致

#### 代码示例

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_models.tongyi import ChatTongyi

chat_prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一个边塞诗人，可以作诗。"),
        MessagesPlaceholder("history"),
        ("human", "请再来一首唐诗"),
    ]
)

history_data = [
    ("human", "你来写一个唐诗"),
    ("ai", "床前明月光，疑是地上霜，举头望明月，低头思故乡"),
    ("human", "好诗再来一个"),
    ("ai", "锄禾日当午，汗滴禾下锄，谁知盘中餐，粒粒皆辛苦"),
]

model = ChatTongyi(model="qwen3-max")

chain = chat_prompt_template | model

for chunk in chain.stream({"history": history_data}):
    print(chunk.content, end="", flush=True)
```

#### 代码解析

1. **创建提示词模板**：与前一篇文章相同，使用 `ChatPromptTemplate.from_messages()` 创建包含系统设定、历史占位符和用户提问的模板。

2. **准备对话历史**：`history_data` 包含两轮历史对话，与模板中的 `MessagesPlaceholder("history")` 对应。

3. **创建模型实例**：`ChatTongyi(model="qwen3-max")` 创建聊天模型实例。

4. **构建链**：`chain = chat_prompt_template | model` 使用管道符将模板和模型串联。这等价于创建了一个 `RunnableSequence`，数据流为：
   - 输入 `{"history": history_data}` → 模板填充 → 生成消息列表 → 模型调用 → 返回响应

5. **流式调用链**：`chain.stream({"history": history_data})` 对整个链进行流式调用。链内部自动完成：
   - 将 `{"history": history_data}` 传给模板，填充生成消息列表
   - 将消息列表传给模型，启动流式生成
   - 返回流式迭代器，每个 `chunk` 通过 `.content` 获取文本

6. **与手动调用的对比**：不使用链时，需要手动分步操作：
   ```python
   prompt_value = chat_prompt_template.invoke({"history": history_data})
   res = model.stream(input=prompt_value)
   ```
   使用链后，一行代码即可完成，且支持 `stream()` 和 `invoke()` 等所有 Runnable 方法。

#### 关键要点

- LCEL 管道符 `|` 将组件串联成链，数据自动流转
- `template | model` 是最基本的链结构，自动完成模板填充和模型调用
- 链支持 `invoke()`、`stream()` 等 Runnable 接口的所有方法
- 流式输出时，`chain.stream()` 返回的每个 chunk 需通过 `.content` 获取文本
- 链可以继续扩展，如 `template | model | output_parser`，实现更复杂的处理流程

#### 小结

LCEL 链式调用是 LangChain 的核心编程范式，它将组件组合变得简洁直观。通过管道符 `|`，模板、模型、输出解析器等组件可以像搭积木一样自由组合，数据在链中自动流转。这种设计不仅简化了代码，还使得组件的替换和扩展变得非常灵活，是构建复杂 AI 应用的基础。

### 7.2 Runnable接口

在LangChain的架构设计中，`Runnable`接口是最核心的抽象之一。它为所有组件（Prompt、Model、Parser等）提供了统一的调用协议，使得不同类型的组件能够无缝地组合成链（Chain）。本文将深入探讨Runnable接口的设计理念和核心方法。

#### 核心概念

`Runnable`接口是LangChain中所有可执行组件的基类，它定义了一套标准化的调用协议。无论是提示词模板、大语言模型还是输出解析器，都实现了这个接口，从而具备了统一的行为模式。

Runnable接口的核心方法包括：

- **`invoke()`**：同步调用，接收单个输入，返回单个输出。这是最基础的执行方式。
- **`stream()`**：流式调用，逐块返回输出结果，适用于需要实时展示生成内容的场景。
- **`ainvoke()`**：异步版本的`invoke()`，适用于异步编程环境，避免阻塞。
- **`astream()`**：异步版本的`stream()`，结合了流式输出和异步执行的优势。

通过`|`操作符，多个Runnable组件可以串联组合，形成`RunnableSequence`类型的链。这种管道式的设计灵感来源于Unix管道，让数据在组件之间自然流动。

#### 代码示例

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.llms.tongyi import Tongyi

prompt = PromptTemplate.from_template("你是一个AI助手")
model = Tongyi(model="qwen3-max")

chain = prompt | model | prompt | model
chain.invoke()
chain.stream()
print(type(chain))
```

#### 代码解析

1. **创建Prompt和Model**：使用`PromptTemplate.from_template()`创建提示词模板，使用`Tongyi`初始化通义千问模型实例。

2. **链式组合**：通过`|`操作符将prompt和model交替串联，形成`prompt | model | prompt | model`的链式结构。这种写法简洁直观，前一个组件的输出自动成为下一个组件的输入。

3. **调用方式**：
   - `chain.invoke()`：同步执行整条链，等待完整结果返回。
   - `chain.stream()`：流式执行，逐步返回生成的内容，适合需要实时反馈的场景。

4. **类型检查**：`print(type(chain))`会输出`<class 'langchain_core.runnables.base.RunnableSequence'>`，说明通过`|`操作符组合的链本质上是一个`RunnableSequence`对象。

#### 关键要点

- LangChain中所有核心组件（Prompt、Model、Parser等）都实现了`Runnable`接口
- `Runnable`接口提供`invoke()`、`stream()`、`ainvoke()`、`astream()`四种调用方法
- 通过`|`操作符可以将多个Runnable组件串联组合成链
- 组合后的链类型为`RunnableSequence`，它本身也实现了`Runnable`接口
- `RunnableSequence`支持嵌套组合，即链可以作为更大链的一部分

#### 小结

`Runnable`接口是LangChain实现组件化编程的基石。通过统一的调用协议和管道式组合语法，开发者可以像搭积木一样灵活地构建复杂的AI应用。理解`Runnable`接口的工作原理，是掌握LangChain框架的关键一步。无论是简单的单步调用，还是复杂的多组件链式处理，`Runnable`都提供了一致且优雅的编程体验。

### 7.3 RunnableLambda的基础使用

LangChain的链式调用虽然强大，但有时我们需要在链中插入自定义的数据处理逻辑，比如格式转换、数据清洗等。`RunnableLambda`正是为此而设计，它可以将任意Python函数包装为`Runnable`对象，使其能够融入链式调用流程。本文将介绍`RunnableLambda`的基础使用方法。

#### 核心概念

`RunnableLambda`是LangChain提供的一个工具类，它可以将普通的Python函数（包括lambda表达式）包装为`Runnable`对象。这样，自定义函数就能像Prompt、Model、Parser一样，通过`|`操作符参与链式组合。

在实际使用中，Lambda表达式会被自动包装为`RunnableLambda`，无需显式导入和创建。这意味着你可以直接在链中使用lambda表达式，LangChain会自动处理类型转换。

`RunnableLambda`的典型应用场景：

- **数据格式转换**：在链中转换数据格式，如将`AIMessage`转为字典
- **自定义处理逻辑**：插入业务逻辑，如数据过滤、格式化等
- **桥接不兼容组件**：当两个组件的数据格式不匹配时，用自定义函数做中间转换

#### 代码示例

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

#### 代码解析

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

#### 关键要点

- `RunnableLambda`可以将Python函数包装为`Runnable`对象，使其能参与链式调用
- Lambda表达式在链中会被自动包装为`RunnableLambda`，无需显式创建
- 常用于链中的数据格式转换，如将`AIMessage`转为字典以匹配下一个模板的变量
- 自定义函数的返回值会作为下一个组件的输入
- `RunnableLambda`保持了链的`invoke()`/`stream()`等调用能力

#### 小结

`RunnableLambda`为LangChain的链式调用提供了极大的灵活性。当标准组件无法满足数据处理需求时，我们可以通过自定义函数来桥接不同组件之间的数据格式差异。本文示例中，lambda表达式将`AIMessage`转换为字典，实现了与`JsonOutputParser`类似的效果，但更加灵活可控。掌握`RunnableLambda`的使用，能够让我们在构建复杂链时游刃有余，应对各种数据转换场景。

### 7.4 RunnablePassthrough的使用

在前一篇文章中，我们通过手动方式实现了RAG的基础流程，代码虽然清晰但略显冗长。本文将介绍如何使用`RunnablePassthrough`和`as_retriever()`，以LCEL（LangChain Expression Language）的标准风格构建优雅的RAG链，实现自动化的检索-注入-生成流程。

#### 核心概念

**RunnablePassthrough**：LangChain提供的特殊Runnable组件，它的功能是直接将输入原样传递到输出，不做任何转换。在RAG链中，它用于将用户的原始查询同时传递给检索器和提示词模板。

**as_retriever()**：向量存储的方法，将向量存储转换为检索器（Retriever）对象。检索器是一个`Runnable`，可以参与链式调用。与`similarity_search()`不同，检索器返回的是`Document`对象列表，而非普通列表。

**search_kwargs参数**：`as_retriever(search_kwargs={"k": 2})`指定检索返回的文档数量，等价于`similarity_search(query, k=2)`。

**字典构造的并行数据流**：在LCEL中，可以使用字典语法构建并行数据流：
```python
{"input": RunnablePassthrough(), "context": retriever | format_func}
```
这意味着输入数据会同时流向两条路径：
- `input`路径：通过`RunnablePassthrough`原样传递用户查询
- `context`路径：通过检索器和格式化函数获取参考资料

**format_func**：自定义函数，将检索器返回的`Document`列表格式化为字符串，以便注入提示词模板。

#### 代码示例

```python
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document
from langchain_core.runnables import RunnablePassthrough
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaEmbeddings

model = OllamaLLM(model="deepseek-r1:7b")
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "以我提供的已知参考资料为主，简洁和专业的回答用户问题。参考资料:{context}。"),
        ("user", "用户提问：{input}")
    ]
)

vector_store = InMemoryVectorStore(embedding=OllamaEmbeddings(model="nomic-embed-text:latest"))
vector_store.add_texts(
    ["减肥就是要少吃多练", "在减脂期间吃东西很重要,清淡少油控制卡路里摄入并运动起来", "跑步是很好的运动哦"])

input_text = "怎么减肥？"

retriever = vector_store.as_retriever(search_kwargs={"k": 2})

def format_func(docs: list[Document]):
    if not docs:
        return "无相关参考资料"
    formatted_str = "["
    for doc in docs:
        formatted_str += doc.page_content
    formatted_str += "]"
    return formatted_str

chain = (
    {"input": RunnablePassthrough(), "context": retriever | format_func}
    | prompt | model | StrOutputParser()
)

res = chain.invoke(input_text)
print(res)
```

#### 代码解析

1. **初始化组件**：使用Ollama本地模型（`deepseek-r1:7b`）和本地嵌入模型（`nomic-embed-text`），实现完全本地化的RAG。

2. **创建检索器**：`vector_store.as_retriever(search_kwargs={"k": 2})`将向量存储转换为检索器，检索最相关的2个文档。

3. **定义格式化函数**：`format_func`将`Document`列表转换为字符串格式。如果检索结果为空，返回"无相关参考资料"作为兜底。

4. **构建RAG链**：
   ```python
   {"input": RunnablePassthrough(), "context": retriever | format_func}
   | prompt | model | StrOutputParser()
   ```
   - 字典构造：输入字符串同时流向两条路径
     - `input`：`RunnablePassthrough()`原样传递用户查询
     - `context`：`retriever | format_func`先检索文档，再格式化为字符串
   - 字典输出自动匹配`prompt`模板中的`{input}`和`{context}`变量
   - 后续通过`model`生成回答，`StrOutputParser`转为字符串

5. **调用方式**：`chain.invoke(input_text)`直接传入查询字符串，链自动完成检索、注入、生成的全流程。

#### 关键要点

- `RunnablePassthrough`将输入原样传递，用于在并行数据流中传递用户查询
- `as_retriever()`将向量存储转换为检索器，支持`search_kwargs`配置检索参数
- 字典语法`{"key": runnable}`构建并行数据流，不同路径同时处理输入
- `format_func`将`Document`列表格式化为字符串，桥接检索器和提示词模板
- LCEL风格的RAG链将检索、注入、生成整合为一条声明式链，代码简洁优雅

#### 小结

`RunnablePassthrough`是构建LCEL风格RAG链的关键组件。通过字典语法构建并行数据流，我们实现了"用户查询同时流向检索器和提示词"的优雅设计。相比手动方式，LCEL风格的RAG链将整个流程声明为一条链，代码更简洁、更易维护。这是LangChain官方推荐的RAG实现方式，也是构建复杂RAG应用的基础模式。掌握这种模式后，可以进一步扩展，添加重排序、多路检索等高级功能。

### 7.5 Python的或运算符重写

在前面的文章中，我们频繁使用了 LangChain 的 LCEL 管道符 `|` 来串联组件。这个管道符看似神奇，实际上它利用了 Python 的运算符重写机制。本文通过自定义类模拟 LCEL 的管道符实现，揭示其底层原理。

#### 核心概念

Python 允许类通过定义特殊方法（魔术方法）来重写内置运算符的行为。LCEL 的管道符 `|` 正是利用了 `__or__` 魔术方法：

- **`__or__` 方法**：当对象出现在 `|` 运算符左侧时自动调用，`a | b` 等价于 `a.__or__(b)`
- **链式调用原理**：`a | b | c` 等价于 `(a | b) | c`，即先计算 `a.__or__(b)` 得到中间结果，再调用 `中间结果.__or__(c)`
- **RunnableSequence**：LangChain 中 `|` 运算的结果是 `RunnableSequence` 对象，它也实现了 `__or__` 方法，因此可以继续链式拼接

通过自定义 `Test` 类和 `MySequence` 类，我们可以模拟这一机制。

#### 代码示例

```python
class Test(object):
    def __init__(self, name):
        self.name = name

    def __or__(self, other):
        return MySequence(self, other)

    def __str__(self):
        return self.name


class MySequence(object):
    def __init__(self, *args):
        self.sequence = []
        for arg in args:
            self.sequence.append(arg)

    def __or__(self, other):
        self.sequence.append(other)
        return self

    def run(self):
        for i in self.sequence:
            print(i)


if __name__ == '__main__':
    a = Test('a')
    b = Test('b')
    c = Test('c')
    e = Test('e')
    f = Test('f')
    g = Test('g')

    d = a | b | c | e | f | g
    d.run()
    print(type(d))
```

#### 代码解析

1. **Test 类**：模拟 LangChain 中的 Runnable 组件（如 PromptTemplate、Model 等）。
   - `__init__`：初始化名称属性
   - `__or__`：重写 `|` 运算符，当 `Test` 对象出现在 `|` 左侧时，创建 `MySequence` 对象并返回
   - `__str__`：返回名称，方便打印

2. **MySequence 类**：模拟 LangChain 中的 `RunnableSequence`，管理链式组合的组件序列。
   - `__init__`：接收任意数量的组件，存入 `self.sequence` 列表
   - `__or__`：重写 `|` 运算符，将新组件追加到序列中，返回 `self`（实现链式拼接）
   - `run`：按顺序执行序列中的所有组件

3. **链式调用过程**：`d = a | b | c | e | f | g` 的执行过程：
   - `a | b` → 调用 `a.__or__(b)` → 返回 `MySequence(a, b)`
   - `MySequence(a, b) | c` → 调用 `MySequence.__or__(c)` → 追加 c，返回 `self`
   - 依此类推，最终 `d` 是包含 `[a, b, c, e, f, g]` 的 `MySequence` 对象

4. **运行结果**：`d.run()` 依次打印 `a b c e f g`，`type(d)` 输出 `<class '__main__.MySequence'>`。

#### 关键要点

- Python 的 `__or__` 魔术方法重写了 `|` 运算符，`a | b` 等价于 `a.__or__(b)`
- 链式调用 `a | b | c` 依赖运算符的左结合性，等价于 `(a | b) | c`
- `MySequence` 的 `__or__` 方法返回 `self`，使得链可以无限拼接
- LangChain 的 `RunnableSequence` 就是这种模式的工程实现，还支持 `invoke()`、`stream()` 等方法
- 理解运算符重写有助于深入理解 LCEL 的设计思想和调试链式调用问题

#### 小结

LCEL 管道符的底层原理并不复杂，它利用了 Python 的运算符重写机制。`__or__` 方法让对象可以自定义 `|` 运算的行为，`RunnableSequence` 的 `__or__` 方法返回 `self` 实现链式拼接。理解这一原理，不仅能帮助我们更好地使用 LCEL，也为自定义 Runnable 组件、调试链式调用问题提供了理论基础。

## 第八章：文档加载

### 8.1 TextLoader和文档分割器

在RAG应用中，加载原始文档只是第一步。由于大语言模型的上下文窗口有限，我们需要将长文档分割成适当大小的文本块，才能有效地进行向量化存储和检索。本文将介绍`TextLoader`文本加载器和`RecursiveCharacterTextSplitter`递归字符分割器的使用方法。

#### 核心概念

**TextLoader**：LangChain中最简单的文档加载器，用于加载纯文本文件（.txt）。它将整个文件内容读取为一个`Document`对象。

**RecursiveCharacterTextSplitter**：递归字符文本分割器，是LangChain中最常用的文本分割工具。它的工作原理是：

1. 按照分隔符优先级依次尝试分割文本
2. 先用第一个分隔符（如`\n\n`）分割，如果块仍然过大，再用下一个分隔符（如`\n`）继续分割
3. 递归执行，直到所有文本块的大小都满足要求

**核心参数**：
- `chunk_size`：文本块的最大字符数，控制每个分割块的大小
- `chunk_overlap`：相邻块之间的重叠字符数，确保上下文连续性
- `separators`：分隔符优先级列表，从高到低排列
- `length_function`：计算文本长度的函数，默认为`len()`

**chunk_overlap的意义**：重叠区域确保分割后的文本块之间有上下文关联，避免关键信息被截断在两个块的边界处。

#### 代码示例

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = TextLoader("./data/Python基础语法.txt", encoding="utf-8")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "！", "？", ".", "!", "?", " ", ""],
    length_function=len,
)

split_docs = splitter.split_documents(docs)
print(len(split_docs))
for doc in split_docs:
    print("="*20)
    print(doc)
    print("="*20)
```

#### 代码解析

1. **加载文本文件**：使用`TextLoader`加载`Python基础语法.txt`文件，指定UTF-8编码。`load()`方法返回包含一个`Document`的列表。

2. **创建分割器**：
   - `chunk_size=500`：每个文本块最大500个字符
   - `chunk_overlap=50`：相邻块之间重叠50个字符，保证上下文连续性
   - `separators`：分隔符优先级列表，先尝试双换行（段落），再单换行，再中英文句号、问号、感叹号，最后空格和空字符
   - `length_function=len`：使用Python内置的`len()`函数计算字符长度

3. **分割文档**：`split_documents()`方法接收`Document`列表，返回分割后的`Document`列表。每个分割后的`Document`保留了原始的`metadata`，并添加了分割相关的信息。

4. **输出结果**：先打印分割后的文档总数，再逐个输出每个文本块的内容，用分隔线区分不同块。

5. **中文分隔符**：特别注意`separators`中包含了中文标点符号`。`、`！`、`？`，这对于中文文本的分割效果至关重要。

#### 关键要点

- `TextLoader`用于加载纯文本文件，是最简单的文档加载器
- `RecursiveCharacterTextSplitter`按分隔符优先级递归分割，是最常用的文本分割工具
- `chunk_size`控制每个文本块的最大大小，`chunk_overlap`控制相邻块的重叠量
- `separators`列表定义分隔符优先级，应包含中文标点以适应中文文本
- `split_documents()`保留原始`Document`的`metadata`信息
- 重叠区域确保分割后的文本块之间有上下文关联

#### 小结

文档加载和分割是RAG流水线中至关重要的预处理步骤。`TextLoader`负责将原始文件加载为`Document`对象，`RecursiveCharacterTextSplitter`则将长文档分割为合适大小的文本块。合理的分割策略直接影响后续向量检索的质量——块太大则检索不精确，块太小则丢失上下文。通过调整`chunk_size`、`chunk_overlap`和`separators`参数，我们可以针对不同类型的文档优化分割效果，为RAG应用打下坚实的数据基础。

### 8.2 PyPDFLoader的使用

PDF是最常见的文档格式之一，在学术论文、技术文档、合同报告等领域广泛使用。LangChain的`PyPDFLoader`能够将PDF文件的内容提取为`Document`对象，支持按页分割和整体加载两种模式，还能处理加密的PDF文件。本文将介绍`PyPDFLoader`的使用方法和配置选项。

#### 核心概念

**PyPDFLoader**：LangChain提供的文档加载器，专门用于读取PDF格式文件。它基于`pypdf`库实现，能够提取PDF中的文本内容并转换为`Document`对象。

**加载模式（mode参数）**：
- `mode="page"`（默认）：按页加载，每一页PDF内容生成一个独立的`Document`对象
- `mode="single"`：整体加载，整个PDF文件的所有内容合并为一个`Document`对象

**password参数**：对于加密的PDF文件，可以通过`password`参数提供解密密码。

**惰性加载**：`lazy_load()`方法逐页加载PDF内容，适合处理大型PDF文件时节省内存。

**Document结构**：
- `page_content`：PDF页面的文本内容
- `metadata`：包含`source`（文件路径）和`page`（页码）等元信息

#### 代码示例

```python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader(
    file_path="./data/pdf2.pdf",
    mode="single",
    password="itheima"
)

i = 0
for doc in loader.lazy_load():
    i += 1
    print(doc)
    print("="*20, i)
```

#### 代码解析

1. **创建PyPDFLoader实例**：
   - `file_path`：指定PDF文件路径
   - `mode="single"`：将整个PDF内容合并为一个Document。如果使用`mode="page"`，则每页生成一个Document
   - `password="itheima"`：提供PDF文件的解密密码，用于打开加密的PDF文件

2. **惰性加载**：使用`lazy_load()`逐页迭代加载。即使`mode="single"`将内容合并为一个Document，底层仍然逐页读取后合并。

3. **计数输出**：通过计数器`i`记录加载的Document数量。当`mode="single"`时，通常只会输出1个Document；当`mode="page"`时，输出的Document数量等于PDF的页数。

4. **加密PDF处理**：`password`参数使得`PyPDFLoader`能够处理受密码保护的PDF文件，无需手动解密。

#### 关键要点

- `PyPDFLoader`将PDF文件内容提取为`Document`对象
- `mode="page"`按页分割，每页一个Document；`mode="single"`整体加载为一个Document
- `password`参数支持加载加密的PDF文件
- `lazy_load()`惰性加载适合处理大型PDF文件
- 每个Document的`metadata`包含`source`（文件路径）和`page`（页码）信息

#### 小结

`PyPDFLoader`是RAG应用中处理PDF文档的核心工具。通过灵活的加载模式，我们可以根据实际需求选择按页分割或整体加载。加密PDF的支持使其能够处理更多实际场景中的文档。在RAG流水线中，PDF加载通常是第一步，后续还需要进行文本分割和向量化存储，才能实现高效的文档检索。

### 8.3 CSVLoader的使用

在RAG（检索增强生成）应用中，第一步就是将外部数据加载到系统中。CSV是最常见的数据格式之一，广泛用于存储表格数据。LangChain提供了`CSVLoader`，能够将CSV文件的每一行转换为独立的`Document`对象，方便后续的文本分割和向量化处理。本文将介绍`CSVLoader`的使用方法和配置选项。

#### 核心概念

**CSVLoader**：LangChain提供的文档加载器之一，专门用于读取CSV格式文件。它将CSV文件的每一行数据转换为一个`Document`对象，`Document`的`page_content`包含该行的所有字段内容，`metadata`包含来源信息等元数据。

**csv_args参数**：用于自定义CSV解析行为，支持Python标准库`csv.DictReader`的所有参数：
- `delimiter`：字段分隔符，默认为逗号`,`
- `quotechar`：引用字符，默认为双引号`"`
- `fieldnames`：自定义列名列表，当CSV文件没有表头时特别有用

**加载方式**：
- `load()`：一次性加载所有文档到内存，返回`List[Document]`
- `lazy_load()`：惰性加载，返回迭代器，适合处理大文件时节省内存

**Document结构**：每个Document包含`page_content`（文本内容）和`metadata`（元数据，如source文件路径、row行号等）。

#### 代码示例

```python
from langchain_community.document_loaders import CSVLoader

loader = CSVLoader(
    file_path="./data/stu.csv",
    csv_args={
        "delimiter": ",",
        "quotechar": '"',
        "fieldnames": ['name', 'age', 'gender', '爱好']
    },
    encoding="utf-8"
)

for document in loader.lazy_load():
    print(document)
```

#### 代码解析

1. **创建CSVLoader实例**：
   - `file_path`：指定CSV文件路径
   - `csv_args`：配置CSV解析参数
     - `delimiter: ","`：指定逗号为字段分隔符
     - `quotechar: '"'`：指定双引号为引用字符
     - `fieldnames`：自定义列名列表，当CSV文件没有表头或需要覆盖表头时使用
   - `encoding`：指定文件编码为UTF-8，避免中文乱码

2. **惰性加载**：使用`lazy_load()`逐行加载文档，每次只处理一行数据。相比`load()`一次性加载所有数据，惰性加载更节省内存，特别适合处理大型CSV文件。

3. **输出结果**：每个`Document`对象的`page_content`包含该行所有字段的键值对文本，`metadata`包含`source`（文件路径）和`row`（行号）等信息。

#### 关键要点

- `CSVLoader`将CSV文件的每一行转换为一个`Document`对象
- `csv_args`支持自定义分隔符、引用字符和列名等CSV解析参数
- `fieldnames`参数可用于指定列名，适用于无表头或需要覆盖表头的场景
- `load()`一次性加载所有文档，`lazy_load()`惰性加载节省内存
- 每个`Document`的`metadata`包含`source`（文件路径）和`row`（行号）信息

#### 小结

`CSVLoader`是RAG数据加载环节的基础工具，它将结构化的CSV数据转换为LangChain标准的`Document`对象，为后续的文本分割、向量化存储和检索奠定基础。通过灵活的`csv_args`配置，我们可以适应各种CSV格式变体。在实际项目中，建议优先使用`lazy_load()`处理大文件，以避免内存溢出问题。

### 8.4 JSONLoader的使用

JSON是现代数据交换的主流格式，在Web API、配置文件和NoSQL数据库中广泛使用。LangChain的`JSONLoader`能够从JSON文件中提取指定字段，将其转换为`Document`对象。通过`jq`语法的支持，`JSONLoader`可以灵活地定位和提取JSON中的任意数据。本文将介绍`JSONLoader`的使用方法和关键配置。

#### 核心概念

**JSONLoader**：LangChain提供的文档加载器，专门用于读取JSON格式文件。它使用`jq`语法来指定要提取的字段路径，将提取到的内容封装为`Document`对象。

**jq_schema**：使用`jq`语法定义的数据提取路径，是`JSONLoader`最核心的参数：
- `".name"`：提取JSON中每个对象的`name`字段
- `".[].name"`：提取数组中每个对象的`name`字段
- `"."`：提取整个JSON对象

**text_content**：控制提取结果的处理方式：
- `text_content=True`（默认）：将提取结果作为纯文本内容
- `text_content=False`：将提取结果保持原始格式（如JSON字符串），适用于提取结构化数据

**json_lines**：当设置为`True`时，表示输入文件为JSONLines格式（每行一个独立的JSON对象），这是日志处理等场景常用的格式。

#### 代码示例

```python
from langchain_community.document_loaders import JSONLoader

loader = JSONLoader(
    file_path="./data/stu_json_lines.json",
    jq_schema=".name",
    text_content=False,
    json_lines=True
)

document = loader.load()
print(document)
```

#### 代码解析

1. **创建JSONLoader实例**：
   - `file_path`：指定JSON文件路径，此处为JSONLines格式文件
   - `jq_schema=".name"`：使用jq语法提取每个JSON对象的`name`字段
   - `text_content=False`：不将提取结果转为纯文本，保持原始格式
   - `json_lines=True`：标识文件为JSONLines格式，每行一个独立JSON对象

2. **加载文档**：使用`load()`方法加载所有文档。对于JSONLines格式，每行JSON对象会生成一个独立的`Document`。

3. **输出结果**：每个`Document`的`page_content`包含提取到的`name`字段值，`metadata`包含来源信息。

4. **JSONLines格式**：与标准JSON不同，JSONLines文件每行是一个独立的JSON对象，格式如：
   ```json
   {"name": "张三", "age": 20}
   {"name": "李四", "age": 22}
   ```
   这种格式特别适合流式处理和日志场景。

#### 关键要点

- `JSONLoader`使用`jq`语法（`jq_schema`参数）指定数据提取路径
- `text_content=False`保持提取结果的原始格式，适用于结构化数据
- `json_lines=True`用于处理JSONLines格式文件（每行一个JSON对象）
- `jq_schema=".name"`提取每个对象的`name`字段
- `JSONLoader`将提取到的每个数据项封装为独立的`Document`对象

#### 小结

`JSONLoader`为RAG应用提供了灵活的JSON数据加载能力。通过`jq`语法的强大表达力，我们可以精确定位和提取JSON中的任意数据字段。`json_lines`参数的支持使其能够处理JSONLines这种常见的流式数据格式。在实际项目中，根据数据格式选择合适的参数配置，是高效加载数据的关键。

## 第九章：向量存储与检索

### 9.1 内存向量存储

向量存储是RAG应用的核心基础设施，它将文本转换为向量并支持相似度检索。`InMemoryVectorStore`是LangChain提供的基于内存的向量存储实现，适合开发测试和小规模数据场景。本文将介绍`InMemoryVectorStore`的增删查操作。

#### 核心概念

**InMemoryVectorStore**：LangChain提供的内存向量存储，将向量和文档存储在内存中。它实现了标准的向量存储接口，支持文档的添加、删除和相似度检索。

**Embedding模型**：向量存储依赖嵌入模型将文本转换为向量。本文使用`DashScopeEmbeddings`（通义千问的嵌入模型），将文本映射到高维向量空间。

**核心操作**：
- **增（add_documents）**：将`Document`对象添加到向量存储中，自动调用嵌入模型生成向量。支持通过`ids`参数指定文档ID，便于后续删除操作。
- **删（delete）**：根据文档ID删除对应的向量数据。
- **查（similarity_search）**：根据查询文本进行相似度检索，返回最相关的`Document`列表。`k`参数控制返回结果数量。

**source_column**：在`CSVLoader`中指定`source_column`参数，可以将CSV中某一列的值作为`Document`的`metadata.source`，便于后续按来源过滤。

#### 代码示例

```python
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_community.document_loaders import CSVLoader

vector_store = InMemoryVectorStore(
    embedding=DashScopeEmbeddings()
)

loader = CSVLoader(
    file_path="./data/info.csv",
    encoding="utf-8",
    source_column="source",
)

documents = loader.load()
vector_store.add_documents(
    documents=documents,
    ids=["id"+str(i) for i in range(1, len(documents)+1)]
)

vector_store.delete(["id1", "id2"])

result = vector_store.similarity_search(
    "瑞达法",
    3
)

print(result)
```

#### 代码解析

1. **创建向量存储**：使用`DashScopeEmbeddings`作为嵌入模型初始化`InMemoryVectorStore`。嵌入模型负责将文本转换为向量。

2. **加载CSV数据**：使用`CSVLoader`加载CSV文件，`source_column="source"`将CSV中的`source`列作为文档的来源标识，存入`metadata`。

3. **添加文档**：
   - `add_documents()`将文档列表添加到向量存储
   - `ids`参数为每个文档指定唯一ID，格式为"id1"、"id2"等
   - 添加时自动调用嵌入模型生成向量并存储

4. **删除文档**：`delete(["id1", "id2"])`根据ID删除指定文档及其对应的向量数据。

5. **相似度检索**：`similarity_search("瑞达法", 3)`查询与"瑞达法"最相似的3个文档。内部流程：先将查询文本转为向量，再与存储的向量计算相似度，返回最相关的结果。

#### 关键要点

- `InMemoryVectorStore`将向量和文档存储在内存中，适合开发测试场景
- `add_documents()`添加文档时自动调用嵌入模型生成向量，`ids`参数便于后续删除
- `delete()`根据文档ID删除对应的向量数据
- `similarity_search(query, k)`进行相似度检索，`k`控制返回结果数量
- `source_column`参数将CSV指定列的值作为文档来源标识

#### 小结

`InMemoryVectorStore`提供了简洁的向量存储API，支持文档的增删查操作，是RAG应用开发的基础组件。通过`add_documents`、`delete`和`similarity_search`三个核心方法，我们可以完成向量数据的基本管理。但需要注意，内存存储的数据在程序重启后会丢失，不适合生产环境。对于需要持久化的场景，应使用外部向量数据库如Chroma、Milvus等。

### 9.2 外部向量持久化存储

`InMemoryVectorStore`虽然简单易用，但数据无法持久化。在生产环境中，我们需要将向量数据存储到外部数据库中，确保程序重启后数据仍然可用。Chroma是一款轻量级的开源向量数据库，支持本地持久化存储，是RAG应用的理想选择。本文将介绍如何使用Chroma实现向量的持久化存储和检索。

#### 核心概念

**Chroma**：一款开源的向量数据库，专为AI应用设计。它支持本地运行，无需额外部署服务，数据可以持久化到磁盘，程序重启后数据仍然可用。

**核心参数**：
- `collection_name`：集合名称，类似于数据库中的表名。不同的集合存储不同的数据集，相互隔离。
- `embedding_function`：嵌入函数，用于将文本转换为向量。与`InMemoryVectorStore`一样，需要指定嵌入模型。
- `persist_directory`：持久化目录，指定向量数据的磁盘存储路径。数据会自动保存到此目录，下次启动时自动加载。

**相似度检索与过滤**：
- `similarity_search(query, k, filter)`：支持基于元数据的过滤条件
- `filter`参数：可以按`metadata`中的字段进行过滤，如`filter={"source": "黑马程序员"}`只返回来源为"黑马程序员"的文档

**持久化优势**：数据写入后自动保存到磁盘，无需手动调用保存方法。程序重启后，只需使用相同的`persist_directory`和`collection_name`重新连接，即可访问之前存储的数据。

#### 代码示例

```python
from langchain_chroma import Chroma
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_community.document_loaders import CSVLoader

vector_store = Chroma(
    collection_name="test",
    embedding_function=DashScopeEmbeddings(),
    persist_directory="./chroma_db"
)

result = vector_store.similarity_search(
    "Python是不是简单易学呀",
    3,
    filter={"source": "黑马程序员"}
)

print(result)
```

#### 代码解析

1. **创建Chroma向量存储**：
   - `collection_name="test"`：创建名为"test"的集合
   - `embedding_function=DashScopeEmbeddings()`：使用通义千问嵌入模型
   - `persist_directory="./chroma_db"`：数据持久化到当前目录下的`chroma_db`文件夹

2. **自动持久化**：当文档添加到Chroma后，数据会自动保存到`./chroma_db`目录。如果该目录已有数据，Chroma会自动加载，无需重复添加。

3. **带过滤的相似度检索**：
   - `similarity_search("Python是不是简单易学呀", 3, filter={"source": "黑马程序员"})`
   - 先将查询文本转为向量
   - 在满足`filter`条件（`source`为"黑马程序员"）的文档中进行相似度计算
   - 返回最相似的3个文档

4. **过滤机制**：`filter`参数基于`Document`的`metadata`进行过滤。这要求在加载文档时，`metadata`中包含`source`字段（如通过`CSVLoader`的`source_column`参数设置）。

#### 关键要点

- Chroma是轻量级开源向量数据库，支持本地持久化存储
- `collection_name`指定集合名称，`persist_directory`指定数据存储路径
- 数据自动持久化到磁盘，程序重启后数据仍然可用
- `similarity_search`支持`filter`参数进行元数据过滤
- 使用相同的`persist_directory`和`collection_name`重新连接即可访问已有数据

#### 小结

Chroma为RAG应用提供了简单可靠的向量持久化方案。相比`InMemoryVectorStore`，Chroma的核心优势在于数据持久化——程序重启后无需重新加载数据，直接使用即可。同时，`filter`参数支持的元数据过滤功能，使得检索更加精准。对于中小规模的RAG应用，Chroma是理想的向量存储选择；对于更大规模的场景，可以考虑Milvus、Pinecone等分布式向量数据库。

### 9.3 向量数据库服务封装

在RAG系统中，向量数据库负责存储文档的向量表示并执行相似度检索。Chroma是一个轻量级、开源的向量数据库，支持本地持久化，非常适合中小规模的RAG项目。然而，直接在各业务模块中操作Chroma客户端会导致代码耦合和重复配置。通过将Chroma的连接和检索逻辑封装为`VectorStoreService`服务类，实现了关注点分离和依赖注入，使RAG链只需关注检索接口而非底层实现。本文将介绍向量数据库服务的封装设计。

#### 核心概念

- **VectorStoreService**：向量数据库的服务封装类，将Chroma客户端的创建和检索器的获取逻辑集中管理。
- **Chroma客户端**：LangChain提供的Chroma向量数据库接口，通过`collection_name`、`embedding_function`和`persist_directory`三个参数完成初始化。

- **as_retriever**：Chroma向量库的检索器转换方法，将向量库实例转为`Retriever`接口，可无缝集成到LCEL链中。
- **search_kwargs**：检索器的搜索参数配置，`k`值控制返回最相似的文档数量，是召回率与精度的平衡参数。
- **依赖注入**：`embedding`模型通过构造函数参数注入，而非在服务内部创建，实现了嵌入模型的灵活切换和资源复用。

#### 代码示例

```python
from langchain_chroma import Chroma
import config_data as config

class VectorStoreService(object):
    def __init__(self, embedding):
        self.embedding = embedding
        self.vector_store = Chroma(
            collection_name=config.collection_name,
            embedding_function=self.embedding,
            persist_directory=config.persist_directory,
        )

    def get_retriever(self):
        return self.vector_store.as_retriever(search_kwargs={"k": config.similarity_threshold})
```

#### 代码解析

**1. 依赖注入嵌入模型**

```python
def __init__(self, embedding):
    self.embedding = embedding
```
`embedding`参数通过构造函数注入，而非在类内部创建`OllamaEmbeddings`实例。这种设计带来两个好处：
- **灵活切换**：调用方可以传入不同的嵌入模型（如从Ollama切换到OpenAI），服务类无需修改。
- **资源复用**：同一个嵌入模型实例可以在`KnowledgeBaseService`（入库）和`VectorStoreService`（检索）之间共享，避免重复创建。

**2. Chroma向量库初始化**

```python
self.vector_store = Chroma(
    collection_name=config.collection_name,
    embedding_function=self.embedding,
    persist_directory=config.persist_directory,
)
```
三个参数的作用：
- `collection_name`：指定Chroma中的集合名称，不同集合存储不同领域的向量数据，互不干扰。
- `embedding_function`：嵌入函数，在检索时自动将查询文本转为向量，与存储的文档向量进行相似度计算。
- `persist_directory`：持久化目录，Chroma将向量索引和元数据保存到此目录，程序重启后可加载恢复。

**3. 获取检索器**

```python
def get_retriever(self):
    return self.vector_store.as_retriever(search_kwargs={"k": config.similarity_threshold})
```
`as_retriever`将向量库实例转为`Retriever`接口对象，这是LCEL链集成的关键——`Retriever`实现了`Runnable`接口，可以直接通过管道操作符`|`接入LCEL链。

`search_kwargs={"k": config.similarity_threshold}`配置搜索参数：
- `k`：返回最相似的k个文档块。`similarity_threshold`值为1时，只返回最相关的1个文档块。
- k值越大，召回的候选文档越多，但噪声也可能增加；k值越小，结果越精确，但可能遗漏相关信息。

#### 关键要点

- `VectorStoreService`将Chroma的连接和检索逻辑封装为独立服务，实现了与RAG链的解耦，遵循单一职责原则。
- 嵌入模型通过依赖注入传入，而非在服务内部创建，支持灵活切换和资源复用。
- `as_retriever`是向量库与LCEL链集成的桥梁，返回的`Retriever`实现了`Runnable`接口，可直接参与链编排。
- `search_kwargs`的`k`参数控制检索返回的文档数量，需要根据实际场景在召回率和精度之间权衡。
- Chroma的`persist_directory`实现本地持久化，程序重启后向量数据不丢失，适合开发和中小规模部署。

#### 小结

本文介绍了向量数据库服务的封装设计。`VectorStoreService`通过依赖注入接收嵌入模型，封装Chroma客户端的创建和检索器的获取，对外仅暴露`get_retriever()`接口。这种设计将向量数据库的底层细节与RAG业务逻辑分离，使链构建代码更加简洁清晰。`as_retriever`返回的`Retriever`可直接接入LCEL链，实现了向量检索与生成流程的无缝衔接。

### 9.4 余弦相似度

在自然语言处理和向量检索领域，余弦相似度是最基础也最常用的相似度计算方法之一。它通过衡量两个向量在方向上的接近程度来判断它们的相似性，广泛应用于文本相似度计算、推荐系统、RAG检索等场景。

#### 核心概念

**余弦相似度（Cosine Similarity）** 的核心思想是：两个向量之间的夹角越小，它们的方向越一致，相似度就越高。其公式为：

$$\cos(\theta) = \frac{\vec{A} \cdot \vec{B}}{|\vec{A}| \times |\vec{B}|}$$

其中：

- **点积（Dot Product）**：$\vec{A} \cdot \vec{B} = \sum_{i=1}^{n} A_i \times B_i$，即两个向量对应位置元素相乘后求和
- **向量范数（Norm）**：$|\vec{A}| = \sqrt{\sum_{i=1}^{n} A_i^2}$，即向量各元素平方和的平方根，表示向量的长度（模）
- **取值范围**：余弦相似度的值域为 $[-1, 1]$
  - **1** 表示方向完全相同（最相似）
  - **0** 表示方向正交（无相关性）
  - **-1** 表示方向完全相反

余弦相似度关注的是向量的**方向**而非**大小**，这意味着即使两个向量的模不同，只要方向一致，相似度依然很高。这一特性使其特别适合文本相似度计算——长文本和短文本可能因为词频差异导致向量模不同，但只要主题一致，方向就会接近。

#### 代码示例

```python
import numpy as np

def get_dot(vec_a, vec_b):
    if len(vec_a) != len(vec_b):
        raise ValueError("2个向量必须维度数量相同")
    dot_sum = 0
    for a, b in zip(vec_a, vec_b):
        dot_sum += a * b
    return dot_sum

def get_norm(vec):
    sum_square = 0
    for v in vec:
        sum_square += v * v
    return np.sqrt(sum_square)

def cosine_similarity(vec_a, vec_b):
    result = get_dot(vec_a, vec_b) / (get_norm(vec_a) * get_norm(vec_b))
    return result

if __name__ == '__main__':
    vec_a = [0.5, 0.5]
    vec_b = [0.7, 0.7]
    vec_c = [0.7, 0.5]
    vec_d = [-0.6, -0.5]
    print("ab:", cosine_similarity(vec_a, vec_b))
    print("ac:", cosine_similarity(vec_a, vec_c))
    print("ad:", cosine_similarity(vec_a, vec_d))
```

#### 代码解析

1. **`get_dot(vec_a, vec_b)`**：计算两个向量的点积。首先检查维度是否一致，然后逐元素相乘并累加求和。点积反映了两个向量在方向上的一致程度。

2. **`get_norm(vec)`**：计算向量的L2范数（欧几里得范数）。将每个元素平方后求和，再开平方根，得到向量的长度。

3. **`cosine_similarity(vec_a, vec_b)`**：将点积除以两个向量范数的乘积，得到余弦相似度。

4. **测试用例分析**：
   - `vec_a = [0.5, 0.5]` 和 `vec_b = [0.7, 0.7]`：方向完全相同，相似度接近 1
   - `vec_a = [0.5, 0.5]` 和 `vec_c = [0.7, 0.5]`：方向有偏差，相似度介于 0 和 1 之间
   - `vec_a = [0.5, 0.5]` 和 `vec_d = [-0.6, -0.5]`：方向相反，相似度为负值

#### 关键要点

- 余弦相似度衡量的是向量方向的接近程度，取值范围为 $[-1, 1]$
- 点积是分子，反映两个向量在各维度上的一致性
- 向量范数是分母，起到归一化的作用，消除向量大小的影响
- 余弦相似度关注方向而非大小，适合比较不同长度文本的语义相似性
- 在RAG系统中，余弦相似度常用于检索与查询最相关的文档片段

#### 小结

余弦相似度是向量相似度计算的基础方法，通过点积与范数的比值来衡量向量方向的接近程度。理解其原理对于掌握向量检索、文本嵌入、RAG等AI应用至关重要。在实际应用中，我们通常使用向量数据库（如Milvus、Chroma等）内置的余弦相似度计算，但底层原理正是本文所介绍的内容。

## 第十章：RAG检索增强生成

### 10.1 向量检索构建提示词

RAG核心流程：查询→检索→注入上下文→生成回答。手动注入上下文方式。提示词模板需要{context}和{input}两个变量。add_texts()方法可以直接添加文本列表。

```python
from langchain_community.chat_models import ChatTongyi
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatTongyi(model="qwen3-max")
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "以我提供的已知参考资料为主，简洁和专业的回答用户问题。参考资料:{context}。"),
        ("user", "用户提问：{input}")
    ]
)

vector_store = InMemoryVectorStore(embedding=DashScopeEmbeddings(model="text-embedding-v4"))
vector_store.add_texts(
    ["减肥就是要少吃多练", "在减脂期间吃东西很重要,清淡少油控制卡路里摄入并运动起来", "跑步是很好的运动哦"])

input_text = "怎么减肥？"

result = vector_store.similarity_search(input_text, 2)
reference_text = "["
for doc in result:
    reference_text += doc.page_content
reference_text += "]"

chain = prompt | model | StrOutputParser()

res = chain.invoke({"input": input_text, "context": reference_text})
print(res)
```

解析：创建提示词模板含{context}和{input}占位符，初始化向量存储并添加文本，similarity_search检索相关文档，手动拼接为字符串作为context，构建链并调用。

关键要点：RAG核心流程、手动注入上下文、提示词模板需要两个变量、add_texts()方法、系统提示要求模型"以参考资料为主"回答。

### 10.2 知识库文档入库

KnowledgeBaseService类封装文本分割、向量化和存储的完整流程。MD5去重避免重复文档。RecursiveCharacterTextSplitter按分隔符优先级递归分割。Chroma.add_texts自动调用嵌入模型向量化。

```python
import os
import hashlib
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from datetime import datetime

class KnowledgeBaseService(object):
    def __init__(self):
        self.chroma = Chroma(
            collection_name=config.collection_name,
            embedding_function=OllamaEmbeddings(model=config.embedding_model_name),
            persist_directory=config.persist_directory,
        )
        self.spliter = RecursiveCharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap,
            separators=config.separators,
            length_function=len,
        )

    def upload_by_str(self, data: str, filename):
        md5_hex = get_string_md5(data)
        if check_md5(md5_hex):
            return "[跳过]内容已经存在知识库中"
        if len(data) > config.max_split_char_number:
            knowledge_chunks = self.spliter.split_text(data)
        else:
            knowledge_chunks = [data]
        metadata = {
            "source": filename,
            "create_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "operator": "小曹",
        }
        self.chroma.add_texts(knowledge_chunks, metadatas=[metadata for _ in knowledge_chunks])
        save_md5(md5_hex)
        return "[成功]内容已经成功载入向量库"
```

关键要点：MD5去重是知识库质量保障的第一道防线、RecursiveCharacterTextSplitter按分隔符优先级递归分割、条件分割策略避免对短文本不必要的分割、元数据附加实现来源追溯、add_texts方法内部自动调用嵌入模型进行向量化。

### 10.3 RAG核心链构建

RagService类封装检索器、提示词模板、对话模型和LCEL链。LCEL通过管道操作符|将组件串联。RunnablePassthrough透传输入，RunnableLambda包装自定义函数。ChatPromptTemplate.from_messages支持多角色消息，MessagesPlaceholder为对话历史预留动态位置。RunnableWithMessageHistory自动管理对话历史的加载和保存。

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableWithMessageHistory, RunnableLambda
from file_history_store import get_history
from vector_stores import VectorStoreService
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import OllamaLLM, OllamaEmbeddings

class RagService(object):
    def __init__(self):
        self.vector_service = VectorStoreService(embedding=OllamaEmbeddings(model=config.embedding_model_name))
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", "以我提供的已知参考资料为主，简洁和专业的回答用户问题。参考资料:{context}。"),
            ("system", "并且我提供用户的对话历史记录，如下："),
            MessagesPlaceholder("history"),
            ("user", "请回答用户提问：{input}")
        ])
        self.chat_model = OllamaLLM(model=config.chat_model_name)
        self.chain = self.__get_chain()

    def __get_chain(self):
        retriever = self.vector_service.get_retriever()
        chain = (
            {"input": RunnablePassthrough(), "context": RunnableLambda(format_for_retriever) | retriever | format_document}
            | RunnableLambda(format_for_prompt_template) | self.prompt_template | self.chat_model | StrOutputParser()
        )
        conversation_chain = RunnableWithMessageHistory(chain, get_history, input_messages_key="input", history_messages_key="history")
        return conversation_chain
```

关键要点：LCEL通过管道操作符实现声明式链编排、RunnablePassthrough透传输入、ChatPromptTemplate.from_messages支持多角色消息、RunnableWithMessageHistory自动管理对话历史、检索→格式化→提示词→模型→解析的流水线设计。

### 10.4 RAG项目配置管理

集中式配置管理将所有参数统一维护。Chroma配置（collection_name、persist_directory）、文本分割器参数（chunk_size、chunk_overlap、separators）、相似度阈值、模型名称配置、session_config。

```python
md5_path = "./md5.text"

# Chroma
collection_name = "rag"
persist_directory = "./chroma_db"

# spliter
chunk_size = 1000
chunk_overlap = 100
separators = ["\n\n", "\n", ".", "!", "?", "。", "！", "？", " ", ""]
max_split_char_number = 1000

similarity_threshold = 1

embedding_model_name = "nomic-embed-text:latest"
chat_model_name = "deepseek-r1:7b"

session_config = {
    "configurable": {
        "session_id": "user_001",
    }
}
```

关键要点：集中式配置管理一处修改处处生效、chunk_size和chunk_overlap是文本分割的核心参数、separators列表同时包含中英文标点、similarity_threshold作为检索的k值、session_config的session_id是RunnableWithMessageHistory识别对话会话的关键。

## 第十一章：会话记忆

### 11.1 临时会话记忆

InMemoryChatMessageHistory基于内存存储。RunnableWithMessageHistory自动管理消息的存储和读取。session_id区分不同会话。store字典管理所有会话历史。

```python
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

model = ChatTongyi(model="qwen3-max")
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "你需要根据会话历史回应用户问题。对话历史："),
        MessagesPlaceholder("chat_history"),
        ("human", "请回答如下问题：{input}")
    ]
)

str_parser = StrOutputParser()
base_chain = prompt | model | str_parser

store = {}

def get_history(session_id):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

conversation_chain = RunnableWithMessageHistory(
    base_chain,
    get_history,
    input_messages_key="input",
    history_messages_key="chat_history"
)

session_config = {"configurable": {"session_id": "user_001"}}
res = conversation_chain.invoke({"input": "总共有几个宠物"}, session_config)
```

关键要点：InMemoryChatMessageHistory将聊天历史存储在内存中程序重启后数据丢失、RunnableWithMessageHistory自动管理消息的存储和读取、session_id用于区分不同会话、store字典以session_id为键管理所有会话历史记录。

### 11.2 长期会话记忆

FileChatMessageHistory继承BaseChatMessageHistory实现持久化存储。message_to_dict将BaseMessage序列化为字典，messages_from_dict将字典反序列化为BaseMessage对象。每个session_id对应一个独立的JSON文件。

```python
import os, json
from typing import Sequence
from langchain_core.messages import message_to_dict, messages_from_dict, BaseMessage
from langchain_core.chat_history import BaseChatMessageHistory

class FileChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, session_id, storage_path):
        self.session_id = session_id
        self.storage_path = storage_path
        self.file_path = os.path.join(self.storage_path, self.session_id)
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

    def add_messages(self, messages: Sequence[BaseMessage]) -> None:
        all_messages = list(self.messages)
        all_messages.extend(messages)
        new_messages = [message_to_dict(message) for message in all_messages]
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(new_messages, f)

    @property
    def messages(self) -> list[BaseMessage]:
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                messages_data = json.load(f)
                return messages_from_dict(messages_data)
        except FileNotFoundError:
            return []

    def clear(self) -> None:
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump([], f)
```

关键要点：自定义FileChatMessageHistory继承BaseChatMessageHistory、必须实现add_messages()、messages属性和clear()三个核心方法、message_to_dict将消息对象序列化为字典、每个会话对应一个独立的JSON文件。

### 11.3 文件对话历史存储

自定义BaseChatMessageHistory实现基于文件的对话历史持久化。get_history工厂函数连接RunnableWithMessageHistory与自定义存储后端。

```python
import json
import os
from typing import Sequence
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage, message_to_dict, messages_from_dict

def get_history(session_id):
    return FileChatMessageHistory(session_id, "./chat_history")

class FileChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, session_id, storage_path):
        self.session_id = session_id
        self.storage_path = storage_path
        self.file_path = os.path.join(self.storage_path, self.session_id)
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

    def add_messages(self, messages: Sequence[BaseMessage]) -> None:
        all_messages = list(self.messages)
        all_messages.extend(messages)
        new_messages = [message_to_dict(message) for message in all_messages]
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(new_messages, f)

    @property
    def messages(self) -> list[BaseMessage]:
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                messages_data = json.load(f)
                return messages_from_dict(messages_data)
        except FileNotFoundError:
            return []

    def clear(self) -> None:
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump([], f)
```

关键要点：BaseChatMessageHistory是LangChain对话历史的抽象契约、message_to_dict和messages_from_dict是序列化/反序列化工具、@property装饰器将messages定义为属性、session_id作为文件名实现会话隔离、文件存储是内存与数据库之间的轻量折中方案。

## 第十二章：Agent智能体

### 12.1 Agent智能体初体验

Agent由LLM（大脑）、工具集（手脚）和系统提示词（行为准则）三个核心要素构成。create_agent()函数创建智能体。@tool装饰器定义工具。

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

关键要点：Agent由LLM、工具集和系统提示词三个核心要素构成、@tool装饰器的description参数至关重要、create_agent()是LangChain的智能体创建入口、Agent的输入输出都采用消息列表格式、Agent的核心优势是自主决策。

### 12.2 Agent的stream流式输出

agent.stream()返回迭代器。stream_mode="values"输出完整状态快照。多工具协作。tool_calls属性只在AIMessage中存在。

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

关键要点：agent.stream()实现流式输出、stream_mode="values"输出完整状态快照、多工具协作是Agent的核心能力、tool_calls属性只在AIMessage中存在需try/except处理、流式输出在UI集成中尤为重要。

### 12.3 ReAct案例

ReAct框架：Reasoning（推理）+ Acting（行动）的交织模式，通过Thought-Action-Observation循环逐步解决问题。系统提示词约束模型严格遵循"每轮仅调用1个工具"的ReAct规则。

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

BMI计算的ReAct执行流程：第一轮思考获取体重→调用get_weight→观察90千克；第二轮思考获取身高→调用get_height→观察172厘米；第三轮计算BMI=90/1.72²≈30.4。

关键要点：ReAct框架通过Thought-Action-Observation循环逐步解决问题、系统提示词"每轮仅调用1个工具"的规则强制模型在每次行动前进行独立思考、多步骤推理是ReAct的核心优势、流式输出让ReAct的推理过程完全透明。

### 12.4 middleware中间件

六个中间件钩子覆盖Agent生命周期的所有关键节点：@before_agent、@after_agent、@before_model、@after_model、@wrap_model_call、@wrap_tool_call。AgentState和Runtime参数。handler(request)链式模式。

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

关键要点：六个中间件钩子覆盖Agent生命周期的所有关键节点、@before_*和@after_*类型钩子接收AgentState和Runtime参数、@wrap_*类型钩子采用包装器模式、@wrap_tool_call是最实用的监控钩子、中间件通过create_agent()的middleware参数注册。

## 第十三章：Streamlit界面

### 13.1 Streamlit智能客服对话

st.chat_message和st.chat_input组件。chain.stream()流式调用。capture生成器包装器解决"边输出边保存"问题。session_state消息历史。

```python
import time
from rag import RagService
import streamlit as st
import config_data as config

st.title("智能客服")
st.divider()

if "message" not in st.session_state:
    st.session_state["message"] = [{"role": "assistant", "content": "你好，有什么可以帮助你？"}]

if "rag" not in st.session_state:
    st.session_state["rag"] = RagService()

for message in st.session_state["message"]:
    st.chat_message(message["role"]).write(message["content"])

prompt = st.chat_input()

if prompt:
    st.chat_message("user").write(prompt)
    st.session_state["message"].append({"role": "user", "content": prompt})

    ai_res_list = []
    with st.spinner("AI思考中..."):
        res_stream = st.session_state["rag"].chain.stream({"input": prompt}, config.session_config)

        def capture(generator, cache_list):
            for chunk in generator:
                cache_list.append(chunk)
                yield chunk

        st.chat_message("assistant").write_stream(capture(res_stream, ai_res_list))
        st.session_state["message"].append({"role": "assistant", "content": "".join(ai_res_list)})
```

关键要点：st.chat_message和st.chat_input是Streamlit专用的聊天界面组件、chain.stream()返回流式生成器、capture生成器包装器是流式输出与消息持久化之间的桥梁、write_stream接收Generator后逐chunk更新界面、对话历史必须存储在st.session_state中。

### 13.2 Streamlit文件上传服务

st.file_uploader文件上传组件。st.session_state保持服务对象持久化。getvalue().decode()读取文件内容。st.spinner加载动画。

```python
import time
import streamlit as st
from knowledge_base import KnowledgeBaseService

st.title("知识库更新服务")

uploader_file = st.file_uploader(
    "请上传TXT文件",
    type=['txt'],
    accept_multiple_files=False,
)

if "service" not in st.session_state:
    st.session_state["service"] = KnowledgeBaseService()

if uploader_file is not None:
    file_name = uploader_file.name
    file_type = uploader_file.type
    file_size = uploader_file.size / 1024

    st.subheader(f"文件名：{file_name}")
    st.write(f"格式：{file_type} | 大小：{file_size:.2f} KB")

    text = uploader_file.getvalue().decode("utf-8")

    with st.spinner("载入知识库中。。。"):
        time.sleep(1)
        result = st.session_state["service"].upload_by_str(text, file_name)
        st.write(result)
```

关键要点：st.file_uploader是Streamlit文件上传的核心组件、st.session_state是Streamlit会话持久化的关键机制、UploadedFile.getvalue()返回bytes类型需decode("utf-8")、st.spinner为耗时操作提供用户友好的等待反馈。

## 第十四章：项目实战——智能客服系统

### 14.1 日志系统设计

双通道输出（控制台INFO + 文件DEBUG）。日志格式：%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s。get_logger函数创建日志器。Handler去重防止Streamlit重复添加。exc_info=True记录完整异常堆栈。

```python
import logging
from utils.path_tool import get_abs_path
import os
from datetime import datetime

LOG_ROOT = get_abs_path("logs")
os.makedirs(LOG_ROOT, exist_ok=True)

DEFAULT_LOG_FORMAT = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)

def get_logger(name: str = "agent", console_level: int = logging.INFO, file_level: int = logging.DEBUG, log_file = None) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    if logger.handlers:
        return logger
    console_handler = logging.StreamHandler()
    console_handler.setLevel(console_level)
    console_handler.setFormatter(DEFAULT_LOG_FORMAT)
    logger.addHandler(console_handler)
    if not log_file:
        log_file = os.path.join(LOG_ROOT, f"{name}_{datetime.now().strftime('%Y%m%d')}.log")
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(file_level)
    file_handler.setFormatter(DEFAULT_LOG_FORMAT)
    logger.addHandler(file_handler)
    return logger

logger = get_logger()
```

日志在工具调用监控、模型调用前、知识库加载、外部数据获取中的使用。日志文件按日期命名存储在logs/目录下。

### 14.2 项目路径管理

get_project_root()获取项目根目录（基于__file__向上两级）。get_abs_path()将相对路径转为绝对路径。os.path关键函数：abspath、dirname、join、exists、isfile、isdir。

```python
import os

def get_project_root() -> str:
    current_file = os.path.abspath(__file__)
    current_dir = os.path.dirname(current_file)
    project_root = os.path.dirname(current_dir)
    return project_root

def get_abs_path(relative_path: str) -> str:
    project_root = get_project_root()
    return os.path.join(project_root, relative_path)
```

get_abs_path是整个项目的基础工具函数，用于配置加载、提示词加载、向量库初始化、知识文件加载、日志目录等。

### 14.3 提示词工程与模板管理

三套提示词：主提示词（main_prompt.txt，ReAct智能客服）、RAG总结提示词（rag_summarize.txt，知识检索）、报告生成提示词（report_prompt.txt，报告写作）。PromptTemplate使用{input}和{context}变量。提示词路径通过YAML配置管理，内容存储在独立txt文件中。动态切换通过中间件@dynamic_prompt实现。

### 14.4 文件处理与MD5去重

PDF加载器（PyPDFLoader）和TXT加载器（TextLoader）。文件类型过滤（listdir_with_allowed_type）。MD5计算使用4KB分片读取避免大文件爆内存。去重流程：遍历文件→计算MD5→检查是否已存在→加载→分片→存入向量库→记录MD5。异常处理对每个文件单独try-catch。

### 14.5 向量存储与文档分片

VectorStoreService类封装Chroma向量库和RecursiveCharacterTextSplitter。配置参数：chunk_size=200, chunk_overlap=20, k=3。递归字符分片器按分隔符优先级切分。chunk_overlap确保跨分片语义不断裂。MD5去重机制支持增量加载。检索器通过as_retriever获取。

### 14.6 工厂模式创建大模型实例

BaseModelFactory抽象基类。ChatModelFactory返回ChatOllama。EmbeddingsFactory返回OllamaEmbeddings。全局实例chat_model和embed_model。模型名称通过YAML配置管理，切换只需修改配置文件。从Ollama切换到OpenAI只需修改工厂类。

```python
from abc import ABC, abstractmethod
from typing import Optional
from langchain_core.embeddings import Embeddings
from langchain_core.language_models.chat_models import BaseChatModel

class BaseModelFactory(ABC):
    @abstractmethod
    def generator(self) -> Optional[Embeddings | BaseChatModel]:
        pass

class ChatModelFactory(BaseModelFactory):
    def generator(self) -> Optional[Embeddings | BaseChatModel]:
        return ChatOllama(model=rag_conf["chat_model_name"])

class EmbeddingsFactory(BaseModelFactory):
    def generator(self) -> Optional[Embeddings | BaseChatModel]:
        return OllamaEmbeddings(model=rag_conf["embedding_model_name"])

chat_model = ChatModelFactory().generator()
embed_model = EmbeddingsFactory().generator()
```

### 14.7 中间件模式与动态提示词切换

三种中间件：@wrap_tool_call（monitor_tool监控工具调用，fill_context_for_report调用后设置runtime.context["report"]=True）、@before_model（log_before_model记录日志）、@dynamic_prompt（report_prompt_switch根据context["report"]切换提示词）。动态提示词切换完整流程：用户请求报告→模型调用fill_context_for_report→中间件设置report=True→dynamic_prompt中间件检测到report=True→加载报告提示词→模型使用报告提示词生成。

### 14.8 YAML配置管理

四个配置文件：rag.yml（模型配置）、chroma.yml（向量库配置）、prompts.yml（提示词路径）、agent.yml（Agent配置）。load_*_config函数加载配置。全局配置实例rag_conf、chroma_conf、prompts_conf、agent_conf。其他模块通过from utils.config_handler import导入使用。

### 14.9 Streamlit构建智能客服界面

完整Streamlit应用：st.title设置标题、session_state管理Agent实例和消息历史、st.chat_message渲染聊天气泡、st.chat_input输入框、capture生成器包装器实现流式输出与缓存、time.sleep(0.01)模拟打字效果、st.rerun()刷新页面。运行方式：streamlit run app.py。

### 14.10 ReAct智能体模式

ReAct（Reasoning + Acting）框架：思考→行动→观察→再思考的循环。create_agent组装模型、系统提示词、工具和中间件。流式输出通过agent.stream()实现。context参数支持运行时上下文信息。系统提示词中的ReAct约束：先判断核心需求、工具调用后再判断、5次调用仍不足回复"我不知道"。

### 14.11 LangChain工具定义与调用

@tool装饰器将Python函数注册为工具，description参数帮助模型决策。七个工具：rag_summarize（RAG知识检索）、get_weather（天气查询）、get_user_location（用户位置）、get_user_id（用户ID）、get_current_month（当前月份）、fetch_external_data（外部数据获取，需user_id和month两个参数）、fill_context_for_report（报告上下文注入，触发中间件）。工具分类：信息检索、实时查询、上下文获取、数据获取、流程控制。

### 14.12 RAG检索增强生成

RagSummarizeService类实现完整RAG流程。LCEL链：prompt_template | model | StrOutputParser。RAG提示词关键约束："回答必须完全基于参考资料中的信息，不编造"。RAG作为智能体工具被调用。RAG vs 纯大模型对比：知识来源、准确性、可更新性、专业性、成本。


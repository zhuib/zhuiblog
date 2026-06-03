---
title: LangChain的流式输出
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain的流式输出
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain的流式输出——实现逐步响应

大语言模型生成文本是一个逐 token 生成的过程，传统的 `invoke()` 方法会等待完整响应后才返回，这在生成长文本时会导致用户等待时间过长。流式输出（Streaming）通过逐步返回生成内容，显著改善了用户体验。

## 核心概念

**流式输出**是指模型在生成文本的过程中，每生成一个 token（或一小段文本）就立即返回给调用方，而不是等待整个响应完成后一次性返回。这种方式让用户可以实时看到模型的输出过程，就像打字一样逐字显示。

关键要素：

- **`model.stream()` vs `model.invoke()`**：`stream()` 返回一个迭代器，`invoke()` 返回完整结果
- **迭代器模式**：`stream()` 返回的是一个可迭代对象，通过 `for` 循环逐块获取内容
- **`end=""`**：`print()` 默认会换行，设置 `end=""` 阻止自动换行，使输出连续
- **`flush=True`**：强制刷新输出缓冲区，确保每个 chunk 立即显示在终端上，而非等待缓冲区满

## 代码示例

```python
from langchain_ollama import OllamaLLM

model = OllamaLLM(model="qwen3:4b")
res = model.stream(input="你是谁呀能做什么？")

for chunk in res:
    print(chunk, end="", flush=True)
```

## 代码解析

1. **创建模型实例**：与 `invoke()` 方式相同，创建 OllamaLLM 模型实例。

2. **调用 `stream()` 方法**：`model.stream(input="你是谁呀能做什么？")` 返回一个迭代器对象 `res`，每次迭代产生一个文本片段（chunk）。

3. **遍历迭代器**：`for chunk in res` 逐个获取模型生成的文本片段。每个 `chunk` 是一个字符串，通常包含一个或几个 token。

4. **实时输出**：`print(chunk, end="", flush=True)` 中：
   - `end=""`：取消 `print` 默认的换行行为，使所有 chunk 在同一行连续输出
   - `flush=True`：立即将内容输出到终端，不等待缓冲区满，实现真正的实时显示效果

## 关键要点

- `stream()` 返回迭代器，`invoke()` 返回完整字符串，两者适用不同场景
- 流式输出通过 `for chunk in res` 逐块获取内容，实现逐步响应
- `print()` 中 `end=""` 阻止自动换行，`flush=True` 强制刷新缓冲区，两者配合实现连续实时输出
- 流式输出适用于聊天界面、实时交互等需要即时反馈的场景
- 所有 LangChain 的 LLM 和 Chat Model 都支持 `stream()` 方法

## 小结

流式输出是提升大模型应用用户体验的关键技术。通过 `stream()` 方法获取迭代器，配合 `for` 循环逐块输出，可以实现类似 ChatGPT 的打字效果。在实际的 Web 应用和聊天界面开发中，流式输出几乎是标配功能，它让用户无需漫长等待，就能实时看到模型的思考过程。

---
title: LangChain访问Ollama本地模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain访问Ollama本地模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain访问Ollama本地模型

除了调用云端大模型，LangChain 同样支持访问本地部署的大模型。Ollama 是目前最流行的本地大模型运行工具之一，本文介绍如何通过 LangChain 访问 Ollama 部署的本地模型。

## 核心概念

**Ollama** 是一个轻量级的本地大模型运行框架，支持在本地机器上快速部署和运行各种开源大模型（如 DeepSeek、Qwen、Llama 等）。LangChain 通过 `langchain_ollama` 包提供了对 Ollama 的集成。

关键要素：

- **OllamaLLM 类**：来自 `langchain_ollama` 模块，封装了对 Ollama 本地模型的调用
- **本地部署**：模型运行在本地机器上，无需网络请求，数据不出本机
- **统一接口**：`invoke()` 方法与云端模型完全一致，实现无缝切换
- **model 参数**：指定 Ollama 中已安装的模型名称，如 `deepseek-r1:7b`、`qwen3:4b` 等

使用前需要：1) 安装 Ollama 并下载模型；2) 安装依赖 `pip install langchain-ollama`

## 代码示例

```python
from langchain_ollama import OllamaLLM

model = OllamaLLM(model="deepseek-r1:7b")
res = model.invoke(input="你是谁呀能做什么？")
print(res)
```

## 代码解析

1. **导入模块**：从 `langchain_ollama` 导入 `OllamaLLM` 类，这是 LangChain 对 Ollama 本地模型的封装。

2. **创建模型实例**：`OllamaLLM(model="deepseek-r1:7b")` 创建一个本地模型实例，`model` 参数指定使用 `deepseek-r1:7b` 模型（DeepSeek 推理模型，7B 参数量）。Ollama 默认连接 `http://localhost:11434`。

3. **调用模型**：`model.invoke(input="你是谁呀能做什么？")` 使用与云端模型完全相同的 `invoke` 方法调用本地模型，无需修改任何调用逻辑。

4. **输出结果**：打印本地模型返回的响应内容。

## 关键要点

- `OllamaLLM` 类位于 `langchain_ollama` 模块中，是 LangChain 对 Ollama 的官方集成
- 本地模型运行无需网络请求，响应速度取决于本机硬件性能
- `invoke()` 接口与云端模型（如 Tongyi）完全一致，切换模型只需更改类名
- 使用前需确保 Ollama 服务已启动且指定模型已下载（`ollama pull deepseek-r1:7b`）
- 本地部署的优势：数据隐私安全、无 API 费用、离线可用

## 小结

通过 LangChain 的 OllamaLLM 类，我们可以像调用云端模型一样方便地访问本地部署的大模型。LangChain 的统一接口设计使得云端模型和本地模型的使用方式完全一致，开发者可以根据场景需求灵活选择，在数据隐私和模型能力之间取得平衡。

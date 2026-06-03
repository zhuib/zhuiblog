---
title: LangChain访问Ollama的本地嵌入模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain访问Ollama的本地嵌入模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain访问Ollama的本地嵌入模型

与本地大模型类似，Ollama 也支持运行本地嵌入模型。本文介绍如何通过 LangChain 访问 Ollama 部署的本地嵌入模型，实现完全本地化的文本向量化。

## 核心概念

**OllamaEmbeddings** 是 LangChain 对 Ollama 嵌入模型的封装，与 `DashScopeEmbeddings`（云端嵌入模型）提供完全相同的接口。这意味着在嵌入模型层面，云端和本地的切换也只需更改类名，无需修改业务代码。

关键要素：

- **OllamaEmbeddings**：来自 `langchain_ollama` 模块，封装了对 Ollama 嵌入模型的调用
- **相同的接口**：`embed_query()` 和 `embed_documents()` 方法与云端嵌入模型完全一致
- **本地部署**：嵌入计算在本地完成，无需网络请求，适合数据隐私敏感场景
- **model 参数**：指定 Ollama 中已安装的嵌入模型名称

使用前需要确保 Ollama 服务已启动且嵌入模型已下载（如 `ollama pull qwen3-embedding:4b`）。

## 代码示例

```python
from langchain_ollama import OllamaEmbeddings

model = OllamaEmbeddings(model="qwen3-embedding:4b")

print(model.embed_query("我喜欢你"))
print(model.embed_documents(["我喜欢你", "我稀饭你", "晚上吃啥"]))
```

## 代码解析

1. **导入模块**：从 `langchain_ollama` 导入 `OllamaEmbeddings` 类，与 `OllamaLLM` 和 `ChatOllama` 在同一个包中。

2. **创建嵌入模型实例**：`OllamaEmbeddings(model="qwen3-embedding:4b")` 创建本地嵌入模型实例，使用 `qwen3-embedding:4b` 嵌入模型。

3. **`embed_query("我喜欢你")`**：将单条文本转换为向量，返回浮点数列表。接口与 `DashScopeEmbeddings` 完全一致。

4. **`embed_documents([...])`**：批量将多条文本转换为向量，返回嵌套列表。同样与云端嵌入模型接口一致。

5. **本地计算**：所有嵌入计算在本地 GPU/CPU 上完成，无需发送数据到云端，保障数据隐私。

## 关键要点

- `OllamaEmbeddings` 位于 `langchain_ollama` 包中，与 `OllamaLLM` 同包
- `embed_query()` 和 `embed_documents()` 接口与云端嵌入模型完全一致
- 本地嵌入模型无需 API 密钥，无调用费用，数据不出本机
- 使用前需确保 Ollama 服务已启动且嵌入模型已下载
- 注意：不同嵌入模型输出的向量维度可能不同，同一系统中应使用同一嵌入模型

## 小结

通过 `OllamaEmbeddings`，我们可以实现完全本地化的文本嵌入，无需依赖任何云端服务。LangChain 统一的嵌入接口设计使得云端和本地嵌入模型可以无缝切换。在实际项目中，开发阶段可使用云端嵌入模型快速验证，生产环境可根据隐私和成本需求切换到本地嵌入模型。

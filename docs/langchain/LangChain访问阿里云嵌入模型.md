---
title: LangChain访问阿里云嵌入模型
date: 2025-06-15 11:15:53
permalink: /langchain/LangChain访问阿里云嵌入模型
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# LangChain访问阿里云嵌入模型

嵌入模型（Embedding Model）是将文本转换为向量的核心组件，是 RAG（检索增强生成）系统的基石。本文介绍如何通过 LangChain 访问阿里云的 DashScope 嵌入模型，将文本转换为高维向量表示。

## 核心概念

**嵌入（Embedding）** 是将文本映射到高维向量空间的过程。语义相近的文本在向量空间中的距离也更近，这使得我们可以通过向量相似度计算来实现语义检索。阿里云的 DashScope 平台提供了高质量的中文嵌入模型。

关键要素：

- **DashScopeEmbeddings**：来自 `langchain_community.embeddings` 模块，封装了阿里云 DashScope 嵌入模型的调用
- **`embed_query()`**：将单条文本转换为向量，通常用于嵌入用户查询
- **`embed_documents()`**：将多条文本批量转换为向量，通常用于嵌入文档库
- **向量维度**：嵌入模型输出的向量维度是固定的（如 1536 维），不同模型维度可能不同

使用前需要设置 `DASHSCOPE_API_KEY` 环境变量。

## 代码示例

```python
from langchain_community.embeddings import DashScopeEmbeddings

model = DashScopeEmbeddings()

print(model.embed_query("我喜欢你"))
print(model.embed_documents(["我喜欢你", "我稀饭你", "晚上吃啥"]))
```

## 代码解析

1. **导入模块**：从 `langchain_community.embeddings` 导入 `DashScopeEmbeddings` 类。

2. **创建嵌入模型实例**：`DashScopeEmbeddings()` 创建阿里云嵌入模型实例，默认使用 DashScope 的文本嵌入模型。

3. **`embed_query("我喜欢你")`**：将单条文本转换为向量，返回一个浮点数列表（如 `[0.123, -0.456, ...]`），向量维度取决于模型。该方法专为嵌入用户查询设计。

4. **`embed_documents([...])`**：将多条文本批量转换为向量，返回一个嵌套列表，每个元素是一条文本对应的向量。该方法专为嵌入文档库设计，支持批量处理以提高效率。

5. **语义相似性**：`"我喜欢你"` 和 `"我稀饭你"` 语义相近，它们的向量在空间中距离会很近；而 `"晚上吃啥"` 语义不同，向量距离会较远。

## 关键要点

- `DashScopeEmbeddings` 封装了阿里云的文本嵌入模型，适合中文场景
- `embed_query()` 嵌入单条文本，`embed_documents()` 批量嵌入多条文本
- 嵌入模型将文本转换为固定维度的浮点数向量
- 语义相近的文本在向量空间中距离更近，这是语义检索的基础
- 嵌入模型是 RAG 系统的核心组件，用于将文档和查询向量化

## 小结

嵌入模型是连接自然语言与向量空间的桥梁，它将文本转换为机器可计算的向量表示。通过 `DashScopeEmbeddings`，我们可以方便地使用阿里云的高质量中文嵌入模型。在 RAG 系统中，文档先通过 `embed_documents()` 向量化并存入向量数据库，查询时通过 `embed_query()` 向量化后进行相似度检索，从而实现语义级别的文档召回。

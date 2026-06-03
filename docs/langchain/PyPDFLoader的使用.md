---
title: PyPDFLoader的使用
date: 2025-06-15 11:15:53
permalink: /langchain/PyPDFLoader的使用
categories:
  - AI
tags:
  - 文档加载
author: zhuib
---

# PyPDFLoader的使用——加载PDF文件为Document对象

PDF是最常见的文档格式之一，在学术论文、技术文档、合同报告等领域广泛使用。LangChain的`PyPDFLoader`能够将PDF文件的内容提取为`Document`对象，支持按页分割和整体加载两种模式，还能处理加密的PDF文件。本文将介绍`PyPDFLoader`的使用方法和配置选项。

## 核心概念

**PyPDFLoader**：LangChain提供的文档加载器，专门用于读取PDF格式文件。它基于`pypdf`库实现，能够提取PDF中的文本内容并转换为`Document`对象。

**加载模式（mode参数）**：
- `mode="page"`（默认）：按页加载，每一页PDF内容生成一个独立的`Document`对象
- `mode="single"`：整体加载，整个PDF文件的所有内容合并为一个`Document`对象

**password参数**：对于加密的PDF文件，可以通过`password`参数提供解密密码。

**惰性加载**：`lazy_load()`方法逐页加载PDF内容，适合处理大型PDF文件时节省内存。

**Document结构**：
- `page_content`：PDF页面的文本内容
- `metadata`：包含`source`（文件路径）和`page`（页码）等元信息

## 代码示例

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

## 代码解析

1. **创建PyPDFLoader实例**：
   - `file_path`：指定PDF文件路径
   - `mode="single"`：将整个PDF内容合并为一个Document。如果使用`mode="page"`，则每页生成一个Document
   - `password="itheima"`：提供PDF文件的解密密码，用于打开加密的PDF文件

2. **惰性加载**：使用`lazy_load()`逐页迭代加载。即使`mode="single"`将内容合并为一个Document，底层仍然逐页读取后合并。

3. **计数输出**：通过计数器`i`记录加载的Document数量。当`mode="single"`时，通常只会输出1个Document；当`mode="page"`时，输出的Document数量等于PDF的页数。

4. **加密PDF处理**：`password`参数使得`PyPDFLoader`能够处理受密码保护的PDF文件，无需手动解密。

## 关键要点

- `PyPDFLoader`将PDF文件内容提取为`Document`对象
- `mode="page"`按页分割，每页一个Document；`mode="single"`整体加载为一个Document
- `password`参数支持加载加密的PDF文件
- `lazy_load()`惰性加载适合处理大型PDF文件
- 每个Document的`metadata`包含`source`（文件路径）和`page`（页码）信息

## 小结

`PyPDFLoader`是RAG应用中处理PDF文档的核心工具。通过灵活的加载模式，我们可以根据实际需求选择按页分割或整体加载。加密PDF的支持使其能够处理更多实际场景中的文档。在RAG流水线中，PDF加载通常是第一步，后续还需要进行文本分割和向量化存储，才能实现高效的文档检索。

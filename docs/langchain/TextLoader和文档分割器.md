---
title: TextLoader和文档分割器
date: 2025-06-15 11:15:53
permalink: /langchain/TextLoader和文档分割器
categories:
  - AI
tags:
  - 文档加载
author: zhuib
---

# TextLoader和文档分割器——RAG的文档预处理

在RAG应用中，加载原始文档只是第一步。由于大语言模型的上下文窗口有限，我们需要将长文档分割成适当大小的文本块，才能有效地进行向量化存储和检索。本文将介绍`TextLoader`文本加载器和`RecursiveCharacterTextSplitter`递归字符分割器的使用方法。

## 核心概念

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

## 代码示例

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

## 代码解析

1. **加载文本文件**：使用`TextLoader`加载`Python基础语法.txt`文件，指定UTF-8编码。`load()`方法返回包含一个`Document`的列表。

2. **创建分割器**：
   - `chunk_size=500`：每个文本块最大500个字符
   - `chunk_overlap=50`：相邻块之间重叠50个字符，保证上下文连续性
   - `separators`：分隔符优先级列表，先尝试双换行（段落），再单换行，再中英文句号、问号、感叹号，最后空格和空字符
   - `length_function=len`：使用Python内置的`len()`函数计算字符长度

3. **分割文档**：`split_documents()`方法接收`Document`列表，返回分割后的`Document`列表。每个分割后的`Document`保留了原始的`metadata`，并添加了分割相关的信息。

4. **输出结果**：先打印分割后的文档总数，再逐个输出每个文本块的内容，用分隔线区分不同块。

5. **中文分隔符**：特别注意`separators`中包含了中文标点符号`。`、`！`、`？`，这对于中文文本的分割效果至关重要。

## 关键要点

- `TextLoader`用于加载纯文本文件，是最简单的文档加载器
- `RecursiveCharacterTextSplitter`按分隔符优先级递归分割，是最常用的文本分割工具
- `chunk_size`控制每个文本块的最大大小，`chunk_overlap`控制相邻块的重叠量
- `separators`列表定义分隔符优先级，应包含中文标点以适应中文文本
- `split_documents()`保留原始`Document`的`metadata`信息
- 重叠区域确保分割后的文本块之间有上下文关联

## 小结

文档加载和分割是RAG流水线中至关重要的预处理步骤。`TextLoader`负责将原始文件加载为`Document`对象，`RecursiveCharacterTextSplitter`则将长文档分割为合适大小的文本块。合理的分割策略直接影响后续向量检索的质量——块太大则检索不精确，块太小则丢失上下文。通过调整`chunk_size`、`chunk_overlap`和`separators`参数，我们可以针对不同类型的文档优化分割效果，为RAG应用打下坚实的数据基础。

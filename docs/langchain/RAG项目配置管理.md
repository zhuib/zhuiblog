---
title: RAG项目配置管理
date: 2025-06-15 11:15:53
permalink: /langchain/RAG项目配置管理
categories:
  - AI
tags:
  - RAG
author: zhuib
---

# RAG项目配置管理——集中式参数维护

在RAG项目中，涉及向量数据库、文本分割器、嵌入模型、对话模型等多个组件，每个组件都有各自的参数。如果这些参数散落在各个模块中，修改时需要逐个文件查找，极易遗漏出错。集中式配置管理将所有参数统一维护在一个配置文件中，各模块通过导入引用，实现了"一处修改，处处生效"。本文将介绍RAG项目的配置文件设计与各参数的含义。

## 核心概念

- **Chroma配置**：向量数据库Chroma的`collection_name`（集合名称）和`persist_directory`（持久化目录），决定向量数据的存储位置和命名空间。
- **文本分割器参数**：`chunk_size`（分块大小）、`chunk_overlap`（重叠字符数）、`separators`（分隔符优先级列表），控制长文本如何被切分为适合向量化的小段。
- **相似度阈值**：`similarity_threshold`用于检索时控制返回结果的数量（k值），值越大返回越多候选文档。
- **模型名称配置**：`embedding_model_name`和`chat_model_name`分别指定嵌入模型和对话模型的名称，便于切换不同模型。
- **session_config**：`RunnableWithMessageHistory`所需的会话配置，通过`session_id`隔离不同用户的对话历史。

## 代码示例

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

## 代码解析

**1. MD5去重文件路径**

```python
md5_path = "./md5.text"
```
指定MD5校验文件的存储路径，用于知识库入库时的文档去重。每次上传文档时计算其内容的MD5哈希值，与已存储的哈希值比对，避免重复入库。

**2. Chroma向量数据库配置**

```python
collection_name = "rag"
persist_directory = "./chroma_db"
```
- `collection_name`：Chroma中的集合名称，类似于数据库中的表名，不同集合存储不同领域的向量数据。
- `persist_directory`：向量数据的磁盘持久化目录，Chroma会将向量索引和元数据保存到此目录，重启后可加载恢复。

**3. 文本分割器参数**

```python
chunk_size = 1000
chunk_overlap = 100
separators = ["\n\n", "\n", ".", "!", "?", "。", "！", "？", " ", ""]
max_split_char_number = 1000
```
- `chunk_size`：每个文本块的最大字符数，1000字符约为500个汉字，是常用的分块大小。
- `chunk_overlap`：相邻块之间的重叠字符数，100字符的重叠确保语义在分块边界处不会断裂。
- `separators`：分隔符优先级列表，`RecursiveCharacterTextSplitter`按此顺序尝试分割——先按双换行（段落），再按单换行（行），再按句号等标点，最后按空格和字符。中英文标点都包含在内。
- `max_split_char_number`：触发分割的字符数阈值，只有超过此长度的文本才会进行分割。

**4. 检索与模型配置**

```python
similarity_threshold = 1

embedding_model_name = "nomic-embed-text:latest"
chat_model_name = "deepseek-r1:7b"
```
- `similarity_threshold`：此处值为1，作为`as_retriever`的`k`参数，表示检索时返回最相似的1个文档块。
- `embedding_model_name`：Ollama本地部署的嵌入模型，用于将文本转为向量。
- `chat_model_name`：Ollama本地部署的对话模型，用于生成回答。

**5. 会话配置**

```python
session_config = {
    "configurable": {
        "session_id": "user_001",
    }
}
```
这是`RunnableWithMessageHistory`所需的标准配置格式。`session_id`用于区分不同用户的对话历史，确保每个用户拥有独立的上下文。在生产环境中，`session_id`应动态绑定到实际用户标识。

## 关键要点

- 集中式配置管理将所有参数统一维护，修改时只需编辑一个文件，避免参数散落各处导致的维护困难。
- `chunk_size`和`chunk_overlap`是文本分割的核心参数，需要根据文档类型和模型上下文窗口大小进行调整。
- `separators`列表同时包含中英文标点，确保对中文文档的分割效果良好，优先按语义边界（段落、句子）分割。
- `similarity_threshold`作为检索的k值，控制返回候选文档的数量，值越大召回越多但噪声也可能增加。
- `session_config`的`configurable.session_id`是`RunnableWithMessageHistory`识别对话会话的关键，生产环境需动态设置。

## 小结

本文介绍了RAG项目的集中式配置管理方案，涵盖向量数据库配置、文本分割器参数、检索阈值、模型名称和会话配置等核心参数。通过将所有参数集中在一个配置文件中，各模块通过`import`引用，实现了参数的统一管理和便捷调整。这种设计模式在项目迭代中尤为重要——当需要切换模型、调整分块策略或修改检索参数时，只需修改配置文件即可，无需深入各个业务模块。

---
title: RAG检索增强生成
date: 2025-06-15 11:15:53
permalink: /langchain/project/RAG检索增强生成
categories:
  - AI
tags:
  - RAG
author: zhuib
---

# RAG检索增强生成：让AI基于事实回答问题

## 什么是RAG？

RAG（Retrieval-Augmented Generation，检索增强生成）是一种将**信息检索**与**大模型生成**相结合的技术方案。它的核心思路是：

> 先从知识库中检索与用户问题相关的资料，再将检索结果作为上下文提供给大模型，让模型基于真实资料生成回答。

这种方式有效解决了大模型的两大痛点：
- **知识过时**：模型训练数据有截止日期
- **幻觉问题**：模型容易编造不存在的信息

## RAG的工作流程

```
用户提问
  ↓
1. 检索（Retrieval）：将用户问题转为向量，在向量库中搜索相似文档
  ↓
2. 增强（Augmented）：将检索到的文档作为上下文拼接到提示词中
  ↓
3. 生成（Generation）：大模型基于上下文生成回答
```

## 项目中的RAG实现

本项目通过`RagSummarizeService`类实现了完整的RAG流程：

### 核心代码

```python
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from rag.vector_store import VectorStoreService
from utils.prompt_loader import load_rag_prompts
from langchain_core.prompts import PromptTemplate
from model.factory import chat_model


class RagSummarizeService(object):
    def __init__(self):
        self.vector_store = VectorStoreService()
        self.retriever = self.vector_store.get_retriever()
        self.prompt_text = load_rag_prompts()
        self.prompt_template = PromptTemplate.from_template(self.prompt_text)
        self.model = chat_model
        self.chain = self._init_chain()
```

### 链式调用（Chain）

项目使用LangChain的LCEL（LangChain Expression Language）构建处理链：

```python
def _init_chain(self):
    chain = self.prompt_template | print_prompt | self.model | StrOutputParser()
    return chain
```

这条链的执行流程是：

```
prompt_template → print_prompt → model → StrOutputParser
   填充变量        调试打印      模型推理    解析输出
```

LCEL使用`|`操作符将多个组件串联，数据从左到右流过每个组件。

### 检索与总结

```python
def rag_summarize(self, query: str) -> str:
    # 1. 检索相关文档
    context_docs = self.retriever_docs(query)

    # 2. 拼接上下文
    context = ""
    counter = 0
    for doc in context_docs:
        counter += 1
        context += f"【参考资料{counter}】: 参考资料：{doc.page_content} | 参考元数据：{doc.metadata}\n"

    # 3. 调用链生成回答
    return self.chain.invoke(
        {
            "input": query,
            "context": context,
        }
    )
```

## RAG提示词设计

提示词模板定义了模型如何使用检索到的资料：

```
你是专注于"基于参考资料总结"的AI助手，需结合用户提问和向量检索到的参考资料，生成简洁准确的概括回答。

### 输入信息
1. 用户提问：{input}
2. 参考资料(在下一个###之前内容均为参考资料)：{context}

### 严格遵守以下约束（违反将导致回答无效）
1. 内容合规：禁止包含违法、侵权、攻击性信息；
2. 事实准确：回答必须完全基于参考资料中的信息，不编造、不添加未提及的内容；
3. 语言要求：仅用中文回答，语气客观、简洁，不冗余；
4. 聚焦提问：严格围绕用户原始提问总结，不扩充问题范围；
5. 格式要求：仅输出概括内容本身，以纯文本字符串形式呈现。
```

关键约束是**"回答必须完全基于参考资料中的信息，不编造"**，这是RAG防止幻觉的核心策略。

## RAG在智能体中的角色

在本项目中，RAG作为智能体的一个工具被调用：

```python
@tool(description="从向量存储中检索参考资料")
def rag_summarize(query: str) -> str:
    return rag.rag_summarize(query)
```

智能体在ReAct循环中自主决定何时调用RAG工具：

```
用户："小户型适合哪些扫地机器人？"
  ↓
思考：这需要专业知识，调用rag_summarize
  ↓
行动：rag_summarize("小户型适合哪些扫地机器人")
  ↓
观察：检索到3条相关参考资料
  ↓
思考：信息足够，生成回答
```

## RAG vs 纯大模型

| 维度 | 纯大模型 | RAG |
|------|---------|-----|
| 知识来源 | 训练数据 | 实时检索的知识库 |
| 准确性 | 可能产生幻觉 | 基于事实资料 |
| 可更新性 | 需重新训练 | 更新知识库即可 |
| 专业性 | 通用知识 | 可接入专业领域知识 |
| 成本 | 高（训练/微调） | 低（维护知识库） |

## 总结

RAG是让大模型"脚踏实地"的关键技术。通过"先检索、后生成"的方式，RAG确保模型的回答有据可依，有效解决了幻觉问题。在本项目中，RAG作为智能体的核心工具，为扫地机器人智能客服提供了专业的知识支撑，是整个系统回答专业问题的基石。

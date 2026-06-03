---
title: RunnablePassthrough的使用
date: 2025-06-15 11:15:53
permalink: /langchain/RunnablePassthrough的使用
categories:
  - AI
tags:
  - LCEL
author: zhuib
---

# RunnablePassthrough的使用——构建完整的RAG链

在前一篇文章中，我们通过手动方式实现了RAG的基础流程，代码虽然清晰但略显冗长。本文将介绍如何使用`RunnablePassthrough`和`as_retriever()`，以LCEL（LangChain Expression Language）的标准风格构建优雅的RAG链，实现自动化的检索-注入-生成流程。

## 核心概念

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

## 代码示例

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

## 代码解析

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

## 关键要点

- `RunnablePassthrough`将输入原样传递，用于在并行数据流中传递用户查询
- `as_retriever()`将向量存储转换为检索器，支持`search_kwargs`配置检索参数
- 字典语法`{"key": runnable}`构建并行数据流，不同路径同时处理输入
- `format_func`将`Document`列表格式化为字符串，桥接检索器和提示词模板
- LCEL风格的RAG链将检索、注入、生成整合为一条声明式链，代码简洁优雅

## 小结

`RunnablePassthrough`是构建LCEL风格RAG链的关键组件。通过字典语法构建并行数据流，我们实现了"用户查询同时流向检索器和提示词"的优雅设计。相比手动方式，LCEL风格的RAG链将整个流程声明为一条链，代码更简洁、更易维护。这是LangChain官方推荐的RAG实现方式，也是构建复杂RAG应用的基础模式。掌握这种模式后，可以进一步扩展，添加重排序、多路检索等高级功能。

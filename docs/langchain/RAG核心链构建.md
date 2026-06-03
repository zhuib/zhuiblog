---
title: RAG核心链构建
date: 2025-06-15 11:15:53
permalink: /langchain/RAG核心链构建
categories:
  - AI
tags:
  - RAG
author: zhuib
---

# RAG核心链构建——LCEL编排检索、提示词与对话历史

RAG（检索增强生成）的核心在于将"检索"与"生成"有机串联——先从知识库中检索相关文档，再将检索结果注入提示词，最后由大模型生成回答。LangChain的LCEL（LangChain Expression Language）提供了一种声明式的链编排方式，通过管道操作符`|`将各个组件像流水线一样组合，代码简洁且功能强大。本文将深入解析RAG核心链的构建过程，包括检索器集成、提示词模板设计、对话历史管理和LCEL链编排。

## 核心概念

- **RagService**：RAG服务的核心类，封装了检索器、提示词模板、对话模型和LCEL链的完整组装逻辑。
- **LCEL链组合**：LangChain Expression Language使用管道操作符`|`将Runnable组件串联，数据从左到右流经每个组件，实现声明式的链编排。
- **RunnablePassthrough/RunnableLambda**：`RunnablePassthrough`直接透传输入，`RunnableLambda`将普通函数包装为Runnable，两者配合实现复杂的数据路由和转换。
- **ChatPromptTemplate与MessagesPlaceholder**：聊天提示词模板支持多角色消息，`MessagesPlaceholder`为对话历史预留动态插入位置。
- **RunnableWithMessageHistory**：LCEL链的对话历史包装器，自动在链调用前后加载和保存对话消息，实现多轮对话的上下文管理。

## 代码示例

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
        # ... format functions and chain composition
        chain = (
            {"input": RunnablePassthrough(), "context": RunnableLambda(format_for_retriever) | retriever | format_document}
            | RunnableLambda(format_for_prompt_template) | self.prompt_template | self.chat_model | StrOutputParser()
        )
        conversation_chain = RunnableWithMessageHistory(chain, get_history, input_messages_key="input", history_messages_key="history")
        return conversation_chain
```

## 代码解析

**1. 向量检索服务初始化**

```python
self.vector_service = VectorStoreService(embedding=OllamaEmbeddings(model=config.embedding_model_name))
```
通过依赖注入将嵌入模型传入`VectorStoreService`，后者封装了Chroma向量数据库的检索功能。这种设计将向量数据库的连接管理与RAG链的业务逻辑解耦。

**2. 提示词模板设计**

```python
self.prompt_template = ChatPromptTemplate.from_messages([
    ("system", "以我提供的已知参考资料为主，简洁和专业的回答用户问题。参考资料:{context}。"),
    ("system", "并且我提供用户的对话历史记录，如下："),
    MessagesPlaceholder("history"),
    ("user", "请回答用户提问：{input}")
])
```
提示词模板包含四层消息：
- **系统消息1**：定义AI的角色和行为约束，要求基于参考资料回答，`{context}`占位符接收检索结果。
- **系统消息2**：提示存在对话历史记录，为历史消息的引入做铺垫。
- **MessagesPlaceholder**：动态插入对话历史消息列表，`"history"`键对应`RunnableWithMessageHistory`注入的历史。
- **用户消息**：包含当前用户提问，`{input}`占位符接收用户输入。

**3. LCEL链编排**

```python
chain = (
    {"input": RunnablePassthrough(), "context": RunnableLambda(format_for_retriever) | retriever | format_document}
    | RunnableLambda(format_for_prompt_template) | self.prompt_template | self.chat_model | StrOutputParser()
)
```
链的数据流如下：
1. **输入构造**：`RunnablePassthrough()`透传用户输入到`input`键；`RunnableLambda(format_for_retriever)`格式化检索查询 → `retriever`执行向量检索 → `format_document`格式化检索结果，输出到`context`键。
2. **格式转换**：`RunnableLambda(format_for_prompt_template)`将字典转为提示词模板所需的格式。
3. **提示词填充**：`self.prompt_template`将`input`、`context`、`history`填入模板。
4. **模型调用**：`self.chat_model`接收填充后的消息列表，生成回答。
5. **输出解析**：`StrOutputParser()`从模型输出中提取纯文本字符串。

**4. 对话历史包装**

```python
conversation_chain = RunnableWithMessageHistory(chain, get_history, input_messages_key="input", history_messages_key="history")
```
`RunnableWithMessageHistory`包装基础链，添加对话历史管理：
- `get_history`：工厂函数，根据`session_id`返回`BaseChatMessageHistory`实例。
- `input_messages_key="input"`：指定链输入中哪个键对应用户消息，用于保存到历史。
- `history_messages_key="history"`：指定提示词模板中哪个键对应历史消息，用于从历史加载。

## 关键要点

- LCEL通过管道操作符`|`实现声明式链编排，代码简洁直观，数据流向清晰可读。
- `RunnablePassthrough`透传输入，`RunnableLambda`包装自定义函数，两者配合实现字典构造和数据路由。
- `ChatPromptTemplate.from_messages`支持多角色消息模板，`MessagesPlaceholder`为对话历史预留动态位置。
- `RunnableWithMessageHistory`是LCEL链的对话历史增强层，自动管理历史的加载和保存，开发者只需关注业务逻辑。
- 检索→格式化→提示词→模型→解析的流水线设计，每个环节职责单一，便于独立调试和替换。

## 小结

本文深入解析了RAG核心链的构建过程。通过LCEL的管道操作符，将检索器、格式化函数、提示词模板、对话模型和输出解析器串联为一条完整的数据处理流水线。`RunnableWithMessageHistory`在基础链之上添加对话历史管理，实现多轮对话的上下文连贯。这种声明式的链编排方式，让RAG的核心逻辑一目了然，同时保持了各组件的独立性和可替换性。

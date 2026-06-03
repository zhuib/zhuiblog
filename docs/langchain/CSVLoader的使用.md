---
title: CSVLoader的使用
date: 2025-06-15 11:15:53
permalink: /langchain/CSVLoader的使用
categories:
  - AI
tags:
  - 文档加载
author: zhuib
---

# CSVLoader的使用——加载CSV文件为Document对象

在RAG（检索增强生成）应用中，第一步就是将外部数据加载到系统中。CSV是最常见的数据格式之一，广泛用于存储表格数据。LangChain提供了`CSVLoader`，能够将CSV文件的每一行转换为独立的`Document`对象，方便后续的文本分割和向量化处理。本文将介绍`CSVLoader`的使用方法和配置选项。

## 核心概念

**CSVLoader**：LangChain提供的文档加载器之一，专门用于读取CSV格式文件。它将CSV文件的每一行数据转换为一个`Document`对象，`Document`的`page_content`包含该行的所有字段内容，`metadata`包含来源信息等元数据。

**csv_args参数**：用于自定义CSV解析行为，支持Python标准库`csv.DictReader`的所有参数：
- `delimiter`：字段分隔符，默认为逗号`,`
- `quotechar`：引用字符，默认为双引号`"`
- `fieldnames`：自定义列名列表，当CSV文件没有表头时特别有用

**加载方式**：
- `load()`：一次性加载所有文档到内存，返回`List[Document]`
- `lazy_load()`：惰性加载，返回迭代器，适合处理大文件时节省内存

**Document结构**：每个Document包含`page_content`（文本内容）和`metadata`（元数据，如source文件路径、row行号等）。

## 代码示例

```python
from langchain_community.document_loaders import CSVLoader

loader = CSVLoader(
    file_path="./data/stu.csv",
    csv_args={
        "delimiter": ",",
        "quotechar": '"',
        "fieldnames": ['name', 'age', 'gender', '爱好']
    },
    encoding="utf-8"
)

for document in loader.lazy_load():
    print(document)
```

## 代码解析

1. **创建CSVLoader实例**：
   - `file_path`：指定CSV文件路径
   - `csv_args`：配置CSV解析参数
     - `delimiter: ","`：指定逗号为字段分隔符
     - `quotechar: '"'`：指定双引号为引用字符
     - `fieldnames`：自定义列名列表，当CSV文件没有表头或需要覆盖表头时使用
   - `encoding`：指定文件编码为UTF-8，避免中文乱码

2. **惰性加载**：使用`lazy_load()`逐行加载文档，每次只处理一行数据。相比`load()`一次性加载所有数据，惰性加载更节省内存，特别适合处理大型CSV文件。

3. **输出结果**：每个`Document`对象的`page_content`包含该行所有字段的键值对文本，`metadata`包含`source`（文件路径）和`row`（行号）等信息。

## 关键要点

- `CSVLoader`将CSV文件的每一行转换为一个`Document`对象
- `csv_args`支持自定义分隔符、引用字符和列名等CSV解析参数
- `fieldnames`参数可用于指定列名，适用于无表头或需要覆盖表头的场景
- `load()`一次性加载所有文档，`lazy_load()`惰性加载节省内存
- 每个`Document`的`metadata`包含`source`（文件路径）和`row`（行号）信息

## 小结

`CSVLoader`是RAG数据加载环节的基础工具，它将结构化的CSV数据转换为LangChain标准的`Document`对象，为后续的文本分割、向量化存储和检索奠定基础。通过灵活的`csv_args`配置，我们可以适应各种CSV格式变体。在实际项目中，建议优先使用`lazy_load()`处理大文件，以避免内存溢出问题。

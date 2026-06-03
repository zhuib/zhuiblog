---
title: JSONLoader的使用
date: 2025-06-15 11:15:53
permalink: /langchain/JSONLoader的使用
categories:
  - AI
tags:
  - 文档加载
author: zhuib
---

# JSONLoader的使用——加载JSON文件为Document对象

JSON是现代数据交换的主流格式，在Web API、配置文件和NoSQL数据库中广泛使用。LangChain的`JSONLoader`能够从JSON文件中提取指定字段，将其转换为`Document`对象。通过`jq`语法的支持，`JSONLoader`可以灵活地定位和提取JSON中的任意数据。本文将介绍`JSONLoader`的使用方法和关键配置。

## 核心概念

**JSONLoader**：LangChain提供的文档加载器，专门用于读取JSON格式文件。它使用`jq`语法来指定要提取的字段路径，将提取到的内容封装为`Document`对象。

**jq_schema**：使用`jq`语法定义的数据提取路径，是`JSONLoader`最核心的参数：
- `".name"`：提取JSON中每个对象的`name`字段
- `".[].name"`：提取数组中每个对象的`name`字段
- `"."`：提取整个JSON对象

**text_content**：控制提取结果的处理方式：
- `text_content=True`（默认）：将提取结果作为纯文本内容
- `text_content=False`：将提取结果保持原始格式（如JSON字符串），适用于提取结构化数据

**json_lines**：当设置为`True`时，表示输入文件为JSONLines格式（每行一个独立的JSON对象），这是日志处理等场景常用的格式。

## 代码示例

```python
from langchain_community.document_loaders import JSONLoader

loader = JSONLoader(
    file_path="./data/stu_json_lines.json",
    jq_schema=".name",
    text_content=False,
    json_lines=True
)

document = loader.load()
print(document)
```

## 代码解析

1. **创建JSONLoader实例**：
   - `file_path`：指定JSON文件路径，此处为JSONLines格式文件
   - `jq_schema=".name"`：使用jq语法提取每个JSON对象的`name`字段
   - `text_content=False`：不将提取结果转为纯文本，保持原始格式
   - `json_lines=True`：标识文件为JSONLines格式，每行一个独立JSON对象

2. **加载文档**：使用`load()`方法加载所有文档。对于JSONLines格式，每行JSON对象会生成一个独立的`Document`。

3. **输出结果**：每个`Document`的`page_content`包含提取到的`name`字段值，`metadata`包含来源信息。

4. **JSONLines格式**：与标准JSON不同，JSONLines文件每行是一个独立的JSON对象，格式如：
   ```json
   {"name": "张三", "age": 20}
   {"name": "李四", "age": 22}
   ```
   这种格式特别适合流式处理和日志场景。

## 关键要点

- `JSONLoader`使用`jq`语法（`jq_schema`参数）指定数据提取路径
- `text_content=False`保持提取结果的原始格式，适用于结构化数据
- `json_lines=True`用于处理JSONLines格式文件（每行一个JSON对象）
- `jq_schema=".name"`提取每个对象的`name`字段
- `JSONLoader`将提取到的每个数据项封装为独立的`Document`对象

## 小结

`JSONLoader`为RAG应用提供了灵活的JSON数据加载能力。通过`jq`语法的强大表达力，我们可以精确定位和提取JSON中的任意数据字段。`json_lines`参数的支持使其能够处理JSONLines这种常见的流式数据格式。在实际项目中，根据数据格式选择合适的参数配置，是高效加载数据的关键。

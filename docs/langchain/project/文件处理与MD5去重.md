---
title: 文件处理与MD5去重
date: 2025-06-15 11:15:53
permalink: /langchain/project/文件处理与MD5去重
categories:
  - AI
tags:
  - LangChain
author: zhuib
---

# 文件处理与MD5去重：知识库的增量更新机制

## 为什么需要文件处理？

RAG系统的知识来源于文档文件，但原始文件格式各异（PDF、TXT等），需要经过统一的处理流程才能存入向量库：

```
原始文件 → 文档加载 → 文本分片 → 向量化 → 存入向量库
```

同时，知识库需要支持**增量更新**——新增文件时只处理新文件，避免重复加载。

## 文件加载器

项目支持两种文件格式的加载：

### PDF加载器

```python
from langchain_community.document_loaders import PyPDFLoader

def pdf_loader(filepath: str, passwd=None) -> list[Document]:
    return PyPDFLoader(filepath, passwd).load()
```

- 使用`PyPDFLoader`解析PDF文件
- 支持密码保护的PDF（可选passwd参数）
- 返回`Document`对象列表，每个对象对应PDF的一页

### TXT加载器

```python
from langchain_community.document_loaders import TextLoader

def txt_loader(filepath: str) -> list[Document]:
    return TextLoader(filepath, encoding="utf-8").load()
```

- 使用`TextLoader`读取纯文本文件
- 指定UTF-8编码，确保中文正确解析
- 返回包含单个`Document`的列表

### LangChain Document对象

`Document`是LangChain中文档的标准表示：

```python
Document(
    page_content="文档的文本内容",   # 文本内容
    metadata={"source": "file.pdf"}  # 元数据（来源、页码等）
)
```

## 文件类型过滤

```python
def listdir_with_allowed_type(path: str, allowed_types: tuple[str]) -> tuple[str]:
    files = []

    if not os.path.isdir(path):
        logger.error(f"[listdir_with_allowed_type]{path}不是文件夹")
        return allowed_types

    for f in os.listdir(path):
        if f.endswith(allowed_types):
            files.append(os.path.join(path, f))

    return tuple(files)
```

只扫描指定后缀的文件，避免处理无关文件。配置中指定了允许的类型：

```yaml
allow_knowledge_file_type: ["txt", "pdf"]
```

## MD5去重机制

### 为什么需要去重？

向量库每次启动时都会调用`load_document()`，如果不做去重：
- 同一文件会被重复加载
- 向量库中出现大量重复数据
- 检索结果冗余，影响回答质量

### MD5计算

```python
import hashlib

def get_file_md5_hex(filepath: str) -> str:
    if not os.path.exists(filepath):
        logger.error(f"[md5计算]文件{filepath}不存在")
        return

    md5_obj = hashlib.md5()

    chunk_size = 4096  # 4KB分片，避免大文件爆内存
    with open(filepath, "rb") as f:  # 必须二进制读取
        while chunk := f.read(chunk_size):
            md5_obj.update(chunk)

        md5_hex = md5_obj.hexdigest()
        return md5_hex
```

**关键设计**：
- 使用4KB分片读取，避免大文件一次性加载到内存
- 必须用二进制模式（`"rb"`）读取，确保MD5计算准确
- 使用Python 3.8+的海象运算符`:=`简化循环

### 去重流程

```python
def load_document(self):
    # 检查MD5是否已存在
    def check_md5_hex(md5_for_check: str):
        if not os.path.exists(get_abs_path(chroma_conf["md5_hex_store"])):
            open(get_abs_path(chroma_conf["md5_hex_store"]), "w", encoding="utf-8").close()
            return False  # 未处理过

        with open(get_abs_path(chroma_conf["md5_hex_store"]), "r", encoding="utf-8") as f:
            for line in f.readlines():
                if line.strip() == md5_for_check:
                    return True  # 已处理过
            return False  # 未处理过

    # 保存已处理的MD5
    def save_md5_hex(md5_for_check: str):
        with open(get_abs_path(chroma_conf["md5_hex_store"]), "a", encoding="utf-8") as f:
            f.write(md5_for_check + "\n")
```

### 完整加载流程

```
遍历data目录下的文件
  ↓
计算文件MD5
  ↓
MD5已存在？ → 是 → 跳过
  ↓ 否
加载文件内容（PDF/TXT）
  ↓
内容为空？ → 是 → 跳过
  ↓ 否
文本分片
  ↓
分片为空？ → 是 → 跳过
  ↓ 否
存入向量库
  ↓
记录MD5
```

## MD5存储文件

```
# md5.text
a1b2c3d4e5f6...
f6e5d4c3b2a1...
```

每行一个MD5值，简单高效。文件路径通过配置管理：

```yaml
md5_hex_store: md5.text
```

## 异常处理

加载过程中对每个文件单独try-catch，确保单个文件失败不影响整体：

```python
try:
    documents = get_file_documents(path)
    split_document = self.spliter.split_documents(documents)
    self.vector_store.add_documents(split_document)
    save_md5_hex(md5_hex)
    logger.info(f"[加载知识库]{path} 内容加载成功")
except Exception as e:
    logger.error(f"[加载知识库]{path}加载失败：{str(e)}", exc_info=True)
    continue  # 继续处理下一个文件
```

`exc_info=True`会记录完整的异常堆栈，便于排查问题。

## 总结

文件处理与MD5去重是知识库管理的基础设施。通过统一的文件加载接口、MD5增量更新机制和完善的异常处理，项目实现了一个健壮的知识库加载系统，支持PDF和TXT两种格式，能够高效地增量更新知识库内容。

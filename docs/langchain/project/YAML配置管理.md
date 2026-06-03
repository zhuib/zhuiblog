---
title: YAML配置管理
date: 2025-06-15 11:15:53
permalink: /langchain/project/YAML配置管理
categories:
  - AI
tags:
  - LangChain
author: zhuib
---

# YAML配置管理：让项目配置更优雅

## 为什么使用YAML管理配置？

在项目中，硬编码配置值（如模型名称、文件路径、分片参数等）会导致：
- 修改配置需要改代码、重新部署
- 不同环境（开发/测试/生产）配置不同，难以管理
- 敏感信息（如API Key）暴露在代码中

YAML（YAML Ain't Markup Language）是一种人类可读的配置格式，特别适合管理项目配置。

## 项目中的配置文件结构

```
config/
├── rag.yml        # 模型配置
├── chroma.yml     # 向量库配置
├── prompts.yml    # 提示词路径配置
└── agent.yml      # Agent配置
```

### rag.yml —— 模型配置

```yaml
chat_model_name: llama3.1:8b
embedding_model_name: nomic-embed-text:latest
```

定义对话模型和嵌入模型的名称，切换模型只需修改此处。

### chroma.yml —— 向量库配置

```yaml
collection_name: agent
persist_directory: chroma_db
k: 3
data_path: data
md5_hex_store: md5.text
allow_knowledge_file_type: ["txt", "pdf"]

chunk_size: 200
chunk_overlap: 20
separators: ["\n\n", "\n", ".", "!", "?", "。", "！", "？", " ", ""]
```

涵盖了向量库连接、检索参数、文件加载和分片策略的所有配置。

### prompts.yml —— 提示词路径配置

```yaml
main_prompt_path: prompts/main_prompt.txt
rag_summarize_prompt_path: prompts/rag_summarize.txt
report_prompt_path: prompts/report_prompt.txt
```

将提示词内容与路径配置分离，修改提示词只需编辑对应的txt文件。

### agent.yml —— Agent配置

```yaml
external_data_path: data/external/records.csv
```

定义外部数据源的路径。

## 配置加载实现

```python
import yaml
from utils.path_tool import get_abs_path


def load_rag_config(config_path: str = get_abs_path("config/rag.yml"), encoding: str = "utf-8"):
    with open(config_path, "r", encoding=encoding) as f:
        return yaml.load(f, Loader=yaml.FullLoader)


def load_chroma_config(config_path: str = get_abs_path("config/chroma.yml"), encoding: str = "utf-8"):
    with open(config_path, "r", encoding=encoding) as f:
        return yaml.load(f, Loader=yaml.FullLoader)


def load_prompts_config(config_path: str = get_abs_path("config/prompts.yml"), encoding: str = "utf-8"):
    with open(config_path, "r", encoding=encoding) as f:
        return yaml.load(f, Loader=yaml.FullLoader)


def load_agent_config(config_path: str = get_abs_path("config/agent.yml"), encoding: str = "utf-8"):
    with open(config_path, "r", encoding=encoding) as f:
        return yaml.load(f, Loader=yaml.FullLoader)
```

### 全局配置实例

```python
rag_conf = load_rag_config()
chroma_conf = load_chroma_config()
prompts_conf = load_prompts_config()
agent_conf = load_agent_config()
```

模块加载时即创建配置实例，其他模块通过导入直接使用：

```python
from utils.config_handler import rag_conf, chroma_conf, prompts_conf, agent_conf
```

## 配置的使用方式

```python
# 在模型工厂中使用
chat_model = ChatOllama(model=rag_conf["chat_model_name"])

# 在向量存储中使用
self.vector_store = Chroma(
    collection_name=chroma_conf["collection_name"],
    embedding_function=embed_model,
    persist_directory=chroma_conf["persist_directory"],
)

# 在提示词加载中使用
system_prompt_path = get_abs_path(prompts_conf["main_prompt_path"])
```

## YAML配置的优势

| 特性 | 硬编码 | YAML配置 |
|------|--------|----------|
| 可读性 | 分散在代码中 | 集中在配置文件 |
| 修改方式 | 改代码重新部署 | 改配置重启即可 |
| 环境切换 | 需要条件判断 | 切换配置文件 |
| 版本管理 | 混在代码变更中 | 配置变更独立追踪 |
| 团队协作 | 容易冲突 | 配置与逻辑分离 |

## YAML语法要点

```yaml
# 键值对
chat_model_name: llama3.1:8b

# 列表
allow_knowledge_file_type: ["txt", "pdf"]

# 也可以写成多行
separators:
  - "\n\n"
  - "\n"
  - "."
  - "!"

# 数值
chunk_size: 200
k: 3
```

## 总结

YAML配置管理是项目工程化的基础。通过将配置与代码分离，项目变得更加灵活和可维护。本项目的四层配置文件（模型、向量库、提示词、Agent）清晰划分了不同关注点，配合`get_abs_path`工具函数，实现了配置的统一管理和便捷访问。

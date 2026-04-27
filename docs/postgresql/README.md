---
title: PostgreSQL 向量学习指南
date: 2026-04-21 10:00:00
permalink: /postgresql/vector-learning/
categories:
  - 数据库
  - PostgreSQL
tags:
  - PostgreSQL
  - 向量数据库
  - AI
  - RAG
author: zhuib
---

# PostgreSQL 向量学习指南

在 PostgreSQL 中学习向量（Vector），通常是指使用 pgvector 扩展——这是目前最流行的 Postgres 向量数据库解决方案，用于存储 AI 嵌入（embeddings）并进行相似性搜索。

以下是完整的学习路径，结合你正在使用的 OrbStack 环境：

## 1. 什么是 pgvector？

pgvector 是 PostgreSQL 的开源扩展，让你可以：
- 存储高维向量（如 OpenAI 的 1536 维文本嵌入）
- 执行相似性搜索（cosine similarity / L2 distance）
- 构建 AI 应用（RAG、语义搜索、推荐系统）

## 2. 在 OrbStack 中安装 pgvector

标准 Postgres 镜像默认不包含 pgvector，你有两种选择：

### 方案 A：使用预装 pgvector 的镜像（推荐）

修改你的 docker-compose.yml：

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16  # 官方 pgvector 镜像，基于 Postgres 16
    container_name: postgres-vector
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: vectordb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

然后运行：

```bash
docker-compose down  # 如果之前有容器
docker-compose up -d
```

### 方案 B：在现有容器中手动安装

如果你不想重建容器：

```bash
# 进入运行中的 Postgres 容器
docker exec -it postgres /bin/bash

# 安装 pgvector（Debian/Ubuntu 基础镜像）
apt-get update
apt-get install -y postgresql-16-pgvector

# 退出并重启容器
exit
docker restart postgres
```

## 3. 基础学习：启用扩展并操作向量

连接数据库后开始学习：

```bash
# 连接
docker exec -it postgres psql -U user -d vectordb
```

### 3.1 启用扩展

```sql
-- 创建扩展（每个数据库只需一次）
CREATE EXTENSION IF NOT EXISTS vector;

-- 验证安装
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### 3.2 创建向量表

```sql
-- 创建一个存储文档和向量嵌入的表
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,                    -- 原始文本
    embedding VECTOR(1536),          -- OpenAI 默认维度，可自定义
    metadata JSONB                   -- 存储额外信息（来源、时间等）
);

-- 插入示例数据（模拟 3 维向量，实际通常是 384/768/1536 维）
INSERT INTO documents (content, embedding) VALUES
    ('PostgreSQL 教程', '[1.0, 2.0, 3.0]'),
    ('Python 编程', '[1.1, 2.1, 3.1]'),
    ('机器学习基础', '[8.0, 9.0, 10.0]');
```

### 3.3 相似性搜索（核心操作）

```sql
-- 查找与查询向量最相似的 3 条记录（使用 L2 距离）
SELECT id, content, embedding <-> '[1.0, 2.0, 3.0]' AS distance
FROM documents
ORDER BY embedding <-> '[1.0, 2.0, 3.0]'
LIMIT 3;

-- 使用余弦相似度（-1 到 1，越接近 1 越相似）
SELECT content, embedding <=> '[1.0, 2.0, 3.0]' AS cosine_distance
FROM documents
ORDER BY embedding <=> '[1.0, 2.0, 3.0]'
LIMIT 3;
```

**操作符说明：**
- `<->` : L2 距离（欧几里得距离）
- `<=>` : 余弦距离（Cosine distance）
- `<#>` : 内积（Inner product）

## 4. 性能优化：向量索引（必学）

当数据量超过几千条时，必须创建索引否则查询会很慢。

### 4.1 HNSW 索引（推荐，PostgreSQL 14+）

```sql
-- HNSW 索引：速度快，内存占用高，适合实时查询
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### 4.2 IVFFlat 索引（传统方案）

```sql
-- IVFFlat：节省内存，适合静态数据
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);  -- lists 根据数据量调整，通常是行数的平方根
```

### 4.3 查询参数调优

```sql
-- HNSW 搜索时指定 ef（探索因子），越大越精确但越慢
SET hnsw.ef_search = 100;

SELECT * FROM documents
ORDER BY embedding <=> '[1.0, 2.0, 3.0]'::vector
LIMIT 5;
```

## 5. 实战项目：构建 RAG 系统

学习向量的最佳方式是做一个 RAG（Retrieval-Augmented Generation）应用：

### 步骤 1：生成真实嵌入（Python）

```python
# 需要安装：pip install openai psycopg2-binary pgvector
import openai
import psycopg2
from pgvector.psycopg2 import register_vector

# 连接数据库
conn = psycopg2.connect("postgresql://user:password@localhost:5432/vectordb")
register_vector(conn)

# 生成文本嵌入
def get_embedding(text):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

# 插入带真实向量的数据
cur = conn.cursor()
text = "PostgreSQL 是强大的开源数据库"
embedding = get_embedding(text)
cur.execute(
    "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
    (text, embedding)
)
conn.commit()
```

### 步骤 2：语义搜索

```python
# 搜索相关文档
query = "推荐数据库教程"
query_embedding = get_embedding(query)

cur.execute("""
    SELECT content, embedding <=> %s::vector AS distance
    FROM documents
    ORDER BY embedding <=> %s::vector
    LIMIT 3
""", (query_embedding, query_embedding))

results = cur.fetchall()
for content, distance in results:
    print(f"相关度: {1-distance:.3f}, 内容: {content}")
```

## 6. 进阶学习路径

### 混合搜索（全文检索 + 向量）

```sql
-- 结合 PostgreSQL 全文检索和向量搜索
SELECT
    id,
    content,
    ts_rank(to_tsvector('chinese', content), plainto_tsquery('数据库')) AS text_rank,
    1 - (embedding <=> query_vec) AS semantic_score
FROM documents
WHERE to_tsvector('chinese', content) @@ plainto_tsquery('数据库')
ORDER BY text_rank * 0.3 + semantic_score * 0.7 DESC;
```

### 分区表（海量数据）

```sql
-- 按类别分区存储向量
CREATE TABLE documents_partitioned (
    id SERIAL,
    category TEXT,
    embedding VECTOR(1536)
) PARTITION BY LIST (category);
```

## 7. 推荐学习资源

- **官方文档**: [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)（必读 README）
- **交互式教程**: pgvector 官方示例
- **书籍**: 《Postgres 向量实战》（如果有中文资源）
- **视频**: YouTube 搜索 "pgvector tutorial" + "RAG"

## 关键概念速查表

| 概念 | 说明 |
|------|------|
| Embedding | 文本/图片转换为数字向量（如 1536 维数组） |
| Cosine Similarity | 向量夹角余弦值，衡量语义相似度 |
| HNSW | 分层导航小世界图算法，近似最近邻搜索 |
| RAG | 检索增强生成，结合向量搜索和 LLM |

通过以上学习路径，你可以全面掌握 PostgreSQL 中的向量功能，为构建 AI 应用打下坚实基础。
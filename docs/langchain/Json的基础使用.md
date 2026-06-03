---
title: Json的基础使用
date: 2025-06-15 11:15:53
permalink: /langchain/Json的基础使用
categories:
  - AI
tags:
  - JSON
author: zhuib
---

# Json的基础使用——Python中JSON的序列化与反序列化

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，因其简洁、易读的特点，已成为前后端数据交互和配置文件存储的事实标准。在 Python 中，标准库 `json` 模块提供了完整的 JSON 序列化与反序列化支持，使我们能够轻松地在 Python 对象与 JSON 字符串之间进行转换。本文将系统介绍 JSON 在 Python 中的基础使用方法。

## 核心概念

### JSON 序列化（json.dumps）

序列化是指将 Python 对象转换为 JSON 格式字符串的过程。`json.dumps()` 是最常用的序列化函数，其名称中的 `dumps` 意为"dump string"，即输出为字符串。

关键参数：
- `ensure_ascii`：默认为 `True`，会将非 ASCII 字符（如中文）转义为 Unicode 编码。设置为 `False` 时，中文字符将原样输出，这在处理中文数据时尤为重要。
- `indent`：设置缩进空格数，用于美化输出。
- `sort_keys`：设置为 `True` 时，按键名字母顺序排序输出。

### JSON 反序列化（json.loads）

反序列化是指将 JSON 格式字符串转换回 Python 对象的过程。`json.loads()` 是最常用的反序列化函数，其名称中的 `loads` 意为"load string"，即从字符串加载。

### 数据类型映射

JSON 与 Python 之间的数据类型存在如下对应关系：

| JSON 类型 | Python 类型 |
|-----------|------------|
| object    | dict       |
| array     | list       |
| string    | str        |
| number    | int/float  |
| true      | True       |
| false     | False      |
| null      | None       |

### 字典与列表结构

JSON 最常用的两种数据结构：
- **对象（object）**：对应 Python 的字典（dict），使用花括号 `{}`，由键值对组成
- **数组（array）**：对应 Python 的列表（list），使用方括号 `[]`，由有序元素组成

## 代码示例

```python
import json

d = {
    "name": "周杰轮",
    "age": 11,
    "gender": "男"
}

s = json.dumps(d, ensure_ascii=False)
print(s)

l = [
    {"name": "周杰轮", "age": 11, "gender": "男"},
    {"name": "蔡依临", "age": 12, "gender": "女"},
    {"name": "小明", "age": 16, "gender": "男"}
]

print(json.dumps(l, ensure_ascii=False))

json_str = '{"name": "周杰轮", "age": 11, "gender": "男"}'
json_array_str = '[{"name": "周杰轮", "age": 11, "gender": "男"}, {"name": "蔡依临", "age": 12, "gender": "女"}, {"name": "小明", "age": 16, "gender": "男"}]'

res_dict = json.loads(json_str)
print(res_dict, type(res_dict))

res_list = json.loads(json_array_str)
print(res_list, type(res_list))
```

## 代码解析

**1. 字典序列化**

```python
d = {"name": "周杰轮", "age": 11, "gender": "男"}
s = json.dumps(d, ensure_ascii=False)
```

将 Python 字典 `d` 序列化为 JSON 字符串。`ensure_ascii=False` 确保中文字符"周杰轮"和"男"不会被转义为 `\uXXXX` 格式，而是原样输出。输出结果为：`{"name": "周杰轮", "age": 11, "gender": "男"}`

**2. 列表序列化**

```python
l = [
    {"name": "周杰轮", "age": 11, "gender": "男"},
    {"name": "蔡依临", "age": 12, "gender": "女"},
    {"name": "小明", "age": 16, "gender": "男"}
]
print(json.dumps(l, ensure_ascii=False))
```

将包含多个字典的 Python 列表序列化为 JSON 数组字符串。JSON 数组用方括号 `[]` 包裹，每个元素是一个 JSON 对象。`ensure_ascii=False` 同样确保中文正常显示。

**3. JSON 字符串反序列化为字典**

```python
json_str = '{"name": "周杰轮", "age": 11, "gender": "男"}'
res_dict = json.loads(json_str)
print(res_dict, type(res_dict))
```

将 JSON 对象字符串反序列化为 Python 字典。`json.loads()` 会自动识别 JSON 中的数据类型并转换为对应的 Python 类型。输出结果为字典对象，`type()` 验证其类型为 `<class 'dict'>`。

**4. JSON 数组字符串反序列化为列表**

```python
json_array_str = '[{"name": "周杰轮", ...}, ...]'
res_list = json.loads(json_array_str)
print(res_list, type(res_list))
```

将 JSON 数组字符串反序列化为 Python 列表。列表中的每个元素都是字典对象，`type()` 验证其类型为 `<class 'list'>`。

## 关键要点

- **json.dumps()** 将 Python 对象序列化为 JSON 字符串，**json.loads()** 将 JSON 字符串反序列化为 Python 对象
- **ensure_ascii=False** 是处理中文数据时的必备参数，否则中文字符会被转义为 Unicode 编码
- JSON 对象对应 Python 字典（dict），JSON 数组对应 Python 列表（list）
- 序列化与反序列化是互逆操作，可以无损地完成 Python 对象与 JSON 字符串之间的转换
- `json` 模块是 Python 标准库的一部分，无需额外安装

## 小结

JSON 是现代软件开发中最常用的数据交换格式之一，Python 的 `json` 模块提供了简洁高效的序列化与反序列化接口。掌握 `json.dumps()` 和 `json.loads()` 的基本用法，特别是 `ensure_ascii=False` 参数的使用，是处理中文 JSON 数据的基础。在实际的大模型应用开发中，JSON 更是结构化输出的核心格式，后续的信息抽取等任务都将依赖 JSON 来组织数据。

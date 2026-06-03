---
title: 模板类的format和invoke方法
date: 2025-06-15 11:15:53
permalink: /langchain/模板类的format和invoke方法
categories:
  - AI
tags:
  - 提示词
author: zhuib
---

# 模板类的format和invoke方法——两种模板填充方式

LangChain 的提示词模板类提供了两种填充变量的方法：`format()` 和 `invoke()`。虽然两者都能完成变量替换，但返回类型和适用场景有所不同，理解它们的区别对于正确使用模板至关重要。

## 核心概念

**`format()` 方法**和 **`invoke()` 方法**是模板填充的两种方式，核心区别在于返回类型：

- **`format()`**：返回 `str` 类型，是 Python 字符串格式化的扩展，结果就是纯文本字符串
- **`invoke()`**：返回 `PromptValue` 类型，是 LangChain 的 `Runnable` 接口方法，结果是一个可传递给链的对象

这涉及到 LangChain 的类继承体系：

- `PromptTemplate` 继承自 `RunnableSerializable`
- `RunnableSerializable` 继承自 `Runnable`
- `Runnable` 定义了 `invoke()`、`stream()` 等方法
- `format()` 是 `PromptTemplate` 自身的方法，不涉及 Runnable 体系

## 代码示例

```python
from langchain_core.prompts import PromptTemplate

template = PromptTemplate.from_template("我的邻居是：{lastname}，最喜欢：{hobby}")

res = template.format(lastname="张大明", hobby="钓鱼")
print(res, type(res))

res2 = template.invoke({"lastname": "周杰轮", "hobby": "唱歌"})
print(res2, type(res2))
```

## 代码解析

1. **创建模板**：`PromptTemplate.from_template("我的邻居是：{lastname}，最喜欢：{hobby}")` 定义包含两个占位符的模板。

2. **`format()` 方法**：
   - `template.format(lastname="张大明", hobby="钓鱼")` 使用关键字参数填充变量
   - 返回值是 `str` 类型，即 `"我的邻居是：张大明，最喜欢：钓鱼"`
   - 适合只需要纯文本字符串的场景

3. **`invoke()` 方法**：
   - `template.invoke({"lastname": "周杰轮", "hobby": "唱歌"})` 使用字典填充变量
   - 返回值是 `PromptValue` 类型，这是 LangChain 的 Runnable 体系中的对象
   - `PromptValue` 可以通过 `.to_string()` 转为字符串，也可以通过 `.to_messages()` 转为消息列表
   - 适合在 LCEL 链中使用的场景，因为 `invoke()` 是 `Runnable` 接口的标准方法

4. **参数传递方式**：
   - `format()` 使用关键字参数：`format(lastname="张大明", hobby="钓鱼")`
   - `invoke()` 使用字典：`invoke({"lastname": "周杰轮", "hobby": "唱歌"})`

## 关键要点

- `format()` 返回 `str` 类型，`invoke()` 返回 `PromptValue` 类型
- `format()` 使用关键字参数传值，`invoke()` 使用字典传值
- `invoke()` 是 `Runnable` 接口方法，支持在 LCEL 链中自动流转
- `PromptValue` 可通过 `.to_string()` 转字符串，`.to_messages()` 转消息列表
- 在 LCEL 链中（如 `template | model`），内部使用 `invoke()` 传递数据

## 小结

`format()` 和 `invoke()` 是模板填充的两种方式，各有适用场景。如果只需要获取填充后的字符串，使用 `format()` 更直接；如果需要在 LCEL 链中使用模板，`invoke()` 是标准方式，因为它是 `Runnable` 接口的一部分，支持链式调用和数据自动流转。理解两者的区别，有助于在实际开发中做出正确选择。

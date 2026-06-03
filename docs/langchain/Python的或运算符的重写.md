---
title: Python的或运算符重写
date: 2025-06-15 11:15:53
permalink: /langchain/Python的或运算符的重写
categories:
  - AI
tags:
  - Python
author: zhuib
---

# Python的或运算符重写——理解LCEL管道符的底层原理

在前面的文章中，我们频繁使用了 LangChain 的 LCEL 管道符 `|` 来串联组件。这个管道符看似神奇，实际上它利用了 Python 的运算符重写机制。本文通过自定义类模拟 LCEL 的管道符实现，揭示其底层原理。

## 核心概念

Python 允许类通过定义特殊方法（魔术方法）来重写内置运算符的行为。LCEL 的管道符 `|` 正是利用了 `__or__` 魔术方法：

- **`__or__` 方法**：当对象出现在 `|` 运算符左侧时自动调用，`a | b` 等价于 `a.__or__(b)`
- **链式调用原理**：`a | b | c` 等价于 `(a | b) | c`，即先计算 `a.__or__(b)` 得到中间结果，再调用 `中间结果.__or__(c)`
- **RunnableSequence**：LangChain 中 `|` 运算的结果是 `RunnableSequence` 对象，它也实现了 `__or__` 方法，因此可以继续链式拼接

通过自定义 `Test` 类和 `MySequence` 类，我们可以模拟这一机制。

## 代码示例

```python
class Test(object):
    def __init__(self, name):
        self.name = name

    def __or__(self, other):
        return MySequence(self, other)

    def __str__(self):
        return self.name


class MySequence(object):
    def __init__(self, *args):
        self.sequence = []
        for arg in args:
            self.sequence.append(arg)

    def __or__(self, other):
        self.sequence.append(other)
        return self

    def run(self):
        for i in self.sequence:
            print(i)


if __name__ == '__main__':
    a = Test('a')
    b = Test('b')
    c = Test('c')
    e = Test('e')
    f = Test('f')
    g = Test('g')

    d = a | b | c | e | f | g
    d.run()
    print(type(d))
```

## 代码解析

1. **Test 类**：模拟 LangChain 中的 Runnable 组件（如 PromptTemplate、Model 等）。
   - `__init__`：初始化名称属性
   - `__or__`：重写 `|` 运算符，当 `Test` 对象出现在 `|` 左侧时，创建 `MySequence` 对象并返回
   - `__str__`：返回名称，方便打印

2. **MySequence 类**：模拟 LangChain 中的 `RunnableSequence`，管理链式组合的组件序列。
   - `__init__`：接收任意数量的组件，存入 `self.sequence` 列表
   - `__or__`：重写 `|` 运算符，将新组件追加到序列中，返回 `self`（实现链式拼接）
   - `run`：按顺序执行序列中的所有组件

3. **链式调用过程**：`d = a | b | c | e | f | g` 的执行过程：
   - `a | b` → 调用 `a.__or__(b)` → 返回 `MySequence(a, b)`
   - `MySequence(a, b) | c` → 调用 `MySequence.__or__(c)` → 追加 c，返回 `self`
   - 依此类推，最终 `d` 是包含 `[a, b, c, e, f, g]` 的 `MySequence` 对象

4. **运行结果**：`d.run()` 依次打印 `a b c e f g`，`type(d)` 输出 `<class '__main__.MySequence'>`。

## 关键要点

- Python 的 `__or__` 魔术方法重写了 `|` 运算符，`a | b` 等价于 `a.__or__(b)`
- 链式调用 `a | b | c` 依赖运算符的左结合性，等价于 `(a | b) | c`
- `MySequence` 的 `__or__` 方法返回 `self`，使得链可以无限拼接
- LangChain 的 `RunnableSequence` 就是这种模式的工程实现，还支持 `invoke()`、`stream()` 等方法
- 理解运算符重写有助于深入理解 LCEL 的设计思想和调试链式调用问题

## 小结

LCEL 管道符的底层原理并不复杂，它利用了 Python 的运算符重写机制。`__or__` 方法让对象可以自定义 `|` 运算的行为，`RunnableSequence` 的 `__or__` 方法返回 `self` 实现链式拼接。理解这一原理，不仅能帮助我们更好地使用 LCEL，也为自定义 Runnable 组件、调试链式调用问题提供了理论基础。

---
title: FewShot提示词模板
date: 2025-06-15 11:15:53
permalink: /langchain/FewShot提示词模板
categories:
  - AI
tags:
  - 提示词
author: zhuib
---

# FewShot提示词模板——少样本引导模型学习

FewShot（少样本）提示是一种通过提供少量示例来引导大模型学习特定任务模式的技巧。LangChain 的 `FewShotPromptTemplate` 将这种技巧模板化，让示例管理和提示词构建更加规范和灵活。

## 核心概念

**FewShot Prompting** 的核心思想是：与其告诉模型"怎么做"，不如直接展示几个示例让模型"看怎么做"。通过在提示词中包含少量输入-输出对（示例），模型可以快速理解任务模式并泛化到新的输入。

`FewShotPromptTemplate` 的关键组成部分：

- **`examples`**：示例数据列表，每个示例是一个字典，包含输入和输出字段
- **`example_prompt`**：单个示例的格式模板，定义如何将示例字典格式化为文本
- **`prefix`**：示例之前的提示文本，通常描述任务要求
- **`suffix`**：示例之后的提示文本，包含实际问题的占位符
- **`input_variables`**：后缀中需要动态填充的变量名列表

## 代码示例

```python
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
from langchain_community.llms.tongyi import Tongyi

example_template = PromptTemplate.from_template("单词：{word}, 反义词：{antonym}")

examples_data = [
    {"word": "大", "antonym": "小"},
    {"word": "上", "antonym": "下"},
]

few_shot_template = FewShotPromptTemplate(
    example_prompt=example_template,
    examples=examples_data,
    prefix="告知我单词的反义词，我提供如下的示例：",
    suffix="基于前面的示例告知我，{input_word}的反义词是？",
    input_variables=['input_word']
)

prompt_text = few_shot_template.invoke(input={"input_word": "左"}).to_string()
print(prompt_text)

model = Tongyi(model="qwen-max")
print(model.invoke(input=prompt_text))
```

## 代码解析

1. **定义示例模板**：`example_template = PromptTemplate.from_template("单词：{word}, 反义词：{antonym}")` 定义了每个示例的展示格式，`{word}` 和 `{antonym}` 是示例字典中的键。

2. **准备示例数据**：`examples_data` 包含两个示例，每个示例是一个字典，键名与示例模板中的占位符对应。

3. **构建 FewShot 模板**：`FewShotPromptTemplate` 将各部分组合：
   - `example_prompt`：单个示例的格式
   - `examples`：示例数据列表
   - `prefix`：放在所有示例之前的说明文字
   - `suffix`：放在所有示例之后的问题模板，包含 `{input_word}` 占位符
   - `input_variables`：声明 suffix 中的动态变量

4. **生成提示词**：`few_shot_template.invoke(input={"input_word": "左"}).to_string()` 填充模板并转为字符串，最终生成的提示词为：
   ```
   告知我单词的反义词，我提供如下的示例：
   单词：大, 反义词：小
   单词：上, 反义词：下
   基于前面的示例告知我，左的反义词是？
   ```

5. **调用模型**：将生成的提示词传给模型，模型根据示例模式推断出"左"的反义词是"右"。

## 关键要点

- `FewShotPromptTemplate` 将 FewShot 提示技巧模板化，支持灵活管理示例
- `example_prompt` 定义单个示例的格式，`examples` 提供示例数据
- `prefix` 在示例前提供任务说明，`suffix` 在示例后提出实际问题
- `input_variables` 声明 suffix 中的动态变量，确保模板正确填充
- FewShot 适用于模型对任务理解不足的场景，通过示例引导比纯指令更有效

## 小结

FewShot 提示模板是提升大模型任务表现的重要工具。通过提供少量示例，模型可以快速理解任务模式，减少对详细指令的依赖。`FewShotPromptTemplate` 将示例管理结构化，使得添加、修改示例变得简单，也为后续的示例选择器（ExampleSelector）等高级功能打下了基础。

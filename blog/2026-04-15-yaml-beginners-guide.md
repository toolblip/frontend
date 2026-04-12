---
title: "YAML 入门指南：JSON 开发者视角"
description: "YAML 和 JSON 哪个更好？这篇从 JSON 开发者视角介绍 YAML 的基本语法、数据类型、缩进规则，以及何时该用 YAML 而不是 JSON。"
slug: yaml-beginners-guide
date: 2026-04-15
category: 开发者工具
tags: [YAML, JSON, 配置文件, DevOps, Kubernetes]
author: Toolblip Team
readingTime: 5 min
---

# YAML 入门指南：JSON 开发者视角

如果你用过 JSON，学习 YAML 会非常自然 — 但有几个关键区别需要注意。

## YAML vs JSON：核心区别

| 特性 | JSON | YAML |
|------|------|------|
| 注释 | ❌ 不支持 | ✅ 支持 |
| 尾部逗号 | ❌ 不允许 | ✅ 允许 |
| 引号 | 字符串必须引 | 通常不需要 |
| 缩进 | 任意空白 | **必须空格**（不能用 Tab） |
| 类型转换 | 字符串 vs 数字 | 自动识别类型 |

## 基本语法

### 对象
```yaml
# JSON: { "name": "Toolblip", "version": "1.0" }
name: Toolblip
version: "1.0"
```

### 数组/列表
```yaml
# JSON: { "tools": ["JSON Formatter", "Base64", "Cron"] }
tools:
  - JSON Formatter
  - Base64
  - Cron
```

### 嵌套
```yaml
server:
  host: api.toolblip.com
  port: 443
  ssl: true
```

### 多行字符串
```yaml
description: |
  这是一个
  多行字符串
  保留换行

description2: >
  这是另一个
  多行字符串
  折叠为单行
```

## 自动类型识别

YAML 会自动推断类型：

```yaml
string: hello        # → "hello"
number: 42           # → 42
float: 3.14          # → 3.14
boolean: true        # → true
null_value: ~        # → null
date: 2026-04-15     # → Date 对象
```

⚠️ **小心隐式转换：**
```yaml
# ⚠️ YAML 会把 "yes" 解析为 true！
answer: yes          # → true (布尔值)

# ✅ 字符串时用引号
answer: "yes"        # → "yes"
```

## 常见问题

### 1. Tab vs 空格

YAML **只允许空格**，不允许 Tab。配置编辑器时务必设置「用空格替代 Tab」。

### 2. 冒号后的空格

```yaml
# ❌ 错误
name:Toolblip

# ✅ 正确
name: Toolblip
```

### 3. 多文档

一个文件可以包含多个 YAML 文档，用 `---` 分隔：

```yaml
---
app: frontend
env: production
---
app: backend
env: staging
```

## YAML 适用场景

✅ **配置文件**（优于 JSON）：
- Docker Compose
- Kubernetes manifests
- GitHub Actions
- Ansible playbooks
- Rails `config/database.yml`

❌ **API 请求体**（用 JSON）：
- REST API 请求/响应
- 配置文件远程传输

## JSON ↔ YAML 互相转换

👉 **[YAML ↔ JSON 转换器 →](/tools/yaml-converter)**

粘贴 JSON 转 YAML，或粘贴 YAML 转 JSON。支持验证语法。

## Python / JavaScript 用法

```python
# Python
import yaml

with open('config.yaml') as f:
    config = yaml.safe_load(f)

# 安全加载（防止代码注入）
yaml.safe_load(user_input)
```

```javascript
// JavaScript
import yaml from 'js-yaml';

const config = yaml.load(fs.readFileSync('config.yaml', 'utf8'));
```

---

YAML 是现代开发的重要组成部分。记住：缩进用空格、注释可用、小心隐式类型转换 —— 就能安全使用它。

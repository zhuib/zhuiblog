---
title: 框架
date: 2020-12-11 11:15:53
permalink: /tags/
categories: 
  - 前端
tags: 
  - null
author: zhuib
---

## Spring
- IOC 控制反转
- AOP 面向切面编程

## Springboot
- 开箱即用，没有代码生成，也无需XML配置。同时也可以修改默认值来满足特定的需求
- 提供了一些大型项目中常见的非功能性特性，如嵌入式服务器、安全、指标，健康检测、外部配置等


## Mybatis
- SqlSession 作为MyBatis工作的主要顶层API，表示和数据库交互的会话，完成必要数据库增删改查功能
- Executor MyBatis执行器，是MyBatis 调度的核心，负责SQL语句的生成和查询缓存的维护
- StatementHandler 封装了JDBC Statement操作，负责对JDBC statement 的操作，如设置参数、将Statement结果集转换成List集合。
- ParameterHandler 负责对用户传递的参数转换成JDBC Statement 所需要的参数，
- ResultSetHandler 负责将JDBC返回的ResultSet结果集对象转换成List类型的集合；
- TypeHandler 负责java数据类型和jdbc数据类型之间的映射和转换
- MappedStatement MappedStatement维护了一条<select|update|delete|insert>节点的封装，
- SqlSource 负责根据用户传递的parameterObject，动态地生成SQL语句，将信息封装到BoundSql对象中，并返回
- BoundSql 表示动态生成的SQL语句以及相应的参数信息
- Configuration MyBatis所有的配置信息都维持在Configuration对象之中。











## Netty


## Spring Cloud 


## Spring Cloud Alibaba
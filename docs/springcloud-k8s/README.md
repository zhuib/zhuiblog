---
title: Spring Cloud 在 Kubernetes 中的部署指南
date: 2026-05-25 10:00:00
permalink: /springcloud/k8s-deployment/
categories:
  - 微服务
  - Spring Cloud
tags:
  - Spring Cloud
  - Kubernetes
  - K8s
  - 云原生
  - 容器化
author: zhuib
---

# Spring Cloud 在 Kubernetes 中的部署指南

在 Kubernetes (K8s) 中部署 Spring Cloud 应用，最核心的思考点是：哪些功能由 Spring Cloud 框架实现，哪些功能交给 K8s 平台实现？

由于 K8s 本身就提供了服务发现、负载均衡、配置管理等能力，很多传统的 Spring Cloud 组件（如 Eureka, Config Server, Zuul）在 K8s 中变得冗余。

目前主流的部署方案分为两种："K8s 原生模式"（推荐）和 "传统迁移模式"。

## 方案一：K8s 原生模式 (Cloud Native) —— 推荐

这种方案主张"去中心化"，删除重复的组件，利用 K8s 的能力来简化架构。

### 1. 组件映射关系

| Spring Cloud 组件 | K8s 对应方案 | 说明 |
|------------------|--------------|------|
| Eureka / Nacos | K8s Service / DNS | K8s 内部通过 Service 名称即可实现服务发现（DNS 解析） |
| Config Server | ConfigMap / Secret | 将配置文件放入 ConfigMap，通过挂载卷或环境变量注入 |
| Zuul / Gateway | Ingress / Gateway API | 外部流量通过 Ingress 进入，内部路由可保留 Spring Cloud Gateway 做精细化控制 |
| Ribbon / LoadBalancer | K8s Service (ClusterIP) | K8s Service 默认提供 L4 层的负载均衡 |
| Hystrix / Resilience4j | 保留 / Service Mesh | 熔断限流仍建议在应用层保留，或升级到 Istio 等 Service Mesh |

### 2. 核心实现步骤

**服务发现**：去掉 @EnableDiscoveryClient。调用对方时，直接使用 `http://service-name:port`

**配置中心**：
- 创建 ConfigMap 存储 application.yml
- 在 Deployment 中通过 volumeMounts 将其挂载到 Pod 的目录下
- 或者使用 spring-cloud-kubernetes-config 依赖，让 Spring 直接读取 K8s ConfigMap

**负载均衡**：
- 如果使用 RestTemplate 或 Feign，可以使用 spring-cloud-starter-kubernetes-client-loadbalancer，它会自动通过 K8s API 获取 Pod 列表

## 方案二：传统迁移模式 (Lift and Shift)

如果你有大量的历史代码，或者需要跨集群的服务治理，可以选择将 Spring Cloud 组件作为普通应用部署在 K8s 中。

### 1. 部署架构

- **Eureka Server** → Pod (部署 2-3 个副本，通过 Service 暴露)
- **Config Server** → Pod (连接 Git/SVN，部署为 Pod)
- **Spring Cloud Gateway** → Pod (作为唯一入口)
- **Business Microservices** → Pods

### 2. 特别注意点

- **Eureka 注册地址**：在 K8s 中，Pod 的 IP 是动态的。你需要确保 Eureka Server 的 Service 域名固定，微服务通过 `eureka.client.serviceUrl.defaultZone=http://eureka-service:8761/eureka/` 注册
- **网络打通**：确保所有组件在同一个 Namespace 下，或者通过全限定域名 (FQDN) 通信

## 具体的部署流程 (通用步骤)

无论选择哪种方案，部署到 K8s 的物理流程是一致的：

### 第一步：容器化 (Docker)

编写 Dockerfile，将 Spring Boot 应用打包成镜像。

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/my-app.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 第二步：编写 K8s 资源清单 (YAML)

你需要编写以下核心资源：

- **Deployment**: 定义副本数、镜像地址、资源限制 (CPU/MEM)、健康检查 (Liveness/Readiness Probe)
- **Service**: 定义服务名称，使其他服务能通过 DNS 访问
- **ConfigMap/Secret**: 存储环境配置

示例 Deployment 片段：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: user-service
        image: my-registry/user-service:v1
        ports:
        - containerPort: 8080
        livenessProbe: # 健康检查
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
```

### 第三步：流量接入 (Ingress)

使用 Nginx Ingress 控制器将外部请求转发到 Spring Cloud Gateway 或具体服务。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway-service
            port:
              number: 80
```

## 总结与建议：如何选择？

| 维度 | K8s 原生模式 | 传统迁移模式 |
|------|-------------|--------------|
| 复杂度 | 低（组件少，依赖 K8s） | 高（需要维护 Eureka/Config 实例） |
| 性能 | 较高（减少了一层转发/心跳） | 略低 |
| 迁移成本 | 较高（需要修改代码/配置） | 极低（直接打包部署） |
| 掌控力 | 依赖 K8s 运维能力 | 依赖 Spring Cloud 框架能力 |

## 最终建议

**新项目 → 直接采用 K8s 原生模式**

使用 K8s Service → Spring Cloud Gateway → ConfigMap

**旧项目迁移 → 先用传统模式快速上云，运行稳定后再逐步剔除 Eureka 和 Config Server，转向 K8s 原生化**

## 核心优势总结

1. **简化架构**：减少不必要的中间层，提升系统整体性能
2. **统一管理**：利用 K8s 的声明式配置，实现基础设施即代码
3. **弹性伸缩**：K8s 自动根据负载调整 Pod 数量，无需手动干预
4. **故障自愈**：自动重启失败的容器，保证服务可用性
5. **资源优化**：更精细的资源分配，提高集群利用率

通过合理选择部署方案，可以充分发挥 K8s 和 Spring Cloud 各自的优势，构建更加健壮、高效的微服务架构。
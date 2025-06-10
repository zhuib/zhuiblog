---
title: k8s 知识点
date: 2025-06-10 23:51:53
permalink: /k8s/
categories:
  - k8s
tags:
  - k8s
author: zhuib
---

**一、核心概念**

1.  **Pod**

    *   **Pod 和容器有什么区别？**
        *   容器是运行应用程序的隔离环境，而 Pod 是 K8s 中最小的可部署单元，可以包含一个或多个容器。Pod 为其包含的容器提供共享的网络命名空间和存储卷，使得这些容器可以像在同一台机器上运行一样进行通信和数据共享。
        *   简单来说，Pod 是容器的更高层次抽象，它定义了容器的部署和管理策略。
    *   **一个 Pod 中可以包含多个容器吗？有什么好处和坏处？**
        *   可以。
        *   **好处：**
            *   **紧密耦合的应用：**  可以将需要紧密协作的应用放在同一个 Pod 中，例如一个 Web 服务器和一个日志收集器。
            *   **共享资源：**  容器可以共享存储卷和网络命名空间，方便数据共享和通信。
        *   **坏处：**
            *   **复杂性增加：**  管理多个容器的 Pod 更加复杂。
            *   **资源竞争：**  Pod 中的容器可能会竞争资源。
            *   **耦合性过高：**  如果容器之间耦合性过高，可能会影响应用的灵活性和可扩展性。
    *   **如何访问 Pod 中的容器？**
        *   **同一 Pod 中的容器：**  可以通过 `localhost` 和共享的端口直接访问。
        *   **不同 Pod 中的容器：**  可以通过 Service 暴露 Pod，然后通过 Service 的 IP 地址和端口访问。
        *   **集群外部访问：**  可以通过 NodePort 或 LoadBalancer 类型的 Service 暴露 Pod，或者使用 Ingress。
    *   **Pod 的生命周期有哪些阶段？**
        *   `Pending`： Pod 正在创建中。
        *   `Running`： Pod 中的所有容器都已启动，并且正在运行。
        *   `Succeeded`： Pod 中的所有容器都已成功完成任务并退出。
        *   `Failed`： Pod 中的某个容器启动失败或运行出错。
        *   `Unknown`： 无法确定 Pod 的状态。

2.  **Node**

    *   **Node 的作用是什么？**
        *   Node 是 K8s 集群中的工作节点，负责运行 Pod。
        *   它提供运行容器所需的计算资源、存储和网络环境。
    *   **Node 上有哪些关键组件？**
        *   `kubelet`： Node 上的 Agent，负责与 Master 通信，接收 Master 的指令，并管理 Pod 的生命周期。
        *   `kube-proxy`： 负责为 Service 提供网络代理，实现负载均衡。
        *   容器运行时 (如 Docker 或 containerd)： 负责运行容器。
    *   **如何查看 Node 的状态？**
        *   使用 `kubectl get nodes` 命令查看 Node 的基本信息。
        *   使用 `kubectl describe node <node-name>` 命令查看 Node 的详细信息，例如资源利用率、事件等。

3.  **Controller (控制器)**

    *   **Controller 的作用是什么？**
        *   Controller 负责管理 Pod 的生命周期，确保集群达到期望的状态。
        *   它通过监控集群状态，并根据预定义的规则创建、更新或删除 Pod。
    *   **Deployment、ReplicaSet 和 StatefulSet 有什么区别？ 适用于什么场景？**
        *   `ReplicaSet`： 确保指定数量的 Pod 副本始终运行。  它主要用于保证应用的可用性。
        *   `Deployment`：  是对 ReplicaSet 的更高层次抽象，提供了滚动更新和回滚功能。 它更关注应用的部署和版本管理。
        *   `StatefulSet`： 管理有状态应用，提供稳定的网络标识和持久化存储。适用于需要持久化存储和稳定网络标识的应用，例如数据库。
    *   **如何使用 Deployment 进行滚动更新？**
        *   修改 Deployment 的 YAML 文件，例如更新镜像版本。
        *   使用 `kubectl apply -f <deployment-file.yaml>` 命令应用修改。
        *   Deployment 会逐步更新 Pod 副本，确保应用在更新过程中始终可用。
    *   **DaemonSet 适用于什么场景？**
        *   在每个 Node 上运行一个 Pod 副本，适用于需要在每个 Node 上执行的任务，例如日志收集、监控等。
    *   **Job 和 CronJob 有什么区别？**
        *   `Job`： 运行一次性任务，任务完成后 Pod 自动删除。
        *   `CronJob`： 运行定时任务，可以按照指定的时间表重复执行任务。

4.  **Service**

    *   **Service 的作用是什么？**
        *   为 Pod 提供稳定的网络访问入口，实现负载均衡。
        *   使得应用可以访问 Pod，而无需关心 Pod 的 IP 地址和端口。
    *   **Service 有哪些类型？ 它们的区别是什么？**
        *   `ClusterIP`： 只能在集群内部访问。
        *   `NodePort`： 通过 Node 的 IP 地址和端口访问，集群外部可以访问。
        *   `LoadBalancer`：  使用云厂商提供的负载均衡器对外暴露服务，集群外部可以访问。
        *   `ExternalName`：  将服务映射到外部域名。
    *   **如何实现 Service 的负载均衡？**
        *   Service 会自动将流量分发到后端的 Pod 副本。
        *   kube-proxy 负责实现负载均衡算法，例如轮询、随机等。
    *   **如何从集群外部访问 Service？**
        *   使用 NodePort 类型的 Service。
        *   使用 LoadBalancer 类型的 Service。
        *   使用 Ingress。
    *   **Ingress 和 Service 有什么区别？**
        *   Service 是 K8s 内部的服务抽象，而 Ingress 是集群外部访问服务的入口。
        *   Ingress 可以实现基于域名的路由和 SSL 卸载，而 Service 只能提供简单的负载均衡。
        *   Ingress 通常需要 Ingress Controller 来实现，而 Service 不需要。

5.  **Namespace**

    *   **Namespace 的作用是什么？**
        *   用于隔离集群资源，可以将集群划分为多个虚拟的命名空间。
        *   可以实现资源隔离和权限管理。
    *   **如何创建和管理 Namespace？**
        *   使用 `kubectl create namespace <namespace-name>` 命令创建 Namespace。
        *   使用 `kubectl get namespaces` 命令查看 Namespace 列表。
        *   使用 `kubectl delete namespace <namespace-name>` 命令删除 Namespace。
    *   **不同 Namespace 中的 Pod 可以互相访问吗？ 如何实现？**
        *   默认情况下，不同 Namespace 中的 Pod 不能互相访问。
        *   可以通过以下方式实现：
            *   使用 Service 暴露 Pod，并设置 Service 的 `externalName` 属性指向其他 Namespace 中的 Service。
            *   使用 K8s 的网络策略，允许不同 Namespace 中的 Pod 互相访问。

6.  **Volume**

    *   **Volume 的作用是什么？**
        *   为 Pod 提供持久化存储，即使 Pod 重启，数据也不会丢失。
        *   实现容器间的数据共享。
    *   **Volume 有哪些类型？ 它们的区别是什么？**
        *   `EmptyDir`： 临时存储，Pod 删除后数据丢失。
        *   `HostPath`： 将 Node 上的文件或目录挂载到 Pod 中，数据存储在 Node 上。
        *   `PersistentVolumeClaim (PVC)`：  申请持久化存储卷，由管理员创建 `PersistentVolume (PV)` 提供存储资源，数据存储在 PV 关联的存储介质上（例如云盘）。
    *   **PersistentVolume 和 PersistentVolumeClaim 有什么关系？**
        *   `PersistentVolume (PV)`： 是集群中的存储资源，由管理员创建和管理。
        *   `PersistentVolumeClaim (PVC)`： 是用户对存储资源的申请，Pod 可以通过 PVC 申请使用 PV。
        *   PV 和 PVC 之间通过 `claimRef` 建立绑定关系。
    *   **如何实现 Pod 的数据持久化？**
        *   使用 PersistentVolumeClaim (PVC) 申请持久化存储卷，然后将 PVC 挂载到 Pod 中。

7.  **Ingress**

    *   **Ingress 的作用是什么？**
        *   管理集群外部访问服务的入口，可以实现基于域名的路由和 SSL 卸载。
        *   将不同的域名或路径映射到不同的 Service。
    *   **Ingress 和 Service 有什么区别？**
        *   Service 是 K8s 内部的服务抽象，而 Ingress 是集群外部访问服务的入口。
        *   Ingress 可以实现基于域名的路由和 SSL 卸载，而 Service 只能提供简单的负载均衡。
        *   Ingress 通常需要 Ingress Controller 来实现，而 Service 不需要。
    *   **如何配置 Ingress 实现基于域名的路由？**
        *   在 Ingress 的 YAML 文件中，定义 `rules` 字段，指定域名和对应的 Service。
    *   **常用的 Ingress Controller 有哪些？**
        *   Nginx Ingress Controller
        *   Traefik
        *   HAProxy Ingress Controller

**二、核心组件**

1.  **kube-apiserver**

    *   **作用：** K8s 集群的入口，提供 REST API 接口，负责处理所有 API 请求。
    *   **特点：**
        *   是集群中唯一与 `etcd` 交互的组件。
        *   负责认证、授权和审计。

2.  **kube-scheduler**

    *   **作用：**  负责将 Pod 调度到合适的 Node 上运行。
    *   **调度算法：**  根据资源需求、Node 的可用资源、亲和性和反亲和性等因素进行调度。

3.  **kube-controller-manager**

    *   **作用：**  运行 K8s 的核心控制器，例如 Deployment Controller、ReplicaSet Controller 等。

4.  **etcd**

    *   **作用：**  分布式键值存储，用于存储 K8s 集群的配置信息和状态数据。
    *   **特点：**
        *   高可用性： 通过 Raft 算法实现数据一致性。
        *   强一致性：  保证数据的可靠性。

**三、常用操作**

1.  **kubectl 命令:**  K8s 的命令行工具，用于与 K8s 集群交互。
    *   `kubectl get`： 获取资源信息。
    *   `kubectl create`： 创建资源。
    *   `kubectl apply`： 更新资源。
    *   `kubectl delete`： 删除资源。
    *   `kubectl exec`： 在容器中执行命令。
    *   `kubectl logs`： 查看容器日志。
    *   `kubectl describe`： 查看资源的详细信息。

2.  **YAML 文件:**  用于定义 K8s 资源，例如 Pod、Deployment、Service 等。

**四、高级主题**

1.  **Helm:** K8s 的包管理工具，用于简化 K8s 应用的部署和管理。
2.  **Operator:**  扩展 K8s API 的自定义控制器，用于管理复杂应用。
3.  **Service Mesh:**  提供服务间的流量管理、安全性和可观察性。
4.  **K8s 安全:**  涉及认证、授权、网络策略、镜像安全等方面。
5.  **K8s 监控:**  使用 Prometheus、Grafana 等工具监控 K8s 集群的性能和健康状况。
6.  **K8s 调度策略:**  例如节点亲和性、Pod 亲和性和反亲和性、污点和容忍度等。

**五、面试准备建议**

*   **理解基本概念：**  务必理解 K8s 的核心概念，例如 Pod、Node、Controller、Service 等。
*   **熟悉常用操作：**  掌握 `kubectl` 命令和 YAML 文件的编写。
*   **实践经验：**  尽量在本地或云平台上搭建 K8s 集群，并部署一些简单的应用。
*   **关注最新动态：**  K8s 发展迅速，要关注最新的特性和最佳实践。
*   **结合项目经验：**  在面试中，结合你实际的项目经验，分享你在 K8s 上的实践和遇到的问题。

**面试题示例**

*   **K8s 的优势是什么？**
    *   自动化部署、扩展和管理容器化应用。
    *   提高资源利用率。
    *   简化应用部署流程。
    *   提供高可用性和容错性。
    *   支持多种容器运行时。

*   **如何排查 K8s 集群中的问题？**
    1.  **检查 Pod 状态：** 使用 `kubectl get pods` 查看 Pod 是否处于 `Running` 状态。如果 Pod 处于 `Pending` 或 `Error` 状态，则需要进一步调查。
    2.  **查看 Pod 日志：** 使用 `kubectl logs <pod-name>` 查看 Pod 的日志，查找错误信息。
    3.  **检查 Node 状态：** 使用 `kubectl get nodes` 查看 Node 是否处于 `Ready` 状态。如果 Node 处于 `NotReady` 状态，则需要检查 Node 上的 kubelet 和容器运行时。
    4.  **检查 Service 和 Ingress 配置：** 使用 `kubectl get svc` 和 `kubectl get ing` 查看 Service 和 Ingress 的配置是否正确。
    5.  **查看 K8s 组件日志：** 查看 kube-apiserver、kube-scheduler、kube-controller-manager 等组件的日志，查找错误信息。
    6.  **使用监控工具：** 使用 Prometheus、Grafana 等监控工具查看集群的性能指标，例如 CPU 使用率、内存使用率、网络流量等。

*   **你如何保证 K8s 集群的安全性？**
    1.  **启用 RBAC 授权机制：** 使用 RBAC 限制用户和 ServiceAccount 的权限，确保只有授权的用户才能访问 K8s 资源。
    2.  **使用网络策略隔离不同 Namespace 中的 Pod：** 使用网络策略限制不同 Namespace 中的 Pod 之间的网络流量，防止恶意攻击。
    3.  **定期扫描镜像漏洞：** 使用镜像扫描工具定期扫描镜像漏洞，及时修复漏洞，防止安全风险。
    4.  **限制容器的资源使用：** 使用 ResourceQuota 和 LimitRange 限制容器的资源使用，防止资源耗尽攻击。
    5.  **使用 TLS 加密通信：** 使用 TLS 加密 K8s 组件之间的通信，防止中间人攻击。
    6.   **Admission Controller:** 使用诸如 `PodSecurityPolicy` (deprecated, 替换方案是 Pod Security Admission) 或 OPA (Open Policy Agent) 等 Admission Controller 来强制执行安全策略，例如限制容器的 capabilities, 禁止 privileged 容器等。
    7.  **定期审计：** 定期审查 K8s 集群的配置和日志，及时发现安全问题。

*   **你使用过哪些 K8s 的高级特性？**
    *   **Helm：** 我使用 Helm 来管理 K8s 应用的部署，Helm Chart 简化了应用的安装、升级和回滚过程。
    *   **Operator：** 我开发过一个 Operator 来管理数据库集群，Operator 可以自动处理数据库的备份、恢复和升级等操作。
    *   **Service Mesh：** 我使用 Istio 来实现服务间的流量管理、安全性和可观察性，Istio 提供了流量路由、负载均衡、故障注入等功能。


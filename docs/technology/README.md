---
title: 思维导图
date: 2020-12-11 11:15:53
permalink: /technology/
categories:
  - 前端
  - 脑图
tags:
  - 科技
author: zhuib
---

Java 知识体系思维导图 (详细版)

中心主题：Java 核心

一级分支：

1.  **Java 基础**
    *   二级分支：
        *   **语法**
            *   变量：声明、赋值、作用域、生命周期
            *   数据类型：基本类型 (int, long, float, double, boolean, byte, char, short), 引用类型 (类, 接口, 数组)
            *   运算符：算术运算符, 关系运算符, 逻辑运算符, 位运算符, 赋值运算符, 三元运算符
            *   流程控制语句：
                *   条件语句：if, if-else, if-else if-else, switch
                *   循环语句：for, while, do-while
                *   跳转语句：break, continue, return
        *   **面向对象**
            *   封装：访问修饰符 (public, protected, private, 默认)
            *   继承：extends 关键字, super 关键字, 方法重写 (Override)
            *   多态：向上转型, 向下转型, instanceof 关键字
            *   抽象类：abstract 关键字, 抽象方法
            *   接口：interface 关键字, implements 关键字
        *   **集合框架**
            *   List
                *   ArrayList：动态数组, 扩容机制
                *   LinkedList：双向链表
            *   Set
                *   HashSet：基于 HashMap 实现, 无序, 唯一
                *   TreeSet：基于 TreeMap 实现, 有序, 唯一
            *   Map
                *   HashMap：基于哈希表实现, key-value 键值对
                *   TreeMap：基于红黑树实现, 有序 key-value 键值对
                *   LinkedHashMap：基于哈希表和链表实现，保持插入顺序
            *   Queue
                *   PriorityQueue：优先级队列，基于堆实现
                *   LinkedList：也可以作为队列使用
        *   **异常处理**
            *   try-catch-finally 块
            *   throws 关键字
            *   自定义异常：继承 Exception 或 RuntimeException
        *   **IO 流**
            *   字节流：InputStream, OutputStream
                *   FileInputStream, FileOutputStream
                *   BufferedInputStream, BufferedOutputStream
            *   字符流：Reader, Writer
                *   FileReader, FileWriter
                *   BufferedReader, BufferedWriter
            *   对象流：ObjectInputStream, ObjectOutputStream (序列化, 反序列化)
            *   NIO：通道 (Channel), 缓冲区 (Buffer), 选择器 (Selector)
        *   **多线程**
            *   Thread 类：创建线程, 启动线程, 线程生命周期
            *   Runnable 接口：实现 Runnable 接口创建线程
            *   线程池：ExecutorService, Executors
            *   线程同步：
                *   synchronized 关键字：同步方法, 同步代码块
                *   volatile 关键字：保证可见性, 禁止指令重排序
                *   Lock 接口：ReentrantLock
                *   CAS (Compare and Swap)：原子操作
            *   并发工具类：
                *   CountDownLatch：倒计时器
                *   CyclicBarrier：循环栅栏
                *   Semaphore：信号量
        *   **反射**
            *   Class 类：获取 Class 对象, 获取类的信息
            *   Constructor 类：获取构造方法, 创建对象
            *   Method 类：获取方法, 调用方法
            *   Field 类：获取字段, 设置字段的值
        *   **注解**
            *   内置注解：@Override, @Deprecated, @SuppressWarnings
            *   自定义注解：@interface 关键字
            *   元注解：@Target, @Retention, @Documented, @Inherited
        *   **泛型**
            *   泛型类：类定义时使用泛型
            *   泛型方法：方法定义时使用泛型
            *   类型擦除：泛型只在编译期有效
        *   **枚举**
            *   枚举类的定义：enum 关键字
            *   枚举类的使用：枚举常量, 枚举方法
2.  **JVM**
    *   二级分支：
        *   **内存结构**
            *   堆：对象实例, 数组
            *   栈：局部变量, 方法调用栈
            *   方法区：类信息, 常量, 静态变量 (元空间)
            *   程序计数器：当前线程执行的字节码的行号指示器
            *   本地方法栈：执行 native 方法
        *   **垃圾回收 (GC)**
            *   垃圾回收算法：
                *   标记-清除 (Mark and Sweep)
                *   复制 (Copying)
                *   标记-整理 (Mark and Compact)
                *   分代收集 (Generational Collection)
            *   垃圾回收器：
                *   Serial GC
                *   Parallel GC
                *   CMS GC
                *   G1 GC
                *   ZGC
            *   GC 调优：调整堆大小, 选择合适的 GC 算法
        *   **类加载机制**
            *   加载：查找并加载类的二进制数据
            *   连接：
                *   验证：验证类的正确性
                *   准备：为静态变量分配内存并设置默认值
                *   解析：将符号引用替换为直接引用
            *   初始化：执行类的静态代码块和静态变量的赋值操作
            *   双亲委派模型：优先委托父类加载器加载
        *   **性能监控工具**
            *   JConsole
            *   JVisualVM
            *   JProfiler
            *   Arthas
        *   **JVM 调优**
            *   内存调优：调整堆大小, 调整新生代和老年代的比例
            *   GC 调优：选择合适的 GC 算法, 调整 GC 参数
3.  **常用框架**
    *   二级分支：
        *   **Spring**
            *   IoC (依赖注入)：控制反转, BeanFactory, ApplicationContext
            *   AOP (面向切面编程)：切面, 连接点, 通知, 切点
            *   Spring MVC：DispatcherServlet, Controller, ViewResolver
            *   Spring Boot：自动配置, 快速开发
            *   Spring Cloud：微服务架构, 服务注册与发现, 配置中心, 网关
        *   **MyBatis**
            *   ORM 框架：对象关系映射
            *   Mapper 接口：定义 SQL 映射接口
            *   动态 SQL：使用 XML 或注解编写动态 SQL 语句
        *   **Spring Data JPA**
            *   简化数据库访问
            *   Repository 接口
            *   自动生成 SQL
        *   **Hibernate**
            *   重量级 ORM 框架
4.  **数据库**
    *   二级分支：
        *   **关系型数据库**
            *   MySQL
                *   SQL 语句：CRUD, JOIN, GROUP BY, ORDER BY, LIMIT, 索引, 事务
                *   数据库连接池：Druid, HikariCP
            *   Oracle
            *   PostgreSQL
        *   **NoSQL 数据库**
            *   Redis
                *   数据类型：String, List, Set, Hash, ZSet
                *   缓存：缓存击穿, 缓存雪崩, 缓存穿透
                *   分布式锁：使用 SETNX 命令实现
            *   MongoDB
                *   文档数据库
                *   JSON 格式
5.  **Web 开发**
    *   二级分支：
        *   Servlet：
            *   Servlet 生命周期
            *   HttpServletRequest, HttpServletResponse
            *   ServletContext
        *   JSP：
            *   JSP 语法
            *   JSP 内置对象
        *   RESTful API
            *   RESTful 风格
            *   HTTP 方法 (GET, POST, PUT, DELETE)
            *   状态码
        *   Tomcat, Jetty
            *   Web 服务器
            *   Servlet 容器
6.  **分布式**
    *   二级分支：
        *   CAP 理论：一致性 (Consistency), 可用性 (Availability), 分区容错性 (Partition Tolerance)
        *   分布式事务：
            *   ACID
            *   BASE 理论
            *   Seata
        *   分布式锁：
            *   Redis：SETNX 命令
            *   Zookeeper：临时顺序节点
        *   RPC 框架：
            *   Dubbo
            *   gRPC
        *   消息队列：
            *   Kafka
            *   RabbitMQ
            *   RocketMQ
7.  **设计模式**
    *   二级分支:  （每个模式都包括 意图、结构、参与者、协作、效果、适用性、实现）
        *   创建型模式
            *   单例模式
            *   工厂模式
            *   抽象工厂模式
            *   建造者模式
            *   原型模式
        *   结构型模式
            *   适配器模式
            *   装饰器模式
            *   代理模式
            *   组合模式
            *   桥接模式
            *   外观模式
            *   享元模式
        *   行为型模式
            *   策略模式
            *   模板方法模式
            *   观察者模式
            *   迭代器模式
            *   责任链模式
            *   命令模式
            *   备忘录模式
            *   状态模式
            *   访问者模式
            *   中介者模式
            *   解释器模式
8.  **工具**
    *   二级分支：
        *   Maven, Gradle
            *   依赖管理
            *   项目构建
        *   Git
            *   版本控制
            *   分支管理
        *   Jenkins
            *   持续集成
            *   自动化部署
        *   Docker
            *   容器化
            *   镜像管理
9.  **数据结构与算法**
    *   二级分支：
        *   常用数据结构
            *   数组
            *   链表
            *   栈
            *   队列
            *   堆
            *   树
            *   图
        *   常用算法
            *   排序算法：冒泡排序, 选择排序, 插入排序, 快速排序, 归并排序, 堆排序
            *   查找算法：二分查找
            *   动态规划
            *   贪心算法
10. **网络编程**
    *   二级分支：
        *   TCP/IP 协议
            *   TCP 三次握手, 四次挥手
            *   HTTP 协议
        *   Socket 编程
            *   ServerSocket, Socket
        *   Netty 框架
            *   事件循环
            *   Channel, Buffer, Pipeline


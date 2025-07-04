---
title: JVM
date: 2020-12-11 11:15:53
permalink: /java/jvm
categories:
  - 后端
tags:
  - JVM
author: zhuib
---

## JVM 知识点详解

1.  **JVM 结构**

    *   **类加载器（ClassLoader）**: 负责将 `.class` 文件加载到 JVM 中。
    *   **运行时数据区（Runtime Data Areas）**: JVM 内存结构，包括：
        *   **方法区（Method Area）**: 存储类信息、常量、静态变量等，是线程共享的。
        *   **堆（Heap）**: 存储对象实例，是垃圾回收的主要区域，是线程共享的。
        *   **虚拟机栈（VM Stack）**: 每个线程拥有一个栈，用于存储栈帧，栈帧包含局部变量表、操作数栈、动态链接、方法出口等。
        *   **本地方法栈（Native Method Stack）**: 与虚拟机栈类似，但用于执行 Native 方法。
        *   **程序计数器（Program Counter Register）**: 记录当前线程执行的字节码指令地址。
    *   **执行引擎（Execution Engine）**: 执行字节码指令，包括：
        *   **解释器（Interpreter）**: 逐行解释执行字节码。
        *   **即时编译器（JIT Compiler）**: 将热点代码编译成机器码，提高执行效率。
        *   **垃圾回收器（Garbage Collector）**: 自动回收不再使用的对象，释放内存。
2.  **类加载机制**

    *   **加载（Loading）**: 将 `.class` 文件加载到内存中。
    *   **验证（Verification）**: 确保 `.class` 文件符合 JVM 规范，防止恶意代码。
    *   **准备（Preparation）**: 为类变量分配内存，并设置初始值（通常是 0 或 null）。
    *   **解析（Resolution）**: 将符号引用替换为直接引用。
    *   **初始化（Initialization）**: 执行类构造器 `<clinit>()` 方法，初始化静态变量和静态代码块。
    *   **类加载器类型**:
        *   启动类加载器（Bootstrap ClassLoader）
        *   扩展类加载器（Extension ClassLoader）
        *   应用程序类加载器（Application ClassLoader）
        *   自定义类加载器（Custom ClassLoader）
    *   **双亲委派模型**: 类加载器逐层向上委托加载类，如果父类加载器无法加载，则由子类加载器尝试加载。
3.  **内存模型（JMM）**

    *   **主内存（Main Memory）**: 所有线程共享的内存区域，存储变量的实例。
    *   **工作内存（Working Memory）**: 每个线程独有的内存区域，存储主内存中变量的副本。
    *   **内存间的交互操作**:
        *   `read`: 从主内存读取变量值到工作内存。
        *   `load`: 将 `read` 的值放入工作内存的变量副本中。
        *   `use`: 将工作内存变量副本的值传递给执行引擎。
        *   `assign`: 将执行引擎得到的值赋值给工作内存的变量副本。
        *   `store`: 将工作内存变量副本的值传递给主内存。
        *   `write`: 将 `store` 的值放入主内存中的变量。
        *   `lock`: 作用于主内存的变量，把一个变量标识为一条线程独占状态。
        *   `unlock`: 作用于主内存的变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
4.  **垃圾回收（GC）**

    *   **可达性分析算法**: 从 GC Roots 开始，遍历所有可达对象，不可达对象被标记为垃圾。
    *   **GC Roots**: 根对象，包括：
        *   虚拟机栈中引用的对象
        *   方法区中类静态属性引用的对象
        *   方法区中常量引用的对象
        *   本地方法栈中 JNI 引用的对象
    *   **垃圾回收算法**:
        *   **标记-清除（Mark-Sweep）**: 标记垃圾，然后清除垃圾，会产生内存碎片。
        *   **复制（Copying）**: 将内存分为两块，每次只使用一块，垃圾回收时将存活对象复制到另一块，然后清理当前块，避免内存碎片，但空间利用率低。
        *   **标记-整理（Mark-Compact）**: 标记垃圾，然后将存活对象移动到一端，清理边界外的内存，避免内存碎片，空间利用率高。
        *   **分代收集（Generational Collection）**: 根据对象存活时间将内存分为新生代和老年代，新生代采用复制算法，老年代采用标记-清除或标记-整理算法。
    *   **垃圾回收器**:
        *   Serial GC
        *   Parallel GC
        *   CMS GC
        *   G1 GC
        *   ZGC
        *   Shenandoah GC
    *   **Minor GC、Major GC、Full GC**:
        *   Minor GC：新生代 GC
        *   Major GC：老年代 GC (通常指 CMS GC)
        *   Full GC：清理整个堆空间，包括新生代和老年代。
5.  **JVM 调优**

    *   **监控工具**: `jstat`, `jinfo`, `jmap`, `jstack`, `jconsole`, `VisualVM`, `Arthas`
    *   **调优参数**:
        *   `-Xms`: 初始堆大小
        *   `-Xmx`: 最大堆大小
        *   `-Xmn`: 新生代大小
        *   `-XX:SurvivorRatio`: Eden 区和 Survivor 区的比例
        *   `-XX:MaxTenuringThreshold`: 对象晋升到老年代的年龄阈值
        *   `-XX:+UseG1GC`: 使用 G1 垃圾回收器
    *   **调优策略**:
        *   合理设置堆大小，避免频繁 GC
        *   选择合适的垃圾回收器
        *   优化代码，减少对象创建
        *   使用对象池，避免重复创建对象

##  JVM 常见面试点详细解答

### 1. JVM 的组成部分？

*   **类加载器 (ClassLoader)**: 负责将 `.class` 文件加载到 JVM 中。它按照特定的搜索路径找到对应的 class 文件，并将其加载到内存中。
*   **运行时数据区 (Runtime Data Areas)**: JVM 内存结构，存储程序在运行时所需的数据，如对象实例、类信息、方法参数、返回值等。这是 JVM 内存管理的核心区域。
*   **执行引擎 (Execution Engine)**: 负责执行字节码指令。它包括解释器和即时编译器 (JIT)，将字节码翻译成机器码并执行。
*   **本地方法接口 (Native Interface)**: 允许 Java 代码调用本地 (非 Java) 代码，例如 C 或 C++ 编写的库。
*   **本地方法库 (Native Libraries)**: 本地方法接口调用的本地代码库。

### 2. JVM 内存结构？

JVM 内存结构主要分为以下几个部分：

*   **方法区 (Method Area)**:
    *   存储已加载的类信息 (如类名、方法信息、字段信息)、常量、静态变量、JIT 编译后的代码等。
    *   所有线程共享。
    *   在 Java 8 之前，PermGen (永久代) 实现方法区，容易出现 OOM。Java 8 之后，使用 Metaspace (元空间) 代替，直接使用本地内存，减少 OOM 的风险。
*   **堆 (Heap)**:
    *   存储对象实例。
    *   所有线程共享。
    *   垃圾回收的主要区域。
    *   分为新生代 (Eden 区、两个 Survivor 区) 和老年代。
*   **虚拟机栈 (VM Stack)**:
    *   每个线程拥有一个栈。
    *   用于存储栈帧，每个方法对应一个栈帧。
    *   栈帧包含局部变量表、操作数栈、动态链接、方法出口等。
    *   局部变量表存储方法参数和局部变量。
*   **本地方法栈 (Native Method Stack)**:
    *   与虚拟机栈类似，但用于执行 Native 方法。
    *   每个线程拥有一个栈。
*   **程序计数器 (Program Counter Register, PC Register)**:
    *   记录当前线程执行的字节码指令地址。
    *   每个线程拥有一个 PC 寄存器。
    *   它是线程私有的，保证线程切换后能恢复到正确的执行位置。

### 3. 堆和栈的区别？

| 特性       | 堆 (Heap)                                  | 栈 (Stack)                                     |
| ---------- | ------------------------------------------ | --------------------------------------------- |
| 存储内容   | 对象实例                                     | 局部变量、方法参数、操作数、方法出口等          |
| 线程共享   | 所有线程共享                                 | 每个线程独有                                    |
| 内存分配   | 动态分配                                     | 自动分配，由系统管理                              |
| 大小       | 可配置，通常较大                               | 通常较小，深度有限                                 |
| 生命周期   | 由垃圾回收器管理                             | 与线程生命周期相同，方法执行完毕后自动释放            |
| 主要用途   | 存储对象，供多个线程访问                     | 管理方法调用，存储方法执行过程中的数据                |
| 扩展性     | 可以动态扩展                                 | 扩展性有限                                      |
| 异常       | 容易发生 OOM (OutOfMemoryError)              | 容易发生 StackOverflowError                       |

### 4. 什么是垃圾回收？

垃圾回收 (Garbage Collection, GC) 是 JVM 自动管理内存的一种机制。它负责识别和回收不再使用的对象，释放内存空间，防止内存泄漏。

### 5. 垃圾回收算法有哪些？

*   **标记-清除 (Mark-Sweep)**:
    *   标记所有可达对象。
    *   清除所有未标记的对象。
    *   缺点：会产生内存碎片。
*   **复制 (Copying)**:
    *   将内存分为两块区域，每次只使用其中一块。
    *   将存活对象复制到另一块区域。
    *   清除当前区域的所有对象。
    *   缺点：空间利用率低。
*   **标记-整理 (Mark-Compact)**:
    *   标记所有可达对象。
    *   将存活对象移动到内存的一端，整理内存空间。
    *   清除边界以外的所有对象。
    *   优点：避免内存碎片，空间利用率高。
*   **分代收集 (Generational Collection)**:
    *   根据对象存活时间将内存分为新生代和老年代。
    *   新生代：对象生命周期短，采用复制算法。
    *   老年代：对象生命周期长，采用标记-清除或标记-整理算法。
    *   是目前 JVM 主流的垃圾回收策略。

### 6. 如何判断对象是否可以被回收？

主要有两种算法：

*   **引用计数法 (Reference Counting)**:
    *   每个对象维护一个引用计数器。
    *   当对象被引用时，计数器加 1。
    *   当对象不再被引用时，计数器减 1。
    *   当计数器为 0 时，对象可以被回收。
    *   缺点：无法解决循环引用问题。
*   **可达性分析算法 (Reachability Analysis)**:
    *   从 GC Roots 开始，遍历所有可达对象。
    *   未被 GC Roots 直接或间接引用的对象，被认为是不可达对象，可以被回收。
    *   是目前 JVM 主流的判断算法。

### 7. 什么是 GC Roots？

GC Roots 是指垃圾回收器在进行可达性分析时，作为起点的对象集合。 这些对象包括：

*   **虚拟机栈 (VM Stack) 中引用的对象**:  当前正在执行的方法的局部变量表中的对象引用。
*   **方法区 (Method Area) 中类静态属性引用的对象**:  类中声明为 static 的变量引用的对象。
*   **方法区 (Method Area) 中常量引用的对象**:  类中声明为 final 的常量引用的对象。
*   **本地方法栈 (Native Method Stack) 中 JNI (Java Native Interface) 引用的对象**:  本地方法中使用的对象引用。

### 8. 常见的垃圾回收器有哪些？

*   **Serial GC**:
    *   单线程垃圾回收器。
    *   适用于客户端模式，或单核 CPU 环境。
    *   STW (Stop-The-World) 时间较长。
*   **Parallel GC**:
    *   多线程垃圾回收器。
    *   适用于多核 CPU 环境，注重吞吐量。
    *   STW 时间较长。
*   **CMS (Concurrent Mark Sweep) GC**:
    *   并发标记清除垃圾回收器。
    *   尽量减少 STW 时间，注重响应时间。
    *   会产生内存碎片。
*   **G1 (Garbage-First) GC**:
    *   面向服务器的垃圾回收器。
    *   将堆划分为多个 Region，优先回收垃圾最多的 Region。
    *   可预测的 STW 时间，高吞吐量。
*   **ZGC (Z Garbage Collector)**:
    *   JDK 11 中引入的低延迟垃圾回收器。
    *   基于 Region 的内存布局，并发标记、并发整理、并发转移。
    *   STW 时间极短，通常在 10ms 以内。
*   **Shenandoah GC**:
    *   与 ZGC 类似，也是一种低延迟垃圾回收器。
    *   并发标记、并发整理、并发转移。

### 9. Minor GC、Major GC、Full GC 的区别？

*   **Minor GC (Young GC)**:
    *   只回收新生代。
    *   发生频率较高。
    *   STW 时间较短。
    *   对象在 Eden 区分配满时触发。
*   **Major GC (Old GC)**:
    *   只回收老年代 (通常指 CMS GC)。
    *   发生频率较低。
    *   STW 时间较长。
    *   老年代空间不足时触发。
*   **Full GC**:
    *   回收整个堆空间，包括新生代和老年代。
    *   发生频率最低。
    *   STW 时间最长。
    *   触发条件复杂，例如 System.gc()，老年代空间不足，Metaspace 空间不足等。

### 10. 类加载过程？

类加载过程包括以下几个阶段：

*   **加载 (Loading)**:
    *   将 `.class` 文件加载到内存中。
    *   通过类名获取类的二进制数据流。
    *   在方法区中创建类的元数据结构。
    *   在堆中创建 `java.lang.Class` 对象，作为方法区中类数据的访问入口。
*   **验证 (Verification)**:
    *   确保 `.class` 文件符合 JVM 规范，防止恶意代码。
    *   包括文件格式验证、元数据验证、字节码验证、符号引用验证。
*   **准备 (Preparation)**:
    *   为类变量 (static 变量) 分配内存，并设置初始值 (通常是 0 或 null)。
    *   不包括实例变量，实例变量在对象创建时分配内存。
*   **解析 (Resolution)**:
    *   将符号引用替换为直接引用。
    *   符号引用：以符号形式描述的目标，例如类名、方法名、字段名。
    *   直接引用：指向目标的指针或句柄。
    *   包括类、接口、字段、方法、接口方法的解析。
*   **初始化 (Initialization)**:
    *   执行类构造器 `<clinit>()` 方法，初始化静态变量和静态代码块。
    *   `<clinit>()` 方法由编译器自动生成，包含所有静态变量的赋值动作和静态代码块中的代码。
    *   JVM 会保证一个类的 `<clinit>()` 方法在多线程环境下被正确地加锁、同步，如果多个线程同时去初始化一个类，那么只会有一个线程执行这个类的 `<clinit>()` 方法，其他线程都需要阻塞等待，直到活动线程执行 `<clinit>()` 方法完毕。

### 11. 什么是双亲委派模型？

双亲委派模型是指类加载器在加载类时，首先委派给父类加载器进行加载，如果父类加载器无法加载，则由子类加载器尝试加载。

*   **优点**:
    *   避免类的重复加载。
    *   保证 Java 核心类的安全性，防止被篡改。
*   **类加载器类型**:
    *   启动类加载器 (Bootstrap ClassLoader): 加载 `JAVA_HOME/lib` 目录下的核心类库。
    *   扩展类加载器 (Extension ClassLoader): 加载 `JAVA_HOME/lib/ext` 目录下的扩展类库。
    *   应用程序类加载器 (Application ClassLoader): 加载 classpath 下的类。
    *   自定义类加载器 (Custom ClassLoader): 继承 `ClassLoader` 类，可以自定义类加载逻辑。

### 12. 如何打破双亲委派模型？

通常有以下几种方式：

*   **自定义类加载器**:  重写 `loadClass()` 方法，改变类加载的顺序。  可以在 `loadClass` 方法中不先委派给父类加载器，而是自己先尝试加载。
*   **线程上下文类加载器 (Thread Context ClassLoader)**:  允许子类加载器通过父类加载器加载类。 例如，JNDI, JDBC 等。  当 SPI (Service Provider Interface) 的实现类由应用程序类加载器加载，而 SPI 接口由启动类加载器加载时，就必须使用线程上下文类加载器。
*   **OSGi (Open Services Gateway initiative)**:  模块化框架，允许不同的模块使用不同的类加载器，打破了双亲委派模型。

### 13. 什么是 JVM 内存模型（JMM）？

JVM 内存模型 (Java Memory Model, JMM) 是一种抽象的概念，它定义了 Java 中多线程程序访问共享变量的规则。 JMM 描述了线程如何与主内存进行交互，以及线程如何通过工作内存来访问共享变量。

*   **主内存 (Main Memory)**: 所有线程共享的内存区域，存储变量的实例。
*   **工作内存 (Working Memory)**: 每个线程独有的内存区域，存储主内存中变量的副本。
*   **JMM 解决的问题**:  多线程环境下的可见性、原子性、有序性问题。

### 14. 什么是 happens-before 原则？

happens-before 原则是 JMM 中定义的一组规则，用于描述操作之间的可见性。 如果一个操作 happens-before 另一个操作，则说明第一个操作的结果对第二个操作是可见的。

*   **具体规则**:
    *   **程序顺序规则**:  在同一个线程中，按照程序代码的顺序，前面的操作 happens-before 后面的操作。
    *   **管程锁定规则**:  unlock 操作 happens-before 后续对同一个锁的 lock 操作。
    *   **volatile 变量规则**:  对 volatile 变量的写操作 happens-before 后续对该 volatile 变量的读操作。
    *   **线程启动规则**:  线程的 start() 方法 happens-before 该线程中的任何操作。
    *   **线程终止规则**:  线程中的所有操作 happens-before 该线程的终止 (例如 join() 方法返回)。
    *   **传递性**:  如果 A happens-before B，B happens-before C，那么 A happens-before C。

### 15. volatile 关键字的作用？

*   **可见性**:  保证 volatile 变量的修改对所有线程立即可见。  当一个线程修改了 volatile 变量的值时，会立即刷新到主内存，并且其他线程会立即从主内存中读取最新的值。
*   **禁止指令重排序**:  防止编译器和处理器对 volatile 变量相关的指令进行重排序。  保证程序的执行顺序与代码的顺序一致。
*   **不保证原子性**:  volatile 只能保证单个 volatile 变量的读写操作是原子性的，但不能保证复合操作的原子性。 例如，`i++` 操作不是原子性的。

### 16. synchronized 关键字的底层实现？

*   **monitorenter**:  进入 synchronized 代码块时，执行 monitorenter 指令，尝试获取 monitor (锁) 的所有权。  如果 monitor 的计数器为 0，表示锁未被占用，线程可以获取锁，并将计数器设置为 1。  如果 monitor 的计数器大于 0，表示锁被其他线程占用，当前线程进入阻塞状态，等待锁的释放。  如果当前线程已经持有锁，则计数器加 1，表示重入锁。
*   **monitorexit**:  退出 synchronized 代码块时，执行 monitorexit 指令，释放 monitor 的所有权。  将 monitor 的计数器减 1。  如果计数器为 0，表示锁被释放，唤醒等待队列中的线程。

### 17. 什么是锁升级？

锁升级是指 JVM为了提高锁的性能，根据锁的竞争情况，动态地将锁从低级别升级到高级别的过程。

*   **锁的级别**:
    *   **无锁**:  没有线程竞争锁。
    *   **偏向锁 (Biased Locking)**:  适用于只有一个线程访问同步块的场景。  当一个线程访问同步块时，会在对象头中记录该线程的 ID。  后续该线程再次访问同步块时，不需要进行任何同步操作。
    *   **轻量级锁 (Lightweight Locking)**:  适用于多个线程交替访问同步块的场景。  线程在进入同步块之前，会将对象头复制到自己的栈帧中。  使用 CAS (Compare and Swap) 操作尝试将对象头更新为指向栈帧中锁记录的指针。  如果 CAS 操作成功，表示获取锁。  如果 CAS 操作失败，表示有其他线程竞争锁，当前线程会自旋等待。
    *   **重量级锁 (Heavyweight Locking)**:  适用于多个线程同时竞争同步块的场景。  线程进入阻塞状态，等待操作系统的调度。  使用操作系统的 Mutex (互斥锁) 实现。

**锁升级的过程**:  无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁。  锁只能升级，不能降级。

### 18. 如何进行 JVM 调优？

JVM 调优是一个复杂的过程，需要根据具体的应用场景和性能瓶颈进行分析和调整。

*   **调优步骤**:
    *   **监控**:  使用监控工具 (例如 jstat, jmap, jstack, jconsole, VisualVM, Arthas) 收集 JVM 的运行数据。
    *   **分析**:  分析监控数据，找出性能瓶颈。  例如，CPU 使用率高，内存使用率高，GC 频繁，STW 时间长等。
    *   **调整**:  根据分析结果，调整 JVM 参数，例如堆大小，新生代大小，垃圾回收器等。
    *   **验证**:  重新运行程序，监控性能指标，验证调优效果。
    *   **迭代**:  重复以上步骤，直到达到预期的性能目标。

### 19. 常见的 JVM 调优参数有哪些？

*   **堆大小**:
    *   `-Xms`: 初始堆大小。
    *   `-Xmx`: 最大堆大小。  建议将 `-Xms` 和 `-Xmx` 设置为相同的值，避免堆的动态扩展。
*   **新生代大小**:
    *   `-Xmn`: 新生代大小。  新生代越大，Minor GC 的频率越低，但老年代的空间会减小。
*   **Survivor 区比例**:
    *   `-XX:SurvivorRatio`: Eden 区和 Survivor 区的比例。  例如，`-XX:SurvivorRatio=8` 表示 Eden 区占新生代的 8/10，两个 Survivor 区各占 1/10。
*   **对象晋升老年代的年龄阈值**:
    *   `-XX:MaxTenuringThreshold`: 对象在 Survivor 区存活的次数，超过该值则晋升到老年代。
*   **垃圾回收器**:
    *   `-XX:+UseSerialGC`: 使用 Serial GC。
    *   `-XX:+UseParallelGC`: 使用 Parallel GC。
    *   `-XX:+UseConcMarkSweepGC`: 使用 CMS GC。
    *   `-XX:+UseG1GC`: 使用 G1 GC。
*   **其他参数**:
    *   `-XX:+PrintGCDetails`: 打印 GC 详细信息。
    *   `-XX:+HeapDumpOnOutOfMemoryError`: OOM 时生成 Heap Dump 文件。
    *   `-XX:HeapDumpPath`: Heap Dump 文件的路径。

### 20. 如何排查内存泄漏问题？

内存泄漏是指程序中分配的内存无法被回收，导致内存占用持续增加，最终可能导致 OOM。

*   **排查步骤**:
    *   **监控**:  使用监控工具监控 JVM 的内存使用情况。
    *   **分析**:  如果发现内存占用持续增加，则可能存在内存泄漏。
    *   **Dump**:  使用 `jmap` 命令生成 Heap Dump 文件。
    *   **分析 Heap Dump**:  使用 MAT (Memory Analyzer Tool) 或 VisualVM 等工具分析 Heap Dump 文件，找出占用内存最多的对象。
    *   **代码审查**:  根据 Heap Dump 分析结果，审查代码，找出可能导致内存泄漏的地方。  例如，未关闭的连接，未释放的资源，静态集合类持有对象等。
    *   **修复**:  修复代码，释放不再使用的对象。

### 21. OOM（OutOfMemoryError）的常见原因？

*   **堆内存溢出**:  堆中对象数量超过了 `-Xmx` 设置的最大堆大小。  常见原因：创建大量对象，对象无法被回收，存在内存泄漏。
*   **元空间 (Metaspace) 溢出**:  加载的类信息过多，超过了 Metaspace 的大小。  常见原因：大量动态生成类，使用了 CGLIB 等字节码增强技术。
*   **栈内存溢出**:  线程请求的栈深度超过了 JVM 允许的最大深度。  常见原因：递归调用过深。
*   **本地内存溢出**:  Native 方法分配的内存超过了操作系统的限制。  常见原因：使用了 JNI，分配了大量的本地内存。
*   **直接内存溢出**:  使用了 `ByteBuffer.allocateDirect()` 分配的直接内存超过了 `-XX:MaxDirectMemorySize` 设置的大小。

### 22. String 常量池的理解？

String 常量池是 JVM 中一个特殊的存储区域，用于存储字符串常量。

*   **存储位置**:
    *   在 JDK 6 及之前，String 常量池位于 PermGen (永久代) 中。
    *   在 JDK 7 中，String 常量池被移动到堆中。
    *   在 JDK 8 及之后，String 常量池仍然位于堆中。
*   **作用**:
    *   避免字符串的重复创建，节省内存空间。
    *   提高字符串的比较效率。
*   **存储机制**:
    *   当使用字符串字面量 (例如 `"abc"`) 创建字符串时，JVM 会首先检查 String 常量池中是否存在相同的字符串。  如果存在，则直接返回常量池中的引用。  如果不存在，则在常量池中创建一个新的字符串对象，并返回该对象的引用。
    *   当使用 `new String("abc")` 创建字符串时，JVM 会首先在堆中创建一个新的字符串对象，然后检查 String 常量池中是否存在相同的字符串。  如果不存在，则在常量池中创建一个新的字符串对象，并将堆中对象的引用复制到常量池中。  如果存在，则不创建新的字符串对象。

### 23. intern() 方法的作用？

`intern()` 方法用于将一个字符串对象添加到 String 常量池中。

*   **JDK 6**:
    *   如果 String 常量池中已经存在相同的字符串，则返回常量池中的引用。
    *   如果 String 常量池中不存在相同的字符串，则将该字符串对象复制到常量池中，并返回常量池中的引用。
*   **JDK 7 及之后**:
    *   如果 String 常量池中已经存在相同的字符串，则返回常量池中的引用。
    *   如果 String 常量池中不存在相同的字符串，则在常量池中记录对堆中字符串对象的引用，并返回常量池中的引用。  这意味着常量池中存储的是堆中字符串对象的引用，而不是字符串对象的副本。
*   **使用场景**:
    *   节省内存空间，避免字符串的重复创建。
    *   提高字符串的比较效率。

### 24. Java 8 之后对 JVM 做了哪些改进？(例如：元空间 Metaspace)**

*   **元空间 (Metaspace) 替代永久代 (PermGen)**:  将方法区从永久代移动到元空间，直接使用本地内存，避免了 PermGen 的 OOM 问题。  可以通过 `-XX:MaxMetaspaceSize` 设置元空间的大小。
*   **移除永久代中的字符串常量池**:  将字符串常量池移动到堆中，更容易被垃圾回收。
*   **引入新的垃圾回收器**:  G1 垃圾回收器成为默认的垃圾回收器，提供更好的性能和可预测的 STW 时间。
*   **支持更多的新特性**:  例如，Lambda 表达式，Stream API 等。

### 25. 如何使用工具监控 JVM 状态？ (jstat, jmap, jstack 等)**

*   **jstat**:  用于监控 JVM 的各种统计信息，例如堆大小，GC 次数，GC 时间等。  常用命令：`jstat -gc <pid> <interval> <count>`
*   **jmap**:  用于生成 Heap Dump 文件，或打印堆的统计信息。  常用命令：`jmap -dump:format=b,file=heapdump.bin <pid>`
*   **jstack**:  用于打印线程的堆栈信息，可以用于分析死锁，长时间运行的线程等问题。  常用命令：`jstack <pid>`
*   **jconsole**:  一个图形化的 JVM 监控工具，可以监控 JVM 的内存使用情况，线程状态，类加载情况等。
*   **VisualVM**:  一个更强大的图形化 JVM 监控工具，可以监控 JVM 的各种指标，还可以进行 Heap Dump 分析，线程分析等。
*   **Arthas**:  阿里巴巴开源的 Java 诊断工具，功能强大，可以进行在线诊断，热部署等。

### 26. G1 垃圾回收器的原理和优势？

*   **原理**:
    *   将堆划分为多个大小相等的 Region。
    *   每个 Region 可以是 Eden 区，Survivor 区，或老年代。
    *   G1 GC 会优先回收垃圾最多的 Region (Garbage-First)。
    *   使用 Remembered Set 跟踪 Region 之间的引用关系。
    *   使用并发标记，并发清理，并发转移等技术，尽量减少 STW 时间。
*   **优势**:
    *   可预测的 STW 时间，可以设置期望的STW 时间。
    *   高吞吐量。
    *   避免内存碎片。
    *   适用于大堆内存的应用。

### 27. ZGC 和 Shenandoah GC 的特点？

ZGC 和 Shenandoah GC 都是低延迟垃圾回收器，目标是实现 STW 时间在 10ms 以内。

*   **ZGC (Z Garbage Collector)**:
    *   基于 Region 的内存布局。
    *   使用着色指针 (Colored Pointer) 技术，在对象指针中存储额外的元数据信息，例如对象的颜色，是否可回收等。
    *   并发标记，并发整理，并发转移。
    *   适用于大堆内存的应用。
*   **Shenandoah GC**:
    *   与 ZGC 类似，也是基于 Region 的内存布局。
    *   使用 Brooks forwarding pointer 技术，在对象头中维护一个转发指针，用于并发转移对象。
    *   并发标记，并发整理，并发转移。

### 28. 类加载器隔离的应用场景？ (例如：OSGI 框架)**

类加载器隔离是指使用不同的类加载器加载不同的类，从而实现类之间的隔离。

*   **应用场景**:
    *   **OSGi (Open Services Gateway initiative)**:  模块化框架，每个模块使用一个独立的类加载器，可以实现模块之间的隔离，避免类冲突。
    *   **Web 容器 (例如 Tomcat)**:  每个 Web 应用使用一个独立的类加载器，可以实现 Web 应用之间的隔离，避免类冲突。
    *   **插件系统**:  插件使用一个独立的类加载器，可以实现插件之间的隔离，避免类冲突。

### 29. 动态代理的实现原理？

动态代理是指在运行时动态生成代理类。

*   **实现方式**:
    *   **JDK 动态代理**:  基于接口实现。  通过 `Proxy` 类和 `InvocationHandler` 接口实现。  `Proxy.newProxyInstance()` 方法可以动态生成代理类。
    *   **CGLIB 动态代理**:  基于类实现。  通过生成目标类的子类来实现代理。  需要引入 CGLIB 库。
*   **原理**:
    *   JDK 动态代理：  生成一个实现了目标接口的代理类。  代理类的方法调用会转发到 `InvocationHandler` 的 `invoke()` 方法。
    *   CGLIB 动态代理：  生成一个目标类的子类。  子类会覆盖目标类的方法，并在方法中调用 `MethodInterceptor` 的 `intercept()` 方法。

### 30. 反射的原理和应用场景？

反射是指在运行时动态获取类的信息，并可以动态创建对象，调用方法，访问字段等。

*   **原理**:
    *   通过 `Class` 对象获取类的各种信息。  `Class` 对象是在类加载时创建的。
    *   通过 `Constructor` 对象创建对象。
    *   通过 `Method` 对象调用方法。
    *   通过 `Field` 对象访问字段。
*   **应用场景**:
    *   **框架**:  例如 Spring，Hibernate 等框架，大量使用了反射来实现依赖注入，对象关系映射等功能。
    *   **插件系统**:  通过反射可以动态加载和调用插件。
    *   **单元测试**:  通过反射可以访问类的私有方法和私有字段，进行更全面的测试。

### 31. 字节码增强技术 (例如：ASM, Javassist, ByteBuddy)**

字节码增强是指在运行时动态修改类的字节码。

*   **技术**:
    *   **ASM**:  一个底层的字节码操作库，需要手动操作字节码指令。
    *   **Javassist**:  一个高级的字节码操作库，可以使用 Java 代码来修改字节码。
    *   **ByteBuddy**:  一个更高级的字节码操作库，提供了更简洁的 API 和更强大的功能。
*   **应用场景**:
    *   **AOP**:  例如 AspectJ，通过字节码增强来实现 AOP 功能。
    *   **监控**:  通过字节码增强来添加监控代码，收集程序的运行数据。
    *   **性能优化**:  通过字节码增强来优化程序的性能。

### 32. JIT 编译器的理解？

JIT (Just-In-Time) 编译器是指在运行时将字节码编译成本地机器码。

*   **作用**:
    *   提高程序的执行效率。
    *   可以将热点代码 (经常执行的代码) 编译成本地机器码，避免重复解释执行。
*   **编译过程**:
    *   JVM 会监控程序的运行情况，找出热点代码。
*   JIT 编译器会将热点代码编译成本地机器码。
    *   本地机器码会被缓存起来，下次执行相同代码时，直接使用缓存的机器码。
*   **类型**:
    *   **C1 编译器 (Client Compiler)**:  适用于客户端模式，编译速度快，但优化程度较低。
    *   **C2 编译器 (Server Compiler)**:  适用于服务器模式，编译速度较慢，但优化程度较高。

### 33. 逃逸分析的理解？

逃逸分析是指 JVM 在编译时分析对象的作用域，判断对象是否会逃逸出方法或线程。

*   **逃逸状态**:
    *   **全局逃逸**:  对象可能会被其他方法或线程访问。
    *   **方法逃逸**:  对象只在当前方法中被访问。
    *   **没有逃逸**:  对象只在当前线程的当前方法中被访问。
*   **优化措施**:
    *   **同步消除**:  如果对象没有逃逸出线程，则可以消除对该对象的同步操作。
    *   **标量替换**:  如果对象没有逃逸出方法，则可以将对象分解为多个标量，分配在栈上，避免在堆上分配内存。
    *   **栈上分配**:  如果对象没有逃逸出方法，则可以将对象分配在栈上，避免在堆上分配内存。

### 34. TLAB (Thread Local Allocation Buffer) 的理解？

TLAB 是指线程本地分配缓冲区。

*   **作用**:
    *   加快对象分配的速度。
    *   每个线程在堆中拥有一个 TLAB，线程在 TLAB 中分配对象不需要进行同步操作。
    *   只有当 TLAB 空间不足时，才需要向堆申请新的 TLAB。
*   **原理**:
    *   在 Eden 区中为每个线程分配一个 TLAB。
    *   线程在 TLAB 中分配对象时，不需要进行同步操作。
    *   当 TLAB 空间不足时，线程需要向 Eden 区申请新的 TLAB。
    *   TLAB 的大小可以通过 `-XX:TLABSize` 参数设置。

### 35. 偏向锁、轻量级锁、重量级锁的区别和转换过程？

这些锁是 JVM 为了优化 `synchronized` 关键字而设计的不同锁状态。 它们代表了从低到高的锁竞争程度，以及 JVM 采用的不同锁策略。

*   **偏向锁 (Biased Locking)**
    *   **适用场景**: 只有一个线程会访问同步代码块的情况。
    *   **原理**: 当一个线程第一次获取锁时，会在对象头中记录下该线程的 ID。以后该线程再次进入这个同步代码块时，不需要进行任何同步操作，直接进入。
    *   **优点**: 消除了不必要的锁竞争，提高了性能。
    *   **缺点**: 如果存在其他线程竞争锁，偏向锁会失效，需要升级为轻量级锁。
*   **轻量级锁 (Lightweight Locking)**
    *   **适用场景**: 多个线程交替访问同步代码块，但竞争不激烈的情况。
    *   **原理**: 线程在进入同步代码块前，会将对象头复制到自己的栈帧中，然后使用 CAS 操作尝试将对象头替换为指向锁记录的指针。如果替换成功，则获得锁；如果替换失败，说明有其他线程正在竞争锁，当前线程会自旋等待。
    *   **优点**: 避免了线程阻塞和唤醒的开销，提高了性能。
    *   **缺点**: 如果自旋次数过多，或者长时间无法获得锁，轻量级锁会升级为重量级锁。
*   **重量级锁 (Heavyweight Locking)**
    *   **适用场景**: 多个线程同时竞争同步代码块的情况。
    *   **原理**: 线程进入阻塞状态，等待操作系统调度。重量级锁依赖于操作系统的互斥量 (Mutex) 实现，会涉及到用户态和内核态的切换，开销较大。
    *   **优点**: 可以保证线程安全。
    *   **缺点**: 性能开销较大。

**锁升级过程**:

1.  **无锁状态**: 对象刚创建时，对象头中没有任何锁信息。
2.  **偏向锁**: 当第一个线程访问同步代码块时，JVM 会将对象头设置为偏向模式，并将线程 ID 记录在对象头中。
3.  **轻量级锁**: 如果有第二个线程尝试获取锁，偏向锁会失效，JVM 会将对象头设置为轻量级锁，并让线程自旋尝试获取锁。
4.  **重量级锁**: 如果自旋次数过多或者竞争过于激烈，轻量级锁会升级为重量级锁，线程进入阻塞状态，等待操作系统调度。

### 36. CAS (Compare and Swap) 的原理和应用？

CAS (Compare and Swap) 是一种无锁算法，用于实现原子操作。

*   **原理**:
    *   CAS 操作包含三个操作数：内存地址 V，期望值 A，新值 B。
    *   CAS 操作会比较内存地址 V 中的值是否等于期望值 A。
    *   如果相等，则将内存地址 V 中的值更新为新值 B。
    *   如果不相等，则说明有其他线程修改了该值，当前线程的操作失败。
*   **应用**:
    *   **原子类**:  `java.util.concurrent.atomic` 包中的原子类，例如 `AtomicInteger`，`AtomicLong` 等，都是基于 CAS 实现的。
    *   **AQS (AbstractQueuedSynchronizer)**:  AQS 中的 `tryAcquire()` 方法也是基于 CAS 实现的。
*   **缺点**:
    *   **ABA 问题**:  如果一个值从 A 变为 B，又从 B 变为 A，CAS 操作会认为该值没有发生变化，但实际上可能已经被修改过了。  可以使用版本号来解决 ABA 问题。
    *   **自旋开销**:  如果 CAS 操作长时间无法成功，会一直自旋，占用 CPU 资源。

### 37. AQS (AbstractQueuedSynchronizer) 的理解？

AQS (AbstractQueuedSynchronizer) 是一个抽象的同步器，用于构建锁和同步器。

*   **原理**:
    *   AQS 维护一个 volatile int state 变量，表示同步状态。
    *   AQS 内部维护一个 FIFO 队列，用于存储等待获取锁的线程。
    *   线程尝试获取锁时，会使用 CAS 操作修改 state 变量。
    *   如果获取锁成功，则将 state 变量设置为获取锁的状态。
    *   如果获取锁失败，则将当前线程加入到等待队列中，并阻塞当前线程。
    *   当锁被释放时，会唤醒等待队列中的一个或多个线程。
*   **应用**:
    *   **ReentrantLock**:  可重入锁，基于 AQS 实现。
    *   **Semaphore**:  信号量，用于控制对共享资源的访问数量，基于 AQS 实现。
    *   **CountDownLatch**:  计数器，用于等待多个线程完成任务，基于 AQS 实现。
    *   **CyclicBarrier**:  循环栅栏，用于等待一组线程达到一个屏障点，然后继续执行，基于 AQS 实现。

---
title: Java 面试题
date: 2025-05-10 23:15:53
permalink: /java/mainshi
categories:
  - 后端
tags:
  - 面试
author: zhuib
---

# Java 面试题

## 一、Java 基础
1.  JDK 和 JRE 有什么区别？
    *   JDK（Java Development Kit）：Java 开发工具包，包含 JRE 以及开发 Java 程序所需的工具，如编译器（javac）、调试器（jdb）等。
    *   JRE（Java Runtime Environment）：Java 运行时环境，包含 JVM（Java Virtual Machine）和 Java 核心类库，是运行 Java 程序所必需的。

2.  == 和 equals 的区别是什么？
    *   `==`：
        *   对于基本类型，比较的是值是否相等。
        *   对于引用类型，比较的是引用是否指向同一个对象。
    *   `equals()`：
        *   是 `Object` 类的方法，默认实现是比较引用是否相等（与 `==` 相同）。
        *   通常需要重写 `equals()` 方法，用于比较对象的内容是否相等。常见的重写方式是比较对象的属性值。

3.  两个对象的 hashCode()相同，则 equals()也一定为 true，对吗？
    错误。`hashCode()` 相同只能说明这两个对象在散列算法中可能被分配到同一个桶中，但并不能保证它们的内容一定相等。`equals()` 方法用于判断对象的内容是否相等。如果`equals()` 返回 true，那么hashCode()必须相同。

4.  final 在 java 中有什么作用？
    *   修饰类：表示该类不能被继承。
    *   修饰方法：表示该方法不能被重写。
    *   修饰变量：
        *   修饰成员变量：必须在声明时或构造方法中初始化，初始化后值不能被修改。
        *   修饰局部变量：必须在使用前赋值，赋值后值不能被修改。

5.  java 中的 Math.round(-1.5) 等于多少？
    `-1`。`Math.round()` 方法将一个数四舍五入到最接近的整数。  `-1.5` 位于 `-2` 和 `-1` 之间，更接近 `-1`。

6.  String 属于基础的数据类型吗？
    否。`String` 是一个类，属于引用类型。 Java 的基础数据类型包括 byte, short, int, long, float, double, boolean, char。

7.  java 中操作字符串都有哪些类？它们之间有什么区别？
    *   `String`：不可变字符串，每次修改都会创建一个新的 `String` 对象。适用于字符串操作较少的情况。
    *   `StringBuilder`：可变字符串，线程不安全，但效率高。适用于单线程环境下大量字符串操作。
    *   `StringBuffer`：可变字符串，线程安全，但效率相对较低。适用于多线程环境下大量字符串操作。

8.  String str="i"与 String str=new String(“i”)一样吗？
    不一样。
    *   `String str = "i";`  会在字符串常量池中查找是否存在 "i"，如果存在则直接引用，否则在字符串常量池中创建 "i" 并引用。
    *   `String str = new String("i");`  会在堆中创建一个新的 `String` 对象，并将字符串常量池中的 "i" 复制到堆中的对象中。

9.  如何将字符串反转？
    可以使用 `StringBuilder` 或 `StringBuffer` 的 `reverse()` 方法。
    ```java
    String str = "hello";
    String reversedStr = new StringBuilder(str).reverse().toString();
    ```

10. String 类的常用方法都有那些？
    *   `length()`：获取字符串长度。
    *   `charAt(int index)`：获取指定索引位置的字符。
    *   `substring(int beginIndex, int endIndex)`：截取子字符串。
    *   `equals(Object obj)`：比较字符串内容是否相等。
    *   `equalsIgnoreCase(String anotherString)`：忽略大小写比较字符串内容。
    *   `compareTo(String anotherString)`：比较字符串大小。
    *   `indexOf(String str)`：查找子字符串第一次出现的位置。
    *   `lastIndexOf(String str)`：查找子字符串最后一次出现的位置。
    *   `startsWith(String prefix)`：判断字符串是否以指定前缀开始。
    *   `endsWith(String suffix)`：判断字符串是否以指定后缀结束。
    *   `replace(CharSequence target, CharSequence replacement)`：替换字符串中的指定字符或字符串。
    *   `trim()`：去除字符串首尾空格。
    *   `toUpperCase()`：将字符串转换为大写。
    *   `toLowerCase()`：将字符串转换为小写。
    *   `split(String regex)`：根据指定分隔符拆分字符串。

11. 抽象类必须要有抽象方法吗？
    否。抽象类可以没有抽象方法，但只要类中包含抽象方法，该类就必须声明为抽象类。

12. 普通类和抽象类有哪些区别？
    *   抽象类不能被实例化，普通类可以被实例化。
    *   抽象类可以包含抽象方法和非抽象方法，普通类只能包含非抽象方法。
    *   抽象类可以有构造方法，用于子类初始化时调用，普通类也有构造方法。
    *   抽象类可以有成员变量，普通类也可以有成员变量。

13. 抽象类能使用 final 修饰吗？
    不能。`final` 修饰的类不能被继承，而抽象类必须被继承才有意义，因此不能同时使用 `final` 和 `abstract` 修饰一个类。

14. 接口和抽象类有什么区别？
    *   接口中的方法默认是 `public abstract` 的，抽象类中的方法可以是任意访问权限。
    *   接口中不能有实例变量，只能有 `static final` 常量，抽象类可以有实例变量。
    *   一个类可以实现多个接口，但只能继承一个抽象类。
    *   接口的设计目的是定义一种规范，而抽象类更多的是提供一种代码复用的方式。
    *   JDK 8 以后，接口中可以有 `default` 方法和 `static` 方法，可以包含方法的实现。

15. java 中 IO 流分为几种？
    *   按照数据流方向分：输入流（InputStream, Reader）和输出流（OutputStream, Writer）。
    *   按照处理数据单位分：字节流（InputStream, OutputStream）和字符流（Reader, Writer）。
    *   按照功能分：节点流和处理流。  节点流是直接操作目标设备的流，如 FileInputStream、FileOutputStream 等。 处理流是对节点流进行包装，提供额外的功能，如 BufferedInputStream、BufferedReader 等。

16. BIO、NIO、AIO 有什么区别？
    *   BIO（Blocking I/O）：同步阻塞 I/O。一个连接对应一个线程，如果线程阻塞，会浪费资源。
    *   NIO（Non-blocking I/O）：同步非阻塞 I/O。使用 Selector 监听多个 Channel，一个线程可以处理多个连接。
    *   AIO（Asynchronous I/O）：异步非阻塞 I/O。I/O 操作由操作系统完成，完成后通知线程。

17. Files 的常用方法都有哪些？
    *   `Files.exists(Path path)`：检查文件或目录是否存在。
    *   `Files.createFile(Path path)`：创建文件。
    *   `Files.createDirectory(Path path)`：创建目录。
    *   `Files.delete(Path path)`：删除文件或目录。
    *   `Files.copy(Path source, Path target)`：复制文件。
    *   `Files.move(Path source, Path target)`：移动文件。
    *   `Files.readAllBytes(Path path)`：读取文件所有字节。
    *   `Files.readAllLines(Path path)`：读取文件所有行。
    *   `Files.write(Path path, byte[] bytes)`：写入字节到文件。
    *   `Files.walk(Path start, int maxDepth)`: 遍历目录树。
    *   `Files.size(Path path)`: 获取文件大小。
    *   `Files.getLastModifiedTime(Path path)`: 获取文件最后修改时间。

## 二、容器
18. java 容器都有哪些？
    Java 容器主要分为 Collection 和 Map 两种。
    *   **Collection：**
        *   List：ArrayList, LinkedList, Vector, Stack
        *   Set：HashSet, LinkedHashSet, TreeSet
        *   Queue: PriorityQueue, ArrayDeque
    *   **Map：**
        *   HashMap, LinkedHashMap, TreeMap, Hashtable, ConcurrentHashMap

19. Collection 和 Collections 有什么区别？
    *   `Collection` 是一个接口，是 List、Set 和 Queue 等集合类的父接口。
    *   `Collections` 是一个工具类，提供了对集合进行排序、搜索、线程安全化等操作的静态方法。

20. List、Set、Map 之间的区别是什么？
    *   List：有序集合，允许重复元素。
    *   Set：无序集合，不允许重复元素。
    *   Map：键值对集合，键不允许重复，值可以重复。

21. HashMap 和 Hashtable 有什么区别？
    *   HashMap：线程不安全，允许键和值为 null。
    *   Hashtable：线程安全，不允许键和值为 null。由于线程安全，效率较低。
    *   HashMap 是 Hashtable 的替代品。

22. 如何决定使用 HashMap 还是 TreeMap？
    *   HashMap：适用于快速查找的场景，无序。
    *   TreeMap：适用于需要排序的场景，按照键的自然顺序或自定义比较器排序。

23. 说一下 HashMap 的实现原理？
    HashMap 基于哈希表实现，使用数组 + 链表/红黑树的结构。
    *   **存储：**  通过 key 的 hashCode() 方法计算出哈希值，然后通过哈希算法（通常是取模运算）确定元素在数组中的位置。
    *   **哈希冲突：**  如果不同的 key 计算出相同的哈希值，则发生哈希冲突。HashMap 使用链表或红黑树解决冲突。当链表长度超过一定阈值（默认为 8）时，链表会转换为红黑树，以提高查找效率。
    *   **扩容：**  当 HashMap 中的元素数量超过容量 * 加载因子（默认为 0.75）时，会进行扩容，创建一个更大的数组，并将所有元素重新哈希到新的数组中。
    *   **查找：**  根据 key 的 hashCode() 方法计算出哈希值，找到数组中的位置，然后在链表或红黑树中查找对应的元素。

24. 说一下 HashSet 的实现原理？
    HashSet 基于 HashMap 实现。HashSet 中的元素作为 HashMap 的 key 存储，HashMap 的 value 是一个固定的 Object 对象。利用 HashMap key 的唯一性保证 HashSet 中元素的唯一性。

25. ArrayList 和 LinkedList 的区别是什么？
    *   ArrayList：基于数组实现，查询速度快，增删速度慢（涉及到元素的移动）。
    *   LinkedList：基于链表实现，查询速度慢，增删速度快。

26. 如何实现数组和 List 之间的转换？
    *   数组转 List：`Arrays.asList(array)`
    *   List 转数组：`list.toArray(new T[list.size()])`

27. ArrayList 和 Vector 的区别是什么？
    *   ArrayList：线程不安全，效率高。
    *   Vector：线程安全，效率较低。

28. Array 和 ArrayList 有何区别？
    *   Array：数组，长度固定，可以存储基本类型和对象。
    *   ArrayList：集合类，长度可变，只能存储对象。

29. 在 Queue 中 poll()和 remove()有什么区别？
    *   poll()：从队列中移除并返回队头元素，如果队列为空，则返回 null。
    *   remove()：从队列中移除并返回队头元素，如果队列为空，则抛出 NoSuchElementException 异常。

30. 哪些集合类是线程安全的？
    *   Vector
    *   Hashtable
    *   ConcurrentHashMap
    *   CopyOnWriteArrayList
    *   CopyOnWriteArraySet
    *   使用 Collections.synchronizedList(), Collections.synchronizedSet(), Collections.synchronizedMap() 包装的 List, Set, Map

31. 迭代器 Iterator 是什么？
    迭代器是一种设计模式，提供了一种顺序访问集合元素而
无需暴露集合内部结构的方式。

32. 迭代器 Iterator 怎么使用？有什么特点？
    使用：
    ```java
    List<String> list = new ArrayList<>();
    Iterator<String> iterator = list.iterator();
    while (iterator.hasNext()) {
        String element = iterator.next();
        System.out.println(element);
        //iterator.remove(); // 删除元素
    }
    ```
    特点：
    *   只能单向遍历。
    *   可以在遍历过程中删除元素（使用 iterator.remove() 方法）。

33. Iterator 和 ListIterator 有什么区别？
    *   Iterator：只能单向遍历，只能删除元素。
    *   ListIterator：可以双向遍历，可以添加、删除和修改元素，只能用于 List 集合。

34. 怎么确保一个集合不能被修改？
    *   使用 `Collections.unmodifiableList()`, `Collections.unmodifiableSet()`, `Collections.unmodifiableMap()` 方法创建不可修改的集合。

## 三、多线程
35. 并行和并发有什么区别？
    *   并行：多个任务同时执行，需要多个 CPU 核心。
    *   并发：多个任务在同一时间段内交替执行，只需要一个 CPU 核心。

36. 线程和进程的区别？
    *   进程：是操作系统资源分配的基本单位，拥有独立的内存空间。
    *   线程：是 CPU 调度的基本单位，是进程中的一个执行单元，共享进程的内存空间。
    *   一个进程可以包含多个线程。

37. 守护线程是什么？
    守护线程（Daemon Thread）是一种特殊的线程，用于在后台提供服务。当所有非守护线程都结束时，守护线程会自动结束。例如，垃圾回收线程就是一个守护线程。

38. 创建线程有哪几种方式？
    *   继承 `Thread` 类。
    *   实现 `Runnable` 接口。
    *   实现 `Callable` 接口，配合 `FutureTask` 使用。
    *   使用线程池。

39. 说一下 runnable 和 callable 有什么区别？
    *   Runnable：`run()` 方法没有返回值，只能抛出运行时异常。
    *   Callable：`call()` 方法有返回值，可以抛出受检查异常。
    *   Callable 需要配合 FutureTask 使用，可以获取线程的执行结果。

40. 线程有哪些状态？
    *   NEW（新建）：线程被创建但尚未启动。
    *   RUNNABLE（可运行）：线程正在运行或准备运行，可能正在等待 CPU 时间片。
    *   BLOCKED（阻塞）：线程正在等待获取锁。
    *   WAITING（等待）：线程正在等待另一个线程执行特定操作。例如，调用 `wait()` 方法后进入 WAITING 状态。
    *   TIMED_WAITING（定时等待）：线程正在等待另一个线程执行特定操作，但设置了等待时间。例如，调用 `sleep()` 或 `wait(timeout)` 方法后进入 TIMED_WAITING 状态。
    *   TERMINATED（终止）：线程执行完毕。

41. sleep() 和 wait() 有什么区别？
    *   sleep()：是 Thread 类的静态方法，使线程休眠指定的时间，不会释放锁。
    *   wait()：是 Object 类的方法，使线程进入等待状态，会释放锁。  必须在 synchronized 块或方法中使用。
    *   sleep() 可以在任何地方使用，wait() 只能在 synchronized 块或方法中使用。
    *   sleep() 不依赖于 monitor，wait() 依赖于 monitor。

42. notify()和 notifyAll()有什么区别？
    *   notify()：唤醒一个等待该对象锁的线程。
    *   notifyAll()：唤醒所有等待该对象锁的线程。

43. 线程的 run()和 start()有什么区别？
    *   run()：只是一个普通的方法，直接调用会在当前线程中执行 run() 方法中的代码。
    *   start()：启动一个新的线程，并在新的线程中执行 run() 方法。

44. 创建线程池有哪几种方式？
    *   使用 `ThreadPoolExecutor` 构造方法自定义线程池。
    *   使用 `Executors` 工具类提供的静态方法创建线程池：
        *   `newFixedThreadPool(int nThreads)`：固定大小的线程池。
        *   `newCachedThreadPool()`：可缓存的线程池，线程数量不固定。
        *   `newSingleThreadExecutor()`：单线程的线程池。
        *   `newScheduledThreadPool(int corePoolSize)`：可定时执行任务的线程池。

45. 线程池都有哪些状态？
    *   RUNNING：线程池正常运行。
    *   SHUTDOWN：线程池停止接收新任务，但会处理已提交的任务。
    *   STOP：线程池停止接收新任务，并中断正在执行的任务。
    *   TIDYING：所有任务都已终止，workerCount 为零，线程池即将进入 terminated 状态。
    *   TERMINATED：线程池已完全终止。

46. 线程池中 submit()和 execute()方法有什么区别？
    *   execute()：只能提交 Runnable 任务，没有返回值。
    *   submit()：可以提交 Runnable 和 Callable 任务，有返回值（Future 对象），可以获取任务的执行结果或异常。

47. 在 java 程序中怎么保证多线程的运行安全？
    *   使用锁（synchronized, Lock）。
    *   使用 volatile 关键字保证变量的可见性。
    *   使用原子类（AtomicInteger, AtomicLong 等）。
    *   使用线程安全的集合类（ConcurrentHashMap, CopyOnWriteArrayList 等）。
    *   使用 ThreadLocal 为每个线程创建独立的变量副本。

48. 多线程锁的升级原理是什么？
    锁的升级过程通常是：无锁 -> 偏向锁 -> 轻量级锁 -> 重量级锁。
    *   **偏向锁：**  当一个线程访问同步代码块并获取锁时，会在对象头中记录该线程的 ID。 以后该线程再次访问同步代码块时，无需进行 CAS 操作，直接获取锁，提高了效率。
    *   **轻量级锁：**  当有多个线程竞争锁时，偏向锁会升级为轻量级锁。  线程会在自己的栈帧中创建一个锁记录（Lock Record），然后使用 CAS 操作尝试将对象头中的锁指针指向锁记录。 如果 CAS 操作成功，则获取锁；否则，自旋等待。
    *   **重量级锁：**  当自旋次数达到一定阈值或有其他线程也在竞争锁时，轻量级锁会升级为重量级锁。  线程会进入阻塞状态，等待操作系统唤醒。 重量级锁的性能较低，因为涉及到用户态和内核态的切换。

49. 什么是死锁？
    死锁是指两个或多个线程互相持有对方需要的资源，导致所有线程都无法继续执行的情况。

50. 怎么防止死锁？
    *   避免持有多个锁。
    *   尝试以相同的顺序获取锁。
    *   使用定时锁，如果超过一定时间未能获取锁，则释放已持有的锁。
    *   使用死锁检测工具。

51. ThreadLocal 是什么？有哪些使用场景？
    ThreadLocal 为每个线程提供了一个独立的变量副本，使得每个线程都可以修改自己的变量而不会影响其他线程。
    使用场景：
    *   保存线程上下文信息，例如用户 ID、事务 ID 等。
    *   解决线程安全问题，避免多个线程同时访问共享变量。

52. 说一下 synchronized 底层实现原理？
    synchronized 通过 monitor 对象实现。
    *   **同步代码块：**  使用 monitorenter 和 monitorexit 指令在代码块的开始和结束位置插入 monitor 对象。  monitorenter 指令尝试获取 monitor 的所有权，如果 monitor 的计数器为 0，则获取成功；如果 monitor 已经被其他线程持有，则当前线程进入阻塞状态。  monitorexit 指令释放 monitor 的所有权，并将计数器减 1。
    *   **同步方法：**  在方法的 ACC_SYNCHRONIZED 标志位中设置同步信息。  当线程调用同步方法时，会先尝试获取 monitor 的所有权。

53. synchronized 和 volatile 的区别是什么？
    *   synchronized：既能保证原子性，又能保证可见性。
    *   volatile：只能保证可见性，不能保证原子性。
    *   synchronized 可以修饰方法和代码块，volatile 只能修饰变量。
    *   synchronized 会引起线程阻塞，volatile 不会引起线程阻塞。

54. synchronized 和 Lock 有什么区别？
    *   synchronized：是 Java 的关键字，由 JVM 实现，使用简单，但功能相对有限。
    *   Lock：是一个接口，由 JDK 提供，功能更强大，使用更灵活，但需要手动释放锁。

55. synchronized 和 ReentrantLock 区别是什么？
    *   ReentrantLock 提供了更多的功能，例如：
        *   可重入性：允许同一个线程多次获取同一个锁。
        *   公平锁：可以保证线程按照请求锁的顺序获取锁。
        *   可中断性：允许线程在等待锁的过程中被中断。
        *   可以绑定多个 Condition 对象，实现分组唤醒。
    *   synchronized 是非公平锁，ReentrantLock 默认是非公平锁，但可以设置为公平锁。

56. 说一下 atomic 的原理？
    Atomic 类使用 CAS（Compare and Swap）操作实现原子性。 CAS 是一种无锁算法，通过比较内存中的值与预期值是否相等，如果相等则更新为新值。 如果不相等，则重试。  CAS 操作需要硬件支持，例如 Intel 的 CMPXCHG 指令。

## 四、反射
57. 什么是反射？
    反射是指在运行时动态地获取类的信息（如类名、属性、方法、构造方法等）并操作类的对象的能力。

58. 什么是 java 序列化？什么情况下需要序列化？
    Java 序列化是指将对象转换为字节流的过程，以便可以将其存储到磁盘或通过网络传输。  反序列化是指将字节流转换为对象的过程。
    需要序列化的情况：
    *   将对象存储到磁盘。
    *   通过网络传输对象。
    *   在 RMI（远程方法调用）中传递对象。

59. 动态代理是什么？有哪些应用？
    动态代理是指在运行时动态地生成代理类，而无需手动编写代理类的代码。
    应用：
    *   AOP（面向切面编程）：例如，Spring AOP 使用动态代理实现横切关注点的织入。
    *   RPC（远程过程调用）：例如，Dubbo 使用动态代理实现远程方法的调用。
    *   ORM（对象关系映射）：例如，Hibernate 使用动态代理实现延迟加载。

60. 怎么实现动态代理？
    *   JDK 动态代理：基于接口实现，需要目标类实现接口。
    *   CGLIB 动态代理：基于继承实现，不需要目标类实现接口。

## 五、对象拷贝
61. 为什么要使用克隆？
    克隆可以创建一个与现有对象具有相同状态的新对象，而无需重新初始化对象。

62. 如何实现对象克隆？
    *   实现 `Cloneable` 接口，并重写 `clone()` 方法。
    *   使用序列化和反序列化。

63. 深拷贝和浅拷贝区别是什么？
    *   浅拷贝：只复制对象的基本类型属性和引用类型属性的引用。如果原始对象中的引用类型属性发生改变，克隆对象也会受到影响。
    *   深拷贝：复制对象的所有属性，包括基本类型属性和引用类型属性。对于引用类型属性，会创建一个新的对象，并将原始对象中的引用类型属性的值复制到新对象中。  原始对象和克隆对象互不影响。

## 六、Java Web
64. jsp 和 servlet 有什么区别？
    *   Servlet：是 Java Web 的基础，用于处理客户端的请求并生成动态内容。Servlet 是一种 Java 类，需要手动编写 HTML 代码。
    *   JSP：是 Servlet 的一种简化方式，用于生成动态 HTML 页面。JSP 页面中可以包含 HTML 代码和 Java 代码。 JSP 最终会被编译成 Servlet。

65. jsp 有哪些内置对象？作用分别是什么？
    *   request：HttpServletRequest 对象，代表客户端的请求。
    *   response：HttpServletResponse 对象，代表服务器的响应。
    *   session：HttpSession 对象，代表用户的会话。
    *   application：ServletContext 对象，代表 Web 应用。
    *   out：JspWriter 对象，用于向客户端输出内容。
    *   page：当前 JSP 页面对象（this）。
    *   pageContext：PageContext 对象，代表 JSP 页面的上下文。
    *   config：ServletConfig 对象，代表 Servlet 的配置信息。
    *   exception：Exception 对象，代表 JSP 页面中发生的异常。

66. 说一下 jsp 的 4 种作用域？
    *   page：只在当前 JSP 页面有效。
    *   request：只在当前请求中有效。
    *   session：在当前会话中有效。
    *   application：在整个 Web 应用中有效。

67. session 和 cookie 有什么区别？
    *   Cookie：存储在客户端，用于记录用户的状态信息。
    *   Session：存储在服务器端，用于记录用户的会话信息。
    *   Cookie 的安全性较低，Session 的安全性较高。
    *   Cookie 的大小有限制，Session 的大小没有限制。
    *   Cookie 可以被禁用，Session 不能被禁用。

68. 说一下 session 的工作原理？
    当用户第一次访问 Web 应用时，服务器会创建一个 Session 对象，并生成一个唯一的 Session ID。  服务器会将Session ID 存储在 Cookie 中，发送给客户端。  客户端在以后的请求中，会将 Session ID 携带在 Cookie 中发送给服务器。  服务器根据 Session ID 找到对应的 Session 对象，从而识别用户。

69. 如果客户端禁止 cookie 能实现 session 还能用吗？
    可以。可以使用 URL 重写的方式传递 Session ID。  URL 重写是指将 Session ID 附加到 URL 的末尾，例如：`http://example.com/index.jsp?sessionId=12345`

70. spring mvc 和 struts 的区别是什么？
    *   Spring MVC：基于 Spring 框架，使用更加灵活，易于测试，与 Spring 的其他模块集成更加方便。
    *   Struts：基于 MVC 模式，配置复杂，测试困难。

71. 如何避免 sql 注入？
    *   使用 PreparedStatement 预编译 SQL 语句。
    *   对用户输入进行验证和过滤。
    *   使用存储过程。

72. 什么是 XSS 攻击，如何避免？
    XSS（Cross-Site Scripting）攻击是指攻击者将恶意脚本注入到 Web 页面中，当用户浏览页面时，恶意脚本会被执行，从而窃取用户信息或进行其他恶意操作。
    避免方法：
    *   对用户输入进行 HTML 编码。
    *   对用户输入进行 JavaScript 编码。
    *   使用 Content Security Policy (CSP)。

73. 什么是 CSRF 攻击，如何避免？
    CSRF（Cross-Site Request Forgery）攻击是指攻击者冒充用户发起恶意请求，例如，修改用户的密码、发送邮件等。
    避免方法：
    *   使用 CSRF Token。
    *   验证 HTTP Referer 头部。
    *   使用 SameSite Cookie。

## 七、异常
74. throw 和 throws 的区别？
    *   throw：用于在方法体内部抛出一个异常对象。
    *   throws：用于在方法声明中声明该方法可能抛出的异常类型。

75. final、finally、finalize 有什么区别？
    *   final：用于修饰类、方法和变量，表示类不能被继承、方法不能被重写、变量不能被修改。
    *   finally：用于定义一个代码块，无论是否发生异常，该代码块都会被执行。 通常用于释放资源，例如关闭 IO 流、释放锁等。
    *   finalize：是 Object 类的方法，用于在对象被垃圾回收之前执行一些清理工作。  不建议使用，因为其执行时间和是否执行具有不确定性。

76. try-catch-finally 中哪个部分可以省略？
    *   catch：可以省略，但必须有 finally。
    *   finally：可以省略，但必须有 catch。
    *   try 块是必须的。

77. try-catch-finally 中，如果 catch 中 return 了，finally 还会执行吗？
    会执行。  finally 块会在 catch 块的 return 语句执行之前执行。  如果 finally 块中也有 return 语句，则会覆盖 catch 块的 return 语句。

78. 常见的异常类有哪些？
    *   IOException：IO 异常。
    *   SQLException：SQL 异常。
    *   NullPointerException：空指针异常。
    *   ArrayIndexOutOfBoundsException：数组索引越界异常。
    *   ClassCastException：类型转换异常。
    *   IllegalArgumentException：非法参数异常。
    *   NoSuchMethodException：方法未找到异常。
    *   NoSuchFieldException：字段未找到异常。

## 八、网络
79. http 响应码 301 和 302 代表的是什么？有什么区别？
    *   301 Moved Permanently：永久重定向，表示请求的资源已被永久移动到新的 URL。 浏览器会将 301 重定向缓存起来，以后访问该 URL 会直接跳转到新的 URL。
    *   302 Found：临时重定向，表示请求的资源临时移动到新的 URL。 浏览器不会将 302 重定向缓存起来，每次访问该 URL 都会重新请求服务器。

80. forward 和 redirect 的区别？
    *   Forward（转发）：服务器内部的跳转，客户端只发送一次请求。 地址栏不会改变。
    *   Redirect（重定向）：服务器通知客户端跳转到新的 URL，客户端会发送两次请求。 地址栏会改变。

81. 简述 tcp 和 udp的区别？
    *   TCP（Transmission Control Protocol）：面向连接的、可靠的、基于字节流的传输协议。
    *   UDP（User Datagram Protocol）：面向无连接的、不可靠的、基于数据报的传输协议。

82. tcp 为什么要三次握手，两次不行吗？为什么？
    三次握手是为了防止已失效的连接请求报文段突然又传送到服务器，因而产生错误。
    *   第一次握手：客户端发送 SYN 报文给服务器，请求建立连接。
    *   第二次握手：服务器收到 SYN 报文后，发送 SYN+ACK 报文给客户端，表示同意建立连接。
    *   第三次握手：客户端收到 SYN+ACK 报文后，发送 ACK 报文给服务器，表示连接建立完成。
    如果只有两次握手，可能出现以下情况：客户端发送的第一个 SYN 报文由于网络拥堵等原因延迟到达服务器，此时连接已经关闭。  但是，当这个 SYN 报文到达服务器时，服务器会认为客户端要建立连接，发送 SYN+ACK 报文给客户端。  由于客户端没有发送 SYN 报文，不会理会服务器的 SYN+ACK 报文，导致服务器一直等待客户端的 ACK 报文，浪费资源。

83. 说一下 tcp 粘包是怎么产生的？
    TCP 粘包是指多个 TCP 数据包被合并成一个数据包发送。
    产生原因：
    *   TCP 是面向字节流的协议，没有消息边界。
    *   发送方的 TCP 缓冲区满了，会将多个小的数据包合并成一个大的数据包发送。
    *   接收方的 TCP 缓冲区满了，会将多个小的数据包合并成一个大的数据包接收。

84. OSI 的七层模型都有哪些？
    *   应用层（Application Layer）
    *   表示层（Presentation Layer）
    *   会话层（Session Layer）
    *   传输层（Transport Layer）
    *   网络层（Network Layer）
    *   数据链路层（Data Link Layer）
    *   物理层（Physical Layer）

85. get 和 post 请求有哪些区别？
    *   GET：用于获取资源，参数通过 URL 传递，长度有限制，安全性较低。
    *   POST：用于提交数据，参数通过请求体传递，长度没有限制，安全性较高。
    *   GET 请求是幂等的，POST 请求不是幂等的。  幂等是指多次执行相同的操作，结果都是相同的。

86. 如何实现跨域？
    跨域是指浏览器禁止 JavaScript 访问不同源的资源。  源由协议、域名和端口号组成。
    实现方法：
    *   JSONP：只支持 GET 请求。
    *   CORS（Cross-Origin Resource Sharing）：服务器设置 `Access-Control-Allow-Origin` 响应头。
    *   代理服务器：客户端请求同源的代理服务器，代理服务器再请求目标服务器。
    *   Nginx 反向代理。

87. 说一下 JSONP 实现原理？
    JSONP 利用 `<script>` 标签可以跨域加载资源的特性实现跨域请求。
    *   客户端定义一个回调函数。
    *   客户端创建一个 `<script>` 标签，将回调函数名作为参数添加到 URL 中。
    *   客户端将 `<script>` 标签添加到页面中。
    *   服务器接收到请求后，将数据封装成 JavaScript 代码，调用客户端的回调函数。
    *   客户端执行 JavaScript 代码，获取数据。

## 九、设计模式
88. 说一下你熟悉的设计模式？
    （这里列举一些常见的设计模式，您可以根据自己的了解进行补充）
    *   单例模式（Singleton Pattern）：保证一个类只有一个实例，并提供一个全局访问点。
    *   工厂模式（Factory Pattern）：定义一个创建对象的接口，让子类决定实例化哪个类。
    *   抽象工厂模式（Abstract Factory Pattern）：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。
    *   建造者模式（Builder Pattern）：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。
    *   原型模式（Prototype Pattern）：通过复制现有对象来创建新对象。
    *   适配器模式（Adapter Pattern）：将一个类的接口转换成客户希望的另外一个接口。
    *   桥接模式（Bridge Pattern）：将抽象部分与它的实现部分分离，使它们都可以独立地变化。
    *   组合模式（Composite Pattern）：将对象组合成树形结构以表示“部分-整体”的层次结构。
    *   装饰器模式（Decorator Pattern）：动态地给一个对象添加一些额外的职责。
    *   外观模式（Facade Pattern）：为子系统中的一组接口提供一个一致的界面。
    *   享元模式（Flyweight Pattern）：运用共享技术有效地支持大量细粒度的对象。
    *   代理模式（Proxy Pattern）：为其他对象提供一种代理以控制对这个对象的访问。
    *   责任链模式（Chain of Responsibility Pattern）：将请求的发送者和接收者解耦，使多个对象都有机会处理这个请求。
    *   命令模式（Command Pattern）：将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化。
    *   迭代器模式（Iterator Pattern）：提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
    *   中介者模式（Mediator Pattern）：用一个中介对象来封装一系列的对象交互。
    *   备忘录模式（Memento Pattern）：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。
    *   观察者模式（Observer Pattern）：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。
    *   状态模式（State Pattern）：允许一个对象在其内部状态改变时改变它的行为。
    *   策略模式（Strategy Pattern）：定义一系列的算法,把它们一个个封装起来, 并且使它们可以相互替换。
    *   模板方法模式（Template Method Pattern）：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。
    *   访问者模式（Visitor Pattern）：表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。

89. 简单工厂和抽象工厂有什么区别？
    *   简单工厂模式：一个工厂类根据客户端的参数创建不同类的实例。客户端需要知道工厂类和产品类的名称。
    *   抽象工厂模式：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。抽象工厂模式将简单工厂模式进行了抽象，可以创建多个产品族。

## 十、Spring/Spring MVC
90. 为什么要使用 spring？
    *   简化 Java EE 开发：Spring 提供了 IoC 容器和 AOP 等功能，可以简化 Java EE 应用的开发。
    *   提高代码的可测试性：Spring 的 IoC 容器使得组件之间的依赖关系可以被管理和注入，从而方便进行单元测试。
    *   提供事务管理：Spring 提供了声明式事务管理，可以简化事务管理的配置。
    *   与其他框架集成：Spring 可以与 Hibernate、MyBatis 等 ORM 框架集成。

91. 解释一下什么是 aop？
    *   AOP（Aspect-Oriented Programming，面向切面编程）是一种编程范式，允许将横切关注点（例如日志记录、性能监控、安全控制等）从核心业务逻辑中分离出来。  AOP 通过在程序运行时动态地将横切关注点织入到核心业务逻辑中，从而提高代码的模块化程度和可维护性。

92. 解释一下什么是 ioc？
    *   IoC（Inversion of Control，控制反转）是一种设计思想，将对象的创建和依赖关系的管理交给 IoC 容器，而不是由对象自身负责。 IoC 容器负责创建对象、管理对象的生命周期、以及注入对象之间的依赖关系。  IoC 的目的是解耦组件之间的依赖关系，提高代码的灵活性和可维护性。

93. spring 有哪些主要模块？
    *   Core Container：核心容器，提供 IoC 和依赖注入功能。
    *   AOP：面向切面编程。
    *   Data Access/Integration：数据访问和集成，包括 JDBC、ORM、事务管理等。
    *   Web：提供 Web 开发的支持，包括 Spring MVC。
    *   Messaging：提供消息传递的支持。
    *   Test：提供测试支持。

94. spring 常用的注入方式有哪些？
    *   构造器注入：通过构造方法注入依赖。
    *   Setter 注入：通过 Setter 方法注入依赖。
    *   字段注入（@Autowired）：通过 @Autowired 注解注入依赖。

95. spring 中的 bean 是线程安全的吗？
    *   Spring Bean 默认是单例的，如果 Bean 中存在共享的可变状态，则不是线程安全的。 可以通过改变 Bean 的作用域来解决线程安全问题，例如将 Bean 的作用域设置为 prototype。

96. spring 支持几种 bean 的作用域？
    *   singleton：单例，在 IoC 容器中只存在一个实例。
    *   prototype：原型，每次获取 Bean 时都会创建一个新的实例。
    *   request：每次 HTTP 请求创建一个实例，只在当前请求中有效。
    *   session：每次 HTTP 会话创建一个实例，只在当前会话中有效。
    *   application：在整个 Web 应用中创建一个实例，只在当前应用中有效。
    *   websocket: 每次 WebSocket 会话创建一个实例。

97. spring 自动装配 bean 有哪些方式？
    *   no：不进行自动装配，需要显式地指定依赖关系。
    *   byName：根据 Bean 的名称进行自动装配。
    *   byType：根据 Bean 的类型进行自动装配。
    *   constructor：根据构造方法的参数类型进行自动装配。
    *   autodetect：自动检测，首先尝试使用 constructor 方式进行自动装配，如果失败则尝试使用 byType 方式进行自动装配。

98. spring 事务实现方式有哪些？
    *   编程式事务：通过 TransactionTemplate 或 PlatformTransactionManager 手动控制事务的开始、提交和回滚。
    *   声明式事务：通过 @Transactional 注解或 XML 配置声明事务。

99. 说一下 spring 的事务隔离？
    *   TransactionDefinition.ISOLATION_DEFAULT：使用数据库默认的隔离级别。
    *   TransactionDefinition.ISOLATION_READ_UNCOMMITTED：读未提交，最低的隔离级别，可能出现脏读、不可重复读和幻读。
    *   TransactionDefinition.ISOLATION_READ_COMMITTED：读已提交，可以避免脏读，但可能出现不可重复读和幻读。
    *   TransactionDefinition.ISOLATION_REPEATABLE_READ：可重复读，可以避免脏读和不可重复读，但可能出现幻读。
    *   TransactionDefinition.ISOLATION_SERIALIZABLE：串行化，最高的隔离级别，可以避免所有并发问题。

100. 说一下 spring mvc 运行流程？
```
    1.  客户端发送请求到 DispatcherServlet。
    2.  DispatcherServlet 接收到请求后，调用 HandlerMapping 查找 Handler。
    3.  HandlerMapping 找到 Handler 后，返回 HandlerExecutionChain。
    4.  DispatcherServlet 调用 HandlerAdapter 执行 Handler。
    5.  Handler 执行完成后，返回 ModelAndView 对象。
    6.  HandlerAdapter 将 ModelAndView 对象返回给 DispatcherServlet。
    7.  DispatcherServlet 调用 ViewResolver 解析 View。
    8.  ViewResolver 解析完成后，返回 View 对象。
    9.  DispatcherServlet 使用 View 对象渲染视图，将结果返回给客户端。
```
101. spring mvc 有哪些组件？
    *   DispatcherServlet：前端控制器，负责接收请求、调度 Handler 和渲染视图。
    *   HandlerMapping：处理器映射器，负责查找 Handler。
    *   HandlerAdapter：处理器适配器，负责执行 Handler。
    *   ViewResolver：视图解析器，负责解析 View。
    *   View：视图对象，负责渲染视图。

102. @RequestMapping 的作用是什么？
    *   @RequestMapping 用于将 HTTP 请求映射到 Controller 中的方法。 可以指定请求的 URL、HTTP 方法、请求头、请求参数等。

103. @Autowired 的作用是什么？
    *   @Autowired 用于自动装配 Bean。 Spring IoC 容器会根据 Bean 的类型或名称自动将依赖注入到被 @Autowired 注解的字段、Setter 方法或构造方法中。

## 十一、Spring Boot/Spring Cloud
104. 什么是 spring boot？
    *   Spring Boot 是一个快速开发 Spring 应用的框架。 它通过自动配置和起步依赖简化了 Spring 应用的配置过程，使得开发者可以专注于业务逻辑的开发。

105. 为什么要用 spring boot？
    *   简化 Spring 应用的配置。
    *   提供自动配置功能。
    *   提供起步依赖，简化依赖管理。
    *   内嵌 Web 容器，无需手动部署。
    *   快速开发，提高效率。

106. spring boot 核心配置文件是什么？
    *   `application.properties` 或 `application.yml`。

107. spring boot 配置文件有哪几种类型？它们有什么区别？
    *   `.properties`：键值对形式，简单易懂。
    *   `.yml`：YAML 格式，层次结构清晰，可读性更好。

108. spring boot 有哪些方式可以实现热部署？
    *   使用 Spring Boot DevTools。
    *   使用 JRebel。

109. jpa 和 hibernate 有什么区别？
    *   JPA（Java Persistence API）是 Java 持久化规范，定义了一组接口和注解，用于访问关系数据库。
    *   Hibernate 是 JPA 的一种实现，提供了 JPA 规范的具体实现。

110. 什么是 spring cloud？
    Spring Cloud 是一个基于 Spring Boot 的微服务框架。 它提供了一系列组件，用于构建分布式系统，例如服务注册与发现、配置管理、服务网关、负载均衡、断路器等。

111. spring cloud 断路器的作用是什么？
    Spring Cloud 断路器用于防止服务雪崩。 当一个服务出现故障时，断路器会阻止对该服务的调用，避免故障蔓延到其他服务。

112. spring cloud 的核心组件有哪些？
    *   Eureka：服务注册与发现。
    *   Config：配置管理。
    *   Zuul/Gateway: 服务网关。
    *   Ribbon/LoadBalancer：负载均衡。
    *   Hystrix/Resilience4J：断路器。
    *   Feign：声明式 HTTP 客户端。
    *   Sleuth：链路追踪。
    *   Zipkin：分布式追踪系统。

## 十二、Hibernate
113. 为什么要使用 hibernate？
    *   简化 JDBC 编程。
    *   提供 ORM 功能，将对象映射到关系数据库。
    *   提供事务管理。
    *   提高开发效率。

114. 什么是 ORM 框架？
    ORM（Object-Relational Mapping，对象关系映射）框架是一种将对象模型和关系数据库进行映射的工具。 它允许开发者使用面向对象的方式操作数据库，而无需编写 SQL 语句。

115. hibernate 中如何在控制台查看打印的 sql 语句？
    在 Hibernate 的配置文件中设置 `show_sql` 属性为 `true`。

116. hibernate 有几种查询方式？
    *   HQL（Hibernate Query Language）查询。
    *   Criteria 查询。
    *   Native SQL 查询。
    *   Named Query 查询.

117. hibernate 实体类可以被定义为 final 吗？
    不建议。  Hibernate 使用代理模式实现延迟加载，如果实体类被定义为 final，则无法创建代理类。

118. 在 hibernate 中使用 Integer 和 int 做映射有什么区别？
    *   int：基本类型，不能为 null。
    *   Integer：包装类型，可以为 null。  如果数据库字段允许为 null，则建议使用 Integer。

119. hibernate 是如何工作的？
    1.  加载 Hibernate 配置文件。
    2.  创建 SessionFactory 对象。
    3.  创建 Session 对象。
    4.  开启事务。
    5.  执行数据库操作。
    6.  提交或回滚事务。
    7.  关闭 Session 对象。
    8.  关闭 SessionFactory 对象。

120. get()和 load()的区别？
    *   get()：立即从数据库中加载对象，如果对象不存在则返回 null。
    *   load()：延迟加载对象，返回一个代理对象，只有在访问对象的属性时才会从数据库中加载对象。  如果对象不存在，则抛出 ObjectNotFoundException 异常。

121. 说一下 hibernate 的缓存机制？
    Hibernate 提供了两级缓存：
    *   一级缓存（Session 缓存）：Session 级别的缓存，每个 Session 对象
        都有一个独立的缓存。
    *   二级缓存（SessionFactory 缓存）：SessionFactory 级别的缓存，所有 Session 对象共享一个缓存。  二级缓存可以配置不同的缓存策略，例如 EHCache、Memcached 等。

122. hibernate 对象有哪些状态？
    *   瞬时态（Transient）：对象未与 Session 关联。
    *   持久态（Persistent）：对象与 Session 关联，并且被 Session 缓存。
    *   脱管态（Detached）：对象之前与 Session 关联，但现在已脱离 Session。

123. 在 hibernate 中 getCurrentSession 和 openSession 的区别是什么？
    *   getCurrentSession：从当前线程中获取 Session 对象，如果没有则创建一个新的 Session 对象并绑定到当前线程。  需要配置 `hibernate.current_session_context_class` 属性。
    *   openSession：每次都创建一个新的 Session 对象。

124. hibernate 实体类必须要有无参构造函数吗？为什么？
    必须要有无参构造函数。  Hibernate 使用反射创建对象，需要调用无参构造函数。

## 十三、Mybatis
125. mybatis 中 #{}和 ${}的区别是什么？
    *   `#{}`：使用 PreparedStatement 预编译 SQL 语句，可以防止 SQL 注入。  会将参数值作为字符串传递给数据库。
    *   `${}`：直接将参数值拼接到 SQL 语句中，存在 SQL 注入的风险。  会将参数值直接替换到 SQL 语句中。

126. mybatis 有几种分页方式？
    *   使用 RowBounds 进行内存分页。
    *   使用分页插件进行物理分页。

127. RowBounds 是一次性查询全部结果吗？为什么？
    是。  RowBounds 只是在内存中对查询结果进行分页，而不是在数据库中进行分页。

128. mybatis 逻辑分页和物理分页的区别是什么？
    *   逻辑分页：在内存中对查询结果进行分页。
    *   物理分页：在数据库中进行分页，只查询需要的数据。

129. mybatis 是否支持延迟加载？延迟加载的原理是什么？
    支持。  延迟加载是指在需要使用对象的时候才从数据库中加载对象。  MyBatis 通过 CGLIB 动态代理实现延迟加载。  当访问对象的属性时，会触发代理对象去数据库中加载数据。

130. 说一下 mybatis 的一级缓存和二级缓存？
    *   一级缓存（Session 缓存）：Session 级别的缓存，每个 Session 对象都有一个独立的缓存。
    *   二级缓存（SessionFactory 缓存）：SessionFactory 级别的缓存，所有 Session 对象共享一个缓存。  二级缓存需要手动开启。

131. mybatis 和 hibernate 的区别有哪些？
    *   MyBatis：半自动 ORM 框架，需要手动编写 SQL 语句，灵活性高。
    *   Hibernate：全自动 ORM 框架，无需编写 SQL 语句，开发效率高。
    *   MyBatis 更轻量级，Hibernate 更重量级。
    *   MyBatis 的学习成本较低，Hibernate 的学习成本较高。

132. mybatis 有哪些执行器（Executor）？
    *   SimpleExecutor：简单的执行器，每次执行 SQL 语句都会创建一个新的 Statement 对象。
    *   ReuseExecutor：可重用的执行器，会缓存 Statement 对象，提高执行效率。
    *   BatchExecutor：批处理执行器，可以将多个 SQL 语句批量执行。

133. mybatis 分页插件的实现原理是什么？
    MyBatis 分页插件通过拦截 Executor 的 query 方法，修改 SQL 语句，添加分页参数。

134. mybatis 如何编写一个自定义插件？
    1.  实现 Interceptor 接口。
    2.  使用 @Intercepts 注解指定要拦截的方法。
    3.  在 plugin 方法中返回 Plugin.wrap(target, this)。
    4.  在 MyBatis 的配置文件中配置插件。

## 十四、RabbitMQ
135. rabbitmq 的使用场景有哪些？
    *   异步处理：将耗时操作放入消息队列，异步执行。
    *   应用解耦：各个应用之间通过消息队列进行通信，降低耦合度。
    *   流量削峰：在高并发场景下，将请求放入消息队列，缓解服务器压力。
    *   日志收集：将日志信息放入消息队列，集中处理。

136. rabbitmq 有哪些重要的角色？
    *   Producer：消息生产者。
    *   Exchange：交换机，负责接收消息并路由到队列。
    *   Queue：队列，负责存储消息。
    *   Binding：绑定，定义交换机和队列之间的关系。
    *   Consumer：消息消费者。

137. rabbitmq 有哪些重要的组件？
    *   ConnectionFactory：连接工厂，用于创建连接。
    *   Connection：连接，用于与 RabbitMQ 服务器建立连接。
    *   Channel：通道，用于执行 RabbitMQ 操作。
    *   Exchange：交换机。
    *   Queue：队列。
    *   Binding：绑定。

138. rabbitmq 中 vhost 的作用是什么？
    *   vhost（Virtual Host，虚拟主机）用于隔离不同的用户和应用。  每个 vhost 都有独立的交换机、队列和绑定关系。

139. rabbitmq 的消息是怎么发送的？
    *  Producer 将消息发送到 Exchange。
    *  Exchange 根据 Binding 规则将消息路由到一个或多个 Queue。
    *  Consumer 从 Queue 中接收消息。

140. rabbitmq 怎么保证消息的稳定性？
    *   消息持久化：将消息存储到磁盘上，防止 RabbitMQ 服务器重启后消息丢失。
    *   ACK 机制：Consumer 成功处理消息后，向 RabbitMQ 服务器发送 ACK 确认，RabbitMQ 服务器才会从队列中删除消息。
    *   镜像队列：在多个节点上创建相同的队列，提高可用性。

141. rabbitmq 怎么避免消息丢失？
    *   Producer 确认：Producer 开启事务或使用 Publisher Confirm 机制，确保消息成功发送到 RabbitMQ 服务器。
    *   消息持久化。
    *   ACK 机制。
    *   Exchange 和 Queue 持久化。

142. 要保证消息持久化成功的条件有哪些？
    *   Exchange 持久化。
    *   Queue 持久化。
    *   Message 持久化。

143. rabbitmq 持久化有什么缺点？
    *   降低性能。

144. rabbitmq 有几种广播类型？
    *   Fanout：将消息广播到所有绑定的队列。
    *   Direct：将消息路由到 Binding Key 匹配的队列。
    *   Topic：将消息路由到 Routing Key 匹配的队列，可以使用通配符。
    *   Headers：根据消息头的属性进行路由。

145. rabbitmq 怎么实现延迟消息队列？
    *   使用 RabbitMQ 的 TTL（Time-To-Live）和 DLX（Dead Letter Exchange）机制。
    *   将消息发送到一个设置了 TTL 的队列中，当消息过期后，RabbitMQ 会将消息发送到 DLX。
    *   创建一个 DLX 绑定的队列，Consumer 从该队列中接收消息。

146. rabbitmq 集群有什么用？
    *   提高可用性。
    *   提高吞吐量。

147. rabbitmq 节点的类型有哪些？
    *   Disk Node：将队列信息存储到磁盘上。
    *   RAM Node：将队列信息存储到内存中。

148. rabbitmq 集群搭建需要注意哪些问题？
    *   所有节点必须使用相同的 Erlang Cookie。
    *   节点之间的时间必须同步。
    *   确保节点之间的网络连接正常。

149. rabbitmq 每个节点是其他节点的完整拷贝吗？为什么？
    *   不是。 只有 Disk Node 会存储完整的队列信息，RAM Node 只存储部分队列信息。

150. rabbitmq 集群中唯一一个磁盘节点崩溃了会发生什么情况？
    *   集群可以继续运行，但是无法创建新的队列和交换机。

151. rabbitmq 对集群节点停止顺序有要求吗？
    *   建议先停止 RAM Node，再停止 Disk Node。



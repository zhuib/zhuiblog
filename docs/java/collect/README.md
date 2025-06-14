---
title: 集合
date: 2020-12-11 11:15:53
permalink: /java/collect
categories:
  - 后端
tags:
  - 集合
author: zhuib
---

## 集合
## Java 集合知识点 & 面试题

## 一、集合框架概述

Java 集合框架提供了一组接口和类，用于存储和操作数据。它主要分为 Collection 和 Map 两个根接口。

*   **Collection**:  代表一组对象。
    *   **List**: 有序、可重复的集合。
    *   **Set**: 无序、不可重复的集合。
    *   **Queue**: 队列，先进先出。
*   **Map**: 键值对的集合。

## 二、主要集合类

### 1. List

*   **ArrayList**:  基于动态数组实现，查询快，增删慢，线程不安全。
*   **LinkedList**: 基于链表实现，查询慢，增删快，线程不安全。
*   **Vector**:  基于动态数组实现，线程安全，但效率较低 (已过时，不推荐使用)。

### 2. Set

*   **HashSet**:  基于 HashMap 实现，无序、不可重复，允许 null 值。
*   **LinkedHashSet**:  基于 LinkedHashMap 实现，保持插入顺序的 HashSet。
*   **TreeSet**:  基于 TreeMap 实现，可排序的 Set，默认自然排序，也可自定义排序。

### 3. Queue

*   **LinkedList**:  实现了 Queue 接口，可以作为队列使用。
*   **PriorityQueue**:  优先级队列，基于堆实现，可以自定义优先级。

### 4. Map

*   **HashMap**:  基于哈希表实现，无序，允许一个 null 键和多个 null 值，线程不安全。
*   **LinkedHashMap**:  基于 HashMap 实现，保持插入顺序的 HashMap。
*   **TreeMap**:  基于红黑树实现，可排序的 Map，默认键自然排序，也可自定义排序。
*   **Hashtable**:  基于哈希表实现，线程安全，不允许 null 键和 null 值 (已过时，不推荐使用)。
*   **ConcurrentHashMap**: 线程安全的 HashMap，使用分段锁技术提高并发性能。

## 三、集合类的选择

*   **需要线程安全**:  `ConcurrentHashMap`,  `CopyOnWriteArrayList`,  `CopyOnWriteArraySet`。
*   **需要排序**:  `TreeMap`,  `TreeSet`。
*   **需要保持插入顺序**:  `LinkedHashMap`,  `LinkedHashSet`。
*   **查询多**:  `ArrayList`,  `HashMap`。
*   **增删多**:  `LinkedList`。

## 四、常见面试题及答案

### 1. ArrayList 和 LinkedList 的区别？

**答案：**

| 特性     | ArrayList                                  | LinkedList                                 |
| -------- | ------------------------------------------ | ----------------------------------------- |
| 底层数据结构 | 动态数组                                   | 双向链表                                  |
| 查找效率   | 高 (通过索引直接访问)                          | 低 (需要从头/尾遍历)                         |
| 增删效率   | 低 (涉及到元素的移动，特别是中间位置增删)       | 高 (只需要修改指针)                        |
| 内存占用   | 相对较小 (数组连续存储)                        | 相对较大 (需要存储前后指针)                     |
| 适用场景   | 查找操作多，增删操作少的场景                   | 增删操作多，查找操作少的场景                  |

### 2. HashMap 的底层实现原理？

**答案：**

HashMap 基于哈希表实现。

1.  **数据结构**:  数组 + 链表 (或红黑树)。  数组是 HashMap 的主体，链表/红黑树是为了解决哈希冲突而存在的。
2.  **哈希函数**:  当 put(key, value) 时，首先通过 key 的 hashCode() 方法计算 key 的哈希值，然后通过某种算法 (例如：(n - 1) & hash，n 为数组长度) 得到数组下标。
3.  **哈希冲突**:  如果不同的 key 计算出的数组下标相同，就发生了哈希冲突。
    *   **链地址法**:  将相同下标的 key-value 键值对组成一个链表，放在该下标对应的数组位置。
    *   **红黑树**:  当链表长度超过一定阈值 (默认为 8) 时，将链表转换为红黑树，以提高查找效率。
4.  **扩容**:  当 HashMap 中的元素个数超过负载因子 (loadFactor，默认为 0.75) 乘以数组长度时，就会进行扩容。 扩容会将数组长度变为原来的两倍，然后重新计算所有 key 的哈希值，并将元素放到新的数组位置上。  扩容是一个非常耗时的操作。

### 3. HashMap 和 Hashtable 的区别？

**答案：**

| 特性         | HashMap                                | Hashtable                               |
| ------------ | -------------------------------------- | --------------------------------------- |
| 线程安全     | 线程不安全                             | 线程安全 (使用 synchronized 关键字)        |
| 是否允许 null | 允许 null 键和 null 值                | 不允许 null 键和 null 值               |
| 继承关系     | 继承自 AbstractMap                      | 继承自 Dictionary                       |
| 初始容量和扩容 | 初始容量为 16，扩容时变为原来的 2 倍           | 初始容量为 11，扩容时变为原来的 2 倍 + 1    |
| hash算法     | 扰动函数更多，减少哈希冲突概率             | 直接使用 key 的 hashCode()               |
| 推荐使用     | 推荐使用，可以通过 Collections.synchronizedMap() 实现线程安全 | 不推荐使用，已被 ConcurrentHashMap 替代 |

### 4. ConcurrentHashMap 的实现原理？

**答案：**

ConcurrentHashMap 是线程安全的 HashMap。 在 JDK 1.7 和 JDK 1.8 中实现方式有所不同：

*   **JDK 1.7**:
    *   **分段锁 (Segment)**: ConcurrentHashMap 将数据分成一段一段存储，每一段数据配一把锁，当多个线程访问不同段的数据时，就不会产生锁竞争，从而提高并发效率。
    *   **Segment 继承自 ReentrantLock**:  每个 Segment 相当于一个小的 HashMap。
*   **JDK 1.8**:
    *   **CAS + synchronized**:  取消了 Segment 的概念，直接在数组的节点上使用 CAS 算法进行修改， 减少了内存占用。
    *   **synchronized 只锁定当前链表或红黑树的首节点**: 降低了锁的粒度。
    *   **引入红黑树**: 当链表长度超过一定阈值时，将链表转换为红黑树，提高查找效率。

### 5. Set 集合如何保证元素不重复？

**答案：**

*   **HashSet**:  通过 hashCode() 和 equals() 方法来保证元素不重复。  首先比较 hashCode() 值，如果 hashCode() 值不同，则认为不是同一个对象；如果 hashCode() 值相同，则继续比较 equals() 方法，如果 equals() 方法返回 true，则认为是同一个对象，否则不是同一个对象。
*   **TreeSet**:  通过 Comparable 接口或 Comparator 接口来保证元素不重复。  如果实现了 Comparable 接口，则按照 compareTo() 方法的返回值进行比较；如果使用了 Comparator 接口，则按照 compare() 方法的返回值进行比较。

### 6. 如何选择集合类？

**答案：**

1.  **是否需要线程安全？**  如果需要线程安全，则选择 `ConcurrentHashMap`, `CopyOnWriteArrayList`, `CopyOnWriteArraySet`。
2.  **是否需要排序？**  如果需要排序，则选择 `TreeMap`, `TreeSet`。
3.  **是否需要保持插入顺序？**  如果需要保持插入顺序，则选择 `LinkedHashMap`, `LinkedHashSet`。
4.  **主要操作是什么？**  如果是查找操作多，则选择 `ArrayList`, `HashMap`；如果是增删操作多，则选择 `LinkedList`。
5.  **是否允许 null 值？** 如果不允许 null 值，则避免使用 HashMap (Hashtable 不推荐使用)。

### 7. Collections 工具类有哪些常用的方法？

**答案：**

Collections 工具类提供了一系列静态方法，用于操作集合。 常用的方法包括：

*   `sort()`:  对 List 集合进行排序。
*   `shuffle()`:  对 List 集合进行随机排序。
*   `reverse()`:  反转 List 集合中的元素顺序。
*   `copy()`:  将一个 List 集合复制到另一个 List 集合中。
*   `binarySearch()`:  在 List 集合中进行二分查找。
*   `synchronizedList()`, `synchronizedSet()`, `synchronizedMap()`:  将 List, Set, Map 转换为线程安全的集合。
*   `unmodifiableList()`, `unmodifiableSet()`, `unmodifiableMap()`:  将 List, Set, Map 转换为不可修改的集合。

### 8. 什么是迭代器 (Iterator)？

**答案：**

迭代器是一种设计模式，提供了一种统一的访问集合元素的接口，而不需要暴露集合的内部结构。 通过迭代器，可以遍历 List, Set, Map 等集合。

*   **常用方法**:
    *   `hasNext()`:  判断是否还有下一个元素。
    *   `next()`:  返回下一个元素。
    *   `remove()`:  从集合中移除迭代器返回的最后一个元素 (可选操作)。

### 9. 什么是 fail-fast 和 fail-safe？

**答案：**

*   **fail-fast**:  快速失败。  当多个线程同时修改集合时，如果检测到有其他线程正在修改集合，则立即抛出 `ConcurrentModificationException` 异常。  `ArrayList`, `HashMap` 等是非线程安全的，采用 fail-fast 机制。
*   **fail-safe**:  安全失败。  当多个线程同时修改集合时，不会抛出异常，而是创建一个集合的副本，并在副本上进行操作。  `CopyOnWriteArrayList`, `ConcurrentHashMap` 等是线程安全的，采用 fail-safe 机制。

**区别：**

*   fail-fast 能够及时发现问题，但可能会导致程序中断。
*   fail-safe 允许并发修改，但可能会导致数据不一致。

### 10. 如何使用 Stream API 对集合进行操作？

**答案：**

Stream API 是 Java 8 引入的，提供了一种函数式编程的方式来操作集合。  常用的操作包括：

*   `filter()`:  过滤元素。
*   `map()`:  将元素转换为另一种类型。
*   `flatMap()`:  将多个 Stream 合并成一个 Stream。
*   `sorted()`:  对元素进行排序。
*   `distinct()`:  去除重复元素。
*   `limit()`:  限制元素个数。
*   `skip()`:  跳过指定个数的元素。
*   `forEach()`:  遍历元素。
*   `collect()`:  将 Stream 转换为集合。
*   `reduce()`:  将元素聚合成一个值。

**示例：**

```java
List<String> list = Arrays.asList("a", "b", "c", "a");

// 过滤掉 "a" 元素，并转换为大写，然后去重，最后输出
list.stream()
    .filter(s -> !s.equals("a"))
    .map(String::toUpperCase)
    .distinct()
    .forEach(System.out::println); // 输出： B, C

// 将 List 转换为 Set
Set<String> set = list.stream().collect(Collectors.toSet());

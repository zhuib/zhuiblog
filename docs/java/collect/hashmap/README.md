---
title: hashMap
date: 2020-12-11 11:15:53
permalink: /java/collect/hashmap
categories:
  - 后端
tags:
  - 集合
author: zhuib
---

## HashMap 知识体系

## 一、HashMap 概述

`HashMap` 是 Java 中最常用的集合类之一，它实现了 `Map` 接口，用于存储键值对（key-value pairs）。`HashMap` 基于哈希表（hash table）实现，提供了快速的插入、删除和查找操作。

**关键特性：**

*   **键值对存储：** 存储键值对，key 和 value 都可以是 `null` (key 只能有一个 null)。
*   **无序性：** 默认情况下，`HashMap` 中的元素是无序的（不保证元素的顺序）。
*   **允许 `null`：** 允许 key 为 `null` (只能有一个)，value 可以为 `null`。
*   **非线程安全：** `HashMap` 不是线程安全的，如果需要在多线程环境中使用，可以考虑使用 `ConcurrentHashMap`。
*   **哈希表实现：** 基于哈希表实现，通过哈希函数将 key 映射到哈希表中的一个位置。
*   **平均时间复杂度 O(1)：** 在理想情况下，`get`、`put`、`remove` 等操作的平均时间复杂度为 O(1)。
*   **容量与负载因子：**  容量（capacity）是哈希表中桶的数量，负载因子（load factor）是衡量哈希表填充程度的指标。当哈希表中的元素数量超过容量与负载因子的乘积时，会进行扩容（resize）。
*   **解决哈希冲突：** 使用链表或红黑树来解决哈希冲突（collision）。

## 二、HashMap 核心概念

*   **哈希函数 (Hash Function)：** 用于将 key 转换为哈希码（hash code），哈希码是一个整数，用于确定 key 在哈希表中的位置。好的哈希函数应该尽可能地减少哈希冲突。
*   **桶 (Bucket)：** 哈希表中的一个存储位置，用于存储具有相同哈希码的元素。
*   **哈希冲突 (Collision)：** 当两个或多个 key 具有相同的哈希码时，就会发生哈希冲突。
*   **链地址法 (Separate Chaining)：** 一种解决哈希冲突的方法，将具有相同哈希码的元素存储在同一个桶的链表中。
*   **红黑树 (Red-Black Tree)：** 一种自平衡的二叉查找树，用于在链表长度超过一定阈值时，将链表转换为红黑树，以提高查找效率。
*   **容量 (Capacity)：** HashMap 中桶的数量，初始容量默认为 16。
*   **负载因子 (Load Factor)：** 衡量 HashMap 填充程度的指标，默认值为 0.75。
*   **阈值 (Threshold)：**  容量 * 负载因子，当 HashMap 中元素数量超过阈值时，会进行扩容。
*   **扩容 (Resize)：**  扩展 HashMap 的容量，创建一个新的更大的哈希表，并将所有元素重新哈希到新的哈希表中。 这通常是一个非常耗时的操作。

## 三、HashMap 源码分析 (JDK 8)

*   **数据结构：**  数组 + 链表/红黑树
    ```java
    transient Node<K,V>[] table; // 存储键值对的数组
    ```
    ```java
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash; // key 的哈希码
        final K key;
        V value;
        Node<K,V> next; // 指向下一个节点的指针 (用于解决哈希冲突)
        ...
    }
    ```
*   **构造函数：**
    ```java
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
    }

    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity); // threshold  总是 2 的幂
    }
    ```
*   **`put(K key, V value)` 方法：**
    1.  计算 key 的哈希码。
    2.  根据哈希码确定 key 在哈希表中的位置（桶）。
    3.  如果桶为空，则创建一个新的节点并放入桶中。
    4.  如果桶不为空，则遍历桶中的链表或红黑树：
        *   如果找到具有相同 key 的节点，则更新该节点的 value。
        *   如果没有找到具有相同 key 的节点，则在链表末尾添加一个新的节点（或在红黑树中插入一个新的节点）。
    5.  如果 HashMap 中的元素数量超过阈值，则进行扩容。
*   **`get(Object key)` 方法：**
    1.  计算 key 的哈希码。
    2.  根据哈希码确定 key 在哈希表中的位置（桶）。
    3.  如果桶为空，则返回 `null`。
    4.  如果桶不为空，则遍历桶中的链表或红黑树：
        *   如果找到具有相同 key 的节点，则返回该节点的 value。
        *   如果没有找到具有相同 key 的节点，则返回 `null`。
*   **`resize()` 方法：**
    1.  创建一个新的更大的哈希表。 新的容量是旧容量的两倍。
    2.  将所有元素重新哈希到新的哈希表中。

* **树化阈值与解除树化阈值:**
   *  `static final int TREEIFY_THRESHOLD = 8;`  当链表长度达到 8 时，且数组长度达到 64， 链表会尝试转化为红黑树。
   *  `static final int UNTREEIFY_THRESHOLD = 6;`  当红黑树中的节点少于 6 个时，红黑树会转换回链表。
* **最小树化容量:**
  * `static final int MIN_TREEIFY_CAPACITY = 64;` 当哈希表中的桶的数量小于 64 时，即使链表长度达到 8，也不会进行树化，而是进行扩容。

## 四、HashMap 面试题及详细回答

**1. HashMap 的数据结构是什么？**

*   **回答：** `HashMap` 的数据结构是数组 + 链表/红黑树。数组是 `HashMap` 的主体，用于存储键值对。当多个 key 的哈希码冲突时，它们会被存储在同一个数组位置的链表中。当链表长度超过一定阈值（8）时，且数组长度达到 64，链表会转换为红黑树，以提高查找效率。  数组长度小于 64 的时候， 优先进行扩容，而不是转化为红黑树。

**2. HashMap 的工作原理是什么？**

*   **回答：**
    1.  当调用 `put(key, value)` 方法时，`HashMap` 首先会计算 key 的哈希码。
    2.  然后，根据哈希码确定 key 在哈希表中的位置（桶）。
    3.  如果桶为空，则创建一个新的节点并放入桶中。
    4.  如果桶不为空，则遍历桶中的链表或红黑树：
        *   如果找到具有相同 key 的节点，则更新该节点的 value。
        *   如果没有找到具有相同 key 的节点，则在链表末尾添加一个新的节点（或在红黑树中插入一个新的节点）。
    5.  如果 `HashMap` 中的元素数量超过阈值，则进行扩容。
    6. 当调用 `get(key)` 方法时，HashMap 首先会计算 key 的哈希码，并根据哈希码找到对应的桶，然后遍历桶中的链表或红黑树，查找具有相同 key 的节点，并返回其 value。

**3. HashMap 如何解决哈希冲突？**

*   **回答：** `HashMap` 使用链地址法解决哈希冲突。当多个 key 具有相同的哈希码时，它们会被存储在同一个桶的链表中。 在JDK 8 中，如果链表长度超过 8 且数组长度达到 64，链表会转换为红黑树，以提高查找效率。

**4. 为什么 HashMap 要使用红黑树？**

*   **回答：** 当哈希冲突严重时，链表会变得很长，导致查找效率降低，时间复杂度会从 O(1) 变为 O(n)。使用红黑树可以提高查找效率，将时间复杂度降低到 O(log n)。红黑树是一种自平衡的二叉查找树，可以保证在最坏情况下，查找、插入和删除操作的时间复杂度都是 O(log n)。

**5. HashMap 的容量和负载因子是什么？它们有什么作用？**

*   **回答：**
    *   **容量（Capacity）：** `HashMap` 中桶的数量，初始容量默认为 16。
    *   **负载因子（Load Factor）：** 衡量 `HashMap` 填充程度的指标，默认值为 0.75。
    *   **作用：**  容量和负载因子共同决定了 `HashMap` 何时进行扩容。当 `HashMap` 中的元素数量超过容量与负载因子的乘积时，就会进行扩容。 扩容是一个非常耗时的操作，因为它需要创建一个新的更大的哈希表，并将所有元素重新哈希到新的哈希表中。  因此，选择合适的容量和负载因子非常重要。

**6. HashMap 是线程安全的吗？如果不是，如何解决线程安全问题？**

*   **回答：** `HashMap` 不是线程安全的。如果需要在多线程环境中使用 `HashMap`，可以考虑以下解决方案：
    *   **使用 `Collections.synchronizedMap(new HashMap<>())`：**  将 `HashMap` 包装成一个线程安全的 `Map`。但这种方式的效率较低，因为它是通过对整个 `Map` 进行加锁来实现线程安全的。
    *   **使用 `ConcurrentHashMap`：**  `ConcurrentHashMap` 是一个线程安全的哈希表，它使用了分段锁（segment locking）技术，将哈希表分成多个段，每个段都有自己的锁。这样可以降低锁的粒度，提高并发性能。
    *   **使用 `Hashtable`：**  `Hashtable` 是一个线程安全的哈希表，但它的效率较低，因为它对整个 `Hashtable` 进行加锁。 现在已经很少使用。

**7. HashMap 的 key 可以为 null 吗？value 可以为 null 吗？**

*   **回答：** `HashMap` 的 key 可以为 `null`（只能有一个），value 可以为 `null`。

**8. HashMap 的扩容机制是什么？**

*   **回答：** 当 `HashMap` 中的元素数量超过阈值（容量 \* 负载因子）时，就会进行扩容。扩容的过程如下：
    1.  创建一个新的更大的哈希表，新的容量通常是旧容量的两倍。
    2.  将所有元素重新哈希到新的哈希表中。  这个过程会遍历旧哈希表中的所有元素，并重新计算它们在新哈希表中的位置。
    3.  将旧哈希表中的所有元素移动到新的哈希表中。

**9. 为什么 HashMap 的容量总是 2 的幂次方？**

*   **回答：**
    1.  **计算索引：** 为了将 key 映射到哈希表中的一个位置，`HashMap` 使用以下公式计算索引：`index = (n - 1) & hash`，其中 `n` 是哈希表的容量，`hash` 是 key 的哈希码。当 `n` 为 2 的幂次方时，`(n - 1)` 的二进制表示是一个低位全 1 的数，这样可以保证计算出的索引值更加均匀分布，减少哈希冲突。
    2.  **扩容：** 当 `HashMap` 进行扩容时，新的容量是旧容量的两倍。如果容量不是 2 的幂次方，则扩容后需要重新计算所有元素的哈希码，这会降低扩容效率。
    3.  **效率优化：** 在计算机中，位运算的效率比取模运算高。将容量设置为 2 的幂次方，可以使用位运算代替取模运算，提高计算索引的效率。

**10. HashMap 和 Hashtable 的区别？**

*   **回答：**
    *   **线程安全：** `HashMap` 不是线程安全的，`Hashtable` 是线程安全的。
    *   **`null` 值：** `HashMap` 允许 key 和 value 为 `null`，`Hashtable` 不允许 key 和 value 为 `null`。
    *   **继承关系：** `HashMap` 继承自 `AbstractMap`，`Hashtable` 继承自 `Dictionary`。
    *   **初始容量和扩容：** `HashMap` 的初始容量为 16，扩容时容量变为原来的 2 倍。`Hashtable` 的初始容量为 11，扩容时容量变为原来的 `2n + 1` 倍。
    *   **哈希算法：** `HashMap` 使用扰动函数（hash function）来减少哈希冲突，`Hashtable` 直接使用 key 的 `hashCode()` 方法。
    *   **效率：**  在单线程环境下，`HashMap` 的效率通常比 `Hashtable` 高。 因为`Hashtable`是同步的，存在锁的开销。

**11. ConcurrentHashMap 的实现原理是什么？**

*   **回答：**
    *   **JDK 7：**  `ConcurrentHashMap` 使用分段锁（segment locking）技术，将哈希表分成多个段（Segment），每个段都有自己的锁。这样可以降低锁的粒度，提高并发性能。Segment 继承自 ReentrantLock，因此每个 Segment 都是一个可重入锁。
    *   **JDK 8：**  `ConcurrentHashMap` 使用 CAS + `synchronized` + `Node` + 红黑树来实现线程安全。  它取消了 Segment 分段锁，采用 CAS 保证原子性，在发生冲突时，使用 `synchronized` 锁住链表的头节点，链表长度超过 8 且数组长度达到 64时，链表转换为红黑树。 相比于 JDK 7 的分段锁，JDK 8 的 `ConcurrentHashMap` 具有更高的并发性能。

**12. 简述一下你对哈希碰撞的理解，有哪些解决哈希碰撞的方法？**

*   **回答：**
    *   **哈希碰撞的理解:**  哈希碰撞指的是不同的 key 通过哈希函数计算得到相同的哈希值，导致它们被映射到哈希表的同一个位置（桶）。由于桶只能存储一个元素，因此当发生哈希碰撞时，就需要解决如何存储这些具有相同哈希值的元素的问题。
    *   **解决哈希碰撞的方法:**
        *   **链地址法 (Separate Chaining):**  将具有相同哈希值的元素存储在同一个桶的链表中。这是 HashMap 使用的默认解决方案。
        *   **开放地址法 (Open Addressing):**  当发生哈希碰撞时，按照某种规则在哈希表中寻找下一个可用的空闲位置。常见的开放地址法包括：
            *   线性探测 (Linear Probing):  依次检查下一个位置，直到找到空闲位置。
            *   二次探测 (Quadratic Probing):  按照二次方序列（1, 4, 9, 16, ...）检查下一个位置。
            *   双重哈希 (Double Hashing):  使用另一个哈希函数计算探测步长。
        *   **再哈希法 (Rehashing):**  使用多个不同的哈希函数，当发生哈希碰撞时，使用另一个哈希函数计算哈希值，直到找到空闲位置。
        *   **建立公共溢出区:**  建立另一个单独的存储空间，用于存储发生哈希碰撞的元素。

**13. 你在什么情况下会使用 HashMap？**

*   **回答：**  当需要存储键值对，并且需要快速的插入、删除和查找操作时，我会使用 `HashMap`。  `HashMap` 适用于单线程环境，如果需要在多线程环境中使用，我会考虑使用 `ConcurrentHashMap`。 我通常会在以下情况下使用 HashMap：
    *   **缓存:**  将数据缓存在 HashMap 中，以提高访问速度。
    *   **索引:**  使用 HashMap 构建索引，以加快查找速度。
    *   **统计:**  使用 HashMap 统计元素的出现次数。
    *   **配置:**  使用 HashMap 存储配置信息。

**14. 如何选择 HashMap 的初始容量？**

*   **回答：** 选择 HashMap 的初始容量需要考虑以下因素：
    *   **预期存储的元素数量:**  如果知道 HashMap 大概会存储多少个元素，可以将初始容量设置为略大于预期元素数量的值。
    *   **负载因子:**  负载因子决定了 HashMap 何时进行扩容。 如果负载因子设置的比较小， 那么可以适当降低初始容量。
    *   **减少扩容次数:**  扩容是一个非常耗时的操作，因此应该尽量减少扩容次数。  设置合适的初始容量可以避免频繁扩容。
    *   **性能测试:**  可以通过性能测试来确定最佳的初始容量。

**15. HashMap 中的 key 需要实现 hashCode() 和 equals() 方法吗？为什么？**

*   **回答：**  是的，`HashMap` 中的 key 需要实现 `hashCode()` 和 `equals()` 方法。 原因如下：
    *   **hashCode() 方法：**  `HashMap` 使用 `hashCode()` 方法计算 key 的哈希码，哈希码用于确定 key 在哈希表中的位置。 如果两个 key 的 `hashCode()` 方法返回值不同，则它们一定不会被存储在同一个桶中。
    *   **equals() 方法：**  当多个 key 的哈希码冲突时，它们会被存储在同一个桶的链表中或红黑树中。  `HashMap` 使用 `equals()` 方法来比较链表或红黑树中的 key 是否相等。 如果两个 key 的 `hashCode()` 方法返回值相同，并且 `equals()` 方法返回 `true`，则认为它们是相等的。
    *   **一致性：**  `hashCode()` 和 `equals()` 方法必须保持一致性。 如果两个 key 的 `equals()` 方法返回 `true`，则它们的 `hashCode()` 方法返回值必须相同。 如果两个 key 的 `equals()` 方法返回 `false`，则它们的 `hashCode()` 方法返回值最好不同，以减少哈希冲突。

**16. HashMap put 方法流程**

*  **回答：**
   1.  **计算哈希值:**  首先，对 key 调用 `hashCode()` 方法计算哈希值。
   2.  **检查是否需要初始化:** 检查哈希表（`table`）是否为空或者长度为 0。如果是，则进行初始化（调用 `resize()` 方法进行初始化）。
   3.  **计算索引:** 通过哈希值与哈希表长度取模（`(n - 1) & hash`）计算出 key 应该被放置在哈希表中的哪个桶（bucket）的索引位置。
   4.  **检查桶是否为空:**  
       *   如果计算得到的桶是空的（即该位置没有元素），则直接将包含 key-value 的新节点放入该桶中。
   5.  **处理哈希冲突:** 如果计算得到的桶不是空的（即发生了哈希冲突），则需要进一步处理：
       *   **检查 key 是否已存在:** 遍历桶中的节点（链表或红黑树）。如果找到与要插入的 key 具有相同哈希值且 `equals()` 方法返回 true 的 key，则表示该 key 已经存在于 HashMap 中，此时可以选择：
           *   **更新值:**  如果 `onlyIfAbsent` 为 false（允许覆盖旧值），则将该 key 对应的 value 更新为新值，并返回旧值。
           *   **不更新值:**  如果 `onlyIfAbsent` 为 true（不允许覆盖旧值），则不更新值，直接返回旧值。
       *   **插入新节点:**  如果遍历完桶中的节点后没有找到相同的 key，则将包含 key-value 的新节点插入到桶中。
           *   **链表插入:** 如果桶中的节点是链表结构，则将新节点添加到链表的末尾。
           *   **红黑树插入:** 如果桶中的节点是红黑树结构，则将新节点插入到红黑树中。
   6.  **检查是否需要树化:** 如果在链表插入节点后，链表的长度达到了树化阈值（`TREEIFY_THRESHOLD`，默认为 8），则尝试将该链表转换为红黑树。转换的前提是哈希表的总容量达到最小树化容量（`MIN_TREEIFY_CAPACITY`，默认为 64），否则，如果总容量小于 64，则进行扩容而不是树化。
   7.  **检查是否需要扩容:** 在插入新节点后，将 HashMap 的 `modCount`（修改次数）加 1，并将元素数量加 1。然后，检查 HashMap 的当前元素数量是否超过了扩容阈值（`threshold`，等于容量乘以负载因子）。如果超过了阈值，则调用 `resize()` 方法进行扩容。
   8.  **返回结果:** 如果是插入新节点，则返回 null。如果更新了现有节点的值，则返回旧值。

## 五、总结

`HashMap` 是 Java 中非常重要的集合类，掌握 `HashMap` 的知识对于理解 Java 集合框架和编写高效的 Java 代码至关重要。 在面试中，`HashMap` 也是一个常见的考点，需要掌握 `HashMap` 的数据结构、工作原理、哈希冲突解决方案、线程安全问题等。 希望本文能够帮助你更好地理解 `HashMap`，并在面试中取得好成绩。

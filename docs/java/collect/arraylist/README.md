---
title: ArrayList
date: 2025-06-14 11:15:53
permalink: /java/collect/arraylist
categories:
  - 后端
tags:
  - 集合
author: zhuib
---

## ArrayList 知识体系与面试精讲

## 一、ArrayList 概述

`ArrayList` 是 Java 集合框架中常用的动态数组，它实现了 `List` 接口，并基于数组实现。`ArrayList` 提供了动态调整大小的功能，可以根据需要自动增加容量。

**关键特性：**

*   **动态数组：** 内部基于数组实现，可以动态调整大小。
*   **有序性：**  `ArrayList` 中的元素是有序的，按照插入顺序存储。
*   **允许重复元素：**  `ArrayList` 允许存储重复的元素。
*   **允许 `null`：** `ArrayList` 允许存储 `null` 元素。
*   **非线程安全：** `ArrayList` 不是线程安全的，如果需要在多线程环境中使用，可以考虑使用 `CopyOnWriteArrayList` 或使用 `Collections.synchronizedList(new ArrayList(...))` 进行包装。
*   **随机访问效率高：** 通过索引访问元素的时间复杂度为 O(1)。
*   **插入和删除效率较低：** 在中间位置插入或删除元素的时间复杂度为 O(n)，因为需要移动后续元素。

## 二、ArrayList 核心概念

*   **内部数组：** 用于存储元素的数组。
*   **容量 (Capacity)：** 内部数组的长度，表示 `ArrayList` 最多可以存储多少个元素。
*   **大小 (Size)：** `ArrayList` 中实际存储的元素数量。
*   **扩容 (Resize)：**  当 `ArrayList` 中的元素数量超过容量时，需要进行扩容，创建一个新的更大的数组，并将所有元素复制到新数组中。

## 三、ArrayList 源码分析 (JDK 8)

*   **数据结构：** 数组
    ```java
    transient Object[] elementData; // 存储元素的数组
    private int size; // 实际存储的元素数量
    ```

*   **构造函数：**
    ```java
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA; // 初始容量为 0
    }

    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }

    public ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        if ((size = elementData.length) != 0) {
            // c.toArray might (incorrectly) not return Object[] (see 6260652)
            if (elementData.getClass() != Object[].class)
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // replace with empty array.
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }
    ```

*   **`add(E e)` 方法：**
    1.  检查是否需要扩容，如果需要，则进行扩容。
    2.  将元素添加到数组的末尾。
    3.  将 `size` 加 1。

*   **`add(int index, E element)` 方法：**
    1.  检查索引是否越界。
    2.  检查是否需要扩容，如果需要，则进行扩容。
    3.  将索引位置及后续的元素向后移动一位。
    4.  将元素添加到指定索引位置。
    5.  将 `size` 加 1。

*   **`get(int index)` 方法：**
    1.  检查索引是否越界。
    2.  返回指定索引位置的元素。

*   **`remove(int index)` 方法：**
    1.  检查索引是否越界。
    2.  将索引位置后续的元素向前移动一位。
    3.  将数组末尾的元素设置为 `null`，以便垃圾回收。
    4.  将 `size` 减 1。

*   **`resize()` 方法 (ensureCapacityInternal, grow)：**  `ArrayList` 没有直接名为 `resize()` 的方法，但是通过 `ensureCapacityInternal()` 和 `grow()` 方法实现扩容。
    1.  计算新的容量，通常是旧容量的 1.5 倍。
    2.  创建一个新的更大的数组。
    3.  将所有元素复制到新数组中。

## 四、ArrayList 面试题及详细回答

**1. ArrayList 的底层实现是什么？**

*   **回答：** `ArrayList` 底层是基于数组实现的动态数组。它维护了一个内部数组 `elementData`，用于存储元素。

**2. ArrayList 和 LinkedList 的区别？**

*   **回答：**
    *   **底层实现：** `ArrayList` 基于数组实现，`LinkedList` 基于链表实现。
    *   **随机访问：** `ArrayList` 支持高效的随机访问，时间复杂度为 O(1)。`LinkedList` 不支持高效的随机访问，需要从头节点或尾节点开始遍历，时间复杂度为 O(n)。
    *   **插入和删除：** 在中间位置插入和删除元素时，`ArrayList` 的效率较低，因为需要移动后续元素，时间复杂度为 O(n)。`LinkedList` 的插入和删除效率较高，只需要修改指针，时间复杂度为 O(1)。
    *   **内存占用：** `ArrayList` 需要连续的内存空间，可能会造成内存浪费。`LinkedList` 不需要连续的内存空间，可以更灵活地利用内存。
    *   **线程安全：**  `ArrayList` 和 `LinkedList` 都是非线程安全的。
    *   **总结：** 如果需要频繁进行随机访问，则应该选择 `ArrayList`。如果需要频繁进行插入和删除操作，则应该选择 `LinkedList`。

**3. ArrayList 是线程安全的吗？如果不是，如何解决线程安全问题？**

*   **回答：** `ArrayList` 不是线程安全的。如果需要在多线程环境中使用 `ArrayList`，可以考虑以下解决方案：
    *   **使用 `Collections.synchronizedList(new ArrayList<>())`：**  将 `ArrayList` 包装成一个线程安全的 `List`。但这种方式的效率较低，因为它是通过对整个 `List` 进行加锁来实现线程安全的。
    *   **使用 `CopyOnWriteArrayList`：**  `CopyOnWriteArrayList` 是一个线程安全的 `List`，它使用了写时复制（Copy-On-Write）技术。 当修改 `CopyOnWriteArrayList` 时，会创建一个新的数组，并将所有元素复制到新数组中。  然后，将新数组赋值给 `elementData` 字段。  这样可以保证在修改 `CopyOnWriteArrayList` 时，不会影响到其他线程的读取操作。 `CopyOnWriteArrayList` 适用于读多写少的场景。

**4. ArrayList 的扩容机制是什么？**

*   **回答：** 当 `ArrayList` 中的元素数量超过容量时，就会进行扩容。扩容的过程如下：
    1.  计算新的容量，通常是旧容量的 1.5 倍。（`(oldCapacity + (oldCapacity >> 1))`）
    2.  创建一个新的更大的数组。
    3.  将所有元素复制到新数组中。

**5. ArrayList 的初始容量是多少？**

*   **回答：** 在 JDK 8 中，`ArrayList` 的默认初始容量为 0。 第一次添加元素时，才会将容量扩容到10。

**6. 为什么 ArrayList 的初始容量是 0？**

*   **回答：** 这样做的好处是可以节省内存空间。 如果一开始就分配 10 个元素的空间，但是实际上只存储了少量元素，就会造成内存浪费。  当真正需要存储元素时，才会进行扩容，分配必要的内存空间。

**7. ArrayList 的扩容因子是多少？**

*   **回答：**  `ArrayList` 没有直接定义扩容因子，但扩容后的容量通常是旧容量的 1.5 倍。 可以认为1.5是其扩容因子。

**8. 如何避免 ArrayList 频繁扩容？**

*   **回答：**  为了避免 `ArrayList` 频繁扩容，可以在创建 `ArrayList` 时指定合适的初始容量。 如果知道 `ArrayList` 大概会存储多少个元素，可以将初始容量设置为略大于预期元素数量的值。 这样可以减少扩容次数，提高性能。

**9. ArrayList 的 `remove(Object o)` 方法是如何工作的？**

*   **回答：** `remove(Object o)` 方法的工作原理如下：
    1.  遍历 `ArrayList` 中的所有元素。
    2.  使用 `equals()` 方法比较要删除的元素 `o` 和 `ArrayList` 中的每个元素。
    3.  如果找到相等的元素，则将该元素从 `ArrayList` 中删除，并将后续元素向前移动一位。
    4.  如果找到多个相等的元素，则只删除第一个找到的元素。
    5.  如果 `ArrayList` 中不存在要删除的元素，则不进行任何操作。

**10. ArrayList 的 `clear()` 方法是如何工作的？**

*   **回答：** `clear()` 方法的工作原理如下：
    1.  将 `ArrayList` 中的所有元素设置为 `null`。
    2.  将 `size` 设置为 0。
    这样做可以帮助垃圾回收器回收 `ArrayList` 中存储的元素，释放内存空间。

**11. ArrayList 和 Vector 的区别？**

*   **回答：**
    *   **线程安全：** `ArrayList` 不是线程安全的，`Vector` 是线程安全的。
    *   **扩容：** `ArrayList` 扩容后的容量通常是旧容量的 1.5 倍，`Vector` 扩容后的容量通常是旧容量的 2 倍。
    *   **性能：** 在单线程环境下，`ArrayList` 的效率通常比 `Vector` 高。 因为`Vector`是同步的，存在锁的开销。

**12. 使用 ArrayList 有什么注意事项？**

*   **回答：**
    *   **线程安全：**  在多线程环境下使用 `ArrayList` 时，需要注意线程安全问题。 可以使用 `Collections.synchronizedList(new ArrayList<>())` 或 `CopyOnWriteArrayList` 来解决线程安全问题。
    *   **内存占用：**  `ArrayList` 需要连续的内存空间，可能会造成内存浪费。  如果需要存储大量数据，并且对内存占用比较敏感，可以考虑使用 `LinkedList`。
    *   **扩容：**  扩容是一个比较耗时的操作，应该尽量避免频繁扩容。  在创建 `ArrayList` 时，可以指定合适的初始容量，以减少扩容次数。
    *   **索引越界：**  访问 `ArrayList` 中的元素时，需要注意索引越界问题。 应该确保索引值在 0 到 `size - 1` 的范围内。
    *   **基本类型：**  `ArrayList` 只能存储对象，不能直接存储基本类型。  如果需要存储基本类型，可以使用基本类型的包装类，例如 `Integer`、`Double` 等。

**13. 为什么 ArrayList 实现了 RandomAccess 接口？**

*   **回答：**  `RandomAccess` 接口是一个标记接口，用于表明一个 List 实现支持快速随机访问。实现了 `RandomAccess` 接口的 List，在使用索引访问元素时，性能会更好。`ArrayList` 实现了 `RandomAccess` 接口，表明它支持快速随机访问，通过索引访问元素的时间复杂度为 O(1)。 实现了`RandomAccess`接口的List，在使用迭代器遍历时，可以优先选择基于索引的迭代方式，以提高性能。

**14. ArrayList 在什么场景下不适合使用？**

*   **回答：**
    *   **频繁的插入和删除操作：** 如果需要在 `List` 的中间位置频繁进行插入和删除操作，`ArrayList` 的性能会比较差，因为需要移动大量的元素。 此时，`LinkedList` 是一个更好的选择。
    *   **存储大量小对象：** 由于 `ArrayList` 需要存储对象的引用，并且数组需要占用连续的内存空间，因此当存储大量小对象时，`ArrayList` 的内存占用可能会比较高。 此时，可以使用专门针对小对象存储优化的数据结构，或者考虑使用基本类型的数组。
    *   **严格的实时性要求：** `ArrayList` 的扩容操作可能会导致性能抖动，如果对实时性有严格的要求，需要避免频繁的扩容。 可以通过设置合适的初始容量来减少扩容次数，或者考虑使用其他数据结构。

**15. ArrayList 如何实现 Fail-Fast 机制？**

*   **回答：** `ArrayList` 通过 `modCount` 字段来实现 Fail-Fast 机制。
    *   `modCount` 字段用于记录 `ArrayList` 的修改次数，每次对 `ArrayList` 进行结构性修改（例如添加、删除元素）时，`modCount` 的值都会增加。
    *   在创建迭代器时，会将当前的 `modCount` 值赋值给迭代器的 `expectedModCount` 字段。
    *   在迭代过程中，如果发现 `modCount` 的值与 `expectedModCount` 的值不相等，则说明 `ArrayList` 在迭代过程中被其他线程修改了，此时会抛出 `ConcurrentModificationException` 异常，提示用户 `ArrayList` 已经被并发修改。
    *   Fail-Fast 机制可以帮助开发者快速发现并发修改问题，避免出现数据不一致的情况。 需要注意的是，Fail-Fast 机制并不能保证完全避免并发修改问题，它只是一种尽力而为的机制。

## 五、总结

`ArrayList` 是 Java 集合框架中常用的动态数组，掌握 `ArrayList` 的知识对于理解 Java 集合框架和编写高效的 Java 代码至关重要。 在面试中，`ArrayList` 也是一个常见的考点，需要掌握 `ArrayList` 的底层实现、特点、扩容机制、线程安全问题等。 希望本文能够帮助你更好地理解 `ArrayList`，并在面试中取得好成绩。

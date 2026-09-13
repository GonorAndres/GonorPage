---
title: "B-Trees: the simple structure behind every query you have ever run"
description: "PostgreSQL, MySQL, SQLite, and most modern file systems use B-trees as the core structure for their indexes. Understanding why changes how you think about query design and the real cost of a lookup."
date: "2026-03-13"
category: "herramientas"
lang: "en"
tags: ["Data Structures", "PostgreSQL", "Optimization", "Rust", "Databases"]
ficha:
  rol: "Solo author"
  año: "2026"
  stack: "Rust · PostgreSQL"
  estado: "Completed"
  repositorio: "https://github.com/GonorAndres/b-trees"
lastModified: "2026-09-12"
heroImage: "/blog-illustrations/b-trees-optimization.webp"
heroAlt: "A wide, shallow index tree highlights one route from the root to a leaf."
heroCaption: "Grouping several keys in each node lets each access narrow the remaining search."
---

When PostgreSQL finds one record among 500 million in 40 milliseconds, that is not magic or exceptional hardware. It is a B-tree traversal that touched exactly 9 nodes before reaching the data. If the same query takes 40 seconds, it is because there was no index and the engine had to read every disk block in sequence. The difference between those two scenarios is not configuration or resources: it is data structure.

The B-tree is the answer the industry converged on in the 1970s to a concrete question: how do you organize data on disk so that search, insertion, and deletion are all efficient, and disk accesses are minimized? That question is still relevant because disk, even the fastest SSD, is orders of magnitude slower than RAM. The B-tree was designed for that gap.

## Why a binary tree is not enough

The binary search tree (BST) is the first structure in any algorithms course: each node has exactly two children, and the ordering property guarantees O(log n) search. It works perfectly when the tree lives in memory. The problem appears on disk.

A BST with one million nodes has a height of roughly 20. Each comparison requires accessing the next node. In memory, that is 20 pointer dereferences: nanoseconds. On disk, each hop is potentially a different block access: 20 I/O operations, each between 0.1 ms (SSD) and 10 ms (spinning disk). Latency compounds, and the problem is worse because BST nodes are small: an integer and two pointers. An 8 KB disk block could hold hundreds of nodes, but the BST only uses one per access. Block capacity is wasted.

The B-tree solves exactly this: instead of thin nodes with two children, it uses fat nodes that can hold dozens or hundreds of keys, and a correspondingly large number of children. A B-tree of order 100 holds up to 99 keys per node. With that configuration and one million records, the tree height is roughly 3. Three disk accesses for any lookup, regardless of dataset size.

## The anatomy of a node

A B-tree node of order M contains:

- Up to M-1 keys, stored in ascending order.
- Up to M pointers to child nodes (one between each pair of keys, and one beyond each end).

The keys within a node partition the search space: if the keys are [20, 50, 80], the first pointer leads to the subtree with values below 20, the second to the subtree between 20 and 50, the third between 50 and 80, and the fourth to values above 80. Search within a node is binary search over its keys, O(log M), but since M is constant it is effectively O(1) for any reasonable M.

Leaf nodes in a B+-tree (the variant used by almost every database system) store the actual data alongside the keys, and are linked together in a doubly linked list. That leaf chain is what makes range scans efficient: `WHERE date BETWEEN '2024-01-01' AND '2024-12-31'` does not require traversing the tree repeatedly; it just finds the first leaf node in the range and follows the chain forward.

## How it stays balanced: node splitting

The B-tree has a property that sets it apart from most balanced trees: it balances itself without explicit rotations.

When a key is inserted into a node that is already full (M-1 keys), the node splits in two. The middle key moves up to the parent node. If the parent is also full, the process repeats upward. The only special case is when the root splits: a new root is created with a single key, and the tree height increases by one. That is the only moment the tree grows upward.

This property guarantees that all leaf nodes are always at the same depth, without exception. There are no longer search paths than others. The O(log n) complexity is not an average or an expected case: it is the worst case.

The minimum occupancy is also guaranteed: every node except the root must hold at least ⌈M/2⌉ - 1 keys. This prevents nodes from becoming nearly empty after deletions, which keeps the tree's space efficiency intact.

## PostgreSQL: the B-tree in production

The interactive explorer I built in Rust ([B-Tree Explorer](https://github.com/GonorAndres/b-trees)) uses a tree of order 4 so that splits are visible. PostgreSQL uses a much larger order, calibrated against the 8 KB page size. Each tree page (one block in the PostgreSQL heap) stores as many keys as fit in 8 KB after the node metadata.

For an index over an 8-byte integer in PostgreSQL, a leaf page holds roughly 250-300 keys. For a VARCHAR(255) index, fewer. This has direct consequences:

**Short keys produce wider, shallower trees.** An index over a UUID (16 bytes) will be taller than one over a 4-byte integer, for the same number of rows. The height difference can be 1-2 levels for large tables, which translates directly into additional disk accesses per query.

**Composite index column order matters.** An index on `(country, city)` is a B-tree whose keys are lexicographically ordered pairs: first by country, then by city within the same country. A query with `WHERE country = 'MX'` can use it efficiently because it knows exactly where Mexico's range starts and ends in the tree. A query with `WHERE city = 'Guadalajara'` without filtering by country cannot: Guadalajara values are scattered throughout the tree, interleaved with cities from every other country. The column order in a composite index is not a style detail; it is the difference between O(log n) and O(n).

**The flight data analysis at 2.5 GB** in my [flight-analytics](/en/blog/flight-analytics-pg-bq/) project illustrates this in practice. At that scale, the presence or absence of an index on frequently filtered columns determines whether a query takes 200 ms or 40 seconds. PostgreSQL's execution plan (`EXPLAIN ANALYZE`) shows exactly how many tree nodes were traversed, how many pages were read from disk, and whether the index was used or the engine fell back to a sequential scan. That information is the difference between optimizing with evidence and guessing.

## The cost that does not show up in the `SELECT`

B-tree indexes are not free. Every insert into a table is also an insert into each index defined on it. With 5 indexes on a table, one insert writes to 6 places: the table plus 5 trees. Node splits are expensive because they require writing multiple pages and updating the parent node.

Write amplification, the problem where one logical write produces multiple physical writes, is a major reason why OLAP systems (analytical workloads with heavy bulk writes) often prefer other structures. Log-Structured Merge Trees (LSM Trees), used by RocksDB, Cassandra, and ClickHouse, trade random read performance for much more efficient writes: instead of navigating the tree and splitting nodes, they write sequentially to an in-memory buffer and consolidate to disk in the background.

The B-tree is the right choice when reads are the dominant operation, data is updated but not in continuous bulk loads, and range queries are frequent. That describes most OLTP workloads: transactional applications, reservation systems, policy databases, claims records.

## What changes when you understand it

PostgreSQL's `EXPLAIN ANALYZE` output includes a line like `Index Scan using idx_name on table`. Behind that line is a B-tree traversal: it descends from the root to the corresponding leaf node, retrieves the pointer to the heap where the actual row lives, and reads it. If the query retrieves many rows scattered throughout the heap, PostgreSQL may decide that a sequential scan is more efficient than many random tree accesses. That threshold is governed by `enable_indexscan` and the planner's cost parameters.

Understanding the tree's structure makes those planner decisions stop being black boxes. When the planner chooses a sequential scan over an available index, it is not a bug: it is calculating that the cost of traversing the tree plus the cost of scattered heap fetches exceeds the cost of reading the table file sequentially. For small tables or queries with low selectivity, that is correct.

The next time a query takes longer than expected, the B-tree is the first place to look. Is there an index on the filter columns? Does the column order in the composite index match the selectivity of the typical filters? Does the index exist but the planner ignores it because table statistics are stale? (`ANALYZE` fixes that.) Those questions stop being abstract once you have the mental model of what is happening inside.

The [B-Tree Explorer](https://github.com/GonorAndres/b-trees) I built in Rust and compiled to WebAssembly lets you watch in real time how a node splits, how the middle key rises to the parent, and how the tree height grows in a controlled way. Not as a data structures tutorial, but as a tool for building the intuition that leads to better index design decisions.

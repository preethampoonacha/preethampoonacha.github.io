import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type DsaCategory =
  | 'Data Structure'
  | 'Sorting'
  | 'Searching'
  | 'Graph'
  | 'Technique';

interface ComplexityRow {
  label: string;
  value: string;
}

interface DsaTopic {
  id: number;
  name: string;
  icon: string;
  category: DsaCategory;
  summary: string;
  description: string;
  complexity: ComplexityRow[];
  keyPoints: string[];
  useCases: string[];
  codeLang: string;
  code: string;
}

interface CategoryFilter {
  label: string;
  value: DsaCategory | 'All';
  icon: string;
}

@Component({
  selector: 'app-learn-dsa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn-dsa.component.html',
  styleUrl: './learn-dsa.component.css'
})
export class LearnDsaComponent {
  filters: CategoryFilter[] = [
    { label: 'All', value: 'All', icon: '✨' },
    { label: 'Data Structures', value: 'Data Structure', icon: '🧱' },
    { label: 'Sorting', value: 'Sorting', icon: '🔀' },
    { label: 'Searching', value: 'Searching', icon: '🎯' },
    { label: 'Graphs', value: 'Graph', icon: '🕸️' },
    { label: 'Techniques', value: 'Technique', icon: '🧠' }
  ];

  activeFilter: DsaCategory | 'All' = 'All';
  searchTerm = '';
  selectedTopic: DsaTopic | null = null;

  topics: DsaTopic[] = [
    {
      id: 1,
      name: 'Array',
      icon: '📊',
      category: 'Data Structure',
      summary: 'Contiguous, index-addressable block of elements.',
      description:
        'An array stores elements in contiguous memory, so any element is reachable in constant time from its index. It is the foundation for most other structures, but inserting or deleting in the middle costs O(n) because elements must shift.',
      complexity: [
        { label: 'Access', value: 'O(1)' },
        { label: 'Search', value: 'O(n)' },
        { label: 'Insert (end)', value: 'O(1)*' },
        { label: 'Insert (middle)', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'Constant-time random access by index.',
        'Cache-friendly due to contiguous memory.',
        'Fixed size in low-level languages; dynamic arrays amortize resizing.',
        'Insertion/deletion in the middle shifts elements.'
      ],
      useCases: [
        'Lookup tables and buffers',
        'Base for stacks, heaps and dynamic lists',
        'When index-based access dominates'
      ],
      codeLang: 'typescript',
      code: `const nums = [5, 2, 9, 1];

// O(1) access
const first = nums[0];        // 5

// O(1) amortized append
nums.push(7);                 // [5, 2, 9, 1, 7]

// O(n) insert in the middle
nums.splice(2, 0, 42);        // [5, 2, 42, 9, 1, 7]`
    },
    {
      id: 2,
      name: 'Linked List',
      icon: '🔗',
      category: 'Data Structure',
      summary: 'Nodes chained by pointers — cheap insert/delete.',
      description:
        'A linked list stores each element in a node that points to the next (and optionally previous) node. Insertion and deletion are O(1) once you hold the node, but there is no random access — reaching the k-th element costs O(k).',
      complexity: [
        { label: 'Access', value: 'O(n)' },
        { label: 'Search', value: 'O(n)' },
        { label: 'Insert (head)', value: 'O(1)' },
        { label: 'Delete (node)', value: 'O(1)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'No shifting: insert/delete only rewires pointers.',
        'No random access — must traverse from the head.',
        'Extra memory per node for pointers.',
        'Doubly-linked variants allow backward traversal.'
      ],
      useCases: [
        'Queues, stacks and adjacency lists',
        'LRU caches (with a hash map)',
        'When frequent insertion/deletion beats indexing'
      ],
      codeLang: 'typescript',
      code: `class Node<T> {
  constructor(public value: T, public next: Node<T> | null = null) {}
}

// Prepend in O(1)
function prepend<T>(head: Node<T> | null, value: T): Node<T> {
  return new Node(value, head);
}`
    },
    {
      id: 3,
      name: 'Stack',
      icon: '📚',
      category: 'Data Structure',
      summary: 'Last-In, First-Out (LIFO) container.',
      description:
        'A stack only allows access at the top: you push to add and pop to remove, both in O(1). It naturally models nested or reversible processes such as function calls, undo history and expression parsing.',
      complexity: [
        { label: 'Push', value: 'O(1)' },
        { label: 'Pop', value: 'O(1)' },
        { label: 'Peek', value: 'O(1)' },
        { label: 'Search', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'LIFO ordering — newest element leaves first.',
        'All core operations are O(1).',
        'Backs the call stack and recursion.',
        'Great for matching/balancing problems.'
      ],
      useCases: [
        'Undo/redo and browser history',
        'Balanced-parentheses & expression evaluation',
        'Depth-first traversal (iterative)'
      ],
      codeLang: 'typescript',
      code: `const stack: number[] = [];

stack.push(1);   // [1]
stack.push(2);   // [1, 2]
stack.pop();     // returns 2 -> [1]
const top = stack[stack.length - 1]; // peek -> 1`
    },
    {
      id: 4,
      name: 'Queue',
      icon: '🎟️',
      category: 'Data Structure',
      summary: 'First-In, First-Out (FIFO) container.',
      description:
        'A queue serves elements in arrival order: enqueue at the back, dequeue from the front. Implemented with a linked list or ring buffer, both ends operate in O(1). It underpins scheduling and breadth-first traversal.',
      complexity: [
        { label: 'Enqueue', value: 'O(1)' },
        { label: 'Dequeue', value: 'O(1)' },
        { label: 'Peek', value: 'O(1)' },
        { label: 'Search', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'FIFO ordering — fairest arrival-order processing.',
        'Use a ring buffer or linked list for O(1) both ends.',
        'Deque variant allows both-end access.',
        'Foundation of breadth-first search.'
      ],
      useCases: [
        'Task/job scheduling and buffers',
        'Breadth-first search',
        'Rate limiting & producer-consumer pipelines'
      ],
      codeLang: 'typescript',
      code: `class Queue<T> {
  private items: T[] = [];
  enqueue(x: T) { this.items.push(x); }
  dequeue(): T | undefined { return this.items.shift(); }
  get front(): T | undefined { return this.items[0]; }
}`
    },
    {
      id: 5,
      name: 'Hash Table',
      icon: '#️⃣',
      category: 'Data Structure',
      summary: 'Key → value map with average O(1) access.',
      description:
        'A hash table maps keys to buckets via a hash function, giving average O(1) insert, delete and lookup. Collisions are handled by chaining or open addressing; a poor hash or heavy load degrades operations toward O(n).',
      complexity: [
        { label: 'Search', value: 'O(1) avg' },
        { label: 'Insert', value: 'O(1) avg' },
        { label: 'Delete', value: 'O(1) avg' },
        { label: 'Worst case', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'Average O(1) for the core operations.',
        'Needs a good hash function to avoid clustering.',
        'Collisions resolved via chaining or open addressing.',
        'Unordered — no sorted traversal.'
      ],
      useCases: [
        'Caches, indexes and de-duplication',
        'Counting frequencies',
        'Fast membership tests'
      ],
      codeLang: 'typescript',
      code: `const counts = new Map<string, number>();

for (const word of ['a', 'b', 'a']) {
  counts.set(word, (counts.get(word) ?? 0) + 1);
}
// counts -> { a: 2, b: 1 }`
    },
    {
      id: 6,
      name: 'Binary Search Tree',
      icon: '🌳',
      category: 'Data Structure',
      summary: 'Ordered tree with O(log n) search when balanced.',
      description:
        'A binary search tree keeps left descendants smaller and right descendants larger than each node, enabling ordered traversal and O(log n) search when balanced. Without balancing it can degrade to a linked list (O(n)); self-balancing variants (AVL, Red-Black) guarantee the log bound.',
      complexity: [
        { label: 'Search', value: 'O(log n) avg' },
        { label: 'Insert', value: 'O(log n) avg' },
        { label: 'Delete', value: 'O(log n) avg' },
        { label: 'Worst case', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'In-order traversal yields sorted output.',
        'Balanced trees keep operations at O(log n).',
        'Degenerates to O(n) if inserted in sorted order.',
        'Red-Black/AVL trees self-balance.'
      ],
      useCases: [
        'Ordered maps and sets',
        'Range queries',
        'Database and filesystem indexes'
      ],
      codeLang: 'typescript',
      code: `function search(node: any, key: number): boolean {
  if (!node) return false;
  if (key === node.value) return true;
  return key < node.value
    ? search(node.left, key)
    : search(node.right, key);
}`
    },
    {
      id: 7,
      name: 'Heap / Priority Queue',
      icon: '⛰️',
      category: 'Data Structure',
      summary: 'Complete tree giving O(1) access to min/max.',
      description:
        'A binary heap is a complete tree where each parent outranks its children (min-heap or max-heap). It gives O(1) peek at the extreme element and O(log n) insert/extract, making it the backbone of priority queues and several graph algorithms.',
      complexity: [
        { label: 'Peek min/max', value: 'O(1)' },
        { label: 'Insert', value: 'O(log n)' },
        { label: 'Extract', value: 'O(log n)' },
        { label: 'Build heap', value: 'O(n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'Constant-time access to the highest priority element.',
        'Stored compactly in an array (no pointers).',
        'Build from an array in linear time.',
        'Powers heapsort and Dijkstra.'
      ],
      useCases: [
        'Priority queues and schedulers',
        'Dijkstra & Prim graph algorithms',
        'Top-K / streaming median problems'
      ],
      codeLang: 'typescript',
      code: `// Sift-up after inserting at the end
function siftUp(heap: number[], i: number) {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent] <= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
}`
    },
    {
      id: 8,
      name: 'Graph',
      icon: '🕸️',
      category: 'Data Structure',
      summary: 'Vertices connected by edges — models relationships.',
      description:
        'A graph is a set of vertices connected by edges, directed or undirected, weighted or not. Adjacency lists are memory-efficient for sparse graphs while adjacency matrices give O(1) edge checks for dense ones. Graphs model networks, maps, dependencies and more.',
      complexity: [
        { label: 'Add vertex', value: 'O(1)' },
        { label: 'Add edge', value: 'O(1)' },
        { label: 'Edge check (list)', value: 'O(deg)' },
        { label: 'Edge check (matrix)', value: 'O(1)' },
        { label: 'Space (list)', value: 'O(V + E)' }
      ],
      keyPoints: [
        'Directed vs undirected, weighted vs unweighted.',
        'Adjacency list: great for sparse graphs.',
        'Adjacency matrix: O(1) edge checks, O(V²) space.',
        'Traversed with BFS or DFS.'
      ],
      useCases: [
        'Social & road networks, maps',
        'Dependency resolution / scheduling',
        'Recommendation and routing engines'
      ],
      codeLang: 'typescript',
      code: `// Adjacency list
const graph = new Map<number, number[]>();

function addEdge(u: number, v: number) {
  graph.set(u, [...(graph.get(u) ?? []), v]);
  graph.set(v, [...(graph.get(v) ?? []), u]); // undirected
}`
    },
    {
      id: 9,
      name: 'Trie',
      icon: '🔤',
      category: 'Data Structure',
      summary: 'Prefix tree for fast string lookups.',
      description:
        'A trie stores strings by sharing common prefixes along tree paths. Lookup, insert and prefix search cost O(L) in the length of the word, independent of how many words are stored — ideal for autocomplete and dictionaries.',
      complexity: [
        { label: 'Search', value: 'O(L)' },
        { label: 'Insert', value: 'O(L)' },
        { label: 'Prefix query', value: 'O(L)' },
        { label: 'Space', value: 'O(N·Σ)' }
      ],
      keyPoints: [
        'Operation cost depends on word length, not word count.',
        'Shares prefixes to save space across similar words.',
        'Natural fit for prefix / autocomplete queries.',
        'Can be memory-heavy for large alphabets.'
      ],
      useCases: [
        'Autocomplete & spell-check',
        'IP routing (longest-prefix match)',
        'Dictionary / word-game engines'
      ],
      codeLang: 'typescript',
      code: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}

function insert(root: TrieNode, word: string) {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
    node = node.children.get(ch)!;
  }
  node.isEnd = true;
}`
    },
    {
      id: 10,
      name: 'Bubble Sort',
      icon: '🫧',
      category: 'Sorting',
      summary: 'Repeatedly swap adjacent out-of-order pairs.',
      description:
        'Bubble sort walks the list repeatedly, swapping adjacent elements that are out of order until no swaps remain. It is simple and stable but quadratic, so it is used mainly for teaching and tiny or nearly-sorted inputs.',
      complexity: [
        { label: 'Best', value: 'O(n)' },
        { label: 'Average', value: 'O(n²)' },
        { label: 'Worst', value: 'O(n²)' },
        { label: 'Space', value: 'O(1)' }
      ],
      keyPoints: [
        'Stable and in-place.',
        'O(n) on already-sorted data with an early-exit flag.',
        'Quadratic in general — avoid for large inputs.',
        'Mostly educational.'
      ],
      useCases: [
        'Teaching sorting fundamentals',
        'Very small or nearly-sorted arrays'
      ],
      codeLang: 'typescript',
      code: `function bubbleSort(a: number[]): number[] {
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return a;
}`
    },
    {
      id: 11,
      name: 'Merge Sort',
      icon: '🔀',
      category: 'Sorting',
      summary: 'Divide, sort halves, then merge — stable O(n log n).',
      description:
        'Merge sort splits the array in half, sorts each half recursively, then merges the sorted halves. It guarantees O(n log n) in all cases and is stable, at the cost of O(n) auxiliary space — the go-to for linked lists and external sorting.',
      complexity: [
        { label: 'Best', value: 'O(n log n)' },
        { label: 'Average', value: 'O(n log n)' },
        { label: 'Worst', value: 'O(n log n)' },
        { label: 'Space', value: 'O(n)' }
      ],
      keyPoints: [
        'Guaranteed O(n log n) regardless of input.',
        'Stable — preserves equal-key order.',
        'Needs O(n) extra space to merge.',
        'Excellent for linked lists and huge/external data.'
      ],
      useCases: [
        'Stable sorting requirements',
        'Sorting linked lists',
        'External / on-disk sorting'
      ],
      codeLang: 'typescript',
      code: `function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return [...out, ...left.slice(i), ...right.slice(j)];
}`
    },
    {
      id: 12,
      name: 'Quick Sort',
      icon: '⚡',
      category: 'Sorting',
      summary: 'Partition around a pivot — fast in practice.',
      description:
        'Quick sort picks a pivot, partitions elements into smaller/larger groups, then recurses. It averages O(n log n) with excellent constants and sorts in place, but a poor pivot on adversarial input can degrade to O(n²) — mitigated by randomized or median-of-three pivots.',
      complexity: [
        { label: 'Best', value: 'O(n log n)' },
        { label: 'Average', value: 'O(n log n)' },
        { label: 'Worst', value: 'O(n²)' },
        { label: 'Space', value: 'O(log n)' }
      ],
      keyPoints: [
        'Fastest general-purpose sort in practice.',
        'In-place with small memory overhead.',
        'Not stable by default.',
        'Randomize the pivot to avoid the O(n²) worst case.'
      ],
      useCases: [
        'General-purpose in-memory sorting',
        'When average speed matters more than stability'
      ],
      codeLang: 'typescript',
      code: `function quickSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const [pivot, ...rest] = a;
  const left = rest.filter(x => x < pivot);
  const right = rest.filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`
    },
    {
      id: 13,
      name: 'Linear Search',
      icon: '➡️',
      category: 'Searching',
      summary: 'Scan every element until a match is found.',
      description:
        'Linear search checks elements one by one until it finds the target or exhausts the collection. It needs no ordering and works on any iterable, but is O(n) — fine for small or unsorted data.',
      complexity: [
        { label: 'Best', value: 'O(1)' },
        { label: 'Average', value: 'O(n)' },
        { label: 'Worst', value: 'O(n)' },
        { label: 'Space', value: 'O(1)' }
      ],
      keyPoints: [
        'Works on unsorted data.',
        'No preprocessing required.',
        'Simple but linear in the worst case.',
        'Baseline when data is small or unordered.'
      ],
      useCases: [
        'Small or unsorted collections',
        'One-off lookups where sorting is not worth it'
      ],
      codeLang: 'typescript',
      code: `function linearSearch(a: number[], target: number): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === target) return i;
  }
  return -1;
}`
    },
    {
      id: 14,
      name: 'Binary Search',
      icon: '🎯',
      category: 'Searching',
      summary: 'Halve a sorted range each step — O(log n).',
      description:
        'Binary search repeatedly halves a sorted range, comparing the target to the middle element to decide which half to keep. It finds an element in O(log n) but requires the data to be sorted first.',
      complexity: [
        { label: 'Best', value: 'O(1)' },
        { label: 'Average', value: 'O(log n)' },
        { label: 'Worst', value: 'O(log n)' },
        { label: 'Space', value: 'O(1)' }
      ],
      keyPoints: [
        'Requires sorted input.',
        'Logarithmic — extremely fast even on huge arrays.',
        'Watch for mid overflow and off-by-one bounds.',
        'Generalizes to "search on the answer" problems.'
      ],
      useCases: [
        'Lookups in sorted arrays',
        'Finding boundaries / first-true predicates',
        'Binary search on the answer space'
      ],
      codeLang: 'typescript',
      code: `function binarySearch(a: number[], target: number): number {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`
    },
    {
      id: 15,
      name: 'Breadth-First Search',
      icon: '🌊',
      category: 'Graph',
      summary: 'Explore level by level using a queue.',
      description:
        'BFS explores a graph in expanding rings from the source, visiting all neighbours before going deeper. Backed by a queue, it finds the shortest path in unweighted graphs and runs in O(V + E).',
      complexity: [
        { label: 'Time', value: 'O(V + E)' },
        { label: 'Space', value: 'O(V)' },
        { label: 'Shortest path', value: 'unweighted' }
      ],
      keyPoints: [
        'Uses a queue (FIFO).',
        'Finds shortest paths in unweighted graphs.',
        'Visits nodes in order of distance from the source.',
        'Track visited nodes to avoid cycles.'
      ],
      useCases: [
        'Shortest path in unweighted graphs',
        'Level-order tree traversal',
        'Connected components / flood fill'
      ],
      codeLang: 'typescript',
      code: `function bfs(graph: Map<number, number[]>, start: number): number[] {
  const visited = new Set([start]);
  const queue = [start];
  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of graph.get(node) ?? []) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return order;
}`
    },
    {
      id: 16,
      name: 'Depth-First Search',
      icon: '🧭',
      category: 'Graph',
      summary: 'Go as deep as possible, then backtrack.',
      description:
        'DFS follows one path as far as it can before backtracking, using recursion or an explicit stack. It runs in O(V + E) and is the basis for cycle detection, topological sorting and connectivity checks.',
      complexity: [
        { label: 'Time', value: 'O(V + E)' },
        { label: 'Space', value: 'O(V)' },
        { label: 'Backtracks', value: 'yes' }
      ],
      keyPoints: [
        'Uses recursion or an explicit stack (LIFO).',
        'Foundation for topological sort & cycle detection.',
        'Lower memory than BFS on wide graphs.',
        'Track visited nodes to avoid infinite loops.'
      ],
      useCases: [
        'Cycle detection & topological sort',
        'Path finding / maze solving',
        'Connected components'
      ],
      codeLang: 'typescript',
      code: `function dfs(graph: Map<number, number[]>, node: number,
             visited = new Set<number>(), order: number[] = []): number[] {
  visited.add(node);
  order.push(node);
  for (const next of graph.get(node) ?? []) {
    if (!visited.has(next)) dfs(graph, next, visited, order);
  }
  return order;
}`
    },
    {
      id: 17,
      name: "Dijkstra's Algorithm",
      icon: '🛣️',
      category: 'Graph',
      summary: 'Shortest paths on non-negative weighted graphs.',
      description:
        "Dijkstra's algorithm finds the shortest path from a source to all vertices in a graph with non-negative edge weights. Using a min-heap it runs in O((V + E) log V), greedily settling the closest unvisited node each step.",
      complexity: [
        { label: 'Time (heap)', value: 'O((V+E) log V)' },
        { label: 'Space', value: 'O(V)' },
        { label: 'Weights', value: 'non-negative' }
      ],
      keyPoints: [
        'Requires non-negative edge weights.',
        'Greedy: settle the nearest unvisited node each step.',
        'A min-heap gives the efficient bound.',
        'Use Bellman-Ford when negative edges exist.'
      ],
      useCases: [
        'GPS & network routing',
        'Least-cost pathfinding',
        'Latency / travel-time optimisation'
      ],
      codeLang: 'typescript',
      code: `// dist[v] = shortest known distance from source to v
function relax(dist: number[], u: number, v: number, w: number,
               heap: [number, number][]) {
  if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    heap.push([dist[v], v]); // push updated distance
  }
}`
    },
    {
      id: 18,
      name: 'Two Pointers',
      icon: '👆',
      category: 'Technique',
      summary: 'Two indices sweep a sequence in O(n).',
      description:
        'The two-pointer technique uses two indices that move through a (usually sorted) sequence — toward each other or in the same direction — to solve pair/subarray problems in linear time and constant space instead of nested loops.',
      complexity: [
        { label: 'Time', value: 'O(n)' },
        { label: 'Space', value: 'O(1)' },
        { label: 'Often needs', value: 'sorted input' }
      ],
      keyPoints: [
        'Replaces O(n²) nested loops with O(n).',
        'Common on sorted arrays and linked lists.',
        'Opposite-ends or fast/slow variants.',
        'Constant extra space.'
      ],
      useCases: [
        'Pair-sum / 3-sum problems',
        'Removing duplicates in place',
        'Cycle detection (fast/slow pointers)'
      ],
      codeLang: 'typescript',
      code: `// Does a sorted array contain a pair summing to target?
function hasPair(a: number[], target: number): boolean {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const sum = a[lo] + a[hi];
    if (sum === target) return true;
    sum < target ? lo++ : hi--;
  }
  return false;
}`
    },
    {
      id: 19,
      name: 'Sliding Window',
      icon: '🪟',
      category: 'Technique',
      summary: 'Maintain a moving range to avoid recomputation.',
      description:
        'The sliding-window technique keeps a contiguous range and slides its edges instead of recomputing from scratch, turning many subarray/substring problems from O(n²) into O(n). Windows can be fixed-size or grow/shrink to satisfy a constraint.',
      complexity: [
        { label: 'Time', value: 'O(n)' },
        { label: 'Space', value: 'O(1) – O(k)' },
        { label: 'Window', value: 'fixed / dynamic' }
      ],
      keyPoints: [
        'Reuse work as the window moves.',
        'Fixed-size or variable (grow/shrink) windows.',
        'Great for contiguous subarray/substring problems.',
        'Often paired with a hash map for counts.'
      ],
      useCases: [
        'Max sum of size-k subarray',
        'Longest substring without repeats',
        'Rate limiting over time windows'
      ],
      codeLang: 'typescript',
      code: `// Max sum of any window of size k
function maxWindow(a: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  for (let i = k; i < a.length; i++) {
    sum += a[i] - a[i - k]; // slide: add new, drop old
    best = Math.max(best, sum);
  }
  return best;
}`
    },
    {
      id: 20,
      name: 'Recursion',
      icon: '🔁',
      category: 'Technique',
      summary: 'Solve a problem via smaller self-similar cases.',
      description:
        'Recursion expresses a problem in terms of smaller instances of itself, with a base case that stops the descent. It yields elegant solutions for trees, divide-and-conquer and backtracking, but each call uses stack space and unmemoised overlap can explode exponentially.',
      complexity: [
        { label: 'Depth', value: 'O(depth) stack' },
        { label: 'Naïve overlap', value: 'exponential' },
        { label: 'With memo', value: 'polynomial' }
      ],
      keyPoints: [
        'Always define a base case.',
        'Each call consumes stack space.',
        'Memoise overlapping subproblems.',
        'Deep recursion can overflow the stack — consider iteration.'
      ],
      useCases: [
        'Tree / graph traversal',
        'Divide-and-conquer algorithms',
        'Backtracking (permutations, N-Queens)'
      ],
      codeLang: 'typescript',
      code: `function factorial(n: number): number {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive case
}`
    },
    {
      id: 21,
      name: 'Dynamic Programming',
      icon: '💎',
      category: 'Technique',
      summary: 'Cache overlapping subproblems for big speedups.',
      description:
        'Dynamic programming solves problems that have optimal substructure and overlapping subproblems by storing each subresult once. Top-down memoisation or bottom-up tables turn exponential recursions into polynomial time.',
      complexity: [
        { label: 'Typical time', value: 'O(n·states)' },
        { label: 'Space', value: 'O(states)' },
        { label: 'Needs', value: 'overlapping subproblems' }
      ],
      keyPoints: [
        'Requires optimal substructure + overlapping subproblems.',
        'Top-down (memoise) or bottom-up (tabulate).',
        'Space can often be reduced to O(1)–O(n).',
        'Define the state and transition clearly first.'
      ],
      useCases: [
        'Knapsack, coin change, edit distance',
        'Longest common subsequence',
        'Optimal path / interval problems'
      ],
      codeLang: 'typescript',
      code: `// Fibonacci with memoisation: O(n) instead of O(2^n)
function fib(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}`
    }
  ];

  get filteredTopics(): DsaTopic[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.topics.filter(topic => {
      const matchesCategory =
        this.activeFilter === 'All' || topic.category === this.activeFilter;
      const matchesSearch =
        !term ||
        topic.name.toLowerCase().includes(term) ||
        topic.summary.toLowerCase().includes(term) ||
        topic.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  setFilter(value: DsaCategory | 'All'): void {
    this.activeFilter = value;
  }

  countFor(value: DsaCategory | 'All'): number {
    if (value === 'All') return this.topics.length;
    return this.topics.filter(t => t.category === value).length;
  }

  openTopic(topic: DsaTopic): void {
    this.selectedTopic = topic;
  }

  closeTopic(): void {
    this.selectedTopic = null;
  }

  trackById(_index: number, topic: DsaTopic): number {
    return topic.id;
  }
}

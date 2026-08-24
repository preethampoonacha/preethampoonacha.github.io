import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AlgorithmPattern {
  id: string;
  name: string;
  story: string;
  explanation: string;
  animationClass: string;
}

interface DsaTopic {
  id: string;
  title: string;
  character: string;
  description: string;
  concept: string;
  icon: string;
  color: string;
  patterns?: AlgorithmPattern[];
}

@Component({
  selector: 'app-dsa-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dsa-roadmap.component.html',
  styleUrls: ['./dsa-roadmap.component.css']
})
export class DsaRoadmapComponent {
  topics: DsaTopic[] = [
    {
      id: 'arrays',
      title: 'Arrays',
      character: 'Henry the Penguin',
      description: 'Henry loves things neat and orderly! An Array is just like Henry’s spoon collection: a fixed number of items lined up perfectly next to each other in memory.',
      concept: 'A contiguous block of memory to store elements of the same type.',
      icon: '🥄',
      color: '#4fc3f7',
      patterns: [
        {
          id: 'basic',
          name: 'Basic Array',
          story: 'Henry lays out his favorite spoons in a row. Since they are all lined up perfectly, he can instantly grab the 3rd spoon without having to check the first two.',
          explanation: 'Elements are stored in contiguous memory. Accessing an element by its index is an O(1) operation because the memory address can be calculated directly.',
          animationClass: 'anim-basic-array'
        },
        {
          id: 'two-pointers',
          name: 'Two Pointers',
          story: 'Henry\'s spoons are sorted by size. To find two spoons that add up to a specific length, he places his left flipper on the smallest spoon and his right flipper on the largest, moving them inward until he finds the perfect pair.',
          explanation: 'Two pointers move through an array from opposite ends (or same direction). It is highly efficient (O(N)) for searching pairs in a sorted array or reversing elements.',
          animationClass: 'anim-two-pointers'
        },
        {
          id: 'sliding-window',
          name: 'Sliding Window',
          story: 'Henry wants to find the 3 shiniest consecutive spoons. Instead of picking up 3 new spoons every time, he slides a picture frame over them, dropping the leftmost spoon and adding the next one on the right.',
          explanation: 'A window of a certain size slides over the array. It optimizes O(N^2) subarray problems down to O(N) by reusing overlapping work.',
          animationClass: 'anim-sliding-window'
        },
        {
          id: 'prefix-sum',
          name: 'Prefix Sum',
          story: 'Henry wants to quickly know the total weight of any range of spoons. He writes down a running total below them, so he can just subtract two totals instead of weighing them all again!',
          explanation: 'Precomputing a cumulative sum array allows you to answer range sum queries in O(1) time after an O(N) preprocessing step.',
          animationClass: 'anim-prefix-sum'
        }
      ]
    },
    {
      id: 'linked-lists',
      title: 'Linked Lists',
      character: 'Weenie the Dog',
      description: 'Weenie is chasing a magical string of sausages! Each sausage (Node) holds some meat (Data) and a string pointing to the next sausage (Pointer).',
      concept: 'A sequence of elements where each element points to the next, allowing dynamic memory allocation.',
      icon: '🌭',
      color: '#ffb74d',
      patterns: [
        {
          id: 'fast-slow-pointers',
          name: 'Fast & Slow Pointers',
          story: 'Weenie is chasing a sausage string with a friend. Weenie runs fast (2 sausages at a time), while his friend runs slow (1 sausage at a time). If the string is a loop, Weenie will eventually catch up to his friend from behind!',
          explanation: 'Used to detect cycles, find the middle element, or find the kth element from the end of a linked list in O(N) time and O(1) space.',
          animationClass: 'anim-fast-slow'
        },
        {
          id: 'reversal',
          name: 'In-place Reversal',
          story: 'Weenie wants to eat the sausages in the opposite order. He goes down the line, carefully untying the string between each sausage and tying it backwards to the previous one.',
          explanation: 'Reversing links between nodes without using extra memory. Essential for problems like palindromes or reversing sub-lists.',
          animationClass: 'anim-reversal'
        },
        {
          id: 'dummy-node',
          name: 'Dummy Node',
          story: 'To make sure he doesn\'t lose the start of the string, Weenie ties a fake rubber sausage to the very beginning. This way, even if the first real sausage is eaten, the string never gets lost!',
          explanation: 'A dummy head node simplifies edge cases like inserting/deleting the head node or merging multiple lists.',
          animationClass: 'anim-dummy-node'
        }
      ]
    },
    {
      id: 'stacks',
      title: 'Stacks',
      character: 'Oswald',
      description: 'Oswald is making a tall stack of pancakes. He adds a new pancake on top (Push), and when he wants to eat, he takes the top one off (Pop). Last pancake on is the first to be eaten!',
      concept: 'A LIFO (Last-In-First-Out) data structure.',
      icon: '🥞',
      color: '#64b5f6',
      patterns: [
        {
          id: 'monotonic-stack',
          name: 'Monotonic Stack',
          story: 'Oswald wants a perfect tower. Whenever he brings a new pancake, he removes all the smaller pancakes from the top before placing the new one, ensuring the stack strictly decreases in size.',
          explanation: 'A stack that maintains its elements in a sorted (increasing or decreasing) order. Useful for "next greater element" or "daily temperatures" problems.',
          animationClass: 'anim-monotonic-stack'
        },
        {
          id: 'valid-parentheses',
          name: 'Valid Parentheses',
          story: 'Oswald stacks a blueberry pancake, then a chocolate one. When he gets a chocolate-eating order, it must match the top pancake. If not, the order is invalid!',
          explanation: 'Stacks perfectly model matching structures. Every closing bracket must match the most recently opened (top of the stack) unclosed bracket.',
          animationClass: 'anim-valid-parentheses'
        }
      ]
    },
    {
      id: 'queues',
      title: 'Queues',
      character: 'Madame Butterfly',
      description: 'Customers are waiting in line at Madame Butterfly\'s Diner. The first customer who gets in line (Enqueue) is the first one served (Dequeue).',
      concept: 'A FIFO (First-In-First-Out) data structure.',
      icon: '🦋',
      color: '#f06292',
      patterns: [
        {
          id: 'bfs-queue',
          name: 'BFS (Breadth-First Search)',
          story: 'Madame Butterfly serves tables radially. She serves all tables 1 meter away, then all tables 2 meters away. She uses her order queue to keep track of who is next at the current distance.',
          explanation: 'Queues are the core data structure for BFS, ensuring nodes are processed level-by-level based on their distance from the source.',
          animationClass: 'anim-bfs-queue'
        },
        {
          id: 'sliding-window-max',
          name: 'Monotonic Queue',
          story: 'Madame Butterfly looks out her diner window. As new VIP customers walk into view, she ignores regular customers behind them. The queue only keeps track of the absolute most important VIP currently visible.',
          explanation: 'A deque (double-ended queue) used to find the maximum/minimum in a sliding window in O(N) time by removing useless elements from the back.',
          animationClass: 'anim-sliding-max'
        }
      ]
    },
    {
      id: 'trees',
      title: 'Trees',
      character: 'Daisy',
      description: 'Daisy the sunflower starts as a single root, then branches out to her beautiful leaves. Trees help us organize things hierarchically, like a family tree or a sunny plant!',
      concept: 'A hierarchical data structure with a root node and child nodes.',
      icon: '🌻',
      color: '#81c784',
      patterns: [
        {
          id: 'dfs-tree',
          name: 'DFS (Depth-First Search)',
          story: 'A little ladybug climbs Daisy, picking a single branch and crawling all the way to the very tip of the leaf before turning back to explore another branch.',
          explanation: 'Traversing deep into a tree using recursion or a stack. Includes Pre-order, In-order, and Post-order traversals.',
          animationClass: 'anim-dfs-tree'
        },
        {
          id: 'level-order',
          name: 'Level Order Traversal',
          story: 'The sun shines down on Daisy, lighting up the top flower first, then the next row of leaves, and finally the bottom leaves all at once.',
          explanation: 'Using a Queue (BFS) to visit all nodes at depth 1, then depth 2, etc. Excellent for finding the shortest path in unweighted structures.',
          animationClass: 'anim-level-order'
        },
        {
          id: 'bst',
          name: 'Binary Search Tree (BST)',
          story: 'Daisy grows left branches for small leaves and right branches for large leaves. If a ladybug wants a size 5 leaf, it knows exactly which way to turn at every junction!',
          explanation: 'A tree where the left child is smaller and right child is larger than the parent. Average search/insert/delete time is O(log N).',
          animationClass: 'anim-bst'
        }
      ]
    },
    {
      id: 'graphs',
      title: 'Graphs',
      character: 'Big City',
      description: 'The map of Big City! Oswald’s house, Henry’s apartment, and the diner are connected by roads. A Graph is just places (Vertices) connected by paths (Edges).',
      concept: 'A collection of nodes and edges connecting them, used to model networks.',
      icon: '🏙️',
      color: '#ba68c8',
      patterns: [
        {
          id: 'topological-sort',
          name: 'Topological Sort',
          story: 'Before going to the Diner, Oswald MUST visit the bank. Before the bank, he MUST leave his house. The city map enforces an exact order of errands so he doesn\'t get stuck.',
          explanation: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v. Solved with DFS or Kahn\'s Algorithm.',
          animationClass: 'anim-topo-sort'
        },
        {
          id: 'shortest-path',
          name: 'Shortest Path (Dijkstra)',
          story: 'Oswald needs to get to the park fast! He checks all neighboring streets, always taking the road that offers the smallest total travel time from his house so far.',
          explanation: 'Finding the minimum weight path between nodes in a weighted graph using a Priority Queue.',
          animationClass: 'anim-shortest-path'
        }
      ]
    }
  ];

  selectedTopic: DsaTopic = this.topics[0];
  selectedPattern: AlgorithmPattern | null = this.topics[0].patterns ? this.topics[0].patterns[0] : null;

  selectTopic(topic: DsaTopic) {
    this.selectedTopic = topic;
    this.selectedPattern = topic.patterns && topic.patterns.length > 0 ? topic.patterns[0] : null;
  }

  selectPattern(pattern: AlgorithmPattern) {
    this.selectedPattern = pattern;
  }
}

export interface AlgorithmPattern {
  id: string;
  name: string;
  story: string;
  explanation: string;
  animationClass: string;
}

export interface DsaTopic {
  id: string;
  title: string;
  character: string;
  description: string;
  concept: string;
  icon: string;
  color: string;
  patterns?: AlgorithmPattern[];
}

export interface ThemeDefinition {
  id: string;
  name: string;
  icon: string;
  topics: DsaTopic[];
}

export const DSA_THEMES: ThemeDefinition[] = [
  {
    id: 'oswald',
    name: 'Oswald',
    icon: '🐙',
    topics: [
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
    ]
  },
  {
    id: 'tom-jerry',
    name: 'Tom & Jerry',
    icon: '🐱',
    topics: [
      {
        id: 'arrays',
        title: 'Arrays',
        character: 'Tom',
        description: 'Tom lines up 10 mousetraps perfectly in a row outside Jerry\'s hole to catch him.',
        concept: 'A contiguous block of memory to store elements of the same type.',
        icon: '🧀',
        color: '#e57373',
        patterns: [
          {
            id: 'basic',
            name: 'Basic Array',
            story: 'Tom knows exactly where trap #4 is. He doesn\'t need to check traps 1, 2, and 3 to find it!',
            explanation: 'Elements are stored in contiguous memory. Accessing an element by its index is an O(1) operation.',
            animationClass: 'anim-basic-array'
          },
          {
            id: 'two-pointers',
            name: 'Two Pointers',
            story: 'Tom and Spike start from opposite ends of the trap line to quickly find a missing piece of cheese before Jerry gets it.',
            explanation: 'Two pointers move through an array from opposite ends (or same direction) efficiently in O(N) time.',
            animationClass: 'anim-two-pointers'
          },
          {
            id: 'sliding-window',
            name: 'Sliding Window',
            story: 'Jerry shines a small flashlight beam over exactly 3 traps at a time, sliding it along to find the safest spot to run.',
            explanation: 'A window of a certain size slides over the array, optimizing O(N^2) subarray problems to O(N).',
            animationClass: 'anim-sliding-window'
          },
          {
            id: 'prefix-sum',
            name: 'Prefix Sum',
            story: 'Jerry calculates the total danger level of all traps up to each point, so he knows instantly how dangerous any section of the hallway is.',
            explanation: 'Precomputing a cumulative sum array allows you to answer range sum queries in O(1) time.',
            animationClass: 'anim-prefix-sum'
          }
        ]
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        character: 'Jerry',
        description: 'Jerry runs through a sequence of connected mouse holes inside the walls. Each hole leads to the next!',
        concept: 'A sequence of elements where each element points to the next.',
        icon: '🐭',
        color: '#f6b93b',
        patterns: [
          {
            id: 'fast-slow-pointers',
            name: 'Fast & Slow Pointers',
            story: 'Tom chases Jerry through the holes. Jerry runs fast (2 holes at a time) and Tom runs slow (1 hole at a time). If they are running in a circle, Jerry will lap Tom!',
            explanation: 'Used to detect cycles, find the middle element, or find the kth element from the end.',
            animationClass: 'anim-fast-slow'
          },
          {
            id: 'reversal',
            name: 'In-place Reversal',
            story: 'Jerry reverses the direction of all the mouse hole tunnels to trick Tom into running backwards.',
            explanation: 'Reversing links between nodes without using extra memory.',
            animationClass: 'anim-reversal'
          },
          {
            id: 'dummy-node',
            name: 'Dummy Node',
            story: 'Jerry places a fake mouse hole at the start of his escape route so Tom always starts looking in the wrong place.',
            explanation: 'A dummy head node simplifies edge cases like inserting/deleting the head node.',
            animationClass: 'anim-dummy-node'
          }
        ]
      },
      {
        id: 'stacks',
        title: 'Stacks',
        character: 'Tom',
        description: 'Tom is carrying a massive, towering stack of porcelain plates. He can only add to the top or take from the top without dropping them all!',
        concept: 'A LIFO (Last-In-First-Out) data structure.',
        icon: '🍽️',
        color: '#4a69bd',
        patterns: [
          {
            id: 'monotonic-stack',
            name: 'Monotonic Stack',
            story: 'Tom only stacks plates that are smaller than the one below it. If he gets a bigger plate, he throws all the smaller ones off the top first!',
            explanation: 'A stack that maintains its elements in a sorted order. Useful for "next greater element" problems.',
            animationClass: 'anim-monotonic-stack'
          },
          {
            id: 'valid-parentheses',
            name: 'Valid Parentheses',
            story: 'Tom matches a red cup on a red saucer, and a blue cup on a blue saucer. If the colors mismatch, Jerry breaks them!',
            explanation: 'Every closing bracket must match the most recently opened (top of the stack) unclosed bracket.',
            animationClass: 'anim-valid-parentheses'
          }
        ]
      },
      {
        id: 'queues',
        title: 'Queues',
        character: 'Spike',
        description: 'Spike the bulldog enforces a strict line for dogs waiting to get their bones. No cutting!',
        concept: 'A FIFO (First-In-First-Out) data structure.',
        icon: '🦴',
        color: '#78e08f',
        patterns: [
          {
            id: 'bfs-queue',
            name: 'BFS (Breadth-First Search)',
            story: 'Spike hands out bones to all the dogs closest to him first, before walking further down the yard to hand out the rest.',
            explanation: 'Queues are the core data structure for BFS, ensuring nodes are processed level-by-level.',
            animationClass: 'anim-bfs-queue'
          },
          {
            id: 'sliding-window-max',
            name: 'Monotonic Queue',
            story: 'Spike watches the line of dogs. He only cares about keeping an eye on the biggest, meanest dog currently visible in the line.',
            explanation: 'A deque used to find the maximum/minimum in a sliding window in O(N) time.',
            animationClass: 'anim-sliding-max'
          }
        ]
      },
      {
        id: 'trees',
        title: 'Trees',
        character: 'Family Tree',
        description: 'Tom reviews his rich family tree, branching from his wealthy aunt down to all his cousins.',
        concept: 'A hierarchical data structure with a root node and child nodes.',
        icon: '🌳',
        color: '#38ada9',
        patterns: [
          {
            id: 'dfs-tree',
            name: 'DFS (Depth-First Search)',
            story: 'Jerry climbs all the way up a single branch of the family tree poster to steal a piece of cheese at the top before coming down.',
            explanation: 'Traversing deep into a tree using recursion or a stack.',
            animationClass: 'anim-dfs-tree'
          },
          {
            id: 'level-order',
            name: 'Level Order Traversal',
            story: 'Tom reads the family tree row by row, looking at all the grandparents, then all the parents, then all the kids.',
            explanation: 'Using a Queue (BFS) to visit all nodes at each depth level.',
            animationClass: 'anim-level-order'
          },
          {
            id: 'bst',
            name: 'Binary Search Tree (BST)',
            story: 'The rich family members are on the right branches, and poor ones on the left. Tom quickly navigates right at every turn to find the inheritance!',
            explanation: 'A tree where the left child is smaller and right child is larger than the parent.',
            animationClass: 'anim-bst'
          }
        ]
      },
      {
        id: 'graphs',
        title: 'Graphs',
        character: 'Blueprint',
        description: 'The complex blueprint of traps throughout the house. Each room connects to multiple other rooms.',
        concept: 'A collection of nodes and edges connecting them, used to model networks.',
        icon: '🗺️',
        color: '#b71540',
        patterns: [
          {
            id: 'topological-sort',
            name: 'Topological Sort',
            story: 'Jerry must disable the tripwire before he can reach the anvil trap, and the anvil before the cage. He plans the perfect sequence of sabotage.',
            explanation: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG).',
            animationClass: 'anim-topo-sort'
          },
          {
            id: 'shortest-path',
            name: 'Shortest Path (Dijkstra)',
            story: 'Tom calculates the absolute shortest route through the living room, kitchen, and hallway to cut Jerry off before he reaches his hole.',
            explanation: 'Finding the minimum weight path between nodes in a weighted graph using a Priority Queue.',
            animationClass: 'anim-shortest-path'
          }
        ]
      }
    ]
  },
  {
    id: 'friends',
    name: 'Friends TV Show',
    icon: '☕',
    topics: [
      {
        id: 'arrays',
        title: 'Arrays',
        character: 'Monica',
        description: 'Monica organizes her kitchen mugs in a perfect, rigid line. Everything must be perfectly contiguous!',
        concept: 'A contiguous block of memory to store elements of the same type.',
        icon: '☕',
        color: '#8e44ad',
        patterns: [
          {
            id: 'basic',
            name: 'Basic Array',
            story: 'Monica knows exactly where the 4th mug is placed without looking, because she indexed them in her mind.',
            explanation: 'Elements are stored in contiguous memory. Accessing an element by its index is an O(1) operation.',
            animationClass: 'anim-basic-array'
          },
          {
            id: 'two-pointers',
            name: 'Two Pointers',
            story: 'Monica and Chandler wipe the kitchen counters starting from opposite ends until they meet in the middle.',
            explanation: 'Two pointers move through an array from opposite ends (or same direction) efficiently in O(N) time.',
            animationClass: 'anim-two-pointers'
          },
          {
            id: 'sliding-window',
            name: 'Sliding Window',
            story: 'Phoebe observes 3 consecutive days of Monica\'s obsessive cleaning habits at a time to find the craziest 3-day stretch.',
            explanation: 'A window of a certain size slides over the array, optimizing O(N^2) subarray problems to O(N).',
            animationClass: 'anim-sliding-window'
          },
          {
            id: 'prefix-sum',
            name: 'Prefix Sum',
            story: 'Ross calculates the total money he has spent on divorces up to each year, allowing him to instantly find how much he spent in the 90s.',
            explanation: 'Precomputing a cumulative sum array allows you to answer range sum queries in O(1) time.',
            animationClass: 'anim-prefix-sum'
          }
        ]
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        character: 'Gossip Chain',
        description: 'The chain of gossip! Rachel tells Phoebe, who points to Ross, who points to Joey.',
        concept: 'A sequence of elements where each element points to the next.',
        icon: '🗣️',
        color: '#2980b9',
        patterns: [
          {
            id: 'fast-slow-pointers',
            name: 'Fast & Slow Pointers',
            story: 'Word travels fast among the Friends. The rumor spreads 2 people at a time, while the truth spreads 1 person at a time, until the rumor catches up with itself in a loop!',
            explanation: 'Used to detect cycles, find the middle element, or find the kth element from the end.',
            animationClass: 'anim-fast-slow'
          },
          {
            id: 'reversal',
            name: 'In-place Reversal',
            story: 'Monica traces the gossip back to its source by reversing who told whom until she finds out who started it.',
            explanation: 'Reversing links between nodes without using extra memory.',
            animationClass: 'anim-reversal'
          },
          {
            id: 'dummy-node',
            name: 'Dummy Node',
            story: 'Chandler uses a fake name ("Miss Chanandler Bong") as the start of a rumor to protect himself.',
            explanation: 'A dummy head node simplifies edge cases like inserting/deleting the head node.',
            animationClass: 'anim-dummy-node'
          }
        ]
      },
      {
        id: 'stacks',
        title: 'Stacks',
        character: 'Joey',
        description: 'Joey is eating a massive stack of sandwiches. He eats the top one first! Joey doesn\'t share food!',
        concept: 'A LIFO (Last-In-First-Out) data structure.',
        icon: '🥪',
        color: '#e67e22',
        patterns: [
          {
            id: 'monotonic-stack',
            name: 'Monotonic Stack',
            story: 'Joey will only stack a sandwich if it has more meat than the one below it. If it doesn\'t, he eats the smaller ones until it fits the rule.',
            explanation: 'A stack that maintains its elements in a sorted order. Useful for "next greater element" problems.',
            animationClass: 'anim-monotonic-stack'
          },
          {
            id: 'valid-parentheses',
            name: 'Valid Parentheses',
            story: 'Ross makes sure his dinosaur bone replicas fit perfectly into their matching molds. If a T-Rex bone goes into a Raptor mold, it\'s a mismatch!',
            explanation: 'Every closing bracket must match the most recently opened (top of the stack) unclosed bracket.',
            animationClass: 'anim-valid-parentheses'
          }
        ]
      },
      {
        id: 'queues',
        title: 'Queues',
        character: 'Central Perk',
        description: 'Gunther serves the line of customers waiting for coffee at Central Perk in a strict First-Come, First-Served order.',
        concept: 'A FIFO (First-In-First-Out) data structure.',
        icon: '☕',
        color: '#27ae60',
        patterns: [
          {
            id: 'bfs-queue',
            name: 'BFS (Breadth-First Search)',
            story: 'Gunther serves all the friends sitting on the orange couch first, then moves on to the people standing by the door.',
            explanation: 'Queues are the core data structure for BFS, ensuring nodes are processed level-by-level.',
            animationClass: 'anim-bfs-queue'
          },
          {
            id: 'sliding-window-max',
            name: 'Monotonic Queue',
            story: 'Gunther stares at Rachel as she walks back and forth behind the counter. He only keeps track of where she is, ignoring everyone else.',
            explanation: 'A deque used to find the maximum/minimum in a sliding window in O(N) time.',
            animationClass: 'anim-sliding-max'
          }
        ]
      },
      {
        id: 'trees',
        title: 'Trees',
        character: 'Phoebe',
        description: 'Phoebe maps out her eccentric family tree, trying to figure out who her real mother is.',
        concept: 'A hierarchical data structure with a root node and child nodes.',
        icon: '🎸',
        color: '#f1c40f',
        patterns: [
          {
            id: 'dfs-tree',
            name: 'DFS (Depth-First Search)',
            story: 'Phoebe follows a lead about her father, diving deep down a single branch of her family tree until it hits a dead end.',
            explanation: 'Traversing deep into a tree using recursion or a stack.',
            animationClass: 'anim-dfs-tree'
          },
          {
            id: 'level-order',
            name: 'Level Order Traversal',
            story: 'Phoebe looks at all her half-siblings on one level of the family tree before moving down to their kids.',
            explanation: 'Using a Queue (BFS) to visit all nodes at each depth level.',
            animationClass: 'anim-level-order'
          },
          {
            id: 'bst',
            name: 'Binary Search Tree (BST)',
            story: 'Phoebe organizes her songs. Sad songs (Smelly Cat) go left, happy songs go right. She finds the perfect song in log(N) time!',
            explanation: 'A tree where the left child is smaller and right child is larger than the parent.',
            animationClass: 'anim-bst'
          }
        ]
      },
      {
        id: 'graphs',
        title: 'Graphs',
        character: 'Relationships',
        description: 'The complex web of who dated whom in New York City.',
        concept: 'A collection of nodes and edges connecting them, used to model networks.',
        icon: '❤️',
        color: '#e74c3c',
        patterns: [
          {
            id: 'topological-sort',
            name: 'Topological Sort',
            story: 'Ross figures out the strict timeline of when they were "on a break". Event A MUST have happened before Event B.',
            explanation: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG).',
            animationClass: 'anim-topo-sort'
          },
          {
            id: 'shortest-path',
            name: 'Shortest Path (Dijkstra)',
            story: 'Chandler tries to find the shortest path of social connections to get tickets to a Rangers game.',
            explanation: 'Finding the minimum weight path between nodes in a weighted graph using a Priority Queue.',
            animationClass: 'anim-shortest-path'
          }
        ]
      }
    ]
  },
  {
    id: 'naruto',
    name: 'Naruto',
    icon: '🍥',
    topics: [
      {
        id: 'arrays',
        title: 'Arrays',
        character: 'Kunai Targets',
        description: 'Naruto lines up practice targets perfectly in a row. He can throw a shuriken at index 5 with his eyes closed!',
        concept: 'A contiguous block of memory to store elements of the same type.',
        icon: '🎯',
        color: '#ff9f43',
        patterns: [
          {
            id: 'basic',
            name: 'Basic Array',
            story: 'The target posts are spaced perfectly evenly. Naruto accesses the memory address of the 3rd post instantly.',
            explanation: 'Elements are stored in contiguous memory. Accessing an element by its index is an O(1) operation.',
            animationClass: 'anim-basic-array'
          },
          {
            id: 'two-pointers',
            name: 'Two Pointers',
            story: 'Naruto and Sasuke run towards each other from opposite ends of the training field to clash in the middle.',
            explanation: 'Two pointers move through an array from opposite ends (or same direction) efficiently in O(N) time.',
            animationClass: 'anim-two-pointers'
          },
          {
            id: 'sliding-window',
            name: 'Sliding Window',
            story: 'Kakashi uses his Sharingan to focus on a 3-second window of the enemy\'s hand signs, sliding it forward as time passes.',
            explanation: 'A window of a certain size slides over the array, optimizing O(N^2) subarray problems to O(N).',
            animationClass: 'anim-sliding-window'
          },
          {
            id: 'prefix-sum',
            name: 'Prefix Sum',
            story: 'Shikamaru pre-calculates the chakra consumption of all shadow clones up to a point, allowing him to instantly know if he has enough chakra left for a combo.',
            explanation: 'Precomputing a cumulative sum array allows you to answer range sum queries in O(1) time.',
            animationClass: 'anim-prefix-sum'
          }
        ]
      },
      {
        id: 'linked-lists',
        title: 'Linked Lists',
        character: 'Shinobi Alliance',
        description: 'The chain of communication. The Hokage tells the Jonin commander, who tells the Chunin squad leader.',
        concept: 'A sequence of elements where each element points to the next.',
        icon: '📜',
        color: '#10ac84',
        patterns: [
          {
            id: 'fast-slow-pointers',
            name: 'Fast & Slow Pointers',
            story: 'Minato (very fast) and a regular ninja (slow) run along the same patrol route. If the route is a loop, Minato will lap the regular ninja.',
            explanation: 'Used to detect cycles, find the middle element, or find the kth element from the end.',
            animationClass: 'anim-fast-slow'
          },
          {
            id: 'reversal',
            name: 'In-place Reversal',
            story: 'Pain reverses the chain of command, making the Genin give orders up to the Kage to cause chaos.',
            explanation: 'Reversing links between nodes without using extra memory.',
            animationClass: 'anim-reversal'
          },
          {
            id: 'dummy-node',
            name: 'Dummy Node',
            story: 'Naruto places a Shadow Clone as a dummy guard at the start of the line to take the first hit.',
            explanation: 'A dummy head node simplifies edge cases like inserting/deleting the head node.',
            animationClass: 'anim-dummy-node'
          }
        ]
      },
      {
        id: 'stacks',
        title: 'Stacks',
        character: 'Chakra Control',
        description: 'Naruto stacks leaves on his forehead to practice chakra control. He puts the newest leaf on top, and it falls off first!',
        concept: 'A LIFO (Last-In-First-Out) data structure.',
        icon: '🍃',
        color: '#54a0ff',
        patterns: [
          {
            id: 'monotonic-stack',
            name: 'Monotonic Stack',
            story: 'Naruto only stacks leaves that are larger than the one below it. Smaller leaves get blown away to maintain the perfect stack.',
            explanation: 'A stack that maintains its elements in a sorted order. Useful for "next greater element" problems.',
            animationClass: 'anim-monotonic-stack'
          },
          {
            id: 'valid-parentheses',
            name: 'Valid Parentheses',
            story: 'Sasuke matches fire chakra with wind chakra in his jutsu sequence perfectly. If he puts water where wind should be, the jutsu fails!',
            explanation: 'Every closing bracket must match the most recently opened (top of the stack) unclosed bracket.',
            animationClass: 'anim-valid-parentheses'
          }
        ]
      },
      {
        id: 'queues',
        title: 'Queues',
        character: 'Ichiraku Ramen',
        description: 'Waiting in line for Ichiraku Ramen! Teuchi serves the ninjas in the exact order they arrive (FIFO).',
        concept: 'A FIFO (First-In-First-Out) data structure.',
        icon: '🍜',
        color: '#ee5253',
        patterns: [
          {
            id: 'bfs-queue',
            name: 'BFS (Breadth-First Search)',
            story: 'Naruto sends his shadow clones to search the village radially, clearing sector 1 completely before moving to sector 2.',
            explanation: 'Queues are the core data structure for BFS, ensuring nodes are processed level-by-level.',
            animationClass: 'anim-bfs-queue'
          },
          {
            id: 'sliding-window-max',
            name: 'Monotonic Queue',
            story: 'Teuchi scans the line of waiting ninjas, only keeping track of who has the biggest appetite (Choji) in the current window of time.',
            explanation: 'A deque used to find the maximum/minimum in a sliding window in O(N) time.',
            animationClass: 'anim-sliding-max'
          }
        ]
      },
      {
        id: 'trees',
        title: 'Trees',
        character: 'Divine Tree',
        description: 'The Divine Tree branches out, channeling chakra into its countless roots and leaves.',
        concept: 'A hierarchical data structure with a root node and child nodes.',
        icon: '🌲',
        color: '#1dd1a1',
        patterns: [
          {
            id: 'dfs-tree',
            name: 'DFS (Depth-First Search)',
            story: 'Yamato uses Wood Style to grow a single root deep underground to its very tip before branching it out sideways.',
            explanation: 'Traversing deep into a tree using recursion or a stack.',
            animationClass: 'anim-dfs-tree'
          },
          {
            id: 'level-order',
            name: 'Level Order Traversal',
            story: 'The Infinite Tsukuyomi shines down on the tree, capturing everyone at the highest branches first, then the next level down.',
            explanation: 'Using a Queue (BFS) to visit all nodes at each depth level.',
            animationClass: 'anim-level-order'
          },
          {
            id: 'bst',
            name: 'Binary Search Tree (BST)',
            story: 'Chakra natures split hierarchically. Fire to the right, Water to the left. A ninja navigates the tree to find their affinity in log(N) time.',
            explanation: 'A tree where the left child is smaller and right child is larger than the parent.',
            animationClass: 'anim-bst'
          }
        ]
      },
      {
        id: 'graphs',
        title: 'Graphs',
        character: 'Hidden Villages',
        description: 'The map connecting the Hidden Leaf, Sand, and Cloud villages with trade routes and alliances.',
        concept: 'A collection of nodes and edges connecting them, used to model networks.',
        icon: '🗾',
        color: '#222f3e',
        patterns: [
          {
            id: 'topological-sort',
            name: 'Topological Sort',
            story: 'To learn Sage Mode, Naruto MUST learn chakra control, then summon Toads, then gather nature energy. The prerequisites form a strict DAG.',
            explanation: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG).',
            animationClass: 'anim-topo-sort'
          },
          {
            id: 'shortest-path',
            name: 'Shortest Path (Dijkstra)',
            story: 'Gaara sends an urgent message bird to Konoha. It takes the absolute fastest route over the mountains instead of the long desert path.',
            explanation: 'Finding the minimum weight path between nodes in a weighted graph using a Priority Queue.',
            animationClass: 'anim-shortest-path'
          }
        ]
      }
    ]
  }
];

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
  tier: 'basic' | 'advanced' | 'elite';
  patterns?: AlgorithmPattern[];
}

export interface ThemeDefinition {
  id: string;
  name: string;
  icon: string;
  topics: DsaTopic[];
}

// ─── HELPER: creates a topic with patterns for all themes ───

function t(id: string, title: string, icon: string, color: string, tier: 'basic'|'advanced'|'elite',
  oswald: { char: string; desc: string; concept: string; patterns: AlgorithmPattern[] },
  tomJerry: { char: string; desc: string; concept: string; patterns: AlgorithmPattern[] },
  friends: { char: string; desc: string; concept: string; patterns: AlgorithmPattern[] },
  naruto: { char: string; desc: string; concept: string; patterns: AlgorithmPattern[] }
): { oswald: DsaTopic; tomJerry: DsaTopic; friends: DsaTopic; naruto: DsaTopic } {
  const base = { id, title, icon, color, tier };
  return {
    oswald: { ...base, character: oswald.char, description: oswald.desc, concept: oswald.concept, patterns: oswald.patterns },
    tomJerry: { ...base, character: tomJerry.char, description: tomJerry.desc, concept: tomJerry.concept, patterns: tomJerry.patterns },
    friends: { ...base, character: friends.char, description: friends.desc, concept: friends.concept, patterns: friends.patterns },
    naruto: { ...base, character: naruto.char, description: naruto.desc, concept: naruto.concept, patterns: naruto.patterns },
  };
}

// ─── ALL 22 TOPICS ───

const arrays = t('arrays', 'Arrays & Hashing', '🥄', '#4fc3f7', 'basic',
  { char: 'Henry the Penguin', desc: 'Henry loves things neat and orderly! An Array is like his spoon collection: items lined up perfectly in memory.', concept: 'A contiguous block of memory storing elements of the same type.',
    patterns: [
      { id: 'basic', name: 'Basic Array', story: 'Henry lays out his favorite spoons in a row. He can instantly grab the 3rd spoon without checking the first two.', explanation: 'Accessing by index is O(1) because the memory address is calculated directly.', animationClass: 'anim-basic-array' },
      { id: 'two-pointers', name: 'Two Pointers', story: 'Henry\'s spoons are sorted by size. He places his left flipper on the smallest and right flipper on the largest, moving inward to find a matching pair.', explanation: 'Two pointers move from opposite ends. Efficient O(N) for sorted array pair searches.', animationClass: 'anim-two-pointers' },
      { id: 'sliding-window', name: 'Sliding Window', story: 'Henry slides a picture frame over 3 spoons at a time to find the shiniest subset, dropping the left and adding the right.', explanation: 'A fixed/variable window slides over the array, optimizing O(N²) subarray problems to O(N).', animationClass: 'anim-sliding-window' },
      { id: 'prefix-sum', name: 'Prefix Sum', story: 'Henry writes a running weight total below each spoon. Now he can find the weight of any range by subtracting two totals!', explanation: 'Precomputing cumulative sums enables O(1) range sum queries after O(N) preprocessing.', animationClass: 'anim-prefix-sum' },
      { id: 'kadanes', name: 'Kadane\'s Algorithm', story: 'Henry rates each spoon\'s shininess (+/-). He walks left to right, keeping a running "best streak" and resetting when the total goes negative.', explanation: 'Finds the maximum sum contiguous subarray in O(N) by tracking current and global max.', animationClass: 'anim-kadanes' },
      { id: 'hash-map', name: 'Hash Map / Set', story: 'Henry labels each spoon drawer with a unique tag. Now he finds any spoon instantly without searching every drawer!', explanation: 'Hash tables provide O(1) average lookup, insert, and delete by mapping keys to buckets via a hash function.', animationClass: 'anim-hash-map' },
    ] },
  { char: 'Tom', desc: 'Tom lines up mousetraps perfectly in a row outside Jerry\'s hole.', concept: 'A contiguous block of memory storing elements of the same type.',
    patterns: [
      { id: 'basic', name: 'Basic Array', story: 'Tom knows exactly where trap #4 is without checking 1, 2, 3.', explanation: 'Accessing by index is O(1) because the memory address is calculated directly.', animationClass: 'anim-basic-array' },
      { id: 'two-pointers', name: 'Two Pointers', story: 'Tom and Spike start from opposite ends of the trap line to find missing cheese.', explanation: 'Two pointers move from opposite ends. Efficient O(N) for sorted array pair searches.', animationClass: 'anim-two-pointers' },
      { id: 'sliding-window', name: 'Sliding Window', story: 'Jerry shines a flashlight over 3 traps at a time, sliding it to find the safest path.', explanation: 'A fixed/variable window slides over the array, optimizing O(N²) subarray problems to O(N).', animationClass: 'anim-sliding-window' },
      { id: 'prefix-sum', name: 'Prefix Sum', story: 'Jerry pre-calculates the danger level up to each trap so he knows any section\'s danger instantly.', explanation: 'Precomputing cumulative sums enables O(1) range sum queries after O(N) preprocessing.', animationClass: 'anim-prefix-sum' },
      { id: 'kadanes', name: 'Kadane\'s Algorithm', story: 'Jerry rates each hallway section as safe (+) or dangerous (-). He finds the longest safe streak by resetting when danger accumulates.', explanation: 'Finds the maximum sum contiguous subarray in O(N).', animationClass: 'anim-kadanes' },
      { id: 'hash-map', name: 'Hash Map / Set', story: 'Tom sticks a unique label on each trap. Now he finds any trap by its label in one step!', explanation: 'Hash tables provide O(1) average lookup via a hash function.', animationClass: 'anim-hash-map' },
    ] },
  { char: 'Monica', desc: 'Monica organizes her kitchen mugs in a perfect, rigid line.', concept: 'A contiguous block of memory storing elements of the same type.',
    patterns: [
      { id: 'basic', name: 'Basic Array', story: 'Monica knows exactly where the 4th mug is. She indexed them in her mind.', explanation: 'Accessing by index is O(1).', animationClass: 'anim-basic-array' },
      { id: 'two-pointers', name: 'Two Pointers', story: 'Monica and Chandler wipe counters from opposite ends until they meet.', explanation: 'Two pointers from opposite ends, O(N).', animationClass: 'anim-two-pointers' },
      { id: 'sliding-window', name: 'Sliding Window', story: 'Phoebe observes 3 consecutive days of Monica\'s cleaning to find the craziest stretch.', explanation: 'A window slides over the array, O(N).', animationClass: 'anim-sliding-window' },
      { id: 'prefix-sum', name: 'Prefix Sum', story: 'Ross calculates cumulative divorce spending to instantly find any decade\'s total.', explanation: 'Precomputing cumulative sums, O(1) range queries.', animationClass: 'anim-prefix-sum' },
      { id: 'kadanes', name: 'Kadane\'s Algorithm', story: 'Joey tracks his longest winning streak at foosball by resetting when he loses.', explanation: 'Finds maximum sum contiguous subarray in O(N).', animationClass: 'anim-kadanes' },
      { id: 'hash-map', name: 'Hash Map / Set', story: 'Monica labels every shelf. She finds any item instantly without rummaging.', explanation: 'O(1) average lookup via hash function.', animationClass: 'anim-hash-map' },
    ] },
  { char: 'Kunai Targets', desc: 'Naruto lines up practice targets perfectly in a row.', concept: 'A contiguous block of memory storing elements of the same type.',
    patterns: [
      { id: 'basic', name: 'Basic Array', story: 'Naruto accesses the 3rd target post instantly — they\'re evenly spaced.', explanation: 'Accessing by index is O(1).', animationClass: 'anim-basic-array' },
      { id: 'two-pointers', name: 'Two Pointers', story: 'Naruto and Sasuke run from opposite ends of the training field to clash in the middle.', explanation: 'Two pointers from opposite ends, O(N).', animationClass: 'anim-two-pointers' },
      { id: 'sliding-window', name: 'Sliding Window', story: 'Kakashi\'s Sharingan focuses on a 3-second window of hand signs, sliding forward.', explanation: 'A window slides over the array, O(N).', animationClass: 'anim-sliding-window' },
      { id: 'prefix-sum', name: 'Prefix Sum', story: 'Shikamaru pre-calculates cumulative chakra consumption to know if he has enough for combos.', explanation: 'O(1) range queries after O(N) preprocessing.', animationClass: 'anim-prefix-sum' },
      { id: 'kadanes', name: 'Kadane\'s Algorithm', story: 'Naruto tracks his best consecutive training scores, resetting when performance drops.', explanation: 'Finds maximum sum contiguous subarray in O(N).', animationClass: 'anim-kadanes' },
      { id: 'hash-map', name: 'Hash Map / Set', story: 'Each ninja\'s ID is hashed to their locker. Instant lookup without searching every locker.', explanation: 'O(1) average lookup via hash function.', animationClass: 'anim-hash-map' },
    ] }
);

const strings = t('strings', 'Strings', '📝', '#26c6da', 'basic',
  { char: 'Oswald', desc: 'Oswald writes letters to his friends. A String is a sequence of characters, like the letters in each word of his message!', concept: 'An array of characters with specialized operations for text processing.',
    patterns: [
      { id: 'string-manip', name: 'String Manipulation', story: 'Oswald wants to reverse his letter to surprise Henry. He swaps the first and last characters, then moves inward.', explanation: 'Common operations: reverse, substring, concatenation, case conversion. Often O(N).', animationClass: 'anim-string-manip' },
      { id: 'anagram', name: 'Anagram Detection', story: 'Oswald checks if "LISTEN" and "SILENT" use the exact same letters by counting each letter\'s frequency.', explanation: 'Two strings are anagrams if they have identical character frequency counts. O(N) with hash maps.', animationClass: 'anim-anagram' },
      { id: 'palindrome', name: 'Palindrome Check', story: 'Oswald reads his poem forward and backward — if it\'s the same, it\'s a palindrome! He uses two pointers from both ends.', explanation: 'A string reads the same forwards and backwards. Two-pointer approach runs in O(N/2).', animationClass: 'anim-palindrome' },
    ] },
  { char: 'Jerry', desc: 'Jerry leaves coded notes for his mouse friends. Each note is a string of characters.', concept: 'An array of characters with specialized operations.',
    patterns: [
      { id: 'string-manip', name: 'String Manipulation', story: 'Jerry reverses his coded message so Tom can\'t read it even if he finds the note.', explanation: 'Reverse, substring, concatenation. O(N).', animationClass: 'anim-string-manip' },
      { id: 'anagram', name: 'Anagram Detection', story: 'Jerry checks if Tom\'s scrambled trap labels are really the same word rearranged.', explanation: 'Identical character frequency = anagram. O(N).', animationClass: 'anim-anagram' },
      { id: 'palindrome', name: 'Palindrome Check', story: 'Jerry writes "RACECAR" on Tom\'s forehead — it reads the same in the mirror!', explanation: 'Two-pointer palindrome check in O(N/2).', animationClass: 'anim-palindrome' },
    ] },
  { char: 'Ross', desc: 'Ross writes academic papers. Every sentence is a string of carefully chosen characters.', concept: 'An array of characters with specialized operations.',
    patterns: [
      { id: 'string-manip', name: 'String Manipulation', story: 'Ross reverses his speech about "WE WERE ON A BREAK" to see if it still makes sense.', explanation: 'Reverse, substring, concatenation. O(N).', animationClass: 'anim-string-manip' },
      { id: 'anagram', name: 'Anagram Detection', story: 'Rachel rearranges the letters of "ROSS" to spell "SSOR" — are they anagrams? Count the letters!', explanation: 'Character frequency matching. O(N).', animationClass: 'anim-anagram' },
      { id: 'palindrome', name: 'Palindrome Check', story: 'Chandler checks if his joke reads the same backwards. If yes, it\'s a palindrome joke!', explanation: 'Two-pointer approach in O(N/2).', animationClass: 'anim-palindrome' },
    ] },
  { char: 'Scroll Messages', desc: 'Ninja message scrolls contain encoded strings that must be decoded to execute missions.', concept: 'An array of characters with specialized operations.',
    patterns: [
      { id: 'string-manip', name: 'String Manipulation', story: 'Naruto reverses a coded mission scroll so the enemy can\'t read it if intercepted.', explanation: 'Reverse, substring, concatenation. O(N).', animationClass: 'anim-string-manip' },
      { id: 'anagram', name: 'Anagram Detection', story: 'Shikamaru checks if two intercepted enemy scrolls contain the exact same characters, just rearranged.', explanation: 'Character frequency matching. O(N).', animationClass: 'anim-anagram' },
      { id: 'palindrome', name: 'Palindrome Check', story: 'A secret jutsu\'s activation word must read the same forwards and backwards to work.', explanation: 'Two-pointer palindrome check in O(N/2).', animationClass: 'anim-palindrome' },
    ] }
);

const linkedLists = t('linked-lists', 'Linked Lists', '🔗', '#ffb74d', 'basic',
  { char: 'Weenie the Dog', desc: 'Weenie chases a string of sausages! Each sausage holds data and points to the next.', concept: 'A sequence of nodes where each points to the next, enabling dynamic memory allocation.',
    patterns: [
      { id: 'fast-slow-pointers', name: 'Fast & Slow Pointers', story: 'Weenie runs fast (2 sausages/step), his friend runs slow (1/step). If it\'s a loop, Weenie laps his friend!', explanation: 'Detects cycles, finds midpoint. O(N) time, O(1) space.', animationClass: 'anim-fast-slow' },
      { id: 'reversal', name: 'In-place Reversal', story: 'Weenie unties each sausage string and ties it backwards to the previous one.', explanation: 'Reverse node links without extra memory. Essential for palindrome and sub-list problems.', animationClass: 'anim-reversal' },
      { id: 'dummy-node', name: 'Dummy Node', story: 'Weenie ties a fake rubber sausage at the start. Even if the first real sausage is eaten, the chain isn\'t lost!', explanation: 'A sentinel node simplifies edge cases for head insertion/deletion and list merging.', animationClass: 'anim-dummy-node' },
    ] },
  { char: 'Jerry', desc: 'Jerry runs through connected mouse holes. Each hole leads to the next!', concept: 'Nodes linked by pointers for dynamic allocation.',
    patterns: [
      { id: 'fast-slow-pointers', name: 'Fast & Slow Pointers', story: 'Jerry (fast, 2 holes/step) and Tom (slow, 1/step) chase through holes. In a loop, Jerry laps Tom!', explanation: 'Cycle detection, midpoint finding. O(N), O(1) space.', animationClass: 'anim-fast-slow' },
      { id: 'reversal', name: 'In-place Reversal', story: 'Jerry reverses all the tunnel directions to trick Tom into running backwards.', explanation: 'Reverse links in-place without extra memory.', animationClass: 'anim-reversal' },
      { id: 'dummy-node', name: 'Dummy Node', story: 'Jerry puts a fake hole at the start so Tom always begins searching in the wrong place.', explanation: 'Sentinel node simplifies head edge cases.', animationClass: 'anim-dummy-node' },
    ] },
  { char: 'Gossip Chain', desc: 'Rachel tells Phoebe, who tells Ross, who tells Joey. Each person points to the next!', concept: 'Nodes linked by pointers.',
    patterns: [
      { id: 'fast-slow-pointers', name: 'Fast & Slow Pointers', story: 'Rumors spread fast (2 people/step), truth slow (1/step). In a gossip loop, the rumor catches itself!', explanation: 'Cycle detection. O(N), O(1) space.', animationClass: 'anim-fast-slow' },
      { id: 'reversal', name: 'In-place Reversal', story: 'Monica traces gossip backwards to find who started it by reversing the "who told whom" chain.', explanation: 'Reverse links in-place.', animationClass: 'anim-reversal' },
      { id: 'dummy-node', name: 'Dummy Node', story: 'Chandler uses "Miss Chanandler Bong" as a fake start to protect himself in the gossip chain.', explanation: 'Sentinel node for edge cases.', animationClass: 'anim-dummy-node' },
    ] },
  { char: 'Shinobi Alliance', desc: 'The Hokage tells the Jonin, who tells the Chunin. Each ninja points to the next in the chain.', concept: 'Nodes linked by pointers.',
    patterns: [
      { id: 'fast-slow-pointers', name: 'Fast & Slow Pointers', story: 'Minato (fast, 2 ninjas/step) and a regular ninja (slow, 1/step) run the same patrol. In a loop, Minato laps them!', explanation: 'Cycle detection. O(N), O(1) space.', animationClass: 'anim-fast-slow' },
      { id: 'reversal', name: 'In-place Reversal', story: 'Pain reverses the entire chain of command, making Genin give orders to Kage.', explanation: 'Reverse links in-place.', animationClass: 'anim-reversal' },
      { id: 'dummy-node', name: 'Dummy Node', story: 'Naruto places a Shadow Clone as a dummy guard at the head of the line to take the first hit.', explanation: 'Sentinel node simplifies edge cases.', animationClass: 'anim-dummy-node' },
    ] }
);

const stacks = t('stacks', 'Stacks', '🥞', '#64b5f6', 'basic',
  { char: 'Oswald', desc: 'Oswald stacks pancakes. He adds on top (Push) and eats from the top (Pop). Last in, first out!', concept: 'A LIFO (Last-In-First-Out) data structure.',
    patterns: [
      { id: 'monotonic-stack', name: 'Monotonic Stack', story: 'Oswald removes all smaller pancakes before placing a new one, keeping the stack strictly decreasing.', explanation: 'Maintains sorted order. Solves "next greater element" in O(N).', animationClass: 'anim-monotonic-stack' },
      { id: 'valid-parentheses', name: 'Valid Parentheses', story: 'Oswald matches blueberry pancakes with blueberry orders and chocolate with chocolate. Mismatches are invalid!', explanation: 'Every closing bracket must match the most recent unclosed bracket (stack top).', animationClass: 'anim-valid-parentheses' },
    ] },
  { char: 'Tom', desc: 'Tom carries a towering stack of plates. He can only add/remove from the top!', concept: 'LIFO data structure.',
    patterns: [
      { id: 'monotonic-stack', name: 'Monotonic Stack', story: 'Tom only stacks plates smaller than the one below. Bigger plate? Throw the smaller ones off!', explanation: 'Monotonic order for "next greater element". O(N).', animationClass: 'anim-monotonic-stack' },
      { id: 'valid-parentheses', name: 'Valid Parentheses', story: 'Tom matches red cups to red saucers, blue to blue. Mismatch? Jerry breaks them!', explanation: 'Bracket matching with stack.', animationClass: 'anim-valid-parentheses' },
    ] },
  { char: 'Joey', desc: 'Joey stacks sandwiches. He eats the top one first. Joey doesn\'t share food!', concept: 'LIFO data structure.',
    patterns: [
      { id: 'monotonic-stack', name: 'Monotonic Stack', story: 'Joey only stacks a sandwich with MORE meat. Less meat? He eats the smaller ones until the new one fits.', explanation: 'Monotonic stack for ordering. O(N).', animationClass: 'anim-monotonic-stack' },
      { id: 'valid-parentheses', name: 'Valid Parentheses', story: 'Ross matches T-Rex bones to T-Rex molds. Wrong mold? Invalid arrangement!', explanation: 'Bracket matching with stack.', animationClass: 'anim-valid-parentheses' },
    ] },
  { char: 'Chakra Control', desc: 'Naruto stacks leaves on his forehead for chakra control. Newest leaf goes on top!', concept: 'LIFO data structure.',
    patterns: [
      { id: 'monotonic-stack', name: 'Monotonic Stack', story: 'Naruto only stacks larger leaves. Smaller ones get blown away to maintain the perfect stack.', explanation: 'Monotonic stack. O(N).', animationClass: 'anim-monotonic-stack' },
      { id: 'valid-parentheses', name: 'Valid Parentheses', story: 'Sasuke matches fire with wind in his jutsu sequence. Wrong match? The jutsu fails!', explanation: 'Bracket matching with stack.', animationClass: 'anim-valid-parentheses' },
    ] }
);

const queues = t('queues', 'Queues', '🦋', '#f06292', 'basic',
  { char: 'Madame Butterfly', desc: 'Customers line up at Madame Butterfly\'s Diner. First in line = first served!', concept: 'A FIFO (First-In-First-Out) data structure.',
    patterns: [
      { id: 'bfs-queue', name: 'BFS Queue', story: 'Madame Butterfly serves all tables 1 meter away first, then 2 meters. Her order queue tracks the current distance.', explanation: 'BFS uses a queue to process nodes level by level.', animationClass: 'anim-bfs-queue' },
      { id: 'sliding-window-max', name: 'Monotonic Queue', story: 'She watches through the diner window, only tracking the biggest VIP currently visible.', explanation: 'Deque maintains max/min in a sliding window in O(N).', animationClass: 'anim-sliding-max' },
    ] },
  { char: 'Spike', desc: 'Spike enforces a strict line for bones. No cutting!', concept: 'FIFO data structure.',
    patterns: [
      { id: 'bfs-queue', name: 'BFS Queue', story: 'Spike gives bones to all dogs nearest first, then walks further to the next batch.', explanation: 'BFS processes level by level.', animationClass: 'anim-bfs-queue' },
      { id: 'sliding-window-max', name: 'Monotonic Queue', story: 'Spike watches the line, only tracking the biggest, meanest dog currently visible.', explanation: 'Deque for sliding window max. O(N).', animationClass: 'anim-sliding-max' },
    ] },
  { char: 'Central Perk', desc: 'Gunther serves coffee in strict order. First in line, first served!', concept: 'FIFO data structure.',
    patterns: [
      { id: 'bfs-queue', name: 'BFS Queue', story: 'Gunther serves the couch friends first, then people by the door.', explanation: 'BFS processes level by level.', animationClass: 'anim-bfs-queue' },
      { id: 'sliding-window-max', name: 'Monotonic Queue', story: 'Gunther stares at Rachel, tracking only her position through the cafe window.', explanation: 'Deque for sliding window max. O(N).', animationClass: 'anim-sliding-max' },
    ] },
  { char: 'Ichiraku Ramen', desc: 'Teuchi serves ramen in exact arrival order. FIFO!', concept: 'FIFO data structure.',
    patterns: [
      { id: 'bfs-queue', name: 'BFS Queue', story: 'Naruto sends shadow clones to search the village radially — sector 1 before sector 2.', explanation: 'BFS processes level by level.', animationClass: 'anim-bfs-queue' },
      { id: 'sliding-window-max', name: 'Monotonic Queue', story: 'Teuchi tracks who has the biggest appetite (Choji) in the current window of time.', explanation: 'Deque for sliding window max. O(N).', animationClass: 'anim-sliding-max' },
    ] }
);

const recursion = t('recursion', 'Recursion', '🔄', '#ab47bc', 'basic',
  { char: 'Oswald', desc: 'Oswald opens a box that contains a smaller box, which contains an even smaller box... until he finds the treasure!', concept: 'A function that calls itself, breaking problems into smaller identical sub-problems until a base case is reached.',
    patterns: [
      { id: 'base-case', name: 'Base Case & Leap of Faith', story: 'Oswald keeps opening boxes. The SMALLEST box has the treasure (base case). He trusts that the same "open box" process works for all sizes.', explanation: 'Every recursive function needs a base case (stopping condition) and a recursive step. Trust the recursion handles sub-problems.', animationClass: 'anim-base-case' },
      { id: 'recursion-tree', name: 'Recursion Tree', story: 'Oswald draws a map of all the boxes he opened. It looks like a tree! Each branch is a different recursive call.', explanation: 'Visualizing recursive calls as a tree helps understand time complexity (e.g., Fibonacci has O(2^N) without memoization).', animationClass: 'anim-recursion-tree' },
      { id: 'multiple-branches', name: 'Multiple Branches', story: 'Each box contains TWO smaller boxes. Oswald must open both before returning. The number of boxes doubles at each level!', explanation: 'Multi-branch recursion (e.g., Fibonacci, tree traversals) creates exponential call trees.', animationClass: 'anim-multiple-branches' },
    ] },
  { char: 'Jerry', desc: 'Jerry opens a trapdoor that leads to another trapdoor, which leads to another... until he escapes!', concept: 'A function calling itself until a base case.',
    patterns: [
      { id: 'base-case', name: 'Base Case & Leap of Faith', story: 'Jerry keeps going through trapdoors. The last one opens outside (base case). He trusts each trapdoor leads closer to freedom.', explanation: 'Base case stops recursion. Trust the recursive step.', animationClass: 'anim-base-case' },
      { id: 'recursion-tree', name: 'Recursion Tree', story: 'Jerry maps every trapdoor path. It branches like a tree — each path is a different recursive call.', explanation: 'Recursion tree visualization for complexity analysis.', animationClass: 'anim-recursion-tree' },
      { id: 'multiple-branches', name: 'Multiple Branches', story: 'Each trapdoor leads to TWO more. The escape routes double at every level!', explanation: 'Multi-branch recursion creates exponential call trees.', animationClass: 'anim-multiple-branches' },
    ] },
  { char: 'Phoebe', desc: 'Phoebe tells a story within a story within a story... each one smaller until she reaches the punchline!', concept: 'A function calling itself until a base case.',
    patterns: [
      { id: 'base-case', name: 'Base Case & Leap of Faith', story: 'Phoebe\'s stories nest deeper and deeper. The innermost story has the actual joke (base case). She trusts each layer adds context.', explanation: 'Base case stops recursion.', animationClass: 'anim-base-case' },
      { id: 'recursion-tree', name: 'Recursion Tree', story: 'Each story spawns sub-stories. Drawing them out looks like a family tree of tales!', explanation: 'Recursion tree for complexity analysis.', animationClass: 'anim-recursion-tree' },
      { id: 'multiple-branches', name: 'Multiple Branches', story: 'Each story has TWO endings. The total possible endings explode exponentially!', explanation: 'Multi-branch recursion.', animationClass: 'anim-multiple-branches' },
    ] },
  { char: 'Shadow Clones', desc: 'Naruto\'s shadow clones create clones of clones... each one smaller until the jutsu runs out of chakra (base case)!', concept: 'A function calling itself until a base case.',
    patterns: [
      { id: 'base-case', name: 'Base Case & Leap of Faith', story: 'Each clone creates a smaller clone. When chakra runs out (base case), the chain stops. Trust each clone does its job.', explanation: 'Base case stops recursion.', animationClass: 'anim-base-case' },
      { id: 'recursion-tree', name: 'Recursion Tree', story: 'Drawing which clone created which forms a tree diagram — each branch is a recursive call.', explanation: 'Recursion tree visualization.', animationClass: 'anim-recursion-tree' },
      { id: 'multiple-branches', name: 'Multiple Branches', story: 'Each clone creates TWO more clones. The army grows exponentially!', explanation: 'Multi-branch recursion.', animationClass: 'anim-multiple-branches' },
    ] }
);

const sorting = t('sorting', 'Sorting', '📊', '#ff7043', 'basic',
  { char: 'Henry the Penguin', desc: 'Henry wants his spoons sorted from smallest to largest. But how? Different strategies have different speeds!', concept: 'Algorithms that arrange elements in a specific order. Critical for search optimization.',
    patterns: [
      { id: 'bubble-sort', name: 'Bubble Sort', story: 'Henry compares adjacent spoons and swaps if they\'re out of order, bubbling the largest to the end each pass.', explanation: 'Repeatedly swaps adjacent elements. O(N²) time. Simple but slow.', animationClass: 'anim-bubble-sort' },
      { id: 'merge-sort', name: 'Merge Sort', story: 'Henry splits his spoons in half, sorts each half separately, then carefully merges the two sorted halves together.', explanation: 'Divide & Conquer: split, sort halves, merge. O(N log N) guaranteed. Stable sort.', animationClass: 'anim-merge-sort' },
      { id: 'quick-sort', name: 'Quick Sort', story: 'Henry picks a random "pivot" spoon and puts all smaller spoons left and larger spoons right. Then he repeats for each side.', explanation: 'Pick a pivot, partition around it, recurse. O(N log N) average, O(N²) worst case.', animationClass: 'anim-quick-sort' },
    ] },
  { char: 'Tom', desc: 'Tom needs his traps sorted by danger level. Different sorting strategies!', concept: 'Algorithms to arrange elements in order.',
    patterns: [
      { id: 'bubble-sort', name: 'Bubble Sort', story: 'Tom compares adjacent traps, swapping out-of-order ones, bubbling the deadliest to the end.', explanation: 'Adjacent swaps. O(N²).', animationClass: 'anim-bubble-sort' },
      { id: 'merge-sort', name: 'Merge Sort', story: 'Tom splits his traps in half, sorts each half, then merges them perfectly.', explanation: 'Divide & Conquer. O(N log N). Stable.', animationClass: 'anim-merge-sort' },
      { id: 'quick-sort', name: 'Quick Sort', story: 'Tom picks a pivot trap. Weaker traps go left, stronger go right. Repeat for each side.', explanation: 'Partition around pivot. O(N log N) average.', animationClass: 'anim-quick-sort' },
    ] },
  { char: 'Monica', desc: 'Monica NEEDS everything sorted. It\'s not optional. Different methods have different OCD satisfaction levels.', concept: 'Algorithms to arrange elements in order.',
    patterns: [
      { id: 'bubble-sort', name: 'Bubble Sort', story: 'Monica compares each pair of towels and swaps them until the fluffiest bubbles to the end.', explanation: 'Adjacent swaps. O(N²).', animationClass: 'anim-bubble-sort' },
      { id: 'merge-sort', name: 'Merge Sort', story: 'Monica splits her closet in half, sorts each half, then merges them into perfection.', explanation: 'Divide & Conquer. O(N log N).', animationClass: 'anim-merge-sort' },
      { id: 'quick-sort', name: 'Quick Sort', story: 'Monica picks a pivot shoe. All cheaper shoes go left, fancier go right. Then she sorts each pile.', explanation: 'Partition & recurse. O(N log N) average.', animationClass: 'anim-quick-sort' },
    ] },
  { char: 'Academy Students', desc: 'Academy students line up by rank. Different sorting jutsu have different speeds!', concept: 'Algorithms to arrange elements.',
    patterns: [
      { id: 'bubble-sort', name: 'Bubble Sort', story: 'Iruka compares adjacent students and swaps positions, bubbling the strongest to the end each pass.', explanation: 'Adjacent swaps. O(N²).', animationClass: 'anim-bubble-sort' },
      { id: 'merge-sort', name: 'Merge Sort', story: 'The class splits in half, each half sorts itself, then they merge into one ordered line.', explanation: 'Divide & Conquer. O(N log N).', animationClass: 'anim-merge-sort' },
      { id: 'quick-sort', name: 'Quick Sort', story: 'A random "pivot" student is chosen. Weaker students go left, stronger right. Recurse on each side.', explanation: 'Partition & recurse. O(N log N) average.', animationClass: 'anim-quick-sort' },
    ] }
);

const binarySearch = t('binary-search', 'Binary Search', '🔍', '#66bb6a', 'basic',
  { char: 'Henry the Penguin', desc: 'Henry\'s spoons are sorted by size. To find spoon #7, he checks the middle first and eliminates half each time!', concept: 'An O(log N) search algorithm for sorted data by halving the search space.',
    patterns: [
      { id: 'standard-bs', name: 'Standard Binary Search', story: 'Henry checks the middle spoon. Too small? Ignore the left half. Too big? Ignore the right. Repeat until found!', explanation: 'Classic binary search on a sorted array. O(log N) time.', animationClass: 'anim-standard-bs' },
      { id: 'bs-on-answer', name: 'Binary Search on Answer', story: 'Henry doesn\'t know the exact weight but knows it\'s between 1g and 100g. He guesses 50g, checks if it\'s too heavy, and narrows the range.', explanation: 'When the answer itself is monotonic (feasible/infeasible), binary search the answer space. O(log N × check).', animationClass: 'anim-bs-on-answer' },
    ] },
  { char: 'Jerry', desc: 'Jerry\'s escape holes are numbered. He checks the middle one and eliminates half to find the safe exit!', concept: 'O(log N) search by halving.',
    patterns: [
      { id: 'standard-bs', name: 'Standard Binary Search', story: 'Jerry checks the middle hole. Too far left? Ignore left half. Too far right? Ignore right. Repeat!', explanation: 'Classic binary search. O(log N).', animationClass: 'anim-standard-bs' },
      { id: 'bs-on-answer', name: 'Binary Search on Answer', story: 'Jerry guesses how many cheese blocks fit in his hole. Too many? Try fewer. Too few? Try more. Halving each time.', explanation: 'Binary search the answer space when feasibility is monotonic.', animationClass: 'anim-bs-on-answer' },
    ] },
  { char: 'Ross', desc: 'Ross searches his alphabetized bookshelf. He checks the middle book and halves the search!', concept: 'O(log N) search by halving.',
    patterns: [
      { id: 'standard-bs', name: 'Standard Binary Search', story: 'Ross checks the middle book. Before "D"? Check right half. After "D"? Check left. Halve until found!', explanation: 'Classic binary search. O(log N).', animationClass: 'anim-standard-bs' },
      { id: 'bs-on-answer', name: 'Binary Search on Answer', story: 'Ross guesses the publication year. Too recent? Go earlier. Too old? Go later. Halving the year range.', explanation: 'Binary search on monotonic answer space.', animationClass: 'anim-bs-on-answer' },
    ] },
  { char: 'Kakashi', desc: 'Kakashi searches a sorted scroll library. He checks the middle scroll and eliminates half instantly with Sharingan precision!', concept: 'O(log N) search by halving.',
    patterns: [
      { id: 'standard-bs', name: 'Standard Binary Search', story: 'Kakashi checks the middle scroll. Too low rank? Check right. Too high? Check left. Halve until found!', explanation: 'Classic binary search. O(log N).', animationClass: 'anim-standard-bs' },
      { id: 'bs-on-answer', name: 'Binary Search on Answer', story: 'Kakashi guesses the minimum chakra needed for a jutsu. Too much? Try less. Too little? Try more. Halving each time.', explanation: 'Binary search the answer space.', animationClass: 'anim-bs-on-answer' },
    ] }
);

const trees = t('trees', 'Trees', '🌻', '#81c784', 'advanced',
  { char: 'Daisy', desc: 'Daisy the sunflower starts as a single root and branches out to leaves. Hierarchical data!', concept: 'A hierarchical data structure with root and child nodes.',
    patterns: [
      { id: 'dfs-tree', name: 'DFS (Depth-First)', story: 'A ladybug crawls Daisy, following one branch all the way to the leaf tip before backtracking.', explanation: 'Traverses deep using recursion/stack. Pre-order, In-order, Post-order.', animationClass: 'anim-dfs-tree' },
      { id: 'level-order', name: 'Level Order (BFS)', story: 'The sun shines down on Daisy, lighting up each level of leaves from top to bottom.', explanation: 'BFS visits all nodes at each depth before going deeper.', animationClass: 'anim-level-order' },
      { id: 'bst', name: 'Binary Search Tree', story: 'Daisy grows small leaves left, large leaves right. A ladybug navigates in O(log N)!', explanation: 'Left child < parent < right child. Average O(log N) search/insert/delete.', animationClass: 'anim-bst' },
      { id: 'lca', name: 'Lowest Common Ancestor', story: 'Two ladybugs climb Daisy from different leaves. Their paths first meet at the LCA branch!', explanation: 'The deepest node that is an ancestor of both given nodes. Solvable in O(N) with DFS.', animationClass: 'anim-lca' },
    ] },
  { char: 'Family Tree', desc: 'Tom\'s rich family tree branches from his wealthy aunt to all his cousins.', concept: 'Hierarchical structure with root and children.',
    patterns: [
      { id: 'dfs-tree', name: 'DFS (Depth-First)', story: 'Jerry climbs one branch of the family tree poster to the very top to steal cheese.', explanation: 'DFS traversal. Pre/In/Post order.', animationClass: 'anim-dfs-tree' },
      { id: 'level-order', name: 'Level Order (BFS)', story: 'Tom reads the family tree row by row: grandparents, parents, then kids.', explanation: 'BFS by level.', animationClass: 'anim-level-order' },
      { id: 'bst', name: 'Binary Search Tree', story: 'Rich relatives go right, poor go left. Tom navigates right at every turn for the inheritance!', explanation: 'BST ordering. O(log N) average.', animationClass: 'anim-bst' },
      { id: 'lca', name: 'Lowest Common Ancestor', story: 'Two cousins trace their family lines upward until they find their common grandparent.', explanation: 'Deepest common ancestor. O(N) DFS.', animationClass: 'anim-lca' },
    ] },
  { char: 'Phoebe', desc: 'Phoebe maps her eccentric family tree to find her real mother.', concept: 'Hierarchical structure.',
    patterns: [
      { id: 'dfs-tree', name: 'DFS (Depth-First)', story: 'Phoebe follows a single lead about her father, diving deep until it hits a dead end.', explanation: 'DFS traversal.', animationClass: 'anim-dfs-tree' },
      { id: 'level-order', name: 'Level Order (BFS)', story: 'Phoebe looks at all half-siblings on one level before moving down to their kids.', explanation: 'BFS by level.', animationClass: 'anim-level-order' },
      { id: 'bst', name: 'Binary Search Tree', story: 'Phoebe organizes songs: sad left (Smelly Cat), happy right. Finds any song in log(N)!', explanation: 'BST ordering.', animationClass: 'anim-bst' },
      { id: 'lca', name: 'Lowest Common Ancestor', story: 'Phoebe and her twin Ursula trace their family lines up to find their common mother.', explanation: 'LCA. O(N) DFS.', animationClass: 'anim-lca' },
    ] },
  { char: 'Divine Tree', desc: 'The Divine Tree channels chakra through roots and leaves hierarchically.', concept: 'Hierarchical structure.',
    patterns: [
      { id: 'dfs-tree', name: 'DFS (Depth-First)', story: 'Yamato grows a root deep underground to the very tip before branching sideways.', explanation: 'DFS traversal.', animationClass: 'anim-dfs-tree' },
      { id: 'level-order', name: 'Level Order (BFS)', story: 'The Infinite Tsukuyomi captures everyone at the highest branches first, then the next level.', explanation: 'BFS by level.', animationClass: 'anim-level-order' },
      { id: 'bst', name: 'Binary Search Tree', story: 'Chakra natures split: Fire right, Water left. Navigate the tree to find your affinity in log(N).', explanation: 'BST ordering.', animationClass: 'anim-bst' },
      { id: 'lca', name: 'Lowest Common Ancestor', story: 'Two chakra streams trace back up the Divine Tree until they merge at their common origin.', explanation: 'LCA. O(N) DFS.', animationClass: 'anim-lca' },
    ] }
);

const heaps = t('heaps', 'Heaps / Priority Queue', '⛰️', '#ef5350', 'advanced',
  { char: 'Oswald', desc: 'Oswald\'s priority to-do list! The most urgent task always floats to the top of the heap.', concept: 'A complete binary tree where each parent ≥ (max-heap) or ≤ (min-heap) its children. O(log N) insert/extract.',
    patterns: [
      { id: 'min-max-heap', name: 'Min / Max Heap', story: 'Oswald\'s most urgent chore always floats to the top. Adding a new chore? It bubbles up to its correct priority position!', explanation: 'Min-heap: smallest on top. Max-heap: largest on top. Insert/extract in O(log N). Build in O(N).', animationClass: 'anim-min-max-heap' },
      { id: 'top-k', name: 'Top-K Elements', story: 'Oswald wants the 3 most urgent chores. He keeps a min-heap of size 3, replacing the least urgent whenever a more urgent one arrives.', explanation: 'Maintain a heap of size K. Process all N elements: O(N log K).', animationClass: 'anim-top-k' },
      { id: 'merge-k', name: 'Merge K Sorted Lists', story: 'Oswald has 4 sorted shopping lists from friends. He picks the smallest item among all 4 heads using a min-heap, then advances that list.', explanation: 'Use a min-heap of size K to always extract the global minimum. O(N log K) total.', animationClass: 'anim-merge-k' },
    ] },
  { char: 'Spike', desc: 'Spike\'s bone priority queue! The biggest bone always comes first.', concept: 'Complete binary tree with heap property. O(log N) ops.',
    patterns: [
      { id: 'min-max-heap', name: 'Min / Max Heap', story: 'The biggest bone always floats to the top of Spike\'s pile. New bone? It bubbles up.', explanation: 'Heap property. Insert/extract O(log N).', animationClass: 'anim-min-max-heap' },
      { id: 'top-k', name: 'Top-K Elements', story: 'Spike wants the 3 biggest bones. He keeps a min-heap of size 3, replacing the smallest whenever a bigger one arrives.', explanation: 'Heap of size K. O(N log K).', animationClass: 'anim-top-k' },
      { id: 'merge-k', name: 'Merge K Sorted Lists', story: 'Multiple dogs bring sorted bone piles. Spike uses a min-heap to pick the biggest across all piles.', explanation: 'Min-heap of K list heads. O(N log K).', animationClass: 'anim-merge-k' },
    ] },
  { char: 'Gunther', desc: 'Gunther\'s coffee order priority queue! VIP orders float to the top.', concept: 'Complete binary tree with heap property.',
    patterns: [
      { id: 'min-max-heap', name: 'Min / Max Heap', story: 'The most expensive coffee order always floats to Gunther\'s top priority. New order? It bubbles up.', explanation: 'Heap property. O(log N) ops.', animationClass: 'anim-min-max-heap' },
      { id: 'top-k', name: 'Top-K Elements', story: 'Gunther tracks the 3 most frequent customers using a min-heap, replacing the least frequent when someone overtakes them.', explanation: 'Heap of size K. O(N log K).', animationClass: 'anim-top-k' },
      { id: 'merge-k', name: 'Merge K Sorted Lists', story: 'Multiple baristas bring sorted order lists. Gunther merges them using a min-heap to serve in perfect order.', explanation: 'Min-heap of K heads. O(N log K).', animationClass: 'anim-merge-k' },
    ] },
  { char: 'Mission Board', desc: 'The Hokage\'s mission board! The most urgent mission always surfaces to the top.', concept: 'Complete binary tree with heap property.',
    patterns: [
      { id: 'min-max-heap', name: 'Min / Max Heap', story: 'S-rank missions float to the top of the board. New mission? It bubbles up to its urgency level.', explanation: 'Heap property. O(log N) ops.', animationClass: 'anim-min-max-heap' },
      { id: 'top-k', name: 'Top-K Elements', story: 'The Hokage needs the 3 most dangerous missions. A min-heap of size 3 tracks them, swapping out safer ones.', explanation: 'Heap of size K. O(N log K).', animationClass: 'anim-top-k' },
      { id: 'merge-k', name: 'Merge K Sorted Lists', story: 'Each village sends sorted mission reports. A min-heap merges them into one global priority list.', explanation: 'Min-heap of K heads. O(N log K).', animationClass: 'anim-merge-k' },
    ] }
);

const graphs = t('graphs', 'Graphs', '🏙️', '#ba68c8', 'advanced',
  { char: 'Big City', desc: 'Big City\'s map! Oswald\'s house, Henry\'s apartment, and the diner are connected by roads.', concept: 'Nodes connected by edges. Directed/Undirected, Weighted/Unweighted.',
    patterns: [
      { id: 'graph-bfs-dfs', name: 'BFS / DFS Traversal', story: 'Oswald explores the city. BFS: visit all neighbors first, then their neighbors. DFS: follow one road to the end before backtracking.', explanation: 'BFS (Queue): level-by-level. DFS (Stack/Recursion): depth-first. Both O(V+E).', animationClass: 'anim-graph-bfs-dfs' },
      { id: 'topological-sort', name: 'Topological Sort', story: 'Before the Diner, Oswald MUST visit the bank. Before the bank, he MUST leave his house. A strict order of errands.', explanation: 'Linear ordering of DAG vertices: for edge u→v, u comes before v. Kahn\'s algorithm or DFS.', animationClass: 'anim-topo-sort' },
      { id: 'shortest-path', name: 'Dijkstra\'s Shortest Path', story: 'Oswald checks all neighboring streets, always picking the road with the smallest total travel time from his house.', explanation: 'Greedy shortest path for non-negative weights. Uses a priority queue. O((V+E) log V).', animationClass: 'anim-shortest-path' },
      { id: 'cycle-detection', name: 'Cycle Detection', story: 'Oswald realizes some roads form circles — he keeps ending up at the same intersection! He needs to detect these loops.', explanation: 'Use DFS coloring (white/gray/black) for directed graphs or Union-Find for undirected. O(V+E).', animationClass: 'anim-cycle-detection' },
      { id: 'union-find', name: 'Union-Find', story: 'Oswald groups all houses reachable from each other. Two neighborhoods merge when a new road is built between them.', explanation: 'Disjoint Set Union with path compression and union by rank. Nearly O(1) per operation.', animationClass: 'anim-union-find' },
    ] },
  { char: 'Blueprint', desc: 'The complex blueprint of traps throughout the house. Rooms connect to multiple other rooms.', concept: 'Nodes connected by edges.',
    patterns: [
      { id: 'graph-bfs-dfs', name: 'BFS / DFS Traversal', story: 'Jerry explores all adjacent rooms (BFS) or follows one hallway to its end (DFS) to map the house.', explanation: 'BFS level-by-level, DFS depth-first. O(V+E).', animationClass: 'anim-graph-bfs-dfs' },
      { id: 'topological-sort', name: 'Topological Sort', story: 'Jerry must disable the tripwire, THEN the anvil, THEN the cage. Strict sabotage order.', explanation: 'DAG ordering. Kahn\'s or DFS.', animationClass: 'anim-topo-sort' },
      { id: 'shortest-path', name: 'Dijkstra\'s Shortest Path', story: 'Tom calculates the shortest route through rooms to cut Jerry off before he reaches his hole.', explanation: 'Priority queue shortest path. O((V+E) log V).', animationClass: 'anim-shortest-path' },
      { id: 'cycle-detection', name: 'Cycle Detection', story: 'Tom realizes some hallways form loops. He keeps ending up at the kitchen! He detects these cycles.', explanation: 'DFS coloring or Union-Find. O(V+E).', animationClass: 'anim-cycle-detection' },
      { id: 'union-find', name: 'Union-Find', story: 'Tom groups rooms reachable from each other. When a door is opened, two room groups merge.', explanation: 'Disjoint Set Union. Nearly O(1) per op.', animationClass: 'anim-union-find' },
    ] },
  { char: 'Relationships', desc: 'The complex web of who dated whom in New York City.', concept: 'Nodes connected by edges.',
    patterns: [
      { id: 'graph-bfs-dfs', name: 'BFS / DFS Traversal', story: 'Starting from Ross, BFS finds all people 1 relationship away, then 2. DFS follows one chain deep.', explanation: 'BFS/DFS traversal. O(V+E).', animationClass: 'anim-graph-bfs-dfs' },
      { id: 'topological-sort', name: 'Topological Sort', story: 'Ross figures out the strict timeline of "on a break" events. Event A MUST precede Event B.', explanation: 'DAG ordering.', animationClass: 'anim-topo-sort' },
      { id: 'shortest-path', name: 'Dijkstra\'s Shortest Path', story: 'Chandler finds the shortest chain of social connections to get Rangers tickets.', explanation: 'Priority queue shortest path.', animationClass: 'anim-shortest-path' },
      { id: 'cycle-detection', name: 'Cycle Detection', story: 'The friends realize their dating history forms a cycle — Ross dated Rachel, who dated Joey, who... wait.', explanation: 'Cycle detection in graphs. O(V+E).', animationClass: 'anim-cycle-detection' },
      { id: 'union-find', name: 'Union-Find', story: 'Social groups merge when people start dating. Monica and Chandler\'s groups become one!', explanation: 'Disjoint Set Union. Near O(1).', animationClass: 'anim-union-find' },
    ] },
  { char: 'Hidden Villages', desc: 'The map connecting Hidden Leaf, Sand, and Cloud villages with alliances.', concept: 'Nodes connected by edges.',
    patterns: [
      { id: 'graph-bfs-dfs', name: 'BFS / DFS Traversal', story: 'BFS: Naruto sends messages to all neighboring villages first. DFS: he follows one alliance chain to the end.', explanation: 'BFS/DFS traversal. O(V+E).', animationClass: 'anim-graph-bfs-dfs' },
      { id: 'topological-sort', name: 'Topological Sort', story: 'To learn Sage Mode: MUST learn chakra control, THEN summon Toads, THEN gather nature energy. Strict order.', explanation: 'DAG ordering.', animationClass: 'anim-topo-sort' },
      { id: 'shortest-path', name: 'Dijkstra\'s Shortest Path', story: 'Gaara\'s message bird takes the fastest route over mountains instead of the long desert path.', explanation: 'Priority queue shortest path.', animationClass: 'anim-shortest-path' },
      { id: 'cycle-detection', name: 'Cycle Detection', story: 'Alliance chains form cycles: Leaf allies with Sand, Sand allies with Cloud, Cloud allies with Leaf!', explanation: 'Cycle detection. O(V+E).', animationClass: 'anim-cycle-detection' },
      { id: 'union-find', name: 'Union-Find', story: 'When two villages form an alliance, their shinobi groups merge into one unified force.', explanation: 'Disjoint Set Union. Near O(1).', animationClass: 'anim-union-find' },
    ] }
);

const backtracking = t('backtracking', 'Backtracking', '🔙', '#78909c', 'advanced',
  { char: 'Oswald', desc: 'Oswald tries every path in a maze. Dead end? He backtracks and tries the next path!', concept: 'Explore all possible solutions by building candidates and abandoning (backtracking) those that fail constraints.',
    patterns: [
      { id: 'subsets', name: 'Subsets / Combinations', story: 'Oswald picks gifts for friends. He tries every possible combination (include/exclude each item) to find the perfect set.', explanation: 'Generate all 2^N subsets by including/excluding each element. Pruning reduces unnecessary branches.', animationClass: 'anim-subsets' },
      { id: 'permutations', name: 'Permutations', story: 'Oswald arranges his friends in a photo line-up. He tries every possible ordering to find the best arrangement.', explanation: 'Generate all N! orderings by swapping elements into each position.', animationClass: 'anim-permutations' },
      { id: 'n-queens', name: 'N-Queens', story: 'Oswald places octopus toys on a chessboard so none can attack each other. He tries, fails, backtracks, and retries.', explanation: 'Place N queens on N×N board with no conflicts. Classic constraint-satisfaction via backtracking.', animationClass: 'anim-n-queens' },
    ] },
  { char: 'Jerry', desc: 'Jerry tries every escape tunnel. Dead end? Backtrack and try the next!', concept: 'Build candidates, abandon on failure.',
    patterns: [
      { id: 'subsets', name: 'Subsets / Combinations', story: 'Jerry picks which cheese blocks to grab. He tries every combination to maximize loot without getting caught.', explanation: 'Generate 2^N subsets. Prune infeasible branches.', animationClass: 'anim-subsets' },
      { id: 'permutations', name: 'Permutations', story: 'Jerry rearranges the trap order to confuse Tom. Every possible ordering is considered!', explanation: 'Generate N! orderings.', animationClass: 'anim-permutations' },
      { id: 'n-queens', name: 'N-Queens', story: 'Jerry places cheese bait on a grid so Tom\'s traps can\'t reach any of them from any row or column.', explanation: 'N-Queens constraint satisfaction.', animationClass: 'anim-n-queens' },
    ] },
  { char: 'Rachel', desc: 'Rachel tries on every outfit combination. Bad look? Back to the closet!', concept: 'Build candidates, abandon on failure.',
    patterns: [
      { id: 'subsets', name: 'Subsets / Combinations', story: 'Rachel picks accessories. She tries every possible combination to find the perfect outfit.', explanation: 'Generate 2^N subsets.', animationClass: 'anim-subsets' },
      { id: 'permutations', name: 'Permutations', story: 'Rachel rearranges the seating chart for Monica\'s dinner party, trying every possible arrangement.', explanation: 'Generate N! orderings.', animationClass: 'anim-permutations' },
      { id: 'n-queens', name: 'N-Queens', story: 'Monica seats guests so that no two exes sit in the same row or column of the table. Backtrack on conflicts!', explanation: 'N-Queens constraint satisfaction.', animationClass: 'anim-n-queens' },
    ] },
  { char: 'Shikamaru', desc: 'Shikamaru plans battle strategies. Dead end? Backtrack and recalculate!', concept: 'Build candidates, abandon on failure.',
    patterns: [
      { id: 'subsets', name: 'Subsets / Combinations', story: 'Shikamaru selects which jutsu to bring on a mission. He evaluates every combination to cover all threats.', explanation: 'Generate 2^N subsets.', animationClass: 'anim-subsets' },
      { id: 'permutations', name: 'Permutations', story: 'Shikamaru orders his team\'s attack sequence. Every permutation is evaluated for maximum efficiency.', explanation: 'Generate N! orderings.', animationClass: 'anim-permutations' },
      { id: 'n-queens', name: 'N-Queens', story: 'Shikamaru places shadow traps on a grid so no two share a row, column, or diagonal. Pure strategy!', explanation: 'N-Queens constraint satisfaction.', animationClass: 'anim-n-queens' },
    ] }
);

const greedy = t('greedy', 'Greedy Algorithms', '🤑', '#ffa726', 'advanced',
  { char: 'Oswald', desc: 'Oswald always makes the locally optimal choice at each step, hoping it leads to a globally optimal solution!', concept: 'Make the best choice at each step. Doesn\'t always guarantee the global optimum but works for specific problem structures.',
    patterns: [
      { id: 'activity-selection', name: 'Activity Selection', story: 'Oswald has many errands with different time slots. He always picks the one that ends earliest, freeing up the most future time.', explanation: 'Sort by end time, greedily pick non-overlapping activities. O(N log N).', animationClass: 'anim-activity-selection' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack', story: 'Oswald\'s picnic bag has limited space. He fills it with items having the highest value-per-weight first, even if he must take a fraction.', explanation: 'Sort by value/weight ratio, take greedily. O(N log N). Works because fractions are allowed.', animationClass: 'anim-fractional-knapsack' },
    ] },
  { char: 'Jerry', desc: 'Jerry always grabs the nearest, best piece of cheese at each step.', concept: 'Locally optimal choices at each step.',
    patterns: [
      { id: 'activity-selection', name: 'Activity Selection', story: 'Jerry has multiple escape windows. He picks the one that closes earliest, maximizing future escape chances.', explanation: 'Sort by end time, pick greedily. O(N log N).', animationClass: 'anim-activity-selection' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack', story: 'Jerry\'s tiny bag can only hold so much cheese. He prioritizes the tastiest-per-gram cheese first.', explanation: 'Sort by value/weight. O(N log N).', animationClass: 'anim-fractional-knapsack' },
    ] },
  { char: 'Joey', desc: 'Joey always takes the biggest food item first. Greedy!', concept: 'Locally optimal choices.',
    patterns: [
      { id: 'activity-selection', name: 'Activity Selection', story: 'Joey has auditions at overlapping times. He picks the one that ends earliest to fit the most auditions.', explanation: 'Sort by end time, pick greedily. O(N log N).', animationClass: 'anim-activity-selection' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack', story: 'Joey\'s plate has limited space. He fills it with the most calories-per-bite food first.', explanation: 'Sort by value/weight. O(N log N).', animationClass: 'anim-fractional-knapsack' },
    ] },
  { char: 'Naruto', desc: 'Naruto always charges the nearest enemy first. Sometimes greedy, sometimes foolish!', concept: 'Locally optimal choices.',
    patterns: [
      { id: 'activity-selection', name: 'Activity Selection', story: 'Naruto has multiple missions with time windows. He picks the one ending soonest to fit the most missions.', explanation: 'Sort by end time, pick greedily. O(N log N).', animationClass: 'anim-activity-selection' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack', story: 'Naruto\'s scroll pouch has limited space. He fills it with the highest chakra-per-scroll items first.', explanation: 'Sort by value/weight. O(N log N).', animationClass: 'anim-fractional-knapsack' },
    ] }
);

const dp1d = t('dp-1d', '1-D Dynamic Programming', '📈', '#42a5f5', 'advanced',
  { char: 'Oswald', desc: 'Oswald solves big problems by remembering solutions to smaller sub-problems. No re-doing work!', concept: 'Break problems into overlapping sub-problems, store solutions to avoid recomputation. Memoization (top-down) or Tabulation (bottom-up).',
    patterns: [
      { id: 'climbing-stairs', name: 'Climbing Stairs / Fibonacci', story: 'Oswald climbs stairs to Henry\'s apartment. He can take 1 or 2 steps. How many ways to reach the top? He stores answers for each step.', explanation: 'dp[i] = dp[i-1] + dp[i-2]. Classic intro to DP. O(N) time, O(1) space optimized.', animationClass: 'anim-climbing-stairs' },
      { id: 'house-robber', name: 'House Robber', story: 'A mischievous raccoon visits houses in Big City. He can\'t visit two adjacent houses. What\'s the max loot? At each house: rob or skip.', explanation: 'dp[i] = max(dp[i-1], dp[i-2] + val[i]). Choose to include/exclude at each step.', animationClass: 'anim-house-robber' },
      { id: 'lis', name: 'Longest Increasing Subsequence', story: 'Oswald measures his pancake tower over time. He finds the longest stretch where each pancake was taller than the last.', explanation: 'dp[i] = 1 + max(dp[j]) for all j < i where arr[j] < arr[i]. O(N²) naive, O(N log N) with binary search.', animationClass: 'anim-lis' },
    ] },
  { char: 'Jerry', desc: 'Jerry remembers which escape routes he already figured out. No re-calculating!', concept: 'Overlapping sub-problems + optimal substructure.',
    patterns: [
      { id: 'climbing-stairs', name: 'Climbing Stairs / Fibonacci', story: 'Jerry climbs a shelving unit. 1 or 2 shelves per jump. He stores the number of ways for each shelf.', explanation: 'dp[i] = dp[i-1] + dp[i-2]. O(N).', animationClass: 'anim-climbing-stairs' },
      { id: 'house-robber', name: 'House Robber', story: 'Jerry raids pantries but can\'t take from two adjacent ones (Tom will notice). Max loot calculation!', explanation: 'dp[i] = max(dp[i-1], dp[i-2] + val[i]).', animationClass: 'anim-house-robber' },
      { id: 'lis', name: 'Longest Increasing Subsequence', story: 'Jerry tracks his cheese stash growth. He finds the longest period of strictly increasing stash.', explanation: 'LIS. O(N²) or O(N log N).', animationClass: 'anim-lis' },
    ] },
  { char: 'Ross', desc: 'Ross remembers past relationship mistakes to avoid repeating them. Dynamic programming for life!', concept: 'Overlapping sub-problems + optimal substructure.',
    patterns: [
      { id: 'climbing-stairs', name: 'Climbing Stairs / Fibonacci', story: 'Ross counts how many ways to say "WE WERE ON A BREAK" using 1-word or 2-word chunks at a time.', explanation: 'dp[i] = dp[i-1] + dp[i-2]. O(N).', animationClass: 'anim-climbing-stairs' },
      { id: 'house-robber', name: 'House Robber', story: 'Ross shops for anniversary gifts but can\'t buy at two adjacent stores (budget constraint). Max value!', explanation: 'dp[i] = max(dp[i-1], dp[i-2] + val[i]).', animationClass: 'anim-house-robber' },
      { id: 'lis', name: 'Longest Increasing Subsequence', story: 'Ross tracks his career publications. He finds the longest stretch of strictly increasing impact factors.', explanation: 'LIS. O(N²) or O(N log N).', animationClass: 'anim-lis' },
    ] },
  { char: 'Naruto', desc: 'Naruto remembers past training results to avoid repeating failed jutsu combos.', concept: 'Overlapping sub-problems.',
    patterns: [
      { id: 'climbing-stairs', name: 'Climbing Stairs / Fibonacci', story: 'Naruto runs up the Hokage monument. 1 or 2 steps per jump. He stores ways for each step height.', explanation: 'dp[i] = dp[i-1] + dp[i-2]. O(N).', animationClass: 'anim-climbing-stairs' },
      { id: 'house-robber', name: 'House Robber', story: 'Naruto raids enemy supply caches but can\'t take from adjacent ones (guards will notice). Max supplies!', explanation: 'dp[i] = max(dp[i-1], dp[i-2] + val[i]).', animationClass: 'anim-house-robber' },
      { id: 'lis', name: 'Longest Increasing Subsequence', story: 'Naruto tracks his power level over time. He finds the longest stretch of strictly increasing chakra.', explanation: 'LIS. O(N²) or O(N log N).', animationClass: 'anim-lis' },
    ] }
);

const intervals = t('intervals', 'Intervals', '📅', '#26a69a', 'advanced',
  { char: 'Oswald', desc: 'Oswald plans his day with time slots. Some overlap! He needs to merge, insert, or find conflicts.', concept: 'Problems involving ranges [start, end]. Sort by start/end time, then process linearly.',
    patterns: [
      { id: 'merge-intervals', name: 'Merge Intervals', story: 'Oswald\'s errands overlap (9-11 and 10-12). He merges them into one block (9-12) to see his true schedule.', explanation: 'Sort by start time, merge overlapping intervals. O(N log N).', animationClass: 'anim-merge-intervals' },
      { id: 'meeting-rooms', name: 'Meeting Rooms', story: 'Oswald checks if he can attend ALL events. He sorts by start time and checks for overlaps.', explanation: 'Sort intervals and check if any overlap. O(N log N). Variant: min rooms needed (use min-heap).', animationClass: 'anim-meeting-rooms' },
    ] },
  { char: 'Tom', desc: 'Tom plans trap activation times. Some overlap! He needs to schedule carefully.', concept: 'Range-based problems. Sort & process.',
    patterns: [
      { id: 'merge-intervals', name: 'Merge Intervals', story: 'Tom\'s traps activate at overlapping times. He merges them into one danger window.', explanation: 'Sort by start, merge overlapping. O(N log N).', animationClass: 'anim-merge-intervals' },
      { id: 'meeting-rooms', name: 'Meeting Rooms', story: 'Tom checks if any trap time windows clash. Sort and check for overlaps!', explanation: 'Sort and check overlaps. O(N log N).', animationClass: 'anim-meeting-rooms' },
    ] },
  { char: 'Monica', desc: 'Monica plans her obsessive cleaning schedule. Time blocks overlap. She needs to organize them!', concept: 'Range-based problems.',
    patterns: [
      { id: 'merge-intervals', name: 'Merge Intervals', story: 'Monica\'s cleaning sessions overlap (kitchen 9-11, bathroom 10-12). She merges them: 9-12 cleaning block.', explanation: 'Sort by start, merge. O(N log N).', animationClass: 'anim-merge-intervals' },
      { id: 'meeting-rooms', name: 'Meeting Rooms', story: 'Monica checks if all her events fit without overlap. Sort and check!', explanation: 'Sort and check. O(N log N).', animationClass: 'anim-meeting-rooms' },
    ] },
  { char: 'Mission Schedule', desc: 'The Hokage plans mission time slots. Some overlap! He needs to merge or detect conflicts.', concept: 'Range-based problems.',
    patterns: [
      { id: 'merge-intervals', name: 'Merge Intervals', story: 'Two missions overlap in time. The Hokage merges them into one deployment window.', explanation: 'Sort by start, merge. O(N log N).', animationClass: 'anim-merge-intervals' },
      { id: 'meeting-rooms', name: 'Meeting Rooms', story: 'Can all squads deploy without time conflicts? Sort missions and check for overlaps.', explanation: 'Sort and check. O(N log N).', animationClass: 'anim-meeting-rooms' },
    ] }
);

const tries = t('tries', 'Tries', '🔤', '#7e57c2', 'advanced',
  { char: 'Oswald', desc: 'Oswald builds a letter tree from a dictionary. Each branch is a letter, and following branches spells words!', concept: 'A tree-based data structure for efficient string operations. Each node is a character; paths from root to leaves form words.',
    patterns: [
      { id: 'trie-insert-search', name: 'Insert & Search', story: 'Oswald types friends\' names into his letter tree. To search, he follows branch by branch: O-S-W-A-L-D. Each step narrows options.', explanation: 'Insert/search a word by traversing character by character. O(L) per operation where L = word length.', animationClass: 'anim-trie-insert' },
      { id: 'prefix-match', name: 'Prefix Matching / Autocomplete', story: 'Oswald types "HE" and the letter tree suggests "HENRY", "HELLO", "HELP". All words sharing the prefix!', explanation: 'Traverse to the prefix node, then collect all words in its subtree. Powers autocomplete features.', animationClass: 'anim-prefix-match' },
    ] },
  { char: 'Jerry', desc: 'Jerry builds a code tree from trap labels so he can quickly search for specific traps by prefix.', concept: 'Tree for string operations.',
    patterns: [
      { id: 'trie-insert-search', name: 'Insert & Search', story: 'Jerry indexes trap types (T-R-A-P-1, T-R-A-P-2). Searching follows branches char by char.', explanation: 'O(L) per insert/search.', animationClass: 'anim-trie-insert' },
      { id: 'prefix-match', name: 'Prefix Matching / Autocomplete', story: 'Jerry types "TR" and the trie suggests "TRAP1", "TRAP2", "TRICK". All matching prefixes!', explanation: 'Traverse to prefix node, collect subtree words.', animationClass: 'anim-prefix-match' },
    ] },
  { char: 'Phone Directory', desc: 'The Friends\' phone contacts form a trie. Type a prefix and all matching names appear!', concept: 'Tree for string operations.',
    patterns: [
      { id: 'trie-insert-search', name: 'Insert & Search', story: 'Monica adds contacts to the phone trie. Searching "RO" follows R→O branches to find "ROSS", "ROBERT".', explanation: 'O(L) per insert/search.', animationClass: 'anim-trie-insert' },
      { id: 'prefix-match', name: 'Prefix Matching / Autocomplete', story: 'Rachel types "PH" and autocomplete suggests "PHOEBE", "PHONE", "PHOTO".', explanation: 'Prefix traversal + subtree collection.', animationClass: 'anim-prefix-match' },
    ] },
  { char: 'Jutsu Encyclopedia', desc: 'All jutsu names form a trie. Typing a prefix instantly narrows down matching jutsu.', concept: 'Tree for string operations.',
    patterns: [
      { id: 'trie-insert-search', name: 'Insert & Search', story: 'Naruto adds jutsu to the encyclopedia trie. Searching "RA" follows R→A to find "RASENGAN", "RASENSHURIKEN".', explanation: 'O(L) per insert/search.', animationClass: 'anim-trie-insert' },
      { id: 'prefix-match', name: 'Prefix Matching / Autocomplete', story: 'Typing "SHA" autocompletes to "SHADOW CLONE", "SHARINGAN", "SHATTERED HEAVEN".', explanation: 'Prefix traversal + subtree collection.', animationClass: 'anim-prefix-match' },
    ] }
);

const dp2d = t('dp-2d', '2-D Dynamic Programming', '🧮', '#5c6bc0', 'elite',
  { char: 'Oswald', desc: 'Oswald fills a 2D table of solutions! Each cell depends on its neighbors. Like a spreadsheet of answers.', concept: 'DP with two varying dimensions (e.g., grid position, two sequence indices). State: dp[i][j].',
    patterns: [
      { id: 'grid-dp', name: 'Grid DP', story: 'Oswald navigates a grid map of Big City. At each intersection he can go right or down. He counts all possible paths, storing results per cell.', explanation: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. O(M×N) for an M×N grid.', animationClass: 'anim-grid-dp' },
      { id: 'lcs', name: 'Longest Common Subsequence', story: 'Oswald and Henry compare their favorite spoon sequences. They find the longest shared subsequence using a 2D table.', explanation: 'dp[i][j] compares prefixes of two sequences. O(M×N).', animationClass: 'anim-lcs' },
      { id: 'knapsack-01', name: '0/1 Knapsack', story: 'Oswald packs for a picnic. Each item has weight and value. He fills a 2D table (items × capacity) to maximize value.', explanation: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi). O(N×W).', animationClass: 'anim-knapsack' },
    ] },
  { char: 'Jerry', desc: 'Jerry fills a 2D escape planning table.', concept: '2D state DP.',
    patterns: [
      { id: 'grid-dp', name: 'Grid DP', story: 'Jerry navigates a grid of rooms. Right or down only. Count all escape paths, storing results per cell.', explanation: 'dp[i][j] = dp[i-1][j] + dp[i][j-1].', animationClass: 'anim-grid-dp' },
      { id: 'lcs', name: 'Longest Common Subsequence', story: 'Jerry compares two cheese-hiding sequences to find the longest shared pattern.', explanation: 'Compare sequence prefixes. O(M×N).', animationClass: 'anim-lcs' },
      { id: 'knapsack-01', name: '0/1 Knapsack', story: 'Jerry packs his escape bag. Each cheese has weight and tastiness. Maximize taste within weight limit!', explanation: '0/1 Knapsack. O(N×W).', animationClass: 'anim-knapsack' },
    ] },
  { char: 'Chandler', desc: 'Chandler fills a 2D decision table for life choices.', concept: '2D state DP.',
    patterns: [
      { id: 'grid-dp', name: 'Grid DP', story: 'Chandler navigates a grid of career moves. Right (keep job) or down (change field). Count all career paths.', explanation: 'dp[i][j] grid paths.', animationClass: 'anim-grid-dp' },
      { id: 'lcs', name: 'Longest Common Subsequence', story: 'Ross and Chandler compare their joke repertoires to find the longest shared joke sequence.', explanation: 'Compare sequences. O(M×N).', animationClass: 'anim-lcs' },
      { id: 'knapsack-01', name: '0/1 Knapsack', story: 'Joey fills his food bag at a buffet. Each dish has calories and deliciousness. Maximize joy within stomach capacity!', explanation: '0/1 Knapsack. O(N×W).', animationClass: 'anim-knapsack' },
    ] },
  { char: 'Shikamaru', desc: 'Shikamaru fills a 2D strategy table for battle planning.', concept: '2D state DP.',
    patterns: [
      { id: 'grid-dp', name: 'Grid DP', story: 'Shikamaru navigates a battlefield grid. Each cell has a cost. Find the minimum-cost path to the target.', explanation: 'dp[i][j] grid paths.', animationClass: 'anim-grid-dp' },
      { id: 'lcs', name: 'Longest Common Subsequence', story: 'Shikamaru compares two enemy movement patterns to find the longest common sequence for prediction.', explanation: 'Compare sequences. O(M×N).', animationClass: 'anim-lcs' },
      { id: 'knapsack-01', name: '0/1 Knapsack', story: 'Shikamaru packs his mission pouch. Each tool has weight and utility. Maximize utility within weight limit.', explanation: '0/1 Knapsack. O(N×W).', animationClass: 'anim-knapsack' },
    ] }
);

const advGraphs = t('adv-graphs', 'Advanced Graphs', '🌐', '#009688', 'elite',
  { char: 'Big City Engineers', desc: 'Big City engineers build the minimum-cost road network and find backup routes when roads are blocked.', concept: 'MST, Bellman-Ford, Floyd-Warshall, Network Flow.',
    patterns: [
      { id: 'mst', name: 'MST (Kruskal / Prim)', story: 'Engineers want to connect all of Big City\'s neighborhoods with minimum total road length. They add the cheapest roads first, skipping those that create loops.', explanation: 'Minimum Spanning Tree: Kruskal\'s (sort edges, Union-Find) O(E log E) or Prim\'s (priority queue) O(E log V).', animationClass: 'anim-mst' },
      { id: 'bellman-ford', name: 'Bellman-Ford', story: 'Some Big City roads have tolls (negative weights!). Bellman-Ford relaxes every road V-1 times to find the true shortest path even with negative edges.', explanation: 'Handles negative weights. Relaxes all edges V-1 times. O(V×E). Detects negative cycles.', animationClass: 'anim-bellman-ford' },
    ] },
  { char: 'Architect', desc: 'The house architect designs optimal pipe/wire networks.', concept: 'MST, Bellman-Ford.',
    patterns: [
      { id: 'mst', name: 'MST (Kruskal / Prim)', story: 'The architect connects all rooms with minimum pipe length. Cheapest connections first, skip loops.', explanation: 'MST. O(E log E) or O(E log V).', animationClass: 'anim-mst' },
      { id: 'bellman-ford', name: 'Bellman-Ford', story: 'Some pipes have pressure drops (negative costs). Bellman-Ford finds the true cheapest route.', explanation: 'Negative weights OK. O(V×E).', animationClass: 'anim-bellman-ford' },
    ] },
  { char: 'NYC Transit', desc: 'NYC subway planners design minimum-cost routes between all stops.', concept: 'MST, Bellman-Ford.',
    patterns: [
      { id: 'mst', name: 'MST (Kruskal / Prim)', story: 'Transit planners connect all stations with minimum track length. Cheapest segments first.', explanation: 'MST. O(E log E).', animationClass: 'anim-mst' },
      { id: 'bellman-ford', name: 'Bellman-Ford', story: 'Some subway transfers give refunds (negative cost!). Bellman-Ford finds the true cheapest route.', explanation: 'Negative weights OK. O(V×E).', animationClass: 'anim-bellman-ford' },
    ] },
  { char: 'Shinobi Network', desc: 'The shinobi intelligence network connects villages with minimum communication cost.', concept: 'MST, Bellman-Ford.',
    patterns: [
      { id: 'mst', name: 'MST (Kruskal / Prim)', story: 'Connect all hidden villages with minimum messenger bird routes. Shortest routes first, skip redundant ones.', explanation: 'MST. O(E log E).', animationClass: 'anim-mst' },
      { id: 'bellman-ford', name: 'Bellman-Ford', story: 'Some alliances provide aid (negative costs). Bellman-Ford finds the true cheapest intel path.', explanation: 'Negative weights OK. O(V×E).', animationClass: 'anim-bellman-ford' },
    ] }
);

const bitManip = t('bit-manipulation', 'Bit Manipulation', '💡', '#fdd835', 'elite',
  { char: 'Oswald', desc: 'Oswald uses binary switches! Each light in Big City is either ON (1) or OFF (0). Manipulating bits is lightning fast.', concept: 'Operating directly on binary representations. AND, OR, XOR, shifts enable O(1) tricks for specific problems.',
    patterns: [
      { id: 'and-or-xor', name: 'AND / OR / XOR Tricks', story: 'Oswald has paired socks. XOR cancels out pairs (a⊕a=0). The one left over is the single missing sock!', explanation: 'XOR: find single number. AND: check bit. OR: set bit. Common bit tricks for O(1) operations.', animationClass: 'anim-bit-tricks' },
      { id: 'counting-bits', name: 'Counting Bits', story: 'Oswald counts how many lights are ON in a street number\'s binary representation: 13 = 1101 → 3 lights on.', explanation: 'Brian Kernighan\'s trick: n &= (n-1) removes the lowest set bit. Count iterations. O(number of set bits).', animationClass: 'anim-counting-bits' },
      { id: 'power-of-two', name: 'Power of Two', story: 'Oswald checks if a number of pancakes is a power of 2. If n & (n-1) == 0, it is! Only one bit is set.', explanation: 'n is power of 2 iff n > 0 and n & (n-1) == 0. O(1).', animationClass: 'anim-power-of-two' },
    ] },
  { char: 'Jerry', desc: 'Jerry flips binary trap switches. ON/OFF patterns at the bit level!', concept: 'Binary operations for speed.',
    patterns: [
      { id: 'and-or-xor', name: 'AND / OR / XOR Tricks', story: 'Jerry has paired cheese blocks. XOR them all — the unpaired one remains!', explanation: 'XOR single number. AND/OR bit ops. O(1).', animationClass: 'anim-bit-tricks' },
      { id: 'counting-bits', name: 'Counting Bits', story: 'Jerry counts active traps by counting 1-bits in the binary trap code.', explanation: 'Brian Kernighan\'s trick. O(set bits).', animationClass: 'anim-counting-bits' },
      { id: 'power-of-two', name: 'Power of Two', story: 'Is the trap count a power of 2? Check n & (n-1) == 0.', explanation: 'O(1) check.', animationClass: 'anim-power-of-two' },
    ] },
  { char: 'Chandler', desc: 'Chandler toggles office computer switches. Binary logic at work!', concept: 'Binary operations.',
    patterns: [
      { id: 'and-or-xor', name: 'AND / OR / XOR Tricks', story: 'Everyone has paired office supplies. XOR them all — the one left over is Chandler\'s stolen stapler!', explanation: 'XOR single number. O(1).', animationClass: 'anim-bit-tricks' },
      { id: 'counting-bits', name: 'Counting Bits', story: 'Chandler counts how many features are enabled in a binary settings number.', explanation: 'Count set bits. O(set bits).', animationClass: 'anim-counting-bits' },
      { id: 'power-of-two', name: 'Power of Two', story: 'Is Chandler\'s coffee count today a power of 2? Quick bit check!', explanation: 'O(1) check.', animationClass: 'anim-power-of-two' },
    ] },
  { char: 'Sasuke', desc: 'Sasuke manipulates chakra gates like binary switches. ON/OFF at the bit level.', concept: 'Binary operations.',
    patterns: [
      { id: 'and-or-xor', name: 'AND / OR / XOR Tricks', story: 'Paired chakra gates cancel each other (XOR). The one left open is the vulnerability!', explanation: 'XOR to find unique. O(1).', animationClass: 'anim-bit-tricks' },
      { id: 'counting-bits', name: 'Counting Bits', story: 'Sasuke counts active chakra gates by counting 1-bits in the gate code.', explanation: 'Brian Kernighan\'s trick.', animationClass: 'anim-counting-bits' },
      { id: 'power-of-two', name: 'Power of Two', story: 'Is the number of active Sharingan tomoe a power of 2? n & (n-1) == 0.', explanation: 'O(1) check.', animationClass: 'anim-power-of-two' },
    ] }
);

const mathGeo = t('math-geometry', 'Math & Geometry', '📐', '#8d6e63', 'elite',
  { char: 'Henry the Penguin', desc: 'Henry uses math to count, divide, and find patterns in his spoon collection!', concept: 'Number theory (GCD, primes, modular arithmetic) and computational geometry.',
    patterns: [
      { id: 'gcd-lcm', name: 'GCD / LCM', story: 'Henry has 12 big spoons and 18 small spoons. The GCD (6) tells him the largest equal grouping size. The LCM (36) tells him when both spoon schedules align.', explanation: 'Euclidean algorithm: gcd(a,b) = gcd(b, a%b). O(log(min(a,b))). LCM = a*b/gcd(a,b).', animationClass: 'anim-gcd-lcm' },
      { id: 'sieve', name: 'Sieve of Eratosthenes', story: 'Henry finds all "prime" spoons (only divisible by 1 and themselves). He crosses off multiples starting from 2.', explanation: 'Find all primes up to N by marking multiples. O(N log log N).', animationClass: 'anim-sieve' },
    ] },
  { char: 'Tom', desc: 'Tom uses math to calculate trap placements and angles.', concept: 'Number theory and geometry.',
    patterns: [
      { id: 'gcd-lcm', name: 'GCD / LCM', story: 'Tom has traps reset every 12 seconds and alarms every 18 seconds. GCD=6 is the sync interval. LCM=36 is when both reset together.', explanation: 'Euclidean algorithm. O(log min).', animationClass: 'anim-gcd-lcm' },
      { id: 'sieve', name: 'Sieve of Eratosthenes', story: 'Tom finds all prime-numbered trap positions (only attackable from 1 angle and themselves). Cross off multiples.', explanation: 'Sieve primes. O(N log log N).', animationClass: 'anim-sieve' },
    ] },
  { char: 'Ross', desc: 'Ross the paleontologist uses math for fossil dating and museum geometry.', concept: 'Number theory and geometry.',
    patterns: [
      { id: 'gcd-lcm', name: 'GCD / LCM', story: 'Ross\'s lecture repeats every 12 days and Monica\'s cleaning every 18 days. LCM=36 is when both happen on the same day.', explanation: 'Euclidean algorithm. O(log min).', animationClass: 'anim-gcd-lcm' },
      { id: 'sieve', name: 'Sieve of Eratosthenes', story: 'Ross finds all prime-aged fossils in his collection by sieving out non-prime ages.', explanation: 'Sieve primes. O(N log log N).', animationClass: 'anim-sieve' },
    ] },
  { char: 'Shikamaru', desc: 'Shikamaru uses pure math for strategic calculations on the battlefield.', concept: 'Number theory and geometry.',
    patterns: [
      { id: 'gcd-lcm', name: 'GCD / LCM', story: 'Shikamaru calculates shadow step intervals. Team A moves every 12 seconds, Team B every 18. GCD=6 for synchronized attacks.', explanation: 'Euclidean algorithm.', animationClass: 'anim-gcd-lcm' },
      { id: 'sieve', name: 'Sieve of Eratosthenes', story: 'Shikamaru finds all prime-numbered attack positions that can\'t be divided/flanked. Sieve out composites.', explanation: 'Sieve primes.', animationClass: 'anim-sieve' },
    ] }
);

const stringAlgos = t('string-algorithms', 'String Algorithms', '🔠', '#ec407a', 'elite',
  { char: 'Oswald', desc: 'Oswald needs to find words within long texts efficiently. Simple search is too slow for Big City\'s library!', concept: 'Advanced pattern matching algorithms that find substrings in O(N+M) instead of O(N×M).',
    patterns: [
      { id: 'kmp', name: 'KMP Algorithm', story: 'Oswald builds a "failure function" for his search pattern. When a mismatch occurs, he doesn\'t start over — he knows exactly where to resume, skipping redundant checks!', explanation: 'Precomputes a partial match table (failure function) to skip characters. O(N+M) time.', animationClass: 'anim-kmp' },
      { id: 'rabin-karp', name: 'Rabin-Karp', story: 'Oswald hashes each text window and compares hashes instead of characters. Only on hash matches does he check character by character.', explanation: 'Rolling hash comparison. O(N+M) expected, O(NM) worst case. Good for multi-pattern search.', animationClass: 'anim-rabin-karp' },
    ] },
  { char: 'Jerry', desc: 'Jerry searches for trap patterns in Tom\'s blueprint documents.', concept: 'Advanced pattern matching. O(N+M).',
    patterns: [
      { id: 'kmp', name: 'KMP Algorithm', story: 'Jerry builds a failure function for "TRAP". Mismatch? He doesn\'t restart — he resumes smartly.', explanation: 'KMP. O(N+M).', animationClass: 'anim-kmp' },
      { id: 'rabin-karp', name: 'Rabin-Karp', story: 'Jerry hashes each section of the blueprint and compares hashes for quick pattern detection.', explanation: 'Rolling hash. O(N+M) expected.', animationClass: 'anim-rabin-karp' },
    ] },
  { char: 'Ross', desc: 'Ross searches for keywords in ancient manuscripts. Character-by-character is too slow!', concept: 'Advanced pattern matching.',
    patterns: [
      { id: 'kmp', name: 'KMP Algorithm', story: 'Ross builds a failure function for "DINOSAUR". Mismatch? Skip ahead intelligently, not back to the start.', explanation: 'KMP. O(N+M).', animationClass: 'anim-kmp' },
      { id: 'rabin-karp', name: 'Rabin-Karp', story: 'Ross hashes each window of manuscript text and compares hashes for fast keyword detection.', explanation: 'Rolling hash. O(N+M) expected.', animationClass: 'anim-rabin-karp' },
    ] },
  { char: 'Kakashi', desc: 'Kakashi needs to find jutsu name patterns in decoded enemy scrolls. Speed matters!', concept: 'Advanced pattern matching.',
    patterns: [
      { id: 'kmp', name: 'KMP Algorithm', story: 'Kakashi\'s Sharingan builds a failure function for the jutsu name. Mismatch? Resume at the optimal position.', explanation: 'KMP. O(N+M).', animationClass: 'anim-kmp' },
      { id: 'rabin-karp', name: 'Rabin-Karp', story: 'Kakashi hashes each scroll section for rapid pattern matching. Only full checks on hash collisions.', explanation: 'Rolling hash. O(N+M) expected.', animationClass: 'anim-rabin-karp' },
    ] }
);

const segTree = t('segment-trees', 'Segment Trees & BIT', '🏗️', '#546e7a', 'elite',
  { char: 'Big City Council', desc: 'Big City needs to answer range queries (e.g., total population in districts 3-7) AND update individual values efficiently!', concept: 'Data structures for range queries with point/range updates. O(log N) per query/update.',
    patterns: [
      { id: 'range-query', name: 'Range Queries', story: 'The city council needs the total population of districts 3 to 7. The segment tree stores pre-aggregated ranges, answering in O(log N).', explanation: 'Segment tree: a binary tree where each node stores aggregate info for a range. Query any range in O(log N).', animationClass: 'anim-range-query' },
      { id: 'point-update', name: 'Point Updates', story: 'District 5\'s population changes. The segment tree updates only O(log N) ancestor nodes instead of rebuilding everything.', explanation: 'Update a single element and propagate changes up the tree. O(log N).', animationClass: 'anim-point-update' },
    ] },
  { char: 'Architect', desc: 'The house architect queries room sections and updates individual room values.', concept: 'Range query + point update in O(log N).',
    patterns: [
      { id: 'range-query', name: 'Range Queries', story: 'What\'s the total danger of rooms 3-7? The segment tree answers in O(log N).', explanation: 'Range query. O(log N).', animationClass: 'anim-range-query' },
      { id: 'point-update', name: 'Point Updates', story: 'Room 5\'s danger level changes. Update O(log N) tree nodes.', explanation: 'Point update. O(log N).', animationClass: 'anim-point-update' },
    ] },
  { char: 'Accountant', desc: 'The Friends\' shared expense tracker needs fast range sums and updates.', concept: 'Range query + point update.',
    patterns: [
      { id: 'range-query', name: 'Range Queries', story: 'How much did they spend from March to July? Segment tree answers in O(log N).', explanation: 'Range query. O(log N).', animationClass: 'anim-range-query' },
      { id: 'point-update', name: 'Point Updates', story: 'May\'s expenses changed. Update O(log N) tree nodes.', explanation: 'Point update. O(log N).', animationClass: 'anim-point-update' },
    ] },
  { char: 'War Room', desc: 'The war room tracks troop counts across sectors. Range queries and updates in battle!', concept: 'Range query + point update.',
    patterns: [
      { id: 'range-query', name: 'Range Queries', story: 'How many troops in sectors 3-7? The segment tree answers instantly.', explanation: 'Range query. O(log N).', animationClass: 'anim-range-query' },
      { id: 'point-update', name: 'Point Updates', story: 'Sector 5 reinforcements arrive. Update the tree in O(log N).', explanation: 'Point update. O(log N).', animationClass: 'anim-point-update' },
    ] }
);

// ─── ASSEMBLE THEMES ───

const allTopics = [arrays, strings, linkedLists, stacks, queues, recursion, sorting, binarySearch,
  trees, heaps, graphs, backtracking, greedy, dp1d, intervals, tries,
  dp2d, advGraphs, bitManip, mathGeo, stringAlgos, segTree];

export const DSA_THEMES: ThemeDefinition[] = [
  { id: 'oswald', name: 'Oswald', icon: '🐙', topics: allTopics.map(t => t.oswald) },
  { id: 'tom-jerry', name: 'Tom & Jerry', icon: '🐱', topics: allTopics.map(t => t.tomJerry) },
  { id: 'friends', name: 'Friends TV Show', icon: '☕', topics: allTopics.map(t => t.friends) },
  { id: 'naruto', name: 'Naruto', icon: '🍥', topics: allTopics.map(t => t.naruto) },
];

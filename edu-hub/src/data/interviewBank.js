export const questionsBank = [
  // AWS
  {
    id: 'aws-1',
    trackId: 'aws',
    trackName: 'AWS Cloud',
    category: 'Security & IAM',
    difficulty: 'Senior',
    question: 'What is the difference between an IAM Role and an IAM Policy? How do you decide which to use?',
    answer: 'An IAM Policy is a JSON document defining permissions (Allow/Deny on actions and resources). An IAM Role is an identity assumed by AWS services (EC2, Lambda) or users with policies attached. Use policies to declare permission rules, and roles to grant those permissions without hardcoding static credentials.',
    keyPoints: ['Policies define rules; Roles define identity', 'Instance metadata service rotates role credentials automatically', 'Follow Least Privilege principle']
  },
  {
    id: 'aws-2',
    trackId: 'aws',
    trackName: 'AWS Cloud',
    category: 'Messaging',
    difficulty: 'Senior',
    question: 'Explain SQS Standard vs FIFO queues and when to choose each.',
    answer: 'Standard provides unlimited throughput, best-effort ordering, and at-least-once delivery. FIFO guarantees exact ordering within message groups, exactly-once processing (deduplication ID), and max 300 TPS (3,000+ with batching). Choose FIFO for finance/order management; Standard for high-scale logging and decoupled pipelines.',
    keyPoints: ['FIFO: deduplication ID + Message Group ID', 'Standard: unlimited scale & best-effort order', 'Exactly-once vs at-least-once semantics']
  },
  {
    id: 'aws-3',
    trackId: 'aws',
    trackName: 'AWS Cloud',
    category: 'Compute & Scaling',
    difficulty: 'Principal',
    question: 'How do you design a high-availability Multi-Region Active-Active application on AWS?',
    answer: 'Use Route 53 Latency/Geolocation routing, Aurora Global Database with sub-second replication (or DynamoDB Global Tables), S3 Cross-Region Replication (CRR), and multi-region AWS Lambda/ECS clusters behind regional ALBs.',
    keyPoints: ['Route 53 health-checked failover / latency routing', 'DynamoDB Global Tables / Aurora Global Database', 'Conflict resolution and RTO/RPO targets']
  },
  {
    id: 'aws-4',
    trackId: 'aws',
    trackName: 'AWS Cloud',
    category: 'Serverless',
    difficulty: 'Intermediate',
    question: 'How do you prevent and optimize Lambda Cold Starts in production?',
    answer: 'Mitigate cold starts by keeping deployment packages small, initializing heavy database clients and SDKs outside the handler function (global scope), choosing faster runtimes (Node.js/Go/Rust over heavyweight JVM frameworks), and enabling Provisioned Concurrency for latency-critical paths.',
    keyPoints: ['Global execution context caching', 'Provisioned Concurrency', 'Tree-shaking and runtime memory tuning']
  },

  // GraphQL
  {
    id: 'gql-1',
    trackId: 'graphql',
    trackName: 'GraphQL',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'How does GraphQL eliminate over/under-fetching compared to REST and what are the trade-offs?',
    answer: 'Clients specify exact nested field requirements in one request. Trade-offs: HTTP GET caching is harder because GraphQL queries use POST, query complexity must be protected against malicious nested depth attacks, and resolver cascading can cause N+1 database bottlenecks without DataLoader.',
    keyPoints: ['Single smart endpoint vs multiple REST URLs', 'POST requests bypass default CDN GET caching', 'Requires operation-level monitoring']
  },
  {
    id: 'gql-2',
    trackId: 'graphql',
    trackName: 'GraphQL',
    category: 'Performance',
    difficulty: 'Senior',
    question: 'Explain the N+1 problem in GraphQL resolvers and how DataLoader fixes it.',
    answer: 'When a list query resolves child relationships (e.g. 50 posts resolving author), each child resolver executes an individual DB query (1 + 50 = 51 queries). DataLoader uses Node.js event-loop tick batching to consolidate all IDs into a single SQL `WHERE IN (...)` query and provides request-scoped memoization caching.',
    keyPoints: ['Resolver execution tree runs per field', 'DataLoader batches during the same event loop tick', 'Memoizes per-request cache to prevent redundant queries']
  },

  // Java Spring Boot
  {
    id: 'sb-1',
    trackId: 'springboot',
    trackName: 'Java Spring Boot',
    category: 'Core & Lifecycle',
    difficulty: 'Senior',
    question: 'What happens internally during Spring Boot startup sequence (SpringApplication.run)?',
    answer: 'Spring Boot bootstraps the environment (properties, profiles), instantiates the ApplicationContext, runs BeanFactoryPostProcessors, discovers and registers bean definitions via component scan and @AutoConfiguration, instantiates singletons with dependency injection, invokes BeanPostProcessors and @PostConstruct methods, starts embedded Tomcat/Netty, and fires ApplicationReadyEvent.',
    keyPoints: ['Environment preparation & listeners', 'Auto-configuration evaluation (@Conditional)', 'Bean lifecycle: instantiate -> populate -> post-process -> ready']
  },
  {
    id: 'sb-2',
    trackId: 'springboot',
    trackName: 'Java Spring Boot',
    category: 'JPA & Data',
    difficulty: 'Senior',
    question: 'How do you fix N+1 query problems in Spring Data JPA / Hibernate?',
    answer: 'Use `JOIN FETCH` in JPQL repository queries, apply `@EntityGraph(attributePaths = {"..."})` to repository methods, use DTO projections via constructor expressions, or configure `hibernate.default_batch_fetch_size: 50` in application properties.',
    keyPoints: ['JOIN FETCH loads relations in 1 SQL roundtrip', '@EntityGraph overrides lazy fetching plan', 'Batch fetch size solves collection cascades']
  },

  // Java Core & ICSE/ISC
  {
    id: 'jc-1',
    trackId: 'java-core',
    trackName: 'Java Core & OOP',
    category: 'ICSE/ISC OOP',
    difficulty: 'Beginner',
    question: 'Explain the difference between Method Overloading and Method Overriding with an example.',
    answer: 'Method Overloading occurs in the same class when two methods have the same name but different parameter lists (compile-time polymorphism). Method Overriding occurs when a subclass redefines a method from its superclass with the exact same signature and return type (runtime polymorphism).',
    keyPoints: ['Overloading: compile-time, same class, different parameters', 'Overriding: runtime, subclass/inheritance, exact same signature', 'Use @Override annotation for safety']
  },
  {
    id: 'jc-2',
    trackId: 'java-core',
    trackName: 'Java Core & OOP',
    category: 'Memory & Types',
    difficulty: 'Intermediate',
    question: 'What is the difference between String, StringBuilder, and StringBuffer in Java?',
    answer: 'String is immutable (stored in String Constant Pool). Any modification creates a new object. StringBuilder is mutable and not synchronized (fastest for single-threaded string concatenations). StringBuffer is mutable and synchronized (thread-safe, but with slight lock overhead).',
    keyPoints: ['String is immutable (pool caching)', 'StringBuilder is fast and single-threaded', 'StringBuffer is thread-safe and synchronized']
  },

  // Node.js
  {
    id: 'node-1',
    trackId: 'nodejs',
    trackName: 'Node.js',
    category: 'Runtime & Libuv',
    difficulty: 'Senior',
    question: 'Describe the phases of the Node.js Event Loop and microtask execution order.',
    answer: 'Event loop phases in Libuv: 1. Timers (setTimeout/setInterval), 2. Pending I/O callbacks, 3. Idle/Prepare, 4. Poll (incoming I/O & sockets), 5. Check (setImmediate), 6. Close callbacks. Between each phase and tick: process.nextTick() queue is drained first, followed by Promise microtasks before moving forward.',
    keyPoints: ['nextTick drains before Promise.then()', 'setImmediate executes in Check phase', 'CPU-heavy loops starve the Poll phase']
  },
  {
    id: 'node-2',
    trackId: 'nodejs',
    trackName: 'Node.js',
    category: 'Streams & I/O',
    difficulty: 'Senior',
    question: 'What is Backpressure in Node.js Streams and how do you handle it?',
    answer: 'Backpressure occurs when the destination writable stream cannot write chunks as fast as the readable source produces them, accumulating memory in internal buffers. Using `stream.pipeline()` or `pipe()` automatically pauses the readable stream when `highWaterMark` threshold is reached and resumes on drain events.',
    keyPoints: ['highWaterMark buffer limits', 'stream.pipeline() handles cleanup and error forwarding', 'Prevents out-of-memory crashes on large files']
  },

  // Python (CBSE & Advanced)
  {
    id: 'py-1',
    trackId: 'python',
    trackName: 'Python',
    category: 'CBSE CS Core',
    difficulty: 'Beginner',
    question: 'What is the difference between Mutable and Immutable data types in Python?',
    answer: 'Mutable types (Lists, Dictionaries, Sets) can have their content modified in-place without changing their memory address (id). Immutable types (Integers, Floats, Strings, Tuples, Booleans) cannot be altered once created; any modification returns a new object with a new id.',
    keyPoints: ['Mutable: list, dict, set', 'Immutable: int, str, tuple, float', 'Passing mutable objects to functions alters original data']
  },
  {
    id: 'py-2',
    trackId: 'python',
    trackName: 'Python',
    category: 'Internals & GIL',
    difficulty: 'Senior',
    question: 'Explain Python GIL (Global Interpreter Lock) and its impact on concurrency.',
    answer: 'The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time to keep reference counting thread-safe. As a result, multi-threading benefits I/O-bound tasks (threads release GIL during I/O), but provides no speedup for CPU-bound tasks. CPU tasks require `multiprocessing` or native C extensions.',
    keyPoints: ['Protects CPython memory reference counting', 'IO-bound: threading or AsyncIO works well', 'CPU-bound: requires multiprocessing / ProcessPoolExecutor']
  },

  // C Programming & Systems
  {
    id: 'c-1',
    trackId: 'c-systems',
    trackName: 'C Programming',
    category: 'Pointers & Memory',
    difficulty: 'Intermediate',
    question: 'Explain the difference between Stack Memory and Heap Memory in C, and how malloc/free work.',
    answer: 'Stack memory is managed automatically by CPU for local variables and function call frames (fast, fixed size, automatically deallocated on return). Heap memory is allocated dynamically at runtime via `malloc()` / `calloc()` and persists until explicitly freed with `free()`. Failing to call `free()` leads to memory leaks.',
    keyPoints: ['Stack: fast, auto-allocated, LIFO function frames', 'Heap: dynamic, manual lifecycle via malloc/free', 'Always check malloc != NULL and set pointer to NULL after free']
  },

  // C++ & DSA
  {
    id: 'cpp-1',
    trackId: 'cpp-dsa',
    trackName: 'C++ & DSA',
    category: 'Data Structures & STL',
    difficulty: 'Intermediate',
    question: 'What is the time complexity of searching in `std::vector` vs `std::unordered_map` vs `std::map`?',
    answer: '`std::vector`: O(N) linear search (or O(log N) if sorted using binary_search). `std::unordered_map`: O(1) average time using hash tables (O(N) worst case under hash collisions). `std::map`: O(log N) guaranteed using self-balancing Red-Black Trees (maintains keys in sorted order).',
    keyPoints: ['vector: O(N) unsorted', 'unordered_map: O(1) average hash lookup', 'map: O(log N) ordered Red-Black tree']
  },

  // SQL & Databases
  {
    id: 'sql-1',
    trackId: 'sql',
    trackName: 'SQL & Databases',
    category: 'Queries & Joins',
    difficulty: 'Beginner',
    question: 'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
    answer: 'INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, and matching records from the right table (NULL if no match). FULL OUTER JOIN returns all records when there is a match in either left or right table.',
    keyPoints: ['INNER: only intersecting rows', 'LEFT: all left + matching right (NULL if none)', 'Indexes on join keys speed up query execution']
  },

  // Web Foundations (HTML/CSS/JS)
  {
    id: 'web-1',
    trackId: 'web-foundations',
    trackName: 'HTML, CSS & JS',
    category: 'CSS & DOM',
    difficulty: 'Beginner',
    question: 'Explain the CSS Box Model (Content, Padding, Border, Margin) and box-sizing: border-box.',
    answer: 'The Box Model consists of: Content (the actual element), Padding (space around content inside border), Border (frame wrapping padding and content), and Margin (outer clearance separating element from neighbors). By default `box-sizing: content-box` adds padding and border on top of width. Setting `box-sizing: border-box` includes padding and border within the declared width/height.',
    keyPoints: ['Order: Content -> Padding -> Border -> Margin', 'border-box makes width calculations predictable', 'Margin collapse occurs on vertical block siblings']
  },

  // Scratch & Logic
  {
    id: 'scratch-1',
    trackId: 'scratch-logic',
    trackName: 'Scratch & Logic',
    category: 'Algorithmic Thinking',
    difficulty: 'Beginner',
    question: 'What are the three fundamental control structures used in every programming algorithm?',
    answer: '1. Sequence (executing statements in order from top to bottom), 2. Selection / Branching (making decisions using IF-THEN-ELSE conditions), and 3. Iteration / Loops (repeating instructions using WHILE, FOR, or REPEAT UNTIL loops).',
    keyPoints: ['Sequence: linear flow', 'Selection: conditional branching', 'Iteration: finite or condition-driven repetition']
  }
];

export const cheatSheetsData = {
  sql: {
    track: 'SQL & Databases',
    color: '#336791',
    sections: [
      {
        title: 'Query Order of Execution & DML',
        items: [
          'Logical Processing: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.',
          'Aggregation: COUNT(col) ignores NULLs; COUNT(*) counts all rows including NULLs.',
          'WHERE vs HAVING: WHERE filters rows before aggregation; HAVING filters aggregated groups.',
          'JOIN Types: INNER (matches only), LEFT (all left + matched right), FULL OUTER (all rows from both).'
        ]
      },
      {
        title: 'Indexing & Transactions (ACID)',
        items: [
          'B-Tree Index: O(log N) point lookup and range scans. Composite index requires leftmost prefix match.',
          'ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrency levels), Durability (persisted on disk).',
          'Isolation Levels: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE.'
        ]
      }
    ]
  },
  python: {
    track: 'Python Core & Applied',
    color: '#3776AB',
    sections: [
      {
        title: 'Data Structures & Comprehensions',
        items: [
          'Lists: [1, 2, 3] (mutable dynamic array); Tuples: (1, 2) (immutable); Dicts: {"k": "v"} (hash table O(1)).',
          'List Comprehension: `[x**2 for x in nums if x % 2 == 0]` (faster than map/filter).',
          'Dict Comprehension: `{k: v for k, v in zip(keys, vals)}`',
          'String Slicing: `s[start:stop:step]` (e.g. `s[::-1]` reverses string).'
        ]
      },
      {
        title: 'Functions, Decorators & Memory',
        items: [
          'Args/Kwargs: `def fn(*args, **kwargs)` packs positional args into tuple and keyword args into dict.',
          'Context Managers: `with open("f.txt", "r") as f:` guarantees automatic stream cleanup.',
          'Decorators: `@functools.wraps(fn)` preserves function metadata during wrapping.',
          'Global Interpreter Lock (GIL): CPython mutex allowing only one native thread to execute bytecode at once.'
        ]
      }
    ]
  },
  'java-core': {
    track: 'Java Core & OOP',
    color: '#E76F00',
    sections: [
      {
        title: 'OOP Pillars & Class Design',
        items: [
          'Encapsulation: private fields accessed via public getters/setters.',
          'Inheritance: single class inheritance via `extends`; multiple interface contracts via `implements`.',
          'Polymorphism: Compile-time (Method Overloading) vs Runtime (Method Overriding with `@Override`).',
          'Abstraction: Abstract classes (state + partial implementation) vs Interfaces (contracts, default methods).'
        ]
      },
      {
        title: 'JVM Memory & Collections Framework',
        items: [
          'Stack: stores primitive local variables and method call frames. Heap: stores dynamic objects and arrays.',
          'String Pool: `String s = "a"` reuses pooled literal; `new String("a")` forces heap allocation.',
          'ArrayList (contiguous O(1) random access) vs LinkedList (doubly linked nodes O(1) insert/remove).',
          'HashMap: Array of buckets with linked lists converted to Red-Black Trees when bucket size > 8.'
        ]
      }
    ]
  },
  'c-systems': {
    track: 'C Language & Systems',
    color: '#A8B9CC',
    sections: [
      {
        title: 'Pointers & Memory Architecture',
        items: [
          'Address-of `&var` retrieves memory location; Dereference `*ptr` accesses value at address.',
          'Pointer Arithmetic: `ptr + 1` increments address by `sizeof(*ptr)` bytes.',
          'Dynamic Memory: `malloc(size)` (uninitialized), `calloc(n, size)` (zeroed), `realloc(ptr, size)`, `free(ptr)`.',
          'Memory Safety: Always set pointers to `NULL` after `free(ptr)` to prevent dangling pointer hazards.'
        ]
      },
      {
        title: 'Structs, Unions & Bit Manipulation',
        items: [
          'Struct Alignment: Compilers pad struct members to align with CPU architecture boundaries (e.g., 4 or 8 bytes).',
          'Bitwise Operators: `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), `<<` (left shift = *2), `>>` (right shift = /2).',
          'Bit Masking: Set bit: `x |= (1 << n)`; Clear bit: `x &= ~(1 << n)`; Toggle bit: `x ^= (1 << n)`; Check bit: `(x >> n) & 1`.'
        ]
      }
    ]
  },
  'cpp-dsa': {
    track: 'C++ & DSA Competitive Coding',
    color: '#00599C',
    sections: [
      {
        title: 'Competitive Fast I/O & STL Containers',
        items: [
          'Fast I/O: `ios_base::sync_with_stdio(false); cin.tie(NULL);` prevents standard I/O synchronization bottlenecks.',
          'std::vector: Dynamic contiguous array; use `vec.reserve(N)` to prevent amortized reallocation.',
          'std::map (Red-Black tree, O(log N) sorted) vs std::unordered_map (Hash table, average O(1)).',
          'Priority Queue: `priority_queue<int>` (Max-Heap default); `priority_queue<int, vector<int>, greater<int>>` (Min-Heap).'
        ]
      },
      {
        title: 'Core Algorithmic Patterns',
        items: [
          'Two Pointers & Sliding Window: Solve contiguous subarray / substring problems in linear O(N) time.',
          'Binary Search on Answer: Monotonic condition check with `mid = low + (high - low) / 2`.',
          'Monotonic Stack: Next Greater Element / Stock Span problems in linear O(N) amortized time.',
          'Union-Find (DSU): Disjoint sets with Path Compression and Union by Rank runs in near-constant alpha(N) time.'
        ]
      }
    ]
  },
  'web-foundations': {
    track: 'HTML, CSS & JavaScript',
    color: '#F7DF1E',
    sections: [
      {
        title: 'CSS Box Model, Flexbox & Grid',
        items: [
          'Box Sizing: `*, *::before, *::after { box-sizing: border-box; }` includes padding and border inside width.',
          'Flexbox: 1D layout (`justify-content` aligns along main axis; `align-items` aligns along cross axis).',
          'CSS Grid: 2D responsive matrix; `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` eliminates media queries.',
          'CSS Specificity: `!important` > Inline style (1000) > ID (100) > Class/Attribute/Pseudo-class (10) > Element (1).'
        ]
      },
      {
        title: 'DOM, Event Loop & Modern ES6+',
        items: [
          'Event Delegation: Attach single listener on parent using `event.target.closest(".item")` for dynamic lists.',
          'Event Loop: Call Stack → Microtasks (Promises, queueMicrotask) → Macrotasks (setTimeout, I/O) → Rendering.',
          'Closures: Functions retain lexical access to outer variables even after outer function has returned.',
          'Fetch API: Always verify `res.ok` before parsing JSON; use `AbortController` for request timeouts.'
        ]
      }
    ]
  },
  'scratch-logic': {
    track: 'Scratch & Visual Logic',
    color: '#FFAB19',
    sections: [
      {
        title: 'Block Structures & Algorithmic Translation',
        items: [
          'Events & Triggers: `when green flag clicked` initializes state, reset positions, and zero score counters.',
          'Sequential Execution: Blocks snap together vertically and execute sequentially from top to bottom.',
          'Conditionals: `if <condition> then` vs `if <condition> then ... else` branching constructs.',
          'Loops: `repeat (n)` (fixed loop), `forever` (infinite game loop), `repeat until <condition>` (while loop).'
        ]
      },
      {
        title: 'Variables, Broadcasting & Flowcharts',
        items: [
          'Variable Scope: "For all sprites" (global state) vs "For this sprite only" (local instance variable).',
          'Broadcasting: Publish-subscribe event messaging between sprites (`broadcast [msg]` and `when I receive [msg]`).',
          'Flowchart Symbols: Oval (Start/End), Rectangle (Process/Assignment), Diamond (Decision/Condition), Parallelogram (I/O).'
        ]
      }
    ]
  },
  springboot: {
    track: 'Java Spring Boot & Microservices',
    color: '#6DB33F',
    sections: [
      {
        title: 'Core Annotations & IoC Container',
        items: [
          '@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan.',
          'Stereotypes: @Component, @Service (business logic), @Repository (DAO exceptions translation), @RestController (JSON output).',
          'Dependency Injection: Prefer Constructor Injection over @Autowired on fields for testability and immutability.',
          'Bean Scopes: Singleton (default, single instance per Spring context), Prototype (new instance on every request).'
        ]
      },
      {
        title: 'Spring Data JPA & Security',
        items: [
          'JPA N+1 Problem: Solve using `@EntityGraph` or `JOIN FETCH` queries instead of default lazy collection queries.',
          'Transactions: `@Transactional` manages commit/rollback; by default rolls back on unchecked RuntimeExceptions only.',
          'Spring Security 6: Use `SecurityFilterChain` bean with method chaining and stateless JWT filter chain.'
        ]
      }
    ]
  },
  nodejs: {
    track: 'Node.js & Asynchronous Systems',
    color: '#339933',
    sections: [
      {
        title: 'Libuv Architecture & Event Loop Phases',
        items: [
          'Phases: Timers (setTimeout) → Pending Callbacks → Idle/Prepare → Poll (I/O) → Check (setImmediate) → Close Callbacks.',
          'process.nextTick(): Runs immediately before the next phase of the event loop (higher priority than microtasks).',
          'Cluster & Worker Threads: `cluster` forks OS processes sharing ports; `worker_threads` runs CPU-heavy tasks in threads.'
        ]
      },
      {
        title: 'Streams & Buffer Management',
        items: [
          'Stream Types: Readable, Writable, Duplex (TCP socket), Transform (zlib, crypto cipher).',
          'Backpressure: Handle slow consumer buffering by respecting `stream.write() === false` and waiting for `drain` event.',
          'Pipeline: Use `stream.promises.pipeline(readStream, transformStream, writeStream)` for safe error handling.'
        ]
      }
    ]
  },
  aws: {
    track: 'AWS Cloud Architecture',
    color: '#FF9900',
    sections: [
      {
        title: 'Core Compute & Serverless Rules',
        items: [
          'Lambda: 15 minutes max execution timeout; memory configurable from 128 MB to 10,240 MB.',
          'EC2 Storage: EBS (network persistent volume) vs Instance Store (ephemeral, physically attached, high IOPS).',
          'ECS Fargate (serverless container management without EC2 instances) vs EKS (managed Kubernetes cluster).'
        ]
      },
      {
        title: 'Storage & Distributed Databases',
        items: [
          'S3 Storage Classes: Standard → Infrequent Access (IA) → Glacier Flexible (minutes to hours) → Glacier Deep Archive (12h).',
          'DynamoDB: Partition Key (hash key) + Sort Key (range key); 1 RCU = 4KB strongly consistent read/sec.',
          'Aurora: Multi-AZ storage engine with 6 storage copies across 3 AZs; up to 15 read replicas with sub-10ms replication lag.'
        ]
      }
    ]
  }
};

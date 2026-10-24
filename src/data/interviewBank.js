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
  {
    id: 'gql-3',
    trackId: 'graphql',
    trackName: 'GraphQL',
    category: 'Security',
    difficulty: 'Principal',
    question: 'How do you secure a production GraphQL API from resource exhaustion attacks?',
    answer: 'Implement Query Depth Limiting (restricting nested child levels), Query Complexity Analysis (assigning point costs to fields and rejecting queries over budget), Rate Limiting based on IP/token, and disabling Schema Introspection in production.',
    keyPoints: ['Depth limiting plugin', 'Cost calculation / complexity budget', 'Disable introspection in prod']
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
  {
    id: 'sb-3',
    trackId: 'springboot',
    trackName: 'Java Spring Boot',
    category: 'Transactions',
    difficulty: 'Principal',
    question: 'How does @Transactional work under the hood and why does self-invocation fail?',
    answer: 'Spring creates CGLIB dynamic proxies wrapping the bean with TransactionInterceptor. When called externally, the proxy intercepts the call, starts a transaction on the TransactionManager, executes the method, and commits/rolls back. Self-invocation (`this.method()`) bypasses the proxy and calls the target directly without transaction boundaries.',
    keyPoints: ['AOP proxy intercepts public method calls', 'Self-invocation bypasses proxy', 'Requires public method modifier']
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
  {
    id: 'node-3',
    trackId: 'nodejs',
    trackName: 'Node.js',
    category: 'Concurrency',
    difficulty: 'Principal',
    question: 'Cluster Module vs Worker Threads: When to use which?',
    answer: 'Cluster module forks multiple independent OS processes sharing the server port, ideal for scaling I/O-bound web traffic across CPU cores. Worker Threads execute multiple threads within the same process sharing memory via SharedArrayBuffer, essential for CPU-bound computations (image encoding, ML, cryptography).',
    keyPoints: ['Cluster = multi-process for web scale', 'Worker Threads = multi-threaded CPU tasks with shared memory', 'IPC communication vs SharedArrayBuffer']
  },

  // Python
  {
    id: 'py-1',
    trackId: 'python',
    trackName: 'Python',
    category: 'Internals & GIL',
    difficulty: 'Senior',
    question: 'Explain Python GIL (Global Interpreter Lock) and its impact on concurrency.',
    answer: 'The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time to keep reference counting thread-safe. As a result, multi-threading benefits I/O-bound tasks (threads release GIL during I/O), but provides no speedup for CPU-bound tasks. CPU tasks require `multiprocessing` or native C extensions.',
    keyPoints: ['Protects CPython memory reference counting', 'IO-bound: threading or AsyncIO works well', 'CPU-bound: requires multiprocessing / ProcessPoolExecutor']
  },
  {
    id: 'py-2',
    trackId: 'python',
    trackName: 'Python',
    category: 'Language Core',
    difficulty: 'Senior',
    question: 'How do Python Decorators and @functools.wraps work?',
    answer: 'Decorators are higher-order functions that take a function, wrap it with additional pre/post behavior, and return a new callable. `@functools.wraps(fn)` copies original metadata like `__name__`, `__doc__`, and module attributes from the wrapped function to avoid breaking introspection and doc generators.',
    keyPoints: ['Syntactic sugar for fn = decorator(fn)', 'wraps preserves docstrings and function identity', 'Can accept parameters via 3-level nested closures']
  },
  {
    id: 'py-3',
    trackId: 'python',
    trackName: 'Python',
    category: 'AsyncIO & Web',
    difficulty: 'Senior',
    question: 'How does AsyncIO achieve cooperative concurrency and how does FastAPI leverage it?',
    answer: 'AsyncIO runs a single-threaded event loop managing Coroutines. When a coroutine reaches `await`, it suspends execution and yields control back to the event loop so other ready tasks execute. FastAPI runs on ASGI servers (Uvicorn), allowing thousands of concurrent HTTP connections without thread context-switching overhead.',
    keyPoints: ['Single-threaded event loop + coroutines', 'Non-blocking cooperative yielding at await', 'FastAPI + Pydantic v2 high-speed async throughput']
  }
];

export const cheatSheetsData = {
  aws: {
    track: 'AWS Cloud',
    color: '#FF9900',
    sections: [
      {
        title: 'Core Compute & Serverless Rules',
        items: [
          'Lambda execution limit: 15 minutes max; memory: 128 MB to 10,240 MB.',
          'EC2 instances: EBS (network persistent) vs Instance Store (ephemeral, high IOPS).',
          'ECS Fargate: serverless containers (no EC2 management); EKS: managed Kubernetes.'
        ]
      },
      {
        title: 'Storage & DB Cheat Codes',
        items: [
          'S3 Standard vs Glacier Deep Archive (12h retrieval, lowest cost).',
          'DynamoDB: Partition Key (hash) + Sort Key (range); 1 RCU = 4KB strongly consistent read.',
          'Aurora: 6 copies across 3 AZs; up to 15 read replicas with sub-10ms lag.'
        ]
      },
      {
        title: 'VPC & Networking Essentials',
        items: [
          'Security Groups: Stateful (allow outbound for accepted inbound).',
          'NACLs: Stateless (evaluated by rule order, inbound + outbound required).',
          'NAT Gateway: Private subnet outbound access (lives in public subnet).'
        ]
      }
    ]
  },
  graphql: {
    track: 'GraphQL',
    color: '#E535AB',
    sections: [
      {
        title: 'SDL & Type System Rules',
        items: [
          'Field modifiers: String (nullable) vs String! (non-nullable) vs [String!]! (list & elements required).',
          'Query = read operations; Mutation = write operations with return payloads; Subscription = WebSocket pushes.',
          'Input Types (`input UserInput`) cannot contain interfaces or unions.'
        ]
      },
      {
        title: 'Performance & N+1 Prevention',
        items: [
          'DataLoader consolidates array of keys in single event loop tick.',
          'DataLoader instances MUST be request-scoped (never global singleton cache).',
          'Use Persisted Queries (APQ) for HTTP GET caching on CDN edge.'
        ]
      },
      {
        title: 'Security Must-Haves',
        items: [
          'Always set maximum Query Depth Limit (e.g. max 5-7).',
          'Calculate Query Complexity before resolver execution.',
          'Disable Schema Introspection in production environments.'
        ]
      }
    ]
  },
  springboot: {
    track: 'Java Spring Boot',
    color: '#6DB33F',
    sections: [
      {
        title: 'IoC & Bean Lifecycle',
        items: [
          'Preferred Injection: Constructor Injection with `final` fields (avoids NPEs and circular ref).',
          'Bean scopes: singleton (default), prototype, request, session.',
          'Bean Lifecycle: Constructor -> Dependency Injection -> BeanPostProcessor -> @PostConstruct -> Ready.'
        ]
      },
      {
        title: 'JPA Performance Cheat Sheet',
        items: [
          'Eliminate N+1 with `JOIN FETCH` or `@EntityGraph(attributePaths = {"..."})`.',
          'Set `spring.jpa.properties.hibernate.default_batch_fetch_size: 50`.',
          'Never call `@Transactional` method from the same class (self-invocation proxy bypass).'
        ]
      },
      {
        title: 'Spring Security 6 Pattern',
        items: [
          'Use `SecurityFilterChain` bean instead of deprecated `WebSecurityConfigurerAdapter`.',
          'Stateless APIs: `SessionCreationPolicy.STATELESS` + JWT Resource Server.',
          'Actuator: protect `/actuator/**` in production except `/health`.'
        ]
      }
    ]
  },
  nodejs: {
    track: 'Node.js',
    color: '#339933',
    sections: [
      {
        title: 'Libuv Event Loop Order',
        items: [
          'Execution priority: Synchronous code -> process.nextTick() -> Promise microtasks -> Libuv Phase.',
          'Phases: Timers -> Pending I/O -> Idle/Prepare -> Poll -> Check (setImmediate) -> Close.',
          'Never run CPU-heavy JSON.parse / crypto sync on the main thread.'
        ]
      },
      {
        title: 'Streams & Buffer Rules',
        items: [
          'Always use `stream.pipeline()` instead of `.pipe()` for safe error propagation.',
          'Backpressure: writable stream buffer `highWaterMark` reached returns `false`.',
          'Buffers live in V8 external memory, not the JS heap.'
        ]
      },
      {
        title: 'Scaling & Clustering',
        items: [
          'Cluster module forks OS processes sharing the same TCP port.',
          'Worker Threads share memory via `SharedArrayBuffer` for CPU compute.',
          'Debug memory leaks with `node --inspect` heap snapshots.'
        ]
      }
    ]
  },
  python: {
    track: 'Python',
    color: '#3776AB',
    sections: [
      {
        title: 'Core Language Mechanics',
        items: [
          'Use `@functools.wraps(fn)` on all custom decorators to preserve metadata.',
          'Generators: `yield` creates lazy state machine saving gigabytes of memory.',
          'Context Managers: implement `__enter__` and `__exit__` for clean cleanup.'
        ]
      },
      {
        title: 'Concurrency & The GIL',
        items: [
          'CPython GIL allows only 1 thread to execute bytecode at a time.',
          'I/O-bound: Use `asyncio` or `threading` (GIL is released during I/O).',
          'CPU-bound: Use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor`.'
        ]
      },
      {
        title: 'FastAPI & Modern Backend',
        items: [
          'FastAPI routes: `async def` runs on main event loop; regular `def` runs on thread pool.',
          'Pydantic v2 is implemented in Rust for 5-20x validation speedup.',
          'Use Composable Dependency Injection via `Annotated[Type, Depends(...)]`.'
        ]
      }
    ]
  }
};

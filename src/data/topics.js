export const topicsData = {
  aws: {
    id: 'aws',
    name: 'AWS Cloud',
    title: 'Amazon Web Services (AWS)',
    tagline: 'Cloud Computing, Architecture, Serverless & Infrastructure',
    icon: 'Cloud',
    badge: 'Cloud & DevOps',
    gradient: 'from-amber-500 to-orange-600',
    color: '#FF9900',
    overview: 'Comprehensive guide to AWS core services, modern cloud architecture patterns, serverless paradigms, security (IAM), and production best practices.',
    sections: [
      {
        id: 'core-compute',
        title: 'Compute & Serverless (EC2, Lambda, ECS, EKS)',
        difficulty: 'Core',
        summary: 'Deep dive into virtual machines, serverless functions, and container orchestration.',
        content: `### 1. AWS Lambda vs EC2 vs ECS/EKS
- **EC2 (Elastic Compute Cloud):** Full OS control, persistent background daemons, predictable sustained loads.
- **AWS Lambda:** Event-driven, sub-second auto-scaling, pay-per-millisecond execution (max 15 mins execution time). Ideal for REST APIs, async triggers (S3, SQS, DynamoDB Streams).
- **ECS (Elastic Container Service) & EKS (Kubernetes):** Container orchestration. Fargate launch type gives serverless containers without node management.

### Key Lambda Optimization Tips:
- **Cold Starts:** Mitigate with Provisioned Concurrency, smaller deployment artifacts, and keeping database connections in global execution context.
- **Memory & CPU:** Lambda allocates CPU proportionally to configured RAM (up to 10GB).`,
        codeSnippet: `// AWS Lambda Node.js 20.x Handler Pattern
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const { userId } = event.pathParameters || {};
  
  const response = await docClient.send(new GetCommand({
    TableName: process.env.USERS_TABLE,
    Key: { id: userId }
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response.Item || { error: "Not Found" })
  };
};`
      },
      {
        id: 'storage-db',
        title: 'Storage & Databases (S3, DynamoDB, RDS, Aurora)',
        difficulty: 'Intermediate',
        summary: 'Understanding block, object, relational, and NoSQL storage tiers.',
        content: `### 1. Amazon S3 (Simple Storage Service)
- **Storage Classes:** Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive.
- **Features:** S3 Versioning, Lifecycle Policies, Presigned URLs for secure temporary direct uploads.

### 2. DynamoDB (NoSQL Key-Value & Document)
- **Single-Table Design:** Leverage Partition Keys (PK) and Sort Keys (SK) with Global Secondary Indexes (GSIs) to fulfill all access patterns in one table.
- **Consistency:** Eventual Consistency (default) vs Strongly Consistent Reads (costs 2x RCU).`,
        codeSnippet: `// Python boto3 - S3 Presigned URL generation
import boto3
from botocore.config import Config

s3 = boto3.client('s3', config=Config(signature_version='s3v4'))

def generate_upload_url(bucket_name, object_key, expiration_sec=300):
    return s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': bucket_name, 'Key': object_key, 'ContentType': 'application/pdf'},
        ExpiresIn=expiration_sec,
        HttpMethod='PUT'
    )`
      },
      {
        id: 'networking-security',
        title: 'VPC, IAM, API Gateway & CloudFront',
        difficulty: 'Advanced',
        summary: 'Designing isolated subnets, least-privilege policies, and edge CDN distribution.',
        content: `### 1. Virtual Private Cloud (VPC)
- **Subnets:** Public (routes to Internet Gateway IGW) vs Private (routes to NAT Gateway for outbound egress only).
- **Security Groups (Stateful):** Attached to ENIs. If inbound is allowed, outbound reply is automatically allowed.
- **NACLs (Stateless):** Operates at subnet boundary. Inbound and outbound must be explicitly allowed by rule numbers.

### 2. IAM (Identity and Access Management)
- Follow **Least Privilege** principle.
- Use IAM Roles with temporary STS credentials for EC2/ECS/Lambda instead of static API access keys.`,
        codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnlySpecificPrefix",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-company-reports",
        "arn:aws:s3:::my-company-reports/finance/*"
      ]
    }
  ]
}`
      }
    ],
    interviewQA: [
      {
        q: "What is the difference between SQS Standard and SQS FIFO queues?",
        a: "Standard queues provide nearly unlimited throughput, at-least-once delivery, and best-effort ordering. FIFO queues preserve exact first-in-first-out order, guarantee exactly-once processing (deduplication ID), and support message group IDs with up to 300 msg/s (or 3,000+ with batching)."
      },
      {
        q: "How does DynamoDB handle autoscaling and partitioning?",
        a: "DynamoDB calculates partitions based on storage (>10GB per partition) or provisioned throughput (>1000 WCU or >3000 RCU). On-demand mode auto-allocates capacity instantly based on traffic spikes."
      },
      {
        q: "How do you achieve disaster recovery (RTO / RPO) across AWS Regions?",
        a: "Options range from Backup & Restore (hours RTO/RPO), Pilot Light (minutes), Warm Standby, to Multi-Region Active-Active using Route 53 latency routing and Aurora Global Database / DynamoDB Global Tables."
      }
    ]
  },

  graphql: {
    id: 'graphql',
    name: 'GraphQL',
    title: 'GraphQL API Architecture',
    tagline: 'Schema-first API Design, Resolvers, DataLoader & Subscriptions',
    icon: 'Layers',
    badge: 'API & Query Language',
    gradient: 'from-pink-500 to-rose-600',
    color: '#E535AB',
    overview: 'Master GraphQL type systems, Queries, Mutations, Subscriptions, resolving the N+1 problem with DataLoader, and Apollo/Yoga ecosystem.',
    sections: [
      {
        id: 'schema-design',
        title: 'Schema Definition Language (SDL) & Types',
        difficulty: 'Core',
        summary: 'Defining types, scalars, enums, interfaces, unions, and inputs.',
        content: `### 1. Schema-First Philosophy
GraphQL contracts are strongly typed. Clients ask for exact fields, eliminating over-fetching and under-fetching.

### Key Types:
- **Object Types:** Defines structure of entities with fields.
- **Scalar Types:** Int, Float, String, Boolean, ID, and Custom Scalars (DateTime, JSON).
- **Interface & Union:** Enables polymorphism in queries.
- **Input Types:** Special types used exclusively as arguments in mutations/queries.`,
        codeSnippet: `type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  posts(limit: Int = 10): [Post!]!
}

enum Role {
  ADMIN
  EDITOR
  USER
}

input CreatePostInput {
  title: String!
  content: String!
  tags: [String!]
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}

type Query {
  user(id: ID!): User
  feed: [Post!]!
}`
      },
      {
        id: 'resolvers-n-plus-one',
        title: 'Resolvers & The N+1 Problem (DataLoader)',
        difficulty: 'Advanced',
        summary: 'How resolver trees execute and how batching/caching solves cascading database queries.',
        content: `### 1. Resolver Execution Tree
Each field in a GraphQL query maps to a resolver function: \`(parent, args, context, info) => result\`.

### 2. The N+1 Problem
When fetching 50 posts and each post resolves its \`author\`, without batching, the server executes 1 query for posts + 50 individual queries for authors (51 total DB roundtrips).

### 3. Solution: DataLoader
DataLoader consolidates individual lookups requested in a single tick of the Node.js event loop into a single batch query (e.g., \`SELECT * FROM users WHERE id IN (...)\`) and provides memoized per-request caching.`,
        codeSnippet: `import DataLoader from 'dataloader';

// Batch function receives array of IDs requested across all resolvers
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.users.find({ _id: { $in: userIds } });
  // Map back strictly in the order of input keys
  const userMap = new Map(users.map(u => [u.id.toString(), u]));
  return userIds.map(id => userMap.get(id) || null);
});

// Resolver
export const resolvers = {
  Post: {
    author: (post, args, { loaders }) => loaders.userLoader.load(post.authorId)
  }
};`
      },
      {
        id: 'subscriptions-security',
        title: 'Real-time Subscriptions & API Security',
        difficulty: 'Intermediate',
        summary: 'WebSocket subscriptions, query complexity analysis, and rate limiting.',
        content: `### 1. GraphQL Subscriptions
Utilizes WebSockets (graphql-ws) and PubSub engines (Redis PubSub / RabbitMQ) for event push.

### 2. GraphQL Security Best Practices:
- **Query Depth Limiting:** Prevent cyclic nested queries (e.g. \`author { posts { author { posts { ... } } } }\`).
- **Query Complexity Analysis:** Assign point costs to fields and reject queries exceeding maximum budget.
- **Disable Introspection:** In production environments to prevent schema exposure.`,
        codeSnippet: `import { createYoga, createSchema } from 'graphql-yoga';
import { useDepthLimit } from '@envelop/depth-limit';
import { useRateLimiter } from '@envelop/rate-limiter';

const yoga = createYoga({
  schema,
  plugins: [
    useDepthLimit({ maxDepth: 6 }),
    useRateLimiter({
      identifyFn: (ctx) => ctx.request.headers.get('x-forwarded-for') || 'anon',
      rateLimit: { window: '1m', max: 100 }
    })
  ]
});`
      }
    ],
    interviewQA: [
      {
        q: "What is the core difference between REST and GraphQL?",
        a: "REST exposes multiple fixed endpoints returning fixed data shapes, often leading to over-fetching or under-fetching and multiple network requests. GraphQL provides a single smart endpoint where clients describe the precise data shape needed in a single round-trip."
      },
      {
        q: "How does GraphQL caching differ from REST caching?",
        a: "REST leverages native HTTP caching (URLs, ETags, Cache-Control) easily because each URL represents a resource. GraphQL sends POST requests to a single endpoint, so caching requires Normalized Client Caches (Apollo/Relay cache via Type:ID) or Server-side response caching with cache hints."
      },
      {
        q: "Explain Schema Federation / Subgraphs.",
        a: "Apollo Federation / GraphQL Federation decomposes a monolithic schema into independent subgraphs owned by microservices, composed by a Gateway / Router that coordinates query plans transparently for clients."
      }
    ]
  },

  springboot: {
    id: 'springboot',
    name: 'Java Spring Boot',
    title: 'Spring Boot & Enterprise Java',
    tagline: 'Spring Framework, IoC/DI, Microservices, Security, JPA & Actuator',
    icon: 'Coffee',
    badge: 'Enterprise Backend',
    gradient: 'from-emerald-500 to-teal-700',
    color: '#6DB33F',
    overview: 'In-depth coverage of Spring Boot 3, Spring Security, JPA/Hibernate performance, Transaction management, and Cloud Microservices.',
    sections: [
      {
        id: 'bootstrap-ioc',
        title: 'Startup Lifecycle, IoC & Dependency Injection',
        difficulty: 'Core',
        summary: 'SpringApplication.run() sequence, ApplicationContext, and DI mechanics.',
        content: `### 1. Application Startup Internals
- \`SpringApplication.run()\`: Creates \`ApplicationContext\`, prepares environment, fires lifecycle events, executes \`BeanFactoryPostProcessor\` and \`BeanPostProcessor\`, and initializes embedded Tomcat/Netty.

### 2. Dependency Injection Best Practice
- **Constructor Injection** is the industry standard: enforces immutability (\`final\` fields), prevents NPEs at runtime, and allows easy unit testing without reflection.`,
        codeSnippet: `@Service
@RequiredArgsConstructor // Lombok generates constructor for all final fields
public class OrderService {

    private final PaymentGateway paymentGateway;
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = Order.fromRequest(request);
        orderRepository.save(order);
        paymentGateway.process(order.getPaymentDetails());
        eventPublisher.publishEvent(new OrderCreatedEvent(order.getId()));
        return OrderResponse.fromEntity(order);
    }
}`
      },
      {
        id: 'jpa-transactions',
        title: 'JPA/Hibernate, Transactions & N+1 Fixes',
        difficulty: 'Advanced',
        summary: 'Transaction propagation, isolation levels, Entity Graphs, and QueryDSL.',
        content: `### 1. @Transactional Mechanics
- Spring uses CGLIB dynamic proxies to wrap methods with \`TransactionInterceptor\`.
- Self-invocation (calling a \`@Transactional\` method from within the same class) bypasses the proxy and fails to start a transaction.

### 2. Solving N+1 in JPA:
- Use \`JOIN FETCH\` in JPQL queries.
- Use \`@EntityGraph(attributePaths = {"items", "customer"})\` on Spring Data repository methods.
- Configure \`hibernate.default_batch_fetch_size: 50\`.`,
        codeSnippet: `public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Prevents N+1 by fetching customer and items in a single SQL JOIN
    @Query("SELECT o FROM Order o JOIN FETCH o.customer LEFT JOIN FETCH o.items WHERE o.status = :status")
    List<Order> findAllWithDetailsByStatus(@Param("status") OrderStatus status);

    // Alternative via EntityGraph
    @EntityGraph(attributePaths = {"customer", "items"})
    Optional<Order> findWithGraphById(UUID id);
}`
      },
      {
        id: 'security-microservices',
        title: 'Spring Security 6 & Microservices Architecture',
        difficulty: 'Intermediate',
        summary: 'SecurityFilterChain, OAuth2 / JWT Resource Server, and Resilience4j patterns.',
        content: `### 1. Modern Spring Security (Lambda DSL)
Spring Security 6 removed \`WebSecurityConfigurerAdapter\` in favor of standalone \`SecurityFilterChain\` bean definitions.

### 2. Microservice Patterns:
- **API Gateway:** Spring Cloud Gateway (Reactive netty-based routing).
- **Service Discovery:** Netflix Eureka or Consul.
- **Resilience:** Resilience4j Circuit Breaker, RateLimiter, and Retry.`,
        codeSnippet: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
            .build();
    }
}`
      }
    ],
    interviewQA: [
      {
        q: "What is the difference between @Component, @Service, and @Repository?",
        a: "@Component is the generic stereotype for any Spring bean. @Service marks business service layer components. @Repository marks data access components and adds automatic exception translation (translates database-specific SQLExceptions into Spring's DataAccessException hierarchy)."
      },
      {
        q: "What are the common Spring Bean Scopes?",
        a: "1. singleton (default, single instance per IoC container), 2. prototype (new instance created each time requested), 3. request (per HTTP request), 4. session (per HTTP session), 5. application (per ServletContext)."
      },
      {
        q: "How does Spring Boot Auto-Configuration work?",
        a: "Spring Boot reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. It evaluates conditional annotations like @ConditionalOnClass, @ConditionalOnMissingBean, and @ConditionalOnProperty to register beans only when relevant classes or properties exist."
      }
    ]
  },

  nodejs: {
    id: 'nodejs',
    name: 'Node.js',
    title: 'Node.js Runtime & Microservices',
    tagline: 'Event Loop, Libuv, Streams, Worker Threads & Fastify/Express',
    icon: 'Server',
    badge: 'Backend JavaScript / TS',
    gradient: 'from-green-600 to-emerald-800',
    color: '#339933',
    overview: 'Master the asynchronous non-blocking I/O model, Libuv event loop phases, Streams & Buffers, memory profiling, and high-performance server architectures.',
    sections: [
      {
        id: 'event-loop',
        title: 'Event Loop, Microtasks & Libuv Internals',
        difficulty: 'Advanced',
        summary: 'Understanding Timers, Pending Callbacks, Poll, Check, and Close phases.',
        content: `### 1. Event Loop Phases (Libuv):
1. **Timers:** \`setTimeout\`, \`setInterval\`
2. **Pending Callbacks:** Deferred I/O callbacks from previous loop
3. **Idle / Prepare:** Internal Libuv housekeeping
4. **Poll:** Retrieves new I/O events (sockets, incoming connections)
5. **Check:** \`setImmediate()\` callbacks
6. **Close Callbacks:** \`socket.on('close', ...)\`

### 2. Microtask Queues:
- \`process.nextTick()\` has highest priority, drained immediately after current operation before any promise queue.
- \`Promise.then()\` microtasks execute before moving to next event loop phase.`,
        codeSnippet: `console.log('1: Sync');

setTimeout(() => console.log('2: Timeout'), 0);
setImmediate(() => console.log('3: Immediate'));

process.nextTick(() => console.log('4: nextTick'));
Promise.resolve().then(() => console.log('5: Promise'));

console.log('6: Sync End');

// Execution Order:
// 1: Sync
// 6: Sync End
// 4: nextTick
// 5: Promise
// 2: Timeout (or 3 depending on loop start tick)
// 3: Immediate`
      },
      {
        id: 'streams-buffers',
        title: 'Streams, Buffers & Backpressure',
        difficulty: 'Intermediate',
        summary: 'Readable, Writable, Transform streams and pipe vs pipeline with error propagation.',
        content: `### 1. Why Streams Matter
Streams allow processing data chunks incrementally without loading massive files (gigabytes) into RAM.

### 2. The Backpressure Phenomenon
Occurs when the write destination (disk/socket) cannot consume data as fast as the readable source produces it. \`stream.pipeline()\` automatically pauses reading when internal write buffer (\`highWaterMark\`) is full.`,
        codeSnippet: `import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function compressLogFile(sourcePath, destPath) {
  try {
    await pipeline(
      createReadStream(sourcePath),
      createGzip(),
      createWriteStream(destPath)
    );
    console.log('Compression complete with automatic backpressure handling.');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}`
      },
      {
        id: 'concurrency-clustering',
        title: 'Cluster, Worker Threads & Memory Profiling',
        difficulty: 'Advanced',
        summary: 'Multi-core scaling with Cluster module vs Worker Threads for CPU-bound tasks.',
        content: `### 1. Cluster vs Worker Threads:
- **Cluster Module:** Spawns multiple OS processes sharing the same server port. Ideal for scaling I/O bound web servers across all CPU cores.
- **Worker Threads (\`worker_threads\`):** Spawns threads inside the same OS process with shared memory (\`SharedArrayBuffer\`). Essential for CPU-intensive tasks (image resizing, ML inference, cryptography).`,
        codeSnippet: `// worker.js (CPU heavy work)
import { parentPort, workerData } from 'node:worker_threads';

function calculatePrimes(max) {
  const primes = [];
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) { isPrime = false; break; }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

const result = calculatePrimes(workerData.max);
parentPort.postMessage(result);`
      }
    ],
    interviewQA: [
      {
        q: "What causes memory leaks in Node.js applications and how do you debug them?",
        a: "Common causes: global variables, uncleaned event listeners, closures retaining unused scope variables, and unbounded caching objects. Debugged using Node's `--inspect` flag with Chrome DevTools heap snapshots or heap dump analyzers like clinic.js."
      },
      {
        q: "What is the difference between spawn, exec, and fork in child_process?",
        a: "exec buffers stdout/stderr in memory and returns when finished (best for small output). spawn streams data via events (ideal for large payloads/long processes). fork is a specialized spawn for creating child Node.js instances with built-in IPC communication."
      },
      {
        q: "How does Node.js handle CPU-bound tasks without blocking the main event loop?",
        a: "Options: 1. Offload to Worker Threads (`worker_threads`), 2. Delegate to an external job queue (BullMQ + Redis worker processes), or 3. Break long computations into asynchronous chunks with `setImmediate()`."
      }
    ]
  },

  python: {
    id: 'python',
    name: 'Python',
    title: 'Python Core, AsyncIO & Backend Ecosystem',
    tagline: 'Generators, Decorators, Concurrency, GIL, FastAPI & Metaprogramming',
    icon: 'Terminal',
    badge: 'Modern Python 3.12+',
    gradient: 'from-blue-600 to-indigo-700',
    color: '#3776AB',
    overview: 'Deep dive into Python internals, memory model, Global Interpreter Lock (GIL), AsyncIO coroutines, FastAPI / Django architectures, and performance optimization.',
    sections: [
      {
        id: 'internals-decorators',
        title: 'Decorators, Generators & Context Managers',
        difficulty: 'Core',
        summary: 'First-class functions, yield state machines, and resource management protocols.',
        content: `### 1. Decorators & \`functools.wraps\`
Decorators wrap functions using higher-order functions. \`@wraps(func)\` preserves original metadata (\`__name__\`, \`__doc__\`).

### 2. Generators & Yield
Generators suspend execution using the iterator protocol (\`__iter__\`, \`__next__\`), delivering memory-efficient lazy evaluations.

### 3. Context Managers
Implement \`__enter__\` and \`__exit__\` for deterministic resource acquisition and cleanup (or use \`@contextmanager\`).`,
        codeSnippet: `import time
from functools import wraps
from typing import Callable, Any

def retry_with_backoff(retries: int = 3, backoff_factor: float = 1.5):
    def decorator(func: Callable[..., Any]):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = 0.5
            for attempt in range(1, retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == retries:
                        raise
                    time.sleep(delay)
                    delay *= backoff_factor
        return wrapper
    return decorator

@retry_with_backoff(retries=3)
def fetch_remote_data():
    # Network call
    pass`
      },
      {
        id: 'asyncio-gil',
        title: 'AsyncIO, Coroutines & The GIL',
        difficulty: 'Advanced',
        summary: 'Cooperative multitasking with event loops, async/await, and multi-threading vs multi-processing.',
        content: `### 1. The Global Interpreter Lock (GIL)
The GIL is a mutex preventing multiple native threads from executing Python bytecodes simultaneously.
- **I/O bound operations:** Multi-threading is effective because threads release the GIL during network/disk I/O.
- **CPU bound operations:** Multi-processing (\`multiprocessing\` or \`ProcessPoolExecutor\`) is mandatory to bypass the GIL across CPU cores.

### 2. AsyncIO Event Loop
Single-threaded cooperative multitasking. Coroutines yield control at \`await\` expressions to run other pending tasks concurrently.`,
        codeSnippet: `import asyncio
import httpx

async def fetch_status(client: httpx.AsyncClient, url: str) -> dict:
    response = await client.get(url, timeout=5.0)
    return {"url": url, "status": response.status_code}

async def check_all_services(urls: list[str]):
    async with httpx.AsyncClient() as client:
        tasks = [fetch_status(client, url) for url in urls]
        # Runs all requests concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

# asyncio.run(check_all_services(['https://api.github.com', 'https://httpbin.org/get']))`
      },
      {
        id: 'fastapi-pydantic',
        title: 'Modern Web APIs with FastAPI & Pydantic v2',
        difficulty: 'Intermediate',
        summary: 'Type validation, dependency injection, async request handling, and OpenAPI auto-generation.',
        content: `### 1. Why FastAPI Excels
- Built on Starlette (async ASGI) and Pydantic v2 (Rust-backed high-speed data validation).
- Automatic interactive documentation via OpenAPI/Swagger.
- Composable Dependency Injection system (\`Depends\`).`,
        codeSnippet: `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from typing import Annotated

app = FastAPI(title="Edu Hub Python API")

class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    age: int = Field(ge=18, le=120)

async def get_current_user_token(authorization: str = ""):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    return authorization.removeprefix("Bearer ")

@app.post("/users", status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserRegister,
    token: Annotated[str, Depends(get_current_user_token)]
):
    return {"message": f"User {user.username} created successfully"} `
      }
    ],
    interviewQA: [
      {
        q: "What is the difference between deepcopy and shallow copy in Python?",
        a: "A shallow copy (`copy.copy()`) creates a new container object, but populates it with references to the child objects inside. A deep copy (`copy.deepcopy()`) recursively duplicates the container AND all nested objects, ensuring mutations to the copy never alter the original."
      },
      {
        q: "Explain Python's Memory Management and Garbage Collection.",
        a: "Python uses Reference Counting as its primary memory management mechanism (freed immediately when refcount reaches 0). To collect cyclic references (e.g. A references B, B references A), it runs a generational cyclic Garbage Collector (Generations 0, 1, 2)."
      },
      {
        q: "What are Python Metaclasses and when should they be used?",
        a: "Metaclasses are 'classes of a class' (type is the default metaclass). They intercept and customize class construction time (e.g., ORM models in Django/SQLAlchemy, registration decorators, or enforcing schema constraints before runtime)."
      }
    ]
  }
};

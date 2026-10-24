export const systemDesignChallenges = [
  {
    id: 'springboot-notification',
    title: 'Spring Boot Event-Driven Notification Service (In-Memory Cache)',
    description: 'Design a Spring Boot notification service that receives trigger events, reads recipient preferences & templates from In-Memory Cache (Redis/Caffeine), enriches/processes payload, and publishes outbound notification events (SQS/Kafka/Push).',
    requirements: [
      'Ingest inbound trigger event (Order Placed, Auth Alert, Account Activity)',
      'Query In-Memory Cache (Redis / Caffeine) for sub-millisecond recipient preferences & templates',
      'Execute Spring Boot business logic (template rendering, rate-limiting, deduplication)',
      'Publish outbound notification event to SQS / Kafka / SNS for multi-channel delivery (Email, SMS, Push)',
      'Attach Dead Letter Queue (DLQ) for failed dispatches and transient errors'
    ],
    recommendedFlow: ['Client / Webhook', 'API Gateway', 'Spring Boot Service', 'Redis Cache', 'SQS / Kafka', 'Dead Letter Queue (DLQ)'],
    expectedComponents: ['gateway', 'compute', 'cache', 'queue', 'dlq']
  },
  {
    id: 'payment-processing',
    title: 'High-Reliability Payment Processing Service',
    description: 'Design an asynchronous payment ingestion pipeline with 99.999% reliability, zero message loss, fault isolation, and idempotency guarantees.',
    requirements: [
      'Ingest payment transactions via authenticated API',
      'Asynchronous decoupling to handle traffic spikes without dropping requests',
      'Zero message loss with failure fallback (Dead Letter Queue)',
      'ACID transactional ledger database for balance and transaction updates',
      'Idempotent processing preventing double charges'
    ],
    recommendedFlow: ['Client', 'API Gateway', 'Spring Boot', 'SQS / Kafka', 'Node.js Worker', 'PostgreSQL / RDS', 'Dead Letter Queue (DLQ)'],
    expectedComponents: ['gateway', 'queue', 'dlq', 'compute', 'database']
  },
  {
    id: 'read-heavy-feed',
    title: 'Ultra Low-Latency Feed / Catalog System',
    description: 'Design a read-heavy system serving 100,000+ QPS with sub-10ms latency, handling traffic bursts, and protecting backend databases from cache stampedes.',
    requirements: [
      'Serve high read traffic with global sub-10ms response times',
      'Multi-tier caching (Edge CDN + In-Memory Cache)',
      'Protect primary database from overload during traffic spikes',
      'Event-driven cache invalidation when catalog data is updated'
    ],
    recommendedFlow: ['Client', 'CloudFront CDN', 'ALB / Gateway', 'FastAPI / Python', 'Redis Cache', 'DynamoDB / PostgreSQL'],
    expectedComponents: ['cdn', 'gateway', 'cache', 'compute', 'database']
  },
  {
    id: 'realtime-chat',
    title: 'Real-Time Chat & Notification System',
    description: 'Design a bi-directional real-time chat service supporting millions of concurrent connections, instant delivery, offline push notifications, and message persistence.',
    requirements: [
      'Persistent bi-directional WebSocket connections for active users',
      'Pub/Sub message broker to broadcast messages across multiple backend instances',
      'NoSQL storage for rapid append-only message history queries',
      'Offline asynchronous notification fallback via push service queue'
    ],
    recommendedFlow: ['Client', 'API Gateway (WebSocket)', 'Node.js Service', 'Redis Pub/Sub', 'DynamoDB', 'SQS / Notifications'],
    expectedComponents: ['gateway', 'compute', 'queue', 'database', 'cache']
  },
  {
    id: 'custom',
    title: 'Custom Architecture Design',
    description: 'Specify your own functional requirements, traffic profile, and system constraints, then build, simulate live events, and validate your flow.',
    requirements: [
      'Build a well-architected flow matching your custom requirements',
      'Ensure security boundaries, decoupling, and high availability'
    ],
    recommendedFlow: [],
    expectedComponents: []
  }
];

export const nodePalette = [
  { type: 'client', label: 'Inbound Event Producer / Client', category: 'client', color: '#60a5fa', icon: 'Smartphone' },
  { type: 'cdn', label: 'CloudFront CDN', category: 'edge', color: '#f59e0b', icon: 'Globe' },
  { type: 'gateway', label: 'API Gateway / Ingestion API', category: 'edge', color: '#f59e0b', icon: 'Shield' },
  { type: 'graphql', label: 'GraphQL Router', category: 'edge', color: '#ec4899', icon: 'Layers' },
  { type: 'springboot', label: 'Java Spring Boot App', category: 'compute', color: '#10b981', icon: 'Coffee' },
  { type: 'nodejs', label: 'Node.js Microservice', category: 'compute', color: '#10b981', icon: 'Server' },
  { type: 'fastapi', label: 'Python FastAPI', category: 'compute', color: '#3b82f6', icon: 'Terminal' },
  { type: 'lambda', label: 'AWS Lambda (Serverless)', category: 'compute', color: '#f97316', icon: 'Zap' },
  { type: 'cache', label: 'In-Memory Cache (Redis/Caffeine)', category: 'storage', color: '#e11d48', icon: 'Zap' },
  { type: 'queue', label: 'Outbound Event Bus (Kafka/SQS)', category: 'async', color: '#8b5cf6', icon: 'Inbox' },
  { type: 'dlq', label: 'Dead Letter Queue (DLQ)', category: 'async', color: '#ef4444', icon: 'AlertTriangle' },
  { type: 'postgres', label: 'PostgreSQL / RDS (ACID)', category: 'storage', color: '#2563eb', icon: 'Database' },
  { type: 'dynamodb', label: 'DynamoDB (NoSQL)', category: 'storage', color: '#d97706', icon: 'Database' },
  { type: 's3', label: 'Amazon S3 Object Store', category: 'storage', color: '#059669', icon: 'HardDrive' }
];

export function analyzeArchitecture(nodes, connections, challengeId, customReqText) {
  const pros = [];
  const cons = [];
  const antiPatterns = [];
  const recommendations = [];
  let score = 100;

  if (nodes.length === 0) {
    return {
      score: 0,
      verdict: 'Empty Canvas',
      pros: [],
      cons: ['No architecture components added to the canvas.'],
      antiPatterns: ['System contains no nodes.'],
      recommendations: ['Drag components from the sidebar and connect them with arrows to begin analysis.']
    };
  }

  const types = new Set(nodes.map(n => n.type));
  const hasClient = types.has('client');
  const hasGateway = types.has('gateway') || types.has('graphql') || types.has('cdn');
  const hasSpringBoot = types.has('springboot');
  const hasCompute = types.has('springboot') || types.has('nodejs') || types.has('fastapi') || types.has('lambda');
  const hasQueue = types.has('queue');
  const hasDLQ = types.has('dlq');
  const hasCache = types.has('cache');
  const hasDB = types.has('postgres') || types.has('dynamodb');
  const hasCDN = types.has('cdn');

  // Adjacency map
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  connections.forEach(c => {
    if (adj[c.from]) adj[c.from].push(c.to);
  });

  // 1. Direct Database Exposure Check
  nodes.filter(n => n.type === 'client').forEach(clientNode => {
    const targets = adj[clientNode.id] || [];
    targets.forEach(targetId => {
      const targetNode = nodes.find(n => n.id === targetId);
      if (targetNode && (targetNode.type === 'postgres' || targetNode.type === 'dynamodb' || targetNode.type === 'cache')) {
        antiPatterns.push(`Critical Anti-Pattern: Client directly connected to Database/Cache (${targetNode.label}) bypassing security & authentication layer.`);
        score -= 25;
      }
    });
  });

  // 2. Gateway & Edge Checks
  if (hasClient && !hasGateway) {
    antiPatterns.push('Missing Edge/Gateway layer: Direct connections to backend services lack centralized rate limiting, TLS termination, and auth verification.');
    score -= 15;
    cons.push('Lack of centralized API gateway increases security attack surface and DDoS vulnerability.');
    recommendations.push('Add an API Gateway / Load Balancer between clients and backend microservices.');
  } else if (hasGateway) {
    pros.push('Edge Layer Enabled: API Gateway / Ingestion API provides centralized traffic routing, authentication, and DDoS mitigation.');
  }

  // 3. Compute Layer Checks
  if (hasCompute) {
    pros.push('Decoupled Compute Layer: Business logic isolated within scalable backend services.');
  } else if (nodes.length > 2) {
    cons.push('No compute layer detected to process business rules, input validation, and transactional workflows.');
    score -= 20;
    recommendations.push('Add a compute service (Java Spring Boot, Node.js, Python FastAPI, or AWS Lambda).');
  }

  // 4. Spring Boot Notification Service Evaluation
  if (challengeId === 'springboot-notification' || (customReqText && customReqText.toLowerCase().includes('notification'))) {
    if (hasSpringBoot) {
      pros.push('Spring Boot Compute: High-throughput Spring Framework ecosystem with native Spring Data Redis and Spring Cloud Stream / Kafka integration.');
    } else {
      cons.push('Missing Spring Boot service specifically requested in requirement.');
      score -= 15;
      recommendations.push('Add Java Spring Boot component to serve as the core notification orchestrator.');
    }

    if (hasCache) {
      pros.push('Sub-Millisecond In-Memory Cache: Redis / Caffeine enables ultra-fast recipient preference & template lookups without hitting persistent DB.');
    } else {
      antiPatterns.push('Missing In-Memory Cache: Notification processing will suffer latency penalties if user preferences and notification templates are fetched from slow disk DB.');
      score -= 25;
      recommendations.push('Add In-Memory Cache (Redis/Caffeine) connected to Spring Boot.');
    }

    if (hasQueue) {
      pros.push('Asynchronous Outbound Event Bus: SQS / Kafka queue isolates notification dispatching (email, SMS, APNs) from the main application thread.');
    } else {
      cons.push('Synchronous Dispatch Bottleneck: Sending emails/push notifications synchronously blocks worker threads during 3rd-party latency spikes.');
      score -= 20;
      recommendations.push('Add an Outbound Event Bus (Kafka / SQS) to decouple notification publishing from downstream delivery providers.');
    }

    if (hasDLQ) {
      pros.push('Dead Letter Queue (DLQ) Attached: Catches poisoned payloads, invalid recipient IDs, or downstream provider outages for reprocessing.');
    } else {
      cons.push('Missing DLQ: Failed outbound notifications risk silent message loss without a dedicated Dead Letter Queue.');
      score -= 10;
      recommendations.push('Attach a Dead Letter Queue (DLQ) to the notification event queue.');
    }
  }

  // 5. Payment Processing Evaluation
  if (challengeId === 'payment-processing') {
    if (hasQueue) {
      pros.push('Asynchronous Resilience: Queue buffers transaction bursts preventing downstream database saturation.');
    } else {
      cons.push('Synchronous Coupling: Direct synchronous writes to database risk connection pool exhaustion during traffic surges.');
      score -= 20;
      recommendations.push('Insert SQS / Kafka queue between the API Gateway / Ingestion API and processing workers.');
    }

    if (hasDLQ) {
      pros.push('Zero Message Loss: Dead Letter Queue (DLQ) captures failed transactions for inspection and reprocessing.');
    } else {
      antiPatterns.push('Missing Dead Letter Queue (DLQ): Poison-pill messages or transient database failures can cause unrecoverable dropped payments.');
      score -= 15;
      recommendations.push('Attach a Dead Letter Queue (DLQ) to the message broker for error isolation.');
    }

    if (types.has('postgres')) {
      pros.push('ACID Compliance: PostgreSQL provides strong consistency, row locking, and rollback safety for financial transactions.');
    }
  }

  // 6. Read Heavy Feed Evaluation
  if (challengeId === 'read-heavy-feed') {
    if (hasCache) {
      pros.push('High-Throughput In-Memory Caching: Redis shields primary database from high read QPS and delivers sub-millisecond retrieval.');
    } else {
      cons.push('Database Bottleneck: High read volume (100k+ QPS) directly hitting database causes latency spikes and resource starvation.');
      score -= 25;
      recommendations.push('Add a Redis / In-Memory Cache layer in front of the database.');
    }

    if (hasCDN) {
      pros.push('Edge Caching: CloudFront CDN terminates client requests closest to users, drastically lowering TTFB and origin load.');
    } else {
      cons.push('Missing Edge CDN: Global static/cached responses travel all the way to origin, increasing latency.');
      score -= 10;
      recommendations.push('Add CloudFront CDN at the ingress tier.');
    }
  }

  // 7. Realtime Chat Evaluation
  if (challengeId === 'realtime-chat') {
    if (types.has('nodejs') || types.has('fastapi')) {
      pros.push('Event-Driven WebSocket Handling: Asynchronous runtime handles thousands of persistent concurrent WebSocket connections with low memory footprint.');
    }
    if (types.has('cache')) {
      pros.push('Pub/Sub Broadcast: Redis Pub/Sub coordinates message dispatch across horizontally scaled application servers.');
    } else {
      cons.push('Missing Message Fan-Out: Without Redis Pub/Sub or message broker, users connected to different server instances cannot exchange messages.');
      score -= 20;
      recommendations.push('Integrate Redis Pub/Sub to synchronize WebSocket messages across cluster instances.');
    }
  }

  // General connection sanity
  if (connections.length === 0 && nodes.length > 1) {
    cons.push('Nodes exist on the canvas but have no connecting flow arrows.');
    score = Math.min(score, 30);
    recommendations.push('Click and drag connections between nodes to define the request data flow.');
  }

  // Ensure score bounds
  score = Math.max(10, Math.min(100, score));

  let verdict = 'Needs Improvement';
  if (score >= 85) verdict = 'Production Ready & Robust';
  else if (score >= 65) verdict = 'Good Baseline with Trade-offs';

  return {
    score,
    verdict,
    pros: pros.length > 0 ? pros : ['Basic modular structure is present.'],
    cons: cons.length > 0 ? cons : ['No major operational bottlenecks detected for current configuration.'],
    antiPatterns,
    recommendations: recommendations.length > 0 ? recommendations : ['Architecture satisfies the core reliability and security requirements.']
  };
}

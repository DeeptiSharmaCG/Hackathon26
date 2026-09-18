export interface GraphNode {
  id: string;
  label: string;
  group: 'Person' | 'Founder' | 'CTO' | 'Company' | 'Event' | string;
  labels: string[];
  properties: {
    name?: string;
    title?: string;
    company?: string;
    location?: string;
    industry?: string;
    seniority?: string;
    size?: string;
    city?: string;
    date?: string;
    [key: string]: any;
  };
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  type: string;
  properties?: {
    weight?: number;
    since?: string;
    context?: string;
    confidence?: number;
    reason?: string;
    [key: string]: any;
  };
}

export const FALLBACK_NODES: GraphNode[] = [
  // People
  { id: 'p_me', label: 'Tanishq', group: 'Person', labels: ['Person'], properties: { name: 'Tanishq', title: 'Product Engineer', company: 'NetworkAI', location: 'Bengaluru', industry: 'Technology', seniority: 'Lead' } },
  { id: 'p1', label: 'Alice Johnson', group: 'Person', labels: ['Person'], properties: { name: 'Alice Johnson', title: 'Engineering Director', company: 'Microsoft', location: 'Seattle', industry: 'Technology', seniority: 'Director' } },
  { id: 'p2', label: 'Bob Smith', group: 'Person', labels: ['Person'], properties: { name: 'Bob Smith', title: 'Senior Staff Engineer', company: 'Google', location: 'Bengaluru', industry: 'Technology', seniority: 'Staff' } },
  { id: 'p3', label: 'Shashank Kumar', group: 'CTO', labels: ['Person'], properties: { name: 'Shashank Kumar', title: 'CTO', company: 'Razorpay', location: 'Bengaluru', industry: 'Fintech', seniority: 'CTO' } },
  { id: 'p4', label: 'Sarah Lin', group: 'Person', labels: ['Person'], properties: { name: 'Sarah Lin', title: 'VP Engineering', company: 'Razorpay', location: 'Bengaluru', industry: 'Fintech', seniority: 'VP' } },
  { id: 'p5', label: 'David Chen', group: 'Founder', labels: ['Person'], properties: { name: 'David Chen', title: 'Founder & CEO', company: 'FinAI Labs', location: 'Singapore', industry: 'Fintech', seniority: 'Founder' } },
  { id: 'p6', label: 'Priya Sharma', group: 'Person', labels: ['Person'], properties: { name: 'Priya Sharma', title: 'Head of AI', company: 'Swiggy', location: 'Bengaluru', industry: 'Consumer Tech', seniority: 'Director' } },
  { id: 'p7', label: 'Arun Patel', group: 'Person', labels: ['Person'], properties: { name: 'Arun Patel', title: 'Angel Investor', company: 'VentureCraft', location: 'Mumbai', industry: 'Venture Capital', seniority: 'Partner' } },
  { id: 'p8', label: 'Elena Rostova', group: 'Person', labels: ['Person'], properties: { name: 'Elena Rostova', title: 'Principal Architect', company: 'Stripe', location: 'San Francisco', industry: 'Fintech', seniority: 'Principal' } },
  { id: 'p9', label: 'Rahul Verma', group: 'CTO', labels: ['Person'], properties: { name: 'Rahul Verma', title: 'Co-Founder & CTO', company: 'PayFlow', location: 'Bengaluru', industry: 'Fintech', seniority: 'CTO' } },
  { id: 'p10', label: 'Kavita Nair', group: 'Person', labels: ['Person'], properties: { name: 'Kavita Nair', title: 'Staff Research Scientist', company: 'OpenAI', location: 'San Francisco', industry: 'Artificial Intelligence', seniority: 'Staff' } },
  { id: 'p11', label: 'John Collison', group: 'Founder', labels: ['Person'], properties: { name: 'John Collison', title: 'President & Co-Founder', company: 'Stripe', location: 'San Francisco', industry: 'Fintech', seniority: 'Founder' } },
  { id: 'p12', label: 'Vikram Malhotra', group: 'Person', labels: ['Person'], properties: { name: 'Vikram Malhotra', title: 'Managing Partner', company: 'Sequoia India', location: 'Bengaluru', industry: 'Venture Capital', seniority: 'Partner' } },
  { id: 'p13', label: 'Ananya Roy', group: 'Person', labels: ['Person'], properties: { name: 'Ananya Roy', title: 'VP Product', company: 'PhonePe', location: 'Bengaluru', industry: 'Fintech', seniority: 'VP' } },
  { id: 'p14', label: 'Neil Bhatt', group: 'Founder', labels: ['Person'], properties: { name: 'Neil Bhatt', title: 'Founder & CEO', company: 'AgentScale', location: 'Bengaluru', industry: 'Artificial Intelligence', seniority: 'Founder' } },

  // Companies
  { id: 'c1', label: 'Razorpay', group: 'Company', labels: ['Company'], properties: { name: 'Razorpay', industry: 'Fintech', size: '1000+' } },
  { id: 'c2', label: 'Microsoft', group: 'Company', labels: ['Company'], properties: { name: 'Microsoft', industry: 'Technology', size: '100000+' } },
  { id: 'c3', label: 'Google', group: 'Company', labels: ['Company'], properties: { name: 'Google', industry: 'Technology', size: '100000+' } },
  { id: 'c4', label: 'Swiggy', group: 'Company', labels: ['Company'], properties: { name: 'Swiggy', industry: 'Consumer Tech', size: '5000+' } },
  { id: 'c5', label: 'Stripe', group: 'Company', labels: ['Company'], properties: { name: 'Stripe', industry: 'Fintech', size: '7000+' } },
  { id: 'c6', label: 'Zomato', group: 'Company', labels: ['Company'], properties: { name: 'Zomato', industry: 'Consumer Tech', size: '4000+' } },
  { id: 'c7', label: 'PhonePe', group: 'Company', labels: ['Company'], properties: { name: 'PhonePe', industry: 'Fintech', size: '3000+' } },
  { id: 'c8', label: 'Freshworks', group: 'Company', labels: ['Company'], properties: { name: 'Freshworks', industry: 'SaaS', size: '5000+' } },
  { id: 'c9', label: 'OpenAI', group: 'Company', labels: ['Company'], properties: { name: 'OpenAI', industry: 'Artificial Intelligence', size: '1000+' } },
  { id: 'c10', label: 'Anthropic', group: 'Company', labels: ['Company'], properties: { name: 'Anthropic', industry: 'Artificial Intelligence', size: '500+' } },

  // Events
  { id: 'e1', label: 'TechCrunch Disrupt', group: 'Event', labels: ['Event'], properties: { name: 'TechCrunch Disrupt', city: 'San Francisco', date: '2025-10-15' } },
  { id: 'e2', label: 'Microsoft Build', group: 'Event', labels: ['Event'], properties: { name: 'Microsoft Build', city: 'Seattle', date: '2025-05-20' } },
  { id: 'e3', label: 'Global Fintech Fest', group: 'Event', labels: ['Event'], properties: { name: 'Global Fintech Fest', city: 'Mumbai', date: '2025-09-05' } },
  { id: 'e4', label: 'AWS Re:Invent', group: 'Event', labels: ['Event'], properties: { name: 'AWS Re:Invent', city: 'Las Vegas', date: '2025-11-28' } },
  { id: 'e5', label: 'SaaStr Annual', group: 'Event', labels: ['Event'], properties: { name: 'SaaStr Annual', city: 'San Mateo', date: '2025-09-12' } },
];

export const FALLBACK_EDGES: GraphEdge[] = [
  // Works At
  { id: 'r1', from: 'p_me', to: 'c3', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r2', from: 'p1', to: 'c2', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r3', from: 'p2', to: 'c3', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r4', from: 'p3', to: 'c1', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r5', from: 'p4', to: 'c1', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r6', from: 'p6', to: 'c4', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r7', from: 'p8', to: 'c5', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r8', from: 'p10', to: 'c9', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },
  { id: 'r9', from: 'p13', to: 'c7', label: 'WORKS_AT', type: 'WORKS_AT', properties: {} },

  // Founded
  { id: 'r10', from: 'p3', to: 'c1', label: 'FOUNDED', type: 'FOUNDED', properties: {} },
  { id: 'r11', from: 'p5', to: 'c1', label: 'FOUNDED', type: 'FOUNDED', properties: {} },
  { id: 'r12', from: 'p11', to: 'c5', label: 'FOUNDED', type: 'FOUNDED', properties: {} },
  { id: 'r13', from: 'p9', to: 'c1', label: 'FOUNDED', type: 'FOUNDED', properties: {} },
  { id: 'r14', from: 'p14', to: 'c9', label: 'FOUNDED', type: 'FOUNDED', properties: {} },

  // Attended Events
  { id: 'r15', from: 'p_me', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r16', from: 'p1', to: 'e2', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r17', from: 'p1', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r18', from: 'p2', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r19', from: 'p3', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r20', from: 'p5', to: 'e1', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r21', from: 'p10', to: 'e1', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r22', from: 'p7', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },
  { id: 'r23', from: 'p12', to: 'e3', label: 'ATTENDED', type: 'ATTENDED', properties: {} },

  // KNOWS connections
  { id: 'r24', from: 'p_me', to: 'p1', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2023', context: 'Ex-Colleague' } },
  { id: 'r25', from: 'p1', to: 'p2', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2021', context: 'Conference Speaker' } },
  { id: 'r26', from: 'p2', to: 'p3', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2020', context: 'Engineering Peer' } },

  // Secondary path
  { id: 'r27', from: 'p_me', to: 'p6', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2024', context: 'Hackathon Judge' } },
  { id: 'r28', from: 'p6', to: 'p4', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2022', context: 'Bangalore Tech Circle' } },
  { id: 'r29', from: 'p4', to: 'p3', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2019', context: 'Razorpay Leadership' } },

  // Branch to AI & Founders
  { id: 'r30', from: 'p_me', to: 'p14', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2023', context: 'IIT Alumni' } },
  { id: 'r31', from: 'p14', to: 'p10', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2024', context: 'AI Incubator' } },
  { id: 'r32', from: 'p14', to: 'p12', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2023', context: 'Portfolio' } },
  { id: 'r33', from: 'p12', to: 'c1', label: 'INVESTED_IN', type: 'INVESTED_IN', properties: {} },
  { id: 'r34', from: 'p12', to: 'p3', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2018', context: 'Board Member' } },

  // Warm intros / LIKELY_KNOWS
  { id: 'r35', from: 'p1', to: 'p5', label: 'LIKELY_KNOWS', type: 'LIKELY_KNOWS', properties: { confidence: 0.88, reason: 'Co-attended Global Fintech Fest' } },
  { id: 'r36', from: 'p5', to: 'p9', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2022', context: 'Fintech Founder Meet' } },
  { id: 'r37', from: 'p9', to: 'p11', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2021', context: 'YC Batch' } },
  { id: 'r38', from: 'p2', to: 'p8', label: 'LIKELY_KNOWS', type: 'LIKELY_KNOWS', properties: { confidence: 0.92, reason: 'Same Alumni Network & Co-author' } },
  { id: 'r39', from: 'p8', to: 'p11', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2020', context: 'Stripe Core Infra' } },
  { id: 'r40', from: 'p7', to: 'c7', label: 'INVESTED_IN', type: 'INVESTED_IN', properties: {} },
  { id: 'r41', from: 'p7', to: 'p13', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2021', context: 'Early Investor' } },
  { id: 'r42', from: 'p6', to: 'p13', label: 'KNOWS', type: 'KNOWS', properties: { weight: 1.0, since: '2023', context: 'Women in Tech' } }
];

export function findFallbackShortestPath(sourceName: string, targetName: string) {
  const sourceNode = FALLBACK_NODES.find(n => n.properties.name?.toLowerCase() === sourceName.toLowerCase() || n.id === sourceName);
  const targetNode = FALLBACK_NODES.find(n => n.properties.name?.toLowerCase() === targetName.toLowerCase() || n.id === targetName);

  if (!sourceNode || !targetNode) {
    return { found: false, message: 'Source or target not found.' };
  }

  // Build adjacency list (undirected traversal for path discovery)
  const adj = new Map<string, { neighborId: string; edge: GraphEdge }[]>();
  FALLBACK_NODES.forEach(n => adj.set(n.id, []));

  FALLBACK_EDGES.forEach(edge => {
    adj.get(edge.from)?.push({ neighborId: edge.to, edge });
    adj.get(edge.to)?.push({ neighborId: edge.from, edge });
  });

  // BFS search
  const queue: { nodeId: string; path: string[]; edges: GraphEdge[] }[] = [
    { nodeId: sourceNode.id, path: [sourceNode.id], edges: [] }
  ];
  const visited = new Set<string>([sourceNode.id]);

  let foundPath: string[] | null = null;
  let foundEdges: GraphEdge[] | null = null;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.nodeId === targetNode.id) {
      foundPath = current.path;
      foundEdges = current.edges;
      break;
    }

    const neighbors = adj.get(current.nodeId) || [];
    for (const { neighborId, edge } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({
          nodeId: neighborId,
          path: [...current.path, neighborId],
          edges: [...current.edges, edge]
        });
      }
    }
  }

  if (!foundPath || !foundEdges) {
    return { found: false, message: 'No path found between entities.' };
  }

  const nodes = foundPath.map(id => FALLBACK_NODES.find(n => n.id === id)!);
  const hops = foundEdges.length;

  const steps = nodes.map((node, i) => {
    const edgeToNext = i < foundEdges!.length ? foundEdges![i] : null;
    return {
      step: i + 1,
      node,
      viaRelationship: edgeToNext ? edgeToNext.type : null,
      relationshipDetails: edgeToNext ? edgeToNext.properties : null
    };
  });

  return {
    found: true,
    length: hops,
    hops: hops,
    nodes,
    edges: foundEdges,
    nodeIds: nodes.map(n => n.id),
    edgeIds: foundEdges.map(e => e.id),
    steps
  };
}

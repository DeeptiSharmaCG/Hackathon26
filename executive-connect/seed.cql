MATCH (n) DETACH DELETE n;

CREATE 
  // Companies
  (c_razorpay:Company {id: 'c1', name: 'Razorpay', industry: 'Fintech', size: '1000+'}),
  (c_microsoft:Company {id: 'c2', name: 'Microsoft', industry: 'Technology', size: '100000+'}),
  (c_google:Company {id: 'c3', name: 'Google', industry: 'Technology', size: '100000+'}),
  (c_swiggy:Company {id: 'c4', name: 'Swiggy', industry: 'Consumer Tech', size: '5000+'}),
  (c_stripe:Company {id: 'c5', name: 'Stripe', industry: 'Fintech', size: '7000+'}),
  (c_zomato:Company {id: 'c6', name: 'Zomato', industry: 'Consumer Tech', size: '4000+'}),
  (c_phonepe:Company {id: 'c7', name: 'PhonePe', industry: 'Fintech', size: '3000+'}),
  (c_freshworks:Company {id: 'c8', name: 'Freshworks', industry: 'SaaS', size: '5000+'}),
  (c_openai:Company {id: 'c9', name: 'OpenAI', industry: 'Artificial Intelligence', size: '1000+'}),
  (c_anthropic:Company {id: 'c10', name: 'Anthropic', industry: 'Artificial Intelligence', size: '500+'}),

  // Events
  (e1:Event {id: 'e1', name: 'TechCrunch Disrupt', city: 'San Francisco', date: '2025-10-15'}),
  (e2:Event {id: 'e2', name: 'Microsoft Build', city: 'Seattle', date: '2025-05-20'}),
  (e3:Event {id: 'e3', name: 'Global Fintech Fest', city: 'Mumbai', date: '2025-09-05'}),
  (e4:Event {id: 'e4', name: 'AWS Re:Invent', city: 'Las Vegas', date: '2025-11-28'}),
  (e5:Event {id: 'e5', name: 'SaaStr Annual', city: 'San Mateo', date: '2025-09-12'}),

  // People
  (p_me:Person {id: 'p_me', name: 'Tanishq', title: 'Product Engineer', company: 'NetworkAI', location: 'Bengaluru', industry: 'Technology', seniority: 'Lead'}),
  (p_alice:Person {id: 'p1', name: 'Alice Johnson', title: 'Engineering Director', company: 'Microsoft', location: 'Seattle', industry: 'Technology', seniority: 'Director'}),
  (p_bob:Person {id: 'p2', name: 'Bob Smith', title: 'Senior Staff Engineer', company: 'Google', location: 'Bengaluru', industry: 'Technology', seniority: 'Staff'}),
  (p_shashank:Person {id: 'p3', name: 'Shashank Kumar', title: 'CTO', company: 'Razorpay', location: 'Bengaluru', industry: 'Fintech', seniority: 'CTO'}),
  (p_sarah:Person {id: 'p4', name: 'Sarah Lin', title: 'VP Engineering', company: 'Razorpay', location: 'Bengaluru', industry: 'Fintech', seniority: 'VP'}),
  (p_david:Person {id: 'p5', name: 'David Chen', title: 'Founder & CEO', company: 'FinAI Labs', location: 'Singapore', industry: 'Fintech', seniority: 'Founder'}),
  (p_priya:Person {id: 'p6', name: 'Priya Sharma', title: 'Head of AI', company: 'Swiggy', location: 'Bengaluru', industry: 'Consumer Tech', seniority: 'Director'}),
  (p_arun:Person {id: 'p7', name: 'Arun Patel', title: 'Angel Investor', company: 'VentureCraft', location: 'Mumbai', industry: 'Venture Capital', seniority: 'Partner'}),
  (p_elena:Person {id: 'p8', name: 'Elena Rostova', title: 'Principal Architect', company: 'Stripe', location: 'San Francisco', industry: 'Fintech', seniority: 'Principal'}),
  (p_rahul:Person {id: 'p9', name: 'Rahul Verma', title: 'Co-Founder & CTO', company: 'PayFlow', location: 'Bengaluru', industry: 'Fintech', seniority: 'CTO'}),
  (p_kavita:Person {id: 'p10', name: 'Kavita Nair', title: 'Staff Research Scientist', company: 'OpenAI', location: 'San Francisco', industry: 'Artificial Intelligence', seniority: 'Staff'}),
  (p_john:Person {id: 'p11', name: 'John Collison', title: 'President & Co-Founder', company: 'Stripe', location: 'San Francisco', industry: 'Fintech', seniority: 'Founder'}),
  (p_vikram:Person {id: 'p12', name: 'Vikram Malhotra', title: 'Managing Partner', company: 'Sequoia India', location: 'Bengaluru', industry: 'Venture Capital', seniority: 'Partner'}),
  (p_ananya:Person {id: 'p13', name: 'Ananya Roy', title: 'VP Product', company: 'PhonePe', location: 'Bengaluru', industry: 'Fintech', seniority: 'VP'}),
  (p_neil:Person {id: 'p14', name: 'Neil Bhatt', title: 'Founder & CEO', company: 'AgentScale', location: 'Bengaluru', industry: 'Artificial Intelligence', seniority: 'Founder'}),

  // Works At Relationships
  (p_me)-[:WORKS_AT]->(c_google),
  (p_alice)-[:WORKS_AT]->(c_microsoft),
  (p_bob)-[:WORKS_AT]->(c_google),
  (p_shashank)-[:WORKS_AT]->(c_razorpay),
  (p_sarah)-[:WORKS_AT]->(c_razorpay),
  (p_priya)-[:WORKS_AT]->(c_swiggy),
  (p_elena)-[:WORKS_AT]->(c_stripe),
  (p_kavita)-[:WORKS_AT]->(c_openai),
  (p_ananya)-[:WORKS_AT]->(c_phonepe),

  // Founded Relationships
  (p_shashank)-[:FOUNDED]->(c_razorpay),
  (p_david)-[:FOUNDED]->(c_razorpay),
  (p_john)-[:FOUNDED]->(c_stripe),
  (p_rahul)-[:FOUNDED]->(c_razorpay),
  (p_neil)-[:FOUNDED]->(c_openai),

  // Attended Events
  (p_me)-[:ATTENDED]->(e3),
  (p_alice)-[:ATTENDED]->(e2),
  (p_alice)-[:ATTENDED]->(e3),
  (p_bob)-[:ATTENDED]->(e3),
  (p_shashank)-[:ATTENDED]->(e3),
  (p_david)-[:ATTENDED]->(e1),
  (p_kavita)-[:ATTENDED]->(e1),
  (p_arun)-[:ATTENDED]->(e3),
  (p_vikram)-[:ATTENDED]->(e3),

  // Direct and Warm Connections (KNOWS)
  // The primary path from mvp.md: Tanishq -> Alice -> Bob -> Shashank (CTO Razorpay)
  (p_me)-[:KNOWS {weight: 1.0, since: '2023', context: 'Ex-Colleague'}]->(p_alice),
  (p_alice)-[:KNOWS {weight: 1.0, since: '2021', context: 'Conference Speaker'}]->(p_bob),
  (p_bob)-[:KNOWS {weight: 1.0, since: '2020', context: 'Engineering Peer'}]->(p_shashank),

  // Secondary path: Tanishq -> Priya -> Sarah -> Shashank
  (p_me)-[:KNOWS {weight: 1.0, since: '2024', context: 'Hackathon Judge'}]->(p_priya),
  (p_priya)-[:KNOWS {weight: 1.0, since: '2022', context: 'Bangalore Tech Circle'}]->(p_sarah),
  (p_sarah)-[:KNOWS {weight: 1.0, since: '2019', context: 'Razorpay Leadership'}]->(p_shashank),

  // Branch to AI Founders & Investors
  (p_me)-[:KNOWS {weight: 1.0, since: '2023', context: 'IIT Alumni'}]->(p_neil),
  (p_neil)-[:KNOWS {weight: 1.0, since: '2024', context: 'AI Incubator'}]->(p_kavita),
  (p_neil)-[:KNOWS {weight: 1.0, since: '2023', context: 'Portfolio'}]->(p_vikram),
  (p_vikram)-[:INVESTED_IN]->(c_razorpay),
  (p_vikram)-[:KNOWS {weight: 1.0, since: '2018', context: 'Board Member'}]->(p_shashank),

  // Warm intros / Likely knows
  (p_alice)-[:LIKELY_KNOWS {confidence: 0.88, reason: 'Co-attended Global Fintech Fest'}]->(p_david),
  (p_david)-[:KNOWS {weight: 1.0, since: '2022', context: 'Fintech Founder Meet'}]->(p_rahul),
  (p_rahul)-[:KNOWS {weight: 1.0, since: '2021', context: 'YC Batch'}]->(p_john),
  (p_bob)-[:LIKELY_KNOWS {confidence: 0.92, reason: 'Same Alumni Network & Co-author'}]->(p_elena),
  (p_elena)-[:KNOWS {weight: 1.0, since: '2020', context: 'Stripe Core Infra'}]->(p_john),
  (p_arun)-[:INVESTED_IN]->(c_phonepe),
  (p_arun)-[:KNOWS {weight: 1.0, since: '2021', context: 'Early Investor'}]->(p_ananya),
  (p_priya)-[:KNOWS {weight: 1.0, since: '2023', context: 'Women in Tech'}]->(p_ananya);

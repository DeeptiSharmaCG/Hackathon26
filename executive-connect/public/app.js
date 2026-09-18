// Global Graph State
let network = null;
let nodesDataSet = null;
let edgesDataSet = null;
let allGraphData = { nodes: [], edges: [] };
let activePath = null;
let isPathOnly = false;
let isPhysicsEnabled = true;

// Group Colors matching mvp.md
const GROUP_STYLES = {
  Person: { background: '#1e3a8a', border: '#3b82f6', highlight: { background: '#2563eb', border: '#60a5fa' } },
  Founder: { background: '#7c2d12', border: '#f97316', highlight: { background: '#ea580c', border: '#fdba74' } },
  CTO: { background: '#7f1d1d', border: '#ef4444', highlight: { background: '#dc2626', border: '#fca5a5' } },
  Company: { background: '#581c87', border: '#a855f7', highlight: { background: '#9333ea', border: '#d8b4fe' } },
  Event: { background: '#14532d', border: '#22c55e', highlight: { background: '#16a34a', border: '#86efac' } }
};

// Edge styling
const DEFAULT_EDGE_STYLE = {
  color: { color: 'rgba(148, 163, 184, 0.25)', highlight: '#38bdf8', hover: '#38bdf8' },
  width: 1.5,
  font: { color: '#94a3b8', size: 10, strokeWidth: 0, face: 'JetBrains Mono' },
  arrows: { to: { enabled: true, scaleFactor: 0.5 } }
};

const PATH_EDGE_STYLE = {
  color: { color: '#00f2fe', highlight: '#00f2fe', hover: '#00f2fe' },
  width: 4.5,
  shadow: { enabled: true, color: 'rgba(0, 242, 254, 0.7)', size: 12, x: 0, y: 0 },
  font: { color: '#fbbf24', size: 12, strokeWidth: 2, strokeColor: '#000', face: 'JetBrains Mono' },
  arrows: { to: { enabled: true, scaleFactor: 0.9 } }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await checkHealth();
  await loadPeopleList();
  await initializeGraph();

  // Trigger default preset: Tanishq -> Shashank Kumar (CTO Razorpay)
  await loadPreset('Tanishq', 'Shashank Kumar');
});

// Check Server & Neo4j Health
async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    const statusText = document.getElementById('db-status-text');
    const dot = document.querySelector('.status-dot');
    if (statusText) {
      if (data.status === 'ok') {
        statusText.textContent = 'Neo4j Connected (Bolt :7687)';
      } else {
        statusText.textContent = 'Neo4j Connection Error';
        if (dot) dot.style.background = '#ef4444';
      }
    }
  } catch (err) {
    const statusText = document.getElementById('db-status-text');
    const dot = document.querySelector('.status-dot');
    if (statusText) statusText.textContent = 'Server Offline';
    if (dot) dot.style.background = '#ef4444';
  }
}

// Fetch searchable list of people for dropdowns
async function loadPeopleList() {
  try {
    const res = await fetch('/api/people');
    const people = await res.json();

    const sourceSelect = document.getElementById('source-select');
    const targetSelect = document.getElementById('target-select');

    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';

    people.forEach(p => {
      const optSrc = document.createElement('option');
      optSrc.value = p.name;
      optSrc.textContent = `${p.name} (${p.title} @ ${p.company})`;
      if (p.name === 'Tanishq') optSrc.selected = true;
      sourceSelect.appendChild(optSrc);

      const optTgt = document.createElement('option');
      optTgt.value = p.name;
      optTgt.textContent = `${p.name} - ${p.title} (${p.company})`;
      if (p.name === 'Shashank Kumar') optTgt.selected = true;
      targetSelect.appendChild(optTgt);
    });
  } catch (err) {
    console.error('Failed to load people:', err);
  }
}

// Fetch Full Graph and Render Vis.js Network
async function initializeGraph() {
  const loader = document.getElementById('graph-loader');
  loader.classList.remove('hidden');

  try {
    const res = await fetch('/api/graph');
    allGraphData = await res.json();

    const visNodes = allGraphData.nodes.map(n => {
      const groupStyle = GROUP_STYLES[n.group] || GROUP_STYLES.Person;
      return {
        id: n.id,
        label: n.label,
        group: n.group,
        title: `${n.label}\n${n.properties.title || ''} ${n.properties.company ? '@ ' + n.properties.company : ''}`,
        shape: n.group === 'Company' ? 'box' : (n.group === 'Event' ? 'hexagon' : 'dot'),
        size: n.group === 'CTO' || n.group === 'Founder' ? 22 : 16,
        color: {
          background: groupStyle.background,
          border: groupStyle.border,
          highlight: groupStyle.highlight
        },
        font: { color: '#f8fafc', size: 12, face: 'Plus Jakarta Sans', strokeWidth: 2, strokeColor: '#0a0d14' },
        borderWidth: 2,
        properties: n.properties,
        labels: n.labels
      };
    });

    const visEdges = allGraphData.edges.map(e => ({
      ...DEFAULT_EDGE_STYLE,
      id: e.id,
      from: e.from,
      to: e.to,
      label: e.label,
      properties: e.properties,
      type: e.type
    }));

    nodesDataSet = new vis.DataSet(visNodes);
    edgesDataSet = new vis.DataSet(visEdges);

    const container = document.getElementById('graph-container');
    const data = { nodes: nodesDataSet, edges: edgesDataSet };

    const options = {
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -70,
          centralGravity: 0.012,
          springLength: 120,
          springConstant: 0.06,
          damping: 0.75
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: false,
        keyboard: true
      }
    };

    network = new vis.Network(container, data, options);

    // Click event for Node Inspector
    network.on('click', params => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodesDataSet.get(nodeId);
        showNodeDetails(node);
      } else {
        clearNodeSelection();
      }
    });

    loader.classList.add('hidden');
  } catch (err) {
    loader.innerHTML = `<p style="color:#ef4444">Failed to load graph: ${err.message}</p>`;
  }
}

// Find Shortest Path via API
async function findShortestPath(source, target) {
  const loader = document.getElementById('graph-loader');
  loader.classList.remove('hidden');

  const cypherQuery = `MATCH p = shortestPath((a:Person {name: '${source}'})-[*..10]-(b:Person {name: '${target}'})) RETURN p`;
  document.getElementById('active-cypher').textContent = cypherQuery;

  try {
    const res = await fetch(`/api/shortest-path?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`);
    const pathData = await res.json();

    loader.classList.add('hidden');

    if (!pathData.found) {
      alert(`No path found between ${source} and ${target}!`);
      return;
    }

    activePath = pathData;
    renderPathResults(pathData);
    highlightPathInGraph(pathData);
  } catch (err) {
    loader.classList.add('hidden');
    alert('Error finding path: ' + err.message);
  }
}

// Render Path Metrics & Step-by-Step Chain
function renderPathResults(data) {
  document.getElementById('results-card').style.display = 'block';
  document.getElementById('path-hops-badge').textContent = `${data.hops} Hops`;
  document.getElementById('metric-hops').textContent = data.hops;
  
  // Connectors = intermediate nodes
  const connectorCount = Math.max(0, data.nodes.length - 2);
  document.getElementById('metric-connectors').textContent = connectorCount;

  const stepper = document.getElementById('path-stepper');
  stepper.innerHTML = '';

  data.steps.forEach((step, idx) => {
    const node = step.node;
    const props = node.properties;

    const nodeEl = document.createElement('div');
    nodeEl.className = 'stepper-node';
    nodeEl.onclick = () => focusOnNode(node.id);

    const groupStyle = GROUP_STYLES[node.group] || GROUP_STYLES.Person;

    nodeEl.innerHTML = `
      <div class="node-idx" style="background: ${groupStyle.border}; color: #fff;">${idx + 1}</div>
      <div class="stepper-node-info">
        <div class="stepper-name">${props.name || node.label}</div>
        <div class="stepper-title">${props.title || node.group} ${props.company ? '• ' + props.company : ''}</div>
      </div>
    `;

    stepper.appendChild(nodeEl);

    // If there is a next step, show relationship connector
    if (step.viaRelationship) {
      const relEl = document.createElement('div');
      relEl.className = 'stepper-rel';
      const detail = step.relationshipDetails?.context ? `(${step.relationshipDetails.context})` : '';
      relEl.innerHTML = `<i class="fa-solid fa-arrow-down"></i> ${step.viaRelationship} ${detail}`;
      stepper.appendChild(relEl);
    }
  });
}

// Highlight the Shortest Path in Vis.js
function highlightPathInGraph(pathData) {
  if (!nodesDataSet || !edgesDataSet) return;

  const pathNodeIds = new Set(pathData.nodeIds);
  const pathEdgeIds = new Set(pathData.edgeIds);

  // Update nodes
  const nodeUpdates = [];
  nodesDataSet.forEach(node => {
    const inPath = pathNodeIds.has(node.id);
    const groupStyle = GROUP_STYLES[node.group] || GROUP_STYLES.Person;

    if (inPath) {
      nodeUpdates.push({
        id: node.id,
        opacity: 1.0,
        borderWidth: 4,
        size: 26,
        color: {
          background: groupStyle.highlight.background,
          border: '#00f2fe'
        },
        shadow: { enabled: true, color: 'rgba(0, 242, 254, 0.8)', size: 15, x: 0, y: 0 }
      });
    } else {
      nodeUpdates.push({
        id: node.id,
        opacity: isPathOnly ? 0.0 : 0.2,
        borderWidth: 1,
        size: 14,
        shadow: { enabled: false },
        color: {
          background: 'rgba(30, 41, 59, 0.4)',
          border: 'rgba(71, 85, 105, 0.4)'
        }
      });
    }
  });
  nodesDataSet.update(nodeUpdates);

  // Update edges
  const edgeUpdates = [];
  edgesDataSet.forEach(edge => {
    // Check if edge is in path or connects consecutive path nodes
    const inPath = pathEdgeIds.has(edge.id) || (pathNodeIds.has(edge.from) && pathNodeIds.has(edge.to));

    if (inPath) {
      edgeUpdates.push({
        ...PATH_EDGE_STYLE,
        id: edge.id,
        hidden: false
      });
    } else {
      edgeUpdates.push({
        ...DEFAULT_EDGE_STYLE,
        id: edge.id,
        hidden: isPathOnly,
        color: { color: 'rgba(148, 163, 184, 0.05)' },
        width: 1
      });
    }
  });
  edgesDataSet.update(edgeUpdates);

  // Center view on path nodes
  fitToPath(Array.from(pathNodeIds));
}

// Fit camera to path nodes
function fitToPath(nodeIds) {
  if (!network) return;
  network.fit({
    nodes: nodeIds,
    animation: {
      duration: 1000,
      easingFunction: 'easeInOutQuad'
    }
  });
}

// Preset Buttons Loader
async function loadPreset(source, target) {
  document.getElementById('source-select').value = source;
  document.getElementById('target-select').value = target;

  // Active state for preset chips
  document.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
  if (target === 'Shashank Kumar') document.getElementById('btn-demo-cto')?.classList.add('active');
  else if (target === 'John Collison') document.getElementById('btn-demo-founder')?.classList.add('active');
  else if (target === 'Kavita Nair') document.getElementById('btn-demo-ai')?.classList.add('active');

  await findShortestPath(source, target);
}

// Handle Form Submission
async function handleFindPath(e) {
  e.preventDefault();
  const source = document.getElementById('source-select').value;
  const target = document.getElementById('target-select').value;

  if (source === target) {
    alert('Source and Target cannot be the same person!');
    return;
  }

  document.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
  await findShortestPath(source, target);
}

// Swap Source and Target selects
function swapSourceTarget() {
  const sourceSelect = document.getElementById('source-select');
  const targetSelect = document.getElementById('target-select');
  const temp = sourceSelect.value;
  sourceSelect.value = targetSelect.value;
  targetSelect.value = temp;
}

// Show Node Inspector Details
function showNodeDetails(node) {
  const body = document.getElementById('node-info-body');
  const props = node.properties || {};

  let rows = `
    <div class="info-row"><span class="info-key">Type:</span><span class="info-val">${node.group}</span></div>
    <div class="info-row"><span class="info-key">Name:</span><span class="info-val">${props.name || node.label}</span></div>
  `;

  if (props.title) rows += `<div class="info-row"><span class="info-key">Title:</span><span class="info-val">${props.title}</span></div>`;
  if (props.company) rows += `<div class="info-row"><span class="info-key">Company:</span><span class="info-val">${props.company}</span></div>`;
  if (props.industry) rows += `<div class="info-row"><span class="info-key">Industry:</span><span class="info-val">${props.industry}</span></div>`;
  if (props.location || props.city) rows += `<div class="info-row"><span class="info-key">Location:</span><span class="info-val">${props.location || props.city}</span></div>`;
  if (props.seniority) rows += `<div class="info-row"><span class="info-key">Seniority:</span><span class="info-val">${props.seniority}</span></div>`;
  if (props.date) rows += `<div class="info-row"><span class="info-key">Date:</span><span class="info-val">${props.date}</span></div>`;

  body.innerHTML = rows;
}

function clearNodeSelection() {
  document.getElementById('node-info-body').innerHTML = `
    <p class="text-muted text-center">Click any node or relationship on the graph to inspect metadata.</p>
  `;
}

function focusOnNode(nodeId) {
  if (!network) return;
  network.focus(nodeId, {
    scale: 1.2,
    animation: { duration: 600, easingFunction: 'easeInOutQuad' }
  });
}

// Toggle Path Only vs Full Graph
function togglePathOnly() {
  if (!activePath) {
    alert('Please calculate a shortest path first.');
    return;
  }
  isPathOnly = !isPathOnly;
  document.getElementById('isolate-text').textContent = isPathOnly ? 'Show Full Graph' : 'Path Only';
  highlightPathInGraph(activePath);
}

// Reset view & zoom
function fitNetwork() {
  if (!network) return;
  network.fit({ animation: { duration: 600 } });
}

// Toggle Physics
function togglePhysics() {
  if (!network) return;
  isPhysicsEnabled = !isPhysicsEnabled;
  network.setOptions({ physics: { enabled: isPhysicsEnabled } });
  document.getElementById('physics-text').textContent = isPhysicsEnabled ? 'Freeze Layout' : 'Enable Physics';
}

// Reseed graph on demand
async function reseedDatabase() {
  if (!confirm('Reseed the Neo4j graph with the MVP dataset?')) return;
  const loader = document.getElementById('graph-loader');
  loader.classList.remove('hidden');
  try {
    const res = await fetch('/api/seed', { method: 'POST' });
    const result = await res.json();
    alert(result.message);
    await initializeGraph();
    const source = document.getElementById('source-select').value;
    const target = document.getElementById('target-select').value;
    if (source && target) await findShortestPath(source, target);
  } catch (err) {
    alert('Error reseeding: ' + err.message);
  } finally {
    loader.classList.add('hidden');
  }
}

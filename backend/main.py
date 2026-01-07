from collections import defaultdict, deque
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

# Allow frontend dev server to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class Edge(BaseModel):
    source: str
    target: str
    id: Optional[str] = None
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def dag_analysis(nodes: List[Node], edges: List[Edge]) -> Dict[str, Any]:
    """
    Kahn's algorithm (topological sort).
    - If we can process all nodes => DAG.
    - Otherwise => cycle exists.

    Returns:
      {
        "is_dag": bool,
        "topo_order": [node_id, ...]  # only when DAG
        "cycle_nodes": [node_id, ...] # only when NOT DAG
      }
    """
    node_ids = {n.id for n in nodes}

    indegree: Dict[str, int] = {nid: 0 for nid in node_ids}
    adj: Dict[str, List[str]] = defaultdict(list)

    for e in edges:
        # Ignore edges that refer to missing nodes (defensive)
        if e.source not in node_ids or e.target not in node_ids:
            continue
        adj[e.source].append(e.target)
        indegree[e.target] += 1

    q = deque([nid for nid, deg in indegree.items() if deg == 0])
    topo: List[str] = []
    processed = 0

    while q:
        u = q.popleft()
        topo.append(u)
        processed += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    is_dag = processed == len(node_ids)

    if is_dag:
        return {"is_dag": True, "topo_order": topo, "cycle_nodes": []}

    # Nodes still with indegree > 0 are part of (or downstream of) a cycle
    cycle_nodes = [nid for nid, deg in indegree.items() if deg > 0]
    return {"is_dag": False, "topo_order": [], "cycle_nodes": cycle_nodes}


@app.post("/pipelines/parse")
def parse_pipeline(p: Pipeline):
    analysis = dag_analysis(p.nodes, p.edges)

    return {
        "num_nodes": len(p.nodes),
        "num_edges": len(p.edges),
        **analysis,
    }

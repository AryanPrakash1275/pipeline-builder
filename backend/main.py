from collections import defaultdict, deque
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

# Allow frontend dev server to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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


def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Kahn's algorithm (topological sort).
    If we can process all nodes => DAG. Otherwise => cycle exists.
    """
    node_ids = {n.id for n in nodes}
    indegree = {nid: 0 for nid in node_ids}
    adj = defaultdict(list)

    for e in edges:
        # Ignore edges that refer to missing nodes (defensive)
        if e.source not in node_ids or e.target not in node_ids:
            continue
        adj[e.source].append(e.target)
        indegree[e.target] += 1

    q = deque([nid for nid, deg in indegree.items() if deg == 0])
    processed = 0

    while q:
        u = q.popleft()
        processed += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    return processed == len(node_ids)


@app.post("/pipelines/parse")
def parse_pipeline(p: Pipeline):
    num_nodes = len(p.nodes)
    num_edges = len(p.edges)
    is_dag = check_is_dag(p.nodes, p.edges)

    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": is_dag}

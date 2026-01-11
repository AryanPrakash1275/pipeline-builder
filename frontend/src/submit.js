import { useCallback, useMemo, useState } from "react";

function formatList(list, max = 8) {
  if (!Array.isArray(list) || list.length === 0) return "—";
  const head = list.slice(0, max);
  const tail = list.length > max ? ` … (+${list.length - max})` : "";
  return `${head.join(", ")}${tail}`;
}

function ResultModal({ open, onClose, result }) {
  const isDag = !!result?.is_dag;

  const title = useMemo(() => {
    if (result?.error) return "Pipeline parse failed";
    return isDag ? "Pipeline parsed ✅" : "Cycle detected ❌";
  }, [result, isDag]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 96vw)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            "linear-gradient(180deg, rgba(20,25,45,0.95), rgba(10,12,25,0.95))",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          padding: 16,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
          <div style={{ marginLeft: "auto" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)",
                borderRadius: 10,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12 }}>Nodes</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {result?.num_nodes ?? "—"}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12 }}>Edges</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {result?.num_edges ?? "—"}
            </div>
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12 }}>DAG</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {result?.error
                ? "Error"
                : isDag
                ? "Yes — valid (no cycles)"
                : "No — cycle detected"}
            </div>
          </div>

          {!result?.error && isDag ? (
            <div
              style={{
                gridColumn: "1 / -1",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ opacity: 0.7, fontSize: 12 }}>
                Topological order
              </div>
              <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.35 }}>
                {formatList(result?.topo_order, 10)}
              </div>
            </div>
          ) : null}

          {!result?.error && !isDag ? (
            <div
              style={{
                gridColumn: "1 / -1",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ opacity: 0.7, fontSize: 12 }}>
                Cycle nodes (diagnostic)
              </div>
              <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.35 }}>
                {formatList(result?.cycle_nodes, 10)}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                Note: this list is derived from remaining indegrees after topo-sort.
              </div>
            </div>
          ) : null}
        </div>

        {result?.error ? (
          <div
            style={{
              marginTop: 10,
              opacity: 0.9,
              fontSize: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              padding: 10,
              background: "rgba(255,70,70,0.08)",
            }}
          >
            {result.error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const SubmitButton = ({ nodes, edges }) => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Backend error");
      }

      const json = await res.json();
      setResult(json);
      setOpen(true);
    } catch (err) {
      setResult({
        num_nodes: nodes?.length ?? 0,
        num_edges: edges?.length ?? 0,
        is_dag: false,
        topo_order: [],
        cycle_nodes: [],
        error: err?.message || "Unknown error",
      });
      setOpen(true);
    }
  }, [nodes, edges]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
        }}
      >
        <button
          type="button"
          className="vs-btn vs-btn--primary"
          onClick={onSubmit}
        >

          Submit pipeline
        </button>
      </div>

      <ResultModal open={open} onClose={() => setOpen(false)} result={result} />
    </>
  );
};

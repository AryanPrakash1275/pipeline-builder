// submit.js

import { useCallback } from "react";

export const SubmitButton = ({ nodes, edges }) => {
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

      const { num_nodes, num_edges, is_dag } = await res.json();

      alert(
        `Pipeline parsed ✅\n\nNodes: ${num_nodes}\nEdges: ${num_edges}\nDAG: ${is_dag ? "Yes" : "No"}`
      );
    } catch (err) {
      alert(`Submit failed ❌\n\n${err?.message || "Unknown error"}`);
    }
  }, [nodes, edges]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

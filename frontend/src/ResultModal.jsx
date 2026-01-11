import React, { useEffect } from "react";

export const ResultModal = ({ open, onClose, result }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const numNodes = result?.num_nodes ?? 0;
  const numEdges = result?.num_edges ?? 0;
  const isDag = !!result?.is_dag;

  return (
    <div
      className="vs-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="vs-modal" role="dialog" aria-modal="true">
        <div className="vs-modal__header">
          <div className="vs-modal__title">Pipeline Check</div>
          <button type="button" className="vs-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="vs-modal__body">
          <div className="vs-kv">
            <div className="vs-kv__k">Nodes</div>
            <div className="vs-kv__v">{numNodes}</div>
          </div>

          <div className="vs-kv">
            <div className="vs-kv__k">Edges</div>
            <div className="vs-kv__v">{numEdges}</div>
          </div>

          <div className={isDag ? "vs-pill--ok" : "vs-pill--bad"}>
            {isDag ? "✓ DAG valid (no cycles)" : "✕ Not a DAG (cycle detected)"}
          </div>
        </div>

        <div className="vs-modal__footer">
          <button type="button" className="vs-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

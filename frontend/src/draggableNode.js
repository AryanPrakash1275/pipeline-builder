// draggableNode.js
import React, { useMemo } from "react";

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const icon = useMemo(() => {
    // simple icon mapping (no deps)
    switch (type) {
      case "customInput":
        return "⟵";
      case "customOutput":
        return "⟶";
      case "llm":
        return "✨";
      case "text":
        return "T";
      case "number":
        return "№";
      case "json":
        return "{}";
      case "merge":
        return "⋈";
      case "switch":
        return "⇄";
      case "delay":
        return "⏱";
      default:
        return "●";
    }
  }, [type]);

  return (
    <div
      className="vs-pill"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        userSelect: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "grab",
      }}
      title={`Drag to add: ${label}`}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 8,
          display: "inline-grid",
          placeItems: "center",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {icon}
      </span>

      <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
    </div>
  );
};

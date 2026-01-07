import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

export function BaseNode({
  nodeId,
  title,
  subtitle,
  icon,
  handles = [],
  children,
  className = "",
}) {
  const deleteNode = useStore((s) => s.deleteNode);

  const killEvent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDelete = useCallback(
    (e) => {
      killEvent(e);
      deleteNode(nodeId);
    },
    [deleteNode, nodeId, killEvent]
  );

  return (
    <div className={`vs-node ${className}`} style={{ position: "relative" }}>
      <button
        type="button"
        className="vs-node__delete"
        title="Delete node"
        // 🔥 THIS is the key: ReactFlow grabs pointer/mousedown for drag.
        onPointerDown={onDelete}
        onMouseDown={killEvent}
        onClick={killEvent}
      >
        ✕
      </button>

      <div className="vs-node__header">
        <div className="vs-node__title">
          {icon ? <span className="vs-node__icon">{icon}</span> : null}
          <span>{title}</span>
        </div>
        {subtitle ? <div className="vs-node__subtitle">{subtitle}</div> : null}
      </div>

      <div className="vs-node__body">{children}</div>

      {handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position ?? Position.Left}
          className={`vs-handle vs-handle--${h.type}`}
          style={h.style}
        >
          {h.label ? <span className="vs-handle__label">{h.label}</span> : null}
        </Handle>
      ))}
    </div>
  );
}

import React from "react";
import { Handle, Position } from "reactflow";

export function BaseNode({
  title,
  subtitle,
  icon,
  handles = [],
  children,
  className = "",
}) {
  return (
    <div className={`vs-node ${className}`}>
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

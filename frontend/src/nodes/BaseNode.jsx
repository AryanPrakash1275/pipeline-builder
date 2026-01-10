import React, { useCallback, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

function laneTopPct(index, count) {
  return `${((index + 1) * 100) / (count + 1)}%`;
}

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

  const renderedHandles = useMemo(() => {
    const left = handles.filter(
      (h) => (h.position ?? Position.Left) === Position.Left
    );
    const right = handles.filter(
      (h) => (h.position ?? Position.Left) === Position.Right
    );

    const withComputedTop = (arr) =>
      arr.map((h, idx) => ({
        ...h,
        __top: h.top ?? laneTopPct(idx, arr.length),
      }));

    const all = [...withComputedTop(left), ...withComputedTop(right)];

    return all.map((h) => (
      <Handle
        key={h.id}
        id={h.id}
        type={h.type}
        position={h.position ?? Position.Left}
        className={["vs-handle", `vs-handle--${h.type}`].join(" ")}
        style={{ top: h.__top }}
      >
        {h.label ? (
          <span
            className={[
              "vs-handle__label",
              h.position === Position.Right
                ? "vs-handle__label--right"
                : "vs-handle__label--left",
            ].join(" ")}
          >
            {h.label}
          </span>
        ) : null}
      </Handle>
    ));
  }, [handles]);

  return (
    <div className={`vs-node ${className}`}>
      {renderedHandles}

      <div className="vs-node__card">
        <button
          type="button"
          className="vs-node__delete"
          title="Delete node"
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
      </div>
    </div>
  );
}

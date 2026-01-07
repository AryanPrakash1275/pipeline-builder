import React from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MergeNode = ({ id }) => {
  return (
    <BaseNode
      nodeId={id}
      title="Merge"
      subtitle="Merge two inputs"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-a`, label: "a", style: { top: 70 } },
        { type: "target", position: Position.Left, id: `${id}-b`, label: "b", style: { top: 110 } },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Joins two streams into one output.
      </div>
    </BaseNode>
  );
};

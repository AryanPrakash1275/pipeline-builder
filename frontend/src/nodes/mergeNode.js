import React from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MergeNode = ({ id }) => {
  return (
    <BaseNode
      className="vs-node--merge"
      nodeId={id}
      title="Merge"
      subtitle="Merge two inputs"
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-a`,
          label: "a",
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-b`,
          label: "b",
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-out`,
        },
      ]}
    >
      <div className="vs-muted vs-muted--sm">
        Joins two streams into one output.
      </div>
    </BaseNode>
  );
};

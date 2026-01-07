import React, { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const DelayNode = ({ id }) => {
  const [ms, setMs] = useState(500);

  return (
    <BaseNode
      nodeId={id}
      title="Delay"
      subtitle="Wait before passing through"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in` },
        { type: "source", position: Position.Right, id: `${id}-out` },
      ]}
    >
      <div className="vs-field">
        <label>Milliseconds</label>
        <input
          className="vs-input"
          type="number"
          value={ms}
          onChange={(e) => setMs(Number(e.target.value))}
        />
      </div>
    </BaseNode>
  );
};

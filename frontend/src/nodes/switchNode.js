import React, { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const SwitchNode = ({ id }) => {
  const [mode, setMode] = useState("A");

  return (
    <BaseNode
      nodeId={id}
      title="Switch"
      subtitle="Route input to A or B"
      handles={[
        { type: "target", position: Position.Left, id: `${id}-in`, label: "in" },
        { type: "source", position: Position.Right, id: `${id}-a`, label: "A", style: { top: 70 } },
        { type: "source", position: Position.Right, id: `${id}-b`, label: "B", style: { top: 110 } },
      ]}
    >
      <div className="vs-field">
        <label>Route to</label>
        <select className="vs-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </div>
    </BaseNode>
  );
};

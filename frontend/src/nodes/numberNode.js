// src/nodes/numberNode.js
import React, { useMemo, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const NumberNode = ({ id, data }) => {
  const defaultValue = useMemo(() => data?.value ?? 0, [data]);
  const [value, setValue] = useState(defaultValue);

  return (
    <BaseNode
      nodeId={id}
      title="Number"
      subtitle="Constant numeric value"
      handles={[
        {
          type: "source",
          position: Position.Right,
          id: `${id}-value`,
        },
      ]}
    >
      <div className="vs-field">
        <label>Value</label>
        <input
          className="vs-input"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    </BaseNode>
  );
};

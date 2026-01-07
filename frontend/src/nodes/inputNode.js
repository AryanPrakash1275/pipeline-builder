// inputNode.js

import { useMemo, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const InputNode = ({ id, data }) => {
  const defaultName = useMemo(
    () => data?.inputName || id.replace("customInput-", "input_"),
    [data, id]
  );

  const [currName, setCurrName] = useState(defaultName);
  const [inputType, setInputType] = useState(data?.inputType || "Text");

  return (
    <BaseNode
      title="Input"
      subtitle="Pipeline entry"
      handles={[
        {
          type: "source",
          position: Position.Right,
          id: `${id}-value`,
        },
      ]}
    >
      <div className="vs-field">
        <label>Name</label>
        <input
          className="vs-input"
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
        />
      </div>

      <div className="vs-field">
        <label>Type</label>
        <select
          className="vs-select"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};

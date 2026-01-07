// outputNode.js

import { useMemo, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const OutputNode = ({ id, data }) => {
  const defaultName = useMemo(
    () => data?.outputName || id.replace("customOutput-", "output_"),
    [data, id]
  );

  const [currName, setCurrName] = useState(defaultName);
  const [outputType, setOutputType] = useState(data?.outputType || "Text");

  return (
    <BaseNode
      title="Output"
      subtitle="Pipeline exit"
      handles={[
        {
          type: "target",
          position: Position.Left,
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
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};

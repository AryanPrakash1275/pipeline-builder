import React, { useMemo, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

const DEFAULT_JSON = `{
  "hello": "world"
}`;

export const JsonNode = ({ id, data }) => {
  const initial = useMemo(() => data?.json ?? DEFAULT_JSON, [data]);
  const [jsonText, setJsonText] = useState(initial);

  return (
    <BaseNode
      nodeId={id}
      title="JSON"
      subtitle="Static JSON payload"
      handles={[
        { type: "source", position: Position.Right, id: `${id}-json` },
      ]}
    >
      <div className="vs-field">
        <label>JSON</label>
        <textarea
          className="vs-textarea"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          style={{ resize: "vertical", minHeight: 90 }}
        />
      </div>
    </BaseNode>
  );
};

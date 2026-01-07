// llmNode.js

import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const LLMNode = ({ id }) => {
  return (
    <BaseNode
      nodeId={id}
      title="LLM"
      subtitle="System + Prompt → Response"
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-system`,
          label: "system",
          style: { top: 70 },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-prompt`,
          label: "prompt",
          style: { top: 110 },
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-response`,
        },
      ]}
    >
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
        Produces a response based on system + prompt.
      </div>
    </BaseNode>
  );
};

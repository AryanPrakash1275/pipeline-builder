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
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-prompt`,
          label: "prompt",
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-response`,
        },
      ]}
    >
      <div className="vs-muted">
        Produces a response based on system + prompt.
      </div>
    </BaseNode>
  );
};

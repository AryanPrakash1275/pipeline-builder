import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = ({ locked = false, onToggleLock }) => {
  return (
    <div className="vs-toolbar">
      <div className="vs-toolbar__row">
        <div className="vs-toolbar__title">Available Nodes</div>

        <div className="vs-toolbar__spacer" />

        <button
          type="button"
          className="vs-btn vs-btn--ghost"
          onClick={onToggleLock}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {locked ? "🔒 Locked" : "🔓 Lock"}
        </button>
      </div>

      <div className={`vs-palette ${locked ? "is-locked" : ""}`}>
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="number" label="Number" />
        <DraggableNode type="json" label="JSON" />
        <DraggableNode type="merge" label="Merge" />
        <DraggableNode type="switch" label="Switch" />
        <DraggableNode type="delay" label="Delay" />
      </div>
    </div>
  );
};

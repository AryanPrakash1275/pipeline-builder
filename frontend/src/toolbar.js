// toolbar.js
import { useCallback, useState } from "react";
import { DraggableNode } from "./draggableNode";
import { useStore } from "./store";

export const PipelineToolbar = () => {
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);

  const [demo, setDemo] = useState("demo1");

  const loadDemo1 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-1",
        type: "customInput",
        position: { x: 120, y: 120 },
        data: { id: "customInput-1", nodeType: "Input" },
      },
      {
        id: "text-1",
        type: "text",
        position: { x: 360, y: 160 },
        data: { id: "text-1", nodeType: "Text", text: "Hello {{name}}" },
      },
      {
        id: "llm-1",
        type: "llm",
        position: { x: 620, y: 180 },
        data: { id: "llm-1", nodeType: "LLM" },
      },
      {
        id: "customOutput-1",
        type: "customOutput",
        position: { x: 900, y: 220 },
        data: { id: "customOutput-1", nodeType: "Output" },
      },
      {
        id: "delay-1",
        type: "delay",
        position: { x: 640, y: 380 },
        data: { id: "delay-1", nodeType: "Delay" },
      },
    ];

    const demoEdges = [
      { id: "e1", source: "customInput-1", target: "text-1", type: "smoothstep", animated: true },
      { id: "e2", source: "text-1", target: "llm-1", type: "smoothstep", animated: true },
      { id: "e3", source: "llm-1", target: "customOutput-1", type: "smoothstep", animated: true },
      { id: "e4", source: "llm-1", target: "delay-1", type: "smoothstep", animated: true },
      { id: "e5", source: "delay-1", target: "customOutput-1", type: "smoothstep", animated: true },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
  }, [setNodes, setEdges]);

  const loadDemo2 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-2",
        type: "customInput",
        position: { x: 110, y: 220 },
        data: { id: "customInput-2", nodeType: "Input" },
      },
      {
        id: "switch-1",
        type: "switch",
        position: { x: 340, y: 220 },
        data: { id: "switch-1", nodeType: "Switch" },
      },
      {
        id: "json-1",
        type: "json",
        position: { x: 580, y: 120 },
        data: { id: "json-1", nodeType: "JSON", json: '{\n  "route": "A"\n}' },
      },
      {
        id: "number-1",
        type: "number",
        position: { x: 580, y: 320 },
        data: { id: "number-1", nodeType: "Number", value: 42 },
      },
      {
        id: "merge-1",
        type: "merge",
        position: { x: 800, y: 220 },
        data: { id: "merge-1", nodeType: "Merge" },
      },
      {
        id: "customOutput-2",
        type: "customOutput",
        position: { x: 1030, y: 240 },
        data: { id: "customOutput-2", nodeType: "Output" },
      },
    ];

    const demoEdges = [
      { id: "d2e1", source: "customInput-2", target: "switch-1", type: "smoothstep", animated: true },

      // switch -> A/B
      { id: "d2e2", source: "switch-1", target: "json-1", type: "smoothstep", animated: true },
      { id: "d2e3", source: "switch-1", target: "number-1", type: "smoothstep", animated: true },

      // both into merge
      { id: "d2e4", source: "json-1", target: "merge-1", type: "smoothstep", animated: true },
      { id: "d2e5", source: "number-1", target: "merge-1", type: "smoothstep", animated: true },

      // merge -> output
      { id: "d2e6", source: "merge-1", target: "customOutput-2", type: "smoothstep", animated: true },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
  }, [setNodes, setEdges]);

  const loadSelectedDemo = useCallback(() => {
    if (demo === "demo2") loadDemo2();
    else loadDemo1();
  }, [demo, loadDemo1, loadDemo2]);

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Available Nodes</div>

        <select
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            marginLeft: "auto",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.9)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12,
            outline: "none",
          }}
        >
          <option value="demo1">Demo 1 — Text → LLM</option>
          <option value="demo2">Demo 2 — Switch + Merge</option>
        </select>

        <button
          type="button"
          onClick={loadSelectedDemo}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.9)",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Load Demo
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
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

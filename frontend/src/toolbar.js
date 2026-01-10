// toolbar.js
import { useCallback, useState } from "react";
import { useReactFlow } from "reactflow";
import { DraggableNode } from "./draggableNode";
import { useStore } from "./store";

export const PipelineToolbar = () => {
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);

  const { fitView } = useReactFlow();

  const [demo, setDemo] = useState("demo1");

  const runFitView = useCallback(() => {
    // safest way to ensure nodes/edges are committed + measured
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fitView({ padding: 0.25, duration: 300 });
      });
    });
  }, [fitView]);

  const loadDemo1 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-1",
        type: "customInput",
        position: { x: 80, y: 160 },
        data: { id: "customInput-1", nodeType: "Input" },
      },
      {
        id: "text-1",
        type: "text",
        position: { x: 420, y: 160 },
        data: { id: "text-1", nodeType: "Text", text: "Hello {{name}}" },
      },
      {
        id: "llm-1",
        type: "llm",
        position: { x: 760, y: 160 },
        data: { id: "llm-1", nodeType: "LLM" },
      },
      {
        id: "customOutput-1",
        type: "customOutput",
        position: { x: 1100, y: 160 },
        data: { id: "customOutput-1", nodeType: "Output" },
      },
      {
        id: "delay-1",
        type: "delay",
        position: { x: 760, y: 380 },
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
    runFitView();
  }, [setNodes, setEdges, runFitView]);

  const loadDemo2 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-2",
        type: "customInput",
        position: { x: 80, y: 240 },
        data: { id: "customInput-2", nodeType: "Input" },
      },
      {
        id: "switch-1",
        type: "switch",
        position: { x: 420, y: 240 },
        data: { id: "switch-1", nodeType: "Switch" },
      },
      {
        id: "json-1",
        type: "json",
        position: { x: 760, y: 120 },
        data: {
          id: "json-1",
          nodeType: "JSON",
          json: '{\n  "route": "A"\n}',
        },
      },
      {
        id: "number-1",
        type: "number",
        position: { x: 760, y: 360 },
        data: { id: "number-1", nodeType: "Number", value: 42 },
      },
      {
        id: "merge-1",
        type: "merge",
        position: { x: 1100, y: 240 },
        data: { id: "merge-1", nodeType: "Merge" },
      },
      {
        id: "customOutput-2",
        type: "customOutput",
        position: { x: 1420, y: 240 },
        data: { id: "customOutput-2", nodeType: "Output" },
      },
    ];

    const demoEdges = [
      { id: "d2e1", source: "customInput-2", target: "switch-1", type: "smoothstep", animated: true },
      { id: "d2e2", source: "switch-1", target: "json-1", type: "smoothstep", animated: true },
      { id: "d2e3", source: "switch-1", target: "number-1", type: "smoothstep", animated: true },
      { id: "d2e4", source: "json-1", target: "merge-1", type: "smoothstep", animated: true },
      { id: "d2e5", source: "number-1", target: "merge-1", type: "smoothstep", animated: true },
      { id: "d2e6", source: "merge-1", target: "customOutput-2", type: "smoothstep", animated: true },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
    runFitView();
  }, [setNodes, setEdges, runFitView]);

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
          onPointerDown={(e) => e.stopPropagation()}
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
          onPointerDown={(e) => e.stopPropagation()}
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

      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
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

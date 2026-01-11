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
    // Safest way to ensure nodes/edges are committed + measured
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fitView({ padding: 0.25, duration: 300 });
      });
    });
  }, [fitView]);

  /* =========================
     Demo 1 — Text → LLM
     ========================= */

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
      {
        id: "e1",
        source: "customInput-1",
        target: "text-1",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "e2",
        source: "text-1",
        target: "llm-1",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "e3",
        source: "llm-1",
        target: "customOutput-1",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "e4",
        source: "llm-1",
        target: "delay-1",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "e5",
        source: "delay-1",
        target: "customOutput-1",
        type: "smoothstep",
        animated: true,
      },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
    runFitView();
  }, [setNodes, setEdges, runFitView]);

  /* =========================
     Demo 2 — Switch + Merge
     ========================= */

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

    // IMPORTANT:
    // MergeNode handle ids are:
    // - merge-1-a
    // - merge-1-b
    // - merge-1-out
    const demoEdges = [
      {
        id: "d2e1",
        source: "customInput-2",
        target: "switch-1",
        type: "smoothstep",
        animated: true,
      },

      {
        id: "d2e4",
        source: "json-1",
        target: "merge-1",
        targetHandle: "merge-1-a",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "d2e5",
        source: "number-1",
        target: "merge-1",
        targetHandle: "merge-1-b",
        type: "smoothstep",
        animated: true,
      },

      {
        id: "d2e6",
        source: "merge-1",
        sourceHandle: "merge-1-out",
        target: "customOutput-2",
        type: "smoothstep",
        animated: true,
      },
    ];

    setNodes(demoNodes);
    setEdges(demoEdges);
    runFitView();
  }, [setNodes, setEdges, runFitView]);

  const loadSelectedDemo = useCallback(() => {
    if (demo === "demo2") loadDemo2();
    else loadDemo1();
  }, [demo, loadDemo1, loadDemo2]);

  /* =========================
     Render
     ========================= */

  return (
    <div className="vs-toolbar">
      <div className="vs-toolbar__row">
        <div className="vs-toolbar__title">Available Nodes</div>

        <div className="vs-toolbar__spacer" />

        <select
          className="vs-control"
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <option value="demo1">Demo 1 — Text → LLM</option>
          <option value="demo2">Demo 2 — Switch + Merge</option>
        </select>

        <button
          type="button"
          className="vs-btn"
          onClick={loadSelectedDemo}
          onPointerDown={(e) => e.stopPropagation()}
        >
          Load Demo
        </button>
      </div>

      <div className="vs-palette">
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

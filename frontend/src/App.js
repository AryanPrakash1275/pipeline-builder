// src/App.js
import { useCallback, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { Sidebar } from "../src/sideBar";
import { useStore } from "./store";
import "./styles/vs.css";

function App() {
  const setNodes = useStore((s) => s.setNodes);
  const setEdges = useStore((s) => s.setEdges);

  const [locked, setLocked] = useState(false);

  const onToggleLock = useCallback(() => setLocked((v) => !v), []);

  const onNewPipeline = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const onFullWipe = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const loadDemo1 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-1",
        type: "customInput",
        position: { x: 120, y: 260 },
        data: { id: "customInput-1", nodeType: "Input" },
      },
      {
        id: "text-1",
        type: "text",
        position: { x: 560, y: 260 },
        data: { id: "text-1", nodeType: "Text", text: "Hello {{name}}" },
      },
      {
        id: "llm-1",
        type: "llm",
        position: { x: 1040, y: 260 },
        data: { id: "llm-1", nodeType: "LLM" },
      },
      {
        id: "customOutput-1",
        type: "customOutput",
        position: { x: 1520, y: 160 },
        data: { id: "customOutput-1", nodeType: "Output" },
      },
      {
        id: "delay-1",
        type: "delay",
        position: { x: 1520, y: 460 },
        data: { id: "delay-1", nodeType: "Delay" },
      },
    ];

    const demoEdges = [
      {
        id: "e1",
        source: "customInput-1",
        target: "text-1",
        targetHandle: "text-1-var-anme",
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
  }, [setNodes, setEdges]);

  const loadDemo2 = useCallback(() => {
    const demoNodes = [
      {
        id: "customInput-2",
        type: "customInput",
        position: { x: 220, y: 300 },
        data: { id: "customInput-2", nodeType: "Input" },
      },
      {
        id: "switch-1",
        type: "switch",
        position: { x: 560, y: 300 },
        data: { id: "switch-1", nodeType: "Switch" },
      },
      {
        id: "json-1",
        type: "json",
        position: { x: 900, y: 180 },
        data: {
          id: "json-1",
          nodeType: "JSON",
          json: '{\n  "route": "A"\n}',
        },
      },
      {
        id: "number-1",
        type: "number",
        position: { x: 900, y: 420 },
        data: { id: "number-1", nodeType: "Number", value: 42 },
      },
      {
        id: "merge-1",
        type: "merge",
        position: { x: 1240, y: 300 },
        data: { id: "merge-1", nodeType: "Merge" },
      },
      {
        id: "customOutput-2",
        type: "customOutput",
        position: { x: 1580, y: 300 },
        data: { id: "customOutput-2", nodeType: "Output" },
      },
    ];

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
  }, [setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <div className="vs-app">
        <Sidebar
          locked={locked}
          onNewPipeline={onNewPipeline}
          onLoadDemo1={loadDemo1}
          onLoadDemo2={loadDemo2}
          onFullWipe={onFullWipe}
        />

        <div className="vs-main">
          <PipelineToolbar locked={locked} onToggleLock={onToggleLock} />
          <PipelineUI locked={locked} />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
import { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";

import { NumberNode } from "./nodes/numberNode";
import { JsonNode } from "./nodes/jsonNode";
import { MergeNode } from "./nodes/mergeNode";
import { SwitchNode } from "./nodes/switchNode";
import { DelayNode } from "./nodes/delayNode";

import { SubmitButton } from "./submit";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  number: NumberNode,
  json: JsonNode,
  merge: MergeNode,
  switch: SwitchNode,
  delay: DelayNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ locked = false }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const deleteSelection = useCallback(
    (event) => {
      if (locked) return;

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const selectedNodeIds = new Set((selectedNodes || []).map((n) => n.id));
      const selectedEdgeIds = new Set((selectedEdges || []).map((e) => e.id));

      if (selectedNodeIds.size === 0 && selectedEdgeIds.size === 0) return;

      const nextEdges = edges.filter(
        (e) =>
          !selectedEdgeIds.has(e.id) &&
          !selectedNodeIds.has(e.source) &&
          !selectedNodeIds.has(e.target)
      );

      const nextNodes = nodes.filter((n) => !selectedNodeIds.has(n.id));

      setEdges(nextEdges);
      setNodes(nextNodes);

      setSelectedNodes([]);
      setSelectedEdges([]);
    },
    [locked, selectedNodes, selectedEdges, nodes, edges, setNodes, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      if (locked) return;

      event.preventDefault();

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event?.dataTransfer?.getData("application/reactflow");
      if (!raw) return;

      const appData = JSON.parse(raw);
      const type = appData?.nodeType;

      if (!type) return;
      if (!reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: `${type}` },
      };

      addNode(newNode);
    },
    [locked, reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback(
    (event) => {
      if (locked) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [locked]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (locked) return;

      const el = document.activeElement;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);

      if (typing) return;

      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? event.metaKey : event.ctrlKey;

      const isDelete = event.key === "Backspace" || event.key === "Delete";
      const isCut = mod && (event.key === "x" || event.key === "X");

      if (!isDelete && !isCut) return;

      event.preventDefault();
      deleteSelection(event);
    },
    [locked, deleteSelection]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const handleConnect = useCallback(
    (params) => {
      if (locked) return;
      onConnect(params);
    },
    [locked, onConnect]
  );

  return (
    <>
      <div ref={reactFlowWrapper} className="vs-flowWrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={locked ? undefined : onNodesChange}
          onEdgesChange={locked ? undefined : onEdgesChange}
          onConnect={handleConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          nodesDraggable={!locked}
          nodesConnectable={!locked}
          onSelectionChange={({ nodes: ns, edges: es }) => {
            setSelectedNodes(ns || []);
            setSelectedEdges(es || []);
          }}
        >
          <Background gap={gridSize} />
          <Controls showInteractive={false} />
          <MiniMap />
        </ReactFlow>
      </div>

      <SubmitButton nodes={nodes} edges={edges} />
    </>
  );
};

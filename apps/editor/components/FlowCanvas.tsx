"use client";

import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "time",
    position: { x: 0, y: 60 },
    data: { label: "Time 23:00–06:00" },
    type: "input",
  },
  {
    id: "price",
    position: { x: 220, y: 0 },
    data: { label: "Price < 0.10" },
  },
  {
    id: "start-ev",
    position: { x: 440, y: 60 },
    data: { label: "Start EVSE" },
    style: { backgroundColor: "#1f2937", color: "white", border: "1px solid #1d4ed8" },
  },
  {
    id: "wait-soc",
    position: { x: 660, y: 60 },
    data: { label: "Wait SoC ≥ 80%" },
    style: { backgroundColor: "#0f172a", color: "white", border: "1px solid #fb923c" },
  },
  {
    id: "stop-ev",
    position: { x: 880, y: 60 },
    data: { label: "Stop EVSE" },
    style: { backgroundColor: "#1f2937", color: "white", border: "1px solid #22c55e" },
  },
  {
    id: "soc-guard",
    position: { x: 440, y: 200 },
    data: { label: "Safety: SoC ≥ 15%" },
    type: "output",
    style: { backgroundColor: "#083344", color: "white", border: "1px solid #22d3ee" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-time-price",
    source: "time",
    target: "price",
    label: "true",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#94a3b8",
    },
  },
  {
    id: "e-price-start",
    source: "price",
    target: "start-ev",
    label: "true",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
  },
  {
    id: "e-start-wait",
    source: "start-ev",
    target: "wait-soc",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f97316" },
  },
  {
    id: "e-wait-stop",
    source: "wait-soc",
    target: "stop-ev",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ade80" },
  },
  {
    id: "e-guard-start",
    source: "soc-guard",
    target: "start-ev",
    label: "guard",
    style: { strokeDasharray: "4 2" },
    markerEnd: { type: MarkerType.Arrow, color: "#22d3ee" },
  },
];

export function FlowCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      style={{
        height: "420px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.65)",
        borderRadius: "18px",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <MiniMap pannable zoomable style={{ backgroundColor: "#020617", borderRadius: "8px" }} />
        <Controls position="top-left" />
        <Background color="rgba(148, 163, 184, 0.25)" gap={24} />
        <Panel position="top-right" style={{ background: "rgba(15, 23, 42, 0.85)", borderRadius: "12px", padding: "12px" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>
            Demo Flow
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "4px" }}>Night charge to 80%</div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

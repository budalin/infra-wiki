import type { Edge, Node, NodeTypes } from 'reactflow'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'

interface FlowDiagramProps {
  nodes: Node[]
  edges: Edge[]
  nodeTypes?: NodeTypes
}

function FlowDiagram({ nodes, edges, nodeTypes }: FlowDiagramProps) {
  return (
    <div className="flow-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1} color="rgba(159, 176, 201, 0.15)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export default FlowDiagram

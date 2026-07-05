import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { Edge, Node, NodeProps, NodeTypes } from 'reactflow'
import ReactFlow, { Background, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'

interface MindmapBranch {
  label: string
  children?: string[]
}

interface MindmapProps {
  center: string
  branches: MindmapBranch[]
}

interface MindNodeData {
  label: string
  role: 'center' | 'branch' | 'child'
}

function MindNode({ data }: NodeProps<MindNodeData>) {
  return (
    <div className="rf-node">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="rf-title">{data.label}</div>
      <div className="rf-sub">{data.role}</div>
    </div>
  )
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }
}

function Mindmap({ center, branches }: MindmapProps) {
  const { nodes, edges } = useMemo(() => {
    const size = 420
    const centerX = size / 2
    const centerY = size / 2
    const nodes: Node<MindNodeData>[] = [
      {
        id: 'center',
        type: 'mind',
        position: { x: centerX - 72, y: centerY - 32 },
        data: { label: center, role: 'center' },
        style: { width: 144 },
      },
    ]
    const edges: Edge[] = []
    const branchRadius = 140
    const childRadius = 235

    branches.forEach((branch, index) => {
      const children = branch.children ?? []
      const angle = (Math.PI * 2 * index) / Math.max(branches.length, 1) - Math.PI / 2
      const branchPoint = polarToCartesian(centerX, centerY, branchRadius, angle)
      const branchId = `branch-${index}`
      nodes.push({
        id: branchId,
        type: 'mind',
        position: { x: branchPoint.x - 72, y: branchPoint.y - 32 },
        data: { label: branch.label, role: 'branch' },
        style: { width: 144 },
      })
      edges.push({ id: `edge-${index}`, source: 'center', target: branchId, type: 'smoothstep' })

      children.forEach((child, childIndex) => {
        const spread = 0.35
        const childAngle = angle + (childIndex - (children.length - 1) / 2) * spread
        const childPoint = polarToCartesian(centerX, centerY, childRadius, childAngle)
        const childId = `${branchId}-child-${childIndex}`
        nodes.push({
          id: childId,
          type: 'mind',
          position: { x: childPoint.x - 72, y: childPoint.y - 32 },
          data: { label: child, role: 'child' },
          style: { width: 144 },
        })
        edges.push({
          id: `edge-${index}-${childIndex}`,
          source: branchId,
          target: childId,
          type: 'smoothstep',
        })
      })
    })

    return { nodes, edges }
  }, [branches, center])

  const nodeTypes = useMemo<NodeTypes>(() => ({ mind: MindNode }), [])

  const wrapperStyle = { height: '420px' } as CSSProperties

  return (
    <div className="flow-wrap" style={wrapperStyle}>
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
      </ReactFlow>
    </div>
  )
}

export default Mindmap

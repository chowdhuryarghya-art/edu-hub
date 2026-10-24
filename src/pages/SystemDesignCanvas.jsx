import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Square,
  Circle,
  Diamond,
  Database,
  Cloud,
  Server,
  Layers,
  ArrowRight,
  Move,
  Type,
  MousePointer,
  Trash2,
  Copy,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Palette,
  FileText,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Inbox,
  Coffee,
  Terminal,
  HardDrive,
  Cpu,
  Minus,
  Check,
  Plus,
  Play,
  Share2,
  Grid,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Moon,
  Save,
  HelpCircle
} from 'lucide-react';
import './SystemDesignCanvas.css';

// Pre-defined Architectural & Flowchart Shapes
const SHAPE_PALETTES = [
  {
    category: 'System Architecture',
    items: [
      { type: 'client', label: 'Client / App', icon: Smartphone, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#3b82f6', shapeType: 'rounded' },
      { type: 'api-gateway', label: 'API Gateway', icon: Shield, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#f59e0b', shapeType: 'rounded' },
      { type: 'service', label: 'Microservice', icon: Server, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle' },
      { type: 'springboot', label: 'Spring Boot App', icon: Coffee, defaultWidth: 150, defaultHeight: 70, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle' },
      { type: 'database', label: 'SQL / NoSQL DB', icon: Database, defaultWidth: 130, defaultHeight: 80, fill: '#1e293b', stroke: '#6366f1', shapeType: 'cylinder' },
      { type: 'cache', label: 'Redis Cache', icon: Zap, defaultWidth: 130, defaultHeight: 65, fill: '#1e293b', stroke: '#ef4444', shapeType: 'rounded' },
      { type: 'queue', label: 'Message Queue / Kafka', icon: Inbox, defaultWidth: 150, defaultHeight: 65, fill: '#1e293b', stroke: '#8b5cf6', shapeType: 'queue' },
      { type: 'cloud', label: 'Cloud / CDN', icon: Cloud, defaultWidth: 140, defaultHeight: 75, fill: '#1e293b', stroke: '#06b6d4', shapeType: 'cloud' },
      { type: 'lambda', label: 'Serverless Func', icon: Cpu, defaultWidth: 130, defaultHeight: 65, fill: '#1e293b', stroke: '#f97316', shapeType: 'rounded' },
      { type: 'storage', label: 'S3 / Blob Storage', icon: HardDrive, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#14b8a6', shapeType: 'rectangle' }
    ]
  },
  {
    category: 'Standard Shapes & Flow',
    items: [
      { type: 'rectangle', label: 'Process Box', icon: Square, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#94a3b8', shapeType: 'rectangle' },
      { type: 'rounded', label: 'Rounded Box', icon: Square, defaultWidth: 140, defaultHeight: 70, fill: '#1e293b', stroke: '#94a3b8', shapeType: 'rounded' },
      { type: 'circle', label: 'Circle / State', icon: Circle, defaultWidth: 80, defaultHeight: 80, fill: '#1e293b', stroke: '#94a3b8', shapeType: 'circle' },
      { type: 'diamond', label: 'Decision', icon: Diamond, defaultWidth: 110, defaultHeight: 80, fill: '#1e293b', stroke: '#eab308', shapeType: 'diamond' },
      { type: 'text-block', label: 'Annotation / Text', icon: Type, defaultWidth: 150, defaultHeight: 50, fill: 'transparent', stroke: 'transparent', shapeType: 'text' }
    ]
  }
];

const TEMPLATES = [
  {
    id: 'microservices',
    name: 'Microservices & Event Bus',
    description: 'API Gateway + Services + Cache + Kafka + DB',
    nodes: [
      { id: 't1', type: 'client', label: 'Mobile / Web Client', x: 80, y: 160, width: 140, height: 60, fill: '#1e293b', stroke: '#3b82f6', shapeType: 'rounded', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 't2', type: 'api-gateway', label: 'API Gateway', x: 280, y: 160, width: 130, height: 60, fill: '#1e293b', stroke: '#f59e0b', shapeType: 'rounded', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 't3', type: 'springboot', label: 'Order Service', x: 480, y: 100, width: 140, height: 60, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 't4', type: 'service', label: 'Payment Service', x: 480, y: 220, width: 140, height: 60, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 't5', type: 'cache', label: 'Redis Cache', x: 680, y: 60, width: 120, height: 55, fill: '#1e293b', stroke: '#ef4444', shapeType: 'rounded', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 't6', type: 'database', label: 'PostgreSQL DB', x: 680, y: 140, width: 130, height: 70, fill: '#1e293b', stroke: '#6366f1', shapeType: 'cylinder', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 't7', type: 'queue', label: 'Kafka Event Bus', x: 480, y: 340, width: 150, height: 60, fill: '#1e293b', stroke: '#8b5cf6', shapeType: 'queue', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 't8', type: 'service', label: 'Notification Worker', x: 700, y: 340, width: 140, height: 60, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' }
    ],
    connections: [
      { id: 'c1', from: 't1', to: 't2', label: 'HTTPS', style: 'solid', color: '#60a5fa' },
      { id: 'c2', from: 't2', to: 't3', label: '/orders', style: 'solid', color: '#60a5fa' },
      { id: 'c3', from: 't2', to: 't4', label: '/payments', style: 'solid', color: '#60a5fa' },
      { id: 'c4', from: 't3', to: 't5', label: 'read/write', style: 'dashed', color: '#f87171' },
      { id: 'c5', from: 't3', to: 't6', label: 'persist', style: 'solid', color: '#818cf8' },
      { id: 'c6', from: 't4', to: 't7', label: 'PaymentSuccess', style: 'solid', color: '#a78bfa' },
      { id: 'c7', from: 't7', to: 't8', label: 'consume', style: 'solid', color: '#a78bfa' }
    ]
  },
  {
    id: 'cqrs',
    name: 'CQRS & Read/Write Split',
    description: 'Separate Command and Query Pipelines with Event Store',
    nodes: [
      { id: 'cq1', type: 'client', label: 'Client App', x: 80, y: 160, width: 130, height: 60, fill: '#1e293b', stroke: '#3b82f6', shapeType: 'rounded', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 'cq2', type: 'service', label: 'Command API (Write)', x: 280, y: 80, width: 150, height: 60, fill: '#1e293b', stroke: '#f59e0b', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 'cq3', type: 'service', label: 'Query API (Read)', x: 280, y: 240, width: 150, height: 60, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 'cq4', type: 'database', label: 'Write DB / EventStore', x: 500, y: 80, width: 140, height: 75, fill: '#1e293b', stroke: '#6366f1', shapeType: 'cylinder', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'cq5', type: 'queue', label: 'Event Publisher', x: 700, y: 80, width: 140, height: 60, fill: '#1e293b', stroke: '#8b5cf6', shapeType: 'queue', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'cq6', type: 'database', label: 'Read DB (Elastic/Mongo)', x: 500, y: 240, width: 150, height: 75, fill: '#1e293b', stroke: '#06b6d4', shapeType: 'cylinder', fontSize: 12, align: 'center', textColor: '#ffffff' }
    ],
    connections: [
      { id: 'cc1', from: 'cq1', to: 'cq2', label: 'POST /orders', style: 'solid', color: '#fbbf24' },
      { id: 'cc2', from: 'cq1', to: 'cq3', label: 'GET /orders', style: 'solid', color: '#34d399' },
      { id: 'cc3', from: 'cq2', to: 'cq4', label: 'Save Event', style: 'solid', color: '#818cf8' },
      { id: 'cc4', from: 'cq4', to: 'cq5', label: 'CDC Stream', style: 'dashed', color: '#a78bfa' },
      { id: 'cc5', from: 'cq5', to: 'cq6', label: 'Sync Projection', style: 'solid', color: '#22d3ee' },
      { id: 'cc6', from: 'cq3', to: 'cq6', label: 'Fast Query', style: 'solid', color: '#22d3ee' }
    ]
  },
  {
    id: 'notification-service',
    name: 'Event-Driven Notification Hub',
    description: 'Spring Boot + Redis Cache + Kafka Outbox + DLQ',
    nodes: [
      { id: 'n1', type: 'client', label: 'Order Service Trigger', x: 60, y: 150, width: 150, height: 60, fill: '#1e293b', stroke: '#3b82f6', shapeType: 'rounded', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'n2', type: 'api-gateway', label: 'API Gateway / LB', x: 260, y: 150, width: 130, height: 60, fill: '#1e293b', stroke: '#f59e0b', shapeType: 'rounded', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'n3', type: 'springboot', label: 'Spring Boot Notification', x: 450, y: 150, width: 160, height: 65, fill: '#1e293b', stroke: '#10b981', shapeType: 'rectangle', fontSize: 13, align: 'center', textColor: '#ffffff' },
      { id: 'n4', type: 'cache', label: 'Redis (Pref & Templates)', x: 450, y: 280, width: 150, height: 60, fill: '#1e293b', stroke: '#ef4444', shapeType: 'rounded', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'n5', type: 'queue', label: 'Kafka / SQS Outbox', x: 680, y: 150, width: 150, height: 60, fill: '#1e293b', stroke: '#8b5cf6', shapeType: 'queue', fontSize: 12, align: 'center', textColor: '#ffffff' },
      { id: 'n6', type: 'service', label: 'Dead Letter Queue (DLQ)', x: 680, y: 280, width: 150, height: 60, fill: '#1e293b', stroke: '#ef4444', shapeType: 'rounded', fontSize: 12, align: 'center', textColor: '#ffffff' }
    ],
    connections: [
      { id: 'nc1', from: 'n1', to: 'n2', label: 'Event Trigger', style: 'solid', color: '#60a5fa' },
      { id: 'nc2', from: 'n2', to: 'n3', label: 'Forward', style: 'solid', color: '#f59e0b' },
      { id: 'nc3', from: 'n3', to: 'n4', label: 'Sub-ms Read', style: 'dashed', color: '#ef4444' },
      { id: 'nc4', from: 'n3', to: 'n5', label: 'Publish Event', style: 'solid', color: '#8b5cf6' },
      { id: 'nc5', from: 'n5', to: 'n6', label: 'On Failure (Retry 3x)', style: 'dashed', color: '#ef4444' }
    ]
  }
];

const COLOR_SWATCHES = [
  '#1e293b', '#0f172a', '#1e1b4b', '#064e3b', '#701a75', '#450a0a', '#172554', '#ffffff'
];

const STROKE_SWATCHES = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#94a3b8', '#ffffff'
];

export default function SystemDesignCanvas() {
  // Canvas Items
  const [nodes, setNodes] = useState(TEMPLATES[0].nodes);
  const [connections, setConnections] = useState(TEMPLATES[0].connections);

  // Tools & Modes: 'select' | 'connect' | 'rectangle' | 'circle' | 'diamond' | 'text' | 'pan'
  const [activeTool, setActiveTool] = useState('select');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const [connectingStartNodeId, setConnectingStartNodeId] = useState(null);

  // Canvas Viewport Transformation
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // Interaction States
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingNodeId, setResizingNodeId] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0, nodeX: 0, nodeY: 0 });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingConnectionId, setEditingConnectionId] = useState(null);

  // History for Undo/Redo
  const [history, setHistory] = useState([{ nodes: TEMPLATES[0].nodes, connections: TEMPLATES[0].connections }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Record History State
  const pushState = useCallback((newNodes, newConnections) => {
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, { nodes: newNodes, connections: newConnections }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setNodes(history[targetIndex].nodes);
      setConnections(history[targetIndex].connections);
      setHistoryIndex(targetIndex);
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setNodes(history[targetIndex].nodes);
      setConnections(history[targetIndex].connections);
      setHistoryIndex(targetIndex);
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    }
  };

  // Keyboard Shortcuts (Delete, Undo, Escape, Select All)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingNodeId || editingConnectionId) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.target.matches('input, textarea')) {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        } else if (selectedConnectionId) {
          deleteConnection(selectedConnectionId);
        }
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedConnectionId(null);
        setConnectingStartNodeId(null);
        setActiveTool('select');
      } else if (e.key === 'v') {
        setActiveTool('select');
      } else if (e.key === 'c') {
        setActiveTool('connect');
      } else if (e.key === 'h') {
        setActiveTool('pan');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedConnectionId, editingNodeId, editingConnectionId, historyIndex, history]);

  // Transform coordinates accounting for Pan & Zoom
  const getCanvasCoords = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  };

  // Add Item From Palette
  const handleAddFromPalette = (item) => {
    const id = `node-${Date.now()}`;
    // Center of current view
    const canvasRect = canvasRef.current?.getBoundingClientRect() || { width: 800, height: 600 };
    const centerX = (-pan.x + canvasRect.width / 2) / zoom - item.defaultWidth / 2;
    const centerY = (-pan.y + canvasRect.height / 2) / zoom - item.defaultHeight / 2;

    const newNode = {
      id,
      type: item.type,
      label: item.label,
      x: Math.round(centerX + (Math.random() * 40 - 20)),
      y: Math.round(centerY + (Math.random() * 40 - 20)),
      width: item.defaultWidth,
      height: item.defaultHeight,
      fill: item.fill,
      stroke: item.stroke,
      shapeType: item.shapeType,
      fontSize: 13,
      align: 'center',
      textColor: '#ffffff'
    };

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    pushState(newNodes, connections);
    setSelectedNodeId(id);
    setActiveTool('select');
  };

  // Delete Node & Associated Connections
  const deleteNode = (id) => {
    const newNodes = nodes.filter(n => n.id !== id);
    const newConns = connections.filter(c => c.from !== id && c.to !== id);
    setNodes(newNodes);
    setConnections(newConns);
    setSelectedNodeId(null);
    pushState(newNodes, newConns);
  };

  // Delete Connection
  const deleteConnection = (id) => {
    const newConns = connections.filter(c => c.id !== id);
    setConnections(newConns);
    setSelectedConnectionId(null);
    pushState(nodes, newConns);
  };

  // Duplicate Selected Node
  const duplicateSelectedNode = () => {
    if (!selectedNodeId) return;
    const target = nodes.find(n => n.id === selectedNodeId);
    if (!target) return;
    const newId = `node-${Date.now()}`;
    const newNode = {
      ...target,
      id: newId,
      x: target.x + 30,
      y: target.y + 30
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setSelectedNodeId(newId);
    pushState(newNodes, connections);
  };

  // Handle Canvas Mouse Down
  const handleCanvasMouseDown = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList.contains('canvas-grid-bg') && !e.target.classList.contains('canvas-svg-layer')) {
      return;
    }

    if (activeTool === 'pan' || e.button === 1 || e.spaceKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'diamond' || activeTool === 'text') {
      const coords = getCanvasCoords(e);
      const id = `node-${Date.now()}`;
      let width = 140;
      let height = 70;
      let shapeType = activeTool;
      let fill = '#1e293b';
      let stroke = '#94a3b8';
      let label = 'New Process';

      if (activeTool === 'circle') {
        width = 80;
        height = 80;
        label = 'State';
      } else if (activeTool === 'diamond') {
        width = 110;
        height = 80;
        label = 'Decision?';
        stroke = '#eab308';
      } else if (activeTool === 'text') {
        width = 140;
        height = 40;
        shapeType = 'text';
        fill = 'transparent';
        stroke = 'transparent';
        label = 'Text Note';
      }

      const newNode = {
        id,
        type: activeTool,
        label,
        x: Math.round(coords.x - width / 2),
        y: Math.round(coords.y - height / 2),
        width,
        height,
        fill,
        stroke,
        shapeType,
        fontSize: 13,
        align: 'center',
        textColor: '#ffffff'
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      pushState(newNodes, connections);
      setSelectedNodeId(id);
      setActiveTool('select');
      return;
    }

    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    setConnectingStartNodeId(null);
  };

  // Node Mouse Down for Dragging / Connecting
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();

    if (activeTool === 'connect' || connectingStartNodeId) {
      if (!connectingStartNodeId) {
        setConnectingStartNodeId(nodeId);
      } else if (connectingStartNodeId !== nodeId) {
        // Connect nodes
        const exists = connections.some(c => c.from === connectingStartNodeId && c.to === nodeId);
        if (!exists) {
          const newConnection = {
            id: `conn-${Date.now()}`,
            from: connectingStartNodeId,
            to: nodeId,
            label: '',
            style: 'solid',
            color: '#60a5fa'
          };
          const newConns = [...connections, newConnection];
          setConnections(newConns);
          pushState(nodes, newConns);
          setSelectedConnectionId(newConnection.id);
        }
        setConnectingStartNodeId(null);
        setActiveTool('select');
      }
      return;
    }

    setSelectedNodeId(nodeId);
    setSelectedConnectionId(null);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const coords = getCanvasCoords(e);
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y
    });
  };

  // Start Resize
  const handleResizeHandleMouseDown = (e, nodeId, handle) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setResizingNodeId(nodeId);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: node.width,
      h: node.height,
      nodeX: node.x,
      nodeY: node.y
    });
  };

  // Canvas Mouse Move
  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (resizingNodeId && resizeHandle) {
      const dx = (e.clientX - resizeStart.x) / zoom;
      const dy = (e.clientY - resizeStart.y) / zoom;

      setNodes(prev => prev.map(n => {
        if (n.id !== resizingNodeId) return n;

        let newW = resizeStart.w;
        let newH = resizeStart.h;
        let newX = resizeStart.nodeX;
        let newY = resizeStart.nodeY;

        if (resizeHandle.includes('e')) newW = Math.max(50, resizeStart.w + dx);
        if (resizeHandle.includes('s')) newH = Math.max(40, resizeStart.h + dy);
        if (resizeHandle.includes('w')) {
          const clampedDx = Math.min(dx, resizeStart.w - 50);
          newW = resizeStart.w - clampedDx;
          newX = resizeStart.nodeX + clampedDx;
        }
        if (resizeHandle.includes('n')) {
          const clampedDy = Math.min(dy, resizeStart.h - 40);
          newH = resizeStart.h - clampedDy;
          newY = resizeStart.nodeY + clampedDy;
        }

        return { ...n, x: Math.round(newX), y: Math.round(newY), width: Math.round(newW), height: Math.round(newH) };
      }));
      return;
    }

    if (draggingNodeId) {
      const coords = getCanvasCoords(e);
      const newX = Math.round(coords.x - dragOffset.x);
      const newY = Math.round(coords.y - dragOffset.y);

      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (draggingNodeId || resizingNodeId) {
      pushState(nodes, connections);
      setDraggingNodeId(null);
      setResizingNodeId(null);
      setResizeHandle(null);
    }
  };

  // Canvas Wheel for Zoom / Pan
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(prev => Math.min(2.5, Math.max(0.3, prev * zoomFactor)));
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  // Load Template
  const loadTemplate = (tmpl) => {
    setNodes(tmpl.nodes);
    setConnections(tmpl.connections);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    pushState(tmpl.nodes, tmpl.connections);
  };

  // Update Selected Node Property
  const updateSelectedNode = (props) => {
    if (!selectedNodeId) return;
    const newNodes = nodes.map(n => n.id === selectedNodeId ? { ...n, ...props } : n);
    setNodes(newNodes);
    pushState(newNodes, connections);
  };

  // Update Selected Connection Property
  const updateSelectedConnection = (props) => {
    if (!selectedConnectionId) return;
    const newConns = connections.map(c => c.id === selectedConnectionId ? { ...c, ...props } : c);
    setConnections(newConns);
    pushState(nodes, newConns);
  };

  // Export as JSON file
  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ nodes, connections }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system-design-diagram-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.nodes && parsed.connections) {
          setNodes(parsed.nodes);
          setConnections(parsed.connections);
          pushState(parsed.nodes, parsed.connections);
        }
      } catch (err) {
        alert('Invalid JSON diagram file');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Export as SVG / PNG
  const exportAsSVG = () => {
    const svgElem = canvasRef.current?.querySelector('.canvas-svg-layer');
    if (!svgElem) return;
    
    // Calculate bounding box of all nodes
    if (nodes.length === 0) return;
    const minX = Math.min(...nodes.map(n => n.x)) - 40;
    const minY = Math.min(...nodes.map(n => n.y)) - 40;
    const maxX = Math.max(...nodes.map(n => n.x + n.width)) + 40;
    const maxY = Math.max(...nodes.map(n => n.y + n.height)) + 40;
    const width = maxX - minX;
    const height = maxY - minY;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}" style="background-color: #0b0f19; font-family: sans-serif;">`;
    svgContent += `<defs><marker id="arrow-export" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker></defs>`;
    
    // Connections
    connections.forEach(c => {
      const from = nodes.find(n => n.id === c.from);
      const to = nodes.find(n => n.id === c.to);
      if (!from || !to) return;
      const x1 = from.x + from.width / 2;
      const y1 = from.y + from.height / 2;
      const x2 = to.x + to.width / 2;
      const y2 = to.y + to.height / 2;
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.color || '#60a5fa'}" stroke-width="2" stroke-dasharray="${c.style === 'dashed' ? '5,5' : 'none'}" marker-end="url(#arrow-export)" />`;
    });

    // Nodes
    nodes.forEach(n => {
      if (n.shapeType === 'circle') {
        const r = n.width / 2;
        svgContent += `<circle cx="${n.x + r}" cy="${n.y + r}" r="${r}" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2" />`;
      } else if (n.shapeType === 'diamond') {
        const p1 = `${n.x + n.width / 2},${n.y}`;
        const p2 = `${n.x + n.width},${n.y + n.height / 2}`;
        const p3 = `${n.x + n.width / 2},${n.y + n.height}`;
        const p4 = `${n.x},${n.y + n.height / 2}`;
        svgContent += `<polygon points="${p1} ${p2} ${p3} ${p4}" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2" />`;
      } else {
        svgContent += `<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="${n.shapeType === 'rounded' ? 8 : 4}" fill="${n.fill}" stroke="${n.stroke}" stroke-width="2" />`;
      }
      svgContent += `<text x="${n.x + n.width / 2}" y="${n.y + n.height / 2 + 5}" fill="${n.textColor || '#ffffff'}" font-size="${n.fontSize || 13}" font-weight="600" text-anchor="middle">${n.label}</text>`;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `system-design-diagram-${Date.now()}.svg`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedConnection = connections.find(c => c.id === selectedConnectionId);

  // Helper to calculate connection anchor points
  const getConnectionPoints = (fromNode, toNode) => {
    const fromCenter = { x: fromNode.x + fromNode.width / 2, y: fromNode.y + fromNode.height / 2 };
    const toCenter = { x: toNode.x + toNode.width / 2, y: toNode.y + toNode.height / 2 };

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    // Edge intersection for From
    let x1 = fromCenter.x;
    let y1 = fromCenter.y;
    if (Math.abs(dx) * fromNode.height > Math.abs(dy) * fromNode.width) {
      x1 = dx > 0 ? fromNode.x + fromNode.width : fromNode.x;
      y1 = fromCenter.y + (dy * (fromNode.width / 2)) / Math.max(1, Math.abs(dx));
    } else {
      y1 = dy > 0 ? fromNode.y + fromNode.height : fromNode.y;
      x1 = fromCenter.x + (dx * (fromNode.height / 2)) / Math.max(1, Math.abs(dy));
    }

    // Edge intersection for To
    let x2 = toCenter.x;
    let y2 = toCenter.y;
    if (Math.abs(dx) * toNode.height > Math.abs(dy) * toNode.width) {
      x2 = dx > 0 ? toNode.x : toNode.x + toNode.width;
      y2 = toCenter.y - (dy * (toNode.width / 2)) / Math.max(1, Math.abs(dx));
    } else {
      y2 = dy > 0 ? toNode.y : toNode.y + toNode.height;
      x2 = toCenter.x - (dx * (toNode.height / 2)) / Math.max(1, Math.abs(dy));
    }

    return { x1, y1, x2, y2, midX: (x1 + x2) / 2, midY: (y1 + y2) / 2 };
  };

  return (
    <div className="drawio-studio-wrapper">
      {/* Top Application Bar */}
      <header className="drawio-top-bar">
        <div className="drawio-top-left">
          <Link to="/" className="drawio-back-link" title="Back to Edu Hub">
            <ArrowLeft size={16} />
            <span>Edu Hub</span>
          </Link>
          <div className="drawio-app-title">
            <Layers className="app-logo-icon" size={20} />
            <span className="app-title-text">System Design Canvas</span>
            <span className="app-badge">Lucid / Draw.io Mode</span>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="drawio-top-actions">
          <button className="top-action-btn" onClick={handleUndo} disabled={historyIndex === 0} title="Undo (Ctrl+Z)">
            <RotateCcw size={15} />
            <span>Undo</span>
          </button>
          <button className="top-action-btn" onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Shift+Z)">
            <RotateCcw size={15} style={{ transform: 'scaleX(-1)' }} />
            <span>Redo</span>
          </button>

          <div className="top-bar-divider" />

          {/* Zoom Controls */}
          <div className="zoom-pill-group">
            <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} title="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <span className="zoom-text">{Math.round(zoom * 100)}%</span>
            <button className="zoom-btn" onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} title="Zoom In">
              <ZoomIn size={14} />
            </button>
            <button className="zoom-btn" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Reset View">
              <Maximize2 size={13} />
            </button>
          </div>

          <div className="top-bar-divider" />

          {/* Import / Export / Clear */}
          <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" style={{ display: 'none' }} />
          <button className="top-action-btn" onClick={() => fileInputRef.current?.click()} title="Import Diagram JSON">
            <Upload size={15} />
            <span>Import</span>
          </button>

          <button className="top-action-btn" onClick={exportAsJSON} title="Save / Export JSON">
            <Save size={15} />
            <span>Save JSON</span>
          </button>

          <button className="top-action-btn highlight" onClick={exportAsSVG} title="Export Clean SVG">
            <Download size={15} />
            <span>Export SVG</span>
          </button>

          <button className="top-action-btn danger" onClick={() => { setNodes([]); setConnections([]); pushState([], []); setSelectedNodeId(null); setSelectedConnectionId(null); }} title="Clear Canvas">
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* Secondary Ribbon Toolbar: Tools, Formatting & Quick Add */}
      <div className="drawio-ribbon-bar">
        {/* Tool Selectors */}
        <div className="ribbon-tool-group">
          <button className={`tool-select-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setActiveTool('select')} title="Select & Move (V)">
            <MousePointer size={16} />
            <span>Select</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'pan' ? 'active' : ''}`} onClick={() => setActiveTool('pan')} title="Pan Canvas (H / Space+Drag)">
            <Move size={16} />
            <span>Pan</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'connect' || connectingStartNodeId ? 'active' : ''}`} onClick={() => { setActiveTool('connect'); setConnectingStartNodeId(null); }} title="Connect Nodes (C)">
            <ArrowRight size={16} />
            <span>Connector</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'rectangle' ? 'active' : ''}`} onClick={() => setActiveTool('rectangle')} title="Add Process Box">
            <Square size={16} />
            <span>Box</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'circle' ? 'active' : ''}`} onClick={() => setActiveTool('circle')} title="Add Circle / State">
            <Circle size={16} />
            <span>Circle</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'diamond' ? 'active' : ''}`} onClick={() => setActiveTool('diamond')} title="Add Decision Diamond">
            <Diamond size={16} />
            <span>Diamond</span>
          </button>
          <button className={`tool-select-btn ${activeTool === 'text' ? 'active' : ''}`} onClick={() => setActiveTool('text')} title="Add Text Annotation">
            <Type size={16} />
            <span>Text</span>
          </button>
        </div>

        <div className="ribbon-divider" />

        {/* Selected Element Quick Styling */}
        {selectedNode && (
          <div className="ribbon-styling-group">
            <span className="ribbon-label">Fill:</span>
            <div className="swatch-row">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  className={`color-swatch-dot ${selectedNode.fill === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSelectedNode({ fill: color })}
                />
              ))}
            </div>

            <span className="ribbon-label">Border:</span>
            <div className="swatch-row">
              {STROKE_SWATCHES.map(color => (
                <button
                  key={color}
                  className={`stroke-swatch-dot ${selectedNode.stroke === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSelectedNode({ stroke: color })}
                />
              ))}
            </div>

            <button className="ribbon-btn" onClick={duplicateSelectedNode} title="Duplicate Component">
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button className="ribbon-btn danger" onClick={() => deleteNode(selectedNode.id)} title="Delete Node (Del)">
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}

        {selectedConnection && (
          <div className="ribbon-styling-group">
            <span className="ribbon-label">Line Style:</span>
            <button className={`ribbon-btn ${selectedConnection.style === 'solid' ? 'active' : ''}`} onClick={() => updateSelectedConnection({ style: 'solid' })}>
              Solid
            </button>
            <button className={`ribbon-btn ${selectedConnection.style === 'dashed' ? 'active' : ''}`} onClick={() => updateSelectedConnection({ style: 'dashed' })}>
              Dashed
            </button>

            <span className="ribbon-label">Color:</span>
            <div className="swatch-row">
              {STROKE_SWATCHES.map(color => (
                <button
                  key={color}
                  className={`stroke-swatch-dot ${selectedConnection.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSelectedConnection({ color })}
                />
              ))}
            </div>

            <button className="ribbon-btn danger" onClick={() => deleteConnection(selectedConnection.id)} title="Delete Connector">
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}

        {/* Blueprint Templates Dropdown */}
        <div className="ribbon-templates-wrap">
          <span className="ribbon-label">Templates:</span>
          <div className="template-chips">
            {TEMPLATES.map(t => (
              <button key={t.id} className="tmpl-chip-btn" onClick={() => loadTemplate(t)} title={t.description}>
                <Sparkles size={12} color="#60a5fa" />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ribbon-right-controls">
          <button className={`grid-toggle-btn ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(!showGrid)} title="Toggle Grid Background">
            <Grid size={15} />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area: Sidebar Palette + Infinite Canvas + Inspector Panel */}
      <div className="drawio-workspace-body">
        {/* Left Shape & Stencil Palette */}
        <aside className="drawio-left-palette">
          <div className="palette-search-header">
            <span className="palette-title">Shape Library</span>
          </div>

          <div className="palette-scroll-content">
            {SHAPE_PALETTES.map((section, idx) => (
              <div key={idx} className="palette-category-block">
                <div className="palette-category-title">{section.category}</div>
                <div className="palette-items-grid">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.type}
                        className="palette-shape-card"
                        onClick={() => handleAddFromPalette(item)}
                        title={`Click to add ${item.label}`}
                      >
                        <div className="palette-shape-preview" style={{ borderColor: item.stroke }}>
                          <Icon size={18} color={item.stroke} />
                        </div>
                        <span className="palette-shape-name">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Interactive Infinite Canvas */}
        <main
          className={`drawio-canvas-viewport ${activeTool === 'pan' ? 'pan-tool' : ''} ${isPanning ? 'panning' : ''}`}
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Transformable Canvas Surface */}
          <div
            className={`canvas-transform-layer ${showGrid ? 'grid-bg' : ''}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {/* SVG Layer for Connectors, Arrows, Lines */}
            <svg className="canvas-svg-layer">
              <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                </marker>
                <marker id="arrowhead-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>

              {connections.map(conn => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const { x1, y1, x2, y2, midX, midY } = getConnectionPoints(fromNode, toNode);
                const isSelected = selectedConnectionId === conn.id;

                // Bezier curve
                const dx = x2 - x1;
                const dy = y2 - y1;
                const pathData = Math.abs(dx) > Math.abs(dy)
                  ? `M ${x1} ${y1} C ${x1 + dx / 2} ${y1}, ${x1 + dx / 2} ${y2}, ${x2} ${y2}`
                  : `M ${x1} ${y1} C ${x1} ${y1 + dy / 2}, ${x2} ${y1 + dy / 2}, ${x2} ${y2}`;

                return (
                  <g key={conn.id} className="canvas-connection-group" onClick={(e) => { e.stopPropagation(); setSelectedConnectionId(conn.id); setSelectedNodeId(null); }}>
                    {/* Fat invisible line for easy clicking */}
                    <path
                      d={pathData}
                      stroke="transparent"
                      strokeWidth="16"
                      fill="none"
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Visual Connector Line */}
                    <path
                      d={pathData}
                      stroke={isSelected ? '#38bdf8' : (conn.color || '#60a5fa')}
                      strokeWidth={isSelected ? '3' : '2'}
                      strokeDasharray={conn.style === 'dashed' ? '6,6' : 'none'}
                      fill="none"
                      markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
                      className={isSelected ? 'conn-selected' : ''}
                    />
                    {/* Connection Label if present */}
                    {conn.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-(conn.label.length * 4.5) - 6}
                          y="-10"
                          width={conn.label.length * 9 + 12}
                          height="20"
                          rx="4"
                          fill="#0f172a"
                          stroke="#334155"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          fill="#cbd5e1"
                          fontSize="11"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {conn.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Connecting Line Preview while dragging connection */}
              {connectingStartNodeId && (
                <line
                  x1={(() => {
                    const n = nodes.find(item => item.id === connectingStartNodeId);
                    return n ? n.x + n.width / 2 : 0;
                  })()}
                  y1={(() => {
                    const n = nodes.find(item => item.id === connectingStartNodeId);
                    return n ? n.y + n.height / 2 : 0;
                  })()}
                  x2={nodes.find(item => item.id === connectingStartNodeId)?.x + 100 || 0}
                  y2={nodes.find(item => item.id === connectingStartNodeId)?.y + 50 || 0}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}
            </svg>

            {/* DOM Node Elements on Canvas */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isConnectingStart = connectingStartNodeId === node.id;

              return (
                <div
                  key={node.id}
                  className={`drawio-node-element ${node.shapeType} ${isSelected ? 'selected' : ''} ${isConnectingStart ? 'connecting-source' : ''}`}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                    width: `${node.width}px`,
                    height: `${node.height}px`,
                    backgroundColor: node.fill,
                    borderColor: node.stroke,
                    color: node.textColor || '#ffffff'
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onDoubleClick={() => setEditingNodeId(node.id)}
                >
                  {/* Node Content */}
                  {editingNodeId === node.id ? (
                    <input
                      type="text"
                      className="node-inline-editor"
                      value={node.label}
                      autoFocus
                      onChange={(e) => {
                        const val = e.target.value;
                        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, label: val } : n));
                      }}
                      onBlur={() => { setEditingNodeId(null); pushState(nodes, connections); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { setEditingNodeId(null); pushState(nodes, connections); } }}
                    />
                  ) : (
                    <div className="node-label-wrap" style={{ fontSize: `${node.fontSize || 13}px`, textAlign: node.align || 'center' }}>
                      <span>{node.label}</span>
                    </div>
                  )}

                  {/* Connect Quick Action Dot */}
                  <div
                    className="node-connect-port"
                    title="Drag or click to connect"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setConnectingStartNodeId(node.id);
                      setActiveTool('connect');
                    }}
                  >
                    <Plus size={10} color="#ffffff" />
                  </div>

                  {/* Resize Handles (8 directions) when selected */}
                  {isSelected && (
                    <>
                      <div className="resize-handle n" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'n')} />
                      <div className="resize-handle s" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 's')} />
                      <div className="resize-handle e" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'e')} />
                      <div className="resize-handle w" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'w')} />
                      <div className="resize-handle ne" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'ne')} />
                      <div className="resize-handle nw" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'nw')} />
                      <div className="resize-handle se" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'se')} />
                      <div className="resize-handle sw" onMouseDown={(e) => handleResizeHandleMouseDown(e, node.id, 'sw')} />
                    </>
                  )}
                </div>
              );
            })}

            {/* Empty State Instructions */}
            {nodes.length === 0 && (
              <div className="drawio-empty-state">
                <Sparkles size={40} color="#60a5fa" />
                <h3>Design Canvas is Empty</h3>
                <p>Click shapes from the left library or pick a reference blueprint above to begin diagramming.</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Properties Inspector */}
        <aside className="drawio-right-inspector">
          <div className="inspector-header">
            <Palette size={16} />
            <span>Properties & Styler</span>
          </div>

          {selectedNode ? (
            <div className="inspector-content">
              <div className="inspector-section">
                <label className="inspector-lbl">Label Text</label>
                <input
                  type="text"
                  className="inspector-input"
                  value={selectedNode.label}
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                />
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Geometry (W × H)</label>
                <div className="inspector-row">
                  <input
                    type="number"
                    className="inspector-input num"
                    value={selectedNode.width}
                    onChange={(e) => updateSelectedNode({ width: Math.max(30, parseInt(e.target.value) || 30) })}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    className="inspector-input num"
                    value={selectedNode.height}
                    onChange={(e) => updateSelectedNode({ height: Math.max(30, parseInt(e.target.value) || 30) })}
                  />
                </div>
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Position (X, Y)</label>
                <div className="inspector-row">
                  <input
                    type="number"
                    className="inspector-input num"
                    value={selectedNode.x}
                    onChange={(e) => updateSelectedNode({ x: parseInt(e.target.value) || 0 })}
                  />
                  <span>,</span>
                  <input
                    type="number"
                    className="inspector-input num"
                    value={selectedNode.y}
                    onChange={(e) => updateSelectedNode({ y: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Fill Color</label>
                <div className="inspector-colors-grid">
                  {COLOR_SWATCHES.map(c => (
                    <button
                      key={c}
                      className={`inspector-color-pill ${selectedNode.fill === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => updateSelectedNode({ fill: c })}
                    />
                  ))}
                </div>
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Border Stroke</label>
                <div className="inspector-colors-grid">
                  {STROKE_SWATCHES.map(c => (
                    <button
                      key={c}
                      className={`inspector-color-pill ${selectedNode.stroke === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => updateSelectedNode({ stroke: c })}
                    />
                  ))}
                </div>
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Font Size ({selectedNode.fontSize || 13}px)</label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={selectedNode.fontSize || 13}
                  onChange={(e) => updateSelectedNode({ fontSize: parseInt(e.target.value) })}
                  className="inspector-slider"
                />
              </div>

              <div className="inspector-section actions">
                <button className="inspector-action-btn" onClick={duplicateSelectedNode}>
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button className="inspector-action-btn danger" onClick={() => deleteNode(selectedNode.id)}>
                  <Trash2 size={14} />
                  <span>Delete Element</span>
                </button>
              </div>
            </div>
          ) : selectedConnection ? (
            <div className="inspector-content">
              <div className="inspector-section">
                <label className="inspector-lbl">Connector Label</label>
                <input
                  type="text"
                  className="inspector-input"
                  placeholder="e.g. HTTPS, gRPC, /orders"
                  value={selectedConnection.label || ''}
                  onChange={(e) => updateSelectedConnection({ label: e.target.value })}
                />
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Line Pattern</label>
                <div className="inspector-btn-group">
                  <button
                    className={`inspector-group-btn ${selectedConnection.style === 'solid' ? 'active' : ''}`}
                    onClick={() => updateSelectedConnection({ style: 'solid' })}
                  >
                    Solid
                  </button>
                  <button
                    className={`inspector-group-btn ${selectedConnection.style === 'dashed' ? 'active' : ''}`}
                    onClick={() => updateSelectedConnection({ style: 'dashed' })}
                  >
                    Dashed
                  </button>
                </div>
              </div>

              <div className="inspector-section">
                <label className="inspector-lbl">Connector Color</label>
                <div className="inspector-colors-grid">
                  {STROKE_SWATCHES.map(c => (
                    <button
                      key={c}
                      className={`inspector-color-pill ${selectedConnection.color === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => updateSelectedConnection({ color: c })}
                    />
                  ))}
                </div>
              </div>

              <div className="inspector-section actions">
                <button className="inspector-action-btn danger" onClick={() => deleteConnection(selectedConnection.id)}>
                  <Trash2 size={14} />
                  <span>Delete Connector</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="inspector-empty">
              <MousePointer size={28} color="#64748b" />
              <p>Select any shape or connection arrow on the canvas to inspect and customize properties.</p>
              
              <div className="inspector-tips">
                <strong>Tips & Shortcuts:</strong>
                <ul>
                  <li><kbd>V</kbd> Selection Tool</li>
                  <li><kbd>C</kbd> Connector Tool</li>
                  <li><kbd>H</kbd> / <kbd>Space</kbd> Pan Canvas</li>
                  <li><kbd>Del</kbd> Delete Selection</li>
                  <li><kbd>Ctrl</kbd> + <kbd>Z</kbd> Undo</li>
                  <li>Double-click any box to edit text</li>
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

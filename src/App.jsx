import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react'; // Added zoom icons

function App() {
  const ASPECT_RATIOS = { '16:9': [16, 9], '16:10': [16, 10], '21:9': [21, 9], '32:9': [32, 9] };
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  const [monitors, setMonitors] = useState([
    { id: 'A', enabled: true, diagonal: 27, aspectRatio: '16:9', customRatio: [16, 9], color: COLORS[0], rotation: 0, position: { x: 50, y: 50 } },
    { id: 'B', enabled: true, diagonal: 32, aspectRatio: '16:9', customRatio: [16, 9], color: COLORS[1], rotation: 0, position: { x: 450, y: 100 } },
    { id: 'C', enabled: false, diagonal: 32, aspectRatio: '16:9', customRatio: [16, 9], color: COLORS[2], rotation: 0, position: { x: 100, y: 200 } },
    { id: 'D', enabled: false, diagonal: 34, aspectRatio: '21:9', customRatio: [21, 9], color: COLORS[3], rotation: 0, position: { x: 150, y: 250 } },
  ]);

  const [dragState, setDragState] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  // --- ZOOM 1: Add state for the zoom level ---
  const [zoom, setZoom] = useState(1); // 1 = 100%

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setCanvasSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    resizeObserver.observe(canvasElement);
    return () => resizeObserver.disconnect();
  }, []);

  const calculatedMonitors = useMemo(() => {
    return monitors.map(monitor => {
      if (!monitor.enabled) return { ...monitor, physicalWidth: 0, physicalHeight: 0, area: 0 };
      const ratio = monitor.aspectRatio === 'custom' ? monitor.customRatio : ASPECT_RATIOS[monitor.aspectRatio];
      const aspectValue = ratio[0] / ratio[1];
      const height = Math.sqrt((monitor.diagonal ** 2) / (aspectValue ** 2 + 1));
      const width = height * aspectValue;
      return { ...monitor, physicalWidth: width, physicalHeight: height, area: width * height };
    });
  }, [monitors]);

  const scaleFactor = useMemo(() => {
    const PADDING = 80;
    const enabled = calculatedMonitors.filter(m => m.enabled);
    if (enabled.length === 0 || canvasSize.width === 0) return 10;
    const maxPhysicalWidth = Math.max(...enabled.map(m => m.physicalWidth));
    const maxPhysicalHeight = Math.max(...enabled.map(m => m.physicalHeight));
    const scaleX = (canvasSize.width - PADDING) / maxPhysicalWidth;
    const scaleY = (canvasSize.height - PADDING) / maxPhysicalHeight;
    return Math.min(scaleX, scaleY);
  }, [calculatedMonitors, canvasSize]);

  // Interaction handlers
  const updateMonitor = useCallback((id, updates) => {
    setMonitors(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const handleDragStart = useCallback((e, monitorId) => {
    e.preventDefault();
    const monitor = monitors.find(m => m.id === monitorId);
    if (!monitor) return;
    setMonitors(prev => [...prev.filter(m => m.id !== monitorId), monitor]);
    // --- ZOOM 2: Account for zoom in drag calculations ---
    setDragState({
      monitorId,
      offsetX: e.clientX / zoom - monitor.position.x,
      offsetY: e.clientY / zoom - monitor.position.y,
    });
  }, [monitors, zoom]); // Add zoom as a dependency
  
  const handleDrag = useCallback((e) => {
    if (!dragState) return;
    e.preventDefault();
    updateMonitor(dragState.monitorId, {
      position: {
        x: e.clientX / zoom - dragState.offsetX,
        y: e.clientY / zoom - dragState.offsetY,
      },
    });
  }, [dragState, updateMonitor, zoom]); // Add zoom as a dependency

  const handleDragEnd = useCallback(() => setDragState(null), []);

  const handleRotate = useCallback((e, monitorId) => {
    e.stopPropagation();
    const monitor = monitors.find(m => m.id === monitorId);
    if (monitor) {
      updateMonitor(monitorId, { rotation: (monitor.rotation + 90) % 360 });
    }
  }, [monitors, updateMonitor]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <header className="flex-shrink-0 text-center py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-tight text-white">Screen Scape</h1>
      </header>
      
      <div
        ref={canvasRef}
        className="flex-grow relative bg-gray-800/50 border-b-2 border-dashed border-gray-700 select-none overflow-hidden" // Added overflow-hidden
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* --- ZOOM 3: Add the zoom slider UI --- */}
        <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center space-x-2 z-10">
          <ZoomOut size={20} className="text-gray-400" />
          <input
            type="range"
            min="0.2" // 20% zoom
            max="3"   // 300% zoom
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-32 accent-blue-500"
          />
          <ZoomIn size={20} className="text-gray-400" />
        </div>

        <svg width="100%" height="100%">
          {/* --- ZOOM 4: Apply zoom transform to a master group --- */}
          <g transform={`scale(${zoom})`}>
            {calculatedMonitors.map((monitor) => {
              if (!monitor.enabled) return null;
              
              // --- ZOOM 5: Use the base scaleFactor, not the combined one ---
              const scaledWidth = monitor.physicalWidth * scaleFactor;
              const scaledHeight = monitor.physicalHeight * scaleFactor;

              return (
                <g
                  key={monitor.id}
                  className="cursor-move group"
                  onMouseDown={(e) => handleDragStart(e, monitor.id)}
                  transform={`translate(${monitor.position.x}, ${monitor.position.y})`}
                >
                  <g transform={`rotate(${monitor.rotation}, ${scaledWidth / 2}, ${scaledHeight / 2})`}>
                    <rect width={scaledWidth} height={scaledHeight} fill={`${monitor.color}40`} stroke={monitor.color} strokeWidth="2" rx="4" />
                    
                    {/* --- TEXT 1: Apply counter-rotation to the text element --- */}
                    <text
                      x={scaledWidth / 2}
                      y={scaledHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      className="pointer-events-none"
                      // This transform is relative to the text's own center
                      transform={`rotate(${-monitor.rotation}, ${scaledWidth / 2}, ${scaledHeight / 2})`}
                    >
                      {monitor.id}: {monitor.diagonal}"
                    </text>
                  </g>
                  
                  <foreignObject x={scaledWidth - 28} y={-2} width="30" height="30" className="cursor-pointer transition-opacity opacity-0 group-hover:opacity-100">
                    <button title="Rotate Monitor" onClick={(e) => handleRotate(e, monitor.id)} className="p-1 rounded-full bg-gray-900/50 hover:bg-gray-700 text-white">
                      <RotateCw size={16} />
                    </button>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <footer className="flex-shrink-0 p-4 bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {calculatedMonitors.map(monitor => (
            <div key={monitor.id} className={`bg-gray-800 rounded-lg p-3 border-l-4 transition-opacity duration-300 ${!monitor.enabled && 'opacity-50'}`} style={{ borderLeftColor: monitor.color }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">Monitor {monitor.id}</h4>
                <input type="checkbox" className="toggle toggle-sm" checked={monitor.enabled} onChange={(e) => updateMonitor(monitor.id, { enabled: e.target.checked })} style={{'--tgl-bg': monitor.color, color:'white'}} />
              </div>
              <div className={`space-y-3 ${!monitor.enabled && 'pointer-events-none'}`}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="block mb-1 text-gray-400">Diagonal (in)</label>
                    <input type="number" value={monitor.diagonal} onChange={(e) => updateMonitor(monitor.id, { diagonal: parseFloat(e.target.value) || 0 })} className="w-full bg-gray-700 border-gray-600 rounded p-1.5" />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-400">Aspect Ratio</label>
                    <select value={monitor.aspectRatio} onChange={(e) => updateMonitor(monitor.id, { aspectRatio: e.target.value })} className="w-full bg-gray-700 border-gray-600 rounded p-1.5">
                      <option>16:9</option><option>16:10</option><option>21:9</option><option>32:9</option><option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                {monitor.enabled && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-700/50">
                    <div>
                      <div className="text-gray-400">Dimensions</div>
                      <div className="font-mono">{monitor.physicalWidth.toFixed(1)}" × {monitor.physicalHeight.toFixed(1)}"</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Screen Area</div>
                      <div className="font-mono">{monitor.area.toFixed(0)} in²</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
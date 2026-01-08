'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { FaEye, FaEyeSlash, FaBug } from 'react-icons/fa';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

interface Position {
  dimension: string;
  location: Coordinate;
}

interface Car {
  id: number;
  leading: Position;
  trailing: Position;
}

interface Train {
  id: string;
  name: string;
  owner: string | null;
  cars: Car[];
  backwards: boolean;
  stopped: boolean;
}

interface TrackSegment {
  dimension: string;
  path: Coordinate[];
}

// Station from API
interface APIStation {
  id: string;
  name: string;
  dimension: string;
  location: Coordinate;
  angle: number;
  assembling: boolean;
}

// Network response includes both tracks and stations
interface NetworkData {
  tracks: TrackSegment[];
  stations: APIStation[];
}

// Configuration types for styling
export interface StationConfig {
  id: string;
  name: string; // Used for matching
  lineId: string;
}

export interface TrainLine {
  id: string;
  name: string;
  color: string;
  stations: string[]; // Station names or IDs to match
}

export interface Waypoint {
  id: string;
  name: string;
  x: number;
  z: number;
  icon?: 'city' | 'landmark' | 'poi';
  color?: string;
}

export interface River {
  id: string;
  name: string;
  path: { x: number; z: number }[];
  width?: number;
}

export interface TrainConfig {
  name: string;
  lineId: string;
}

export interface TransitMapConfig {
  stations: StationConfig[]; // Config for matching stations to lines
  lines: TrainLine[];
  waypoints: Waypoint[];
  rivers?: River[];
  refreshInterval?: number;
  dimension?: string;
  stationBlacklist?: string[];
  trains?: TrainConfig[];
}

interface TransitMapProps {
  config: TransitMapConfig;
  className?: string;
}

// Merged station - API station with optional line color from config
interface MergedStation {
  id: string;
  name: string;
  x: number;
  z: number;
  angle: number;
  assembling: boolean;
  lineColor: string | null;
  lineName: string | null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function worldToScreen(
  worldX: number,
  worldZ: number,
  pan: { x: number; y: number },
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const x = (worldX * zoom) + pan.x + canvasWidth / 2;
  const y = (worldZ * zoom) + pan.y + canvasHeight / 2;
  return { x, y };
}

function screenToWorld(
  screenX: number,
  screenY: number,
  pan: { x: number; y: number },
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; z: number } {
  const x = (screenX - pan.x - canvasWidth / 2) / zoom;
  const z = (screenY - pan.y - canvasHeight / 2) / zoom;
  return { x, z };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TransitMap({ config, className = '' }: TransitMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // View state
  const [zoom, setZoom] = useState(0.08);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hasAutoCentered, setHasAutoCentered] = useState(false);
  
  // Data state
  const [trains, setTrains] = useState<Train[]>([]);
  const [tracks, setTracks] = useState<TrackSegment[]>([]);
  const [apiStations, setApiStations] = useState<APIStation[]>([]);
  
  // UI state
  const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, z: 0 });
  const [hoveredItem, setHoveredItem] = useState<{ type: string; name: string; details?: string; x: number; y: number } | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showUnnamedStations, setShowUnnamedStations] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  
  const dimension = config.dimension || 'minecraft:overworld';
  const refreshInterval = config.refreshInterval || 3000;

  // ============================================================================
  // MERGE API STATIONS WITH CONFIG FOR COLORS
  // ============================================================================

  const mergedStations = useMemo(() => {
    const blacklist = config.stationBlacklist || [];

    return apiStations
      .filter(station => station.dimension === dimension)
      .filter(station => {
        // Check if station name matches any blacklist entry (case-insensitive, partial match)
        const stationNameLower = station.name.toLowerCase();
        return !blacklist.some(bl => stationNameLower.includes(bl.toLowerCase()) || bl.toLowerCase().includes(stationNameLower));
      })
      .map(station => {
        // Try to find a matching config station by name (case-insensitive, partial match)
        const stationNameLower = station.name.toLowerCase();
        
        let lineColor: string | null = null;
        let lineName: string | null = null;

        // Check each line's stations for a match
        for (const line of config.lines) {
          const matchedStation = line.stations.find(configStationName => {
            const configNameLower = configStationName.toLowerCase();
            // Match if names contain each other or are equal
            return stationNameLower.includes(configNameLower) || 
                   configNameLower.includes(stationNameLower) ||
                   stationNameLower === configNameLower;
          });
          
          if (matchedStation) {
            lineColor = line.color;
            lineName = line.name;
            break;
          }
        }

        // Also check config.stations for direct matches
        if (!lineColor) {
          const configStation = config.stations.find(cs => {
            const csNameLower = cs.name.toLowerCase();
            return stationNameLower.includes(csNameLower) || 
                   csNameLower.includes(stationNameLower);
          });
          
          if (configStation) {
            const line = config.lines.find(l => l.id === configStation.lineId);
            if (line) {
              lineColor = line.color;
              lineName = line.name;
            }
          }
        }

        return {
          id: station.id,
          name: station.name,
          x: station.location.x,
          z: station.location.z,
          angle: station.angle,
          assembling: station.assembling,
          lineColor,
          lineName,
        };
      });
  }, [apiStations, config.lines, config.stations, config.stationBlacklist, dimension]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchData = useCallback(async () => {
    try {
      const [trainsRes, networkRes] = await Promise.all([
        fetch('/api/crn/trains'),
        fetch('/api/crn/network'),
      ]);

      if (!trainsRes.ok || !networkRes.ok) {
        console.error('One or more API calls failed');
        return;
      }

      const [trainsData, networkData]: [{ trains: Train[] }, NetworkData] = await Promise.all([
        trainsRes.json(),
        networkRes.json(),
      ]);

      setTrains(trainsData.trains || []);
      setTracks(networkData.tracks || []);
      setApiStations(networkData.stations || []);
    } catch (error) {
      console.error('Failed to fetch transit data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  // ============================================================================
  // AUTO-CENTER ON DATA
  // ============================================================================

  useEffect(() => {
    if (hasAutoCentered || tracks.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    tracks
      .filter(t => t.dimension === dimension)
      .forEach(track => {
        track.path.forEach(point => {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minZ = Math.min(minZ, point.z);
          maxZ = Math.max(maxZ, point.z);
        });
      });

    if (minX === Infinity) return;

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const dataWidth = maxX - minX;
    const dataHeight = maxZ - minZ;
    const rect = canvas.getBoundingClientRect();
    const padding = 0.8;
    const zoomX = (rect.width * padding) / dataWidth;
    const zoomZ = (rect.height * padding) / dataHeight;
    const newZoom = Math.min(zoomX, zoomZ, 0.5);

    setPan({ x: -centerX * newZoom, y: -centerZ * newZoom });
    setZoom(newZoom);
    setHasAutoCentered(true);
  }, [tracks, dimension, hasAutoCentered]);

  // ============================================================================
  // CANVAS RENDERING
  // ============================================================================

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas - darker background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height, pan, zoom);

    // Draw rivers
    if (showRivers && config.rivers) {
      config.rivers.forEach(river => drawRiver(ctx, river, pan, zoom, width, height));
    }

    // Draw tracks
    drawTracks(ctx, tracks, dimension, pan, zoom, width, height);

    // Draw waypoints
    if (showWaypoints) {
      config.waypoints.forEach(waypoint => {
        drawWaypoint(ctx, waypoint, pan, zoom, width, height);
      });
    }

    // Draw stations
    mergedStations.forEach(station => {
      // Skip "Track Station" generic names if toggle is off
      if (!showUnnamedStations && station.name === 'Track Station') return;
      drawStation(ctx, station, pan, zoom, width, height);
    });

    // Draw trains
    trains
      .filter(train => train.cars.some(car => car.leading.dimension === dimension))
      .forEach(train => {
        drawTrain(ctx, train, config.trains, config.lines, pan, zoom, width, height);
      });

  }, [pan, zoom, trains, tracks, mergedStations, config, dimension, showUnnamedStations, showWaypoints, showRivers]);

  // ============================================================================
  // DRAWING FUNCTIONS
  // ============================================================================

  function drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pan: { x: number; y: number },
    zoom: number
  ) {
    const gridSize = 256;
    const scaledGrid = gridSize * zoom;
    
    if (scaledGrid < 8) return;

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;

    const offsetX = (pan.x + width / 2) % scaledGrid;
    const offsetY = (pan.y + height / 2) % scaledGrid;

    ctx.beginPath();
    for (let x = offsetX; x < width; x += scaledGrid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += scaledGrid) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Larger grid (1024 blocks)
    const regionSize = 1024;
    const scaledRegion = regionSize * zoom;
    if (scaledRegion > 40) {
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      
      const regionOffsetX = (pan.x + width / 2) % scaledRegion;
      const regionOffsetY = (pan.y + height / 2) % scaledRegion;

      ctx.beginPath();
      for (let x = regionOffsetX; x < width; x += scaledRegion) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = regionOffsetY; y < height; y += scaledRegion) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
  }

  function drawRiver(
    ctx: CanvasRenderingContext2D,
    river: River,
    pan: { x: number; y: number },
    zoom: number,
    width: number,
    height: number
  ) {
    if (river.path.length < 2) return;

    const riverWidth = (river.width || 30) * zoom;
    
    ctx.strokeStyle = '#0c2d4d';
    ctx.lineWidth = riverWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const start = worldToScreen(river.path[0].x, river.path[0].z, pan, zoom, width, height);
    ctx.moveTo(start.x, start.y);
    
    for (let i = 1; i < river.path.length; i++) {
      const point = worldToScreen(river.path[i].x, river.path[i].z, pan, zoom, width, height);
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    // Inner lighter water
    ctx.strokeStyle = '#1e4976';
    ctx.lineWidth = riverWidth * 0.5;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i < river.path.length; i++) {
      const point = worldToScreen(river.path[i].x, river.path[i].z, pan, zoom, width, height);
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }
  

  function drawTracks(
    ctx: CanvasRenderingContext2D,
    tracks: TrackSegment[],
    dimension: string,
    pan: { x: number; y: number },
    zoom: number,
    width: number,
    height: number
  ) {
    // Draw track bed
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = Math.max(5, 10 * zoom);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    tracks
      .filter(track => track.dimension === dimension)
      .forEach(track => {
        if (track.path.length < 2) return;
        
        ctx.beginPath();
        const start = worldToScreen(track.path[0].x, track.path[0].z, pan, zoom, width, height);
        ctx.moveTo(start.x, start.y);
        
        for (let i = 1; i < track.path.length; i++) {
          const point = worldToScreen(track.path[i].x, track.path[i].z, pan, zoom, width, height);
          ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      });

    // Draw rails (amber)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = Math.max(1, 2 * zoom);

    tracks
      .filter(track => track.dimension === dimension)
      .forEach(track => {
        if (track.path.length < 2) return;
        
        ctx.beginPath();
        const start = worldToScreen(track.path[0].x, track.path[0].z, pan, zoom, width, height);
        ctx.moveTo(start.x, start.y);
        
        for (let i = 1; i < track.path.length; i++) {
          const point = worldToScreen(track.path[i].x, track.path[i].z, pan, zoom, width, height);
          ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      });
  }

  function drawStation(
    ctx: CanvasRenderingContext2D,
    station: MergedStation,
    pan: { x: number; y: number },
    zoom: number,
    width: number,
    height: number
  ) {
    const pos = worldToScreen(station.x, station.z, pan, zoom, width, height);
    const radius = Math.max(4, 8 + (zoom / 40));

    // Station color from line or default
    const baseColor = station.lineColor || '#71717a'; // zinc-500 if no line
    
    // Outer dark ring
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    // White ring
    ctx.fillStyle = '#fafafa';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius + 2, 0, Math.PI * 2);
    ctx.fill();

    // Colored center
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Assembling indicator
    if (station.assembling) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(pos.x + radius, pos.y - radius, 5, 0, Math.PI * 2);
      ctx.fill();
    }

  }

  function drawWaypoint(
    ctx: CanvasRenderingContext2D,
    waypoint: Waypoint,
    pan: { x: number; y: number },
    zoom: number,
    width: number,
    height: number
  ) {
    const pos = worldToScreen(waypoint.x, waypoint.z, pan, zoom, width, height);
    const size = Math.max(12, 20 * zoom);
    const color = waypoint.color || '#f59e0b';

    ctx.fillStyle = color;
    
    if (waypoint.icon === 'city') {
      // City skyline
      ctx.fillRect(pos.x - size * 0.4, pos.y - size * 0.2, size * 0.25, size * 0.7);
      ctx.fillRect(pos.x - size * 0.1, pos.y - size * 0.6, size * 0.35, size * 1.1);
      ctx.fillRect(pos.x + size * 0.2, pos.y - size * 0.1, size * 0.25, size * 0.6);
    } else if (waypoint.icon === 'landmark') {
      // Diamond
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - size);
      ctx.lineTo(pos.x + size * 0.6, pos.y);
      ctx.lineTo(pos.x, pos.y + size);
      ctx.lineTo(pos.x - size * 0.6, pos.y);
      ctx.closePath();
      ctx.fill();
    } else {
      // POI dot
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    if (zoom > 0.03) {
      ctx.font = `bold ${Math.max(11, 14 * zoom)}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(waypoint.name, pos.x, pos.y + size + 6);
    }
  }

  function getTrainColor(
    trainName: string,
    trainConfigs: TrainConfig[] | undefined,
    lines: TrainLine[]
  ): string {
    const defaultColor = '#71717a'; // zinc-500 gray hex
    
    if (!trainConfigs) return defaultColor;
    
    const trainNameLower = trainName.toLowerCase();
    
    // Find matching train config
    const matchedConfig = trainConfigs.find(tc => {
      const configNameLower = tc.name.toLowerCase();
      return trainNameLower.includes(configNameLower) || configNameLower.includes(trainNameLower);
    });
    
    if (!matchedConfig) return defaultColor;
    
    // Find the line color
    const line = lines.find(l => l.id === matchedConfig.lineId);
    return line?.color || defaultColor;
  }

  function drawTrain(
    ctx: CanvasRenderingContext2D,
    train: Train,
    trainConfigs: TrainConfig[] | undefined,
    lines: TrainLine[],
    pan: { x: number; y: number },
    zoom: number,
    width: number,
    height: number
  ) {
    const cars = train.cars.filter(car => car.leading.dimension === dimension);
    if (cars.length === 0) return;

    const lineColor = getTrainColor(train.name, trainConfigs, lines);
    //const carColor = train.stopped ? '#71717a' : lineColor;
    const carColor = train.stopped ? lineColor : lineColor;

    cars.forEach((car, index) => {
      const leading = worldToScreen(car.leading.location.x, car.leading.location.z, pan, zoom, width, height);
      const trailing = worldToScreen(car.trailing.location.x, car.trailing.location.z, pan, zoom, width, height);

      const BASE_CAR_WIDTH = 10;
      const BASE_CAR_LENGTH = 20;
      const BASE_CAR_SPACING = 10;

      const dx = leading.x - trailing.x;
      const dy = leading.y - trailing.y;
      const angle = Math.atan2(dy, dx);
      const length = Math.sqrt(dx * dx + dy * dy);
      
      const carWidth = BASE_CAR_WIDTH * zoom;
      const carLength = (BASE_CAR_LENGTH * zoom)

      ctx.save();
      ctx.translate(trailing.x, trailing.y);
      ctx.rotate(angle);

      // Removed if so all cars are drawn instead of just the lead
      // Changed so no cars are pointed
      // TODO: Remove first car logic or improve it
      ctx.fillStyle = index === 0 ? carColor : carColor;
      ctx.fillRect(0, -carWidth / 2, carLength, carWidth);
      ctx.strokeStyle = index === 0 ? '#ffffff' : '#ffffff';
      ctx.lineWidth = index === 0 ? 2 : 2;
      ctx.strokeRect(0, -carWidth / 2, carLength, carWidth);


      ctx.restore();
    });
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ ...pan });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldPos = screenToWorld(mouseX, mouseY, pan, zoom, rect.width, rect.height);
    setMouseWorldPos({ x: Math.round(worldPos.x), z: Math.round(worldPos.z) });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan({ x: panStart.x + dx, y: panStart.y + dy });
    } else {
      checkHover(mouseX, mouseY, rect.width, rect.height);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldBefore = screenToWorld(mouseX, mouseY, pan, zoom, rect.width, rect.height);

    const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
    const newZoom = Math.max(0.003, Math.min(3, zoom * zoomFactor));
    setZoom(newZoom);

    const screenAfter = worldToScreen(worldBefore.x, worldBefore.z, pan, newZoom, rect.width, rect.height);
    setPan({ x: pan.x + (mouseX - screenAfter.x), y: pan.y + (mouseY - screenAfter.y) });
  };

  const checkHover = (mouseX: number, mouseY: number, width: number, height: number) => {
    const threshold = 25;
    let found = false;

    // Check trains first
    for (const train of trains) {
      const car = train.cars[0];
      if (!car || car.leading.dimension !== dimension) continue;
      const pos = worldToScreen(car.leading.location.x, car.leading.location.z, pan, zoom, width, height);
      if (Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < threshold * 2) {
        const status = train.stopped ? '🔴 Stopped' : '🟢 Moving';
        setHoveredItem({ 
          type: 'Train', 
          name: train.name,
          details: `${train.cars.length} car${train.cars.length > 1 ? 's' : ''} • ${status}`,
          x: mouseX, 
          y: mouseY 
        });
        found = true;
        break;
      }
    }

    // Check stations
    if (!found) {
      for (const station of mergedStations) {
        const pos = worldToScreen(station.x, station.z, pan, zoom, width, height);
        if (Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < threshold) {
          setHoveredItem({ 
            type: 'Station', 
            name: station.name,
            details: station.lineName || undefined,
            x: mouseX, 
            y: mouseY 
          });
          found = true;
          break;
        }
      }
    }

    // Check waypoints
    if (!found) {
      for (const waypoint of config.waypoints) {
        const pos = worldToScreen(waypoint.x, waypoint.z, pan, zoom, width, height);
        if (Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2) < threshold) {
          setHoveredItem({ type: 'Location', name: waypoint.name, x: mouseX, y: mouseY });
          found = true;
          break;
        }
      }
    }

    if (!found) setHoveredItem(null);
  };

  // ============================================================================
  // CANVAS SIZING
  // ============================================================================

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { render(); }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldBefore = screenToWorld(mouseX, mouseY, pan, zoom, rect.width, rect.height);

      const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
      const newZoom = Math.max(0.003, Math.min(3, zoom * zoomFactor));
      setZoom(newZoom);

      const screenAfter = worldToScreen(worldBefore.x, worldBefore.z, pan, newZoom, rect.width, rect.height);
      setPan({ x: pan.x + (mouseX - screenAfter.x), y: pan.y + (mouseY - screenAfter.y) });
    };

    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheelEvent);
  }, [pan, zoom]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const namedStationCount = mergedStations.filter(s => s.name !== 'Track Station').length;
  const coloredStationCount = mergedStations.filter(s => s.lineColor).length;

  return (
    <div className={`relative bg-zinc-950 ${className}`} ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="absolute pointer-events-none bg-zinc-900 border border-zinc-700 px-4 py-2.5 rounded-lg shadow-2xl z-10"
          style={{
            left: Math.min(hoveredItem.x + 15, (containerRef.current?.clientWidth || 400) - 250),
            top: hoveredItem.y - 10,
          }}
        >
          <div className="text-amber-500 text-[10px] uppercase tracking-widest font-semibold">{hoveredItem.type}</div>
          <div className="text-white text-sm font-bold">{hoveredItem.name}</div>
          {hoveredItem.details && (
            <div className="text-zinc-400 text-xs mt-0.5">{hoveredItem.details}</div>
          )}
        </div>
      )}

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 bg-zinc-900/95 border border-zinc-800 px-4 py-2.5 rounded-lg font-mono text-sm backdrop-blur-sm">
        <span className="text-zinc-500">X </span>
        <span className="text-amber-500 font-bold">{mouseWorldPos.x}</span>
        <span className="text-zinc-700 mx-3">│</span>
        <span className="text-zinc-500">Z </span>
        <span className="text-amber-500 font-bold">{mouseWorldPos.z}</span>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="absolute top-4 left-4 bg-zinc-900/95 border border-zinc-800 px-4 py-3 rounded-lg max-w-xs backdrop-blur-sm">
          <h4 className="text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-3">Network Data</h4>
          <div className="text-xs space-y-1.5 mb-3">
            <div className="flex justify-between">
              <span className="text-zinc-500">Track Segments</span>
              <span className="text-white font-medium">{tracks.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Stations (API)</span>
              <span className="text-white font-medium">{apiStations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Named Stations</span>
              <span className="text-white font-medium">{namedStationCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">With Line Color</span>
              <span className="text-green-400 font-medium">{coloredStationCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Active Trains</span>
              <span className="text-white font-medium">{trains.length}</span>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-3 space-y-2">
            <label className="flex items-center gap-2.5 text-xs cursor-pointer group">
              <input
                type="checkbox"
                checked={showUnnamedStations}
                onChange={(e) => setShowUnnamedStations(e.target.checked)}
                className="accent-amber-500 w-3.5 h-3.5"
              />
              <span className="text-zinc-400 group-hover:text-zinc-200">Show unnamed stations</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs cursor-pointer group">
              <input
                type="checkbox"
                checked={showWaypoints}
                onChange={(e) => setShowWaypoints(e.target.checked)}
                className="accent-amber-500 w-3.5 h-3.5"
              />
              <span className="text-zinc-400 group-hover:text-zinc-200">Show waypoints</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs cursor-pointer group">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="accent-amber-500 w-3.5 h-3.5"
              />
              <span className="text-zinc-400 group-hover:text-zinc-200">Show rivers</span>
            </label>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`p-2.5 rounded-lg border transition-all ${
            showDebug 
              ? 'bg-amber-500 border-amber-500 text-zinc-900' 
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-500 hover:border-amber-500/50 hover:text-amber-500'
          }`}
          title="Toggle settings"
        >
          <FaBug size={14} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-zinc-900/95 border border-zinc-800 px-4 py-2.5 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-zinc-400">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-zinc-400">Stopped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-1 bg-amber-600 rounded-full" />
            <span className="text-zinc-400">Track</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-1">
        <button
          onClick={() => setZoom(z => Math.min(3, z * 1.4))}
          className="w-9 h-9 bg-zinc-900/95 border border-zinc-800 hover:border-amber-500/50 rounded-lg text-zinc-500 hover:text-amber-500 transition-all text-lg font-bold"
        >
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.003, z / 1.4))}
          className="w-9 h-9 bg-zinc-900/95 border border-zinc-800 hover:border-amber-500/50 rounded-lg text-zinc-500 hover:text-amber-500 transition-all text-lg font-bold"
        >
          −
        </button>
        <button
          onClick={() => setHasAutoCentered(false)}
          className="w-9 h-9 bg-zinc-900/95 border border-zinc-800 hover:border-amber-500/50 rounded-lg text-zinc-500 hover:text-amber-500 transition-all text-sm"
          title="Re-center on tracks"
        >
          ⌂
        </button>
      </div>
    </div>
  );
}

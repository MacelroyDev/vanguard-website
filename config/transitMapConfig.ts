import { TransitMapConfig } from '@/components/transitMap';

export const transitMapConfig: TransitMapConfig = {
  stationBlacklist: ['Track Station', 'Forklift', 'Fix', 'Turn Around', "Runner Station", "Slow", "Fast"],
  trains: [
    { name: 'Shinkansen', lineId: 'shinkansen-line' },
    { name: 'Hankyu', lineId: 'hankyu-line' },
    { name: 'Flaggleton', lineId: 'progress-line' },
    { name: 'Wasserbahn', lineId: 'wasserstadt-line' },
    { name: 'Gondola 1', lineId: 'snowy-line' },
    { name: 'Gondola 2', lineId: 'snowy-line' },
    { name: 'William Whale', lineId: 'plr-line' },
  ],
  lines: [
    {
      id: 'hankyu-line',
      name: 'Hankyu Line',
      color: '#22c55e',
      stations: ['Highland Station B North','Highland Station B South', 'Cybersac Station B', 'Gabe Station', 'Gentriville Station'],
    },
    {
      id: 'progress-line',
      name: 'Progress Line',
      color: '#EAB308',
      stations: ['FL'],
    },
    {
      id: 'wasserstadt-line',
      name: 'Wasserstadt Line',
      color: '#38b2ac',
      stations: ['Highland Station WB','WB NWS Station'],
    },
    {
      id: 'snowy-line',
      name: 'Snowy Line',
      color: '#ffffff',
      stations: ['Snowy Top', 'Snowy Bottom'],
    },
    {
      id: 'plr-line',
      name: 'PLR Water Shuttle',
      color: '#fbb6ce',
      stations: ['Ruiner Fishing', 'Port Village', 'Ruinopolis', 'Progress Marina WA'],
    },
    {
      id: 'shinkansen-line', 
      name: 'Shinkansen Line',
      color: '#3b82f6',
      stations: ['Spawn Station', 'Drill Station', 'Snowy Station', 'Highland Station North', 'Highland Station South', 'Cybersac Station A','Vanguard City Station'],
    },
  ],
  stations: [], // Can be empty now, or use for additional matching
  waypoints: [
    { id: 'vanguard-city', name: 'Vanguard City', x: -148, z: -430, icon: 'city', color: '#f59e0b' },
    { id: 'magicannot', name: 'Magicannot', x: 6145, z: 4155, icon: 'city', color: '#ef4444' },
    { id: 'new-wasserstadt', name: 'New Wasserstadt', x: 4217, z: -1571, icon: 'city', color: '#14b8a6' },
    { id: 'progress', name: 'Progress', x: 3085, z: -1323, icon: 'city', color: '#22c55e' },
    { id: 'gentriville', name: 'Gentriville', x: 3555, z: -3100, icon: 'city', color: '#3b82f6' },
    { id: 'spawn', name: 'Spawn', x: -30, z: -30, icon: 'poi', color: '#71717a' },
    { id: 'vanguard-drill', name: 'Vanguard Drill Site', x: 1267, z: -194, icon: 'landmark', color: '#f59e0b' },
  ],
  rivers: [],
};
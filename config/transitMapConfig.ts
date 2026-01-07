import { TransitMapConfig } from '@/components/transitMap';

export const transitMapConfig: TransitMapConfig = {
  stationBlacklist: ['Track Station', 'Forklift', 'Fix', 'Turn Around', "Runner Station", "Slow", "Fast"],
  trains: [
    { name: 'Shinkansen', lineId: 'shinkansen-line' },
    { name: 'Hankyu', lineId: 'hankyu-line' },
    { name: 'Flaggleton', lineId: 'progress-line' },
    { name: 'Wasserbahn', lineId: 'wasserstadt-line' },
    { name: 'Gondola A', lineId: 'snowy-line' },
    { name: 'Gondola B', lineId: 'snowy-line' },
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
  waypoints: [],
  rivers: [],
};
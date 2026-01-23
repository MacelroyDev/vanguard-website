'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FaTimes, FaPaintBrush, FaEyeSlash, FaEye, FaSave, FaDownload, FaUpload, FaTrash, FaCheck, FaSearch, FaTags } from 'react-icons/fa';
import { useTrackStyles, TrackStyle, generateTrackId } from './TrackStyleContext';

// ============================================================================
// TYPES
// ============================================================================

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

interface TrackSegment {
  dimension: string;
  path: Coordinate[];
}

interface TrainLine {
  id: string;
  name: string;
  color: string;
}

interface TransitMapAdminProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TrackSegment[];
  lines: TrainLine[];
  dimension: string;
  selectedTrackIds: string[];
  onTrackSelect: (trackId: string, multiSelect: boolean) => void;
  onClearSelection: () => void;
}

// ============================================================================
// PRESET COLORS
// ============================================================================

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#71717a', '#ffffff',
];

// ============================================================================
// ADMIN PANEL COMPONENT
// ============================================================================

export default function TransitMapAdmin({
  isOpen,
  onClose,
  tracks,
  lines,
  dimension,
  selectedTrackIds,
  onTrackSelect,
  onClearSelection,
}: TransitMapAdminProps) {
  const {
    styles,
    error,
    setTrackColor,
    setTrackHidden,
    setTrackLine,
    setTrackLabel,
    removeTrackStyle,
    clearAllStyles,
    hideMultipleTracks,
    colorMultipleTracks,
    saveStyles,
    exportStyles,
    importStyles,
  } = useTrackStyles();

  const [activeTab, setActiveTab] = useState<'selection' | 'all' | 'export'>('selection');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('#d97706');
  const [customColor, setCustomColor] = useState('#d97706');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [bulkLabel, setBulkLabel] = useState('');

  // Filter tracks for current dimension and add IDs
  const tracksWithIds = useMemo(() => {
    return tracks
      .filter(t => t.dimension === dimension)
      .map(track => ({
        ...track,
        id: generateTrackId(track.path),
      }));
  }, [tracks, dimension]);

  // Get styled tracks
  const styledTracks = useMemo(() => {
    return tracksWithIds.filter(t => styles[t.id]);
  }, [tracksWithIds, styles]);

  // Filter for search
  const filteredTracks = useMemo(() => {
    if (!searchQuery) return styledTracks;
    const query = searchQuery.toLowerCase();
    return styledTracks.filter(t => {
      const style = styles[t.id];
      return style?.label?.toLowerCase().includes(query) ||
             style?.lineId?.toLowerCase().includes(query) ||
             t.id.toLowerCase().includes(query);
    });
  }, [styledTracks, styles, searchQuery]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    const success = await saveStyles();
    setSaveStatus(success ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [saveStyles]);

  const handleExport = useCallback(() => {
    const json = exportStyles();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `track-styles-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportStyles]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      if (importStyles(text)) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    };
    input.click();
  }, [importStyles]);

  const applyColorToSelection = useCallback(() => {
    colorMultipleTracks(selectedTrackIds, selectedColor);
  }, [selectedTrackIds, selectedColor, colorMultipleTracks]);

  const hideSelection = useCallback(() => {
    hideMultipleTracks(selectedTrackIds);
  }, [selectedTrackIds, hideMultipleTracks]);

  const showSelection = useCallback(() => {
    selectedTrackIds.forEach(id => setTrackHidden(id, false));
  }, [selectedTrackIds, setTrackHidden]);

  const clearSelectionStyles = useCallback(() => {
    selectedTrackIds.forEach(id => removeTrackStyle(id));
  }, [selectedTrackIds, removeTrackStyle]);

  const applyLineToSelection = useCallback((lineId: string) => {
    const line = lines.find(l => l.id === lineId);
    selectedTrackIds.forEach(id => {
      setTrackLine(id, lineId);
      if (line) setTrackColor(id, line.color);
    });
  }, [selectedTrackIds, lines, setTrackLine, setTrackColor]);

  const applyLabelToSelection = useCallback(() => {
    if (!bulkLabel.trim()) return;
    selectedTrackIds.forEach(id => setTrackLabel(id, bulkLabel.trim()));
    setBulkLabel('');
  }, [selectedTrackIds, bulkLabel, setTrackLabel]);

  if (!isOpen) return null;

  const selectionCount = selectedTrackIds.length;
  const styledCount = Object.keys(styles).length;
  const hiddenCount = Object.values(styles).filter(s => s.hidden).length;

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-zinc-900/98 border-l border-zinc-800 flex flex-col z-50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-amber-500 font-bold text-sm uppercase tracking-wider">Track Admin</h2>
        <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white rounded transition-colors">
          <FaTimes size={14} />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-zinc-950/50 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Selected:</span>
          <span className="text-amber-500 font-bold">{selectionCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Styled:</span>
          <span className="text-blue-400 font-bold">{styledCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Hidden:</span>
          <span className="text-zinc-400 font-bold">{hiddenCount}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {(['selection', 'all', 'export'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'text-amber-500 border-b-2 border-amber-500 bg-zinc-800/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Selection Tab */}
        {activeTab === 'selection' && (
          <div className="space-y-4">
            {selectionCount === 0 ? (
              <div className="text-center py-8">
                <div className="text-zinc-600 text-sm mb-2">No tracks selected</div>
                <div className="text-zinc-700 text-xs">Hold Shift and click on tracks to select them</div>
              </div>
            ) : (
              <>
                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Color</label>
                  <div className="grid grid-cols-9 gap-1.5">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:border-zinc-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => { setCustomColor(e.target.value); setSelectedColor(e.target.value); }}
                      className="w-10 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 text-sm text-white font-mono"
                      placeholder="#hex"
                    />
                    <button
                      onClick={applyColorToSelection}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium flex items-center gap-1.5"
                    >
                      <FaPaintBrush size={10} /> Apply
                    </button>
                  </div>
                </div>

                {/* Line Assignment */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Assign to Line</label>
                  <div className="flex flex-wrap gap-1.5">
                    {lines.map(line => (
                      <button
                        key={line.id}
                        onClick={() => applyLineToSelection(line.id)}
                        className="px-2.5 py-1.5 rounded text-xs font-medium text-white hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: line.color }}
                      >
                        {line.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bulk Label */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Label</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bulkLabel}
                      onChange={(e) => setBulkLabel(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white"
                      placeholder="Enter label..."
                    />
                    <button
                      onClick={applyLabelToSelection}
                      disabled={!bulkLabel.trim()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded text-xs font-medium flex items-center gap-1.5"
                    >
                      <FaTags size={10} /> Apply
                    </button>
                  </div>
                </div>

                {/* Visibility Controls */}
                <div className="space-y-2">
                  <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Visibility</label>
                  <div className="flex gap-2">
                    <button
                      onClick={hideSelection}
                      className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <FaEyeSlash size={10} /> Hide Selected
                    </button>
                    <button
                      onClick={showSelection}
                      className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <FaEye size={10} /> Show Selected
                    </button>
                  </div>
                </div>

                {/* Clear Actions */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <button
                    onClick={clearSelectionStyles}
                    className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <FaTrash size={10} /> Remove Styles from Selected
                  </button>
                  <button
                    onClick={onClearSelection}
                    className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-xs font-medium"
                  >
                    Clear Selection
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* All Styled Tracks Tab */}
        {activeTab === 'all' && (
          <div className="space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded pl-8 pr-3 py-2 text-sm text-white"
                placeholder="Search by label or ID..."
              />
            </div>

            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {filteredTracks.length === 0 ? (
                <div className="text-center py-4 text-zinc-600 text-sm">
                  {styledCount === 0 ? 'No styled tracks yet' : 'No matches found'}
                </div>
              ) : (
                filteredTracks.map(track => {
                  const style = styles[track.id];
                  return (
                    <TrackListItem
                      key={track.id}
                      trackId={track.id}
                      style={style}
                      path={track.path}
                      isSelected={selectedTrackIds.includes(track.id)}
                      onSelect={() => onTrackSelect(track.id, false)}
                      onToggleHidden={() => setTrackHidden(track.id, !style?.hidden)}
                      onRemove={() => removeTrackStyle(track.id)}
                    />
                  );
                })
              )}
            </div>

            {styledCount > 0 && (
              <button
                onClick={() => { if (confirm('Remove all track styles?')) clearAllStyles(); }}
                className="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <FaTrash size={10} /> Clear All Styles
              </button>
            )}
          </div>
        )}

        {/* Export/Import Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Export Data</label>
              <button
                onClick={handleExport}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaDownload size={12} /> Download JSON File
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Import Data</label>
              <button
                onClick={handleImport}
                className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm font-medium flex items-center justify-center gap-2"
              >
                <FaUpload size={12} /> Import from JSON File
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2 block">Preview</label>
              <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-400 font-mono overflow-auto max-h-64">
                {exportStyles()}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Save Button */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        {error && <div className="text-red-400 text-xs mb-2 text-center">{error}</div>}
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`w-full px-4 py-3 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            saveStatus === 'saved' ? 'bg-green-600 text-white'
            : saveStatus === 'error' ? 'bg-red-600 text-white'
            : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          {saveStatus === 'saving' ? 'Saving...'
           : saveStatus === 'saved' ? <><FaCheck size={12} /> Saved!</>
           : saveStatus === 'error' ? <><FaTimes size={12} /> Save Failed</>
           : <><FaSave size={12} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// TRACK LIST ITEM
// ============================================================================

interface TrackListItemProps {
  trackId: string;
  style: TrackStyle;
  path: { x: number; y: number; z: number }[];
  isSelected: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onRemove: () => void;
}

function TrackListItem({ trackId, style, path, isSelected, onSelect, onToggleHidden, onRemove }: TrackListItemProps) {
  const startCoord = path[0];
  const endCoord = path[path.length - 1];

  return (
    <div
      className={`p-2.5 rounded border transition-colors cursor-pointer ${
        isSelected ? 'bg-amber-900/30 border-amber-600' : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-4 h-4 rounded flex-shrink-0"
            style={{ backgroundColor: style?.color || '#d97706', opacity: style?.hidden ? 0.3 : 1 }}
          />
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">{style?.label || trackId.slice(0, 16)}</div>
            <div className="text-zinc-500 text-[10px] font-mono">
              ({Math.round(startCoord.x)}, {Math.round(startCoord.z)}) → ({Math.round(endCoord.x)}, {Math.round(endCoord.z)})
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
            className={`p-1.5 rounded transition-colors ${style?.hidden ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-white'}`}
          >
            {style?.hidden ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 text-zinc-600 hover:text-red-400 rounded transition-colors"
          >
            <FaTimes size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
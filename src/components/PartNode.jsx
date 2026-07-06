import React from 'react';

// Generates a winding sinusoidal road path with nice curves
// Returns an array of {x, y} node positions and the SVG path d string

const NODE_SPACING_X = 230;    // horizontal gap between nodes
const AMPLITUDE = 130;          // vertical wave amplitude
const WAVE_PERIOD = 5;          // how many nodes per full wave cycle
const CANVAS_PADDING_X = 100;  // left/right padding
const CANVAS_PADDING_Y = 160;  // top/bottom padding

export function generateRoadData(count) {
  const nodes = [];
  const canvasHeight = AMPLITUDE * 2 + CANVAS_PADDING_Y * 2;

  for (let i = 0; i < count; i++) {
    const x = CANVAS_PADDING_X + i * NODE_SPACING_X;
    // Sine wave, shifted so it stays within [padding, canvasHeight - padding]
    const t = (i / (WAVE_PERIOD - 1)) * Math.PI * 2;
    const y = CANVAS_PADDING_Y + AMPLITUDE + Math.sin(t) * AMPLITUDE;
    nodes.push({ x, y });
  }

  const totalWidth = CANVAS_PADDING_X * 2 + (count - 1) * NODE_SPACING_X;
  const totalHeight = canvasHeight;

  // Build smooth cubic bezier path through all nodes
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return { nodes, path: d, totalWidth, totalHeight };
}

function PartNode({ part, position, checkedMap, customQuestions, onClick }) {
  const builtIn = part.questions || [];
  const custom = customQuestions[part.id] || [];
  const allQ = [...builtIn, ...custom];
  const hasQ = allQ.length > 0;
  const solved = hasQ ? allQ.filter((q) => checkedMap[q.id]).length : 0;
  const total = allQ.length;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const isDone = hasQ && pct === 100;
  const isProgress = hasQ && pct > 0 && pct < 100;

  let stateClass = 'node-empty';
  if (!hasQ) stateClass = 'node-no-questions';
  else if (isDone) stateClass = 'node-done';
  else if (isProgress) stateClass = 'node-progress';

  return (
    <div
      className={`part-node ${stateClass}`}
      style={{ left: position.x, top: position.y }}
      onClick={onClick}
      title={part.title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Part ${part.id}: ${part.title}`}
    >
      <div className="node-outer-ring">
        <div className="node-inner">{part.id}</div>
      </div>
      <div className="node-label">Part {part.id}</div>

      {/* Tooltip card */}
      <div className="node-tooltip">
        <div className="tooltip-title">{part.title}</div>
        {hasQ ? (
          <div className="tooltip-progress">{pct}% Problems Solved ({solved}/{total})</div>
        ) : (
          <div className="tooltip-no-q">Read PDF — No problems</div>
        )}
      </div>
    </div>
  );
}

export default PartNode;

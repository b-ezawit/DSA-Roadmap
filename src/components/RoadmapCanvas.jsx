import React, { useRef, useState, useEffect, useCallback } from 'react';
import PartNode, { generateRoadData } from './PartNode';

function RoadmapCanvas({ parts, checkedMap, customQuestions, onPartClick }) {
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const { nodes, path, totalWidth, totalHeight } = generateRoadData(parts.length);

  // Mouse drag-to-scroll
  const onMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.pageX - wrapperRef.current.offsetLeft);
    setStartY(e.pageY - wrapperRef.current.offsetTop);
    setScrollLeft(wrapperRef.current.scrollLeft);
    setScrollTop(wrapperRef.current.scrollTop);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const y = e.pageY - wrapperRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    wrapperRef.current.scrollLeft = scrollLeft - walkX;
    wrapperRef.current.scrollTop = scrollTop - walkY;
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onMouseLeave = useCallback(() => setIsDragging(false), []);

  // Touch drag support
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchScrollLeft = useRef(0);
  const touchScrollTop = useRef(0);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].pageX;
    touchStartY.current = e.touches[0].pageY;
    touchScrollLeft.current = wrapperRef.current.scrollLeft;
    touchScrollTop.current = wrapperRef.current.scrollTop;
  }, []);

  const onTouchMove = useCallback((e) => {
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    const walkX = (touchStartX.current - x) * 1.2;
    const walkY = (touchStartY.current - y) * 1.2;
    wrapperRef.current.scrollLeft = touchScrollLeft.current + walkX;
    wrapperRef.current.scrollTop = touchScrollTop.current + walkY;
  }, []);

  return (
    <div
      className={`roadmap-wrapper${isDragging ? ' dragging' : ''}`}
      ref={wrapperRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        className="roadmap-canvas"
        style={{ width: totalWidth, height: totalHeight }}
      >
        {/* SVG Road */}
        <svg
          className="road-svg"
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        >
          {/* Glowing shadow */}
          <path className="road-path-shadow" d={path} />
          {/* Main road */}
          <path className="road-path-main" d={path} />
          {/* Dashes overlay for road lane feel */}
          <path className="road-path-dashes" d={path} />
        </svg>

        {/* Part Nodes */}
        {parts.map((part, i) => (
          <PartNode
            key={part.id}
            part={part}
            position={nodes[i]}
            checkedMap={checkedMap}
            customQuestions={customQuestions}
            onClick={() => onPartClick(part)}
          />
        ))}
      </div>
    </div>
  );
}

export default RoadmapCanvas;

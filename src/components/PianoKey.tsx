import React, { useEffect, useRef, useState } from 'react';

export interface PianoKeyProps {
  id: string;
  svgPath: string;
  color?: string; // default key color
  activeColor?: string; // color when pressed
  onClick?: (duration: number) => void; // duration of press in ms
}

const PianoKey: React.FC<PianoKeyProps> = ({
  id,
  svgPath,
  color = 'white',
  activeColor = '#ccc',
  onClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const pressStart = useRef<number | null>(null);

  // Load SVG
  useEffect(() => {
    fetch(svgPath)
      .then((res) => res.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = svgDoc.querySelector("svg");
        const rect = svg?.querySelector("rect");

        if (!svg || !rect || !containerRef.current) return;

        svg.setAttribute("id", id);
        svg.classList.add("piano-key-svg");

        // Initial color
        rect.setAttribute("fill", color);

        // Clear container
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(svg);
        svgRef.current = svg;
      });
  }, [id, svgPath]);

  // Update fill color on press
  useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.querySelector("rect");
    if (rect) {
      rect.setAttribute("fill", isPressed ? activeColor : color);
    }
  }, [isPressed, color, activeColor]);

  const handleMouseDown = () => {
    setIsPressed(true);
    pressStart.current = Date.now();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    const duration = pressStart.current ? Date.now() - pressStart.current : 0;
    pressStart.current = null;
    if (onClick) onClick(duration);
  };

  return (
    <div
      ref={containerRef}
      className="cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-key-id={id}
    />
  );
};

export default PianoKey;

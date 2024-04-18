import React, { useState, useEffect, useCallback } from "react";
import "../Components.css";

const DraggableBubble = ({
  scenario,
  children,
  initialPos,
  onClick,
  expand,
  expandOnClick,
}) => {
  const [position, setPosition] = useState(initialPos || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Tracks whether the bubble is in its expanded state
  const [rel, setRel] = useState({ x: 0, y: 0 }); // Relative position of the cursor to the bubble
  const [iconOpacity, setIconOpacity] = useState(1); // 1 means fully visible

  useEffect(() => {
    if (isExpanded) {
      setIconOpacity(0); // Fade out icon
    } else {
      setIconOpacity(1); // Fade in icon
    }
  }, [isExpanded]);

  useEffect(() => {
    setIsExpanded(expand); // Listen to changes in `expand` prop to trigger expand animation
  }, [expand]);

  const onMouseDown = useCallback((e) => {
    // Only allow left mouse button for drag
    if (e.button !== 0) return;
    setIsDragging(true);

    const elementRect = e.target.getBoundingClientRect();
    setRel({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top,
    });

    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const newX = e.clientX - rel.x;
      const newY = e.clientY - rel.y;

      setPosition({ x: newX, y: newY });

      e.stopPropagation();
      e.preventDefault();
    },
    [isDragging, rel]
  );

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onMouseMove]);

  // Modify this function to handle the onClick event, potentially for navigation or expanding
  const handleOnClick = (e) => {
    if (!isDragging) {
      onClick(e);
      if (expandOnClick) {
        setIsExpanded(!isExpanded); // Toggle expansion
      }
    }
  };

  return (
    <div
      className={`circle-button draggable ${scenario} ${
        isExpanded ? "full-screen" : ""
      }`}
      style={{
        left: isExpanded ? 0 : `${position.x}px`,
        top: isExpanded ? 0 : `${position.y}px`,
        position: isExpanded ? "fixed" : "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: isExpanded ? 1000 : 1,
      }}
      onMouseDown={!isExpanded ? onMouseDown : null} // Disable dragging when expanded
      onClick={handleOnClick}
    >
      <div className="icon-transition" style={{ opacity: iconOpacity }}>
        {children}
      </div>
    </div>
  );
};

export default DraggableBubble;

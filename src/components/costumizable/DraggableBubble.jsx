import React, { useState, useEffect, useCallback } from "react";

const DraggableBubble = ({
  scenario,
  children,
  initialPos,
  onClick,
  expand,
}) => {
  const [position, setPosition] = useState(initialPos || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Tracks whether the bubble is in its expanded state
  const [rel, setRel] = useState({ x: 0, y: 0 }); // Relative position of the cursor to the bubble

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
      // Prevent navigation if dragging
      onClick(e);
    }
  };

  return (
    <div
      className={`circle-button draggable ${scenario} ${
        isExpanded ? "full-screen" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseDown={onMouseDown}
      onClick={handleOnClick} // Use the modified click handler
    >
      {children}
    </div>
  );
};

export default DraggableBubble;

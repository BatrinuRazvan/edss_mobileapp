import React, { useState, useEffect, useCallback } from "react";

const DraggableBubble = ({ scenario, children, initialPos, onClick }) => {
  const [position, setPosition] = useState(initialPos || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 }); // Relative position of the cursor to the bubble

  const onMouseDown = useCallback((e) => {
    // Only allow left mouse button for drag
    if (e.button !== 0) return;
    setIsDragging(true);

    // Calculate and set the relative position of the cursor to the bubble's top-left corner
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

      // Calculate new position based on cursor's current position minus relative position
      const newX = e.clientX - rel.x;
      const newY = e.clientY - rel.y;

      // Update the bubble's position
      setPosition({ x: newX, y: newY });

      e.stopPropagation();
      e.preventDefault();
    },
    [isDragging, rel]
  );

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      // Attach mousemove and mouseup listeners to the document to allow for drag movement outside the bubble
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // Cleanup listeners when the component unmounts or isDragging changes
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onMouseMove]);

  return (
    <div
      className={`circle-button draggable ${scenario}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default DraggableBubble;

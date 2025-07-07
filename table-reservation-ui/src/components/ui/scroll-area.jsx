const ScrollArea = ({ children, maxHeight }) => {
  return (
    <div style={{ maxHeight, overflowY: "auto" }}>
      {children}
    </div>
  );
};

export default ScrollArea;
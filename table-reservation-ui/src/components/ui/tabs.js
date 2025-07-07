import React, { useState } from "react";

export function Tabs({ children, defaultValue, className = "", ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`tabs ${className}`} {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, activeTab, setActiveTab, className = "", ...props }) {
  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 border-b-2 ${
        isActive ? "border-red-600 text-red-600" : "border-transparent"
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabPanel({ children, value, activeTab, ...props }) {
  if (value !== activeTab) return null;
  return <div {...props}>{children}</div>;
}

export { TabsList as TabList, TabsTrigger as Tab };
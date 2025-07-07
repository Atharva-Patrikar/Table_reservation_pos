import React from "react";

export function Select({ children, className = "", ...props }) {
  return (
    <div className={`relative inline-block w-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectTrigger({ children, onClick, className = "", ...props }) {
  return (
    <button
      className={`w-full px-4 py-2 border rounded bg-white text-left focus:outline-none focus:ring ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectContent({ children, isOpen, className = "", ...props }) {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-10 mt-1 w-full bg-white border rounded shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ children, onClick, className = "", ...props }) {
  return (
    <div
      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ children, className = "", ...props }) {
  return (
    <span className={`block truncate ${className}`} {...props}>
      {children}
    </span>
  );
}
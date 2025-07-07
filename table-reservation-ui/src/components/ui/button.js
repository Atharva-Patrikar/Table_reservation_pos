import React from "react";

export function Button({ children, variant = "default", size = "md", className = "", ...props }) {
  const baseStyles = "px-4 py-2 rounded focus:outline-none focus:ring";
  const variants = {
    default: "bg-gray-200 hover:bg-gray-300 text-black",
    ghost: "bg-transparent hover:bg-gray-100 text-black",
  };
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    icon: "p-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
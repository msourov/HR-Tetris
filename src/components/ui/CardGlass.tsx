import React from "react";

interface CardGlassProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CardGlass = ({ children, className = "", onClick }: CardGlassProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg border border-gray-300 shadow-sm overflow-hidden ${className}`}
    >
      {/* Glass effect layer */}
      <div className="absolute bg-white/10 backdrop-blur-md shadow-md" />

      {/* Content container */}
      <div className=" z-10 p-4">{children}</div>
    </div>
  );
};

export default CardGlass;

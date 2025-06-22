// components/CardGlass.tsx
import { Card } from "@mantine/core";
import React from "react";

interface CardGlassProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CardGlass = ({
  children,
  className = "",
  onClick,
  ...props
}: CardGlassProps) => {
  return (
    <Card
      padding="md"
      radius="lg"
      withBorder={false}
      onClick={onClick}
      className={`relative isolate bg-gradient-to-br from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.05)] 
                 backdrop-blur-xl border border-white/20 shadow-lg
                 ${className}`}
      {...props}
    >
      {/* Frosted glass base layer */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl -z-10 rounded-xl" />

      {/* Inner content container */}
      <div className="relative z-10">{children}</div>
    </Card>
  );
};

export default CardGlass;

// components/CardGlass.tsx
import { Card } from "@mantine/core";
import React from "react";

interface CardGlassProps {
  children: React.ReactNode;
  className?: string;
}

const CardGlass = ({ children, className = "" }: CardGlassProps) => {
  return (
    <Card
      padding="md"
      radius="lg"
      withBorder={false}
      className={`bg-white/30 backdrop-blur-lg border border-white/30 shadow-xl ${className}`}
    >
      {children}
    </Card>
  );
};

export default CardGlass;

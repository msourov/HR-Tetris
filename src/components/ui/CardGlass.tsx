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
      className={`bg-transparent backdrop-blur-xl border border-white/20 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CardGlass;

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div
      className={`flex items-center justify-between pb-2 mb-4 border-b border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return (
    <div
      className={`flex items-center justify-between pt-4 mt-4 border-t border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

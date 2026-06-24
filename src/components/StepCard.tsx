import { LucideIcon } from "lucide-react";

interface StepCardProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export function StepCard({ number, icon: Icon, title, description, delay }: StepCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center animate-in zoom-in`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="relative mb-6">
        <div className="absolute -inset-2 bg-cyan-grad opacity-20 blur-lg rounded-full" />
        <div className="relative h-16 w-16 rounded-full bg-cyan-grad flex items-center justify-center glow">
          <Icon className="h-8 w-8 text-neon-foreground" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs font-bold text-neon-foreground">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}

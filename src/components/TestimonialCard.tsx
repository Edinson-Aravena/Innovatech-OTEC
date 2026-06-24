interface TestimonialCardProps {
  name: string;
  role: string;
  specialty: string;
  quote: string;
  delay: number;
  noGlow?: boolean;
}

export function TestimonialCard({ name, role, specialty, quote, delay, noGlow }: TestimonialCardProps) {
  return (
    <div
      className={`animate-in fade-in rounded-2xl border border-primary/30 bg-surface/70 backdrop-blur p-6 ${!noGlow ? 'card-glow' : 'transition-all duration-300 hover:border-primary/70 hover:bg-surface/90'}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="h-4 w-4 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4 italic">"{quote}"</p>
      <div className="border-t border-primary/20 pt-4">
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-primary">{role}</p>
        <p className="text-xs text-muted-foreground">{specialty}</p>
      </div>
    </div>
  );
}

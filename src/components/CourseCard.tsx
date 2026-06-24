import { Clock, Award, FlaskConical, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { formatCLP, type Course } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  const { add, has } = useCart();
  const inCart = has(course.id);

  return (
    <article className="card-glow group relative rounded-2xl border border-border/60 bg-surface overflow-hidden">
      <div className="relative h-40 bg-cyan-grad overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid-bg opacity-60" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-background/70 text-foreground border-0 backdrop-blur">
            {course.area}
          </Badge>
          <Badge className={`border-0 backdrop-blur font-semibold ${
            course.level === "Avanzado"   ? "bg-red-500/80 text-white" :
            course.level === "Intermedio" ? "bg-amber-500/80 text-white" :
                                           "bg-emerald-500/80 text-white"
          }`}>
            {course.level}
          </Badge>
        </div>
        {course.certified && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full border border-white/20">
            <Award className="h-3.5 w-3.5 text-yellow-400" /> Certificado SENCE
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.hours} h</span>
          <span className="flex items-center gap-1">{course.units.length} unidades</span>
          {course.practicalSession && (
            <span className="flex items-center gap-1 text-accent"><FlaskConical className="h-3.5 w-3.5" /> Práctica</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-lg font-bold text-gradient">{formatCLP(course.priceClp)}</span>
          <Button
            size="sm"
            disabled={inCart}
            onClick={() => add(course.id)}
            className={
              inCart
                ? "bg-surface-hi border border-primary/50 text-primary"
                : "bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95"
            }
          >
            {inCart ? (<><Check className="h-4 w-4 mr-1" /> Agregado</>) : (<><Plus className="h-4 w-4 mr-1" /> Agregar</>)}
          </Button>
        </div>
      </div>
    </article>
  );
}

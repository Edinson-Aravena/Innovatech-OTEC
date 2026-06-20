import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, CheckCircle2, Play, FileText, Download, Calendar as CalIcon, ArrowLeft, FlaskConical } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCourse } from "@/lib/courses";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/course/$id")({
  head: () => ({ meta: [{ title: "Curso · Innovatech" }] }),
  component: CoursePage,
});

function CoursePage() {
  const { id } = useParams({ from: "/_authenticated/course/$id" });
  const course = getCourse(id);
  const { user } = useAuth();
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const [practicalDate, setPracticalDate] = useState<Date | undefined>(undefined);
  const [enrolled, setEnrolled] = useState(true);

  useEffect(() => {
    if (!user || !course) return;
    (async () => {
      const [{ data: enr }, { data: prog }, { data: ses }] = await Promise.all([
        supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_id", course.id).maybeSingle(),
        supabase.from("progress").select("unit_id").eq("user_id", user.id).eq("course_id", course.id),
        supabase.from("practical_sessions").select("scheduled_date").eq("user_id", user.id).eq("course_id", course.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setEnrolled(!!enr);
      setCompletedUnits((prog ?? []).map((p) => p.unit_id));
      if (ses?.scheduled_date) setPracticalDate(new Date(ses.scheduled_date + "T00:00:00"));
    })();
  }, [user, course]);

  const unlocked = useMemo(() => {
    if (!course) return new Set<number>();
    const s = new Set<number>([0]);
    for (let i = 0; i < course.units.length; i++) {
      if (completedUnits.includes(course.units[i].id)) s.add(i + 1);
    }
    return s;
  }, [course, completedUnits]);

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">Curso no encontrado</h1>
          <Button asChild className="mt-6 bg-cyan-grad text-neon-foreground btn-glow border-0">
            <Link to="/dashboard">Volver al panel</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">No tienes acceso a este curso</h1>
          <p className="text-muted-foreground mt-2">Adquiérelo en el catálogo para comenzar.</p>
          <Button asChild className="mt-6 bg-cyan-grad text-neon-foreground btn-glow border-0">
            <Link to="/">Ver catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  const activeUnit = course.units[activeUnitIdx];
  const isLocked = !unlocked.has(activeUnitIdx);
  const isDone = completedUnits.includes(activeUnit.id);
  const pct = Math.round((completedUnits.length / course.units.length) * 100);

  const markComplete = async () => {
    if (!user) return;
    const { error } = await supabase.from("progress").upsert(
      { user_id: user.id, course_id: course.id, unit_id: activeUnit.id },
      { onConflict: "user_id,unit_id" },
    );
    if (error) return toast.error(error.message);
    setCompletedUnits((prev) => (prev.includes(activeUnit.id) ? prev : [...prev, activeUnit.id]));
    toast.success("Unidad completada ✓");
    if (activeUnitIdx + 1 < course.units.length) setActiveUnitIdx(activeUnitIdx + 1);
  };

  const schedulePractical = async (d: Date | undefined) => {
    if (!d || !user) return;
    setPracticalDate(d);
    const iso = d.toISOString().slice(0, 10);
    const { error } = await supabase.from("practical_sessions").insert({
      user_id: user.id,
      course_id: course.id,
      scheduled_date: iso,
    });
    if (error) return toast.error(error.message);
    toast.success(`Clase práctica agendada para ${format(d, "PPP", { locale: es })}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Mi panel
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <Badge className="bg-primary/15 text-primary border-primary/30 mb-2">{course.area}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{course.hours} horas · {course.units.length} unidades</p>
          </div>
          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progreso del curso</span>
              <span className="text-gradient font-semibold">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2 bg-surface-hi [&>div]:bg-cyan-grad" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Unidades */}
          <aside className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Unidades</h2>
            {course.units.map((u, i) => {
              const locked = !unlocked.has(i);
              const done = completedUnits.includes(u.id);
              const active = i === activeUnitIdx;
              return (
                <button
                  key={u.id}
                  disabled={locked}
                  onClick={() => setActiveUnitIdx(i)}
                  className={cn(
                    "w-full text-left rounded-xl border p-3 transition-all flex items-center gap-3",
                    locked && "opacity-50 cursor-not-allowed border-border/40 bg-surface/40",
                    !locked && !active && "border-border/60 bg-surface hover:border-primary/50",
                    active && "border-primary bg-surface ring-neon",
                  )}
                >
                  <span className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                    done ? "bg-cyan-grad text-neon-foreground glow-soft" : locked ? "bg-surface-hi text-muted-foreground" : "bg-primary/15 text-primary",
                  )}>
                    {locked ? <Lock className="h-4 w-4" /> : done ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{u.title}</p>
                    <p className="text-xs text-muted-foreground">{u.durationMin} min</p>
                  </div>
                </button>
              );
            })}

            {course.practicalSession && (
              <div className="mt-6 rounded-xl border border-accent/40 bg-surface p-4">
                <p className="flex items-center gap-2 text-sm font-medium"><FlaskConical className="h-4 w-4 text-accent" /> Clase práctica</p>
                <p className="text-xs text-muted-foreground mt-1">Agenda tu sesión presencial.</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-3 btn-glow border-accent/40">
                      <CalIcon className="h-4 w-4 mr-1.5" />
                      {practicalDate ? format(practicalDate, "PPP", { locale: es }) : "Elegir fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-surface border-border/60" align="start">
                    <Calendar
                      mode="single"
                      selected={practicalDate}
                      onSelect={schedulePractical}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      locale={es}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </aside>

          {/* Reproductor */}
          <main className="space-y-5">
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-surface ring-neon">
              {isLocked ? (
                <div className="aspect-video flex flex-col items-center justify-center bg-surface-hi text-center p-8">
                  <Lock className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-semibold">Unidad bloqueada</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Completa la unidad anterior para desbloquear este contenido.
                  </p>
                </div>
              ) : (
                <video
                  key={activeUnit.id}
                  controls
                  className="w-full aspect-video bg-black"
                  src={activeUnit.videoUrl}
                />
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Unidad {activeUnitIdx + 1}</p>
                  <h2 className="text-xl font-semibold mt-1">{activeUnit.title}</h2>
                </div>
                {!isLocked && (
                  <Button onClick={markComplete} disabled={isDone} className="bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
                    {isDone ? (<><CheckCircle2 className="h-4 w-4 mr-1.5" /> Completada</>) : (<>Marcar como completada</>)}
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Material descargable
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {activeUnit.resources.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-hi hover:border-primary/60 transition-colors group"
                    >
                      <span className="text-sm truncate">{r.name}</span>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

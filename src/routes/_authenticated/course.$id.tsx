import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Lock, CheckCircle2, Play, FileText, Download, Calendar as CalIcon, ArrowLeft, FlaskConical, Clock, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HEADER DEL CURSO */}
      <div className="relative bg-hero border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-6 relative">
          <Link to="/dashboard" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Mi panel
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border-primary/30">{course.area}</Badge>
                <Badge variant="outline" className="border-border/50 text-muted-foreground">{course.level}</Badge>
                {course.certified && <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Certificado SENCE</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{course.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.hours} horas</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.units.length} unidades</span>
              </div>
            </div>

            {/* Progreso circular */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative h-16 w-16">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-hi" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                    strokeLinecap="round"
                    stroke="url(#prog-grad)"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gradient">{pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progreso</p>
                <p className="text-sm font-semibold">{completedUnits.length} / {course.units.length} unidades</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">

          {/* SIDEBAR */}
          <aside className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">Contenido del curso</p>

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
                    "w-full text-left rounded-xl border p-3.5 transition-all flex items-center gap-3 group",
                    locked && "opacity-40 cursor-not-allowed border-border/30 bg-surface/30",
                    !locked && !active && "border-border/50 bg-surface/60 hover:border-primary/50 hover:bg-surface",
                    active && "border-primary/60 bg-primary/5 ring-1 ring-primary/20",
                  )}
                >
                  {/* Indicador de estado */}
                  <span className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl shrink-0 text-sm font-bold transition-all",
                    done ? "bg-cyan-grad text-neon-foreground glow-soft" :
                    locked ? "bg-surface-hi text-muted-foreground" :
                    active ? "bg-primary/20 text-primary" :
                    "bg-surface-hi text-muted-foreground"
                  )}>
                    {locked ? <Lock className="h-4 w-4" /> :
                     done ? <CheckCircle2 className="h-4 w-4" /> :
                     active ? <Play className="h-4 w-4" /> :
                     <span>{i + 1}</span>}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-sm font-medium leading-tight truncate",
                      active && "text-primary",
                      done && "text-foreground"
                    )}>
                      {u.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{u.durationMin} min</p>
                  </div>

                  {done && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}

            {/* Clase práctica */}
            {course.practicalSession && (
              <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center">
                    <FlaskConical className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <p className="text-sm font-semibold">Clase práctica</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3 ml-9">Agenda tu sesión presencial con el instructor.</p>
                {practicalDate && (
                  <p className="text-xs text-accent font-medium ml-9 mb-2">
                    ✓ {format(practicalDate, "PPP", { locale: es })}
                  </p>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full btn-glow border-accent/40 text-accent hover:text-accent">
                      <CalIcon className="h-3.5 w-3.5 mr-1.5" />
                      {practicalDate ? "Cambiar fecha" : "Elegir fecha"}
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

          {/* REPRODUCTOR + INFO */}
          <main className="space-y-4 min-w-0">
            {/* Video */}
            <div className={cn(
              "rounded-2xl overflow-hidden border ring-1",
              isLocked ? "border-border/40 ring-border/20" : "border-primary/30 ring-primary/10"
            )}>
              {isLocked ? (
                <div className="aspect-video flex flex-col items-center justify-center bg-surface-hi text-center p-8 gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-surface flex items-center justify-center border border-border/60">
                    <Lock className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Unidad bloqueada</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Completa la unidad anterior para desbloquear este contenido.
                    </p>
                  </div>
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

            {/* Info de la unidad */}
            <div className="rounded-2xl border border-border/60 bg-surface/60 backdrop-blur p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                    Unidad {activeUnitIdx + 1} de {course.units.length}
                  </p>
                  <h2 className="text-lg font-semibold leading-snug">{activeUnit.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {activeUnit.durationMin} minutos
                  </p>
                </div>
                {!isLocked && (
                  <Button
                    onClick={markComplete}
                    disabled={isDone}
                    className={cn(
                      "shrink-0 border-0",
                      isDone
                        ? "bg-green-500/15 text-green-400 border border-green-500/30 cursor-default"
                        : "bg-cyan-grad text-neon-foreground btn-glow hover:opacity-95"
                    )}
                  >
                    {isDone
                      ? <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Completada</>
                      : <>Marcar como completada</>
                    }
                  </Button>
                )}
              </div>

              {/* Recursos */}
              {activeUnit.resources.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border/50">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
                    <FileText className="h-4 w-4 text-primary" /> Material descargable
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activeUnit.resources.map((r) => (
                      <a
                        key={r.name}
                        href={r.url}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-surface-hi hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm truncate flex-1">{r.name}</span>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Trophy, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { COURSES, getCourse } from "@/lib/courses";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Mi panel · Innovatech" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, string[]>>({});
  const [profile, setProfile] = useState<{ full_name: string | null; rut: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: enr }, { data: prog }, { data: prof }] = await Promise.all([
        supabase.from("enrollments").select("course_id").eq("user_id", user.id),
        supabase.from("progress").select("course_id, unit_id").eq("user_id", user.id),
        supabase.from("profiles").select("full_name, rut").eq("id", user.id).maybeSingle(),
      ]);
      setEnrolled((enr ?? []).map((r) => r.course_id));
      const map: Record<string, string[]> = {};
      (prog ?? []).forEach((r) => {
        map[r.course_id] = [...(map[r.course_id] ?? []), r.unit_id];
      });
      setProgressMap(map);
      setProfile(prof);
    })();
  }, [user]);

  const myCourses = COURSES.filter((c) => enrolled.includes(c.id));

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-sm text-primary uppercase tracking-widest font-medium">Mi panel</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Hola, <span className="text-gradient">{profile?.full_name ?? "estudiante"}</span>
          </h1>
          {profile?.rut && <p className="text-sm text-muted-foreground mt-1">RUT: {profile.rut}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={BookOpen} label="Cursos activos" value={myCourses.length.toString()} />
          <StatCard icon={Clock} label="Horas totales" value={`${myCourses.reduce((a, c) => a + c.hours, 0)} h`} />
          <StatCard icon={Trophy} label="Unidades completadas" value={Object.values(progressMap).reduce((a, b) => a + b.length, 0).toString()} />
        </div>

        <h2 className="text-xl font-semibold mb-4">Mis cursos</h2>

        {myCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center">
            <p className="text-muted-foreground">Aún no tienes cursos. Explora el catálogo y comienza hoy.</p>
            <Button asChild className="mt-4 bg-cyan-grad text-neon-foreground btn-glow border-0">
              <Link to="/">Ver cursos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {myCourses.map((c) => {
              const done = (progressMap[c.id] ?? []).length;
              const pct = Math.round((done / c.units.length) * 100);
              return (
                <Link
                  key={c.id}
                  to="/course/$id"
                  params={{ id: c.id }}
                  className="card-glow rounded-2xl border border-border/60 bg-surface p-5 block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge className="bg-primary/15 text-primary border-primary/30 mb-2">{c.area}</Badge>
                      <h3 className="font-semibold leading-tight">{c.title}</h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Progreso · {done}/{c.units.length} unidades</span>
                      <span className="text-gradient font-semibold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2 bg-surface-hi [&>div]:bg-cyan-grad" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface p-5 flex items-center gap-4 card-glow">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-grad glow-soft">
        <Icon className="h-5 w-5 text-neon-foreground" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// keep getCourse referenced for tree-shake friendliness
void getCourse;

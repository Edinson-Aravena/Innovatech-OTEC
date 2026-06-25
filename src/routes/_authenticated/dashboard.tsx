import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Trophy, Clock, User, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { COURSES, getCourse } from "@/lib/courses";
import { useAuth } from "@/lib/use-auth";
import { formatRut } from "@/lib/rut";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Mi panel · Innovatech" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, string[]>>({});
  const [profile, setProfile] = useState<{ full_name: string | null; rut: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: roleData } = await supabase.rpc("get_my_role");
      if (roleData === "admin") { navigate({ to: "/admin" }); return; }

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
  const totalUnits = Object.values(progressMap).reduce((a, b) => a + b.length, 0);
  const totalHours = myCourses.reduce((a, c) => a + c.hours, 0);
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HEADER PERFIL */}
      <div className="relative bg-hero border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        <div className="container mx-auto px-6 py-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-cyan-grad flex items-center justify-center glow shrink-0">
                <span className="text-xl font-bold text-neon-foreground">{initials}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-xs text-primary uppercase tracking-widest font-medium mb-1">Mi panel</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                Hola, <span className="text-gradient">{profile?.full_name ?? "estudiante"}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {profile?.rut && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-surface/60 border border-border/50 rounded-full px-3 py-1">
                    <User className="h-3 w-3" />
                    RUT {formatRut(profile.rut)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-surface/60 border border-border/50 rounded-full px-3 py-1">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={BookOpen}
            label="Cursos activos"
            value={myCourses.length.toString()}
            color="cyan"
            sub={myCourses.length === 1 ? "curso en progreso" : "cursos en progreso"}
          />
          <StatCard
            icon={Clock}
            label="Horas totales"
            value={`${totalHours}h`}
            color="violet"
            sub="de contenido disponible"
          />
          <StatCard
            icon={Trophy}
            label="Unidades completadas"
            value={totalUnits.toString()}
            color="green"
            sub={`de ${myCourses.reduce((a, c) => a + c.units.length, 0)} en total`}
          />
        </div>

        {/* CURSOS */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Mis cursos</h2>
          <Button asChild variant="ghost" size="sm" className="text-primary text-xs gap-1">
            <Link to="/courses">Ver catálogo <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        {myCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-surface-hi flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">Aún no tienes cursos inscritos</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Explora el catálogo y comienza hoy.</p>
            <Button asChild className="mt-5 bg-cyan-grad text-neon-foreground btn-glow border-0">
              <Link to="/">Ver cursos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myCourses.map((c) => {
              const done = (progressMap[c.id] ?? []).length;
              const pct = Math.round((done / c.units.length) * 100);
              return (
                <Link
                  key={c.id}
                  to="/course/$id"
                  params={{ id: c.id }}
                  className="card-glow group rounded-xl border border-border/60 bg-surface overflow-hidden block hover:border-primary/40 transition-colors"
                >
                  {/* Imagen */}
                  <div className="relative h-20 bg-cyan-grad overflow-hidden">
                    {c.image
                      ? <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 grid-bg opacity-50" />
                    }
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-background/70 text-foreground border-0 backdrop-blur text-[10px] px-1.5 py-0">{c.area}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="h-6 w-6 rounded-full bg-cyan-grad flex items-center justify-center glow-soft group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-3 w-3 text-neon-foreground" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                      <div className="h-full bg-cyan-grad transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{c.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{done}/{c.units.length} unid.</span>
                      <span className={`text-xs font-bold ${pct === 100 ? "text-green-400" : "text-gradient"}`}>
                        {pct === 100 ? "✓" : `${pct}%`}
                      </span>
                    </div>
                    <Progress value={pct} className="h-1 mt-1.5 bg-surface-hi [&>div]:bg-cyan-grad" />
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

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: any; label: string; value: string; color: "cyan" | "violet" | "green"; sub: string;
}) {
  const colors = {
    cyan:   { icon: "bg-cyan-grad glow-soft", val: "text-cyan-400",   bg: "bg-cyan-400/5   border-cyan-400/20"   },
    violet: { icon: "bg-gradient-to-br from-violet-500 to-purple-600", val: "text-violet-400", bg: "bg-violet-400/5 border-violet-400/20" },
    green:  { icon: "bg-gradient-to-br from-green-500 to-emerald-600", val: "text-green-400",  bg: "bg-green-400/5  border-green-400/20"  },
  };
  const c = colors[color];

  return (
    <div className={`rounded-2xl border ${c.bg} p-5 flex items-center gap-4 card-glow`}>
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${c.icon}`}>
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

void getCourse;

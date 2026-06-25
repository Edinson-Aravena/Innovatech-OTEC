import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, BookOpen, DollarSign, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { COURSES, getCourse } from "@/lib/courses";
import { formatRut } from "@/lib/rut";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin · Innovatech" }] }),
  component: AdminPanel,
});

type Profile = {
  id: string;
  full_name: string | null;
  rut: string | null;
  role: string;
  created_at: string;
  enrollmentCount: number;
};

type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  rut: string;
  amount_clp: number;
  created_at: string;
  studentName: string | null;
};

const clp = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

function AdminPanel() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { navigate({ to: "/auth" }); return; }

      const { data: selfProfile } = await supabase
        .from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
      if (selfProfile !== null && selfProfile.role !== "admin") { navigate({ to: "/dashboard" }); return; }

      const [{ data: profs }, { data: enrs }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
      ]);

      const countById: Record<string, number> = {};
      (enrs ?? []).forEach((e) => { countById[e.user_id] = (countById[e.user_id] ?? 0) + 1; });

      const nameById: Record<string, string | null> = {};
      (profs ?? []).forEach((p) => { nameById[p.id] = p.full_name; });

      setProfiles((profs ?? []).map((p) => ({ ...p, enrollmentCount: countById[p.id] ?? 0 })));
      setEnrollments((enrs ?? []).map((e) => ({ ...e, studentName: nameById[e.user_id] ?? null })));
      setLoading(false);
    })();
  }, []);

  const totalRevenue = enrollments.reduce((s, e) => s + e.amount_clp, 0);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative bg-hero border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container mx-auto px-6 py-8 relative flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-primary uppercase tracking-widest font-medium">Panel de administración</p>
            <h1 className="text-2xl font-bold">Administrador</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Cargando datos...
          </div>
        ) : (
          <Tabs defaultValue="resumen">
            <TabsList className="mb-6">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="estudiantes">Estudiantes ({profiles.length})</TabsTrigger>
              <TabsTrigger value="inscripciones">Inscripciones ({enrollments.length})</TabsTrigger>
            </TabsList>

            {/* RESUMEN */}
            <TabsContent value="resumen">
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <StatCard icon={Users} label="Estudiantes" value={profiles.length.toString()} color="cyan" />
                <StatCard icon={BookOpen} label="Inscripciones" value={enrollments.length.toString()} color="violet" />
                <StatCard icon={DollarSign} label="Ingresos totales" value={clp(totalRevenue)} color="green" />
              </div>

              <h2 className="text-lg font-semibold mb-4">Cursos más populares</h2>
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface/60">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Curso</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Área</th>
                      <th className="text-right px-4 py-3 text-muted-foreground font-medium">Inscritos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COURSES.map((c) => {
                      const count = enrollments.filter((e) => e.course_id === c.id).length;
                      return (
                        <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-surface/40 transition-colors">
                          <td className="px-4 py-3 font-medium">{c.title}</td>
                          <td className="px-4 py-3 text-muted-foreground">{c.area}</td>
                          <td className="px-4 py-3 text-right font-semibold text-primary">{count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ESTUDIANTES */}
            <TabsContent value="estudiantes">
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface/60">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nombre</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">RUT</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Rol</th>
                      <th className="text-right px-4 py-3 text-muted-foreground font-medium">Cursos</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Registrado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-surface/40 transition-colors">
                        <td className="px-4 py-3 font-medium">{p.full_name ?? <span className="text-muted-foreground">—</span>}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.rut ? formatRut(p.rut) : "—"}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={p.role === "admin" ? "default" : "secondary"}
                            className={p.role === "admin" ? "bg-violet-600 text-white border-0" : ""}
                          >
                            {p.role === "admin" ? "Admin" : "Estudiante"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">{p.enrollmentCount}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(p.created_at).toLocaleDateString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {profiles.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-sm">No hay estudiantes registrados.</p>
                )}
              </div>
            </TabsContent>

            {/* INSCRIPCIONES */}
            <TabsContent value="inscripciones">
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface/60">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Estudiante</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">RUT</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Curso</th>
                      <th className="text-right px-4 py-3 text-muted-foreground font-medium">Monto</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e) => {
                      const course = getCourse(e.course_id);
                      return (
                        <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-surface/40 transition-colors">
                          <td className="px-4 py-3 font-medium">{e.studentName ?? <span className="text-muted-foreground">—</span>}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatRut(e.rut)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{course?.title ?? e.course_id}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-400">{clp(e.amount_clp)}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {new Date(e.created_at).toLocaleDateString("es-CL")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {enrollments.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 text-sm">No hay inscripciones aún.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: "cyan" | "violet" | "green";
}) {
  const colors = {
    cyan:   { icon: "bg-cyan-grad glow-soft",                             val: "text-cyan-400",   bg: "bg-cyan-400/5   border-cyan-400/20"   },
    violet: { icon: "bg-gradient-to-br from-violet-500 to-purple-600",    val: "text-violet-400", bg: "bg-violet-400/5 border-violet-400/20" },
    green:  { icon: "bg-gradient-to-br from-green-500 to-emerald-600",    val: "text-green-400",  bg: "bg-green-400/5  border-green-400/20"  },
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
      </div>
    </div>
  );
}

void getCourse;

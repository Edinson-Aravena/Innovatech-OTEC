import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, ShieldCheck, GraduationCap, Stethoscope, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { AREAS, COURSES } from "@/lib/courses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Innovatech · OTEC de cursos certificados en salud" },
      { name: "description", content: "Cursos certificados en Odontología y Salud con LMS, videos, papers y clases prácticas agendables." },
      { property: "og:title", content: "Innovatech · OTEC de cursos certificados" },
      { property: "og:description", content: "Cursos certificados en salud con panel LMS interactivo." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [area, setArea] = useState<(typeof AREAS)[number]>("Todas");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      const matchArea = area === "Todas" || c.area === area;
      const matchQ = !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase());
      return matchArea && matchQ;
    });
  }, [area, q]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container mx-auto px-6 pt-20 pb-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary glow-soft">
              <Sparkles className="h-3.5 w-3.5" /> OTEC certificada · Resolución vigente
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Forma equipos clínicos de élite con <span className="text-gradient">Innovatech</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Cursos certificados en Odontología y Salud con un LMS interactivo: videos en HD, papers descargables,
              evaluación por unidades bloqueadas y clases prácticas presenciales agendables.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
                <a href="#cursos">Explorar cursos <ArrowRight className="ml-1.5 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-glow border-primary/40 bg-surface/40">
                <a href="#nosotros">Conoce Innovatech</a>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: "+8.000", l: "estudiantes" },
                { v: "98%", l: "satisfacción" },
                { v: "SENCE", l: "certificación" },
              ].map((s) => (
                <div key={s.l} className="text-left">
                  <div className="text-2xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating glow card */}
          <div className="hidden lg:block absolute right-10 top-24 animate-float-slow">
            <div className="relative rounded-2xl border border-primary/40 bg-surface/70 backdrop-blur p-5 w-72 ring-neon">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-grad">
                  <Stethoscope className="h-4 w-4 text-neon-foreground" />
                </span>
                Próxima clase práctica
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Endodoncia Avanzada · Sede Providencia</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sáb · 09:00</span>
                <Badge className="bg-primary/15 text-primary border-primary/30">12 cupos</Badge>
              </div>
              <div className="absolute inset-0 -z-10 rounded-2xl bg-cyan-grad opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS */}
      <section id="cursos" className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-sm text-primary uppercase tracking-widest font-medium">Catálogo</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Cursos certificados</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Filtra por área. Hoy nuestra apuesta está en <span className="text-gradient font-semibold">Odontología y Salud</span>.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar curso…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-surface border-border/60 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={[
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                area === a
                  ? "bg-cyan-grad text-neon-foreground border-transparent glow-soft"
                  : "bg-surface text-muted-foreground border-border/60 hover:border-primary/60 hover:text-foreground",
              ].join(" ")}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              No encontramos cursos con esos filtros.
            </div>
          )}
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" className="border-t border-border/60 bg-surface/30">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-primary uppercase tracking-widest font-medium">Quiénes somos</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Tecnología al servicio de la salud</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Innovatech es una OTEC chilena enfocada en formación continua de equipos clínicos.
              Combinamos un LMS moderno con clases prácticas en sedes equipadas, donde estudiantes
              aplican lo aprendido con instructores expertos.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { i: ShieldCheck, t: "Resolución OTEC vigente y franquicia SENCE" },
                { i: GraduationCap, t: "Certificación digital verificable por RUT" },
                { i: Stethoscope, t: "Instructores activos en clínica y hospitales" },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary glow-soft">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-cyan-grad p-px glow">
              <div className="h-full w-full rounded-3xl bg-surface grid-bg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-gradient">10+</div>
                  <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">años formando</p>
                  <p className="text-sm text-muted-foreground">profesionales de la salud</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICACIÓN */}
      <section id="certificacion" className="container mx-auto px-6 py-20">
        <div className="rounded-3xl border border-primary/30 bg-surface p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-grad opacity-20 blur-3xl animate-pulse-neon" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold">Certificados digitales <span className="text-gradient">verificables</span></h2>
            <p className="mt-4 text-muted-foreground">
              Al completar todas las unidades y asistir a la clase práctica, recibirás un certificado
              digital con verificación por RUT — útil para concursos, postulaciones y franquicia SENCE.
            </p>
            <Button asChild size="lg" className="mt-6 bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
              <a href="#cursos">Empezar ahora</a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Innovatech OTEC · Hecho con tecnología en Chile.
      </footer>
    </div>
  );
}

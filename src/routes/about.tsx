import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Target, Users, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre Innovatech · Misión y Visión" },
      { name: "description", content: "Conoce la misión, visión y valores de Innovatech OTEC." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="relative bg-hero overflow-hidden py-20">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container mx-auto px-6 relative">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Sobre <span className="text-gradient">Innovatech</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Conoce quiénes somos, qué nos impulsa y hacia dónde vamos como institución de formación continua.
          </p>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-cyan-grad flex items-center justify-center glow">
                <Sparkles className="h-6 w-6 text-neon-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Misión</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Formar profesionales de la salud altamente capacitados mediante programas certificados, combinando educación teórica rigurosa con práctica clínica supervisada, utilizando tecnología educativa de última generación para mejorar continuamente la calidad de la atención sanitaria en Chile.
            </p>
            <div className="mt-6 pt-6 border-t border-primary/30">
              <p className="text-sm text-muted-foreground italic">
                "Capacitar con excelencia, transformar la salud"
              </p>
            </div>
          </div>
          <div className="relative rounded-3xl bg-cyan-grad p-px glow overflow-hidden">
            <div className="h-96 w-full rounded-3xl bg-surface grid-bg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-primary/10" />
              <GraduationCap className="absolute h-64 w-64 text-cyan-500/5 -bottom-8 -right-8" />
              <div className="relative text-center p-8 flex flex-col items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-cyan-grad flex items-center justify-center glow">
                  <GraduationCap className="h-10 w-10 text-neon-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  {[
                    { v: "+8.000", l: "Profesionales formados" },
                    { v: "98%", l: "Tasa de satisfacción" },
                    { v: "SENCE", l: "Certificación oficial" },
                    { v: "10+", l: "Años de experiencia" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-primary/20 bg-surface/60 backdrop-blur p-3 text-center">
                      <div className="text-lg font-bold text-gradient">{s.v}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="border-t border-border/60 bg-surface/30 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl p-px order-2 md:order-1 overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}>
              <div className="h-96 w-full rounded-3xl bg-surface grid-bg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-600/10" />
                <Sparkles className="absolute h-64 w-64 text-violet-500/5 -bottom-8 -left-8" />
                <div className="relative text-center p-8 flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center" style={{ boxShadow: "0 0 32px rgba(124,58,237,0.5)" }}>
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-3 w-full max-w-xs">
                    {[
                      { label: "Cursos online certificados", pct: 90 },
                      { label: "Clases prácticas presenciales", pct: 75 },
                      { label: "Satisfacción de egresados", pct: 98 },
                    ].map((item) => (
                      <div key={item.label} className="text-left">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="text-violet-400 font-semibold">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-hi overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center glow-soft">
                  <Target className="h-6 w-6 text-neon-foreground" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Visión</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ser la plataforma de formación continua más innovadora y confiable de América Latina, reconocida por la calidad de nuestros programas certificados, la excelencia de nuestros instructores y el impacto measurable en la práctica clínica de nuestros egresados.
              </p>
              <div className="mt-6 pt-6 border-t border-primary/30">
                <p className="text-sm text-muted-foreground italic">
                  "Transformando la salud a través de la educación"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Nuestros Valores</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Los principios que guían cada decisión y acción en Innovatech
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: "Excelencia",
              description: "Buscamos la más alta calidad en cada aspecto: contenido, instructores, tecnología y servicio al estudiante.",
            },
            {
              icon: Users,
              title: "Comunidad",
              description: "Creemos en el poder de la colaboración y el aprendizaje compartido entre profesionales de la salud.",
            },
            {
              icon: Sparkles,
              title: "Innovación",
              description: "Adoptamos tecnologías emergentes y metodologías modernas para mejorar continuamente la experiencia educativa.",
            },
          ].map((valor, i) => {
            const Icon = valor.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-primary/30 bg-surface/70 backdrop-blur p-8 card-glow animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center mb-4 glow-soft">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">{valor.title}</h3>
                <p className="text-sm text-muted-foreground">{valor.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 container mx-auto px-6 py-20">
        <div className="rounded-3xl border border-primary/30 bg-surface p-10 md:p-14 relative overflow-hidden text-center">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-grad opacity-20 blur-3xl animate-pulse-neon" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para crecer con nosotros?</h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestros cursos certificados y únete a miles de profesionales de la salud que confían en Innovatech.
            </p>
            <Button asChild size="lg" className="bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
              <Link to="/">Explorar cursos</Link>
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

import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { Sparkles, ShieldCheck, GraduationCap, Stethoscope, ArrowRight, CheckCircle, BookOpen, Trophy, UserCheck, Brain, Monitor, TrendingUp, Globe, Users, Calculator, Heart, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { StepCard } from "@/components/StepCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Link } from "@tanstack/react-router";
import { COURSES } from "@/lib/courses";

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

            <div className="mt-8 flex flex-wrap gap-3 animate-in fade-in" style={{ animationDelay: "300ms" }}>
              <Button asChild size="lg" className="bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95 animate-in slide-in-from-bottom-2">
                <a href="#cursos">Explorar cursos <ArrowRight className="ml-1.5 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-glow border-primary/40 bg-surface/40 animate-in slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
                <a href="#nosotros">Conoce Innovatech</a>
              </Button>
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
            <p className="text-sm text-primary uppercase tracking-widest font-medium">Destacados</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Cursos destacados</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Nuestros cursos más populares en <span className="text-gradient font-semibold">Odontología y Salud</span>. Explora nuestro catálogo completo para más opciones.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="btn-glow border-primary/40 bg-surface/40">
            <Link to="/courses">Ver todos los cursos</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.slice(0, 3).map((c, i) => (
            <div key={c.id} className="animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 75}ms` }}>
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      </section>

      {/* ÁREAS DE CURSOS */}
      <section className="border-t border-border/60 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="text-sm text-primary uppercase tracking-widest font-medium">Catálogo completo</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Áreas de formación</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Desde salud clínica hasta tecnología e idiomas — una plataforma para todo el equipo profesional.
            </p>
          </div>

          <AreaCarousel />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="relative py-20 border-t border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-sm text-primary uppercase tracking-widest font-medium">Proceso simple</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Cómo funciona Innovatech</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Desde que creas tu cuenta hasta obtener tu certificado, el proceso es diseñado para tu conveniencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
            <StepCard number={1} icon={CheckCircle} title="Crea tu cuenta" description="Regístrate con tu email y RUT para acceder a todos los cursos." delay={0} />
            <StepCard number={2} icon={BookOpen} title="Selecciona un curso" description="Elige entre cursos certificados en salud, odontología e informática." delay={100} />
            <StepCard number={3} icon={Trophy} title="Aprende a tu ritmo" description="Completa unidades, descarga material, y responde evaluaciones cuando quieras." delay={200} />
            <StepCard number={4} icon={UserCheck} title="Obtén tu certificado" description="Al terminar todas las unidades, recibe tu certificado digital verificable." delay={300} />
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section className="border-t border-border/60 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-sm text-primary uppercase tracking-widest font-medium">Experiencia</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Cómo es aprender en Innovatech</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Acceso a contenido multimedia interactivo diseñado para tu aprendizaje continuo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Videos HD",
              description: "Clases en video de alta calidad impartidas por expertos en salud.",
              icon: "🎥",
            },
            {
              title: "Material descargable",
              description: "Artículos científicos, guías de estudio y protocolos en PDF para revisar en cualquier momento.",
              icon: "📄",
            },
            {
              title: "Evaluaciones",
              description: "Cuestionarios interactivos para medir tu comprensión de cada unidad.",
              icon: "✅",
            },
            {
              title: "Clases prácticas",
              description: "Sesiones presenciales en nuestras sedes para aplicar lo aprendido con instructores.",
              icon: "🏥",
            },
            {
              title: "Comunidad",
              description: "Conecta con otros profesionales de la salud en tu área de especialización.",
              icon: "👥",
            },
            {
              title: "Certificación",
              description: "Al completar, recibe tu certificado digital verificable por RUT.",
              icon: "🏆",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-primary/30 bg-surface/70 backdrop-blur p-8 card-glow"
              style={{
                animationDelay: `${i * 75}ms`,
              }}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="border-t border-border/60 container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm text-primary uppercase tracking-widest font-medium">Feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Lo que dicen nuestros estudiantes</h2>
        </div>

        <div className="relative overflow-hidden">
          {/* Fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          {/* Fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 animate-scroll-horizontal">
            {[
              {
                name: "Dra. María González",
                role: "Dentista especialista",
                specialty: "Endodoncia",
                quote: "Los cursos de Innovatech me permitieron perfeccionar mis técnicas de endodoncia con instructores de primer nivel. Altamente recomendado.",
              },
              {
                name: "Dr. Carlos Rodríguez",
                role: "Implantólogo",
                specialty: "Implantología digital",
                quote: "La combinación de teoría en video y prácticas presenciales es excepcional. Aprendí a usar flujos CAD/CAM en una sola semana.",
              },
              {
                name: "Lic. Patricia Soto",
                role: "Terapeuta ocupacional",
                specialty: "Bioseguridad clínica",
                quote: "Excelente contenido actualizado con las normas SENCE. El certificado fue reconocido inmediatamente en mi institución.",
              },
              {
                name: "Dra. María González",
                role: "Dentista especialista",
                specialty: "Endodoncia",
                quote: "Los cursos de Innovatech me permitieron perfeccionar mis técnicas de endodoncia con instructores de primer nivel. Altamente recomendado.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="flex-shrink-0 w-full md:w-1/3 min-w-[300px]">
                <TestimonialCard
                  {...testimonial}
                  delay={0}
                  noGlow={true}
                />
              </div>
            ))}
          </div>
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
              ].map(({ i: Icon, t }, idx) => (
                <li key={t} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary glow-soft flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "+8.000", l: "Estudiantes formados", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20" },
              { v: "98%", l: "Tasa de satisfacción", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
              { v: "+70h", l: "Horas de contenido", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
              { v: "SENCE", l: "Certificación oficial", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`rounded-2xl border ${s.bg} p-6 flex flex-col gap-1 animate-in fade-in zoom-in card-glow`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`text-3xl font-bold ${s.color}`}>{s.v}</div>
                <div className="text-xs text-muted-foreground leading-snug">{s.l}</div>
              </div>
            ))}
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

const AREA_ITEMS = [
  { icon: Stethoscope, label: "Odontología",          desc: "Implantología, endodoncia, ortodoncia y más",       color: "text-cyan-400",   bg: "bg-cyan-400/10   border-cyan-400/30",   soon: false },
  { icon: Heart,       label: "Salud General",         desc: "Primeros auxilios, bioseguridad, atención clínica", color: "text-rose-400",   bg: "bg-rose-400/10   border-rose-400/30",   soon: false },
  { icon: FlaskConical,label: "Imagenología",          desc: "Radiología, TAC y diagnóstico por imagen",          color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", soon: false },
  { icon: Monitor,     label: "Informática",           desc: "Office, manejo de sistemas y herramientas digitales",color: "text-blue-400",   bg: "bg-blue-400/10   border-blue-400/30",   soon: true  },
  { icon: Brain,       label: "Inteligencia Artificial",desc: "Uso de IA en entornos clínicos y empresariales",   color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/30", soon: true  },
  { icon: TrendingUp,  label: "Marketing",             desc: "Marketing digital, redes sociales y publicidad",    color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", soon: true  },
  { icon: Globe,       label: "Idiomas",               desc: "Inglés, inglés médico y comunicación profesional",  color: "text-green-400",  bg: "bg-green-400/10  border-green-400/30",  soon: true  },
  { icon: Users,       label: "Liderazgo",             desc: "Gestión de equipos, liderazgo clínico y coaching",  color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", soon: true  },
  { icon: Calculator,  label: "Administración",        desc: "Contabilidad, finanzas y gestión de clínicas",      color: "text-teal-400",   bg: "bg-teal-400/10   border-teal-400/30",   soon: true  },
];

function AreaCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const animId = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = () => {
      if (!isDragging.current && el) {
        el.scrollLeft += 0.7;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      animId.current = requestAnimationFrame(tick);
    };
    animId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId.current);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = ref.current!.scrollLeft;
    ref.current!.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.pageX - startX.current;
    ref.current!.scrollLeft = scrollStart.current - dx;
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (ref.current) ref.current.style.cursor = "grab";
  };

  return (
    <div className="relative py-3">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div
        ref={ref}
        className="flex gap-4 overflow-x-scroll hide-scrollbar cursor-grab select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {[...AREA_ITEMS, ...AREA_ITEMS].map(({ icon: Icon, label, desc, color, bg, soon }, i) => (
          <div
            key={i}
            className={`relative shrink-0 w-52 rounded-2xl border ${bg} bg-surface/60 backdrop-blur p-5 flex flex-col gap-3 card-glow transition-transform hover:-translate-y-1`}
          >
            {soon && (
              <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                Pronto
              </span>
            )}
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface ${color} border border-current/20`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className={`font-semibold text-sm ${color}`}>{label}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

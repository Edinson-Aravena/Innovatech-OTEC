import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, BookOpen, Clock, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { AREAS, COURSES } from "@/lib/courses";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Catálogo de cursos · Innovatech" },
      { name: "description", content: "Explora todos nuestros cursos certificados en salud, odontología e informática." },
    ],
  }),
  component: CoursesPage,
});

const LEVELS = ["Todos los niveles", "Básico", "Intermedio", "Avanzado"] as const;
const SORT_OPTIONS = [
  { label: "Más populares", value: "popular" },
  { label: "Menor precio", value: "price-asc" },
  { label: "Mayor precio", value: "price-desc" },
  { label: "Más horas", value: "hours-desc" },
] as const;

function CoursesPage() {
  const [area, setArea] = useState<(typeof AREAS)[number]>("Todas");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Todos los niveles");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("popular");
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [onlyPractical, setOnlyPractical] = useState(false);

  const filtered = useMemo(() => {
    let result = COURSES.filter((c) => {
      const matchArea = area === "Todas" || c.area === area;
      const matchLevel = level === "Todos los niveles" || c.level === level;
      const matchQ = !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase());
      const matchCertified = !onlyCertified || c.certified;
      const matchPractical = !onlyPractical || c.practicalSession;
      return matchArea && matchLevel && matchQ && matchCertified && matchPractical;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.priceClp - b.priceClp);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.priceClp - a.priceClp);
    if (sort === "hours-desc") result = [...result].sort((a, b) => b.hours - a.hours);

    return result;
  }, [area, level, q, sort, onlyCertified, onlyPractical]);

  const hasFilters = area !== "Todas" || level !== "Todos los niveles" || !!q || onlyCertified || onlyPractical;

  function clearFilters() {
    setArea("Todas");
    setLevel("Todos los niveles");
    setQ("");
    setOnlyCertified(false);
    setOnlyPractical(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="relative bg-hero overflow-hidden py-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="container mx-auto px-6 relative">
          <p className="text-sm text-primary uppercase tracking-widest font-medium mb-2">Catálogo completo</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Todos los <span className="text-gradient">cursos</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Formación certificada para profesionales de la salud y más áreas. Aprende a tu ritmo con clases prácticas incluidas.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            {[
              { icon: BookOpen, label: `${COURSES.length} cursos disponibles` },
              { icon: Award, label: `${COURSES.filter((c) => c.certified).length} cursos certificados SENCE` },
              { icon: Clock, label: `${COURSES.reduce((acc, c) => acc + c.hours, 0)}+ horas de contenido` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10">
        {/* BÚSQUEDA Y ORDENAR */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-surface-hi border-border/60"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="bg-surface-hi border border-border/60 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="lg:w-52 shrink-0 space-y-7">
            {/* Área */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Área</p>
              <div className="flex flex-col gap-0.5">
                {AREAS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      area === a
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hi"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Nivel */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Nivel</p>
              <div className="flex flex-col gap-0.5">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      level === l
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-hi"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros extra */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Filtros</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyCertified}
                    onChange={(e) => setOnlyCertified(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className={onlyCertified ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}>
                    Solo certificados SENCE
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyPractical}
                    onChange={(e) => setOnlyPractical(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className={onlyPractical ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}>
                    Con clase práctica
                  </span>
                </label>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Limpiar filtros
              </button>
            )}
          </aside>

          {/* RESULTADOS */}
          <div className="flex-1 min-w-0">
            {/* Filtros activos */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {area !== "Todas" && (
                  <Badge variant="outline" className="border-primary/40 text-primary gap-1 cursor-pointer hover:bg-primary/10" onClick={() => setArea("Todas")}>
                    {area} <X className="h-3 w-3" />
                  </Badge>
                )}
                {level !== "Todos los niveles" && (
                  <Badge variant="outline" className="border-primary/40 text-primary gap-1 cursor-pointer hover:bg-primary/10" onClick={() => setLevel("Todos los niveles")}>
                    {level} <X className="h-3 w-3" />
                  </Badge>
                )}
                {onlyCertified && (
                  <Badge variant="outline" className="border-primary/40 text-primary gap-1 cursor-pointer hover:bg-primary/10" onClick={() => setOnlyCertified(false)}>
                    Certificado SENCE <X className="h-3 w-3" />
                  </Badge>
                )}
                {onlyPractical && (
                  <Badge variant="outline" className="border-primary/40 text-primary gap-1 cursor-pointer hover:bg-primary/10" onClick={() => setOnlyPractical(false)}>
                    Con práctica <X className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-5">
              {filtered.length === 0
                ? "Sin resultados"
                : `${filtered.length} curso${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-24 rounded-2xl border border-border/60 bg-surface/40">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="font-medium text-muted-foreground">No hay cursos con esos filtros</p>
                <Button variant="ghost" size="sm" className="mt-3 text-primary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <div key={c.id} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 50}ms` }}>
                    <CourseCard course={c} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground mt-10">
        © {new Date().getFullYear()} Innovatech OTEC · Hecho con tecnología en Chile.
      </footer>
    </div>
  );
}

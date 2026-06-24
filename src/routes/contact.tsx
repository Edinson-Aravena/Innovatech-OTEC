import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto · Innovatech" },
      { name: "description", content: "Ponte en contacto con Innovatech para más información sobre nuestros cursos." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // Simular envío
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Mensaje enviado. Nos contactaremos pronto.");
    setFormData({ name: "", email: "", message: "" });
    setBusy(false);
  };

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
            Ponte en <span className="text-gradient">contacto</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            ¿Preguntas sobre nuestros cursos? Queremos escucharte.
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* INFO */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Información de contacto</h2>

            <div className="space-y-8">
              {[
                {
                  icon: Phone,
                  title: "Teléfono",
                  content: "+56 9 1234 5678",
                  subtext: "Lunes a viernes 9:00 - 18:00",
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: "hola@innovatech.cl",
                  subtext: "Respuesta en 24 horas",
                },
                {
                  icon: MapPin,
                  title: "Oficinas",
                  content: "Providencia, Santiago",
                  subtext: "Sede principal",
                },
                {
                  icon: Clock,
                  title: "Horario",
                  content: "Lunes a viernes",
                  subtext: "09:00 - 18:00 hrs",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex gap-4 animate-in fade-in slide-in-from-left-4"
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 glow-soft">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground">{item.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FORM */}
          <div className="rounded-2xl border border-primary/30 bg-surface/70 backdrop-blur p-8 card-glow animate-in fade-in">
            <h3 className="text-xl font-semibold mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-surface-hi border-border/60"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 bg-surface-hi border-border/60"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="message">Mensaje</Label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full min-h-32 rounded-lg bg-surface-hi border border-border/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95 mt-6"
              >
                {busy ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Innovatech OTEC · Hecho con tecnología en Chile.
      </footer>
    </div>
  );
}

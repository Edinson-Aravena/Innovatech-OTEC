import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/lib/cart";
import { COURSES, formatCLP } from "@/lib/courses";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatRut, isValidRut, cleanRut } from "@/lib/rut";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Innovatech" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [rut, setRut] = useState("");
  const [fullName, setFullName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [busy, setBusy] = useState(false);

  const cartCourses = COURSES.filter((c) => items.includes(c.id));
  const sum = total(COURSES);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, rut").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.rut) setRut(formatRut(data.rut));
      if (data?.full_name) setFullName(data.full_name);
    });
  }, [user]);

  if (!loading && !user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión para continuar</h1>
          <p className="text-muted-foreground mt-2">Necesitamos asociar tus cursos a tu cuenta.</p>
          <Button asChild className="mt-6 bg-cyan-grad text-neon-foreground btn-glow border-0">
            <Link to="/auth">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (cartCourses.length === 0) return toast.error("Tu carrito está vacío");
    if (!isValidRut(rut)) return toast.error("RUT inválido");
    if (cardNum.replace(/\s/g, "").length < 12) return toast.error("Número de tarjeta inválido");

    setBusy(true);
    // Simulación de pago
    await new Promise((r) => setTimeout(r, 1200));

    const rows = cartCourses.map((c) => ({
      user_id: user.id,
      course_id: c.id,
      rut: cleanRut(rut),
      amount_clp: c.priceClp,
    }));
    const { error } = await supabase.from("enrollments").upsert(rows, { onConflict: "user_id,course_id" });
    setBusy(false);
    if (error) return toast.error(error.message);

    // actualiza perfil si faltaba RUT
    await supabase.from("profiles").update({ rut: cleanRut(rut), full_name: fullName }).eq("id", user.id);

    toast.success("¡Pago aprobado! Tus cursos están listos.");
    clear();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Seguir comprando
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-[1fr_360px] gap-8">
          <form onSubmit={pay} className="space-y-6">
            <section className="rounded-2xl border border-border/60 bg-surface p-6">
              <h2 className="font-semibold mb-4">Datos del estudiante</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nombre completo</Label>
                  <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-surface-hi border-border/60" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>RUT (para certificación)</Label>
                  <Input required value={rut} onChange={(e) => setRut(formatRut(e.target.value))} placeholder="12.345.678-9" className="bg-surface-hi border-border/60" />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border/60 bg-surface p-6">
              <h2 className="font-semibold mb-1 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Datos de pago</h2>
              <p className="text-xs text-muted-foreground mb-4">Pago simulado · no se cobrará ninguna tarjeta real.</p>
              <div className="grid sm:grid-cols-6 gap-4">
                <div className="space-y-2 sm:col-span-6">
                  <Label>Número de tarjeta</Label>
                  <Input required value={cardNum} onChange={(e) => setCardNum(e.target.value.replace(/[^\d ]/g, "").slice(0, 19))} placeholder="4242 4242 4242 4242" className="bg-surface-hi border-border/60" />
                </div>
                <div className="space-y-2 sm:col-span-3">
                  <Label>Vencimiento</Label>
                  <Input required value={cardExp} onChange={(e) => setCardExp(e.target.value.slice(0, 5))} placeholder="MM/AA" className="bg-surface-hi border-border/60" />
                </div>
                <div className="space-y-2 sm:col-span-3">
                  <Label>CVC</Label>
                  <Input required value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" className="bg-surface-hi border-border/60" />
                </div>
              </div>
            </section>

            <Button type="submit" size="lg" disabled={busy || cartCourses.length === 0} className="w-full bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pagar {formatCLP(sum)}
            </Button>
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Datos encriptados — entorno de demo
            </p>
          </form>

          <aside className="rounded-2xl border border-border/60 bg-surface p-6 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Resumen</h3>
            <div className="space-y-3">
              {cartCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
              ) : cartCourses.map((c) => (
                <div key={c.id} className="flex justify-between gap-3 text-sm">
                  <span className="leading-tight">{c.title}</span>
                  <span className="text-muted-foreground whitespace-nowrap">{formatCLP(c.priceClp)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/60 my-4" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-gradient">{formatCLP(sum)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

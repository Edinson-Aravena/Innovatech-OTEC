import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { formatRut, cleanRut } from "@/lib/rut";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Ingresar · Innovatech" },
      { name: "description", content: "Ingresa o crea tu cuenta de Innovatech para acceder a tus cursos." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-grad glow">
            <Zap className="h-5 w-5 text-neon-foreground" />
          </span>
          <span className="text-2xl font-bold">Inno<span className="text-gradient">vatech</span></span>
        </Link>

        <div className="rounded-2xl border border-border/60 bg-surface/80 backdrop-blur-xl p-6 ring-neon">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full bg-surface-hi">
              <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="pt-4">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); return toast.error(error.message); }
    toast.success("¡Bienvenido de vuelta!");
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", authData.user!.id).maybeSingle();
    setBusy(false);
    navigate({ to: profile?.role === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface-hi border-border/60" />
      </div>
      <div className="space-y-2">
        <Label>Contraseña</Label>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-surface-hi border-border/60" />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Entrar
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanRut(rut).length < 7) return toast.error("RUT inválido — ingresa al menos 7 dígitos");
    if (password.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: fullName, rut: cleanRut(rut) },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message || "Error al crear la cuenta. Intenta de nuevo.");
    if (!data.user) return toast.error("Este correo ya está registrado. Inicia sesión en vez de crear cuenta.");
    toast.success("Cuenta creada. ¡Bienvenido!");
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre completo</Label>
        <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-surface-hi border-border/60" />
      </div>
      <div className="space-y-2">
        <Label>RUT</Label>
        <Input
          required
          value={rut}
          onChange={(e) => setRut(formatRut(e.target.value))}
          placeholder="11.111.111-1"
          className="bg-surface-hi border-border/60"
        />
        <p className="text-xs text-muted-foreground">Ingresa tu RUT con dígito verificador. Ejemplo: 11.111.111-1</p>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-surface-hi border-border/60" />
      </div>
      <div className="space-y-2">
        <Label>Contraseña</Label>
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-surface-hi border-border/60" />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95">
        {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Crear cuenta
      </Button>
    </form>
  );
}

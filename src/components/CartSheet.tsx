import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { COURSES, formatCLP } from "@/lib/courses";
import { Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { items, remove, total } = useCart();
  const cartCourses = COURSES.filter((c) => items.includes(c.id));
  const sum = total(COURSES);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-surface border-l border-border/60 text-foreground">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Tu carrito
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3 px-4">
          {cartCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Aún no agregas cursos.</p>
            </div>
          ) : (
            cartCourses.map((c) => (
              <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-surface-hi border border-border/60">
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.area} · {c.hours}h</p>
                  <p className="text-sm text-gradient font-semibold mt-1">{formatCLP(c.priceClp)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(c.id)} aria-label="Quitar">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cartCourses.length > 0 && (
          <SheetFooter className="mt-6 flex-col gap-3 px-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-gradient">{formatCLP(sum)}</span>
            </div>
            <Button
              asChild
              className="w-full bg-cyan-grad text-neon-foreground btn-glow border-0 hover:opacity-95"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/checkout">Ir a pagar</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function FloatingCTA() {
  return (
    <Link
      to="/select"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 md:hidden"
    >
      <ShoppingCart className="h-4 w-4" /> Buy Now
    </Link>
  );
}

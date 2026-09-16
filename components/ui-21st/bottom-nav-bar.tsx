"use client";

/**
 * Bottom Nav Bar — basado en el componente de @arunachalam en 21st.dev
 * (https://21st.dev/@arunachalam/components/bottom-nav-bar).
 *
 * Adaptado para el panel: recibe las pestañas y la activa desde fuera en vez
 * de llevarlas escritas dentro, y admite una etiqueta distinta a la del botón
 * para que «Más» pueda mostrar el nombre de la sección secundaria en curso.
 */

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Etiqueta que se despliega al estar activa, si difiere de `label`. */
  etiquetaActiva?: string;
}

const MOBILE_LABEL_WIDTH = 76;

type BottomNavBarProps = {
  items: BottomNavItem[];
  activo: string;
  onSelect: (id: string) => void;
  className?: string;
};

export function BottomNavBar({ items, activo, onSelect, className }: BottomNavBarProps) {
  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      aria-label="Navegación principal"
      className={cn(
        "flex h-[56px] items-center space-x-1 rounded-full border border-border bg-card p-2",
        className,
      )}
      style={{ boxShadow: "var(--sombra-flotante)" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activo === item.id;
        const texto = isActive ? (item.etiquetaActiva ?? item.label) : item.label;

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative flex h-10 min-h-[40px] min-w-[44px] items-center gap-0 rounded-full px-3 py-2 transition-colors duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-transparent text-muted-foreground hover:bg-muted",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
            onClick={() => onSelect(item.id)}
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}
            type="button"
          >
            <Icon size={21} strokeWidth={2} aria-hidden />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className="flex max-w-[76px] items-center overflow-hidden"
            >
              <span
                className={cn(
                  "overflow-hidden text-xs leading-[1.9] font-semibold text-ellipsis whitespace-nowrap select-none",
                  isActive ? "text-primary" : "opacity-0",
                )}
              >
                {texto}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

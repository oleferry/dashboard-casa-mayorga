"use client";

/**
 * Tubelight Navbar — basado en el componente de @ayushmxxn en 21st.dev
 * (https://21st.dev/@ayushmxxn/components/tubelight-navbar).
 *
 * Adaptado para el panel: la pestaña activa la controla el padre (sigue al
 * scroll), los enlaces son anclas de la misma página, el fondo es opaco para
 * leerse sobre tablas y la posición la decide quien lo monta.
 */

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  activo: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function NavBar({ items, activo, onSelect, className }: NavBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-card/85 p-1 backdrop-blur-lg",
        className,
      )}
      style={{ boxShadow: "var(--sombra-flotante)" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activo === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "true" : undefined}
            title={item.name}
            className={cn(
              "relative cursor-pointer rounded-full px-3 py-2 text-[13px] font-semibold transition-colors",
              "text-foreground/70 hover:text-primary",
              isActive && "text-primary",
            )}
          >
            <span className="hidden lg:inline">{item.name}</span>
            <span className="lg:hidden">
              <Icon size={18} strokeWidth={2.3} />
            </span>
            {isActive && (
              <motion.div
                layoutId="lamp"
                className="absolute inset-0 -z-10 w-full rounded-full bg-primary/10"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary">
                  <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-primary/20 blur-md" />
                  <div className="absolute -top-1 h-6 w-8 rounded-full bg-primary/20 blur-md" />
                  <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-primary/20 blur-sm" />
                </div>
              </motion.div>
            )}
          </a>
        );
      })}
    </div>
  );
}

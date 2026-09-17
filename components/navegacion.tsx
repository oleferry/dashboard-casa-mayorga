"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  ClipboardCheck,
  Ellipsis,
  FolderOpen,
  HardHat,
  Landmark,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Receipt,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { NavBar, type NavItem } from "./ui-21st/tubelight-navbar";
import { BottomNavBar } from "./ui-21st/bottom-nav-bar";

/** Secciones de la página, en orden. Los iconos viven aquí porque son componentes de cliente. */
const SECCIONES: NavItem[] = [
  { id: "resumen", name: "Resumen", icon: LayoutDashboard },
  { id: "costes", name: "Costes", icon: Receipt },
  { id: "obra", name: "Obra", icon: HardHat },
  { id: "certificaciones", name: "Certificaciones", icon: ClipboardCheck },
  { id: "capitulos", name: "Capítulos", icon: Layers },
  { id: "hipoteca", name: "Hipoteca", icon: Landmark },
  { id: "cronologia", name: "Cronología", icon: CalendarClock },
  { id: "diseno", name: "Diseño", icon: Lightbulb },
  { id: "documentos", name: "Documentos", icon: FolderOpen },
  { id: "obligaciones", name: "Seguros", icon: ShieldCheck },
  { id: "alertas", name: "Alertas", icon: TriangleAlert },
];

/** En móvil sólo caben cinco botones: cuatro fijos y «Más» para el resto. */
const PRINCIPALES_MOVIL = ["resumen", "costes", "obra", "alertas"];
const MAS = "__mas";

/**
 * Detecta qué sección ocupa la franja central de la pantalla. Se usa una
 * franja estrecha en vez del umbral por defecto para que la pestaña activa
 * cambie cuando la sección llega a la zona de lectura, no al asomar.
 */
function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState(ids[0]);

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting);
        if (visibles.length > 0) setActiva(visibles[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [ids]);

  return [activa, setActiva] as const;
}

const IDS = SECCIONES.map((s) => s.id);

export function Navegacion() {
  const [activa, setActiva] = useSeccionActiva(IDS);
  const [masAbierto, setMasAbierto] = useState(false);

  const principales = SECCIONES.filter((s) => PRINCIPALES_MOVIL.includes(s.id));
  const secundarias = SECCIONES.filter((s) => !PRINCIPALES_MOVIL.includes(s.id));
  const secundariaActiva = secundarias.find((s) => s.id === activa);

  const irA = (id: string) => {
    setActiva(id);
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  };

  // Cierra la hoja de «Más» con Escape.
  useEffect(() => {
    if (!masAbierto) return;
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setMasAbierto(false);
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [masAbierto]);

  return (
    <>
      {/* Escritorio: barra tipo tubo de luz, pegada arriba al hacer scroll. */}
      <div className="no-imprimir sticky top-4 z-40 hidden justify-center px-5 md:flex">
        <NavBar items={SECCIONES} activo={activa} onSelect={setActiva} />
      </div>

      {/* Móvil: barra inferior flotante. */}
      <div
        className="no-imprimir fixed inset-x-0 z-40 flex justify-center px-3 md:hidden"
        style={{ bottom: "calc(0.9rem + env(safe-area-inset-bottom))" }}
      >
        <BottomNavBar
          items={[
            ...principales.map((s) => ({ id: s.id, label: s.name, icon: s.icon })),
            {
              id: MAS,
              label: "Más",
              icon: Ellipsis,
              etiquetaActiva: secundariaActiva?.name ?? "Más",
            },
          ]}
          activo={masAbierto || secundariaActiva ? MAS : activa}
          onSelect={(id) => (id === MAS ? setMasAbierto((v) => !v) : irA(id))}
        />
      </div>

      {/* Hoja con las secciones que no caben en la barra móvil. */}
      <AnimatePresence>
        {masAbierto && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar"
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMasAbierto(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Más secciones"
              className="fixed inset-x-3 z-50 rounded-3xl border border-border bg-card p-3 md:hidden"
              style={{
                bottom: "calc(5.4rem + env(safe-area-inset-bottom))",
                boxShadow: "var(--sombra-flotante)",
              }}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <div className="mb-2 flex items-center justify-between px-2 pt-1">
                <p className="suave text-[0.7rem] font-semibold tracking-[0.08em] uppercase">
                  Más secciones
                </p>
                <button
                  type="button"
                  onClick={() => setMasAbierto(false)}
                  className="tenue grid size-8 place-items-center rounded-full hover:bg-muted"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {secundarias.map((s) => {
                  const Icono = s.icon;
                  const esActiva = s.id === activa;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setMasAbierto(false);
                        irA(s.id);
                      }}
                      className={
                        "flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-medium transition-colors " +
                        (esActiva ? "bg-primary/10 text-primary" : "tenue hover:bg-muted")
                      }
                    >
                      <Icono size={20} strokeWidth={2} />
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

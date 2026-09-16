"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
});

// useLayoutEffect avisa en el servidor; allí basta con useEffect.
const useEfectoAntesDePintar = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Cifra en euros que cuenta desde cero al entrar en pantalla.
 *
 * El servidor pinta ya la cifra final, así que sin JavaScript, al imprimir o
 * con «reducir movimiento» activado se ve el número correcto. La animación
 * escribe directamente en el nodo para no provocar renders en cada fotograma.
 */
export function CifraAnimada({ valor, sufijo = "" }: { valor: number; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reducir = useReducedMotion();
  const final = eur.format(valor) + sufijo;
  const preparada = useRef(false);

  // Antes del primer pintado se pone a cero, para que no se vea el salto.
  useEfectoAntesDePintar(() => {
    if (reducir || !ref.current) return;
    ref.current.textContent = eur.format(0) + sufijo;
    preparada.current = true;
  }, []);

  useEffect(() => {
    if (!enVista || !ref.current || !preparada.current) return;
    const nodo = ref.current;
    const control = animate(0, valor, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        nodo.textContent = eur.format(v) + sufijo;
      },
    });
    return () => control.stop();
  }, [enVista, valor, sufijo]);

  // Nunca imprimir una cifra a medio animar.
  useEffect(() => {
    const alImprimir = () => {
      if (ref.current) ref.current.textContent = final;
    };
    window.addEventListener("beforeprint", alImprimir);
    return () => window.removeEventListener("beforeprint", alImprimir);
  }, [final]);

  return <span ref={ref}>{final}</span>;
}

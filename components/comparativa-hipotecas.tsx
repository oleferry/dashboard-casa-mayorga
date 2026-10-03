import type { ReactNode } from "react";
import { Panel, Tabla, Td, Th } from "./ui";
import { euros, fechaCorta, pct } from "@/lib/formato";
import { cuotaFrancesa } from "@/lib/calculos";
import { ofertasHipoteca, type OfertaHipoteca } from "@/lib/ofertas";

/** Capital común para comparar cuotas en igualdad de condiciones. */
const CAPITAL_COMUN = 265000;

function tinMaximo(o: OfertaHipoteca) {
  const suelo = o.tipoInicial?.tin ?? 0;
  return Math.max(o.tinSinBonificar - o.bonificacionMaxima, suelo);
}

const cuota = (o: OfertaHipoteca, tin: number, capital = o.importe) =>
  cuotaFrancesa(capital, tin, o.cuotas);

type Fila = { clave: string; nota?: string; valor: (o: OfertaHipoteca) => ReactNode; cifra?: boolean };

const filas: Fila[] = [
  { clave: "Estado", valor: (o) => o.estado },
  { clave: "Importe", valor: (o) => euros(o.importe), cifra: true },
  { clave: "Calculado sobre", valor: (o) => o.calculadoSobre },
  {
    clave: "Plazo",
    valor: (o) => `${o.carenciaMeses} meses de carencia + ${o.cuotas} cuotas`,
  },
  {
    clave: "Tipo fijo sin bonificar",
    valor: (o) =>
      o.tipoInicial
        ? `${pct(o.tipoInicial.tin, 2)} los ${o.tipoInicial.meses} primeros meses, luego ${pct(o.tinSinBonificar, 2)}`
        : pct(o.tinSinBonificar, 2),
  },
  {
    clave: "Tipo con la bonificación máxima",
    valor: (o) => `${pct(tinMaximo(o), 2)} (−${pct(o.bonificacionMaxima, 2)})`,
    cifra: true,
  },
  {
    clave: "Tipo con lo que compensa contratar",
    valor: (o) => (
      <>
        <span className="cifra font-medium">{pct(o.tinRazonable, 2)}</span>
        <span className="suave block text-xs leading-snug">{o.tinRazonableNota}</span>
      </>
    ),
  },
  {
    clave: "Cuota sin bonificar",
    nota: "Sobre el importe de cada oferta",
    valor: (o) => `${euros(cuota(o, o.tinSinBonificar))}/mes`,
    cifra: true,
  },
  {
    clave: "Cuota con lo que compensa contratar",
    nota: "Sobre el importe de cada oferta",
    valor: (o) => (
      <span className="font-semibold" style={{ color: "var(--marca)" }}>
        {euros(cuota(o, o.tinRazonable))}/mes
      </span>
    ),
    cifra: true,
  },
  {
    clave: `Cuota por cada ${euros(CAPITAL_COMUN)}`,
    nota: "Mismo capital, con lo que compensa contratar",
    valor: (o) => `${euros(cuota(o, o.tinRazonable, CAPITAL_COMUN))}/mes`,
    cifra: true,
  },
  {
    clave: "Intereses de la amortización",
    nota: "Con lo que compensa contratar, sin la carencia",
    valor: (o) => euros(cuota(o, o.tinRazonable) * o.cuotas - o.importe),
    cifra: true,
  },
  { clave: "Bonificaciones", valor: (o) => (
      <ul className="list-disc space-y-0.5 pl-4 text-xs leading-snug">
        {o.bonificaciones.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    ),
  },
  { clave: "Coste de bonificarse", valor: (o) => o.costeBonificaciones },
  { clave: "Entregas del dinero", valor: (o) => o.disposiciones },
  { clave: "Amortización anticipada", valor: (o) => o.amortizacionAnticipada },
  { clave: "Gastos de la hipoteca", valor: (o) => o.gastos },
  {
    clave: "Fondos propios que calcula el banco",
    valor: (o) => (o.fondosPropiosSegunBanco ? euros(o.fondosPropiosSegunBanco) : "—"),
    cifra: true,
  },
];

export function ComparativaHipotecas() {
  return (
    <div className="mt-4 space-y-4">
      <Tabla>
        <thead>
          <tr>
            <Th ancho="14rem">Comparativa de ofertas</Th>
            {ofertasHipoteca.map((o) => (
              <Th key={o.entidad}>
                <a
                  href={o.documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {o.entidad} · {fechaCorta(o.fecha)} ↗
                </a>
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.clave}>
              <Td>
                <span className="text-sm">{f.clave}</span>
                {f.nota && <span className="suave block text-xs leading-snug">{f.nota}</span>}
              </Td>
              {ofertasHipoteca.map((o) => (
                <Td key={o.entidad} className={`text-sm leading-snug ${f.cifra ? "cifra" : ""}`}>
                  {f.valor(o)}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Tabla>

      <Panel>
        <h3 className="mb-2 text-sm font-semibold">Cómo leer la comparativa</h3>
        <ul className="tenue list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
          <li>
            Euro a euro salen casi iguales: con lo que compensa contratar, Unicaja queda al 2,55 % y
            CaixaBank al 2,60 %. Con todo contratado, 2,40 % frente a 2,45 %. La diferencia de cuota
            viene sobre todo de que CaixaBank presta 25.000 € más.
          </li>
          <li>
            La alarma de CaixaBank no compensa: 798,60 €/año para rebajar un 0,15 %, que son unos 435
            €/año de intereses al principio y menos cada año. Unicaja llega a su tope sin seguro de
            vida si se trasladan 60.000 € en fondos.
          </li>
          <li>
            CaixaBank no entrega nada hasta que la tasación certifique 138.519 € de obra: la 1.ª
            certificación y las siguientes salen de ahorros hasta ese punto. Además calcula el préstamo
            y los fondos propios sobre el presupuesto de 361.327 € y no sobre el contrato real.
          </li>
          <li>
            Si se piensa amortizar antes de tiempo, Unicaja cobra como mucho un 0,5 % y CaixaBank hasta
            un 2 %.
          </li>
          <li>
            Unicaja ya ha emitido la FEIN y caduca el 31 de octubre. CaixaBank sólo ha aprobado por
            correo: para comparar en firme habría que pedirle la FEIN.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

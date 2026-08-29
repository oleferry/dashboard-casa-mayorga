import { Cabecera } from "@/components/cabecera";
import {
  FichaProyecto,
  SeccionAlertas,
  SeccionCapitulos,
  SeccionCronologia,
  SeccionDocumentos,
  SeccionHipoteca,
} from "@/components/secciones";
import {
  BarraApilada,
  BarraProgreso,
  Etiqueta,
  Kpi,
  ListaDatos,
  Panel,
  Seccion,
  Tabla,
  Td,
  Th,
} from "@/components/ui";
import { calcularHipoteca, calcularProyecto } from "@/lib/calculos";
import { hojaCostes } from "@/lib/documentos";
import { euros, fechaCorta, num, pct } from "@/lib/formato";
import { leerHoja } from "@/lib/hoja";
import { ejecucion, fechasPago, hipoteca, proyecto } from "@/lib/proyecto";

export const revalidate = 300;

export default async function Panel_() {
  const hoja = await leerHoja(fechasPago);
  const c = calcularProyecto(hoja);
  const h = calcularHipoteca();

  return (
    <>
      <Cabecera enVivo={hoja.enVivo} leidoEn={hoja.leidoEn} />

      <main className="mx-auto max-w-6xl space-y-14 px-5 py-10">
        {!hoja.enVivo && (
          <div
            className="panel p-4 text-sm"
            style={{ borderLeftWidth: 3, borderLeftColor: "var(--aviso)" }}
          >
            <p className="font-medium">No se ha podido leer la hoja de costes en vivo.</p>
            <p className="tenue mt-1 text-xs leading-relaxed">
              Se muestran los últimos datos guardados en el repositorio. Motivo: {hoja.error}. Para
              que la lectura en vivo funcione, la hoja debe estar compartida como «cualquier persona
              con el enlace puede ver».
            </p>
          </div>
        )}

        {/* ------------------------------------------------------- Resumen */}

        <Seccion
          id="resumen"
          titulo="Resumen económico"
          descripcion="Coste total previsto del proyecto completo: obra, solar, impuestos, proyecto técnico y gastos de financiación."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Kpi
              etiqueta="Coste total previsto"
              valor={euros(c.totalProyecto)}
              nota={`${euros(c.costeM2Proyecto)}/m² · ${euros(c.totalConReserva)} con reserva del 5%`}
              destacado
            />
            <Kpi
              etiqueta="Pagado a fecha"
              valor={euros(c.pagado)}
              nota={`${pct(c.avance)} del coste total, todo con fondos propios`}
              tono="marca"
            />
            <Kpi
              etiqueta="Pendiente de pago"
              valor={euros(c.pendiente)}
              nota={`${euros(c.otrosPendiente)} fuera de obra + ${euros(c.obra.total)} de ejecución`}
              tono="aviso"
            />
            <Kpi
              etiqueta="Hipoteca prevista"
              valor={euros(c.hipotecaImporte)}
              nota={`${pct(c.coberturaHipotecaProyecto)} del coste total · LTV ${pct(c.ltv)} sobre tasación`}
            />
            <Kpi
              etiqueta="Fondos propios que faltan"
              valor={euros(c.fondosPropiosRestantes)}
              nota={`Sobre ${euros(c.fondosPropiosProyecto)} totales; ya se han aportado ${euros(c.pagado)}`}
              tono="critico"
            />
            <Kpi
              etiqueta="Coste bancario mensual"
              valor={`${euros(h.costeMensual)}/mes`}
              nota={`Cuota ${euros(hipoteca.cuotaMensual)} + seguro de hogar ${euros(h.seguroMensual)}`}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <h3 className="mb-1 text-sm font-semibold">Cómo se financia el proyecto</h3>
              <p className="suave mb-4 text-xs leading-relaxed">
                Sobre el coste total de {euros(c.totalProyecto)}, sin contar la reserva para
                desviaciones.
              </p>
              <BarraApilada
                formato={euros}
                tramos={[
                  { etiqueta: "Hipoteca Unicaja", valor: c.hipotecaImporte, color: "var(--marca)" },
                  {
                    etiqueta: "Fondos propios ya aportados",
                    valor: c.pagado,
                    color: "var(--aviso)",
                  },
                  {
                    etiqueta: "Fondos propios pendientes",
                    valor: c.fondosPropiosRestantes,
                    color: "var(--critico)",
                  },
                ]}
              />

              <div className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-2">
                <div>
                  <p className="suave mb-2 text-[0.7rem] font-medium tracking-[0.06em] uppercase">
                    Sólo ejecución de obra
                  </p>
                  <ListaDatos
                    datos={[
                      { clave: "Ejecución con IVA", valor: euros(c.obra.total) },
                      { clave: "Hipoteca", valor: `−${euros(c.hipotecaImporte)}` },
                      {
                        clave: "Aportación propia",
                        valor: (
                          <span style={{ color: "var(--aviso)" }}>
                            {euros(c.fondosPropiosEjecucion)}
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className="suave mb-2 text-[0.7rem] font-medium tracking-[0.06em] uppercase">
                    Proyecto completo
                  </p>
                  <ListaDatos
                    datos={[
                      { clave: "Coste total", valor: euros(c.totalProyecto) },
                      { clave: "Hipoteca", valor: `−${euros(c.hipotecaImporte)}` },
                      {
                        clave: "Aportación propia",
                        valor: (
                          <span style={{ color: "var(--critico)" }}>
                            {euros(c.fondosPropiosProyecto)}
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              <p className="tenue mt-4 border-t pt-3 text-xs leading-relaxed">
                Con la reserva del 5% sobre la ejecución ({euros(c.obra.reserva)}), la aportación
                propia total sube a <strong>{euros(c.fondosPropiosConReserva)}</strong>. La tasación
                en hipótesis de edificio terminado es de {euros(hipoteca.tasacion)}, es decir{" "}
                {euros(c.plusvaliaTeorica)} por encima del coste total previsto.
              </p>
            </Panel>

            <FichaProyecto />
          </div>
        </Seccion>

        {/* -------------------------------------------------------- Costes */}

        <Seccion
          id="costes"
          titulo="Costes acumulados por concepto"
          descripcion="Lectura directa de la hoja de control de costes. Cada bloque agrupa las partidas de un mismo concepto y acumula lo comprometido, lo pagado y lo pendiente."
          acciones={
            <a
              href={hojaCostes}
              target="_blank"
              rel="noopener noreferrer"
              className="no-imprimir panel px-3 py-1.5 text-sm transition-colors hover:bg-[var(--panel-2)]"
            >
              Abrir la hoja ↗
            </a>
          }
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <Kpi etiqueta="Comprometido" valor={euros(hoja.total)} />
            <Kpi etiqueta="Pagado" valor={euros(hoja.pagado)} tono="marca" />
            <Kpi etiqueta="Pendiente" valor={euros(hoja.pendiente)} tono="aviso" />
            <Kpi
              etiqueta="Reparto entre pagadores"
              valor={`${euros(hoja.pagadoA)} / ${euros(hoja.pagadoB)}`}
              nota="Pagador A / Pagador B, según columnas de la hoja"
            />
          </div>

          <div className="space-y-3">
            {hoja.grupos.map((g) => (
              <details key={g.nombre} className="panel overflow-hidden" open>
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-[var(--panel-2)]">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{g.nombre}</p>
                    <p className="suave mt-0.5 text-xs">
                      {g.lineas.length} {g.lineas.length === 1 ? "partida" : "partidas"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div className="text-right">
                      <p className="suave text-[0.65rem] tracking-wide uppercase">Total</p>
                      <p className="cifra text-sm font-semibold">{euros(g.total)}</p>
                    </div>
                    <div className="text-right">
                      <p className="suave text-[0.65rem] tracking-wide uppercase">Pagado</p>
                      <p className="cifra text-sm" style={{ color: "var(--marca)" }}>
                        {euros(g.pagado)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="suave text-[0.65rem] tracking-wide uppercase">Pendiente</p>
                      <p
                        className="cifra text-sm"
                        style={{ color: g.pendiente > 0 ? "var(--aviso)" : "var(--suave)" }}
                      >
                        {euros(g.pendiente)}
                      </p>
                    </div>
                    <div className="w-24">
                      <BarraProgreso valor={g.pagado} maximo={g.total} />
                    </div>
                  </div>
                </summary>

                <div className="overflow-x-auto border-t">
                  <table className="w-full min-w-[38rem] border-collapse text-sm">
                    <thead>
                      <tr style={{ background: "var(--panel-2)" }}>
                        <Th>Partida</Th>
                        <Th numero ancho="7rem">Base</Th>
                        <Th numero ancho="6rem">Impuestos</Th>
                        <Th numero ancho="7rem">Total</Th>
                        <Th numero ancho="7rem">Pagado</Th>
                        <Th numero ancho="7rem">Pendiente</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.lineas.map((l, i) => (
                        <tr key={`${l.concepto}-${i}`}>
                          <Td>
                            <p className="leading-snug">{l.concepto}</p>
                            {l.descripcion && (
                              <p className="suave mt-0.5 text-xs leading-snug">{l.descripcion}</p>
                            )}
                            {l.fecha && (
                              <p className="suave cifra mt-0.5 text-xs">
                                Pagado el {fechaCorta(l.fecha)}
                              </p>
                            )}
                          </Td>
                          <Td numero className="tenue">
                            {euros(l.precio)}
                          </Td>
                          <Td numero className="tenue">
                            {euros(l.impuestos)}
                          </Td>
                          <Td numero fuerte>
                            {euros(l.total)}
                          </Td>
                          <Td numero>
                            <span style={{ color: l.pagado > 0 ? "var(--marca)" : "var(--suave)" }}>
                              {euros(l.pagado)}
                            </span>
                          </Td>
                          <Td numero>
                            <span
                              style={{ color: l.pendiente > 0 ? "var(--aviso)" : "var(--suave)" }}
                            >
                              {euros(l.pendiente)}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>

          <p className="suave mt-4 text-xs leading-relaxed">
            La hoja no registra todavía la fecha de cada pago. Añadiendo una columna «Fecha» junto a
            «Pagado» este panel podrá mostrar la evolución del gasto en el tiempo. Las fechas que ya
            aparecen se han verificado contra recibos y facturas.
          </p>
        </Seccion>

        {/* ---------------------------------------------------------- Obra */}

        <Seccion
          id="obra"
          titulo="Ejecución de obra"
          descripcion="Presupuesto acordado con el constructor. Es la partida que financia la hipoteca y todavía no ha empezado a facturarse."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabla>
                <thead>
                  <tr>
                    <Th>Concepto</Th>
                    <Th numero ancho="8rem">Base imponible</Th>
                    <Th numero ancho="7rem">IVA 10%</Th>
                    <Th numero ancho="8rem">Total</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>Contrato principal</Td>
                    <Td numero>{euros(c.obra.baseContrato)}</Td>
                    <Td numero className="tenue">
                      {euros(c.obra.ivaContrato)}
                    </Td>
                    <Td numero fuerte>
                      {euros(c.obra.totalContrato)}
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      Trabajos facturados aparte
                      <span className="suave mt-0.5 block text-xs">
                        Controlar como partida diferenciada
                      </span>
                    </Td>
                    <Td numero>{euros(c.obra.baseAparte)}</Td>
                    <Td numero className="tenue">
                      {euros(c.obra.ivaAparte)}
                    </Td>
                    <Td numero fuerte>
                      {euros(c.obra.totalAparte)}
                    </Td>
                  </tr>
                  <tr style={{ background: "var(--panel-2)" }}>
                    <Td fuerte>Ejecución estimada</Td>
                    <Td numero fuerte>
                      {euros(c.obra.base)}
                    </Td>
                    <Td numero fuerte>
                      {euros(c.obra.iva)}
                    </Td>
                    <Td numero fuerte>
                      {euros(c.obra.total)}
                    </Td>
                  </tr>
                  <tr>
                    <Td className="tenue">
                      Reserva para desviaciones ({pct(ejecucion.reservaTipo, 0)})
                    </Td>
                    <Td numero className="suave">
                      —
                    </Td>
                    <Td numero className="suave">
                      —
                    </Td>
                    <Td numero>
                      <span style={{ color: "var(--aviso)" }}>{euros(c.obra.reserva)}</span>
                    </Td>
                  </tr>
                  <tr style={{ background: "var(--panel-2)" }}>
                    <Td fuerte>Presupuesto de control</Td>
                    <Td numero className="suave">
                      —
                    </Td>
                    <Td numero className="suave">
                      —
                    </Td>
                    <Td numero fuerte>
                      {euros(c.obra.control)}
                    </Td>
                  </tr>
                </tbody>
              </Tabla>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Kpi
                  etiqueta="Coste por m² sin IVA"
                  valor={euros(c.obra.costeM2SinIva)}
                  nota={`Sobre ${num(proyecto.superficieConstruida)} m² construidos`}
                />
                <Kpi etiqueta="Coste por m² con IVA" valor={euros(c.obra.costeM2ConIva)} />
                <Kpi
                  etiqueta="Certificado a fecha"
                  valor={euros(0)}
                  nota="La obra aún no ha empezado a facturarse"
                />
              </div>
            </div>

            <Panel>
              <h3 className="mb-1 text-sm font-semibold">Referencias presupuestarias</h3>
              <p className="suave mb-3 text-xs leading-relaxed">
                Cifras con finalidades distintas. No deben usarse indistintamente para medir el
                coste real.
              </p>
              <ul className="space-y-3">
                {ejecucion.referencias.map((r) => (
                  <li key={r.etiqueta} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm leading-snug">{r.etiqueta}</p>
                      <span
                        className="cifra shrink-0 text-sm font-medium"
                        style={r.destacado ? { color: "var(--marca)" } : undefined}
                      >
                        {euros(r.importe)}
                      </span>
                    </div>
                    <p className="suave mt-0.5 text-xs leading-snug">{r.funcion}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t pt-3">
                <Etiqueta tono="marca">
                  −{euros((297395 - 280000) * 1.1)} frente a la oferta inicial
                </Etiqueta>
              </div>
            </Panel>
          </div>
        </Seccion>

        <SeccionCapitulos />
        <SeccionHipoteca />
        <SeccionCronologia />
        <SeccionDocumentos />
        <SeccionAlertas />

        <footer className="tenue border-t pt-6 pb-4 text-xs leading-relaxed">
          <p>
            Panel de control de la vivienda en {proyecto.direccion}. Los costes se leen de la hoja
            de Google Sheets y se refrescan cada 5 minutos; el resto de datos se edita en{" "}
            <code className="rounded px-1" style={{ background: "var(--raya)" }}>
              lib/proyecto.ts
            </code>
            .
          </p>
          <p className="suave mt-1.5">
            Documento interno. Contiene información económica y personal: no compartir el enlace
            fuera del círculo de los promotores.
          </p>
        </footer>
      </main>
    </>
  );
}

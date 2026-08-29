import { capitulos, ejecucion, hipoteca, proyecto } from "./proyecto";
import type { DatosHoja } from "./hoja";

export function calcularEjecucion() {
  const baseContrato = ejecucion.contratoPrincipal;
  const baseAparte = ejecucion.trabajosAparte;
  const base = baseContrato + baseAparte;
  const iva = base * ejecucion.ivaTipo;
  const total = base + iva;
  const reserva = total * ejecucion.reservaTipo;

  return {
    baseContrato,
    ivaContrato: baseContrato * ejecucion.ivaTipo,
    totalContrato: baseContrato * (1 + ejecucion.ivaTipo),
    baseAparte,
    ivaAparte: baseAparte * ejecucion.ivaTipo,
    totalAparte: baseAparte * (1 + ejecucion.ivaTipo),
    base,
    iva,
    total,
    reserva,
    control: total + reserva,
    costeM2SinIva: base / proyecto.superficieConstruida,
    costeM2ConIva: total / proyecto.superficieConstruida,
  };
}

export function calcularProyecto(hoja: DatosHoja) {
  const obra = calcularEjecucion();

  // La hoja recoge todo lo que no es ejecución de obra: solar, gastos de
  // compraventa, proyecto, licencia, tasación y gastos de hipoteca.
  const otrosCostes = hoja.total;
  const otrosPagado = hoja.pagado;
  const otrosPendiente = hoja.total - hoja.pagado;

  const totalProyecto = obra.total + otrosCostes;
  const totalConReserva = obra.control + otrosCostes;

  const pagado = otrosPagado;
  const pendiente = totalProyecto - pagado;
  const avance = totalProyecto > 0 ? pagado / totalProyecto : 0;

  const hipotecaImporte = hipoteca.disposicionPrevista;
  const fondosPropiosProyecto = totalProyecto - hipotecaImporte;
  const fondosPropiosConReserva = totalConReserva - hipotecaImporte;
  const fondosPropiosEjecucion = obra.total - hipotecaImporte;
  const fondosPropiosRestantes = fondosPropiosProyecto - pagado;

  return {
    obra,
    otrosCostes,
    otrosPagado,
    otrosPendiente,
    totalProyecto,
    totalConReserva,
    pagado,
    pendiente,
    avance,
    hipotecaImporte,
    fondosPropiosProyecto,
    fondosPropiosConReserva,
    fondosPropiosEjecucion,
    fondosPropiosRestantes,
    coberturaHipotecaEjecucion: hipotecaImporte / obra.total,
    coberturaHipotecaProyecto: hipotecaImporte / totalProyecto,
    ltv: hipotecaImporte / hipoteca.tasacion,
    costeM2Proyecto: totalProyecto / proyecto.superficieConstruida,
    plusvaliaTeorica: hipoteca.tasacion - totalProyecto,
  };
}

/**
 * Reparte el contrato principal entre los capítulos del proyecto técnico
 * usando el peso relativo de cada capítulo. Sirve como referencia para
 * validar certificaciones de obra, no como precio contractual.
 */
export function calcularCapitulos() {
  const totalTecnico = capitulos.reduce((a, c) => a + c.importe, 0);

  return {
    totalTecnico,
    filas: capitulos
      .map((c) => {
        const peso = c.importe / totalTecnico;
        return {
          ...c,
          peso,
          estimacionOperativa: peso * ejecucion.contratoPrincipal,
        };
      })
      .sort((a, b) => b.importe - a.importe),
  };
}

export function calcularHipoteca() {
  const seguroMensual = hipoteca.seguroHogarAnual / 12;
  const costeMensual = hipoteca.cuotaMensual + seguroMensual;
  const totalIntereses = hipoteca.cuotaMensual * hipoteca.plazoMeses - hipoteca.disposicionPrevista;

  return {
    seguroMensual,
    costeMensual,
    totalIntereses,
    totalDevuelto: hipoteca.cuotaMensual * hipoteca.plazoMeses,
    anios: hipoteca.plazoMeses / 12,
    cuotaSinBonificar: cuotaFrancesa(
      hipoteca.disposicionPrevista,
      hipoteca.tinBase,
      hipoteca.plazoMeses,
    ),
    alternativas: hipoteca.alternativasFondo.map((a) => ({
      ...a,
      salidaMensualTotal: costeMensual + a.aportacionAnual / 12,
    })),
  };
}

/** Cuota de un préstamo francés. */
export function cuotaFrancesa(capital: number, tinAnual: number, meses: number) {
  const i = tinAnual / 12;
  if (i === 0) return capital / meses;
  return (capital * i) / (1 - Math.pow(1 + i, -meses));
}

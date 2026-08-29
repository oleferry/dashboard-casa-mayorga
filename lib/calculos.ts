import { capitulos, ejecucion, financiacion, hipoteca, proyecto } from "./proyecto";
import type { DatosHoja } from "./hoja";

/**
 * Capacidad de financiación: el banco presta un porcentaje del MENOR entre la
 * tasación y el coste total de la promoción (ejecución más suelo escriturado).
 */
export function calcularCapacidad() {
  const costePromocion = financiacion.costeEjecucionProyecto + financiacion.valorSueloEscriturado;
  const base = Math.min(hipoteca.tasacion, costePromocion);

  return {
    costePromocion,
    tasacion: hipoteca.tasacion,
    base,
    baseEsCoste: costePromocion <= hipoteca.tasacion,
    limiteTeorico: base * financiacion.porcentajeMaximo,
    ofrecido: hipoteca.importeMaximoOfrecido,
    porcentajeOfrecido: hipoteca.importeMaximoOfrecido / base,
    disposicionPrevista: hipoteca.disposicionPrevista,
    margenSinUsar: hipoteca.importeMaximoOfrecido - hipoteca.disposicionPrevista,
  };
}

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

  // La hipoteca financia obra ejecutada. El IVA y todo lo que no es obra
  // (suelo, impuestos, honorarios, tasación, mobiliario) sale de ahorros.
  const obraFinanciable = obra.base;
  const cubiertoPorHipoteca = Math.min(hipotecaImporte, obraFinanciable);
  const obraSinCubrir = obraFinanciable - cubiertoPorHipoteca;
  const excedenteHipoteca = Math.max(0, hipotecaImporte - obraFinanciable);

  // Vale para cualquier disposición: lo que no presta el banco, lo ponemos.
  const ahorrosNecesarios = Math.max(0, totalProyecto - hipotecaImporte);
  const ahorrosConReserva = Math.max(0, totalConReserva - hipotecaImporte);
  const ahorrosRestantes = ahorrosNecesarios - pagado;

  /** Desglose de lo que no cubre la hipoteca, en el orden en que se paga. */
  const desgloseAhorros = [
    ...hoja.grupos.map((g) => ({
      concepto: g.nombre,
      importe: g.total,
      pagado: g.pagado,
    })),
    {
      concepto: `IVA de la ejecución (${(ejecucion.ivaTipo * 100).toFixed(0)}%)`,
      importe: Math.max(0, obra.iva - excedenteHipoteca),
      pagado: 0,
    },
    ...(obraSinCubrir > 0
      ? [
          {
            concepto: "Obra por encima de la disposición prevista",
            importe: obraSinCubrir,
            pagado: 0,
          },
        ]
      : []),
  ].filter((d) => d.importe > 0);

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
    obraFinanciable,
    cubiertoPorHipoteca,
    obraSinCubrir,
    excedenteHipoteca,
    ahorrosNecesarios,
    ahorrosConReserva,
    ahorrosRestantes,
    desgloseAhorros,
    coberturaHipotecaProyecto: hipotecaImporte / totalProyecto,
    ltv: hipotecaImporte / hipoteca.tasacion,
    costeM2Proyecto: totalProyecto / proyecto.superficieConstruida,
    plusvaliaTeorica: hipoteca.tasacion - totalProyecto,
    /** Cuántos ahorros harían falta con cada nivel de disposición. */
    escenarios: financiacion.escenarios.map((e) => ({
      ...e,
      ahorros: Math.max(0, totalProyecto - e.disposicion),
      ahorrosRestantes: Math.max(0, totalProyecto - e.disposicion - pagado),
      esActual: e.disposicion === hipotecaImporte,
    })),
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

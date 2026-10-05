/**
 * Ofertas de hipoteca vigentes, para compararlas en los mismos términos. Los
 * tipos son nominales anuales fijos; las cuotas se calculan en el panel con el
 * sistema francés a partir de estos datos, no se copian de los correos.
 */

export type OfertaHipoteca = {
  entidad: string;
  /** Qué documento respalda la oferta y hasta cuándo vale. */
  estado: string;
  fecha: string;
  documento: string;
  importe: number;
  /** Presupuesto de obra sobre el que el banco calcula el préstamo. */
  calculadoSobre: string;
  carenciaMeses: number;
  /** Cuotas de amortización tras la carencia. */
  cuotas: number;
  tipoInicial?: { tin: number; meses: number };
  tinSinBonificar: number;
  bonificacionMaxima: number;
  /** Tipo con las bonificaciones que de verdad compensa contratar. */
  tinRazonable: number;
  tinRazonableNota: string;
  bonificaciones: string[];
  costeBonificaciones: string;
  disposiciones: string;
  amortizacionAnticipada: string;
  gastos: string;
  fondosPropiosSegunBanco?: number;
};

export const ofertasHipoteca: OfertaHipoteca[] = [
  {
    entidad: "Unicaja",
    estado: "FEIN emitida el 1 de octubre; válida hasta el 31/10/2026",
    fecha: "2026-10-01",
    documento: "https://drive.google.com/file/d/1D2Oocs3NvVu3wL6pvskyNTGNLH3PwAbs/view",
    importe: 265000,
    calculadoSobre: "Contrato real de 265.000 € + IVA",
    carenciaMeses: 18,
    cuotas: 342,
    tipoInicial: { tin: 0.024, meses: 6 },
    tinSinBonificar: 0.034,
    bonificacionMaxima: 0.01,
    tinRazonable: 0.0245,
    tinRazonableNota:
      "Domiciliación y tarjetas, hogar, coche y Plan Uniseguro (−0,95), sin seguro de vida ni fondos",
    bonificaciones: [
      "Domiciliación de ingresos y tarjeta de crédito: −0,50",
      "Saldo en fondos o planes ≥ 60.000 €: −0,40 (de 15.000 a 60.000 €, de −0,10 a −0,30)",
      "Seguro IT desempleo: −0,30",
      "Seguro de vida: de −0,15 a −0,35 según cobertura",
      "Hogar o todo riesgo construcción: −0,20",
      "Seguros de salud, auto o vida libre: −0,10 o −0,20",
      "Aportaciones a fondos o planes: −0,10 · Plan Uniseguro: −0,05",
    ],
    costeBonificaciones:
      "Se llega al 2,45 % sin seguro de vida ni fondos: tarjetas, todo riesgo u hogar, el coche que ya se paga y el Plan Uniseguro para pagar esas primas. El 2,40 % exigiría además fondos en Unicaja.",
    disposiciones:
      "Contra certificaciones de obra, con el detalle por confirmar por escrito. La FEIN cobra un 1 % por «transferencia OMF» y un 0,4 % por cheque bancario.",
    amortizacionAnticipada: "Hasta un 0,5 % los 10 primeros años, y sólo si hay pérdida para el banco",
    gastos: "Notaría, registro, gestoría e impuesto de la hipoteca, a cargo del banco",
  },
  {
    entidad: "CaixaBank",
    estado: "Aprobada por correo el 29 de septiembre; todavía sin FEIN",
    fecha: "2026-09-29",
    documento: "https://mail.google.com/mail/u/0/#all/thread-f:1876487412612021661",
    importe: 290000,
    calculadoSobre: "Presupuesto del proyecto de 361.327,16 € + IVA",
    carenciaMeses: 12,
    cuotas: 348,
    tinSinBonificar: 0.0345,
    bonificacionMaxima: 0.01,
    tinRazonable: 0.026,
    tinRazonableNota: "Todo menos la alarma (−0,85), con seguro de vida",
    bonificaciones: [
      "Nómina de más de 600 €/mes, 3 recibos y 3 compras con tarjeta al trimestre: −0,35",
      "Seguro de vida, invalidez y enfermedades: −0,35",
      "Seguro de construcción y, al acabar, MyBox Hogar: −0,15",
      "Alarma MyBox de Securitas Direct, 66,55 €/mes: −0,15",
      "Hay que mantenerlas al menos 48 meses",
    ],
    costeBonificaciones:
      "Para el 1 % completo hacen falta el seguro de vida (prima sin indicar) y la alarma, que cuesta 798,60 €/año y sólo ahorra unos 435 €/año de intereses sobre 290.000 €.",
    disposiciones:
      "1.500 € a la firma. El resto no se entrega hasta que la tasación certifique 138.519 € de obra, así que hasta entonces todo sale de ahorros. Los últimos 3.000 €, con la escritura de obra nueva.",
    amortizacionAnticipada:
      "Hasta un 2 % los 10 primeros años y un 1,5 % después, si hay pérdida (intentan dejarla en 0 %)",
    gastos: "Notaría, registro, impuestos y gestión de la hipoteca (≈ 6.050 €), a cargo del banco",
    fondosPropiosSegunBanco: 115959.88,
  },
];

/**
 * Datos maestros del proyecto. Todo lo que no vive en la hoja de cálculo
 * se edita aquí: contrato, hipoteca, capítulos del proyecto técnico e hitos.
 */

export const proyecto = {
  nombre: "Vivienda unifamiliar",
  direccion: "Calle de la Salud 1, 47680 Mayorga (Valladolid)",
  promotores: ["Daniel Paniagua Fernández", "María Vega Blanco"],
  constructor: "Polo Redondo (Madapan)",
  arquitecto: "Alberto Magdaleno de la Viuda — AM Arquitectos",
  superficieConstruida: 253.3,
  /** Registro, Catastro y proyecto ya coinciden tras la rectificación de superficie. */
  superficieParcela: 516.6,
  superficieParcelaAnterior: 336,
  referenciaCatastral: "3010501UM1731S0001SW",
  expedienteVisado: "2025-00624",
  fechaVisado: "2025-10-08",
  fechaLicencia: "2026-01-07",
  inicioObra: "2026-08-31",
  primeraFacturaPrevista: "2026-10-15",
};

/** Presupuesto de ejecución acordado con el constructor. */
export const ejecucion = {
  contratoPrincipal: 265000,
  trabajosAparte: 15000,
  ivaTipo: 0.1,
  reservaTipo: 0.05,
  /** Ofertas anteriores, sólo como referencia histórica. */
  referencias: [
    {
      etiqueta: "PEM técnico del proyecto",
      importe: 118253.1,
      funcion: "Base administrativa de licencia e ICIO",
      destacado: false,
    },
    {
      etiqueta: "Presupuesto presentado a financiación",
      importe: 361327.16,
      funcion: "Estudio bancario y desglose por capítulos",
      destacado: false,
    },
    {
      etiqueta: "Oferta inicial Polo Redondo (02/2026)",
      importe: 297395,
      funcion: "Oferta histórica, sin IVA",
      destacado: false,
    },
    {
      etiqueta: "Presupuesto operativo actual",
      importe: 280000,
      funcion: "Base de control de este panel, sin IVA",
      destacado: true,
    },
  ],
};

/** Capítulos del presupuesto técnico (Total Ejecución Material 361.327,16 €). */
export const capitulos = [
  { codigo: "CAP 01", nombre: "Actuaciones previas y movimiento de tierras", importe: 16550 },
  { codigo: "CAP 02", nombre: "Estructura", importe: 88948.52 },
  { codigo: "CAP 03", nombre: "Cubierta", importe: 56194.73 },
  { codigo: "CAP 04", nombre: "Albañilería", importe: 42674.52 },
  { codigo: "CAP 05", nombre: "Pavimentos, revestimientos y pinturas", importe: 61788.86 },
  { codigo: "CAP 06", nombre: "Carpintería, cerrajería y vidrios", importe: 38229.2 },
  { codigo: "CAP 07", nombre: "Saneamiento", importe: 3802 },
  { codigo: "CAP 08", nombre: "Fontanería y sanitarios", importe: 12942 },
  { codigo: "CAP 09", nombre: "Electricidad", importe: 14230.25 },
  { codigo: "CAP 10", nombre: "Calefacción y ACS", importe: 21577.08 },
  { codigo: "CAP 11", nombre: "Ventilación y renovación", importe: 1458 },
  { codigo: "CAP 12", nombre: "Varios", importe: 1272 },
  { codigo: "CAP 13", nombre: "Seguridad y salud", importe: 260 },
  { codigo: "CAP 14", nombre: "Control de calidad", importe: 750 },
  { codigo: "CAP 15", nombre: "Gestión de residuos", importe: 650 },
];

/**
 * Cómo calcula el banco cuánto puede prestar en una hipoteca de
 * autopromoción: un porcentaje del MENOR de dos valores, la tasación en
 * hipótesis de edificio terminado o el coste total de la promoción
 * (presupuesto de ejecución más el valor escriturado del suelo).
 */
export const financiacion = {
  porcentajeMaximo: 0.8,
  /** Valor del suelo según escritura. Es el que computa el banco. */
  valorSueloEscriturado: 11000,
  /** Presupuesto de ejecución del proyecto técnico visado. */
  costeEjecucionProyecto: 361327.16,
  /**
   * Escenarios de disposición del préstamo. El objetivo declarado es no tocar
   * ahorros salvo para lo que la hipoteca no puede cubrir.
   */
  escenarios: [
    {
      etiqueta: "Sólo el contrato",
      disposicion: 265000,
      nota: "Sin margen para desviaciones de obra",
    },
    {
      etiqueta: "Contrato más un 5% de desviación",
      disposicion: 278250,
      nota: "Deja dispuesto el colchón para absorber sobrecostes de obra",
    },
    {
      etiqueta: "Toda la ejecución sin IVA",
      disposicion: 280000,
      nota: "Contrato principal más los 15.000 € facturados aparte",
    },
    {
      etiqueta: "Máximo ofrecido por Unicaja",
      disposicion: 296000,
      nota: "Techo de la oferta; absorbería también parte del IVA",
    },
  ],
};

/**
 * Las dos columnas de pago de la hoja. No distinguen personas: la cuenta es
 * común. Distinguen si el pago queda documentado o no.
 */
export const pagadores = {
  a: {
    etiqueta: "Declarado",
    descripcion: "Pagos con reflejo documental, justificables ante el banco",
  },
  b: {
    etiqueta: "En efectivo",
    descripcion: "Pagos en metálico, sin reflejo documental",
  },
};

/** Hipoteca seleccionada. */
export const hipoteca = {
  entidad: "Unicaja",
  estado: "Seleccionada — pendiente de aprobación definitiva, FEIN y firma",
  importeMaximoOfrecido: 296000,
  /**
   * Disposición prevista: el contrato principal más un 5% de desviación, para
   * dejar dispuesto el colchón de sobrecostes en lugar de cubrirlo con ahorros.
   */
  disposicionPrevista: 278250,
  disposicionContrato: 265000,
  desviacionPrevista: 0.05,
  /**
   * 30 años en total: un año de carencia en el que sólo se pagan intereses de
   * lo dispuesto, y 29 de amortización. El plazo son los meses que se amortizan.
   */
  plazoMeses: 348,
  carenciaMeses: 12,
  tinBase: 0.034,
  bonificacionTotal: 0.0085,
  tinFinal: 0.0255,
  /** Cuota que ofreció el banco, para una disposición de 265.000 €. */
  cuotaReferencia: { capital: 265000, cuota: 1053.97 },
  comisionApertura: 0,
  comisionAmortizacionAnticipada: 0.005,
  tasacion: 424018.8,
  seguroHogarAnual: 450,
  seguroSaludAnual: 350,
  bonificaciones: [
    {
      vinculacion: "Domiciliación de ingresos y dos tarjetas",
      puntos: 0.005,
      requisito: "1.200 €/año o dos compras mensuales por tarjeta",
      estado: "prevista",
    },
    {
      vinculacion: "Seguro de hogar",
      puntos: 0.002,
      requisito: "≈ 450 €/año",
      estado: "prevista",
    },
    {
      vinculacion: "Plan UniSeguro",
      puntos: 0.0005,
      requisito: "Fraccionamiento mensual sin sobrecoste",
      estado: "prevista",
    },
    {
      vinculacion: "Fondo de inversión o plan de pensiones",
      puntos: 0.001,
      requisito: "Producto pendiente de escoger",
      estado: "pendiente",
    },
    {
      vinculacion: "Seguro de vida de Unicaja",
      puntos: 0,
      requisito: "No se contrata; se renuncia a su 0,20%",
      estado: "descartada",
    },
  ] as { vinculacion: string; puntos: number; requisito: string; estado: string }[],
  alternativasFondo: [
    { alternativa: "Fondo de inversión (0,6% de 265.000 €)", aportacionAnual: 1590 },
    { alternativa: "Plan de pensiones", aportacionAnual: 1500 },
  ],
};

/**
 * Fechas de pago conocidas y documentadas. La hoja de cálculo todavía no
 * registra fechas; estas se han verificado contra recibos y facturas.
 * Clave = concepto tal y como aparece en la hoja.
 */
export const fechasPago: Record<string, string> = {
  "Impuestos: ICIO": "2025-12-19",
  "Tasación inicial": "2026-07-16",
};

/** Hitos del proyecto, en orden cronológico. */
export const hitos = [
  { fecha: "2025-08-26", titulo: "Solicitud de licencia registrada en el Ayuntamiento", estado: "hecho" },
  { fecha: "2025-10-08", titulo: "Proyecto visado — expediente 2025-00624", estado: "hecho" },
  { fecha: "2025-12-18", titulo: "Permiso de obras del Ayuntamiento de Mayorga", estado: "hecho" },
  { fecha: "2025-12-19", titulo: "Pago del ICIO — 2.436,01 €", estado: "hecho" },
  { fecha: "2026-01-07", titulo: "Licencia de obra concedida", estado: "hecho" },
  { fecha: "2026-02-23", titulo: "Presupuesto de Polo Redondo — 297.395 € + IVA", estado: "hecho" },
  {
    fecha: "2026-03-18",
    titulo: "Rectificación de superficie: el Registro pasa de 336 a 516,60 m² y cuadra con el Catastro",
    estado: "hecho",
  },
  { fecha: "2026-07-08", titulo: "Resumen de presupuesto actualizado del constructor", estado: "hecho" },
  { fecha: "2026-07-16", titulo: "Tasación en hipótesis de edificio terminado — 424.018,80 €", estado: "hecho" },
  { fecha: "2026-08-28", titulo: "Unicaja seleccionada como entidad financiadora", estado: "hecho" },
  { fecha: "2026-08-31", titulo: "Inicio de la obra", estado: "hecho" },
  {
    fecha: "2026-09-02",
    titulo: "Propuesta de I-DE para el suministro provisional de obra — 164,58 €",
    estado: "hecho",
  },
  {
    fecha: "2026-09-17",
    titulo: "Fecha límite para aceptar la propuesta de I-DE",
    estado: "previsto",
  },
  { fecha: "2026-10-15", titulo: "Primera factura de obra prevista", estado: "previsto" },
] as { fecha: string; titulo: string; estado: "hecho" | "previsto" }[];

/** Alertas y decisiones abiertas. */
export const alertas = [
  {
    nivel: "alta",
    titulo: "La obra ha empezado y la hipoteca no está firmada",
    detalle:
      "La obra arrancó el 31 de agosto de 2026 y Unicaja todavía no ha firmado. Hasta que se firme y empiecen las disposiciones, cada certificación que llegue hay que pagarla íntegra con ahorros, no sólo su IVA. Conviene cuadrar el calendario de certificaciones con la fecha de firma.",
  },
  {
    nivel: "alta",
    titulo: "Formalización hipotecaria sin cerrar",
    detalle:
      "Unicaja está seleccionada pero no aprobada en firme. Faltan la FEIN, la revisión de condiciones y la firma. Hasta entonces la cuota y el tipo son una previsión.",
  },
  {
    nivel: "alta",
    titulo: "La propuesta de I-DE caduca el 17 de septiembre",
    detalle:
      "I-DE da 15 días desde el 2 de septiembre para aceptar y firmar la propuesta del suministro provisional de obra. El presupuesto de 164,58 € tiene además una validez de 3 meses, hasta el 2 de diciembre de 2026: pasado ese plazo puede revisarse el precio. Sin acometida provisional la obra se queda sin luz.",
  },
  {
    nivel: "media",
    titulo: "La acometida definitiva de la vivienda no está presupuestada",
    detalle:
      "Los 164,58 € de I-DE son sólo el suministro provisional de obra. El alta definitiva de la vivienda —derechos de enganche de luz y el alta de agua— sigue a 0 € en la hoja y llegará al final de obra. Conviene pedir presupuesto para que no aparezca por sorpresa.",
  },
  {
    nivel: "media",
    titulo: "Honorarios del aparejador comprometidos y sin nota de pago",
    detalle:
      "Los 2.625 € de la dirección de ejecución material están comprometidos pero no pagados, y todavía no hay factura ni justificante. Con la obra ya iniciada conviene cerrar cuándo y cómo se abona.",
  },
  {
    nivel: "baja",
    titulo: "El IVA del aparejador se calcula sobre una base distinta a la que suma",
    detalle:
      "En la hoja, el impuesto de esa fila sale del 21% de 2.500 € (525 €) pero la base que se suma para el total son 2.100 €, de donde salen los 2.625 €. O la base son 2.500 € y el total serían 3.025 €, o el impuesto va sobre 2.100 € y serían 2.541 €. Conviene contrastarlo con el presupuesto del aparejador.",
  },
  {
    nivel: "media",
    titulo: "La cuota que ofreció Unicaja no cuadra con 30 años totales",
    detalle:
      "Los 1.053,97 €/mes que ofreció el banco para 265.000 € corresponden exactamente a 360 mensualidades de amortización. Si el plazo son 30 años en total con uno de carencia, se amortiza en 348 y esa misma disposición saldría a 1.078,22 €/mes. Hay que confirmar con Unicaja si su cuota incluía la carencia o si el plazo total son 31 años.",
  },
  {
    nivel: "alta",
    titulo: "Confirmar qué admite el banco como disposición",
    detalle:
      "Unicaja ofrece hasta 296.000 € y sólo hay previsto disponer 265.000 €. Antes de firmar conviene aclarar si las certificaciones se liberan con IVA o sin él, y si los 15.000 € facturados aparte son certificables. De ello depende que haya que poner 73.078 € de ahorros o bastante menos.",
  },
  {
    nivel: "media",
    titulo: "Justificación de la aportación de fondos propios",
    detalle:
      "El banco pide acreditar los fondos propios ya aportados. De los pagos hechos hasta ahora, 5.000 € del suelo se abonaron en efectivo y no se pueden justificar con transferencia ni factura. Conviene tenerlo previsto antes de la firma.",
  },
  {
    nivel: "media",
    titulo: "Mecánica de disposiciones durante la obra",
    detalle:
      "Confirmar por escrito con Unicaja qué porcentaje se libera en cada certificación y cómo se calculan las cuotas antes de la disposición total.",
  },
  {
    nivel: "media",
    titulo: "Partidas potencialmente excluidas del contrato",
    detalle:
      "Verificar si quedan fuera cocina, mobiliario, jardín, acometidas y altas de suministros, cerramientos, telecomunicaciones, honorarios finales y mejoras posteriores.",
  },
  {
    nivel: "media",
    titulo: "Los 15.000 € facturados aparte necesitan trazabilidad propia",
    detalle:
      "Controlarlos como partida diferenciada con proveedor, concepto, factura, certificación y fecha de pago para que no se mezclen con el contrato principal.",
  },
  {
    nivel: "baja",
    titulo: "Producto para la bonificación del 0,10%",
    detalle:
      "Falta elegir entre fondo de inversión (≈1.590 €/año) o plan de pensiones (≈1.500 €/año). No es gasto consumido: sigue siendo patrimonio.",
  },
  {
    nivel: "baja",
    titulo: "Tipo de IVA en compras directas",
    detalle:
      "Se presupone el 10% en las facturas de ejecución. Las compras directas de materiales por los promotores pueden tributar al 21%.",
  },
  {
    nivel: "baja",
    titulo: "Fianza de residuos no reflejada en la hoja",
    detalle:
      "La fianza de residuos de 476,84 € es recuperable al acreditar la gestión, pero figura en 0 € en la hoja de costes. Conviene registrarla para poder reclamarla al final de la obra.",
  },
] as { nivel: "alta" | "media" | "baja"; titulo: string; detalle: string }[];

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
  primeraCertificacion: "2026-09-23",
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
      etiqueta: "FEIN de Unicaja",
      disposicion: 265000,
      nota: "Lo que se va a firmar: el contrato, sin margen para desviaciones de obra",
    },
    {
      etiqueta: "Contrato más un 5% de desviación",
      disposicion: 278250,
      nota: "Habría que pedir ampliar la FEIN",
    },
    {
      etiqueta: "Toda la ejecución sin IVA",
      disposicion: 280000,
      nota: "Contrato más los 15.000 € facturados aparte; habría que ampliar la FEIN",
    },
    {
      etiqueta: "Lo solicitado en septiembre",
      disposicion: 296000,
      nota: "Importe de la solicitud; la FEIN no llega a él",
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
  estado: "FEIN de 265.000 € (válida hasta el 31/10) · préstamo nº …0125 · firma no antes del 11/10",
  /**
   * Importe de la FEIN del 1 de octubre de 2026. Se solicitaron 296.000 €,
   * pero la oferta vinculante se ha quedado en el contrato real.
   */
  importeMaximoOfrecido: 265000,
  /**
   * La FEIN limita el préstamo a 265.000 €, así que no hay colchón dispuesto:
   * cualquier desviación de obra sale de ahorros.
   */
  disposicionPrevista: 265000,
  disposicionContrato: 265000,
  desviacionPrevista: 0,
  /**
   * 30 años en total según la FEIN: 18 meses de carencia en los que sólo se
   * pagan intereses de lo dispuesto, y 342 cuotas de amortización.
   */
  plazoMeses: 342,
  carenciaMeses: 18,
  tinBase: 0.034,
  /**
   * Plan: domiciliación y tarjetas (−0,50), hogar o todo riesgo de
   * construcción (−0,20), coche (−0,20) y Plan Uniseguro (−0,05). Los fondos
   * siguen en Finizens, que no bonifica.
   */
  bonificacionTotal: 0.0095,
  tinFinal: 0.0245,
  /** Cuota de la FEIN para 265.000 €, sin bonificar (3,40 %, 342 cuotas). */
  cuotaReferencia: { capital: 265000, cuota: 1211.33 },
  comisionApertura: 0,
  comisionAmortizacionAnticipada: 0.005,
  tasacion: 424018.8,
  /** Estimación hasta tener el precio de Unicaja. */
  seguroHogarAnual: 450,
  /** El seguro de salud se contrata aparte: no bonifica ni es coste bancario. */
  seguroSaludAnual: 0,
  bonificaciones: [
    {
      vinculacion: "Domiciliación de ingresos y tarjetas de crédito",
      puntos: 0.005,
      requisito:
        "Cuota de autónomos de María domiciliada y una tarjeta de crédito para cada uno, en pago total a fin de mes. En los 6 meses previos a cada revisión: 600 € de compras entre los dos o 2 compras al mes. Usarlas desde la firma",
      estado: "prevista",
    },
    {
      vinculacion: "Todo riesgo de construcción y, al acabar, seguro de hogar",
      puntos: 0.002,
      requisito:
        "Con Unicaja. Todo riesgo: 370,10 € de pago único según la FEIN; hogar: precio pendiente. Si el todo riesgo se hace fuera, el hogar tiene que estar contratado antes de la revisión siguiente al fin de obra",
      estado: "pendiente",
    },
    {
      vinculacion: "Seguro del coche con Unicaja",
      puntos: 0.002,
      requisito:
        "Traspaso de la póliza actual, ≈ 700 €/año. Las primas pagadas en los 12 meses previos a la revisión tienen que llegar a 700 €; con menos sólo bonifica −0,10",
      estado: "pendiente",
    },
    {
      vinculacion: "Plan Uniseguro",
      puntos: 0.0005,
      requisito:
        "Pagar a través de él al menos 1.000 €/año de primas: coche y hogar ya llegan. Confirmar que el fraccionamiento no tiene recargo",
      estado: "prevista",
    },
    {
      vinculacion: "Seguro de salud",
      puntos: 0,
      requisito: "Se contrata aparte: con el coche ya se llega al tramo máximo de salud, auto y vida libre",
      estado: "descartada",
    },
    {
      vinculacion: "Seguro de vida de Unicaja",
      puntos: 0,
      requisito: "No hace falta para llegar al tope",
      estado: "descartada",
    },
    {
      vinculacion: "Fondos o planes en Unicaja",
      puntos: 0,
      requisito: "Los fondos siguen en Finizens, que no bonifica. Se renuncia a la última décima",
      estado: "descartada",
    },
  ] as { vinculacion: string; puntos: number; requisito: string; estado: string }[],
  alternativasFondo: [
    { alternativa: "Seguir con Finizens, sin esta bonificación", aportacionAnual: 0 },
    {
      alternativa: "Aportar a fondos de Unicaja el 0,6 % del capital pendiente cada semestre",
      aportacionAnual: 3180,
    },
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
  "Instalaciones auxiliares para obra": "2026-09-03",
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
    fecha: "2026-09-03",
    titulo: "Pago de la acometida provisional de obra a I-DE — 164,58 €",
    estado: "hecho",
  },
  {
    fecha: "2026-09-03",
    titulo: "Solicitud de hipoteca a Unicaja — 296.000 € a 30 años",
    estado: "hecho",
  },
  {
    fecha: "2026-09-06",
    titulo: "Certificado de instalación eléctrica de obra inscrito — 47/BT/188819",
    estado: "hecho",
  },
  {
    fecha: "2026-09-23",
    titulo: "1.ª certificación de Polo Redondo (factura 094/26) — 54.000 € + IVA = 59.400 €",
    estado: "hecho",
  },
  {
    fecha: "2026-10-01",
    titulo: "FEIN de Unicaja: 265.000 € a 30 años con 18 meses de carencia — préstamo nº 21036320520500000125",
    estado: "hecho",
  },
  {
    fecha: "2026-10-11",
    titulo: "Primera fecha posible para firmar la hipoteca ante notario",
    estado: "previsto",
  },
  {
    fecha: "2026-10-31",
    titulo: "Caduca la FEIN: hay que haber firmado antes",
    estado: "previsto",
  },
] as { fecha: string; titulo: string; estado: "hecho" | "previsto" }[];

/**
 * Seguros y obligaciones legales de la obra. Resumen orientativo de la LOE
 * (Ley 38/1999) y el RD 1627/1997 aplicado a una autopromoción de vivienda
 * unifamiliar para uso propio. No sustituye al criterio de la dirección
 * facultativa ni al de un corredor de seguros.
 */
export const obligaciones = [
  {
    concepto: "Coordinador de seguridad y salud en ejecución",
    quien: "Promotor",
    caracter: "obligatorio" as const,
    urgencia: "alta" as const,
    plazo: "Antes del inicio de obra — la obra arrancó el 31/08",
    base: "RD 1627/1997, art. 3.2",
    coste: "Fila «Coordinador seguridad», a 0 € en la hoja",
    detalle:
      "Obligatorio en cuanto intervienen más de una empresa, o una empresa y trabajadores autónomos. Los 15.000 € facturados aparte apuntan a un segundo interviniente en obra, así que difícilmente se libra. Es la exposición más inmediata: la obra ya está en marcha.",
  },
  {
    concepto: "Plan de seguridad y salud y apertura del centro de trabajo",
    quien: "Constructor, con verificación del promotor",
    caracter: "obligatorio" as const,
    urgencia: "alta" as const,
    plazo: "Antes del inicio de obra — la obra arrancó el 31/08",
    base: "RD 1627/1997",
    detalle:
      "El contratista redacta el plan a partir del estudio básico del proyecto y lo aprueba el coordinador antes de empezar. Van con él la comunicación de apertura del centro de trabajo a la autoridad laboral y el libro de incidencias en obra. Conviene pedir copia de los tres.",
  },
  {
    concepto: "Seguro decenal y supervisión de OCT",
    quien: "Promotor",
    caracter: "exento" as const,
    urgencia: "alta" as const,
    plazo: "Decisión irreversible: el OCT tiene que supervisar desde cimentación",
    base: "LOE, art. 19.1.c y Disposición Adicional Segunda",
    coste: "Filas «Seguro de daños materiales decenal» y «Plan de Control de Calidad a la OCT», ambas a 0 €",
    detalle:
      "El autopromotor de una única vivienda unifamiliar para uso propio está exento. Pero si se vende dentro de los 10 años, la ley obliga a contratarlo por el tiempo restante, y ni el notario autoriza ni el Registro inscribe la venta sin acreditarlo, salvo exoneración expresa del comprador. El problema: no se puede contratar a posteriori sin que un OCT haya supervisado la obra. La pregunta real no es si es obligatorio, sino si se descarta vender en 10 años.",
  },
  {
    concepto: "Seguro Todo Riesgo Construcción",
    quien: "Promotor",
    caracter: "opcional" as const,
    urgencia: "media" as const,
    plazo: "Antes de la FEIN: el banco puede exigirlo para permitir disposiciones",
    base: "No previsto en la LOE; exigencia habitual de las entidades",
    coste: "≈ 900–1.500 € (0,3–0,5% del presupuesto) · fila a 0 € en la hoja",
    detalle:
      "Cubre daños a la obra en curso —incendio, robo de material, temporal, colapso— y suele incluir responsabilidad civil del promotor. Es el seguro que de verdad protege el dinero ya invertido mientras la casa está a medias.",
  },
  {
    concepto: "Responsabilidad civil del constructor",
    quien: "Constructor",
    caracter: "verificar" as const,
    urgencia: "media" as const,
    plazo: "Ya: pedir póliza vigente y recibo pagado",
    base: "Exigencia contractual del promotor",
    detalle:
      "No basta con que diga que la tiene. Conviene pedir copia de la póliza en vigor con el justificante de pago, el certificado de estar al corriente con la Seguridad Social y la documentación de los trabajadores. Que él tenga póliza no cubre al promotor si resulta insolvente o si el siniestro cae fuera de su cobertura.",
  },
  {
    concepto: "Retención del 5% por defectos de acabado",
    quien: "Promotor",
    caracter: "contractual" as const,
    urgencia: "baja" as const,
    plazo: "Al pactar las certificaciones con el constructor",
    base: "LOE, art. 19.1.a",
    coste: "13.250 € sobre el contrato principal",
    detalle:
      "La ley permite sustituir el seguro de acabados a un año por retener un 5% del importe de ejecución material durante ese año. Es la protección más barata que existe frente a defectos de terminación, pero hay que haberla pactado en el contrato.",
  },
];

/** Alertas y decisiones abiertas. */
export const alertas = [
  {
    nivel: "alta",
    titulo: "La obra ha empezado y la hipoteca no está firmada",
    detalle:
      "La obra arrancó el 31 de agosto de 2026 y la hipoteca no puede firmarse antes del 11 de octubre. Hasta que se firme y empiecen las disposiciones, cada certificación que llegue hay que pagarla íntegra con ahorros, no sólo su IVA. Conviene cuadrar el calendario de certificaciones con la fecha de firma.",
  },
  {
    nivel: "alta",
    titulo: "Seguridad y salud sin cerrar con la obra en marcha",
    detalle:
      "La obra arrancó el 31 de agosto. Designar coordinador de seguridad y salud en ejecución es obligación del promotor, no del constructor, y con más de un interviniente en obra no es opcional. Falta confirmar además el plan de seguridad y salud aprobado y la apertura del centro de trabajo. Ver la sección de seguros y obligaciones.",
  },
  {
    nivel: "alta",
    titulo: "Firmar la hipoteca entre el 11 y el 31 de octubre, después de pasar por el notario",
    detalle:
      "La FEIN del 1 de octubre es por 265.000 € a 30 años: 18 meses de carencia y 342 cuotas. Va al 2,40 % fijo los 6 primeros meses y al 3,40 % después, con hasta un punto de bonificación (el tipo nunca baja del 2,40 %). Sin bonificar, la cuota es de 1.211,33 €; en la carencia, unos 540 € si estuviera todo dispuesto. Los dos tenéis que comparecer ante el notario para el asesoramiento previo, como tarde el día antes de la firma. La escritura no puede otorgarse antes del 11 de octubre y la FEIN caduca el 31.",
  },
  {
    nivel: "alta",
    titulo: "Revisar la declaración de bienes y el importe antes de firmar",
    detalle:
      "La declaración de bienes de María del 11 de septiembre pone como profesión «amas de casa», aunque está dada de alta como autónoma desde el 1 de agosto. Declara además la casa de Calle Salud como chalet adosado de 361.327 €, cuando ahora es un solar con la obra empezando, y una deuda de 5.112 € con Alberto Carlos e Isabel Redondo. La FEIN ya va sobre los 265.000 € del contrato real; conviene que la declaración también cuadre antes de ir al notario.",
  },
  {
    nivel: "media",
    titulo: "Falta el precio final de los seguros de la hipoteca",
    detalle:
      "Para cerrar las bonificaciones y el coste mensual hay que pedir precio a Unicaja y compararlo fuera: todo riesgo de construcción (la FEIN da 370,10 € de pago único; es obligatorio desde la firma, con Unicaja o con otra aseguradora que la ponga de beneficiaria), seguro de hogar para cuando acabe la obra (el panel estima 450 €/año), y traspaso del coche, que tiene que llegar a 700 €/año. El seguro de salud va aparte.",
  },
  {
    nivel: "media",
    titulo: "La acometida definitiva de la vivienda no está presupuestada",
    detalle:
      "Los 164,58 € de I-DE y el boletín 47/BT/188819 cubren sólo el suministro provisional de obra, que caduca cuando termine la obra. El alta definitiva de la vivienda —derechos de enganche de luz, su propio boletín eléctrico y el alta de agua— sigue a 0 € en la hoja. Conviene pedir presupuesto para que no aparezca por sorpresa al final.",
  },
  {
    nivel: "alta",
    titulo: "Pagar la 1.ª certificación: 59.400 € y confirmar antes la cuenta",
    detalle:
      "Polo Redondo ha facturado el 23 de septiembre la 1.ª certificación: 54.000 € + 10 % de IVA. El contrato da 8 días para pagarla y, sin hipoteca firmada, sale íntegra de ahorros. La cuenta de la factura (BBVA …2291) no es la del contrato (BBVA …0530): confirmarla por teléfono con el constructor antes de transferir. La factura trae además la dirección como «C/ La Salud, 11», «Maorga», «Ferandez» y los NIF cruzados; si el banco la va a usar como justificante de disposición, conviene pedir que la rectifiquen.",
  },
  {
    nivel: "media",
    titulo: "Dirección de obra del arquitecto y del aparejador sin facturar",
    detalle:
      "Son dos honorarios distintos: el arquitecto, 2.100 € + IVA (2.541 €), y el aparejador, 2.625 € con IVA incluido (2.169,42 € de base). Están comprometidos pero sin factura ni pago. Según el presupuesto del arquitecto, su dirección de obra se paga un 50 % al comienzo de la obra, un 25 % con la cubierta y un 25 % antes del certificado final, así que el primer 50 % ya toca. Falta cerrar cómo cobra el aparejador.",
  },
  {
    nivel: "alta",
    titulo: "La FEIN no deja margen: desviaciones e IVA salen de ahorros",
    detalle:
      "La FEIN es por 265.000 €, justo el contrato, así que no queda colchón para desviaciones de obra ni para los 15.000 € facturados aparte. Antes de firmar conviene aclarar si las certificaciones se liberan con IVA o sin él: de eso depende cuánto hay que poner de ahorros en cada una.",
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
      "Confirmar por escrito con Unicaja qué porcentaje se libera en cada certificación y cómo se calculan las cuotas antes de la disposición total. La FEIN cobra un 1 % por pagar con «transferencia OMF» desde el préstamo y un 0,4 % por cheque bancario: hay que preguntar si pagar cada certificación a Polo Redondo por transferencia normal lleva comisión.",
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

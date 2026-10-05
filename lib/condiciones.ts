/**
 * Condiciones y trámites de la hipoteca de Unicaja, tras revisar toda la
 * documentación entregada (resumen del 05/10/2026). Las bonificaciones y el
 * coste mensual están en `hipoteca` (lib/proyecto.ts).
 */

export const condicionesFein: { concepto: string; valor: string }[] = [
  { concepto: "Préstamo", valor: "nº 2103 6320 52 0500000125" },
  { concepto: "Importe", valor: "265.000 € (se pidieron 296.000 €)" },
  { concepto: "Plazo", valor: "30 años: 18 meses de carencia (sólo intereses) y 342 cuotas" },
  { concepto: "Tipo", valor: "2,40 % fijo los 6 primeros meses; después 3,40 % fijo" },
  {
    concepto: "Bonificación",
    valor: "Hasta −1,00 punto, con mínimo del 2,40 %. Revisión semestral desde el 02/04/2027",
  },
  { concepto: "Cuota sin bonificar", valor: "1.211,33 €/mes" },
  {
    concepto: "Intereses en carencia",
    valor: "≈ 540 €/mes al 2,40 % con todo dispuesto; menos mientras se dispone por certificaciones",
  },
  { concepto: "TAE", valor: "3,467 % sin bonificar · 2,979 % con la bonificación máxima" },
  { concepto: "Comisión de apertura", valor: "0 €" },
  {
    concepto: "Amortización anticipada",
    valor: "Como mucho un 0,5 %, parcial o total, durante toda la vida del préstamo; preaviso de 30 días",
  },
  { concepto: "Demora", valor: "Tipo + 3 puntos; 35 € por cada impago reclamado" },
  {
    concepto: "Vencimiento anticipado",
    valor: "El legal: 12 cuotas impagadas en la primera mitad del préstamo, 15 en la segunda",
  },
  {
    concepto: "Gastos a nuestro cargo",
    valor: "Tasación (235,95 € según la FEIN) y copias. Notaría, registro, gestoría e impuesto los paga Unicaja",
  },
  { concepto: "Oferta válida hasta", valor: "31/10/2026" },
  {
    concepto: "Firma",
    valor: "No antes del 11/10/2026; del 15/10 si el notario cuenta desde el alta en el Portal Notarial (05/10)",
  },
  { concepto: "Tasación válida hasta", valor: "15/01/2027" },
];

export const segurosHipoteca: { seguro: string; situacion: string; decision?: string }[] = [
  {
    seguro: "Daños (obligatorio)",
    situacion:
      "Desde la firma, por 379.664 € (valor de seguro de la tasación). Basta con incendio, explosión y rayo, unos 61 €/año según la FEIN. Cualquier compañía",
  },
  {
    seguro: "Todo riesgo de construcción (obligatorio)",
    situacion:
      "A la firma y mientras dure la obra. La FEIN da 370,10 € de pago único; con Unicaja bonifica 0,20. Preguntar si vale la póliza del constructor",
  },
  {
    seguro: "Decenal",
    situacion: "La FEIN lo pide, pero la LOE exime al autopromotor de una vivienda para uso propio",
    decision: "No se contrata: descartamos vender en 10 años. Pedir a Unicaja que lo quite por escrito",
  },
  {
    seguro: "Hogar",
    situacion: "Al terminar la obra, con Unicaja para mantener los 0,20. Estimado en ≈ 450 €/año; falta el precio",
  },
  {
    seguro: "Vida",
    situacion: "Referencia de mercado ≈ 444 €/año por 300.000 € con invalidez; Unicaja ≈ 1.000 €/año",
    decision: "Se contrata fuera, sobre todo para Daniel",
  },
];

export const incoherencias: { titulo: string; detalle: string }[] = [
  {
    titulo: "Coste de la cuenta",
    detalle:
      "No se puede cancelar mientras dure el préstamo y aparecen tres costes: la FEIN dice que es gratis si sólo se usa para el préstamo, la ficha de venta combinada habla de 120 €/año y el contrato, de 160 €/año más 0,65 € por apunte.",
  },
  {
    titulo: "Pago de las certificaciones",
    detalle:
      "La FEIN cobra un 0,4 % por cheque y un 1 % por «transferencia OMF» (≈ 1.000 €); el contrato de la cuenta, un 0,40 % por transferencia a otro banco. No está descrito cómo se dispone del dinero.",
  },
  {
    titulo: "Decenal",
    detalle:
      "La FEIN lo exige, la declaración de recepción no lo menciona y la ley exime al autopromotor.",
  },
  {
    titulo: "Tasación",
    detalle: "La FEIN la da por 235,95 €; la factura de Tecnitasa es de 586,85 €.",
  },
  {
    titulo: "Vencimiento anticipado por los seguros",
    detalle:
      "Un apartado de la FEIN dice que cancelar un seguro obligatorio no es causa de vencimiento anticipado y otro dice que puede serlo. Preguntarlo al notario.",
  },
  {
    titulo: "Datos personales",
    detalle:
      "La dirección de Daniel está mal escrita («Cipriano Pueblo García», sin número) y María tiene que constar como autónoma.",
  },
];

export const dudasUnicaja = {
  fecha: "2026-10-05",
  asunto: "Dudas hipoteca autopromotor",
  destinatario: "Carlos Velasco (cvelasco@agentes.unicaja.es)",
  hilo: "https://mail.google.com/mail/u/0/#all/thread-f:1878197232190359799",
  respuestaAntesDe: "2026-10-20",
  preguntas: [
    "Confirmar que la FEIN, la FiAE y la minuta se pusieron a disposición el 01/10, y enviar copia de la minuta y del documento del todo riesgo",
    "Fecha de firma lo antes posible a partir del 11/10, y notaría",
    "Resolver las aclaraciones sin emitir una FEIN nueva, para no reiniciar el plazo",
    "Si los 265.000 € son definitivos",
    "Cómo se libera el dinero, coste de las visitas y si cuenta la 1.ª certificación ya pagada",
    "Pagos al constructor: proceso, qué es una OMF y cómo pagar sin coste",
    "Quitar el decenal por escrito",
    "Coberturas del todo riesgo (370,10 €) y si vale la póliza del constructor",
    "Precio del seguro de hogar con un continente de 379.664 €",
    "Coste de la cuenta, por escrito",
    "La diferencia en el importe de la tasación",
    "Precio del seguro de coche y si cuenta en la revisión del 02/04/2027",
    "Corregir la dirección y la profesión de María",
  ],
};

export const notaria = {
  cita: {
    fecha: "2026-10-07",
    hora: "13:00",
    tipo: "Consulta previa: acta de asesoramiento obligatorio",
    notario: undefined as string | undefined,
  },
  notas: [
    "Tienen que ir Daniel y María. Es gratis y se hace como tarde el día antes de la firma",
    "En la práctica, con el mismo notario que firma la hipoteca",
    "Hay que asignar la operación a la notaría en portalnotarial.es (Unicaja la dio de alta el 05/10)",
    "Llevar las dudas para el notario: vencimiento anticipado por los seguros y el decenal",
  ],
};

export const pendientesHipoteca: string[] = [
  "Respuesta de Unicaja a las dudas del 05/10",
  "La minuta completa y el documento del seguro todo riesgo",
  "Asignar la operación a la notaría en el Portal Notarial",
  "Presupuestos externos del seguro de vida para Daniel y, como referencia, del de hogar",
  "Precio del seguro de coche en Unicaja",
];

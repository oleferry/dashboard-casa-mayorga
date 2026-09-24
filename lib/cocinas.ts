/**
 * Proveedores de cocina a los que se ha pedido presupuesto. Es una base de
 * datos viva: se actualiza a medida que responden (los hilos están en la
 * etiqueta «Cocinas» de Gmail). Las distancias son aproximadas por carretera
 * desde Mayorga.
 */

export type EstadoProveedor =
  | "sin-respuesta"
  | "respondido"
  | "planos-enviados"
  | "cita"
  | "presupuesto"
  | "descartado";

export type Presupuesto = {
  /** Muebles, encimera e instalación, sin IVA. */
  muebles?: number;
  /** Electrodomésticos, sin IVA. */
  electrodomesticos?: number;
  /** Tipo de IVA que aplican a los muebles con instalación. */
  ivaMuebles?: number;
  documento?: string;
};

export type Proveedor = {
  nombre: string;
  localidad: string;
  km: number;
  tipo: string;
  marcas?: string;
  contacto?: string;
  email: string;
  telefono?: string;
  web?: string;
  estado: EstadoProveedor;
  /** Fecha del último movimiento (ISO). */
  ultimoContacto: string;
  /** Qué ha pasado en ese último movimiento. */
  ultimaNota: string;
  proximoPaso?: string;
  presupuesto?: Presupuesto;
  pago?: string;
  financiacion?: string;
  plazo?: string;
  notas?: string;
  /** Identificador del hilo de Gmail (thread-f). */
  hilo: string;
};

export const ESTADOS: Record<
  EstadoProveedor,
  { texto: string; tono: "neutro" | "marca" | "aviso" | "critico"; orden: number }
> = {
  presupuesto: { texto: "presupuesto", tono: "marca", orden: 0 },
  cita: { texto: "cita", tono: "aviso", orden: 1 },
  "planos-enviados": { texto: "planos enviados", tono: "marca", orden: 2 },
  respondido: { texto: "ha respondido", tono: "aviso", orden: 3 },
  "sin-respuesta": { texto: "sin respuesta", tono: "neutro", orden: 4 },
  descartado: { texto: "descartado", tono: "neutro", orden: 5 },
};

export const urlHilo = (hilo: string) => `https://mail.google.com/mail/u/0/#all/thread-f:${hilo}`;

/** Material que se manda a los proveedores. */
export const materialCocina = {
  planos: "https://drive.google.com/file/d/1CiqfCgts3DT_H_lxURPW2EVE-c8xUdoA/view",
  idea: "https://drive.google.com/file/d/1CzDyzUyZ_GVKDMJmPAiCqD0LIrZYWSnM/view",
  enviado: "2026-09-23",
};

export const proveedoresCocina: Proveedor[] = [
  {
    nombre: "Wengué Interiorismo",
    localidad: "Medina de Rioseco",
    km: 45,
    tipo: "Estudio de interiorismo",
    contacto: "M. Mar",
    email: "m.mar@wengueinteriorismo.com",
    telefono: "983 72 02 79 · 685 45 49 27",
    web: "https://www.wengueinteriorismo.com/",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Preparará diseño y presupuesto; le enviamos planos e idea.",
    proximoPaso: "Esperar diseño y presupuesto.",
    hilo: "1877136220197364401",
  },
  {
    nombre: "Ekonomueble",
    localidad: "Villada · Sahagún",
    km: 30,
    tipo: "Tienda de muebles",
    email: "info@ekonomueble.com",
    telefono: "987 78 01 71",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Preguntaron colores; enviados planos, idea y colores (crema y verde salvia).",
    proximoPaso: "Esperar presupuesto.",
    hilo: "1877136225372870530",
  },
  {
    nombre: "Muebles Prieto",
    localidad: "Mansilla de las Mulas",
    km: 50,
    tipo: "Fabricante a medida",
    email: "contacto@mueblesprieto.com",
    telefono: "987 310 515 · 696 989 398",
    web: "https://mueblesprieto.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136229848193202",
  },
  {
    nombre: "Ángel Cocinas y Baños",
    localidad: "Benavente",
    km: 65,
    tipo: "Estudio de cocinas",
    marcas: "OB Cocinas",
    email: "info@angelcocinas.com",
    telefono: "980 63 82 57",
    web: "https://www.angelcocinas.com/",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Pidieron el plano acotado; enviados planos e idea.",
    proximoPaso: "Esperar presupuesto.",
    hilo: "1877136238929558311",
  },
  {
    nombre: "Puertas Álvarez y Pozo",
    localidad: "Santa María del Páramo",
    km: 60,
    tipo: "Carpintería",
    email: "info@puertasalvarezypozo.es",
    telefono: "987 35 12 48",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136240767191471",
  },
  {
    nombre: "Noveli",
    localidad: "Santa Olaja de la Ribera (León)",
    km: 65,
    tipo: "Fabricación propia a medida",
    marcas: "Neolith, Compac",
    contacto: "Javier Martínez",
    email: "javiermartinez@noveli.es",
    telefono: "987 61 04 11 · 645 90 36 77",
    web: "https://www.novely.es/",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Pidió planos; enviados planos e idea.",
    proximoPaso: "Esperar presupuesto.",
    hilo: "1877136244190092916",
  },
  {
    nombre: "Carlos del Canto",
    localidad: "León",
    km: 70,
    tipo: "Estudio de cocinas",
    marcas: "Cosentino, Bosch, Smeg",
    email: "info@carlosdelcanto.com",
    telefono: "987 104 205",
    web: "https://carlosdelcanto.com/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136248751793072",
  },
  {
    nombre: "Grupo Althea",
    localidad: "León",
    km: 70,
    tipo: "Estudio de cocinas · gama media-alta",
    marcas: "Arrital, Doimo",
    email: "info@grupoalthealeon.com",
    telefono: "987 07 07 83",
    web: "https://www.grupoalthealeon.com/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136253551911434",
  },
  {
    nombre: "nebur",
    localidad: "Valladolid",
    km: 80,
    tipo: "Estudio de cocinas",
    email: "hola@nebur.es",
    telefono: "983 84 86 52",
    web: "https://nebur.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136258926704997",
  },
  {
    nombre: "IKEA Valladolid",
    localidad: "Arroyo de la Encomienda",
    km: 85,
    tipo: "Gran superficie",
    email: "business.valladolid.es@ikea.com",
    telefono: "691 513 391",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Nos derivan al equipo de cocinas; enviados planos e idea.",
    proximoPaso: "Esperar la llamada del equipo de cocinas.",
    notas: "Vende muebles y montaje por separado: los muebles probablemente vayan al 21 %.",
    hilo: "1877136263574113644",
  },
  {
    nombre: "Terracota Cocinas",
    localidad: "Valladolid",
    km: 80,
    tipo: "Estudio de cocinas",
    marcas: "OB Cocinas",
    email: "info@terracotacocinas.es",
    telefono: "983 570 550",
    web: "https://terracotacocinas.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    notas: "Probablemente la «Cocinas Javier» que buscabais: las reseñas destacan a un Javier.",
    hilo: "1877136312664056459",
  },
  {
    nombre: "Cocinas Valdueza",
    localidad: "Valladolid",
    km: 80,
    tipo: "Estudio de cocinas",
    email: "info@valdueza.es",
    telefono: "983 204 191",
    web: "https://valdueza.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136324490685847",
  },
  {
    nombre: "Duherre",
    localidad: "Valladolid",
    km: 80,
    tipo: "Estudio de cocina y baño",
    marcas: "Delta Cocinas",
    email: "duherre@gmail.com",
    telefono: "983 39 64 81",
    web: "https://duherre.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    hilo: "1877136326780178315",
  },
  {
    nombre: "Parra & Luengo",
    localidad: "Valladolid",
    km: 80,
    tipo: "Estudio de cocinas",
    marcas: "Delta Cocinas",
    contacto: "Israel Parra",
    email: "info@parracocinas.com",
    telefono: "983 856 876 · 633 192 020",
    web: "https://www.parracocinas.com/",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Se desplazan a Mayorga y proponen cita en su estudio; tienen planos e idea.",
    proximoPaso: "Cita en espera: primero comparar propuestas por correo.",
    hilo: "1877136328850623883",
  },
  {
    nombre: "Roshe",
    localidad: "Tordesillas",
    km: 80,
    tipo: "Estudio de cocinas",
    marcas: "Delta Cocinas",
    email: "info@roshe.es",
    telefono: "983 072 159 · 665 811 427",
    web: "https://www.roshe.es/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    notas: "5,0 en Google con 124 reseñas.",
    hilo: "1877136332672571910",
  },
  {
    nombre: "KüchenHouse",
    localidad: "Valladolid",
    km: 80,
    tipo: "Franquicia de cocinas alemanas",
    email: "valladolid@kuchenhouse.es",
    telefono: "687 645 389",
    web: "https://www.kuchenhouse.com/tienda-muebles-cocinas-valladolid/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    notas: "10 años de garantía y financiación a 12 meses sin intereses, según su web.",
    hilo: "1877136700456706813",
  },
  {
    nombre: "Grupo Castrillo",
    localidad: "Valladolid",
    km: 80,
    tipo: "Cocinas alemanas",
    email: "castrillo@grupocastrillo.com",
    telefono: "983 29 34 46",
    web: "https://grupocastrillo.com/",
    estado: "sin-respuesta",
    ultimoContacto: "2026-09-23",
    ultimaNota: "Petición inicial enviada.",
    notas: "Sólo con cita previa.",
    hilo: "1877136859257122962",
  },
  {
    nombre: "Schmidt Valladolid",
    localidad: "Valladolid",
    km: 80,
    tipo: "Franquicia (Schmidt, Francia)",
    contacto: "Yaiza Velasco",
    email: "yaiza.velasco@schmidt-depcul.es",
    telefono: "983 240 582",
    web: "https://www.home-design.schmidt/es-es/tiendas/valladolid/valladolid",
    estado: "planos-enviados",
    ultimoContacto: "2026-09-24",
    ultimaNota: "Hablamos por teléfono; enviados planos e idea para el diseño.",
    proximoPaso: "Esperar diseño y presupuesto.",
    notas: "Promoción de encimera laminada hasta el 30 de septiembre.",
    hilo: "1877136861288429040",
  },
];

export function resumenCocinas(lista: Proveedor[] = proveedoresCocina) {
  const cuenta = (e: EstadoProveedor[]) => lista.filter((p) => e.includes(p.estado)).length;
  const conPresupuesto = lista.filter((p) => p.presupuesto?.muebles !== undefined);
  const totales = conPresupuesto.map(
    (p) => (p.presupuesto?.muebles ?? 0) + (p.presupuesto?.electrodomesticos ?? 0),
  );

  return {
    contactados: lista.length,
    respondidos: cuenta(["respondido", "planos-enviados", "cita", "presupuesto"]),
    planosEnviados: cuenta(["planos-enviados", "cita", "presupuesto"]),
    citas: cuenta(["cita"]),
    presupuestos: conPresupuesto.length,
    masBarato: totales.length ? Math.min(...totales) : undefined,
    ordenados: [...lista].sort(
      (a, b) =>
        ESTADOS[a.estado].orden - ESTADOS[b.estado].orden ||
        b.ultimoContacto.localeCompare(a.ultimoContacto) ||
        a.km - b.km,
    ),
  };
}

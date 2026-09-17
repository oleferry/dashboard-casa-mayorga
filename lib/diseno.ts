/**
 * Lo que ya está fijado del diseño exterior, extraído de la memoria del
 * proyecto visado (expediente 2025-00624), de las Normas Urbanísticas
 * Municipales de Mayorga que esa memoria recoge, y del informe técnico
 * municipal sobre fachadas. Las ideas y decisiones propias no van aquí:
 * se leen en vivo de la pestaña «Ideas» de la hoja.
 */

export type Fuente = "proyecto" | "normativa" | "ayuntamiento";

export type Definicion = { titulo: string; detalle?: string; fuente: Fuente };

export const FUENTES: Record<Fuente, { etiqueta: string; url: string }> = {
  proyecto: {
    etiqueta: "Proyecto visado",
    url: "https://drive.google.com/file/d/1EyMeR2-r-cickt6DyYE7OrwAci987SHs/view",
  },
  normativa: {
    etiqueta: "Normas municipales",
    url: "https://drive.google.com/file/d/1EyMeR2-r-cickt6DyYE7OrwAci987SHs/view",
  },
  ayuntamiento: {
    etiqueta: "Ayuntamiento",
    url: "https://drive.google.com/file/d/1871fc1qXFPbrYQZeOEL6jsvQNFDN0jHi/view",
  },
};

export const definiciones: { area: string; items: Definicion[] }[] = [
  {
    area: "Fachada",
    items: [
      {
        titulo: "Enfoscado de mortero monocapa",
        detalle: "Acabado general de la fachada y también de la medianera.",
        fuente: "proyecto",
      },
      {
        titulo: "Zócalo y entrepaños de huecos con aplacado de piedra",
        detalle: "En los puntos que marcan los alzados.",
        fuente: "proyecto",
      },
      {
        titulo: "Vierteaguas de piedra en las ventanas",
        detalle: "Sección trapecial, con goterón.",
        fuente: "proyecto",
      },
      {
        titulo: "Colores del entorno: ocres o blancos",
        detalle:
          "El informe municipal sobre fachadas del casco urbano, que incluye la Calle Salud 1, exige acabados en esos tonos.",
        fuente: "ayuntamiento",
      },
    ],
  },
  {
    area: "Carpintería exterior",
    items: [
      { titulo: "Ventanas de PVC", fuente: "proyecto" },
      {
        titulo: "Persianas monoblock de lamas de aluminio",
        detalle: "Del mismo color que la carpintería e inyectadas con poliuretano.",
        fuente: "proyecto",
      },
    ],
  },
  {
    area: "Cubierta",
    items: [
      {
        titulo: "Teja cerámica tipo Borja o equivalente",
        detalle: "Inclinada a varias aguas. La normativa exige teja en tonos ocres o rojizos.",
        fuente: "proyecto",
      },
      { titulo: "Pendiente máxima de 27° y aleros vistos de hasta 60 cm", fuente: "normativa" },
      {
        titulo: "Chimeneas forradas de ladrillo caravista",
        detalle: "Rematadas con tejadillo de acero inoxidable.",
        fuente: "proyecto",
      },
    ],
  },
  {
    area: "Límites para lo que se añada",
    items: [
      {
        titulo: "Placas solares en el faldón trasero",
        detalle: "Hacia el patio y sin verse desde la calle.",
        fuente: "normativa",
      },
      { titulo: "Balcones y miradores acristalados con vuelo máximo de 50 cm", fuente: "normativa" },
      {
        titulo: "Cierre de parcela de fábrica hasta 2 m",
        detalle: "Predominando el macizo sobre el hueco y con colores del entorno.",
        fuente: "normativa",
      },
      {
        titulo: "Materiales acordes con los tradicionales del entorno",
        detalle: "Tanto en el material como en su color, despiece y forma de colocación.",
        fuente: "normativa",
      },
    ],
  },
];

/** Lo que el proyecto deja expresamente a elección de la propiedad. */
export const porElegir: { titulo: string; detalle: string }[] = [
  { titulo: "Color exacto del monocapa", detalle: "Dentro de los ocres o blancos." },
  { titulo: "Piedra del zócalo y los entrepaños", detalle: "Tipo, color y acabado." },
  { titulo: "Color de ventanas y persianas", detalle: "Persianas del mismo color que el PVC." },
  { titulo: "Azulejo de cocina y baños", detalle: "Previsto en 60×30 horizontal; color y tono a escoger." },
  { titulo: "Suelo de planta baja", detalle: "Gres porcelánico rectificado; formato y color a elegir." },
  {
    titulo: "Pavimento de patio y garaje",
    detalle: "A elegir; la alternativa prevista es solera pulida u hormigón impreso.",
  },
];

/** Documentos gráficos donde se ve el diseño. */
export const referenciasDiseno = [
  {
    titulo: "Planos visados",
    detalle: "Incluyen los alzados con la fachada definitiva.",
    url: "https://drive.google.com/file/d/13QUDYNOnrMEUTRUFT1RnnaR6IUQj7S4S/view",
  },
  {
    titulo: "Propuesta final de distribución",
    detalle: "Versión 02.6, abril de 2025.",
    url: "https://drive.google.com/drive/folders/1ydIAbdizsJz4q3oasfo9j5tgy7xQnR_q",
  },
  {
    titulo: "Informe municipal de fachadas",
    detalle: "Condiciones de color y ornato del casco urbano.",
    url: "https://drive.google.com/file/d/1871fc1qXFPbrYQZeOEL6jsvQNFDN0jHi/view",
  },
];

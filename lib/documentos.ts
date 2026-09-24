/**
 * Documentación del proyecto. Los enlaces apuntan a Google Drive y sólo
 * son accesibles para quien tenga permiso sobre la carpeta.
 */

export type Documento = {
  titulo: string;
  descripcion: string;
  fecha?: string;
  url: string;
  clave?: boolean;
};

export type GrupoDocumental = {
  id: string;
  titulo: string;
  descripcion: string;
  documentos: Documento[];
};

const archivo = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const carpeta = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export const carpetaRaiz = carpeta("1atssVlrNnQMad_GR41I275MLtiMGeS7D");

export const hojaCostes =
  "https://docs.google.com/spreadsheets/d/11jY3NY1xd9NeC1A-ssOFolTJoUnHYJe1CbZEFKpoU0w/edit";

export const gruposDocumentales: GrupoDocumental[] = [
  {
    id: "licencia",
    titulo: "Licencia y trámites municipales",
    descripcion: "Autorización para construir y justificantes de tasas e impuestos.",
    documentos: [
      {
        titulo: "Licencia de obras",
        descripcion: "Concedida por el Ayuntamiento de Mayorga.",
        fecha: "2026-01-07",
        url: archivo("1UnBYMpAVNWz50yUHNe5AgO2xULULZtHQ"),
        clave: true,
      },
      {
        titulo: "Notificación al interesado",
        descripcion: "Comunicación oficial de la concesión de la licencia.",
        fecha: "2026-01-07",
        url: archivo("1vU5kKuL3G5UjpLgmtmozgN8aBdezYRAU"),
      },
      {
        titulo: "Permiso de obras del Ayuntamiento",
        descripcion: "Resolución previa del expediente.",
        fecha: "2025-12-18",
        url: archivo("11kKK8U31gjezAuzI6Ar5nBHZxS4PM1sC"),
      },
      {
        titulo: "Recibo del pago de la licencia (ICIO)",
        descripcion: "Cargo de 2.436,01 € en cuenta.",
        fecha: "2025-12-19",
        url: archivo("1Rs-8VWMdhl4LLV92z01IibcnWrFebi50"),
        clave: true,
      },
      {
        titulo: "Solicitud e instancia firmada",
        descripcion: "Expediente 2025-E-RE-147.",
        fecha: "2025-08-26",
        url: archivo("1tvuFvsPjvFleEDHDXd6dR8pcWKiREfxS"),
      },
      {
        titulo: "Carta de fachadas del Ayuntamiento",
        descripcion: "Condicionantes estéticos del casco urbano.",
        fecha: "2025-08-26",
        url: archivo("1871fc1qXFPbrYQZeOEL6jsvQNFDN0jHi"),
      },
    ],
  },
  {
    id: "proyecto",
    titulo: "Proyecto técnico",
    descripcion: "Documentación visada, planos y mediciones.",
    documentos: [
      {
        titulo: "Memoria, pliego, EBSS y presupuesto",
        descripcion: "Proyecto de ejecución visado, expediente 2025-00624.",
        fecha: "2025-10-08",
        url: archivo("1EyMeR2-r-cickt6DyYE7OrwAci987SHs"),
        clave: true,
      },
      {
        titulo: "Planos del proyecto",
        descripcion: "Juego completo de planos firmados.",
        fecha: "2025-10-08",
        url: archivo("13QUDYNOnrMEUTRUFT1RnnaR6IUQj7S4S"),
        clave: true,
      },
      {
        titulo: "Presupuesto detallado por partidas",
        descripcion: "Mediciones y precios unitarios, 1.314 líneas.",
        url: archivo("16GZ072eXSjF-nYrqRipDoXtFIas0pWJY"),
      },
      {
        titulo: "Resumen de presupuesto por capítulos",
        descripcion: "Total ejecución material 361.327,16 €.",
        url: archivo("1FOgyBTH3KWQNKULwQObsvU5o8dpugy0d"),
      },
      {
        titulo: "Autorización de trámites al arquitecto",
        descripcion: "Representación de Alberto Magdaleno ante la administración.",
        fecha: "2025-10-31",
        url: archivo("1xTq8s3n3K6b1JAZelRBSPfDe_JIXtvXE"),
      },
      {
        titulo: "Propuestas de vivienda (histórico)",
        descripcion: "Alternativas de distribución y vistas previas al proyecto final.",
        url: carpeta("1ydIAbdizsJz4q3oasfo9j5tgy7xQnR_q"),
      },
    ],
  },
  {
    id: "constructor",
    titulo: "Constructor y presupuestos de obra",
    descripcion: "Ofertas recibidas y presupuesto vigente de ejecución.",
    documentos: [
      {
        titulo: "Factura 094/26 — 1.ª certificación",
        descripcion: "Septiembre: 54.000 € + 10 % IVA = 59.400 €. Cuenta distinta a la del contrato: confirmar antes de pagar.",
        fecha: "2026-09-23",
        url: archivo("13FWjaCeMa1mavZYqkBDtn0zlid-lt3Sa"),
        clave: true,
      },
      {
        titulo: "Resumen de presupuesto (julio 2026)",
        descripcion: "Última versión firmada por la dirección de ejecución.",
        fecha: "2026-07-08",
        url: archivo("1AggIb1rfEtdFS05y5mybEAp0tkwzqxuv"),
        clave: true,
      },
      {
        titulo: "Presupuesto Polo Redondo",
        descripcion: "Oferta de 297.395 € sin IVA, presupuesto 001/26.",
        fecha: "2026-02-23",
        url: archivo("1tKARmwb7fp3fS6YVvOI0Q9tbRR7p6dwM"),
        clave: true,
      },
      {
        titulo: "Presupuesto ajustado de la vivienda",
        descripcion: "Resumen de ajuste sobre la oferta inicial.",
        fecha: "2026-08-03",
        url: archivo("1OuX-WrOvCWMryTDLK87xLyI_rPTYNU9U"),
      },
      {
        titulo: "Presupuesto a nombre de Daniel y María",
        descripcion: "Versión nominativa del presupuesto de obra.",
        fecha: "2026-02-16",
        url: archivo("1x7_kT5yFGwsA_sK489_lFNSNg8kc5e_2"),
      },
      {
        titulo: "Presupuesto de Alberto Magdaleno",
        descripcion: "Honorarios de redacción de proyecto y dirección de obra.",
        fecha: "2024-08-28",
        url: archivo("1nu5YtVee4hThZG5xZsGlTBHy2nBvZuRC"),
      },
    ],
  },
  {
    id: "tasacion",
    titulo: "Tasación",
    descripcion: "Valoración en hipótesis de edificio terminado, base del LTV.",
    documentos: [
      {
        titulo: "Informe de tasación completo",
        descripcion: "Tecnitasa — 424.018,80 € en hipótesis de edificio terminado.",
        fecha: "2026-07-16",
        url: archivo("1mmkRoCBksN0lgsSL2Yj4gMRWHUDgO_AI"),
        clave: true,
      },
      {
        titulo: "Certificado de tasación",
        descripcion: "Certificado resumen del expediente.",
        fecha: "2026-07-16",
        url: archivo("1DRG5r-ybDTEpB1lc15S1yjjsve6BACF9"),
      },
      {
        titulo: "Factura de la tasación",
        descripcion: "485,00 € + IVA = 586,85 €.",
        fecha: "2026-07-16",
        url: archivo("1dPvjgX78bT6YMMa8XmI957C4_0RmiYA3"),
      },
      {
        titulo: "Ficha de solicitud y términos de contratación",
        descripcion: "Condiciones del encargo de tasación.",
        fecha: "2026-02-23",
        url: archivo("17YTrTUeyGoDF1gfCaohC4oU8051YtrJl"),
      },
    ],
  },
  {
    id: "financiacion",
    titulo: "Financiación",
    descripcion: "Dossier de hipoteca de autopromoción y ofertas bancarias.",
    documentos: [
      {
        titulo: "Ofertas de bancos",
        descripcion: "Carpeta con las propuestas recibidas de las distintas entidades.",
        url: carpeta("1DCWLaUe9qmqX-gOXhG7PdLY9bScTBRMF"),
        clave: true,
      },
      {
        titulo: "Documentación de Unicaja",
        descripcion: "Carpeta de la entidad seleccionada.",
        url: carpeta("1hiJpdvmc0AS0lmHhtGH9IcCZ2zINWA_5"),
        clave: true,
      },
      {
        titulo: "Dossier de hipoteca de autopromoción",
        descripcion: "Documento presentado a las entidades.",
        fecha: "2025-11-30",
        url: archivo("11B_mobn8jT0wXG8ThiKPDAmjfn-zEp48"),
      },
      {
        titulo: "Carta de presentación",
        descripcion: "Resumen del perfil de los promotores para el banco.",
        fecha: "2025-11-30",
        url: archivo("1ue5pOrdpHt37ww1g-RyT8G79DxmkW_mI"),
      },
      {
        titulo: "Documentación económica completa",
        descripcion: "Nóminas, rentas, modelos 100 y 130, informes fiscales.",
        url: carpeta("1rUMxZiDLarVf79YlRmnxX5a0n5px7CKS"),
      },
    ],
  },
  {
    id: "solar",
    titulo: "Solar, Registro y Catastro",
    descripcion: "Titularidad de la parcela y regularización de superficie.",
    documentos: [
      {
        titulo: "Escrituras del solar",
        descripcion: "Título de propiedad de la parcela.",
        url: archivo("1TQrjNpN_EU9Bpy9UdF1WKOxW9uuDdDL9"),
        clave: true,
      },
      {
        titulo: "Nota simple registral",
        descripcion: "Situación registral de la finca. Refleja 336 m².",
        fecha: "2026-02-25",
        url: archivo("1AeiMDaW1jbHH0geBQg1APWbLTiLfBBP_"),
        clave: true,
      },
      {
        titulo: "Acta de rectificación de superficie",
        descripcion: "Tramitación para ajustar el Registro a los 516,60 m² del Catastro.",
        fecha: "2026-03-18",
        url: archivo("1flBf8lHy-g2Lz13QFh0uSCCU_-Dzczza"),
        clave: true,
      },
      {
        titulo: "Certificación catastral 2026",
        descripcion: "Referencia catastral 3010501UM1731S0001SW.",
        fecha: "2026-03-13",
        url: archivo("1XZSmgxqnlkdRmiA6qDmvJslXvnuO-i37"),
      },
      {
        titulo: "Certificación catastral de titularidad — María",
        descripcion: "Acredita la titularidad de María Vega.",
        url: archivo("1b1K37sxdiYKuTqitCsCKsIdb3BcCVF__"),
      },
      {
        titulo: "Certificación catastral de titularidad — Daniel",
        descripcion: "Acredita la titularidad de Daniel Paniagua.",
        url: archivo("1azyik5imY6X98ltsU1xZpNu-hT3VZs9q"),
      },
    ],
  },
  {
    id: "facturas",
    titulo: "Facturas y justificantes",
    descripcion: "Carpeta viva. Aquí se irán acumulando las facturas de obra.",
    documentos: [
      {
        titulo: "Carpeta de facturas",
        descripcion: "Todas las facturas del proyecto en Google Drive.",
        url: carpeta("1UMNhUNbgEx_iwhT-PKI2NZiwiExtOajQ"),
        clave: true,
      },
      {
        titulo: "Hoja de control de costes",
        descripcion: "Hoja de cálculo que alimenta este panel en tiempo real.",
        url: hojaCostes,
        clave: true,
      },
    ],
  },
  {
    id: "suministros",
    titulo: "Suministros y acometidas",
    descripcion:
      "Altas de luz y agua. La acometida provisional de obra ya tiene propuesta; la definitiva de la vivienda está sin pedir.",
    documentos: [
      {
        titulo: "Certificado de instalación eléctrica de obra",
        descripcion:
          "Boletín inscrito en el Servicio Territorial de Industria de Valladolid, registro 47/BT/188819. Instalación temporal para maquinaria de obra, grupo D1: 9.200 W admisibles, 230 V monofásica. Vigencia: la duración de la obra. Instalador Francisco Javier Cela Maniega, nº 47-I-BTE1-5416.",
        fecha: "2026-09-06",
        url: archivo("1BFX8o954pRldaXqM3zCSwAxG4smbm2uI"),
        clave: true,
      },
      {
        titulo: "Propuesta previa de nuevos suministros — I-DE (Iberdrola)",
        descripcion:
          "Suministro provisional de obra, 5,75 kW. Refuerzo 107,70 € + entronque 28,32 € = 164,58 € con IVA. Referencia 9047509190, CUPS ES0021000044696052SB.",
        fecha: "2026-09-02",
        url: archivo("1nqQH4sDb80W-WjM0zYivVgClVGP9n9as"),
        clave: true,
      },
    ],
  },
  {
    id: "extras",
    titulo: "Estudios complementarios",
    descripcion: "Partidas fuera del contrato principal, todavía sin decidir.",
    documentos: [
      {
        titulo: "Proyecto de riego de jardín",
        descripcion: "Propuesta económica de riego para Valladolid.",
        fecha: "2026-05-18",
        url: archivo("1c644ZTjdqkkl7RYJA6ctamKZCPiBq7Tk"),
      },
      {
        titulo: "Caseta de jardín / gimnasio",
        descripcion: "Propuesta de caseta por 10.000 €.",
        fecha: "2026-05-18",
        url: archivo("1qi9zRI4xPNFKuO27-gU1JLVeX4ELdVwQ"),
      },
      {
        titulo: "Caseta Palmako con techo split",
        descripcion: "Alternativa de caseta prefabricada.",
        fecha: "2026-05-18",
        url: archivo("10L6gThngZ9R8ejAqGHXl17JYiRGflXzI"),
      },
    ],
  },
];

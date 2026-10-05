/**
 * Edificio anexo del fondo del patio: trastero, sala bici (que será el
 * gimnasio), aseo y la solera que en el proyecto es el garaje. Medidas interiores del plano A03 del
 * proyecto visado; la altura, de la sección A06.
 */

export type Pared = { pared: string; metros: number; lindaCon: string; nota?: string };

export type SalaAnexo = {
  nombre: string;
  uso: string;
  superficie: number;
  acceso: string;
  paredes: Pared[];
};

/** Altura libre en la parte baja de la cubierta, que sube hacia el fondo. */
export const alturaAnexo = 2.95;

export const salasAnexo: SalaAnexo[] = [
  {
    nombre: "Trastero",
    uso: "Estanterías en los laterales y al fondo, y bicis colgadas",
    superficie: 12.4,
    acceso: "Hueco de ≈ 1 m en la pared este, desde la solera",
    paredes: [
      { pared: "Norte", metros: 5.62, lindaCon: "Exterior" },
      { pared: "Sur", metros: 5.51, lindaCon: "Gimnasio y aseo" },
      { pared: "Oeste (fondo)", metros: 2.03, lindaCon: "Exterior" },
      { pared: "Este", metros: 2.46, lindaCon: "Solera", nota: "Con el hueco de paso de ≈ 1 m" },
    ],
  },
  {
    nombre: "Gimnasio (sala bici)",
    uso: "Cinta, bici Zwift con dos teles, rack y suelo libre",
    superficie: 12.2,
    acceso: "Puerta de 1,00 m al patio, en el extremo este de la pared sur",
    paredes: [
      { pared: "Norte", metros: 3.8, lindaCon: "Trastero" },
      { pared: "Sur", metros: 3.66, lindaCon: "Patio", nota: "1,00 m de puerta; 2,66 m de pared libre" },
      { pared: "Oeste", metros: 3.28, lindaCon: "Exterior" },
      { pared: "Este", metros: 3.28, lindaCon: "Aseo" },
    ],
  },
  {
    nombre: "Aseo",
    uso: "Ducha, inodoro y lavabo; vestuario del gimnasio",
    superficie: 4.9,
    acceso: "Puerta de 1,00 m al patio",
    paredes: [
      { pared: "Norte", metros: 1.5, lindaCon: "Trastero", nota: "Ducha de 1,50 m" },
      { pared: "Sur", metros: 1.5, lindaCon: "Patio", nota: "1,00 m de puerta" },
      { pared: "Oeste", metros: 3.28, lindaCon: "Gimnasio" },
      { pared: "Este", metros: 3.28, lindaCon: "Solera", nota: "Inodoro y lavabo" },
    ],
  },
  {
    nombre: "Solera para el coche",
    uso: "Solera de hormigón armado; algún día, techo y puerta. En el proyecto figura como garaje",
    superficie: 34.4,
    acceso: "Desde la calle Escuelas Viejas, por un hueco de 4,00 m",
    paredes: [
      {
        pared: "Norte",
        metros: 5.32,
        lindaCon: "Calle Escuelas Viejas",
        nota: "Hueco de 4,00 m, con machones de 0,64 y 0,68 m",
      },
      { pared: "Sur", metros: 5.3, lindaCon: "Patio", nota: "Abierta" },
      { pared: "Oeste", metros: 6.3, lindaCon: "Trastero y aseo" },
      { pared: "Este", metros: 6.71, lindaCon: "Exterior" },
    ],
  },
];

/**
 * Cambios propuestos sobre el proyecto (pendientes de hablar con el
 * arquitecto). El plano del panel ya los dibuja.
 */
export const propuestaAnexo: string[] = [
  "Desplazar 0,30 m hacia la solera el tabique entre gimnasio y aseo y el del aseo con la solera: el gimnasio pasa a 4,10 × 3,28 m, el aseo conserva 1,50 m y la solera queda en 5,02 m de ancho",
  "La cinta, en el sentido largo, con 2 m libres detrás; las dos teles en la pared oeste",
  "Puerta del gimnasio abriendo hacia fuera o corredera, y una ventana al patio en la pared sur",
  "Puerta del trastero a la solera de exterior, con cerradura, mientras no haya techo",
  "Solera de unos 15 cm con mallazo, pendiente del 1–2 %, arranques para el futuro techo y tubo de luz para el motor de la puerta",
  "Puerta del coche seccional o enrollable: una corredera no tiene sitio donde recogerse",
];

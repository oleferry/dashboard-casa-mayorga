/**
 * Edificio anexo del fondo del patio, junto al garaje: trastero, sala bici
 * (que será el gimnasio) y aseo. Medidas interiores del plano A03 del
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
    acceso: "Hueco de ≈ 1 m en la pared este, desde el garaje",
    paredes: [
      { pared: "Norte", metros: 5.62, lindaCon: "Exterior" },
      { pared: "Sur", metros: 5.51, lindaCon: "Gimnasio y aseo" },
      { pared: "Oeste (fondo)", metros: 2.03, lindaCon: "Exterior" },
      { pared: "Este", metros: 2.46, lindaCon: "Garaje", nota: "Con el hueco de paso de ≈ 1 m" },
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
      { pared: "Este", metros: 3.28, lindaCon: "Garaje", nota: "Inodoro y lavabo" },
    ],
  },
];

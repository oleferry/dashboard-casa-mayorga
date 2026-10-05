/**
 * Plano de la distribución propuesta del anexo: tabiques del gimnasio y del
 * aseo desplazados 0,30 m hacia la solera. Las coordenadas están en metros
 * (x hacia el este desde la pared oeste del gimnasio, y hacia el sur desde la
 * calle Escuelas Viejas); los muros se simplifican rectos.
 */

const ESCALA = 60;
const MARGEN_X = 40;
const MARGEN_Y = 56;
const X = (m: number) => MARGEN_X + m * ESCALA;
const Y = (m: number) => MARGEN_Y + m * ESCALA;
const pts = (lista: [number, number][]) => lista.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");

type Caja = { x: number; y: number; w: number; h: number };

function Mueble({
  caja,
  titulo,
  subtitulo,
  tono = "marca",
}: {
  caja: Caja;
  titulo?: string;
  subtitulo?: string;
  tono?: "marca" | "neutro" | "coche";
}) {
  const estilo =
    tono === "marca"
      ? { fill: "var(--marca-fondo)", stroke: "var(--marca)" }
      : tono === "coche"
        ? { fill: "var(--raya)", stroke: "var(--tenue)" }
        : { fill: "var(--raya)", stroke: "var(--suave)" };
  const cx = X(caja.x + caja.w / 2);
  const cy = Y(caja.y + caja.h / 2);
  return (
    <g>
      <rect
        x={X(caja.x)}
        y={Y(caja.y)}
        width={caja.w * ESCALA}
        height={caja.h * ESCALA}
        rx={tono === "coche" ? 12 : 3}
        strokeWidth={0.8}
        {...estilo}
      />
      {titulo && (
        <text x={cx} y={subtitulo ? cy - 2 : cy + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--tinta)">
          {titulo}
        </text>
      )}
      {subtitulo && (
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          {subtitulo}
        </text>
      )}
    </g>
  );
}

function Libre({ caja, texto, subtexto }: { caja: Caja; texto?: string; subtexto?: string }) {
  const cx = X(caja.x + caja.w / 2);
  const cy = Y(caja.y + caja.h / 2);
  return (
    <g>
      <rect
        x={X(caja.x)}
        y={Y(caja.y)}
        width={caja.w * ESCALA}
        height={caja.h * ESCALA}
        fill="none"
        stroke="var(--suave)"
        strokeWidth={0.8}
        strokeDasharray="4 3"
      />
      {texto && (
        <text x={cx} y={cy} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          {texto}
        </text>
      )}
      {subtexto && (
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          {subtexto}
        </text>
      )}
    </g>
  );
}

const muro = { fill: "none", stroke: "var(--tinta)", strokeWidth: 2.5, strokeLinejoin: "round" as const };

export function PlanoAnexo() {
  const bicis = [3.2, 3.62, 4.04, 4.46, 4.88, 5.3];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 760 520"
        className="w-full min-w-[640px]"
        role="img"
        aria-label="Plano de la distribución propuesta del anexo: trastero, gimnasio, aseo y solera para el coche"
      >
        <text x={X(8.56)} y={30} textAnchor="middle" fontSize={12} fill="var(--tenue)">
          Calle Escuelas Viejas
        </text>

        {/* Trastero */}
        <polygon points={pts([[0, 0.43], [5.85, 0], [5.85, 0.45], [0, 0.88]])} fill="var(--raya)" stroke="var(--suave)" strokeWidth={0.8} />
        <text x={X(2.9)} y={Y(0.5)} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          Estantería 0,45 m
        </text>
        <Mueble caja={{ x: 0, y: 0.88, w: 0.45, h: 1.13 }} tono="neutro" />
        <Mueble caja={{ x: 0, y: 2.01, w: 2.9, h: 0.45 }} titulo="Estantería" tono="neutro" />
        {bicis.map((b) => (
          <rect key={b} x={X(b)} y={Y(1.41)} width={4} height={1.05 * ESCALA} fill="var(--marca)" />
        ))}
        <text x={X(4.4)} y={Y(1.28)} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          Bicis colgadas
        </text>
        <text x={X(2.1)} y={Y(1.35)} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--tinta)">
          Trastero
        </text>
        <text x={X(2.1)} y={Y(1.35) + 15} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          5,85 × 2,0–2,5 m
        </text>
        <polyline points={pts([[5.85, 1.7], [5.85, 2.46], [0, 2.46], [0, 0.43], [5.85, 0], [5.85, 0.7]])} {...muro} />

        {/* Gimnasio */}
        <rect x={X(0)} y={Y(2.96)} width={4} height={0.5 * ESCALA} fill="var(--aviso)" />
        <rect x={X(0)} y={Y(3.96)} width={4} height={0.5 * ESCALA} fill="var(--aviso)" />
        <Mueble caja={{ x: 0.1, y: 2.76, w: 2.0, h: 0.9 }} titulo="Cinta T900" subtitulo="2,0 × 0,9" />
        <Libre caja={{ x: 2.1, y: 2.76, w: 2.0, h: 0.9 }} texto="Libre 2,0 m" />
        <Mueble caja={{ x: 0.1, y: 3.91, w: 1.5, h: 0.6 }} titulo="Zwift Ride" />
        <Mueble caja={{ x: 2.9, y: 4.16, w: 1.2, h: 1.2 }} titulo="Rack" subtitulo="1,2 × 1,2" />
        <line x1={X(3.02)} y1={Y(3.68)} x2={X(3.02)} y2={Y(5.86)} stroke="var(--marca)" strokeWidth={2.5} />
        <Libre caja={{ x: 1.75, y: 3.71, w: 1.08, h: 2.23 }} />
        <Libre caja={{ x: 0.1, y: 4.66, w: 1.65, h: 1.28 }} texto="Suelo libre" subtexto="caucho, ≈ 4 m²" />
        <polyline points={pts([[3.1, 5.99], [0, 5.99], [0, 2.71], [4.1, 2.71], [4.1, 5.99]])} {...muro} />
        <rect x={X(0.6)} y={Y(5.99) - 3} width={1.2 * ESCALA} height={6} fill="var(--panel)" stroke="var(--tinta)" strokeWidth={1} />
        <path
          d={`M${X(3.1)} ${Y(5.99)} A${ESCALA} ${ESCALA} 0 0 0 ${X(4.1)} ${Y(6.99)}`}
          fill="none"
          stroke="var(--suave)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {/* Aseo */}
        <Mueble caja={{ x: 4.35, y: 2.76, w: 1.4, h: 0.7 }} titulo="Ducha" tono="neutro" />
        <Mueble caja={{ x: 5.1, y: 4.0, w: 0.65, h: 0.42 }} titulo="WC" tono="neutro" />
        <Mueble caja={{ x: 5.25, y: 4.75, w: 0.5, h: 0.55 }} tono="neutro" />
        <text x={X(5.0)} y={Y(5.6)} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          Lavabo
        </text>
        <text x={X(4.7)} y={Y(4.3)} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--tinta)">
          Aseo
        </text>
        <polyline points={pts([[4.45, 5.99], [4.3, 5.99], [4.3, 2.71], [5.85, 2.71], [5.85, 5.99], [5.45, 5.99]])} {...muro} />

        {/* Solera */}
        <line x1={X(6.05)} y1={Y(0)} x2={X(6.39)} y2={Y(0)} {...muro} />
        <line x1={X(10.39)} y1={Y(0)} x2={X(11.07)} y2={Y(0)} {...muro} />
        <line x1={X(6.39)} y1={Y(0)} x2={X(10.39)} y2={Y(0)} stroke="var(--tinta)" strokeWidth={1.5} strokeDasharray="8 5" />
        <line x1={X(11.07)} y1={Y(0)} x2={X(11.07)} y2={Y(6.71)} {...muro} />
        <line x1={X(6.05)} y1={Y(0)} x2={X(6.05)} y2={Y(6.3)} stroke="var(--tinta)" strokeWidth={1} />
        <line x1={X(6.05)} y1={Y(6.3)} x2={X(11.07)} y2={Y(6.71)} stroke="var(--suave)" strokeWidth={1} strokeDasharray="4 3" />
        <Mueble caja={{ x: 7.47, y: 0.45, w: 1.85, h: 4.7 }} titulo="Coche" subtitulo="4,7 × 1,85" tono="coche" />
        <text x={X(8.56)} y={Y(5.6)} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--tinta)">
          Solera para el coche
        </text>
        <text x={X(8.56)} y={Y(5.6) + 15} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          5,02 × 6,3–6,7 m
        </text>
        <text x={X(8.39)} y={Y(0) + 16} textAnchor="middle" fontSize={11} fill="var(--tenue)">
          Hueco de 4,00 m
        </text>

        <text x={X(2.05)} y={Y(6.99) - 18} textAnchor="middle" fontSize={12} fill="var(--tenue)">
          Patio
        </text>

        {/* Leyenda */}
        <g fontSize={11} fill="var(--tenue)">
          <rect x={40} y={492} width={4} height={14} fill="var(--aviso)" />
          <text x={50} y={503}>Teles</text>
          <rect x={98} y={492} width={4} height={14} fill="var(--marca)" />
          <text x={108} y={503}>Bicis y barra</text>
          <rect x={196} y={493} width={18} height={12} fill="none" stroke="var(--suave)" strokeDasharray="4 3" />
          <text x={220} y={503}>Zona libre</text>
          <rect x={300} y={496} width={24} height={6} fill="var(--panel)" stroke="var(--tinta)" />
          <text x={330} y={503}>Ventana al patio</text>
          <line x1={440} y1={499} x2={464} y2={499} stroke="var(--tinta)" strokeWidth={1.5} strokeDasharray="8 5" />
          <text x={470} y={503}>Hueco para la puerta del coche</text>
        </g>
      </svg>
    </div>
  );
}

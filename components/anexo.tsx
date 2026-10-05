import { Dumbbell } from "lucide-react";
import { Panel, Seccion, Tabla, Td, Th } from "./ui";
import { num } from "@/lib/formato";
import { alturaAnexo, propuestaAnexo, salasAnexo } from "@/lib/anexo";
import { PlanoAnexo } from "./plano-anexo";

const metros = (n: number) => `${num(n)} m`;

export function SeccionAnexo() {
  return (
    <Seccion
      id="anexo"
      icono={Dumbbell}
      titulo="Anexo: gimnasio, trastero y solera"
      descripcion={`Edificio del fondo del patio, con la solera para el coche. Las tablas recogen las medidas interiores del plano A03; la altura libre es de ${metros(alturaAnexo)} en la parte baja de la cubierta.`}
    >
      <Panel className="mb-4">
        <h3 className="mb-1 text-sm font-semibold">Distribución propuesta</h3>
        <p className="suave mb-3 text-xs leading-relaxed">
          Con el gimnasio y el aseo desplazados 0,30 m hacia la solera. Medidas aproximadas: los muros se
          dibujan rectos, aunque en el plano están ligeramente en ángulo.
        </p>
        <PlanoAnexo />
        <ul className="tenue mt-3 list-disc space-y-1 border-t pt-3 pl-5 text-xs leading-relaxed">
          {propuestaAnexo.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {salasAnexo.map((s) => {
          const perimetro = s.paredes.reduce((a, p) => a + p.metros, 0);
          return (
            <div key={s.nombre} className="space-y-2">
              <Panel padding={false} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold">{s.nombre}</h3>
                  <span className="cifra text-sm font-medium">{num(s.superficie)} m²</span>
                </div>
                <p className="tenue mt-1 text-xs leading-snug">{s.uso}</p>
                <p className="suave mt-1 text-xs leading-snug">{s.acceso}</p>
              </Panel>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Pared</Th>
                    <Th numero>Lineales</Th>
                    <Th>Linda con</Th>
                  </tr>
                </thead>
                <tbody>
                  {s.paredes.map((p) => (
                    <tr key={p.pared}>
                      <Td className="text-sm">
                        {p.pared}
                        {p.nota && <span className="suave block text-xs leading-snug">{p.nota}</span>}
                      </Td>
                      <Td numero>{metros(p.metros)}</Td>
                      <Td className="tenue text-xs">{p.lindaCon}</Td>
                    </tr>
                  ))}
                  <tr>
                    <Td fuerte>Perímetro</Td>
                    <Td numero fuerte>
                      {metros(perimetro)}
                    </Td>
                    <Td>{""}</Td>
                  </tr>
                </tbody>
              </Tabla>
            </div>
          );
        })}
      </div>
    </Seccion>
  );
}

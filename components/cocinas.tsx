import { ChefHat, ClipboardList, Mail, MessageSquareReply, Receipt } from "lucide-react";
import { Etiqueta, Kpi, Panel, Seccion, Tabla, Td, Th } from "./ui";
import { euros, fechaCorta } from "@/lib/formato";
import {
  ESTADOS,
  materialCocina,
  proveedoresCocina,
  resumenCocinas,
  urlHilo,
} from "@/lib/cocinas";

export function SeccionCocina() {
  const r = resumenCocinas(proveedoresCocina);

  return (
    <Seccion
      id="cocina"
      icono={ChefHat}
      titulo="Cocina: proveedores"
      descripcion={`Presupuestos de cocina y oficio pedidos a ${r.contactados} proveedores desde el ${fechaCorta(
        materialCocina.enviado,
      )}. Los correos están en la etiqueta «Cocinas» de Gmail.`}
      acciones={
        <div className="no-imprimir flex flex-wrap gap-2">
          <a
            href={materialCocina.planos}
            target="_blank"
            rel="noopener noreferrer"
            className="panel px-3 py-1.5 text-sm transition-colors hover:bg-[var(--panel-2)]"
          >
            Planos enviados ↗
          </a>
          <a
            href={materialCocina.idea}
            target="_blank"
            rel="noopener noreferrer"
            className="panel px-3 py-1.5 text-sm transition-colors hover:bg-[var(--panel-2)]"
          >
            Idea de cocina ↗
          </a>
        </div>
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi etiqueta="Contactados" valor={String(r.contactados)} icono={Mail} />
        <Kpi
          etiqueta="Han respondido"
          valor={String(r.respondidos)}
          nota={`${r.planosEnviados} con planos e idea enviados`}
          icono={MessageSquareReply}
          tono="marca"
        />
        <Kpi
          etiqueta="Citas"
          valor={String(r.citas)}
          nota={r.citas ? "Pendientes de concretar" : undefined}
          icono={ClipboardList}
          tono={r.citas ? "aviso" : "neutro"}
        />
        <Kpi
          etiqueta="Presupuestos"
          valor={String(r.presupuestos)}
          nota={
            r.masBarato !== undefined ? `El más bajo: ${euros(r.masBarato)} sin IVA` : "Aún no ha llegado ninguno"
          }
          icono={Receipt}
        />
      </div>

      <Tabla>
        <thead>
          <tr>
            <Th ancho="15rem">Proveedor</Th>
            <Th>Estado</Th>
            <Th ancho="16rem">Último movimiento</Th>
            <Th ancho="14rem">Próximo paso</Th>
            <Th numero>Presupuesto</Th>
            <Th>Contacto</Th>
          </tr>
        </thead>
        <tbody>
          {r.ordenados.map((p) => {
            const e = ESTADOS[p.estado];
            const total =
              p.presupuesto?.muebles !== undefined
                ? p.presupuesto.muebles + (p.presupuesto.electrodomesticos ?? 0)
                : undefined;

            return (
              <tr key={p.email} style={p.estado === "descartado" ? { opacity: 0.55 } : undefined}>
                <Td>
                  {p.web ? (
                    <a
                      href={p.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline decoration-dotted underline-offset-2"
                    >
                      {p.nombre}
                    </a>
                  ) : (
                    <span className="font-medium">{p.nombre}</span>
                  )}
                  <span className="tenue mt-0.5 block text-xs leading-snug">
                    {p.localidad} · {p.km} km
                  </span>
                  <span className="suave block text-xs leading-snug">
                    {p.tipo}
                    {p.marcas ? ` · ${p.marcas}` : ""}
                  </span>
                </Td>
                <Td>
                  <Etiqueta tono={e.tono}>{e.texto}</Etiqueta>
                </Td>
                <Td>
                  <span className="cifra suave block text-xs">{fechaCorta(p.ultimoContacto)}</span>
                  <span className="block text-xs leading-snug">{p.ultimaNota}</span>
                </Td>
                <Td>
                  <span className="block text-xs leading-snug">{p.proximoPaso ?? "—"}</span>
                  {p.notas && <span className="tenue mt-1 block text-xs leading-snug">{p.notas}</span>}
                </Td>
                <Td numero>
                  {total !== undefined ? (
                    <>
                      {euros(total)}
                      {p.presupuesto?.ivaMuebles !== undefined && (
                        <span className="suave block text-xs">
                          IVA muebles {Math.round(p.presupuesto.ivaMuebles * 100)} %
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="suave">—</span>
                  )}
                </Td>
                <Td>
                  {p.contacto && <span className="block text-xs">{p.contacto}</span>}
                  <a href={`mailto:${p.email}`} className="block text-xs underline decoration-dotted underline-offset-2">
                    {p.email}
                  </a>
                  {p.telefono && <span className="tenue block text-xs">{p.telefono}</span>}
                  <a
                    href={urlHilo(p.hilo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="suave block text-xs hover:underline"
                  >
                    Ver hilo ↗
                  </a>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Tabla>

      <Panel className="mt-4">
        <h3 className="mb-2 text-sm font-semibold">A tener en cuenta al comparar</h3>
        <ul className="tenue list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
          <li>
            IVA: los muebles con instalación, contratados directamente como promotores durante la obra, van
            al 10 % (art. 91.Uno.3.1.º LIVA). Los electrodomésticos y los muebles sin instalación, al 21 %.
          </li>
          <li>
            La isla deja unos 0,80 m de paso a cada lado (lo recomendable es 0,90–1,00 m). Se ha pedido a
            todos que lo comprueben y propongan alternativa si no cabe cómoda.
          </li>
          <li>
            Comparar siempre por separado: muebles + encimera + instalación, y electrodomésticos. Pedir
            condiciones de pago, financiación y plazo de fabricación e instalación.
          </li>
        </ul>
      </Panel>
    </Seccion>
  );
}

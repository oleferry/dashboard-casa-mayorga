/**
 * Pruebas del lector de ideas. Se ejecutan con `npm test` junto a las de
 * certificaciones.
 */

import { aEstadoIdea, interpretarIdeas } from "./ideas";
import { parseCSV } from "./hoja";

let fallos = 0;

function comprobar(nombre: string, condicion: boolean) {
  if (!condicion) fallos++;
  console.log(`${condicion ? "  ok" : "FALLA"}  ${nombre}`);
}

/* 1. Pestaña de ideas con columnas desordenadas, huecos y filas vacías. */

const ideas = `"Estado","Área","Idea","Detalle","Enlace","Fecha"
"Decidido","Fachada","Monocapa en blanco roto","Dentro de los colores que admite el Ayuntamiento","https://drive.google.com/x","10/09/2026"
"Idea","Cocina","Isla con barra","","",""
"","Fachada","Zócalo de piedra caliza","","no-es-un-enlace",""
"Descartado","Exterior","Piscina","Se va de presupuesto","",""
"","","","","",""`;

const r = interpretarIdeas(parseCSV(ideas));

comprobar("detecta la pestaña", r.hayPestana);
comprobar("cuenta cuatro ideas y descarta la fila vacía", r.total === 4);
comprobar("agrupa por área en orden de aparición", r.grupos.map((g) => g.area).join() === "Fachada,Cocina,Exterior");
comprobar("junta las dos ideas de fachada", r.grupos[0].ideas.length === 2);
comprobar("cuenta las decididas", r.decididas === 1);
comprobar("sin estado queda como idea", r.grupos[0].ideas[1].estado === "idea");
comprobar("descarta enlaces que no son URL", r.grupos[0].ideas[1].enlace === undefined);
comprobar("conserva enlaces válidos", r.grupos[0].ideas[0].enlace === "https://drive.google.com/x");
comprobar("convierte la fecha a ISO", r.grupos[0].ideas[0].fecha === "2026-09-10");

/* 2. Lo que Google devuelve si la pestaña no existe: la hoja de costes. */

const costes = `"","Concepto","Desglose","Descripción","","","","","","Precio B","","","Total",""
"","Compraventa","","Pago cantidad pendiente","","1","16.000,00 €","16.000,00 €","","","0,00%","0,00 €","16.000,00 €","11.000,00 €"`;

const rCostes = interpretarIdeas(parseCSV(costes));
comprobar("no confunde la hoja de costes con ideas", !rCostes.hayPestana && rCostes.total === 0);

/* 3. Tampoco la pestaña de certificaciones. */

const certificaciones = `"Nº","Fecha","Concepto","Base imponible","IVA","Total","Estado","Dispuesto","Ahorros","Documento","Observaciones"
"1","15/10/2026","Cimentación","24.500,00 €","2.450,00 €","26.950,00 €","Pagada","","","",""`;

comprobar(
  "no confunde la pestaña de certificaciones con ideas",
  !interpretarIdeas(parseCSV(certificaciones)).hayPestana,
);

/* 4. Pestaña creada pero todavía sin filas. */

const soloCabecera = interpretarIdeas(parseCSV(`"Área","Idea","Estado","Detalle","Enlace","Fecha"`));
comprobar("pestaña vacía: existe pero sin ideas", soloCabecera.hayPestana && soloCabecera.total === 0);

/* 5. Estados. */

comprobar("«Definido» cuenta como decidido", aEstadoIdea("Definido") === "decidido");
comprobar("«por decidir» es pendiente", aEstadoIdea("Por decidir") === "pendiente");
comprobar("«RECHAZADA» es descartado", aEstadoIdea("RECHAZADA") === "descartado");
comprobar("texto libre es idea", aEstadoIdea("me gusta") === "idea");

console.log(fallos === 0 ? "\nTodo correcto." : `\n${fallos} prueba(s) fallidas.`);
process.exit(fallos === 0 ? 0 : 1);

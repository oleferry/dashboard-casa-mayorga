/**
 * Pruebas del lector de certificaciones. Ejecutar con `npm test`.
 *
 * Merece la pena mantenerlas: el endpoint gviz de Google devuelve la PRIMERA
 * pestaña con código 200 cuando se le pide una que no existe, así que el lector
 * tiene que distinguir por cabeceras. Si eso se rompe, el panel mostraría los
 * costes del solar como si fueran certificaciones de obra.
 */

import { aEstado, aFechaIso, interpretarCertificaciones } from "./certificaciones";
import { parseCSV } from "./hoja";

let fallos = 0;

function comprobar(nombre: string, condicion: boolean) {
  if (!condicion) fallos++;
  console.log(`${condicion ? "  ok" : "FALLA"}  ${nombre}`);
}

/* 1. Pestaña de certificaciones con las columnas desordenadas y huecos. */

const certificaciones = `"Certificacion","Fecha","Estado","Concepto","Base imponible","IVA","Total","Dispuesto","Ahorros","Documento","Observaciones"
"1","15/10/2026","Pagada","Cimentación","24.500,00 €","2.450,00 €","26.950,00 €","24.500,00 €","2.450,00 €","https://drive.google.com/x","Conforme DF"
"2","20/11/2026","Facturada","Estructura","40.000,00 €","4.000,00 €","44.000,00 €","40.000,00 €","0,00 €","",""
"3","","Pendiente","Cubierta","10.000,00 €","","","","","",""
"","","","","","","","","","",""`;

const r = interpretarCertificaciones(parseCSV(certificaciones), 0.1);

comprobar("detecta la pestaña", r.hayPestana);
comprobar("lee tres líneas y descarta la vacía", r.lineas.length === 3);
comprobar("suma la base imponible", Math.round(r.base) === 74500);
comprobar("calcula el IVA que falta", Math.round(r.lineas[2].iva) === 1000);
comprobar("calcula el total que falta", Math.round(r.lineas[2].total) === 11000);
comprobar("suma lo dispuesto de hipoteca", Math.round(r.dispuesto) === 64500);
comprobar("suma lo pagado con ahorros", Math.round(r.ahorros) === 2450);
comprobar("reconoce los estados", r.lineas.map((l) => l.estado).join() === "pagada,facturada,pendiente");
comprobar("convierte la fecha a ISO", r.lineas[0].fecha === "2026-10-15");
comprobar("conserva el enlace al documento", r.lineas[0].documento === "https://drive.google.com/x");

/* 2. Lo que Google devuelve si la pestaña no existe: la hoja de costes. */

const costes = `"","","","","","","","","","","","","30.078,13 €","0,00 €"
"","Concepto","Desglose","Descripción","","","","","","Precio B","","","Total",""
"","Compraventa","","Pago cantidad pendiente","","1","16.000,00 €","16.000,00 €","","","0,00%","0,00 €","16.000,00 €","11.000,00 €"`;

const rCostes = interpretarCertificaciones(parseCSV(costes), 0.1);

comprobar(
  "no confunde la hoja de costes con certificaciones",
  rCostes.hayPestana === false && rCostes.lineas.length === 0,
);

/* 3. Cabeceras mínimas: sólo fecha e importe. */

const minimo = `"Fecha","Total"
"01/12/2026","11.000,00 €"`;

const rMinimo = interpretarCertificaciones(parseCSV(minimo), 0.1);

comprobar("acepta cabeceras mínimas", rMinimo.hayPestana && rMinimo.lineas.length === 1);
comprobar("deduce la base a partir del total", Math.round(rMinimo.lineas[0].base) === 10000);

/* 4. Conversores sueltos. */

comprobar("fecha en ISO", aFechaIso("2026-10-15") === "2026-10-15");
comprobar("fecha en formato Date() de gviz", aFechaIso("Date(2026,9,15)") === "2026-10-15");
comprobar("fecha vacía", aFechaIso("") === undefined);
comprobar("estado en mayúsculas", aEstado("APROBADA") === "aprobada");
comprobar("estado sinónimo", aEstado("Cobrado") === "pagada");

console.log(fallos === 0 ? "\nTodo correcto." : `\n${fallos} prueba(s) fallidas.`);
process.exit(fallos === 0 ? 0 : 1);

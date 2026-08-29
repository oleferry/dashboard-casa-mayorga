# Dashboard de construcción — Casa Mayorga

Panel de control económico y documental de la vivienda unifamiliar en
**Calle de la Salud 1, 47680 Mayorga (Valladolid)**.

Reúne en una sola página el presupuesto de obra, los costes acumulados por
concepto, los pagos realizados, la hipoteca y todo el expediente documental.

---

## Qué muestra

| Sección | Contenido |
|---|---|
| **Resumen económico** | Coste total previsto, pagado a fecha, pendiente, hipoteca, fondos propios que faltan y coste bancario mensual |
| **Costes por concepto** | Lectura en vivo de la hoja de Google Sheets, agrupada por concepto con comprometido / pagado / pendiente |
| **Ejecución de obra** | Contrato principal, trabajos aparte, IVA, reserva del 5%, coste por m² y referencias presupuestarias |
| **Capítulos de obra** | Los 15 capítulos del proyecto técnico con su peso y la estimación operativa sobre el contrato |
| **Hipoteca** | Condiciones de Unicaja, bonificaciones, coste mensual e intereses totales |
| **Cronología** | Hitos administrativos y económicos |
| **Documentación** | Enlaces a Google Drive agrupados por tipo |
| **Alertas** | Decisiones abiertas y riesgos por nivel |

---

## De dónde salen los datos

### 1. Hoja de costes (en vivo)

Los costes reales se leen de la
[hoja de control de costes](https://docs.google.com/spreadsheets/d/11jY3NY1xd9NeC1A-ssOFolTJoUnHYJe1CbZEFKpoU0w/edit)
a través del endpoint CSV de Google (`gviz`). Se refrescan cada **5 minutos**.

**Requisito:** la hoja tiene que estar compartida como *«cualquier persona con
el enlace puede ver»*. Si deja de estarlo, el panel muestra el último snapshot
guardado en `data/snapshot.json` y avisa en pantalla.

El parser (`lib/hoja.ts`) espera estas columnas, con las letras actuales:

| Col | Campo |
|---|---|
| B | Concepto |
| C | Desglose |
| D | Descripción |
| F | Unidades |
| G | Precio unitario |
| H | Precio |
| K / L | Impuestos (% e importe) |
| M | Total |
| N / O | Pagado A / Pagado B |
| P | Pendiente |

Una fila se trata como **cabecera de grupo** si tiene Concepto pero no Desglose,
ni Descripción, ni Unidades. Sólo las filas de detalle suman, para no duplicar.

> **Mejora recomendada:** añadir una columna `Fecha` junto a `Pagado`. En cuanto
> exista, el panel podrá dibujar la evolución del gasto en el tiempo. De momento
> sólo se muestran las fechas verificadas contra recibos, listadas en
> `fechasPago` dentro de `lib/proyecto.ts`.

### 2. Datos maestros (en el repositorio)

Todo lo que no vive en la hoja se edita en archivos TypeScript:

- **`lib/proyecto.ts`** — ficha del proyecto, contrato de obra, capítulos,
  condiciones de la hipoteca, hitos y alertas.
- **`lib/documentos.ts`** — enlaces a Google Drive, agrupados por tipo.
- **`lib/calculos.ts`** — todos los cálculos derivados. No hay ninguna cifra
  calculada a mano en la interfaz.

Para actualizar el panel basta con editar esos archivos y hacer push: Vercel
despliega automáticamente.

---

## Actualizar el snapshot de respaldo

```bash
curl -sL "https://docs.google.com/spreadsheets/d/11jY3NY1xd9NeC1A-ssOFolTJoUnHYJe1CbZEFKpoU0w/gviz/tq?tqx=out:csv" -o hoja.csv
```

Después conviértelo a `data/snapshot.json` con la forma
`{ "capturadoEn": "<ISO>", "filas": [[...], ...] }`.

---

## Desarrollo

```bash
npm install
npm run dev
```

El panel queda en http://localhost:3000.

---

## Privacidad

La página contiene información económica y personal de los promotores. El
despliegue está protegido con autenticación básica mediante dos variables de
entorno en Vercel:

- `DASHBOARD_USUARIO`
- `DASHBOARD_PASSWORD`

En cualquier despliegue de Vercel, si faltan esas variables el panel responde
**503 en lugar de abrirse**: nunca puede quedar expuesto por un despiste de
configuración. En local, sin variables, el panel se sirve abierto para poder
trabajar con comodidad.

El repositorio de GitHub es privado y no contiene documentos: sólo enlaces a
Google Drive, que siguen exigiendo permiso sobre la carpeta.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Vercel.
Sin dependencias de gráficas: las barras y la línea de tiempo son CSS y SVG.

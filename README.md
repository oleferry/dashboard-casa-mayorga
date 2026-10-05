# Dashboard de construcción — Casa Mayorga

Panel de control económico y documental de la vivienda unifamiliar en
**Calle de la Salud 1, 47680 Mayorga (Valladolid)**.

Reúne en una sola página el presupuesto de obra, los costes acumulados por
concepto, los pagos realizados, la hipoteca y todo el expediente documental.

---

## Qué muestra

| Sección | Contenido |
|---|---|
| **Resumen económico** | Coste total previsto, pagado a fecha, pendiente, hipoteca, ahorros que faltan y coste bancario mensual |
| **Costes por concepto** | Lectura en vivo de la hoja de Google Sheets, agrupada por concepto con comprometido / pagado / pendiente |
| **Ejecución de obra** | Contrato principal, trabajos aparte, IVA, reserva del 5%, coste por m² y referencias presupuestarias |
| **Certificaciones** | Registro de obra ejecutada: avance, reparto entre hipoteca y ahorros, y estado de cada certificación |
| **Capítulos de obra** | Los 15 capítulos del proyecto técnico con su peso y la estimación operativa sobre el contrato |
| **Hipoteca** | Condiciones de Unicaja, bonificaciones, coste mensual e intereses totales, y comparativa con CaixaBank |
| **Hipoteca: condiciones y trámites** | Condiciones de la FEIN, seguros, incoherencias de la documentación, dudas enviadas a Unicaja y cita en la notaría. Se mantiene en `lib/condiciones.ts` |
| **Cronología** | Hitos administrativos y económicos |
| **Diseño e ideas** | Lo que fijan el proyecto y la normativa, lo que queda por elegir, y las ideas propias leídas de la pestaña `Ideas` |
| **Cocina: proveedores** | Base de datos de los estudios a los que se ha pedido presupuesto: estado, último movimiento, próximo paso, contacto y enlace al hilo de Gmail. Se mantiene en `lib/cocinas.ts` |
| **Anexo: gimnasio y trastero** | Metros lineales de cada pared del edificio del patio (trastero, gimnasio y aseo). Se mantiene en `lib/anexo.ts` |
| **Documentación** | Enlaces a Google Drive agrupados por tipo |
| **Seguros y obligaciones** | Qué exigen la LOE y el RD 1627/1997 en autopromoción, qué le toca al constructor y qué decisiones siguen abiertas |
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
| N / O | Pagado A / Pagado B — declarado / en efectivo |
| P | Pendiente |

Una fila se trata como **cabecera de grupo** si tiene Concepto pero no Desglose,
ni Descripción, ni Unidades. Sólo las filas de detalle suman, para no duplicar.

Las columnas «Pagado A» y «Pagado B» no distinguen personas —la cuenta es
común— sino si el pago queda documentado. Sus etiquetas se configuran en
`pagadores`, dentro de `lib/proyecto.ts`.

> **Mejora recomendada:** añadir una columna `Fecha` junto a `Pagado`. En cuanto
> exista, el panel podrá dibujar la evolución del gasto en el tiempo. De momento
> sólo se muestran las fechas verificadas contra recibos, listadas en
> `fechasPago` dentro de `lib/proyecto.ts`.

### 2. Certificaciones de obra (en vivo)

Se leen de una segunda pestaña de la misma hoja, llamada **`Certificaciones`**.
Mientras no exista, el panel muestra un estado vacío que explica cómo crearla.

Las columnas se localizan **por su nombre**, no por su posición, así que se
pueden reordenar o añadir otras. Basta con que existan `Fecha` y una de
`Base imponible` o `Total`:

| Columna | Para qué |
|---|---|
| `Nº` | Número correlativo de la certificación |
| `Fecha` | Admite `15/10/2026` o `2026-10-15` |
| `Concepto` | Capítulo o periodo certificado |
| `Base imponible` | Obra ejecutada, sin IVA |
| `IVA` | Se calcula al 10% si se deja vacía |
| `Total` | Se calcula si se deja vacía |
| `Estado` | pendiente · aprobada · facturada · pagada |
| `Dispuesto` | Lo que libera el banco contra esa certificación |
| `Ahorros` | Lo que se paga con fondos propios |
| `Documento` | URL de Drive a la certificación o factura |
| `Observaciones` | Incidencias y responsables |

> **Cuidado al tocar `lib/certificaciones.ts`:** cuando se pide a gviz una
> pestaña que no existe, Google devuelve **la primera pestaña con código 200**
> en lugar de un error. Por eso el lector valida las cabeceras antes de
> interpretar nada; sin esa comprobación el panel mostraría los costes del solar
> como si fueran certificaciones de obra. `npm test` cubre justo ese caso.

### 3. Ideas de diseño (en vivo)

Pestaña **`Ideas`** de la misma hoja. Como en certificaciones, las columnas se
localizan por nombre y basta con que exista `Idea`: `Área`, `Idea`, `Estado`
(idea · por decidir · decidido · descartado), `Detalle`, `Enlace` y `Fecha`.
Lo que ya fija el proyecto visado y la normativa municipal no va en la hoja
sino en `lib/diseno.ts`, porque no cambia.

La lectura de pestañas y la protección frente a pestañas inexistentes son
comunes a certificaciones e ideas, en `lib/pestanas.ts`.

### 4. Datos maestros (en el repositorio)

Todo lo que no vive en la hoja se edita en archivos TypeScript:

- **`lib/proyecto.ts`** — ficha del proyecto, contrato de obra, capítulos,
  condiciones de la hipoteca, hitos, alertas y obligaciones legales.
- **`lib/documentos.ts`** — enlaces a Google Drive, agrupados por tipo.
- **`lib/calculos.ts`** — todos los cálculos derivados. No hay ninguna cifra
  calculada a mano en la interfaz.

Para actualizar el panel basta con editar esos archivos y hacer push: Vercel
despliega automáticamente.

### 5. Modelo de financiación

El banco presta un porcentaje del **menor** entre la tasación del edificio
terminado y el coste total de la promoción (presupuesto de ejecución del
proyecto más el valor escriturado del suelo). Aquí manda el coste:

```
min(424.018,80 ; 361.327,16 + 11.000) = 372.327,16 × 80% = 297.861,73
```

De ahí la oferta de 296.000 € de Unicaja. La hipoteca financia obra ejecutada:
el IVA, los impuestos, los honorarios técnicos, el suelo y el mobiliario salen
de ahorros. Los parámetros están en `financiacion`, en `lib/proyecto.ts`, junto
con los escenarios de disposición que el panel compara.

El préstamo son **30 años en total**: uno de carencia en el que sólo se pagan
intereses del capital dispuesto y 29 de amortización (`plazoMeses` son los 348
meses que se amortizan, no el plazo total). Por eso el
panel da dos cuotas para cada escenario: la de carencia (`cuotaSoloIntereses`,
que es el techo de esa fase porque el capital se libera a plazos) y la de
amortización (`cuotaFrancesa`). La cuota ya no está escrita a mano: se calcula
desde la disposición, y `hipoteca.cuotaReferencia` guarda la que ofreció el banco
para 265.000 € como contraste: sus 1.053,97 €/mes corresponden a 360
mensualidades, no a 348, así que el panel avisa de que hay que aclarar de qué
plazo hablaba la oferta.

Los seguros van en `hipoteca.seguroHogarAnual` (450 €) y
`hipoteca.seguroSaludAnual` (350 €), y entran en todos los costes mensuales.

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

Las pruebas de los lectores de certificaciones e ideas:

```bash
npm test
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

# Infant Nook — Landing v2

Web: https://www.infantnook.com/ · App independiente: https://app.infantnook.com/

Rediseño del 4 de septiembre de 2026: identidad cálida Infant Nook, ilustración canónica Baby Sign, catálogo de seis libros filtrable, selector de guías, menú móvil, preguntas frecuentes y suscripción oficial a Nookies.

## Desarrollo

```sh
npm run dev
```

Abre http://127.0.0.1:4328. Requiere Node.js 22 o posterior y Python 3. No hay dependencias de producción. Tras editar, ejecuta `npm run build` y recarga la página.

```sh
npm run check
```

Comprueba sintaxis JS, IDs/anchors, catálogo y recursos, y genera `dist/`. La compilación usa una lista explícita de archivos públicos. No incluye notas internas, procedencia de activos ni rutas personales.

## Fuentes

- `index.html`: contenido HTML disponible sin ejecutar JavaScript.
- `styles.css`: tokens, diseño responsive, estados y movimiento reducido.
- `app.js`: navegación, filtros y selector accesible con `<dialog>`.
- `newsletter.js`: una única instancia oficial ActiveCampaign (formulario 5), carga diferida, etiquetas y validación; fallback al formulario alojado.
- `assets/PROVENANCE.md`: originales y derivados optimizados, excluido de despliegue.
- `scripts/build.mjs`: paquete público reproducible.

Se ha mantenido la arquitectura estática: interacciones progresivas, imágenes WebP y fuentes locales, sin framework o librerías de animación.

## Newsletter: contrato existente

Proveedor: `https://insatum.activehosted.com/f/embed.php?id=5`.
Fallback: `https://insatum.activehosted.com/f/5`.

Conservar `name=email` y `name=fullname`: este último guarda los meses del bebé en la automatización existente. Ambos son `type=text`: el serializador oficial omite `type=email`. Usamos `inputmode`, `pattern` y validación nativa antes del envío oficial. No se guardan datos localmente ni se añaden endpoints de captación.

Solo debe existir una instancia. No añadir otro embed en hero. Los errores y la confirmación real siguen bajo control del proveedor; nunca simular éxito. La QA no envía suscripciones reales.

## Marca y catálogo

El canon de Amelia es `amelia-benet-personal-brand-v2.md`: voz editorial/seudónimo, sin biografía o credenciales inventadas. Assets Baby Sign y BLW de los packs cerrados en agosto de 2026; seis portadas correspondientes a los ASIN publicados de la web anterior. No se presentan manuscritos en preparación como productos disponibles.

## Despliegue y reversión

Proyecto Vercel existente `infant-nook`, equipo `eco-verdens-projects`; configuración de build en `vercel.json`. La rama `main` del repositorio `ecoverden/infant-nook` es la fuente remota. Publicar únicamente dentro de una petición autorizada de actualización de la web.

Antes de asignar dominios: compilar, revisar UI, crear deployment sin asignar dominio, verificar HTML/recursos y después promover. No desactivar protección de deployments. El deployment de producción anterior al rediseño es `dpl_BjS9ysHsLPcBjgF1Yeqp4k1Pt3W3` (`infant-nook-n8ebig67w-eco-verdens-projects.vercel.app`); conservarlo para rollback.

## Pendiente heredado

La web anterior y el formulario de Nookies carecen de una política específica de privacidad para la newsletter. La política del planificador solo cubre ese servicio y sus emails operativos; no se ha presentado como si cubriera ActiveCampaign. Responsable/contacto público disponible en el aviso legal de la app: Insatum LLC, `insatumllc@gmail.com`. Resolver el texto y su alcance con los datos reales de la operativa, sin inventar condiciones, retención o transferencias.

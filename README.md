# Infant Nook — Landing v3

Web: https://www.infantnook.com/ · App independiente: https://app.infantnook.com/

Rediseño del 4 de septiembre de 2026: fotografía editorial ilustrativa creada con IA, portada interactiva, capítulos visuales sincronizados con el scroll, catálogo de seis libros filtrable, selector de guías y suscripción oficial a Nookies. La paleta, la voz editorial y las portadas originales mantienen la identidad Infant Nook.

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
- `editorial.css`: dirección visual, fotografía, capítulos y adaptación a pantallas pequeñas.
- `visual.js`: escenas de hero, scroll por capítulos, progreso y parallax de puntero. Sin autoplay; las imágenes se leen en secuencia sin JS, con movimiento reducido o en ventanas pequeñas.
- `app.js`: navegación, filtros y selector accesible con `<dialog>`.
- `newsletter.js`: una única instancia oficial ActiveCampaign (formulario 5), carga diferida, etiquetas y validación; fallback al formulario alojado.
- `assets/PROVENANCE.md`: originales y derivados optimizados, excluido de despliegue.
- `scripts/build.mjs`: paquete público reproducible.

Se ha mantenido la arquitectura estática: interacciones progresivas, imágenes WebP y fuentes locales, sin framework o librerías de animación.

## Imágenes editoriales

Las tres fotografías `assets/editorial-*-v3.webp` son escenas ficticias creadas con IA y así se indica en la web. No representan clientes, testimonios, a Amelia Benet ni demostraciones sanitarias. Derivados WebP de 1440 × 960 px. Los originales y el conjunto exacto de prompts se conservan localmente en `_sistema/visual-v3/`, excluidos de publicación.

## Newsletter: contrato existente

Proveedor: `https://insatum.activehosted.com/f/embed.php?id=5`.
Fallback: `https://insatum.activehosted.com/f/5`.

Conservar `name=email` y `name=fullname`: este último guarda los meses del bebé en la automatización existente. Ambos son `type=text`: el serializador oficial omite `type=email`. Usamos `inputmode`, `pattern` y validación nativa antes del envío oficial. No se guardan datos localmente ni se añaden endpoints de captación.

Solo debe existir una instancia. No añadir otro embed en hero. Los errores y la confirmación real siguen bajo control del proveedor; nunca simular éxito. La QA no envía suscripciones reales.

## Marca y catálogo

El canon de Amelia es `amelia-benet-personal-brand-v2.md`: voz editorial/seudónimo, sin biografía o credenciales inventadas. Assets Baby Sign y BLW de los packs cerrados en agosto de 2026; seis portadas correspondientes a los ASIN publicados de la web anterior. No se presentan manuscritos en preparación como productos disponibles.

## Despliegue y reversión

Proyecto Vercel existente `infant-nook`, equipo `eco-verdens-projects`; configuración de build en `vercel.json`. La rama `main` del repositorio `ecoverden/infant-nook` es la fuente remota. Publicar únicamente dentro de una petición autorizada de actualización de la web.

Antes de asignar dominios: compilar, revisar UI, crear deployment sin asignar dominio, verificar HTML/recursos y después promover. No desactivar protección de deployments. El deployment anterior a v3 es `dpl_GiFWzfFiNKM6wG59cTiYck2gncEt` (`infant-nook-5okc4pg9a-eco-verdens-projects.vercel.app`); conservarlo para rollback.

## Pendiente heredado

La web anterior y el formulario de Nookies carecen de una política específica de privacidad para la newsletter. La política del planificador solo cubre ese servicio y sus emails operativos; no se ha presentado como si cubriera ActiveCampaign. Responsable/contacto público disponible en el aviso legal de la app: Insatum LLC, `insatumllc@gmail.com`. Resolver el texto y su alcance con los datos reales de la operativa, sin inventar condiciones, retención o transferencias.

# PROJECT MASTER PROMPT — Michelle Relayze

## Identidad y fuente de verdad
Este repositorio es el sitio editorial independiente de Michelle Relayze. La identidad, la voz y el material visual pertenecen a su proyecto; no son una extensión de BELENTANI, Natalia Marinho ni DUCK. Antes de modificar, leer README.md, index.html, los recursos de images/, scripts/smoke-test.mjs, el historial de main y las PR abiertas. No inventar biografía, premios, contactos, créditos, fechas ni lanzamientos.

## Producto
Sitio estático, español, presentación de trayectoria artística, retratos, escena y capítulo musical. Mantener estética editorial noir, oro y esmeralda, tipografías y fotografías existentes, enlaces de contacto y navegación. Dominio canónico declarado en el código: michelle-relayze-web.vercel.app; comprobar funcionamiento real antes de afirmar publicación.

## Arquitectura
HTML/CSS/JavaScript sin backend ni dependencias de runtime; index.html es la entrada. CSS adicional en after.css y theme-dark.css; imágenes en images/; tests Node en scripts/ y tests/; CI en .github/workflows/. Evitar instalar frameworks o introducir servicios de pago sin necesidad.

## Prioridades técnicas
1. Entrada resiliente: coordinar con PR #6 (preloader), sin duplicar ni fusionar trabajo no validado.
2. Accesibilidad: navegación móvil, teclado, diálogo de imágenes, citas con control manual, movimiento reducido, contraste y foco visible.
3. Rendimiento: recursos locales válidos, dimensiones de imágenes, carga progresiva y ausencia de bloqueos de render.
4. SEO verificable: canonical, robots, sitemap, tarjetas sociales y metadatos coherentes.
5. Privacidad: no incorporar analítica, almacenamiento de datos personales, formularios inseguros o secretos. Validar permisos y licencias de fotografías antes de publicar.

## Fases
- Recuperar identidad, estado de main y PR; comprobar cambios de agentes.
- Construir mejoras pequeñas y comprobables en rama aislada.
- Ejecutar smoke tests, pruebas de interacción, validación en móvil y navegador, y CI.
- Abrir PR borrador con SHA, pruebas, riesgos y pasos de verificación; no hacer merge/despliegue sin comprobación.

## Criterios de cierre
Los enlaces y recursos locales funcionan, la navegación por teclado y móvil es operativa, el contenido es verdadero y autorizado, las pruebas y CI pasan, el sitio desplegado se verifica en navegador, no hay secretos ni regresiones de privacidad, y existe revisión humana del contenido personal. Si falta cualquiera, registrar bloqueo; no declarar finalizado.

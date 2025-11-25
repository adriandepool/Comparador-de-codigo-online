# DiffMaster Pro - Comparador de Código Online

Herramienta profesional para la comparación de código y texto, detección de diferencias (diff) y fusión de cambios, ejecutándose completamente en el navegador.

[Ver Demo en Vivo](https://adriandepool.github.io/Comparador-de-codigo-online/)

---

## Descripción General

**DiffMaster** es una aplicación web de una sola página (SPA) diseñada para desarrolladores y profesionales que necesitan comparar versiones de código o texto de manera rápida y segura. A diferencia de otras herramientas que requieren procesamiento en el servidor, esta aplicación ejecuta toda la lógica de comparación localmente en el navegador del usuario, garantizando la privacidad de los datos.

La herramienta ofrece una interfaz moderna y oscura, optimizada para largas sesiones de trabajo, con capacidades avanzadas como la comparación semántica (por palabras o caracteres), ignorado de espacios en blanco y sincronización de desplazamiento.

## Características Principales

- **Comparación en Tiempo Real**: Visualización instantánea de diferencias mientras se escribe o pega código.
- **Múltiples Modos de Visualización**:
  - **Split View**: Vista de dos columnas (lado a lado) ideal para fusiones.
  - **Unified View**: Vista unificada estilo Git para revisiones rápidas.
- **Granularidad Ajustable**: Algoritmos de comparación por líneas, palabras o caracteres.
- **Fusión de Código (Merge)**: Herramientas interactivas para aceptar o rechazar cambios individualmente y construir una versión final.
- **Privacidad Total**: Todo el procesamiento se realiza en el cliente (Client-side only). El código nunca sale de su navegador.
- **Sincronización de Scroll**: Desplazamiento simultáneo de ambos paneles para facilitar la lectura.
- **Historial Local**: Capacidad de deshacer cambios y restaurar estados anteriores.
- **Exportación**: Descarga directa del resultado de la fusión.

## Tecnologías Utilizadas

El proyecto está construido con un stack moderno y ligero, sin dependencias de compilación complejas para facilitar su despliegue y uso inmediato:

- **React 18**: Para la gestión del estado y la interfaz de usuario.
- **Tailwind CSS**: Para un diseño responsivo y profesional.
- **JSDiff**: Librería robusta para el cálculo de diferencias de texto.
- **Lucide Icons**: Iconografía vectorial nítida y moderna.
- **Babel Standalone**: Permite la ejecución de JSX directamente en el navegador sin necesidad de un paso de compilación previo (Node.js no requerido para ejecución).

## Instalación y Uso

No se requiere instalación de dependencias ni servidores.

1.  Clone este repositorio o descargue el archivo `index.html`.
2.  Abra el archivo `index.html` en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
3.  La aplicación cargará inmediatamente y estará lista para usar.

### Ejecución Local (Opcional)

Si desea servir la aplicación a través de un servidor local (recomendado para evitar restricciones de CORS con ciertos recursos, aunque no estrictamente necesario para esta arquitectura):

```bash
# Usando Python
python -m http.server 8000

# O usando npx (http-server)
npx http-server .
```

Luego acceda a `http://localhost:8000`.

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

```text
MIT License

Copyright (c) 2024 Adrian Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

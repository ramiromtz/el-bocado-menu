# Menú digital — El Bocado

Catálogo estático desarrollado con HTML5, CSS y JavaScript. No necesita npm, PHP ni una base de datos de servidor.

## Verlo en tu computadora

El navegador no permite cargar `products.json` correctamente si abres `index.html` con doble clic. Inicia un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000
```

Después visita `http://localhost:8000` y detén el servidor con `Ctrl + C`.

## Cambiar productos y precios

Edita `data/products.json`. Cada producto usa estos campos:

- `id`: identificador único, sin espacios.
- `name`: nombre que verá el cliente.
- `category`: `Hamburguesas`, `Snacks`, `Bebidas` o `Papas`.
- `price`: número sin signo de pesos; usa `null` si todavía no hay precio.
- `image`: ruta relativa de la fotografía.
- `alt`: descripción breve de la imagen para accesibilidad.
- `topics`: lista de ingredientes o características que aparecerán debajo del producto.
- `variantLabel`: título opcional del grupo, por ejemplo `Salsas disponibles`.
- `variants`: sabores o presentaciones que aparecerán dentro del botón `Ver sabores`.
- `available`: `true` para disponible o `false` para próximamente.
- `badge`: etiqueta opcional como `Favorita` o `Próximamente`.

Respeta las comas y comillas del formato JSON. Puedes validar el archivo en [JSONLint](https://jsonlint.com/) antes de publicarlo.

## Sustituir las fotografías provisionales

Guarda las fotos nuevas dentro de `assets/images/`, preferentemente en formato WebP o PNG horizontal. Después cambia la ruta `image` del producto correspondiente en `data/products.json`. Una proporción cercana a 4:3 evita recortes inesperados.

## Publicar gratis con GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `el-bocado-menu`.
2. Sube todo el contenido de esta carpeta a la rama `main`.
3. En el repositorio abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main`, la carpeta `/ (root)` y guarda.
6. GitHub mostrará una dirección similar a `https://tuusuario.github.io/el-bocado-menu/`.

Las rutas del proyecto son relativas y funcionan aunque GitHub Pages publique el sitio dentro de una subcarpeta.

## Crear un código QR

Cuando la URL de GitHub Pages funcione, genera un QR con esa dirección, pruébalo desde otro teléfono y colócalo en las mesas o en el menú físico. Si la URL cambia, será necesario imprimir un QR nuevo.

## Estructura

```text
el-bocado-menu/
├── index.html
├── data/products.json
├── assets/css/styles.css
├── assets/js/app.js
└── assets/images/
```

Las imágenes incluidas son provisionales y fueron generadas para esta primera versión. Sustitúyelas por fotografías reales del negocio antes de una campaña publicitaria.

# Investigación de fuentes públicas para el catálogo

## Fuente 1: sindresorhus/awesome

URL: https://github.com/sindresorhus/awesome

La fuente se presenta como una colección curada de listas de recursos y contiene enlaces a listas temáticas de herramientas, aplicaciones, APIs, datasets y referencias. Es útil como índice de descubrimiento, pero cada lista enlazada debe revisarse individualmente antes de importar entradas, porque la licencia y las condiciones de cada recurso pueden variar. El pipeline debe conservar la URL de la lista, la URL final de cada recurso, la fecha de extracción y el estado de revisión.

## Fuente 2: awesomedata/awesome-public-datasets

URL: https://github.com/awesomedata/awesome-public-datasets

El repositorio describe una lista temática de fuentes públicas de datos y advierte que la colección incluye fuentes gratuitas y otras que no lo son. También indica que el README se genera automáticamente. Por ello debe utilizarse como índice de descubrimiento, no como autorización global para copiar contenidos. Cada dataset o herramienta debe conservar su fuente y licencia propia, y las entradas no deben publicarse hasta revisión humana.

## Política de ingesta adoptada

Se utilizarán fuentes públicas como índices de descubrimiento. La ingesta almacenará nombre, categoría, descripción mínima, URL de origen, URL de destino, licencia declarada cuando esté disponible, fecha de extracción, hash de contenido y estado `pending_review`, `quarantined`, `approved` o `rejected`. No se copiarán descripciones extensas ni activos protegidos sin base jurídica clara. Las URLs rotas, redirecciones sospechosas, dominios no verificables y entradas duplicadas pasarán a cuarentena. Solo `approved` podrá aparecer en el catálogo público.

## Referencias

[1]: https://github.com/sindresorhus/awesome "sindresorhus/awesome — Awesome lists"
[2]: https://github.com/awesomedata/awesome-public-datasets "awesomedata/awesome-public-datasets — Awesome Public Datasets"

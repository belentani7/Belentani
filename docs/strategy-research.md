## Evidencia oficial: infraestructura y límites

La documentación oficial de Cloudflare indica que Workers Free incluye 100.000 solicitudes diarias y 10 ms de CPU por invocación; el plan de pago parte de 5 USD mensuales por cuenta, antes de consumo adicional. Las solicitudes a assets estáticos son gratuitas, pero el cómputo y los límites de Workers siguen siendo relevantes para webhooks, cron y lógica dinámica [1].

Cloudflare R2 ofrece un tramo gratuito mensual de 10 GB-month de almacenamiento Standard, 1 millón de operaciones Class A y 10 millones de operaciones Class B, con egress gratuito. Superar los umbrales produce cargos; la propia documentación muestra que una carga con muchas lecturas puede generar costes aunque el egress no se cobre [2].

Supabase Free incluye 500 MB de base de datos, 1 GB de almacenamiento de archivos, 5 GB de egress y 50.000 usuarios activos mensuales, pero los proyectos gratuitos se pausan después de una semana de inactividad y no incluyen backups automáticos; por tanto, no equivale a persistencia siempre activa ni a backup garantizado [3].

Vercel Hobby es gratuito, pero sus condiciones restringen el uso a proyectos personales y no comerciales. Por ello no es una base segura para una plataforma que pretende monetizarse, aunque pueda servir para una prueba personal no comercial [4].

### Referencias

[1]: https://developers.cloudflare.com/workers/platform/pricing/ "Cloudflare Workers Pricing"
[2]: https://developers.cloudflare.com/r2/pricing/ "Cloudflare R2 Pricing"
[3]: https://supabase.com/pricing "Supabase Pricing"
[4]: https://vercel.com/docs/plans/hobby "Vercel Hobby Plan"

## Evidencia oficial: SEO y contenido escalado

Google define como abuso de contenido escalado la generación de muchas páginas con el propósito principal de manipular rankings y poco valor para usuarios, incluyendo contenido producido con IA, scraping de feeds o resultados, combinaciones de páginas sin valor añadido y redes de sitios para ocultar la escala. La estrategia de Belentani Studio debe publicar menos páginas, pero con utilidad demostrable, fuentes, revisión editorial, contexto propio y control de indexación [5].

[5]: https://developers.google.com/search/docs/essentials/spam-policies "Google Search Spam Policies"

La Comisión Europea indica que la publicidad, las asociaciones de marca, los contenidos patrocinados y el marketing de afiliación deben divulgarse de forma clara y transparente cuando exista una relación comercial. La estrategia de monetización debe incluir etiquetas visibles como “enlace de afiliado”, “contenido patrocinado” o equivalente, junto con una política de transparencia; no debe ocultar la relación comercial [6].

[6]: https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/influencer-legal-hub_en "European Commission Influencer Legal Hub"

## Monetización directa y publicidad

GitHub Sponsors informa de una comisión de hasta el 6% para patrocinios procedentes de cuentas de organización, mientras que la comisión depende del tipo de cuenta y del procesamiento; debe verificarse la configuración concreta antes de proyectar ingresos [7]. Buy Me a Coffee declara que no cobra cuota mensual y aplica una comisión de plataforma del 5% por transacción, además de los costes del procesador de pago cuando correspondan [8]. EthicalAds exige solicitud y aprobación como publisher y muestra un umbral mínimo de pago de 50 USD; por tanto, la publicidad no debe considerarse inmediata ni garantizada [9].

[7]: https://docs.github.com/en/sponsors/sponsoring-open-source-contributors/about-sponsorships-fees-and-taxes "GitHub Sponsors fees and taxes"
[8]: https://help.buymeacoffee.com/en/articles/4539170-frequently-asked-questions "Buy Me a Coffee FAQ"
[9]: https://www.ethicalads.io/publishers/ "EthicalAds Publishers"

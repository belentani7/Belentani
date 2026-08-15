# Informe de Implementación y Auditoría: PVC-U en PAEA Supra-Kernel

## 1. Alcance

Se ha integrado PVC-U (Policy Validation Control Unit) como una capa transversal del PAEA Supra-Kernel para validar operaciones, registrar decisiones y aplicar controles proporcionales al riesgo en un entorno multi-tenant. Este informe distingue explícitamente entre **funcionalidad implementada**, **evidencia de verificación** y **capacidades que siguen siendo roadmap**.

## 2. Componentes implementados

### 2.1 Núcleo determinista

`server/pvcu-core.ts` implementa validación multicapa L0–L8: forma, entrada, privacidad/PII, riesgo, herramientas, autonomía, efectos externos, grounding y gobernanza. El núcleo calcula una huella SHA-256 sobre una representación canónica de la operación y el resultado, clasifica el riesgo y determina estados `approved`, `rejected`, `quarantine`, `degraded` o `human_review`.

La huella demuestra integridad de contenido dentro del flujo de aplicación; no equivale por sí sola a firma digital, almacenamiento WORM físico, certificación de cumplimiento ni prueba de no repudio.

### 2.2 Modelo de datos

El esquema Drizzle contiene las tablas `pvc_tenants`, `pvc_profiles`, `pvc_validations`, `pvc_evidence` y `pvc_exceptions`. La migración `drizzle/0002_romantic_captain_midlands.sql` crea `pvc_evidence` de forma no destructiva y fue aplicada correctamente en la base de datos del proyecto.

`pvc_evidence` conserva metadatos de procedencia, algoritmo, digest, validación, tenant y retención. El contenido pesado o los bytes originales no se almacenan en esta tabla. `pvc_exceptions` conserva excepciones con controles compensatorios, aprobador, expiración y estado.

### 2.3 Persistencia y aislamiento

`server/pvcu-db.ts` expone consultas acotadas por `tenantKey` y una comprobación de propietario mediante `ownerOpenId`. Las mutaciones y lecturas del router primero resuelven el tenant mediante `getPvcTenant`; si el usuario no es propietario y no tiene rol administrador, el router rechaza la operación con `FORBIDDEN`.

La persistencia incluye helpers para perfiles, validaciones, evidencias, excepciones y métricas agregadas. Las evidencias se generan automáticamente al ejecutar `pvcu.validate`, usando el mismo `validationId`, digest y procedencia operacional.

### 2.4 API protegida

`server/routers/pvcu.ts` expone procedimientos protegidos para:

| Área | Procedimientos principales |
|---|---|
| Tenants | `tenants`, `createTenant` |
| Perfiles | `profiles`, `createProfile` |
| Validación | `validations`, `validate`, `overview` |
| Evidencia | `evidence` |
| Excepciones | `exceptions`, `createException` |

Las excepciones exigen expiración futura, controles compensatorios y usan el `openId` autenticado como aprobador; el cliente no puede suplantar el campo `approvedBy`.

### 2.5 Panel operativo

`client/src/pages/Home.tsx` incluye la integración inicial del panel PVC-U: selector de tenant, métricas de validación, perfiles, estados de aprobación/rechazo/revisión y ledger operativo. La cobertura del panel es **funcional pero básica**: no debe interpretarse como una consola completa con todas las vistas de evidencia, excepciones, diff de políticas, exportación o administración avanzada.

## 3. Verificación reproducible

La siguiente verificación se ejecutó después de añadir persistencia de evidencia, endpoints de excepciones y pruebas de aislamiento:

| Verificación | Resultado |
|---|---:|
| `pnpm check` | Correcto |
| `pnpm test --run` | 5 archivos, 15 pruebas correctas |
| `pnpm build` | Correcto |
| Migración `pvc_evidence` | Aplicada correctamente |
| Prueba de propietario en router y capa de datos | Correcta con dobles controlados |
| Prueba de acceso cross-tenant de usuario | Rechazada con `FORBIDDEN` |
| Prueba de scope administrador | Correcta y mantiene `tenantKey` explícito |
| Persistencia automática de evidencia | Verificada mediante mock del helper y router |

## 4. Auditoría de dependencias y runtime

Se actualizaron dependencias directas de alta prioridad identificadas durante la auditoría, incluyendo `axios`, `drizzle-orm` y Vite. El gestor de paquetes emite una advertencia porque la configuración `pnpm` está embebida en `package.json`; la migración futura recomendada es mover `patchedDependencies` y `overrides` a `pnpm-workspace.yaml` o a la ubicación soportada por la versión instalada, después de verificar compatibilidad.

La revisión explícita de los logs actuales de desarrollo, navegador y red se ejecutó después de las pruebas y el build. Las peticiones recientes observadas respondieron con estado 200 y no apareció una excepción activa nueva en el runtime. Los mensajes históricos de `server/db.ts` sobre exportaciones duplicadas no se reproducen en el archivo actual, que contiene 46 líneas y no contiene las funciones duplicadas indicadas por el log antiguo. La comprobación actual de TypeScript y el build pasan; aun así, los logs históricos deben conservarse como antecedente de recuperación, no como prueba de un error presente.

La auditoría también detectó que el registro de red de desarrollo puede conservar cabeceras de autorización de sesiones. Es un artefacto gestionado del entorno de desarrollo y no aparece en `git status`, pero constituye un riesgo de privacidad operacional: en una instalación productiva, las cabeceras `Authorization`, cookies y tokens deben redaccionarse antes de persistir telemetría o exportar logs.

El build informa un aviso de tamaño de chunk frontend superior a 500 kB. Es una oportunidad de optimización mediante `dynamic import()` y división de chunks, pero no bloquea la compilación.

## 5. Limitaciones y riesgos residuales

Las pruebas de scope de datos cubren `listPvcTenants`, `getPvcTenant` y el acceso administrativo mediante un doble controlado de Drizzle; no sustituyen una prueba E2E contra una instancia MySQL poblada.

La implementación no constituye una certificación SOC 2, ISO 27001, GDPR, AI Act u otra certificación legal. Las políticas deben ser revisadas por responsables de seguridad, privacidad y cumplimiento antes de operar en sectores regulados.

La escritura de validación y evidencia se realiza en dos operaciones de persistencia independientes. Para entornos de alta criticidad, la siguiente iteración debe encapsular ambas escrituras en una transacción o en un outbox transaccional para evitar un registro de validación sin evidencia si la segunda operación falla.

La revisión directa de `client/src/pages/Home.tsx` confirma que el panel consume `trpc.pvcu.tenants` y `trpc.pvcu.overview`, mantiene el tenant seleccionado en scope, y muestra estados explícitos de autenticación, carga, error y vacío tanto para tenants como para el ledger. La compilación posterior confirmó que esta integración no rompe TypeScript ni el build.

El panel operativo actual no implementa todavía toda la superficie del diseño universal: exportación de evidencia, revisión dual, edición versionada de perfiles, diff de políticas, retención ejecutable, notificaciones push PVC-U, adaptadores externos, reconciliación de eventos y pruebas end-to-end contra una base de datos real.

La función administrativa permite consultar cualquier tenant al nivel del router, pero todas las operaciones siguen recibiendo explícitamente el `tenantKey`; los accesos de administración deben someterse a controles RBAC y auditoría adicionales antes de habilitarse en producción.

## 6. Criterios para el siguiente checkpoint

Antes del checkpoint de entrega final se debe confirmar que el repositorio no contiene secretos, que la rama remota coincide con el commit auditado, que la visibilidad privada ha sido aplicada después del push y que el estado remoto ha sido verificado mediante la API de GitHub. El cambio de visibilidad no debe realizarse antes de completar esas comprobaciones.

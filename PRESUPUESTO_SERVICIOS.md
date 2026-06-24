# 💰 Presupuesto - Infraestructura en la Nube para Innovatech OTEC

**Documento preparado para**: Cliente Innovatech OTEC  
**Fecha**: Junio 2026  
**Vigencia**: 30 días

---

## 📋 Resumen ejecutivo

Para mantener Innovatech en línea con capacidad de crecer a **5,000+ estudiantes**, **100+ cursos**, y **videos de HD**, necesitas tres servicios en la nube:

| Servicio | Proveedor | Costo/mes | Para qué |
|----------|-----------|-----------|----------|
| **Base de datos & Autenticación** | Supabase | $25-50 USD | Usuarios, cursos, progreso, evaluaciones |
| **Hosting de videos** | Cloudflare Stream | $20-100 USD | Videos de cursos con streaming optimizado |
| **Almacenamiento de archivos** | Cloudflare R2 | $5-30 USD | PDFs, presentaciones, papers descargables |
| **Hosting web (servidor)** | Vercel / Netlify | $0-20 USD | Página web y plataforma (gratis en inicio) |
| **Dominio** | GoDaddy / Namecheap | $12 USD/año | tu-dominio.cl |
| **Email profesional** | Google Workspace | $6-12 USD/usuario | soporte@innovatech.cl |
| **Respaldo y CDN** | Cloudflare Pro | $20 USD/mes | Seguridad, velocidad global, SSL |
| **Monitoreo y alertas** | Datadog / New Relic | $0-50 USD | Detectar problemas antes que usuarios |

**TOTAL MENSUAL**: **$88 - $282 USD** (~$85,000 - $270,000 CLP/mes)

**TOTAL ANUAL**: **$1,056 - $3,384 USD** (~$1,000,000 - $3,200,000 CLP/año)

---

## 🔍 Detalles por servicio

### 1️⃣ BASE DE DATOS & AUTENTICACIÓN → Supabase

**¿Qué es?**  
PostgreSQL en la nube + sistema de login + almacenamiento de datos de estudiantes, cursos, progreso.

**Planes disponibles:**

| Plan | Precio | Bases de datos | Almacenamiento | Usuarios | Recomendado |
|------|--------|---|---|---|---|
| **Free** | $0 | 1 | 500 MB | Ilimitados | Solo desarrollo/prueba |
| **Pro** | $25 USD/mes | Ilimitadas | 100 GB | Ilimitados | **Ideal para inicio** |
| **Team** | $50+ USD/mes | Ilimitadas | 500+ GB | Ilimitados | Para 1000+ estudiantes |

**Recomendación para Innovatech**: **Plan Pro ($25 USD/mes)**

**Por qué**:
- Soporta 100+ GB (suficiente para 5,000 estudiantes)
- Backups automáticos diarios
- SSL incluido
- Soporte prioritario

**Escalado**:
- A 500 estudiantes: sigue siendo Pro
- A 2,000+ estudiantes: pasar a Team ($50/mes)

**URL oficial**: https://supabase.com/pricing

---

### 2️⃣ HOSTING DE VIDEOS → Cloudflare Stream

**¿Qué es?**  
Servicio especializado para reproducir videos sin que se traben. Adapta automáticamente la calidad según la velocidad de internet de cada alumno.

**Planes disponibles:**

| Plan | Precio | Videos | Ancho de banda | Recomendado |
|------|--------|--------|---|---|
| **Free** | $0 | Hasta 100 videos | Limitado | Solo pruebas |
| **Pay-as-you-go** | $5 + $1 por 1,000 min reproducidos | Ilimitados | Ilimitado | **Ideal para inicio** |
| **Pro** | $200 USD/mes | Ilimitados | Ilimitado + analytics | Para 5,000+ estudiantes |

**Estimación de uso para Innovatech**:

Suponemos:
- **10 cursos** con 3 módulos cada uno = 30 videos
- **Promedio 15 minutos** por video
- **Total: 450 minutos** almacenados
- **1,000 estudiantes** viendo videos = ~45,000 minutos reproducidos/mes

**Costo**: 
- Almacenamiento: ~$5 (hasta 1 TB está incluido)
- Reproducción: $45 (45,000 min ÷ 1,000 × $1)
- **Total: ~$50 USD/mes**

**A mayor escala**:
- 5,000 estudiantes = ~$150 USD/mes
- 10,000 estudiantes = ~$250 USD/mes

**URL oficial**: https://developers.cloudflare.com/stream/

---

### 3️⃣ ALMACENAMIENTO DE ARCHIVOS → Cloudflare R2

**¿Qué es?**  
Depósito en la nube para guardar PDFs, PowerPoints, papers. Muy barato y rápido.

**Planes disponibles:**

| Plan | Precio | Almacenamiento | Descargas/mes | Recomendado |
|------|--------|---|---|---|
| **Free** | $0 | 10 GB | Gratis | Solo pruebas |
| **Pay-as-you-go** | $0.015/GB almacenado + $0.01/10k descargas | Ilimitado | Ilimitadas | **Ideal para todo** |

**Estimación para Innovatech**:

Suponemos:
- **100 cursos** con promedio **500 MB** de material c/u = **50 GB**
- **500 descargas/día** por estudiantes = **15,000 descargas/mes**

**Costo**:
- Almacenamiento: $0.015 × 50 GB = **$0.75**
- Descargas: $0.01 ÷ 10,000 × 15,000 = **$0.015**
- **Total: ~$1 USD/mes** (cuando empieces)

**A mayor escala (200 GB)**:
- Almacenamiento: $3 USD/mes
- Descargas: $10+ USD/mes
- **Total: ~$15 USD/mes**

**URL oficial**: https://developers.cloudflare.com/r2/

---

### 4️⃣ HOSTING WEB (Servidor web) → Vercel o Netlify

**¿Qué es?**  
El servidor donde está tu página web y plataforma (lo que está construido en React).

**Planes disponibles:**

| Proveedor | Plan | Precio | Límites | Recomendado |
|-----------|------|--------|---------|---|
| **Vercel** | Free | $0 | 100 GB/mes ancho de banda | Inicio |
| **Vercel** | Pro | $20 USD/mes | 1 TB/mes ancho de banda | Recomendado |
| **Netlify** | Free | $0 | 100 GB/mes | Inicio |
| **Netlify** | Pro | $19 USD/mes | 1 TB/mes | Alternativa |

**Recomendación**: **Vercel Pro ($20 USD/mes)**

**Por qué**:
- Desplegamiento automático desde GitHub
- Mejor rendimiento (CDN global)
- Soporte prioritario
- Incluye dominio personalizado

**Para Innovatech**:
- Inicio: Free (sin costo)
- Cuando tengas 1,000+ estudiantes: Pro ($20/mes)

**URL oficial**: https://vercel.com/pricing

---

### 5️⃣ DOMINIO → GoDaddy o Namecheap

**¿Qué es?**  
Tu dirección web: `www.innovatech.cl`

**Opciones**:

| Dominio | Precio/año | Proveedor | Recomendado |
|---------|-----------|-----------|---|
| innovatech.cl | ~$15-20 USD | GoDaddy / Namecheap | Sí, local chileno |
| innovatech.com | ~$12 USD | GoDaddy / Namecheap | Más internacional |
| innovatech.edu.cl | ~$20 USD | NIC.cl (regulador chileno) | Para acreditación |

**Recomendación**: **innovatech.cl** (~$15 USD/año)

Es localmente relevante para Chile y los clientes confían más en dominios `.cl`

**URL oficial**: https://www.godaddy.com o https://www.namecheap.com

---

### 6️⃣ EMAIL PROFESIONAL → Google Workspace

**¿Qué es?**  
Correos como `soporte@innovatech.cl` (no es gmail.com, es tu dominio).

**Planes**:

| Plan | Precio/usuario/mes | Storage | Usuarios | Recomendado |
|------|-----------|---------|---------|---|
| **Business Starter** | $6 USD | 30 GB | 1-100 | Inicio |
| **Business Standard** | $12 USD | 2 TB | 1-100+ | Recomendado |

**Para Innovatech** (inicio): **2 usuarios × $6 USD = $12 USD/mes**
- soporte@innovatech.cl
- admin@innovatech.cl

**A escala**: Agregar más usuarios según necesites

**URL oficial**: https://workspace.google.com/pricing

---

### 7️⃣ SEGURIDAD & CDN → Cloudflare Pro

**¿Qué es?**  
Servicio que:
- Protege contra ataques hackers
- Acelera la web en todo el mundo (CDN)
- Proporciona SSL gratis (https://)
- Previene caídas

**Planes**:

| Plan | Precio | Protección | CDN | Soporte |
|------|--------|-----------|-----|---------|
| **Free** | $0 | Básica | Global | Comunidad |
| **Pro** | $20 USD/mes | Avanzada | Global optimizado | Priority |

**Recomendación**: **Cloudflare Pro ($20 USD/mes)**

**Por qué**:
- Protege contra DDoS (ataques que dejan offline tu sitio)
- WAF (firewall de aplicación web)
- Analytics detallados
- Certificados SSL ilimitados

**URL oficial**: https://www.cloudflare.com/plans/

---

### 8️⃣ MONITOREO → Datadog o New Relic

**¿Qué es?**  
Un sistema que vigila tu plataforma 24/7:
- ¿Se cae el servidor? Te avisa al teléfono
- ¿Está lento? Te muestra por qué
- ¿Hay errores? Los log automáticamente

**Planes**:

| Proveedor | Plan | Precio | Alertas | Recomendado |
|-----------|------|--------|---------|---|
| **Datadog** | Free | $0 | Limitadas | Inicio |
| **Datadog** | Pro | $15+ USD/mes | Ilimitadas | Escalado |
| **New Relic** | Free | $0 | Limitadas | Inicio |
| **New Relic** | Pro | $49+ USD/mes | Completo | Escalado |

**Recomendación para inicio**: **Datadog Free ($0)**

Cuando llegues a 1,000+ estudiantes: pasar a Pro (~$50/mes)

**URL oficial**: https://www.datadoghq.com/pricing/ o https://newrelic.com/pricing

---

## 📊 Escenarios de costo

### Escenario 1: INICIO (Primeros 100 estudiantes)

```
Supabase Pro                    $25 USD
Cloudflare Stream (low usage)   $10 USD
Cloudflare R2 (low usage)       $2 USD
Vercel (Free)                   $0 USD
Dominio .cl (amortizado)        $1 USD/mes
Google Workspace (1 user)       $6 USD
Cloudflare Pro                  $20 USD
Monitoreo (Free)                $0 USD
─────────────────────────────────────
TOTAL MENSUAL                   $64 USD
TOTAL ANUAL                     $768 USD
```

**En CLP (aprox $960 por USD)**: **~$61,000 CLP/mes** o **$736,000 CLP/año**

---

### Escenario 2: CRECIMIENTO (500-1,000 estudiantes)

```
Supabase Pro                    $25 USD
Cloudflare Stream (med usage)   $50 USD
Cloudflare R2 (med usage)       $10 USD
Vercel Pro                      $20 USD
Dominio .cl (amortizado)        $1 USD/mes
Google Workspace (2 users)      $12 USD
Cloudflare Pro                  $20 USD
Datadog (starter)               $15 USD
─────────────────────────────────────
TOTAL MENSUAL                   $153 USD
TOTAL ANUAL                     $1,836 USD
```

**En CLP**: **~$147,000 CLP/mes** o **$1,760,000 CLP/año**

---

### Escenario 3: ESCALA (5,000+ estudiantes)

```
Supabase Team                   $50 USD
Cloudflare Stream (high usage)  $150 USD
Cloudflare R2 (high usage)      $30 USD
Vercel Pro                      $20 USD
Dominio .cl (amortizado)        $1 USD/mes
Google Workspace (5 users)      $30 USD
Cloudflare Pro                  $20 USD
Datadog Pro                      $50 USD
─────────────────────────────────────
TOTAL MENSUAL                   $351 USD
TOTAL ANUAL                     $4,212 USD
```

**En CLP**: **~$337,000 CLP/mes** o **$4,040,000 CLP/año**

---

## 🎯 Plan recomendado (INICIO)

Para lanzar Innovatech con **1-2 cursos iniciales** y **100-500 estudiantes**:

✅ **Servicios recomendados**:

1. **Supabase Pro** - $25/mes (base de datos, autenticación)
2. **Cloudflare Stream** - $20/mes (videos con streaming)
3. **Cloudflare R2** - $5/mes (PDFs y material descargable)
4. **Vercel Free** - $0/mes (servidor web)
5. **Dominio .cl** - $15/año ($1.25/mes promedio)
6. **Google Workspace** - $6/mes (email soporte@innovatech.cl)
7. **Cloudflare Pro** - $20/mes (seguridad)

**TOTAL MENSUAL**: **$77 USD** (~$74,000 CLP)
**TOTAL ANUAL**: **$924 USD** (~$887,000 CLP)

---

## 📈 Escalado: Cuándo cambiar de plan

| Métrica | Acción | Nuevo costo |
|---------|--------|-----------|
| Llegas a **1,000 estudiantes** | Cambiar Vercel a Pro, Datadog a starter | +$35 USD/mes |
| Llegas a **2,000 estudiantes** | Cambiar Supabase a Team si necesitas | +$25 USD/mes |
| Llegas a **5,000 estudiantes** | Revisar todos los planes, posible Datadog Pro | +$50-100 USD/mes |

---

## 💡 Formas de reducir costos

1. **Iniciar con Supabase Free** en desarrollo, pasar a Pro cuando lanzes
2. **Usar Vercel Free** mientras no necesites empresarial
3. **Combinar múltiples servicios** (ej: usar S3 de AWS en lugar de R2)
4. **Negociar con proveedores** si chegas a 10,000+ usuarios (descuentos corporativos disponibles)
5. **Usar CDN de Cloudflare** en lugar de pagar separado

---

## 🔒 Nota sobre seguridad y cumplimiento

Todos estos servicios cumplen con:
- ✅ ISO 27001 (seguridad de datos)
- ✅ SOC 2 (auditoría independiente)
- ✅ GDPR (regulación europea, aplica también a Chile)
- ✅ Encriptación TLS/SSL (conexiones seguras)

**Para certificación SENCE**, debes cumplir con:
- Backups diarios (Supabase: ✅ incluido)
- Acceso seguro (Cloudflare: ✅ incluido)
- Registros de actividad (Supabase: ✅ incluido)

---

## 📞 Próximos pasos

1. **Crear cuenta en Supabase** → supabase.com
2. **Registrarse en Cloudflare** → cloudflare.com
3. **Comprar dominio .cl** → godaddy.com
4. **Configurar Google Workspace** → workspace.google.com
5. **Conectar todo** a la aplicación Innovatech

Estimado: **1 hora** de configuración inicial (nuestro equipo puede hacerlo)

---

## ⚠️ Disclaimer

Los precios están vigentes a **Junio 2026** y pueden cambiar. Se recomienda:
- Revisar precios directamente en las webs oficiales
- Solicitar descuentos por volumen si aplica
- Evaluar alternativas cada 6 meses

**Documento preparado por**: Innovatech Development Team  
**Fecha de actualización**: Junio 26, 2026

---

¿Preguntas sobre este presupuesto? Contáctanos:
- 📧 info@innovatech.cl
- 📱 +56 9 XXXX XXXX

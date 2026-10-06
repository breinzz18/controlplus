# Auditoría del sitio actual — Control Plus Canarias

**Diseño y marca.** El logo es un rectángulo verde saturado (#0BC91E) con texto blanco, serif con contorno índigo (#384898) y emblemas de puntos "CP". El logo se pone como bloque plano y el verde chillón se reutiliza para titulares sobre fondo blanco o negro: contraste muy bajo (verde claro sobre blanco, verde oscuro sobre negro). Texto gris pálido sobre blanco ilegible en varias secciones. Mucho vacío y bloques negros sin contenido.

**Tipografía.** "Mansory SemiBold" para títulos y Montserrat Regular para cuerpo, mezcladas con tamaños dispares; los títulos del hero rompen en 3-4 líneas. Faltas: "Protegendo", "inovadores", "sanitara", "Salud Publica", "Tramites".

**Layout y mobile.** Home con hero poco claro (selector de 4 áreas con iconos verdes pálidos). Animaciones de entrada (AOS/Greenshift) dejan secciones vacías, translúcidas o negras al cargar; en móvil el banner de cookies ocupa media pantalla al entrar. Contadores en 0 ("Clientes satisfechos", etc.). Las páginas de servicio son bloques de texto largo, repetidos con el mismo CTA ("Contacte con nosotros / Más Información / Envíenos un Whatsapp") en cada servicio.

**Rendimiento (Playwright, móvil iPhone 13, 4G ~1,6 Mbps, latencia 150 ms, CPU 4x).** Home: load 8,3 s, 1,35 MB, 62 peticiones (16 CSS, 16 JS, 25 imágenes), FCP 2,4 s. Control de plagas: 3,1 s, 356 KB, 23 req. Salud pública: 2,9 s, 309 KB, 21 req. Contacto: 3,5 s, 384 KB, 33 req. Privacidad: 2,5 s, 252 KB, 19 req. La home pesa por imágenes de 400 KB (fugoneta.png 427 KB, tecnico01.png 340 KB, clean-ambient 382 KB) y exceso de CSS/JS de plugins.

**SEO.** Sin meta description en ninguna página. Sin h1 en home y páginas de servicio (solo la política de privacidad tiene h1; los títulos son h2 de Greenshift). Sin datos estructurados LocalBusiness. Títulos genéricos ("Control Plus Canarias"). No hay páginas por isla ni por plaga. Servicios importantes (carcoma/termita, Legionella) enterrados en el texto, fuera del menú. Texto "Tenerife" vs "8 islas" inconsistente.

**Conversión.** Teléfono único (+34 627 52 55 17) y WhatsApp flotante (plugin chat-everywhere) más botones por servicio; formulario Forminator (mensaje limitado a 180 caracteres). No hay teléfono visible en la cabecera, ni botón "Llamar" fijo en móvil, ni horario, ni urgencias 24 h, ni presupuesto en 1 clic. El botón de WhatsApp se pide con un texto ambiguo "Más Información".

**Confianza.** Presentes: reseñas Google 4,3/5 (51) vía Trustindex con nombres, inscripción ROEBSCA, antigüedad desde 2011, CIF en privacidad. Ausentes: número de inscripción ROESBCA, logos de clientes, fotos reales del equipo (casi todo es stock/IA), casos antes/después, certificaciones, seguro de RC, garantías. Incoherencias (8+ / 15 / 16 años) restan credibilidad; una reseña negativa visible sin respuesta. Email en Gmail.

**Plugins detectados.** WordPress + Blocksy, Greenshift (bloques/animaciones), Forminator, Complianz (cookies), Trustindex (reseñas), chat-everywhere (WhatsApp), Google Analytics/gtag. Creada por webintenerife.com.

**Conclusión.** Contenido sólido y registrado, pero presentación débil: rediseñar con paleta verde/índigo controlada y contraste accesible, hero con llamada y WhatsApp visibles, fotos reales, SEO local por servicio e isla, y peso de imágenes optimizado.

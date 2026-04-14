// src/background/html_cleaner.js
// Convierte HTML -> texto â€œusableâ€ (sin scripts/menus) para analizar polÃ­ticas.
// DiseÃ±ado para funcionar en MV3 service worker (sin DOM real).

function decodeHtmlEntities(str) {
  // Decode bÃ¡sico sin depender de DOMParser
  // (suficiente para polÃ­ticas: &amp; &lt; &gt; &quot; &#39; &nbsp;)
  return (str || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/");
}

function normalizeWhitespace(str) {
  return (str || "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .trim();
}

function removeSections(html) {
  let s = html || "";

  // Quitar comentarios HTML
  s = s.replace(/<!--[\s\S]*?-->/g, " ");

  // Quitar bloques que casi nunca aportan al texto legal
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  s = s.replace(/<canvas[\s\S]*?<\/canvas>/gi, " ");

  // Quitar navegaciÃ³n/menus tÃ­picos (ojo: a veces el footer tiene links Ãºtiles,
  // pero el texto legal suele estar en main/article; lo simplificamos para MVP)
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  s = s.replace(/<header[\s\S]*?<\/header>/gi, " ");
  s = s.replace(/<aside[\s\S]*?<\/aside>/gi, " ");

  return s;
}

function addLineBreaks(html) {
  let s = html || "";

  // Convertir tags de bloque a saltos de lÃ­nea para no mezclar frases
  const blockTags = [
    "p", "div", "section", "article", "main", "br",
    "li", "ul", "ol",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "tr", "td", "th",
    "footer"
  ];
// Developep by @marichu_kt

  for (const tag of blockTags) {
    // <tag ...> -> \n
    s = s.replace(new RegExp(`<${tag}\\b[^>]*>`, "gi"), "\n");
    // </tag> -> \n
    s = s.replace(new RegExp(`</${tag}>`, "gi"), "\n");
  }

  return s;
}

function stripTags(html) {
  // Quitar tags restantes
  return (html || "").replace(/<\/?[^>]+>/g, " ");
}

function tryExtractMainLike(html) {
  // Intento â€œligeroâ€ de quedarse con main/article si existe.
  // Si falla, devuelve el HTML original.
  const s = html || "";
  const mainMatch = s.match(/<main\b[\s\S]*?<\/main>/i);
  if (mainMatch) return mainMatch[0];

  const articleMatch = s.match(/<article\b[\s\S]*?<\/article>/i);
  if (articleMatch) return articleMatch[0];

  // A veces el contenido estÃ¡ en <div id="content"> o similar: intentamos 2 heurÃ­sticas comunes
  const contentMatch = s.match(/<div\b[^>]*(id|class)=["'][^"']*(content|container|page|legal|privacy)[^"']*["'][^>]*>[\s\S]*?<\/div>/i);
  if (contentMatch) return contentMatch[0];

  return s;
}

export function htmlToCleanText(html) {
  if (!html) return "";

  // 1) extraer bloque principal si se puede
  let s = tryExtractMainLike(html);

  // 2) quitar secciones ruidosas
  s = removeSections(s);

  // 3) meter saltos de lÃ­nea en bloques
  s = addLineBreaks(s);

  // 4) quitar tags
  s = stripTags(s);

  // 5) decode entidades y normalizar
  s = decodeHtmlEntities(s);
  s = normalizeWhitespace(s);

  return s;
}

export function truncateText(text, maxChars = 15000) {
  const t = (text || "").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars) + "\n\n[TRUNCADO]";
}

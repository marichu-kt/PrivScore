// src/background/gemini_client.js
// Llama a Gemini Developer API y devuelve señales estructuradas.
// Nota: la IA SOLO extrae señales; la letra siempre la calcula scoring.js (determinista).

function cleanJsonText(txt) {
  const t = (txt || "").trim();
  return t.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function safeParseJson(txt) {
  const cleaned = cleanJsonText(txt);

  // Intento directo
  try { return JSON.parse(cleaned); } catch (_) {}

  // Intento extraer primer {...} válido
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const slice = cleaned.slice(start, end + 1);
    return JSON.parse(slice);
  }

  throw new Error("No se pudo parsear JSON de Gemini.");
}

function normTri(v) {
  const s = String(v || "").toLowerCase().trim();
  if (s === "sí" || s === "si") return "si";
  if (s === "no") return "no";
  if (s === "indeterminado" || s === "unknown" || s === "n/a") return "indeterminado";
  return "indeterminado";
}

export function buildGeminiPrompt({ cookieSummaryText, pageSignalsText, policyText }) {
  return `
Eres un auditor de privacidad. Tu tarea es EXTRAER SEÑALES, no calcular notas.

Analiza:
1) Resumen técnico de cookies:
${cookieSummaryText}

2) Señales técnicas observadas en la página (scripts/iframes/dom/storage/cmp):
${pageSignalsText}

3) Texto legal (privacidad/cookies/términos):
${policyText}

Responde SOLO con JSON válido (sin texto extra), con este esquema:
{
  "venta_de_datos": "si|no|indeterminado",
  "comparticion_con_terceros": "si|no|indeterminado",
  "ads_tracking": "si|no|indeterminado",
  "retencion": "string",
  "derechos": "string",
  "evidencia": {
    "venta": "string",
    "terceros": "string",
    "ads": "string"
  },
  "confidence": 0.0
}

Reglas:
- NO inventes. Si no está claro: "indeterminado".
- Respeta negaciones ("no vendemos", "we do not sell").
- En "evidencia", si no hay frase clara, usa "".
- "confidence" entre 0.0 y 1.0.
`.trim();
}

async function fetchWithTimeout(url, body, timeoutMs) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    return r;
  } finally {
    clearTimeout(id);
  }
}

export async function geminiExtractSignals({
  apiKey,
  modelId = "gemini-2.5-flash-lite",
  timeoutMs = 12000,
  cookieSummaryText,
  pageSignalsText,
  policyText
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const prompt = buildGeminiPrompt({ cookieSummaryText, pageSignalsText, policyText });

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.9,
      maxOutputTokens: 700
    }
  };

  const r = await fetchWithTimeout(endpoint, body, timeoutMs);
  if (!r.ok) throw new Error(`Gemini HTTP ${r.status}`);

  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const parsed = safeParseJson(text);

  return {
    venta_de_datos: normTri(parsed.venta_de_datos),
    comparticion_con_terceros: normTri(parsed.comparticion_con_terceros),
    ads_tracking: normTri(parsed.ads_tracking),
    retencion: String(parsed.retencion || "").slice(0, 500),
    derechos: String(parsed.derechos || "").slice(0, 500),
    evidencia: {
      venta: String(parsed?.evidencia?.venta || "").slice(0, 220),
      terceros: String(parsed?.evidencia?.terceros || "").slice(0, 220),
      ads: String(parsed?.evidencia?.ads || "").slice(0, 220)
    },
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence || 0)))
  };
}

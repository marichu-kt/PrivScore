import * as servicesMockModule from "./services.mock";

function pickArrayExport(moduleObject, preferredName) {
  if (Array.isArray(moduleObject?.[preferredName])) return moduleObject[preferredName];
  if (Array.isArray(moduleObject?.default)) return moduleObject.default;
  return Object.values(moduleObject || {}).find((value) => Array.isArray(value)) || [];
}

const servicesMock = pickArrayExport(servicesMockModule, "servicesMock");

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makePolicyLinks(domain) {
  const base = domain.startsWith("http") ? domain : `https://${domain}`;
  return {
    privacy: `${base}/privacy`,
    terms: `${base}/terms`,
    cookies: `${base}/cookies`,
  };
}

function makeHighlights(category, rating, name) {
  const byRating = {
    A: ["Controles visibles", "Exposición baja"],
    B: ["Gestión razonable", "Terceros contenidos"],
    C: ["Lectura media", "Métricas y soporte"],
    D: ["Más terceros", "Perfilado y medición"],
    E: ["Perfilado intenso", "Mayor exposición"],
  };

  const categoryLabel = {
    "Social": "Cuenta y feed",
    "Mensajería": "Cuenta y contactos",
    "Streaming": "Cuenta y consumo",
    "Gaming": "Cuenta y telemetría",
    "Productividad": "Cuenta y colaboración",
    "Cloud y hosting": "Cuenta y archivos",
    "Búsqueda y referencia": "Búsquedas y métricas",
    "Seguridad": "Seguridad y soporte",
    "Compras": "Cuenta y pedidos",
    "Finanzas": "Cuenta y riesgo",
    "Noticias y medios": "Lectura y métricas",
    "IA": "Prompts y uso",
    "Fabricante": "Cuenta y ecosistema",
    "Comunidad técnica": "Cuenta y preferencias",
    "Viajes": "Cuenta y reservas",
    "Vídeo": "Cuenta y reproducción",
    "Servicios web": "Cuenta y sesión",
  };

  return [...(byRating[rating] || [category, "Cookies"]), categoryLabel[category] || "Cuenta y sesión", name].slice(0, 3);
}

function makeTagline(name, category) {
  return `${name} dentro de ${category.toLowerCase()} con una lectura editorial rápida sobre privacidad, terceros y control visible para la cuenta.`;
}

function makeSummary(name, category, rating) {
  const ratingCopy = {
    A: "con controles más visibles y una exposición comparativamente contenida",
    B: "con un equilibrio razonable entre funcionalidad, medición y control",
    C: "con una exposición intermedia típica de su segmento",
    D: "con un peso claro de terceros, personalización o medición",
    E: "con una exposición alta y una lectura más agresiva en tracking o perfilado",
  };

  return `Lectura editorial de ${name} en la categoría ${category.toLowerCase()}, ${ratingCopy[rating] || "con una lectura comparativa general"}.`;
}

const templateByRating = Object.fromEntries(
  ["A", "B", "C", "D", "E"].map((rating) => [
    rating,
    servicesMock.find((service) => service.rating === rating) || servicesMock[0],
  ])
);

const rankedProviders = [
  {
    "rank": 1,
    "domain": "google.com",
    "name": "Google",
    "category": "Búsqueda y referencia",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 16,
    "domain": "youtube.com",
    "name": "YouTube",
    "category": "Streaming",
    "rating": "E",
    "score": 36,
    "location": "Global"
  },
  {
    "rank": 3,
    "domain": "facebook.com",
    "name": "Facebook",
    "category": "Social",
    "rating": "E",
    "score": 36,
    "location": "Global"
  },
  {
    "rank": 25,
    "domain": "instagram.com",
    "name": "Instagram",
    "category": "Social",
    "rating": "E",
    "score": 36,
    "location": "Global"
  },
  {
    "rank": 4,
    "domain": "apple.com",
    "name": "Apple",
    "category": "Fabricante",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 6,
    "domain": "microsoft.com",
    "name": "Microsoft",
    "category": "Fabricante",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 18,
    "domain": "amazon.com",
    "name": "Amazon",
    "category": "Compras",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 30,
    "domain": "whatsapp.net",
    "name": "WhatsApp",
    "category": "Mensajería",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 31,
    "domain": "netflix.com",
    "name": "Netflix",
    "category": "Streaming",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 32,
    "domain": "office.com",
    "name": "Microsoft Office",
    "category": "Productividad",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 33,
    "domain": "spotify.com",
    "name": "Spotify",
    "category": "Streaming",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 35,
    "domain": "bing.com",
    "name": "Bing",
    "category": "Búsqueda y referencia",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 37,
    "domain": "cloudflare.com",
    "name": "Cloudflare",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 82,
    "location": "Global"
  },
  {
    "rank": 40,
    "domain": "snapchat.com",
    "name": "Snapchat",
    "category": "Social",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 42,
    "domain": "yahoo.com",
    "name": "Yahoo",
    "category": "Búsqueda y referencia",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 55,
    "domain": "twitter.com",
    "name": "X",
    "category": "Social",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 74,
    "domain": "linkedin.com",
    "name": "LinkedIn",
    "category": "Servicios web",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 75,
    "domain": "gmail.com",
    "name": "Gmail",
    "category": "Productividad",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 85,
    "domain": "samsung.com",
    "name": "Samsung",
    "category": "Fabricante",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 89,
    "domain": "baidu.com",
    "name": "Baidu",
    "category": "Búsqueda y referencia",
    "rating": "D",
    "score": 51,
    "location": "Global"
  },
  {
    "rank": 94,
    "domain": "epicgames.com",
    "name": "Epic Games",
    "category": "Gaming",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 95,
    "domain": "outlook.com",
    "name": "Outlook",
    "category": "Productividad",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 106,
    "domain": "dropbox.com",
    "name": "Dropbox",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 81,
    "location": "Global"
  },
  {
    "rank": 118,
    "domain": "grammarly.com",
    "name": "Grammarly",
    "category": "Productividad",
    "rating": "B",
    "score": 81,
    "location": "Global"
  },
  {
    "rank": 133,
    "domain": "android.com",
    "name": "Android",
    "category": "Fabricante",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 164,
    "domain": "qq.com",
    "name": "QQ",
    "category": "Mensajería",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 166,
    "domain": "kaspersky.com",
    "name": "Kaspersky",
    "category": "Seguridad",
    "rating": "B",
    "score": 81,
    "location": "Global"
  },
  {
    "rank": 171,
    "domain": "opera.com",
    "name": "Opera",
    "category": "Comunidad técnica",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 177,
    "domain": "avast.com",
    "name": "Avast",
    "category": "Seguridad",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 186,
    "domain": "espn.com",
    "name": "ESPN",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 187,
    "domain": "adobe.com",
    "name": "Adobe",
    "category": "Fabricante",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 191,
    "domain": "canva.com",
    "name": "Canva",
    "category": "Comunidad técnica",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 197,
    "domain": "slack.com",
    "name": "Slack",
    "category": "Productividad",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 200,
    "domain": "nvidia.com",
    "name": "NVIDIA",
    "category": "Fabricante",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 202,
    "domain": "discord.com",
    "name": "Discord",
    "category": "Social",
    "rating": "D",
    "score": 50,
    "location": "Global"
  },
  {
    "rank": 205,
    "domain": "mozilla.com",
    "name": "Mozilla",
    "category": "Comunidad técnica",
    "rating": "B",
    "score": 80,
    "location": "Global"
  },
  {
    "rank": 206,
    "domain": "steampowered.com",
    "name": "Steam",
    "category": "Gaming",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 208,
    "domain": "reddit.com",
    "name": "Reddit",
    "category": "Social",
    "rating": "D",
    "score": 50,
    "location": "Global"
  },
  {
    "rank": 213,
    "domain": "brave.com",
    "name": "Brave",
    "category": "Comunidad técnica",
    "rating": "A",
    "score": 92,
    "location": "Global"
  },
  {
    "rank": 226,
    "domain": "synology.com",
    "name": "Synology",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 80,
    "location": "Global"
  },
  {
    "rank": 235,
    "domain": "xiaomi.com",
    "name": "Xiaomi",
    "category": "Fabricante",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 241,
    "domain": "mercadolibre.com",
    "name": "Mercado Libre",
    "category": "Compras",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 247,
    "domain": "twitch.tv",
    "name": "Twitch",
    "category": "Streaming",
    "rating": "D",
    "score": 50,
    "location": "Global"
  },
  {
    "rank": 271,
    "domain": "stripe.com",
    "name": "Stripe",
    "category": "Finanzas",
    "rating": "B",
    "score": 79,
    "location": "Global"
  },
  {
    "rank": 274,
    "domain": "hulu.com",
    "name": "Hulu",
    "category": "Streaming",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 280,
    "domain": "tiktok.com",
    "name": "TikTok",
    "category": "Social",
    "rating": "E",
    "score": 33,
    "location": "Global"
  },
  {
    "rank": 283,
    "domain": "pinterest.com",
    "name": "Pinterest",
    "category": "Social",
    "rating": "D",
    "score": 49,
    "location": "Global"
  },
  {
    "rank": 285,
    "domain": "tradingview.com",
    "name": "TradingView",
    "category": "Finanzas",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 287,
    "domain": "weather.com",
    "name": "Weather.com",
    "category": "Búsqueda y referencia",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 360,
    "domain": "wikipedia.org",
    "name": "Wikipedia",
    "category": "Búsqueda y referencia",
    "rating": "B",
    "score": 78,
    "location": "Global"
  },
  {
    "rank": 405,
    "domain": "telegram.org",
    "name": "Telegram",
    "category": "Mensajería",
    "rating": "B",
    "score": 78,
    "location": "Global"
  },
  {
    "rank": 439,
    "domain": "signal.org",
    "name": "Signal",
    "category": "Mensajería",
    "rating": "A",
    "score": 89,
    "location": "Global"
  },
  {
    "rank": 434,
    "domain": "wechat.com",
    "name": "WeChat",
    "category": "Mensajería",
    "rating": "D",
    "score": 47,
    "location": "Global"
  },
  {
    "rank": 435,
    "domain": "openai.com",
    "name": "OpenAI",
    "category": "IA",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 97,
    "domain": "playstation.net",
    "name": "PlayStation",
    "category": "Gaming",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 72,
    "domain": "roblox.com",
    "name": "Roblox",
    "category": "Gaming",
    "rating": "D",
    "score": 52,
    "location": "Global"
  },
  {
    "rank": 229,
    "domain": "ubuntu.com",
    "name": "Ubuntu",
    "category": "Comunidad técnica",
    "rating": "B",
    "score": 80,
    "location": "Global"
  },
  {
    "rank": 276,
    "domain": "intuit.com",
    "name": "Intuit",
    "category": "Finanzas",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 182,
    "domain": "pluto.tv",
    "name": "Pluto TV",
    "category": "Streaming",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 454,
    "domain": "aliexpress.com",
    "name": "AliExpress",
    "category": "Compras",
    "rating": "E",
    "score": 31,
    "location": "Global"
  },
  {
    "rank": 457,
    "domain": "taobao.com",
    "name": "Taobao",
    "category": "Compras",
    "rating": "D",
    "score": 47,
    "location": "Global"
  },
  {
    "rank": 419,
    "domain": "shopee.com.br",
    "name": "Shopee",
    "category": "Compras",
    "rating": "D",
    "score": 47,
    "location": "Global"
  },
  {
    "rank": 321,
    "domain": "instacart.com",
    "name": "Instacart",
    "category": "Compras",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 299,
    "domain": "trendyol.com",
    "name": "Trendyol",
    "category": "Compras",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 258,
    "domain": "wildberries.ru",
    "name": "Wildberries",
    "category": "Compras",
    "rating": "D",
    "score": 49,
    "location": "Global"
  },
  {
    "rank": 313,
    "domain": "qantas.com",
    "name": "Qantas",
    "category": "Viajes",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 412,
    "domain": "zoom.us",
    "name": "Zoom",
    "category": "Productividad",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 104,
    "domain": "surfshark.com",
    "name": "Surfshark",
    "category": "Seguridad",
    "rating": "B",
    "score": 81,
    "location": "Global"
  },
  {
    "rank": 338,
    "domain": "mcafee.com",
    "name": "McAfee",
    "category": "Seguridad",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 392,
    "domain": "norton.com",
    "name": "Norton",
    "category": "Seguridad",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 291,
    "domain": "trendmicro.com",
    "name": "Trend Micro",
    "category": "Seguridad",
    "rating": "B",
    "score": 79,
    "location": "Global"
  },
  {
    "rank": 339,
    "domain": "bitdefender.net",
    "name": "Bitdefender",
    "category": "Seguridad",
    "rating": "B",
    "score": 78,
    "location": "Global"
  },
  {
    "rank": 393,
    "domain": "starlink.com",
    "name": "Starlink",
    "category": "Cloud y hosting",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 377,
    "domain": "ring.com",
    "name": "Ring",
    "category": "Cloud y hosting",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 397,
    "domain": "sonos.com",
    "name": "Sonos",
    "category": "Fabricante",
    "rating": "B",
    "score": 78,
    "location": "Global"
  },
  {
    "rank": 13,
    "domain": "ui.com",
    "name": "UI",
    "category": "Fabricante",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 14,
    "domain": "icloud.com",
    "name": "Icloud",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 82,
    "location": "Global"
  },
  {
    "rank": 29,
    "domain": "live.com",
    "name": "Microsoft Live",
    "category": "Servicios web",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 39,
    "domain": "one.one",
    "name": "1.1.1.1",
    "category": "Búsqueda y referencia",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 46,
    "domain": "azure.com",
    "name": "Azure",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 82,
    "location": "Global"
  },
  {
    "rank": 48,
    "domain": "msftncsi.com",
    "name": "Msftncsi",
    "category": "Servicios web",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 53,
    "domain": "msn.com",
    "name": "MSN",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 68,
    "domain": "skype.com",
    "name": "Skype",
    "category": "Productividad",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 76,
    "domain": "akamaized.net",
    "name": "Akamaized",
    "category": "Servicios web",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 84,
    "domain": "sharepoint.com",
    "name": "Sharepoint",
    "category": "Productividad",
    "rating": "C",
    "score": 67,
    "location": "Global"
  },
  {
    "rank": 87,
    "domain": "windows.com",
    "name": "Windows",
    "category": "Fabricante",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 90,
    "domain": "a-msedge.net",
    "name": "A Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 91,
    "domain": "amazonalexa.com",
    "name": "Amazonalexa",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 111,
    "domain": "samsungcloud.com",
    "name": "Samsung Cloud",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 81,
    "location": "Global"
  },
  {
    "rank": 115,
    "domain": "appcenter.ms",
    "name": "Appcenter",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 129,
    "domain": "v-mate.mobi",
    "name": "VMate",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 130,
    "domain": "pubgmobile.com",
    "name": "PUBG Mobile",
    "category": "Gaming",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 132,
    "domain": "helpshift.com",
    "name": "Helpshift",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 139,
    "domain": "likee.video",
    "name": "Likee",
    "category": "Social",
    "rating": "D",
    "score": 51,
    "location": "Global"
  },
  {
    "rank": 140,
    "domain": "like.video",
    "name": "LIKE Video",
    "category": "Vídeo",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 153,
    "domain": "bigolive.tv",
    "name": "BIGO Live",
    "category": "Social",
    "rating": "D",
    "score": 51,
    "location": "Global"
  },
  {
    "rank": 161,
    "domain": "samsungapps.com",
    "name": "Galaxy Store",
    "category": "Servicios web",
    "rating": "C",
    "score": 66,
    "location": "Global"
  },
  {
    "rank": 169,
    "domain": "msedge.net",
    "name": "Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 178,
    "domain": "anydesk.com",
    "name": "Anydesk",
    "category": "Servicios web",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 184,
    "domain": "3lift.com",
    "name": "3lift",
    "category": "Servicios web",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 192,
    "domain": "fast.com",
    "name": "Fast",
    "category": "Servicios web",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 201,
    "domain": "yle.fi",
    "name": "Yle",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 209,
    "domain": "gamepass.com",
    "name": "Gamepass",
    "category": "Gaming",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 212,
    "domain": "azurewebsites.net",
    "name": "Azurewebsites",
    "category": "Cloud y hosting",
    "rating": "B",
    "score": 80,
    "location": "Global"
  },
  {
    "rank": 215,
    "domain": "virtualearth.net",
    "name": "Bing Maps",
    "category": "Búsqueda y referencia",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 217,
    "domain": "viber.com",
    "name": "Viber",
    "category": "Mensajería",
    "rating": "C",
    "score": 65,
    "location": "Global"
  },
  {
    "rank": 232,
    "domain": "yandex.net",
    "name": "Yandex",
    "category": "Búsqueda y referencia",
    "rating": "D",
    "score": 50,
    "location": "Global"
  },
  {
    "rank": 255,
    "domain": "vk.com",
    "name": "VK",
    "category": "Social",
    "rating": "D",
    "score": 49,
    "location": "Global"
  },
  {
    "rank": 256,
    "domain": "ok.ru",
    "name": "OK",
    "category": "Social",
    "rating": "D",
    "score": 49,
    "location": "Global"
  },
  {
    "rank": 268,
    "domain": "wb.ru",
    "name": "WB",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 269,
    "domain": "miui.com",
    "name": "Miui",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 297,
    "domain": "sonnenbatterie.de",
    "name": "Sonnenbatterie",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 303,
    "domain": "speedtest.net",
    "name": "Speedtest",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 311,
    "domain": "ssl-images-amazon.com",
    "name": "SSL Images Amazon",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 314,
    "domain": "gateio.live",
    "name": "Gateio",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 315,
    "domain": "smartappnet.net",
    "name": "Smartappnet",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 317,
    "domain": "leroymerlin.pl",
    "name": "Leroymerlin",
    "category": "Compras",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 324,
    "domain": "newark.com",
    "name": "Newark",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 325,
    "domain": "expedia.com.au",
    "name": "Expedia",
    "category": "Viajes",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 328,
    "domain": "vrt.be",
    "name": "VRT",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 329,
    "domain": "palmpay.app",
    "name": "Palmpay",
    "category": "Finanzas",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 332,
    "domain": "studiotv.net",
    "name": "Studiotv",
    "category": "Servicios web",
    "rating": "C",
    "score": 64,
    "location": "Global"
  },
  {
    "rank": 355,
    "domain": "vivoglobal.com",
    "name": "Vivoglobal",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 359,
    "domain": "freefiremobile.com",
    "name": "Freefiremobile",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 361,
    "domain": "heytapmobile.com",
    "name": "Heytapmobile",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 362,
    "domain": "inmobi.com",
    "name": "Inmobi",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 363,
    "domain": "xzcs3zlph.com",
    "name": "Xzcs3zlph",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 365,
    "domain": "bigo.sg",
    "name": "Bigo",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 369,
    "domain": "abv.bg",
    "name": "ABV",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 376,
    "domain": "islandluck.com",
    "name": "Islandluck",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 378,
    "domain": "xboxlive.com",
    "name": "Xboxlive",
    "category": "Gaming",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 382,
    "domain": "klix.ba",
    "name": "Klix",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 387,
    "domain": "cisco.com",
    "name": "Cisco",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 389,
    "domain": "my2n.com",
    "name": "My2n",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 390,
    "domain": "lenovo.com",
    "name": "Lenovo",
    "category": "Fabricante",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 395,
    "domain": "mywellness.com",
    "name": "Mywellness",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 396,
    "domain": "icloud-content.com",
    "name": "Icloud Content",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 399,
    "domain": "crestron.io",
    "name": "Crestron",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 401,
    "domain": "2miners.com",
    "name": "2miners",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 403,
    "domain": "mts.by",
    "name": "MTS",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 404,
    "domain": "kufar.by",
    "name": "Kufar",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 406,
    "domain": "dzen.ru",
    "name": "Dzen",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 407,
    "domain": "ya.ru",
    "name": "YA",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 408,
    "domain": "zerkalo.io",
    "name": "Zerkalo",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 409,
    "domain": "buzzoola.com",
    "name": "Buzzoola",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 415,
    "domain": "kwai.net",
    "name": "Kwai",
    "category": "Servicios web",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 417,
    "domain": "globo.com",
    "name": "Globo",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 63,
    "location": "Global"
  },
  {
    "rank": 418,
    "domain": "kwai-pro.com",
    "name": "Kwai PRO",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 420,
    "domain": "kwaipros.com",
    "name": "Kwaipros",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 421,
    "domain": "uol.com.br",
    "name": "UOL",
    "category": "Noticias y medios",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 422,
    "domain": "nubank.com.br",
    "name": "Nubank",
    "category": "Finanzas",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 430,
    "domain": "iq.com",
    "name": "iQIYI",
    "category": "Streaming",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 431,
    "domain": "firefox.com",
    "name": "Firefox",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 438,
    "domain": "mediatek.com",
    "name": "Mediatek",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 446,
    "domain": "matrix.org",
    "name": "Matrix",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 458,
    "domain": "bilibili.com",
    "name": "Bilibili",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 459,
    "domain": "vivo.com.cn",
    "name": "Vivo",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 460,
    "domain": "tencent-cloud.net",
    "name": "Tencent Cloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 461,
    "domain": "douyinliving.com",
    "name": "Douyinliving",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 462,
    "domain": "amap.com",
    "name": "Amap",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 463,
    "domain": "douyinvod.com",
    "name": "Douyinvod",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 464,
    "domain": "dbankcloud.cn",
    "name": "Dbankcloud",
    "category": "Finanzas",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 465,
    "domain": "amemv.com",
    "name": "Amemv",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 466,
    "domain": "zijieapi.com",
    "name": "Zijieapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 468,
    "domain": "sogou.com",
    "name": "Sogou",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 469,
    "domain": "meituan.net",
    "name": "Meituan",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 470,
    "domain": "douyinpic.com",
    "name": "Douyinpic",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 471,
    "domain": "ixigua.com",
    "name": "Ixigua",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 473,
    "domain": "pstatp.com",
    "name": "Pstatp",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 474,
    "domain": "qpic.cn",
    "name": "Qpic",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 475,
    "domain": "heytapmobi.com",
    "name": "Heytapmobi",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 476,
    "domain": "hdslb.com",
    "name": "Hdslb",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 477,
    "domain": "snssdk.com",
    "name": "Snssdk",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 479,
    "domain": "the-best-airport.com",
    "name": "THE Best Airport",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 482,
    "domain": "bilivideo.com",
    "name": "Bilivideo",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 483,
    "domain": "hicloud.com",
    "name": "Hicloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 485,
    "domain": "quark.cn",
    "name": "Quark",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 488,
    "domain": "jd.com",
    "name": "JD",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 489,
    "domain": "etoote.com",
    "name": "Etoote",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 490,
    "domain": "xiaohongshu.com",
    "name": "Xiaohongshu",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 492,
    "domain": "tencent.com",
    "name": "Tencent",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 493,
    "domain": "qlogo.cn",
    "name": "Qlogo",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 494,
    "domain": "bcebos.com",
    "name": "Bcebos",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 495,
    "domain": "mi.com",
    "name": "MI",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 496,
    "domain": "live-voip.com",
    "name": "Live Voip",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 497,
    "domain": "video-voip.com",
    "name": "Video Voip",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 498,
    "domain": "wps.cn",
    "name": "WPS",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 499,
    "domain": "biliapi.net",
    "name": "Biliapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 500,
    "domain": "ecombdapi.com",
    "name": "Ecombdapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 62,
    "location": "Global"
  },
  {
    "rank": 502,
    "domain": "pinduoduo.com",
    "name": "Pinduoduo",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 505,
    "domain": "uc.cn",
    "name": "UC",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 506,
    "domain": "umeng.com",
    "name": "Umeng",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 508,
    "domain": "inkuai.com",
    "name": "Inkuai",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 509,
    "domain": "ndcpp.com",
    "name": "Ndcpp",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 510,
    "domain": "bytedance.com",
    "name": "Bytedance",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 511,
    "domain": "alipay.com",
    "name": "Alipay",
    "category": "Finanzas",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 512,
    "domain": "bdurl.net",
    "name": "Bdurl",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 513,
    "domain": "aliyun.com",
    "name": "Aliyun",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 514,
    "domain": "sandai.net",
    "name": "Sandai",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 515,
    "domain": "dianping.com",
    "name": "Dianping",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 516,
    "domain": "gifshow.com",
    "name": "Gifshow",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 519,
    "domain": "ksapisrv.com",
    "name": "Ksapisrv",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 520,
    "domain": "xunlei.com",
    "name": "Xunlei",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 521,
    "domain": "kuiniuca.com",
    "name": "Kuiniuca",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 522,
    "domain": "doh.pub",
    "name": "DOH",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 525,
    "domain": "begmedia.com",
    "name": "Begmedia",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 526,
    "domain": "teamviewer.com",
    "name": "Teamviewer",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 528,
    "domain": "westernunion.com",
    "name": "Westernunion",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 530,
    "domain": "sporty-tech.net",
    "name": "Sporty Tech",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 532,
    "domain": "jagnoans.com",
    "name": "Jagnoans",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 534,
    "domain": "got-to-be.net",
    "name": "GOT TO BE",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 536,
    "domain": "amplitude.com",
    "name": "Amplitude",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 537,
    "domain": "nzherald.co.nz",
    "name": "Nzherald",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 538,
    "domain": "gumgum.com",
    "name": "Gumgum",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 539,
    "domain": "withgoogle.com",
    "name": "Withgoogle",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 540,
    "domain": "ropro.io",
    "name": "Ropro",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 541,
    "domain": "unrulymedia.com",
    "name": "Unrulymedia",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 542,
    "domain": "adsrvr.org",
    "name": "Adsrvr",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 543,
    "domain": "indexww.com",
    "name": "Indexww",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 545,
    "domain": "stickyadstv.com",
    "name": "Stickyadstv",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 547,
    "domain": "wattpad.com",
    "name": "Wattpad",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 548,
    "domain": "mangageko.com",
    "name": "Mangageko",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 549,
    "domain": "grpc.stream",
    "name": "Grpc",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 550,
    "domain": "quran.app",
    "name": "Quran",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 552,
    "domain": "consentframework.com",
    "name": "Consentframework",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 553,
    "domain": "privacy-center.org",
    "name": "Privacy Center",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 554,
    "domain": "beyla.site",
    "name": "Beyla",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 555,
    "domain": "rqmob.com",
    "name": "Rqmob",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 556,
    "domain": "pullcm.com",
    "name": "Pullcm",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 559,
    "domain": "efatura.cv",
    "name": "Efatura",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 561,
    "domain": "go.cr",
    "name": "GO",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 563,
    "domain": "mikrotik.com",
    "name": "Mikrotik",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 565,
    "domain": "mozaws.net",
    "name": "Mozaws",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 566,
    "domain": "eclastio.com",
    "name": "Eclastio",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 567,
    "domain": "eset.com",
    "name": "Eset",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 569,
    "domain": "github.com",
    "name": "Github",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 571,
    "domain": "seznam.cz",
    "name": "Seznam",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 572,
    "domain": "sdn.cz",
    "name": "SDN",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 574,
    "domain": "im.cz",
    "name": "IM",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 575,
    "domain": "novinky.cz",
    "name": "Novinky",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 576,
    "domain": "mapy.cz",
    "name": "Mapy",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 577,
    "domain": "szn.cz",
    "name": "SZN",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 578,
    "domain": "cra.cz",
    "name": "CRA",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 579,
    "domain": "seznamzpravy.cz",
    "name": "Seznamzpravy",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 580,
    "domain": "adscale.de",
    "name": "Adscale",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 582,
    "domain": "sonnen.de",
    "name": "Sonnen",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 583,
    "domain": "web.de",
    "name": "WEB",
    "category": "Servicios web",
    "rating": "C",
    "score": 61,
    "location": "Global"
  },
  {
    "rank": 585,
    "domain": "nflxso.net",
    "name": "Nflxso",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 586,
    "domain": "tp-link.com",
    "name": "TP Link",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 589,
    "domain": "truecaller.com",
    "name": "Truecaller",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 590,
    "domain": "flurry.com",
    "name": "Flurry",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 592,
    "domain": "sharethis.com",
    "name": "Sharethis",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 593,
    "domain": "loves.com",
    "name": "Loves",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 595,
    "domain": "cookiebot.com",
    "name": "Cookiebot",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 596,
    "domain": "dr.dk",
    "name": "DR",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 597,
    "domain": "tv2.dk",
    "name": "Tv2",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 598,
    "domain": "adnami.io",
    "name": "Adnami",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 599,
    "domain": "omtrdc.net",
    "name": "Omtrdc",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 601,
    "domain": "roku.com",
    "name": "Roku",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 605,
    "domain": "partystar.cloud",
    "name": "Partystar",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 606,
    "domain": "snackvideo.in",
    "name": "Snackvideo",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 607,
    "domain": "goldenquran.org",
    "name": "Goldenquran",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 608,
    "domain": "bbci.co.uk",
    "name": "Bbci",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 609,
    "domain": "imo.im",
    "name": "IMO",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 610,
    "domain": "fb.com",
    "name": "FB",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 611,
    "domain": "imoim.app",
    "name": "Imoim",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 612,
    "domain": "mncsv.com",
    "name": "Mncsv",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 615,
    "domain": "sensic.net",
    "name": "Sensic",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 616,
    "domain": "richaudience.com",
    "name": "Richaudience",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 617,
    "domain": "delfi.ee",
    "name": "Delfi",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 619,
    "domain": "cxense.com",
    "name": "Cxense",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 621,
    "domain": "cb7lvj2ab.link",
    "name": "Cb7lvj2ab",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 623,
    "domain": "fsapi.com",
    "name": "Fsapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 624,
    "domain": "sanoma-sndp.fi",
    "name": "Sanoma Sndp",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 627,
    "domain": "pbstck.com",
    "name": "Pbstck",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 628,
    "domain": "meethue.com",
    "name": "Meethue",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 631,
    "domain": "soundcloud.com",
    "name": "Soundcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 633,
    "domain": "nel.goog",
    "name": "NEL",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 635,
    "domain": "inner-active.mobi",
    "name": "Inner Active",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 637,
    "domain": "bbc.co.uk",
    "name": "BBC",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 641,
    "domain": "acint.net",
    "name": "Acint",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 642,
    "domain": "ge.movie",
    "name": "GE",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 644,
    "domain": "opendsp.ru",
    "name": "Opendsp",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 645,
    "domain": "magsrv.com",
    "name": "Magsrv",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 646,
    "domain": "twilio.com",
    "name": "Twilio",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 647,
    "domain": "acsechocaptiveportal.com",
    "name": "Acsechocaptiveportal",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 648,
    "domain": "visualstudio.com",
    "name": "Visualstudio",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 650,
    "domain": "msport.com",
    "name": "Msport",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 653,
    "domain": "giphy.com",
    "name": "Giphy",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 654,
    "domain": "orange.fr",
    "name": "Orange",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 657,
    "domain": "vfsglobal.com",
    "name": "Vfsglobal",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 658,
    "domain": "cookielaw.org",
    "name": "Cookielaw",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 659,
    "domain": "recaptcha.net",
    "name": "Recaptcha",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 661,
    "domain": "glomex.com",
    "name": "Glomex",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 662,
    "domain": "orangeclickmedia.com",
    "name": "Orangeclickmedia",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 663,
    "domain": "adman.gr",
    "name": "Adman",
    "category": "Servicios web",
    "rating": "C",
    "score": 60,
    "location": "Global"
  },
  {
    "rank": 670,
    "domain": "wyzecam.com",
    "name": "Wyzecam",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 672,
    "domain": "tabletcaptiveportal.com",
    "name": "Tabletcaptiveportal",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 676,
    "domain": "index.hr",
    "name": "Index",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 677,
    "domain": "connectad.io",
    "name": "Connectad",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 678,
    "domain": "linker.hr",
    "name": "Linker",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 679,
    "domain": "upscore.com",
    "name": "Upscore",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 680,
    "domain": "midas-network.com",
    "name": "Midas Network",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 681,
    "domain": "supersonicads.com",
    "name": "Supersonicads",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 686,
    "domain": "shopeemobile.com",
    "name": "Shopeemobile",
    "category": "Compras",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 688,
    "domain": "susercontent.com",
    "name": "Susercontent",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 689,
    "domain": "tokopedia.com",
    "name": "Tokopedia",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 690,
    "domain": "mgid.com",
    "name": "Mgid",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 692,
    "domain": "typekit.net",
    "name": "Typekit",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 695,
    "domain": "jiocinema.com",
    "name": "Jiocinema",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 696,
    "domain": "voot.com",
    "name": "Voot",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 697,
    "domain": "clevertap-prod.com",
    "name": "Clevertap Prod",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 699,
    "domain": "paytm.com",
    "name": "Paytm",
    "category": "Finanzas",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 701,
    "domain": "yektanet.com",
    "name": "Yektanet",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 702,
    "domain": "iranlms.ir",
    "name": "Iranlms",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 703,
    "domain": "bidmachine.io",
    "name": "Bidmachine",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 704,
    "domain": "trademore.com",
    "name": "Trademore",
    "category": "Finanzas",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 705,
    "domain": "eitaa.ir",
    "name": "Eitaa",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 707,
    "domain": "aparat.com",
    "name": "Aparat",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 708,
    "domain": "ea.com",
    "name": "EA",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 709,
    "domain": "sanjagh.com",
    "name": "Sanjagh",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 710,
    "domain": "najva.com",
    "name": "Najva",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 711,
    "domain": "promizer.com",
    "name": "Promizer",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 712,
    "domain": "capellare.com",
    "name": "Capellare",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 713,
    "domain": "bale.ai",
    "name": "Bale",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 714,
    "domain": "everestop.io",
    "name": "Everestop",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 715,
    "domain": "webengage.com",
    "name": "Webengage",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 716,
    "domain": "tabanweb.com",
    "name": "Tabanweb",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 717,
    "domain": "megaan.homes",
    "name": "Megaan",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 718,
    "domain": "maviss.cfd",
    "name": "Maviss",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 719,
    "domain": "maxin.beauty",
    "name": "Maxin",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 720,
    "domain": "morvaner.com",
    "name": "Morvaner",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 721,
    "domain": "inna.cfd",
    "name": "Inna",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 722,
    "domain": "maymay.boats",
    "name": "Maymay",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 723,
    "domain": "melisa.lol",
    "name": "Melisa",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 724,
    "domain": "michaeli.sbs",
    "name": "Michaeli",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 725,
    "domain": "irene.lat",
    "name": "Irene",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 726,
    "domain": "fyber.com",
    "name": "Fyber",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 727,
    "domain": "lissa.beauty",
    "name": "Lissa",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 728,
    "domain": "meroiy.icu",
    "name": "Meroiy",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 729,
    "domain": "leee.motorcycles",
    "name": "Leee",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 731,
    "domain": "yalla.games",
    "name": "Yalla",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 732,
    "domain": "chartbeat.net",
    "name": "Chartbeat",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 734,
    "domain": "k5a.io",
    "name": "K5a",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 735,
    "domain": "piano.io",
    "name": "Piano",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 736,
    "domain": "airserve.net",
    "name": "Airserve",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 738,
    "domain": "ynet.co.il",
    "name": "Ynet",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 739,
    "domain": "dxmdp.com",
    "name": "Dxmdp",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 740,
    "domain": "4dex.io",
    "name": "4dex",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 741,
    "domain": "spot.im",
    "name": "Spot",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 743,
    "domain": "iubenda.com",
    "name": "Iubenda",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 747,
    "domain": "sophosxl.net",
    "name": "Sophosxl",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 748,
    "domain": "wac-msedge.net",
    "name": "WAC Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 749,
    "domain": "centrastage.net",
    "name": "Centrastage",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 750,
    "domain": "webex.com",
    "name": "Webex",
    "category": "Servicios web",
    "rating": "C",
    "score": 59,
    "location": "Global"
  },
  {
    "rank": 751,
    "domain": "sophos.com",
    "name": "Sophos",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 752,
    "domain": "wbx2.com",
    "name": "Wbx2",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 753,
    "domain": "b-msedge.net",
    "name": "B Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 758,
    "domain": "yahooapis.jp",
    "name": "Yahooapis",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 759,
    "domain": "ne.jp",
    "name": "NE",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 761,
    "domain": "im-apps.net",
    "name": "IM Apps",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 763,
    "domain": "line-apps.com",
    "name": "Line Apps",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 764,
    "domain": "rakuten.co.jp",
    "name": "Rakuten",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 765,
    "domain": "line.me",
    "name": "Line",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 766,
    "domain": "naver.jp",
    "name": "Naver",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 767,
    "domain": "nintendo.net",
    "name": "Nintendo",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 768,
    "domain": "socdm.com",
    "name": "Socdm",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 769,
    "domain": "adingo.jp",
    "name": "Adingo",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 771,
    "domain": "kaspi.kz",
    "name": "Kaspi",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 773,
    "domain": "2gis.com",
    "name": "2gis",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 774,
    "domain": "yadro.ru",
    "name": "Yadro",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 777,
    "domain": "sportpesa.com",
    "name": "Sportpesa",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 781,
    "domain": "urban-vpn.com",
    "name": "Urban VPN",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 783,
    "domain": "reasonsecurity.com",
    "name": "Reasonsecurity",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 785,
    "domain": "featuregates.org",
    "name": "Featuregates",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 786,
    "domain": "mwbsys.com",
    "name": "Mwbsys",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 787,
    "domain": "myqnapcloud.io",
    "name": "Myqnapcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 788,
    "domain": "plex.tv",
    "name": "Plex",
    "category": "Vídeo",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 790,
    "domain": "notion.so",
    "name": "Notion",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 791,
    "domain": "beeper.com",
    "name": "Beeper",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 792,
    "domain": "anz.com",
    "name": "ANZ",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 794,
    "domain": "messenger.com",
    "name": "Messenger",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 795,
    "domain": "hellomini.xyz",
    "name": "Hellomini",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 796,
    "domain": "g0-g3t-msg.com",
    "name": "G0 G3t MSG",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 797,
    "domain": "yieldmo.com",
    "name": "Yieldmo",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 798,
    "domain": "a-mo.net",
    "name": "A MO",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 800,
    "domain": "dotomi.com",
    "name": "Dotomi",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 802,
    "domain": "newsblur.com",
    "name": "Newsblur",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 803,
    "domain": "abc.net.au",
    "name": "ABC",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 804,
    "domain": "filepursuit.com",
    "name": "Filepursuit",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 805,
    "domain": "yodo1.com",
    "name": "Yodo1",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 806,
    "domain": "bingapis.com",
    "name": "Bingapis",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 807,
    "domain": "hubspot.com",
    "name": "Hubspot",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 808,
    "domain": "nytimes.com",
    "name": "Nytimes",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 809,
    "domain": "heuristi.ca",
    "name": "Heuristi",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 812,
    "domain": "kakao.com",
    "name": "Kakao",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 813,
    "domain": "daum.net",
    "name": "Daum",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 815,
    "domain": "ahnlab.com",
    "name": "Ahnlab",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 819,
    "domain": "kgslb.com",
    "name": "Kgslb",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 820,
    "domain": "nexon.com",
    "name": "Nexon",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 821,
    "domain": "nheos.com",
    "name": "Nheos",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 822,
    "domain": "navercorp.com",
    "name": "Navercorp",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 823,
    "domain": "coupang.com",
    "name": "Coupang",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 824,
    "domain": "pinklander.com",
    "name": "Pinklander",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 825,
    "domain": "afreecatv.com",
    "name": "Afreecatv",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 826,
    "domain": "fmkorea.com",
    "name": "Fmkorea",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 827,
    "domain": "toss.im",
    "name": "Toss",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 828,
    "domain": "dcinside.com",
    "name": "Dcinside",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 829,
    "domain": "riotgames.com",
    "name": "Riotgames",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 830,
    "domain": "tynt.com",
    "name": "Tynt",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 831,
    "domain": "appier.net",
    "name": "Appier",
    "category": "Servicios web",
    "rating": "C",
    "score": 58,
    "location": "Global"
  },
  {
    "rank": 834,
    "domain": "toast.com",
    "name": "Toast",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 835,
    "domain": "s-onetag.com",
    "name": "S Onetag",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 838,
    "domain": "edgesuite.net",
    "name": "Edgesuite",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 841,
    "domain": "kaavefali.com",
    "name": "Kaavefali",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 842,
    "domain": "transsion-os.com",
    "name": "Transsion OS",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 843,
    "domain": "more.buzz",
    "name": "More",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 844,
    "domain": "boomplaymusic.com",
    "name": "Boomplaymusic",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 846,
    "domain": "adobedtm.com",
    "name": "Adobedtm",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 852,
    "domain": "tawk.to",
    "name": "Tawk",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 853,
    "domain": "pusher.com",
    "name": "Pusher",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 859,
    "domain": "inbox.lv",
    "name": "Inbox",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 862,
    "domain": "dishanywhere.com",
    "name": "Dishanywhere",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 864,
    "domain": "fortinet.net",
    "name": "Fortinet",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 865,
    "domain": "surfsharkstatus.com",
    "name": "Surfsharkstatus",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 866,
    "domain": "dashlane.com",
    "name": "Dashlane",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 867,
    "domain": "hotmail.com",
    "name": "Hotmail",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 868,
    "domain": "dailymotion.com",
    "name": "Dailymotion",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 869,
    "domain": "verisign.com",
    "name": "Verisign",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 871,
    "domain": "admixer.net",
    "name": "Admixer",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 873,
    "domain": "sentinelone.net",
    "name": "Sentinelone",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 874,
    "domain": "onlymonster.ai",
    "name": "Onlymonster",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 875,
    "domain": "pendo.io",
    "name": "Pendo",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 876,
    "domain": "onlyfans.com",
    "name": "Onlyfans",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 878,
    "domain": "appboy.com",
    "name": "Appboy",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 882,
    "domain": "moengage.com",
    "name": "Moengage",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 883,
    "domain": "tlivepush.com",
    "name": "Tlivepush",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 884,
    "domain": "myqcloud.com",
    "name": "Myqcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 885,
    "domain": "toponadss.com",
    "name": "Toponadss",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 889,
    "domain": "bagankeyboard.com",
    "name": "Bagankeyboard",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 890,
    "domain": "amplreq.com",
    "name": "Amplreq",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 891,
    "domain": "baganads.com",
    "name": "Baganads",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 892,
    "domain": "mytel.com.mm",
    "name": "Mytel",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 893,
    "domain": "cust-service.com",
    "name": "Cust Service",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 894,
    "domain": "kbzpay.com",
    "name": "Kbzpay",
    "category": "Finanzas",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 897,
    "domain": "contentexchange.me",
    "name": "Contentexchange",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 899,
    "domain": "khanbank.com",
    "name": "Khanbank",
    "category": "Finanzas",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 900,
    "domain": "joinhoney.com",
    "name": "Joinhoney",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 902,
    "domain": "ezmob.com",
    "name": "Ezmob",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 903,
    "domain": "eu.org",
    "name": "EU",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 904,
    "domain": "desync.com",
    "name": "Desync",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 905,
    "domain": "dler.org",
    "name": "Dler",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 906,
    "domain": "stealth.si",
    "name": "Stealth",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 907,
    "domain": "i2p.rocks",
    "name": "I2p",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 908,
    "domain": "internetwarriors.net",
    "name": "Internetwarriors",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 909,
    "domain": "explodie.org",
    "name": "Explodie",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 910,
    "domain": "opentrackr.org",
    "name": "Opentrackr",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 911,
    "domain": "harry.lu",
    "name": "Harry",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 912,
    "domain": "rarbg.me",
    "name": "Rarbg",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 916,
    "domain": "tiny-vps.com",
    "name": "Tiny VPS",
    "category": "Servicios web",
    "rating": "C",
    "score": 57,
    "location": "Global"
  },
  {
    "rank": 917,
    "domain": "tailscale.com",
    "name": "Tailscale",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 918,
    "domain": "godaddy.com",
    "name": "Godaddy",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 919,
    "domain": "openbittorrent.com",
    "name": "Openbittorrent",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 920,
    "domain": "opentor.org",
    "name": "Opentor",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 921,
    "domain": "iptvprivateserver.ru",
    "name": "Iptvprivateserver",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 923,
    "domain": "agip.gob.ar",
    "name": "GOB",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 924,
    "domain": "samsungelectronics.com",
    "name": "Samsungelectronics",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 925,
    "domain": "ipvanish.com",
    "name": "Ipvanish",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 926,
    "domain": "onlineradiobox.com",
    "name": "Onlineradiobox",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 928,
    "domain": "me.com",
    "name": "ME",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 929,
    "domain": "amazonvideo.com",
    "name": "Amazonvideo",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 931,
    "domain": "swannsecurity.com",
    "name": "Swannsecurity",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 932,
    "domain": "grafana.com",
    "name": "Grafana",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 933,
    "domain": "loc.gov",
    "name": "LOC",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 934,
    "domain": "mobdro.sc",
    "name": "Mobdro",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 935,
    "domain": "mookie1.com",
    "name": "Mookie1",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 936,
    "domain": "nrk.no",
    "name": "NRK",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 937,
    "domain": "hermes.com",
    "name": "Hermes",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 938,
    "domain": "elfhosted.com",
    "name": "Elfhosted",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 939,
    "domain": "cornfused.org",
    "name": "Cornfused",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 940,
    "domain": "smaato.net",
    "name": "Smaato",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 941,
    "domain": "bhaskar.com",
    "name": "Bhaskar",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 942,
    "domain": "telegraph.co.uk",
    "name": "Telegraph",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 943,
    "domain": "ultimatestremioaddons.club",
    "name": "Ultimatestremioaddons",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 944,
    "domain": "6sc.co",
    "name": "6sc",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 945,
    "domain": "webshare.io",
    "name": "Webshare",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 946,
    "domain": "abracadabra.ag",
    "name": "Abracadabra",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 947,
    "domain": "wordpress.com",
    "name": "Wordpress",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 948,
    "domain": "luckyblock.cc",
    "name": "Luckyblock",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 949,
    "domain": "leboncoin.fr",
    "name": "Leboncoin",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 951,
    "domain": "goskope.com",
    "name": "Goskope",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 957,
    "domain": "l-frii.com",
    "name": "L Frii",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 958,
    "domain": "flat-ads.com",
    "name": "Flat ADS",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 960,
    "domain": "opayweb.com",
    "name": "Opayweb",
    "category": "Finanzas",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 963,
    "domain": "vg.no",
    "name": "VG",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 966,
    "domain": "schibsted.io",
    "name": "Schibsted",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 967,
    "domain": "finn.no",
    "name": "Finn",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 969,
    "domain": "api.no",
    "name": "API",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 970,
    "domain": "medietall.no",
    "name": "Medietall",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 971,
    "domain": "vgc.no",
    "name": "VGC",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 972,
    "domain": "tns-cs.net",
    "name": "TNS CS",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 974,
    "domain": "omitech.site",
    "name": "Omitech",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 975,
    "domain": "hamropatro.com",
    "name": "Hamropatro",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 976,
    "domain": "msauth.net",
    "name": "Msauth",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 978,
    "domain": "paloaltonetworks.com",
    "name": "Paloaltonetworks",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 979,
    "domain": "westpac.com.au",
    "name": "Westpac",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 980,
    "domain": "foxsports.com.au",
    "name": "Foxsports",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 981,
    "domain": "server-cpanel.com",
    "name": "Server Cpanel",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 982,
    "domain": "netsuite.com",
    "name": "Netsuite",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 983,
    "domain": "dell.com",
    "name": "Dell",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 985,
    "domain": "poki.com",
    "name": "Poki",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 986,
    "domain": "1drv.com",
    "name": "1drv",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 987,
    "domain": "workforceready.com.au",
    "name": "Workforceready",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 988,
    "domain": "azure-devices.net",
    "name": "Azure Devices",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 989,
    "domain": "sophosupd.com",
    "name": "Sophosupd",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 994,
    "domain": "likeimo.site",
    "name": "Likeimo",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 998,
    "domain": "daraz.pk",
    "name": "Daraz",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 999,
    "domain": "forter.com",
    "name": "Forter",
    "category": "Servicios web",
    "rating": "C",
    "score": 56,
    "location": "Global"
  },
  {
    "rank": 1003,
    "domain": "mynt.xyz",
    "name": "Mynt",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1006,
    "domain": "hp.com",
    "name": "HP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1009,
    "domain": "onet.pl",
    "name": "Onet",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1010,
    "domain": "wp.pl",
    "name": "WP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1011,
    "domain": "pushpushgo.com",
    "name": "Pushpushgo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1012,
    "domain": "allegro.pl",
    "name": "Allegro",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1014,
    "domain": "pandora.com",
    "name": "Pandora",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1016,
    "domain": "sapo.pt",
    "name": "Sapo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1020,
    "domain": "sc-prod.net",
    "name": "SC Prod",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1022,
    "domain": "xhamster.com",
    "name": "Xhamster",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1025,
    "domain": "my.com",
    "name": "MY",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1026,
    "domain": "mradx.net",
    "name": "Mradx",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1027,
    "domain": "avito.ru",
    "name": "Avito",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1028,
    "domain": "tinkoff.ru",
    "name": "Tinkoff",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1030,
    "domain": "sberbank.ru",
    "name": "Sberbank",
    "category": "Finanzas",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1031,
    "domain": "ozon.ru",
    "name": "Ozon",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1032,
    "domain": "tns-counter.ru",
    "name": "TNS Counter",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1035,
    "domain": "plmlm.com",
    "name": "Plmlm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1036,
    "domain": "musiclike.top",
    "name": "Musiclike",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1037,
    "domain": "snaptube.app",
    "name": "Snaptube",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1038,
    "domain": "accuweather.com",
    "name": "Accuweather",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1039,
    "domain": "rethinkad.com",
    "name": "Rethinkad",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1040,
    "domain": "lookep.com",
    "name": "Lookep",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1041,
    "domain": "al-hiwar.com",
    "name": "AL Hiwar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1043,
    "domain": "wave.com",
    "name": "Wave",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1046,
    "domain": "webrootcloudav.com",
    "name": "Webrootcloudav",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1050,
    "domain": "msvdn.net",
    "name": "Msvdn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1053,
    "domain": "konami.net",
    "name": "Konami",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1054,
    "domain": "ibytedtos.com",
    "name": "Ibytedtos",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1057,
    "domain": "rtp.pt",
    "name": "RTP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1058,
    "domain": "blogger.com",
    "name": "Blogger",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1061,
    "domain": "gravatar.com",
    "name": "Gravatar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1062,
    "domain": "samsungosp.com",
    "name": "Samsungosp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1064,
    "domain": "scopely.io",
    "name": "Scopely",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1068,
    "domain": "zoznam.sk",
    "name": "Zoznam",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1073,
    "domain": "svt.se",
    "name": "SVT",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1074,
    "domain": "a2d.tv",
    "name": "A2d",
    "category": "Vídeo",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1075,
    "domain": "applvn.com",
    "name": "Applvn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1076,
    "domain": "sgsnssdk.com",
    "name": "Sgsnssdk",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1077,
    "domain": "anticheatexpert.com",
    "name": "Anticheatexpert",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1078,
    "domain": "letspartystar.com",
    "name": "Letspartystar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1079,
    "domain": "pullcf.com",
    "name": "Pullcf",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1084,
    "domain": "somon.tj",
    "name": "Somon",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1086,
    "domain": "vigo.software",
    "name": "Vigo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1088,
    "domain": "linkmessenger.me",
    "name": "Linkmessenger",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1089,
    "domain": "nicehash.com",
    "name": "Nicehash",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1090,
    "domain": "adblockplus.org",
    "name": "Adblockplus",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1091,
    "domain": "fwupd.org",
    "name": "Fwupd",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1092,
    "domain": "ntp-servers.net",
    "name": "NTP Servers",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1093,
    "domain": "e-msedge.net",
    "name": "E Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1094,
    "domain": "cityline.com",
    "name": "Cityline",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1095,
    "domain": "fontawesome.com",
    "name": "Fontawesome",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1097,
    "domain": "revopush.com",
    "name": "Revopush",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1098,
    "domain": "githubusercontent.com",
    "name": "Githubusercontent",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1099,
    "domain": "lesta.ru",
    "name": "Lesta",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1100,
    "domain": "meraki.com",
    "name": "Meraki",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1102,
    "domain": "affinity.net",
    "name": "Affinity",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1104,
    "domain": "omnitagjs.com",
    "name": "Omnitagjs",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1107,
    "domain": "pvp.net",
    "name": "PVP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1109,
    "domain": "gaterelay.com",
    "name": "Gaterelay",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1110,
    "domain": "wxrly.top",
    "name": "Wxrly",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1113,
    "domain": "hinet.net",
    "name": "Hinet",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1116,
    "domain": "adtelligent.com",
    "name": "Adtelligent",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1118,
    "domain": "idealmedia.io",
    "name": "Idealmedia",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1119,
    "domain": "ukr.net",
    "name": "UKR",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1121,
    "domain": "firebaseio.com",
    "name": "Firebaseio",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1122,
    "domain": "vivint.ai",
    "name": "Vivint",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1123,
    "domain": "moatads.com",
    "name": "Moatads",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1125,
    "domain": "uzum.uz",
    "name": "Uzum",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1128,
    "domain": "ebay.com",
    "name": "Ebay",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1130,
    "domain": "vidoomy.com",
    "name": "Vidoomy",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1132,
    "domain": "zalo.me",
    "name": "Zalo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1133,
    "domain": "zdn.vn",
    "name": "ZDN",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1134,
    "domain": "zadn.vn",
    "name": "Zadn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1135,
    "domain": "zaloapp.com",
    "name": "Zaloapp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1138,
    "domain": "zing.vn",
    "name": "Zing",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1139,
    "domain": "coccoc.com",
    "name": "Coccoc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1140,
    "domain": "garena.com",
    "name": "Garena",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1141,
    "domain": "threatseeker.com",
    "name": "Threatseeker",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1142,
    "domain": "xero.com",
    "name": "Xero",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1143,
    "domain": "coralogix.us",
    "name": "Coralogix",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1144,
    "domain": "domain.name",
    "name": "Domain",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1145,
    "domain": "loina.wf",
    "name": "Loina",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1146,
    "domain": "remotepc.com",
    "name": "Remotepc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1148,
    "domain": "emsisoft.com",
    "name": "Emsisoft",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1149,
    "domain": "idealpos.com.au",
    "name": "Idealpos",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1150,
    "domain": "platinumai.net",
    "name": "Platinumai",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1151,
    "domain": "vipre.com",
    "name": "Vipre",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1152,
    "domain": "ttapis.com",
    "name": "Ttapis",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1153,
    "domain": "tango.me",
    "name": "Tango",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1154,
    "domain": "partying.sg",
    "name": "Partying",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1155,
    "domain": "adsco.re",
    "name": "Adsco",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1156,
    "domain": "partyother.com",
    "name": "Partyother",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1159,
    "domain": "bidr.io",
    "name": "Bidr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1161,
    "domain": "azurefd.net",
    "name": "Azurefd",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1162,
    "domain": "armdb.org",
    "name": "Armdb",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1163,
    "domain": "amusnet.io",
    "name": "Amusnet",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1164,
    "domain": "crazyegg.com",
    "name": "Crazyegg",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1166,
    "domain": "farnell.com",
    "name": "Farnell",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1167,
    "domain": "duckduckgo.com",
    "name": "Duckduckgo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1168,
    "domain": "walmartimages.com",
    "name": "Walmartimages",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1169,
    "domain": "textbookrush.com",
    "name": "Textbookrush",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1171,
    "domain": "bldrdoc.gov",
    "name": "Bldrdoc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1172,
    "domain": "braze.com",
    "name": "Braze",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1173,
    "domain": "hpeprint.com",
    "name": "Hpeprint",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1174,
    "domain": "dexscreener.com",
    "name": "Dexscreener",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1175,
    "domain": "canalplustech.pro",
    "name": "Canalplustech",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1176,
    "domain": "wix.com",
    "name": "WIX",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1177,
    "domain": "steamcommunity.com",
    "name": "Steamcommunity",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1178,
    "domain": "samsungcloudsolution.net",
    "name": "Samsungcloudsolution",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1180,
    "domain": "revenuecat.com",
    "name": "Revenuecat",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1181,
    "domain": "sil.org",
    "name": "SIL",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1182,
    "domain": "grindr.mobi",
    "name": "Grindr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1184,
    "domain": "wootly.ch",
    "name": "Wootly",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1185,
    "domain": "bbrdbr.com",
    "name": "Bbrdbr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1186,
    "domain": "alibaba.com",
    "name": "Alibaba",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1187,
    "domain": "duolingo.com",
    "name": "Duolingo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1188,
    "domain": "dropboxusercontent.com",
    "name": "Dropboxusercontent",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1189,
    "domain": "sbixby.com",
    "name": "Sbixby",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1192,
    "domain": "sm.cn",
    "name": "SM",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1193,
    "domain": "cardinalcommerce.com",
    "name": "Cardinalcommerce",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1194,
    "domain": "ovh.net",
    "name": "OVH",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1196,
    "domain": "unmsapp.com",
    "name": "Unmsapp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1197,
    "domain": "anime-sama.me",
    "name": "Anime Sama",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1198,
    "domain": "krxd.net",
    "name": "Krxd",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1199,
    "domain": "kobotoolbox.org",
    "name": "Kobotoolbox",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1200,
    "domain": "weixin.download",
    "name": "Weixin",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1201,
    "domain": "aniview.com",
    "name": "Aniview",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1202,
    "domain": "etecsa.cu",
    "name": "Etecsa",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1203,
    "domain": "disqus.com",
    "name": "Disqus",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1204,
    "domain": "windscribe.com",
    "name": "Windscribe",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1205,
    "domain": "fritz.box",
    "name": "Fritz",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1206,
    "domain": "globalinterpark.com",
    "name": "Globalinterpark",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1207,
    "domain": "nist.gov",
    "name": "Nist",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1208,
    "domain": "branch.io",
    "name": "Branch",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1209,
    "domain": "ushareit.com",
    "name": "Ushareit",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1210,
    "domain": "tv.fo",
    "name": "TV",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1211,
    "domain": "aws.dev",
    "name": "AWS",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1212,
    "domain": "queue-it.net",
    "name": "Queue IT",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1213,
    "domain": "tkt.ge",
    "name": "TKT",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1214,
    "domain": "sky.com",
    "name": "SKY",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1217,
    "domain": "nssvc.net",
    "name": "Nssvc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1219,
    "domain": "besoccer.com",
    "name": "Besoccer",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1220,
    "domain": "hihonorcloud.com",
    "name": "Hihonorcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1221,
    "domain": "ajax.systems",
    "name": "Ajax",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1223,
    "domain": "sofascore.com",
    "name": "Sofascore",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1224,
    "domain": "split.io",
    "name": "Split",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1225,
    "domain": "strpst.com",
    "name": "Strpst",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1226,
    "domain": "jocelyn.beauty",
    "name": "Jocelyn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1227,
    "domain": "jolie.pics",
    "name": "Jolie",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1228,
    "domain": "marary.skin",
    "name": "Marary",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1229,
    "domain": "kotzting.com",
    "name": "Kotzting",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1230,
    "domain": "marjorie.pics",
    "name": "Marjorie",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1231,
    "domain": "adwised.com",
    "name": "Adwised",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1232,
    "domain": "laurren.icu",
    "name": "Laurren",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1234,
    "domain": "mediaad.org",
    "name": "Mediaad",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1235,
    "domain": "tapsell.ir",
    "name": "Tapsell",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1236,
    "domain": "jader.fun",
    "name": "Jader",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1238,
    "domain": "userway.org",
    "name": "Userway",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1239,
    "domain": "mako.co.il",
    "name": "Mako",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1240,
    "domain": "i-mobile.co.jp",
    "name": "I Mobile",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1241,
    "domain": "me2zengame.com",
    "name": "Me2zengame",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1243,
    "domain": "vidaahub.com",
    "name": "Vidaahub",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1244,
    "domain": "samsungmax.com",
    "name": "Samsungmax",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1245,
    "domain": "adcolony.com",
    "name": "Adcolony",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1246,
    "domain": "cinlemhed.top",
    "name": "Cinlemhed",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1247,
    "domain": "habboes.top",
    "name": "Habboes",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1248,
    "domain": "qnap.com",
    "name": "Qnap",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1249,
    "domain": "wooza.top",
    "name": "Wooza",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1251,
    "domain": "msftauth.net",
    "name": "Msftauth",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1252,
    "domain": "yellow-resultsbidder.com",
    "name": "Yellow Resultsbidder",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1254,
    "domain": "mob.com",
    "name": "MOB",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1257,
    "domain": "elk.zone",
    "name": "ELK",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1258,
    "domain": "youtubepi.com",
    "name": "Youtubepi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1259,
    "domain": "ymmobi.com",
    "name": "Ymmobi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1261,
    "domain": "quillbot.com",
    "name": "Quillbot",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1263,
    "domain": "hitomi.la",
    "name": "Hitomi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1264,
    "domain": "nsoft.cloud",
    "name": "Nsoft",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1265,
    "domain": "standardlesothobank.co.ls",
    "name": "Standardlesothobank",
    "category": "Finanzas",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1267,
    "domain": "unpkg.com",
    "name": "Unpkg",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1268,
    "domain": "opera-api2.com",
    "name": "Opera Api2",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1270,
    "domain": "bitmoji.com",
    "name": "Bitmoji",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1271,
    "domain": "codmwest.com",
    "name": "Codmwest",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1272,
    "domain": "dealerinspire.com",
    "name": "Dealerinspire",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1273,
    "domain": "tct-rom.com",
    "name": "TCT ROM",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1274,
    "domain": "agkn.com",
    "name": "Agkn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1275,
    "domain": "mxplay.com",
    "name": "Mxplay",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1276,
    "domain": "youngjoygame.com",
    "name": "Youngjoygame",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1277,
    "domain": "baganintel.com",
    "name": "Baganintel",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1279,
    "domain": "looktv.mn",
    "name": "Looktv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1280,
    "domain": "afferdmail.com",
    "name": "Afferdmail",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1281,
    "domain": "addslice.com",
    "name": "Addslice",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1282,
    "domain": "appsport.com",
    "name": "Appsport",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1283,
    "domain": "springboardcourses.ie",
    "name": "Springboardcourses",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1284,
    "domain": "barry.blog",
    "name": "Barry",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1285,
    "domain": "enterprise.com",
    "name": "Enterprise",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1286,
    "domain": "honeygain.com",
    "name": "Honeygain",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1288,
    "domain": "nypost.com",
    "name": "Nypost",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1289,
    "domain": "therealnews.com",
    "name": "Therealnews",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1290,
    "domain": "welt.de",
    "name": "Welt",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1291,
    "domain": "ok4.se",
    "name": "Ok4",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1293,
    "domain": "cedexis-test.com",
    "name": "Cedexis Test",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1294,
    "domain": "cbssports.cloud",
    "name": "Cbssports",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1295,
    "domain": "caribsurf.net",
    "name": "Caribsurf",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1296,
    "domain": "wwsga.me",
    "name": "Wwsga",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1297,
    "domain": "bytogeticr.com",
    "name": "Bytogeticr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1298,
    "domain": "britishairways.com",
    "name": "Britishairways",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1299,
    "domain": "bmi-system.com",
    "name": "BMI System",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1300,
    "domain": "baplc.com",
    "name": "Baplc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1301,
    "domain": "att.net",
    "name": "ATT",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1302,
    "domain": "ruckuswireless.com",
    "name": "Ruckuswireless",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1303,
    "domain": "samsungdm.com",
    "name": "Samsungdm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1304,
    "domain": "xmrig.com",
    "name": "Xmrig",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1305,
    "domain": "amung.us",
    "name": "Amung",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1306,
    "domain": "adrs.org.cn",
    "name": "Adrs",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1307,
    "domain": "video4k.cc",
    "name": "Video4k",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1309,
    "domain": "adobecces.com",
    "name": "Adobecces",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1310,
    "domain": "heroku.com",
    "name": "Heroku",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1311,
    "domain": "hgtv.com",
    "name": "Hgtv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1312,
    "domain": "intelegridapp.com",
    "name": "Intelegridapp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1313,
    "domain": "activision.com",
    "name": "Activision",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1314,
    "domain": "medscape.org",
    "name": "Medscape",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1315,
    "domain": "designmynight.com",
    "name": "Designmynight",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1316,
    "domain": "mnaspm.com",
    "name": "Mnaspm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1317,
    "domain": "tf1.fr",
    "name": "Tf1",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1318,
    "domain": "l-msedge.net",
    "name": "L Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1319,
    "domain": "byte-app.com",
    "name": "Byte APP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1320,
    "domain": "go-g3t-msg.com",
    "name": "GO G3t MSG",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1322,
    "domain": "buienradar.nl",
    "name": "Buienradar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1323,
    "domain": "home-assistant.io",
    "name": "Home Assistant",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1324,
    "domain": "xhamster1.desi",
    "name": "Xhamster1",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1325,
    "domain": "uisp.com",
    "name": "Uisp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1326,
    "domain": "mex.com.au",
    "name": "MEX",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1328,
    "domain": "nrl.com",
    "name": "NRL",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1329,
    "domain": "statuspage.io",
    "name": "Statuspage",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1330,
    "domain": "realestate.com.au",
    "name": "Realestate",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1331,
    "domain": "tamanu-nauru.org",
    "name": "Tamanu Nauru",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1332,
    "domain": "dailymail.co.uk",
    "name": "Dailymail",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1334,
    "domain": "xhdepot.site",
    "name": "Xhdepot",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1335,
    "domain": "dtvott.com",
    "name": "Dtvott",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1336,
    "domain": "lazada.com.ph",
    "name": "Lazada",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1337,
    "domain": "expressapisv2.net",
    "name": "Expressapisv2",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1338,
    "domain": "vidplay.online",
    "name": "Vidplay",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1339,
    "domain": "netgear.com",
    "name": "Netgear",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1340,
    "domain": "livescore.com",
    "name": "Livescore",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1341,
    "domain": "equinix.com",
    "name": "Equinix",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1342,
    "domain": "united.com",
    "name": "United",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1343,
    "domain": "bok-sd.com",
    "name": "BOK SD",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1345,
    "domain": "mediaset.net",
    "name": "Mediaset",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1346,
    "domain": "mxcontent.net",
    "name": "Mxcontent",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1349,
    "domain": "histats.com",
    "name": "Histats",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1350,
    "domain": "udmserve.net",
    "name": "Udmserve",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1351,
    "domain": "sitescout.com",
    "name": "Sitescout",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1352,
    "domain": "jwplayer.com",
    "name": "Jwplayer",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1354,
    "domain": "bugsnag.com",
    "name": "Bugsnag",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1355,
    "domain": "likeevideo.ru",
    "name": "Likeevideo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1356,
    "domain": "autodesk.com",
    "name": "Autodesk",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1357,
    "domain": "lefigaro.fr",
    "name": "Lefigaro",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1358,
    "domain": "smi2.net",
    "name": "Smi2",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1359,
    "domain": "adtwister.me",
    "name": "Adtwister",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1360,
    "domain": "snapcraft.io",
    "name": "Snapcraft",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1361,
    "domain": "auslgics.com",
    "name": "Auslgics",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1363,
    "domain": "tmgrup.com.tr",
    "name": "Tmgrup",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1365,
    "domain": "eyeo.com",
    "name": "Eyeo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1366,
    "domain": "brightcove.com",
    "name": "Brightcove",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1368,
    "domain": "arin.net",
    "name": "Arin",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1369,
    "domain": "syncthing.net",
    "name": "Syncthing",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1370,
    "domain": "cpanel.net",
    "name": "Cpanel",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1371,
    "domain": "enphaseenergy.com",
    "name": "Enphaseenergy",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1372,
    "domain": "watchguard.com",
    "name": "Watchguard",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1373,
    "domain": "superops.ai",
    "name": "Superops",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1374,
    "domain": "rustdesk.com",
    "name": "Rustdesk",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1375,
    "domain": "s-msedge.net",
    "name": "S Msedge",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1376,
    "domain": "mndsrv.com",
    "name": "Mndsrv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1377,
    "domain": "aopacloud.sg",
    "name": "Aopacloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1378,
    "domain": "xcoinsystem.com",
    "name": "Xcoinsystem",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1379,
    "domain": "dstv.com",
    "name": "Dstv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1382,
    "domain": "flashtalking.com",
    "name": "Flashtalking",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1383,
    "domain": "cloudapp.net",
    "name": "Cloudapp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1384,
    "domain": "jtvnw.net",
    "name": "Jtvnw",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1385,
    "domain": "msecnd.net",
    "name": "Msecnd",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1387,
    "domain": "blizzard.com",
    "name": "Blizzard",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1389,
    "domain": "walmart.com",
    "name": "Walmart",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1390,
    "domain": "oxylabs.io",
    "name": "Oxylabs",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1391,
    "domain": "prizepicks.com",
    "name": "Prizepicks",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1392,
    "domain": "v3rmillion.net",
    "name": "V3rmillion",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1393,
    "domain": "europcar.com",
    "name": "Europcar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1394,
    "domain": "liadm.com",
    "name": "Liadm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1395,
    "domain": "cricbuzz.com",
    "name": "Cricbuzz",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1396,
    "domain": "my3cx.fr",
    "name": "My3cx",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1397,
    "domain": "mexc.com",
    "name": "Mexc",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1398,
    "domain": "mocortech.com",
    "name": "Mocortech",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1399,
    "domain": "carriersignal.info",
    "name": "Carriersignal",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1400,
    "domain": "quickconnect.to",
    "name": "Quickconnect",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1401,
    "domain": "seneweb.com",
    "name": "Seneweb",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1402,
    "domain": "dahuap2pcloud.com",
    "name": "Dahuap2pcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1405,
    "domain": "visaonline.com",
    "name": "Visaonline",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1406,
    "domain": "swift.com",
    "name": "Swift",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1407,
    "domain": "anythinktech.com",
    "name": "Anythinktech",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1408,
    "domain": "rainberrytv.com",
    "name": "Rainberrytv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1410,
    "domain": "jw.org",
    "name": "JW",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1412,
    "domain": "digitalobjects.co.nz",
    "name": "Digitalobjects",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1413,
    "domain": "tamanubeach.com",
    "name": "Tamanubeach",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1415,
    "domain": "nanoleaf.me",
    "name": "Nanoleaf",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1416,
    "domain": "garenanow.com",
    "name": "Garenanow",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1419,
    "domain": "kenyancupid.com",
    "name": "Kenyancupid",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1420,
    "domain": "hentaifox.com",
    "name": "Hentaifox",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1421,
    "domain": "addthis.com",
    "name": "Addthis",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1423,
    "domain": "atelierfoundiboina.com",
    "name": "Atelierfoundiboina",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1424,
    "domain": "bbwcupid.com",
    "name": "Bbwcupid",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1425,
    "domain": "bentomanga.com",
    "name": "Bentomanga",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1427,
    "domain": "frscan.ws",
    "name": "Frscan",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1428,
    "domain": "hachirumi.com",
    "name": "Hachirumi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1429,
    "domain": "hwtmanga.com",
    "name": "Hwtmanga",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1430,
    "domain": "iconify.design",
    "name": "Iconify",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1431,
    "domain": "juicyads.com",
    "name": "Juicyads",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1432,
    "domain": "leak.xxx",
    "name": "Leak",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1433,
    "domain": "likemanga.io",
    "name": "Likemanga",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1434,
    "domain": "mangadistrict.com",
    "name": "Mangadistrict",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1435,
    "domain": "mangahentai.me",
    "name": "Mangahentai",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1436,
    "domain": "mangakio.com",
    "name": "Mangakio",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1437,
    "domain": "mangamaniacs.org",
    "name": "Mangamaniacs",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1438,
    "domain": "mangas-origines.xyz",
    "name": "Mangas Origines",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1439,
    "domain": "mgeko.com",
    "name": "Mgeko",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1440,
    "domain": "openathens.net",
    "name": "Openathens",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1444,
    "domain": "quranicaudio.com",
    "name": "Quranicaudio",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1445,
    "domain": "scan-vf.net",
    "name": "Scan VF",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1446,
    "domain": "sddan.com",
    "name": "Sddan",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1447,
    "domain": "shamtick.com",
    "name": "Shamtick",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1448,
    "domain": "sharmadthworld.in",
    "name": "Sharmadthworld",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1449,
    "domain": "streamyard.com",
    "name": "Streamyard",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1450,
    "domain": "taxismaned.top",
    "name": "Taxismaned",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1451,
    "domain": "terabigyellowmotha.info",
    "name": "Terabigyellowmotha",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1452,
    "domain": "tri.media",
    "name": "TRI",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1453,
    "domain": "undertone.com",
    "name": "Undertone",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1454,
    "domain": "vlereader.com",
    "name": "Vlereader",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1456,
    "domain": "travelocity.com",
    "name": "Travelocity",
    "category": "Viajes",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1457,
    "domain": "callofduty.com",
    "name": "Callofduty",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1458,
    "domain": "codefi.network",
    "name": "Codefi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1459,
    "domain": "gos-gsp.io",
    "name": "GOS GSP",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1460,
    "domain": "shrkar.com",
    "name": "Shrkar",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1461,
    "domain": "hellay.net",
    "name": "Hellay",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1462,
    "domain": "tapjoy.com",
    "name": "Tapjoy",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1464,
    "domain": "indazn.com",
    "name": "Indazn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1466,
    "domain": "ubi.com",
    "name": "UBI",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1467,
    "domain": "fughm.com",
    "name": "Fughm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1469,
    "domain": "josephine.fun",
    "name": "Josephine",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1470,
    "domain": "linnda.beauty",
    "name": "Linnda",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1471,
    "domain": "lilliane.autos",
    "name": "Lilliane",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1474,
    "domain": "bronze.systems",
    "name": "Bronze",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1475,
    "domain": "beeper-tools.com",
    "name": "Beeper Tools",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1476,
    "domain": "cell.com",
    "name": "Cell",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1477,
    "domain": "iask.ai",
    "name": "Iask",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1478,
    "domain": "mmstat.com",
    "name": "Mmstat",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1479,
    "domain": "fastly-edge.com",
    "name": "Fastly Edge",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1480,
    "domain": "samba.tv",
    "name": "Samba",
    "category": "Vídeo",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1482,
    "domain": "intercomassets.com",
    "name": "Intercomassets",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1483,
    "domain": "gfx.ms",
    "name": "GFX",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1484,
    "domain": "mdakky.com",
    "name": "Mdakky",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1486,
    "domain": "forlumineoner.com",
    "name": "Forlumineoner",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1487,
    "domain": "myvideos.club",
    "name": "Myvideos",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1488,
    "domain": "ohchr.org",
    "name": "Ohchr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1489,
    "domain": "pushflow.net",
    "name": "Pushflow",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1490,
    "domain": "rnz.co.nz",
    "name": "RNZ",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1491,
    "domain": "chatgpt.com",
    "name": "Chatgpt",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1492,
    "domain": "rtbadsmylive.com",
    "name": "Rtbadsmylive",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1493,
    "domain": "bluekai.com",
    "name": "Bluekai",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1494,
    "domain": "bestcontentfee.top",
    "name": "Bestcontentfee",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1495,
    "domain": "wpshsdk.com",
    "name": "Wpshsdk",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1496,
    "domain": "xg4ken.com",
    "name": "Xg4ken",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1497,
    "domain": "webrootanywhere.com",
    "name": "Webrootanywhere",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1498,
    "domain": "emb-api.com",
    "name": "EMB API",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1500,
    "domain": "booking.com",
    "name": "Booking",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1501,
    "domain": "statsig.com",
    "name": "Statsig",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1503,
    "domain": "ce.it",
    "name": "CE",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1505,
    "domain": "unrealengine.com",
    "name": "Unrealengine",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1506,
    "domain": "cryptobrowser.site",
    "name": "Cryptobrowser",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1507,
    "domain": "kargo.com",
    "name": "Kargo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1508,
    "domain": "habby.mobi",
    "name": "Habby",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1509,
    "domain": "ntp-fireos.com",
    "name": "NTP Fireos",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1511,
    "domain": "svc.ms",
    "name": "SVC",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1512,
    "domain": "seek.com.au",
    "name": "Seek",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1513,
    "domain": "oracle.com",
    "name": "Oracle",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1516,
    "domain": "mmechocaptiveportal.com",
    "name": "Mmechocaptiveportal",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1517,
    "domain": "sectigo.com",
    "name": "Sectigo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1518,
    "domain": "aninterestinghole.xyz",
    "name": "Aninterestinghole",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1520,
    "domain": "vod1adly.com",
    "name": "Vod1adly",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1521,
    "domain": "onetrust.com",
    "name": "Onetrust",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1522,
    "domain": "bit.ly",
    "name": "BIT",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1523,
    "domain": "sme.sk",
    "name": "SME",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1524,
    "domain": "rtvslo.si",
    "name": "Rtvslo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1526,
    "domain": "jquery.com",
    "name": "Jquery",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1527,
    "domain": "amnew.net",
    "name": "Amnew",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1528,
    "domain": "mndlvr.com",
    "name": "Mndlvr",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1529,
    "domain": "samsungknox.com",
    "name": "Samsungknox",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1530,
    "domain": "exp-tas.com",
    "name": "EXP TAS",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1531,
    "domain": "swiftserve.com",
    "name": "Swiftserve",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1532,
    "domain": "canal-plus.com",
    "name": "Canal Plus",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1533,
    "domain": "serving-sys.com",
    "name": "Serving SYS",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1534,
    "domain": "classdojo.com",
    "name": "Classdojo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1535,
    "domain": "aftonbladet.se",
    "name": "Aftonbladet",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1536,
    "domain": "symcb.com",
    "name": "Symcb",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1537,
    "domain": "docker.com",
    "name": "Docker",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1538,
    "domain": "vans.com",
    "name": "Vans",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1539,
    "domain": "onliner.by",
    "name": "Onliner",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1540,
    "domain": "quickheal.com",
    "name": "Quickheal",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1541,
    "domain": "deepl.com",
    "name": "Deepl",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1542,
    "domain": "zhihu.com",
    "name": "Zhihu",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1543,
    "domain": "trellix.com",
    "name": "Trellix",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1544,
    "domain": "tapad.com",
    "name": "Tapad",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1545,
    "domain": "qualcomm.com",
    "name": "Qualcomm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1546,
    "domain": "readergen.fr",
    "name": "Readergen",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1547,
    "domain": "a-ads.com",
    "name": "A ADS",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1548,
    "domain": "spamhaus.org",
    "name": "Spamhaus",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1549,
    "domain": "steamcontent.com",
    "name": "Steamcontent",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1550,
    "domain": "centrum.cz",
    "name": "Centrum",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1551,
    "domain": "wzrkt.com",
    "name": "Wzrkt",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1552,
    "domain": "userreport.com",
    "name": "Userreport",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1554,
    "domain": "dynamicyield.com",
    "name": "Dynamicyield",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1555,
    "domain": "statsigapi.net",
    "name": "Statsigapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1556,
    "domain": "instructure.com",
    "name": "Instructure",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1557,
    "domain": "bog.ge",
    "name": "BOG",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1561,
    "domain": "gouv.fr",
    "name": "Gouv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1563,
    "domain": "limericker.com",
    "name": "Limericker",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1564,
    "domain": "nancie.beauty",
    "name": "Nancie",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1565,
    "domain": "mytimeline-news.com",
    "name": "Mytimeline News",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1566,
    "domain": "hulabap.top",
    "name": "Hulabap",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1567,
    "domain": "researchgate.net",
    "name": "Researchgate",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1568,
    "domain": "hentaicams.xxx",
    "name": "Hentaicams",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1569,
    "domain": "pushub.net",
    "name": "Pushub",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1570,
    "domain": "rayjump.com",
    "name": "Rayjump",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1571,
    "domain": "pushapi.online",
    "name": "Pushapi",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1572,
    "domain": "cloudflarestatus.com",
    "name": "Cloudflarestatus",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1573,
    "domain": "atlassian.com",
    "name": "Atlassian",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1574,
    "domain": "microsoftapp.net",
    "name": "Microsoftapp",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1575,
    "domain": "drmgms.com",
    "name": "Drmgms",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1576,
    "domain": "amp-endpoint2.com",
    "name": "AMP Endpoint2",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1577,
    "domain": "aircanada.com",
    "name": "Aircanada",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1578,
    "domain": "usabilla.com",
    "name": "Usabilla",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1580,
    "domain": "indiatimes.com",
    "name": "Indiatimes",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1581,
    "domain": "aimtell.com",
    "name": "Aimtell",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1583,
    "domain": "b2w.digital",
    "name": "B2w",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1584,
    "domain": "bazaarvoice.com",
    "name": "Bazaarvoice",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1587,
    "domain": "homecu.net",
    "name": "Homecu",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1588,
    "domain": "honey.io",
    "name": "Honey",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1589,
    "domain": "jwpltx.com",
    "name": "Jwpltx",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1590,
    "domain": "jwpsrv.com",
    "name": "Jwpsrv",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1591,
    "domain": "kwaixiaodian.com",
    "name": "Kwaixiaodian",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1593,
    "domain": "mexiconewsdaily.com",
    "name": "Mexiconewsdaily",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1594,
    "domain": "postrelease.com",
    "name": "Postrelease",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1595,
    "domain": "privacy-mgmt.com",
    "name": "Privacy Mgmt",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1596,
    "domain": "shopify.com",
    "name": "Shopify",
    "category": "Compras",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1597,
    "domain": "solvvy.com",
    "name": "Solvvy",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1598,
    "domain": "the-ozone-project.com",
    "name": "THE Ozone Project",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1599,
    "domain": "turn.com",
    "name": "Turn",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1600,
    "domain": "contentsquare.net",
    "name": "Contentsquare",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1604,
    "domain": "msg-csw-lenovo.com",
    "name": "MSG CSW Lenovo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1607,
    "domain": "bromium-online.com",
    "name": "Bromium Online",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1608,
    "domain": "adition.com",
    "name": "Adition",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1609,
    "domain": "isappcloud.com",
    "name": "Isappcloud",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1610,
    "domain": "connatix.com",
    "name": "Connatix",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1611,
    "domain": "spribegaming.com",
    "name": "Spribegaming",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1612,
    "domain": "rambler.ru",
    "name": "Rambler",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1614,
    "domain": "binance.com",
    "name": "Binance",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1616,
    "domain": "linkm.me",
    "name": "Linkm",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1617,
    "domain": "icq.net",
    "name": "ICQ",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1619,
    "domain": "rozetka.com.ua",
    "name": "Rozetka",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1621,
    "domain": "slackb.com",
    "name": "Slackb",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1622,
    "domain": "adobelogin.com",
    "name": "Adobelogin",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1624,
    "domain": "paf.com",
    "name": "PAF",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1625,
    "domain": "identrust.com",
    "name": "Identrust",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1626,
    "domain": "briox.services",
    "name": "Briox",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1627,
    "domain": "bannerflow.com",
    "name": "Bannerflow",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1628,
    "domain": "slack-edge.com",
    "name": "Slack Edge",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1629,
    "domain": "onetag-sys.com",
    "name": "Onetag SYS",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1630,
    "domain": "1cloudhost.net",
    "name": "1cloudhost",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1631,
    "domain": "hln.be",
    "name": "HLN",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1633,
    "domain": "tunnelbear.com",
    "name": "Tunnelbear",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1634,
    "domain": "victronenergy.com",
    "name": "Victronenergy",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1635,
    "domain": "snigelweb.com",
    "name": "Snigelweb",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1636,
    "domain": "firewalla.com",
    "name": "Firewalla",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  },
  {
    "rank": 1638,
    "domain": "weibo.com",
    "name": "Weibo",
    "category": "Servicios web",
    "rating": "C",
    "score": 55,
    "location": "Global"
  }
];

const catalogServices = rankedProviders.map((provider, index) => {
  const template = cloneValue(templateByRating[provider.rating] || servicesMock[index % servicesMock.length]);
  const trackerCount = Array.isArray(template.trackers) ? template.trackers.length : template.trackerCount || 0;
  const thirdPartyCount = Array.isArray(template.trackers)
    ? new Set(template.trackers.map((item) => item.company || item.name)).size
    : template.thirdPartyCount || 0;

  return {
    ...template,
    _id: slugify(`${provider.name}-${provider.domain}`),
    rank: provider.rank,
    name: provider.name,
    domain: provider.domain,
    category: provider.category,
    rating: provider.rating,
    score: provider.score,
    location: provider.location,
    reviewStatus: `Catálogo · top ${provider.rank}`,
    updatedAt: "2026-04-14T18:30:00.000Z",
    tagline: makeTagline(provider.name, provider.category),
    summary: makeSummary(provider.name, provider.category, provider.rating),
    privacyHighlights: makeHighlights(provider.category, provider.rating, provider.name),
    policyLinks: makePolicyLinks(provider.domain),
    trackerCount,
    thirdPartyCount,
  };
});

export { catalogServices };
export default catalogServices;

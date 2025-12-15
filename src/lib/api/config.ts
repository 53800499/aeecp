/** @format */

// Configuration de l'API backend
export const API_CONFIG = {
  // URL de base de l'API backend
  // Vous pouvez utiliser une variable d'environnement ou une valeur par défaut
  // Selon la documentation backend: http://localhost:3000 (sans /api car les endpoints commencent déjà par /auth, /students, etc.)
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 30000 // 30 secondes
};

// Fonction utilitaire pour construire l'URL complète
export const getApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.baseURL.endsWith("/")
    ? API_CONFIG.baseURL.slice(0, -1)
    : API_CONFIG.baseURL;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};


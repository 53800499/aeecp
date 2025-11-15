/** @format */

export const APP_NAME = "Dashboard Financier";

export const COLORS = {
  primary: "#6366F1", // Indigo
  secondary: "#8B5CF6", // Purple
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  chart: {
    blue: "#6366F1",
    purple: "#8B5CF6",
    cyan: "#06B6D4",
    orange: "#F97316",
    pink: "#EC4899"
  }
};

export const ROUTES = {
  DASHBOARD: "/",
  ETUDIANTS: "/etudiants",
  RESIDENCE: "/residence",
  COTISATIONS: "/cotisations",
  DONS: "/dons",
  DEPENSES: "/depenses",
  RAPPORTS: "/rapports",
  PARAMETRES: "/parametres"
} as const;

export const DATE_FORMAT = "dd/MM/yyyy";
export const CURRENCY = "FCFA";

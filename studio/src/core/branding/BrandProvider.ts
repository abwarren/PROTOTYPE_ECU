// BrandProvider — single source of branding truth
// No UI component imports branding assets directly.
// See ADR-0001, ADR-0004, QA-019.
//
// Loads branding from branding/brand.json (served from Vite public/ dir
// in dev, bundled into Tauri dist/ in production).

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  error: string;
  warning: string;
  success: string;
}

export interface BrandConfig {
  productName: string;
  productShortName: string;
  productVersion: string;
  companyName: string;
  companyUrl: string;
  copyright: string;
  windowTitle: string;
  colors: BrandColors;
  logoPath: string;
  iconPath: string;
  splashPath: string;
}

let brandConfig: BrandConfig | null = null;

export async function loadBrandConfig(): Promise<BrandConfig> {
  if (brandConfig) return brandConfig;

  try {
    // This path resolves:
    // - During dev: from Vite public/ directory at /branding/brand.json
    // - During prod: from Tauri bundled dist/
    const res = await fetch("/branding/brand.json");
    const data = await res.json();

    const brand = data.brand ?? {};
    const studio = data.studio ?? {};
    const theme = data.theme?.dark ?? {};

    brandConfig = {
      productName: brand.product_name ?? "ECU Platform Core",
      productShortName: brand.product_short_name ?? "Core",
      productVersion: brand.product_version ?? "0.1.0-dev",
      companyName: brand.company_name ?? "ECU Platform",
      companyUrl: brand.company_url ?? "https://ecuplatform.com",
      copyright: brand.copyright ?? "Copyright ECU Platform",
      windowTitle: studio.window_title ?? brand.product_name + " Studio",
      colors: {
        primary: theme.primary ?? "#1a73e8",
        secondary: theme.secondary ?? "#0d47a1",
        accent: theme.accent ?? "#00bcd4",
        background: theme.background ?? "#121212",
        surface: theme.surface ?? "#1e1e1e",
        border: theme.border ?? "#333333",
        text: theme.text_primary ?? "#ffffff",
        textSecondary: theme.text_secondary ?? "#b0b0b0",
        error: theme.error ?? "#f44336",
        warning: theme.warning ?? "#ff9800",
        success: theme.success ?? "#4caf50",
      },
      logoPath: data.documentation?.logo_dark ?? "/branding/logos/logo.svg",
      iconPath: studio.icon_path ?? "/branding/icons/icon.svg",
      splashPath: studio.splash_screen_image ?? "/branding/splash/splash.png",
    };
    return brandConfig;
  } catch {
    // Fallback for dev mode when brand.json isn't accessible
    brandConfig = {
      productName: "ECU Platform Core",
      productShortName: "Core",
      productVersion: "0.1.0-dev",
      companyName: "ECU Platform",
      companyUrl: "https://ecuplatform.com",
      copyright: "Copyright ECU Platform",
      windowTitle: "ECU Platform Core Studio",
      colors: {
        primary: "#1a73e8",
        secondary: "#0d47a1",
        accent: "#00bcd4",
        background: "#121212",
        surface: "#1e1e1e",
        border: "#333333",
        text: "#ffffff",
        textSecondary: "#b0b0b0",
        error: "#f44336",
        warning: "#ff9800",
        success: "#4caf50",
      },
      logoPath: "",
      iconPath: "",
      splashPath: "",
    };
    return brandConfig;
  }
}

export function getBrand(): BrandConfig {
  if (!brandConfig) throw new Error("Brand not loaded. Call loadBrandConfig() first.");
  return brandConfig;
}

export function getBrandColors(): BrandColors {
  return getBrand().colors;
}

// React hook
import { useState, useEffect } from "react";

export function useBrand(): BrandConfig | null {
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  useEffect(() => {
    loadBrandConfig().then(setBrand);
  }, []);
  return brand;
}

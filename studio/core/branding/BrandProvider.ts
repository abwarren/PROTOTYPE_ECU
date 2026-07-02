// BrandProvider — single source of branding truth
// No UI component imports branding assets directly.
// See ADR-0001, ADR-0004, QA-019.

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
  colors: BrandColors;
  logoPath: string;
  iconPath: string;
  splashPath: string;
}

let brandConfig: BrandConfig | null = null;

export async function loadBrandConfig(): Promise<BrandConfig> {
  if (brandConfig) return brandConfig;

  try {
    const res = await fetch("/branding/brand.json");
    const data = await res.json();
    brandConfig = {
      productName: data.brand?.product_name ?? "7100CPT",
      productShortName: data.brand?.product_short_name ?? "ProtoECU",
      productVersion: data.brand?.product_version ?? "0.1.0-dev",
      companyName: data.brand?.company_name ?? "ECU Platform",
      companyUrl: data.brand?.company_url ?? "https://ecuplatform.com",
      copyright: data.brand?.copyright ?? "Copyright ECU Platform",
      colors: {
        primary: data.theme?.dark?.primary_color ?? "#58a6ff",
        secondary: data.theme?.dark?.secondary_color ?? "#3fb950",
        accent: data.theme?.dark?.accent_color ?? "#d2991d",
        background: "#0d1117",
        surface: "#161b22",
        border: "#30363d",
        text: "#e6edf3",
        textSecondary: "#8b949e",
        error: "#f85149",
        warning: "#d2991d",
        success: "#3fb950",
      },
      logoPath: "/branding/logos/logo.svg",
      iconPath: "/branding/icons/icon.svg",
      splashPath: "/branding/splash/splash.png",
    };
    return brandConfig;
  } catch {
    // Fallback for dev mode when brand.json isn't accessible
    brandConfig = {
      productName: "7100CPT",
      productShortName: "ProtoECU",
      productVersion: "0.1.0-dev",
      companyName: "ECU Platform",
      companyUrl: "https://ecuplatform.com",
      copyright: "Copyright ECU Platform",
      colors: {
        primary: "#58a6ff",
        secondary: "#3fb950",
        accent: "#d2991d",
        background: "#0d1117",
        surface: "#161b22",
        border: "#30363d",
        text: "#e6edf3",
        textSecondary: "#8b949e",
        error: "#f85149",
        warning: "#d2991d",
        success: "#3fb950",
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

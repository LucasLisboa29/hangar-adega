import type { MetadataRoute } from "next";

// Web App Manifest (Next gera /manifest.webmanifest e linka no <head>).
// Habilita "adicionar à tela inicial" com a identidade dourado/preto da Hangar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hangar Bebidas",
    short_name: "Hangar",
    description:
      "Adega e conveniência com entrega em Uberlândia e Araguari. Peça pelo catálogo online.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#141414",
    theme_color: "#141414",
    categories: ["shopping", "food"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

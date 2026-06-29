"use client";

import { useEffect } from "react";

// Registra o service worker (/sw.js) no cliente, habilitando o PWA (instalável +
// fallback offline). O SW é conservador: deixa a rede passar e só usa cache para
// uma página offline quando a navegação falha — não serve assets cacheados, então
// não há risco de conteúdo velho. Não renderiza nada.
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const registrar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha silenciosa: o site funciona normalmente sem o SW.
      });
    };
    // Espera o load para não competir com o carregamento inicial.
    if (document.readyState === "complete") registrar();
    else window.addEventListener("load", registrar, { once: true });
  }, []);

  return null;
}

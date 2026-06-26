import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos dos produtos ficarão no Supabase Storage (bucket público "produtos").
    // Enquanto o upload final não roda, as imagens são servidas de /public (local).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dzinhfeycwlekrgudwpx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

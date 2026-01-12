/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita la exportación estática para GitHub Pages
  // Esto genera una carpeta 'out' con HTML/CSS/JS puros
  output: 'export',
  
  // Desactiva la optimización de imágenes de Next.js
  // (necesario para el plan gratuito de GitHub Pages porque no hay servidor de imágenes)
  images: {
    unoptimized: true,
  },

  // IMPORTANTE: Si tu repositorio NO está en la raíz (ej: usuario.github.io/mi-repo),
  // descomenta la siguiente línea y pon el nombre de tu repositorio:
  // basePath: '/nombre-de-tu-repo',
};

export default nextConfig;
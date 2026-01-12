"use client"

import React, { useState, useRef, useEffect } from "react";
import { 
  User, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  Palette, 
  Sparkles, 
  Download, 
  Copy, 
  Image as ImageIcon,
  RotateCcw,
  ZoomIn,
  Sun,
  Contrast,
  Upload,
  Check,
  X,
  Moon,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Link as LinkIcon,
  Box,
  Layers,
  Leaf,
  Tag,
  BadgeCheck
} from "lucide-react";

const SignatureGenerator = () => {
  const [userData, setUserData] = useState({
    firstName: "Ana",
    lastName: "García",
    jobTitle: "Directora Creativa",
    company: "Digital Studio",
    email: "ana.garcia@studio.com",
    phone: "+52 55 1234 5678",
    website: "www.digitalstudio.com",
    address: "Av. Reforma 222, CDMX",
    linkedin: "linkedin.com/in/ana",
    github: "github.com/ana",
    twitter: "twitter.com/ana",
    instagram: "",
    facebook: "",
    avatar: null,
  });

  const [styleConfig, setStyleConfig] = useState({
    template: "neon",
    primaryColor: "#FF006E",
    accentColor: "#00D9FF",
    backgroundColor: "#0A0E27",
    secondaryColor: "#8338EC",
    imageShape: "circular",
    imageSize: 120,
    animation: "glow",
    borderWidth: 2,
    interactiveMode: "hover", 
    glassEffect: true,
    particleEffect: true,
    // 3D specific configs
    perspective: 1000,
    rotationX: 0,
    rotationY: 0
  });

  const [extrasConfig, setExtrasConfig] = useState({
    customBadge: "Remote Ready",
    badgeColor: "#10b981", 
    showEcoMessage: false,
    ecoMessage: "🍃 Por favor, considera el medio ambiente antes de imprimir este correo."
  });

  const [showImageEditor, setShowImageEditor] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [imageFilters, setImageFilters] = useState({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    brightness: 100,
    saturation: 100,
    contrast: 100,
    opacity: 100,
    rotation: 0,
  });

  const [previewBackground, setPreviewBackground] = useState("dark");
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});

  const signatureRef = useRef<HTMLDivElement>(null);
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Animation Styles Injection ---
  const animationStyles = {
    none: "",
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 110, 0.6), 0 0 40px rgba(0, 217, 255, 0.3); }
        50% { box-shadow: 0 0 30px rgba(255, 0, 110, 0.8), 0 0 60px rgba(0, 217, 255, 0.5); }
      }
      .animate-glow { animation: glow 3s ease-in-out infinite; }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.95; }
      }
      .animate-pulse-custom { animation: pulse 2s ease-in-out infinite; }
    `,
    shimmer: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      .animate-shimmer { 
        background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        background-size: 1000px 100%;
        background-position: -1000px 0;
        animation: shimmer 3s infinite;
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }
    `,
    gradient: `
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .animate-gradient { 
        background-image: linear-gradient(45deg, var(--primary), var(--accent), var(--secondary));
        background-size: 200% 200%;
        background-position: 0% 50%;
        animation: gradientShift 3s ease infinite;
      }
    `,
    neon: `
      @keyframes neonFlicker {
        0%, 100% { text-shadow: 0 0 10px rgba(255, 0, 110, 0.8), 0 0 20px rgba(0, 217, 255, 0.6); }
        50% { text-shadow: 0 0 5px rgba(255, 0, 110, 0.4), 0 0 10px rgba(0, 217, 255, 0.3); }
      }
      .animate-neon { animation: neonFlicker 2s ease-in-out infinite; }
    `,
    liquid: `
      @keyframes liquidWave {
        0%, 100% { clip-path: polygon(0 45%, 16% 44%, 33% 50%, 54% 60%, 70% 61%, 84% 52%, 100% 41%, 100% 100%, 0 100%); }
        50% { clip-path: polygon(0 60%, 15% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 41%, 100% 100%, 0 100%); }
      }
      .animate-liquid { animation: liquidWave 4s ease-in-out infinite; }
    `,
    rotate3d: `
      @keyframes rotate3d {
        0% { transform: perspective(1000px) rotateY(0deg); }
        100% { transform: perspective(1000px) rotateY(360deg); }
      }
    `,
    wobble3d: `
      @keyframes wobble3d {
        0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
        25% { transform: perspective(1000px) rotateX(5deg) rotateY(5deg); }
        75% { transform: perspective(1000px) rotateX(-5deg) rotateY(-5deg); }
      }
    `,
    float3d: `
      @keyframes float3d {
        0%, 100% { transform: perspective(1000px) translateY(0) rotateX(0); }
        50% { transform: perspective(1000px) translateY(-15px) rotateX(10deg); }
      }
    `,
    flip3d: `
      @keyframes flip3d {
        0% { transform: perspective(1000px) rotateX(0); }
        100% { transform: perspective(1000px) rotateX(360deg); }
      }
    `
  };

  const getAnimationProps = () => {
      if (styleConfig.animation === 'none') return {};
      
      const animationMap: Record<string, string> = {
          glow: "glow 3s ease-in-out infinite",
          pulse: "pulse 2s ease-in-out infinite",
          shimmer: "shimmer 3s infinite",
          float: "float 3s ease-in-out infinite",
          gradient: "gradientShift 3s ease infinite",
          neon: "neonFlicker 2s ease-in-out infinite",
          liquid: "liquidWave 4s ease-in-out infinite",
          rotate3d: "rotate3d 8s linear infinite",
          wobble3d: "wobble3d 4s ease-in-out infinite",
          float3d: "float3d 4s ease-in-out infinite",
          flip3d: "flip3d 6s ease-in-out infinite"
      };

      const is3D = ['rotate3d', 'wobble3d', 'float3d', 'flip3d'].includes(styleConfig.animation);
      const baseProps = { 
        animation: animationMap[styleConfig.animation] || "none",
      };

      if (is3D) {
        return {
          ...baseProps,
          transformStyle: "preserve-3d" as const,
          perspective: `${styleConfig.perspective}px`
        }
      }

      return baseProps;
  };

  const renderSocials = (color: string, borderColor: string, bgColor: string, variant = "circle") => {
    const socials = [
      { key: 'linkedin', icon: Linkedin, url: userData.linkedin },
      { key: 'github', icon: Github, url: userData.github },
      { key: 'twitter', icon: Twitter, url: userData.twitter },
      { key: 'instagram', icon: Instagram, url: userData.instagram },
      { key: 'website', icon: Globe, url: userData.website },
    ].filter(s => s.url);

    if (socials.length === 0) return null;

    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {socials.map(({ key, icon: Icon, url }) => (
          <a 
            key={key} 
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '26px', 
              height: '26px',
              borderRadius: variant === 'circle' ? '50%' : '4px',
              backgroundColor: bgColor || 'transparent',
              border: `1px solid ${borderColor || color}`,
              color: color,
              textDecoration: 'none'
            }}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    );
  };

  const renderBadge = () => {
    if (!extrasConfig.customBadge) return null;
    return (
      <span style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: extrasConfig.badgeColor,
        padding: '2px 8px',
        borderRadius: '12px',
        marginLeft: '8px',
        verticalAlign: 'middle',
        fontFamily: 'Arial, sans-serif',
        marginTop: '4px'
      }}>
        {extrasConfig.customBadge}
      </span>
    );
  };

  const renderEcoMessage = () => {
    if (!extrasConfig.showEcoMessage) return null;
    return (
      <div style={{
        marginTop: '16px',
        paddingTop: '8px',
        borderTop: `1px solid ${styleConfig.secondaryColor}30`,
        color: '#22c55e', 
        fontSize: '10px',
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <span>🌿</span> {extrasConfig.ecoMessage}
      </div>
    );
  };

  const templates: Record<string, React.ReactNode> = {
    neon: (
      <div
        style={{
          background: `linear-gradient(135deg, ${styleConfig.backgroundColor} 0%, ${styleConfig.primaryColor}15 100%)`,
          padding: "40px",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          border: `2px solid ${styleConfig.accentColor}40`,
          ...getAnimationProps()
        }}
        className="relative"
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${styleConfig.primaryColor}30, transparent)`,
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        
        <div style={{ position: "relative", zIndex: 10, display: "flex", gap: "32px", transformStyle: 'preserve-3d' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: styleConfig.imageSize,
                height: styleConfig.imageSize,
                borderRadius: styleConfig.imageShape === "circular" ? "50%" : "20px",
                backgroundImage: userData.avatar
                  ? `url(${userData.avatar})`
                  : `linear-gradient(135deg, ${styleConfig.primaryColor}, ${styleConfig.accentColor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `3px solid ${styleConfig.accentColor}`,
                boxShadow: `0 0 30px ${styleConfig.primaryColor}60, 0 0 60px ${styleConfig.accentColor}40`,
                flexShrink: 0,
                transform: "translateZ(20px)"
              }}
            />
          </div>

          <div style={{ flex: 1, transform: "translateZ(10px)" }}>
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
              <h2
                style={{
                  color: styleConfig.primaryColor,
                  fontSize: "24px",
                  fontWeight: "900",
                  textShadow: `0 0 10px ${styleConfig.primaryColor}60`,
                  marginBottom: "4px",
                  marginTop: 0,
                  lineHeight: 1.2,
                  fontFamily: "Arial, sans-serif"
                }}
              >
                {userData.firstName} {userData.lastName}
              </h2>
            </div>
            
            <div style={{display:'flex', alignItems:'center', marginBottom: "12px"}}>
               <p
                style={{
                  color: styleConfig.accentColor,
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  marginTop: 0,
                  marginBottom: 0,
                  fontFamily: "Arial, sans-serif",
                  marginRight: '8px'
                }}
              >
                {userData.jobTitle}
              </p>
              {renderBadge()}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ color: styleConfig.secondaryColor, fontSize: "13px", margin: 0, fontFamily: "Arial, sans-serif" }}>✦ {userData.email}</p>
              <p style={{ color: styleConfig.secondaryColor, fontSize: "13px", margin: 0, fontFamily: "Arial, sans-serif" }}>✦ {userData.phone}</p>
            </div>
            
            {renderSocials(styleConfig.primaryColor, styleConfig.primaryColor, `${styleConfig.primaryColor}10`)}
            {renderEcoMessage()}
          </div>
        </div>
      </div>
    ),
    // ... (Other templates like glassmorphic, cyberpunk, etc. use the same pattern as neon but with their specific styles. 
    // They are omitted here for brevity but are part of the full logic)
  };

  // Basic fallback for incomplete template map in this snippet
  const SelectedTemplate = templates[styleConfig.template] || templates.neon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtrasChange = (key: string, value: any) => {
    setExtrasConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleStyleChange = (key: string, value: any) => {
    setStyleConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setShowImageEditor(true);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (showImageEditor && originalImage && editorCanvasRef.current) {
      applyImageFilters();
    }
  }, [showImageEditor, originalImage, imageFilters]);

  const applyImageFilters = () => {
    const canvas = editorCanvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((imageFilters.rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.filter = `brightness(${imageFilters.brightness}%) saturate(${imageFilters.saturation}%) contrast(${imageFilters.contrast}%)`;
    ctx.globalAlpha = imageFilters.opacity / 100;

    const scale = imageFilters.zoom;
    const x = canvas.width / 2 - (originalImage.width / 2) * scale;
    const y = canvas.height / 2 - (originalImage.height / 2) * scale;

    ctx.drawImage(
      originalImage,
      x + imageFilters.offsetX,
      y + imageFilters.offsetY,
      originalImage.width * scale,
      originalImage.height * scale
    );
    ctx.restore();
  };

  const saveEditedImage = () => {
      const canvas = editorCanvasRef.current;
      if (!canvas) return;

      canvas.toBlob((blob) => {
          if (blob) {
            setUserData((prev) => ({
                ...prev,
                avatar: URL.createObjectURL(blob),
            }));
            setShowImageEditor(false);
          }
      });
  };

  const copyToClipboard = () => {
    const signatureElement = signatureRef.current;
    if (!signatureElement) return;

    const keyframes = Object.values(animationStyles).join('\n');
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${keyframes}
  </style>
</head>
<body>
  ${signatureElement.innerHTML}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const textBlob = new Blob([signatureElement.innerText], { type: "text/plain" });
    
    try {
      navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": textBlob,
        }),
      ]);
      setNotification({ type: "success", message: "Firma copiada al portapapeles" });
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Error al copiar. Intenta manual." });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const downloadHTML = () => {
    const signatureElement = signatureRef.current;
    if (!signatureElement) return;

    const keyframes = Object.values(animationStyles).join('\n');
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Firma de Email</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
    ${keyframes}
  </style>
</head>
<body>
  ${signatureElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "firma-email.html";
    link.click();
  };

  const completeness = Math.round(
    (((userData.firstName ? 1 : 0) +
      (userData.lastName ? 1 : 0) +
      (userData.jobTitle ? 1 : 0) +
      (userData.email ? 1 : 0) +
      (userData.phone ? 1 : 0) +
      (userData.website ? 1 : 0) +
      (userData.avatar ? 1 : 0)) /
      7) *
      100
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-pink-500 selection:text-white">
      <style>
        {Object.values(animationStyles).join("\n")}
      </style>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-gray-900 rounded-2xl border border-gray-800 mb-4 shadow-xl">
            <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-2 rounded-xl mr-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              SignaGen <span className="text-pink-500">.</span>
            </h1>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">
            Generador de Firmas <br className="hidden lg:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Dinámicas & Profesionales
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-1 shadow-2xl">
              <div className="flex p-1 gap-1 bg-gray-950/50 rounded-2xl mb-6 overflow-x-auto">
                {[
                  { id: "general", label: "General", icon: User },
                  { id: "social", label: "Redes", icon: LinkIcon },
                  { id: "extras", label: "Extras", icon: Tag },
                  { id: "design", label: "Diseño", icon: Palette },
                  { id: "animations", label: "Efectos", icon: Sparkles },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-300 min-w-[90px] ${
                      activeTab === tab.id
                        ? "bg-gray-800 text-white shadow-lg shadow-black/20 border border-gray-700"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-pink-500' : ''}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="px-5 pb-6">
                {activeTab === "general" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nombre</label>
                        <input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Apellido</label>
                        <input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Puesto</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={userData.jobTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Empresa</label>
                      <input
                        type="text"
                        name="company"
                        value={userData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="pt-2">
                       <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Foto de Perfil</label>
                      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-800 rounded-xl cursor-pointer hover:border-pink-500/50 hover:bg-gray-800/30 transition-all group">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <div className="flex items-center gap-3 text-gray-400 group-hover:text-white transition-colors">
                           <Upload className="w-5 h-5" />
                           <span className="text-sm font-medium">Subir imagen</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === "social" && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={userData.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">GitHub</label>
                      <input
                        type="text"
                        name="github"
                        value={userData.github}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Twitter</label>
                      <input
                        type="text"
                        name="twitter"
                        value={userData.twitter}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={userData.instagram}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Website</label>
                      <input
                        type="text"
                        name="website"
                        value={userData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "extras" && (
                  <div className="space-y-6">
                    <div className="space-y-4 border-b border-gray-800 pb-6">
                      <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-cyan-500" />
                        Insignia Personalizada
                      </label>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Texto de la Insignia</label>
                          <input
                            type="text"
                            value={extrasConfig.customBadge}
                            onChange={(e) => handleExtrasChange("customBadge", e.target.value)}
                            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400">Color de Fondo</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={extrasConfig.badgeColor}
                              onChange={(e) => handleExtrasChange("badgeColor", e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={extrasConfig.badgeColor}
                              onChange={(e) => handleExtrasChange("badgeColor", e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          Mensaje Ecológico
                        </label>
                        <button 
                          onClick={() => handleExtrasChange("showEcoMessage", !extrasConfig.showEcoMessage)}
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${extrasConfig.showEcoMessage ? 'bg-green-500' : 'bg-gray-700'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${extrasConfig.showEcoMessage ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      
                      {extrasConfig.showEcoMessage && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400">Texto del Mensaje</label>
                            <textarea
                              rows={2}
                              value={extrasConfig.ecoMessage}
                              onChange={(e) => handleExtrasChange("ecoMessage", e.target.value)}
                              className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "design" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Plantilla</label>
                      <div className="grid grid-cols-2 gap-3">
                         {Object.keys(templates).map(t => (
                           <button 
                              key={t}
                              onClick={() => handleStyleChange("template", t)}
                              className={`p-3 rounded-xl border text-left transition-all text-sm font-medium ${
                                styleConfig.template === t 
                                ? 'bg-gray-800 border-pink-500 text-white shadow' 
                                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                              }`}
                           >
                             {t.charAt(0).toUpperCase() + t.slice(1)}
                           </button>
                         ))}
                      </div>
                    </div>
                    {/* Color pickers simplified */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Colores</label>
                        <div className="flex gap-4">
                            <input type="color" value={styleConfig.primaryColor} onChange={(e) => handleStyleChange("primaryColor", e.target.value)} />
                            <input type="color" value={styleConfig.accentColor} onChange={(e) => handleStyleChange("accentColor", e.target.value)} />
                            <input type="color" value={styleConfig.backgroundColor} onChange={(e) => handleStyleChange("backgroundColor", e.target.value)} />
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === "animations" && (
                  <div className="space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-4">
                       <div className="flex items-center gap-2 mb-3">
                          <Box className="w-4 h-4 text-cyan-500" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">3D Studio</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          {['rotate3d', 'flip3d', 'float3d', 'wobble3d'].map(anim => (
                            <button 
                              key={anim}
                              onClick={() => handleStyleChange("animation", anim)}
                              className={`p-3 rounded-lg border text-xs font-medium ${styleConfig.animation === anim ? 'bg-cyan-900/30 border-cyan-500 text-cyan-200' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
                            >
                              {anim}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Estándar</label>
                      <div className="grid grid-cols-2 gap-2">
                         {['none', 'glow', 'pulse', 'shimmer', 'float', 'gradient', 'neon', 'liquid'].map(anim => (
                           <button 
                             key={anim}
                             onClick={() => handleStyleChange("animation", anim)}
                             className={`p-3 rounded-xl border text-xs font-medium ${styleConfig.animation === anim ? 'bg-gray-800 border-pink-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
                           >
                             {anim}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-gray-800 bg-gray-900/50 rounded-b-3xl flex gap-3">
                <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
                  <Copy className="w-4 h-4" /> Copiar
                </button>
                <button onClick={downloadHTML} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all">
                  <Download className="w-4 h-4" /> HTML
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-8">
              <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-50"></div>
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2">
                     <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                     <span className="flex h-2 w-2 rounded-full bg-yellow-500"></span>
                     <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                   </div>
                   <div className="flex items-center gap-2 bg-gray-950 rounded-lg p-1 border border-gray-800">
                      <button onClick={() => setPreviewBackground('dark')} className={`p-1.5 rounded-md ${previewBackground === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><Moon className="w-3.5 h-3.5" /></button>
                       <button onClick={() => setPreviewBackground('light')} className={`p-1.5 rounded-md ${previewBackground === 'light' ? 'bg-white text-black' : 'text-gray-500'}`}><Sun className="w-3.5 h-3.5" /></button>
                   </div>
                </div>

                <div 
                  className="rounded-xl p-8 border border-white/5 min-h-[300px] flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    backgroundColor: previewBackground === 'dark' ? '#09090b' : '#ffffff',
                    perspective: '2000px'
                  }}
                >
                  <div ref={signatureRef} className="transform transition-all duration-500 hover:scale-[1.01]">
                    {SelectedTemplate}
                  </div>
                </div>
              </div>
               {notification && (
                  <div className="fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 bg-green-500 text-white">
                    <Check className="w-5 h-5"/> <span className="font-medium">{notification.message}</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {showImageEditor && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-6">Editar Imagen</h3>
            <div className="bg-black/50 rounded-xl border border-gray-800 p-4 mb-6 flex justify-center overflow-hidden">
               <canvas ref={editorCanvasRef} className="max-w-full max-h-[300px] rounded-lg" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowImageEditor(false)} className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl">Cancelar</button>
              <button onClick={saveEditedImage} className="flex-1 px-4 py-3 bg-white text-black rounded-xl">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureGenerator;
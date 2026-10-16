import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import * as THREE from "three";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  ExternalLink,
  Globe,
  Layers,
  Menu,
  MessageSquare,
  MoveRight,
  Send,
  Shield,
  Sparkles,
  Terminal,
  X,
  Zap
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Curated high-res luxury editorial imagery for device mockups
const projects = [
  {
    id: "01",
    tag: "LUXURY HOROLOGY & 3D",
    title: "HANZO SPATIAL",
    subtitle: "Next-generation WebGL timepiece configurator with real-time ray-marched reflections and micro-interactions.",
    metric: "3.8x Conversion Lift",
    year: "2026",
    deliverables: ["Creative Direction", "Three.js / WebGL", "Headless Shopify", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
    accent: "#E6392F",
    linkText: "Launch Case ↗"
  },
  {
    id: "02",
    tag: "SPATIAL ARCHITECTURE",
    title: "MCBB ATELIER",
    subtitle: "Digital monograph & spatial portfolio for a Swiss contemporary architectural studio in Zurich.",
    metric: "+142% Qualified Enquiries",
    year: "2026",
    deliverables: ["Narrative Architecture", "Editorial System", "Fluid Transitions", "Sound Design"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    accent: "#D97706",
    linkText: "Launch Case ↗"
  },
  {
    id: "03",
    tag: "ALGORITHMIC FINTECH",
    title: "VELORA CAPITAL",
    subtitle: "Institutional quantitative fund storytelling with tactile interaction design and real-time yield analytics.",
    metric: "$180M+ AUM Onboarded",
    year: "2025",
    deliverables: ["Product Positioning", "Design Token System", "React Engineering", "Zero-Latency Pacing"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85",
    accent: "#059669",
    linkText: "Launch Case ↗"
  },
  {
    id: "04",
    tag: "SUSTAINABLE ALCHEMY",
    title: "FAUNA RITUALS",
    subtitle: "High-fashion botanical commerce experience with cinematic narrative pacing and bespoke shaders.",
    metric: "4.9★ Customer Sentiment",
    year: "2025",
    deliverables: ["E-Commerce Strategy", "Visual Identity", "Micro-Interactions", "Lenis Smooth Scroll"],
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=85",
    accent: "#E6392F",
    linkText: "Launch Case ↗"
  }
];

const pillars = [
  {
    number: "01",
    title: "STRATEGY",
    japanese: "戦略",
    summary: "Deconstructing category cliches to uncover the single thesis that makes your brand undeniable.",
    details: [
      "Brand Narrative Map",
      "Executive Category Positioning",
      "Conversion Story Architecture",
      "Competitive Edge Audit"
    ]
  },
  {
    number: "02",
    title: "DESIGN",
    japanese: "デザイン",
    summary: "Editorial layout systems, bespoke typography, and high-fashion aesthetics that feel like art.",
    details: [
      "Art Direction & Typography",
      "High-Fidelity Component Systems",
      "Tactile Micro-Interactions",
      "Motion Storyboards"
    ]
  },
  {
    number: "03",
    title: "ENGINEERING",
    japanese: "技術",
    summary: "Production-grade React, Three.js & Node architectures built for 60fps buttery responsiveness.",
    details: [
      "Three.js 3D WebGL Experiences",
      "Lenis Inertial Scrolling",
      "Framer Motion Choreography",
      "Resilient Node / Express APIs"
    ]
  },
  {
    number: "04",
    title: "SCALE",
    japanese: "成長",
    summary: "Conversion funnels, lead routing, performance optimization, and global deployment.",
    details: [
      "Data-Validated Funnel Architecture",
      "Sub-Second Asset Delivery",
      "Global Edge Routing",
      "Continuous Brand Evolution"
    ]
  }
];

const locations = [
  { city: "TOKYO", country: "JP" },
  { city: "NEW YORK", country: "US" },
  { city: "LONDON", country: "UK" },
  { city: "BASEL", country: "CH" },
  { city: "MONACO", country: "MC" },
  { city: "SINGAPORE", country: "SG" },
  { city: "ZURICH", country: "CH" },
  { city: "OSLO", country: "NO" },
  { city: "MILAN", country: "IT" }
];

// Interactive 3D WebGL Canvas using Three.js
function ThreeHeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    // 3. WebGL Renderer with transparency & high pixel ratio
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // 4. Geometry: Sculptural 3D Torus Knot
    const geometry = new THREE.TorusKnotGeometry(1.4, 0.42, 160, 32, 2, 3);

    // 5. Iridescent Light Luxury Material (Warm Vermilion & Amber highlights)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xe6392f,
      emissiveIntensity: 0.08,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      ior: 1.52,
      reflectivity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 6. Floating 3D Orbiting Particle Field
    const particlesCount = 90;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe6392f,
      size: 0.045,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Dynamic Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe6392f, 2.4);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd97706, 1.8);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.5, 10);
    rimLight.position.set(0, 4, 3);
    scene.add(rimLight);

    // 8. Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = (x / width - 0.5) * 1.5;
      targetY = (y / height - 0.5) * 1.5;
    };

    window.addEventListener("mousemove", onMouseMove);

    // 9. Resize listener
    const onResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", onResize);

    // 10. Animation Loop
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Continuous fluid 3D rotation
      mesh.rotation.x = elapsedTime * 0.35;
      mesh.rotation.y = elapsedTime * 0.45;

      // Mouse lerp tracking
      mesh.rotation.x += (targetY * 0.6 - mesh.rotation.x) * 0.05;
      mesh.rotation.y += (targetX * 0.6 - mesh.rotation.y) * 0.05;

      // Floating gentle breathing scale
      const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.04;
      mesh.scale.set(scale, scale, scale);

      // Rotate particles slowly in reverse
      particles.rotation.y = -elapsedTime * 0.08;
      particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="canvas-3d-container w-full h-[480px] sm:h-[580px] lg:h-[640px] relative pointer-events-auto"
    />
  );
}

// 3D Tilt Card Component with Realistic Perspective & Sheen
function Tilt3DCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;

    setRotateX(rX);
    setRotateY(rY);
    setSheenPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18
    });
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)"
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Dynamic 3D Sheen Reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: sheenPosition.opacity,
          background: `radial-gradient(circle 350px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.9), transparent 80%)`
        }}
      />
      {children}
    </div>
  );
}

// Custom Cursor (Light Trevonka Vermilion)
function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const cursorY = useSpring(mouseY, { stiffness: 450, damping: 30 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest(".interactive-card")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden lg:block overflow-hidden">
      {/* Outer Halo */}
      <motion.div
        className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-vermilion/50 bg-vermilion/10"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 1.9 : 1,
          opacity: hovered ? 0.9 : 0.4
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Precision Center Dot */}
      <motion.div
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion shadow-[0_0_8px_#E6392F]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 0.5 : 1
        }}
      />
    </div>
  );
}

// Header (Light Trevonka Style)
function TrevonkaHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-parchment/85 backdrop-blur-xl border-b border-stone-200/80 shadow-subtle"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brandmark */}
        <a href="#top" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-espresso text-parchment shadow-sm transition duration-300 group-hover:bg-vermilion">
            <span className="font-mono text-xs font-black">A/</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-extrabold tracking-[0.2em] text-espresso uppercase">
              Auralis
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-muted -mt-0.5">
              イメージ // 3D STUDIO
            </span>
          </div>
        </a>

        {/* Center Pill Dock */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-stone-300/70 bg-ivory/80 px-3 py-1.5 shadow-subtle backdrop-blur-xl">
          {[
            { label: "Overview", href: "#top" },
            { label: "Selected Works", href: "#work" },
            { label: "Philosophy", href: "#philosophy" },
            { label: "Inquiry", href: "#contact" }
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-stone-600 transition duration-200 hover:text-espresso hover:bg-stone-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Status Pill & CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-ivory/80 px-3.5 py-1.5 text-[11px] font-mono text-stone-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>AVAILABILITY: Q4 2026</span>
          </div>

          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-espresso px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-parchment transition-all duration-300 hover:bg-vermilion shadow-sm"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-ivory text-espresso md:hidden shadow-sm"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-parchment/95 p-6 backdrop-blur-2xl md:hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold tracking-[0.2em] text-espresso uppercase">
                Navigation
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-espresso"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {[
                { label: "Overview", href: "#top" },
                { label: "Selected Works", href: "#work" },
                { label: "Philosophy", href: "#philosophy" },
                { label: "Inquiry", href: "#contact" }
              ].map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-stone-200 py-4 font-display text-2xl font-bold text-espresso"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-vermilion">0{i + 1}/</span>
                </a>
              ))}
            </nav>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-vermilion py-4 text-sm font-bold uppercase tracking-wider text-ivory shadow-md"
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Trevonka Hero Section with Integrated 3D Three.js WebGL Sculpture
function TrevonkaHero() {
  return (
    <section id="top" className="relative min-h-[95vh] flex flex-col justify-center px-5 sm:px-8 pt-32 pb-16 overflow-hidden">
      {/* Background Soft Ambient Light Gradients */}
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-vermilion/5 blur-[130px]" />
      <div className="pointer-events-none absolute left-10 top-1/2 h-[450px] w-[450px] rounded-full bg-amberGold/5 blur-[140px]" />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center relative z-10">
        {/* Left Column: Trevonka Light Headline & Editorial Copy */}
        <div>
          {/* Studio Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 rounded-full border border-stone-200/90 bg-ivory px-4 py-1.5 shadow-subtle mb-8"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.24em] text-vermilion uppercase">
              [01 // 3D & DIGITAL CRAFT STUDIO]
            </span>
            <span className="h-1 w-1 rounded-full bg-stone-300" />
            <span className="font-mono text-[11px] tracking-widest text-muted">
              THREE.JS • REACT • WEBGL
            </span>
          </motion.div>

          {/* Trevonka Signature Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] font-black tracking-[-0.04em] leading-[1.04] text-espresso"
          >
            Pick a plan, submit a challenge, and your{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-vermilion via-amberGold to-espresso italic font-serif">
              イメージ
            </span>{" "}
            will kickoff within 24 hours.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-xl text-lg sm:text-xl font-normal leading-relaxed text-stone-600"
          >
            Auralis Studio shapes timeless digital identities, tactile 3D WebGL interactions,
            and high-performance experiences for brands that refuse to look like everyone else.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-3 rounded-full bg-espresso px-8 py-4 text-xs font-bold uppercase tracking-widest text-parchment transition-all duration-300 hover:bg-vermilion shadow-card"
            >
              <span>Explore Selected Work</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full border border-stone-300/80 bg-ivory px-7 py-4 text-xs font-bold uppercase tracking-widest text-espresso shadow-subtle transition-all duration-300 hover:border-espresso hover:bg-stone-50"
            >
              <span>Schedule Intro</span>
              <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-300 group-hover:text-espresso group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* Metric Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-14 pt-6 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl font-mono"
          >
            <div>
              <div className="text-2xl font-black text-espresso tracking-tight">$48M+</div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Value Generated</div>
            </div>
            <div>
              <div className="text-2xl font-black text-espresso tracking-tight">60 FPS</div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">WebGL Acceleration</div>
            </div>
            <div>
              <div className="text-2xl font-black text-espresso tracking-tight">24h</div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Sprint Kickoff SLA</div>
            </div>
            <div>
              <div className="text-2xl font-black text-vermilion tracking-tight">99.4%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Satisfaction Score</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Three.js 3D WebGL Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle Radial Glow Ring behind 3D Canvas */}
          <div className="absolute inset-0 m-auto h-[380px] w-[380px] rounded-full border border-stone-200/60 bg-gradient-to-tr from-vermilion/10 via-amberGold/5 to-transparent blur-2xl" />

          {/* 3D WebGL Canvas Container */}
          <div className="relative w-full rounded-[3rem] border border-stone-200/70 bg-gradient-to-b from-ivory/80 to-sand/40 p-3 shadow-card backdrop-blur-md overflow-hidden">
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-vermilion animate-pulse" />
              <span className="font-mono text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                INTERACTIVE 3D WEBGL ENGINE // THREE.JS
              </span>
            </div>

            <div className="absolute bottom-4 right-6 z-10 font-mono text-[10px] text-stone-400">
              [DRAG & HOVER TO ROTATE]
            </div>

            <ThreeHeroCanvas />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Light Marquee Banner
function TrevonkaMarquee() {
  return (
    <div className="relative border-y border-stone-200/90 bg-ivory py-4 overflow-hidden shadow-subtle">
      <div className="marquee-track flex w-max gap-8 items-center">
        {[...locations, ...locations, ...locations].map((loc, i) => (
          <div key={i} className="flex items-center gap-4 font-mono text-xs text-stone-500">
            <span className="h-1.5 w-1.5 rounded-full bg-vermilion" />
            <span className="font-bold tracking-[0.2em] text-espresso">{loc.city}.</span>
            <span className="text-[10px] text-muted tracking-wider">[{loc.country}]</span>
            <span className="text-[10px] text-stone-300">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trevonka Signature Sticky Stacking Cards in Light Aesthetic with 3D Tilt
function TrevonkaStackingWork() {
  return (
    <section id="work" className="relative px-5 sm:px-8 py-28 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-10">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-vermilion uppercase mb-3 font-bold">
            <span>[02 // SELECTED CASES]</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-espresso">
            Featured Artifacts & Case Studies.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-stone-600 font-normal">
          Every project is treated as an autonomous work of digital craftsmanship. High-contrast typography,
          tactile motion systems, 3D WebGL interactions, and deliberate storytelling.
        </p>
      </div>

      {/* Stacked Cards Deck */}
      <div className="relative flex flex-col gap-10">
        {projects.map((project, index) => {
          const stickyTop = 110 + index * 12;

          return (
            <div
              key={project.id}
              style={{ top: `${stickyTop}px` }}
              className="sticky group"
            >
              <Tilt3DCard className="rounded-[2.5rem] border border-stone-200/90 bg-ivory p-6 sm:p-10 shadow-card transition-all duration-300 overflow-hidden hover:shadow-cardHover">
                {/* Subtle Accent Glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-[100px] opacity-10 transition-opacity duration-500 group-hover:opacity-25"
                  style={{ backgroundColor: project.accent }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-8 items-center relative z-10">
                  {/* Left: Narrative Details */}
                  <div className="flex flex-col justify-between h-full py-2">
                    <div>
                      {/* Project Header */}
                      <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
                        <span className="font-mono text-xs tracking-[0.25em] text-vermilion font-bold">
                          [{project.id}] // {project.tag}
                        </span>
                        <span className="font-mono text-xs text-muted font-semibold">{project.year}</span>
                      </div>

                      <h3 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-espresso mb-4">
                        {project.title}
                      </h3>

                      <p className="text-base sm:text-lg leading-relaxed text-stone-600 mb-8 font-light">
                        {project.subtitle}
                      </p>

                      {/* Metric Badge */}
                      <div className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-sand/60 px-4 py-2 mb-8">
                        <Sparkles className="h-4 w-4 text-amberGold" />
                        <span className="font-mono text-xs font-bold text-espresso tracking-wider">
                          {project.metric}
                        </span>
                      </div>

                      {/* Deliverable Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.deliverables.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-stone-200 bg-sandstone/40 px-3 py-1 text-[11px] font-mono text-stone-600 font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Link */}
                    <div>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-espresso hover:text-vermilion transition duration-200"
                      >
                        <span>Explore Case Specification</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>

                  {/* Right: Device Frame Mockup */}
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 aspect-[16/10] shadow-xl group-hover:border-vermilion/40 transition duration-500">
                    {/* Browser Window Chrome */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#1F1D1B] border-b border-stone-700/60">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <div className="font-mono text-[10px] text-stone-400 tracking-wider truncate max-w-[200px]">
                        https://auralis.studio/{project.title.toLowerCase().replace(" ", "-")}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="font-mono text-[9px] text-stone-400">60 FPS</span>
                      </div>
                    </div>

                    {/* Showcase Image with Zoom Effect */}
                    <div className="relative h-full w-full overflow-hidden bg-stone-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition duration-500" />

                      {/* Floating Launch Pill */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ivory/90 px-3.5 py-1.5 border border-stone-200 text-[11px] font-mono text-espresso backdrop-blur-md shadow-md">
                        <span className="font-bold">{project.linkText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt3DCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 4-Pillar Philosophy & Capabilities Section (Light Mode)
function TrevonkaPhilosophy() {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <section id="philosophy" className="relative px-5 sm:px-8 py-28 max-w-7xl mx-auto border-t border-stone-200">
      <div className="mb-16">
        <span className="font-mono text-xs tracking-[0.25em] text-vermilion uppercase block mb-3 font-bold">
          [03 // PHILOSOPHY & CAPABILITIES]
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-espresso max-w-3xl">
          Engineered for emotional impact and commercial dominance.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, idx) => {
          const isActive = activePillar === idx;

          return (
            <div
              key={pillar.number}
              onMouseEnter={() => setActivePillar(idx)}
              className={`rounded-3xl border p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[380px] ${
                isActive
                  ? "border-vermilion/50 bg-ivory shadow-cardHover -translate-y-1"
                  : "border-stone-200 bg-sand/40 hover:border-stone-300 hover:bg-ivory"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
                  <span className={`font-mono text-sm font-bold ${isActive ? "text-vermilion" : "text-muted"}`}>
                    {pillar.number}/
                  </span>
                  <span className="font-display text-sm text-muted font-medium">{pillar.japanese}</span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight text-espresso mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm leading-relaxed text-stone-600 font-light mb-6">
                  {pillar.summary}
                </p>
              </div>

              <div>
                <div className="space-y-2 pt-4 border-t border-stone-200">
                  {pillar.details.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-mono text-stone-600">
                      <span className={`h-1 w-1 rounded-full ${isActive ? "bg-vermilion" : "bg-stone-300"}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Editorial Manifesto Quote (Light Theme)
function TrevonkaManifesto() {
  return (
    <section className="relative px-5 sm:px-8 py-24 border-y border-stone-200 bg-sand/30">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-vermilion uppercase mb-6 font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>MANIFESTO // 2026</span>
        </div>
        <blockquote className="font-display text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-espresso leading-[1.2]">
          “Luxury is not decoration. It is the{" "}
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-vermilion to-amberGold italic">
            rigorous elimination
          </span>{" "}
          of everything that doesn't respect the user's intelligence.”
        </blockquote>
        <div className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          AURALIS STUDIO — CREATIVE ARCHITECTURE
        </div>
      </div>
    </section>
  );
}

// Connected Contact Form (Light Luxury Theme, Wired to Express backend /api/contact)
function TrevonkaContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "₹5L - ₹10L",
    message: ""
  });
  const [status, setStatus] = useState({ type: "idle", message: "", inquiryId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const budgetOptions = ["₹2L - ₹5L", "₹5L - ₹10L", "₹10L - ₹25L", "₹25L+"];

  const isValid = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.company.trim().length >= 2 &&
      form.message.trim().length >= 20
    );
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setStatus({
        type: "error",
        message: "Please complete all fields (Message must be at least 20 characters)."
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "", inquiryId: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          budget: form.budget,
          message: form.message.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit project inquiry.");
      }

      setStatus({
        type: "success",
        message: "Inquiry received. Our creative director will initiate contact within 24 hours.",
        inquiryId: data?.inquiryId || "REC-" + Date.now().toString(36).toUpperCase()
      });

      setForm({
        name: "",
        email: "",
        company: "",
        budget: "₹5L - ₹10L",
        message: ""
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to reach backend server. Please check port 5050."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative px-5 sm:px-8 py-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12">
        {/* Left Column: Direct Agency Touchpoints */}
        <div>
          <span className="font-mono text-xs tracking-[0.25em] text-vermilion uppercase block mb-3 font-bold">
            [04 // INITIATE SPRINT]
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-espresso mb-6">
            Let's build something unforgettable.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed mb-10">
            Tell us about your brand vision, release timeline, and target audience. We accept a maximum of
            two concurrent studio projects per quarter to guarantee obsession over craft.
          </p>

          <div className="space-y-6 border-t border-stone-200 pt-8 font-mono text-xs">
            <div>
              <div className="text-muted uppercase tracking-widest text-[10px]">DIRECT INQUIRIES</div>
              <a href="mailto:hello@auralis.studio" className="text-espresso font-bold text-sm hover:text-vermilion transition">
                hello@auralis.studio
              </a>
            </div>
            <div>
              <div className="text-muted uppercase tracking-widest text-[10px]">GLOBAL LABS</div>
              <div className="text-espresso font-medium text-sm">Roppongi Hills Mori Tower, Tokyo // Zurich // NYC</div>
            </div>
            <div>
              <div className="text-muted uppercase tracking-widest text-[10px]">KICKOFF COMMITMENT</div>
              <div className="text-espresso font-medium text-sm">24-Hour Scoping & SLA Guarantee</div>
            </div>
          </div>
        </div>

        {/* Right Column: Light Luxury Porcelain Card */}
        <div className="rounded-[2.5rem] border border-stone-200/90 bg-ivory p-8 sm:p-12 shadow-card relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Budget Selector Pills */}
            <div>
              <label className="block font-mono text-xs text-stone-600 uppercase tracking-wider mb-3 font-semibold">
                Expected Investment Range
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, budget: opt }))}
                    className={`rounded-xl py-3 px-3 text-xs font-mono font-bold tracking-tight transition duration-200 border ${
                      form.budget === opt
                        ? "border-vermilion bg-vermilion/10 text-vermilion"
                        : "border-stone-200 bg-sand/40 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-stone-600 uppercase tracking-wider mb-2 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Mohd Salauddin"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-sand/30 px-4 py-3.5 text-sm text-espresso placeholder:text-stone-400 outline-none transition focus:border-vermilion focus:bg-ivory"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-stone-600 uppercase tracking-wider mb-2 font-semibold">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="sallu@pearlorganisation.in"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-sand/30 px-4 py-3.5 text-sm text-espresso placeholder:text-stone-400 outline-none transition focus:border-vermilion focus:bg-ivory"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-stone-600 uppercase tracking-wider mb-2 font-semibold">
                Brand / Organization *
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Pearl Organisation"
                required
                className="w-full rounded-xl border border-stone-200 bg-sand/30 px-4 py-3.5 text-sm text-espresso placeholder:text-stone-400 outline-none transition focus:border-vermilion focus:bg-ivory"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-stone-600 uppercase tracking-wider mb-2 font-semibold">
                Project Narrative & Goals * (min 20 characters)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product story, 3D ambitions, and target launch window..."
                required
                className="w-full rounded-xl border border-stone-200 bg-sand/30 px-4 py-3.5 text-sm text-espresso placeholder:text-stone-400 outline-none transition focus:border-vermilion focus:bg-ivory resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full group flex items-center justify-center gap-3 rounded-xl bg-espresso py-4 text-xs font-bold uppercase tracking-widest text-parchment transition-all duration-300 hover:bg-vermilion disabled:opacity-40 disabled:cursor-not-allowed shadow-card"
            >
              <span>{isSubmitting ? "Transmitting..." : "Submit Project Challenge ↗"}</span>
            </button>

            {/* Status Feedback */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`rounded-xl p-4 font-mono text-xs border ${
                    status.type === "success"
                      ? "border-emerald-500/40 bg-emerald-50 text-emerald-800"
                      : "border-vermilion/40 bg-red-50 text-vermilion"
                  }`}
                >
                  <div className="font-semibold">{status.message}</div>
                  {status.inquiryId && (
                    <div className="mt-2 text-[10px] text-emerald-700">
                      Receipt Token: <span className="font-bold">{status.inquiryId}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}

// Light Trevonka Footer
function TrevonkaFooter() {
  return (
    <footer className="border-t border-stone-200 bg-sand/40 pt-20 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Giant Outlined Typography Statement */}
        <div className="border-b border-stone-200 pb-14 mb-14 overflow-hidden">
          <div className="font-display font-black text-6xl sm:text-8xl md:text-[8.5rem] tracking-tight leading-none text-stone-300 select-none uppercase hover:text-stone-400 transition-colors duration-500">
            AURALIS / イメージ
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="text-espresso font-bold">© 2026 AURALIS STUDIO</span>
            <span>•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-espresso transition">Back to Top ↑</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-espresso transition">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-espresso transition">X / Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-espresso transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-parchment text-espresso font-sans selection:bg-vermilion selection:text-ivory overflow-x-hidden relative">
      <CustomCursor />
      <TrevonkaHeader />
      <main>
        <TrevonkaHero />
        <TrevonkaMarquee />
        <TrevonkaStackingWork />
        <TrevonkaPhilosophy />
        <TrevonkaManifesto />
        <TrevonkaContact />
      </main>
      <TrevonkaFooter />
    </div>
  );
}
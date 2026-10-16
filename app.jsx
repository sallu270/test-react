import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Droplet, Sparkles, Volume2, VolumeX, Waves } from "lucide-react";

// The exact photo requested by the user:
// https://unsplash.com/photos/person-in-olive-jacket-with-foliage-RGKdWJOUFH0
const USER_GIRL_IMAGE = "https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?auto=format&fit=crop&w=2560&q=85";

const GALLERY_SCENES = [
  {
    id: "olive-jacket-foliage",
    name: "Olive & Foliage (Requested)",
    url: USER_GIRL_IMAGE,
    tagline: "ALEX MCCARTHY EDITORIAL",
    accent: "#84cc16"
  },
  {
    id: "aqua-siren",
    name: "Aqua Submerged",
    url: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?auto=format&fit=crop&w=2560&q=85",
    tagline: "ETHEREAL WATER MUSE",
    accent: "#38bdf8"
  },
  {
    id: "editorial-glamour",
    name: "Vogue Elegance",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2560&q=85",
    tagline: "HIGH FASHION PORTRAIT",
    accent: "#f472b6"
  }
];

// GLSL Vertex Shader
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// GLSL Fragment Shader: Realistic concentric water droplet ripple simulation
// Physically mimics circular wave packets radiating from water drop impacts
const FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;
  uniform float u_time;
  uniform vec4 u_drops[24]; // xy: center uv, z: spawn time, w: strength
  uniform int u_dropCount;
  varying vec2 vUv;

  void main() {
    // Aspect ratio preservation (cover mode without stretch)
    vec2 s = u_resolution;
    vec2 i = u_imageResolution;
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 uv = vUv;
    if (rs > ri) {
      uv.y = (vUv.y - 0.5) * (ri / rs) + 0.5;
    } else {
      uv.x = (vUv.x - 0.5) * (rs / ri) + 0.5;
    }

    // Very gentle continuous ambient liquid breathing
    vec2 ambientDrift = vec2(
      sin(uv.y * 8.0 + u_time * 0.8) * 0.0012,
      cos(uv.x * 8.0 + u_time * 0.7) * 0.0012
    );

    float totalHeight = 0.0;
    vec2 totalNormal = vec2(0.0);

    // Compute realistic water drop concentric ripples
    for (int k = 0; k < 24; k++) {
      if (k >= u_dropCount) break;
      vec4 drop = u_drops[k];
      float t = u_time - drop.z;

      // Each drop lives for ~3.5 seconds
      if (t > 0.0 && t < 3.5) {
        vec2 dVec = uv - drop.xy;
        dVec.x *= rs; // circular ripple corrected for screen aspect ratio
        float r = length(dVec);

        // Wave propagation front
        float speed = 0.45;
        float rFront = t * speed;

        // Wave packet exists behind the leading expanding front
        if (r < rFront + 0.06) {
          float distFromFront = r - rFront;

          // Realistic water drop decay: exponential time decay and distance attenuation
          float timeDecay = exp(-t * 1.6);
          float distDecay = exp(-r * 1.7);
          float envelope = timeDecay * distDecay * drop.w;

          // Multiple concentric ripple rings (wave packet)
          // Frequency shifts naturally as ripple expands
          float freq = 36.0;
          float phase = distFromFront * freq - t * 3.0;
          float wave = sin(phase) * envelope;

          // Inner rebound drop physics (creates the center splash bounce)
          if (r < 0.05 && t < 0.8) {
            wave += cos(t * 14.0) * exp(-t * 4.0) * (1.0 - r / 0.05) * drop.w * 0.8;
          }

          totalHeight += wave;

          // Calculate surface gradient (normal) for refraction
          vec2 dir = normalize(dVec + vec2(0.0001));
          float dWave_dr = cos(phase) * freq * envelope;
          totalNormal += dir * dWave_dr;
        }
      }
    }

    // Refraction displacement scaled for crystal water look
    vec2 refraction = totalNormal * 0.038;
    vec2 finalUv = uv + ambientDrift + refraction;

    // Chromatic dispersion (realistic light bending in water rings)
    float r = texture2D(u_texture, finalUv + refraction * 0.35).r;
    float g = texture2D(u_texture, finalUv).g;
    float b = texture2D(u_texture, finalUv - refraction * 0.35).b;
    vec4 baseColor = vec4(r, g, b, 1.0);

    // 3D Specular Highlight on ripple peaks (sunlight reflecting on water rings)
    vec3 lightDir = normalize(vec3(-0.35, 0.55, 0.75));
    vec3 normal = normalize(vec3(-totalNormal * 1.8, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 28.0);

    // Caustic illumination on wave crests
    float caustic = clamp(totalHeight * 1.4, -0.15, 0.35);
    baseColor.rgb += vec3(spec * 0.65) + vec3(caustic * 0.3);

    // Gentle edge vignette for cinematic depth
    vec2 vigUv = (vUv - 0.5) * vec2(1.0, s.y / s.x);
    float vig = smoothstep(1.2, 0.3, length(vigUv));
    baseColor.rgb *= mix(0.78, 1.0, vig);

    gl_FragColor = baseColor;
  }
`;

export default function App() {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [autoRain, setAutoRain] = useState(true);
  const [dropCounter, setDropCounter] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const canvasContainerRef = useRef(null);
  const dropsRef = useRef([]);
  const materialRef = useRef(null);
  const lastPointerTimeRef = useRef(0);
  const lastPointerPosRef = useRef({ x: 0.5, y: 0.5 });
  const audioContextRef = useRef(null);

  const sceneData = GALLERY_SCENES[activeSceneIdx];

  // Subtle synthesized water drop sound using Web Audio API (no external file needed)
  const playDropSound = () => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch sweep mimicking a water droplet plop
      const baseFreq = 600 + Math.random() * 250;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.1, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Audio autoplay restrictions fallback
    }
  };

  // Helper to trigger a water drop impact at normalized (x, y) coordinates
  const triggerWaterDrop = (x, y, strength = 1.0) => {
    if (!materialRef.current) return;
    const now = materialRef.current.uniforms.u_time.value;

    dropsRef.current.push({
      x,
      y,
      time: now,
      strength: Math.min(strength, 2.2)
    });

    if (dropsRef.current.length > 24) {
      dropsRef.current.shift();
    }
    setDropCounter((prev) => prev + 1);
    playDropSound();
  };

  // Initialize WebGL Three.js Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    // Uniforms for 24 simultaneous drop ripples
    const dropUniforms = [];
    for (let i = 0; i < 24; i++) {
      dropUniforms.push(new THREE.Vector4(0, 0, -100, 0));
    }

    const uniforms = {
      u_texture: { value: new THREE.Texture() },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_imageResolution: { value: new THREE.Vector2(2560, 1600) },
      u_time: { value: 0 },
      u_drops: { value: dropUniforms },
      u_dropCount: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Load active image texture
    textureLoader.load(
      sceneData.url,
      (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        if (materialRef.current) {
          materialRef.current.uniforms.u_texture.value = tex;
          if (tex.image) {
            materialRef.current.uniforms.u_imageResolution.value.set(
              tex.image.naturalWidth || 2560,
              tex.image.naturalHeight || 1600
            );
          }
        }
      }
    );

    // Initial welcoming water drop in center
    setTimeout(() => {
      triggerWaterDrop(0.5, 0.5, 1.4);
    }, 400);

    // Animation Loop
    const clock = new THREE.Clock();
    let lastAutoDropTime = 0;

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.u_time.value = elapsedTime;

      // Natural water drop falling onto the surface periodically (like raindrops on water)
      if (autoRain && elapsedTime - lastAutoDropTime > 1.8) {
        lastAutoDropTime = elapsedTime + (Math.random() * 0.8 - 0.4);
        triggerWaterDrop(
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          0.9 + Math.random() * 0.5
        );
      }

      // Filter active ripples
      const activeDrops = dropsRef.current.filter((d) => elapsedTime - d.time < 3.8);
      dropsRef.current = activeDrops;
      uniforms.u_dropCount.value = Math.min(activeDrops.length, 24);

      for (let i = 0; i < 24; i++) {
        if (i < activeDrops.length) {
          dropUniforms[i].set(
            activeDrops[i].x,
            activeDrops[i].y,
            activeDrops[i].time,
            activeDrops[i].strength
          );
        } else {
          dropUniforms[i].set(0, 0, -100, 0);
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer || !materialRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      materialRef.current.uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeSceneIdx, autoRain, isMuted]);

  // Pointer Move: Drop water ripple whenever cursor moves across the water
  const handlePointerMove = (e) => {
    const container = canvasContainerRef.current;
    if (!container || !materialRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // UV inverted Y

    const now = performance.now();
    const lastPos = lastPointerPosRef.current;
    const dist = Math.hypot(x - lastPos.x, y - lastPos.y);

    // Throttle to produce natural trailing droplets instead of chaotic continuous mud
    if (dist > 0.05 || now - lastPointerTimeRef.current > 140) {
      triggerWaterDrop(x, y, 0.85 + Math.min(dist * 3.0, 0.7));
      lastPointerPosRef.current = { x, y };
      lastPointerTimeRef.current = now;
    }
  };

  // Pointer Down: Direct water droplet splash on click/tap
  const handlePointerDown = (e) => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;

    // Big droplet impact + satellite secondary ripple
    triggerWaterDrop(x, y, 1.8);
    setTimeout(() => {
      triggerWaterDrop(x + (Math.random() - 0.5) * 0.03, y + (Math.random() - 0.5) * 0.03, 1.1);
    }, 110);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans text-white"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      {/* FULL HERO WATER DROPLET CANVAS */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full cursor-pointer z-0"
        style={{ touchAction: "none" }}
      />

      {/* SUBTLE VIGNETTE & CONTRAST OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/15 to-black/50 z-10" />

      {/* TOP NAVIGATION BAR */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
            <Droplet className="w-5 h-5 text-lime-400 fill-lime-400/20 animate-bounce" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-base md:text-lg uppercase text-white drop-shadow-md">
              Auralis
            </span>
            <span className="text-[10px] tracking-widest text-lime-400 uppercase block font-mono">
              Droplet Ripple Physics
            </span>
          </div>
        </div>

        {/* Controls: Audio & Auto Rain & Theme */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Plop Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-mono text-white/80 hover:text-white transition-all cursor-pointer"
            title={isMuted ? "Unmute drop sound" : "Mute drop sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-lime-400" />}
            <span className="hidden sm:inline">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/15 p-1 rounded-full text-xs font-mono">
            {GALLERY_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => setActiveSceneIdx(idx)}
                className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSceneIdx === idx
                    ? "bg-white text-black font-semibold shadow-md shadow-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {scene.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO MAIN CENTER */}
      <main className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        {/* Interactive Badge */}
        <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-lime-300 text-xs tracking-wider uppercase font-mono mb-5 shadow-xl">
          <Waves className="w-3.5 h-3.5 text-lime-400" />
          <span>Water Drop Ripple Engine</span>
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping ml-1" />
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.9] text-white drop-shadow-2xl max-w-5xl">
          Water
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-200 via-emerald-300 to-teal-200">
            Droplet
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl font-light tracking-wide leading-relaxed drop-shadow-lg">
          Click or move your cursor anywhere to drop water into the pool and watch realistic concentric wave ripples expand across the image.
        </p>

        {/* Action Buttons */}
        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => triggerWaterDrop(0.5, 0.5, 2.2)}
            className="px-8 py-3.5 rounded-full bg-lime-400 text-black font-bold text-sm tracking-wide hover:bg-lime-300 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-xl shadow-lime-500/20 cursor-pointer"
          >
            <Droplet className="w-4 h-4 fill-black" />
            <span>Drop In Center</span>
          </button>

          <button
            onClick={() => setAutoRain(!autoRain)}
            className="px-7 py-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white font-medium text-sm tracking-wide hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-lime-300" />
            <span>{autoRain ? "Pause Rain Drops" : "Enable Rain Drops"}</span>
          </button>
        </div>
      </main>

      {/* FOOTER STATUS */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 py-6 text-xs text-white/70 pointer-events-none font-mono">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span>Concentric Circular Wave Packets • Natural Decaying Physics</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/50">{sceneData.tagline}</span>
          <span className="text-lime-300 bg-black/40 border border-white/10 px-3 py-1 rounded-md">
            Drops Created: {dropCounter}
          </span>
        </div>
      </footer>
    </div>
  );
}
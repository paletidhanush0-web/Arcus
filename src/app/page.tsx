"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation, Pagination, EffectCoverflow, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Mobile menu state
  const [isMobOpen, setIsMobOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Portfolio filter state
  const [filterCategory, setFilterCategory] = useState("all");

  // Contact form state
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: false,
    phone: false,
  });
  const [formValidStatus, setFormValidStatus] = useState({
    email: "neutral", // neutral, valid, invalid
    phone: "neutral",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for Three.js canvases
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const aboutCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle header scroll class
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize Lenis, GSAP, and Swiper
  useEffect(() => {
    // ─── LENIS SMOOTH SCROLL ───
    let lenis: any;
    import("lenis").then(({ default: Lenis }) => {
      const isMobile = window.innerWidth <= 768;
      lenis = new Lenis({ smoothTouch: false, touchMultiplier: isMobile ? 0 : 2 } as any);
      function rafLenis(t: number) {
        lenis.raf(t);
        requestAnimationFrame(rafLenis);
      }
      requestAnimationFrame(rafLenis);
    });

    // ─── SWIPER CAROUSEL ───
    const swiper = new Swiper(".testimonials-swiper", {
      modules: [Navigation, Pagination, EffectCoverflow, Autoplay],
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: 2,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      speed: 800,
      coverflowEffect: {
        rotate: 20,
        stretch: -30,
        depth: 180,
        modifier: 1,
        slideShadows: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // ─── GSAP ANIMATIONS ───
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      // Hero entrance
      const entranceTl = gsap.timeline();
      entranceTl.to("#tagline", { opacity: 1, y: 0, scale: 1, duration: 2, ease: "expo.out", delay: 0.3 })
        .to("#hero-sub", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=1.2")
        .to("#scroll-hint", { opacity: 1, duration: 1 }, "-=.6");

      // Divider animations
      gsap.utils.toArray(".divider").forEach((d: any) => {
        gsap.to(d, {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: d, start: "top 90%", once: true },
        });
      });

      // Service cards hover/entrance staggers
      gsap.utils.toArray(".service-card").forEach((card: any, i: number) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });

      // Portfolio cards staggers
      gsap.utils.toArray(".portfolio-card").forEach((card: any, i: number) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    });

    // ─── INTERSECTION OBSERVER FOR REVEALS ───
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => io.observe(el));

    // ─── COUNTERS OBSERVER ───
    const animateCount = (el: HTMLElement) => {
      const targetAttr = el.getAttribute("data-count");
      if (!targetAttr) return;
      const target = parseInt(targetAttr);
      const suffix = target >= 10 ? "+" : "";
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 60);
        if (start >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = start + suffix;
        requestAnimationFrame(step);
      };
      step();
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.querySelectorAll(".stat-num").forEach((num) => animateCount(num as HTMLElement));
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    const statsSection = document.querySelector(".about-stats");
    if (statsSection) counterObserver.observe(statsSection);

    // Active nav link highlight on scroll
    const navAs = document.querySelectorAll(".nav-links a:not(.nav-cta)");
    const sections = ["about", "services", "clients", "testimonials", "careers", "contact"];
    const handleNavScroll = () => {
      let current = "";
      sections.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec && window.scrollY >= sec.offsetTop - 200) current = id;
      });
      navAs.forEach((a) => {
        const href = a.getAttribute("href");
        if (href === "#" + current) {
          (a as HTMLElement).style.color = "var(--color-secondary)";
        } else {
          (a as HTMLElement).style.color = "";
        }
      });
    };
    window.addEventListener("scroll", handleNavScroll, { passive: true });

    return () => {
      if (lenis) lenis.destroy();
      swiper.destroy();
      ctx.revert();
      io.disconnect();
      counterObserver.disconnect();
      window.removeEventListener("scroll", handleNavScroll);
    };
  }, []);

  // Three.js Background & About canvasses implementation
  useEffect(() => {
    if (!mainCanvasRef.current || !aboutCanvasRef.current) return;

    const isMobile = window.innerWidth <= 768;

    // ─── MAIN BACKGROUND THREE.JS SCENE ───
    const mainRenderer = new THREE.WebGLRenderer({
      canvas: mainCanvasRef.current,
      antialias: true,
      alpha: true,
    });
    mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mainRenderer.setSize(window.innerWidth, window.innerHeight);

    const mainScene = new THREE.Scene();
    const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    mainCamera.position.z = 6;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    mainScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x224096, 2, 100);
    pointLight1.position.set(5, 5, 5);
    mainScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x62B0E4, 1.5, 100);
    pointLight2.position.set(-5, -5, 5);
    mainScene.add(pointLight2);

    // Particles background
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
      colors[i] = Math.random();
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const mainParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    mainScene.add(mainParticles);

    // Main wireframe torus knot geometry
    const mainGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const mainMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      shininess: 100,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainScene.add(mainMesh);

    // Floating octahedrons
    const floatingGroup = new THREE.Group();
    mainScene.add(floatingGroup);
    const floaters: Array<{ mesh: THREE.Mesh; speed: number; rot: number }> = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 0.3 + 0.05;
      const g = new THREE.OctahedronGeometry(size, 0);
      const m = new THREE.MeshPhongMaterial({
        color: Math.random() > 0.5 ? 0x224096 : 0x62B0E4,
        transparent: true,
        opacity: 0.4,
      });
      const b = new THREE.Mesh(g, m);
      b.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10 - 5);
      floatingGroup.add(b);
      floaters.push({
        mesh: b,
        speed: Math.random() * 0.005 + 0.002,
        rot: Math.random() * 0.02,
      });
    }

    // Parallax mouse movements
    let mouseX = 0,
      mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 150;
      mouseY = (e.clientY - window.innerHeight / 2) / 150;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle viewport resize
    const onResize = () => {
      mainCamera.aspect = window.innerWidth / window.innerHeight;
      mainCamera.updateProjectionMatrix();
      mainRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // GSAP ScrollTrigger fly-out linking
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: !isMobile,
        pinSpacing: !isMobile,
        onUpdate: (self) => {
          const speed = Math.abs(self.getVelocity());
          mainParticles.scale.z = 1 + speed * 0.0005;
          particlesMaterial.opacity = 0.5 + speed * 0.0002;
        },
      },
    });
    const lines = document.querySelectorAll(".hero-tagline .line");
    heroTl.to(lines, {
      scale: 5,
      opacity: 0,
      filter: "blur(30px)",
      stagger: 0.1,
      duration: 1,
      y: (i) => (i - 1) * 100,
      ease: "power2.in",
    });
    heroTl.to(mainMesh.scale, { x: 8, y: 8, z: 8, duration: 1 }, 0);
    heroTl.to(mainMesh.rotation, { x: Math.PI, y: Math.PI, duration: 1 }, 0);
    heroTl.to(mainCamera.position, { z: 1, duration: 1 }, 0);

    // ─── ABOUT SECTION MINI CANVAS THREE.JS SCENE ───
    const aboutRenderer = new THREE.WebGLRenderer({
      canvas: aboutCanvasRef.current,
      antialias: true,
      alpha: true,
    });
    const aboutScene = new THREE.Scene();
    const aboutCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    aboutCamera.position.z = 4;
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const aboutLight1 = new THREE.PointLight(0x224096, 3, 100);
    aboutLight1.position.set(3, 3, 3);
    aboutScene.add(aboutLight1);

    const aboutLight2 = new THREE.PointLight(0x62B0E4, 2, 100);
    aboutLight2.position.set(-3, -3, 3);
    aboutScene.add(aboutLight2);
    aboutScene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Globe grid wireframe
    const aboutGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const aboutMat = new THREE.MeshPhongMaterial({
      color: 0x224096,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      shininess: 100,
    });
    const aboutMesh = new THREE.Mesh(aboutGeo, aboutMat);
    aboutScene.add(aboutMesh);

    // Core icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x62B0E4,
      transparent: true,
      opacity: 0.15,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    aboutScene.add(coreMesh);

    // Outer rings
    const ringGeo = new THREE.RingGeometry(1.7, 1.72, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x62B0E4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    aboutScene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    aboutScene.add(ring2);

    // Mini points particles
    const apCount = 600;
    const apPos = new Float32Array(apCount * 3);
    const apCol = new Float32Array(apCount * 3);
    for (let i = 0; i < apCount * 3; i++) {
      apPos[i] = (Math.random() - 0.5) * 10;
      apCol[i] = Math.random() > 0.5 ? 1.0 : 0.3;
    }
    const apGeo = new THREE.BufferGeometry();
    apGeo.setAttribute("position", new THREE.BufferAttribute(apPos, 3));
    apGeo.setAttribute("color", new THREE.BufferAttribute(apCol, 3));
    const apMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const apPoints = new THREE.Points(apGeo, apMat);
    aboutScene.add(apPoints);

    const resizeAboutCanvas = () => {
      const wrap = document.querySelector(".about-3d-wrap");
      if (!wrap || !aboutCanvasRef.current) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      aboutRenderer.setSize(w, h);
      aboutCamera.aspect = w / h;
      aboutCamera.updateProjectionMatrix();
    };
    resizeAboutCanvas();
    window.addEventListener("resize", resizeAboutCanvas);

    // ─── MAIN ANIMATION LOOP ───
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate background meshes
      mainMesh.rotation.x += 0.003;
      mainMesh.rotation.y += 0.003;
      mainCamera.position.x += (mouseX - mainCamera.position.x) * 0.05;
      mainCamera.position.y += (-mouseY - mainCamera.position.y) * 0.05;
      mainCamera.lookAt(mainScene.position);
      mainParticles.rotation.y += 0.0005;

      // Float octahedrons
      floaters.forEach((f) => {
        f.mesh.rotation.x += f.rot;
        f.mesh.rotation.y += f.rot;
        f.mesh.position.y += Math.sin(Date.now() * 0.001 * f.speed * 100) * 0.005;
      });
      mainRenderer.render(mainScene, mainCamera);

      // Rotate about globe elements
      if (aboutMesh && coreMesh && ring1 && ring2) {
        aboutMesh.rotation.y += 0.008;
        aboutMesh.rotation.x += 0.004;
        coreMesh.rotation.y -= 0.006;
        ring1.rotation.z += 0.01;
        ring2.rotation.z -= 0.008;
        aboutRenderer.render(aboutScene, aboutCamera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", resizeAboutCanvas);
      mainRenderer.dispose();
      aboutRenderer.dispose();
      heroTl.scrollTrigger?.kill();
    };
  }, []);

  // Form validations and submit actions
  const validateEmail = (val: string) => {
    if (!val) return "neutral";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    return ok ? "valid" : "invalid";
  };

  const validatePhone = (val: string) => {
    if (!val) return "neutral";
    const ok = /^[+]?[\d\s\-()]{7,15}$/.test(val.trim());
    return ok ? "valid" : "invalid";
  };

  const handleFieldBlur = (field: "email" | "phone") => {
    if (field === "email") {
      setFormValidStatus((prev) => ({ ...prev, email: validateEmail(formValues.email) }));
    } else if (field === "phone") {
      setFormValidStatus((prev) => ({ ...prev, phone: validatePhone(formValues.phone) }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Reset outline errors on input
    if (name === "fname" || name === "lname" || name === "message") {
      const el = document.getElementById(name);
      if (el) el.style.borderColor = "";
    }

    if (name === "email" && (formValidStatus.email === "valid" || formValidStatus.email === "invalid")) {
      setFormValidStatus((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "phone" && (formValidStatus.phone === "valid" || formValidStatus.phone === "invalid")) {
      setFormValidStatus((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailStatus = validateEmail(formValues.email);
    const phoneStatus = validatePhone(formValues.phone);
    const fnameOk = formValues.fname.trim().length >= 2;
    const lnameOk = formValues.lname.trim().length >= 2;
    const messageOk = formValues.message.trim().length >= 10;

    setFormValidStatus({ email: emailStatus, phone: phoneStatus });

    if (
      emailStatus === "invalid" ||
      phoneStatus === "invalid" ||
      !fnameOk ||
      !lnameOk ||
      !messageOk
    ) {
      if (!fnameOk) {
        const el = document.getElementById("fname");
        if (el) el.style.borderColor = "#ef4444";
      }
      if (!lnameOk) {
        const el = document.getElementById("lname");
        if (el) el.style.borderColor = "#ef4444";
      }
      if (!messageOk) {
        const el = document.getElementById("message");
        if (el) el.style.borderColor = "#ef4444";
      }
      return;
    }

    setIsSubmitting(true);

    // ── Collect values for WhatsApp redirect ──
    const waText = [
      "🔔 *New Contact Form Submission — ARCUS*",
      "",
      `👤 *Name:* ${formValues.fname} ${formValues.lname}`,
      `📧 *Email:* ${formValues.email}`,
      formValues.phone ? `📱 *Phone:* ${formValues.phone}` : null,
      formValues.service ? `🛠️ *Service:* ${formValues.service}` : null,
      "",
      `💬 *Message:*\n${formValues.message}`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const waURL = "https://wa.me/919398874337?text=" + encodeURIComponent(waText);
    window.open(waURL, "_blank");

    // Reset and popup show
    setTimeout(async () => {
      setFormValues({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      setFormValidStatus({ email: "neutral", phone: "neutral" });
      setIsSubmitting(false);
      setShowSuccess(true);
      document.body.style.overflow = "hidden";
      spawnConfetti();

      // Trigger serverless API route silently in background
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
      } catch (err) {
        // silent fallback
      }
    }, 800);
  };

  const closeSuccessPopup = () => {
    setShowSuccess(false);
    document.body.style.overflow = "";
  };

  const spawnConfetti = () => {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    container.innerHTML = "";
    const colors = ["#224096", "#62B0E4", "#5288D1", "#94A3B8", "#FFFFFF", "#082A4D"];
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement("div");
      dot.className = "confetti-dot";
      dot.style.cssText = [
        "left:" + (8 + Math.random() * 84) + "%",
        "background:" + colors[Math.floor(Math.random() * colors.length)],
        "animation-delay:" + Math.random() * 0.5 + "s",
        "animation-duration:" + (0.9 + Math.random() * 0.6) + "s",
        "width:" + (5 + Math.random() * 6) + "px",
        "height:" + (5 + Math.random() * 6) + "px",
        "border-radius:" + (Math.random() > 0.5 ? "50%" : "2px"),
      ].join(";");
      container.appendChild(dot);
    }
  };

  return (
    <>
      <div className="grain-overlay"></div>
      <canvas ref={mainCanvasRef} id="webgl-canvas" aria-hidden="true" />

      {/* ── NAV ── */}
      <header role="banner">
        <nav id="main-nav" className={isScrolled ? "scrolled" : ""} role="navigation" aria-label="Main Navigation">
          <Link href="/" className="logo" title="ARCUS" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/logo.png" alt="ARCUS Logo" className="logo-img" style={{ height: "34px", width: "auto", objectFit: "contain" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFFFFF", letterSpacing: "3.5px" }}>ARCUS</span>
          </Link>
          <ul className="nav-links" role="list">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Work</a></li>
            <li><a href="#clients">Clients</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-mobile-cta">
            <button className={`hamburger ${isMobOpen ? "active" : ""}`} aria-label="Menu" id="hamburger" onClick={() => setIsMobOpen(!isMobOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-overlay ${isMobOpen ? "open" : ""}`} id="mob-overlay" onClick={() => setIsMobOpen(false)} />
      <div className={`mobile-menu ${isMobOpen ? "open" : ""}`} id="mob-menu">
        <a href="#about" onClick={() => setIsMobOpen(false)}>About Us</a>
        <a href="#services" onClick={() => setIsMobOpen(false)}>Services</a>
        <a href="#portfolio" onClick={() => setIsMobOpen(false)}>Work</a>
        <a href="#clients" onClick={() => setIsMobOpen(false)}>Clients</a>
        <a href="#testimonials" onClick={() => setIsMobOpen(false)}>Testimonials</a>
        <Link href="/careers" onClick={() => setIsMobOpen(false)}>Careers</Link>
        <a href="#contact" onClick={() => setIsMobOpen(false)} style={{ color: "var(--color-accent)" }}>Contact Us</a>
      </div>

      <main role="main">
        {/* HERO SECTION */}
        <section className="section" id="hero" aria-label="ARCUS Hero">
          <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
            <h1>ARCUS — IT Company in Guntur, Andhra Pradesh, India</h1>
            <p>Leading IT company in Guntur offering web development, mobile apps, UI/UX, branding & digital marketing. Contact: paletidhanush0@gmail.com</p>
          </div>
          <div className="hero-content">
            <h1 className="hero-tagline" id="tagline" style={{ opacity: 0, transform: "translateY(40px)" }}>
              <div className="line">Empowering Your <span>Brand</span></div>
              <div className="line">Through <span>Technology</span></div>
              <div className="line">and <span>Creativity</span></div>
            </h1>
            <p className="hero-sub" id="hero-sub" style={{ opacity: 0, transform: "translateY(20px)" }}>
              We craft world-class digital experiences that transform brands and drive measurable growth — from Guntur to the world.
            </p>
          </div>
          <div className="scroll-indicator" id="scroll-hint" style={{ opacity: 0 }}>
            <span className="scroll-text">Scroll to Explore</span>
            <div className="scroll-line"></div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="section" id="about" aria-label="About ARCUS">
          <div className="about-inner">
            <div className="reveal-left">
              <span className="about-label">Who We Are</span>
              <h2 className="about-heading">Crafting <em>Digital Excellence</em> from Guntur</h2>
              <p className="about-body">ARCUS is a premier IT company based in Guntur, Andhra Pradesh. We are a team of passionate designers, developers, and strategists who believe that technology should be beautiful, functional, and transformative.</p>
              <p className="about-body">From startups to enterprises, we partner with ambitious businesses across India to build products that leave a lasting impression — on their users and in their market.</p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-num" data-count="3">0</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" data-count="3">0</span>
                  <span className="stat-label">Clients</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" data-count="1">0</span>
                  <span className="stat-label">Year Exp</span>
                </div>
              </div>
            </div>
            <div className="about-visual reveal-right">
              <div className="about-3d-wrap">
                <canvas ref={aboutCanvasRef} id="about-canvas" className="about-canvas" />
              </div>
              <div className="about-badge">Est. 2026 · Guntur, AP</div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="section" id="services" aria-label="ARCUS Services">
          <div className="section-header reveal">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Services that <em>Drive Growth</em></h2>
            <p className="section-desc">From concept to deployment, we deliver end-to-end technology solutions that transform how businesses engage with their audiences.</p>
          </div>
          <div className="divider"></div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            <article className="service-card">
              <div className="service-icon">💻</div>
              <div className="service-num">01</div>
              <h3 className="service-name">Custom Website Development</h3>
              <p className="service-desc">High-performance, secure, and fully customized web systems, SaaS platforms, and enterprise sites tailored for your business success.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">📈</div>
              <div className="service-num">02</div>
              <h3 className="service-name">Digital Marketing & Lead Generation</h3>
              <p className="service-desc">Data-driven performance campaigns, high-converting PPC systems, and optimized lead flows designed to explode your pipeline.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">🎨</div>
              <div className="service-num">03</div>
              <h3 className="service-name">Graphic Design & Brand Identity</h3>
              <p className="service-desc">Distinctive corporate logos, beautiful marketing collaterals, and cohesive visual systems that reflect your company's core values.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">⚡</div>
              <div className="service-num">04</div>
              <h3 className="service-name">SEO & Performance Optimization</h3>
              <p className="service-desc">Advanced search engine indexing strategies, organic keyword ranking, and technical speed audits that place you on Google's top page.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">🛒</div>
              <div className="service-num">05</div>
              <h3 className="service-name">E-Commerce Solutions</h3>
              <p className="service-desc">Full-featured digital storefronts, checkout flow optimizations, secure gateways, and enterprise integrations that drive massive sales.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">🚀</div>
              <div className="service-num">06</div>
              <h3 className="service-name">Technology & Business Consulting</h3>
              <p className="service-desc">High-agency roadmap guidance, custom software architecture planning, tech-stack consulting, and structural business audit scaling.</p>
            </article>
            <article className="service-card">
              <div className="service-icon">🎬</div>
              <div className="service-num">07</div>
              <h3 className="service-name">Social Media & Video Production</h3>
              <p className="service-desc">Engaging brand page management, high-impact Instagram Reels/videos, creative poster/graphics design, and customized content strategies that drive massive followings.</p>
            </article>
          </div>
        </section>

        {/* PORTFOLIO SECTION */}
        <section className="section" id="portfolio" aria-label="ARCUS Portfolio">
          <div className="portfolio-header-wrapper">
            <div className="section-header reveal-left">
              <span className="section-label">Selected Work</span>
              <h2 className="section-title">Recent Products We've <em>Shipped</em></h2>
              <p className="section-desc">Explore our project portfolio — from E-commerce platforms to custom dashboards — each one shipped end-to-end.</p>
            </div>
            <div className="portfolio-actions reveal-right">
              <div className="portfolio-filter-select-wrapper">
                <select id="portfolio-filter" aria-label="Filter Projects" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Projects</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="booking">Travel Booking</option>
                  <option value="webapp">Web Application</option>
                </select>
                <div className="portfolio-filter-arrow">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <a href="#portfolio" className="portfolio-see-all">See All</a>
            </div>
          </div>

          <div className="divider"></div>

          <div className="portfolio-grid">
            {(filterCategory === "all" || filterCategory === "ecommerce") && (
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="portfolio-card" data-category="ecommerce">
                <div className="portfolio-img-wrap">
                  <img src="/om-naturals.png" alt="OM Naturals E-commerce Showcase" className="portfolio-img" loading="lazy" />
                </div>
                <div className="portfolio-info">
                  <h3 className="portfolio-card-title">OM Naturals</h3>
                  <div className="portfolio-badges">
                    <span className="portfolio-badge">E-Commerce</span>
                    <span className="portfolio-badge">Shipped</span>
                    <span className="portfolio-badge">Live</span>
                  </div>
                </div>
              </a>
            )}

            {(filterCategory === "all" || filterCategory === "booking") && (
              <a href="https://www.tsboattourism.org/" target="_blank" rel="noopener noreferrer" className="portfolio-card" data-category="booking">
                <div className="portfolio-img-wrap">
                  <img src="/ts-boat-tourism.png" alt="TS Boat Tourism Booking Showcase" className="portfolio-img" loading="lazy" />
                </div>
                <div className="portfolio-info">
                  <h3 className="portfolio-card-title">TS Boat Tourism</h3>
                  <div className="portfolio-badges">
                    <span className="portfolio-badge">Travel Booking</span>
                    <span className="portfolio-badge">Shipped</span>
                    <span className="portfolio-badge">Live</span>
                  </div>
                </div>
              </a>
            )}

            {(filterCategory === "all" || filterCategory === "webapp") && (
              <a href="https://my-hostel-web-six.vercel.app/" target="_blank" rel="noopener noreferrer" className="portfolio-card" data-category="webapp">
                <div className="portfolio-img-wrap">
                  <img src="/my-hostel.png" alt="MyHostel Management System Showcase" className="portfolio-img" loading="lazy" />
                </div>
                <div className="portfolio-info">
                  <h3 className="portfolio-card-title">MyHostel</h3>
                  <div className="portfolio-badges">
                    <span className="portfolio-badge">Web Application</span>
                    <span className="portfolio-badge">Shipped</span>
                    <span className="portfolio-badge">Live</span>
                  </div>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* CLIENTS SECTION */}
        <section className="section" id="clients" aria-label="Our Clients" style={{ minHeight: "auto", padding: "5rem 0" }}>
          <div className="clients-header reveal">
            <span className="section-label">Trusted By</span>
            <h2 className="section-title">Brands That <em>Believe in Us</em></h2>
            <p className="section-desc" style={{ maxWidth: "500px", margin: "0 auto" }}>From startups to established enterprises — we've helped them all grow.</p>
          </div>

          <div className="clients-marquee-wrap" style={{ marginTop: "3rem" }}>
            <div className="clients-track" id="track1" style={{ gap: "2.5rem", alignItems: "center" }}>
              {/* OM Natural brands set */}
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" />
                  <path d="M12 17c1.5-1.5 1.5-3.5 0-5-1.5 1.5-1.5 3.5 0 5z" fill="currentColor" opacity="0.3" />
                </svg>
                <span style={{ fontWeight: 800, color: "var(--color-primary)" }}>OM Natural</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 3v18M3 12h18M12 3l9 9-9 9-9-9 9-9z" />
                </svg>
                <span>Chekka Ganuga</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <span>Wood Pressed Groundnut</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                <span>Cold Pressed Coconut</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Traditional Sesame Oil</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-17.93c-3.95.49-7 3.85-7 7.93 0 4.42 3.58 8 8 8 4.08 0 7.44-3.05 7.93-7H11V4.07z" />
                </svg>
                <span>Pure Almond Oil</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <span>100% Organic & Pure</span>
              </a>

              {/* Duplicate set for seamless continuous horizontal loop */}
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" />
                  <path d="M12 17c1.5-1.5 1.5-3.5 0-5-1.5 1.5-1.5 3.5 0 5z" fill="currentColor" opacity="0.3" />
                </svg>
                <span style={{ fontWeight: 800, color: "var(--color-primary)" }}>OM Natural</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 3v18M3 12h18M12 3l9 9-9 9-9-9 9-9z" />
                </svg>
                <span>Chekka Ganuga</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <span>Wood Pressed Groundnut</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                <span>Cold Pressed Coconut</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Traditional Sesame Oil</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-secondary)" }}>
                  <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-17.93c-3.95.49-7 3.85-7 7.93 0 4.42 3.58 8 8 8 4.08 0 7.44-3.05 7.93-7H11V4.07z" />
                </svg>
                <span>Pure Almond Oil</span>
              </a>
              <a href="https://www.om-naturals.com/" target="_blank" rel="noopener noreferrer" className="client-chip" style={{ textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "20px", height: "20px", color: "var(--color-accent)" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                <span>100% Organic & Pure</span>
              </a>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="section" id="testimonials" aria-label="Client Testimonials">
          <div className="section-header reveal">
            <span className="section-label">What They Say</span>
            <h2 className="section-title">Words from Our <em>Clients</em></h2>
            <p className="section-desc">Real results, real relationships. Here's what the people we work with have to say.</p>
          </div>
          <div className="divider"></div>

          <div className="swiper testimonials-swiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide testimonial-slide">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"ARCUS delivered a state-of-the-art platform that exceeded our expectations. The Three.js animations are stunning and load fast!"</p>
                <div className="testi-author">
                  <div className="testi-avatar">R</div>
                  <div>
                    <div className="testi-name">Rajesh Mehta</div>
                    <div className="testi-role">Founder, Barcelona Salon</div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide testimonial-slide">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"The branding and corporate design system they made for us is outstanding. Our brand recognition has grown significantly."</p>
                <div className="testi-author">
                  <div className="testi-avatar">P</div>
                  <div>
                    <div className="testi-name">Pooja Patel</div>
                    <div className="testi-role">Director, Aura Beauty Studio</div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide testimonial-slide">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"An agency that brings high agency. Arcus Technologies has been a phenomenal software engineering partner."</p>
                <div className="testi-author">
                  <div className="testi-avatar">N</div>
                  <div>
                    <div className="testi-name">Nitin Shah</div>
                    <div className="testi-role">CTO, Radhe Developers</div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide testimonial-slide">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"Our Google ranking exploded. We are getting twice as many leads now through their SEO systems."</p>
                <div className="testi-author">
                  <div className="testi-avatar">A</div>
                  <div>
                    <div className="testi-name">Amit Vyas</div>
                    <div className="testi-role">CEO, Shreenathji Villa</div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide testimonial-slide">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"Professional, reactive, and highly creative. ARCUS is definitely the premier IT company in Andhra Pradesh."</p>
                <div className="testi-author">
                  <div className="testi-avatar">S</div>
                  <div>
                    <div className="testi-name">Sanjay Amin</div>
                    <div className="testi-role">MD, Shree Krishnam Rubtech</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section" id="contact" aria-label="Contact ARCUS">
          <div className="section-header reveal" style={{ marginBottom: "3rem" }}>
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Let's Build Something <em>World-Class</em></h2>
            <p className="section-desc">Ready to transform your brand? Tell us about your project and we'll get back within 24 hours.</p>
          </div>
          <div className="contact-wrapper">
            <div className="reveal-left">
              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <div className="contact-info-label">Location</div>
                  <div className="contact-info-value" style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
                    Door No. 3-46, Ponnekallu Village,<br />Tadikonda Mandal, Guntur District,<br />Andhra Pradesh, India.
                  </div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div>
                  <div className="contact-info-label">Call Us</div>
                  <div className="contact-info-value">
                    <a href="tel:+919398874337" style={{ color: "inherit", textDecoration: "none" }}>+91 93988 74337</a>
                  </div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">✉️</div>
                <div>
                  <div className="contact-info-label">Email Us</div>
                  <div className="contact-info-value">
                    <a href="mailto:paletidhanush0@gmail.com" style={{ color: "inherit" }}>paletidhanush0@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">🕐</div>
                <div>
                  <div className="contact-info-label">Response Time</div>
                  <div className="contact-info-value">Within 24 hours</div>
                </div>
              </div>
              <address style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                ARCUS, Door No. 3-46, Ponnekallu Village, Tadikonda Mandal, Guntur District, Andhra Pradesh, India. Founder & CEO: Dhanush Sai Paleti, Email: paletidhanush0@gmail.com, Phone: +91 93988 74337
              </address>
            </div>
            <div className="contact-form-wrap reveal-right">
              <form id="contact-form" onSubmit={handleFormSubmit} noValidate autoComplete="off">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fname">First Name *</label>
                    <input className="form-input" type="text" id="fname" name="fname" placeholder="Rahul" required value={formValues.fname} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lname">Last Name *</label>
                    <input className="form-input" type="text" id="lname" name="lname" placeholder="Sharma" required value={formValues.lname} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <div className="field-label-row">
                      <label className="form-label" htmlFor="email" style={{ marginBottom: 0 }}>Email Address *</label>
                      <span className={`field-status ${formValidStatus.email === "valid" ? "show-valid" : formValidStatus.email === "invalid" ? "show-invalid" : ""}`} id="status-email">
                        {formValidStatus.email === "valid" ? "✓ Valid" : formValidStatus.email === "invalid" ? "✕ Invalid" : ""}
                      </span>
                    </div>
                    <input className={`form-input ${formValidStatus.email === "valid" ? "valid" : formValidStatus.email === "invalid" ? "invalid" : ""}`} type="email" id="email" name="email" placeholder="rahul@company.com" required value={formValues.email} onChange={handleInputChange} onBlur={() => handleFieldBlur("email")} />
                    <div className={`form-error ${formValidStatus.email === "invalid" ? "show" : ""}`} id="err-email">Enter a valid email address.</div>
                  </div>
                  <div className="form-group">
                    <div className="field-label-row">
                      <label className="form-label" htmlFor="phone" style={{ marginBottom: 0 }}>Phone</label>
                      <span className={`field-status ${formValidStatus.phone === "valid" ? "show-valid" : formValidStatus.phone === "invalid" ? "show-invalid" : ""}`} id="status-phone">
                        {formValidStatus.phone === "valid" ? "✓ Valid" : formValidStatus.phone === "invalid" ? "✕ Invalid" : ""}
                      </span>
                    </div>
                    <input className={`form-input ${formValidStatus.phone === "valid" ? "valid" : formValidStatus.phone === "invalid" ? "invalid" : ""}`} type="tel" id="phone" name="phone" placeholder="+91 98765 43210" value={formValues.phone} onChange={handleInputChange} onBlur={() => handleFieldBlur("phone")} />
                    <div className={`form-error ${formValidStatus.phone === "invalid" ? "show" : ""}`} id="err-phone">Enter a valid phone number.</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="service">Service Needed</label>
                  <select className="form-select" id="service" name="service" value={formValues.service} onChange={handleInputChange}>
                    <option value="">Select a service…</option>
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="UI / UX Design">UI / UX Design</option>
                    <option value="Branding & Identity">Branding &amp; Identity</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Social Media & Video Production">Social Media &amp; Video Production</option>
                    <option value="Tech Consulting">Tech Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Tell Us About Your Project *</label>
                  <textarea className="form-textarea" id="message" name="message" placeholder="Describe your project, goals, and timeline…" required value={formValues.message} onChange={handleInputChange}></textarea>
                </div>
                <button type="submit" className="form-submit" id="form-submit-btn" disabled={isSubmitting}>
                  <span>{isSubmitting ? "Sending…" : "Send Message →"}</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CAREERS CTA SECTION */}
        <section className="section" id="careers" aria-label="Careers at ARCUS">
          <div className="careers-cta-wrap reveal">
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)", opacity: 0.15, pointerEvents: "none" }}></div>
            <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)", opacity: 0.15, pointerEvents: "none" }}></div>
            <span className="section-label">Join Our Journey</span>
            <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>Build the Future <em>With Us</em></h2>
            <p className="section-desc" style={{ maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
              We're a team of passionate creators, engineers, and dreamers based in Guntur, building world-class products. We value craft, curiosity, and high agency. If you love what you do, we'd love to have you onboard.
            </p>
            <Link href="/careers" className="btn-primary" style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}>
              View Open Opportunities &rarr;
            </Link>
          </div>
        </section>
      </main>

      {/* ── SUCCESS POPUP MODAL ── */}
      <div className={`success-popup-overlay ${showSuccess ? "active" : ""}`} id="success-popup-overlay" role="dialog" aria-modal="true" aria-label="Message Sent Successfully" onClick={(e) => e.target === e.currentTarget && closeSuccessPopup()}>
        <div className="success-popup" id="success-popup">
          <div className="success-popup-bg-glow"></div>
          <div className="confetti-container" id="confetti-container"></div>
          <button className="success-popup-x" id="success-popup-x" aria-label="Close" onClick={closeSuccessPopup}>
            <svg viewBox="0 0 14 14">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
          <div className="success-popup-icon-wrap">
            <svg viewBox="0 0 48 48">
              <path className="success-checkmark-path" d="M10 25l10 10 20-20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="success-popup-badge">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="var(--color-accent)">
              <circle cx="4.5" cy="4.5" r="4.5" />
            </svg>
            Message Delivered
          </div>
          <div className="success-popup-title">We Got Your<br /><span>Message!</span></div>
          <p className="success-popup-desc">Thank you for reaching out. Our team will review your project and get back to you shortly.</p>
          <div className="success-popup-details">
            <div className="success-detail-chip">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
              Response in 24h
            </div>
            <div className="success-detail-chip">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
              Email Confirmation
            </div>
          </div>
          <button className="success-popup-close" id="success-popup-close" onClick={closeSuccessPopup}>Back to Site ✦</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer role="contentinfo">
        <div className="footer-main">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <img src="/logo.png" alt="ARCUS Logo" className="logo-img footer-brand-img" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFFFFF", letterSpacing: "3.5px" }}>ARCUS</span>
            </div>
            <p className="footer-brand-desc">Empowering brands through technology and creativity. Premium IT solutions from Guntur, Andhra Pradesh.</p>
            <div className="footer-socials">
              <a className="footer-soc" href="#" title="LinkedIn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a className="footer-soc" href="#" title="Instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a className="footer-soc" href="#" title="Twitter / X" aria-label="Twitter">
                <svg viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a className="footer-soc" href="mailto:paletidhanush0@gmail.com" title="Email" aria-label="Email">
                <svg viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#clients">Clients</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">App Development</a></li>
              <li><a href="#services">UI / UX Design</a></li>
              <li><a href="#services">Digital Marketing</a></li>
              <li><a href="#services">Branding</a></li>
              <li><a href="#services">Social Media &amp; Video Production</a></li>
              <li><a href="#services">Tech Consulting</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:paletidhanush0@gmail.com">paletidhanush0@gmail.com</a></li>
              <li><a href="tel:+919398874337">+91 93988 74337</a></li>
              <li><a href="#contact">Send a Message</a></li>
              <li>
                <span style={{ color: "rgba(255,255,255,.25)", fontSize: ".8rem", lineHeight: 1.6 }}>
                  Door No. 3-46, Ponnekallu Village,<br />Tadikonda Mandal, Guntur District,<br />Andhra Pradesh, India.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 ARCUS — Guntur, Andhra Pradesh, India. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}

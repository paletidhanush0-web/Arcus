"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface JobListing {
  type: string;
  title: string;
  desc: string;
  details: string[];
  applySubject: string;
}

const jobListings: JobListing[] = [
  {
    type: "Full-Time",
    title: "Senior Frontend Engineer (Creative/WebGL)",
    desc: "We are seeking a highly skilled Senior Frontend Engineer with experience in Three.js, GSAP, and creative web animations. You will build world-class web applications and interactive landing pages that leave a lasting impression.",
    details: ["Guntur, AP", "5+ Years Exp", "React · WebGL"],
    applySubject: "Senior Frontend Engineer Application",
  },
  {
    type: "Full-Time",
    title: "Senior Full-Stack Developer (Node.js/Postgres)",
    desc: "Join our core engineering team to build scalable APIs, database architectures, and robust SaaS solutions. Experience with Node.js, Express, Postgres, and cloud environments is highly valued.",
    details: ["Guntur, AP", "4+ Years Exp", "Full-Stack · Backend"],
    applySubject: "Senior Full-Stack Developer Application",
  },
  {
    type: "Full-Time",
    title: "UI/UX & Graphic Designer",
    desc: "Looking for a creative UI/UX designer who can design stunning wireframes, responsive mobile interfaces, and clean corporate brand identities. Mastery of Figma and Adobe Suite is a must.",
    details: ["Guntur, AP", "3+ Years Exp", "UI/UX · Figma"],
    applySubject: "UI/UX Designer Application",
  },
  {
    type: "Part-Time",
    title: "Business Development Executive (BDE)",
    desc: "Enthusiastic individual to join our team as a BDE. You will be responsible for lead generation, client outreach, and driving business growth. Perfect for those with strong communication skills and a passion for the IT industry.",
    details: ["Guntur, AP", "Freshers Welcome", "BDE · IT Sales"],
    applySubject: "Business Development Executive (BDE) Application",
  },
];

export default function Careers() {
  const [isMobOpen, setIsMobOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle header scroll class
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize Lenis, GSAP
  useEffect(() => {
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

    const ctx = gsap.context(() => {
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

      // Animate cards on scroll entrance
      gsap.utils.toArray(".career-card").forEach((card: any, i: number) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
    });

    // Reveal elements visibility via IntersectionObserver
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      if (lenis) lenis.destroy();
      ctx.revert();
      io.disconnect();
    };
  }, []);

  // Initialize Three.js Background canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x224096, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x62B0E4, 1.5, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

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
    scene.add(mainParticles);

    // Wireframe Mesh
    const geoType = Math.random() > 0.5 ? new THREE.IcosahedronGeometry(2, 1) : new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      shininess: 100,
    });
    const mainMesh = new THREE.Mesh(geoType, material);
    scene.add(mainMesh);

    // Floaters
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      mainMesh.rotation.x += 0.003;
      mainMesh.rotation.y += 0.003;
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      mainParticles.rotation.y += 0.0005;
      floaters.forEach((f) => {
        f.mesh.rotation.x += f.rot;
        f.mesh.rotation.y += f.rot;
        f.mesh.position.y += Math.sin(Date.now() * 0.001 * f.speed * 100) * 0.005;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div className="grain-overlay"></div>
      <canvas ref={canvasRef} id="webgl-canvas" aria-hidden="true" />

      {/* ── NAV ── */}
      <header role="banner">
        <nav id="main-nav" className={isScrolled ? "scrolled" : ""} role="navigation" aria-label="Main Navigation">
          <Link href="/" className="logo" title="ARCUS" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/logo.png" alt="ARCUS Logo" className="logo-img" style={{ height: "34px", width: "auto", objectFit: "contain" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFFFFF", letterSpacing: "3.5px" }}>ARCUS</span>
          </Link>
          <ul className="nav-links" role="list">
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#portfolio">Work</Link></li>
            <li><Link href="/#clients">Clients</Link></li>
            <li><Link href="/#testimonials">Testimonials</Link></li>
            <li><Link href="/careers" style={{ color: "var(--color-secondary)" }}>Careers</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
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
        <Link href="/#about" onClick={() => setIsMobOpen(false)}>About Us</Link>
        <Link href="/#services" onClick={() => setIsMobOpen(false)}>Services</Link>
        <Link href="/#portfolio" onClick={() => setIsMobOpen(false)}>Work</Link>
        <Link href="/#clients" onClick={() => setIsMobOpen(false)}>Clients</Link>
        <Link href="/#testimonials" onClick={() => setIsMobOpen(false)}>Testimonials</Link>
        <Link href="/careers" style={{ color: "var(--color-secondary)" }} onClick={() => setIsMobOpen(false)}>Careers</Link>
        <Link href="/#contact" onClick={() => setIsMobOpen(false)}>Contact Us</Link>
      </div>

      <main role="main">
        {/* CAREERS SECTION */}
        <section className="section" id="careers" aria-label="Careers at ARCUS">
          <div className="section-header reveal">
            <span className="section-label">Join Our Team</span>
            <h1 className="section-title">Build the Future <em>With Us</em></h1>
            <p className="section-desc">We&apos;re a team that values curiosity, craft, and ambition. If you love what you do, we want to hear from you.</p>
          </div>
          <div className="divider"></div>

          <div className="careers-grid">
            {jobListings.map((job, i) => (
              <div key={i} className="career-card" style={{ opacity: 0, transform: "translateY(45px)" }}>
                <div><span className="career-tag">{job.type}</span></div>
                <h3 className="career-title">{job.title}</h3>
                <p style={{ fontSize: ".88rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{job.desc}</p>
                <div className="career-details">
                  {job.details.map((det, index) => (
                    <span key={index} className="career-detail">{det}</span>
                  ))}
                </div>
                <a href={`mailto:paletidhanush0@gmail.com?subject=${encodeURIComponent(job.applySubject)}`} className="career-apply">Apply Now →</a>
              </div>
            ))}
          </div>

          <div className="careers-cta reveal">
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.2rem", fontSize: ".95rem" }}>
              Don&apos;t see your role? We&apos;re always looking for great talent.
            </p>
            <a href="mailto:paletidhanush0@gmail.com" className="btn-primary">Send Open Application →</a>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer>
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
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/#clients">Clients</Link></li>
              <li><Link href="/#testimonials">Testimonials</Link></li>
              <li><Link href="/careers" style={{ color: "var(--color-secondary)" }}>Careers</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              <li><Link href="/#services">Web Development</Link></li>
              <li><Link href="/#services">App Development</Link></li>
              <li><Link href="/#services">UI / UX Design</Link></li>
              <li><Link href="/#services">Digital Marketing</Link></li>
              <li><Link href="/#services">Branding</Link></li>
              <li><Link href="/#services">Social Media &amp; Video Production</Link></li>
              <li><Link href="/#services">Tech Consulting</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:paletidhanush0@gmail.com">paletidhanush0@gmail.com</a></li>
              <li><a href="tel:+919398874337">+91 93988 74337</a></li>
              <li><Link href="/#contact">Send a Message</Link></li>
              <li>
                <span style={{ color: "rgba(255,255,255,.25)", fontSize: "0.8rem", lineHeight: 1.6 }}>
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

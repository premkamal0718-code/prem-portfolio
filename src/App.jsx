
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Mail,
} from "lucide-react";
import "./App.css";
import GraphicDesignPortfolio from "./GraphicDesignPortfolio";

/* Video files are expected in public/projects/.
   Client logos are expected in public/clients/. */
const clientProjects = [
  {
    name: "Wholesome Bakes",
    logo: "/clients/client-1.png",
    videos: Array.from({ length: 8 }, (_, i) =>
      `/projects/client-1-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Adwaitha Clinics",
    logo: "/clients/client-2.png",
    videos: Array.from({ length: 8 }, (_, i) =>
      `/projects/client-2-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Scala modular Factory",
    logo: "/clients/client-3.png",
    videos: Array.from({ length: 5 }, (_, i) =>
      `/projects/client-3-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Mihira Studios",
    logo: "/clients/client-4.png",
    videos: Array.from({ length: 3 }, (_, i) =>
      `/projects/client-4-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Kolours HealthCare",
    logo: "/clients/client-5.png",
    videos: Array.from({ length: 6 }, (_, i) =>
      `/projects/client-5-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Kidz R Kidz Play School",
    logo: "/clients/client-6.png",
    videos: Array.from({ length: 4 }, (_, i) =>
      `/projects/client-6-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Hilife Pest Controls",
    logo: "/clients/client-7.png",
    videos: Array.from({ length: 11 }, (_, i) =>
      `/projects/client-7-video-${i + 1}.mp4`
    ),
  },
  {
    name: "Raasi Visions",
    logo: "/clients/client-8.png",
    videos: Array.from({ length: 6 }, (_, i) =>
      `/projects/client-8-video-${i + 1}.mp4`
    ),
  },
];

/* One row for each client */
function ClientRow({
  client,
  index,
  activeVideoId,
  setActiveVideoId,
}) {
  const trackRef = useRef(null);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  function handlePointerDown(event) {
    // Preserve the native video controls.
    if (
      event.target.closest("video, button") ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: trackRef.current.scrollLeft,
      moved: false,
    };

    trackRef.current.classList.add("is-dragging");
    trackRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragRef.current.active || !trackRef.current) return;

    const distance = event.clientX - dragRef.current.startX;

    if (Math.abs(distance) > 5) {
      dragRef.current.moved = true;
    }

    if (dragRef.current.moved) {
      trackRef.current.scrollLeft =
        dragRef.current.startScroll - distance;
    }
  }

  function handlePointerUp(event) {
    dragRef.current.active = false;

    if (!trackRef.current) return;

    trackRef.current.classList.remove("is-dragging");

    if (trackRef.current.hasPointerCapture(event.pointerId)) {
      trackRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function handleVideoEnter(videoId) {
    setActiveVideoId(videoId);
  }

  function handleVideoLeave(videoId, videoElement) {
    videoElement.pause();

    setActiveVideoId((current) =>
      current === videoId ? null : current
    );
  }

  return (
    <article className="client-row">
      {/* Client logo and name */}
      <div className="client-heading">
        <div className="client-identity">
          <div className="client-logo-wrap">
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <span className="client-logo-fallback">
              {client.name.charAt(0)}
            </span>
          </div>

          <div className="client-details">
            <span className="client-index">
              CLIENT / {String(index + 1).padStart(2, "0")}
            </span>

            <h3>{client.name}</h3>

            <p>Video Editing &amp; Visual Storytelling</p>
          </div>
        </div>

        <span className="client-video-count">
          {String(client.videos.length).padStart(2, "0")} VIDEOS
        </span>
      </div>

      {/* Independently scrollable video gallery */}
      <div
        className="client-video-track"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(event) => event.preventDefault()}
        role="region"
        aria-label={`${client.name} video gallery. Drag horizontally to explore.`}
        tabIndex={0}
      >
        {client.videos.map((video, videoIndex) => {
          const videoId = `${index}-${videoIndex}`;
          const isActive = activeVideoId === videoId;

          return (
            <div
              className={`client-video-card ${
                isActive ? "video-playing" : ""
              }`}
              key={video}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  handleVideoEnter(videoId);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") {
                  const videoElement =
                    event.currentTarget.querySelector("video");

                  if (videoElement) {
                    handleVideoLeave(videoId, videoElement);
                  }
                }
              }}
            >
              <video
                data-video-id={videoId}
                src={video}
                controls
                playsInline
                preload="metadata"
                onPlay={() => setActiveVideoId(videoId)}
                onEnded={() => {
                  setActiveVideoId((current) =>
                    current === videoId ? null : current
                  );
                }}
                onError={() => {
                  console.error("Could not load video:", video);
                }}
              />

              <div className="client-video-overlay">
                <span>
                  VIDEO / {String(videoIndex + 1).padStart(2, "0")}
                </span>

                <span className="client-play-icon">
                  {isActive ? "▶" : "↗"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const closeMenu = () => setMenuOpen(false);

  // Different visual effects on successive clicks and taps.
  useEffect(() => {
    let effectIndex = 0;
    const effects = ["tap-ripple", "tap-burst", "tap-star"];

    const handlePageClick = (event) => {
      if (
        typeof event.clientX !== "number" ||
        typeof event.clientY !== "number"
      ) {
        return;
      }

      const effectType = effects[effectIndex % effects.length];
      effectIndex += 1;

      const effect = document.createElement("div");
      effect.className = `click-fx ${effectType}`;
      effect.style.left = `${event.clientX}px`;
      effect.style.top = `${event.clientY}px`;
      effect.setAttribute("aria-hidden", "true");

      if (effectType === "tap-burst") {
        ["✦", "✧", "✳", "·", "✦", "＋"].forEach(
          (symbol, index) => {
            const particle = document.createElement("span");
            particle.className = "click-particle";
            particle.textContent = symbol;
            particle.style.setProperty(
              "--particle-index",
              String(index)
            );
            effect.appendChild(particle);
          }
        );
      } else if (effectType === "tap-star") {
        effect.textContent = "✳";
      }

      document.body.appendChild(effect);

      effect.addEventListener(
        "animationend",
        () => effect.remove(),
        { once: true }
      );

      window.setTimeout(() => effect.remove(), 1200);
    };

    document.addEventListener("click", handlePageClick);

    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, []);

  // Only the selected video can continue playing.
  useEffect(() => {
    const videos = document.querySelectorAll(
      ".client-video-card video"
    );

    videos.forEach((video) => {
      if (video.dataset.videoId !== activeVideoId) {
        video.pause();
      }
    });

    if (activeVideoId === null) return;

    const activeVideo = Array.from(videos).find(
      (video) => video.dataset.videoId === activeVideoId
    );

    if (activeVideo && activeVideo.paused) {
      activeVideo.play().catch(() => {
        // Browser autoplay restrictions may require a Play click.
      });
    }
  }, [activeVideoId]);

  return (
    <main>
      {/* Background and interaction animation styles */}
      <style>{`
        body {
          position: relative;
          isolation: isolate;
          overflow-x: clip;
        }

        #root {
          position: relative;
          z-index: 1;
        }

        /* Subtle creative grid */
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(197, 255, 65, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(197, 255, 65, 0.035) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          -webkit-mask-image: linear-gradient(
            to bottom,
            black,
            transparent 90%
          );
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 90%
          );
        }

        /* Ambient lime-green glow */
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 8% 22%,
              rgba(197, 255, 65, 0.07),
              transparent 23rem
            ),
            radial-gradient(
              circle at 92% 68%,
              rgba(100, 255, 170, 0.045),
              transparent 25rem
            );
          animation: ambient-drift 12s ease-in-out infinite alternate;
        }

        @keyframes ambient-drift {
          from {
            opacity: 0.55;
            transform: scale(1);
          }
          to {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        /* All click effects */
        .click-fx {
          position: fixed;
          z-index: 99999;
          pointer-events: none;
          user-select: none;
          transform: translate(-50%, -50%);
        }

        /* Effect 1: expanding ripple */
        .tap-ripple {
          width: 16px;
          height: 16px;
          border: 2px solid #c5ff41;
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(197, 255, 65, 0.35);
          animation: ripple-pop 650ms ease-out forwards;
        }

        @keyframes ripple-pop {
          0% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(0.3);
          }
          70% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(4.5);
          }
        }

        /* Effect 2: creative particle burst */
        .tap-burst {
          width: 1px;
          height: 1px;
        }

        .click-particle {
          position: absolute;
          left: 0;
          top: 0;
          color: #c5ff41;
          font-size: 17px;
          text-shadow: 0 0 12px rgba(197, 255, 65, 0.7);
          animation: particle-pop 700ms cubic-bezier(0.2, 0.8, 0.2, 1)
            forwards;
        }

        .click-particle:nth-child(2) {
          --dx: 28px;
          --dy: -26px;
        }

        .click-particle:nth-child(3) {
          --dx: 34px;
          --dy: 13px;
        }

        .click-particle:nth-child(4) {
          --dx: -28px;
          --dy: 27px;
        }

        .click-particle:nth-child(5) {
          --dx: -35px;
          --dy: -12px;
        }

        .click-particle:nth-child(6) {
          --dx: 2px;
          --dy: -38px;
        }

        .click-particle:nth-child(odd) {
          color: #fff;
        }

        @keyframes particle-pop {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform:
              translate(var(--dx, 12px), var(--dy, -24px))
              scale(1.4)
              rotate(150deg);
          }
        }

        /* Effect 3: rotating star */
        .tap-star {
          color: #c5ff41;
          font-size: 30px;
          line-height: 1;
          text-shadow: 0 0 18px rgba(197, 255, 65, 0.8);
          animation: star-pop 750ms ease-out forwards;
        }

        @keyframes star-pop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2) rotate(-60deg);
          }
          35% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(30deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -75%) scale(0.7) rotate(130deg);
          }
        }

        /* Respect reduced-motion preferences */
        @media (prefers-reduced-motion: reduce) {
          body::after {
            animation: none;
          }

          .click-fx,
          .click-particle {
            animation-duration: 1ms !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="logo" onClick={closeMenu}>
          PK<span>.</span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#video-work" onClick={closeMenu}>Video Editing</a>
          <a href="#design-work" onClick={closeMenu}>Graphic Design</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
        </div>

        <a className="nav-contact" href="#contact">
          Let's Talk <ArrowUpRight size={16} />
        </a>
      </nav>

      {/* Chapter 1: Home / Hero */}
      <section className="hero" id="home">
        <div className="hero-glow" />

        {/* Floating creative software badges */}
        <div className="floating-tools" aria-hidden="true">
          <span className="tool-logo tool-pr">Pr</span>
          <span className="tool-logo tool-capcut">Cc</span>
          <span className="tool-logo tool-alight">Al</span>
          <span className="tool-logo tool-canva">Canva</span>

          <span className="tool-logo tool-figma">
            <span className="figma-mark">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>

          <span className="tool-logo tool-ps">Ps</span>
          <span className="tool-logo tool-lightroom">Lr</span>
          <span className="tool-logo tool-picsart">P</span>
          <span className="tool-logo tool-snapseed">S</span>
        </div>

        <div className="hero-content">
          <div className="availability">
            <span className="status-dot" />
            VIDEO EDITOR &amp; GRAPHIC DESIGNER &amp; VISUAL STORYTELLER
          </div>

          <p className="eyebrow">
            CREATIVE MINDS. VISUAL STORIES.
          </p>

          
<h1 className="hero-animated-heading">
  VIDEO EDITOR
  <br />
  &amp; GRAPHIC
  <br />
  <span className="outline-text">DESIGNER.</span>
</h1>

<p className="visual-storyteller">
  <span className="storyteller-line" />
  <span>VISUAL STORYTELLER</span>
</p>


          <p className="hero-description">
            I'm Prem Kamal Nandigala, a video editor and graphic
            designer passionate about transforming ideas into
            powerful visuals, engaging videos, and memorable
            creative experiences.
          </p>

          <div className="hero-actions">
            <a href="#video-work" className="button-primary">
              View My Work <ArrowDownRight size={19} />
            </a>

            <a href="#contact" className="button-secondary">
              Contact Me <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="hero-meta">
            <span>VIDEO EDITING</span>
            <span className="meta-divider">/</span>
            <span>GRAPHIC DESIGN</span>
          </div>
        </div>

        {/* Portrait */}
        <div className="hero-visual photo-only">
          <div className="portrait-glow" />

          <img
            src="/images/profile.png"
            alt="Prem Kamal Nandigala"
            className="profile-photo-clean"
            onError={(event) => {
              console.error(
                "Profile image could not load:",
                event.currentTarget.src
              );
            }}
          />
        </div>

        <div className="hero-index">01 / 08</div>
      </section>

      {/* Chapter 2: About Me */}
      <section className="about-section" id="about">
        <div className="about-heading">
          <span className="section-kicker">
            01 — GET TO KNOW ME
          </span>

          <h2>
            BEHIND EVERY FRAME,
            <br />
            <span>THERE'S A STORY.</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-label">
            <span className="about-number">01</span>
            <span>ABOUT THE CREATIVE</span>
          </div>

          <div className="about-content">
            <h3>
              Hi, I'm <span>Prem Kamal Nandigala.</span>
            </h3>

            <p>
              I'm a video editor and graphic designer who loves
              turning ideas into meaningful visual experiences.
              From engaging short-form videos to eye-catching
              graphics, I focus on creating work that captures
              attention and communicates a story.
            </p>

            <p>
              My creative process combines storytelling, timing,
              colour, typography, and visual composition to bring
              each project to life. I believe every detail
              contributes to making a design or video memorable.
            </p>

            <div className="about-specialties">
              <div>
                <span className="specialty-symbol">↗</span>
                <h4>Video Editing</h4>
                <p>
                  Reels, shorts, promotional content, and
                  cinematic edits.
                </p>
              </div>

              <div>
                <span className="specialty-symbol">✳</span>
                <h4>Graphic Design</h4>
                <p>
                  Posters, social media graphics, and creative
                  visuals.
                </p>
              </div>
            </div>

            <a href="#video-work" className="about-link">
              EXPLORE MY WORK <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Chapter 3: Video Editing — 8 Clients */}
      <section className="video-portfolio" id="video-work">
        <div className="portfolio-topline">
          <span className="section-kicker">
            02 — VIDEO EDITING
          </span>

          <span className="portfolio-count">
          
          </span>
        </div>

        <div className="portfolio-heading">
          <div>
            <h2>
              WORK THAT
              <br />
              <span>MAKES AN IMPACT.</span>
            </h2>

            <p>
              A collection of video editing work created for
              different clients, brands, and creative projects.
            </p>
          </div>

          <span className="portfolio-big-number">08</span>
        </div>

        <div className="client-list">
          {clientProjects.map((client, index) => (
            <ClientRow
              key={client.name}
              client={client}
              index={index}
              activeVideoId={activeVideoId}
              setActiveVideoId={setActiveVideoId}
            />
          ))}
        </div>
      </section>

      {/* Chapter 4: Original Graphic Design Portfolio */}
      <GraphicDesignPortfolio />

      {/* Chapter 6: Skills & Tools */}
      <section className="skills-preview" id="skills">
        <span className="section-kicker">
          04 — MY CREATIVE TOOLKIT
        </span>

        <h2>
          TOOLS I USE TO
          <br />
          BRING IDEAS TO LIFE.
        </h2>

        <div className="skill-tags">
          <span>Adobe Premiere Pro</span>
          <span>CapCut</span>
          <span>Alight Motion</span>
          <span>Canva</span>
          <span>Figma</span>
          <span>Photoshop</span>
          <span>Picsart</span>
          <span>Snapseed</span>
          <span>Lightroom</span>
        </div>
      </section>

      {/* Chapter 8: Contact */}
      <section className="contact-preview" id="contact">
        <span className="section-kicker">
          LET'S CREATE SOMETHING
        </span>

        <h2>
          HAVE A PROJECT
          <br />
          <span>IN MIND?</span>
        </h2>

        <p className="contact-description">
          Have an idea, a project, or a story to tell?
          Let's turn it into something memorable.
        </p>

        <a
          href="mailto:premkamal0718@gmail.com?subject=Project%20Inquiry"
          className="button-primary"
        >
          Get In Touch <Mail size={18} />
        </a>

        <div className="contact-details">
          <a
            href="tel:7671987929"
            className="contact-detail-link"
          >
            <span className="contact-icon" aria-hidden="true">☎</span>
            <span>
              <small>CALL ME</small>
              <strong>7671987929</strong>
            </span>
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://www.instagram.com/mr.____.prem/"
            target="_blank"
            rel="noreferrer"
            className="contact-detail-link"
          >
            <span className="contact-icon" aria-hidden="true">◎</span>
            <span>
              <small>INSTAGRAM</small>
              <strong>@mr.____.prem</strong>
            </span>
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <a
          href="https://www.instagram.com/mr.____.prem/"
          target="_blank"
          rel="noreferrer"
          className="instagram-qr-link"
          aria-label="Tap to open my Instagram profile"
        >
          <img
            src="/instagram-qr.png"
            alt="Instagram QR code"
            className="instagram-qr"
          />
          <span>SCAN OR TAP TO CONNECT</span>
        </a>

        <p className="contact-email">
          premkamal0718@gmail.com
        </p>
      </section>

      {/* Footer */}
      <footer>
        <a href="#home" className="logo">
          PK<span>.</span>
        </a>

        <span>
          © {new Date().getFullYear()} Prem Kamal Nandigala
        </span>

        <a
          href="https://www.instagram.com/mr.____.prem/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="footer-social"
        >
          Instagram ↗
        </a>

        <a
          href="tel:7671987929"
          className="footer-social"
        >
          Call ↗
        </a>
      </footer>
    </main>
  );
}

export default App;

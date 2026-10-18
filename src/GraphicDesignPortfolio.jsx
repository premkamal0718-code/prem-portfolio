import React, { useState } from "react";
import { ExternalLink, FileText, X } from "lucide-react";
import "./GraphicDesignPortfolio.css";

// These logo paths match the filenames shown in your public/clients folder.
const posterClients = [
  {
    name: "Wholesome Bakes Posters ",
    displayName: "Wholesome Bakes Posters",
    logo: "/clients/poster-client-1.webp",
    folder: "client-1",
    count: 16,
  },
  {
    name: "Hilife Pest Control Posters",
    displayName: "Hilife Pest Control Posters",
    logo: "/clients/poster-client-2.png",
    folder: "client-2",
    count: 9,
  },
  {
    name: "I9 Security & Facilities PVT LTD Posters",
    displayName: "I9 Security & Facilities PVT LTD Posters",
    logo: "/clients/poster-client-3.png",
    folder: "client-3",
    count: 3,
  },
  {
    name: "Triopath Careers Posters",
    displayName: "Triopath Careers Posters",
    logo: "/clients/poster-client-4.jpeg",
    folder: "client-4",
    count: 9,
  },
  {
    name: "Adwaitha Clinics Posters",
    displayName: "Adwaitha Clinics Posters",
    logo: "/clients/poster-client-5.png",
    folder: "client-5",
    count: 9,
  },
  {
    name: "Scala Modular Factory Posters",
    displayName: "Scala Modular Factory Posters",
    logo: "/clients/poster-client-6.jpg",
    folder: "client-6",
    count: 1,
  },
];

const businessCardClients = [
  { name: "Scala Modular Factory", logo: "/clients/business-client-1.gif", folder: "client-1" },
  { name: "I9 Security & Facilities PVT LTD", logo: "/clients/business-client-2.png", folder: "client-2" },
  { name: "Q Space Interiors", logo: "/clients/business-client-3.png", folder: "client-3" },
];

const profileClients = [
  { name: "Hilife Pest Control", logo: "/clients/profile-client-1.png", folder: "client-1", count: 1 },
  { name: "Scala Modular Factory", logo: "/clients/profile-client-2.gif", folder: "client-2", count: 1 },
];

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "tif", "tiff", "JPG", "JPEG", "PNG", "WEBP", "TIFF"];

function unique(items) {
  return [...new Set(items)];
}


function imageCandidates(folder, index) {
  const number = index + 1;
  const twoDigits = String(number).padStart(2, "0");
  const stems = [
    `poster-${number}`,
    `poster-${twoDigits}`,
    `poster_${number}`,
    `poster_${twoDigits}`,
    `Poster-${number}`,
    `Poster-${twoDigits}`,
  ];
  const extensions = ["jpg", "jpeg", "png", "webp", "gif", "tiff", "tif"];

  return unique(
    stems.flatMap((stem) =>
      extensions.map(
        (extension) => `/designs/posters/${folder}/${stem}.${extension}`
      )
    )
  );
}

function businessCandidates(folder, side) {
  const stems = side === "front"
    ? ["front", "Front", "front-side", "front_side", "business-card-front", "1", "01"]
    : ["back", "Back", "back-side", "back_side", "business-card-back", "2", "02"];

  return unique(stems.flatMap((stem) =>
    IMAGE_EXTENSIONS.map((extension) => `/designs/business-cards/${folder}/${stem}.${extension}`)
  ));
}

function profileCandidates(folder) {
  // Your screenshots show profile.pdf in both profile-branding client folders.
  return [
    `/designs/profile-branding/${folder}/profile.pdf`,
    `/designs/profile-branding/${folder}/Profile.pdf`,
    `/designs/profile-branding/${folder}/profile-01.pdf`,
    `/designs/profile-branding/${folder}/profile-1.pdf`,
  ];
}

function FallbackImage({ candidates, alt, className }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);

  if (notFound) {
    return (
      <span className="design-asset-placeholder">
        Image not found
        <small>Check the folder and filename</small>
      </span>
    );
  }

  return (
    <img
      src={candidates[candidateIndex]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setCandidateIndex((current) => current + 1);
        } else {
          setNotFound(true);
        }
      }}
    />
  );
}

function ClientHeader({ client, open, onClick, subtitle }) {
  return (
    <button
      type="button"
      className={`design-client-header ${open ? "is-open" : ""}`}
      onClick={onClick}
      aria-expanded={open}
    >
      <span className="design-client-logo-wrap">
        <img
          src={client.logo}
          alt={`${client.name} logo`}
          className="design-client-logo"
          loading="lazy"
          onError={(event) => { event.currentTarget.style.display = "none"; }}
        />
      </span>
      <span className="design-client-details">
        <span className="design-client-name">{client.displayName || client.name}</span>
        <span className="design-client-subtitle">{subtitle}</span>
      </span>
      <span className={`design-client-arrow ${open ? "is-open" : ""}`}>↗</span>
    </button>
  );
}

function PosterGallery({ client, openModal }) {
  return (
    <div className="poster-gallery-track">
      {Array.from({ length: client.count }, (_, index) => {
        const candidates = imageCandidates(client.folder, index);
        return (
          <button
            type="button"
            className="poster-card"
            key={`${client.folder}-${index}`}
            onClick={() => openModal(candidates, `${client.name} — Poster ${index + 1}`)}
            aria-label={`Open poster ${index + 1}`}
          >
            <span className="poster-card-number">{String(index + 1).padStart(2, "0")}</span>
            <FallbackImage candidates={candidates} alt={`${client.name} poster ${index + 1}`} />
            <span className="poster-card-open"><ExternalLink size={16} /></span>
          </button>
        );
      })}
    </div>
  );
}

function BusinessCardGallery({ client, openModal }) {
  return (
    <div className="business-card-gallery">
      {["front", "back"].map((side) => {
        const candidates = businessCandidates(client.folder, side);
        return (
          <button
            type="button"
            className="business-card-item"
            key={side}
            onClick={() => openModal(candidates, `${client.name} — ${side}`)}
          >
            <span className="business-card-image">
              <FallbackImage candidates={candidates} alt={`${client.name} ${side} business card`} />
              <span className="business-card-overlay"><ExternalLink size={18} /> View {side}</span>
            </span>
            <span className="business-card-label">{side[0].toUpperCase() + side.slice(1)} side</span>
          </button>
        );
      })}
    </div>
  );
}

function PdfPreview({ candidates, title }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);

  if (notFound) {
    return (
      <div className="design-asset-placeholder">
        PDF preview unavailable
        <small>Open the PDF to check the path</small>
      </div>
    );
  }

  return (
    <iframe
      src={`${candidates[candidateIndex]}#toolbar=0&navpanes=0&scrollbar=0`}
      title={title}
      loading="lazy"
      onError={() => {
        if (candidateIndex < candidates.length - 1) setCandidateIndex((current) => current + 1);
        else setNotFound(true);
      }}
    />
  );
}

function ProfileGallery({ client, openModal }) {
  const candidates = profileCandidates(client.folder);

  return (
    <div className="profile-pdf-gallery">
      <div className="profile-pdf-card">
        <div className="profile-pdf-preview">
          <PdfPreview candidates={candidates} title={`${client.name} profile PDF`} />
        </div>
        <div className="profile-pdf-info">
          <span className="profile-pdf-icon"><FileText size={19} /></span>
          <span className="profile-pdf-name">Profile PDF</span>
          <button
            type="button"
            className="profile-pdf-open"
            onClick={() => openModal(candidates, `${client.name} — Profile PDF`, true)}
          >
            Open PDF <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientRow({ client, subtitle, children }) {
  const [open, setOpen] = useState(false);

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <article
      className={`design-client-row ${open ? "is-open" : ""}`}
      onMouseEnter={() => {
        if (canHover()) setOpen(true);
      }}
      onMouseLeave={() => {
        if (canHover()) setOpen(false);
      }}
    >
      <ClientHeader
        client={client}
        subtitle={subtitle}
        open={open}
        onClick={() => setOpen((current) => !current)}
      />

      <div
        className={`design-client-gallery ${open ? "is-open" : ""}`}
        style={{
          display: open ? "block" : "none",
          height: "auto",
          maxHeight: "none",
          opacity: 1,
          overflow: "visible",
          gridTemplateRows: "1fr",
          visibility: open ? "visible" : "hidden",
        }}
        aria-hidden={!open}
      >
        <div
          className="design-client-gallery-inner"
          style={{
            display: "block",
            height: "auto",
            minHeight: "0",
            maxHeight: "none",
            overflow: "visible",
          }}
        >
          {children}
        </div>
      </div>
    </article>
  );
}

export default function GraphicDesignPortfolio() {
  const [modal, setModal] = useState(null);

  const openModal = (candidates, title, isPdf = false) => {
    setModal({ candidates, title, isPdf, candidateIndex: 0 });
  };

  const modalSrc = modal?.candidates[modal.candidateIndex];

  const tryNextModalCandidate = () => {
    setModal((current) => {
      if (!current || current.candidateIndex >= current.candidates.length - 1) return current;
      return { ...current, candidateIndex: current.candidateIndex + 1 };
    });
  };

  return (
    <section className="graphic-design-section" id="design-work">
      <div className="graphic-design-container">
        <div className="graphic-design-heading">
          <span className="section-kicker">03 — VISUAL DESIGN</span>
          <h2>DESIGN THAT<br /><span>LEAVES A MARK.</span></h2>
          <p>Visual stories built with purpose. Explore posters, business cards, and profile branding created for different clients.</p>
        </div>

        <div className="design-category">
          <div className="design-category-heading">
            <span className="design-category-number">01</span>
            <div><h3>Poster Designs</h3><p>Campaigns, promotions, and visual storytelling.</p></div>
            <span className="design-category-count">47 POSTERS</span>
          </div>
          <div className="design-client-list">
            {posterClients.map((client) => (
              <ClientRow key={client.folder} client={client} subtitle={`${client.count} posters`}>
                <PosterGallery client={client} openModal={openModal} />
              </ClientRow>
            ))}
          </div>
        </div>

        <div className="design-category">
          <div className="design-category-heading">
            <span className="design-category-number">02</span>
            <div><h3>Business Cards</h3><p>Front-and-back designs for professional identities.</p></div>
            <span className="design-category-count">3 CLIENTS</span>
          </div>
          <div className="design-client-list">
            {businessCardClients.map((client) => (
              <ClientRow key={client.folder} client={client} subtitle="Business card · Front & back">
                <BusinessCardGallery client={client} openModal={openModal} />
              </ClientRow>
            ))}
          </div>
        </div>

        <div className="design-category">
          <div className="design-category-heading">
            <span className="design-category-number">03</span>
            <div><h3>Profile Branding</h3><p>Personal and professional profile presentations.</p></div>
            <span className="design-category-count">2 PDFS</span>
          </div>
          <div className="design-client-list">
            {profileClients.map((client) => (
              <ClientRow key={client.folder} client={client} subtitle="1 PDF">
                <ProfileGallery client={client} openModal={openModal} />
              </ClientRow>
            ))}
          </div>
        </div>

        <div className="graphic-design-footer">
          <span>CONCEPT · DESIGN · DETAIL</span>
          <span>MADE TO STAND OUT <span className="lime-dot">●</span></span>
        </div>
      </div>

      {modal && (
        <div className="design-lightbox" role="dialog" aria-modal="true" aria-label={modal.title} onClick={() => setModal(null)}>
          <div className={`design-lightbox-content ${modal.isPdf ? "pdf-lightbox" : ""}`} onClick={(event) => event.stopPropagation()}>
            <div className="design-lightbox-toolbar">
              <span>{modal.title}</span>
              <div className="design-lightbox-actions">
                {modal.candidateIndex < modal.candidates.length - 1 && (
                  <button type="button" onClick={tryNextModalCandidate}>Try next filename</button>
                )}
                <a href={modalSrc} target="_blank" rel="noreferrer">Open original <ExternalLink size={15} /></a>
                <button type="button" onClick={() => setModal(null)} aria-label="Close preview"><X size={22} /></button>
              </div>
            </div>
            {modal.isPdf ? (
              <iframe className="design-lightbox-pdf" src={modalSrc} title={modal.title} />
            ) : (
              <FallbackImage candidates={modal.candidates.slice(modal.candidateIndex)} alt={modal.title} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

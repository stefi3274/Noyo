"use client";

import { useState } from "react";
import Image from "next/image";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <a href="#apropos" onClick={() => setOpen(false)}>
        À propos
      </a>
      <a href="#produits" onClick={() => setOpen(false)}>
        Produits
      </a>
      <a href="#fournisseurs" onClick={() => setOpen(false)}>
        Nos fournisseurs
      </a>
      <a href="#contact" onClick={() => setOpen(false)}>
        Contact
      </a>
      <a href="/inscription" className="btn btn-primary" onClick={() => setOpen(false)}>
        Rejoindre
      </a>
    </>
  );

  return (
    <header className="site-header">
      <a href="/" className="logo-link">
        <Image
          src="/logo-noyo.jpg"
          alt="Noyo — la vie commence ici, avec nous"
          width={160}
          height={130}
          priority
        />
      </a>

      <nav className="site-nav">{links}</nav>

      <button
        className="menu-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className="mobile-nav">
          {links}
        </nav>
      )}
    </header>
  );
}

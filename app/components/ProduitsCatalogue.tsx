"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export type Produit = {
  id: string;
  nom: string;
  description: string | null;
  image_url: string | null;
  categorie: string | null;
};

export default function ProduitsCatalogue({
  produits,
}: {
  produits: Produit[];
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    produits.forEach((p) => {
      if (p.categorie) set.add(p.categorie);
    });
    return Array.from(set);
  }, [produits]);

  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? produits.filter((p) => p.categorie === active)
    : produits;

  if (produits.length === 0) {
    return (
      <p className="produits-empty">Les premiers produits arrivent bientôt.</p>
    );
  }

  return (
    <>
      {categories.length > 1 && (
        <div className="filtres">
          <button
            className={`filtre-chip ${active === null ? "active" : ""}`}
            onClick={() => setActive(null)}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`filtre-chip ${active === c ? "active" : ""}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="catalogue-grid">
        {filtered.map((p) => (
          <article className="carte-produit" key={p.id}>
            <div className="carte-produit-photo">
              {p.image_url ? (
                <Image
                  src={p.image_url}
                  alt={p.nom}
                  fill
                  sizes="(max-width: 860px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="carte-produit-placeholder" />
              )}
              {p.categorie && (
                <span className="carte-produit-badge">{p.categorie}</span>
              )}
            </div>
            <div className="carte-produit-corps">
              <h3>{p.nom}</h3>
              {p.description && <p>{p.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

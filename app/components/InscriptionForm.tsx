"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const PROFILS = [
  { value: "acheteur", label: "Acheteur" },
  { value: "vendeur", label: "Vendeur" },
  { value: "fournisseur", label: "Fournisseur" },
];

export default function InscriptionForm({
  initialProfil,
}: {
  initialProfil?: string;
}) {
  const supabase = useMemo(() => getSupabase(), []);
  const defaultProfil = PROFILS.some((p) => p.value === initialProfil)
    ? (initialProfil as string)
    : "acheteur";

  const [profil, setProfil] = useState(defaultProfil);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error } = await supabase.from("inscriptions").insert({
      profil,
      nom,
      telephone,
      email: email || null,
      localisation: localisation || null,
      details: details || null,
    });

    setSaving(false);

    if (error) {
      setError("L'envoi a échoué. Réessaie dans un instant.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="inscription-succes">
        <p>
          Merci, {nom}. Ta demande a bien été reçue. Nous te contactons
          bientôt sur WhatsApp ou par téléphone.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form inscription-form">
      <div className="profil-switch">
        {PROFILS.map((p) => (
          <button
            type="button"
            key={p.value}
            className={`filtre-chip filtre-chip-dark ${
              profil === p.value ? "active" : ""
            }`}
            onClick={() => setProfil(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label>
        Nom complet
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </label>
      <label>
        Téléphone
        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />
      </label>
      <label>
        Email (optionnel)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Localisation
        <input
          type="text"
          placeholder="Ville, commune..."
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
        />
      </label>
      <label>
        {profil === "acheteur"
          ? "Quels produits recherches-tu ?"
          : "Quels produits proposes-tu ?"}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

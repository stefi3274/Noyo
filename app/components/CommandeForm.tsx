"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function CommandeForm() {
  const supabase = useMemo(() => getSupabase(), []);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [produits, setProduits] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error } = await supabase.from("commandes").insert({
      nom,
      telephone,
      localisation: localisation || null,
      produits,
    });

    setSaving(false);

    if (error) {
      console.error("Erreur Supabase (commandes):", error);
      setError("L'envoi a échoué. Réessaie dans un instant.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="inscription-succes">
        <p>
          Merci, {nom}. Ta commande a bien été reçue, on te recontacte
          bientôt pour la confirmer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>
        Nom
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Votre nom"
          required
        />
      </label>
      <label>
        Téléphone
        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Votre numéro"
          required
        />
      </label>
      <label>
        Localisation (pour la livraison)
        <input
          type="text"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          placeholder="Ville, commune..."
        />
      </label>
      <label>
        Produits souhaités
        <textarea
          value={produits}
          onChange={(e) => setProduits(e.target.value)}
          placeholder="Ex : 2 lb de cacao, 1 lb de café..."
          required
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Envoi..." : "Passer la commande"}
      </button>
    </form>
  );
}

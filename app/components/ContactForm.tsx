"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ContactForm() {
  const supabase = useMemo(() => getSupabase(), []);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [profil, setProfil] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error } = await supabase.from("messages").insert({
      nom,
      telephone,
      profil: profil || null,
      message: message || null,
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
          Merci, {nom}. Ton message a bien été reçu, on te répond bientôt
          sur WhatsApp ou par téléphone.
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
        Je suis...
        <select value={profil} onChange={(e) => setProfil(e.target.value)}>
          <option value="">Choisir un profil</option>
          <option value="acheteur">Acheteur</option>
          <option value="vendeur">Vendeur</option>
          <option value="fournisseur">Fournisseur</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message"
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}

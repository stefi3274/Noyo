"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const PROFILS = [
  { value: "acheteur", label: "Acheteur", titre: "Profil Acheteur" },
  { value: "vendeur", label: "Vendeur", titre: "Profil Vendeur" },
  {
    value: "fournisseur",
    label: "Fournisseur",
    titre: "Profil Fournisseur",
  },
];

const TYPES_COMMERCE = [
  "Commerçant(e)",
  "Transformateur / Transformatrice",
  "Pâtisserie",
  "Restaurant",
  "Autre",
];

const MAX_PHOTOS = 4;

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
  const titreActuel =
    PROFILS.find((p) => p.value === profil)?.titre ?? "Profil";
  const estProducteur = profil === "vendeur" || profil === "fournisseur";

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [details, setDetails] = useState("");

  // Profil Acheteur
  const [typeCommerce, setTypeCommerce] = useState("");
  const [nomCommerce, setNomCommerce] = useState("");

  // Profils Vendeur / Fournisseur
  const [espaceProduction, setEspaceProduction] = useState("");
  const [quantiteProduction, setQuantiteProduction] = useState("");
  const [productions, setProductions] = useState("");
  const [conditionsCulture, setConditionsCulture] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS);
    setPhotos(fichiers);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let photoUrls: string[] = [];

      if (estProducteur && photos.length > 0) {
        for (const fichier of photos) {
          const path = `${Date.now()}-${fichier.name}`;
          const { error: uploadError } = await supabase.storage
            .from("inscriptions")
            .upload(path, fichier);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("inscriptions")
            .getPublicUrl(path);
          photoUrls.push(data.publicUrl);
        }
      }

      const { error: insertError } = await supabase.from("inscriptions").insert({
        profil,
        nom,
        telephone,
        email: email || null,
        localisation: localisation || null,
        details: details || null,
        type_commerce: profil === "acheteur" ? typeCommerce || null : null,
        nom_commerce: profil === "acheteur" ? nomCommerce || null : null,
        espace_production: estProducteur ? espaceProduction || null : null,
        quantite_production: estProducteur ? quantiteProduction || null : null,
        productions: estProducteur ? productions || null : null,
        conditions_culture: estProducteur ? conditionsCulture || null : null,
        photos: photoUrls.length > 0 ? photoUrls : null,
      });

      if (insertError) throw insertError;

      setDone(true);
    } catch (err) {
      console.error("Erreur Supabase (inscriptions):", err);
      setError("L'envoi a échoué. Réessaie dans un instant.");
    } finally {
      setSaving(false);
    }
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
      <h2 className="inscription-role-titre">{titreActuel}</h2>

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

      {profil === "acheteur" && (
        <>
          <label>
            Type de commerce
            <select
              value={typeCommerce}
              onChange={(e) => setTypeCommerce(e.target.value)}
            >
              <option value="">Choisir...</option>
              {TYPES_COMMERCE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nom du commerce (optionnel)
            <input
              type="text"
              value={nomCommerce}
              onChange={(e) => setNomCommerce(e.target.value)}
            />
          </label>
        </>
      )}

      {estProducteur && (
        <>
          <label>
            Espace de production
            <input
              type="text"
              placeholder="Ex : 2 carreaux de terre"
              value={espaceProduction}
              onChange={(e) => setEspaceProduction(e.target.value)}
            />
          </label>
          <label>
            Quantité de production
            <input
              type="text"
              placeholder="Ex : 200 lb par récolte"
              value={quantiteProduction}
              onChange={(e) => setQuantiteProduction(e.target.value)}
            />
          </label>
          <label>
            Quelles productions ?
            <input
              type="text"
              placeholder="Ex : Cacao, Café, Pistache"
              value={productions}
              onChange={(e) => setProductions(e.target.value)}
            />
          </label>
          <label>
            Conditions de culture
            <textarea
              placeholder="Méthode de culture, usage de produits naturels ou chimiques, saisonnalité..."
              value={conditionsCulture}
              onChange={(e) => setConditionsCulture(e.target.value)}
            />
          </label>
          <label>
            Photos de l&apos;exploitation (jusqu&apos;à {MAX_PHOTOS})
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
            />
          </label>
          {photos.length > 0 && (
            <p className="admin-hint">
              {photos.length} photo{photos.length > 1 ? "s" : ""}{" "}
              sélectionnée{photos.length > 1 ? "s" : ""}.
            </p>
          )}
        </>
      )}

      <label>
        {profil === "acheteur"
          ? "Quels produits recherches-tu ?"
          : "Autre chose à préciser ? (optionnel)"}
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

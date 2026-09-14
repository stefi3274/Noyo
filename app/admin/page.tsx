"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

type Produit = {
  id: string;
  nom: string;
  description: string | null;
  image_url: string | null;
  categorie: string | null;
};

type Inscription = {
  id: string;
  profil: string;
  nom: string;
  telephone: string;
  email: string | null;
  localisation: string | null;
  details: string | null;
  created_at: string;
  traite: boolean;
  type_commerce: string | null;
  nom_commerce: string | null;
  espace_production: string | null;
  quantite_production: string | null;
  productions: string | null;
  conditions_culture: string | null;
  photos: string[] | null;
};

type Message = {
  id: string;
  nom: string;
  telephone: string;
  profil: string | null;
  message: string | null;
  created_at: string;
  traite: boolean;
};

type Commande = {
  id: string;
  nom: string;
  telephone: string;
  localisation: string | null;
  produits: string;
  created_at: string;
  traite: boolean;
};

const PROFIL_LABELS: Record<string, string> = {
  acheteur: "Acheteur",
  vendeur: "Vendeur",
  fournisseur: "Fournisseur",
};

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null | undefined>(
    undefined
  );
  const [produits, setProduits] = useState<Produit[]>([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [voirTraitees, setVoirTraitees] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [voirMessagesTraites, setVoirMessagesTraites] = useState(false);

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [voirCommandesTraitees, setVoirCommandesTraitees] = useState(false);

  const loadProduits = useCallback(async () => {
    const { data } = await supabase
      .from("produits")
      .select("id, nom, description, image_url, categorie")
      .order("created_at", { ascending: false });
    setProduits((data as Produit[]) ?? []);
  }, [supabase]);

  const loadHero = useCallback(async () => {
    const { data } = await supabase
      .from("parametres")
      .select("hero_image_url")
      .eq("id", 1)
      .maybeSingle();
    setHeroImageUrl(data?.hero_image_url ?? null);
  }, [supabase]);

  const loadInscriptions = useCallback(async () => {
    const { data } = await supabase
      .from("inscriptions")
      .select(
        "id, profil, nom, telephone, email, localisation, details, created_at, traite, type_commerce, nom_commerce, espace_production, quantite_production, productions, conditions_culture, photos"
      )
      .order("created_at", { ascending: false });
    setInscriptions((data as Inscription[]) ?? []);
  }, [supabase]);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("id, nom, telephone, profil, message, created_at, traite")
      .order("created_at", { ascending: false });
    setMessages((data as Message[]) ?? []);
  }, [supabase]);

  const loadCommandes = useCallback(async () => {
    const { data } = await supabase
      .from("commandes")
      .select("id, nom, telephone, localisation, produits, created_at, traite")
      .order("created_at", { ascending: false });
    setCommandes((data as Commande[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setSession(data.session);
      loadProduits();
      loadHero();
      loadInscriptions();
      loadMessages();
      loadCommandes();
    });
  }, [
    router,
    loadProduits,
    loadHero,
    loadInscriptions,
    loadMessages,
    loadCommandes,
  ]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let image_url: string | null =
        (editingId &&
          produits.find((p) => p.id === editingId)?.image_url) ||
        null;

      if (file) {
        const path = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("produits")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("produits")
          .getPublicUrl(path);
        image_url = data.publicUrl;
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("produits")
          .update({ nom, description, categorie: categorie || null, image_url })
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("produits")
          .insert({ nom, description, categorie: categorie || null, image_url });

        if (insertError) throw insertError;
      }

      setNom("");
      setDescription("");
      setCategorie("");
      setFile(null);
      setEditingId(null);
      await loadProduits();
    } catch (err) {
      setError(
        editingId
          ? "Impossible d'enregistrer les modifications. Réessaie."
          : "Impossible d'ajouter le produit. Réessaie."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(p: Produit) {
    setEditingId(p.id);
    setNom(p.nom);
    setDescription(p.description ?? "");
    setCategorie(p.categorie ?? "");
    setFile(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNom("");
    setDescription("");
    setCategorie("");
    setFile(null);
    setError(null);
  }

  async function handleDelete(id: string) {
    await supabase.from("produits").delete().eq("id", id);
    if (editingId === id) {
      handleCancelEdit();
    }
    await loadProduits();
  }

  async function handleHeroUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!heroFile) return;
    setHeroError(null);
    setHeroSaving(true);

    try {
      const path = `hero-${Date.now()}-${heroFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("produits")
        .upload(path, heroFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("produits").getPublicUrl(path);

      const { error: upsertError } = await supabase
        .from("parametres")
        .upsert({ id: 1, hero_image_url: data.publicUrl });

      if (upsertError) throw upsertError;

      setHeroFile(null);
      await loadHero();
    } catch (err) {
      setHeroError("Impossible d'enregistrer la photo. Réessaie.");
    } finally {
      setHeroSaving(false);
    }
  }

  async function handleHeroRemove() {
    await supabase.from("parametres").upsert({ id: 1, hero_image_url: null });
    await loadHero();
  }

  async function handleToggleTraite(id: string, traite: boolean) {
    setInscriptions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, traite: !traite } : i))
    );
    await supabase.from("inscriptions").update({ traite: !traite }).eq("id", id);
  }

  async function handleDeleteInscription(id: string) {
    setInscriptions((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("inscriptions").delete().eq("id", id);
  }

  async function handleToggleMessageTraite(id: string, traite: boolean) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, traite: !traite } : m))
    );
    await supabase.from("messages").update({ traite: !traite }).eq("id", id);
  }

  async function handleDeleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("messages").delete().eq("id", id);
  }

  async function handleToggleCommandeTraite(id: string, traite: boolean) {
    setCommandes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, traite: !traite } : c))
    );
    await supabase.from("commandes").update({ traite: !traite }).eq("id", id);
  }

  async function handleDeleteCommande(id: string) {
    setCommandes((prev) => prev.filter((c) => c.id !== id));
    await supabase.from("commandes").delete().eq("id", id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (session === undefined) {
    return null;
  }

  return (
    <div className="wrap admin-dashboard">
      <header className="admin-header">
        <a href="/" className="back-link">
          ← Retour au site
        </a>
        <button onClick={handleLogout} className="btn btn-outline">
          Se déconnecter
        </button>
      </header>

      <div className="admin-section-header">
        <h1>
          Inscriptions
          {inscriptions.some((i) => !i.traite) && (
            <span className="admin-badge-count">
              {inscriptions.filter((i) => !i.traite).length} nouvelle
              {inscriptions.filter((i) => !i.traite).length > 1 ? "s" : ""}
            </span>
          )}
        </h1>
        <label className="admin-toggle-traitees">
          <input
            type="checkbox"
            checked={voirTraitees}
            onChange={(e) => setVoirTraitees(e.target.checked)}
          />
          Afficher les inscriptions déjà traitées
        </label>
      </div>

      {inscriptions.filter((i) => voirTraitees || !i.traite).length === 0 ? (
        <p className="admin-hint">Aucune inscription pour le moment.</p>
      ) : (
        <ul className="admin-list admin-list-inscriptions">
          {inscriptions
            .filter((i) => voirTraitees || !i.traite)
            .map((i) => (
              <li
                key={i.id}
                className={`admin-inscription-item ${
                  i.traite ? "is-traitee" : ""
                }`}
              >
                <div className="admin-inscription-corps">
                  <div className="admin-inscription-entete">
                    <span className="admin-tag">
                      {PROFIL_LABELS[i.profil] ?? i.profil}
                    </span>
                    <strong>{i.nom}</strong>
                    <span className="admin-inscription-date">
                      {new Date(i.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="admin-inscription-contact">
                    {i.telephone}
                    {i.email ? ` · ${i.email}` : ""}
                    {i.localisation ? ` · ${i.localisation}` : ""}
                  </p>
                  {i.profil === "acheteur" &&
                    (i.type_commerce || i.nom_commerce) && (
                      <p className="admin-inscription-contact">
                        {i.type_commerce}
                        {i.nom_commerce ? ` · ${i.nom_commerce}` : ""}
                      </p>
                    )}
                  {(i.profil === "vendeur" || i.profil === "fournisseur") && (
                    <div className="admin-inscription-production">
                      {i.productions && (
                        <p>
                          <strong>Productions :</strong> {i.productions}
                        </p>
                      )}
                      {i.espace_production && (
                        <p>
                          <strong>Espace :</strong> {i.espace_production}
                        </p>
                      )}
                      {i.quantite_production && (
                        <p>
                          <strong>Quantité :</strong> {i.quantite_production}
                        </p>
                      )}
                      {i.conditions_culture && (
                        <p>
                          <strong>Conditions de culture :</strong>{" "}
                          {i.conditions_culture}
                        </p>
                      )}
                      {i.photos && i.photos.length > 0 && (
                        <div className="admin-inscription-photos">
                          {i.photos.map((url) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={url} src={url} alt="Photo de l'exploitation" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {i.details && (
                    <p className="admin-inscription-details">{i.details}</p>
                  )}
                </div>
                <div className="admin-list-actions">
                  <label className="admin-toggle-traite">
                    <input
                      type="checkbox"
                      checked={i.traite}
                      onChange={() => handleToggleTraite(i.id, i.traite)}
                    />
                    Traité
                  </label>
                  <button
                    onClick={() => handleDeleteInscription(i.id)}
                    className="admin-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <div className="admin-section-header" style={{ marginTop: 56 }}>
        <h1>
          Messages
          {messages.some((m) => !m.traite) && (
            <span className="admin-badge-count">
              {messages.filter((m) => !m.traite).length} nouveau
              {messages.filter((m) => !m.traite).length > 1 ? "x" : ""}
            </span>
          )}
        </h1>
        <label className="admin-toggle-traitees">
          <input
            type="checkbox"
            checked={voirMessagesTraites}
            onChange={(e) => setVoirMessagesTraites(e.target.checked)}
          />
          Afficher les messages déjà traités
        </label>
      </div>

      {messages.filter((m) => voirMessagesTraites || !m.traite).length ===
      0 ? (
        <p className="admin-hint">Aucun message pour le moment.</p>
      ) : (
        <ul className="admin-list admin-list-inscriptions">
          {messages
            .filter((m) => voirMessagesTraites || !m.traite)
            .map((m) => (
              <li
                key={m.id}
                className={`admin-inscription-item ${
                  m.traite ? "is-traitee" : ""
                }`}
              >
                <div className="admin-inscription-corps">
                  <div className="admin-inscription-entete">
                    {m.profil && (
                      <span className="admin-tag">
                        {PROFIL_LABELS[m.profil] ?? m.profil}
                      </span>
                    )}
                    <strong>{m.nom}</strong>
                    <span className="admin-inscription-date">
                      {new Date(m.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="admin-inscription-contact">{m.telephone}</p>
                  {m.message && (
                    <p className="admin-inscription-details">{m.message}</p>
                  )}
                </div>
                <div className="admin-list-actions">
                  <label className="admin-toggle-traite">
                    <input
                      type="checkbox"
                      checked={m.traite}
                      onChange={() => handleToggleMessageTraite(m.id, m.traite)}
                    />
                    Traité
                  </label>
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="admin-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <div className="admin-section-header" style={{ marginTop: 56 }}>
        <h1>
          Commandes
          {commandes.some((c) => !c.traite) && (
            <span className="admin-badge-count">
              {commandes.filter((c) => !c.traite).length} nouvelle
              {commandes.filter((c) => !c.traite).length > 1 ? "s" : ""}
            </span>
          )}
        </h1>
        <label className="admin-toggle-traitees">
          <input
            type="checkbox"
            checked={voirCommandesTraitees}
            onChange={(e) => setVoirCommandesTraitees(e.target.checked)}
          />
          Afficher les commandes déjà traitées
        </label>
      </div>

      {commandes.filter((c) => voirCommandesTraitees || !c.traite).length ===
      0 ? (
        <p className="admin-hint">Aucune commande pour le moment.</p>
      ) : (
        <ul className="admin-list admin-list-inscriptions">
          {commandes
            .filter((c) => voirCommandesTraitees || !c.traite)
            .map((c) => (
              <li
                key={c.id}
                className={`admin-inscription-item ${
                  c.traite ? "is-traitee" : ""
                }`}
              >
                <div className="admin-inscription-corps">
                  <div className="admin-inscription-entete">
                    <strong>{c.nom}</strong>
                    <span className="admin-inscription-date">
                      {new Date(c.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="admin-inscription-contact">
                    {c.telephone}
                    {c.localisation ? ` · ${c.localisation}` : ""}
                  </p>
                  <p className="admin-inscription-details">{c.produits}</p>
                </div>
                <div className="admin-list-actions">
                  <label className="admin-toggle-traite">
                    <input
                      type="checkbox"
                      checked={c.traite}
                      onChange={() => handleToggleCommandeTraite(c.id, c.traite)}
                    />
                    Traité
                  </label>
                  <button
                    onClick={() => handleDeleteCommande(c.id)}
                    className="admin-delete"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      <h1 style={{ marginTop: 56 }}>Photo du hero</h1>

      {heroImageUrl && (
        <div className="hero-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImageUrl} alt="Photo du hero actuelle" />
          <button onClick={handleHeroRemove} className="admin-delete">
            Retirer et revenir au visuel par défaut
          </button>
        </div>
      )}

      <form onSubmit={handleHeroUpload} className="contact-form admin-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
        />
        {heroError && <p className="admin-error">{heroError}</p>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={heroSaving || !heroFile}
        >
          {heroSaving ? "Envoi..." : "Changer la photo du hero"}
        </button>
      </form>

      <h1 style={{ marginTop: 56 }}>
        {editingId ? "Modifier le produit" : "Produits"}
      </h1>

      <form onSubmit={handleAdd} className="contact-form admin-form">
        <input
          type="text"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        >
          <option value="">Catégorie...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {editingId && (
          <p className="admin-hint">
            Laisse le champ photo vide pour garder la photo actuelle.
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? "Enregistrement..."
              : editingId
              ? "Enregistrer les modifications"
              : "Ajouter le produit"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCancelEdit}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <ul className="admin-list">
        {produits.map((p) => (
          <li key={p.id} className="admin-list-item">
            {p.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt={p.nom} />
            )}
            <div>
              <strong>{p.nom}</strong>
              {p.categorie && <span className="admin-tag">{p.categorie}</span>}
              {p.description && <p>{p.description}</p>}
            </div>
            <div className="admin-list-actions">
              <button
                onClick={() => handleEdit(p)}
                className="btn btn-outline"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="admin-delete"
              >
              Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

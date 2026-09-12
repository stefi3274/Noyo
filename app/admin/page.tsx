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

  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setSession(data.session);
      loadProduits();
      loadHero();
    });
  }, [router, loadProduits, loadHero]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      let image_url: string | null = null;

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

      const { error: insertError } = await supabase
        .from("produits")
        .insert({ nom, description, categorie: categorie || null, image_url });

      if (insertError) throw insertError;

      setNom("");
      setDescription("");
      setCategorie("");
      setFile(null);
      await loadProduits();
    } catch (err) {
      setError("Impossible d'ajouter le produit. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("produits").delete().eq("id", id);
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

      <h1>Photo du hero</h1>

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

      <h1 style={{ marginTop: 56 }}>Produits</h1>

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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Ajout..." : "Ajouter le produit"}
        </button>
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
            <button
              onClick={() => handleDelete(p.id)}
              className="admin-delete"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

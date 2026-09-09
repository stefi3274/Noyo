"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Produit = {
  id: string;
  nom: string;
  description: string | null;
  image_url: string | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(
    undefined
  );
  const [produits, setProduits] = useState<Produit[]>([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduits = useCallback(async () => {
    const { data } = await supabase
      .from("produits")
      .select("id, nom, description, image_url")
      .order("created_at", { ascending: false });
    setProduits((data as Produit[]) ?? []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setSession(data.session);
      loadProduits();
    });
  }, [router, loadProduits]);

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
        .insert({ nom, description, image_url });

      if (insertError) throw insertError;

      setNom("");
      setDescription("");
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

      <h1>Produits</h1>

      <form onSubmit={handleAdd} className="contact-form admin-form">
        <input
          type="text"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
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

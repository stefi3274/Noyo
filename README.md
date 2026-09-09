# Noyo

Marketplace mettant en relation producteurs et acheteurs en Haïti.

## Stack

- Next.js 14 (App Router)
- Supabase (auth + base de données)
- Déploiement Vercel

## Démarrage local

```bash
npm install
cp .env.example .env.local
```

Remplis `.env.local` avec l'URL et la clé anon Supabase du projet, puis :

```bash
npm run dev
```

## Structure

```
app/
  layout.tsx      racine + polices
  page.tsx         page d'accueil
  globals.css      styles
lib/
  supabase.ts       client Supabase
```

## À venir

- Schéma Supabase (tables produits, producteurs, invitations) — SQL fourni séparément
- Système d'invitation pour l'accès aux prix
- Logique de prix selon la localisation de l'acheteuse

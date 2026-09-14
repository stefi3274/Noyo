import Image from "next/image";
import { getSupabaseServer } from "@/lib/supabase-server";
import ProduitsCatalogue, {
  type Produit,
} from "@/app/components/ProduitsCatalogue";
import SiteHeader from "@/app/components/SiteHeader";
import ScrollReveal from "@/app/components/ScrollReveal";
import StatsBar from "@/app/components/StatsBar";
import ContactForm from "@/app/components/ContactForm";
import CommandeForm from "@/app/components/CommandeForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = getSupabaseServer();

  const { data: produits } = await supabase
    .from("produits")
    .select("id, nom, description, image_url, categorie")
    .order("created_at", { ascending: false });

  const { data: parametres } = await supabase
    .from("parametres")
    .select("hero_image_url")
    .eq("id", 1)
    .maybeSingle();

  const heroImageUrl = parametres?.hero_image_url ?? null;
  const liste = (produits as Produit[]) ?? [];
  const categoriesCount = new Set(
    liste.map((p) => p.categorie).filter(Boolean)
  ).size;

  return (
    <>
      <ScrollReveal />

      <div className="wrap">
        <SiteHeader />

        <section className="hero" style={{ paddingBottom: 0 }}>
          <div>
            <h1>
              La vie commence <em>ici</em>, avec nous.
            </h1>
            <p>
              Noyo relie les producteurs haïtiens aux acheteurs, sans détour.
              Cacao, café, racines, fruits de mer : chaque produit garde le
              nom et le visage de la personne qui l&apos;a cultivé.
            </p>
            <div className="hero-actions">
              <a href="/inscription?profil=acheteur" className="btn btn-primary">
                Je veux acheter
              </a>
              <a href="/inscription?profil=vendeur" className="btn btn-outline">
                Je veux vendre
              </a>
              <a href="/inscription?profil=fournisseur" className="btn btn-outline">
                Je suis fournisseur
              </a>
            </div>
          </div>

          <div className="hero-visuel">
            <svg
              className="hero-splash"
              viewBox="0 0 400 400"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="splashVert" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6b8a56" />
                  <stop offset="100%" stopColor="#2f4a2b" />
                </linearGradient>
              </defs>

              {/* Fond organique */}
              <path
                fill="url(#splashVert)"
                opacity="0.16"
                d="M320,60 C370,110 380,190 350,260 C320,330 240,370 170,350 C100,330 40,270 30,200 C20,130 60,50 130,30 C200,10 270,10 320,60 Z"
              />

              {/* Feuille stylisée */}
              <path
                fill="#6b8a56"
                opacity="0.5"
                d="M150,320 C110,290 100,230 130,180 C160,130 220,100 270,110 C260,170 240,220 200,260 C180,280 165,300 150,320 Z"
              />
              <path
                stroke="#f2ecdd"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
                d="M150,320 C170,270 210,210 265,115"
              />

              {/* Soleil, écho du logo */}
              <g transform="translate(290,90)" opacity="0.85">
                <circle r="20" fill="#b5652b" />
                <g stroke="#b5652b" strokeWidth="4" strokeLinecap="round">
                  <line x1="0" y1="-32" x2="0" y2="-44" />
                  <line x1="22" y1="-22" x2="31" y2="-31" />
                  <line x1="-22" y1="-22" x2="-31" y2="-31" />
                  <line x1="32" y1="0" x2="44" y2="0" />
                  <line x1="-32" y1="0" x2="-44" y2="0" />
                </g>
              </g>

              {/* Grains semés */}
              <g fill="#b5652b" opacity="0.55">
                <circle cx="95" cy="120" r="4" />
                <circle cx="115" cy="140" r="3" />
                <circle cx="80" cy="150" r="3" />
                <circle cx="230" cy="300" r="4" />
                <circle cx="250" cy="285" r="3" />
                <circle cx="255" cy="310" r="3" />
              </g>
            </svg>
            {heroImageUrl ? (
              <div className="hero-photo">
                <Image
                  src={heroImageUrl}
                  alt="Noyo"
                  fill
                  sizes="(max-width: 860px) 90vw, 40vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ) : (
              <div className="ledger">
                <p className="ledger-title">Carnet du jour</p>
                <ul>
                  <li>
                    <span>Cacao</span> <span className="kreyol">kakawo</span>
                  </li>
                  <li>
                    <span>Café</span> <span className="kreyol">kafe</span>
                  </li>
                  <li>
                    <span>Pistache</span>{" "}
                    <span className="kreyol">pistach</span>
                  </li>
                  <li>
                    <span>Igname</span> <span className="kreyol">yanm</span>
                  </li>
                  <li>
                    <span>Gingembre</span>{" "}
                    <span className="kreyol">jenjanm</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        <StatsBar produitsCount={liste.length} categoriesCount={categoriesCount} />
      </div>

      <div className="wrap">
        <section id="apropos" className="apropos reveal">
          <h2 className="section-heading">À propos de Noyo</h2>
          <p>
            Noyo est une structure spécialisée dans l&apos;achat, la
            transformation et la vente de produits naturels. Nous stockons
            nos produits pour qu&apos;ils soient disponibles en tout temps,
            avec une livraison possible partout en Haïti.
          </p>
          <p>
            C&apos;est aussi un intermédiaire entre les producteurs et les
            personnes désirant se procurer des produits naturels bio, où
            qu&apos;elles se trouvent sur le territoire.
          </p>
        </section>

        <section id="fournisseurs" className="reveal">
          <h2 className="section-heading">Nos fournisseurs</h2>
          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <h3>Fanfan Dame-Marie</h3>
              <p>Producteur partenaire, exemple de fournisseur Noyo.</p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h3>Henry Cacao</h3>
              <p>Producteur partenaire, exemple de fournisseur Noyo.</p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h3>Neuf Vodou</h3>
              <p>Producteur partenaire, exemple de fournisseur Noyo.</p>
            </div>
          </div>
        </section>
      </div>

      <section id="produits" className="produits-band reveal">
        <div className="wrap">
          <h2 className="section-heading">Les produits du carnet</h2>
          <ProduitsCatalogue produits={liste} />
        </div>
      </section>

      <div className="wrap">
        <section className="acces reveal">
          <div>
            <h2 className="section-heading" style={{ marginBottom: 6 }}>
              Placer une commande
            </h2>
            <p className="acces-kreyol">Plase kòmand ou.</p>
            <p className="acces-note">
              Remplis le formulaire pour passer ta commande directement sur
              le site : on te recontacte pour la confirmer et organiser la
              livraison. Pour une question avant de commander, écris-nous
              plutôt sur WhatsApp.
            </p>
          </div>
          <CommandeForm />
        </section>

        <section id="contact" className="reveal">
          <div className="contact">
            <div className="contact-copy">
              <h2>Parlons-en</h2>
              <p>
                Que vous vendiez ou que vous achetiez, écrivez-nous
                directement sur WhatsApp ou remplissez le formulaire.
              </p>
              <a
                className="whatsapp-btn"
                href="https://wa.me/50934202031"
                target="_blank"
                rel="noopener noreferrer"
              >
                Écrire sur WhatsApp
              </a>
            </div>
            <ContactForm />
          </div>
        </section>

        <footer className="site-footer">
          <div>
            <span>noyo — la vie commence ici, avec nous</span>
            <span className="credit">
              Créé par SteFi Services, Créateur Web et Solutions Digitales.
            </span>
          </div>
          <span>
            <a href="/mentions-legales">Mentions légales</a> ·{" "}
            © {new Date().getFullYear()}
          </span>
        </footer>
      </div>
    </>
  );
}

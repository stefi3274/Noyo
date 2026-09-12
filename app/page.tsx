import Image from "next/image";
import { getSupabaseServer } from "@/lib/supabase-server";
import ProduitsCatalogue, {
  type Produit,
} from "@/app/components/ProduitsCatalogue";
import SiteHeader from "@/app/components/SiteHeader";
import ScrollReveal from "@/app/components/ScrollReveal";
import StatsBar from "@/app/components/StatsBar";

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
              className="hero-blob"
              viewBox="0 0 400 400"
              aria-hidden="true"
            >
              <path
                fill="#6b8a56"
                d="M320,60 C370,110 380,190 350,260 C320,330 240,370 170,350 C100,330 40,270 30,200 C20,130 60,50 130,30 C200,10 270,10 320,60 Z"
                opacity="0.35"
              />
              <path
                fill="#b5652b"
                d="M300,140 C330,180 320,240 280,270 C240,300 170,300 130,270 C90,240 70,180 90,140 C110,100 160,80 210,80 C260,80 270,100 300,140 Z"
                opacity="0.25"
              />
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
            transformation et la vente de produits naturels.
          </p>
          <p>
            C&apos;est aussi un intermédiaire entre les producteurs et les
            personnes désirant se procurer des produits naturels bio sur
            tout le territoire haïtien.
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
          <h2 className="section-heading" style={{ marginBottom: 16 }}>
            Un accès pensé pour la confiance
          </h2>
          <p className="acces-note">
            Aucun compte n&apos;est requis pour parcourir Noyo. Mais voir un
            prix demande une invitation : c&apos;est ce qui garde chaque
            échange sérieux, des deux côtés.
          </p>
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
            <form className="contact-form">
              <label>
                Nom
                <input type="text" name="nom" placeholder="Votre nom" required />
              </label>
              <label>
                Téléphone
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Votre numéro"
                  required
                />
              </label>
              <label>
                Je suis...
                <select name="profil" defaultValue="">
                  <option value="" disabled>
                    Choisir un profil
                  </option>
                  <option value="acheteur">Acheteur</option>
                  <option value="producteur">Producteur</option>
                </select>
              </label>
              <label>
                Message
                <textarea name="message" placeholder="Votre message"></textarea>
              </label>
              <button type="submit" className="btn btn-primary">
                Envoyer
              </button>
            </form>
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

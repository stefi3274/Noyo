export default function Home() {
  return (
    <>
      <div className="wrap">
        <header className="site-header">
          <a href="/" className="wordmark">
            noyo
          </a>
          <nav className="site-nav">
            <a href="#produits">Produits</a>
            <a href="#comment">Comment ça marche</a>
            <a href="#contact">Contact</a>
            <a href="#contact" className="btn btn-primary">
              Rejoindre
            </a>
          </nav>
        </header>

        <section className="hero" style={{ paddingBottom: 0 }}>
          <div>
            <h1>
              Ce que la terre <em>donne</em>, directement dans vos mains.
            </h1>
            <p>
              Noyo relie les producteurs haïtiens aux acheteurs, sans détour.
              Cacao, café, racines, fruits de mer : chaque produit garde le
              nom et le visage de la personne qui l&apos;a cultivé.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                Je veux acheter
              </a>
              <a href="#contact" className="btn btn-outline">
                Je suis producteur
              </a>
            </div>
          </div>

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
                <span>Pistache</span> <span className="kreyol">pistach</span>
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
        </section>
      </div>

      <div className="wrap">
        <section id="comment">
          <h2 className="section-heading">Comment ça marche</h2>
          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <h3>Circulation directe</h3>
              <p>
                Le produit va du producteur à l&apos;acheteur avec un seul
                intermédiaire, Noyo, qui organise la mise en relation.
              </p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h3>Prix selon la livraison</h3>
              <p>
                Le prix affiché dépend de l&apos;endroit où se trouve
                l&apos;acheteuse, pour refléter le coût réel du trajet.
              </p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h3>Accès par invitation</h3>
              <p>
                Naviguer sur Noyo ne demande pas de compte. Voir les prix
                demande une invitation.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section id="produits" className="produits-band">
        <div className="wrap">
          <h2 className="section-heading">Les produits du carnet</h2>
          <div className="produits-grid">
            {[
              ["Cacao", "kakawo"],
              ["Café", "kafe"],
              ["Pistache", "pistach"],
              ["Patate douce", "patat"],
              ["Banane", "bannann"],
              ["Noix", "nwa"],
              ["Pois", "pwa"],
              ["Igname", "yanm"],
              ["Poisson", "pwason"],
              ["Gingembre", "jenjanm"],
              ["Noix de coco", "kokoye"],
              ["Beurre", "bè"],
            ].map(([fr, kr]) => (
              <div className="produit" key={fr}>
                <span className="fr">{fr}</span>
                <span className="kr">{kr}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="acces">
          <h2 className="section-heading" style={{ marginBottom: 16 }}>
            Un accès pensé pour la confiance
          </h2>
          <p className="acces-note">
            Aucun compte n&apos;est requis pour parcourir Noyo. Mais voir un
            prix demande une invitation : c&apos;est ce qui garde chaque
            échange sérieux, des deux côtés.
          </p>
        </section>

        <section id="contact">
          <div className="contact">
            <div className="contact-copy">
              <h2>Parlons-en</h2>
              <p>
                Que vous vendiez ou que vous achetiez, écrivez-nous
                directement sur WhatsApp ou remplissez le formulaire.
              </p>
              <a
                className="whatsapp-btn"
                href="https://wa.me/50936281876"
                target="_blank"
                rel="noopener noreferrer"
              >
                Écrire sur WhatsApp
              </a>
            </div>
            <form className="contact-form">
              <input type="text" name="nom" placeholder="Nom" required />
              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                required
              />
              <select name="profil" defaultValue="">
                <option value="" disabled>
                  Je suis...
                </option>
                <option value="acheteur">Acheteur</option>
                <option value="producteur">Producteur</option>
              </select>
              <textarea
                name="message"
                placeholder="Votre message"
              ></textarea>
              <button type="submit" className="btn btn-primary">
                Envoyer
              </button>
            </form>
          </div>
        </section>

        <footer className="site-footer">
          <span>noyo — la vie commence ici, avec nous</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </>
  );
}

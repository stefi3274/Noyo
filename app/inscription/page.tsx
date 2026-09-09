import InscriptionForm from "@/app/components/InscriptionForm";

export default function InscriptionPage({
  searchParams,
}: {
  searchParams: { profil?: string };
}) {
  return (
    <div className="wrap inscription-page">
      <a href="/" className="back-link">
        ← Retour
      </a>
      <h1>Rejoindre Noyo</h1>
      <p className="inscription-intro">
        Que tu achètes, vendes ou fournisses des produits, dis-nous en un
        peu plus sur toi. Nous te recontactons rapidement.
      </p>
      <InscriptionForm initialProfil={searchParams.profil} />
    </div>
  );
}

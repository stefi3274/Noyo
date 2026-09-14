export default function StatsBar({
  produitsCount,
  categoriesCount,
}: {
  produitsCount: number;
  categoriesCount: number;
}) {
  const stats = [
    { valeur: "100%", label: "Origine haïtienne" },
    { valeur: String(produitsCount), label: "Produits disponibles" },
    { valeur: String(categoriesCount), label: "Catégories" },
    { valeur: "Toute Haïti", label: "Livraison" },
  ];

  return (
    <div className="stats-bar reveal">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <span className="stat-valeur">{s.valeur}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

import { queryListings } from "@/lib/listings";
import { ListingCard } from "@/components/ListingCard";
import { getServerDict } from "@/i18n/server";

export const metadata = { title: "Trouver mon bien" };

const USD_TO_EUR = 0.92;
const THB_PER_USD = 34.5;

const field =
  "w-full rounded-sm border border-ink-border bg-ink-panel px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none";

export default async function BiensPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const dict = await getServerDict();

  const budgetEur = Number(sp.budget) > 0 ? Number(sp.budget) : null;
  const bedrooms = Number(sp.bedrooms) > 0 ? Number(sp.bedrooms) : undefined;
  const sort = sp.sort === "price_asc" || sp.sort === "price_desc" ? sp.sort : "recent";

  let listings: Awaited<ReturnType<typeof queryListings>>["listings"] = [];
  if (budgetEur) {
    const budgetUsd = budgetEur / USD_TO_EUR;
    const res = await queryListings({
      country: "thailand",
      listingType: "sale",
      maxPrice: Math.floor(budgetUsd * THB_PER_USD),
      minBedrooms: bedrooms,
      sort,
      perPage: 48,
    });
    listings = res.listings.filter((l) => l.priceUsd != null && l.priceUsd <= budgetUsd);
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Trouver mon bien selon mon budget</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Indiquez ce que vous pouvez investir : seuls les biens à votre portée s'affichent, avec un accès direct à
        l'agence.
      </p>

      <form method="get" className="panel mt-8 grid gap-4 rounded-sm p-5 sm:grid-cols-4">
        <label className="grid gap-1.5 text-sm text-silver sm:col-span-2">
          Budget maximum (en euros)
          <input
            name="budget"
            type="number"
            min={10000}
            step={5000}
            defaultValue={sp.budget ?? ""}
            placeholder="Ex. 120000"
            className={field}
          />
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Chambres minimum
          <select name="bedrooms" defaultValue={sp.bedrooms ?? ""} className={field}>
            <option value="">Indifférent</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Trier par
          <select name="sort" defaultValue={sort} className={field}>
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </label>
        <div className="sm:col-span-4">
          <button type="submit" className="btn-gold rounded-full px-6 py-2.5 text-sm">
            Voir les biens
          </button>
        </div>
      </form>

      {budgetEur && (
        <p className="mt-6 text-sm text-dim">
          <span className="num text-cream">{listings.length}</span> bien{listings.length > 1 ? "s" : ""} dans votre budget
          {listings.length === 48 ? " (48 premiers résultats)" : ""}.
        </p>
      )}

      {budgetEur && listings.length === 0 && (
        <p className="mt-6 text-silver">Aucun bien à ce budget pour le moment. Essayez d'augmenter légèrement le budget.</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} t={dict} />
        ))}
      </div>
    </div>
  );
}

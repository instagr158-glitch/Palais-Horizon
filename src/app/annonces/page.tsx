import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import { getAllParisListings, STANDARD_MAX_EUR } from "@/lib/paris";
import { ParisCatalog, type ParisCard } from "@/components/ParisCatalog";
import { PaywallScreen } from "@/components/PaywallScreen";

export const dynamic = "force-dynamic";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.paris.allListingsTitle };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export default async function AllParisListingsPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/annonces");
  if (!hasActiveSubscription(session.user)) return <PaywallScreen />;

  const dict = await getServerDict();
  const t = dict.paris;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
  const listings = await getAllParisListings();

  const money = (n: number) =>
    n.toLocaleString(nf, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const cards: ParisCard[] = listings.map((l) => ({
    id: l.id,
    href: l.url,
    external: true,
    place: fmt(t.place, { zip: l.zip }),
    title: l.title,
    photos: l.photos,
    rent: l.rentEur,
    rentText: money(l.rentEur),
    pricePerSqm: l.pricePerSqm,
    sqmText: l.pricePerSqm != null ? `${l.pricePerSqm.toLocaleString(nf, { maximumFractionDigits: 0 })} ${t.perSqm}` : null,
    detailText: [
      l.areaSqm ? `${l.areaSqm} m²` : null,
      l.rooms ? (l.rooms === 1 ? t.roomsOne : fmt(t.rooms, { n: l.rooms })) : null,
    ]
      .filter(Boolean)
      .join(" · "),
    furnished: l.furnished,
    premium: l.rentEur > STANDARD_MAX_EUR,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-widetitle text-gold">{t.allListingsBadge}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-5xl">{t.allListingsTitle}</h1>
      <p className="mt-3 max-w-2xl text-sm text-dim sm:text-base">
        {fmt(t.allListingsBody, { n: cards.length })}
      </p>

      <div className="mt-10">
        <ParisCatalog
          cards={cards}
          labels={{
            all: t.filterAll,
            under: t.filterUnder,
            mid: t.filterMid,
            premium: t.filterPremium,
            favorites: t.filterFavorites,
            noFavorites: t.noFavorites,
            sortLabel: t.sortLabel,
            sortRent: t.sortRent,
            sortSqm: t.sortSqm,
            perMonth: t.perMonth,
            furnished: t.furnished,
            premiumBadge: t.premium,
            view: t.view,
            addFavorite: t.addFavorite,
            removeFavorite: t.removeFavorite,
            empty: t.empty,
          }}
        />
      </div>

      <div className="mt-16 space-y-2 pb-16">
        <p className="text-xs leading-relaxed text-dim">
          {fmt(t.note, { date: new Date().toLocaleDateString(nf, { dateStyle: "long" }) })}
        </p>
        <p className="text-xs leading-relaxed text-dim">
          <span className="font-semibold text-gold">{t.disclaimerTitle}</span>
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}

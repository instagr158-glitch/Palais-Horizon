import PartsPage, { generateMetadata as partsMetadata } from "./parts/page";

export const dynamic = "force-dynamic";

// The home page is the buy-shares page.
export const generateMetadata = partsMetadata;

export default PartsPage;

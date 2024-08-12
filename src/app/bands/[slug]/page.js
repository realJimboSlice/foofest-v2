import Image from "next/image";
import { notFound } from "next/navigation";

// Function to fetch all bands for generating paths
async function fetchBands() {
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/bands");
  const bands = await res.json();
  return bands;
}

// Function to fetch a specific band by slug
async function fetchBandBySlug(slug) {
  const res = await fetch(
    `https://fluffy-scrawny-hedgehog.glitch.me/bands/${slug}`
  );
  if (!res.ok) {
    return null;
  }
  const band = await res.json();
  return band;
}

// Main function for the BandPage component
export default async function BandPage({ params }) {
  const band = await fetchBandBySlug(params.slug);

  // If the band is not found, trigger a 404 page
  if (!band) {
    notFound();
  }

  // Render the band data
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          {band.name}
        </h1>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
            <Image
              src={
                band.logo.includes("https")
                  ? band.logo
                  : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
              }
              alt={band.name}
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-8">
            <span className="block text-sm text-gray-400 mb-4">
              {band.logoCredits}
            </span>
            <h2 className="text-2xl font-semibold text-electricBlue mb-4">
              Genre: {band.genre}
            </h2>
            <h3 className="text-xl font-semibold mb-2">Members</h3>
            <article className="mb-6 text-gray-300">{band.members}</article>
            <h3 className="text-xl font-semibold mb-2">Biography</h3>
            <article className="text-gray-300">{band.bio}</article>
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to generate static params for the dynamic routes
export async function generateStaticParams() {
  const bands = await fetchBands();
  return bands.map((band) => ({
    slug: band.slug,
  }));
}

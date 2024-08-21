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
    <div className="min-h-screen bg-black text-white p-4 mt-32">
      <div className="max-w-4xl mx-auto grid gap-8">
        {/* Band Image */}
        <div
          className="w-full h-80 md:h-96 bg-cover bg-center rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${
              band.logo.includes("https")
                ? band.logo
                : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
            })`,
          }}
        ></div>
        {/* Image Credits */}
        {band.logoCredits && (
          <div className="text-sm text-gray-400 text-center">
            <span>{band.logoCredits}</span>
          </div>
        )}

        {/* Band Name */}
        <div className="text-center mt-4">
          <h1 className="text-5xl font-bold">{band.name}</h1>
        </div>

        {/* Band Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Biography</h2>
          <article className="text-gray-300">{band.bio}</article>
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

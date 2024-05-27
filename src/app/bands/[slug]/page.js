// This code was commented with the assistance of GitHub Copilot to increase readability

// Importing necessary modules
import Image from "next/image";
import { notFound } from "next/navigation";

// Function to fetch all bands for generating paths
async function fetchBands() {
  // Fetch data from the URL
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/bands");
  // Parse the response to JSON
  const bands = await res.json();
  // Return the parsed data
  return bands;
}

// Function to fetch a specific band by slug
async function fetchBandBySlug(slug) {
  // Fetch data for a specific band using the slug
  const res = await fetch(
    `https://fluffy-scrawny-hedgehog.glitch.me/bands/${slug}`
  );
  // If the response is not ok, return null
  if (!res.ok) {
    return null;
  }
  // Parse the response to JSON
  const band = await res.json();
  // Return the parsed data
  return band;
}

// Main function for the BandPage component
export default async function BandPage({ params }) {
  // Fetch the band data using the slug from params
  const band = await fetchBandBySlug(params.slug);

  // If the band is not found, trigger a 404 page
  if (!band) {
    notFound();
  }

  // Render the band data
  return (
    <div className="">
      <div className="">
        <h1 className="">{band.name}</h1>
        <Image
          src={
            // Check if the band.logo is a link, if so, use it as is.
            // If not, fetch it from the server.
            band.logo.includes("https")
              ? band.logo
              : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
          }
          alt={band.name}
          width={100}
          height={100}
        />
        <span className="">{band.logoCredits}</span>
        <h2 className="">{band.genre}</h2>
        <article className="">{band.members}</article>
        <article className="">{band.bio}</article>
      </div>
    </div>
  );
}

// Function to generate static params for the dynamic routes
export async function generateStaticParams() {
  // Fetch all bands
  const bands = await fetchBands();
  // Return an array of objects, each containing a slug property
  return bands.map((band) => ({
    slug: band.slug,
  }));
}

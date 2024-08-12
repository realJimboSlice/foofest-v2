import Image from "next/image";
import Link from "next/link";

// Function to fetch band data
async function fetchBands() {
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/bands");
  const bands = await res.json();
  return bands;
}

// Main function to render the lineup page
export default async function Lineup() {
  // Fetch the band data
  const bands = await fetchBands();

  // Render the band data
  return (
    <article className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Band Lineup
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Map over the band data and render each band */}
        {bands.map((band) => (
          <div
            key={band.slug}
            className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-between"
          >
            {/* Band Logo */}
            <Link href={`/bands/${band.slug}`} className="mb-4">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-full bg-black">
                <Image
                  src={
                    band.logo.includes("https")
                      ? band.logo
                      : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
                  }
                  alt={band.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </Link>
            {/* Band Name */}
            <Link
              href={`/bands/${band.slug}`}
              className="text-xl font-bold text-electricBlue hover:text-deepRed mb-2 text-center"
            >
              {band.name}
            </Link>
            {/* Logo Credits */}
            {/* <span className="text-sm text-gray-400">{band.logoCredits}</span> */}
          </div>
        ))}
      </div>
    </article>
  );
}

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
    <section className="min-h-screen bg-black text-white p-4 mt-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Band Lineup
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Map over the band data and render each band */}
        {bands.map((band) => (
          <Link
            href={`/bands/${band.slug}`}
            key={band.slug}
            className="relative group block overflow-hidden rounded-lg"
            style={{ cursor: "pointer" }}
          >
            {/* Background Image */}
            <div
              className="w-full h-64 bg-cover bg-center flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url(${
                  band.logo.includes("https")
                    ? band.logo
                    : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
                })`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-30 transition-opacity"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end justify-left p-2">
              <span className="text-2xl font-bold text-white text-center z-0">
                {band.name}
              </span>
            </div>

            {/* Additional Metadata - Optional */}
            {/* Uncomment and modify the following lines if you want to add additional information */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-center">
              <span className="text-sm text-gray-300">Additional Info</span>
            </div> */}
          </Link>
        ))}
      </div>
    </section>
  );
}

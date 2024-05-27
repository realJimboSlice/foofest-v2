import Image from "next/image";
import Link from "next/link";

// GitHub Copilot Assistance:
// Adding comments to the code for increased readability and understanding

// This function fetches band data from a specific URL
async function fetchBands() {
  // Fetch data from the URL
  const res = await fetch("https://fluffy-scrawny-hedgehog.glitch.me/bands");
  // Parse the response to JSON
  const bands = await res.json();
  // Return the parsed data
  return bands;
}

// This is the main function that fetches the band data and renders it
export default async function Lineup() {
  // Fetch the band data
  const bands = await fetchBands();

  // Return the JSX that renders the band data
  return (
    <article className="">
      <div className="">
        {/* Map over the band data and render each band */}
        {bands.map((band) => (
          <div key={band.slug} className="">
            <div className="">
              {/* Link to the band's page */}
              <Link href={`/bands/${band.slug}`}>
                {/* Display the band's name */}
                <span className="">{band.name}</span>
              </Link>
              {/* Link to the band's page */}
              <Link href={`/bands/${band.slug}`}>
                {/* Display the band's logo */}
                <Image
                  src={
                    // Check if band.logo is a link.
                    // If not, fetch it from the folder.
                    band.logo.includes("https")
                      ? band.logo
                      : `https://fluffy-scrawny-hedgehog.glitch.me/logos/${band.logo}`
                  }
                  alt={band.name}
                  width={100}
                  height={100}
                />
              </Link>
              {/* Display the logo credits */}
              <span className="">{band.logoCredits}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

import Image from "next/image";
import { metadata } from "./layout";

metadata.title = "Foofest Heavy Metal Festival";
metadata.description = "The baddest heavy metal festival on the planet.";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Hero Section */}
      <div className="w-full flex justify-center px-4 md:px-12 lg:px-24">
        <div className="relative w-full">
          <Image
            src="/assets/images/foofest-hero-fade.webp"
            alt="Metal Festival Banner"
            width={1920}
            height={1080}
            layout="responsive"
            objectFit="cover"
            className="border-l-4 border-r-4 border-black"
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white borderText">
              Welcome to Foofest Heavy Metal Festival
            </h1>
            <div className="space-y-4">
              <a
                href="/tickets"
                className="block bg-electricBlue text-white py-2 px-4 rounded hover:bg-deepRed transition duration-300"
              >
                Buy Tickets
              </a>
              <a
                href="/schedule"
                className="block bg-electricBlue text-white py-2 px-4 rounded hover:bg-deepRed transition duration-300"
              >
                Festival Schedule
              </a>
              <a
                href="/bands"
                className="block bg-electricBlue text-white py-2 px-4 rounded hover:bg-deepRed transition duration-300"
              >
                See Bands
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

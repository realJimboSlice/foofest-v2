import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <section className="section-newsletter pt-10 px-5 bg-black text-white">
        <div>
          <div>
            <h2 className="text-center text-uppercase text-4xl font-bold pb-5">
              Subscribe to our newsletter
            </h2>
          </div>
          <form action="" method="post">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 p-10">
              <div>
                <div>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    placeholder="FIRST NAME *"
                    required
                    className="w-full p-2 border border-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-electricBlue placeholder-white"
                  />
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="EMAIL ADDRESS *"
                    required
                    className="w-full p-2 border border-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-electricBlue placeholder-white"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="opt-in"
                    id="opt-in"
                    required
                    aria-label="Opt-in to newsletter checkbox"
                    aria-checked="false"
                    className="h-5 w-5 text-electricBlue border-gray-300 rounded focus:ring-electricBlue text-sm"
                  />
                  <span className="ml-2">
                    I WANT TO RECEIVE THE NEWSLETTER AND I ACCEPT{" "}
                    <a
                      href="#"
                      target="_blank"
                      className="text-electricBlue underline"
                    >
                      THE PRIVACY POLICY
                    </a>
                  </span>
                </div>
              </div>
              <div className="col-span-1">
                <div>
                  <p className="text-xs text-gray-400">
                    We use SMTP2GO as our marketing platform. By completing and
                    submitting the form, you confirm that the information you
                    have provided will be sent to SMTP2GO for processing in
                    accordance with the{" "}
                    <a
                      href="#"
                      target="_blank"
                      className="text-electricBlue underline"
                    >
                      Terms of Use
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div>
                <div></div>
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <div className="flex align-middle justify-center">
                  <button
                    type="submit"
                    className="p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="section-sponsors py-10 bg-black text-white">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="sponsor-grid_item flex items-center justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/sponsors/corona.webp"
                  alt="Corona"
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </a>
            </div>
            <div className="sponsor-grid_item flex items-center justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/sponsors/heineken.webp"
                  alt="Heineken"
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </a>
            </div>
            <div className="sponsor-grid_item flex items-center justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/sponsors/jim-beam.webp"
                  alt="Jim Beam Whiskey"
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </a>
            </div>
            <div className="sponsor-grid_item flex items-center justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/sponsors/kims-chips.webp"
                  alt="Kims Chips"
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <section className="section-newsletter pt-10 px-5 bg-black text-white">
        <div>
          <div>
            <h2 className="text-center text-uppercase text-4xl font-bold">
              Subscribe to our newsletter
            </h2>
          </div>
          <form action="" method="post">
            <div className="grid grid-cols-2">
              <div>
                <div>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    placeholder="FIRST NAME *"
                    required="required"
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
                    required="required"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label className="grid grid-row-2">
                    <input
                      type="checkbox"
                      name="opt-in"
                      id="opt-in"
                      required="required"
                    />
                    <span>
                      I WANT TO RECEIVE THE NEWSLETTER AND I ACCEPT{" "}
                      <a href="#" target="_blank">
                        THE PRIVACY POLICY
                      </a>
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <div>
                  <p>
                    We use SMTP2GO as our marketing platform. By completing and
                    submitting the form, you confirm that the information you
                    have provided will be sent to SMTP2GO for processing in
                    accordance with the{" "}
                    <a href="#" target="_blank">
                      {" "}
                      Terms of Use{" "}
                    </a>{" "}
                    .
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <button type="submit">Subscribe</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </footer>
  );
}

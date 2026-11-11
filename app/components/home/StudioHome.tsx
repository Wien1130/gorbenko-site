import Image from "next/image";
import Link from "next/link";
import { Manrope, Newsreader } from "next/font/google";
import StudioMenu from "./StudioMenu";
import StudioTheme from "../studio/StudioTheme";
import "../../studio-home.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-studio",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: "italic",
  weight: ["400", "500"],
  variable: "--font-studio-serif",
});

const moreWork = [
  {
    href: "/projekte/gbike",
    src: "/portfolio/gbike/desktop.webp",
    alt: "Shopify-Shop von G-Bike Wien, E-Moped vor einem Haus in Wien",
    title: "G-Bike Wien",
    meta: "Shopify-Shop · E-Mobilität",
  },
  {
    href: "/projekte/zum-eisbaeren",
    src: "/portfolio/zum-eisbaeren/desktop.webp",
    alt: "Website der Parfümerie Gewußt wie Zum Eisbären",
    title: "Zum Eisbären",
    meta: "Website · Events · Sortiment",
  },
  {
    href: "/projekte/nagl",
    src: "/portfolio/nagl/desktop.webp",
    alt: "Landingpage der Messerschmiede Nagl, custom.nagl-messer.at",
    title: "Nagl — Schmiede",
    meta: "Website · Werkstatt · Wien",
  },
];

export default function StudioHome() {
  return (
    <StudioTheme>
    <div className={`${manrope.variable} ${newsreader.variable} studio`}>
      <a className="studio-skip" href="#main">
        Zum Inhalt
      </a>
      <header className="studio-header studio-wrap">
        <Link href="/" className="studio-wordmark" aria-label="Gorbenko, zur Startseite">
          Gorbenko.at
        </Link>
        <StudioMenu />
      </header>

      <main id="main">
        <section className="studio-intro studio-wrap" aria-labelledby="intro-title">
          <p className="studio-eyebrow">Digitalstudio · Wien</p>
          <div className="studio-intro-grid">
            <h1 id="intro-title">
              Digitale Erlebnisse.
              <em>Messbare Wirkung.</em>
            </h1>
            <p className="studio-intro-copy">
              Websites, Shops und Apps.
              <br />
              Content und Kampagnen.
              <br />
              Von der ersten Idee bis zur nächsten Anfrage.
            </p>
          </div>
          <a className="studio-discover" href="#arbeiten">
            Arbeiten entdecken <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="studio-wrap" id="arbeiten" aria-label="Ausgewählte Projekte">
          <div className="studio-line">
            <p className="studio-eyebrow">Ausgewählte Projekte / 01—02</p>
            <span>Jedes Geschäft ist anders. Die Lösung auch.</span>
          </div>
          <div className="studio-grid">
            <article>
              <Link
                className="studio-scene"
                href="/projekte/nagl-service"
                aria-label="Nagl Schärfservice — Projekt ansehen"
              >
                <div className="studio-scene-photo">
                  <Image
                    src="/portfolio/nagl-service/stefan.jpg"
                    alt="Stefan Nagl beim Schleifen in der Werkstatt"
                    fill
                    priority
                    sizes="(max-width: 800px) 100vw, 40vw"
                    className="studio-cover"
                  />
                </div>
                <div className="studio-booking" aria-hidden="true">
                  <span className="studio-kicker">Nagl / Schärfservice</span>
                  <h3>Abholung buchen.</h3>
                  <p>Ihr Wunschtermin</p>
                  <div className="studio-days">
                    <span>Mo</span>
                    <span>Di</span>
                    <span className="is-on">Mi</span>
                    <span>Do</span>
                    <span>Fr</span>
                  </div>
                  <p className="studio-note">
                    Von Ihrer Küche.
                    <br />
                    In die Werkstatt.
                    <br />
                    Scharf zurück.
                  </p>
                  <span className="studio-mini">Service ansehen ↗</span>
                </div>
              </Link>
              <div className="studio-caption">
                <span className="studio-num">01 / Service & Buchung</span>
                <h2>
                  <Link href="/projekte/nagl-service">
                    Ein Service. Einfach gebucht. <span aria-hidden="true">↗</span>
                  </Link>
                </h2>
                <p>Nagl · Website, Bestell-Rechner & Kurier</p>
              </div>
            </article>

            <article>
              <div className="studio-scene studio-rubberik">
                <div className="studio-scene-photo">
                  <Image
                    src="/portfolio/rubberik/desktop.webp"
                    alt="Rubberik-Shop, Latex aus Wien. Fotografie der Startseite."
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                    className="studio-cover"
                    style={{ objectPosition: "center 62%" }}
                  />
                </div>
                <span className="studio-badge">In Entwicklung</span>
                <div className="studio-config">
                  <span className="studio-kicker">Rubberik / Maßanfertigung</span>
                  <h3>
                    So individuell
                    <br />
                    wie Sie.
                  </h3>
                  <p>Farbe. Ausstattung. Maße.</p>
                  <div className="studio-swatches" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <Link className="studio-config-link" href="/projekte/rubberik">
                    Konfigurator ansehen <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
              <div className="studio-caption">
                <span className="studio-num">02 / Shop & Konfigurator</span>
                <h2>
                  <Link href="/projekte/rubberik">
                    Individuell. Bis ins Detail. <span aria-hidden="true">↗</span>
                  </Link>
                </h2>
                <p>Rubberik · Online-Shop für Maßanfertigung</p>
              </div>
            </article>
          </div>
        </section>

        <section className="studio-services studio-wrap" id="leistungen" aria-labelledby="services-title">
          <div className="studio-services-head">
            <p className="studio-eyebrow">Von der Idee bis zum Alltag</p>
            <h2 id="services-title">
              Alles greift <em>ineinander.</em>
            </h2>
            <p>
              Ich entwickle Ihren digitalen Auftritt, bringe die richtigen Menschen
              dorthin und mache sichtbar, was funktioniert.
            </p>
          </div>
          <div className="studio-cols">
            <Link href="/leistungen/websites">
              <span className="studio-index">01 /</span>
              <h3>
                Websites & Shops <span aria-hidden="true">↗</span>
              </h3>
              <p>
                Ein Auftritt, der Ihr Geschäft zeigt. Mit klaren Wegen von der
                ersten Frage bis zur Anfrage oder Bestellung.
              </p>
              <span className="studio-tags">Design · Entwicklung · E-Commerce</span>
            </Link>
            <Link href="/leistungen/digitalisierung">
              <span className="studio-index">02 /</span>
              <h3>
                Apps & Dashboards <span aria-hidden="true">↗</span>
              </h3>
              <p>
                Individuelle Anwendungen, Konfiguratoren und Marketing-Dashboards.
                Passend zu dem, was Sie im Alltag brauchen.
              </p>
              <span className="studio-tags">Web-Apps · Konfiguratoren · Reporting</span>
            </Link>
            <Link href="/leistungen/content-marketing">
              <span className="studio-index">03 /</span>
              <h3>
                Content & Kampagnen <span aria-hidden="true">↗</span>
              </h3>
              <p>
                Gute Inhalte und gezielte Werbung. Damit Ihr Angebot die Menschen
                erreicht, für die es gemacht ist.
              </p>
              <span className="studio-tags">Video · Social Media · Werbung</span>
            </Link>
          </div>
          <p className="studio-strategy">
            <span>Lieber zuerst die Richtung klären? Marketing-Check, 20 Minuten bei Ihnen im Betrieb.</span>
            <Link href="/leistungen/marketing-strategie">Kostenlos starten ↗</Link>
          </p>
        </section>

        <section className="studio-more studio-wrap" aria-labelledby="more-title">
          <div className="studio-more-head">
            <h2 id="more-title">Weitere Arbeiten</h2>
            <Link href="/projekte">
              Alle Projekte <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="studio-more-grid">
            {moreWork.map((item) => (
              <Link key={item.href} className="studio-small" href={item.href}>
                <div className="studio-small-media">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 30vw"
                    className="studio-cover"
                    style={{ objectPosition: "center top" }}
                  />
                </div>
                <h3>{item.title}</h3>
                <p>{item.meta}</p>
                <span className="studio-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="studio-about studio-wrap" id="andrii" aria-labelledby="about-title">
          <div className="studio-about-photo">
            <Image
              src="/andrey.png"
              alt="Andrii Gorbenko am Laptop"
              fill
              sizes="200px"
              className="studio-cover"
              style={{ objectPosition: "50% 18%" }}
            />
          </div>
          <div>
            <p className="studio-eyebrow">Andrii Gorbenko · Wien</p>
            <h2 id="about-title">
              Eine Idee. Ein Gespräch.
              <br />
              <em>Ein persönlicher Ansprechpartner.</em>
            </h2>
            <p className="studio-lead">
              Ich verbinde Entwicklung, Gestaltung und Marketing. Vom ersten Entwurf
              bis zur laufenden Kampagne arbeite ich direkt mit Ihnen — online oder
              bei Ihnen im Betrieb in Wien.
            </p>
            <Link className="studio-text-link" href="/ueber-mich">
              Mehr über mich <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="studio-contact" aria-labelledby="contact-title">
          <div className="studio-wrap">
            <p className="studio-eyebrow">Ihr nächstes Projekt</p>
            <div className="studio-contact-row">
              <h2 id="contact-title">
                Was möchten
                <br />
                Sie <em>bewegen?</em>
              </h2>
              <div>
                <p>
                  Erzählen Sie mir von Ihrem Vorhaben.
                  <br />
                  Den nächsten Schritt finden wir gemeinsam.
                </p>
                <Link className="studio-btn studio-btn-light" href="/kontakt">
                  Projekt besprechen <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <footer className="studio-foot">
              <Link href="/" className="studio-wordmark">
                Gorbenko.at
              </Link>
              <span>Wien · Andrii Gorbenko</span>
              <nav aria-label="Rechtliches">
                <Link href="/impressum">Impressum</Link>
                <Link href="/datenschutz">Datenschutz</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/klassisch">Bisherige Fassung</Link>
              </nav>
            </footer>
          </div>
        </section>
      </main>
    </div>
    </StudioTheme>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Building2,
  CircleHelp,
  Info,
  MapPin,
  MessageCircle,
  Sparkles,
  Rocket,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbxSUkS36Dc0FQUIyPyQah9AStFyHhKM6wUdfPKxySoZPFgO6TEfyu65VN73yDE84WyN/exec";

const createLaunchDate = () => {
  const date = new Date("2026-04-18");
  date.setDate(date.getDate() + 72);
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatTime = (value) => String(value).padStart(2, "0");

const pillars = [
  {
    icon: MapPin,
    title: "Area-based feed",
    text: "See posts, issues and announcements from your street, ward, colony and district before anything else.",
  },
  {
    icon: Building2,
    title: "Government broadcasts",
    text: "Departments can send schemes, water cuts, traffic alerts and emergency notices to the exact area affected.",
  },
  {
    icon: ShieldCheck,
    title: "Safer civic voice",
    text: "Random public usernames help citizens report local problems without exposing their real identity.",
  },
  {
    icon: Users,
    title: "Organised communities",
    text: "Create public, private or secret neighbourhood groups for RWAs, schools, colonies and local leaders.",
  },
];

const issueSteps = [
  "Post a civic issue from your area",
  "Neighbours react, vote and add context",
  "Govlyx escalates attention from ward to district",
  "Department marks it resolved and notifies everyone",
];

const alertExamples = [
  {
    icon: Bell,
    title: "Real-time alerts",
    text: "Water cuts, power outages, traffic diversions and flood warnings sent only to citizens in the affected area.",
  },
  {
    icon: MessageCircle,
    title: "Anonymous chat",
    text: "Talk area-to-area with another citizen using protected random names, with future support for verified officials.",
  },
  {
    icon: BarChart3,
    title: "Smarter local signal",
    text: "Hot, New and Top views help surface what matters now while the feed learns the topics you care about.",
  },
];

const clueItems = [
  {
    icon: MapPin,
    label: "Area-based access",
  },
  {
    icon: Sparkles,
    label: "Local stories waiting",
  },
  {
    icon: CircleHelp,
    label: "Are you in your area?",
  },
];

const getTimeLeft = (launchDate) => {
  const diff = launchDate.getTime() - Date.now();
  if (diff <= 0) {
    return {
      days: "00",
      hours: "00",
      mins: "00",
      secs: "00",
    };
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return {
    days: formatTime(days),
    hours: formatTime(hours),
    mins: formatTime(mins),
    secs: formatTime(secs),
  };
};

//date
function App() {
  const [popup, setPopup] = useState({
    show: false,
    type: "", // success | error | info
    text: "",
  });
  const launchDate = useMemo(createLaunchDate, []);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(launchDate));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(
    "Join 2,400+ early supporters across India. No spam. Ever.",
  );

  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const topbarRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(launchDate));
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeft(launchDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [launchDate]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const glow = glowRef.current;
      const dot = dotRef.current;
      if (!glow || !dot) return;

      const mx = event.clientX;
      const my = event.clientY;
      glow.style.left = `${mx}px`;
      glow.style.top = `${my}px`;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };

    const handleMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (glowRef.current) glowRef.current.style.opacity = "1";
    };

    const handleScroll = () => {
      const topbar = topbarRef.current;
      const hero = heroRef.current;

      if (topbar) {
        topbar.classList.toggle("scrolled", window.scrollY > 20);
      }

      if (hero) {
        const progress = Math.min(window.scrollY / 260, 1);
        hero.style.setProperty("--hero-progress", progress.toFixed(3));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // auto-dismiss popup after 5 seconds
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  //submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const atIdx = trimmedEmail.indexOf("@");
    const isValid = atIdx > 0 && trimmedEmail.indexOf(".", atIdx) > atIdx + 1;

    if (!isValid) {
      setPopup({
        show: true,
        type: "error",
        text: "Enter a valid email address",
      });
      return;
    }

    setStatus("loading");

    try {
      const registeredEmails = JSON.parse(localStorage.getItem("govlyx_subs") || "[]");
      if (registeredEmails.includes(trimmedEmail)) {
        setPopup({
          show: true,
          type: "info",
          text: "You're already on the list! ⚡",
        });
        setStatus("idle");
        return;
      }

      // We use 'no-cors' and 'text/plain' to bypass CORS preflight issues with Apps Script
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      // ✅ Success
      localStorage.setItem("govlyx_subs", JSON.stringify([...registeredEmails, trimmedEmail]));
      setStatus("success");
      setEmail("");

      setPopup({
        show: true,
        type: "success",
        text: "You’re in! We'll connect with you soon for the demo..",
      });
    } catch (error) {
      console.error(error);

      setPopup({
        show: true,
        type: "error",
        text: error.message || "Something went wrong",
      });

      setStatus("error");
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-layer">
        <div className="grid-lines" />
        <div className="grid-fade" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div id="cursor-glow" ref={glowRef} />
      <div id="cursor-dot" ref={dotRef} />

      <nav className="topbar" ref={topbarRef}>
        <a href="#" className="logo">
          <svg
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Blue circle background */}
            <circle cx="100" cy="100" r="100" fill="#1D4ED8"/>
            
            {/* All white elements, scaled up and centered */}
            <g transform="translate(100, 102) scale(0.32) translate(-256, -290)">
              {/* Building/columns top */}
              <g fill="#FFFFFF" transform="translate(0, -6)">
                <path d="M256 150c-40 0-72 32-72 72v20h144v-20c0-40-32-72-72-72z" />
                <rect x="220" y="242" width="72" height="16" />
                <rect x="204" y="220" width="12" height="40" />
                <rect x="296" y="220" width="12" height="40" />
              </g>
              {/* Decorative circles */}
              <g fill="#FFFFFF" transform="translate(0, -6)">
                <circle cx="170" cy="210" r="6" />
                <circle cx="196" cy="230" r="4" />
                <circle cx="342" cy="210" r="6" />
                <circle cx="318" cy="230" r="4" />
                <circle cx="256" cy="190" r="5" />
              </g>
              {/* Horizontal bar */}
              <path fill="#FFFFFF" d="M150 300h212l-8 16H158z" />
              {/* Columns */}
              <g fill="#FFFFFF">
                <rect x="248" y="300" width="16" height="120" />
                <rect x="198" y="300" width="16" height="80" />
                <rect x="298" y="300" width="16" height="80" />
              </g>
              {/* Bottom circles (column bases) */}
              <g fill="#FFFFFF">
                <circle cx="256" cy="440" r="18" />
                <circle cx="206" cy="380" r="20" />
                <circle cx="306" cy="380" r="20" />
              </g>
              {/* Flag/banner top */}
              <g>
                <rect x="252" y="118" width="8" height="32" fill="#FFFFFF" />
                <path d="M260 118h45v22l-45-8z" fill="#FFFFFF" />
                <path d="M260 118l35 16l-35-6z" fill="#FFFFFF" opacity="0.4" />
              </g>
            </g>
          </svg>
          Govlyx
        </a>
      </nav>

      <main className="page">
        <div className="mystery-pill">
          <span className="pulse-dot" />
          Something is being built
        </div>

        <h1 className="hero-headline" ref={heroRef}>
          <span className="hero-word hero-word-left">Your City.</span>
          <span className="hero-word hero-word-right accent">Amplified.</span>
        </h1>

        <div className="teaser-block">
          <p className="teaser-line">
            India has <strong>780,000+ local corners.</strong>
          </p>
          <p className="teaser-line">
            Every single one has a story <strong>no one is telling.</strong>
          </p>
          <p className="teaser-line">
            We're about to change that — <strong>forever.</strong>
          </p>
        </div>

        <div className="clue-row">
          {clueItems.map(({ icon: Icon, label }) => (
            <div className="clue-card" key={label}>
              <span className="clue-icon">
                <Icon size={26} strokeWidth={2.6} />
              </span>
              {label}
            </div>
          ))}
        </div>

        <p className="countdown-label">Launching in</p>
        <div className="countdown">
          <div className="cd-unit">
            <div className="cd-box">{timeLeft.days}</div>
            <span className="cd-lbl">Days</span>
          </div>
          <div className="divider" />
          <div className="cd-unit">
            <div className="cd-box">{timeLeft.hours}</div>
            <span className="cd-lbl">Hours</span>
          </div>
          <div className="divider" />
          <div className="cd-unit">
            <div className="cd-box">{timeLeft.mins}</div>
            <span className="cd-lbl">Mins</span>
          </div>
          <div className="divider" />
          <div className="cd-unit">
            <div className="cd-box">{timeLeft.secs}</div>
            <span className="cd-lbl">Secs</span>
          </div>
        </div>

        <div className="form-wrap">
          <form className="form-row" onSubmit={handleSubmit}>
            <input
              type="email"
              id="emailInput"
              placeholder="your@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting..." : "Get Early Access"}
            </button>
          </form>

          <p className="form-hint">{message}</p>

          {status === "success" && (
            <div className="success-box" role="status" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Rocket size={32} style={{ marginBottom: '16px', color: '#60a5fa' }} />
                <strong>You're in. Welcome to the future.</strong>
                <p style={{ marginTop: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
                  Our team will connect with you and share the demo soon.. stay connected
                </p>
              </div>
            </div>
          )}
        </div>

        <section className="details-section" aria-label="Govlyx platform details">
          <div className="section-kicker">Built around your area</div>
          <h2>One civic layer for your neighbourhood.</h2>
          <p className="section-copy">
            Govlyx connects citizens, community leaders and government departments in one
            local-first platform. No GPS. No long forms. Just your area.
          </p>

          <div className="pillar-grid">
            {pillars.map(({ icon: Icon, title, text }) => (
              <article className="pillar-card" key={title}>
                <div className="pillar-icon">
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flow-section" aria-label="Civic issue lifecycle">
          <div className="flow-copy">
            <div className="section-kicker">Civic issue lifecycle</div>
            <h2>Complaints should travel until they are heard.</h2>
            <p className="section-copy">
              A broken road, water problem or unsafe spot can grow from a local post into
              a department-visible issue as more neighbours engage.
            </p>
          </div>

          <div className="step-rail">
            {issueSteps.map((step, index) => (
              <div className="step-item" key={step}>
                <span className="step-num">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="signal-section" aria-label="Govlyx feature signals">
          {alertExamples.map(({ icon: Icon, title, text }) => (
            <article className="signal-item" key={title}>
              <Icon size={22} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="socials">
          <a
            href="https://instagram.com/govlyx"
            className="soc-link"
            title="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://twitter.com/govlyx"
            className="soc-link"
            title="X / Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/govlyx"
            className="soc-link"
            title="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </main>

      <div className="bottom-logo-wrap">
        <a href="#" className="logo">
          <svg
            className="logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Blue circle background */}
            <circle cx="100" cy="100" r="100" fill="#1D4ED8"/>
            
            {/* All white elements, scaled up and centered */}
            <g transform="translate(100, 102) scale(0.32) translate(-256, -290)">
              {/* Building/columns top */}
              <g fill="#FFFFFF" transform="translate(0, -6)">
                <path d="M256 150c-40 0-72 32-72 72v20h144v-20c0-40-32-72-72-72z" />
                <rect x="220" y="242" width="72" height="16" />
                <rect x="204" y="220" width="12" height="40" />
                <rect x="296" y="220" width="12" height="40" />
              </g>
              {/* Decorative circles */}
              <g fill="#FFFFFF" transform="translate(0, -6)">
                <circle cx="170" cy="210" r="6" />
                <circle cx="196" cy="230" r="4" />
                <circle cx="342" cy="210" r="6" />
                <circle cx="318" cy="230" r="4" />
                <circle cx="256" cy="190" r="5" />
              </g>
              {/* Horizontal bar */}
              <path fill="#FFFFFF" d="M150 300h212l-8 16H158z" />
              {/* Columns */}
              <g fill="#FFFFFF">
                <rect x="248" y="300" width="16" height="120" />
                <rect x="198" y="300" width="16" height="80" />
                <rect x="298" y="300" width="16" height="80" />
              </g>
              {/* Bottom circles (column bases) */}
              <g fill="#FFFFFF">
                <circle cx="256" cy="440" r="18" />
                <circle cx="206" cy="380" r="20" />
                <circle cx="306" cy="380" r="20" />
              </g>
              {/* Flag/banner top */}
              <g>
                <rect x="252" y="118" width="8" height="32" fill="#FFFFFF" />
                <path d="M260 118h45v22l-45-8z" fill="#FFFFFF" />
                <path d="M260 118l35 16l-35-6z" fill="#FFFFFF" opacity="0.4" />
              </g>
            </g>
          </svg>
          Govlyx
        </a>
      </div>

      <footer>
        <span>India first, neighbourhood always</span>
        <span>© 2026 Govlyx Inc.</span>
        <span>Coming soon</span>
      </footer>

      {popup.show && (
        <div className={`popup ${popup.type}`}>
          <div className="popup-content">
            <div className="popup-text-wrap">
              {popup.type === "success" && <Rocket size={18} />}
              {popup.type === "error" && <AlertCircle size={18} />}
              {popup.type === "info" && <Info size={18} />}
              <span>{popup.text}</span>
            </div>
            <button onClick={() => setPopup({ ...popup, show: false })}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

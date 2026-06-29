import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

function App() {
  const glowRef = useRef(null);
  const dotRef = useRef(null);
  const topbarRef = useRef(null);

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
      if (topbar) {
        topbar.classList.toggle("scrolled", window.scrollY > 20);
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

      <main className="page message-page">
        <div className="message-container">
          <div className="status-kicker">
            <span className="pulse-dot" />
            Launching Today
          </div>
          
          <h1 className="message-headline">
            We know we are late,<br />
            but <span className="accent">good things come late</span>.
          </h1>
          
          <div className="message-body">
            <p className="message-line main-line">
              The website is going live in just a few hours—and then it's yours!
            </p>
            <p className="message-line sub-line">
              We want to see you guys happy. Thank you for your patience.
            </p>
          </div>

          <div className="live-badge">
            <Sparkles size={20} className="badge-icon" />
            <span>Govlyx v1.0 Launching Today</span>
          </div>
        </div>
      </main>

      <footer>
        <span>India first, neighbourhood always</span>
        <span>© 2026 Govlyx Inc.</span>
        <span>Going live today</span>
      </footer>
    </div>
  );
}

export default App;

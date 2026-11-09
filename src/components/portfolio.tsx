import { useState, useRef, useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowUpRight, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hero from '@/assets/event-hero.jpg';
import garden from '@/assets/garden-event.jpg';
import social from '@/assets/social-event.jpg';
export const email = 'surbs81@gmail.com';
export const linkedin = 'https://www.linkedin.com/in/surbhisingh1705';
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} | Surbhi Singh` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | Surbhi Singh` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
const nav = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About me' }, { to: '/work', label: 'My work' }, { to: '/budget', label: 'Budget & pricing' }, { to: '/contact', label: 'Contact' }] as const;
export function Header() {
 const [open,setOpen] = useState(false); const pathname = useRouterState({ select:s=>s.location.pathname });
 const links = nav.map(n=><Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className={`nav-link ${pathname === n.to ? 'active' : ''}`}>{n.label}</Link>);
 return <><header className="site-header"><Link to="/" className="brand" aria-label="Surbhi Singh home"><span className="brand-mark">s.</span><div><div className="brand-name">Surbhi Singh<span className="highlight">.</span></div><div className="brand-sub">EVENTS WITH INTENTION</div></div></Link><nav className="desktop-nav" aria-label="Main navigation">{links}</nav><Button variant="outline" asChild className="header-cta"><Link to="/contact">Let’s talk <ArrowUpRight /></Link></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></header>{open&&<nav className="mobile-nav" aria-label="Mobile navigation">{links}</nav>}</>;
}
export function Footer() { return <footer className="footer"><span>© {new Date().getFullYear()} Surbhi Singh. Made with intention.</span><div className="footer-links"><a href={`mailto:${email}`}>Email <ArrowUpRight size={11} className="inline" /></a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={11} className="inline" /></a><span>Student portfolio</span></div></footer>; }
export function ContactCTA() { return <section className="cta-band"><div className="section cta-inner"><div><div className="eyebrow"><Sparkles size={13}/> YOUR NEXT GREAT MOMENT</div><h2>Have an idea? Let’s make it happen<span className="highlight">.</span></h2><p>A celebration, a campus event, or something entirely your own.</p></div><Button size="lg" asChild><Link to="/contact">Let’s create something <ArrowUpRight/></Link></Button></div></section>; }
export const projects = [{ title:'The Violet Edit', image:hero, category:'Intimate celebrations', detail:'Immersive styling · Dinner experience', description:'A concept for an intimate evening where sculptural draping, violet lighting, and thoughtful table styling set the mood.' },{ title:'Under the Open Sky', image:garden, category:'Social gatherings', detail:'Garden setting · Tablescape design', description:'An outdoor celebration concept pairing seasonal florals with warm candlelight and a relaxed, shared-table experience.' },{ title:'After Hours', image:social, category:'Campus & community', detail:'Creative networking · Experience design', description:'A networking concept built around a bold stage, intimate conversation spaces, and a cohesive visual identity.' }];
function ConceptCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(rmQuery.matches);
    const onRmChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    rmQuery.addEventListener?.('change', onRmChange);

    const fpQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(fpQuery.matches);
    const onFpChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    fpQuery.addEventListener?.('change', onFpChange);

    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      rmQuery.removeEventListener?.('change', onRmChange);
      fpQuery.removeEventListener?.('change', onFpChange);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFinePointer || prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // Subtle 3D tilt: max ~6.5 degrees
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    const rotateY = normX * 13;
    const rotateX = -normY * 13;

    setTilt({
      rotateX,
      rotateY,
      glareX: pctX,
      glareY: pctY,
      isHovered: true,
    });
  };

  const handleMouseEnter = () => {
    if (!isFinePointer || prefersReducedMotion) return;
    setTilt((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    if (!isFinePointer || prefersReducedMotion) return;
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  const transformStyle =
    isFinePointer && !prefersReducedMotion && tilt.isHovered
      ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  const transitionStyle = prefersReducedMotion
    ? 'none'
    : tilt.isHovered
      ? 'transform 0.14s ease-out'
      : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)';

  return (
    <div
      style={{
        opacity: prefersReducedMotion || inView ? 1 : 0,
        transform: prefersReducedMotion || inView ? 'translateY(0)' : 'translateY(28px)',
        transition: prefersReducedMotion
          ? 'none'
          : `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms`,
        perspective: '1000px',
      }}
    >
      <Link
        ref={cardRef}
        to="/work"
        className="project"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'block',
          transform: transformStyle,
          transition: transitionStyle,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="project-image" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={project.image} alt={project.title + ' event design concept'} width={1200} height={800} loading="lazy" />
          <span className="project-tag">{project.category}</span>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: tilt.isHovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
              background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 230, 255, 0.22) 0%, rgba(192, 132, 252, 0.08) 40%, transparent 80%)`,
              mixBlendMode: 'screen',
              zIndex: 2,
            }}
          />
        </div>
        <div className="project-title">
          <h3>{project.title}</h3>
          <ArrowUpRight />
        </div>
        <p>{project.detail}</p>
      </Link>
    </div>
  );
}

export function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects.map((p, i) => (
        <ConceptCard key={p.title} project={p} index={i} />
      ))}
    </div>
  );
}
export function TextArrow({children}:{children:React.ReactNode}) { return <>{children}<ArrowRight size={14}/></>; }

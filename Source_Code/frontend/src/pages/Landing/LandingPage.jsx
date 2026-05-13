// Import React hooks for state management and side effects
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// Import React Router for navigation links
import { Link } from 'react-router-dom';
// Import GSAP animation library and ScrollTrigger plugin
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Import logo component and theme context
import PlannerLogoMark from '../../components/branding/PlannerLogoMark';
import { useTheme } from '../../context/ThemeContext.jsx';

// Register ScrollTrigger plugin with GSAP to enable scroll-based animations
gsap.registerPlugin(ScrollTrigger);

// Feature cards data - displays key features with icon, title and description
const featureCards = [
  {
    title: 'Smart Schedule',
    copy: 'Build adaptive study sessions around workload, deadlines, fatigue, and available time.',
    icon: 'calendar'
  },
  {
    title: 'Progress Tracking',
    copy: 'See study consistency, completion trends, and momentum without opening five different tools.',
    icon: 'chart'
  },
  {
    title: 'Goal Setting',
    copy: 'Convert subjects, exams, and revision targets into measurable weekly planning milestones.',
    icon: 'target'
  },
  {
    title: 'Smart Reminders',
    copy: 'Stay ahead of overload risk with lightweight alerts, task nudges, and recovery prompts.',
    icon: 'bell'
  }
];

// Step-by-step process data - shows how users interact with the app
const steps = [
  {
    number: '1',
    title: 'Add your subjects',
    copy: 'Create your academic map with deadlines, priorities, and estimated effort.',
    icon: 'subject'
  },
  {
    number: '2',
    title: 'Let the planner evaluate load',
    copy: 'The system reviews task weight, upcoming exams, and available hours.',
    icon: 'planner'
  },
  {
    number: '3',
    title: 'Track progress and energy',
    copy: 'Monitor fatigue, finished tasks, and productivity patterns across the week.',
    icon: 'insight'
  },
  {
    number: '4',
    title: 'Improve your study rhythm',
    copy: 'Refine your schedule before missed work and overload begin to stack.',
    icon: 'trophy'
  }
];

// IconGlyph component - renders SVG icons based on the "type" prop
// Contains multiple icon designs used throughout the landing page
function IconGlyph({ type }) {
  // Common SVG attributes for all icons
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  // Icon SVG paths mapped by type - each icon has unique stroke paths
  const paths = {
    calendar: (
      <>
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M7 3.5v4" />
        <path d="M17 3.5v4" />
        <path d="M3.5 9.5h17" />
        <path d="M8 13h3" />
        <path d="M13 13h3" />
        <path d="M8 17h3" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19.5h16" />
        <path d="M7 16V12" />
        <path d="M12 16V8" />
        <path d="M17 16v-5" />
        <path d="M6 9.5 10 6l4 2 4-3" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.6" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <path d="M18.5 5.5 14.5 9.5" />
      </>
    ),
    bell: (
      <>
        <path d="M8 18.5h8" />
        <path d="M6.5 16.5h11l-1.2-1.8V11a4.3 4.3 0 1 0-8.6 0v3.7Z" />
        <path d="M11 20a1.2 1.2 0 0 0 2 0" />
      </>
    ),
    subject: (
      <>
        <path d="M6 5.5h8a3 3 0 0 1 3 3v10a2.5 2.5 0 0 0-2.5-2.5H6Z" />
        <path d="M6 5.5v13a2.5 2.5 0 0 1 2.5-2.5H17" />
      </>
    ),
    planner: (
      <>
        <rect x="4" y="4.5" width="16" height="15" rx="3" />
        <path d="M8 8.5h8" />
        <path d="M8 12.5h5" />
        <path d="M8 16.5h3" />
      </>
    ),
    insight: (
      <>
        <path d="M5 18.5 9.5 13 13 15.5 19 8.5" />
        <path d="M19 13v-4.5h-4.5" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4.5h8v2.5a4 4 0 0 1-8 0Z" />
        <path d="M8 6H5.8a2.3 2.3 0 0 0 2.4 3" />
        <path d="M16 6h2.2a2.3 2.3 0 0 1-2.4 3" />
        <path d="M12 10.5v4" />
        <path d="M9 20h6" />
        <path d="M10 14.5h4l1 3H9Z" />
      </>
    )
  };

  // Return SVG element with selected icon paths
  return <svg {...common}>{paths[type]}</svg>;
}

// LandingThemeToggle component - renders theme toggle button (Light/Dark mode)
// Takes onRegister callback to track button elements for animations
function LandingThemeToggle({ onRegister }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="ssp-landing__theme-toggle"
      onClick={toggleTheme}
      ref={onRegister}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="ssp-landing__theme-thumb">
        <span className="ssp-landing__theme-icon">{theme === 'dark' ? '◐' : '○'}</span>
      </span>
      <span className="ssp-landing__theme-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}

// Main LandingPage component - landing page with animations, features showcase and CTAs
export default function LandingPage() {
  const { theme } = useTheme();
  // Track scroll state to apply sticky navigation styling
  const [navScrolled, setNavScrolled] = useState(false);
  // Refs for GSAP animation context
  const rootRef = useRef(null);
  const heroArtRef = useRef(null);
  const deviceRef = useRef(null);
  const particleRefs = useRef([]);
  const floatingRefs = useRef([]);
  const cardRefs = useRef([]);
  const buttonRefs = useRef([]);

  // Register particle elements for animation reference
  const registerParticle = (element) => {
    if (element && !particleRefs.current.includes(element)) particleRefs.current.push(element);
  };

  // Register floating elements for animation reference
  const registerFloating = (element) => {
    if (element && !floatingRefs.current.includes(element)) floatingRefs.current.push(element);
  };

  // Register card elements for animation reference
  const registerCard = (element) => {
    if (element && !cardRefs.current.includes(element)) cardRefs.current.push(element);
  };

  // Register button elements for animation reference
  const registerButton = (element) => {
    if (element && !buttonRefs.current.includes(element)) buttonRefs.current.push(element);
  };

  // useEffect - Handle scroll event to toggle navbar styling when scrolled
  // Updates navScrolled state based on scroll position
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // useLayoutEffect - Initialize all GSAP animations
  // Runs before paint to set up animations smoothly
  // Creates GSAP context to manage all animations and their cleanup
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate headline words with staggered fade-in effect
      const headlineWords = gsap.utils.toArray('.headline-word');

      gsap.set(headlineWords, { opacity: 0, y: 42 });
      gsap.to(headlineWords, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out'
      });

      // Animate device (mobile mockup) with floating and rotating effect
      // Includes shadow animation that changes based on theme
      if (deviceRef.current) {
        gsap.to(deviceRef.current, {
          y: -18,
          rotate: 12.5,
          duration: 4.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        gsap.to(deviceRef.current, {
          boxShadow:
            theme === 'dark'
              ? '0 44px 95px rgba(0,0,0,0.5), -20px 20px 34px rgba(54,37,120,0.24), 0 0 36px rgba(123,98,255,0.22)'
              : '0 36px 78px rgba(76,70,160,0.24), -18px 18px 34px rgba(40,31,112,0.18), 0 0 30px rgba(74,169,255,0.16)',
          duration: 3.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }

      // Animate floating elements (books, clocks, caps, notes) with subtle movement
      // Each element has unique animation duration and direction
      floatingRefs.current.forEach((element, index) => {
        const yValues = [-14, -22, -12, -18, -10];
        const xValues = [8, -10, 6, -6, 4];
        const rotateValues = [4, -3, 2, -2, 1];

        gsap.to(element, {
          y: yValues[index % yValues.length],
          x: xValues[index % xValues.length],
          rotate: rotateValues[index % rotateValues.length],
          duration: 4.8 + index * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });

      // Animate background particles with varying opacity and scale
      // Creates depth effect through different animation speeds
      particleRefs.current.forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -20 : 18,
          x: index % 2 === 0 ? 8 : -10,
          opacity: index % 2 === 0 ? 0.45 : 0.8,
          scale: index % 2 === 0 ? 1.15 : 0.86,
          duration: 5 + index * 1.1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });

      // Animate elements on scroll - reveals content as user scrolls down
      // Uses ScrollTrigger for scroll-based animation triggers
      const revealTargets = gsap.utils.toArray('.reveal-on-scroll');
      revealTargets.forEach((target) => {
        gsap.fromTo(
          target,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 78%'
            }
          }
        );
      });

      // Animate feature cards when they come into view
      // Staggered entrance animation for visual interest
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#features',
          start: 'top 76%'
        }
      });

      // Add hover animations to cards - lift up and add shadow on mouse enter
      cardRefs.current.forEach((card) => {
        const hoverIn = () =>
          gsap.to(card, {
            y: -8,
            boxShadow:
              theme === 'dark'
                ? '0 28px 60px rgba(0,0,0,0.42), 0 0 28px rgba(123,98,255,0.16)'
                : '0 26px 54px rgba(75,65,168,0.16), 0 0 18px rgba(74,169,255,0.12)',
            duration: 0.25,
            ease: 'power2.out'
          });

        const hoverOut = () =>
          gsap.to(card, {
            y: 0,
            boxShadow: '',
            duration: 0.25,
            ease: 'power2.out'
          });

        card.addEventListener('mouseenter', hoverIn);
        card.addEventListener('mouseleave', hoverOut);
      });

      // Add hover and click animations to buttons
      // Scale effect on hover and press animation on click
      buttonRefs.current.forEach((button) => {
        const hoverIn = () =>
          gsap.to(button, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
          });

        const hoverOut = () =>
          gsap.to(button, {
            scale: 1,
            duration: 0.22,
            ease: 'power2.out'
          });

        const press = () =>
          gsap.to(button, {
            scale: 0.98,
            duration: 0.08,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          });

        button.addEventListener('mouseenter', hoverIn);
        button.addEventListener('mouseleave', hoverOut);
        button.addEventListener('click', press);
      });

      // Add 3D perspective effect to device on mouse movement
      // Device rotates based on mouse position within hero section
      // Creates depth and interactivity effect
      if (heroArtRef.current && deviceRef.current) {
        const handleMove = (event) => {
          const bounds = heroArtRef.current.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;

          gsap.to(deviceRef.current, {
            rotateY: x * 8,
            rotateX: -y * 8,
            duration: 0.35,
            ease: 'power2.out'
          });
        };

        const reset = () => {
          gsap.to(deviceRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.45,
            ease: 'power2.out'
          });
        };

        heroArtRef.current.addEventListener('mousemove', handleMove);
        heroArtRef.current.addEventListener('mouseleave', reset);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [theme]);

  // Smooth scroll to section function - handles navigation to page sections
  // Accounts for navbar height offset for proper positioning
  const scrollToSection = (event, id) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    const navOffset = 112;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // JSX Structure - Main landing page container
  return (
    <div className={`ssp-landing theme-${theme}`} ref={rootRef}>
      <div className="ssp-landing__bg">
        <span className="ssp-landing__particle particle-a" ref={registerParticle} />
        <span className="ssp-landing__particle particle-b" ref={registerParticle} />
        <span className="ssp-landing__particle particle-c" ref={registerParticle} />
        <span className="ssp-landing__particle particle-d" ref={registerParticle} />
        <span className="ssp-landing__grid" />
      </div>

      {/* Navigation Header - Sticky navbar with theme toggle and auth links */}
      <header className={`ssp-landing__nav ${navScrolled ? 'is-scrolled' : ''}`}>
        <Link to="/" className="ssp-landing__brand">
          <span className="ssp-landing__brand-mark">
            <PlannerLogoMark size={36} accent={theme === 'dark' ? 'green' : 'dark'} />
          </span>
          <span>
            <strong>Smart Study Planner</strong>
            <small>Academic productivity system</small>
          </span>
        </Link>

        <nav className="ssp-landing__links">
          <a href="#features" onClick={(event) => scrollToSection(event, 'features')}>Features</a>
          <a href="#how-it-works" onClick={(event) => scrollToSection(event, 'how-it-works')}>How it works</a>
          <a href="#benefits" onClick={(event) => scrollToSection(event, 'benefits')}>Benefits</a>
          <a href="#cta" onClick={(event) => scrollToSection(event, 'cta')}>Get started</a>
        </nav>

        <div className="ssp-landing__nav-actions">
          <LandingThemeToggle onRegister={registerButton} />
          <Link to="/login" className="ssp-landing__ghost-btn" ref={registerButton}>Log in</Link>
          <Link to="/register" className="ssp-landing__primary-btn" ref={registerButton}>Get Started</Link>
        </div>
      </header>

      <main className="ssp-landing__main">
        {/* Hero Section - Main headline with call-to-action and animated device mockup */}
        <section className="ssp-landing__hero">
          <div className="ssp-landing__hero-copy reveal-on-scroll">
            <span className="ssp-landing__eyebrow">Plan smarter. Study calmer.</span>
            <h1 className="ssp-landing__headline">
              <span className="headline-word">Your</span>{' '}
              <span className="headline-word headline-word-accent">Smart</span>{' '}
              <span className="headline-word">Study</span>{' '}
              <span className="headline-word">Partner</span>
            </h1>
            <p>
              Organize subjects, adapt study intensity to real workload, and keep progress visible
              without turning your week into a burnout experiment.
            </p>
            <div className="ssp-landing__hero-actions">
              <Link to="/register" className="ssp-landing__primary-btn" ref={registerButton}>Get Started Free</Link>
              <a
                href="#how-it-works"
                className="ssp-landing__watch-btn"
                ref={registerButton}
                onClick={(event) => scrollToSection(event, 'how-it-works')}
              >
                <span className="ssp-landing__watch-icon">▶</span>
                Watch Demo
              </a>
            </div>
          </div>

          <div className="ssp-landing__hero-art reveal-on-scroll" ref={heroArtRef}>
            <div className="ssp-landing__hero-glow" />
            <div className="ssp-landing__orbit orbit-a" />
            <div className="ssp-landing__orbit orbit-b" />
            <div className="ssp-landing__plinth" />

            <div className="ssp-landing__device" ref={deviceRef}>
              <div className="ssp-landing__device-top">
                <span className="ssp-landing__device-notch" />
                <span className="ssp-landing__device-camera" />
              </div>
              <div className="ssp-landing__device-screen">
                <div className="ssp-landing__device-summary">
                  <div>
                    <strong>Today&apos;s plan</strong>
                    <span>Adaptive workload balance</span>
                  </div>
                  <div className="ssp-landing__progress-ring">75%</div>
                </div>

                <div className="ssp-landing__task-card tone-blue">
                  <b>Math Focus</b>
                  <small>9:00 AM - 10:30 AM</small>
                </div>
                <div className="ssp-landing__task-card tone-violet">
                  <b>Physics Review</b>
                  <small>11:00 AM - 12:15 PM</small>
                </div>
                <div className="ssp-landing__task-card tone-green">
                  <b>Recovery Break</b>
                  <small>12:30 PM - 1:00 PM</small>
                </div>
                <div className="ssp-landing__task-card tone-indigo">
                  <b>Chemistry Drill</b>
                  <small>3:00 PM - 4:00 PM</small>
                </div>
              </div>
            </div>

            <div className="ssp-landing__floating-book" ref={registerFloating}>
              <span className="ssp-landing__book-top" />
              <span className="ssp-landing__book-pages" />
            </div>

            <div className="ssp-landing__floating-clock" ref={registerFloating}>
              <span className="clock-face" />
              <span className="clock-hand short" />
              <span className="clock-hand long" />
            </div>

            <div className="ssp-landing__floating-cap" ref={registerFloating}>
              <span className="cap-top" />
              <span className="cap-base" />
              <span className="cap-thread" />
            </div>

            <div className="ssp-landing__glass-note note-left" ref={registerFloating}>
              <strong>Balanced study load</strong>
              <span>Heavy sessions automatically shifted away from high-fatigue windows.</span>
            </div>

            <div className="ssp-landing__glass-note note-right" ref={registerFloating}>
              <strong>Overload signals</strong>
              <span>Spot missed tasks, pressure spikes, and recovery gaps before they stack.</span>
            </div>
          </div>
        </section>

        {/* Features Section - Displays key product features with icons and descriptions */}
        <section id="features" className="ssp-landing__section reveal-on-scroll">
          <div className="ssp-landing__section-head">
            <span className="ssp-landing__eyebrow">Features</span>
            <h2>Everything you need to run an academic system, not just a to-do list.</h2>
          </div>
          <div className="ssp-landing__feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="ssp-landing__feature-card" ref={registerCard}>
                <div className="ssp-landing__feature-icon">
                  <IconGlyph type={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How It Works Section - Step-by-step guide showing user journey through the app */}
        <section id="how-it-works" className="ssp-landing__section reveal-on-scroll">
          <div className="ssp-landing__section-head">
            <span className="ssp-landing__eyebrow">How it works</span>
            <h2>Plan. Study. Adapt. Improve.</h2>
          </div>
          <div className="ssp-landing__steps-line" aria-hidden="true" />
          <div className="ssp-landing__steps-grid">
            {steps.map((step) => (
              <article key={step.number} className="ssp-landing__step-card" ref={registerCard}>
                <span className="ssp-landing__step-badge">{step.number}</span>
                <div className="ssp-landing__step-icon">
                  <IconGlyph type={step.icon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Benefits Section - Highlights unique value propositions and main benefits */}
        <section id="benefits" className="ssp-landing__section reveal-on-scroll">
          <div className="ssp-landing__benefit-panel" ref={registerCard}>
            <div className="ssp-landing__benefit-copy">
              <span className="ssp-landing__eyebrow">Benefits</span>
              <h2>A planning surface that respects focus, deadlines, and recovery equally.</h2>
              <p>
                Smart Study Planner combines scheduling, workload control, mental-load awareness,
                and actionable analytics into one clean workspace.
              </p>
            </div>
            <div className="ssp-landing__benefit-stats">
              <div>
                <strong>Adaptive schedule engine</strong>
                <span>Balances subject load across the week.</span>
              </div>
              <div>
                <strong>Fatigue-aware planning</strong>
                <span>Reduces heavy sessions on recovery-focused days.</span>
              </div>
              <div>
                <strong>Clean analytics layer</strong>
                <span>Makes productivity patterns easy to understand.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section - Final push to sign up with animated decorative elements */}
        <section id="cta" className="ssp-landing__section reveal-on-scroll">
          <div className="ssp-landing__cta-panel" ref={registerCard}>
            <div className="ssp-landing__cta-object stack-books">
              <span />
              <span />
              <span className="star" />
            </div>
            <div className="ssp-landing__cta-copy">
              <h2>Ready to Transform Your Study Journey?</h2>
              <p>Start with a cleaner study system built for actual academic pressure.</p>
              <Link to="/register" className="ssp-landing__primary-btn" ref={registerButton}>Get Started Free</Link>
            </div>
            <div className="ssp-landing__cta-object backpack">
              <span className="bag-body" />
              <span className="bag-pocket" />
              <span className="bag-handle" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

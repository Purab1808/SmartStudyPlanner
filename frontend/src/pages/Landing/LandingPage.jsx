import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const featureCards = [
  {
    title: 'Deadline-aware planning',
    copy: 'Turn exam dates, subject difficulty, and pending work into a weekly plan that is actually realistic.'
  },
  {
    title: 'Mental load tracking',
    copy: 'Log fatigue, stress, motivation, and sleep so the planner understands when to push and when to lighten the load.'
  },
  {
    title: 'Balanced weekly schedules',
    copy: 'Spread study blocks across the week to avoid overload spikes and keep energy available for high-priority subjects.'
  },
  {
    title: 'Actionable analytics',
    copy: 'See study hours, productivity score, and fatigue trends in one place to understand what is helping and what is draining you.'
  }
];

const steps = [
  {
    number: '01',
    title: 'Set up your subjects',
    copy: 'Add courses, exam dates, estimated hours, and priority so the planner knows what matters most.'
  },
  {
    number: '02',
    title: 'Track how you actually feel',
    copy: 'Daily mental-load check-ins tell the system whether you should take heavier study blocks or lighter recovery-friendly work.'
  },
  {
    number: '03',
    title: 'Generate your weekly plan',
    copy: 'The engine creates a study schedule that considers urgency, effort, available hours, and your current energy.'
  },
  {
    number: '04',
    title: 'Adjust and improve',
    copy: 'Review overload warnings and analytics, then refine your rhythm instead of repeating the same burnout cycle.'
  }
];

const techList = [
  'React frontend with responsive dashboard flows',
  'Node.js and Express REST API backend',
  'MongoDB data model for users, tasks, subjects, and schedules',
  'JWT authentication with protected routes and email OTP flows',
  'Analytics, overload detection, and adaptive schedule generation'
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-mark" aria-hidden="true">
            <span className="landing-brand-page landing-brand-page-left" />
            <span className="landing-brand-page landing-brand-page-right" />
            <span className="landing-brand-spine" />
            <span className="landing-brand-signal pulse-seg-a" />
            <span className="landing-brand-signal pulse-seg-b" />
            <span className="landing-brand-signal pulse-seg-c" />
            <span className="landing-brand-signal pulse-seg-d" />
          </span>
          <span>
            <strong>Smart Study Planner</strong>
            <small>Mental-load aware study planning</small>
          </span>
        </Link>

        <nav className="landing-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#technology">Technology</a>
          <a href="#why-it-matters">Why it matters</a>
        </nav>

        <div className="landing-actions">
          <Link to="/login" className="landing-link-button">
            Log in
          </Link>
          <Link to={isAuthenticated ? '/dashboard' : '/register'} className="landing-cta-button">
            {isAuthenticated ? 'Open dashboard' : 'Get started'}
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-kicker">Adaptive academic planning</span>
            <h1>Study plans that respond to both deadlines and mental energy.</h1>
            <p>
              Smart Study Planner helps students organize subjects, track fatigue,
              generate balanced schedules, and avoid the cycle of overplanning followed
              by burnout.
            </p>
            <div className="landing-hero-actions">
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="landing-cta-button">
                {isAuthenticated ? 'Go to dashboard' : 'Create your account'}
              </Link>
              <Link to="/login" className="landing-secondary-button">
                I already have an account
              </Link>
            </div>
            <div className="landing-proof-row">
              <div>
                <strong>Mental-load based</strong>
                <span>Adjust study intensity by fatigue and sleep</span>
              </div>
              <div>
                <strong>Weekly optimization</strong>
                <span>Prevent overload before it stacks up</span>
              </div>
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-visual-shell">
              <div className="landing-visual-topbar">
                <span className="landing-window-dot dot-red" />
                <span className="landing-window-dot dot-gold" />
                <span className="landing-window-dot dot-green" />
                <strong>This week&apos;s adaptive study map</strong>
              </div>

              <div className="landing-visual-grid">
                <div className="landing-visual-panel">
                  <span className="landing-mini-label">Mental load</span>
                  <div className="landing-bars">
                    <span style={{ height: '38%' }} />
                    <span style={{ height: '66%' }} />
                    <span style={{ height: '44%' }} />
                    <span style={{ height: '72%' }} />
                    <span style={{ height: '48%' }} />
                    <span style={{ height: '30%' }} />
                    <span style={{ height: '56%' }} />
                  </div>
                </div>

                <div className="landing-visual-panel">
                  <span className="landing-mini-label">Study queue</span>
                  <div className="landing-schedule-stack">
                    <div className="landing-schedule-item">
                      <strong>Mathematics</strong>
                      <span>2h 15m | high focus</span>
                    </div>
                    <div className="landing-schedule-item">
                      <strong>Physics</strong>
                      <span>1h 20m | moderate</span>
                    </div>
                    <div className="landing-schedule-item">
                      <strong>History</strong>
                      <span>45m | light review</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="landing-floating-note note-left">
                <strong>Fatigue rose today</strong>
                <span>Planner shifted one heavy block to tomorrow.</span>
              </div>

              <div className="landing-floating-note note-right">
                <strong>Overload prevented</strong>
                <span>Daily hours balanced before exam week spikes.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="landing-section-head">
            <span className="landing-kicker">Features</span>
            <h2>Built for students who need structure without ignoring wellbeing.</h2>
          </div>
          <div className="landing-feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="landing-feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="landing-section landing-section-alt">
          <div className="landing-section-head">
            <span className="landing-kicker">How it works</span>
            <h2>A clear flow from raw workload to a smarter weekly study plan.</h2>
          </div>
          <div className="landing-steps-grid">
            {steps.map((step) => (
              <article key={step.number} className="landing-step-card">
                <span className="landing-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="technology" className="landing-section">
          <div className="landing-tech-panel">
            <div className="landing-tech-copy">
              <span className="landing-kicker">Technology</span>
              <h2>Engineered as a complete full-stack academic planning product.</h2>
              <p>
                The application combines a modern React frontend with an API-driven backend,
                secure authentication, analytics, schedule generation, and mental-load tracking.
              </p>
            </div>
            <div className="landing-tech-list">
              {techList.map((item) => (
                <div key={item} className="landing-tech-item">
                  <span className="landing-tech-bullet" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why-it-matters" className="landing-section">
          <div className="landing-cta-panel">
            <div>
              <span className="landing-kicker">Why it matters</span>
              <h2>Most planners track tasks. This one also tracks the cost of doing them.</h2>
              <p>
                When study systems ignore fatigue, stress, and recovery, they become easy to abandon.
                Smart Study Planner is designed to make consistency more realistic.
              </p>
            </div>
            <div className="landing-hero-actions">
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="landing-cta-button">
                {isAuthenticated ? 'Continue planning' : 'Start planning now'}
              </Link>
              <Link to="/login" className="landing-secondary-button">
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

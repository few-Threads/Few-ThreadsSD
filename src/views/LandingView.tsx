import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  GitBranch,
  Globe2,
  Network,
  Play,
  Pause,
  Flame,
  RefreshCw,
  AlertTriangle,
  Cpu,
  BookOpen,
  Layers,
  Sparkles,
  Shield,
  Loader2,
  Award,
  WandSparkles,
  GraduationCap,
  Briefcase,
  Users,
  ChevronDown,
  MessageSquareText,
  Target,
  Server,
} from 'lucide-react';

const STATS = [
  ['169', 'Components'],
  ['30', 'Chaos Scenarios'],
  ['245', 'Quizzes'],
  ['7', 'Learning Tracks'],
];

const AI_TAGS = [
  'AI Architecture Generator',
  'AI Design Review',
  'Chaos Engineering',
  'Cloud Cost Estimates',
  'Interview Prep',
  'HLD + LLD',
];

const PLATFORM_OFFERINGS = [
  {
    icon: WandSparkles,
    title: 'AI Architecture Generator',
    description: 'Describe what you are building in plain English. The AI co-pilot picks the components, places them on the canvas and wires the connections for you.',
    badge: 'AI',
  },
  {
    icon: Bot,
    title: 'AI Design Review',
    description: 'Get instant feedback on single points of failure, scaling bottlenecks, caching gaps and cloud spend, powered by Llama 3.3 with a Gemini fallback.',
    badge: 'AI',
  },
  {
    icon: Network,
    title: 'High-Level Design Canvas',
    description: 'Drag from 169+ components — gateways, load balancers, Kafka, Redis, PostgreSQL, Kubernetes — and connect them over HTTP, gRPC, WebSocket or TCP.',
    badge: 'Canvas',
  },
  {
    icon: Flame,
    title: 'Chaos Engineering Lab',
    description: 'Crash a database, split the network, spike latency or flood traffic. Watch throughput, p99 latency and error rates react in real time.',
    badge: 'Simulator',
  },
  {
    icon: Cpu,
    title: 'Cloud Cost Estimator',
    description: 'See monthly cost estimates for AWS, GCP and Azure update as you add replicas and scale traffic, before you commit to anything real.',
    badge: 'Planning',
  },
  {
    icon: Layers,
    title: 'Low-Level Design',
    description: 'Model ERDs, define REST and GraphQL APIs, generate database schemas and sketch UML class and sequence diagrams.',
    badge: 'LLD',
  },
  {
    icon: BookOpen,
    title: 'System Design Academy',
    description: 'Seven tracks from fundamentals to SRE: CAP theorem, consistent hashing, sharding, sagas, replication — each with quizzes and badges.',
    badge: 'Learn',
  },
  {
    icon: Target,
    title: 'Interview Mode',
    description: 'Timed 45–60 minute system design challenges with real requirements, hints and AI follow-up questions, like the real thing.',
    badge: 'Practice',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Describe it',
    description: 'Tell the AI what you are building — "a chat app for 10M users" — and get a starter architecture in seconds. Or start from one of 20 presets.',
  },
  {
    step: '02',
    title: 'Weave the threads',
    description: 'Refine the design on an infinite canvas. Add caches, queues and replicas, pick protocols, and watch requests flow through every connection.',
  },
  {
    step: '03',
    title: 'Pull a thread',
    description: 'Inject a failure and see what unravels. Then ask the AI reviewer why — and how to make the design hold next time.',
  },
];

const AUDIENCES = [
  {
    icon: Briefcase,
    title: 'Interview candidates',
    description: 'Practise the open-ended "design Twitter" round with a timer, hints and an AI interviewer that asks the follow-ups.',
  },
  {
    icon: Server,
    title: 'Backend & platform engineers',
    description: 'Sketch a proposal, stress-test it with chaos scenarios and get a cost estimate before the design review.',
  },
  {
    icon: GraduationCap,
    title: 'Students & self-learners',
    description: 'Learn distributed systems by building them — every lesson connects theory to something you can see and break.',
  },
  {
    icon: Users,
    title: 'Tech leads & educators',
    description: 'Explain architecture decisions visually and show teams exactly how a failure cascades through a system.',
  },
];

const FAQS = [
  {
    q: 'What is Few Threads?',
    a: 'Few Threads is a browser-based system design studio. You design software architectures on an infinite canvas, simulate traffic and failures, get AI feedback, and learn the distributed-systems concepts behind each decision.',
  },
  {
    q: 'How does the AI help me design systems?',
    a: 'Describe your requirements in plain English and the AI co-pilot generates a starter architecture on the canvas. It also reviews designs for single points of failure, scaling bottlenecks, caching gaps and cost issues.',
  },
  {
    q: 'Can I use Few Threads to prepare for system design interviews?',
    a: 'Yes. Interview mode gives you timed system design challenges with real requirements, hints and AI follow-up questions, and the Interview Preparation track covers the concepts interviewers expect.',
  },
  {
    q: 'Do I need a cloud account or to deploy anything?',
    a: 'No. Traffic, failures and costs are simulated in the browser, so you can crash a database or partition a network without touching real infrastructure.',
  },
  {
    q: 'Is Few Threads free to try?',
    a: 'Yes. Click Try as Guest to get an instant workspace without signing up, or create a free account to save your architectures and track learning progress.',
  },
  {
    q: 'Why the name "Few Threads"?',
    a: 'Every large system is really a few threads — requests, queues, replicas, connections — woven together well. Few Threads helps you see those threads, and what happens when one of them snaps.',
  },
];

const FEATURE_ROADMAP = [
  {
    id: 'hld_complete',
    title: 'Interactive Design Sandbox',
    status: 'available',
    details: 'Infinite canvas workspace, tool selection modal, connection validation rules, pre-simulation gates, and live packet flow animations.',
  },
  {
    id: 'chaos_lab',
    title: 'Chaos Engineering Laboratory',
    status: 'available',
    details: 'Trigger database failures, split-brain partitions, network drops, or gateway latency and trace cascading effects.',
  },
  {
    id: 'academy_lessons',
    title: 'Distributed Systems Academy',
    status: 'available',
    details: '7 curriculum paths containing 49 lessons, interactive CAP and sharding visualizers, and quiz tracks.',
  },
  {
    id: 'lld_suite',
    title: 'Low-Level Design (LLD) Suite',
    status: 'in production',
    details: 'Visual ERD schema builder with DDL export, API REST/GraphQL endpoint config, UML Class maps, and PlantUML builders.',
  },
  {
    id: 'realtime_collab',
    title: 'Real-Time CRDT Collaboration',
    status: 'planned',
    details: 'Multi-user collaborative canvas editing and whiteboarding using conflict-free replicated data types (Yjs) and PartyKit.',
  },
  {
    id: 'devops_iac',
    title: 'DevOps & IaC Generators',
    status: 'planned',
    details: 'Automated Terraform HCL, Kubernetes YAML, and docker-compose.yml configuration generators derived from canvas topologies.',
  },
];

export function LandingView() {
  const navigate = useNavigate();
  // The landing page always uses the light palette, independent of the app theme.
  const resolvedTheme = 'light' as 'light' | 'dark';
  const { register } = useAuth();

  // Guest session loading state
  const [isRegisteringGuest, setIsRegisteringGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  // Simulation controls in Welcome Visual
  const [simRunning, setSimRunning] = useState(true);
  const [chaosState, setChaosState] = useState<'none' | 'db_crash' | 'split_brain' | 'latency_spike'>('none');
  const [queueCount, setQueueCount] = useState(0);
  const [metrics, setMetrics] = useState({ rps: 2450, latency: 42, errorRate: 0 });

  // System Design Scaling animation state
  const [scaleReplicas, setScaleReplicas] = useState(1);
  const [scaleActive, setScaleActive] = useState(false);

  // Cyber Attack Section state
  const [attackBlockedCount, setAttackBlockedCount] = useState(0);

  // AI Code section state
  const [aiStep, setAiStep] = useState(0);
  const [aiTypingText, setAiTypingText] = useState('');

  // Academy quiz section state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  // Guest login execution
  const handleGuestSession = useCallback(async () => {
    setIsRegisteringGuest(true);
    setGuestError(null);
    const randomId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const guestUser = `guest_${randomId}`;
    const guestEmail = `guest_${randomId}@fewthreads.io`;
    try {
      await register(guestUser, guestEmail, 'GuestPassword123');
      navigate('/canvas', { replace: true });
    } catch (err) {
      console.error('Guest registration failed:', err);
      const reason = err instanceof Error ? err.message : '';
      setGuestError(`Could not start guest session${reason ? ` (${reason})` : ''}. Please register manually.`);
      setIsRegisteringGuest(false);
    }
  }, [register, navigate]);

  // Color mappings based on theme
  const colors = useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      bg: isDark ? '#07070a' : '#ffffff',
      text: isDark ? '#f3f4f6' : '#111827',
      textDim: isDark ? '#9ca3af' : '#4b5563',
      textMuted: isDark ? '#6b7280' : '#6b7280',
      border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      borderBright: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.18)',
      cardBg: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.7)',
      cardHover: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.95)',
      panelBg: isDark ? 'rgba(10, 10, 15, 0.85)' : 'rgba(255, 255, 255, 0.94)',
      sectionAlt: isDark ? '#0a0a0f' : '#f7f6fb',
      dotColor: isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(0, 0, 0, 0.04)',
      shadow: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.06)',
      glow: isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.05)',
    };
  }, [resolvedTheme]);

  // Fluctuating simulator metrics
  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      setMetrics((prev) => {
        if (chaosState === 'db_crash') {
          setQueueCount((q) => Math.min(100, q + 3));
          return {
            rps: Math.max(900, Math.floor(prev.rps - 100 + Math.random() * 80)),
            latency: Math.min(2800, prev.latency + Math.floor(Math.random() * 200)),
            errorRate: Math.min(65, prev.errorRate + Math.random() * 5),
          };
        } else if (chaosState === 'split_brain') {
          setQueueCount(0);
          return {
            rps: Math.max(0, Math.floor(prev.rps - 400)),
            latency: 0,
            errorRate: Math.min(100, prev.errorRate + 15),
          };
        } else if (chaosState === 'latency_spike') {
          setQueueCount((q) => Math.min(100, q + 1));
          return {
            rps: Math.max(1600, Math.floor(prev.rps - 50 + Math.random() * 60)),
            latency: Math.min(3200, prev.latency + Math.floor(Math.random() * 150)),
            errorRate: Math.min(18, prev.errorRate + Math.random() * 1.5),
          };
        } else {
          // Normal state
          setQueueCount((q) => Math.max(0, q - 2));
          return {
            rps: Math.floor(2400 + Math.random() * 100),
            latency: Math.floor(38 + Math.random() * 8),
            errorRate: Math.max(0, Math.min(0.05, prev.errorRate + (Math.random() * 0.01 - 0.005))),
          };
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [simRunning, chaosState]);

  // Triggering simulation state
  const handleChaosState = (type: typeof chaosState) => {
    if (chaosState === type) {
      setChaosState('none');
    } else {
      setChaosState(type);
      if (type === 'db_crash') {
        setMetrics({ rps: 2200, latency: 120, errorRate: 5 });
      } else if (type === 'split_brain') {
        setMetrics({ rps: 1200, latency: 0, errorRate: 20 });
      } else if (type === 'latency_spike') {
        setMetrics({ rps: 2300, latency: 80, errorRate: 1 });
      }
    }
  };

  // Scaling Loop for System Design visual
  useEffect(() => {
    const interval = setInterval(() => {
      setScaleActive(true);
      setTimeout(() => {
        setScaleReplicas((r) => (r === 3 ? 1 : r + 1));
        setScaleActive(false);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Cyber Attack blocked loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackBlockedCount((c) => c + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // AI Generator typing loop
  useEffect(() => {
    const prompts = [
      'Create high-throughput Kafka pipeline with Consumer scaling...',
      'Deploy PostgreSQL cluster with one active master and two read-replicas...',
      'Build client API Gateway that routes to Redis Cache cluster...'
    ];
    let promptIndex = 0;
    let charIndex = 0;
    let typing = true;

    const interval = setInterval(() => {
      const currentPrompt = prompts[promptIndex];
      if (typing) {
        setAiTypingText(currentPrompt.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex >= currentPrompt.length) {
          typing = false;
          setAiStep(1); // triggers diagram reveal
          setTimeout(() => {
            setAiStep(2); // triggers connection drawing
          }, 1000);
        }
      } else {
        // Wait and delete
        setTimeout(() => {
          typing = true;
          setAiStep(0);
          charIndex = 0;
          promptIndex = (promptIndex + 1) % prompts.length;
        }, 3000);
        typing = true;
      }
    }, 75);

    return () => clearInterval(interval);
  }, []);

  const handleAnswerSubmit = (ans: string) => {
    setSelectedAnswer(ans);
    setQuizSuccess(ans === 'b');
  };

  return (
    <main
      style={{
        flex: 1,
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: colors.bg,
        color: colors.text,
        fontFamily: "'DM Sans', sans-serif",
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <style>{`
        /* Packet motion animation */
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shieldWave {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes floatNode {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .hero-packet-circle {
          animation: pulseGlow 1.5s ease-in-out infinite;
        }
        .landing-card {
          border: 1px solid ${colors.border};
          background: ${colors.cardBg};
          box-shadow: 0 4px 24px ${colors.shadow};
          backdrop-filter: blur(12px);
          transition: all 0.2s ease-in-out;
        }
        .landing-card:hover {
          border-color: ${colors.borderBright};
          transform: translateY(-2px);
        }
        .btn-theme {
          background: #7C3AED;
          color: white;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-theme:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.35);
        }
        .btn-theme-outline {
          background: ${colors.cardBg};
          border: 1px solid ${colors.borderBright};
          color: ${colors.text};
          transition: all 0.2s ease;
        }
        .btn-theme-outline:hover {
          background: ${colors.cardHover};
          border-color: ${colors.text};
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item .faq-chevron { transition: transform 0.2s ease; }
        .faq-item[open] .faq-chevron { transform: rotate(180deg); }
        .faq-item:hover { transform: none; }
        .footer-links a {
          color: ${colors.textDim};
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-links a:hover { color: ${colors.text}; }
        a:focus-visible, button:focus-visible, summary:focus-visible {
          outline: 2px solid #A78BFA;
          outline-offset: 2px;
        }
        @media (max-width: 960px) {
          .welcome-grid { grid-template-columns: 1fr !important; text-align: center; }
          .welcome-actions { justify-content: center !important; }
          .welcome-title { font-size: 52px !important; }
          .visual-columns { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .interactive-flow-bg { display: none !important; }
          .how-grid, .roadmap-grid { grid-template-columns: 1fr !important; }
          .audience-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .welcome-title { font-size: 42px !important; }
          .audience-grid { grid-template-columns: 1fr !important; }
          section h2 { font-size: 26px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Decorative Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${colors.dotColor} 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* SECTION 1: WELCOME / HERO (Large Animation Background) */}
      <section
        style={{
          position: 'relative',
          minHeight: '94vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 60px',
          overflow: 'hidden',
        }}
      >
        {/* Large Immersive SVGs & Network Mesh Background */}
        <div
          className="interactive-flow-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: resolvedTheme === 'dark' ? 0.8 : 0.6,
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
            {/* Background glowing links */}
            <g opacity="0.3">
              <path d="M 100,400 L 300,200" stroke={resolvedTheme === 'dark' ? '#06B6D4' : '#0EA5E9'} strokeWidth="1.5" />
              <path d="M 100,400 L 300,600" stroke="#EF4444" strokeWidth="1.5" />
              <path d="M 300,200 L 500,200" stroke="gray" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 300,200 L 600,400" stroke={resolvedTheme === 'dark' ? '#8B5CF6' : '#6D28D9'} strokeWidth="1.5" />
              <path d="M 300,600 L 600,400" stroke="gray" strokeWidth="1.5" />
              <path d="M 600,400 L 800,250" stroke={resolvedTheme === 'dark' ? '#10B981' : '#059669'} strokeWidth="1.5" />
              <path d="M 600,400 L 800,550" stroke="gray" strokeWidth="1.2" />
              <path d="M 800,250 L 1050,400" stroke={resolvedTheme === 'dark' ? '#10B981' : '#059669'} strokeWidth="1.8" />
              <path d="M 800,550 L 1050,400" stroke="gray" strokeWidth="1" />
            </g>

            {/* Continuous SVG Animated Packets */}
            {simRunning && (
              <g>
                {/* Path 1: Client to API (Cyan) */}
                <circle r="4" fill="#06B6D4" className="hero-packet-circle">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M 100,400 L 300,200 L 600,400" />
                </circle>

                {/* Path 2: Client to Queue (Red Attack/Alert packets during chaos) */}
                <circle r="4" fill={chaosState !== 'none' ? '#EF4444' : '#06B6D4'} className="hero-packet-circle">
                  <animateMotion dur="4.2s" repeatCount="indefinite" path="M 100,400 L 300,600 L 600,400" />
                </circle>

                {/* Path 3: API Gateway to Cache/Database (Purple/Green) */}
                {chaosState !== 'db_crash' && (
                  <circle r="3.5" fill="#10B981" className="hero-packet-circle">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 600,400 L 800,250 L 1050,400" />
                  </circle>
                )}

                <circle r="3.5" fill="#8B5CF6" className="hero-packet-circle">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M 600,400 L 800,550 L 1050,400" />
                </circle>
              </g>
            )}

            {/* foreignObject components for real icons */}
            <foreignObject x="68" y="368" width="64" height="64" style={{ animation: 'floatNode 5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#06B6D4' }}>
                <Globe2 size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>Client</span>
              </div>
            </foreignObject>

            <foreignObject x="268" y="168" width="64" height="64" style={{ animation: 'floatNode 6s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8B5CF6' }}>
                <Cpu size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>Gateway</span>
              </div>
            </foreignObject>

            <foreignObject x="268" y="568" width="64" height="64" style={{ animation: 'floatNode 7s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: chaosState !== 'none' ? '#EF4444' : '#9ca3af' }}>
                <GitBranch size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>LB Node</span>
              </div>
            </foreignObject>

            <foreignObject x="568" y="368" width="64" height="64" style={{ animation: 'floatNode 4.5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#7C3AED' }}>
                <Cpu size={26} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>API Pool</span>
              </div>
            </foreignObject>

            <foreignObject x="768" y="218" width="64" height="64" style={{ animation: 'floatNode 5.5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: chaosState === 'db_crash' ? '#EF4444' : '#10B981' }}>
                <Database size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>Postgres</span>
              </div>
            </foreignObject>

            <foreignObject x="768" y="518" width="64" height="64" style={{ animation: 'floatNode 6.5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#F97316' }}>
                <Layers size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>Kafka MQ</span>
              </div>
            </foreignObject>

            <foreignObject x="1018" y="368" width="64" height="64" style={{ animation: 'floatNode 5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#06B6D4' }}>
                <Database size={24} />
                <span style={{ fontSize: 9, color: colors.textDim, fontWeight: 'bold', marginTop: 4 }}>Replicas</span>
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* Hero Overlay Panel */}
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 24,
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
          }}
          className="welcome-grid"
        >
          {/* Welcome Text Left */}
          <div
            style={{
              textAlign: 'left',
              padding: '24px',
              borderRadius: 20,
              background: colors.panelBg,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 24px 64px ${colors.shadow}`,
              backdropFilter: 'blur(16px)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 99,
                padding: '6px 14px',
                marginBottom: 20,
              }}
            >
              <Sparkles size={13} color="#6D28D9" />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#6D28D9', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                AI System Design Studio
              </span>
            </div>

            <h1
              className="welcome-title"
              style={{
                fontSize: 62,
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: 20,
              }}
            >
              Few Threads
              <span style={{ display: 'block', fontSize: '0.62em', lineHeight: 1.15, background: 'linear-gradient(90deg, #7C3AED 0%, #0891B2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 8 }}>
                Design systems with AI. Break them on purpose.
              </span>
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.6, color: colors.textDim, marginBottom: 18, maxWidth: 560 }}>
              Every great system starts with a few threads — a request, a queue, a replica. Weave them together on an infinite canvas, let AI draft and review your architecture, then pull a thread with chaos testing to see what holds.
            </p>

            <ul aria-label="Few Threads capabilities" className="ai-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, listStyle: 'none', padding: 0, margin: '0 0 26px' }}>
              {AI_TAGS.map((tag) => (
                <li
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 600,
                    color: tag.startsWith('AI') ? '#6D28D9' : colors.textDim,
                    background: tag.startsWith('AI') ? 'rgba(124,58,237,0.1)' : colors.cardBg,
                    border: `1px solid ${tag.startsWith('AI') ? 'rgba(124,58,237,0.3)' : colors.border}`,
                    padding: '4px 9px',
                    borderRadius: 6,
                  }}
                >
                  {tag.startsWith('AI') && <Sparkles size={10} />}
                  {tag}
                </li>
              ))}
            </ul>

            {guestError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 6, fontSize: 12, marginBottom: 16 }}>
                ⚠️ {guestError}
              </div>
            )}

            <div className="welcome-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              {/* Try as Guest mode */}
              <button
                className="btn-theme"
                onClick={handleGuestSession}
                disabled={isRegisteringGuest}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 48,
                  padding: '0 28px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isRegisteringGuest ? 'not-allowed' : 'pointer',
                }}
              >
                {isRegisteringGuest ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Starting Guest Session…
                  </>
                ) : (
                  <>
                    Try as Guest (Instant)
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                className="btn-theme-outline"
                onClick={() => navigate('/register')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 46,
                  padding: '0 24px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Create Account
              </button>
            </div>
            
            <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
              No sign-up needed — guest mode opens a private workspace instantly.
            </div>

            {/* STATS rendering inside Welcome panel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 20,
                marginTop: 20,
              }}
              className="stats-grid"
            >
              {STATS.map(([value, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: colors.text }}>{value}</div>
                  <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Real-Time Simulator Dashboard Widget Right */}
          <div className="landing-card" style={{ borderRadius: 16, padding: 18, background: colors.panelBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: simRunning ? '#10B981' : '#F59E0B' }} />
                <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: colors.textDim, fontWeight: 700 }}>
                  LIVE THREAT RADAR
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setSimRunning(s => !s)}
                  style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', padding: 2, display: 'flex' }}
                >
                  {simRunning ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button
                  onClick={() => { setChaosState('none'); setMetrics({ rps: 2450, latency: 42, errorRate: 0 }); setQueueCount(0); }}
                  style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', padding: 2, display: 'flex' }}
                >
                  <RefreshCw size={11} style={{ animation: chaosState !== 'none' ? 'spinSlow 4s linear infinite' : 'none' }} />
                </button>
              </div>
            </div>

            {/* Micro metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ background: colors.bg, padding: 6, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 8.5, color: colors.textMuted }}>Throughput</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{metrics.rps} RPS</div>
              </div>
              <div style={{ background: colors.bg, padding: 6, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 8.5, color: colors.textMuted }}>Latency</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{metrics.latency} ms</div>
              </div>
              <div style={{ background: colors.bg, padding: 6, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 8.5, color: colors.textMuted }}>Error rate</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{metrics.errorRate.toFixed(1)}%</div>
              </div>
              <div style={{ background: colors.bg, padding: 6, borderRadius: 8, border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 8.5, color: colors.textMuted }}>Queue</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{queueCount}%</div>
              </div>
            </div>

            {/* Mini triggers */}
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: colors.textDim, marginBottom: 8, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame size={12} color="#F59E0B" /> Click to Inject Failure
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <button
                  onClick={() => handleChaosState('db_crash')}
                  style={{
                    fontSize: 10,
                    padding: '6px 2px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    border: chaosState === 'db_crash' ? '1px solid #EF4444' : `1px solid ${colors.borderBright}`,
                    background: chaosState === 'db_crash' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: chaosState === 'db_crash' ? '#EF4444' : colors.textDim,
                  }}
                >
                  Crash DB
                </button>
                <button
                  onClick={() => handleChaosState('split_brain')}
                  style={{
                    fontSize: 10,
                    padding: '6px 2px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    border: chaosState === 'split_brain' ? '1px solid #EF4444' : `1px solid ${colors.borderBright}`,
                    background: chaosState === 'split_brain' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: chaosState === 'split_brain' ? '#EF4444' : colors.textDim,
                  }}
                >
                  Split Brain
                </button>
                <button
                  onClick={() => handleChaosState('latency_spike')}
                  style={{
                    fontSize: 10,
                    padding: '6px 2px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                    border: chaosState === 'latency_spike' ? '1px solid #F59E0B' : `1px solid ${colors.borderBright}`,
                    background: chaosState === 'latency_spike' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: chaosState === 'latency_spike' ? '#F59E0B' : colors.textDim,
                  }}
                >
                  Spike Latency
                </button>
              </div>
            </div>

            {/* Alert Console */}
            {chaosState !== 'none' && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 12,
                  padding: 8,
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 8,
                  textAlign: 'left',
                }}
              >
                <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 10, color: '#EF4444', fontFamily: 'monospace' }}>
                  {chaosState === 'db_crash' && 'CRITICAL: POSTGRES_DOWN — queue buffering at 3x speed.'}
                  {chaosState === 'split_brain' && 'CRITICAL: PARTITION — LB routing packets dropped.'}
                  {chaosState === 'latency_spike' && 'WARNING: API_TIMEOUT — packet transmission slowed.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: PLATFORM OFFERINGS GRID */}
      <section id="features" aria-labelledby="features-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '72px 24px', background: colors.sectionAlt }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 id="features-title" style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
              One Studio for the Whole System Design Loop
            </h2>
            <p style={{ fontSize: 16, color: colors.textDim, maxWidth: 660, margin: '0 auto' }}>
              Few Threads brings an AI co-pilot, a traffic simulator, a chaos lab and a full academy into one canvas — so you can go from idea to battle-tested architecture without switching tools.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {PLATFORM_OFFERINGS.map((offer) => {
              const Icon = offer.icon;
              return (
                <article key={offer.title} className="landing-card" style={{ borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color="#8B5CF6" />
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, background: offer.badge === 'AI' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${offer.badge === 'AI' ? 'rgba(124,58,237,0.35)' : colors.border}`, color: offer.badge === 'AI' ? '#6D28D9' : colors.textDim, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 600 }}>
                      {offer.badge === 'AI' && <Sparkles size={9} />}
                      {offer.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{offer.title}</h3>
                  <p style={{ fontSize: 13, color: colors.textDim, lineHeight: 1.5 }}>{offer.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" aria-labelledby="how-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#6D28D9', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
              How it works
            </span>
            <h2 id="how-title" style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 12 }}>
              From Prompt to Production-Ready Design in Three Threads
            </h2>
          </div>
          <ol className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, listStyle: 'none', padding: 0, margin: 0 }}>
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="landing-card" style={{ borderRadius: 14, padding: 24, position: 'relative' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 28, fontWeight: 600, background: 'linear-gradient(90deg, #7C3AED 0%, #0891B2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: colors.textDim, lineHeight: 1.6 }}>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 3: SYSTEM DESIGN (Background scale & round-robin animation) */}
      <section style={{ position: 'relative', borderTop: `1px solid ${colors.border}`, padding: '96px 24px', overflow: 'hidden' }}>
        {/* Scaling Animation Background */}
        <div style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', width: '45%', height: '80%', opacity: resolvedTheme === 'dark' ? 0.75 : 0.5, pointerEvents: 'none' }}>
          <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
            {/* Load balancer connections */}
            <path d="M 50,150 L 160,75" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M 50,150 L 160,150" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M 50,150 L 160,225" stroke="#9ca3af" strokeWidth="1.5" />

            {/* Load Balancer */}
            <circle cx="50" cy="150" r="24" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#06B6D4" strokeWidth="2" />
            <text x="50" y="153" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">LB</text>

            {/* Server Replicas */}
            {/* Node 1 */}
            <g transform="translate(160,75)">
              <circle r="22" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#10B981" strokeWidth="2" />
              <text y="3" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">Replica 1</text>
            </g>

            {/* Node 2 (Scales) */}
            {scaleReplicas >= 2 && (
              <g transform="translate(160,150)">
                <circle r="22" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#10B981" strokeWidth="2" />
                <text y="3" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">Replica 2</text>
                {scaleActive && scaleReplicas === 2 && (
                  <circle r="34" fill="none" stroke="#10B981" strokeWidth="1.5" style={{ animation: 'shieldWave 0.5s ease-out forwards' }} />
                )}
              </g>
            )}

            {/* Node 3 (Scales) */}
            {scaleReplicas >= 3 && (
              <g transform="translate(160,225)">
                <circle r="22" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#10B981" strokeWidth="2" />
                <text y="3" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">Replica 3</text>
                {scaleActive && scaleReplicas === 3 && (
                  <circle r="34" fill="none" stroke="#10B981" strokeWidth="1.5" style={{ animation: 'shieldWave 0.5s ease-out forwards' }} />
                )}
              </g>
            )}

            {/* Packet flows */}
            <circle r="3" fill="#06B6D4">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 50,150 L 160,75" />
            </circle>
            {scaleReplicas >= 2 && (
              <circle r="3" fill="#06B6D4">
                <animateMotion dur="2.4s" repeatCount="indefinite" path="M 50,150 L 160,150" />
              </circle>
            )}
            {scaleReplicas >= 3 && (
              <circle r="3" fill="#06B6D4">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M 50,150 L 160,225" />
              </circle>
            )}
          </svg>
        </div>

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div className="visual-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
            <div
              style={{
                padding: '32px',
                borderRadius: 16,
                background: colors.panelBg,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 8px 32px ${colors.shadow}`,
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#0E7490', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                Interactive Design Sandbox
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 14 }}>
                Scale Out and Watch Traffic Rebalance
              </h2>
              <p style={{ fontSize: 15, color: colors.textDim, lineHeight: 1.6, marginBottom: 20 }}>
                Add replicas to any service and watch the load balancer spread requests across them in real time. See exactly where horizontal scaling helps — and where the database becomes the next bottleneck.
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: colors.textMuted, fontFamily: 'monospace' }}>Current Scale Visualized:</span>
                <span style={{ fontSize: 12, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', color: '#10B981', padding: '3px 9px', borderRadius: 4, fontWeight: 700, fontFamily: 'monospace' }}>
                  {scaleReplicas} REPLICAS ACTIVE
                </span>
              </div>
            </div>
            {/* spacer for right SVG background in columns */}
            <div style={{ height: 280 }} className="interactive-flow-bg" />
          </div>
        </div>
      </section>

      {/* SECTION 4: CHAOS & CYBER ATTACKS (Background attack & shield block animation) */}
      <section style={{ position: 'relative', borderTop: `1px solid ${colors.border}`, padding: '96px 24px', background: colors.sectionAlt, overflow: 'hidden' }}>
        {/* Attack Animation Background */}
        <div style={{ position: 'absolute', left: '4%', top: '50%', transform: 'translateY(-50%)', width: '45%', height: '80%', opacity: resolvedTheme === 'dark' ? 0.75 : 0.5, pointerEvents: 'none' }}>
          <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
            {/* Connection lines */}
            <path d="M 50,150 L 180,150" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 180,150 L 310,150" stroke="#10B981" strokeWidth="1.5" />

            {/* Hacker Node */}
            <g transform="translate(50,150)">
              <circle r="22" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#EF4444" strokeWidth="2" />
              <text y="3" textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="bold">Attacker</text>
            </g>

            {/* Web Application Firewall (WAF) */}
            <g transform="translate(180,150)">
              <circle r="24" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#8B5CF6" strokeWidth="2.5" />
              <Shield size={13} color="#8B5CF6" style={{ transform: 'translate(-6.5px, -6.5px)' }} />
              {/* Collision shield wave */}
              <circle r="32" fill="none" stroke="#EF4444" strokeWidth="1.5" style={{ animation: 'shieldWave 2.8s linear infinite' }} />
            </g>

            {/* Target Server Node */}
            <g transform="translate(310,150)">
              <circle r="22" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#10B981" strokeWidth="2" />
              <text y="3" textAnchor="middle" fill={colors.text} fontSize="8" fontWeight="bold">API Pool</text>
            </g>

            {/* Malicious Attack Packets (Collision and dissolve) */}
            <circle r="4" fill="#EF4444">
              <animateMotion dur="2.8s" repeatCount="indefinite" path="M 50,150 L 180,150" />
            </circle>

            {/* Blocked and Rerouted traffic */}
            <circle r="3" fill="#10B981">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 180,150 L 310,150" />
            </circle>
          </svg>
        </div>

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div className="visual-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
            {/* spacer for left SVG background in columns */}
            <div style={{ height: 280 }} className="interactive-flow-bg" />
            
            <div
              style={{
                padding: '32px',
                borderRadius: 16,
                background: colors.panelBg,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 8px 32px ${colors.shadow}`,
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#B91C1C', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                Cyber Attack & Chaos Lab
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 14 }}>
                Pull a Thread: Inject Cascading Failures
              </h2>
              <p style={{ fontSize: 15, color: colors.textDim, lineHeight: 1.6, marginBottom: 20 }}>
                Crash a primary database, partition the network into a split brain, or spike latency at the gateway. Check that your WAF stops malicious traffic and watch p99 latency, error rates and queue depth respond across 30 chaos scenarios.
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: colors.textMuted, fontFamily: 'monospace' }}>Attacks Blocked on Sandbox:</span>
                <span style={{ fontSize: 12, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#EF4444', padding: '3px 9px', borderRadius: 4, fontWeight: 700, fontFamily: 'monospace' }}>
                  {attackBlockedCount} THREATS NEUTRALIZED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI CO-PILOT (Background prompt builder animation) */}
      <section style={{ position: 'relative', borderTop: `1px solid ${colors.border}`, padding: '96px 24px', overflow: 'hidden' }}>
        {/* AI Drawing Animation Background */}
        <div style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', width: '45%', height: '80%', opacity: resolvedTheme === 'dark' ? 0.75 : 0.5, pointerEvents: 'none' }}>
          <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
            {/* Grid overlay */}
            <defs>
              <pattern id="aiGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aiGrid)" />

            {/* Drawing steps */}
            {aiStep >= 1 && (
              <>
                {/* Node 1 */}
                <g transform="translate(80,150)">
                  <rect x="-24" y="-20" width="48" height="40" rx="6" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#8B5CF6" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">Nginx</text>
                </g>
                {/* Node 2 */}
                <g transform="translate(200,150)">
                  <rect x="-24" y="-20" width="48" height="40" rx="6" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#8B5CF6" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">Service</text>
                </g>
                {/* Node 3 */}
                <g transform="translate(320,150)">
                  <rect x="-24" y="-20" width="48" height="40" rx="6" fill={resolvedTheme === 'dark' ? '#0d0d12' : '#ffffff'} stroke="#8B5CF6" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fill={colors.text} fontSize="9" fontWeight="bold">Redis</text>
                </g>
              </>
            )}

            {aiStep >= 2 && (
              <>
                {/* Connection lines drawing */}
                <path d="M 128,150 L 176,150" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="50" strokeDashoffset="0">
                  <animate attributeName="stroke-dashoffset" from="50" to="0" dur="0.8s" fill="freeze" />
                </path>
                <path d="M 248,150 L 296,150" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="50" strokeDashoffset="0">
                  <animate attributeName="stroke-dashoffset" from="50" to="0" dur="0.8s" fill="freeze" />
                </path>
              </>
            )}
          </svg>
        </div>

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div className="visual-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
            <div
              style={{
                padding: '32px',
                borderRadius: 16,
                background: colors.panelBg,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 8px 32px ${colors.shadow}`,
                zIndex: 10,
              }}
            >
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#6D28D9', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                AI Architect Co-Pilot
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 14 }}>
                Generate Architectures from a Prompt
              </h2>
              <p style={{ fontSize: 15, color: colors.textDim, lineHeight: 1.6, marginBottom: 20 }}>
                Write your requirements in plain English and the AI co-pilot drafts the architecture for you — components, configuration and connections. Then ask it to review the design for single points of failure, bottlenecks and cost.
              </p>
              
              {/* Typing box visual */}
              <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>prompt:</span>
                <span style={{ fontSize: 12, color: colors.text, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {aiTypingText}
                  <span style={{ animation: 'cursorBlink 1s infinite', color: '#8B5CF6', fontWeight: 'bold' }}>|</span>
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 8 }}>
                {[
                  'Generate a starter architecture from requirements',
                  'Review designs for failure points, bottlenecks and cost',
                  'Explain what broke after a chaos experiment',
                  'Ask interview-style follow-up questions',
                ].map((line) => (
                  <li key={line} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: colors.textDim }}>
                    <CheckCircle2 size={14} color="#8B5CF6" style={{ flexShrink: 0 }} />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            {/* spacer for right SVG background in columns */}
            <div style={{ height: 280 }} className="interactive-flow-bg" />
          </div>
        </div>
      </section>

      {/* SECTION 6: DESIGN ACADEMY & INTERACTIVE QUIZ */}
      <section style={{ position: 'relative', borderTop: `1px solid ${colors.border}`, padding: '96px 24px', background: colors.sectionAlt, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div className="visual-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            {/* Mini Interactive Quiz Left */}
            <div className="landing-card" style={{ borderRadius: 16, padding: '24px 28px', background: colors.panelBg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Award size={18} color="#10B981" />
                <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#10B981', fontWeight: 700 }}>
                  ACADEMY CHALLENGE
                </span>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
                In a network partition, what does a CP (Consistent / Partition tolerant) database do?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => handleAnswerSubmit('a')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    border: selectedAnswer === 'a' ? '1px solid #EF4444' : `1px solid ${colors.border}`,
                    background: selectedAnswer === 'a' ? 'rgba(239,68,68,0.08)' : colors.bg,
                    color: colors.text,
                    transition: 'all 0.15s',
                  }}
                >
                  a) Sacrifices consistency to remain fully available to accept writes.
                </button>
                <button
                  onClick={() => handleAnswerSubmit('b')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    border: selectedAnswer === 'b' ? '1px solid #10B981' : `1px solid ${colors.border}`,
                    background: selectedAnswer === 'b' ? 'rgba(16,185,129,0.08)' : colors.bg,
                    color: colors.text,
                    transition: 'all 0.15s',
                  }}
                >
                  b) Refuses writes to guarantee consistency across all surviving nodes.
                </button>
              </div>

              {quizSuccess !== null && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: quizSuccess ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: quizSuccess ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                    fontSize: 12,
                    color: quizSuccess ? '#10B981' : '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {quizSuccess ? '✅ Correct! A CP database rejects updates on isolated nodes to protect data correctness.' : '❌ Incorrect. Re-read lesson 4.2: CAP theorem trade-offs.'}
                </div>
              )}
            </div>

            {/* Design Academy Copy Right */}
            <div style={{ zIndex: 10 }}>
              <span style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#047857', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                Design Academy
              </span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10, marginBottom: 14 }}>
                Learn Distributed Systems by Building Them
              </h2>
              <p style={{ fontSize: 15, color: colors.textDim, lineHeight: 1.6, marginBottom: 20 }}>
                Seven tracks — System Design Fundamentals, Backend Engineering, Distributed Systems, Cloud Architecture, Security Engineering, DevOps & SRE, and Interview Preparation. Each lesson links theory to a design you can run, with 245 quizzes and badges along the way.
              </p>
              <button
                className="btn-theme-outline"
                onClick={() => navigate('/learn')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 40,
                  padding: '0 18px',
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Browse Academy Tracks
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section id="who-its-for" aria-labelledby="audience-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 id="audience-title" style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Built for Anyone Who Designs Systems
            </h2>
            <p style={{ fontSize: 16, color: colors.textDim, maxWidth: 620, margin: '0 auto' }}>
              Whether you are preparing for a system design interview or defending an architecture proposal, Few Threads meets you where you are.
            </p>
          </div>
          <div className="audience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {AUDIENCES.map((aud) => {
              const Icon = aud.icon;
              return (
                <article key={aud.title} className="landing-card" style={{ borderRadius: 12, padding: 20 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={17} color="#06B6D4" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{aud.title}</h3>
                  <p style={{ fontSize: 13, color: colors.textDim, lineHeight: 1.55 }}>{aud.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: DETAILED ROADMAP (Features Offerings) */}
      <section id="roadmap" aria-labelledby="roadmap-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '80px 24px 100px', background: colors.sectionAlt }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 id="roadmap-title" style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginBottom: 12 }}>
              What Is Live and What Is Next
            </h2>
            <p style={{ fontSize: 16, color: colors.textDim, maxWidth: 620, margin: '0 auto' }}>
              Few Threads ships fast. Here is what you can use today and the threads we are weaving next.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="roadmap-grid">
            {FEATURE_ROADMAP.map((item) => {
              const isCompleted = item.status === 'available';
              const isCurrent = item.status === 'in production';
              return (
                <div
                  key={item.id}
                  className="roadmap-card"
                  style={{
                    border: `1px solid ${isCurrent ? '#7C3AED' : colors.border}`,
                    background: isCurrent ? 'rgba(124,58,237,0.03)' : colors.cardBg,
                    borderRadius: 12,
                    padding: 20,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 9, background: isCompleted ? 'rgba(16,185,129,0.1)' : isCurrent ? 'rgba(124,58,237,0.1)' : 'rgba(0,0,0,0.03)', color: isCompleted ? '#10B981' : isCurrent ? '#8B5CF6' : colors.textMuted, padding: '2px 7px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
                    {item.title}
                    {isCompleted && <CheckCircle2 size={14} color="#10B981" style={{ marginLeft: 6, display: 'inline', verticalAlign: 'middle' }} />}
                  </h3>
                  <p style={{ fontSize: 12.5, color: colors.textDim, lineHeight: 1.5 }}>{item.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 820, width: '100%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: '#6D28D9', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
              <MessageSquareText size={13} /> FAQ
            </span>
            <h2 id="faq-title" style={{ fontSize: 32, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginTop: 10 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {FAQS.map((item, i) => (
              <details key={item.q} className="faq-item landing-card" open={i === 0} style={{ borderRadius: 12, padding: '16px 20px' }}>
                <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, cursor: 'pointer', listStyle: 'none' }}>
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: colors.text, margin: 0 }}>{item.q}</h3>
                  <ChevronDown size={16} className="faq-chevron" color={colors.textDim} style={{ flexShrink: 0 }} />
                </summary>
                <p style={{ fontSize: 14, color: colors.textDim, lineHeight: 1.65, marginTop: 10 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section aria-labelledby="cta-title" style={{ borderTop: `1px solid ${colors.border}`, padding: '80px 24px', background: colors.sectionAlt }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <h2 id="cta-title" style={{ fontSize: 36, fontWeight: 800, color: colors.text, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Start with a few threads.
            <span style={{ display: 'block', background: 'linear-gradient(90deg, #7C3AED 0%, #0891B2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              End with a system that holds.
            </span>
          </h2>
          <p style={{ fontSize: 16, color: colors.textDim, marginBottom: 28 }}>
            Open the canvas in one click — no credit card, no install, no cloud account.
          </p>
          <div className="welcome-actions" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-theme"
              onClick={handleGuestSession}
              disabled={isRegisteringGuest}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 28px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, cursor: isRegisteringGuest ? 'not-allowed' : 'pointer' }}
            >
              {isRegisteringGuest ? 'Starting Guest Session…' : 'Try as Guest'}
              <ArrowRight size={16} />
            </button>
            <a
              href="/register"
              className="btn-theme-outline"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              style={{ display: 'inline-flex', alignItems: 'center', height: 46, padding: '0 24px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
            >
              Create Free Account
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '48px 24px 28px',
          fontSize: 13,
          color: colors.textMuted,
        }}
      >
        <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <img src="/favicon.svg" alt="" width={26} height={26} />
              <span style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>Few Threads</span>
            </div>
            <p style={{ maxWidth: 360, lineHeight: 1.6, color: colors.textDim }}>
              The AI system design studio. Design architectures, simulate failures and learn distributed systems — one thread at a time.
            </p>
          </div>
          <nav aria-label="Product">
            <h3 style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.text, marginBottom: 12 }}>Product</h3>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <nav aria-label="Get started">
            <h3 style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.text, marginBottom: 12 }}>Get started</h3>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              <li><a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create account</a></li>
              <li><a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log in</a></li>
              <li><a href="/learn" onClick={(e) => { e.preventDefault(); navigate('/learn'); }}>Academy</a></li>
              <li><a href="/interview" onClick={(e) => { e.preventDefault(); navigate('/interview'); }}>Interview mode</a></li>
            </ul>
          </nav>
        </div>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
          <span>&copy; 2026 Few Threads. All rights reserved.</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Every great system starts with a few threads.</span>
        </div>
      </footer>
    </main>
  );
}

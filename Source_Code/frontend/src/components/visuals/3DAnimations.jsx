import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Floating Dashboard 3D Animation
 * Displays a dashboard preview with subtle 3D tilt and parallax
 */
export function FloatingDashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -12, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      className="floating-dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="floating-dashboard"
        variants={floatingVariants}
        animate="animate"
        style={{
          rotateX: (mousePosition.y - window.innerHeight / 2) * 0.01,
          rotateY: (mousePosition.x - window.innerWidth / 2) * 0.01,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Dashboard Mock UI */}
        <div className="dashboard-preview">
          <div className="dashboard-header">
            <div className="dashboard-dot"></div>
            <div className="dashboard-dot"></div>
            <div className="dashboard-dot"></div>
          </div>
          <div className="dashboard-content">
            <div className="stat-block"></div>
            <div className="stat-block"></div>
            <div className="stat-block"></div>
            <div className="chart-block"></div>
            <div className="chart-line"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Task Flow Animation
 * Shows a subtle pipeline animation of tasks flowing
 */
export function TaskFlowAnimation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="task-flow-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {[1, 2, 3, 4].map((step) => (
        <motion.div key={step} className="task-flow-step" variants={itemVariants}>
          <motion.div
            className="flow-circle"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: step * 0.3, repeat: Infinity }}
          >
            {step}
          </motion.div>
          {step < 4 && <div className="flow-line"></div>}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Neural Network/AI Element
 * Subtle glowing orb with particle-like connections
 */
export function AIElement() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
  };

  const orbVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(31, 122, 79, 0.4)',
        '0 0 40px rgba(31, 122, 79, 0.6)',
        '0 0 20px rgba(31, 122, 79, 0.4)'
      ],
      transition: { duration: 3, repeat: Infinity }
    }
  };

  return (
    <motion.div
      className="ai-element-container"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div
        className="ai-orb"
        variants={orbVariants}
        animate="animate"
      >
        <div className="orb-inner"></div>
        <div className="orb-glow"></div>
      </motion.div>
      <div className="ai-particles">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              x: Math.cos((i / 6) * Math.PI * 2) * 60,
              y: Math.sin((i / 6) * Math.PI * 2) * 60,
            }}
            transition={{
              duration: 4,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Smart Calendar Animation
 * Shows blocks arranging themselves with stagger effect
 */
export function SmartCalendarAnimation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.05 }
    }
  };

  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const blocks = [
    { size: 'sm', color: 'blue' },
    { size: 'sm', color: 'cyan' },
    { size: 'md', color: 'teal' },
    { size: 'sm', color: 'blue' },
    { size: 'lg', color: 'violet' },
    { size: 'sm', color: 'cyan' },
    { size: 'md', color: 'teal' },
    { size: 'sm', color: 'blue' }
  ];

  return (
    <motion.div
      className="calendar-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          className={`calendar-block block-${block.size} block-${block.color}`}
          variants={blockVariants}
        />
      ))}
    </motion.div>
  );
}

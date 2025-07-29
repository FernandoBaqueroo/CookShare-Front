import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const AnimatedContent = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
  useScrollTrigger = false, // Nueva prop para controlar si usar ScrollTrigger
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;

    // Configuración inicial
    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    });

    if (useScrollTrigger) {
      // Usar ScrollTrigger solo cuando se especifique
      const { ScrollTrigger } = require("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      
      const startPct = (1 - threshold) * 100;

      gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          toggleActions: "play none none none",
          once: true,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.killTweensOf(el);
      };
    } else {
      // Animación simple sin ScrollTrigger
      gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete,
      });

      return () => {
        gsap.killTweensOf(el);
      };
    }
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
    useScrollTrigger,
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent; 
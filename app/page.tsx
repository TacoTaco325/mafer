"use client";

import { motion, PanInfo, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import {
  Heart, ChevronDown, CalendarHeart, Stars, Gift, Music, Play,
  MapPin, Film, Coffee, MessageCircleHeart, MailOpen, Mail,
  Bus, CheckCircle, XCircle
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react";

// Types
type Ripple = {
  id: number;
  x: number;
  y: number;
};

// 1. TiltCard Component (Magnetic effect)
const TiltCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function MaferBirthdayPage() {
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Ripple state
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const closingSectionRef = useRef<HTMLElement>(null);
  const isClosingInView = useInView(closingSectionRef, { once: true, amount: 0.5 });

  // Parallax scroll setup — tracks the snap container, not window
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Floating background elements generated once
  const [floatingElements, setFloatingElements] = useState<any[]>([]);

  // Initialize client-side logic
  useEffect(() => {
    setIsMounted(true);

    // Responsive particles check
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 10 : 20;

    // Generate deterministic floating elements on client
    const elements = [...Array(particleCount)].map((_, i) => ({
      id: i,
      type: i % 5 === 0 ? 'bus' : 'heart',
      top: Math.random() * 100,
      left: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.4,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 3
    }));
    setFloatingElements(elements);

    // Audio setup con optimización
    audioRef.current = new Audio('/song.mp3');
    audioRef.current.loop = true; // Bucle infinito
    audioRef.current.preload = "auto"; // Pre-carga de los 3MB

    // Global Click Handler for Ripples
    const handleGlobalClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      // Remove ripple after 1 second
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener("click", handleGlobalClick);

    // Limpieza de memoria (Clean-up)
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.removeAttribute("src"); // Forzar limpieza en algunos navegadores
        audioRef.current.load(); // Libera la memoria consumida por el archivo
      }
    };
  }, []);

  // Trigger confetti when closing section is in view
  useEffect(() => {
    if (isClosingInView && isMounted) {
      triggerConfetti();
    }
  }, [isClosingInView, isMounted]);

  const loveReasons = useMemo(() => [
    "Tu sonrisa ilumina incluso mis días más oscuros.",
    "La forma en que te emocionas por las pequeñas cosas.",
    "Tu inteligencia y cómo siempre me enseñas algo nuevo.",
    "El calor de tu cariño que me hacen sentir en casa.",
    "Tu sentido del humor y cómo siempre me haces reír a carcajadas.",
    "Lo mucho que te apasiona lo que amas.",
    "Esos ojitos hermosos.",
    "Tu amabilidad con todas las personas a tu alrededor.",
    "La paz que siento cuando hablo con vos.",
    "Tus hermosos labios.",
    "La forma en que me apoyas a pesar de la distancia.",
    "Tu fuerza y resiliencia para enfrentar la vida.",
    "Tu carita tan linda",
    "Tu voz, que es mi sonido favorito en el mundo.",
    "Tus locuras que hacen mi vida más divertida.",
    "El equipo increíble que formamos juntos.",
    "Que simplemente, eres vos, mi bebita hermosa."
  ], []);

  const timelineEvents = useMemo(() => [
    {
      id: "first-day",
      title: "El primer mensaje",
      description: "Ese momento en el que comenzamos a hablar y supe que algo especial estaba por comenzar.",
      icon: <Stars className="text-rose-500 w-6 h-6" />
    },
    {
      id: "first-call",
      title: "La primera llamada",
      description: "Los nervios, las risas, las horas que pasaron como minutos. Conocerte ah sido un regalo.",
      icon: <MessageCircleHeart className="text-rose-500 w-6 h-6" />
    },
    {
      id: "first-ily",
      title: "El primer 'Te amo'",
      description: "Un momento mágico donde las palabras se quedaron cortas para expresar todo lo que mi corazón ya sentía.",
      icon: <Gift className="text-rose-500 w-6 h-6" />
    },
    {
      id: "today",
      title: "Hoy, celebrándote",
      description: "Tus 17 años. Viéndote crecer, brillar y siendo el hombre más afortunado por acompañarte.",
      icon: <CalendarHeart className="text-rose-500 w-6 h-6" />
    }
  ], []);

  const bucketListItems = useMemo(() => [
    {
      id: 1,
      title: "Nuestro primer abrazo y beso",
      description: "Ese momento en el que por fin podre rodearte con mis brazos, besarte y no soltarte.",
      icon: <Heart className="w-8 h-8 text-rose-400" />
    },
    {
      id: 2,
      title: "Cita de películas",
      description: "Ver nuestras películas favoritas acurrucados hasta quedarnos dormidos (me banco una de terror por vos).",
      icon: <Film className="w-8 h-8 text-rose-400" />
    },
    {
      id: 3,
      title: "Nuestra primera cita",
      description: "Caminar de la mano, tomar algo y simplemente existir juntos en el mismo lugar.",
      icon: <Coffee className="w-8 h-8 text-rose-400" />
    },
    {
      id: 4,
      title: "Charlas infinitas",
      description: "Poder vernos a los ojos sin una pantalla de por medio mientras hablamos de todo y no quiero que termine nunca.",
      icon: <MessageCircleHeart className="w-8 h-8 text-rose-400" />
    },
  ], []);

  const quizQuestions = useMemo(() => [
    {
      id: 1,
      question: "¿Quién es más probable que se quede dormido a la mitad de una película?",
      options: ["Yo", "Vos", "Los dos al mismo tiempo"],
      correctAnswer: "Vos",
      feedback: "¡Obvio! A los 15 minutos ya estás roncando (pero te ves hermosa dormida)."
    },
    {
      id: 2,
      question: "¿Qué es lo que más me gusta de vos?",
      options: ["Tu sentido del humor", "Tu sonrisa", "Tus ojitos hermosos", "Todas las anteriores (y más)"],
      correctAnswer: "Todas las anteriores (y más)",
      feedback: "¡Trampa! Era demasiado fácil. Me encantas completita, de pies a cabeza."
    },
    {
      id: 3,
      question: "¿Cuál es mi plan favorito para el futuro?",
      options: ["Ser millonarios", "Por fin poder abrazarte", "Comer pizza toda la vida"],
      correctAnswer: "Por fin poder abrazarte",
      feedback: "Exacto. No hay nada en este mundo que quiera más que ese momento en que te tenga frente a mí."
    }
  ], []);

  const hiddenLetterContent = "Mi nena hermosa,\n\nCuento los días para por fin acortar todos esos kilómetros que hoy nos separan. Aunque la distancia física sea grande, mi corazón ya vive con vos. Cada llamada, cada mensaje y cada ataque de risa juntos me confirman que vales toda la espera del mundo.\n\nEl día que te vea en persona y te pueda dar ese primer abrazo, sabré que llegué a mi hogar verdadero.\n\nTe quiero infinito.";
  const letterWords = useMemo(() => hiddenLetterContent.split(/(\s+)/), [hiddenLetterContent]);

  const handleNextReason = useCallback(() => {
    setActiveReasonIndex((prev) => (prev + 1) % loveReasons.length);
  }, [loveReasons.length]);

  const handlePrevReason = useCallback(() => {
    setActiveReasonIndex((prev) => (prev - 1 + loveReasons.length) % loveReasons.length);
  }, [loveReasons.length]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrevReason();
    } else if (info.offset.x < -swipeThreshold) {
      handleNextReason();
    }
  }, [handlePrevReason, handleNextReason]);

  const toggleAudio = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Manejo seguro del play() que devuelve una promesa en HTML5
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn("Audio playback issue: El usuario debe interactuar con la página primero.", error);
      setIsPlaying(false); // Forzar el estado a falso si la promesa falla
    }
  }, [isPlaying]);

  const handleEnvelopeClick = useCallback(() => {
    setIsLetterOpen(true);
  }, []);

  const handleQuizAnswer = useCallback((option: string) => {
    setSelectedAnswer(option);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const triggerConfetti = useCallback(async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      const duration = 4 * 1000;
      const end = Date.now() + duration;
      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fff1f2', '#fecdd3'];

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: colors
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (error) {
      console.warn("Could not load confetti", error);
    }
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory bg-rose-50/50 font-sans text-stone-800 selection:bg-rose-200"
    >

      {/* Touch Ripple Effect Manager */}
      {isMounted && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ opacity: 0.8, scale: 0, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute flex items-center justify-center"
                style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }}
              >
                <div className="absolute inset-0 bg-rose-400 rounded-full blur-[10px] opacity-40"></div>
                <Heart className="w-6 h-6 text-rose-500 fill-rose-400 relative z-10" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Audio Player */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100 text-rose-500 hover:scale-110 hover:bg-rose-50 transition-all duration-300 flex items-center justify-center overflow-hidden"
        style={{ width: "56px", height: "56px" }}
        aria-label="Toggle music"
      >
        {isPlaying ? (
          <div className="flex items-end justify-center gap-1 w-6 h-6">
            <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }} className="w-1.5 bg-rose-500 rounded-full" />
            <motion.div animate={{ height: ["8px", "20px", "8px"] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }} className="w-1.5 bg-rose-500 rounded-full" />
            <motion.div animate={{ height: ["6px", "14px", "6px"] }} transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut", delay: 0.2 }} className="w-1.5 bg-rose-500 rounded-full" />
          </div>
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </button>

      {/* Hero Section */}
      <section className="relative h-screen snap-start flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-rose-50 to-white">
        {/* Animated Background Elements */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingElements.map((el) => (
              <motion.div
                key={el.id}
                className="absolute text-rose-300/40"
                initial={{
                  top: `${el.top}%`,
                  left: `${el.left}%`,
                  scale: el.scale,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: el.type === 'bus' ? [0, 30, 0] : 0,
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: el.delay
                }}
              >
                {el.type === 'bus' ? (
                  <Bus fill="currentColor" size={24} className="opacity-60" />
                ) : (
                  <Heart fill="currentColor" size={24} />
                )}
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="z-10 text-center flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex justify-center mb-6 relative"
          >
            <div className="absolute inset-0 bg-rose-400 blur-[30px] rounded-full opacity-30"></div>
            <Heart className="w-20 h-20 text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)] relative z-10" fill="#f43f5e" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-rose-950 mb-4 drop-shadow-sm"
          >
            ¡Feliz Cumpleaños <br className="md:hidden" />
            <span className="text-rose-500 italic">número 17</span>,<br />
            mi nena hermosa!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-stone-600 mt-4 max-w-2xl mx-auto font-light"
          >
            Para la niña que se robó mi corazón...
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center cursor-pointer group z-20"
          onClick={() => scrollContainerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm uppercase tracking-widest text-stone-500 mb-2 group-hover:text-rose-500 transition-colors font-medium">
            Desliza para ver tu sorpresa
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="text-rose-400 group-hover:text-rose-600 transition-colors" size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Main Message */}
      <section className="h-screen snap-start overflow-y-auto flex items-center py-24 px-6 md:px-12 bg-white relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-rose-900 mb-8">Mi amorsito Mafer,</h2>
            <div className="space-y-6 text-lg md:text-xl text-stone-600 leading-relaxed font-light">
              <p>
                Hoy que cumplís 17 añitos, no solo quiero celebrar el día en que llegaste al mundo, sino también celebrar <span className="font-medium text-rose-600">nosotros</span>.
              </p>
              <p>
                Este pequeño rincón digital es un tributo a todo lo que me haces sentir. Cada día a tu lado es un regalo, y quería hacer algo especial para que nunca olvides lo importante que sos para mí y lo mucho que te amo.
              </p>
              <p>
                Sos mi persona favorita, mi refugio y el motivo de mis sonrisas tontas frente al celular.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Distance Map (El Viaje en Colectivo) */}
      <section className="h-screen snap-start overflow-y-auto flex items-center py-24 px-6 md:px-12 bg-rose-50/80">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-rose-950 mb-6">El Viaje Hacia Vos</h2>
            <p className="text-stone-600 mb-16 text-lg max-w-2xl mx-auto font-medium italic">
              "Preparando la espalda para las horas de viaje en colectivo con tal de ir a verte."
            </p>
          </motion.div>

          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto py-10 px-4 md:px-0">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring" }}
              className="flex flex-col items-center z-10 bg-white p-3 rounded-2xl shadow-lg border border-rose-100"
            >
              <MapPin className="text-rose-500 w-10 h-10 mb-2 drop-shadow-md" />
              <span className="text-stone-600 font-bold text-sm uppercase tracking-wider">Yo</span>
            </motion.div>

            <div className="flex-1 px-4 relative flex items-center justify-center">
              {/* Solid horizontal line */}
              <div className="w-full border-t-[4px] border-dashed border-rose-300 absolute"></div>

              {/* Animated Bus moving strictly horizontally */}
              <motion.div
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                  times: [0, 0.1, 0.9, 1]
                }}
                className="absolute text-rose-500 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <Bus className="w-12 h-12 text-rose-600 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" fill="#fecdd3" strokeWidth={1.5} />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-rose-400 rounded-full blur-[20px] -z-10"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.2 }}
              className="flex flex-col items-center z-10 bg-white p-3 rounded-2xl shadow-lg border border-rose-100"
            >
              <Heart className="text-rose-500 w-10 h-10 mb-2 drop-shadow-md animate-pulse" fill="#f43f5e" />
              <span className="text-stone-600 font-bold text-sm uppercase tracking-wider">Vos</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Our Story (Timeline) */}
      <section className="h-screen snap-start overflow-y-auto py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center text-rose-950 mb-16"
          >
            Nuestra Historia
          </motion.h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-rose-200 before:to-transparent">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-rose-100 text-slate-500 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {event.icon}
                </div>

                <TiltCard className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-rose-50">
                    <h3 className="font-bold text-xl text-rose-800 mb-2">{event.title}</h3>
                    <p className="text-stone-600 font-light leading-relaxed">{event.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Mini-Quiz Section */}
      <section className="h-screen snap-start overflow-y-auto flex items-center py-24 px-6 md:px-12 bg-rose-100/30 relative border-y border-rose-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-rose-950 mb-4">El Examen Sorpresa</h2>
            <p className="text-rose-600 font-medium">(Vale el 100% de la calificación de novios)</p>
          </motion.div>

          <TiltCard>
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl border border-white/60 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {currentQuestionIndex < quizQuestions.length ? (
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <h3 className="text-2xl font-bold text-stone-800 mb-8 text-center leading-snug">
                      {quizQuestions[currentQuestionIndex].question}
                    </h3>

                    <div className="space-y-4">
                      {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;

                        let btnClass = "w-full p-4 rounded-xl text-left font-medium transition-all duration-300 border-2 ";
                        if (!selectedAnswer) {
                          btnClass += "bg-white border-stone-200 hover:border-rose-300 hover:shadow-md text-stone-700";
                        } else if (isSelected && isCorrect) {
                          btnClass += "bg-green-50 border-green-400 text-green-800 shadow-[0_0_15px_rgba(74,222,128,0.3)]";
                        } else if (isSelected && !isCorrect) {
                          btnClass += "bg-rose-50 border-rose-400 text-rose-800";
                        } else if (!isSelected && isCorrect) {
                          btnClass += "bg-green-50 border-green-400 text-green-800 opacity-80";
                        } else {
                          btnClass += "bg-stone-50 border-stone-200 text-stone-400 opacity-50";
                        }

                        return (
                          <button
                            key={idx}
                            disabled={selectedAnswer !== null}
                            onClick={() => handleQuizAnswer(option)}
                            className={btnClass}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {selectedAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                              {selectedAnswer === option && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {selectedAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 text-center"
                        >
                          <p className="text-lg font-medium text-rose-600 mb-6 italic">
                            {quizQuestions[currentQuestionIndex].feedback}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNextQuestion}
                            className="px-8 py-3 bg-stone-800 text-white font-bold rounded-full hover:bg-stone-900 transition-colors shadow-lg"
                          >
                            Siguiente →
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex justify-center mb-6"
                    >
                      <Stars className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" fill="currentColor" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-rose-900 mb-4">¡Examen Aprobado con 100!</h3>
                    <p className="text-xl text-stone-600 font-light">
                      Como recompensa, te has ganado mi corazón (aunque ese ya lo tenías desde el primer día).
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 6. Bucket List (Glassmorphism) */}
      <section className="h-screen snap-start overflow-y-auto py-24 px-6 md:px-12 bg-stone-50 relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fda4af 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-rose-950 mb-4">Nuestra Lista</h2>
            <p className="text-stone-500 text-lg">Los planes que me mantienen soñando todos los días...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 perspective-1000">
            {bucketListItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard className="h-full">
                  <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-md hover:shadow-xl hover:bg-white/80 flex items-start gap-6 group cursor-default transition-all duration-300 h-full">
                    <div className="p-4 bg-white/80 shadow-sm rounded-2xl group-hover:bg-rose-50 transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-rose-900 mb-3 group-hover:text-rose-600 transition-colors">{item.title}</h3>
                      <p className="text-stone-600 leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 17 Reasons (Interactive Carousel with Glow & Blur) */}
      <section className="h-screen snap-start overflow-y-auto flex items-center py-24 px-6 md:px-12 bg-white relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-rose-950 mb-4">
              17 razones por las que me encantas
            </h2>
            <p className="text-stone-500 mb-12">Y mil más que me guardo en el corazón... <br className="md:hidden" /> (Desliza)</p>
          </motion.div>

          <div className="relative h-72 md:h-80 w-full max-w-xl mx-auto perspective-1000">
            {loveReasons.map((reason, index) => {
              const isActive = index === activeReasonIndex;
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.8,
                    rotateY: isActive ? 0 : 15,
                    zIndex: isActive ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none"
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 flex items-center justify-center p-8 md:p-12 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_0_40px_rgba(244,63,94,0.2)] cursor-grab active:cursor-grabbing"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-rose-200 font-serif text-8xl opacity-40 absolute -top-4 left-4">"</span>
                    <p className="text-2xl md:text-3xl font-medium text-stone-700 italic z-10 relative mt-4 select-none drop-shadow-sm">
                      {reason}
                    </p>
                    <span className="absolute bottom-6 right-8 text-rose-500 font-bold text-xl select-none bg-rose-50/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
                      #{index + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              onClick={handlePrevReason}
              className="p-4 rounded-full bg-white shadow-md border border-rose-50 text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all active:scale-95"
              aria-label="Razón anterior"
            >
              ←
            </button>
            <div className="text-sm font-bold text-rose-400 tracking-[0.2em] bg-rose-50 px-6 py-2 rounded-full">
              {activeReasonIndex + 1} DE 17
            </div>
            <button
              onClick={handleNextReason}
              className="p-4 rounded-full bg-white shadow-md border border-rose-50 text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all active:scale-95"
              aria-label="Siguiente razón"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* 8. Hidden Letter Section */}
      <section className="h-screen snap-start overflow-y-auto flex items-center py-24 px-6 md:px-12 bg-rose-50/50 border-t border-rose-100">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center min-h-[400px] justify-center">
          <AnimatePresence mode="wait">
            {!isLetterOpen ? (
              <motion.div
                key="envelope"
                exit={{ scale: 0, opacity: 0, rotate: 10, y: -50 }}
                transition={{ duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
                onClick={handleEnvelopeClick}
                className="cursor-pointer flex flex-col items-center group relative"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                  >
                    <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <defs>
                        <clipPath id="envelope-clip">
                          <rect width="240" height="160" rx="16" />
                        </clipPath>
                      </defs>
                      <g clipPath="url(#envelope-clip)">
                        {/* Base Background */}
                        <rect width="240" height="160" fill="#fda4af" />
                        {/* Left Flap */}
                        <path d="M0 0 L130 80 L0 160 Z" fill="#fecdd3" />
                        {/* Right Flap */}
                        <path d="M240 0 L110 80 L240 160 Z" fill="#fecdd3" />
                        {/* Bottom Flap */}
                        <path d="M0 160 L120 70 L240 160 Z" fill="#ffe4e6" />
                        {/* Top Flap */}
                        <path d="M0 0 L120 95 L240 0 Z" fill="#fb7185" />
                      </g>
                      {/* Wax Seal */}
                      <circle cx="120" cy="95" r="20" fill="#e11d48" className="drop-shadow-md" />
                      <path
                        d="M120 102L112.5 94.5C110 92 110 88 112.5 85.5C115 83 119 83 120 86C121 83 125 83 127.5 85.5C130 88 130 92 127.5 94.5L120 102Z"
                        fill="#fff1f2"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 -right-4 bg-rose-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg z-10"
                  >
                    ¡Ábrime!
                  </motion.div>
                </div>
                <p className="mt-8 text-stone-500 font-medium tracking-wide uppercase text-sm">Tengo un mensaje para vos...</p>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-2xl p-8 md:p-14 rounded-3xl shadow-[0_20px_60px_-15px_rgba(244,63,94,0.3)] border border-white text-left w-full relative overflow-hidden"
              >
                <MailOpen className="absolute -top-10 -right-10 w-48 h-48 text-rose-100 opacity-40 rotate-12" />
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="text-lg md:text-2xl text-stone-700 leading-relaxed font-serif whitespace-pre-wrap relative z-10"
                >
                  {letterWords.map((word, i) => {
                    if (word.includes("\n")) {
                      return (
                        <span key={i}>
                          {word.split('\n').map((part, index, array) => (
                            <span key={index}>
                              <motion.span variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                {part}
                              </motion.span>
                              {index < array.length - 1 && <br />}
                            </span>
                          ))}
                        </span>
                      );
                    }
                    return (
                      <motion.span
                        key={i}
                        variants={{
                          hidden: { opacity: 0, filter: "blur(8px)", y: 10 },
                          visible: { opacity: 1, filter: "blur(0px)", y: 0 },
                        }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 9. Closing & Promise (Triggers Confetti automatically) */}
      <section ref={closingSectionRef} className="h-screen snap-start overflow-y-auto flex items-center py-32 px-6 bg-gradient-to-b from-rose-100/50 to-rose-200/80 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-14 rounded-3xl shadow-2xl border border-white/60"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-16 h-16 text-rose-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" fill="#f43f5e" />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-serif text-rose-950 mb-6">
              Por este y mil cumpleaños más...
            </h2>
            <p className="text-lg md:text-xl text-stone-700 mb-8 leading-relaxed font-light">
              Prometo seguir cuidándote, sacándote sonrisas y estando para vos en cada momento pase lo que pase. Espero que este día sea tan increíble, hermoso y especial como vos.
            </p>
            <p className="text-2xl font-bold text-rose-600 uppercase tracking-widest mb-12">
              Te amo, Mafer.
            </p>
            <div className="pt-6 border-t border-rose-100/60 max-w-sm mx-auto">
              <p className="text-sm md:text-base text-stone-500 italic font-light">
                <span className="font-medium text-rose-400 mr-1">P.D.</span>
                Espero que te haya gustado este pequeño detalle, Maria Fernanda de las Casas.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

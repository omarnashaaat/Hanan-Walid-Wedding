import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Volume2, VolumeX } from 'lucide-react';

// --- Components ---

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 w-16 h-16 md:w-24 md:h-24 rounded-xl flex items-center justify-center shadow-2xl">
        <span className="text-2xl md:text-4xl font-bold text-white font-serif drop-shadow-md">{value}</span>
      </div>
      <span className="mt-2 text-sm md:text-base text-white font-medium drop-shadow-md">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center flex-wrap mt-12 dir-rtl">
      <TimeBox value={timeLeft.seconds} label="ثانية" />
      <TimeBox value={timeLeft.minutes} label="دقيقة" />
      <TimeBox value={timeLeft.hours} label="ساعة" />
      <TimeBox value={timeLeft.days} label="يوم" />
    </div>
  );
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: "110vh", 
            x: Math.random() * 100 + "vw", 
            opacity: 0,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute text-rose-300/60"
        >
          <Heart fill="currentColor" size={20 + Math.random() * 40} />
        </motion.div>
      ))}
    </div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // A sweet, simple romantic instrumental
  const audioUrl = "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc98b1e069.mp3?filename=piano-moment-11176.mp3"; 
  
  useEffect(() => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) audio.play().catch(e => console.log("Autoplay blocked", e));
      else audio.pause();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio id="bg-music" loop src={audioUrl} />
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full shadow-xl border border-white/30 transition-all transform hover:scale-110"
      >
        {isPlaying ? <Volume2 /> : <VolumeX />}
      </button>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const weddingDate = new Date('2026-04-11T18:00:00');

  return (
    <div className="min-h-screen relative bg-black overflow-hidden font-sans">
      <FloatingHearts />
      <MusicPlayer />

      {/* Main Hero Section - Formal Photo */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Hanan & Walid Formal" 
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-2xl md:text-3xl text-gold-100 mb-6 font-light tracking-wide">أهلاً بيكم في فرح أجمل عروسين</h2>
            
            <h1 className="text-7xl md:text-9xl font-script text-white mb-4 drop-shadow-2xl">
              <span className="block md:inline">حنان</span>
              <span className="text-gold-400 mx-4 text-5xl md:text-7xl">&</span>
              <span className="block md:inline">وليد</span>
            </h1>
            
            <div className="w-32 h-1 bg-gold-400 mx-auto my-8 rounded-full shadow-lg" />
            
            <p className="text-xl md:text-2xl text-white/90 font-serif mb-12">
              نحتفل ببداية رحلتنا معاً
              <br />
              <span className="text-gold-200 mt-2 block">11 . 04 . 2026</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Countdown targetDate={weddingDate} />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">صورة كمان</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second Section - Casual Photo */}
      <div className="relative min-h-screen w-full flex items-center justify-center bg-rose-50 py-20 px-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 text-center md:text-right"
          >
            <h2 className="text-5xl md:text-6xl font-script text-gold-600 mb-6">قصة حبنا</h2>
            <p className="text-xl text-gray-700 leading-loose font-serif mb-8">
              "ومن آياته أن خلق لكم من أنفسكم أزواجاً لتسكنوا إليها وجعل بينكم مودة ورحمة"
              <br /><br />
              فرحتنا ما تكملش غير بوجودكم معانا.
              <br />
              مستنيينكم تنورونا وتشاركونا أحلى يوم في عمرنا.
            </p>
            <div className="inline-block border-2 border-gold-400 p-1 rounded-full">
               <div className="bg-gold-50 px-8 py-3 rounded-full text-gold-700 font-bold">
                 قاعة السلام، نقابة المهندسين، 6 أكتوبر
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, rotate: -5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 relative"
          >
            <div className="absolute inset-0 border-4 border-gold-300 rounded-3xl transform rotate-6 translate-x-4 translate-y-4 -z-10 bg-white" />
            <div className="bg-white p-4 rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Hanan & Walid Casual" 
                className="w-full h-auto rounded-2xl object-cover aspect-[3/4]"
                referrerPolicy="no-referrer"
              />
              <div className="text-center mt-4 font-script text-2xl text-gray-500">
                أحلى أيام حياتنا
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


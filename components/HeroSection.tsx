'use client';

export default function HeroSection() {
  return (
    <div className="max-w-6xl mx-auto px-4">
    <section
      className="relative bg-cover bg-center text-white py-28 mt-8 rounded-2xl overflow-hidden"
      style={{
        backgroundImage: "url('/siteV2/images/college.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay dégradé bordeaux en bas vers transparent en haut */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7d201a]/40 to-[#7d201a]"></div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <h1 className="font-bold mb-6 drop-shadow-lg leading-tight relative mt-20">
  <span className="block text-white text-5xl md:text-6xl">
    Agir ensemble
  </span>
  <span className="block text-gold text-3xl md:text-4xl mt-10">
    pour nos enfants
  </span>
</h1>
        
        
      </div>
    </section>
    </div>
  );
}
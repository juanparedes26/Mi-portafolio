import React from 'react';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-8 md:px-16 lg:px-24">
          <div className="mx-auto max-w-[1400px] min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col justify-center py-8 lg:py-0 pr-0 lg:pr-16">
              <div className="max-w-lg">
                {/* Email */}
                <p className="text-blue-400 text-sm mb-4 font-light">
                  {t('about.email')}
                </p>

                {/* Main Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-6">
                  {t('about.title')}
                </h1>

                {/* Blue line separator */}
                <div className="w-16 h-0.5 bg-blue-400 mb-6" />

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                  {t('about.description')}
                </p>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-0.5 bg-blue-400" />
                  <p className="text-blue-400 text-sm uppercase tracking-wider font-light">
                    {t('about.location')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-full min-h-[60vh] lg:min-h-screen flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/about-portrait.jpg"
                  alt={t('about.photo_alt') || 'Portrait'}
                  className="w-full h-full object-cover object-center grayscale"
                  onError={(e) => { e.currentTarget.src = '/Retrato.jpg'; }}
                />
                {/* Dark overlay on image - reduced opacity */}
                <div className="absolute inset-0 bg-black/10" />
              </div>
              
              {/* Additional gradient overlay from left - reduced opacity */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
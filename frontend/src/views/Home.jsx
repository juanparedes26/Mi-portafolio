import React, {  useState } from 'react';
import { Context } from '../js/store/appContext.jsx';
import { useTranslation } from 'react-i18next';

function Home() {

  const { t, i18n } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);

 

  // Botón para alternar idioma
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 bg-blue-600 text-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <a className="text-white text-xl font-bold tracking-tight" href="#home">{t('navbar.home')}</a>
          <button
            className="lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
          <div className="hidden lg:flex space-x-8">
            <a className="text-white hover:underline underline-offset-4 font-semibold transition" href="#home">{t('navbar.home')}</a>
            <a className="text-white hover:underline underline-offset-4 font-semibold transition" href="#about">{t('navbar.about')}</a>
            <a className="text-white hover:underline underline-offset-4 font-semibold transition" href="#projects">{t('navbar.projects')}</a>
            <a className="text-white hover:underline underline-offset-4 font-semibold transition" href="#cv">{t('navbar.cv')}</a>
            <button onClick={toggleLanguage} className="ml-4 px-2 py-1 bg-white text-blue-600 rounded text-sm font-semibold hover:bg-blue-100 transition">
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {navOpen && (
          <div className="lg:hidden bg-blue-700">
            <div className="flex flex-col items-center space-y-2 py-4">
              <a className="block w-full text-center py-2 hover:bg-blue-800 transition" href="#home" onClick={() => setNavOpen(false)}>{t('navbar.home')}</a>
              <a className="block w-full text-center py-2 hover:bg-blue-800 transition" href="#about" onClick={() => setNavOpen(false)}>{t('navbar.about')}</a>
              <a className="block w-full text-center py-2 hover:bg-blue-800 transition" href="#projects" onClick={() => setNavOpen(false)}>{t('navbar.projects')}</a>
              <a className="block w-full text-center py-2 hover:bg-blue-800 transition" href="#cv" onClick={() => setNavOpen(false)}>{t('navbar.cv')}</a>
              <button onClick={toggleLanguage} className="mt-2 px-2 py-1 bg-white text-blue-600 rounded text-sm font-semibold hover:bg-blue-100 transition">
                {i18n.language === 'es' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center pt-20">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('hero.title')}</h1>
          <h2 className="text-2xl font-semibold mb-2">{t('hero.subtitle')}</h2>
          <p className="text-lg md:text-xl mb-6 text-gray-700">
            {t('hero.description')}
          </p>
          <div className="flex justify-center gap-4">
            <a href="#cv" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition">{t('hero.download_cv')}</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="m-0">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = ({ variant = 'default' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { t, language, setLanguage, languages, region, regionFlags } = useLanguage();

    const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    const nativeLanguageNames = {
        "English": "English - EN",
        "Hindi": "हिन्दी - HI",
        "Spanish": "Español - ES",
        "French": "Français - FR",
        "German": "Deutsch - DE",
        "Arabic": "العربية - AR",
        "Mandarin Chinese": "中文 (简体) - ZH",
        "Portuguese": "Português - PT",
        "Russian": "Русский - RU",
        "Japanese": "日本語 - JA",
        "Korean": "한국어 - KO",
        "Tamil": "தமிழ் - TA",
        "Bengali": "বাংলা - BN",
        "Gujarati": "ગુજરાતી - GU",
        "Turkish": "Türkçe - TR",
        "Marathi": "मराठी - MR",
        "Telugu": "తెలుగు - TE",
        "Kannada": "ಕನ್ನಡ - KN",
        "Malayalam": "മലയാളം - ML",
        "Italian": "Italiano - IT",
        "Dutch": "Nederlands - NL",
        "Urdu": "اردو - UR",
        "Polish": "Polski - PL",
        "Swedish": "Svenska - SV",
        "Vietnamese": "Tiếng Việt - VI",
        "Thai": "ไทย - TH"
    };

    const getNativeName = (lang) => nativeLanguageNames[lang] || lang;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const isLanding = variant === 'landing';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-xl border transition-all ${isLanding
                    ? 'bg-surface border-border text-subtext hover:text-primary hover:border-primary/50'
                    : 'bg-surface border-border/50 text-maintext hover:bg-surface/80 hover:border-primary/30'
                    }`}
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-semibold">
                    {getNativeName(language).split(' -')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute mt-2 w-48 sm:w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[999] ${isLanding ? 'right-0' : 'right-0'
                            }`}
                    >
                        <div className="p-3 bg-secondary/30 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-bold text-subtext uppercase tracking-wider">{t('changeLanguage')}</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                <img src={getFlagUrl(regionFlags[region] || 'us')} className="w-3.5 h-2.5 object-cover rounded-sm" alt="" />
                                <span className="text-[10px] font-bold text-primary">{t(`regions.${region}`) || region}</span>
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {languages.sort().map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${language === lang
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-maintext hover:bg-secondary'
                                        }`}
                                >
                                    <span className="text-sm font-medium truncate">{getNativeName(lang)}</span>
                                    {language === lang && <Check className="w-4 h-4 flex-shrink-0 ml-2" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;

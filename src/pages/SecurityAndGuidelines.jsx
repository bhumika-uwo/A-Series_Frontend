import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, Scale, Eye, AlertTriangle } from 'lucide-react';
import ReportModal from '../Components/ReportModal/ReportModal';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher';
import { apiService } from '../services/apiService';

const SecurityAndGuidelines = () => {
    const { t } = useLanguage();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: 'admin@uwo24.com',
        phone: '+91 83598 90909'
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await apiService.getPublicSettings();
                setContactInfo(prev => ({
                    email: settings.contactEmail || prev.email,
                    phone: settings.supportPhone || prev.phone
                }));
            } catch (e) {
                console.warn('Failed to load contact info', e);
            }
        };
        fetchSettings();
    }, []);

    const sections = [
        {
            id: 1,
            title: t('landing.securityGuidelines.section1.title'),
            icon: <Lock className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext">{t('landing.securityGuidelines.section1.mainText')}</p>

                    <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                        <div>
                            <h4 className="font-semibold text-maintext">{t('landing.securityGuidelines.section1.sub1Title')}</h4>
                            <p className="text-sm text-subtext">{t('landing.securityGuidelines.section1.sub1Text')}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-maintext">{t('landing.securityGuidelines.section1.sub2Title')}</h4>
                            <p className="text-sm text-subtext">{t('landing.securityGuidelines.section1.sub2Text')}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-maintext">{t('landing.securityGuidelines.section1.sub3Title')}</h4>
                            <p className="text-sm text-subtext">{t('landing.securityGuidelines.section1.sub3Text')} <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a></p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: t('landing.securityGuidelines.section2.title'),
            icon: <Shield className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <p className="text-subtext">{t('landing.securityGuidelines.section2.mainText')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-subtext">
                        <div className="p-3 bg-surface rounded-lg border border-border">
                            <h4 className="font-bold text-maintext mb-1">{t('landing.securityGuidelines.section2.dataResidencyTitle')}</h4>
                            <p>{t('landing.securityGuidelines.section2.dataResidencyText')}</p>
                        </div>
                        <div className="p-3 bg-surface rounded-lg border border-border">
                            <h4 className="font-bold text-maintext mb-1">{t('landing.securityGuidelines.section2.accessControlTitle')}</h4>
                            <p>{t('landing.securityGuidelines.section2.accessControlText')}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: t('landing.securityGuidelines.section3.title'),
            icon: <AlertTriangle className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <p className="text-subtext">{t('landing.securityGuidelines.section3.mainText')}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {t('landing.securityGuidelines.section3.prohibitedItems').map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-subtext bg-surface p-2 rounded-lg border border-border">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-subtext mt-2 italic">{t('landing.securityGuidelines.section3.violationWarning')}</p>
                </div>
            )
        },
        {
            id: 4,
            title: t('landing.securityGuidelines.section4.title'),
            icon: <Scale className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <div className="bg-surface/50 p-3 rounded-lg border border-border">
                        <h4 className="font-semibold text-maintext text-sm mb-1">{t('landing.securityGuidelines.section4.sub1Title')}</h4>
                        <p className="text-xs text-subtext">{t('landing.securityGuidelines.section4.sub1Text')}</p>
                    </div>
                    <div className="bg-surface/50 p-3 rounded-lg border border-border">
                        <h4 className="font-semibold text-maintext text-sm mb-1">{t('landing.securityGuidelines.section4.sub2Title')}</h4>
                        <p className="text-xs text-subtext">{t('landing.securityGuidelines.section4.sub2Text')}</p>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: t('landing.securityGuidelines.section5.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-2">
                    <p className="text-subtext">{t('landing.securityGuidelines.section5.text1')}</p>
                    <p className="text-subtext">{t('landing.securityGuidelines.section5.text2')}</p>
                    <p className="text-subtext font-medium text-blue-500">{t('landing.securityGuidelines.section5.text3')}</p>
                </div>
            )
        },
        {
            id: 6,
            title: t('landing.securityGuidelines.section6.title'),
            icon: <Eye className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-2">
                    <p className="text-subtext">{t('landing.securityGuidelines.section6.text1')}</p>
                    <p className="text-subtext">{t('landing.securityGuidelines.section6.text2')}</p>
                </div>
            )
        },
        {
            id: 7,
            title: t('landing.securityGuidelines.section7.title'),
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs">3P</div>,
            content: <p className="text-subtext">{t('landing.securityGuidelines.section7.text')}</p>
        },
        {
            id: 8,
            title: t('landing.securityGuidelines.section8.title'),
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs">©</div>,
            content: <div className="text-subtext space-y-2">
                <p><strong>{t('landing.securityGuidelines.section8.license')}</strong></p>
                <p><strong>{t('landing.securityGuidelines.section8.ownership')}</strong></p>
                <p><strong>{t('landing.securityGuidelines.section8.transfer')}</strong></p>
            </div>
        },
        {
            id: 9,
            title: t('landing.securityGuidelines.section9.title'),
            icon: <AlertTriangle className="w-5 h-5 text-primary" />,
            content: <ul className="list-disc list-inside text-subtext text-sm">
                {t('landing.securityGuidelines.section9.items').map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        },
        {
            id: 10,
            title: t('landing.securityGuidelines.section10.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext">{t('landing.securityGuidelines.section10.text')}</p>
        },
        {
            id: 11,
            title: t('landing.securityGuidelines.section11.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext">{t('landing.securityGuidelines.section11.text')} <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a>.</p>
        },
        {
            id: 12,
            title: t('landing.securityGuidelines.section12.title'),
            icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext text-sm">{t('landing.securityGuidelines.section12.mainText')}</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-colors">
                            <span>📧 {t('landing.securityGuidelines.section12.reportButton')}</span>
                            <span className="font-semibold">{t('landing.securityGuidelines.section12.reportButtonText')}</span>
                        </button>
                        <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 border border-primary/20 transition-colors">
                            <span>📞 {t('landing.securityGuidelines.section12.supportButton')}</span>
                            <span className="font-semibold">{contactInfo.phone}</span>
                        </a>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col bg-background overflow-hidden relative">
            {/* Header */}
            <header className="px-6 py-5 border-b border-border bg-secondary/30 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-maintext">{t('landing.securityGuidelines.pageTitle')}</h1>
                            <p className="text-xs text-subtext">{t('landing.securityGuidelines.lastUpdated')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-4xl mx-auto space-y-6 pb-10">

                    {/* Intro Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary border border-border rounded-xl p-6 shadow-sm"
                    >
                        <p className="text-subtext leading-relaxed">
                            {t('landing.securityGuidelines.intro')}
                        </p>
                    </motion.div>

                    {/* Grid for Sections */}
                    <div className="grid grid-cols-1 gap-4">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-secondary hover:bg-surface/50 border border-border rounded-xl p-5 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-3 border-b border-border/50 pb-2">
                                    {section.icon}
                                    <h3 className="text-lg font-semibold text-maintext">{section.title}</h3>
                                </div>
                                <div className="pl-1">
                                    {section.content}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact & Footer */}
                    <div className="mt-8">


                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-surface border border-border rounded-xl p-5"
                        >
                            <h3 className="font-bold text-maintext mb-2 flex items-center gap-2">
                                {t('landing.securityGuidelines.legalSummaryTitle')}
                            </h3>
                            <p className="text-subtext text-sm italic">
                                {t('landing.securityGuidelines.legalSummaryText')}
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        </div>
    );
};

export default SecurityAndGuidelines;

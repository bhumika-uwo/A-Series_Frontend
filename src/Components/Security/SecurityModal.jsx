import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, FileText, Scale, Eye, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/apiService';
import ReportModal from '../ReportModal/ReportModal';

const SecurityModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: 'admin@uwo24.com',
        phone: '+91 98765 43210'
    });

    useEffect(() => {
        if (isOpen) {
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
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const sections = [
        {
            id: 1,
            title: t('landing.securityGuidelines.section1.title'),
            icon: <Lock className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext text-sm">{t('landing.securityGuidelines.section1.mainText')}</p>
                    <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                        <div>
                            <h4 className="font-semibold text-maintext text-sm">{t('landing.securityGuidelines.section1.sub1Title')}</h4>
                            <p className="text-xs text-subtext">{t('landing.securityGuidelines.section1.sub1Text')}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-maintext text-sm">{t('landing.securityGuidelines.section1.sub2Title')}</h4>
                            <p className="text-xs text-subtext">{t('landing.securityGuidelines.section1.sub2Text')}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-maintext text-sm">{t('landing.securityGuidelines.section1.sub3Title')}</h4>
                            <p className="text-xs text-subtext">{t('landing.securityGuidelines.section1.sub3Text')} <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a></p>
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
                    <p className="text-subtext text-sm">{t('landing.securityGuidelines.section2.mainText')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-subtext">
                        <div className="p-3 bg-secondary rounded-xl border border-border">
                            <h4 className="font-bold text-maintext mb-1">{t('landing.securityGuidelines.section2.dataResidencyTitle')}</h4>
                            <p>{t('landing.securityGuidelines.section2.dataResidencyText')}</p>
                        </div>
                        <div className="p-3 bg-secondary rounded-xl border border-border">
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
                    <p className="text-subtext text-sm">{t('landing.securityGuidelines.section3.mainText')}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {t('landing.securityGuidelines.section3.prohibitedItems').map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-subtext bg-secondary p-2 rounded-lg border border-border">
                                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-[11px] text-subtext mt-2 italic">{t('landing.securityGuidelines.section3.violationWarning')}</p>
                </div>
            )
        },
        {
            id: 4,
            title: t('landing.securityGuidelines.section4.title'),
            icon: <Scale className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <div className="bg-secondary/50 p-3 rounded-lg border border-border">
                        <h4 className="font-semibold text-maintext text-xs mb-1">{t('landing.securityGuidelines.section4.sub1Title')}</h4>
                        <p className="text-[11px] text-subtext">{t('landing.securityGuidelines.section4.sub1Text')}</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg border border-border">
                        <h4 className="font-semibold text-maintext text-xs mb-1">{t('landing.securityGuidelines.section4.sub2Title')}</h4>
                        <p className="text-[11px] text-subtext">{t('landing.securityGuidelines.section4.sub2Text')}</p>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: t('landing.securityGuidelines.section5.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-2 text-sm text-subtext">
                    <p>{t('landing.securityGuidelines.section5.text1')}</p>
                    <p>{t('landing.securityGuidelines.section5.text2')}</p>
                    <p className="font-medium text-blue-500">{t('landing.securityGuidelines.section5.text3')}</p>
                </div>
            )
        },
        {
            id: 6,
            title: t('landing.securityGuidelines.section6.title'),
            icon: <Eye className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-2 text-sm text-subtext">
                    <p>{t('landing.securityGuidelines.section6.text1')}</p>
                    <p>{t('landing.securityGuidelines.section6.text2')}</p>
                </div>
            )
        },
        {
            id: 7,
            title: t('landing.securityGuidelines.section7.title'),
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs">3P</div>,
            content: <p className="text-subtext text-sm">{t('landing.securityGuidelines.section7.text')}</p>
        },
        {
            id: 8,
            title: t('landing.securityGuidelines.section8.title'),
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs">©</div>,
            content: <div className="text-subtext text-xs space-y-2">
                <p><strong>{t('landing.securityGuidelines.section8.license')}</strong></p>
                <p><strong>{t('landing.securityGuidelines.section8.ownership')}</strong></p>
                <p><strong>{t('landing.securityGuidelines.section8.transfer')}</strong></p>
            </div>
        },
        {
            id: 9,
            title: t('landing.securityGuidelines.section9.title'),
            icon: <AlertTriangle className="w-5 h-5 text-primary" />,
            content: <ul className="list-disc list-inside text-subtext text-xs space-y-1">
                {t('landing.securityGuidelines.section9.items').map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        },
        {
            id: 10,
            title: t('landing.securityGuidelines.section10.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">{t('landing.securityGuidelines.section10.text')}</p>
        },
        {
            id: 11,
            title: t('landing.securityGuidelines.section11.title'),
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">{t('landing.securityGuidelines.section11.text')} <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">{contactInfo.email}</a>.</p>
        },
        {
            id: 12,
            title: t('landing.securityGuidelines.section12.title'),
            icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext text-sm">{t('landing.securityGuidelines.section12.mainText')}</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-500/20 border border-blue-500/20 transition-colors text-xs">
                            <span>📧 {t('landing.securityGuidelines.section12.reportButton')}</span>
                            <span className="font-semibold">{t('landing.securityGuidelines.section12.reportButtonText')}</span>
                        </button>
                        <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 border border-primary/20 transition-colors text-xs">
                            <span>📞 {t('landing.securityGuidelines.section12.supportButton')}</span>
                            <span className="font-semibold">{contactInfo.phone}</span>
                        </a>
                    </div>
                </div>
            )
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-background border border-border rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-maintext tracking-tight">{t('landing.securityGuidelines.pageTitle')}</h2>
                                    <p className="text-xs text-subtext font-medium uppercase tracking-wider">{t('landing.securityGuidelines.lastUpdated')}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-secondary rounded-2xl text-subtext transition-all duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="space-y-6">
                                {/* Intro Banner */}
                                <div className="bg-secondary p-6 rounded-3xl border border-border hover:border-primary/20 transition-all duration-300">
                                    <p className="text-subtext leading-relaxed text-sm">
                                        {t('landing.securityGuidelines.intro')}
                                    </p>
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="bg-background border border-border rounded-3xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
                                        >
                                            <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-3">
                                                <div className="p-2 bg-primary/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    {section.icon}
                                                </div>
                                                <h3 className="font-bold text-maintext">{section.title}</h3>
                                            </div>
                                            <div className="text-subtext">
                                                {section.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Legal Summary Card */}
                                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center">
                                    <h3 className="font-bold text-primary mb-2 flex items-center justify-center gap-2">
                                        {t('landing.securityGuidelines.legalSummaryTitle')}
                                    </h3>
                                    <p className="text-subtext text-xs italic leading-relaxed">
                                        "{t('landing.securityGuidelines.legalSummaryText')}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 md:p-8 border-t border-border flex justify-center bg-secondary/30">
                            <button
                                onClick={onClose}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-primary/20"
                            >
                                {t('landing.policies.gotIt')}
                            </button>
                        </div>
                    </motion.div>
                    <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
                </div>
            )}
        </AnimatePresence>
    );
};

export default SecurityModal;

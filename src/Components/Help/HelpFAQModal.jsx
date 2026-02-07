import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { apis } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const HelpFAQModal = ({ isOpen, onClose, user }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("faq");
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [issueText, setIssueText] = useState("");
    const [issueType, setIssueType] = useState("General Inquiry");
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    const [supportPhone, setSupportPhone] = useState(null);
    const [contactEmail, setContactEmail] = useState("admin@uwo24.com");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            import('../../services/apiService').then(({ default: api }) => {
                api.getPublicSettings().then(settings => {
                    if (settings?.supportPhone) setSupportPhone(settings.supportPhone);
                    if (settings?.contactEmail) setContactEmail(settings.contactEmail);
                }).catch(err => console.warn("Failed to load support info", err));
            });
        }
    }, [isOpen]);

    const issueOptions = [
        t('faqHelp.issueOptions.generalInquiry'),
        t('faqHelp.issueOptions.paymentIssue'),
        t('faqHelp.issueOptions.refundRequest'),
        t('faqHelp.issueOptions.technicalSupport'),
        t('faqHelp.issueOptions.accountAccess'),
        t('faqHelp.issueOptions.other')
    ];

    const handleSupportSubmit = async () => {
        if (!issueText.trim()) return;
        setIsSending(true);
        setSendStatus(null);
        try {
            await axios.post(apis.support, {
                email: user?.email || "guest@uwo24.com",
                issueType,
                message: issueText,
                userId: user?.id || null,
                source: 'help_faq'
            });
            setSendStatus('success');
            setIssueText("");
            setTimeout(() => setSendStatus(null), 3000);
        } catch (error) {
            console.error("Support submission failed", error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('faq')}
                            className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'faq' ? 'bg-primary/10 text-primary' : 'text-subtext hover:text-maintext'}`}
                        >
                            {t('faqHelp.faqTab')}
                        </button>
                        <button
                            onClick={() => setActiveTab('help')}
                            className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'help' ? 'bg-primary/10 text-primary' : 'text-subtext hover:text-maintext'}`}
                        >
                            {t('faqHelp.helpTab')}
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface rounded-full text-subtext transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {activeTab === 'faq' ? (
                        <>
                            <p className="text-sm text-subtext font-medium">{t('faqHelp.faqSubtitle')}</p>
                            {t('faqHelp.faqs').map((faq, index) => (
                                <div key={index} className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/30 transition-all">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full flex justify-between items-center p-4 text-left hover:bg-secondary transition-colors focus:outline-none"
                                    >
                                        <span className="font-semibold text-maintext text-[15px]">{faq.question}</span>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="w-4 h-4 text-primary" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-subtext" />
                                        )}
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100 bg-secondary/50' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-4 pt-0 text-subtext text-sm leading-relaxed border-t border-border/50 mt-2 pt-3">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-bold text-maintext mb-2">{t('faqHelp.issueCategory')}</label>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full p-4 rounded-2xl bg-secondary border-2 ${isDropdownOpen ? 'border-primary' : 'border-border'} hover:border-primary/50 cursor-pointer flex justify-between items-center transition-all`}
                                    >
                                        <span className="text-maintext font-medium">{issueType}</span>
                                        {isDropdownOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-subtext" />}
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {issueOptions.map((opt) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => {
                                                        setIssueType(opt);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`p-3 text-sm font-medium cursor-pointer transition-colors ${issueType === opt ? 'bg-primary/10 text-primary' : 'text-maintext hover:bg-secondary'}`}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-maintext mb-2">{t('faqHelp.describeIssue')}</label>
                                <textarea
                                    className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary outline-none resize-none text-maintext min-h-[150px]"
                                    placeholder={t('faqHelp.issuePlaceholder')}
                                    value={issueText}
                                    onChange={(e) => setIssueText(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleSupportSubmit}
                                disabled={isSending || !issueText.trim()}
                                className={`flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 ${isSending || !issueText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                            >
                                {isSending ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5" />
                                        {t('faqHelp.sendToSupport')}
                                    </>
                                )}
                            </button>

                            {sendStatus === 'success' && (
                                <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm text-center font-medium border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                                    {t('faqHelp.ticketSuccess')}
                                </div>
                            )}

                            {sendStatus === 'error' && (
                                <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                                    {t('faqHelp.ticketError')}
                                </div>
                            )}

                            <div className="text-center text-xs text-subtext space-y-1">
                                <p>
                                    {t('faqHelp.emailDirectly')} <a href={`mailto:${contactEmail}`} className="text-primary font-medium hover:underline">{contactEmail}</a>
                                </p>
                                {supportPhone && (
                                    <p>
                                        {t('faqHelp.customerSupport')} <span className="text-maintext font-bold">{supportPhone}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-surface text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        {t('faqHelp.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpFAQModal;

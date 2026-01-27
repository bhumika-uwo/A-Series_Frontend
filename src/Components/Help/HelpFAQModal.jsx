import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { faqs } from '../../constants';
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

    const issueOptions = [
        "General Inquiry",
        "Payment Issue",
        "Refund Request",
        "Technical Support",
        "Account Access",
        "Other"
    ];

    const handleSupportSubmit = async () => {
        if (!issueText.trim()) return;
        setIsSending(true);
        setSendStatus(null);
        try {
            await axios.post(apis.support, {
                email: user?.email || "guest@ai-mall.in",
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
                            FAQ
                        </button>
                        <button
                            onClick={() => setActiveTab('help')}
                            className={`text-lg font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'help' ? 'bg-primary/10 text-primary' : 'text-subtext hover:text-maintext'}`}
                        >
                            Help
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full text-subtext transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {activeTab === 'faq' ? (
                        <>
                            <p className="text-sm text-subtext font-medium">Get quick answers to common questions about our platform</p>
                            {faqs.map((faq, index) => (
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
                                <label className="block text-sm font-bold text-maintext mb-2">Select Issue Category</label>
                                <div className="relative">
                                    <select
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value)}
                                        className="w-full p-4 pr-10 rounded-xl bg-secondary border border-border focus:border-primary outline-none appearance-none text-maintext font-medium cursor-pointer hover:border-primary/50 transition-colors"
                                    >
                                        {issueOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-maintext mb-2">Describe your issue</label>
                                <textarea
                                    className="w-full p-4 rounded-xl bg-secondary border border-border focus:border-primary outline-none resize-none text-maintext min-h-[150px]"
                                    placeholder="Please provide details about the problem you are facing..."
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
                                        Send to Support
                                    </>
                                )}
                            </button>

                            {sendStatus === 'success' && (
                                <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm text-center font-medium border border-green-500/20 animate-in fade-in slide-in-from-top-2">
                                    Ticket Submitted Successfully! Our team will contact you soon.
                                </div>
                            )}

                            {sendStatus === 'error' && (
                                <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                                    Failed to submit ticket. Please try again or email us directly.
                                </div>
                            )}

                            <p className="text-xs text-center text-subtext">
                                Or email us directly at <a href="mailto:support@a-series.in" className="text-primary font-medium hover:underline">support@a-series.in</a>
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-surface text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpFAQModal;

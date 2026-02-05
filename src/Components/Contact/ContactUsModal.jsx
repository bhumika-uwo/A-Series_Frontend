import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/apiService';
import { getUserData } from '../../userStore/userData';
import toast from 'react-hot-toast';

const ContactUsModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [contactInfo, setContactInfo] = useState({
        email: 'admin@uwo24.com', // Default fallback
        phone: '+91 83598 90909' // Default fallback
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('contactUs.validationNameRequired');
        if (!formData.email.trim()) newErrors.email = t('contactUs.validationEmailRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('contactUs.validationEmailInvalid');
        if (!formData.subject.trim()) newErrors.subject = t('contactUs.validationSubjectRequired');
        if (!formData.message.trim()) newErrors.message = t('contactUs.validationMessageRequired');
        else if (formData.message.trim().length < 10) newErrors.message = t('contactUs.validationMessageTooShort');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error(t('contactUs.toastError'));
            return;
        }

        setLoading(true);
        try {
            const categoryMap = {
                'general': t('contactUs.categories.general'),
                'technical': t('contactUs.categories.technical'),
                'bug': t('contactUs.categories.bug'),
                'feedback': t('contactUs.categories.feedback'),
                'partnership': t('contactUs.categories.partnership')
            };

            const userData = getUserData();
            const userId = userData?._id || userData?.id || userData?.user?._id || userData?.user?.id;

            await apiService.createSupportTicket({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                issueType: categoryMap[formData.category] || 'Other',
                message: formData.message,
                userId: userId,
                source: 'contact_us_modal'
            });

            toast.success(t('contactUs.toastSuccess'));
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                category: 'general',
                message: '',
            });
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error(t('contactUs.toastFailed'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
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
                        className="relative bg-background border border-border rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-maintext tracking-tight">{t('contactUs.pageTitle')}</h2>
                                    <p className="text-xs text-subtext font-medium uppercase tracking-wider">{t('contactUs.pageSubtitle')}</p>
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
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Contact Info Sidebar */}
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: <Mail className="w-5 h-5 text-primary" />,
                                            title: t('contactUs.emailTitle'),
                                            value: contactInfo.email,
                                            subtitle: t('contactUs.emailResponse'),
                                            color: 'bg-primary/10'
                                        },
                                        {
                                            icon: <Phone className="w-5 h-5 text-blue-500" />,
                                            title: t('contactUs.phoneTitle'),
                                            value: contactInfo.phone,
                                            subtitle: t('contactUs.phoneHours'),
                                            color: 'bg-blue-500/10'
                                        },
                                        {
                                            icon: <MapPin className="w-5 h-5 text-green-500" />,
                                            title: t('contactUs.locationTitle'),
                                            value: `${t('contactUs.locationCity')}, ${t('contactUs.locationState')}`,
                                            subtitle: t('contactUs.locationTitle'),
                                            color: 'bg-green-500/10'
                                        },
                                        {
                                            icon: <Clock className="w-5 h-5 text-purple-500" />,
                                            title: t('contactUs.supportHoursTitle'),
                                            value: t('contactUs.supportHoursWeekday'),
                                            subtitle: t('contactUs.supportHoursWeekend'),
                                            color: 'bg-purple-500/10'
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-secondary/50 border border-border rounded-3xl p-5 hover:border-primary/20 transition-all duration-300 group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-maintext text-sm mb-0.5">{item.title}</h4>
                                                    <p className="text-subtext text-xs leading-relaxed font-medium">{item.value}</p>
                                                    <p className="text-[10px] text-subtext/60 mt-1">{item.subtitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Form Area */}
                                <div className="lg:col-span-2 bg-secondary/30 border border-border rounded-[2rem] p-6 md:p-8">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formNameLabel')}</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-3.5 rounded-2xl border bg-background text-sm transition-all outline-none ${errors.name ? 'border-red-500 focus:ring-2 ring-red-500/10' : 'border-border focus:border-primary focus:ring-4 ring-primary/5'}`}
                                                    placeholder={t('contactUs.formNamePlaceholder')}
                                                />
                                                {errors.name && <p className="text-red-500 text-[10px] mt-1.5 px-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formEmailLabel')}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-3.5 rounded-2xl border bg-background text-sm transition-all outline-none ${errors.email ? 'border-red-500 focus:ring-2 ring-red-500/10' : 'border-border focus:border-primary focus:ring-4 ring-primary/5'}`}
                                                    placeholder={t('contactUs.formEmailPlaceholder')}
                                                />
                                                {errors.email && <p className="text-red-500 text-[10px] mt-1.5 px-1">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formPhoneLabel')}</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-sm transition-all outline-none focus:border-primary focus:ring-4 ring-primary/5"
                                                    placeholder={t('contactUs.formPhonePlaceholder')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formCategoryLabel')}</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 rounded-2xl border border-border bg-background text-sm transition-all outline-none focus:border-primary focus:ring-4 ring-primary/5 appearance-none cursor-pointer"
                                                >
                                                    <option value="general">{t('contactUs.categories.general')}</option>
                                                    <option value="technical">{t('contactUs.categories.technical')}</option>
                                                    <option value="bug">{t('contactUs.categories.bug')}</option>
                                                    <option value="feedback">{t('contactUs.categories.feedback')}</option>
                                                    <option value="partnership">{t('contactUs.categories.partnership')}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formSubjectLabel')}</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-3.5 rounded-2xl border bg-background text-sm transition-all outline-none ${errors.subject ? 'border-red-500 focus:ring-2 ring-red-500/10' : 'border-border focus:border-primary focus:ring-4 ring-primary/5'}`}
                                                placeholder={t('contactUs.formSubjectPlaceholder')}
                                            />
                                            {errors.subject && <p className="text-red-500 text-[10px] mt-1.5 px-1">{errors.subject}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-maintext mb-2 px-1 uppercase tracking-wider">{t('contactUs.formMessageLabel')}</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="5"
                                                className={`w-full px-5 py-3.5 rounded-2xl border bg-background text-sm transition-all outline-none resize-none ${errors.message ? 'border-red-500 focus:ring-2 ring-red-500/10' : 'border-border focus:border-primary focus:ring-4 ring-primary/5'}`}
                                                placeholder={t('contactUs.formMessagePlaceholder')}
                                            />
                                            {errors.message && <p className="text-red-500 text-[10px] mt-1.5 px-1">{errors.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group hover:opacity-90 active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    {t('contactUs.formSubmitButton')}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* FAQ Preview */}
                            <div className="mt-8 bg-background border border-border rounded-[2rem] p-6 md:p-8">
                                <h3 className="text-xl font-black text-maintext mb-6 flex items-center gap-3">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                    {t('contactUs.faqTitle')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {t('contactUs.faqs').slice(0, 4).map((faq, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all">
                                            <h4 className="font-bold text-maintext text-sm mb-2">{faq.question}</h4>
                                            <p className="text-subtext text-xs leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContactUsModal;

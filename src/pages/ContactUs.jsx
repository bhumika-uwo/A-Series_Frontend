import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';
import { getUserData } from '../userStore/userData';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher';
import { useNavigate } from 'react-router';
import { AppRoute } from '../types';
import { logo, name } from '../constants';

const ContactUs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  React.useEffect(() => {
    // Fetch dynamic settings
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t('landing.contactUs.validationNameRequired');
    if (!formData.email.trim()) newErrors.email = t('landing.contactUs.validationEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('landing.contactUs.validationEmailInvalid');
    if (!formData.subject.trim()) newErrors.subject = t('landing.contactUs.validationSubjectRequired');
    if (!formData.message.trim()) newErrors.message = t('landing.contactUs.validationMessageRequired');
    else if (formData.message.trim().length < 10) newErrors.message = t('landing.contactUs.validationMessageTooShort');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('landing.contactUs.toastError'));
      return;
    }

    setLoading(true);
    try {
      // Map category to issueType using translated values
      const categoryMap = {
        'general': t('landing.contactUs.categories.general'),
        'technical': t('landing.contactUs.categories.technical'),
        'bug': t('landing.contactUs.categories.bug'),
        'feedback': t('landing.contactUs.categories.feedback'),
        'partnership': t('landing.contactUs.categories.partnership')
      };

      // Get user ID if logged in
      const userData = getUserData();
      // Check multiple possible locations for the ID
      const userId = userData?._id || userData?.id || userData?.user?._id || userData?.user?.id;

      await apiService.createSupportTicket({ // Use apiService directly
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        issueType: categoryMap[formData.category] || 'Other',
        message: formData.message,
        userId: userId, // Add userId to payload
        source: 'contact_us'
      });

      toast.success(`${t('landing.contactUs.toastSuccess')} ID: ${userId ? userId : 'None'}`);
      console.log("Sent Ticket. UserData:", userData, "Extracted userId:", userId);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(t('landing.contactUs.toastFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b] py-6 px-4">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-black tracking-tighter text-maintext">{name}</span>
        </div>
        <LanguageSwitcher variant="landing" />
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-maintext mb-4">{t('landing.contactUs.pageTitle')}</h1>
          <p className="text-lg text-subtext max-w-2xl mx-auto">
            {t('landing.contactUs.pageSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Card */}
          <div className="md:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">{t('landing.contactUs.emailTitle')}</h3>
                  <p className="text-subtext text-sm">{contactInfo.email}</p>
                  <p className="text-subtext text-sm">{t('landing.contactUs.emailResponse')}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">{t('landing.contactUs.phoneTitle')}</h3>
                  <p className="text-subtext text-sm">{contactInfo.phone}</p>
                  <p className="text-subtext text-sm">{t('landing.contactUs.phoneHours')}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">{t('landing.contactUs.locationTitle')}</h3>
                  <p className="text-subtext text-sm">{t('landing.contactUs.locationCity')}</p>
                  <p className="text-subtext text-sm">{t('landing.contactUs.locationState')}</p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">{t('landing.contactUs.supportHoursTitle')}</h3>
                  <p className="text-subtext text-sm">{t('landing.contactUs.supportHoursWeekday')}</p>
                  <p className="text-subtext text-sm">{t('landing.contactUs.supportHoursWeekend')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-card rounded-2xl p-8 shadow-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    {t('landing.contactUs.formNameLabel')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors bg-transparent ${errors.name
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-border focus:border-primary'
                      } text-maintext placeholder-subtext/50 focus:outline-none`}
                    placeholder={t('landing.contactUs.formNamePlaceholder')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    {t('landing.contactUs.formEmailLabel')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors bg-transparent ${errors.email
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-border focus:border-primary'
                      } text-maintext placeholder-subtext/50 focus:outline-none`}
                    placeholder={t('landing.contactUs.formEmailPlaceholder')}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    {t('landing.contactUs.formPhoneLabel')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-transparent text-maintext placeholder-subtext/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder={t('landing.contactUs.formPhonePlaceholder')}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    {t('landing.contactUs.formCategoryLabel')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'general', label: t('landing.contactUs.categories.general') },
                      { id: 'technical', label: t('landing.contactUs.categories.technical') },
                      { id: 'bug', label: t('landing.contactUs.categories.bug') },
                      { id: 'feedback', label: t('landing.contactUs.categories.feedback') },
                      { id: 'partnership', label: t('landing.contactUs.categories.partnership') }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                        className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${formData.category === cat.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-transparent text-maintext hover:border-primary/50'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-maintext mb-2">
                  {t('landing.contactUs.formSubjectLabel')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors bg-transparent ${errors.subject
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-border focus:border-primary'
                    } text-maintext placeholder-subtext/50 focus:outline-none`}
                  placeholder={t('landing.contactUs.formSubjectPlaceholder')}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-maintext mb-2">
                  {t('landing.contactUs.formMessageLabel')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors bg-transparent resize-none ${errors.message
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-border focus:border-primary'
                    } text-maintext placeholder-subtext/50 focus:outline-none`}
                  placeholder={t('landing.contactUs.formMessagePlaceholder')}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {loading ? t('landing.contactUs.formSubmitting') : t('landing.contactUs.formSubmitButton')}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h2 className="text-3xl font-bold text-maintext mb-8 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            {t('landing.contactUs.faqTitle')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {t('landing.contactUs.faqs').map((faq, i) => (
              <div key={i} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-maintext mb-2">{faq.question}</h3>
                <p className="text-subtext text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

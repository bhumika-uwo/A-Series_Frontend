import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';
import { getUserData } from '../userStore/userData';

const ContactUs = () => {
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

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'partnership', label: 'Partnership' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters long';

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
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // Map category to issueType
      const categoryMap = {
        'general': 'General Inquiry',
        'technical': 'Technical Support',
        'bug': 'Bug Report',
        'feedback': 'Feedback',
        'partnership': 'Partnership'
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

      toast.success(`Ticket Sent! ID: ${userId ? userId : 'None'}`);
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
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-maintext mb-4">Get in Touch</h1>
          <p className="text-lg text-subtext max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Our team is here to help and will respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Card */}
          <div className="md:col-span-1 space-y-6">
            {/* Email */}
            <div className="bg-white dark:bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">Email</h3>
                  <p className="text-subtext text-sm">admin@uwo24.com</p>
                  <p className="text-subtext text-sm">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">Phone</h3>
                  <p className="text-subtext text-sm">+91 83589 90909</p>
                  <p className="text-subtext text-sm">Mon-Fri 9AM-6PM IST</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">Location</h3>
                  <p className="text-subtext text-sm">Jabalpur</p>
                  <p className="text-subtext text-sm">Madhya Pradesh, India</p>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white dark:bg-surface rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-maintext mb-1">Support Hours</h3>
                  <p className="text-subtext text-sm">Mon-Fri: 9AM - 6PM</p>
                  <p className="text-subtext text-sm">Weekend: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white dark:bg-surface rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    Full Name *
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
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    Email Address *
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
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-transparent text-maintext placeholder-subtext/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-maintext mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-transparent text-maintext focus:outline-none focus:border-primary transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-surface">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-maintext mb-2">
                  Subject *
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
                  placeholder="What is this about?"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-maintext mb-2">
                  Message *
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
                  placeholder="Tell us more about your inquiry..."
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
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-surface rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-maintext mb-8 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What is the typical response time?",
                a: "We aim to respond to all inquiries within 24 hours during business days."
              },
              {
                q: "Can I track my support ticket?",
                a: "Yes, if you're a registered user, you can track your submissions in your dashboard."
              },
              {
                q: "Do you offer phone support?",
                a: "Yes, you can call us at +91 83589 90909 during business hours (Mon-Fri, 9AM-6PM IST)."
              },
              {
                q: "How do I report a bug?",
                a: "Select 'Bug Report' as the category in the contact form and provide as much detail as possible."
              },
              {
                q: "Are there any alternative contact methods?",
                a: "You can also reach us via email at admin@uwo24.com or check our Help Center."
              },
            ].map((faq, i) => (
              <div key={i} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-maintext mb-2">{faq.q}</h3>
                <p className="text-subtext text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

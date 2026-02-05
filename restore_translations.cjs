const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['english', 'hindi', 'tamil', 'telugu', 'marathi', 'gujarati', 'bengali', 'french', 'spanish', 'arabic'];

// content to add/merge
const missingContent = {
    contactUs: {
        validationNameRequired: "Name is required",
        validationEmailRequired: "Email is required",
        validationEmailInvalid: "Invalid email address",
        validationSubjectRequired: "Subject is required",
        validationMessageRequired: "Message is required",
        validationMessageTooShort: "Message must be at least 10 characters",
        toastError: "Please fix the errors in the form",
        toastSuccess: "Message sent successfully!",
        toastFailed: "Failed to send message",
        emailTitle: "Email Us",
        emailResponse: "We usually respond within 24 hours",
        phoneTitle: "Call Us",
        phoneHours: "Mon-Fri from 8am to 5pm",
        locationTitle: "Visit Us",
        locationCity: "Jabalpur",
        locationState: "Madhya Pradesh",
        supportHoursTitle: "Support Hours",
        supportHoursWeekday: "Mon - Fri: 9AM - 6PM",
        supportHoursWeekend: "Sat - Sun: 10AM - 2PM",
        formNameLabel: "FULL NAME",
        formNamePlaceholder: "John Doe",
        formEmailLabel: "EMAIL ADDRESS",
        formEmailPlaceholder: "john@example.com",
        formPhoneLabel: "PHONE NUMBER",
        formPhonePlaceholder: "+91 83598 90909",
        formCategoryLabel: "CATEGORY",
        formSubjectLabel: "SUBJECT",
        formSubjectPlaceholder: "Brief summary of your issue",
        formMessageLabel: "MESSAGE",
        formMessagePlaceholder: "How can we help you?",
        formSubmitButton: "Send Message",
        faqTitle: "Frequently Asked Questions",
        categories: {
            general: "General Inquiry",
            technical: "Technical Support",
            bug: "Report a Bug",
            feedback: "Feedback",
            partnership: "Partnership"
        },
        pageTitle: "Contact Us",
        pageSubtitle: "Get in touch with our team"
    },
    landing: {
        securityGuidelines: {
            pageTitle: "Security Guidelines",
            lastUpdated: "Last Updated: February 2026",
            intro: "At A-Series, we take security seriously. These guidelines outline how we protect your data and what we expect from our users.",
            legalSummaryTitle: "Legal Summary",
            legalSummaryText: "By using our platform, you agree to adhere to these security standards.",
            section1: {
                title: "Data Protection",
                mainText: "We implement robust measures to protect your personal and business data.",
                sub1Title: "Encryption",
                sub1Text: "End-to-end encryption for all sensitive data.",
                sub2Title: "Storage",
                sub2Text: "Secure cloud storage with redundancy.",
                sub3Title: "Privacy",
                sub3Text: "Strict privacy controls. Contact: "
            },
            section2: {
                title: "Infrastructure",
                mainText: "Our infrastructure is built on world-class secure foundations.",
                dataResidencyTitle: "Data Residency",
                dataResidencyText: "Data stored in compliance with local regulations.",
                accessControlTitle: "Access Control",
                accessControlText: "Strict role-based access control."
            },
            section3: {
                title: "Prohibited Content",
                mainText: "The following content is strictly prohibited on our platform:",
                prohibitedItems: ["Malware", "Hate Speech", "Illegal Content", "Harassment"],
                violationWarning: "Violations will result in immediate account suspension."
            },
            section4: {
                title: "Compliance",
                sub1Title: "GDPR",
                sub1Text: "We are fully GDPR compliant.",
                sub2Title: "SOC2",
                sub2Text: "Audit logs available upon request."
            },
            section5: {
                title: "Reporting",
                text1: "If you find a vulnerability, please report it.",
                text2: "We offer a bug bounty program.",
                text3: "admin@uwo24.com"
            },
            section6: {
                title: "User Responsibility",
                text1: "Keep your credentials safe.",
                text2: "Enable 2FA for added security."
            },
            section7: {
                title: "Third Party",
                text: "We review all third-party integrations for security risks."
            },
            section8: {
                title: "Intellectual Property",
                license: "Content maintained by user.",
                ownership: "Platform owns code.",
                transfer: "Rights transfer policy."
            },
            section9: {
                title: "API Security",
                items: ["Rate limiting", "API Keys", "HTTPS only"]
            },
            section10: {
                title: "Monitoring",
                text: "We monitor for suspicious activity 24/7."
            },
            section11: {
                title: "Contact Security",
                text: "For security concerns, email "
            },
            section12: {
                title: "Emergency",
                mainText: "In case of a security breach:",
                reportButton: "Email",
                reportButtonText: "Report Breach",
                supportButton: "Call"
            }
        },
        trustSafety: {
            pageTitle: "Trust & Safety",
            lastUpdated: "Updated",
            heroTitle: "Trust Center",
            heroText: "Building trust through transparency and security.",
            footerNote: "Trust is the foundation of our platform.",
            section1: {
                title: "Privacy First",
                italicText: "Your privacy is our priority.",
                sub1Title: "No Tracking",
                sub1Text: "We do not track you across sites.",
                sub2Title: "No Selling",
                sub2Text: "We never sell your data.",
                sub3Title: "Control",
                sub3Text: "You have full control over your data."
            },
            section2: {
                title: "Compliance Standards",
                mainText: "We follow global standards.",
                standard1: "ISO: 27001 Certified",
                standard2: "GDPR: Compliant",
                standard3: "CCPA: Compliant"
            },
            section3: {
                title: "Security Measures",
                layerHeader: "Layer",
                measureHeader: "Measure",
                encryptionLabel: "Encryption",
                encryptionText: "AES-256",
                residencyLabel: "Residency",
                residencyText: "Local",
                accessLabel: "Access",
                accessText: "MFA",
                certLabel: "Certifications",
                certText: "Industry Standard"
            },
            section4: {
                title: "Usage Policy",
                intro: "Responsible use of AI.",
                prohibitedTitle: "Prohibited",
                item1: "Deepfakes",
                item2: "Misinformation",
                item3: "Harmful content",
                highRiskTitle: "High Risk",
                item4: "Medical advice",
                item5: "Legal advice",
                item6: "Financial advice"
            },
            section5: {
                title: "Transparency",
                item1: "Open algorithms",
                item2: "Explainable AI",
                item3: "Clear policies"
            }
        }
    }
};

function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

// Just doing a shallow merge for top level keys to avoid destroying existing data
// But for contactUs and landing, we need to be careful.

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Merge contactUs
            content.contactUs = { ...content.contactUs, ...missingContent.contactUs };

            // Merge landing
            if (!content.landing) content.landing = {};
            content.landing.securityGuidelines = missingContent.landing.securityGuidelines; // Overwrite or add
            content.landing.trustSafety = missingContent.landing.trustSafety;

            fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
            console.log(`Updated ${lang}.json`);
        } catch (e) {
            console.error(`Error updating ${lang}.json`, e);
        }
    }
});

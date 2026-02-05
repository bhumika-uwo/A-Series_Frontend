const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['english', 'hindi', 'tamil', 'telugu', 'marathi', 'gujarati', 'bengali', 'french', 'spanish', 'arabic'];

const extraFaqs = [
    {
        question: "How do I update my billing information?",
        answer: "You can update your payment method and billing details in the Settings > Billing & Payments section."
    },
    {
        question: "Can I export my chat history?",
        answer: "Yes, you can export individual chats as PDF or Word documents using the export button in the chat interface."
    },
    {
        question: "What languages does A-Series support?",
        answer: "We currently support 10 major languages including English, Hindi, Spanish, French, Arabic, and several Indian regional languages."
    },
    {
        question: "How do I report a bug or issue?",
        answer: "If you encounter any issues, please use the 'Contact Us' form or email our support team directly at admin@uwo24.com."
    }
];

languages.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (content.faqHelp && Array.isArray(content.faqHelp.faqs)) {
                // Check if we already have these (avoid duplicates if run multiple times)
                const existingQuestions = new Set(content.faqHelp.faqs.map(f => f.question));
                const toAdd = extraFaqs.filter(f => !existingQuestions.has(f.question));

                if (toAdd.length > 0) {
                    content.faqHelp.faqs = [...content.faqHelp.faqs, ...toAdd];
                    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
                    console.log(`Added ${toAdd.length} FAQs to ${lang}.json`);
                } else {
                    console.log(`No new FAQs to add for ${lang}.json`);
                }
            }
        } catch (e) {
            console.error(`Error updating ${lang}.json`, e);
        }
    }
});

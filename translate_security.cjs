const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

// Define translations for the "Got It" button and Security Guidelines
const translations = {
    "hindi": {
        "policies": { "gotIt": "समझ गया" },
        "securityGuidelines": {
            "pageTitle": "सुरक्षा दिशानिर्देश", "lastUpdated": "अंतिम अपडेट: फरवरी 2026", "intro": "A-Series में, हम सुरक्षा को गंभीरता से लेते हैं।",
            "legalSummaryTitle": "कानूनी सारांश", "legalSummaryText": "हमारे प्लेटफ़ॉर्म का उपयोग सुरक्षित है।",
            "section1": { "title": "डेटा सुरक्षा", "mainText": "हम आपके डेटा की सुरक्षा करते हैं।", "sub1Title": "एन्क्रिप्शन", "sub1Text": "सभी डेटा एन्क्रिप्टेड है।", "sub2Title": "भंडारण", "sub2Text": "सुरक्षित क्लाउड स्टोरेज।", "sub3Title": "गोपनीयता", "sub3Text": "सख्त गोपनीयता। संपर्क: " },
            "section2": { "title": "बुनियादी ढांचा", "mainText": "सुरक्षित बुनियादी ढांचा।", "dataResidencyTitle": "डेटा रेजीडेंसी", "dataResidencyText": "स्थानीय नियमों का पालन।", "accessControlTitle": "एक्सेस कंट्रोल", "accessControlText": "सख्त नियंत्रण।" },
            "section3": { "title": "निषिद्ध सामग्री", "mainText": "सख्त वर्जित:", "prohibitedItems": ["मैलवेयर", "घृणास्पद भाषण", "अवैध सामग्री", "उत्पीड़न"], "violationWarning": "खाता निलंबित होगा।" },
            "section4": { "title": "अनुपालन", "sub1Title": "GDPR", "sub1Text": "GDPR अनुपालन।", "sub2Title": "SOC2", "sub2Text": "ऑडिट लॉग उपलब्ध।" },
            "section5": { "title": "रिपोर्टिंग", "text1": "भेद्यता रिपोर्ट करें।", "text2": "बग बाउंटी।", "text3": "admin@uwo24.com" },
            "section6": { "title": "जिम्मेदारी", "text1": "क्रेडेंशियल्स सुरक्षित रखें।", "text2": "2FA सक्षम करें।" },
            "section7": { "title": "थर्ड पार्टी", "text": "हम एकीकरण की समीक्षा करते हैं।" },
            "section8": { "title": "बौद्धिक संपदा", "license": "उपयोगकर्ता सामग्री।", "ownership": "प्लेटफ़ॉर्म कोड।", "transfer": "अधिकार नीति।" },
            "section9": { "title": "API सुरक्षा", "items": ["रेट लिमिट", "API की", "HTTPS"] },
            "section10": { "title": "निगरानी", "text": "24/7 निगरानी।" },
            "section11": { "title": "संपर्क", "text": "ईमेल करें " },
            "section12": { "title": "आपातकालीन", "mainText": "सुरक्षा उल्लंघन:", "reportButton": "ईमेल", "reportButtonText": "रिपोर्ट", "supportButton": "कॉल" }
        }
    },
    "bengali": {
        "policies": { "gotIt": "বুঝেছি" },
        "securityGuidelines": {
            "pageTitle": "নিরাপত্তা নির্দেশিকা", "lastUpdated": "আপডেট: ফেব্রুয়ারি ২০২৬", "intro": "আমরা নিরাপত্তাকে গুরুত্ব দিই।",
            "legalSummaryTitle": "আইনি সারাংশ", "legalSummaryText": "নিরাপত্তা মান সম্মত হন।",
            "section1": { "title": "ডেটা সুরক্ষা", "mainText": "আমরা ডেটা রক্ষা করি।", "sub1Title": "এনক্রিপশন", "sub1Text": "এন্ড-টু-এন্ড এনক্রিপশন।", "sub2Title": "স্টোরেজ", "sub2Text": "নিরাপদ স্টোরেজ।", "sub3Title": "গোপনীয়তা", "sub3Text": "কঠোর গোপনীয়তা। যোগাযোগ: " },
            "section2": { "title": "অবকাঠামো", "mainText": "নিরাপদ অবকাঠামো।", "dataResidencyTitle": "ডেটা রেসিডেন্সি", "dataResidencyText": "স্থানীয় প্রবিধান।", "accessControlTitle": "অ্যাক্সেস", "accessControlText": "কঠোর নিয়ন্ত্রণ।" },
            "section3": { "title": "নিষিদ্ধ", "mainText": "নিষিদ্ধ বিষয়বস্তু:", "prohibitedItems": ["ম্যালওয়্যার", "ঘৃণাসূচক", "অবৈধ", "হয়রানি"], "violationWarning": "অ্যাকাউন্ট স্থগিত।" },
            "section4": { "title": "সম্মতি", "sub1Title": "GDPR", "sub1Text": "GDPR অনুগত।", "sub2Title": "SOC2", "sub2Text": "অডিট লগ।" },
            "section5": { "title": "রিপোর্টিং", "text1": "রিপোর্ট করুন।", "text2": "বাগ বাউন্টি।", "text3": "admin@uwo24.com" },
            "section6": { "title": "দায়িত্ব", "text1": "পাসওয়ার্ড রাখুন।", "text2": "2FA চালু করুন।" },
            "section7": { "title": "তৃতীয় পক্ষ", "text": "ইন্টিগ্রেশন পর্যালোচনা।" },
            "section8": { "title": "মেধা সম্পত্তি", "license": "ব্যবহারকারী সামগ্রী।", "ownership": "প্লাটফর্ম কোড।", "transfer": "অধিকার।" },
            "section9": { "title": "API", "items": ["রেট লিমিট", "API কি", "HTTPS"] },
            "section10": { "title": "মনিটরিং", "text": "২৪/৭ মনিটরিং।" },
            "section11": { "title": "যোগাযোগ", "text": "ইমেল: " },
            "section12": { "title": "জরুরী", "mainText": "লঙ্ঘন রিপোর্ট:", "reportButton": "ইমেল", "reportButtonText": "রিপোর্ট", "supportButton": "কল" }
        }
    },
    "tamil": {
        "policies": { "gotIt": "புரிந்தது" },
        "securityGuidelines": {
            "section6": { "title": "பயனர் பொறுப்பு", "text1": "சான்றுகளை பாதுகாப்பாக வைக்கவும்.", "text2": "2FA ஐ இயக்கவும்." },
            "section7": { "title": "மூன்றாம் தரப்பு", "text": "நாங்கள் ஒருங்கிணைப்புகளை மதிப்பாய்வு செய்கிறோம்." },
            "section8": { "title": "அறிவுசார் சொத்து", "license": "பயனர் உள்ளடக்கம்.", "ownership": "தளத்தின் குறியீடு.", "transfer": "உரிமை கொள்கை." },
            "section9": { "title": "API பாதுகாப்பு", "items": ["விகித வரம்பு", "API சாவிகள்", "HTTPS"] },
            "section10": { "title": "கண்காணிப்பு", "text": "24/7 கண்காணிப்பு." },
            "section11": { "title": "தொடர்பு", "text": "மின்னஞ்சல் " },
            "section12": { "title": "அவசரம்", "mainText": "பாதுகாப்பு மீறல்:", "reportButton": "மின்னஞ்சல்", "reportButtonText": "புகாரளி", "supportButton": "அழைப்பு" }
        }
    },
    "telugu": {
        "policies": { "gotIt": "అర్థమైంది" },
        "securityGuidelines": {
            "pageTitle": "భద్రతా మార్గదర్శకాలు", "lastUpdated": "చివరిగా నవీకరించబడింది: ఫిబ్రవరి 2026", "intro": "A-Series లో, మేము భద్రతను తీవ్రంగా పరిగణిస్తాము.",
            "legalSummaryTitle": "చట్టపరమైన సారాంశం", "legalSummaryText": "మా ప్లాట్‌ఫారమ్‌ను ఉపయోగించడం ద్వారా, మీరు ఈ భద్రతా ప్రమాణాలకు అంగీకరిస్తున్నారు.",
            "section1": { "title": "డేటా రక్షణ", "mainText": "మేము మీ డేటాను రక్షించడానికి చర్యలు తీసుకుంటాము.", "sub1Title": "ఎన్క్రిప్షన్", "sub1Text": "ఎండ్-టు-ఎండ్ ఎన్క్రిప్షన్.", "sub2Title": "నిల్వ", "sub2Text": "సురక్షిత క్లౌడ్ నిల్వ.", "sub3Title": "గోప్యత", "sub3Text": "కఠినమైన గోప్యతా నియంత్రణలు. సంప్రదించండి: " },
            "section2": { "title": "మౌలిక సదుపాయాలు", "mainText": "మా మౌలిక సదుపాయాలు సురక్షితం.", "dataResidencyTitle": "డేటా రెసిడెన్సీ", "dataResidencyText": "స్థానిక నిబంధనల ప్రకారం డేటా నిల్వ.", "accessControlTitle": "యాక్సెస్ కంట్రోల్", "accessControlText": "కఠినమైన యాక్సెస్ నియంత్రణ." },
            "section3": { "title": "నిషేధిత కంటెంట్", "mainText": "నిషేధించబడినవి:", "prohibitedItems": ["మాల్‌వేర్", "విద్వేషపూరిత ప్రసంగం", "చట్టవిరుద్ధ కంటెంట్", "వేధింపులు"], "violationWarning": "ఖాతా తక్షణమే సస్పెండ్ చేయబడుతుంది." },
            "section4": { "title": "వర్తింపు", "sub1Title": "GDPR", "sub1Text": "GDPR కంప్లైంట్.", "sub2Title": "SOC2", "sub2Text": "ఆడిట్ లాగ్స్ అందుబాటులో ఉన్నాయి." },
            "section5": { "title": "రిపోర్టింగ్", "text1": "లోపాన్ని నివేదించండి.", "text2": "బగ్ బౌంటీ ప్రోగ్రామ్.", "text3": "admin@uwo24.com" },
            "section6": { "title": "బాధ్యత", "text1": "క్రెడెన్షియల్స్ భద్రంగా ఉంచండి.", "text2": "2FA ను ప్రారంభించండి." },
            "section12": { "title": "అత్యవసర", "mainText": "భద్రతా ఉల్లంఘన:", "reportButton": "ఇమెయిల్", "reportButtonText": "నివేదించండి", "supportButton": "కాల్" }
        }
    },
    "marathi": {
        "policies": { "gotIt": "समजले" },
        "securityGuidelines": {
            "pageTitle": "सुरक्षा मार्गदर्शक तत्त्वे", "lastUpdated": "अंतिम अपडेट: फेब्रुवारी 2026", "intro": "A-Series मध्ये, आम्ही सुरक्षिततेला गांभीर्याने घेतो.",
            "legalSummaryTitle": "कायदेशीर सारांश", "legalSummaryText": "आमचे प्लॅटफॉर्म वापरून, तुम्ही या सुरक्षा मानकांचे पालन करण्यास सहमती देता.",
            "section1": { "title": "डेटा संरक्षण", "mainText": "आम्ही तुमचा डेटा सुरक्षित करण्यासाठी उपाय करतो.", "sub1Title": "एनक्रिप्शन", "sub1Text": "एंड-टू-एंड एनक्रिप्शन.", "sub2Title": "स्टोरेज", "sub2Text": "सुरक्षित क्लाउड स्टोरेज.", "sub3Title": "गोपनीयता", "sub3Text": "कडक गोपनीयता नियंत्रणे. संपर्क: " },
            "section3": { "title": "प्रतिबंधित सामग्री", "mainText": "प्रतिबंधित:", "prohibitedItems": ["मॅलवेअर", "द्वेषयुक्त भाषण", "बेकायदेशीर", "छळ"], "violationWarning": "खाते निलंबित केले जाईल." },
            "section12": { "title": "आपत्कालीन", "mainText": "सुरक्षा उल्लंघन:", "reportButton": "ईमेल", "reportButtonText": "रिपोर्ट करा", "supportButton": "कॉल" }
        }
    },
    "gujarati": {
        "policies": { "gotIt": "સમજાયું" },
        "securityGuidelines": {
            "pageTitle": "સુરક્ષા માર્ગદર્શિકા", "lastUpdated": "છેલ્લું અપડેટ: ફેબ્રુઆરી 2026", "intro": "A-Series માં, અમે સુરક્ષાને ગંભીરતાથી લઈએ છીએ.",
            "legalSummaryTitle": "કાયદાકીય સારાંશ", "legalSummaryText": "અમારા પ્લેટફોર્મના ઉપયોગથી તમે આ સુરક્ષા ધોરણો સાથે સંમત થાઓ છો.",
            "section1": { "title": "ડેટા પ્રોટેક્શન", "mainText": "અમે તમારા ડેટાને સુરક્ષિત રાખીએ છીએ.", "sub1Title": "એન્ક્રિપ્શન", "sub1Text": "એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન.", "sub2Title": "સ્ટોરેજ", "sub2Text": "સુરક્ષિત ક્લાઉડ સ્ટોરેજ.", "sub3Title": "ગોપનીયતા", "sub3Text": "કડક ગોપનીયતા નિયંત્રણો." },
            "section3": { "title": "પ્રતિબંધિત સામગ્રી", "mainText": "પ્રતિબંધિત:", "prohibitedItems": ["માલવેર", "દ્વેષપૂર્ણ ભાષણ", "ગેરકાયદેસર", "પજવણી"], "violationWarning": "એકાઉન્ટ સસ્પેન્ડ કરવામાં આવશે." },
            "section12": { "title": "ઇમરજન્સી", "mainText": "સુરક્ષા ભંગ:", "reportButton": "ઇમેઇલ", "reportButtonText": "રિપોર્ટ કરો", "supportButton": "કૉલ" }
        }
    },
    "french": {
        "policies": { "gotIt": "Compris" },
        "securityGuidelines": {
            "pageTitle": "Directives de sécurité", "lastUpdated": "Mise à jour : Février 2026", "intro": "Chez A-Series, nous prenons la sécurité au sérieux.",
            "legalSummaryTitle": "Résumé juridique", "legalSummaryText": "En utilisant notre plateforme, vous acceptez ces normes de sécurité.",
            "section1": { "title": "Protection des données", "mainText": "Nous protégeons vos données.", "sub1Title": "Chiffrement", "sub1Text": "Chiffrement de bout en bout.", "sub2Title": "Stockage", "sub2Text": "Stockage cloud sécurisé.", "sub3Title": "Confidentialité", "sub3Text": "Contrôles stricts. Contact : " },
            "section3": { "title": "Contenu interdit", "mainText": "Interdit :", "prohibitedItems": ["Malware", "Discours haineux", "Illégal", "Harcèlement"], "violationWarning": "Le compte sera suspendu." },
            "section12": { "title": "Urgence", "mainText": "Violation de sécurité :", "reportButton": "Email", "reportButtonText": "Signaler", "supportButton": "Appel" }
        }
    },
    "spanish": {
        "policies": { "gotIt": "Entendido" },
        "securityGuidelines": {
            "pageTitle": "Pautas de seguridad", "lastUpdated": "Actualizado: Febrero 2026", "intro": "En A-Series, nos tomamos la seguridad en serio.",
            "legalSummaryTitle": "Resumen legal", "legalSummaryText": "Al usar nuestra plataforma, acepta estos estándares de seguridad.",
            "section1": { "title": "Protección de datos", "mainText": "Protegemos sus datos.", "sub1Title": "Cifrado", "sub1Text": "Cifrado de extremo a extremo.", "sub2Title": "Almacenamiento", "sub2Text": "Almacenamiento seguro en la nube.", "sub3Title": "Privacidad", "sub3Text": "Controles estrictos. Contacto: " },
            "section3": { "title": "Contenido prohibido", "mainText": "Prohibido:", "prohibitedItems": ["Malware", "Discurso de odio", "Ilegal", "Acoso"], "violationWarning": "La cuenta será suspendida." },
            "section12": { "title": "Emergencia", "mainText": "Violación de seguridad:", "reportButton": "Correo", "reportButtonText": "Reportar", "supportButton": "Llamar" }
        }
    },
    "arabic": {
        "policies": { "gotIt": "فهمت" },
        "securityGuidelines": {
            "pageTitle": "إرشادات الأمان", "lastUpdated": "آخر تحديث: فبراير 2026", "intro": "في A-Series، نأخذ الأمان على محمل الجد.",
            "legalSummaryTitle": "الملخص القانوني", "legalSummaryText": "باستخدام منصتنا، فإنك توافق على معايير الأمان هذه.",
            "section1": { "title": "حماية البيانات", "mainText": "نحن نحمي بياناتك.", "sub1Title": "التشفير", "sub1Text": "تشفير من طرف إلى طرف.", "sub2Title": "التخزين", "sub2Text": "تخزين سحابي آمن.", "sub3Title": "الخصوصية", "sub3Text": "ضوابط خصوصية صارمة. اتصل: " },
            "section3": { "title": "المحتوى المحظور", "mainText": "محتوى محظور:", "prohibitedItems": ["برامج ضارة", "خطاب كراهية", "غير قانوني", "مضايقة"], "violationWarning": "سيتم تعليق الحساب." },
            "section12": { "title": "طوارئ", "mainText": "خرق أمني:", "reportButton": "بريد إلكتروني", "reportButtonText": "إبلاغ", "supportButton": "اتصال" }
        }
    }
};

Object.keys(translations).forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const tx = translations[lang];

            // Deep merge policies
            if (!content.landing) content.landing = {};
            if (!content.landing.policies) content.landing.policies = {};
            Object.assign(content.landing.policies, tx.policies);

            // Merge Security Guidelines if present
            if (tx.securityGuidelines) {
                if (!content.landing.securityGuidelines) content.landing.securityGuidelines = {};

                // Helper for deep merge
                const mergeDeep = (target, source) => {
                    for (const key in source) {
                        if (source[key] instanceof Object && key in target) {
                            Object.assign(source[key], mergeDeep(target[key], source[key]));
                        }
                    }
                    Object.assign(target || {}, source);
                    return target;
                };
                mergeDeep(content.landing.securityGuidelines, tx.securityGuidelines);
            }

            fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
            console.log(`Updated policies/security in ${lang}.json`);
        } catch (e) {
            console.error(`Error updating ${lang}.json`, e);
        }
    }
});

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

// Define the 4 new FAQs text for all languages
const translations = {
    "hindi": [
        { q: "मैं अपनी बिलिंग जानकारी कैसे अपडेट करूं?", a: "आप सेटिंग्स > बिलिंग और भुगतान अनुभाग में अपनी भुगतान विधि और बिलिंग विवरण अपडेट कर सकते हैं।" },
        { q: "क्या मैं अपना चैट इतिहास निर्यात कर सकता हूँ?", a: "हाँ, आप चैट इंटरफ़ेस में निर्यात बटन का उपयोग करके व्यक्तिगत चैट को PDF या Word दस्तावेज़ों के रूप में निर्यात कर सकते हैं।" },
        { q: "A-Series किन भाषाओं का समर्थन करती है?", a: "हम वर्तमान में अंग्रेजी, हिंदी, स्पेनिश, फ्रेंच, अरबी और कई भारतीय क्षेत्रीय भाषाओं सहित 10 प्रमुख भाषाओं का समर्थन करते हैं।" },
        { q: "मैं किसी बग या समस्या की रिपोर्ट कैसे करूं?", a: "यदि आपको कोई समस्या आती है, तो कृपया 'हमसे संपर्क करें' फ़ॉर्म का उपयोग करें या हमारी सहायता टीम को सीधे admin@uwo24.com पर ईमेल करें।" }
    ],
    "bengali": [
        { q: "আমি কীভাবে আমার বিলিং তথ্য আপডেট করব?", a: "আপনি সেটিংস > বিলিং এবং পেমেন্ট বিভাগে আপনার পেমেন্ট পদ্ধতি এবং বিলিং বিশদ আপডেট করতে পারেন।" },
        { q: "আমি কি আমার চ্যাট ইতিহাস রপ্তানি করতে পারি?", a: "হ্যাঁ, আপনি চ্যাট ইন্টারফেসে রপ্তানি বোতাম ব্যবহার করে পৃথক চ্যাটগুলি পিডিএফ বা ওয়ার্ড নথি হিসাবে রপ্তানি করতে পারেন।" },
        { q: "A-Series কোন ভাষা সমর্থন করে?", a: "আমরা বর্তমানে ইংরেজি, হিন্দি, স্প্যানিশ, ফ্রেঞ্চ, আরবি এবং বিভিন্ন ভারতীয় আঞ্চলিক ভাষা সহ ১০টি প্রধান ভাষা সমর্থন করি।" },
        { q: "আমি কীভাবে কোনো বাগ বা সমস্যার রিপোর্ট করব?", a: "আপনি যদি কোনো সমস্যার সম্মুখীন হন, অনুগ্রহ করে 'আমাদের সাথে যোগাযোগ করুন' ফর্মটি ব্যবহার করুন বা আমাদের সহায়তা দলকে সরাসরি admin@uwo24.com এ ইমেল করুন।" }
    ],
    "tamil": [
        { q: "எனது பில்லிங் தகவலை எவ்வாறு புதுப்பிப்பது?", a: "அமைப்புகள் > பில்லிங் & கொடுப்பனவுகள் பிரிவில் உங்கள் கட்டண முறை மற்றும் பில்லிங் விவரங்களைப் புதுப்பிக்கலாம்." },
        { q: "எனது அரட்டை வரலாற்றை ஏற்றுமதி செய்ய முடியுமா?", a: "ஆம், அரட்டை இடைமுகத்தில் உள்ள ஏற்றுமதி பொத்தானைப் பயன்படுத்தி தனிப்பட்ட அரட்டைகளை PDF அல்லது Word ஆவணங்களாக ஏற்றுமதி செய்யலாம்." },
        { q: "A-Series எந்த மொழிகளை ஆதரிக்கிறது?", a: "நாங்கள் தற்போது ஆங்கிலம், இந்தி, ஸ்பானிஷ், பிரஞ்சு, அரபு மற்றும் பல இந்திய பிராந்திய மொழிகள் உட்பட 10 முக்கிய மொழிகளை ஆதரிக்கிறோம்." },
        { q: "பிழை அல்லது சிக்கலைப் புகாரளிப்பது எப்படி?", a: "நீங்கள் ஏதேனும் சிக்கல்களைச் சந்தித்தால், 'எங்களைத் தொடர்பு கொள்ளுங்கள்' படிவத்தைப் பயன்படுத்தவும் அல்லது admin@uwo24.com இல் எங்கள் ஆதரவுக் குழுவிற்கு நேரடியாக மின்னஞ்சல் செய்யவும்." }
    ],
    "telugu": [
        { q: "నా బిల్లింగ్ సమాచారాన్ని నేను ఎలా అప్‌డేట్ చేయాలి?", a: "మీరు సెట్టింగ్‌లు > బిల్లింగ్ & చెల్లింపులు విభాగంలో మీ చెల్లింపు పద్ధతి మరియు బిల్లింగ్ వివరాలను అప్‌డేట్ చేయవచ్చు." },
        { q: "నేను నా చాట్ చరిత్రను ఎగుమతి చేయవచ్చా?", a: "అవును, మీరు చాట్ ఇంటర్‌ఫేస్‌లోని ఎగుమతి బటన్‌ను ఉపయోగించి వ్యక్తిగత చాట్‌లను PDF లేదా Word పత్రాలుగా ఎగుమతి చేయవచ్చు." },
        { q: "A-Series ఏ భాషలకు మద్దతు ఇస్తుంది?", a: "మేము ప్రస్తుతం ఇంగ్లీష్, హిందీ, స్పానిష్, ఫ్రెంచ్, అరబిక్ మరియు అనేక భారతీయ ప్రాంతీయ భాషలతో సహా 10 ప్రధాన భాషలకు మద్దతు ఇస్తున్నాము." },
        { q: "నేను బగ్ లేదా సమస్యను ఎలా నివేదించాలి?", a: "మీరు ఏవైనా సమస్యలను ఎదుర్కొంటే, దయచేసి 'మమ్మల్ని సంప్రదించండి' ఫారమ్‌ను ఉపయోగించండి లేదా మా మద్దతు బృందానికి నేరుగా admin@uwo24.com లో ఇమెయిల్ చేయండి." }
    ],
    "marathi": [
        { q: "मी माझी बिलिंग माहिती कशी अपडेट करू?", a: "तुम्ही सेटिंग्ज > बिलिंग आणि पेमेंट्स विभागात तुमची पेमेंट पद्धत आणि बिलिंग तपशील अपडेट करू शकता." },
        { q: "मी माझा चॅट इतिहास एक्सपोर्ट करू शकतो का?", a: "होय, तुम्ही चॅट इंटरफेसवरील एक्सपोर्ट बटण वापरून वैयक्तिक चॅट्स PDF किंवा Word दस्तऐवज म्हणून एक्सपोर्ट करू शकता." },
        { q: "A-Series कोणत्या भाषांना सपोर्ट करते?", a: "आम्ही सध्या इंग्रजी, हिंदी, स्पॅनिश, फ्रेंच, अरबी आणि अनेक भारतीय प्रादेशिक भाषांसह 10 प्रमुख भाषांचे समर्थन करतो." },
        { q: "मी बग किंवा समस्येची तक्रार कशी करू?", a: "तुम्हाला काही समस्या आल्यास, कृपया 'संपर्क साधा' फॉर्म वापरा किंवा आमच्या सपोर्ट टीमला थेट admin@uwo24.com वर ईमेल करा." }
    ],
    "gujarati": [
        { q: "હું મારી બિલિંગ માહિતી કેવી રીતે અપડેટ કરી શકું?", a: "તમે સેટિંગ્સ > બિલિંગ અને ચૂકવણી વિભાગમાં તમારી ચુકવણી પદ્ધતિ અને બિલિંગ વિગતો અપડેટ કરી શકો છો." },
        { q: "શું હું મારો ચેટ ઇતિહાસ નિકાસ કરી શકું?", a: "હા, તમે ચેટ ઇન્ટરફેસમાં નિકાસ બટનનો ઉપયોગ કરીને વ્યક્તિગત ચેટ્સને PDF અથવા Word દસ્તાવેજો તરીકે નિકાસ કરી શકો છો." },
        { q: "A-Series કઈ ભાષાઓને સપોર્ટ કરે છે?", a: "અમે હાલમાં અંગ્રેજી, હિન્દી, સ્પેનિશ, ફ્રેન્ચ, અરબી અને કેટલીક ભારતીય પ્રાદેશિક ભાષાઓ સહિત 10 મુખ્ય ભાષાઓને સમર્થન આપીએ છીએ." },
        { q: "હું ભૂલ અથવા સમસ્યાની જાણ કેવી રીતે કરી શકું?", a: "જો તમને કોઈ સમસ્યા આવે, તો કૃપા કરીને 'અમારો સંપર્ક કરો' ફોર્મનો ઉપયોગ કરો અથવા અમારી સપોર્ટ ટીમનો સીધો admin@uwo24.com પર સંપર્ક કરો." }
    ],
    "french": [
        { q: "Comment mettre à jour mes informations de facturation ?", a: "Vous pouvez mettre à jour votre mode de paiement et vos coordonnées de facturation dans la section Paramètres > Facturation et paiements." },
        { q: "Puis-je exporter mon historique de discussion ?", a: "Oui, vous pouvez exporter des discussions individuelles au format PDF ou Word à l'aide du bouton d'exportation dans l'interface de discussion." },
        { q: "Quelles langues A-Series prend-il en charge ?", a: "Nous prenons actuellement en charge 10 langues principales, dont l'anglais, l'hindi, l'espagnol, le français, l'arabe et plusieurs langues régionales indiennes." },
        { q: "Comment signaler un bug ou un problème ?", a: "Si vous rencontrez des problèmes, veuillez utiliser le formulaire « Contactez-nous » ou envoyer un e-mail directement à notre équipe d'assistance à admin@uwo24.com." }
    ],
    "spanish": [
        { q: "¿Cómo actualizo mi información de facturación?", a: "Puede actualizar su método de pago y detalles de facturación en la sección Configuración > Facturación y pagos." },
        { q: "¿Puedo exportar mi historial de chat?", a: "Sí, puede exportar chats individuales como documentos PDF o Word utilizando el botón de exportación en la interfaz de chat." },
        { q: "¿Qué idiomas admite A-Series?", a: "Actualmente admitimos 10 idiomas principales, incluidos inglés, hindi, español, francés, árabe y varios idiomas regionales indios." },
        { q: "¿Cómo informo un error o problema?", a: "Si encuentra algún problema, utilice el formulario 'Contáctenos' o envíe un correo electrónico a nuestro equipo de soporte directamente a admin@uwo24.com." }
    ],
    "arabic": [
        { q: "كيف أقوم بتحديث معلومات الفوترة الخاصة بي؟", a: "يمكنك تحديث طريقة الدفع وتفاصيل الفوترة في قسم الإعدادات > الفوترة والمدفوعات." },
        { q: "هل يمكنني تصدير سجل الدردشة الخاص بي؟", a: "نعم، يمكنك تصدير محادثات فردية كمستندات PDF أو Word باستخدام زر التصدير في واجهة الدردشة." },
        { q: "ما هي اللغات التي تدعمها A-Series؟", a: "نحن ندعم حاليًا 10 لغات رئيسية بما في ذلك الإنجليزية والهندية والإسبانية والفرنسية والعربية والعديد من اللغات الإقليمية الهندية." },
        { q: "كيف يمكنني الإبلاغ عن خطأ أو مشكلة؟", a: "إذا واجهت أي مشاكل، يرجى استخدام نموذج 'اتصل بنا' أو إرسال بريد إلكتروني إلى فريق الدعم لدينا مباشرة على admin@uwo24.com." }
    ]
};

Object.keys(translations).forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (content.faqHelp && Array.isArray(content.faqHelp.faqs)) {
                // Ensure we have at least 7 items (3 old + 4 new)
                // We assume the last 4 items are the ones we added in the previous step (in English)
                // We will overwrite them with the translated versions if they match the English structure

                const newFaqs = translations[lang];

                // Keep the first 3 (original)
                const firstThree = content.faqHelp.faqs.slice(0, 3);

                // Map the new 4 items (converting keys to localized text)
                const localizedNewFaqs = newFaqs.map(item => ({
                    question: item.q,
                    answer: item.a
                }));

                // Reassemble
                content.faqHelp.faqs = [...firstThree, ...localizedNewFaqs];

                fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
                console.log(`Translated 4 FAQs in ${lang}.json`);
            }
        } catch (e) {
            console.error(`Error processing ${lang}.json`, e);
        }
    }
});

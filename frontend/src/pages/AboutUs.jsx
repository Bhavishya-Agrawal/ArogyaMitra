import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const [lang, setLang] = React.useState("en");

  const content = {
    en: {
      aboutTitle: "About Ayushman Bharat",
      aboutText:
        "Ayushman Bharat is a flagship health insurance scheme by the Government of India, providing cashless treatment of up to ₹5 lakh per family per year.",
      applyTitle: "Steps to Apply for Ayushman Card",
      useTitle: "How to Use Ayushman Card for Treatment",
      steps: [
        { title: "Check Eligibility", desc: "Visit the official Ayushman Bharat website and verify your family eligibility using your mobile number or ration card." },
        { title: "Gather Documents", desc: "Aadhaar Card, Mobile Number, Address Proof, and Family Identification Documents." },
        { title: "Apply Online", desc: "Fill the Ayushman Card application form online through the PMJAY portal or a nearby CSC center." },
        { title: "Verification", desc: "Your details will be verified digitally. After approval, your Ayushman Card will be generated." },
        { title: "Download Card", desc: "Download the e-card from the portal or get a printed version from CSC." },
      ],
      usage: [
        { title: "Visit Empaneled Hospital", desc: "Go to any Ayushman Bharat registered hospital (government or private)." },
        { title: "Show Ayushman Card", desc: "Provide your Ayushman card or Aadhaar number at the hospital helpdesk." },
        { title: "Cashless Treatment", desc: "Hospital will verify your details and provide cashless treatment." },
        { title: "Post-Treatment Docs", desc: "All treatment costs are covered and you receive a discharge summary." },
      ],
    },

    hi: {
      aboutTitle: "आयुष्मान भारत के बारे में",
      aboutText:
        "आयुष्मान भारत भारत सरकार की प्रमुख स्वास्थ्य बीमा योजना है, जो प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलैस इलाज प्रदान करती है।",
      applyTitle: "आयुष्मान कार्ड के लिए आवेदन करने के चरण",
      useTitle: "आयुष्मान कार्ड का उपयोग कैसे करें",
      steps: [
        { title: "पात्रता जांचें", desc: "आधिकारिक वेबसाइट पर जाएं और मोबाइल या राशन कार्ड से पात्रता जांचें।" },
        { title: "दस्तावेज़ तैयार करें", desc: "आधार, मोबाइल नंबर, पता प्रमाण और परिवार पहचान दस्तावेज।" },
        { title: "ऑनलाइन आवेदन करें", desc: "PMJAY पोर्टल या नजदीकी CSC केंद्र पर फॉर्म भरें।" },
        { title: "सत्यापन", desc: "डिजिटल सत्यापन के बाद कार्ड जनरेट होगा।" },
        { title: "कार्ड डाउनलोड करें", desc: "पोर्टल से ई-कार्ड डाउनलोड करें या CSC से प्राप्त करें।" },
      ],
      usage: [
        { title: "एम्पैनल्ड अस्पताल जाएं", desc: "किसी भी सूचीबद्ध सरकारी/निजी अस्पताल में जाएं।" },
        { title: "आयुष्मान कार्ड दिखाएं", desc: "हेल्पडेस्क पर कार्ड या आधार दिखाएं।" },
        { title: "कैशलैस इलाज", desc: "अस्पताल विवरण जांच कर कैशलैस इलाज देगा।" },
        { title: "इलाज के बाद दस्तावेज़", desc: "खर्च योजना के तहत कवर होते हैं और डिस्चार्ज सारांश मिलता है।" },
      ],
    },
  };

  return (
    <div className="w-full mt-10 min-h-screen bg-gray-50 flex flex-col items-center p-6">
      
      {/* Language Switch */}
      <div className="flex justify-end w-full max-w-4xl mb-4">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          {lang === "en" ? "हिंदी में देखें" : "View in English"}
        </button>
      </div>

      <div className="max-w-4xl w-full">

        {/* ABOUT */}
        <section className="mb-10 bg-white shadow-md rounded-2xl p-6 border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold mb-4">{content[lang].aboutTitle}</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{content[lang].aboutText}</p>
        </section>

        {/* APPLY PATHWAY */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">
            {content[lang].applyTitle}
          </h3>

          <div className="relative border-l-4 border-blue-500 ml-4">
            {content[lang].steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="mb-10 ml-6 group"
              >
                <motion.div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1" />
                
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    {index + 1}. {step.title}
                  </h4>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>

              </motion.div>
            ))}
          </div>
        </section>

        {/* USE PATHWAY */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-green-700 text-center">
            {content[lang].useTitle}
          </h3>

          <div className="relative border-l-4 border-green-500 ml-4">
            {content[lang].usage.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="mb-10 ml-6 group"
              >
                <motion.div className="absolute w-4 h-4 bg-green-600 rounded-full -left-2 top-1" />

                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
                >
                  <h4 className="text-xl font-semibold text-green-700 mb-2">
                    {index + 1}. {item.title}
                  </h4>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>

              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

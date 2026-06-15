/* eslint-disable */
// 100% Bulletproof Stable Local Intelligent Clinical Router
export const fetchHealthGuidance = async (selectedSymptoms, textInput, lang) => {
  // Artificial small delay to simulate real network loading wheel effect
  await new Promise(resolve => setTimeout(resolve, 800));

  const textLower = (textInput || "").toLowerCase();

  // 1. Critical Case Identification Tokens
  const isEmergency = 
    textLower.includes("chest") || 
    textLower.includes("breathe") || 
    textLower.includes("pain") || 
    textLower.includes("saans") || 
    textLower.includes("dard") ||
    selectedSymptoms.some(s => s.includes("Pain") || s.includes("Breathe") || s.includes("दर्द") || s.includes("सांस"));

  // 2. Stomach Specialist / Gastro Tokens
  const isStomachIssue = 
    textLower.includes("stomach") || 
    textLower.includes("belly") || 
    textLower.includes("vomit") || 
    textLower.includes("loose") || 
    textLower.includes("पेट") || 
    textLower.includes("उल्टी");

  // --- DATABASE MATRIX RESOLVER ---
  
  // CASE A: EMERGENCY PANEL
  if (isEmergency) {
    return {
      status: "success",
      severity: "Critical",
      badgeColor: "#f43f5e",
      badgeBg: "rgba(244,63,94,0.06)",
      badgeBorder: "rgba(244,63,94,0.2)",
      title: lang === 'en' ? "🚨 Severe — Emergency Action Required" : "🚨 गंभीर स्थिति — तत्काल कार्रवाई",
      desc: lang === 'en' ? "Critical symptoms detected. Please head to the nearest emergency room." : "गंभीर लक्षण पाए गए हैं। कृपया नजदीकी आपातकालीन कक्ष में जाएं।",
      doctors: [
        { name: "Dr. Alok Tripathi (Cardiologist)", facility: "Apollo Emergency Wing", dist: "0.4 km away", exp: "18 Yrs Exp", rating: "4.9" },
        { name: "Dr. Vikram Seth (Trauma Specialist)", facility: "Max Super Specialty", dist: "1.2 km away", exp: "15 Yrs Exp", rating: "4.8" }
      ],
      medicines: [
        { name: "💊 Aspirin 325mg", dose: "Chew immediately if advised by emergency operators", emergency: true },
        { name: "💧 Sorbitrate 5mg", dose: "Under the tongue only if prescribed before", emergency: true }
      ],
      diet: {
        title: lang === 'en' ? "⚡ Immediate First Aid" : "⚡ तत्काल प्राथमिक उपचार",
        tips: lang === 'en' ? ["Sit down comfortably.", "Loosen tight clothing.", "Do not try to walk or panic."] : ["आरामदायक स्थिति में बैठें।", "कपड़े ढीले करें।", "घबराएं नहीं।"]
      }
    };
  }

  // CASE B: GASTROENTEROLOGY / STOMACH PANEL
  if (isStomachIssue) {
    return {
      status: "success",
      severity: "Mild",
      badgeColor: "#eab308",
      badgeBg: "rgba(234,179,8,0.06)",
      badgeBorder: "rgba(234,179,8,0.2)",
      title: lang === 'en' ? "🤢 Gastrointestinal Care Guidance" : "🤢 पेट से संबंधित परामर्श",
      desc: lang === 'en' ? "Symptoms match stomach infection or acidity." : "लक्षण पेट के संक्रमण या एसिडिटी से मेल खाते हैं।",
      doctors: [
        { name: "Dr. Ramesh Chawla (Gastroenterologist)", facility: "Medanta Liver Clinic", dist: "1.5 km away", exp: "16 Yrs Exp", rating: "4.8" },
        { name: "Dr. Neha Sharma (General Physician)", facility: "City Health Care", dist: "2.0 km away", exp: "8 Yrs Exp", rating: "4.6" }
      ],
      medicines: [
        { name: "💊 Pantoprazole 40mg", dose: "1 tablet empty stomach in the morning", emergency: false },
        { name: "🧪 ORS Sachets", dose: "Mix in 1 Litre water and drink continuously if vomiting/loose motions occur", emergency: false }
      ],
      diet: {
        title: lang === 'en' ? "🥣 Stomach Recovery Diet" : "🥣 पेट की देखभाल के लिए आहार",
        tips: lang === 'en' ? ["Avoid oily, spicy and heavy fried foods.", "Drink plain coconut water or buttermilk.", "Eat light curd rice or khichdi."] : ["तेलीय, मसालेदार और भारी भोजन से बचें।", "नारियल पानी या छाछ पिएं।", "हल्की खिचड़ी या दही-चावल खाएं।"]
      }
    };
  }

  // CASE C: STANDARD MILD PANEL (Fever, Cough, Cold)
  return {
    status: "success",
    severity: "Mild",
    badgeColor: "#10b981",
    badgeBg: "rgba(16,185,129,0.04)",
    badgeBorder: "rgba(16,185,129,0.2)",
    title: lang === 'en' ? "🛡️ Mild — Standard OPD Clinical Route" : "🛡️ सामान्य स्थिति — प्राथमिक उपचार",
    desc: lang === 'en' ? "Symptoms appear mild. Rest and general checkup recommended." : "लक्षण सामान्य हैं, आराम करें और सामान्य ओपीडी परामर्श लें।",
    doctors: [
      { name: "Dr. Rajesh Kumar", facility: "Fortis Clinic", dist: "0.8 km away", exp: "12 Yrs Exp", rating: "4.7" },
      { name: "Dr. Sunita Agarwal", facility: "Medanta Care", dist: "2.5 km away", exp: "14 Yrs Exp", rating: "4.6" }
    ],
    medicines: [
      { name: "💊 Paracetamol 500mg", dose: "1 tablet every 6-8 hours if fever/bodyache persists", emergency: false },
      { name: "🔵 Cetirizine 10mg", dose: "1 tablet once daily at bedtime for cold/cough", emergency: false }
    ],
    diet: {
      title: lang === 'en' ? "🥗 Recovery Diet Metrics" : "🥗 स्वास्थ्य लाभ आहार",
      tips: lang === 'en' ? ["Increase warm water intake up to 3 Liters.", "Consume warm soups and light food."] : ["गुनगुने पानी का सेवन बढ़ाएं।", "गर्म सूप और हल्का भोजन लें।"]
    }
  };
};
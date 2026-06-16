/* eslint-disable */
import { useEffect, useState } from 'react';
import Pharmacy from './pages/Pharmacy';

// Dual-Language Comprehensive Dictionary for UI Labels
// स्थानीय भाषा और अंग्रेजी में अनुवाद के लिए व्यापक शब्दकोश ग्रिड
const DICT = {
  en: {
    brand: "AyuRoute AI",
    subBrand: "Your Digital Doctor & Smart Health Radar",
    tagline: "Speak or type your symptoms. Get precise data on nearby specialist clinics, pharmacies, and standard medical guides instantly.",
    micText: "Tap mic & speak symptoms",
    micListening: "🔴 Listening actively... Please speak now",
    inputPlaceholder: "Type symptoms (e.g., headache, chest pain, stomach gas, cough)...",
    categoryLabel: "Select Disease Category / बीमारी की श्रेणी चुनें",
    getGuidance: "Analyze Symptoms Now",
    errorText: "Please choose a symptom checkpoint or type your current condition first!",
    recommendedDocs: "👨‍⚕️ Nearest Specialist Doctors & Clinics (नज़दीकी विशेषज्ञ डॉक्टर)",
    suggestedMeds: "💊 Initial First-Aid & Generic Medicines (प्राथमिक उपचार और दवाएं)",
    suggestedDiet: "🥗 Dietary Guidelines & Precautions (परहेज और खान-पान)",
    disclaimer: "⚕️ Protocol Notice: This data is for informational guidance. In critical emergencies, please dial 108 or rush to the nearest emergency ward immediately.",
    loadingText: "Scanning dynamic medical grid for your location...",
    tableDocName: "Doctor Name",
    tableSpecialty: "Specialization",
    tableDistance: "Distance / Location",
    tableTiming: "Available Timings"
  },
  hi: {
    brand: "आयुRoute AI",
    subBrand: "आपका डिजिटल डॉक्टर और स्मार्ट हेल्थ रडार",
    tagline: "अपने लक्षण बोलकर या लिखकर बताएं। अपने आस-पास के विशेषज्ञ डॉक्टरों, क्लिनिक की दूरी और सही प्राथमिक उपचार की जानकारी तुरंत पाएं।",
    micText: "माइक दबाएं और बीमारी बताएं",
    micListening: "🔴 सिस्टम सुन रहा है... कृपया अपनी समस्या बोलें",
    inputPlaceholder: "लक्षण लिखें (जैसे: सिर दर्द, सीने में दर्द, पेट में गैस, खांसी)...",
    categoryLabel: "बीमारी की श्रेणी चुनें",
    getGuidance: "स्वास्थ्य गाइड की जांच करें",
    errorText: "कृपया पहले कोई लक्षण चुनें या अपनी स्थिति टाइप करें!",
    recommendedDocs: "👨‍⚕️ नज़दीकी विशेषज्ञ डॉक्टर और क्लिनिक (Nearest Specialists)",
    suggestedMeds: "💊 प्राथमिक उपचार और सामान्य दवाएं (First-Aid & Medicines)",
    suggestedDiet: "🥗 आवश्यक परहेज और खान-पान टिप्स (Dietary Guidelines)",
    disclaimer: "⚕️ आवश्यक सूचना: यह जानकारी केवल आपके मार्गदर्शन के लिए है। गंभीर आपातकाल की स्थिति में तुरंत 108 डायल करें या नज़दीकी अस्पताल जाएं।",
    loadingText: "आपके स्थान के अनुसार सही स्वास्थ्य जानकारी खोजी जा रही है...",
    tableDocName: "डॉक्टर का नाम",
    tableSpecialty: "विशेषज्ञता (Department)",
    tableDistance: "दूरी / क्लिनिक का पता",
    tableTiming: "मिलने का समय"
  }
};

function App() {
  const [lang, setLang] = useState('hi'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('triage'); 
  
  const [activeCategory, setActiveCategory] = useState('Emergency');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Authentication and Session state configuration node
  const [user, setUser] = useState(null); 
  const [authMode, setAuthMode] = useState('login'); 
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [gpsLocation, setGpsLocation] = useState("Kanpur Central Grid, Uttar Pradesh");

  // Emergency dispatch registry items
  const [ambStatus, setAmbStatus] = useState('idle');
  const [ambTime, setAmbTime] = useState(10);
  const [dispatchDetails, setDispatchDetails] = useState({ patientName: '', contactNo: '', deliveryAddress: '' });
  const [otpStep, setOtpStep] = useState(false); 
  const [otpInput, setOtpInput] = useState('');
  const [formError, setFormError] = useState('');
  
  // ⚡ LIVE SANDBOX STATE: Keeps track of the generated OTP to show as a popup overlay
  const [liveDemoAlert, setLiveDemoAlert] = useState(null);

  const t = DICT[lang];

  const CATEGORIES = [
    { id: 'Emergency', label: { en: 'Emergency (आपातकालीन)', hi: 'इमरजेंसी (आपातकालीन)' }, icon: '🚨' },
    { id: 'Neurology', label: { en: 'Head & Brain (मस्तिष्क/सिर)', hi: 'मस्तिष्क और सिर दर्द' }, icon: '🧠' },
    { id: 'Orthopedics', label: { en: 'Bones & Joints (हड्डी और जोड़)', hi: 'हड्डी और जोड़' }, icon: '🦴' },
    { id: 'Gastro', label: { en: 'Stomach & Gas (पेट की समस्या)', hi: 'पेट और गैस' }, icon: '🍕' },
    { id: 'Respiratory', label: { en: 'Cough & Cold (खांसी-जुकाम)', hi: 'खांसी और सांस' }, icon: '💨' }
  ];

  const SYMPTOMS_MAP = {
    Emergency: [
      { id: 'e1', name: { en: 'Severe Chest Pain', hi: 'सीने में तेज़ दर्द' } },
      { id: 'e2', name: { en: 'Severe Shortness of Breath', hi: 'सांस फूलना या सांस न आना' } }
    ],
    Neurology: [
      { id: 'n1', name: { en: 'Severe Migraine / Headache', hi: 'तेज़ आधा सिर दर्द (माइग्रेन)' } }
    ],
    Orthopedics: [
      { id: 'o1', name: { en: 'Severe Lower Back Stiffness', hi: 'कमर में भयंकर अकड़न/दर्द' } }
    ],
    Gastro: [
      { id: 'g1', name: { en: 'Acid Reflux / Heartburn', hi: 'पेट में जलन, गैस और खट्टी डकारें' } }
    ],
    Respiratory: [
      { id: 'r1', name: { en: 'Continuous Dry Cough', hi: 'लगातार सूखी खांसी' } }
    ]
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGpsLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Kanpur Region)`);
      });
    }
  }, []);

 const startSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("⚠️ Browser Error: Google Chrome use karein, ismein mic best chalta hai.");
    return;
  }
  
  const recognition = new SpeechRecognition();
  // Dono Hindi aur English mix ko pakadne ke liye configuration
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => { 
    setIsListening(true); 
  };
  
  recognition.onerror = (event) => { 
    console.error("Mic Error:", event.error);
    setIsListening(false); 
    if(event.error === 'not-allowed') {
      alert("🛑 Mic Permission is not allowed inyour browser please giveaccess to your browser.");
    }
  };
  
  recognition.onend = () => { 
    setIsListening(false); 
  };
  
  recognition.onresult = (event) => { 
    const speechToText = event.results[0][0].transcript;
    console.log("Suna hua text:", speechToText);
    setTextInput(speechToText); // Yeh input box mein text daal dega
  };

  try {
    recognition.start();
  } catch (e) {
    console.error(e);
  }
};
  const getClinicalData = (symptomKey) => {
    const database = {
      'Severe Chest Pain': {
        severity: "CRITICAL / गंभीर स्थिति 🚨", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)",
        doctors: [
          { name: "Dr. Alok Misra", type: "Senior Cardiologist (हृदय रोग विशेषज्ञ)", dist: "1.2 km | Swaroop Nagar, Kanpur", time: "24/7 Emergency Available" },
          { name: "Dr. S. K. Gupta", type: "Cardiovascular Surgeon (हार्ट सर्जन)", dist: "2.5 km | Civil Lines Medical Hub", time: "10:00 AM - 04:00 PM" }
        ],
        meds: ["Aspirin 325mg (Chew immediately to thin blood / चबाकर खाएं)", "Sorbitrate 5mg (Keep under tongue / जीभ के नीचे रखें)"],
        diet: ["❌ Strictly avoid solid food or heavy liquids immediately.", "Make the patient sit or lie down in a well-ventilated space immediately."]
      },
      'Severe Shortness of Breath': {
        severity: "HIGH RISK / तुरंत ध्यान दें 🚨", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)",
        doctors: [
          { name: "Dr. Ritesh Agarwal", type: "Pulmonologist (फेफड़ा व सांस रोग विशेषज्ञ)", dist: "1.8 km | Kakadeo Crossing, Kanpur", time: "09:00 AM - 02:00 PM" },
          { name: "Dr. Neha Sharma", type: "Critical Care Emergency Expert", dist: "3.0 km | Azad Nagar Grid", time: "24/7 Available" }
        ],
        meds: ["Asthalin Inhaler (Take 2 puffs immediately if prescribed)", "Budecort Respules (Administer nebulization if equipment is accessible)"],
        diet: ["Provide small sips of warm water only if fully conscious.", "❌ Keep away from cold environments, air conditioning, or dairy items."]
      },
      'Severe Migraine / Headache': {
        severity: "MODERATE / मध्यम", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)",
        doctors: [
          { name: "Dr. Amit Srivastava", type: "Consultant Neurologist (न्यूरोलॉजिस्ट)", dist: "2.1 km | Mall Road Medical Plaza", time: "11:00 AM - 06:00 PM" },
          { name: "Dr. Vikrant Kapoor", type: "Neuro Physician", dist: "4.2 km | Kidwai Nagar Hub", time: "04:00 PM - 08:00 PM" }
        ],
        meds: ["Paracetamol 650mg OR Naproxen 500mg (Post meals)", "Domperidone 10mg (If experiencing nausea or vomiting symptoms)"],
        diet: ["Consume adequate fluids, electrolyte water, or fresh ORS solution.", "Rest in a completely dark, silent, and noise-free room."]
      },
      'Severe Lower Back Stiffness': {
        severity: "MODERATE / मध्यम", color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)",
        doctors: [
          { name: "Dr. Sandeep Kumar", type: "Orthopedic Surgeon (हड्डी रोग विशेषज्ञ)", dist: "0.8 km | Gumti No. 5, Kanpur", time: "10:30 AM - 05:30 PM" },
          { name: "Dr. Megha Rai", type: "Chief Physiotherapist & Spine Expert", dist: "2.7 km | Lajpat Nagar Center", time: "08:00 AM - 12:00 PM" }
        ],
        meds: ["Etoricoxib 90mg (Anti-inflammatory response tablet)", "Volini Max Gel / Dynamic Heat Spray (Apply gently over the affected node)"],
        diet: ["Take warm milk infused with organic turmeric powder.", "❌ Avoid soft couches. Rest on a firm, flat orthopedic mattress or surface."]
      },
      'Acid Reflux / Heartburn': {
        severity: "LOW RISK / सामान्य समस्या", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)",
        doctors: [
          { name: "Dr. Rajesh Verma", type: "Gastroenterologist (पेट व रोग विशेषज्ञ)", dist: "1.5 km | Aryanagar Medical Street", time: "12:00 PM - 07:00 PM" },
          { name: "Dr. Ananya Dixit", type: "General Physician", dist: "0.5 km | Local Neighborhood Clinic", time: "09:00 AM - 09:00 PM" }
        ],
        meds: ["Pantoprazole 40mg (Take empty stomach with water)", "Digene / Mucaine Gel Antacid Liquid (2 spoonfuls for swift cooling action)"],
        diet: ["Drink half a cup of cold, toned, fat-free milk slowly.", "❌ Avoid citrus fruits, caffeinated items, tea, and heavy oil blends."]
      },
      'Continuous Dry Cough': {
        severity: "LOW RISK / सामान्य समस्या", color: "#eab308", bg: "rgba(234, 179, 8, 0.1)",
        doctors: [
          { name: "Dr. P. K. Singh", type: "ENT Specialist (कान, नाक, गला विशेषज्ञ)", dist: "2.0 km | Sharda Nagar Grid", time: "10:00 AM - 02:00 PM" },
          { name: "Dr. Suman Rao", type: "Family Health Physician", dist: "1.1 km | Near Green Park Hub", time: "11:00 AM - 08:00 PM" }
        ],
        meds: ["Dry Cough Antitussive Syrup (e.g., Ascoril D - 2 teaspoons)", "Levocetirizine 5mg (One tablet before sleeping phase)"],
        diet: ["Incorporate warm water steam with a few drops of organic ginger juice.", "❌ Avoid ice cream, cold carbonated drinks, or sour foods."]
      }
    };
    return database[symptomKey] || database['Continuous Dry Cough'];
  };

  const processTriageSubmit = () => {
    let searchTarget = textInput.trim().toLowerCase();
    let selectedNode = selectedSymptoms[0] || "";

    if (!selectedNode && !searchTarget) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    setIsLoading(true);
    setShowResults(false);

    setTimeout(() => {
      let finalKey = "Continuous Dry Cough"; 

      if (selectedNode) {
        if (selectedNode.includes("Chest") || selectedNode.includes("सीने")) finalKey = "Severe Chest Pain";
        else if (selectedNode.includes("Breath") || selectedNode.includes("सांस")) finalKey = "Severe Shortness of Breath";
        else if (selectedNode.includes("Migraine") || selectedNode.includes("सिर दर्द")) finalKey = "Severe Migraine / Headache";
        else if (selectedNode.includes("Stiffness") || selectedNode.includes("कमर")) finalKey = "Severe Lower Back Stiffness";
        else if (selectedNode.includes("Reflux") || selectedNode.includes("गैस")) finalKey = "Acid Reflux / Heartburn";
      } else {
        if (searchTarget.includes('chest') || searchTarget.includes('pain') || searchTarget.includes('seene') || searchTarget.includes('dard') || searchTarget.includes('dil')) {
          finalKey = "Severe Chest Pain";
        } else if (searchTarget.includes('breathe') || searchTarget.includes('saans') || searchTarget.includes('sans') || searchTarget.includes('asthma')) {
          finalKey = "Severe Shortness of Breath";
        } else if (searchTarget.includes('head') || searchTarget.includes('sir') || searchTarget.includes('migraine') || searchTarget.includes('maatha')) {
          finalKey = "Severe Migraine / Headache";
        } else if (searchTarget.includes('back') || searchTarget.includes('kamar') || searchTarget.includes('reeth') || searchTarget.includes('haddi')) {
          finalKey = "Severe Lower Back Stiffness";
        } else if (searchTarget.includes('acid') || searchTarget.includes('gas') || searchTarget.includes('pet') || searchTarget.includes('pait')) {
          finalKey = "Acid Reflux / Heartburn";
        }
      }

      setApiResponse(getClinicalData(finalKey));
      setShowResults(true);
      setIsLoading(false);
    }, 700);
  };

  const handleCustomAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? 'login' : 'signup';
    const bodyData = authMode === 'login' 
      ? { email: emailInput, password: passwordInput }
      : { name: fullNameInput, email: emailInput, password: passwordInput };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setDispatchDetails(prev => ({
          ...prev,
          patientName: data.user.name,
          deliveryAddress: `📍 Verified GPS: [${gpsLocation}]`
        }));
      } else { alert(data.message); }
    } catch (err) { alert("⚠️ Connection Error: Python backend server cluster is currently offline."); }
  };

  // Upgraded OTP Request Interceptor to grab data for the live sandbox popup
  const sendOtpRequest = async () => {
    const contactNo = dispatchDetails.contactNo.trim();
    if (!contactNo || !/^[6-9]\d{9}$/.test(contactNo)) {
      setFormError('⚠️ Structure Error: Please declare a 10-digit Indian Mobile sequence.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/orders/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactNo })
      });
      const data = await response.json();
      if (response.ok) {
        setFormError('');
        setOtpStep(true);
        // Setting backend's dynamic code inside popup component state
        setLiveDemoAlert(data.demoOtp); 
      } else { setFormError(data.message); }
    } catch { setFormError('Communication link interrupted.'); }
  };

  const verifyOtpAndBook = async () => {
    if(!otpInput.trim() || otpInput.length !== 4) {
      alert("🛑 Access Denied: 4-digit code format required.");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/orders/verify-and-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          patientName: dispatchDetails.patientName,
          contactNo: dispatchDetails.contactNo,
          deliveryAddress: dispatchDetails.deliveryAddress,
          otp: otpInput
        })
      });
      const data = await response.json();
      if (response.ok) {
        setFormError('');
        setOtpStep(false);
        setLiveDemoAlert(null); // Clearing toast popup upon correct login 
        setAmbStatus('booked');
        alert("✅ Security Cleared. Emergency Ambulance Grid Dispatched.");
        const interval = setInterval(() => {
          setAmbTime((prev) => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
        }, 1000);
      } else { alert(`🛑 Validation Alert: ${data.message}`); }
    } catch { alert("Network validation error occurred."); }
  };

  const handleSymptomToggle = (symptomName) => { 
    setSelectedSymptoms([symptomName]); 
    setTextInput(symptomName);
  };

  const theme = {
    bg: isDarkMode ? '#030712' : '#f8fafc',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textSub: isDarkMode ? '#94a3b8' : '#475569',
    textMuted: isDarkMode ? '#475569' : '#94a3b8',
    cardBg: isDarkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.98)',
    cardBorder: isDarkMode ? 'rgba(30,41,59,0.9)' : 'rgba(226,232,240,1)',
    innerInput: isDarkMode ? '#030712' : '#ffffff',
    innerInputText: isDarkMode ? '#ffffff' : '#0f172a',
    innerInputColor: isDarkMode ? '#1e293b' : '#cbd5e1',
  };

  const s = {
    container: { backgroundColor: theme.bg, color: theme.textSub, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: '80px' },
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: `1px solid ${theme.cardBorder}` },
    navBar: { display: 'flex', gap: '14px', margin: '24px 0' },
    navBtn: (isActive, color) => ({ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px', backgroundColor: isActive ? color : theme.cardBg, color: isActive ? '#fff' : theme.textSub, transition: 'all 0.2s ease' }),
    searchSection: { backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    micBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '160px' },
    micBtn: (listening) => ({ height: '64px', width: '64px', borderRadius: '50%', border: 'none', backgroundColor: listening ? '#ef4444' : '#06b6d4', color: '#fff', fontSize: '24px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(6,182,212,0.3)' }),
    inputContainer: { flex: 1, display: 'flex', alignItems: 'center', position: 'relative' },
    input: { width: '100%', backgroundColor: theme.innerInput, border: `1px solid ${theme.innerInputColor}`, borderRadius: '16px', padding: '18px 140px 18px 20px', fontSize: '16px', color: theme.innerInputText, outline: 'none', boxSizing: 'border-box' },
    inlineSearchBtn: { position: 'absolute', right: '12px', background: 'linear-gradient(135deg, #06b6d4, #10b981)', border: 'none', borderRadius: '12px', color: '#fff', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    catGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' },
    catBtn: (isActive) => ({ padding: '14px 24px', fontSize: '14px', borderRadius: '16px', cursor: 'pointer', border: isActive ? '2px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isActive ? 'rgba(6,182,212,0.15)' : theme.cardBg, color: isActive ? '#06b6d4' : theme.textSub, fontWeight: 700 }),
    symGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '30px' },
    symCard: (isSelected) => ({ padding: '20px', borderRadius: '16px', border: isSelected ? '2px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isSelected ? 'rgba(6,182,212,0.06)' : theme.cardBg, cursor: 'pointer', transition: 'all 0.15s ease' })
  };

  if (!user) {
    return (
      <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', width: '100%', maxWidth: '440px', borderRadius: '28px', padding: '40px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '48px' }}>🩺</span>
            <h2 style={{ fontSize: '28px', margin: '12px 0 6px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>AyuRoute Gateway</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Secure Healthcare Node Access</p>
          </div>
          <form onSubmit={handleCustomAuth}>
            {authMode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#cbd5e1' }}>Full Name / पूरा नाम</label>
                <input type="text" required placeholder="Chetan Sharma" value={fullNameInput} onChange={(e) => setFullNameInput(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #334155', background: '#030712', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#cbd5e1' }}>Email Address / ईमेल</label>
              <input type="email" required placeholder="name@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #334155', background: '#030712', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#cbd5e1' }}>Password / पासवर्ड</label>
              <input type="password" required placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #334155', background: '#030712', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', color: '#fff', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontSize: '16px' }}>
              {authMode === 'login' ? '🔑 Sign In / लॉगिन करें' : '🚀 Register / अकाउंट बनाएं'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginTop: '24px', marginBottom: 0 }}>
            {authMode === 'login' ? "Naya account chahiye? " : "Pehle se account hai? "}
            <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ color: '#06b6d4', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
              {authMode === 'login' ? 'Register Here' : 'Log In Here'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* ⚡ VISUAL OVERLAY CONTAINER FOR EVALUATORS AND RECRUITERS */}
      {liveDemoAlert && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', backgroundColor: '#1e1b4b', border: '2px solid #818cf8', borderRadius: '16px', padding: '20px', zIndex: 99999, width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', ease: 'all 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <strong style={{ color: '#fff', fontSize: '14px' }}>AyuRoute Live Sandbox Gateway</strong>
          </div>
          <p style={{ color: '#93c5fd', fontSize: '12px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
            [DEMO ACTIVE] Dynamic security token transmitted successfully to sandbox node pipeline.
          </p>
          <div style={{ background: '#312e81', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid #4338ca' }}>
            <span style={{ color: '#f43f5e', fontWeight: '900', fontSize: '22px', letterSpacing: '4px' }}>{liveDemoAlert}</span>
          </div>
          <p style={{ color: '#a5b4fc', fontSize: '10px', textAlign: 'right', margin: '6px 0 0 0' }}>Status: Production Emulation Online</p>
        </div>
      )}

      <div style={s.wrapper}>
        <header style={s.header}>
          <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
            <div style={{fontSize:'32px'}}>🩺</div>
            <div>
              <h1 style={{fontSize:'24px', color:theme.textMain, margin:0, fontWeight:'800'}}>{t.brand}</h1>
              <p style={{fontSize:'13px', color:theme.textMuted, margin:0}}>{t.subBrand}</p>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} style={{padding:'10px 16px', borderRadius:'12px', cursor:'pointer', fontWeight:'bold', border:'1px solid #06b6d4', background:'rgba(6,182,212,0.1)', color:'#06b6d4', fontSize:'13px'}}>
              {lang === 'hi' ? 'English Translate' : 'हिंदी में बदलें'}
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{padding:'10px 16px', borderRadius:'12px', cursor:'pointer', border:`1px solid ${theme.cardBorder}`, background:theme.cardBg, color:theme.textMain, fontSize:'13px'}}>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.12)', padding: '8px 14px', borderRadius: '12px', border: '1px solid #10b981' }}>
              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '800' }}>👤 {user.name}</span>
              <button onClick={() => setUser(null)} style={{ padding: '4px 8px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight:'bold' }}>Logout</button>
            </div>
          </div>
        </header>

        <div style={s.navBar}>
          <button onClick={() => setActiveTab('triage')} style={s.navBtn(activeTab === 'triage', '#06b6d4')}>🔬 AI Symptom Guide & Location Radar</button>
          <button onClick={() => setActiveTab('pharmacy')} style={s.navBtn(activeTab === 'pharmacy', '#10b981')}>💊 10-Min Pharmacy</button>
          <button onClick={() => setActiveTab('ambulance')} style={s.navBtn(activeTab === 'ambulance', '#ef4444')}>🚨 Ambulance Radar</button>
        </div>

        {activeTab === 'triage' && (
          <div>
            <p style={{ color: theme.textMain, fontSize: '16px', marginBottom: '24px', lineHeight:'1.5' }}>{t.tagline}</p>
            <div style={s.searchSection}>
              <div style={s.micBlock}>
                <button onClick={startSpeechRecognition} style={s.micBtn(isListening)}>{isListening ? '🛑' : '🎤'}</button>
                <span style={{fontSize:'12px', fontWeight:'bold', color: isListening ? '#ef4444' : theme.textMain}}>{isListening ? t.micListening : t.micText}</span>
              </div>
              <div style={s.inputContainer}>
                <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t.inputPlaceholder} style={s.input} />
                <button onClick={processTriageSubmit} style={s.inlineSearchBtn}>🔍 Search AI</button>
              </div>
            </div>

            <div style={{ marginBottom: '14px', fontWeight: 'bold', color: theme.textMain, fontSize:'15px' }}>{t.categoryLabel}</div>
            <div style={s.catGrid}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={s.catBtn(activeCategory === cat.id)}>{cat.icon} {cat.label[lang]}</button>
              ))}
            </div>

            <div style={s.symGrid}>
              {SYMPTOMS_MAP[activeCategory]?.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.name[lang]);
                return (
                  <div key={symptom.id} onClick={() => handleSymptomToggle(symptom.name[lang])} style={s.symCard(isSelected)}>
                    <span style={{fontSize:'15px', fontWeight:'700', color:theme.textMain}}>{symptom.name[lang]}</span>
                  </div>
                );
              })}
            </div>

            {showError && <div style={{ color: '#ef4444', marginBottom: '20px', fontWeight: 'bold' }}>{t.errorText}</div>}
            {isLoading && <div style={{ color: '#06b6d4', marginBottom: '20px', fontWeight:'bold' }}>{t.loadingText}</div>}

            {showResults && apiResponse && (
              <div style={{ backgroundColor: theme.cardBg, border: `2px solid ${apiResponse.color}`, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', boxShadow:'0 10px 25px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: theme.textMain, fontSize: '22px', fontWeight:'800' }}>📋 Real-Time Health Diagnostic Radar</h3>
                  <span style={{ padding: '8px 20px', borderRadius: '999px', background: apiResponse.bg, color: apiResponse.color, fontWeight: '900', fontSize: '14px', border: `1px solid ${apiResponse.color}` }}>{apiResponse.severity}</span>
                </div>
                
                <hr style={{ border: 'none', borderTop: `1px solid ${theme.cardBorder}`, margin: 0 }} />
                
                <div>
                  <h4 style={{ color: apiResponse.color, margin: '0 0 16px 0', fontSize: '18px', fontWeight:'700' }}>{t.recommendedDocs}</h4>
                  <div style={{ overflowX: 'auto', borderRadius: '14px', border: `1px solid ${theme.cardBorder}` }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: theme.innerInput }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${theme.cardBorder}`, background: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                          <th style={{ padding: '14px', color: theme.textMain, fontSize: '14px' }}>{t.tableDocName}</th>
                          <th style={{ padding: '14px', color: theme.textMain, fontSize: '14px' }}>{t.tableSpecialty}</th>
                          <th style={{ padding: '14px', color: theme.textMain, fontSize: '14px' }}>{t.tableDistance}</th>
                          <th style={{ padding: '14px', color: theme.textMain, fontSize: '14px' }}>{t.tableTiming}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiResponse.doctors.map((doc, idx) => (
                          <tr key={idx} style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                            <td style={{ padding: '14px', fontWeight: '700', color: theme.textMain }}>{doc.name}</td>
                            <td style={{ padding: '14px', color: theme.textSub }}>{doc.type}</td>
                            <td style={{ padding: '14px', color: '#06b6d4', fontWeight: '600' }}>📍 {doc.dist}</td>
                            <td style={{ padding: '14px', color: '#10b981', fontSize: '13px' }}>⏳ {doc.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ background: isDarkMode ? 'rgba(16,185,129,0.05)' : '#f0fdf4', padding: '24px', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <h4 style={{ color: '#10b981', margin: '0 0 14px 0', fontSize: '18px', fontWeight:'700' }}>{t.suggestedMeds}</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: theme.textMain, lineHeight: '1.8' }}>
                      {apiResponse.meds.map((med, idx) => <li key={idx} style={{fontWeight:'600'}}>{med}</li>)}
                    </ul>
                  </div>

                  <div style={{ background: isDarkMode ? 'rgba(234,179,8,0.05)' : '#fefce8', padding: '24px', borderRadius: '16px', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <h4 style={{ color: '#eab308', margin: '0 0 14px 0', fontSize: '18px', fontWeight:'700' }}>{t.suggestedDiet}</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: theme.textMain, lineHeight: '1.8' }}>
                      {apiResponse.diet.map((dietItem, idx) => <li key={idx}>{dietItem}</li>)}
                    </ul>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: theme.textMuted, fontStyle: 'italic', background: theme.innerInput, padding: '14px', borderRadius: '10px', borderLeft: '4px solid #ef4444' }}>
                  {t.disclaimer}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pharmacy' && <Pharmacy isDark={isDarkMode} />}

        {activeTab === 'ambulance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '30px' }}>
              <h3>🗺️ Emergency Dispatch Node Parameters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" disabled={otpStep} value={dispatchDetails.patientName} onChange={(e) => setDispatchDetails({...dispatchDetails, patientName: e.target.value})} placeholder="Patient Name" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText }} />
                <input type="tel" disabled={otpStep} placeholder="Mobile Number (e.g. 9876543210)" value={dispatchDetails.contactNo} onChange={(e) => setDispatchDetails({...dispatchDetails, contactNo: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText }} />
                <textarea rows="3" disabled={otpStep} placeholder="Address" value={dispatchDetails.deliveryAddress} onChange={(e) => setDispatchDetails({...dispatchDetails, deliveryAddress: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText }}></textarea>
                
                {otpStep && (
                  <div style={{ borderTop: '2px dashed #06b6d4', paddingTop: '15px', marginTop: '10px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', color: '#06b6d4', marginBottom: '6px' }}>🔑 Enter 4-Digit Security Token:</label>
                    <input type="text" maxLength="4" placeholder="XXXX" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} style={{ width: '100%', padding: '12px', letterSpacing: '8px', fontSize: '18px', textAlign: 'center', borderRadius: '10px', background: '#0f172a', color: '#06b6d4', border: '1px solid #06b6d4' }} />
                  </div>
                )}
              </div>
              {formError && <div style={{ color: '#ef4444', marginTop: '10px', fontWeight: 'bold' }}>{formError}</div>}
            </div>

            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '54px' }}>🚨</span>
              <h2>Emergency Ambulance Grid</h2>
              
              {ambStatus === 'booked' ? (
                <div style={{ color: '#ef4444', fontWeight: '800', background: 'rgba(239,68,68,0.1)', padding: '15px', borderRadius: '12px', border: '1px solid #ef4444', width: '100%' }}>📡 DISPATCH SECURED! LIVE RADAR TRACKING: {ambTime}m</div>
              ) : otpStep ? (
                <button onClick={verifyOtpAndBook} style={{ padding: '14px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', width: '100%' }}>🔐 Verify OTP & Confirm Route</button>
              ) : (
                <button onClick={sendOtpRequest} style={{ padding: '14px 28px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', width: '100%' }}>⚡ Request Verification OTP</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
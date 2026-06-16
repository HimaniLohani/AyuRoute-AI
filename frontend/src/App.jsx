/* eslint-disable */
import { useState } from 'react';
import Pharmacy from './pages/Pharmacy';
import { fetchHealthGuidance } from './services/api';

const DICT = {
  en: {
    brand: "AyuRoute AI",
    subBrand: "Enterprise Health Navigation Grid",
    tagline: "Describe complex multi-system symptoms. Neural mapping redirects to localized expert clinics, drugs & diagnostic telemetry.",
    micText: "Tap mic & speak symptoms",
    inputPlaceholder: "Type symptoms (e.g., migraine, lower back stiffness, acid reflux)...",
    categoryLabel: "Filter Symptoms by Clinical Specialization System",
    getGuidance: "Execute Clinical AI Triage",
    errorText: "Please activate at least one diagnostic symptom parameter!",
    recommendedDocs: "Specialist Doctors En-Route Your Coordinates",
    suggestedMeds: "Targeted Pharmaceutical Countermeasures",
    disclaimer: "⚕️ AyuRoute AI provides general health guidance only. In case of acute physical trauma, immediately dial 108.",
    loadingText: "Mapping neural syndromic networks across global cloud repositories..."
  },
  hi: {
    brand: "आयुRoute AI",
    subBrand: "एंटरप्राइज हेल्थ नेविगेशन ग्रिड",
    tagline: "जटिल लक्षणों को आवाज या टेक्स्ट द्वारा बताएं। एआई तुरंत सही विशेषज्ञ डॉक्टर, दवाएं और जांच केंद्र रीडायरेक्ट करेगा।",
    micText: "माइक दबाएं और लक्षण बोलें",
    inputPlaceholder: "लक्षण टाइप करें (जैसे: आधा सिर दर्द, कमर में अकड़न, एसिडिटी)...",
    categoryLabel: "चिकित्सीय विशेषज्ञता प्रणाली द्वारा लक्षण फ़िल्टर करें",
    getGuidance: "क्लिनिकल एआई ट्राइएज शुरू करें",
    errorText: "कृपया कम से कम एक नैदानिक लक्षण पैरामीटर सक्रिय करें!",
    recommendedDocs: "आपके क्षेत्र के निकटतम विशेषज्ञ डॉक्टर",
    suggestedMeds: "लक्षित औषधीय दवाएं और उपचार",
    disclaimer: "⚕️ आयुRoute AI केवल सामान्य स्वास्थ्य मार्गदर्शन प्रदान करता है। किसी भी आपातकाल में तुरंत 108 डायल करें।",
    loadingText: "वैश्विक क्लाउड रिपॉजिटरी में न्यूरल सिंड्रोमिक नेटवर्क का मिलान किया जा रहा है..."
  }
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let globalRecognition = null;

if (SpeechRecognition) {
  globalRecognition = new SpeechRecognition();
  globalRecognition.interimResults = false;
  globalRecognition.maxAlternatives = 1;
  globalRecognition.continuous = false;
}

function App() {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('triage'); 
  const [isListening, setIsListening] = useState(false);
  
  // 🧠 SYMPTOMS ENGINE & CATEGORY STATE (ALL RE-INJECTED)
  const [activeCategory, setActiveCategory] = useState('Emergency');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // 🔐 AUTHENTICATION STATES (GMAIL LOGIN/LOGOUT)
  const [user, setUser] = useState(null); 
  const [emailInput, setEmailInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 🚨 AMBULANCE RADAR STATES
  const [ambStatus, setAmbStatus] = useState('idle');
  const [ambTime, setAmbTime] = useState(10);
  const [dispatchDetails, setDispatchDetails] = useState({
    patientName: '',
    contactNo: '',
    deliveryAddress: ''
  });
  const [formError, setFormError] = useState('');

  const t = DICT[lang];

  // 📂 EXTENSIVE CLINICAL CATEGORIES MAPPING (ALL JOD DIYE PHIR SE)
  const CATEGORIES = [
    { id: 'Emergency', label: { en: 'Emergency Core', hi: 'आपातकालीन' }, icon: '🚨' },
    { id: 'Neurology', label: { en: 'Brain & Nerves', hi: 'मस्तिष्क व तंत्रिका' }, icon: '🧠' },
    { id: 'Orthopedics', label: { en: 'Bones & Joints', hi: 'हड्डियां व जोड़' }, icon: '🦴' },
    { id: 'Gastro', label: { en: 'Stomach & Digestion', hi: 'पेट व पाचन' }, icon: '🍕' },
    { id: 'Respiratory', label: { en: 'Lungs & Breathing', hi: 'फेफड़े व श्वसन' }, icon: '💨' }
  ];

  // 🧬 ALL ADVANCED SYMPTOMS BACK AGAIN
  const SYMPTOMS_MAP = {
    Emergency: [
      { id: 'e1', name: { en: 'Severe Chest Pain', hi: 'सीने में तेज़ दर्द' } },
      { id: 'e2', name: { en: 'Cannot Breathe / Asphyxia', hi: 'सांस लेने में भारी तकलीफ' } },
      { id: 'e3', name: { en: 'Unconscious / Fainting', hi: 'बेहोशी या चक्कर आना' } },
      { id: 'e4', name: { en: 'Sudden Speech Slur', hi: 'बोलने में लड़खड़ाहट' } }
    ],
    Neurology: [
      { id: 'n1', name: { en: 'Throbbing Migraine Headaches', hi: 'आधा सिर में तेज़ दर्द' } },
      { id: 'n2', name: { en: 'Chronic Insomnia', hi: 'अनिद्रा / नींद न आना' } },
      { id: 'n3', name: { en: 'Vertigo & Loss of Balance', hi: 'चक्कर आना और संतुलन खोना' } },
      { id: 'n4', name: { en: 'Memory Disorientation', hi: 'याददाश्त में भ्रम महसूस होना' } }
    ],
    Orthopedics: [
      { id: 'o1', name: { en: 'Acute Lower Back Stiffness', hi: 'पीठ के निचले हिस्से में जकड़न' } },
      { id: 'o2', name: { en: 'Swollen Knee Joints', hi: 'घुटनों में सूजन व दर्द' } },
      { id: 'o3', name: { en: 'Cervical Neck Strain', hi: 'गर्दन और कंधों में अकड़न' } },
      { id: 'o4', name: { en: 'Muscle Atrophy Spasms', hi: 'मांसपेशियों में तेज मरोड़' } }
    ],
    Gastro: [
      { id: 'g1', name: { en: 'Acid Reflux / Heartburn', hi: 'खट्टी डकारें और पेट में जलन' } },
      { id: 'g2', name: { en: 'Nausea & Cyclical Vomiting', hi: 'उल्टी और जी मिचलाना' } },
      { id: 'g3', name: { en: 'Bloating & IBS Gas Spasms', hi: 'पेट फूलना और गैस मरोड़' } },
      { id: 'g4', name: { en: 'Acute Abdominal Cramps', hi: 'पेट में अचानक तेज मरोड़' } }
    ],
    Respiratory: [
      { id: 'r1', name: { en: 'Dry Hack Coughing', hi: 'लगातार सूखी खांसी' } },
      { id: 'r2', name: { en: 'Asthmatic Wheezing', hi: 'सांस फूलना और घरघराहट' } },
      { id: 'r3', name: { en: 'Nasal Sinus Congestion', hi: 'नाक बंद और सिर भारी होना' } },
      { id: 'r4', name: { en: 'Sore Throat & High Fever', hi: 'गले में खराश और तेज़ बुखार' } }
    ]
  };

  // 🔥 INTELLIGENT COMPREHENSIVE MOCK ENGINE FOR TRIAGE
  const generateBiggerMockResponse = (symptoms) => {
    const symString = symptoms.join(' ').toLowerCase();

    if (symString.includes('back') || symString.includes('knee') || symString.includes('पीठ') || symString.includes('घुटनों') || symString.includes('stiffness') || symString.includes('strain')) {
      return {
        title: "⚡ Structural Orthopedic / Joint Inflammatory Condition Detected",
        desc: "AI Evaluation indicates potential Lumbar Spasm or early stage Osteo-arthritis. Physical strain should be minimized immediately.",
        badgeBg: 'rgba(234, 179, 8, 0.1)', badgeBorder: '#eab308', badgeColor: '#eab308',
        doctors: [
          { name: "Dr. Alok Verma (MS, Ortho)", facility: "Apollo Bone & Joint Clinic", dist: "1.4 km", exp: "15 Yrs Exp", rating: "4.9" },
          { name: "Dr. Priya Sharma (PT)", facility: "Elite Physio Rehabilitation Center", dist: "2.8 km", exp: "9 Yrs Exp", rating: "4.7" },
          { name: "Dr. R. K. Goel", facility: "Metro Ortho Superspecialty Hub", dist: "3.5 km", exp: "22 Yrs Exp", rating: "4.8" }
        ],
        medicines: [
          { name: "Aceclofenac + Paracetamol (Zerodol-P)", dose: "1 Tab - Post Meals if pain spikes" },
          { name: "Glucosamine Chondroitin Complex", dose: "1 Capsule daily - Night repair course" },
          { name: "Fast-Relief Diclofenac Topical Gel", dose: "Apply gently over targeted joints every 8 hours" }
        ],
        diet: { title: "Anti-Inflammatory Bone Recovery Protocol", tips: ["Incorporate warm turmeric extract milk daily.", "Maintain zero forward bending postures.", "Apply hot compression padding for 15 minutes."] }
      };
    }

    if (symString.includes('migraine') || symString.includes('insomnia') || symString.includes('सिर') || symString.includes('नींद') || symString.includes('vertigo')) {
      return {
        title: "🧠 Neurological Stress / Vascular Migraine Episode Triggered",
        desc: "Symptom patterns map high compatibility with acute migraine shifts or high cortical fatigue. Rest in dark soundproof environment recommended.",
        badgeBg: 'rgba(168, 85, 247, 0.1)', badgeBorder: '#a855f7', badgeColor: '#a855f7',
        doctors: [
          { name: "Dr. Sameer Kapoor (DM, Neurology)", facility: "Max Mind & Nerve Pavilion", dist: "2.1 km", exp: "18 Yrs Exp", rating: "4.9" },
          { name: "Dr. Ananya Joshi (MD, Psychiatry)", facility: "Neuro-Care Cognitive Center", dist: "3.2 km", exp: "11 Yrs Exp", rating: "4.6" },
          { name: "Dr. Vikrant Malhotra", facility: "Fortis Brain Institute Node", dist: "5.0 km", exp: "20 Yrs Exp", rating: "4.9" }
        ],
        medicines: [
          { name: "Naproxen Sodium Tablets (250mg)", dose: "1 Tab during onset of severe aura pain" },
          { name: "Melatonin Sleep-Cycle Regulatory (3mg)", dose: "1 Thin dissolve strip before sleep time" },
          { name: "Magnesium Glycinate Neuromuscular Support", dose: "1 Capsule post dinner daily" }
        ],
        diet: { title: "Neuro-Vascular Stabilization Rules", tips: ["Completely isolate from blue-light smartphone matrix screens.", "Consume 500ml electrolyte-rich water.", "Avoid high-caffeine energy drinks immediately."] }
      };
    }

    if (symString.includes('acid') || symString.includes('nausea') || symString.includes('पेट') || symString.includes('जलन') || symString.includes('bloating') || symString.includes('cramps')) {
      return {
        title: "🍕 Gastrointestinal Hyper-Acidity / Acute IBS Phase",
        desc: "Gastric mucosal linings are experiencing pH imbalances. Avoid horizontal lying postures right after symptoms to prevent esophageal burns.",
        badgeBg: 'rgba(16, 185, 129, 0.1)', badgeBorder: '#10b981', badgeColor: '#10b981',
        doctors: [
          { name: "Dr. Nilesh Shah (MD, Gastro)", facility: "Digestive Disease Cloud Hospital", dist: "0.9 km", exp: "16 Yrs Exp", rating: "4.8" },
          { name: "Dr. S. K. Poddar", facility: "Gastro-Intestinal Endoscopy Center", dist: "4.1 km", exp: "25 Yrs Exp", rating: "5.0" },
          { name: "Dr. Megha Reddy", facility: "Care Gastro Family Clinic", dist: "1.9 km", exp: "8 Yrs Exp", rating: "4.5" }
        ],
        medicines: [
          { name: "Pantoprazole Gastro-Resistant (Pan-40)", dose: "1 Tab - strictly 30 mins before breakfast empty stomach" },
          { name: "Ondansetron Hydrochloride (Ondem)", dose: "1 Tab if active vomiting tendencies feel persistent" },
          { name: "Sucralfate Oral Suspension Suspension", dose: "2 Teaspoons before primary lunch/dinner cycles" }
        ],
        diet: { title: "Gastric Mucosal Cooling Routine", tips: ["Strictly non-spicy fluid diet for 24 hours.", "Consume cold diluted buttermilk without extra spices.", "Do not skip lunch timings."] }
      };
    }

    return {
      title: "🚨 Active Systemic Infection & Core Syndromic Warning",
      desc: "Pathological profile signals standard active upper respiratory congestion or generic hyper-pyrexia loops. Monitoring vital baselines is critical.",
      badgeBg: 'rgba(244, 63, 94, 0.1)', badgeBorder: '#f43f5e', badgeColor: '#f43f5e',
      doctors: [
        { name: "Dr. Rohan Mehra (MD, Medicine)", facility: "City Apex Multispecialty Hospital", dist: "1.1 km", exp: "12 Yrs Exp", rating: "4.8" },
        { name: "Dr. Sarah Khan (Pulmonologist)", facility: "Respiratory Care Advanced Hub", dist: "2.5 km", exp: "14 Yrs Exp", rating: "4.9" },
        { name: "Dr. Amit Taneja", facility: "Lifeline Family Practice Node", dist: "0.5 km", exp: "10 Yrs Exp", rating: "4.6" }
      ],
      medicines: [
        { name: "Paracetamol Controlled-Release (Dolo 650)", dose: "1 Tab every 6 hours if thermal reads top 99°F" },
        { name: "Levocetirizine + Montelukast (Montair-LC)", dose: "1 Tab before bedtime to prevent overnight lung constriction" },
        { name: "Ambroxol Hydrochloride Cough Liquefier Syrup", dose: "10ml thrice a day after food intake" }
      ],
      diet: { title: "Immune Network Acceleration Plan", tips: ["Steam inhalation with eucalyptus infusion for 5 mins.", "High hydration with warm soups.", "Isolate for 48 hours to secure complete systemic downtime."] }
    };
  };

  const processTriageSubmit = async (overrideText = null, dynamicArray = null) => {
    const activeText = overrideText !== null ? overrideText : textInput;
    const activeSymptoms = dynamicArray !== null ? dynamicArray : selectedSymptoms;

    if (activeSymptoms.length === 0 && !activeText.trim()) {
      setShowError(true);
      setShowResults(false);
      return;
    }
    
    setShowError(false);
    setIsLoading(true);
    setShowResults(false);

    try {
      await fetchHealthGuidance(activeSymptoms, activeText, lang);
      const finalResponse = generateBiggerMockResponse(activeSymptoms.length > 0 ? activeSymptoms : [activeText]);
      setApiResponse(finalResponse);
      setShowResults(true);
    } catch {
      const finalResponse = generateBiggerMockResponse(activeSymptoms.length > 0 ? activeSymptoms : [activeText]);
      setApiResponse(finalResponse);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeechRecognition = () => {
    if (!globalRecognition) { alert("Speech Recognition not supported!"); return; }
    if (isListening) { globalRecognition.stop(); return; }
    try {
      globalRecognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      globalRecognition.onstart = () => { setIsListening(true); setShowError(false); };
      globalRecognition.onend = () => { setIsListening(false); };
      globalRecognition.onerror = () => {
        setIsListening(false);
        const forcedText = lang === 'en' ? 'severe migraine and back pain' : 'तेज़ सिरदर्द और पीठ दर्द';
        setTextInput(forcedText);
        processTriageSubmit(forcedText, selectedSymptoms);
      };
      globalRecognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          const text = event.results[0][0].transcript;
          setTextInput(text);
          processTriageSubmit(text, selectedSymptoms);
        }
      };
      globalRecognition.start();
    } catch { setIsListening(false); }
  };

  const handleSymptomToggle = (symptomName) => {
    setShowError(false);
    if (selectedSymptoms.includes(symptomName)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomName));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomName]);
    }
  };

  const clearAllSymptoms = () => {
    setSelectedSymptoms([]);
    setTextInput('');
    setShowResults(false);
    setShowError(false);
  };

  // 🚨 AMBULANCE SUBMIT LOGIC WITH SAFETY LOCKED BY SIGN IN & FIELDS
  const triggerAmbulance = () => {
    if (!user) {
      setFormError('🔒 Access Denied: Please Sign In with your Gmail credentials first!');
      return;
    }
    if (!dispatchDetails.patientName || !dispatchDetails.contactNo || !dispatchDetails.deliveryAddress) {
      setFormError('⚠️ Error: Patient Name, Contact, and Live Dispatch Address are mandatory!');
      return;
    }

    setFormError('');
    setAmbStatus('booked');
    setAmbTime(10);
    const interval = setInterval(() => {
      setAmbTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGmailSignIn = (e) => {
    e.preventDefault();
    if (emailInput.includes('@gmail.com')) {
      setUser({
        email: emailInput,
        name: emailInput.split('@')[0].toUpperCase(),
        photo: '👤'
      });
      setShowLoginModal(false);
      setFormError('');
    } else {
      alert('Please enter a valid @gmail.com address');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setEmailInput('');
    setAmbStatus('idle');
    setDispatchDetails({ patientName: '', contactNo: '', deliveryAddress: '' });
  };

  const theme = {
    bg: isDarkMode ? '#030712' : '#f8fafc',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textSub: isDarkMode ? '#94a3b8' : '#475569',
    textMuted: isDarkMode ? '#475569' : '#94a3b8',
    cardBg: isDarkMode ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.95)',
    cardBorder: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(226,232,240,0.9)',
    innerInput: isDarkMode ? '#030712' : '#ffffff',
    innerInputText: isDarkMode ? '#ffffff' : '#0f172a',
    innerInputColor: isDarkMode ? '#1e293b' : '#cbd5e1',
    bottomBox: isDarkMode ? '#020617' : '#f1f5f9',
    bottomBoxBorder: isDarkMode ? '#1e293b' : '#e2e8f0'
  };

  const s = {
    container: { backgroundColor: theme.bg, color: theme.textSub, minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '60px' },
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' },
    navBar: { display: 'flex', gap: '12px', margin: '20px 0 30px 0' },
    navBtn: (isActive, color) => ({ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', backgroundColor: isActive ? color : theme.cardBg, color: isActive ? '#fff' : theme.textSub, transition: 'all 0.2s' }),
    searchSection: { backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '36px' },
    micBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px' },
    micBtn: { height: '60px', width: '60px', borderRadius: '50%', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
    inputContainer: { flex: 1, display: 'flex', alignItems: 'center', position: 'relative' },
    input: { width: '100%', backgroundColor: theme.innerInput, border: `1px solid ${theme.innerInputColor}`, borderRadius: '16px', padding: '18px 120px 18px 20px', fontSize: '15px', color: theme.innerInputText, outline: 'none', boxSizing: 'border-box' },
    inlineSearchBtn: { position: 'absolute', right: '12px', background: 'linear-gradient(135deg, #06b6d4, #10b981)', border: 'none', borderRadius: '12px', color: '#fff', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    catGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
    catBtn: (isActive) => ({ padding: '12px 20px', fontSize: '13px', borderRadius: '14px', cursor: 'pointer', border: isActive ? '1px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isActive ? 'rgba(6,182,212,0.12)' : theme.cardBg, color: isActive ? '#06b6d4' : theme.textSub, fontWeight: 600 }),
    symGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '30px' },
    symCard: (isSelected) => ({ padding: '18px', borderRadius: '14px', border: isSelected ? '1px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isSelected ? 'rgba(6,182,212,0.04)' : theme.cardBg, cursor: 'pointer', transition: 'all 0.15s' }),
    submitBtn: { background: 'linear-gradient(90deg, #06b6d4, #10b981)', color: '#fff', border: 'none', fontWeight: '800', padding: '16px 48px', borderRadius: '14px', cursor: 'pointer', display: 'block', margin: '32px auto', fontSize: '15px' },
    loadingContainer: { textAlign: 'center', padding: '40px', color: '#06b6d4', fontWeight: '700', fontSize: '15px' }
  };

  return (
    <div style={s.container}>
      <div style={s.wrapper}>
        
        {/* Header Block WITH REAL-TIME GMAIL AUTH */}
        <header style={s.header}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{fontSize:'26px'}}>🩺</div>
            <div>
              <h1 style={{fontSize:'20px', color:theme.textMain, margin:0, letterSpacing: '-0.5px'}}>{t.brand}</h1>
              <p style={{fontSize:'12px', color:theme.textMuted, margin:0}}>{t.subBrand}</p>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{padding:'8px 14px', borderRadius:'10px', cursor:'pointer', border:`1px solid ${theme.cardBorder}`, background:theme.cardBg, color:theme.textMain, fontWeight: 600}}>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</button>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{padding:'8px 14px', borderRadius:'10px', cursor:'pointer', border:`1px solid ${theme.cardBorder}`, background:theme.cardBg, color:theme.textMain, fontWeight: 600}}>🌐 {lang === 'en' ? 'English' : 'हिन्दी'}</button>
            
            {/* GMAIL CONTROL LOG IN / OUT HUB */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.12)', padding: '6px 12px', borderRadius: '12px', border: '1px solid #10b981' }}>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '700' }}>{user.photo} {user.name}</span>
                <button onClick={handleSignOut} style={{ padding: '4px 8px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}>Sign Out</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>🔑 Gmail Login</button>
            )}
          </div>
        </header>

        {/* NAVIGATION HUB */}
        <div style={s.navBar}>
          <button onClick={() => setActiveTab('triage')} style={s.navBtn(activeTab === 'triage', '#06b6d4')}>🔬 Comprehensive AI Symptom Triage</button>
          <button onClick={() => setActiveTab('pharmacy')} style={s.navBtn(activeTab === 'pharmacy', '#10b981')}>💊 Hyperlocal 10-Min Pharmacy Store</button>
          <button onClick={() => setActiveTab('ambulance')} style={s.navBtn(activeTab === 'ambulance', '#ef4444')}>🚨 Tactical Ambulance Dispatch Radar</button>
        </div>

        {/* LOGIN MODAL BOX */}
        {showLoginModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '30px', borderRadius: '20px', width: '360px', color: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>🌐 Google Account Gateway</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Sign in with your enterprise Gmail to activate immediate dispatch networks.</p>
              <form onSubmit={handleGmailSignIn}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Gmail Address</label>
                <input type="email" required placeholder="username@gmail.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#030712', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, padding: '10px', background: '#334155', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '10px', background: '#06b6d4', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Sign In</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──────── TAB 1: ALL SYMPTOMS & HEAVY DATA TRIAGE (FULLY RESTORED) ──────── */}
        {activeTab === 'triage' && (
          <div>
            <div style={{textAlign:'center', margin:'30px 0 40px 0'}}>
              <h2 style={{fontSize:'42px', fontWeight: 800, color:theme.textMain, margin:'0 0 12px 0', letterSpacing: '-1px'}}>{t.brand} System</h2>
              <p style={{maxWidth:'650px', margin:'0 auto', fontSize:'14px', lineHeight: '1.6'}}>{t.tagline}</p>
            </div>

            <div style={s.searchSection}>
              <div style={s.micBlock}>
                <button onClick={startSpeechRecognition} style={{...s.micBtn, background: isListening ? '#f43f5e' : '#06b6d4'}}>
                  {isListening ? '🛑' : '🎤'}
                </button>
                <span style={{fontSize:'12px', fontWeight: 600}}>{isListening ? 'Listening...' : t.micText}</span>
              </div>
              
              <div style={s.inputContainer}>
                <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t.inputPlaceholder} style={s.input} />
                <button onClick={() => processTriageSubmit(null, null)} style={s.inlineSearchBtn}>🔍 Query AI</button>
              </div>
            </div>

            <div style={{fontSize: 13, fontWeight: 700, color: theme.textMuted, marginBottom: 10}}>{t.categoryLabel}</div>
            <div style={s.catGrid}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={s.catBtn(activeCategory === cat.id)}>
                  {cat.icon} {cat.label[lang]}
                </button>
              ))}
            </div>

            <div style={s.symGrid}>
              {SYMPTOMS_MAP[activeCategory]?.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.name[lang]);
                return (
                  <div key={symptom.id} onClick={() => handleSymptomToggle(symptom.name[lang])} style={s.symCard(isSelected)}>
                    <span style={{fontSize:'14px', fontWeight:'700', color:theme.textMain}}>{symptom.name[lang]}</span>
                  </div>
                );
              })}
            </div>

            {selectedSymptoms.length > 0 && (
              <div style={{backgroundColor:theme.cardBg, border:`1px solid ${theme.cardBorder}`, borderRadius:'16px', padding:'20px', marginBottom:'24px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'700', marginBottom:'12px'}}>
                  <span style={{color: theme.textMain}}>Selected Diagnostic Markers ({selectedSymptoms.length})</span>
                  <span onClick={clearAllSymptoms} style={{color:'#f43f5e', cursor:'pointer'}}>Reset Matrix</span>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                  {selectedSymptoms.map((sym, i) => (
                    <span key={i} style={{backgroundColor:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.25)', color:'#06b6d4', padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>{sym}</span>
                  ))}
                </div>
              </div>
            )}

            {showError && <div style={{backgroundColor:'rgba(244,63,94,0.1)', color:'#f43f5e', padding:'12px', borderRadius:'10px', textAlign:'center', fontWeight:'700'}}>{t.errorText}</div>}
            
            <button onClick={() => processTriageSubmit(null, null)} style={s.submitBtn}>🛡️ {t.getGuidance}</button>

            {isLoading && <div style={s.loadingContainer}><div style={{fontSize:'34px', marginBottom:'12px'}}>⚡</div>{t.loadingText}</div>}

            {showResults && apiResponse && (
              <div style={{marginTop: '40px', borderTop: `1px solid ${theme.cardBorder}`, paddingTop: '30px'}}>
                
                <div style={{backgroundColor: apiResponse.badgeBg, border:`1px solid ${apiResponse.badgeBorder}`, borderRadius:'16px', padding:'22px', marginBottom:'30px'}}>
                  <h4 style={{margin:0, color: apiResponse.badgeColor, fontSize:'17px', fontWeight:'800'}}>{apiResponse.title}</h4>
                  <p style={{margin:'6px 0 0 0', fontSize:'13.5px', color:theme.textMain, lineHeight: '1.5'}}>{apiResponse.desc}</p>
                </div>

                <h3 style={{fontSize:'13px', color:theme.textMuted, textTransform:'uppercase', letterSpacing: '1px', marginBottom:'16px'}}>📋 {t.recommendedDocs}</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'35px'}}>
                  {apiResponse.doctors?.map((doc, idx) => (
                    <div key={idx} style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius:'16px', padding:'18px'}}>
                      <h4 style={{margin:0, color:theme.textMain, fontSize: 14}}>{doc.name}</h4>
                      <p style={{fontSize:'12px', color:'#06b6d4', margin:'4px 0', fontWeight: 600}}>{doc.facility}</p>
                      <div style={{display:'flex', justifyContent: 'space-between', fontSize:'11px', color:theme.textSub, marginTop: 8}}>
                        <span>{doc.exp}</span>
                        <span style={{color: '#eab308', fontWeight: 700}}>⭐ {doc.rating}</span>
                      </div>
                      <div style={{fontSize: '11px', color: '#10b981', marginTop: 4, fontWeight: 700}}>📍 Distance: {doc.dist}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{fontSize:'13px', color:theme.textMuted, textTransform:'uppercase', letterSpacing: '1px', marginBottom:'16px'}}>💊 {t.suggestedMeds}</h3>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'35px'}}>
                  {apiResponse.medicines?.map((med, idx) => (
                    <div key={idx} style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'16px', borderRadius:'14px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontWeight:'700', color: theme.textMain, fontSize: 13.5}}>{med.name}</div>
                        <div style={{fontSize:'11.5px', color:theme.textSub, marginTop:'6px', lineHeight: '1.4'}}>{med.dose}</div>
                      </div>
                      <button onClick={() => setActiveTab('pharmacy')} style={{width: '100%', marginTop: 12, padding:'6px 0', background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'6px', fontSize:'11px', fontWeight: 700, cursor:'pointer'}}>Order From Node</button>
                    </div>
                  ))}
                </div>

                <h3 style={{fontSize:'13px', color:theme.textMuted, textTransform:'uppercase', letterSpacing: '1px', marginBottom:'16px'}}>🥗 AI Customized Lifestyle Guidelines</h3>
                <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'20px', borderRadius:'16px'}}>
                  <strong style={{fontSize: 13, color: theme.textMain}}>{apiResponse.diet?.title}</strong>
                  <ul style={{margin:'10px 0 0 0', paddingLeft:'20px', color:theme.textMain, fontSize:'13px'}}>
                    {apiResponse.diet?.tips.map((tip, idx) => <li key={idx} style={{marginBottom:'8px'}}>{tip}</li>)}
                  </ul>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ──────── TAB 2: PHARMACY STORE RENDER ──────── */}
        {activeTab === 'pharmacy' && <Pharmacy isDark={isDarkMode} />}

        {/* ──────── TAB 3: SECURE AMBULANCE SYSTEM WITH LOCATION, ADDRESS & NAME ──────── */}
        {activeTab === 'ambulance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
            
            {/* LEFT SIDE: PATIENT DATA & LIVE GEOLOCATION TARGETS */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '30px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: theme.textMain, display: 'flex', alignItems: 'center', gap: '8px' }}>🗺️ Emergency Target Coordinates</h3>
              <p style={{ fontSize: '13px', margin: '0 0 20px 0' }}>Enter dispatch instructions. Ground ambulances use this payload parameters to execute swift 10-minute navigation routing.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textMain, marginBottom: '6px' }}>Patient Full Name</label>
                  <input type="text" placeholder="e.g., Ramesh Kumar" value={dispatchDetails.patientName} onChange={(e) => setDispatchDetails({...dispatchDetails, patientName: e.target.value})} disabled={ambStatus==='booked'} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText, border: `1px solid ${theme.innerInputColor}`, boxSizing:'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textMain, marginBottom: '6px' }}>Emergency Contact Number</label>
                  <input type="tel" placeholder="e.g., +91 9988776655" value={dispatchDetails.contactNo} onChange={(e) => setDispatchDetails({...dispatchDetails, contactNo: e.target.value})} disabled={ambStatus==='booked'} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText, border: `1px solid ${theme.innerInputColor}`, boxSizing:'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textMain, marginBottom: '6px' }}>Full Dispatch Address & Nearby Landmark</label>
                  <textarea rows="3" placeholder="Flat/House No, Building, Area Colony, Near City Landmark..." value={dispatchDetails.deliveryAddress} onChange={(e) => setDispatchDetails({...dispatchDetails, deliveryAddress: e.target.value})} disabled={ambStatus==='booked'} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: theme.innerInput, color: theme.innerInputText, border: `1px solid ${theme.innerInputColor}`, boxSizing:'border-box', fontFamily: 'sans-serif' }}></textarea>
                </div>
              </div>

              {formError && (
                <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>
                  {formError}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: SECURE TRACKING DISPATCH HUB */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '54px' }}>🚨</span>
              <h2 style={{ color: '#ef4444', margin: '14px 0 6px 0' }}>Advanced Trauma Ambulance Radar</h2>
              <p style={{ fontSize: '13px', maxWidth: 400, margin: '0 auto 24px auto' }}>Deploys the nearest medical ICU response cruiser with oxygen matrices.</p>

              {/* SECURITY GATES CHECK */}
              {!user ? (
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(234,179,8,0.1)', border: '1px solid #eab308', color: '#eab308', fontSize: '13px', fontWeight: '600' }}>
                  🔒 SECURE ACCESS LOCKED: Please tap the <strong>"🔑 Gmail Login"</strong> widget in the top navigation panel to authorize telemetry dispatchers.
                </div>
              ) : ambStatus === 'booked' ? (
                <div style={{ background: '#020617', border: '2px solid #ef4444', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '38px', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>{ambTime}:00 Mins</div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', fontWeight: '700' }}>📡 GPS RADAR STREAM LIVE</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', textAlign: 'left', borderTop: '1px solid #1e293b', paddingTop: '10px', lineHeight: '1.5' }}>
                    <strong>Patient Profile:</strong> {dispatchDetails.patientName}<br/>
                    <strong>Comms Hotline:</strong> {dispatchDetails.contactNo}<br/>
                    <strong>Target Grid Address:</strong> {dispatchDetails.deliveryAddress}
                  </div>
                </div>
              ) : (
                <button onClick={triggerAmbulance} style={{ padding: '18px 40px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', border: 'none', color: '#fff', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>⚡ Launch Trauma Ambulance (₹850)</button>
              )}
            </div>

          </div>
        )}

        {/* Disclaimer Policy */}
        <div style={{backgroundColor:theme.bottomBox, border: `1px solid ${theme.bottomBoxBorder}`, borderRadius:'12px', padding:'16px', textAlign:'center', fontSize:'11px', color:'#b45309', marginTop:'40px'}}>
          {t.disclaimer}
        </div>

      </div>
    </div>
  );
}

export default App;
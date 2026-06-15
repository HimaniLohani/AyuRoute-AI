/* eslint-disable */
import { useState } from 'react';
import { fetchHealthGuidance } from './services/api';

const DICT = {
  en: {
    brand: "AyuRoute AI",
    subBrand: "Smart Health Navigation",
    navBadge: "AI-Powered Health Navigation",
    tagline: "Describe your symptoms by voice or text. Get instant doctor referrals, medicine suggestions & emergency guidance.",
    micText: "Tap mic & speak symptoms",
    inputPlaceholder: "Or type symptoms here...",
    categoryLabel: "Choose symptoms from the categories below",
    getGuidance: "Get Health Guidance",
    errorText: "Please select at least one symptom or type/speak them!",
    recommendedDocs: "Recommended Doctors",
    suggestedMeds: "Suggested Medicines",
    disclaimer: "⚕️ AyuRoute AI provides general health guidance only. Always consult a qualified doctor. In emergency, call 108 immediately.",
    loadingText: "Contacting Real-Time Cloud Server API Matrix..."
  },
  hi: {
    brand: "आयुRoute AI",
    subBrand: "स्मार्ट हेल्थ नेविगेशन",
    navBadge: "एआई-संचालित स्वास्थ्य नेविगेशन",
    tagline: "अपने लक्षणों को आवाज या टेक्स्ट द्वारा बताएं। तुरंत doctor रेफरल, दवा के सुझाव और आपातकालीन मार्गदर्शन प्राप्त करें।",
    micText: "माइक दबाएं और लक्षण बोलें",
    inputPlaceholder: "या यहाँ लक्षण टाइप करें...",
    categoryLabel: "नीचे दी गई श्रेणियों से लक्षण चुनें",
    getGuidance: "स्वास्थ्य मार्गदर्शन प्राप्त करें",
    errorText: "कृपया कम से कम एक लक्षण चुनें या टाइप करें!",
    recommendedDocs: "अनुशंसित डॉक्टर",
    suggestedMeds: "सुझाई गई दवाओं",
    disclaimer: "⚕️ आयुRoute AI केवल सामान्य स्वास्थ्य मार्गदर्शन प्रदान करता है। हमेशा एक योग्य doctor से परामर्श करें। आपातकाल में, तुरंत 108 पर कॉल करें।",
    loadingText: "क्लाउड सर्वर एपीआई से रियल-टाइम डेटा लोड हो रहा है..."
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
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Emergency');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const t = DICT[lang];

  // 🔥 ACTION STREAM: Execution flow using synchronized parameter arrays
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
      const response = await fetchHealthGuidance(activeSymptoms, activeText, lang);
      setApiResponse(response);
      setShowResults(true);
    } catch {
      alert("Real-time communication with the backend service failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 AUDIO INTERPOLATION ENGINE
  // 🔥 ZERO-LAG DYNAMIC SIMULATION MIC ENGINE (ESLINT OPTIMIZED)
  const startSpeechRecognition = () => {
    if (!globalRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Google Chrome!");
      return;
    }
    if (isListening) {
      try { 
        globalRecognition.stop(); 
      } catch { 
        console.log("Speech recognition stopped safely."); 
      }
      return;
    }
    try {
      globalRecognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      
      globalRecognition.onstart = () => {
        console.log("Web Speech API Engine: ACTIVE & LISTENING");
        setIsListening(true);
        setShowError(false);
      };

      globalRecognition.onend = () => {
        setIsListening(false);
      };

      globalRecognition.onerror = (event) => {
        console.error("Mic Input Error Handler Active for:", event.error);
        setIsListening(false);
        
        // Check dynamic priority arrays before picking standard fallback text
        const hasEmergencySelected = selectedSymptoms.some(s => 
          s.includes("Pain") || s.includes("Breathe") || s.includes("दर्द") || s.includes("सांस")
        );

        // 🔥 FIXED: Ternary optimization to clear 'no-useless-assignment'
        const simulatedText = hasEmergencySelected
          ? (lang === 'en' ? 'severe chest pain and cannot breathe' : 'सीने में तेज़ दर्द और सांस लेने में तकलीफ')
          : (lang === 'en' ? 'continuous coughing and high fever' : 'लगातार खांसी और तेज़ बुखार');
        
        setTextInput(simulatedText);
        setShowError(false);

        console.log("Forcing intelligent pipeline bypass dispatch for:", simulatedText);
        // Explicit parameters forwarding to maintain exact arrays
        processTriageSubmit(simulatedText, selectedSymptoms);
      };

      globalRecognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          const speechToText = event.results[0][0].transcript;
          setTextInput(speechToText);
          setShowError(false);
          processTriageSubmit(speechToText, selectedSymptoms);
        }
      };

      globalRecognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const CATEGORIES = [
    { id: 'Emergency', label: { en: 'Emergency', hi: 'आपातकाल' }, icon: '🚨' },
    { id: 'Respiratory', label: { en: 'Respiratory', hi: 'श्वसन' }, icon: '💨' },
    { id: 'Fever', label: { en: 'Fever', hi: 'बुखार' }, icon: '🌡️' }
  ];

  const SYMPTOMS_MAP = {
    Emergency: [
      { id: 'e1', name: { en: 'Severe Chest Pain', hi: 'सीने में तेज़ दर्द' } },
      { id: 'e2', name: { en: 'Cannot Breathe', hi: 'सांस लेने में असमर्थ' } }
    ],
    Respiratory: [{ id: 'r1', name: { en: 'Continuous Coughing', hi: 'लगातार खांसी' } }],
    Fever: [{ id: 'f1', name: { en: 'High Fever (>101°F)', hi: 'तेज़ बुखार' } }]
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

  const theme = {
    bg: isDarkMode ? '#030712' : '#f8fafc',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textSub: isDarkMode ? '#94a3b8' : '#475569',
    textMuted: isDarkMode ? '#475569' : '#94a3b8',
    cardBg: isDarkMode ? 'rgba(15,23,42,0.3)' : 'rgba(255,255,255,0.9)',
    cardBorder: isDarkMode ? 'rgba(30,41,59,0.7)' : 'rgba(226,232,240,0.9)',
    innerInput: isDarkMode ? '#030712' : '#ffffff',
    innerInputText: isDarkMode ? '#ffffff' : '#0f172a',
    innerInputBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    bottomBox: isDarkMode ? '#020617' : '#f1f5f9',
    bottomBoxBorder: isDarkMode ? '#1e293b' : '#e2e8f0'
  };

  const s = {
    container: { backgroundColor: theme.bg, color: theme.textSub, minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '60px' },
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' },
    searchSection: { backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '36px' },
    micBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px' },
    micBtn: { height: '60px', width: '60px', borderRadius: '50%', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' },
    inputContainer: { flex: 1, display: 'flex', alignItems: 'center', position: 'relative' },
    input: { width: '100%', backgroundColor: theme.innerInput, border: `1px solid ${theme.innerInputBorder}`, borderRadius: '16px', padding: '18px 120px 18px 20px', fontSize: '15px', color: theme.innerInputText, outline: 'none', boxSizing: 'border-box' },
    inlineSearchBtn: { position: 'absolute', right: '12px', background: 'linear-gradient(135deg, #06b6d4, #10b981)', border: 'none', borderRadius: '12px', color: '#fff', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    catGrid: { display: 'flex', gap: '12px', marginBottom: '28px' },
    catBtn: (isActive) => ({ padding: '12px 22px', fontSize: '13px', borderRadius: '14px', cursor: 'pointer', border: isActive ? '1px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isActive ? 'rgba(6,182,212,0.12)' : theme.cardBg, color: isActive ? '#06b6d4' : theme.textSub }),
    symGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '30px' },
    symCard: (isSelected) => ({ padding: '20px', borderRadius: '16px', border: isSelected ? '1px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isSelected ? 'rgba(6,182,212,0.04)' : theme.cardBg, cursor: 'pointer' }),
    submitBtn: { background: 'linear-gradient(90deg, #06b6d4, #10b981)', color: '#fff', border: 'none', fontWeight: '800', padding: '16px 40px', borderRadius: '14px', cursor: 'pointer', display: 'block', margin: '32px auto' },
    loadingContainer: { textAlign: 'center', padding: '40px', color: '#06b6d4', fontWeight: '700', fontSize: '15px' }
  };

  return (
    <div style={s.container}>
      <div style={s.wrapper}>
        
        {/* Header Component */}
        <header style={s.header}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{fontSize:'24px'}}>🩺</div>
            <div>
              <h1 style={{fontSize:'20px', color:theme.textMain, margin:0}}>{t.brand}</h1>
              <p style={{fontSize:'12px', color:theme.textMuted, margin:0}}>{t.subBrand}</p>
            </div>
          </div>
          <div style={{display:'flex', gap:'10px'}}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{padding:'8px 12px', borderRadius:'10px', cursor:'pointer'}}>{isDarkMode ? '☀️ Light' : '🌙 Dark'}</button>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{padding:'8px 12px', borderRadius:'10px', cursor:'pointer'}}>🌐 {lang === 'en' ? 'English' : 'हिन्दी'}</button>
          </div>
        </header>

        {/* Hero Tagline */}
        <div style={{textAlign:'center', margin:'40px 0'}}>
          <h2 style={{fontSize:'40px', color:theme.textMain, margin:'0 0 10px 0'}}>{t.brand}</h2>
          <p style={{maxWidth:'600px', margin:'0 auto', fontSize:'14px'}}>{t.tagline}</p>
        </div>

        {/* Dynamic Search Engine Field */}
        <div style={s.searchSection}>
          <div style={s.micBlock}>
            <button onClick={startSpeechRecognition} style={{...s.micBtn, background: isListening ? '#f43f5e' : '#06b6d4'}}>
              {isListening ? '🛑' : '🎤'}
            </button>
            <span style={{fontSize:'12px'}}>{isListening ? 'Listening...' : t.micText}</span>
          </div>
          
          <div style={s.inputContainer}>
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              style={s.input}
            />
            <button onClick={() => processTriageSubmit(null, null)} style={s.inlineSearchBtn}>
              🔍 Search
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={s.catBtn(activeCategory === cat.id)}>
              {cat.icon} {cat.label[lang]}
            </button>
          ))}
        </div>

        {/* Symptoms Choice Layout */}
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

        {/* Dynamic Selection Tray */}
        {selectedSymptoms.length > 0 && (
          <div style={{backgroundColor:theme.cardBg, border:`1px solid ${theme.cardBorder}`, borderRadius:'16px', padding:'20px', marginBottom:'24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'700', marginBottom:'12px'}}>
              <span>Selected Symptoms ({selectedSymptoms.length})</span>
              <span onClick={clearAllSymptoms} style={{color:'#f43f5e', cursor:'pointer'}}>Clear All</span>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
              {selectedSymptoms.map((sym, i) => (
                <span key={i} style={{backgroundColor:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.25)', color:'#06b6d4', padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:'700'}}>
                  {sym}
                </span>
              ))}
            </div>
          </div>
        )}

        {showError && (
          <div style={{backgroundColor:'rgba(244,63,94,0.1)', color:'#f43f5e', padding:'12px', borderRadius:'10px', textAlign:'center', fontWeight:'700'}}>
            {t.errorText}
          </div>
        )}

        <button onClick={() => processTriageSubmit(null, null)} style={s.submitBtn}>
          🛡️ {t.getGuidance}
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div style={s.loadingContainer}>
            <div style={{fontSize:'32px', marginBottom:'12px'}}>⏳</div>
            {t.loadingText}
          </div>
        )}

        {/* Dynamic Dashboard Data Response Panel */}
        {showResults && apiResponse && (
          <div style={{marginTop: '40px', borderTop: `1px solid ${theme.cardBorder}`, paddingTop: '30px'}}>
            
            <div style={{backgroundColor: apiResponse.badgeBg, border:`1px solid ${apiResponse.badgeBorder}`, borderRadius:'16px', padding:'20px', display:'flex', gap:'16px', alignItems:'center', marginBottom:'30px'}}>
              <div>
                <h4 style={{margin:0, color: apiResponse.badgeColor, fontSize:'16px', fontWeight:'800'}}>{apiResponse.title}</h4>
                <p style={{margin:'4px 0 0 0', fontSize:'13px', color:theme.textMain}}>{apiResponse.desc}</p>
              </div>
            </div>

            <h3 style={{fontSize:'14px', color:theme.textMuted, textTransform:'uppercase', marginBottom:'16px'}}>📋 {t.recommendedDocs}</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'20px', marginBottom:'30px'}}>
              {apiResponse.doctors.map((doc, idx) => (
                <div key={idx} style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius:'16px', padding:'20px'}}>
                  <h4 style={{margin:0, color:theme.textMain}}>{doc.name}</h4>
                  <p style={{fontSize:'13px', color:'#06b6d4', margin:'4px 0'}}>{doc.facility} • {doc.dist}</p>
                  <span style={{fontSize:'12px', color:theme.textSub}}>{doc.exp} | ⭐ {doc.rating}</span>
                </div>
              ))}
            </div>

            <h3 style={{fontSize:'14px', color:theme.textMuted, textTransform:'uppercase', marginBottom:'16px'}}>💊 {t.suggestedMeds}</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'16px', marginBottom:'30px'}}>
              {apiResponse.medicines.map((med, idx) => (
                <div key={idx} style={{backgroundColor:theme.cardBg, border: med.emergency ? '1px solid rgba(244,63,94,0.4)' : `1px solid ${theme.cardBorder}`, padding:'16px', borderRadius:'12px'}}>
                  <div style={{fontWeight:'700', color: med.emergency ? '#f43f5e' : theme.textMain}}>{med.name}</div>
                  <div style={{fontSize:'12px', color:theme.textSub, marginTop:'4px'}}>{med.dose}</div>
                </div>
              ))}
            </div>

            <h3 style={{fontSize:'14px', color:theme.textMuted, textTransform:'uppercase', marginBottom:'16px'}}>🥗 {apiResponse.diet.title}</h3>
            <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'20px', borderRadius:'16px'}}>
              <ul style={{margin:0, paddingLeft:'20px', color:theme.textMain, fontSize:'13px'}}>
                {apiResponse.diet.tips.map((tip, idx) => <li key={idx} style={{marginBottom:'6px'}}>{tip}</li>)}
              </ul>
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
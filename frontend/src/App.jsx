import { useState } from 'react';

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
    errorText: "Please select at least one symptom",
    recommendedDocs: "Recommended Doctors",
    suggestedMeds: "Suggested Medicines",
    dietCare: "Diet & Home Care",
    disclaimer: "⚕️ AyuRoute AI provides general health guidance only. Always consult a qualified doctor. In emergency, call 108 immediately.",
    callNow: "Call Now",
    viewMap: "View Map"
  },
  hi: {
    brand: "आयुRoute AI",
    subBrand: "स्मार्ट हेल्थ नेविगेशन",
    navBadge: "एआई-संचालित स्वास्थ्य नेविगेशन",
    tagline: "अपने लक्षणों को आवाज या टेक्स्ट द्वारा बताएं। तुरंत डॉक्टर रेफरल, दवा के सुझाव और आपातकालीन मार्गदर्शन प्राप्त करें।",
    micText: "माइक दबाएं और लक्षण बोलें",
    inputPlaceholder: "या यहाँ लक्षण टाइप करें...",
    categoryLabel: "नीचे दी गई श्रेणियों से लक्षण चुनें",
    getGuidance: "स्वास्थ्य मार्गदर्शन प्राप्त करें",
    errorText: "कृपया कम से कम एक लक्षण चुनें",
    recommendedDocs: "अनुशंसित डॉक्टर",
    suggestedMeds: "सुझाई गई दवाएं",
    dietCare: "आहार और घरेलू देखभाल",
    disclaimer: "⚕️ आयुRoute AI केवल सामान्य स्वास्थ्य मार्गदर्शन प्रदान करता है। हमेशा एक योग्य doctor से परामर्श करें। आपातकाल में, तुरंत 108 पर कॉल करें।",
    callNow: "अभी कॉल करें",
    viewMap: "मैप देखें"
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(true); // Theme Toggle State
  const [activeCategory, setActiveCategory] = useState('Emergency');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);
  const [textInput, setTextInput] = useState('');

  const t = DICT[lang];

  const CATEGORIES = [
    { id: 'Emergency', label: { en: 'Emergency', hi: 'आपातकाल' }, icon: '🚨' },
    { id: 'Respiratory', label: { en: 'Respiratory', hi: 'श्वसन' }, icon: '💨' },
    { id: 'Fever', label: { en: 'Fever & Infection', hi: 'बुखार और संक्रमण' }, icon: '🌡️' },
    { id: 'Heart', label: { en: 'Heart & Chest', hi: 'हृदय और छाती' }, icon: '🫀' },
    { id: 'Neurological', label: { en: 'Neurological', hi: 'न्यूरोलॉजिकल' }, icon: '🧠' },
    { id: 'Digestive', label: { en: 'Digestive', hi: 'पाचन' }, icon: '🧬' }
  ];

  const SYMPTOMS_MAP = {
    Emergency: [
      { id: 'e1', name: { en: 'Severe Chest Pain', hi: 'सीने में तेज़ दर्द' } },
      { id: 'e2', name: { en: 'Cannot Breathe', hi: 'सांस लेने में असमर्थ' } },
      { id: 'e3', name: { en: 'Loss of Consciousness', hi: 'बेहोशी' } },
      { id: 'e4', name: { en: 'Stroke Symptoms', hi: 'स्ट्रोक के लक्षण' } },
      { id: 'e5', name: { en: 'Uncontrolled Bleeding', hi: 'अनियंत्रित रक्तस्राv' } }
    ],
    Respiratory: [
      { id: 'r1', name: { en: 'Continuous Coughing', hi: 'लगातार खांसी' } },
      { id: 'r2', name: { en: 'Loss of Taste / Smell', hi: 'स्वाद/गंध की कमी' } }
    ],
    Fever: [
      { id: 'f1', name: { en: 'High Fever (>101°F)', hi: 'तेज़ बुखार' } },
      { id: 'f2', name: { en: 'Chills & Shivering', hi: 'कंपकंपी' } }
    ],
    Heart: [{ id: 'h1', name: { en: 'Palpitations', hi: 'घबराहट' } }],
    Neurological: [{ id: 'n1', name: { en: 'Severe Dizziness', hi: 'चक्कर आना' } }],
    Digestive: [{ id: 'd1', name: { en: 'Acute Stomach Pain', hi: 'पेट में मरोड़' } }]
  };

  const handleSymptomToggle = (symptomName) => {
    setShowError(false);
    if (selectedSymptoms.includes(symptomName)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomName));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomName]);
    }
  };

  const processTriageSubmit = () => {
    if (selectedSymptoms.length === 0 && !textInput) {
      setShowError(true);
      setShowResults(false);
    } else {
      setShowError(false);
      setShowResults(true);
    }
  };

  const clearAllSymptoms = () => {
    setSelectedSymptoms([]);
    setTextInput('');
    setShowResults(false);
    setShowError(false);
  };

  // Theme Palette Variable Definitions
  const theme = {
    bg: isDarkMode ? '#030712' : '#f8fafc',
    textMain: isDarkMode ? '#ffffff' : '#0f172a',
    textSub: isDarkMode ? '#94a3b8' : '#475569',
    textMuted: isDarkMode ? '#475569' : '#94a3b8',
    cardBg: isDarkMode ? 'rgba(15,23,42,0.3)' : 'rgba(255,255,255,0.9)',
    cardBorder: isDarkMode ? 'rgba(30,41,59,0.7)' : 'rgba(226,232,240,0.9)',
    innerInput: isDarkMode ? '#030712' : '#ffffff',
    innerInputBorder: isDarkMode ? '#1e293b' : '#cbd5e1',
    bottomBox: isDarkMode ? '#020617' : '#f1f5f9',
    bottomBoxBorder: isDarkMode ? '#1e293b' : '#e2e8f0'
  };

  const s = {
    container: { backgroundColor: theme.bg, color: theme.textSub, minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '60px', transition: 'all 0.25s ease' },
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 30px 0' },
    brandWrapper: { display: 'flex', alignItems: 'center', gap: '14px' },
    logo: { height: '44px', width: '44px', borderRadius: '50%', backgroundColor: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' },
    topActionRow: { display: 'flex', gap: '10px', alignItems: 'center' },
    themeBtn: { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: theme.textMain, fontSize: '13px', fontWeight: '600', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${theme.innerInputBorder}`, cursor: 'pointer' },
    langBtn: { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: theme.textMain, fontSize: '13px', fontWeight: '600', padding: '10px 20px', borderRadius: '12px', border: `1px solid ${theme.innerInputBorder}`, cursor: 'pointer' },
    hero: { textAlign: 'center', marginBottom: '48px' },
    badge: { display: 'inline-block', backgroundColor: 'rgba(6,182,212,0.06)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '30px', padding: '6px 18px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' },
    mainTitle: { fontSize: '48px', fontWeight: '900', color: theme.textMain, margin: '0 0 16px 0', letterSpacing: '-0.025em' },
    tagline: { fontSize: '15px', color: theme.textSub, maxWidth: '720px', margin: '0 auto', lineHeight: '1.6' },
    searchSection: { backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '32px', display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '36px', boxShadow: isDarkMode ? '0 10px 30px -10px rgba(0,0,0,0.7)' : '0 10px 25px -10px rgba(0,0,0,0.05)' },
    micBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px' },
    micBtn: { height: '64px', width: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #10b981)', border: 'none', color: '#fff', fontSize: '26px', cursor: 'pointer', boxShadow: '0 0 20px rgba(6,182,212,0.35)' },
    input: { width: '100%', backgroundColor: theme.innerInput, border: `1px solid ${theme.innerInputBorder}`, borderRadius: '14px', padding: '16px 20px', fontSize: '15px', color: theme.textMain, outline: 'none', boxSizing: 'border-box' },
    catGrid: { display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-start', marginBottom: '28px' },
    catBtn: (isActive) => ({ padding: '12px 22px', fontSize: '13px', fontWeight: '600', borderRadius: '14px', cursor: 'pointer', border: isActive ? '1px solid rgba(6,182,212,0.5)' : `1px solid ${theme.cardBorder}`, backgroundColor: isActive ? 'rgba(6,182,212,0.12)' : theme.cardBg, color: isActive ? '#06b6d4' : theme.textSub, display: 'flex', alignItems: 'center', gap: '8px' }),
    symGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
    symCard: (isSelected) => ({ padding: '20px', borderRadius: '16px', border: isSelected ? '1px solid #06b6d4' : `1px solid ${theme.cardBorder}`, backgroundColor: isSelected ? 'rgba(6,182,212,0.04)' : theme.cardBg, textAlign: 'left', cursor: 'pointer', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }),
    submitBtn: { background: 'linear-gradient(90deg, #06b6d4, #10b981)', color: '#fff', border: 'none', fontWeight: '800', fontSize: '15px', padding: '16px 40px', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(6,182,212,0.25)', display: 'block', margin: '32px auto' },
    pill: { display: 'inline-block', backgroundColor: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', padding: '3px 10px', fontSize: '10px', fontWeight: '700', borderRadius: '6px', textTransform: 'uppercase', width: 'fit-content' },
    summaryBox: { backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '16px', padding: '20px', marginBottom: '24px' }
  };

  return (
    <div style={s.container}>
      <div style={s.wrapper}>
        
        {/* Responsive Navbar Row */}
        <header style={s.header}>
          <div style={s.brandWrapper}>
            <div style={s.logo}>🩺</div>
            <div>
              <h1 style={{fontSize:'20px', fontWeight:'900', color:theme.textMain, margin:0}}>{t.brand}</h1>
              <p style={{fontSize:'12px', color:theme.textMuted, margin:0, fontWeight: '500'}}>{t.subBrand}</p>
            </div>
          </div>
          <div style={s.topActionRow}>
            {/* Theme Toggle Button switcher */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={s.themeBtn}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={s.langBtn}>
              🌐 {lang === 'en' ? 'English' : 'हिन्दी'}
            </button>
          </div>
        </header>

        {/* Hero Meta segment */}
        <div style={s.hero}>
          <div style={s.badge}>{t.navBadge}</div>
          <h2 style={s.mainTitle}>{t.brand}</h2>
          <p style={s.tagline}>{t.tagline}</p>
        </div>

        {/* Dynamic Theme Controlled Input Dashboard Box */}
        <div style={s.searchSection}>
          <div style={s.micBlock}>
            <button style={s.micBtn}>🎤</button>
            <div style={{fontSize:'11px', color:theme.textSub, fontWeight:'700', textAlign:'center'}}>{t.micText}</div>
          </div>
          <div style={{width:'100%'}}>
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                if(e.target.value && selectedSymptoms.length === 0) setSelectedSymptoms([e.target.value]);
              }}
              placeholder={t.inputPlaceholder} 
              style={s.input} 
            />
            <div style={{fontSize:'12px', color:theme.textMuted, fontWeight:'700', marginTop:'12px'}}>{t.categoryLabel}</div>
          </div>
        </div>

        {/* Category filter pills row layout */}
        <div style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              style={s.catBtn(activeCategory === cat.id)}
            >
              {cat.icon} {cat.label[lang]}
            </button>
          ))}
        </div>

        {/* Structured Symton grid */}
        <div style={s.symGrid}>
          {SYMPTOMS_MAP[activeCategory]?.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.name[lang]);
            return (
              <div 
                key={symptom.id} 
                onClick={() => handleSymptomToggle(symptom.name[lang])}
                style={s.symCard(isSelected)}
              >
                <div style={s.pill}>{activeCategory === 'Emergency' ? 'emergency' : 'symptom'}</div>
                <div style={{fontSize:'14px', fontWeight:'700', color:theme.textMain, marginTop:'14px'}}>{symptom.name[lang]}</div>
              </div>
            );
          })}
        </div>

        {/* Selection Tag Hub Tray */}
        {selectedSymptoms.length > 0 && (
          <div style={s.summaryBox}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:theme.textSub, fontWeight:'700', marginBottom:'12px'}}>
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
          <div style={{backgroundColor:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', color:'#f43f5e', padding:'14px', borderRadius:'14px', fontSize:'13px', fontWeight:'700', textAlign:'center', marginBottom:'20px'}}>
            {t.errorText}
          </div>
        )}

        <button onClick={processTriageSubmit} style={s.submitBtn}>
          🛡️ {t.getGuidance}
        </button>

        {/* Diagnostics & Referrals Block with adaptive mode style mappings */}
        {showResults && (
          <div style={{marginTop: '48px', borderTop: `1px solid ${theme.cardBorder}`, paddingTop: '40px'}}>
            
            <div style={{backgroundColor:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'20px', padding:'24px', display:'flex', gap:'18px', alignItems:'center', marginBottom:'40px'}}>
              <div style={{fontSize:'28px'}}>🛡️</div>
              <div>
                <h4 style={{margin:0, color:'#10b981', fontSize:'16px', fontWeight:'800'}}>Mild — Home Care May Help</h4>
                <p style={{margin:'4px 0 0 0', color:theme.textSub, fontSize:'12px', fontWeight:'600'}}>Clinical navigation matrix successfully synthesized based on user parameters.</p>
              </div>
            </div>

            <h3 style={{fontSize:'13px', fontWeight:'900', color:theme.textMuted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'20px'}}>📋 {t.recommendedDocs}</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'20px', marginBottom:'40px'}}>
              
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius:'20px', padding:'24px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                  <div>
                    <h4 style={{margin:0, color:theme.textMain, fontSize:'16px', fontWeight:'700'}}>Dr. Rajesh Kumar</h4>
                    <p style={{margin:'4px 0 0 0', color:'#06b6d4', fontSize:'12px', fontWeight:'700'}}>General Physician</p>
                  </div>
                  <span style={{backgroundColor:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:'11px', padding:'3px 8px', borderRadius:'6px', fontWeight:'700'}}>Available</span>
                </div>
                <p style={{fontSize:'12px', color:theme.textSub, margin:'16px 0'}}>📍 Fortis Healthcare • 0.8 km away &nbsp;|&nbsp; ⭐ 4.7 Rating &nbsp;|&nbsp; 12 Yrs Exp</p>
                <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
                  <button style={{flex:1, backgroundColor:theme.innerInput, border:`1px solid ${theme.innerInputBorder}`, padding:'10px', color:theme.textMain, borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>{t.callNow}</button>
                  <button style={{flex:1, backgroundColor:theme.innerInput, border:`1px solid ${theme.innerInputBorder}`, padding:'10px', color:theme.textMain, borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>{t.viewMap}</button>
                </div>
              </div>

              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius:'20px', padding:'24px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                  <div>
                    <h4 style={{margin:0, color:theme.textMain, fontSize:'16px', fontWeight:'700'}}>Dr. Sunita Agarwal</h4>
                    <p style={{margin:'4px 0 0 0', color:'#06b6d4', fontSize:'12px', fontWeight:'700'}}>Internal Medicine</p>
                  </div>
                  <span style={{backgroundColor:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:'11px', padding:'3px 8px', borderRadius:'6px', fontWeight:'700'}}>Available</span>
                </div>
                <p style={{fontSize:'12px', color:theme.textSub, margin:'16px 0'}}>📍 Medanta Hospital • 2.5 km away &nbsp;|&nbsp; ⭐ 4.7 Rating &nbsp;|&nbsp; 14 Yrs Exp</p>
                <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
                  <button style={{flex:1, backgroundColor:theme.innerInput, border:`1px solid ${theme.innerInputBorder}`, padding:'10px', color:theme.textMain, borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>{t.callNow}</button>
                  <button style={{flex:1, backgroundColor:theme.innerInput, border:`1px solid ${theme.innerInputBorder}`, padding:'10px', color:theme.textMain, borderRadius:'10px', fontSize:'12px', fontWeight:'700', cursor:'pointer'}}>{t.viewMap}</button>
                </div>
              </div>

            </div>

            {/* Medicines Box layout Grid adaptive mapping */}
            <h3 style={{fontSize:'13px', fontWeight:'900', color:theme.textMuted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'20px'}}>💊 {t.suggestedMeds}</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'40px'}}>
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'18px', borderRadius:'16px'}}>
                <div style={{fontSize:'13px', fontWeight:'700', color:theme.textMain}}>💊 Paracetamol 500mg</div>
                <p style={{fontSize:'12px', color:'#06b6d4', margin:'6px 0'}}>Dosage: 1 tablet every 6-8 hrs</p>
                <p style={{fontSize:'11px', color:'#f59e0b', margin:0, fontWeight:'600'}}>Warning: Max 4g/day. Avoid alcohol.</p>
              </div>
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'18px', borderRadius:'16px'}}>
                <div style={{fontSize:'13px', fontWeight:'700', color:theme.textMain}}>🔵 Cetirizine 10mg</div>
                <p style={{fontSize:'12px', color:'#06b6d4', margin:'6px 0'}}>Dosage: 1 tablet once daily at night</p>
                <p style={{fontSize:'11px', color:'#f59e0b', margin:0, fontWeight:'600'}}>Warning: May cause drowsiness.</p>
              </div>
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'18px', borderRadius:'16px'}}>
                <div style={{fontSize:'13px', fontWeight:'700', color:theme.textMain}}>🟣 Pantoprazole 40mg</div>
                <p style={{fontSize:'12px', color:'#06b6d4', margin:'6px 0'}}>Dosage: 1 tablet 30 min before meals</p>
                <p style={{fontSize:'11px', color:'#f59e0b', margin:0, fontWeight:'600'}}>Warning: Take before breakfast.</p>
              </div>
            </div>

            {/* Diet recommendations */}
            <h3 style={{fontSize:'13px', fontWeight:'900', color:theme.textMuted, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'20px'}}>🥗 {t.dietCare}</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'16px'}}>
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'20px', borderRadius:'16px', fontSize:'13px'}}>
                <p style={{fontSize:'14px', fontWeight:'700', color:theme.textMain, margin:'0 0 6px 0'}}>💧 Stay Hydrated</p>
                <p style={{color:theme.textSub, margin:0, lineHeight:'1.5'}}>Drink 8-10 glasses of water. Add ORS, coconut water, or lemon water to replenish electrolytes rapidly.</p>
              </div>
              <div style={{backgroundColor:theme.cardBg, border: `1px solid ${theme.cardBorder}`, padding:'20px', borderRadius:'16px', fontSize:'13px'}}>
                <p style={{fontSize:'14px', fontWeight:'700', color:theme.textMain, margin:'0 0 6px 0'}}>🍲 Eat More Of</p>
                <p style={{color:theme.textSub, margin:0, lineHeight:'1.5'}}>Khichdi, dal-chawal, curd, bananas, boiled vegetables, ginger-turmeric tea, and clear soups.</p>
              </div>
            </div>

          </div>
        )}

        {/* Global Compliance System Layer */}
        <div style={{backgroundColor:theme.bottomBox, border: `1px solid ${theme.bottomBoxBorder}`, borderRadius:'12px', padding:'16px', textAlign:'center', fontSize:'11px', color:'#b45309', fontWeight:'600', marginTop:'50px'}}>
          {t.disclaimer}
        </div>

      </div>
    </div>
  );
}

export default App;
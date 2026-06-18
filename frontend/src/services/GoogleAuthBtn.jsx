import { useState } from "react";
import { logoutWithGoogle, signInWithGoogle } from "./firebase";

export default function GoogleAuthBtn({ onLogin, onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && onLogin) {
        onLogin({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Google Sign-In failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutWithGoogle();
    if (onLogout) onLogout();
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={handleSignIn}
        disabled={loading}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', opacity: loading ? 0.7 : 1 }}
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
        {loading ? 'Opening Google...' : 'Continue with Google'}
      </button>
    </div>
  );
}
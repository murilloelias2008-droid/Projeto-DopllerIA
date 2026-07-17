"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("matheus@clearit.com.br");
  const [password, setPassword] = useState("admin");
  const [geminiKey, setGeminiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas");
      }

      // Save session info
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Save API key if provided
      if (geminiKey.trim()) {
        localStorage.setItem("geminiApiKey", geminiKey.trim());
      } else {
        localStorage.removeItem("geminiApiKey");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlowPurple}></div>
      <div style={styles.bgGlowCyan}></div>

      <div className="glass-panel animate-fade-in" style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>D</div>
          <h1 style={styles.title} className="glow-text-purple">Doppler IA</h1>
          <p style={styles.subtitle}>Pulse Sales Copilot</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email">Email do Analista</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@clearit.com.br"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Configuração de IA (Opcional)</span>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="geminiKey">Chave de API Gemini</label>
            <input
              id="geminiKey"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy... (Deixe em branco para usar Simulação)"
            />
            <small style={styles.helpText}>
              Se deixado em branco, a plataforma rodará no modo de simulação cognitiva de alta fidelidade.
            </small>
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? "Autenticando..." : "Entrar no Workspace"}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Clear IT Pre-Sales Assistant v1.0</span>
          <span style={{ margin: "0 10px", color: "#6b7280" }}>|</span>
          <a href="/sobre" style={{ color: "var(--accent-cyan)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-cyan)"}>Sobre o Projeto</a>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    padding: "20px"
  },
  bgGlowPurple: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)",
    top: "20%",
    left: "15%",
    zIndex: 0,
    pointerEvents: "none"
  },
  bgGlowCyan: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(6, 180, 212, 0.12) 0%, rgba(0,0,0,0) 70%)",
    bottom: "10%",
    right: "15%",
    zIndex: 0,
    pointerEvents: "none"
  },
  loginCard: {
    width: "100%",
    maxWidth: "460px",
    zIndex: 10,
    position: "relative",
    padding: "40px"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  logoBadge: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    boxShadow: "0 4px 20px rgba(168, 85, 247, 0.4)"
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: "4px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#9ca3af",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column"
  },
  submitBtn: {
    marginTop: "10px",
    height: "46px"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "20px",
    fontWeight: 500
  },
  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "15px 0 5px 0"
  },
  dividerText: {
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    width: "100%"
  },
  helpText: {
    color: "#6b7280",
    fontSize: "11px",
    marginTop: "4px",
    lineHeight: "1.4"
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 500
  }
};

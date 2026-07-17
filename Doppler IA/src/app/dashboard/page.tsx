"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BriefingListItem {
  id: string;
  title: string;
  opportunity_id: string;
  customer_name: string;
  status: string;
  source: string;
  created_at: string;
  version: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [briefings, setBriefings] = useState<BriefingListItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isSimulated, setIsSimulated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states for new opportunity
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newSegment, setNewSegment] = useState("Saúde");
  const [newSource, setNewSource] = useState("email");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const geminiKey = localStorage.getItem("geminiApiKey");

    if (!token || !storedUser) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(storedUser));
    setIsSimulated(!geminiKey);
    fetchBriefings();
  }, [router]);

  const fetchBriefings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/briefings");
      if (!res.ok) throw new Error("Erro ao buscar briefings.");
      const data = await res.json();
      // Sort by newest first
      data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setBriefings(data);
    } catch (err: any) {
      setError(err.message || "Erro de carregamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("geminiApiKey");
    router.push("/");
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/v1/briefings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newTitle,
          clientName: newClient || "Cliente Avulso",
          segment: newSegment,
          source: newSource,
          content: newContent
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar oportunidade.");

      // Close modal and clear form
      setShowModal(false);
      setNewTitle("");
      setNewClient("");
      setNewContent("");

      // Redirect immediately to the workspace for the newly created briefing!
      router.push(`/briefing/${data.id}`);
    } catch (err: any) {
      alert(err.message || "Falha na criação.");
    } finally {
      setCreating(false);
    }
  };

  // Metrics calculation
  const totalOpps = briefings.length;
  const completedOpps = briefings.filter(b => b.status === "COMPLETED").length;
  const activeOpps = totalOpps - completedOpps;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return <span className="badge badge-purple">Recebido</span>;
      case "DISCOVERY":
        return <span className="badge badge-cyan">Discovery</span>;
      case "QUALIFICATION":
        return <span className="badge badge-amber">Qualificação</span>;
      case "RECOMMENDATION":
        return <span className="badge badge-cyan">Recomendação</span>;
      case "REVIEW":
        return <span className="badge badge-amber font-semibold">Revisão</span>;
      case "COMPLETED":
        return <span className="badge badge-green">Concluído</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={styles.dashboardContainer} className="animate-fade-in">
      {/* Header Bar */}
      <header style={styles.headerBar} className="glass-panel">
        <div style={styles.headerLeft}>
          <div style={styles.logoBadgeSmall}>D</div>
          <div>
            <h1 style={styles.headerTitle}>Doppler IA</h1>
            <p style={styles.headerSubtitle}>Pulse Sales Copilot Workspace</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.statusBox}>
            {isSimulated ? (
              <span className="badge badge-amber" title="Sem chave API. Utilizando respostas heurísticas simuladas.">
                ● Modo Simulação (Mock)
              </span>
            ) : (
              <span className="badge badge-green" title="Conexão direta ativa com o modelo Gemini.">
                ● API Gemini Conectada
              </span>
            )}
          </div>

          {user && (
            <div style={styles.userProfile}>
              <div style={styles.avatar}>{user.name.charAt(0)}</div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userRole}>{user.role}</span>
              </div>
            </div>
          )}

          <a href="/sobre" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px' }}>
            Sobre
          </a>

          <button onClick={handleLogout} className="btn-secondary" style={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main style={styles.mainLayout}>
        {/* KPI Panel */}
        <section style={styles.kpiGrid}>
          <div className="glass-panel" style={styles.kpiCard}>
            <span style={styles.kpiLabel}>Total Oportunidades</span>
            <span style={styles.kpiValue} className="glow-text-purple">{totalOpps}</span>
            <span style={styles.kpiTrend}>Ativas: {activeOpps}</span>
          </div>

          <div className="glass-panel" style={styles.kpiCard}>
            <span style={styles.kpiLabel}>Briefings Concluídos</span>
            <span style={styles.kpiValue} className="glow-text-cyan">{completedOpps}</span>
            <span style={styles.kpiTrend}>Taxa de Qualificação: {totalOpps > 0 ? Math.round((completedOpps / totalOpps) * 100) : 0}%</span>
          </div>

          <div className="glass-panel" style={styles.kpiCardAction} onClick={() => setShowModal(true)}>
            <div style={styles.actionIcon}>+</div>
            <span style={styles.actionText}>Qualificar Nova Oportunidade</span>
            <span style={styles.actionSubtext}>Importe briefings por e-mail, chat ou manual</span>
          </div>
        </section>

        {/* Opportunities List Panel */}
        <section className="glass-panel" style={styles.listPanel}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>Pipeline de Qualificações</h2>
            <button onClick={fetchBriefings} className="btn-secondary" style={styles.refreshBtn}>
              ↻ Atualizar
            </button>
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          {loading ? (
            <div style={styles.loadingPlaceholder}>Carregando oportunidades comerciais...</div>
          ) : briefings.length === 0 ? (
            <div style={styles.emptyPlaceholder}>
              <h3>Nenhuma oportunidade encontrada</h3>
              <p>Comece criando uma nova qualificação técnica usando o botão acima.</p>
            </div>
          ) : (
            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Cliente / Oportunidade</th>
                    <th style={styles.th}>Origem</th>
                    <th style={styles.th}>Data de Cadastro</th>
                    <th style={styles.th}>Status de Qualificação</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {briefings.map((b) => (
                    <tr 
                      key={b.id} 
                      style={styles.tr} 
                      onClick={() => router.push(`/briefing/${b.id}`)}
                    >
                      <td style={styles.td}>
                        <div style={styles.oppInfoCell}>
                          <span style={styles.oppCustomer}>{b.customer_name}</span>
                          <span style={styles.oppTitle}>{b.title}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.sourceText}>
                          {b.source === "email" ? "✉ Email" : b.source === "WhatsApp" ? "💬 WhatsApp" : "📝 Manual"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(b.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </td>
                      <td style={styles.td}>
                        {getStatusBadge(b.status)}
                      </td>
                      <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => router.push(`/briefing/${b.id}`)} 
                          className="btn-primary" 
                          style={styles.actionRowBtn}
                        >
                          Acessar Workspace →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Creation Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div 
            className="glass-panel" 
            style={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Nova Oportunidade de Pré-Vendas</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateOpportunity} style={styles.modalForm}>
              <div style={styles.formRow}>
                <div style={styles.formCol}>
                  <label>Nome do Cliente</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="Ex: Hospital São Lucas"
                    required
                  />
                </div>
                <div style={styles.formCol}>
                  <label>Setor/Indústria</label>
                  <select 
                    value={newSegment} 
                    onChange={(e) => setNewSegment(e.target.value)}
                  >
                    <option value="Saúde">Saúde / Hospitalar</option>
                    <option value="Varejo">Varejo / E-commerce</option>
                    <option value="Financeiro">Financeiro / Fintechs</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Educação">Educação</option>
                    <option value="Serviços">Outros Serviços</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formCol}>
                  <label>Título da Oportunidade</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Migração Cloud e Segurança SOC"
                    required
                  />
                </div>
                <div style={styles.formCol}>
                  <label>Canal de Origem</label>
                  <select 
                    value={newSource} 
                    onChange={(e) => setNewSource(e.target.value)}
                  >
                    <option value="email">E-mail</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="manual">Manual / Reunião</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroupFull}>
                <label>Briefing Bruto (Unstructured Text)</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Cole o e-mail recebido, anotações de reunião ou transcrição de áudio do comercial..."
                  rows={8}
                  required
                ></textarea>
                <small style={styles.textareaHelp}>
                  Cole toda a informação disponível do cliente. Nossos agentes de IA estruturarão esses dados nas fases de Discovery e Qualificação.
                </small>
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={creating}
                >
                  {creating ? "Criando Oportunidade..." : "Iniciar Qualificação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    padding: "30px",
    maxWidth: "1300px",
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 30px"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  logoBadgeSmall: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(168, 85, 247, 0.3)"
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.01em"
  },
  headerSubtitle: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  statusBox: {
    display: "flex",
    alignItems: "center"
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    paddingLeft: "24px"
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#a855f7",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "15px"
  },
  userInfo: {
    display: "flex",
    flexDirection: "column"
  },
  userName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#f3f4f6"
  },
  userRole: {
    fontSize: "11px",
    color: "#9ca3af"
  },
  logoutBtn: {
    padding: "8px 16px"
  },
  mainLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px"
  },
  kpiCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  kpiCardAction: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed rgba(168, 85, 247, 0.3)",
    background: "rgba(168, 85, 247, 0.03)",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    transition: "all 0.2s ease"
  },
  actionIcon: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#c084fc",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(168, 85, 247, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px"
  },
  actionText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#f3f4f6",
    marginBottom: "4px"
  },
  actionSubtext: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  kpiLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#9ca3af",
    fontWeight: 600,
    marginBottom: "8px"
  },
  kpiValue: {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: "4px"
  },
  kpiTrend: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500
  },
  listPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700
  },
  refreshBtn: {
    padding: "6px 12px",
    fontSize: "13px"
  },
  errorText: {
    color: "#ef4444",
    fontSize: "14px"
  },
  loadingPlaceholder: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
    fontSize: "14px"
  },
  emptyPlaceholder: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9ca3af"
  },
  tableResponsive: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  th: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#9ca3af",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },
  td: {
    padding: "16px 20px",
    verticalAlign: "middle",
    fontSize: "14px"
  },
  oppInfoCell: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  oppCustomer: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#a855f7",
    textTransform: "uppercase",
    letterSpacing: "0.02em"
  },
  oppTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#f3f4f6"
  },
  sourceText: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#9ca3af"
  },
  actionRowBtn: {
    padding: "6px 12px",
    fontSize: "12px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)"
  },
  modalContent: {
    width: "100%",
    maxWidth: "700px",
    padding: "30px",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: "16px"
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: 700
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    fontSize: "24px",
    cursor: "pointer",
    transition: "color 0.2s ease"
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formRow: {
    display: "flex",
    gap: "20px"
  },
  formCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  formGroupFull: {
    display: "flex",
    flexDirection: "column"
  },
  textareaHelp: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "4px",
    lineHeight: "1.4"
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "20px",
    marginTop: "10px"
  }
};

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface QuestionItem {
  id: string;
  qualification_id: string;
  category: string;
  priority: string;
  text: string;
  rationale: string;
  status: "PENDING" | "ANSWERED";
}

interface AnswerItem {
  id: string;
  question_id: string;
  answer: string;
  author: string;
  answered_at: string;
}

interface RecommendationItem {
  id: string;
  portfolio_item_id: string;
  product: string;
  service: string;
  confidence: number;
  justification: string;
  risks: string;
}

interface BriefingData {
  briefing: {
    id: string;
    opportunity_id: string;
    raw_content: string;
    normalized_content: string;
    language: string;
    source: string;
    confidence: number;
    created_at: string;
  };
  opportunity: {
    id: string;
    customer_id: string;
    title: string;
    description: string;
    status: string;
    owner_id: string;
    created_at: string;
  };
  customer: {
    id: string;
    name: string;
    segment: string;
    industry: string;
  };
  discovery: {
    id: string;
    problem: string;
    objectives: string[];
    stakeholders: string[];
    constraints: string[];
    assumptions: string[];
    summary: string;
  } | null;
  qualification: {
    id: string;
    completeness_score: number;
    confidence_score: number;
    quality_score: number;
    status: string;
  } | null;
  questions: QuestionItem[];
  answers: AnswerItem[];
  recommendations: RecommendationItem[];
  finalBriefing: {
    executive_summary: string;
    context: string;
    requirements: string[];
    recommendations: { product: string; justification: string }[];
    next_steps: string[];
    exported_at: string;
  } | null;
}

type TabType = "discovery" | "qualification" | "portfolio" | "document";

export default function BriefingWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const briefingId = params.id as string;

  const [data, setData] = useState<BriefingData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("discovery");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Interaction states
  const [actionLoading, setActionLoading] = useState(false);
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWorkspaceData();
  }, [briefingId]);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    const geminiKey = localStorage.getItem("geminiApiKey");
    if (geminiKey) {
      headers["Authorization"] = `Bearer ${geminiKey}`;
    }
    return headers;
  };

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/briefings/${briefingId}`);
      if (!res.ok) throw new Error("Erro ao carregar dados do workspace.");
      const briefingData = await res.json();
      setData(briefingData);

      // Default active tab based on status progression
      const status = briefingData.opportunity?.status;
      if (status === "RECEIVED") {
        setActiveTab("discovery");
      } else if (status === "DISCOVERY") {
        setActiveTab("qualification");
      } else if (status === "QUALIFICATION") {
        setActiveTab("qualification");
      } else if (status === "RECOMMENDATION") {
        setActiveTab("portfolio");
      } else if (status === "REVIEW" || status === "COMPLETED") {
        setActiveTab("document");
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Run Discovery Agent
  const handleRunDiscovery = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/briefings/${briefingId}/discovery`, {
        method: "POST",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao executar Discovery Agent.");
      await fetchWorkspaceData();
      setActiveTab("qualification");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Run Qualification Agent
  const handleRunQualification = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/briefings/${briefingId}/qualification`, {
        method: "POST",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao executar Qualification Agent.");
      await fetchWorkspaceData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Submit Question Answer
  const handleSubmitAnswer = async (questionId: string) => {
    const text = answerTexts[questionId];
    if (!text || !text.trim()) return;

    setAnsweringQuestionId(questionId);
    try {
      const res = await fetch(`/api/v1/briefings/${briefingId}/questions/${questionId}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          answerText: text,
          author: "usr-1"
        })
      });

      if (!res.ok) throw new Error("Erro ao enviar resposta.");
      
      // Update local answers in data instead of full reload to keep scroll/state
      await fetchWorkspaceData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAnsweringQuestionId(null);
    }
  };

  // 4. Run Portfolio Agent (RAG)
  const handleRunPortfolioMatching = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/briefings/${briefingId}/recommendations`, {
        method: "POST",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao executar RAG Portfolio Agent.");
      await fetchWorkspaceData();
      setActiveTab("portfolio");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Generate Final Structured Briefing
  const handleGenerateFinalBriefing = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/briefings/${briefingId}/generate`, {
        method: "POST",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao compilar documento final.");
      await fetchWorkspaceData();
      setActiveTab("document");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Export Functions
  const handleExport = (format: "pdf" | "docx") => {
    window.open(`/api/v1/briefings/${briefingId}/export/${format}`, "_blank");
  };

  if (loading) {
    return <div style={styles.loadingScreen}>Carregando ambiente multiagentes...</div>;
  }

  if (error || !data) {
    return (
      <div style={styles.errorScreen}>
        <h2>Erro ao acessar workspace</h2>
        <p>{error || "Dados indisponíveis."}</p>
        <button onClick={() => router.push("/dashboard")} className="btn-primary">Voltar ao Dashboard</button>
      </div>
    );
  }

  const { customer, opportunity, briefing, discovery, qualification, questions, answers, recommendations, finalBriefing } = data;

  return (
    <div style={styles.workspaceContainer} className="animate-fade-in">
      {/* Top Nav */}
      <header style={styles.topNav} className="glass-panel">
        <button onClick={() => router.push("/dashboard")} className="btn-secondary" style={styles.backBtn}>
          ← Painel Geral
        </button>
        <div style={styles.navInfo}>
          <span style={styles.navCustomer}>{customer?.name}</span>
          <h1 style={styles.navTitle}>{opportunity?.title}</h1>
        </div>
        <div style={styles.navStatus}>
          <span style={styles.navStatusLabel}>Status Oportunidade:</span>
          <span style={styles.statusGlow}>{opportunity?.status}</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div style={styles.splitLayout}>
        {/* Left Column: Briefing & Health Score */}
        <aside style={styles.leftCol}>
          {/* Briefing Text Panel */}
          <div className="glass-panel" style={styles.briefingPanel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Briefing do Cliente</h2>
              <span className="badge badge-purple" style={styles.sourceBadge}>{briefing?.source}</span>
            </div>
            <div style={styles.rawContentScroll}>
              <p style={styles.rawText}>{briefing?.raw_content}</p>
            </div>
          </div>

          {/* Scores Gauge */}
          <div className="glass-panel" style={styles.scorePanel}>
            <h3 style={styles.panelTitleSmall}>Indicadores de Qualificação</h3>
            
            <div style={styles.scoreGaugeList}>
              <div style={styles.gaugeItem}>
                <div style={styles.gaugeHeader}>
                  <span>Completude do Levantamento</span>
                  <span style={styles.gaugeValue}>{qualification?.completeness_score || 0}%</span>
                </div>
                <div style={styles.gaugeTrack}>
                  <div style={{ ...styles.gaugeBar, width: `${qualification?.completeness_score || 0}%`, background: "var(--accent-purple)" }}></div>
                </div>
              </div>

              <div style={styles.gaugeItem}>
                <div style={styles.gaugeHeader}>
                  <span>Confiabilidade do Modelo</span>
                  <span style={styles.gaugeValue}>{qualification?.confidence_score || 0}%</span>
                </div>
                <div style={styles.gaugeTrack}>
                  <div style={{ ...styles.gaugeBar, width: `${qualification?.confidence_score || 0}%`, background: "var(--accent-cyan)" }}></div>
                </div>
              </div>

              <div style={styles.gaugeItem}>
                <div style={styles.gaugeHeader}>
                  <span>Qualidade Global</span>
                  <span style={styles.gaugeValue}>{qualification?.quality_score || 0}%</span>
                </div>
                <div style={styles.gaugeTrack}>
                  <div style={{ ...styles.gaugeBar, width: `${qualification?.quality_score || 0}%`, background: "var(--accent-green)" }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Multiagent Interactive Board */}
        <main style={styles.rightCol} className="glass-panel">
          {/* Tabs header */}
          <nav style={styles.tabsHeader}>
            <button 
              onClick={() => setActiveTab("discovery")} 
              style={{ ...styles.tabBtn, ...(activeTab === "discovery" ? styles.tabBtnActive : {}) }}
              disabled={!discovery && opportunity?.status === "RECEIVED"}
            >
              1. Discovery Agent
            </button>
            <button 
              onClick={() => setActiveTab("qualification")} 
              style={{ ...styles.tabBtn, ...(activeTab === "qualification" ? styles.tabBtnActive : {}) }}
              disabled={!discovery}
            >
              2. Qualification (Q&A)
            </button>
            <button 
              onClick={() => setActiveTab("portfolio")} 
              style={{ ...styles.tabBtn, ...(activeTab === "portfolio" ? styles.tabBtnActive : {}) }}
              disabled={questions.length === 0}
            >
              3. Portfólio Match (RAG)
            </button>
            <button 
              onClick={() => setActiveTab("document")} 
              style={{ ...styles.tabBtn, ...(activeTab === "document" ? styles.tabBtnActive : {}) }}
              disabled={recommendations.length === 0}
            >
              4. Documento Estruturado
            </button>
          </nav>

          {/* Tab Content Panels */}
          <div style={styles.tabContentArea}>
            
            {/* 1. Discovery Agent Panel */}
            {activeTab === "discovery" && (
              <div style={styles.panelTransition}>
                {!discovery ? (
                  <div style={styles.agentStartBox}>
                    <div style={styles.agentAvatarPurple}>D</div>
                    <h3>Discovery Agent</h3>
                    <p style={styles.agentDesc}>
                      Este agente analisa o briefing bruto para extrair o problema central, objetivos, restrições regulatórias e premissas operacionais da oportunidade comercial.
                    </p>
                    <button onClick={handleRunDiscovery} className="btn-primary" disabled={actionLoading}>
                      {actionLoading ? "Processando Briefing..." : "Iniciar Análise do Briefing por IA"}
                    </button>
                  </div>
                ) : (
                  <div style={styles.agentOutputArea}>
                    <div style={styles.agentHeader}>
                      <span className="badge badge-purple">Discovery Concluído</span>
                      <button onClick={handleRunDiscovery} className="btn-secondary" style={styles.reRunBtn}>
                        Reanalisar Briefing
                      </button>
                    </div>

                    <div style={styles.extractedCard}>
                      <span style={styles.extractedLabel}>Dor / Problema Identificado</span>
                      <p style={styles.extractedText}>{discovery.problem}</p>
                    </div>

                    <div style={styles.splitExtracted}>
                      <div style={styles.extractedCardCol}>
                        <span style={styles.extractedLabel}>Objetivos do Cliente</span>
                        <ul style={styles.extractedList}>
                          {discovery.objectives.map((o, idx) => <li key={idx}>{o}</li>)}
                        </ul>
                      </div>
                      <div style={styles.extractedCardCol}>
                        <span style={styles.extractedLabel}>Stakeholders Mapeados</span>
                        <ul style={styles.extractedList}>
                          {discovery.stakeholders.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div style={styles.splitExtracted}>
                      <div style={styles.extractedCardCol}>
                        <span style={styles.extractedLabel}>Restrições (Constraints)</span>
                        <ul style={styles.extractedList}>
                          {discovery.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                      <div style={styles.extractedCardCol}>
                        <span style={styles.extractedLabel}>Premissas (Assumptions)</span>
                        <ul style={styles.extractedList}>
                          {discovery.assumptions.map((a, idx) => <li key={idx}>{a}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div style={styles.extractedCard}>
                      <span style={styles.extractedLabel}>Resumo da Oportunidade</span>
                      <p style={styles.extractedText}>{discovery.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Qualification Panel (Interactive Q&A Loop) */}
            {activeTab === "qualification" && (
              <div style={styles.panelTransition}>
                {questions.length === 0 ? (
                  <div style={styles.agentStartBox}>
                    <div style={styles.agentAvatarAmber}>Q</div>
                    <h3>Qualification Agent</h3>
                    <p style={styles.agentDesc}>
                      Este agente analisa a descoberta técnica para mapear inconsistências, lacunas e informações ausentes obrigatórias, gerando perguntas específicas divididas por categoria de risco.
                    </p>
                    <button onClick={handleRunQualification} className="btn-primary" disabled={actionLoading}>
                      {actionLoading ? "Mapeando Lacunas..." : "Gerar Perguntas de Qualificação"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={styles.agentHeader}>
                      <div>
                        <span className="badge badge-amber">Qualificação em Andamento</span>
                        <span style={styles.answersCounter}>
                          Respondidas: {questions.filter(q => q.status === "ANSWERED").length} de {questions.length}
                        </span>
                      </div>
                      <button onClick={handleRunQualification} className="btn-secondary" style={styles.reRunBtn}>
                        Regerar Perguntas
                      </button>
                    </div>

                    <div style={styles.questionsScrollArea}>
                      {questions.map((q) => {
                        const answerObj = answers.find(a => a.question_id === q.id);
                        return (
                          <div 
                            key={q.id} 
                            style={{ 
                              ...styles.questionCard, 
                              borderColor: q.status === "ANSWERED" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.06)",
                              background: q.status === "ANSWERED" ? "rgba(16, 185, 129, 0.02)" : "rgba(255,255,255,0.01)"
                            }}
                          >
                            <div style={styles.questionMeta}>
                              <span className={`badge ${q.category === "Segurança" ? "badge-red" : "badge-purple"}`}>{q.category}</span>
                              <span className={`badge ${q.priority === "HIGH" ? "badge-red" : "badge-amber"}`}>{q.priority}</span>
                              <span style={styles.rationaleLabel}>Importância: {q.rationale}</span>
                            </div>

                            <p style={styles.questionText}>{q.text}</p>

                            {q.status === "ANSWERED" ? (
                              <div style={styles.answerDisplay}>
                                <div style={styles.answerHeader}>
                                  <span style={styles.answerAuthor}>Matheus Silva (Pré-Vendas)</span>
                                  <span style={styles.answerDate}>
                                    {answerObj ? new Date(answerObj.answered_at).toLocaleDateString("pt-BR") : ""}
                                  </span>
                                </div>
                                <p style={styles.answerContent}>{answerObj?.answer}</p>
                              </div>
                            ) : (
                              <div style={styles.answerInputRow}>
                                <input
                                  type="text"
                                  placeholder="Digite a resposta do cliente ou informações adicionais..."
                                  value={answerTexts[q.id] || ""}
                                  onChange={(e) => setAnswerTexts({ ...answerTexts, [q.id]: e.target.value })}
                                  style={styles.answerInput}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSubmitAnswer(q.id);
                                  }}
                                />
                                <button
                                  onClick={() => handleSubmitAnswer(q.id)}
                                  className="btn-primary"
                                  style={styles.sendAnswerBtn}
                                  disabled={answeringQuestionId === q.id}
                                >
                                  {answeringQuestionId === q.id ? "Salvando..." : "Responder"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div style={styles.workflowNextBox}>
                      <p>Garantindo que todas as lacunas foram analisadas? O próximo passo é rodar o Matching com o Portfólio.</p>
                      <button onClick={handleRunPortfolioMatching} className="btn-primary" style={styles.nextFlowBtn}>
                        Avançar para Portfólio Match →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Portfolio Match Panel */}
            {activeTab === "portfolio" && (
              <div style={styles.panelTransition}>
                {recommendations.length === 0 ? (
                  <div style={styles.agentStartBox}>
                    <div style={styles.agentAvatarCyan}>P</div>
                    <h3>Portfolio Agent</h3>
                    <p style={styles.agentDesc}>
                      Este agente executa uma busca vetorial semântica (RAG) comparando o levantamento técnico qualificado com as soluções e produtos corporativos autorizados no portfólio da Clear IT.
                    </p>
                    <button onClick={handleRunPortfolioMatching} className="btn-primary" disabled={actionLoading}>
                      {actionLoading ? "Buscando Portfólio..." : "Executar Matching de Soluções"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={styles.agentHeader}>
                      <span className="badge badge-cyan">Soluções do Portfólio Recomendadas</span>
                      <button onClick={handleRunPortfolioMatching} className="btn-secondary" style={styles.reRunBtn}>
                        Recalcular Aderência
                      </button>
                    </div>

                    <div style={styles.recommendationsList}>
                      {recommendations.map((r) => (
                        <div key={r.id} style={styles.recCard}>
                          <div style={styles.recHeader}>
                            <div>
                              <h4 style={styles.recProduct}>{r.product}</h4>
                              <span style={styles.recService}>{r.service}</span>
                            </div>
                            <div style={styles.recScoreContainer}>
                              <span style={styles.recScoreLabel}>Confiança</span>
                              <span style={styles.recScoreValue} className="glow-text-cyan">
                                {Math.round(r.confidence * 100)}%
                              </span>
                            </div>
                          </div>

                          <div style={styles.recBody}>
                            <div style={styles.recInfoItem}>
                              <span style={styles.recLabel}>Justificativa de Aderência (RAG)</span>
                              <p style={styles.recText}>{r.justification}</p>
                            </div>
                            {r.risks && (
                              <div style={{ ...styles.recInfoItem, ...styles.badgeRedOutline }}>
                                <span style={styles.recLabelRed}>Riscos de Implantação</span>
                                <p style={styles.recTextRed}>{r.risks}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={styles.workflowNextBox}>
                      <p>As soluções recomendadas estão revisadas? Vamos compilar o levantamento técnico estruturado final.</p>
                      <button onClick={handleGenerateFinalBriefing} className="btn-primary" style={styles.nextFlowBtn}>
                        Compilar Briefing Estruturado Final →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Documento Estruturado Panel */}
            {activeTab === "document" && (
              <div style={styles.panelTransition}>
                {!finalBriefing ? (
                  <div style={styles.agentStartBox}>
                    <div style={styles.agentAvatarGreen}>B</div>
                    <h3>Briefing Generator Agent</h3>
                    <p style={styles.agentDesc}>
                      Este agente consolida a dor, requisitos, respostas das lacunas e soluções do portfólio, gerando o documento canônico estruturado de qualificação comercial da oportunidade.
                    </p>
                    <button onClick={handleGenerateFinalBriefing} className="btn-primary" disabled={actionLoading}>
                      {actionLoading ? "Compilando Documento..." : "Gerar Briefing Estruturado"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={styles.agentHeader}>
                      <span className="badge badge-green">Briefing Estruturado Pronto</span>
                      <div style={styles.exportActions}>
                        <button onClick={() => handleExport("pdf")} className="btn-secondary" style={styles.exportBtn}>
                          ⬇ Exportar Markdown (PDF)
                        </button>
                        <button onClick={() => handleExport("docx")} className="btn-secondary" style={styles.exportBtn}>
                          ⬇ Exportar Texto (DOCX)
                        </button>
                        <button onClick={handleGenerateFinalBriefing} className="btn-secondary" style={styles.reRunBtn}>
                          Regerar
                        </button>
                      </div>
                    </div>

                    {/* Pre-sales Document Preview */}
                    <article style={styles.docPreview} className="glass-panel">
                      <div style={styles.docPreviewHeader}>
                        <h2 style={styles.docPreviewTitle}>LEVANTAMENTO TÉCNICO DE PRÉ-VENDAS</h2>
                        <span style={styles.docPreviewMeta}>Clear IT - Copilot Intelligence Platform</span>
                      </div>

                      <section style={styles.docPreviewSection}>
                        <h4 style={styles.docSectionTitle}>1. RESUMO EXECUTIVO</h4>
                        <p style={styles.docText}>{finalBriefing.executive_summary}</p>
                      </section>

                      <section style={styles.docPreviewSection}>
                        <h4 style={styles.docSectionTitle}>2. CONTEXTO E QUALIFICAÇÃO TÉCNICA</h4>
                        <p style={{ ...styles.docText, whiteSpace: "pre-line" }}>{finalBriefing.context}</p>
                      </section>

                      <section style={styles.docPreviewSection}>
                        <h4 style={styles.docSectionTitle}>3. REQUISITOS MAPEADOS</h4>
                        <ul style={styles.docList}>
                          {finalBriefing.requirements.map((r, idx) => (
                            <li key={idx} style={styles.docListItem}>{r}</li>
                          ))}
                        </ul>
                      </section>

                      <section style={styles.docPreviewSection}>
                        <h4 style={styles.docSectionTitle}>4. RECOMENDAÇÕES DE SOLUÇÃO</h4>
                        <div style={styles.docRecsList}>
                          {finalBriefing.recommendations.map((r, idx) => (
                            <div key={idx} style={styles.docRecItem}>
                              <span style={styles.docRecProduct}>{r.product}</span>
                              <p style={styles.docText}>{r.justification}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section style={styles.docPreviewSection}>
                        <h4 style={styles.docSectionTitle}>5. PRÓXIMOS PASSOS SUGERIDOS</h4>
                        <ol style={styles.docList}>
                          {finalBriefing.next_steps.map((n, idx) => (
                            <li key={idx} style={styles.docListItem}>{n}</li>
                          ))}
                        </ol>
                      </section>
                    </article>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  workspaceContainer: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  topNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px"
  },
  backBtn: {
    padding: "8px 16px"
  },
  navInfo: {
    textAlign: "center"
  },
  navCustomer: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#a855f7",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  navTitle: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#f3f4f6"
  },
  navStatus: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  navStatusLabel: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  statusGlow: {
    color: "#06b6d4",
    fontWeight: 700,
    fontSize: "13px",
    textShadow: "0 0 10px rgba(6, 180, 212, 0.4)",
    letterSpacing: "0.05em"
  },
  splitLayout: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "24px",
    flex: 1
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    padding: "0px", // Let tabs headers occupy edge to edge
    overflow: "hidden"
  },
  briefingPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "450px"
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  panelTitle: {
    fontSize: "15px",
    fontWeight: 700
  },
  sourceBadge: {
    fontSize: "10px"
  },
  rawContentScroll: {
    overflowY: "auto",
    flex: 1,
    background: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid rgba(255,255,255,0.03)"
  },
  rawText: {
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap"
  },
  scorePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  panelTitleSmall: {
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#9ca3af"
  },
  scoreGaugeList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  gaugeItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  gaugeHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: 500,
    color: "#d1d5db"
  },
  gaugeValue: {
    fontWeight: 700
  },
  gaugeTrack: {
    height: "8px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "4px",
    width: "100%",
    overflow: "hidden"
  },
  gaugeBar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.5s ease"
  },
  tabsHeader: {
    display: "flex",
    background: "rgba(0,0,0,0.15)",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  tabBtn: {
    flex: 1,
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "16px 8px",
    color: "#9ca3af",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  tabBtnActive: {
    color: "#a855f7",
    borderBottomColor: "#a855f7",
    background: "rgba(168, 85, 247, 0.03)"
  },
  tabContentArea: {
    padding: "24px",
    flex: 1,
    overflowY: "auto"
  },
  agentStartBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 40px",
    maxWidth: "500px",
    margin: "0 auto",
    gap: "16px"
  },
  agentAvatarPurple: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "rgba(168, 85, 247, 0.15)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    color: "#c084fc",
    fontSize: "28px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  agentAvatarAmber: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    color: "#fbbf24",
    fontSize: "28px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  agentAvatarCyan: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "rgba(6, 180, 212, 0.15)",
    border: "1px solid rgba(6, 180, 212, 0.3)",
    color: "#22d3ee",
    fontSize: "28px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  agentAvatarGreen: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#34d399",
    fontSize: "28px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  agentDesc: {
    fontSize: "13px",
    color: "#9ca3af",
    lineHeight: "1.6"
  },
  agentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    paddingBottom: "16px"
  },
  reRunBtn: {
    padding: "6px 12px",
    fontSize: "12px"
  },
  extractedCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px"
  },
  extractedLabel: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#9ca3af",
    display: "block",
    marginBottom: "8px"
  },
  extractedText: {
    fontSize: "14px",
    color: "#f3f4f6",
    lineHeight: "1.6"
  },
  splitExtracted: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px"
  },
  extractedCardCol: {
    flex: 1,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "8px",
    padding: "16px"
  },
  extractedList: {
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: "1.6"
  },
  panelTransition: {
    animation: "fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
  },
  answersCounter: {
    fontSize: "13px",
    color: "#9ca3af",
    marginLeft: "12px",
    fontWeight: 500
  },
  questionsScrollArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "550px",
    overflowY: "auto",
    paddingRight: "6px"
  },
  questionCard: {
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  questionMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap"
  },
  rationaleLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500
  },
  questionText: {
    fontSize: "14px",
    color: "#f3f4f6",
    fontWeight: 600,
    lineHeight: "1.5"
  },
  answerInputRow: {
    display: "flex",
    gap: "12px"
  },
  answerInput: {
    flex: 1,
    height: "38px",
    fontSize: "13px",
    padding: "8px 12px"
  },
  sendAnswerBtn: {
    padding: "0 16px",
    height: "38px",
    fontSize: "13px"
  },
  answerDisplay: {
    background: "rgba(255,255,255,0.03)",
    borderLeft: "2px solid var(--accent-green)",
    padding: "10px 14px",
    borderRadius: "0 6px 6px 0"
  },
  answerHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "4px",
    fontWeight: 600
  },
  answerAuthor: {
    color: "#34d399"
  },
  answerDate: {
    color: "#6b7280"
  },
  answerContent: {
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: "1.4"
  },
  workflowNextBox: {
    marginTop: "24px",
    background: "rgba(168, 85, 247, 0.04)",
    border: "1px solid rgba(168, 85, 247, 0.15)",
    padding: "16px 20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },
  nextFlowBtn: {
    whiteSpace: "nowrap",
    padding: "10px 18px"
  },
  recommendationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  recCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "8px",
    padding: "20px"
  },
  recHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    paddingBottom: "12px",
    marginBottom: "12px"
  },
  recProduct: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f3f4f6"
  },
  recService: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  recScoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  recScoreLabel: {
    fontSize: "10px",
    color: "#6b7280",
    textTransform: "uppercase"
  },
  recScoreValue: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#06b6d4"
  },
  recBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  recInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  recLabel: {
    fontSize: "11px",
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: 600
  },
  recText: {
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: "1.5"
  },
  badgeRedOutline: {
    borderLeft: "2px solid #ef4444",
    paddingLeft: "10px"
  },
  recLabelRed: {
    fontSize: "11px",
    color: "#f87171",
    textTransform: "uppercase",
    fontWeight: 600
  },
  recTextRed: {
    fontSize: "13px",
    color: "#fca5a5",
    lineHeight: "1.5"
  },
  exportActions: {
    display: "flex",
    gap: "10px"
  },
  exportBtn: {
    padding: "6px 12px",
    fontSize: "12px"
  },
  docPreview: {
    padding: "40px",
    background: "#080c18",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "800px",
    margin: "0 auto",
    color: "#e5e7eb"
  },
  docPreviewHeader: {
    borderBottom: "2px solid rgba(255,255,255,0.08)",
    paddingBottom: "16px",
    textAlign: "center"
  },
  docPreviewTitle: {
    fontSize: "18px",
    letterSpacing: "0.05em",
    color: "#f3f4f6"
  },
  docPreviewMeta: {
    fontSize: "10px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.1em"
  },
  docPreviewSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  docSectionTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#a855f7",
    letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    paddingBottom: "6px"
  },
  docText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#d1d5db"
  },
  docList: {
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#d1d5db",
    lineHeight: "1.6"
  },
  docListItem: {
    marginBottom: "4px"
  },
  docRecsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  docRecItem: {
    background: "rgba(255,255,255,0.01)",
    border: "1px solid rgba(255,255,255,0.03)",
    padding: "12px",
    borderRadius: "6px"
  },
  docRecProduct: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#06b6d4",
    display: "block",
    marginBottom: "4px"
  },
  loadingScreen: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#9ca3af",
    fontSize: "15px",
    fontWeight: 500
  },
  errorScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "16px"
  },
  errorScreenTitle: {
    fontSize: "20px",
    color: "#ef4444"
  }
};

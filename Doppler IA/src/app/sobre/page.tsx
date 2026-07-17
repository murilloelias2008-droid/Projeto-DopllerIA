"use client";
import Link from 'next/link';
import React from 'react';

export default function SobrePage() {
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="glow-text-cyan" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            Sobre o Projeto
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Doppler IA (Pulse Sales Copilot)
          </p>
        </div>
        <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Voltar ao Início
        </Link>
      </header>

      <div style={{ display: 'grid', gap: '30px' }}>
        {/* Squad */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="glow-text-purple" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            Membros do Squad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            {['Matheus Andrade', 'Agatha Yasmin', 'Murillo Elias', 'João Vitor'].map((name) => (
              <div key={name} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '16px',
                  boxShadow: '0 4px 10px rgba(168, 85, 247, 0.3)'
                }}>
                  {name.charAt(0)}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{name}</span>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px' }}>
            O projeto do desafio proposto pela <strong style={{color: 'var(--text-primary)'}}>Clear IT</strong> junto com a <strong style={{color: 'var(--text-primary)'}}>Pulse Mais</strong>.
          </p>
        </section>

        {/* Manual de Uso */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="glow-text-cyan" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
            Manual de Uso
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Seção 1 */}
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--accent-purple)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                <span className="badge badge-purple" style={{fontSize: '14px', padding: '4px 12px'}}>1</span> Descrição do Sistema
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
                O <strong style={{color: 'var(--text-primary)'}}>Doppler IA (Pulse Sales Copilot)</strong> é uma plataforma baseada em múltiplos agentes de Inteligência Artificial, desenvolvida para atuar como um assistente de pré-vendas. O objetivo principal do sistema é acelerar e padronizar a qualificação de oportunidades comerciais. Ele recebe "briefings brutos" — como o corpo de um e-mail de cliente ou anotações de reunião — e utiliza IA para extrair necessidades, mapear lacunas de conhecimento (Discovery e Qualificação), recomendar produtos do portfólio e, finalmente, gerar um Documento Estruturado de Pré-vendas.
              </p>
            </div>

            {/* Seção 2 */}
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--accent-cyan)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                <span className="badge badge-cyan" style={{fontSize: '14px', padding: '4px 12px'}}>2</span> Principais Funcionalidades
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                O sistema é dividido em um Dashboard gerencial e um Workspace Multiagentes. As funcionalidades core incluem:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Autenticação Flexível", desc: "Permite aos usuários o acesso ao sistema utilizando uma chave real da API do Gemini ou através de um Modo de Simulação, onde respostas heurísticas são usadas caso não haja chave." },
                  { title: "Gestão de Pipeline (Dashboard)", desc: "Visão clara dos KPIs da área de pré-vendas (Total de oportunidades, Oportunidades ativas e Taxa de qualificação) com uma listagem das oportunidades organizadas por status." },
                  { title: "Ingestão de Briefings", desc: "Interface para criar novas oportunidades, permitindo a colagem de textos desestruturados e a definição da origem (e-mail, WhatsApp, reunião)." },
                  { title: "Agente de Discovery (Descoberta)", desc: "Processa o texto bruto e extrai o problema central, objetivos do cliente, stakeholders, restrições e premissas." },
                  { title: "Agente de Qualificação (Q&A de Lacunas)", desc: "A partir do Discovery, a IA identifica informações faltantes críticas e gera um questionário interativo. Conforme o analista responde às perguntas da IA, os medidores de saúde da oportunidade (Score de Completude, Confiança e Qualidade) são atualizados em tempo real." },
                  { title: "Agente de Portfolio Matching (RAG)", desc: "Analisa as necessidades qualificadas contra o banco de dados de portfólio da empresa, recomendando soluções aderentes juntamente com justificativas técnicas, nível de confiança e possíveis riscos." },
                  { title: "Briefing Generator", desc: "Consolida as saídas de todos os agentes anteriores em um documento final, formal e estruturado (Resumo Executivo, Contexto, Requisitos, Soluções Recomendadas e Próximos Passos)." }
                ].map((item, idx) => (
                  <li key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid var(--accent-cyan)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px', fontSize: '16px' }}>{item.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seção 3 */}
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--accent-red)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                <span className="badge badge-red" style={{fontSize: '14px', padding: '4px 12px'}}>3</span> O que ainda não está funcionando
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                A versão atual (v1.0) é um MVP e apresenta os seguintes pontos que foram "mockados" (simulados) ou não estão plenamente funcionais:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Exportação de PDF e DOCX Fictícia", desc: "Os botões para \"Exportar Markdown (PDF)\" e \"Exportar Texto (DOCX)\" na tela de Documento Estruturado apenas devolvem o texto em formato Markdown (.md ou .txt). O sistema ainda não renderiza os arquivos binários genuínos de PDF ou Word." },
                  { title: "Autenticação e Segurança (Mock)", desc: "O fluxo de login (/api/v1/auth/login) aceita a senha estática \"admin\". O sistema gera um token JWT de simulação que não possui uma camada de validação criptográfica real, nem proteção real de rotas." },
                  { title: "Banco de Dados Local (db.json)", desc: "O armazenamento dos briefings, clientes e portfólio está sendo feito em um arquivo local em disco (db.json). Esse modelo não suporta múltiplos usuários simultâneos e não é escalável ou adequado para o ambiente de produção." }
                ].map((item, idx) => (
                  <li key={idx} style={{ background: 'rgba(239, 68, 68, 0.03)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid var(--accent-red)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)'}
                  >
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px', fontSize: '16px' }}>{item.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seção 4 */}
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--accent-green)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                <span className="badge badge-green" style={{fontSize: '14px', padding: '4px 12px'}}>4</span> Sugestões de Próximos Passos
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                Para evoluir o Doppler IA de um MVP para um produto Enterprise-Ready, sugere-se:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Geração Nativa de Documentos PDF/Word", desc: "Implementar bibliotecas como @react-pdf/renderer para PDFs e docx para documentos de texto. Isso permitirá que o analista gere o documento timbrado e formatado com um clique, pronto para ser enviado ao cliente." },
                  { title: "Integração com CRM e E-mail", desc: "Desenvolver conectores que leiam diretamente a caixa de e-mail de pré-vendas ou se conectem a plataformas como Salesforce/HubSpot, puxando o briefing bruto automaticamente para a plataforma, removendo a necessidade de \"copiar e colar\"." },
                  { title: "Migração do Banco de Dados", desc: "Substituir o armazenamento em JSON por um banco de dados relacional (ex: PostgreSQL) utilizando um ORM (como o Prisma), garantindo estabilidade, buscas rápidas, backups e integridade relacional." },
                  { title: "Autenticação Real (Identity Provider)", desc: "Implementar o NextAuth.js ou integrar com provedores SSO (Google Workspace / Microsoft Entra ID), garantindo acesso seguro corporativo e gestão baseada em perfis (Role-Based Access Control)." },
                  { title: "Refinamento do Copilot (Chat Livre)", desc: "Adicionar um painel lateral na tela do Workspace onde o usuário possa fazer perguntas diretas ao documento (ex: \"A partir do que temos, o cliente tem budget restrito?\"), indo além do fluxo estrito de abas." }
                ].map((item, idx) => (
                  <li key={idx} style={{ background: 'rgba(16, 185, 129, 0.03)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid var(--accent-green)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)'}
                  >
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px', fontSize: '16px' }}>{item.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

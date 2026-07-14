import { PortfolioItem, Discovery, Question, Recommendation, FinalBriefing, Opportunity, Qualification, Answer } from "./db";

// Direct Gemini API call helper
async function callGemini(prompt: string, systemInstruction: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Heuristics-based simulation mode
function runMockDiscovery(text: string): Omit<Discovery, "id" | "briefing_id"> {
  const lowerText = text.toLowerCase();
  
  let problem = "Falta de infraestrutura estruturada e processos de monitoramento automatizados.";
  let objectives: string[] = ["Estruturar o ambiente de TI para garantir estabilidade", "Melhorar a segurança dos dados e acessos"];
  let stakeholders: string[] = ["Equipe de TI", "Diretoria Executiva"];
  let constraints: string[] = ["Prazo regulatório indefinido"];
  let assumptions: string[] = ["O cliente possui equipe técnica mínima para apoiar o projeto"];
  
  if (lowerText.includes("hospital") || lowerText.includes("saúde") || lowerText.includes("prontuário")) {
    problem = "Gargalos de processamento no banco de dados de prontuários eletrônicos local e ausência de mecanismos de auditoria/segurança para conformidade com a LGPD.";
    objectives = [
      "Migrar o sistema de prontuário eletrônico legado para nuvem pública (AWS ou Azure)",
      "Prover resiliência, backup automatizado e alta disponibilidade",
      "Implementar central de monitoramento e resposta a incidentes de segurança (SOC) 24x7"
    ];
    stakeholders = ["Diretoria de Compliance", "Equipe de TI Hospitalar", "Auditoria Geral"];
    constraints = ["Necessidade de homologação rápida (15 dias)", "Atendimento estrito à LGPD (dados sensíveis de saúde)"];
    assumptions = ["O software de prontuário eletrônico é compatível com ambientes de nuvem pública", "O cliente fornecerá acesso de rede ao ambiente local para auditoria inicial"];
  } else if (lowerText.includes("varejo") || lowerText.includes("e-commerce") || lowerText.includes("site") || lowerText.includes("checkout")) {
    problem = "Instabilidade do e-commerce durante picos de acesso causado por possíveis robôs ou gargalos no checkout de pagamentos, além de falta de rastreabilidade de lentidão.";
    objectives = [
      "Mitigar ataques de robôs (DDoS/Scraping) na borda e proteger APIs",
      "Implementar painel de observabilidade de transações ponta a ponta (checkout)",
      "Otimizar tempo de carregamento de páginas para evitar queda de conversão"
    ];
    stakeholders = ["Gerente de E-commerce", "Diretor de Tecnologia", "Equipe de Vendas"];
    constraints = ["Campanhas de marketing iminentes", "Manter conformidade com regras de cartão (PCI-DSS)"];
    assumptions = ["O site de e-commerce é hospedado de forma que permite injeção de agentes APM", "O tráfego de robôs está gerando custos extras de processamento local"];
  } else if (lowerText.includes("banco") || lowerText.includes("fintech") || lowerText.includes("financeiro")) {
    problem = "Exposição de APIs críticas, falta de governança de acessos a dados financeiros e vulnerabilidades em transações.";
    objectives = [
      "Implementar segurança avançada de borda e autenticação robusta (MFA/SSO)",
      "Centralizar controle de identidade e acessos de funcionários (IAM)",
      "Estabelecer monitoramento contínuo de segurança digital (SOC)"
    ];
    stakeholders = ["Diretoria de Riscos", "Controladoria", "Equipe de DevOps/SecOps"];
    constraints = ["Resoluções do Banco Central aplicáveis (ex: Bacen 4658/4893)", "Zero downtime tolerado no checkout de transações"];
    assumptions = ["Colaboradores necessitam de múltiplos acessos que podem ser consolidados via SSO"];
  }

  // Generics detection
  if (lowerText.includes("segurança") || lowerText.includes("soc") || lowerText.includes("ataque")) {
    if (!objectives.some(o => o.includes("SOC") || o.includes("Segurança"))) {
      objectives.push("Implementar centro de controle de segurança (SOC)");
    }
    if (!stakeholders.includes("Equipe de Segurança (SecOps)")) {
      stakeholders.push("Equipe de Segurança (SecOps)");
    }
  }

  if (lowerText.includes("nuvem") || lowerText.includes("migração") || lowerText.includes("cloud")) {
    if (!objectives.some(o => o.includes("nuvem") || o.includes("Cloud"))) {
      objectives.push("Planejar migração estruturada de servidores físicos para nuvem pública");
    }
  }

  const summary = `Análise de briefing identificando demandas de ${objectives.map(o => o.toLowerCase().replace("implementar ", "").replace("migrar ", "")).join(", ")}.`;

  return {
    problem,
    objectives,
    stakeholders,
    constraints,
    assumptions,
    summary
  };
}

function runMockQualification(discovery: Discovery): Omit<Question, "id" | "qualification_id" | "status">[] {
  const prob = discovery.problem.toLowerCase();
  const questions: Omit<Question, "id" | "qualification_id" | "status">[] = [];

  if (prob.includes("hospital") || prob.includes("prontuário") || prob.includes("saúde")) {
    questions.push({
      category: "Técnica",
      priority: "HIGH",
      text: "Qual é o banco de dados utilizado atualmente no prontuário eletrônico (SQL Server, Oracle, PostgreSQL)?",
      rationale: "Precisamos dessa informação para planejar a migração online ou replicação do banco de dados na nuvem pública."
    });
    questions.push({
      category: "Infraestrutura",
      priority: "MEDIUM",
      text: "Qual o tamanho atual da base de dados e o consumo de armazenamento total local?",
      rationale: "Importante para estimar custos de transferência de dados e taxas mensais da AWS/Azure."
    });
    questions.push({
      category: "Segurança",
      priority: "HIGH",
      text: "Quais são as ferramentas de segurança corporativas (firewall, antivírus) instaladas hoje nos servidores locais?",
      rationale: "Necessário para planejar as fontes de logs a serem integradas no Microsoft Sentinel do SOC."
    });
    questions.push({
      category: "Compliance",
      priority: "MEDIUM",
      text: "Existe algum relatório anterior de vulnerabilidades ou pentest que possamos analisar?",
      rationale: "Permite acelerar o diagnóstico das lacunas de segurança a serem resolvidas no ambiente novo."
    });
  } else if (prob.includes("varejo") || prob.includes("e-commerce") || prob.includes("checkout")) {
    questions.push({
      category: "Segurança",
      priority: "HIGH",
      text: "As rotas de checkout de pagamento utilizam APIs públicas abertas ou há autenticação e limites de requisição corporativos?",
      rationale: "Essencial para configurar as regras do WAF (Cloudflare) contra ataques automáticos de bots."
    });
    questions.push({
      category: "Técnica",
      priority: "HIGH",
      text: "A arquitetura de software atual é baseada em microsserviços (ex: Docker) ou é uma aplicação monolítica legada?",
      rationale: "Impacta diretamente a escolha e instalação do agente APM (Dynatrace/Datadog) para observabilidade."
    });
    questions.push({
      category: "Infraestrutura",
      priority: "MEDIUM",
      text: "Onde o e-commerce está hospedado hoje e qual é o provedor de DNS atual?",
      rationale: "Necessário para a virada do tráfego de borda via proxy reverso do Cloudflare."
    });
  } else {
    // Generics fallback
    questions.push({
      category: "Técnica",
      priority: "HIGH",
      text: "Qual a arquitetura técnica atual e linguagens de programação envolvidas?",
      rationale: "Decisivo para entender as compatibilidades com soluções do portfólio."
    });
    questions.push({
      category: "Negócio",
      priority: "MEDIUM",
      text: "Quais são as metas de SLA de disponibilidade desejadas para a nova solução?",
      rationale: "Permite calibrar o nível de redundância física ou arquitetura multi-cloud necessária."
    });
  }

  return questions;
}

function runMockPortfolioMatching(discovery: Discovery, portfolioItems: PortfolioItem[]): Omit<Recommendation, "id" | "qualification_id">[] {
  const text = (discovery.problem + " " + discovery.objectives.join(" ") + " " + discovery.summary).toLowerCase();
  const recommendations: Omit<Recommendation, "id" | "qualification_id">[] = [];

  for (const item of portfolioItems) {
    let match = false;
    let confidence = 0.5;
    let justification = "";
    let risks = "Baixo risco. Implantação baseada em padrões de mercado.";

    if (item.id === "port-soc" && (text.includes("segurança") || text.includes("soc") || text.includes("auditoria") || text.includes("lgpd") || text.includes("logs") || text.includes("incidentes") || text.includes("ataques"))) {
      match = true;
      confidence = 0.94;
      justification = `Recomendado ${item.product} devido à necessidade expressa de conformidade com a LGPD e monitoramento contínuo de logs de acesso e resposta rápida a incidentes de segurança cibernética 24x7.`;
      risks = "Risco de atraso caso as fontes de logs locais (servidores, redes) possuam incompatibilidade técnica imediata com o coletor do Sentinel.";
    } else if (item.id === "port-cloud" && (text.includes("nuvem") || text.includes("cloud") || text.includes("migração") || text.includes("aws") || text.includes("azure") || text.includes("servidores"))) {
      match = true;
      confidence = 0.96;
      justification = `Recomendado ${item.product} para apoiar a migração dos sistemas locais legado para uma arquitetura moderna sob nuvem pública pública, oferecendo a escalabilidade e alta disponibilidade exigidas.`;
      risks = "Risco de flutuação de custos de consumo de nuvem se não houver um controle estrito de FinOps pós-migração.";
    } else if (item.id === "port-observability" && (text.includes("observabilidade") || text.includes("apm") || text.includes("gargalo") || text.includes("checkout") || text.includes("lentidão") || text.includes("performance"))) {
      match = true;
      confidence = 0.92;
      justification = `A solução de ${item.product} é indicada para rastrear as lentidões de banco de dados e identificar de onde procedem os gargalos no checkout das transações do cliente.`;
      risks = "Exigência de instrumentação de código em aplicações mais antigas pode requerer esforço extra da equipe de desenvolvimento do cliente.";
    } else if (item.id === "port-cdps" && (text.includes("borda") || text.includes("waf") || text.includes("ddos") || text.includes("ataques") || text.includes("robôs") || text.includes("site") || text.includes("firewall"))) {
      match = true;
      confidence = 0.95;
      justification = `A solução de ${item.product} com Cloudflare WAF e mitigação de DDoS protegerá o e-commerce contra robôs maliciosos e ataques volumétricos que prejudicam a disponibilidade do checkout.`;
      risks = "Pode requerer refinamento de regras de WAF nos primeiros dias para evitar bloqueios de clientes reais (falsos positivos).";
    } else if (item.id === "port-identity" && (text.includes("identidade") || text.includes("iam") || text.includes("acesso") || text.includes("sso") || text.includes("mfa") || text.includes("senhas"))) {
      match = true;
      confidence = 0.88;
      justification = `Indicado ${item.product} para centralizar a gestão de acesso dos colaboradores a múltiplos sistemas internos, aumentando o nível de controle de segurança através de MFA e Single Sign-On.`;
    } else if (item.id === "port-ai" && (text.includes("ia") || text.includes("inteligência artificial") || text.includes("automação") || text.includes("chat") || text.includes("copilot"))) {
      match = true;
      confidence = 0.90;
      justification = `Uso de ${item.product} para construir canais inteligentes de suporte automatizado integrados com a base de conhecimento interna de manuais.`;
    } else if (item.id === "port-networking" && (text.includes("redes") || text.includes("sd-wan") || text.includes("conectividade") || text.includes("links") || text.includes("filiais"))) {
      match = true;
      confidence = 0.85;
      justification = `Uso do ${item.product} para interconectar filiais corporativas de forma segura e inteligente, otimizando os links de internet.`;
    } else if (item.id === "port-infrastructure" && (text.includes("backup") || text.includes("disaster recovery") || text.includes("vmware") || text.includes("armazenamento") || text.includes("físico"))) {
      match = true;
      confidence = 0.89;
      justification = `Recomendado ${item.product} para reforçar o backup imutável à prova de ransomwares e implementar um plano robusto de recuperação de desastres (Disaster Recovery).`;
    }

    if (match) {
      recommendations.push({
        portfolio_item_id: item.id,
        confidence,
        justification,
        risks
      });
    }
  }

  // Sort recommendations by confidence descending
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

// Main AI Engine interface
export const aiEngine = {
  // 1. Discovery Agent
  async runDiscovery(briefingText: string, apiKey?: string): Promise<Omit<Discovery, "id" | "briefing_id">> {
    if (!apiKey) {
      // Simulate network latency (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      return runMockDiscovery(briefingText);
    }

    try {
      const systemInstruction = `Você é o Discovery Agent da plataforma Pulse Sales Copilot.
Sua responsabilidade é interpretar um briefing comercial e retornar obrigatoriamente um objeto JSON com o seguinte formato exato:
{
  "problem": "Descrição detalhada da dor/problema principal do cliente",
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "stakeholders": ["Parte interessada 1", "Parte interessada 2"],
  "constraints": ["Restrição 1", "Restrição 2"],
  "assumptions": ["Premissa 1", "Premissa 2"],
  "summary": "Resumo executivo consolidado"
}
Não inclua explicações ou texto fora do JSON.`;

      const prompt = `Analise o seguinte briefing de vendas:
"${briefingText}"`;

      const jsonStr = await callGemini(prompt, systemInstruction, apiKey);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Gemini Discovery failed, falling back to mock:", e);
      return runMockDiscovery(briefingText);
    }
  },

  // 2. Qualification Agent
  async runQualification(discovery: Discovery, briefingText: string, apiKey?: string): Promise<{
    completeness_score: number;
    confidence_score: number;
    quality_score: number;
    questions: Omit<Question, "id" | "qualification_id" | "status">[];
  }> {
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const questions = runMockQualification(discovery);
      
      // Calculate scores dynamically based on answers length or text depth
      const wordCount = briefingText.split(/\s+/).length;
      const completeness_score = Math.min(100, Math.max(30, Math.round(wordCount / 3)));
      const confidence_score = Math.min(100, Math.max(40, 95 - questions.length * 8));
      const quality_score = Math.round((completeness_score + confidence_score) / 2);

      return {
        completeness_score,
        confidence_score,
        quality_score,
        questions
      };
    }

    try {
      const systemInstruction = `Você é o Qualification Agent. Sua missão é identificar lacunas no briefing comercial e gerar perguntas prioritárias para complementar o levantamento de pré-vendas.
Retorne obrigatoriamente um objeto JSON com o formato exato:
{
  "completeness_score": 75,
  "confidence_score": 80,
  "quality_score": 78,
  "questions": [
    {
      "category": "Técnica",
      "priority": "HIGH",
      "text": "Texto da pergunta",
      "rationale": "Justificativa de porque essa pergunta é importante"
    }
  ]
}
As categorias válidas de perguntas são: "Técnica", "Comercial", "Infraestrutura", "Segurança", "Compliance", "Negócio".
As prioridades válidas são: "HIGH", "MEDIUM", "LOW".`;

      const prompt = `Com base no seguinte contexto estruturado do Discovery:
Problema: ${discovery.problem}
Objetivos: ${discovery.objectives.join(", ")}
Constraints: ${discovery.constraints.join(", ")}

E no texto original do briefing:
"${briefingText}"

Encontre lacunas de informação e gere perguntas relevantes.`;

      const jsonStr = await callGemini(prompt, systemInstruction, apiKey);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Gemini Qualification failed, falling back to mock:", e);
      const questions = runMockQualification(discovery);
      return {
        completeness_score: 65,
        confidence_score: 75,
        quality_score: 70,
        questions
      };
    }
  },

  // 3. Portfolio Agent (RAG Matcher)
  async runPortfolioMatching(discovery: Discovery, portfolioItems: PortfolioItem[], apiKey?: string): Promise<Omit<Recommendation, "id" | "qualification_id">[]> {
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return runMockPortfolioMatching(discovery, portfolioItems);
    }

    try {
      const systemInstruction = `Você é o Portfolio Agent. Sua função é receber o problema e objetivos do cliente e realizar o matching (RAG) com o portfólio oficial de soluções.
Você receberá a lista de itens de portfólio disponíveis. Você deve retornar apenas soluções que constem explicitamente do portfólio recebido. NUNCA invente produtos ou serviços (Regra Antialucinação).
Retorne obrigatoriamente um objeto JSON com o seguinte formato:
{
  "recommendations": [
    {
      "portfolio_item_id": "ID_DO_PRODUTO_DO_PORTFOLIO",
      "confidence": 0.95,
      "justification": "Por que esta solução resolve a dor do cliente, baseando-se no portfólio",
      "risks": "Potenciais riscos ou requisitos de implantação"
    }
  ]
}
Ordene por confiança decrescente.`;

      const portfolioText = portfolioItems.map(p => `ID: ${p.id} | Produto: ${p.product} | Serviço: ${p.service} | Descrição: ${p.description} | O que é: ${p.what_is} | Problema que resolve: ${p.problem_solved}`).join("\n\n");

      const prompt = `Problema do cliente: ${discovery.problem}
Objetivos do cliente: ${discovery.objectives.join("\n- ")}

Portfólio disponível:
${portfolioText}`;

      const jsonStr = await callGemini(prompt, systemInstruction, apiKey);
      const data = JSON.parse(jsonStr);
      return data.recommendations || [];
    } catch (e) {
      console.error("Gemini Portfolio Matching failed, falling back to mock:", e);
      return runMockPortfolioMatching(discovery, portfolioItems);
    }
  },

  // 4. Briefing Agent (Structured Document Generator)
  async runBriefingGeneration(
    opportunity: Opportunity,
    discovery: Discovery,
    qualification: Qualification,
    questions: Question[],
    answers: Answer[],
    recommendations: { product: string; justification: string }[],
    apiKey?: string
  ): Promise<Omit<FinalBriefing, "id" | "opportunity_id" | "exported_at">> {
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const qnas = questions.map(q => {
        const ans = answers.find(a => a.question_id === q.id);
        return `- Pergunta: ${q.text}\n  Resposta: ${ans ? ans.answer : "Não respondida."}`;
      }).join("\n");

      const executive_summary = `Proposta de qualificação para a oportunidade "${opportunity.title}" da empresa cliente. O principal problema identificado refere-se a ${discovery.problem}. A solução proposta foca na modernização da arquitetura e reforço da segurança através da implantação das recomendações listadas.`;
      
      const context = `A oportunidade foi iniciada em ${new Date(opportunity.created_at).toLocaleDateString("pt-BR")}. O cliente traz as seguintes necessidades: ${discovery.summary}\n\nPerguntas respondidas durante o discovery:\n${qnas}`;
      
      const requirements = [
        ...discovery.objectives.map(o => `Objetivo: ${o}`),
        ...discovery.constraints.map(c => `Restrição: ${c}`)
      ];

      const next_steps = [
        "Apresentação técnica desta qualificação com os arquitetos de solução.",
        "Abertura de canal de comunicação com os stakeholders identificados.",
        "Elaboração da proposta comercial e financeira com base no dimensionamento de licenças."
      ];

      return {
        executive_summary,
        context,
        requirements,
        recommendations,
        next_steps
      };
    }

    try {
      const systemInstruction = `Você é o Briefing Agent. Sua responsabilidade é consolidar todas as fases do levantamento técnico (Discovery, Q&A de Qualificação, Recomendações do Portfólio) em um documento estruturado final de pré-vendas.
Retorne obrigatoriamente um objeto JSON com o seguinte formato:
{
  "executive_summary": "Resumo executivo corporativo do projeto",
  "context": "Contexto do cliente, incluindo as respostas coletadas durante a fase de qualificação",
  "requirements": ["Requisito estruturado 1", "Requisito estruturado 2"],
  "next_steps": ["Próximo passo 1", "Próximo passo 2"]
}
Mantenha um tom técnico, profissional e alinhado com o linguajar de arquitetura de TI corporativa.`;

      const qasText = questions.map(q => {
        const a = answers.find(ans => ans.question_id === q.id);
        return `P: ${q.text} (Motivo: ${q.rationale})\nR: ${a ? a.answer : "Pendente"}`;
      }).join("\n\n");

      const recsText = recommendations.map(r => `- Produto: ${r.product}\n  Justificativa: ${r.justification}`).join("\n");

      const prompt = `Título da Oportunidade: ${opportunity.title}
Problema: ${discovery.problem}
Resumo do Discovery: ${discovery.summary}

Perguntas e Respostas da Qualificação:
${qasText}

Soluções Recomendadas do Portfólio:
${recsText}`;

      const jsonStr = await callGemini(prompt, systemInstruction, apiKey);
      const data = JSON.parse(jsonStr);
      return {
        executive_summary: data.executive_summary,
        context: data.context,
        requirements: data.requirements || [],
        recommendations,
        next_steps: data.next_steps || []
      };
    } catch (e) {
      console.error("Gemini Briefing Generation failed, falling back to mock:", e);
      // Fallback
      return {
        executive_summary: `Resumo técnico para ${opportunity.title}.`,
        context: `Contexto do discovery do cliente hospitalar.`,
        requirements: discovery.objectives,
        recommendations,
        next_steps: ["Agendar reunião de validação da proposta."]
      };
    }
  }
};

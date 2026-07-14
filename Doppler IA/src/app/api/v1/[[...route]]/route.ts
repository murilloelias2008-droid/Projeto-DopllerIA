import { NextRequest, NextResponse } from "next/server";
import { db, Opportunity, Briefing, Discovery, Qualification, Question, Answer, Recommendation, FinalBriefing } from "@/lib/db";
import { aiEngine } from "@/lib/ai-engine";

// Helper to get authorization token/key
function getApiKey(req: NextRequest): string | undefined {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    // Return key if it looks like a Gemini key (starts with AIza) or OpenAI key (starts with sk-)
    if (token.startsWith("AIza") || token.startsWith("sk-") || token.length > 20) {
      return token;
    }
  }
  return undefined;
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ route?: string[] }> }
) {
  const params = await props.params;
  const route = params.route || [];
  const correlationId = req.headers.get("X-Correlation-ID") || "corr-" + Math.random().toString(36).substring(2, 9);

  try {
    // 1. Health Check
    if (route.length === 1 && route[0] === "health") {
      return NextResponse.json({ status: "UP", timestamp: new Date().toISOString() });
    }

    // 2. Health Readiness
    if (route.length === 1 && route[0] === "ready") {
      return NextResponse.json({ status: "READY" });
    }

    // 3. List Briefings
    if (route.length === 1 && route[0] === "briefings") {
      const briefings = db.getBriefings();
      const opportunities = db.getOpportunities();
      const customers = db.getCustomers();

      const list = briefings.map(b => {
        const opp = opportunities.find(o => o.id === b.opportunity_id);
        const cust = opp ? customers.find(c => c.id === opp.customer_id) : undefined;
        return {
          id: b.id,
          title: opp?.title || "Sem Título",
          opportunity_id: b.opportunity_id,
          customer_name: cust?.name || "Cliente Desconhecido",
          status: opp?.status || "RECEIVED",
          source: b.source,
          created_at: b.created_at,
          version: b.version
        };
      });

      return NextResponse.json(list);
    }

    // 4. Buscar Briefing Completo
    if (route.length === 2 && route[0] === "briefings") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) {
        return NextResponse.json({ status: 404, message: "Briefing não encontrado." }, { status: 404 });
      }

      const opportunity = db.getOpportunity(briefing.opportunity_id);
      const customer = opportunity ? db.getCustomers().find(c => c.id === opportunity.customer_id) : undefined;
      const discovery = db.getDiscoveryByBriefing(briefing.id);
      const qualification = discovery ? db.getQualificationByDiscovery(discovery.id) : undefined;
      const questions = qualification ? db.getQuestionsByQualification(qualification.id) : [];
      const answers: Answer[] = [];
      for (const q of questions) {
        answers.push(...db.getAnswersForQuestion(q.id));
      }
      const recommendations = qualification ? db.getRecommendationsByQualification(qualification.id) : [];
      const finalBriefing = opportunity ? db.getFinalBriefingByOpportunity(opportunity.id) : undefined;

      return NextResponse.json({
        briefing,
        opportunity,
        customer,
        discovery,
        qualification,
        questions,
        answers,
        recommendations,
        finalBriefing
      });
    }

    // 5. Listar Perguntas de um Briefing
    if (route.length === 3 && route[0] === "briefings" && route[2] === "questions") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) {
        return NextResponse.json({ status: 404, message: "Briefing não encontrado." }, { status: 404 });
      }
      const discovery = db.getDiscoveryByBriefing(briefing.id);
      const qualification = discovery ? db.getQualificationByDiscovery(discovery.id) : undefined;
      const questions = qualification ? db.getQuestionsByQualification(qualification.id) : [];

      return NextResponse.json(questions);
    }

    // 6. Listar Portfólio
    if (route.length === 1 && route[0] === "portfolio") {
      return NextResponse.json(db.getPortfolio());
    }

    // 7. Exportar PDF/DOCX (Simulado como Markdown formatado)
    if (route.length === 4 && route[0] === "briefings" && route[2] === "export") {
      const id = route[1];
      const format = route[3]; // pdf or docx
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Not found" }, { status: 404 });

      const opp = db.getOpportunity(briefing.opportunity_id);
      const finalBriefing = opp ? db.getFinalBriefingByOpportunity(opp.id) : undefined;

      if (!finalBriefing) {
        return NextResponse.json({ message: "Briefing final ainda não gerado." }, { status: 400 });
      }

      // Generate a nice text content block representing the document
      const markdown = `# Pulse Sales Copilot - Briefing Estruturado de Pré-Vendas
**Projeto:** ${opp?.title || "Doppler IA"}
**Exportado em:** ${new Date(finalBriefing.exported_at).toLocaleString("pt-BR")}

## 1. Resumo Executivo
${finalBriefing.executive_summary}

## 2. Contexto do Cliente
${finalBriefing.context}

## 3. Requisitos Levantados
${finalBriefing.requirements.map(r => `- ${r}`).join("\n")}

## 4. Recomendações do Portfólio
${finalBriefing.recommendations.map(r => `### ${r.product}\n${r.justification}`).join("\n\n")}

## 5. Próximos Passos
${finalBriefing.next_steps.map(n => `- ${n}`).join("\n")}
`;

      if (format === "pdf" || format === "docx") {
        return new NextResponse(markdown, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Content-Disposition": `attachment; filename=briefing-${id}.${format === "pdf" ? "md" : "txt"}`
          }
        });
      }
    }

    return NextResponse.json({ status: 404, message: "Endpoint não encontrado." }, { status: 404 });
  } catch (error: any) {
    console.error("API error in GET router:", error);
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 500,
      code: "INTERNAL_ERROR",
      message: error.message || "Erro interno do servidor.",
      correlationId
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ route?: string[] }> }
) {
  const params = await props.params;
  const route = params.route || [];
  const apiKey = getApiKey(req);
  const correlationId = req.headers.get("X-Correlation-ID") || "corr-" + Math.random().toString(36).substring(2, 9);
  
  try {
    // 1. Auth Login
    if (route.length === 2 && route[0] === "auth" && route[1] === "login") {
      const { email, password } = await req.json();
      const users = db.getUsers();
      const user = users.find(u => u.email === email && u.active);
      
      if (!user) {
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          status: 401,
          code: "INVALID_CREDENTIALS",
          message: "Usuário não encontrado ou inativo.",
          correlationId
        }, { status: 401 });
      }

      // Simple mock JWT token
      const token = `mock-jwt-token-for-${user.id}`;
      return NextResponse.json({
        accessToken: token,
        refreshToken: `mock-refresh-token-for-${user.id}`,
        expiresIn: 3600,
        user
      });
    }

    // 2. Criar Briefing
    if (route.length === 1 && route[0] === "briefings") {
      const body = await req.json();
      const { title, source, content, clientName, segment } = body;

      if (!title || !content) {
        return NextResponse.json({ message: "Campos obrigatórios ausentes: title, content" }, { status: 400 });
      }

      // Create or select customer
      const customers = db.getCustomers();
      let customer = customers.find(c => c.name.toLowerCase() === (clientName || "").toLowerCase());
      if (!customer) {
        customer = {
          id: "cust-" + Math.random().toString(36).substring(2, 9),
          name: clientName || "Cliente Avulso",
          segment: segment || "Geral",
          industry: segment || "Geral",
          country: "Brasil",
          state: "SP",
          city: "São Paulo",
          created_at: new Date().toISOString()
        };
        const currentData = db.read();
        currentData.customers.push(customer);
        db.write(currentData);
      }

      // Create opportunity
      const oppId = "opp-" + Math.random().toString(36).substring(2, 9);
      const opportunity: Opportunity = {
        id: oppId,
        customer_id: customer.id,
        title,
        description: content.substring(0, 200) + "...",
        source: source || "manual",
        status: "RECEIVED",
        owner_id: "usr-1", // default logged in user
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.saveOpportunity(opportunity);

      // Create briefing
      const brfId = "brf-" + Math.random().toString(36).substring(2, 9);
      const briefing: Briefing = {
        id: brfId,
        opportunity_id: oppId,
        raw_content: content,
        normalized_content: content,
        language: "pt",
        source: source || "manual",
        confidence: 1.0,
        version: 1,
        created_at: new Date().toISOString()
      };
      db.saveBriefing(briefing);

      db.log("briefing", brfId, "CREATE", "usr-1", { opportunity_id: oppId });

      return NextResponse.json({ id: brfId, status: "RECEIVED" }, { status: 201 });
    }

    // 3. Executar Descoberta (Discovery Agent)
    if (route.length === 3 && route[0] === "briefings" && route[2] === "discovery") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Briefing não encontrado." }, { status: 404 });

      // Run AI Discovery
      const discoveryResult = await aiEngine.runDiscovery(briefing.raw_content, apiKey);

      const dscId = "dsc-" + Math.random().toString(36).substring(2, 9);
      const discovery: Discovery = {
        id: dscId,
        briefing_id: briefing.id,
        ...discoveryResult
      };
      db.saveDiscovery(discovery);

      // Update opportunity status
      const opp = db.getOpportunity(briefing.opportunity_id);
      if (opp) {
        opp.status = "DISCOVERY";
        db.saveOpportunity(opp);
      }

      db.log("discovery", dscId, "EXECUTE", "usr-1", { briefing_id: briefing.id });

      return NextResponse.json(discovery);
    }

    // 4. Executar Qualificação (Qualification Agent)
    if (route.length === 3 && route[0] === "briefings" && route[2] === "qualification") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Briefing não encontrado." }, { status: 404 });

      const discovery = db.getDiscoveryByBriefing(briefing.id);
      if (!discovery) {
        return NextResponse.json({ message: "Execute a descoberta (discovery) antes da qualificação." }, { status: 400 });
      }

      // Run AI Qualification
      const qualResult = await aiEngine.runQualification(discovery, briefing.raw_content, apiKey);

      const qlfId = "qlf-" + Math.random().toString(36).substring(2, 9);
      const qualification: Qualification = {
        id: qlfId,
        discovery_id: discovery.id,
        completeness_score: qualResult.completeness_score,
        confidence_score: qualResult.confidence_score,
        quality_score: qualResult.quality_score,
        status: "IN_PROGRESS"
      };
      db.saveQualification(qualification);

      // Save generated questions
      const dbData = db.read();
      // Clear old questions for this qualification if any
      dbData.questions = dbData.questions.filter(q => q.qualification_id !== qlfId);
      
      const newQuestions = qualResult.questions.map(q => ({
        id: "qst-" + Math.random().toString(36).substring(2, 9),
        qualification_id: qlfId,
        ...q,
        status: "PENDING" as const
      }));
      dbData.questions.push(...newQuestions);
      db.write(dbData);

      // Update opportunity status
      const opp = db.getOpportunity(briefing.opportunity_id);
      if (opp) {
        opp.status = "QUALIFICATION";
        db.saveOpportunity(opp);
      }

      db.log("qualification", qlfId, "EXECUTE", "usr-1", { discovery_id: discovery.id });

      return NextResponse.json({
        completeness_score: qualification.completeness_score,
        confidence_score: qualification.confidence_score,
        quality_score: qualification.quality_score,
        questions: newQuestions
      });
    }

    // 5. Responder Pergunta
    if (route.length === 4 && route[0] === "briefings" && route[2] === "questions") {
      const brfId = route[1];
      const qstId = route[3];
      const { answerText, author } = await req.json();

      const question = db.getQuestion(qstId);
      if (!question) return NextResponse.json({ message: "Pergunta não encontrada." }, { status: 404 });

      // Save answer
      const ansId = "ans-" + Math.random().toString(36).substring(2, 9);
      const answer: Answer = {
        id: ansId,
        question_id: qstId,
        answer: answerText,
        author: author || "usr-1",
        answered_at: new Date().toISOString()
      };
      db.saveAnswer(answer);

      // Update question status
      question.status = "ANSWERED";
      db.saveQuestion(question);

      // Recalculate Completeness Score dynamically
      const qlf = db.getQualificationByDiscovery(db.getDiscoveryByBriefing(brfId)!.id);
      if (qlf) {
        const questions = db.getQuestionsByQualification(qlf.id);
        const answeredCount = questions.filter(q => q.status === "ANSWERED").length;
        
        // Increase completeness score proportionally to answered questions
        const total = questions.length;
        const progressPercent = total > 0 ? (answeredCount / total) : 0;
        
        const baseScore = qlf.completeness_score;
        const newCompleteness = Math.min(100, Math.round(baseScore + (100 - baseScore) * progressPercent));
        
        qlf.completeness_score = newCompleteness;
        qlf.quality_score = Math.round((newCompleteness + qlf.confidence_score) / 2);
        db.saveQualification(qlf);
      }

      db.log("answer", ansId, "CREATE", author || "usr-1", { question_id: qstId });

      return NextResponse.json(answer);
    }

    // 6. Consultar Portfólio e Recomendar Soluções (Portfolio Agent / RAG)
    if (route.length === 3 && route[0] === "briefings" && route[2] === "recommendations") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Briefing não encontrado." }, { status: 404 });

      const discovery = db.getDiscoveryByBriefing(briefing.id);
      const qualification = discovery ? db.getQualificationByDiscovery(discovery.id) : undefined;
      if (!discovery || !qualification) {
        return NextResponse.json({ message: "Execute a qualificação antes do portfolio matching." }, { status: 400 });
      }

      // Read portfolio items
      const portfolioItems = db.getPortfolio();

      // Run AI Portfolio RAG Matcher
      const recsResult = await aiEngine.runPortfolioMatching(discovery, portfolioItems, apiKey);

      const dbRecs: Recommendation[] = recsResult.map(r => ({
        id: "rec-" + Math.random().toString(36).substring(2, 9),
        qualification_id: qualification.id,
        ...r
      }));
      db.saveRecommendations(dbRecs);

      // Update opportunity status
      const opp = db.getOpportunity(briefing.opportunity_id);
      if (opp) {
        opp.status = "RECOMMENDATION";
        db.saveOpportunity(opp);
      }

      db.log("recommendations", qualification.id, "GENERATE", "usr-1", { count: dbRecs.length });

      // Join with portfolio item details for response
      const responseList = dbRecs.map(r => {
        const item = portfolioItems.find(p => p.id === r.portfolio_item_id);
        return {
          id: r.id,
          portfolio_item_id: r.portfolio_item_id,
          product: item?.product || "Produto Desconhecido",
          service: item?.service || "Serviço Desconhecido",
          confidence: r.confidence,
          justification: r.justification,
          risks: r.risks
        };
      });

      return NextResponse.json({ recommendations: responseList });
    }

    // 7. Calcular Score Final
    if (route.length === 3 && route[0] === "briefings" && route[2] === "score") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Briefing não encontrado." }, { status: 404 });

      const dsc = db.getDiscoveryByBriefing(briefing.id);
      const qlf = dsc ? db.getQualificationByDiscovery(dsc.id) : undefined;

      if (!qlf) {
        return NextResponse.json({ score: 0, completeness: 0, confidence: 0 });
      }

      return NextResponse.json({
        score: qlf.quality_score,
        completeness: qlf.completeness_score,
        confidence: qlf.confidence_score
      });
    }

    // 8. Gerar Briefing Estruturado Final (Briefing Agent)
    if (route.length === 3 && route[0] === "briefings" && route[2] === "generate") {
      const id = route[1];
      const briefing = db.getBriefing(id);
      if (!briefing) return NextResponse.json({ message: "Briefing não encontrado." }, { status: 404 });

      const opp = db.getOpportunity(briefing.opportunity_id);
      const discovery = db.getDiscoveryByBriefing(briefing.id);
      const qualification = discovery ? db.getQualificationByDiscovery(discovery.id) : undefined;
      
      if (!opp || !discovery || !qualification) {
        return NextResponse.json({ message: "Etapas anteriores incompletas." }, { status: 400 });
      }

      const questions = db.getQuestionsByQualification(qualification.id);
      const answers: Answer[] = [];
      for (const q of questions) {
        answers.push(...db.getAnswersForQuestion(q.id));
      }
      
      const recommendations = db.getRecommendationsByQualification(qualification.id);
      const portfolioItems = db.getPortfolio();

      const joinedRecs = recommendations.map(r => {
        const item = portfolioItems.find(p => p.id === r.portfolio_item_id);
        return {
          product: item?.product || "Produto",
          justification: r.justification
        };
      });

      // Run AI Briefing Generator
      const finalDocResult = await aiEngine.runBriefingGeneration(
        opp,
        discovery,
        qualification,
        questions,
        answers,
        joinedRecs,
        apiKey
      );

      const fbId = "fb-" + Math.random().toString(36).substring(2, 9);
      const finalBriefing: FinalBriefing = {
        id: fbId,
        opportunity_id: opp.id,
        ...finalDocResult,
        exported_at: new Date().toISOString()
      };
      db.saveFinalBriefing(finalBriefing);

      // Update opportunity status to COMPLETED
      opp.status = "COMPLETED";
      db.saveOpportunity(opp);

      db.log("final_briefing", fbId, "CREATE", "usr-1", { opportunity_id: opp.id });

      return NextResponse.json(finalBriefing);
    }

    return NextResponse.json({ status: 404, message: "Endpoint não encontrado." }, { status: 404 });
  } catch (error: any) {
    console.error("API error in POST router:", error);
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 500,
      code: "INTERNAL_ERROR",
      message: error.message || "Erro interno do servidor.",
      correlationId
    }, { status: 500 });
  }
}

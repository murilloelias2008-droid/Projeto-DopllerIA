import fs from "fs";
import path from "path";

// Define the file path for DB persistence
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper interface for DB Structure
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales" | "PreSales" | "Architect" | "Manager";
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  segment: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  source: string;
  status: "RECEIVED" | "DISCOVERY" | "QUALIFICATION" | "RECOMMENDATION" | "REVIEW" | "COMPLETED" | "ARCHIVED";
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Briefing {
  id: string;
  opportunity_id: string;
  raw_content: string;
  normalized_content: string;
  language: string;
  source: string;
  confidence: number;
  version: number;
  created_at: string;
}

export interface Discovery {
  id: string;
  briefing_id: string;
  problem: string;
  objectives: string[];
  stakeholders: string[];
  constraints: string[];
  assumptions: string[];
  summary: string;
}

export interface Qualification {
  id: string;
  discovery_id: string;
  completeness_score: number;
  confidence_score: number;
  quality_score: number;
  status: string;
}

export interface Question {
  id: string;
  qualification_id: string;
  category: "Técnica" | "Comercial" | "Infraestrutura" | "Segurança" | "Compliance" | "Negócio";
  priority: "HIGH" | "MEDIUM" | "LOW";
  text: string;
  rationale: string;
  status: "PENDING" | "ANSWERED";
}

export interface Answer {
  id: string;
  question_id: string;
  answer: string;
  author: string;
  answered_at: string;
}

export interface PortfolioItem {
  id: string;
  manufacturer: string;
  category: string;
  product: string;
  service: string;
  description: string;
  lifecycle: string;
  tags: string[];
  // Strategy structured properties:
  what_is: string;
  problem_solved: string;
  when_to_offer: string;
  when_not_to_offer: string;
  technologies: string[];
  success_cases: string;
  limitations: string;
  faq: { q: string; a: string }[];
}

export interface Recommendation {
  id: string;
  qualification_id: string;
  portfolio_item_id: string;
  confidence: number;
  justification: string;
  risks: string;
}

export interface FinalBriefing {
  id: string;
  opportunity_id: string;
  executive_summary: string;
  context: string;
  requirements: string[];
  recommendations: { product: string; justification: string }[];
  next_steps: string[];
  exported_at: string;
}

export interface AuditLog {
  id: string;
  entity: string;
  entity_id: string;
  action: string;
  actor: string;
  timestamp: string;
  payload: string;
}

export interface DatabaseSchema {
  users: User[];
  customers: Customer[];
  opportunities: Opportunity[];
  briefings: Briefing[];
  discoveries: Discovery[];
  qualifications: Qualification[];
  questions: Question[];
  answers: Answer[];
  portfolio_items: PortfolioItem[];
  recommendations: Recommendation[];
  final_briefings: FinalBriefing[];
  audit_logs: AuditLog[];
}

// Initial/Seeded Data
const INITIAL_DATABASE: DatabaseSchema = {
  users: [
    { id: "usr-1", name: "Matheus Silva", email: "matheus@clearit.com.br", role: "PreSales", active: true },
    { id: "usr-2", name: "Amanda Souza", email: "amanda@clearit.com.br", role: "Sales", active: true },
    { id: "usr-3", name: "Carlos Rocha", email: "carlos@clearit.com.br", role: "Architect", active: true }
  ],
  customers: [
    { id: "cust-1", name: "Hospital São Lucas", segment: "Saúde", industry: "Hospitais", country: "Brasil", state: "SP", city: "São Paulo", created_at: new Date().toISOString() },
    { id: "cust-2", name: "Varejo Express", segment: "Varejo", industry: "E-Commerce", country: "Brasil", state: "RJ", city: "Rio de Janeiro", created_at: new Date().toISOString() },
    { id: "cust-3", name: "FinTech Prime", segment: "Financeiro", industry: "Bancos", country: "Brasil", state: "SP", city: "São Paulo", created_at: new Date().toISOString() }
  ],
  opportunities: [
    {
      id: "opp-1",
      customer_id: "cust-1",
      title: "Migração em Nuvem e SOC Hospitalar",
      description: "Necessidade urgente de migrar o sistema de prontuário eletrônico para nuvem e implementar monitoramento de segurança 24/7 (SOC) para conformidade com a LGPD.",
      source: "email",
      status: "DISCOVERY",
      owner_id: "usr-1",
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
      updated_at: new Date().toISOString()
    },
    {
      id: "opp-2",
      customer_id: "cust-2",
      title: "Segurança de Borda e Observabilidade E-commerce",
      description: "E-commerce sofrendo ataques constantes de negação de serviço (DDoS) e sem visibilidade das lentidões no checkout.",
      source: "WhatsApp",
      status: "RECEIVED",
      owner_id: "usr-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  briefings: [
    {
      id: "brf-1",
      opportunity_id: "opp-1",
      raw_content: "Olá equipe, recebemos o contato do Hospital São Lucas. Eles estão com sérios problemas de lentidão no banco de dados local do prontuário eletrônico. Além disso, a diretoria de compliance está cobrando conformidade imediata com a LGPD, necessitando de monitoramento de logs de acesso e resposta a incidentes de segurança. Querem migrar a infraestrutura do sistema para nuvem pública (preferência Azure ou AWS) visando escalabilidade e alta disponibilidade. O projeto precisa de uma proposta técnica em no máximo 15 dias, pois a auditoria deles acontece no mês que vem.",
      normalized_content: "O Hospital São Lucas possui problemas de lentidão em seu banco de dados de prontuário eletrônico local. Necessitam de migração para nuvem pública (AWS/Azure) para obter alta disponibilidade e escalabilidade. Adicionalmente, necessitam de monitoramento de logs de acesso e resposta a incidentes para conformidade com a LGPD, exigindo um monitoramento 24/7.",
      language: "pt",
      source: "email",
      confidence: 0.95,
      version: 1,
      created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      id: "brf-2",
      opportunity_id: "opp-2",
      raw_content: "Cliente Varejo Express reporta oscilações no site principal durante horários de pico. Suspeitam de ataques de robôs e querem proteger as APIs de checkout, além de saber de onde vêm as lentidões de banco de dados.",
      normalized_content: "Varejo Express sofre oscilações no e-commerce durante picos de acesso. Suspeitam de tráfego de bots/DDoS. Requerem proteção de borda para as APIs de checkout e ferramentas de monitoramento/rastreamento de performance de banco de dados.",
      language: "pt",
      source: "WhatsApp",
      confidence: 0.90,
      version: 1,
      created_at: new Date().toISOString()
    }
  ],
  discoveries: [
    {
      id: "dsc-1",
      briefing_id: "brf-1",
      problem: "Lentidão no prontuário eletrônico local e falta de conformidade regulatória (LGPD) em relação à segurança, auditoria de acessos e monitoramento.",
      objectives: [
        "Migrar prontuário eletrônico local para nuvem pública (Azure ou AWS)",
        "Implementar alta disponibilidade e escalabilidade de infraestrutura",
        "Implementar auditoria de logs e monitoramento de segurança 24/7 (SOC)"
      ],
      stakeholders: ["Diretoria de Compliance", "Equipe de TI do Hospital", "Auditoria de Segurança"],
      constraints: ["Proposta técnica em 15 dias", "Compliance regulatório LGPD obrigatório"],
      assumptions: ["Prontuário eletrônico suporta arquitetura de nuvem pública", "Banco de dados atual pode ser migrado online"],
      summary: "Migração de prontuário eletrônico legado para AWS/Azure acoplado com serviço gerenciado de segurança (SOC) para conformidade regulatória urgente."
    }
  ],
  qualifications: [
    {
      id: "qlf-1",
      discovery_id: "dsc-1",
      completeness_score: 65,
      confidence_score: 75,
      quality_score: 70,
      status: "IN_PROGRESS"
    }
  ],
  questions: [
    {
      id: "qst-1",
      qualification_id: "qlf-1",
      category: "Técnica",
      priority: "HIGH",
      text: "Qual é o banco de dados utilizado atualmente no prontuário eletrônico (SQL Server, Oracle, PostgreSQL)?",
      rationale: "Necessário para planejar a estratégia de replicação e migração na nuvem.",
      status: "PENDING"
    },
    {
      id: "qst-2",
      qualification_id: "qlf-1",
      category: "Infraestrutura",
      priority: "MEDIUM",
      text: "Qual é o tamanho atual da base de dados e o consumo de armazenamento total?",
      rationale: "Importante para dimensionar os recursos de armazenamento e estimar os custos de transferência de dados.",
      status: "PENDING"
    },
    {
      id: "qst-3",
      qualification_id: "qlf-1",
      category: "Segurança",
      priority: "HIGH",
      text: "Quais são as ferramentas de segurança (antivírus, firewall) em uso hoje no ambiente local?",
      rationale: "Essencial para planejar as integrações do SOC e identificar o que precisará ser substituído ou instalado.",
      status: "PENDING"
    }
  ],
  answers: [],
  portfolio_items: [
    {
      id: "port-soc",
      manufacturer: "Clear IT",
      category: "Segurança Cibernética",
      product: "SOC (Security Operations Center)",
      service: "Monitoramento de Segurança Gerenciado 24x7",
      description: "Serviço gerenciado de segurança cibernética que fornece monitoramento contínuo, correlação de eventos de segurança (SIEM), detecção de ameaças em endpoints (EDR) e resposta rápida a incidentes.",
      lifecycle: "Active",
      tags: ["segurança", "soc", "siem", "edr", "lgpd", "compliance", "monitoramento"],
      what_is: "Centro de Operações de Segurança estruturado para vigiar e responder a ameaças digitais de forma ininterrupta.",
      problem_solved: "Falta de visibilidade de ataques, incidentes de segurança não detectados e não conformidade com leis de proteção de dados (LGPD).",
      when_to_offer: "Empresas com dados altamente confidenciais, com cobrança ativa de conformidade LGPD/PCI-DSS, ou que sofreram ataques recentes.",
      when_not_to_offer: "Microempresas com infraestrutura muito reduzida ou sem orçamento para investimento contínuo.",
      technologies: ["SIEM Microsoft Sentinel", "EDR CrowdStrike", "Vulnerability Management Nessus", "SOAR"],
      success_cases: "Redução do tempo médio de detecção (MTTD) de 45 dias para 8 minutos em um grande grupo hospitalar.",
      limitations: "Exige que os ativos suportem o encaminhamento de logs padrão (Syslog, Event Viewer, APIs).",
      faq: [
        { q: "O serviço inclui remediador técnico?", a: "Sim, atuamos no isolamento de máquinas comprometidas e contenção imediata seguindo o playbook de incidentes." },
        { q: "O SOC opera finais de semana?", a: "Sim, a operação é ininterrupta 24 horas por dia, 7 dias por semana." }
      ]
    },
    {
      id: "port-cdps",
      manufacturer: "Clear IT",
      category: "Segurança Cibernética",
      product: "CDPS (Cyber Defense & Protection)",
      service: "Proteção de Borda, WAF e Mitigação de DDoS",
      description: "Blindagem de infraestrutura web através de firewalls de próxima geração (NGFW), Web Application Firewall (WAF), e proteção contra ataques distribuídos de negação de serviço (DDoS).",
      lifecycle: "Active",
      tags: ["segurança", "firewall", "waf", "ddos", "borda", "cloudflare", "fortinet"],
      what_is: "Soluções de proteção perimetral e de aplicação para tráfego web e APIs.",
      problem_solved: "Ataques de negação de serviço que derrubam sistemas, invasões a aplicações web, e vazamento de dados via brechas de API.",
      when_to_offer: "Empresas com portais de e-commerce, portais de atendimento a clientes expostos na internet, e sistemas corporativos web críticos.",
      when_not_to_offer: "Sistemas totalmente internos ou que operam isolados in networks fechadas sem conexão externa.",
      technologies: ["Cloudflare Enterprise WAF", "Fortinet FortiGate NGFW", "F5 BIG-IP WAF"],
      success_cases: "Mitigação de ataque DDoS de 400 Gbps contra varejista nacional mantendo o site 100% online.",
      limitations: "Pode demandar ajustes periódicos (tunning) para evitar falsos positivos em fluxos específicos de negócio.",
      faq: [
        { q: "O WAF gera lentidão?", a: "Não, as soluções de borda modernas (ex: Cloudflare) utilizam CDN e aceleração que frequentemente reduzem o tempo de carga." }
      ]
    },
    {
      id: "port-observability",
      manufacturer: "Clear IT",
      category: "Operações e Monitoramento",
      product: "Observabilidade Avançada",
      service: "APM, Tracing e Monitoramento de Performance",
      description: "Plataforma de visualização de saúde de sistemas com monitoramento de aplicação (APM), tracing distribuído de requisições, correlação de logs e análise sintética de experiência do usuário.",
      lifecycle: "Active",
      tags: ["monitoramento", "observabilidade", "apm", "logs", "metrics", "dynatrace", "datadog"],
      what_is: "Sistema unificado de telemetria para identificar gargalos e prever falhas de software.",
      problem_solved: "Lentidão sistêmica sem origem conhecida, dificuldades em identificar qual componente gerou um erro de transação, e alertas tardios (usuário reclama antes de a TI saber).",
      when_to_offer: "Empresas com arquiteturas de microsserviços complexas, e-commerces que dependem de checkout rápido, e sistemas SaaS.",
      when_not_to_offer: "Infraestruturas legadas muito simples ou monolíticas estáticas de baixo tráfego.",
      technologies: ["Dynatrace", "Datadog", "New Relic", "OpenTelemetry"],
      success_cases: "Redução de 75% no tempo médio de reparo (MTTR) de problemas no checkout de um banco digital.",
      limitations: "Algumas tecnologias legadas exigem instrumentação de código manual.",
      faq: [
        { q: "Qual a diferença entre monitorar e observar?", a: "Monitorar diz que o sistema parou; observar explica o motivo dele ter parado ou estar lento, analisando o comportamento interno." }
      ]
    },
    {
      id: "port-cloud",
      manufacturer: "Clear IT",
      category: "Serviços de Nuvem",
      product: "Cloud Migration & Architecture",
      service: "Migração, Otimização e Gestão Multi-Cloud",
      description: "Planejamento e execução de migração de cargas de trabalho locais para AWS ou Microsoft Azure. Inclui modernização para containers, banco de dados gerenciado e arquiteturas seguras serverless.",
      lifecycle: "Active",
      tags: ["cloud", "nuvem", "aws", "azure", "migração", "devops", "kubernetes"],
      what_is: "Projetos e sustentação de infraestrutura em nuvem pública escalável.",
      problem_solved: "Limitações de hardware local, alto custo de manutenção de servidores locais (Capex), indisponibilidade geográfica de datacenter.",
      when_to_offer: "Empresas em momento de renovação de servidores locais, com metas de transformação digital ou necessidade de escalabilidade dinâmica.",
      when_not_to_offer: "Locais com conexões de internet instáveis ou restrições legais estritas contra armazenamento fora de datacenters nacionais específicos.",
      technologies: ["Amazon Web Services (AWS)", "Microsoft Azure", "Terraform", "Kubernetes (EKS/AKS)"],
      success_cases: "Migração completa de 120 servidores locais para a AWS em 45 dias com zero interrupção de negócio.",
      limitations: "Custos de nuvem podem variar de acordo com o consumo e requerem controle rígido de governança.",
      faq: [
        { q: "A migração gera indisponibilidade?", a: "Utilizamos ferramentas de replicação contínua para fazer a virada de ambiente com downtime próximo de zero." }
      ]
    },
    {
      id: "port-infrastructure",
      manufacturer: "Clear IT",
      category: "Infraestrutura",
      product: "Data Center Moderno",
      service: "Virtualização, Armazenamento e Disaster Recovery",
      description: "Estruturação de ambientes de TI privados e híbridos. Armazenamento de alto desempenho (All-Flash), hiperconvergência (HCI), soluções de backup corporativo e planos de recuperação de desastres (DR).",
      lifecycle: "Active",
      tags: ["infraestrutura", "backup", "disaster recovery", "virtualização", "vmware", "veeam"],
      what_is: "Arquitetura e implantação de infraestrutura física de datacenter e rotinas de backup.",
      problem_solved: "Perda de dados por falha física ou ransomware, falta de espaço de armazenamento de alta velocidade, e servidores físicos subutilizados.",
      when_to_offer: "Empresas que mantêm datacenters locais próprios, escritórios distribuídos precisando de storage centralizado, ou que necessitam de backup à prova de ransomware (offline/imutável).",
      when_not_to_offer: "Organizações focadas em estratégia 100% Cloud Native.",
      technologies: ["VMware vSphere", "Veeam Backup & Replication", "Dell EMC PowerStore Storage", "HPE SimpliVity"],
      success_cases: "Recuperação total de ambiente de 40 TB após ataque de ransomware em apenas 4 horas usando Veeam.",
      limitations: "Demanda investimento em hardware físico (Capex) com prazos de entrega de fabricantes.",
      faq: [
        { q: "O backup é imutável?", a: "Sim, ofertamos a opção de repositório imutável que impede a deleção de backups mesmo com credenciais administrativas comprometidas." }
      ]
    },
    {
      id: "port-identity",
      manufacturer: "Clear IT",
      category: "Identidade e Acesso",
      product: "Identity & Access Management (IAM)",
      service: "Autenticação Segura, SSO e MFA",
      description: "Implementação de gestão de identidade corporativa. Single Sign-On (SSO), Autenticação Multifator (MFA), governança de acessos baseada em papéis (RBAC) e proteção de credenciais contra roubo.",
      lifecycle: "Active",
      tags: ["identidade", "iam", "sso", "mfa", "active directory", "entra id", "okta"],
      what_is: "Gestão centralizada de quem pode acessar quais sistemas na empresa.",
      problem_solved: "Vazamento de credenciais fracas, funcionários com excesso de permissões desnecessárias, e perda de tempo digitando múltiplas senhas.",
      when_to_offer: "Empresas em home office integral ou híbrido, com alto turnover de funcionários, ou que sofreram fraudes internas.",
      when_not_to_offer: "Empresas muito pequenas sem ecossistema de sistemas integrados.",
      technologies: ["Microsoft Entra ID (Azure AD)", "Okta", "Ping Identity", "Duo Security"],
      success_cases: "Centralização de acesso de 5.000 colaboradores em 15 sistemas com provisionamento automático de conta no onboarding.",
      limitations: "Integração de sistemas legados que não suportam SAML/OIDC pode exigir conectores personalizados.",
      faq: [
        { q: "O MFA pode ser configurado por localização?", a: "Sim, habilitamos políticas de acesso condicional para exigir MFA apenas quando o colaborador estiver fora do escritório." }
      ]
    },
    {
      id: "port-ai",
      manufacturer: "Clear IT",
      category: "Inteligência Artificial",
      product: "Clear AI Copilot",
      service: "Soluções de Inteligência Artificial e Automação",
      description: "Desenvolvimento de assistentes conversacionais corporativos integrados a bases de conhecimento internas através de RAG (Retrieval-Augmented Generation). Automação de processos cognitivos e IA preditiva.",
      lifecycle: "Active",
      tags: ["ai", "ia", "copilot", "chat", "rag", "automação", "openai", "gemini"],
      what_is: "Consultoria e implantação de agentes inteligentes baseados em LLMs com dados corporativos seguros.",
      problem_solved: "Colaboradores perdendo tempo buscando informações em manuais extensos, processos de atendimento repetitivos no suporte e falta de análise de dados não estruturados.",
      when_to_offer: "Empresas com bases de conhecimento consolidadas (PDFs, Wiki, CRM) buscando aumento de produtividade, equipes de suporte com alta demanda e departamentos comerciais.",
      when_not_to_offer: "Empresas que não possuem dados internos estruturados ou processos maduros mapeados.",
      technologies: ["OpenAI API", "Google Gemini API", "LangChain / LangGraph", "Pinecone / pgvector"],
      success_cases: "Implantação de copiloto de atendimento reduzindo o tempo de resolução de chamados de suporte técnico em 60%.",
      limitations: "Requer supervisão humana para verificação e validação de saídas críticas.",
      faq: [
        { q: "Os dados da minha empresa treinam a IA pública?", a: "Não, as APIs corporativas que utilizamos garantem em contrato que os dados enviados não são armazenados para treinamento de terceiros." }
      ]
    },
    {
      id: "port-networking",
      manufacturer: "Clear IT",
      category: "Redes e Telecom",
      product: "Conectividade Segura",
      service: "SD-WAN e Redes Corporativas Gerenciadas",
      description: "Estruturação de redes de longa distância definidas por software (SD-WAN) e redes locais seguras (LAN/Wi-Fi). Inclui controle de tráfego inteligente e VPNs criptografadas de alta performance.",
      lifecycle: "Active",
      tags: ["redes", "sd-wan", "wifi", "vpn", "fortinet", "cisco", "conectividade"],
      what_is: "Design e gerência de redes de comunicação robustas e links de internet.",
      problem_solved: "Lentidão em sistemas hospedados centralmente, queda de conexões entre filiais e matriz, e falta de segurança no tráfego de dados entre locais físicos.",
      when_to_offer: "Empresas com múltiplas filiais (lojas, clínicas, fábricas), ou com equipes altamente distribuídas exigindo conexão VPN segura.",
      when_not_to_offer: "Startups de base 100% remota que não operam escritórios físicos.",
      technologies: ["Fortinet Secure SD-WAN", "Cisco Meraki LAN/Wi-Fi", "Aruba Networking"],
      success_cases: "Redução de 40% em custos de telecom de uma rede de farmácias com migração de MPLS para SD-WAN.",
      limitations: "Depende da qualidade física dos links de internet locais (fibra, link de rádio).",
      faq: [
        { q: "O SD-WAN substitui o link MPLS?", a: "Sim, ele permite combinar links de banda larga comuns com segurança e resiliência superiores ao MPLS, gerando economia." }
      ]
    }
  ],
  recommendations: [],
  final_briefings: [],
  audit_logs: []
};

// Database utility class/functions
export const db = {
  // Read DB
  read(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.write(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data) as DatabaseSchema;
    } catch (e) {
      console.error("Error reading database file, returning initial seed data.", e);
      return INITIAL_DATABASE;
    }
  },

  // Write DB
  write(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing database file.", e);
    }
  },

  // User CRUD
  getUsers(): User[] {
    return this.read().users;
  },

  // Customer CRUD
  getCustomers(): Customer[] {
    return this.read().customers;
  },

  // Opportunity CRUD
  getOpportunities(): Opportunity[] {
    return this.read().opportunities;
  },
  getOpportunity(id: string): Opportunity | undefined {
    return this.read().opportunities.find(o => o.id === id);
  },
  saveOpportunity(opp: Opportunity): void {
    const data = this.read();
    const index = data.opportunities.findIndex(o => o.id === opp.id);
    if (index >= 0) {
      data.opportunities[index] = { ...opp, updated_at: new Date().toISOString() };
    } else {
      data.opportunities.push(opp);
    }
    this.write(data);
  },

  // Briefing CRUD
  getBriefings(): Briefing[] {
    return this.read().briefings;
  },
  getBriefing(id: string): Briefing | undefined {
    return this.read().briefings.find(b => b.id === id);
  },
  getBriefingByOpportunity(oppId: string): Briefing | undefined {
    return this.read().briefings.find(b => b.opportunity_id === oppId);
  },
  saveBriefing(brf: Briefing): void {
    const data = this.read();
    const index = data.briefings.findIndex(b => b.id === brf.id);
    if (index >= 0) {
      data.briefings[index] = brf;
    } else {
      data.briefings.push(brf);
    }
    this.write(data);
  },

  // Discovery CRUD
  getDiscoveryByBriefing(brfId: string): Discovery | undefined {
    return this.read().discoveries.find(d => d.briefing_id === brfId);
  },
  saveDiscovery(dsc: Discovery): void {
    const data = this.read();
    const index = data.discoveries.findIndex(d => d.id === dsc.id || d.briefing_id === dsc.briefing_id);
    if (index >= 0) {
      data.discoveries[index] = dsc;
    } else {
      data.discoveries.push(dsc);
    }
    this.write(data);
  },

  // Qualification CRUD
  getQualificationByDiscovery(dscId: string): Qualification | undefined {
    return this.read().qualifications.find(q => q.discovery_id === dscId);
  },
  saveQualification(qlf: Qualification): void {
    const data = this.read();
    const index = data.qualifications.findIndex(q => q.id === qlf.id || q.discovery_id === qlf.discovery_id);
    if (index >= 0) {
      data.qualifications[index] = qlf;
    } else {
      data.qualifications.push(qlf);
    }
    this.write(data);
  },

  // Questions CRUD
  getQuestionsByQualification(qlfId: string): Question[] {
    return this.read().questions.filter(q => q.qualification_id === qlfId);
  },
  getQuestion(id: string): Question | undefined {
    return this.read().questions.find(q => q.id === id);
  },
  saveQuestion(qst: Question): void {
    const data = this.read();
    const index = data.questions.findIndex(q => q.id === qst.id);
    if (index >= 0) {
      data.questions[index] = qst;
    } else {
      data.questions.push(qst);
    }
    this.write(data);
  },

  // Answers CRUD
  getAnswersForQuestion(qstId: string): Answer[] {
    return this.read().answers.filter(a => a.question_id === qstId);
  },
  saveAnswer(ans: Answer): void {
    const data = this.read();
    const index = data.answers.findIndex(a => a.id === ans.id);
    if (index >= 0) {
      data.answers[index] = ans;
    } else {
      data.answers.push(ans);
    }
    this.write(data);
  },

  // Portfolio CRUD
  getPortfolio(): PortfolioItem[] {
    return this.read().portfolio_items;
  },

  // Recommendations CRUD
  getRecommendationsByQualification(qlfId: string): Recommendation[] {
    return this.read().recommendations.filter(r => r.qualification_id === qlfId);
  },
  saveRecommendations(recs: Recommendation[]): void {
    const data = this.read();
    // Clear old recommendations for same qualification
    if (recs.length > 0) {
      const qId = recs[0].qualification_id;
      data.recommendations = data.recommendations.filter(r => r.qualification_id !== qId);
      data.recommendations.push(...recs);
    }
    this.write(data);
  },

  // Final Briefing CRUD
  getFinalBriefingByOpportunity(oppId: string): FinalBriefing | undefined {
    return this.read().final_briefings.find(f => f.opportunity_id === oppId);
  },
  saveFinalBriefing(fb: FinalBriefing): void {
    const data = this.read();
    const index = data.final_briefings.findIndex(f => f.id === fb.id || f.opportunity_id === fb.opportunity_id);
    if (index >= 0) {
      data.final_briefings[index] = fb;
    } else {
      data.final_briefings.push(fb);
    }
    this.write(data);
  },

  // Audit Logs
  log(entity: string, entityId: string, action: string, actor: string, payload: any): void {
    const data = this.read();
    data.audit_logs.push({
      id: "log-" + Math.random().toString(36).substring(2, 9),
      entity,
      entity_id: entityId,
      action,
      actor,
      timestamp: new Date().toISOString(),
      payload: JSON.stringify(payload)
    });
    this.write(data);
  }
};

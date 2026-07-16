# Projeto-DopllerIA

#Membro
Matheus Andrade
Agatha Yasmin
Murillo Elias  
João Vitor 

Projeto desafio proposto pela Clear IT junto com a Pulse 

Manual de Uso - Doppler IA (Pulse Sales Copilot)

#1. Descrição do Sistema
O Doppler IA (Pulse Sales Copilot) é uma plataforma baseada em múltiplos agentes de Inteligência Artificial, desenvolvida para atuar como um assistente de pré-vendas. O objetivo principal do sistema é acelerar e padronizar a qualificação de oportunidades comerciais. Ele recebe "briefings brutos" — como o corpo de um e-mail de cliente ou anotações de reunião — e utiliza IA para extrair necessidades, mapear lacunas de conhecimento (Discovery e Qualificação), recomendar produtos do portfólio e, finalmente, gerar um Documento Estruturado de Pré-vendas.

#2. Principais Funcionalidades
O sistema é dividido em um Dashboard gerencial e um Workspace Multiagentes. As funcionalidades core incluem:

Autenticação Flexível: Permite aos usuários o acesso ao sistema utilizando uma chave real da API do Gemini ou através de um Modo de Simulação, onde respostas heurísticas são usadas caso não haja chave.
Gestão de Pipeline (Dashboard): Visão clara dos KPIs da área de pré-vendas (Total de oportunidades, Oportunidades ativas e Taxa de qualificação) com uma listagem das oportunidades organizadas por status.
Ingestão de Briefings: Interface para criar novas oportunidades, permitindo a colagem de textos desestruturados e a definição da origem (e-mail, WhatsApp, reunião).
Agente de Discovery (Descoberta): Processa o texto bruto e extrai o problema central, objetivos do cliente, stakeholders, restrições e premissas.
Agente de Qualificação (Q&A de Lacunas): A partir do Discovery, a IA identifica informações faltantes críticas e gera um questionário interativo. Conforme o analista responde às perguntas da IA, os medidores de saúde da oportunidade (Score de Completude, Confiança e Qualidade) são atualizados em tempo real.
Agente de Portfolio Matching (RAG): Analisa as necessidades qualificadas contra o banco de dados de portfólio da empresa, recomendando soluções aderentes juntamente com justificativas técnicas, nível de confiança e possíveis riscos.
Briefing Generator: Consolida as saídas de todos os agentes anteriores em um documento final, formal e estruturado (Resumo Executivo, Contexto, Requisitos, Soluções Recomendadas e Próximos Passos).

#3. O que ainda não está funcionando (Limitações Atuais)
A versão atual (v1.0) é um MVP e apresenta os seguintes pontos que foram "mockados" (simulados) ou não estão plenamente funcionais:

Exportação de PDF e DOCX Fictícia: Os botões para "Exportar Markdown (PDF)" e "Exportar Texto (DOCX)" na tela de Documento Estruturado apenas devolvem o texto em formato Markdown (.md ou .txt). O sistema ainda não renderiza os arquivos binários genuínos de PDF ou Word.
Autenticação e Segurança (Mock): O fluxo de login (/api/v1/auth/login) aceita a senha estática "admin". O sistema gera um token JWT de simulação que não possui uma camada de validação criptográfica real, nem proteção real de rotas.
Banco de Dados Local (db.json): O armazenamento dos briefings, clientes e portfólio está sendo feito em um arquivo local em disco (db.json). Esse modelo não suporta múltiplos usuários simultâneos e não é escalável ou adequado para o ambiente de produção.

#4. Sugestões de Próximos Passos e Evoluções
Para evoluir o Doppler IA de um MVP para um produto Enterprise-Ready, sugere-se:

Geração Nativa de Documentos PDF/Word: Implementar bibliotecas como @react-pdf/renderer para PDFs e docx para documentos de texto. Isso permitirá que o analista gere o documento timbrado e formatado com um clique, pronto para ser enviado ao cliente.
Integração com CRM e E-mail: Desenvolver conectores que leiam diretamente a caixa de e-mail de pré-vendas ou se conectem a plataformas como Salesforce/HubSpot, puxando o briefing bruto automaticamente para a plataforma, removendo a necessidade de "copiar e colar".
Migração do Banco de Dados: Substituir o armazenamento em JSON por um banco de dados relacional (ex: PostgreSQL) utilizando um ORM (como o Prisma), garantindo estabilidade, buscas rápidas, backups e integridade relacional.
Autenticação Real (Identity Provider): Implementar o NextAuth.js ou integrar com provedores SSO (Google Workspace / Microsoft Entra ID), garantindo acesso seguro corporativo e gestão baseada em perfis (Role-Based Access Control).
Refinamento do Copilot (Chat Livre): Adicionar um painel lateral na tela do Workspace onde o usuário possa fazer perguntas diretas ao documento (ex: "A partir do que temos, o cliente tem budget restrito?"), indo além do fluxo estrito de abas.

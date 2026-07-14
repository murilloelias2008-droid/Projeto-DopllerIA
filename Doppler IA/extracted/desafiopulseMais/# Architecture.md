# Architecture.md

> **Projeto:** Pulse Sales Copilot – Plataforma Inteligente de Pré-Vendas
> **Versão:** 1.0
> **Status:** Arquitetura de Referência
> **Baseado em:** `business-context-lite.md`, `technical-context-lite.md` e `prd-lite.md`

---

# 1. Objetivo

Este documento define a arquitetura de referência do Pulse Sales Copilot.

Seu objetivo é servir como documento mestre da engenharia contendo:

- arquitetura lógica;
- arquitetura física;
- arquitetura C4;
- arquitetura multiagentes;
- integrações;
- fluxo de dados;
- padrões arquiteturais;
- decisões técnicas.

---

# 2. Princípios Arquiteturais

A arquitetura deverá seguir os seguintes princípios:

- Modularidade
- Baixo Acoplamento
- Alta Coesão
- APIs First
- IA como Copiloto
- RAG First
- Segurança por padrão (Security by Design)
- Observabilidade
- Escalabilidade Horizontal
- Evolução incremental

---

# 3. Visão Geral

```text
                     Usuário

                        │

                        ▼

               Web / Chat Interface

                        │

                        ▼

                  API Gateway

                        │

                Authentication

                        │

                        ▼

             Orchestrator Service

                        │

      ┌──────────┬─────────────┬──────────────┐

      ▼          ▼             ▼              ▼

 Discovery   Qualification   Portfolio     Memory
   Agent         Agent         Agent        Agent

      │          │             │              │

      └──────────┴─────────────┴──────────────┘

                        │

                        ▼

               Briefing Generator

                        │

                        ▼

               Compliance Agent

                        │

                        ▼

             Structured Briefing

                        │

                        ▼

                  Export Services
```

---

# 4. Arquitetura C4

## Nível 1 — Contexto

### Usuários

- Analista de Pré-Vendas
- Comercial
- Gestor
- Arquiteto

### Sistemas Externos

- CRM
- SharePoint
- Microsoft Teams
- Outlook
- OneDrive
- Base de Portfólio

---

## Nível 2 — Containers

### Frontend

Responsável por:

- Interface Web
- Dashboard
- Upload
- Chat

Tecnologia sugerida

- React
- Next.js

---

### Backend

Responsável por:

- APIs
- Autenticação
- Orquestração
- Sessões

Tecnologia

- FastAPI

---

### AI Engine

Responsável por:

- Coordenação dos Agentes
- Prompts
- Ferramentas
- RAG

---

### Knowledge Layer

Responsável por:

- Base Vetorial
- Portfólio
- FAQs
- Casos Anteriores

---

### Database Layer

- PostgreSQL
- pgvector
- Object Storage

---

# 5. Arquitetura Multiagentes

## Discovery Agent

Objetivo

Interpretar o briefing.

Entradas

- Texto
- PDF
- DOCX
- Email

Saídas

- Contexto
- Problema
- Objetivos
- Stakeholders

---

## Qualification Agent

Responsável por

- Descobrir lacunas
- Construir perguntas
- Priorizar informações

---

## Portfolio Agent

Responsável por

- Consultar catálogo
- Calcular aderência
- Recomendar soluções

---

## Compliance Agent

Responsável por

- LGPD
- Auditoria
- Políticas
- Anti-alucinação

---

## Briefing Agent

Responsável por

Produzir documentação estruturada.

---

## Memory Agent

Responsável por

- Histórico
- Memória Organizacional
- Reutilização

---

# 6. Fluxo Arquitetural

```text
Briefing

↓

Parser

↓

Discovery

↓

Qualification

↓

Portfolio

↓

Compliance

↓

Briefing Generator

↓

Review

↓

Export
```

---

# 7. Estratégia RAG

## Fontes

- Portfólio Oficial
- Documentação Técnica
- FAQs
- Casos Reais
- Playbooks
- Propostas

Fluxo

```text
Consulta

↓

Embedding

↓

Vector Search

↓

Contexto

↓

LLM

↓

Resposta
```

---

# 8. Modelo de Dados

## Opportunity

- id
- customer
- source
- description
- status

---

## Briefing

- objectives
- context
- requirements
- restrictions

---

## Question

- category
- priority
- answer

---

## Recommendation

- product
- service
- confidence
- justification

---

## Portfolio Item

- manufacturer
- category
- product
- service

---

# 9. Persistência

## PostgreSQL

Dados transacionais

## pgvector

Busca semântica

## Object Storage

Arquivos

- PDF
- DOCX
- Áudio

---

# 10. APIs

## POST /briefings

Criar briefing.

---

## POST /analysis

Interpretar briefing.

---

## POST /questions

Gerar perguntas.

---

## POST /recommendations

Consultar portfólio.

---

## POST /briefing/finalize

Gerar briefing final.

---

# 11. Segurança

Autenticação

- OAuth2

Autorização

- RBAC

Tokens

- JWT

Criptografia

- TLS
- AES

Logs

- Auditoria completa

---

# 12. Observabilidade

Monitorar

- Tempo de resposta
- Uso dos agentes
- Tokens consumidos
- Erros
- Latência
- Chamadas externas

Ferramentas sugeridas

- OpenTelemetry
- Prometheus
- Grafana

---

# 13. Requisitos Não Funcionais

Performance

- até 10 segundos

Disponibilidade

- 99,9%

Escalabilidade

- Horizontal

Resiliência

- Retry
- Timeout
- Circuit Breaker

---

# 14. Decisões Arquiteturais (ADR)

## ADR-001

Backend em Python + FastAPI.

---

## ADR-002

Banco PostgreSQL.

---

## ADR-003

Busca Vetorial com pgvector.

---

## ADR-004

Arquitetura Multiagentes.

---

## ADR-005

RAG como mecanismo oficial de recuperação de conhecimento.

---

## ADR-006

Portfólio corporativo como única fonte autorizada.

---

# 15. Roadmap Técnico

## Fase 1

Infraestrutura

## Fase 2

Agentes

## Fase 3

RAG

## Fase 4

Frontend

## Fase 5

Integrações

## Fase 6

Produção

---

# 16. Estrutura do Projeto

```text
docs/
│
├── business-context-lite.md
├── technical-context-lite.md
├── prd-lite.md
├── architecture.md
├── adr/
├── api/
├── diagrams/
└── knowledge-base/

backend/
frontend/
agents/
rag/
database/
infra/
tests/
```

---

# 17. Diagramas Pendentes

Este documento deverá possuir posteriormente:

- C4 Context
- C4 Container
- C4 Component
- C4 Code
- Fluxo BPMN
- Fluxo RAG
- Fluxo Multiagentes
- Modelo ER
- Diagrama de Sequência
- Diagrama de Implantação

---

# 18. Critérios de Aprovação

A arquitetura será considerada aprovada quando:

- atender integralmente ao Business Context;
- atender aos requisitos do PRD;
- suportar evolução para múltiplos agentes;
- permitir integração com RAG;
- garantir segurança, rastreabilidade e escalabilidade.

---

# Status

**Documento:** architecture.md

**Persona:** @engineer

**Estado:** ✅ Arquitetura de Referência Consolidada

**Dependências:**

- business-context-lite.md
- technical-context-lite.md
- prd-lite.md

**Próximo artefato recomendado:** `api-spec.md` (OpenAPI + contratos REST) seguido de `data-model.md` (modelo lógico e físico do banco de dados).

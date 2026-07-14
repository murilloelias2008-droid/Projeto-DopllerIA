# Data Model (data-model.md)

> **Projeto:** Pulse Sales Copilot – Plataforma Inteligente de Pré-Vendas
>
> **Versão:** 1.0
>
> **Status:** Modelo de Dados Canônico
>
> **Origem:**
>
> - business-context-lite.md
> - technical-context-lite.md
> - prd-lite.md
> - architecture.md

---

# 1. Objetivo

Este documento define o modelo conceitual, lógico e físico dos dados utilizados pela plataforma Pulse Sales Copilot.

O modelo foi projetado para:

- suportar arquitetura multiagentes;
- permitir auditoria completa;
- preservar histórico das análises;
- suportar RAG;
- possibilitar evolução incremental.

---

# 2. Princípios

- UUID como chave primária.
- Auditoria em todas as entidades.
- Soft Delete.
- Versionamento de documentos.
- Separação entre dados transacionais e conhecimento.
- Banco relacional + banco vetorial.

---

# 3. Visão Geral

```text
Customer
      │
      ▼
Opportunity
      │
      ▼
Briefing
      │
      ├──────────────┐
      ▼              ▼
Question        Recommendation
      │              │
      ▼              ▼
Answer       PortfolioItem
      │
      ▼
FinalBriefing

```

---

# 4. Modelo Conceitual

## Customer

Representa o cliente.

Campos

- id
- name
- segment
- industry
- country
- state
- city
- created_at
- updated_at

---

## Opportunity

Representa uma oportunidade comercial.

Campos

- id
- customer_id
- title
- description
- source
- status
- owner_id
- created_at
- updated_at

Status possíveis

- RECEIVED
- DISCOVERY
- QUALIFICATION
- RECOMMENDATION
- REVIEW
- COMPLETED
- ARCHIVED

---

## Briefing

Representa o briefing recebido.

Campos

- id
- opportunity_id
- raw_content
- normalized_content
- language
- source
- confidence
- version
- created_at

---

## Discovery

Resultado do Discovery Agent.

Campos

- id
- briefing_id
- problem
- objectives
- stakeholders
- constraints
- assumptions
- summary

---

## Qualification

Resultado da qualificação.

Campos

- id
- discovery_id
- completeness_score
- confidence_score
- quality_score
- status

---

## Question

Perguntas geradas pela IA.

Campos

- id
- qualification_id
- category
- priority
- text
- rationale
- status

Categorias

- Técnica
- Comercial
- Infraestrutura
- Segurança
- Compliance
- Negócio

---

## Answer

Resposta da pergunta.

Campos

- id
- question_id
- answer
- author
- answered_at

---

## PortfolioItem

Catálogo oficial.

Campos

- id
- manufacturer
- category
- product
- service
- description
- lifecycle
- tags

---

## Recommendation

Recomendações produzidas.

Campos

- id
- qualification_id
- portfolio_item_id
- confidence
- justification
- risks

---

## FinalBriefing

Documento produzido.

Campos

- id
- opportunity_id
- executive_summary
- context
- requirements
- recommendations
- next_steps
- exported_at

---

## KnowledgeDocument

Documento indexado.

Campos

- id
- title
- type
- source
- version
- checksum
- indexed_at

---

## Embedding

Representação vetorial.

Campos

- id
- document_id
- chunk
- embedding
- metadata

---

## User

Usuários da plataforma.

Campos

- id
- name
- email
- role
- active

Papéis

- Admin
- Sales
- PreSales
- Architect
- Manager

---

## Session

Sessão de trabalho.

Campos

- id
- user_id
- started_at
- finished_at
- correlation_id

---

## AuditLog

Registro de auditoria.

Campos

- id
- entity
- entity_id
- action
- actor
- timestamp
- payload

---

# 5. Relacionamentos

Customer

1:N

Opportunity

---

Opportunity

1:N

Briefing

---

Briefing

1:1

Discovery

---

Discovery

1:1

Qualification

---

Qualification

1:N

Question

---

Question

1:1

Answer

---

Qualification

1:N

Recommendation

---

Recommendation

N:1

PortfolioItem

---

Opportunity

1:1

FinalBriefing

---

KnowledgeDocument

1:N

Embedding

---

User

1:N

Opportunity

---

User

1:N

Session

---

# 6. Modelo Relacional

## customers

PK

id

---

## opportunities

PK

id

FK

customer_id

owner_id

---

## briefings

PK

id

FK

opportunity_id

---

## discoveries

PK

id

FK

briefing_id

---

## qualifications

PK

id

FK

discovery_id

---

## questions

PK

id

FK

qualification_id

---

## answers

PK

id

FK

question_id

---

## recommendations

PK

id

FK

qualification_id

portfolio_item_id

---

## portfolio_items

PK

id

---

## final_briefings

PK

id

FK

opportunity_id

---

## users

PK

id

---

## sessions

PK

id

FK

user_id

---

## audit_logs

PK

id

---

## knowledge_documents

PK

id

---

## embeddings

PK

id

FK

document_id

---

# 7. Banco Vetorial

Coleções

- portfolio
- proposals
- faqs
- playbooks
- manuals
- architectures
- sessions

---

# 8. Índices

customers

- name

---

opportunities

- status
- owner
- created_at

---

briefings

- opportunity
- language

---

portfolio_items

- manufacturer
- category
- product

---

knowledge_documents

- source
- version

---

# 9. Estratégia de Versionamento

Cada briefing possui:

- version
- created_at
- updated_at

Nenhuma versão é sobrescrita.

Sempre é criada uma nova revisão.

---

# 10. Auditoria

Todas as alterações deverão registrar:

- usuário
- data
- ação
- entidade
- valores anteriores
- novos valores

---

# 11. Retenção

Sessões

365 dias

Logs

5 anos

Briefings

Permanente

Embeddings

Reindexáveis

---

# 12. Regras de Integridade

- Todo Briefing pertence a uma Opportunity.
- Toda Opportunity pertence a um Customer.
- Toda Recommendation referencia um PortfolioItem válido.
- Nenhuma Recommendation pode existir sem Qualification.
- Todo FinalBriefing referencia exatamente uma Opportunity.

---

# 13. Evolução Prevista

Versão 2

- Workflow
- Aprovações
- Histórico de versões

Versão 3

- Multiempresa
- Multiportfólio
- Multiidioma

Versão 4

- Marketplace de Agentes

---

# 14. Diagrama ER (Simplificado)

```text
Customer
    │
    ├──< Opportunity
              │
              ├──< Briefing
                        │
                        ├── Discovery
                                │
                                ├── Qualification
                                         │
                    ┌────────────────────┴──────────────┐
                    ▼                                   ▼
                Question                        Recommendation
                    │                                   │
                    ▼                                   ▼
                Answer                         PortfolioItem

Opportunity
      │
      ▼
FinalBriefing

KnowledgeDocument
      │
      ▼
Embedding
```

---

# 15. Status

**Documento:** data-model.md

**Persona:** @engineer

**Estado:** ✅ Modelo de Dados Canônico

**Dependências:**

- business-context-lite.md
- technical-context-lite.md
- prd-lite.md
- architecture.md
- api-spec.md

**Próximos artefatos recomendados:**

1. `openapi.yaml`
2. `database-schema.sql`
3. `adr/0001-data-architecture.md`
4. `sequence-diagrams.md`
5. `deployment.md`

# Technical Context Lite

> **Projeto:** Pulse Sales Copilot — Plataforma Inteligente de Pré-Vendas
>
> **Versão:** 1.0 (Canônica)
>
> **Status:** Planejamento Técnico (@engineer)
>
> **Origem:** Derivado do `business-context-lite.md`

---

# 1. Objetivo Técnico

Definir a arquitetura técnica necessária para implementar a Plataforma Inteligente de Pré-Vendas descrita no Business Context.

Este documento responde à pergunta:

> **Como o sistema será construído?**

Não contém código-fonte, apenas especificações técnicas, arquitetura e plano de implementação.

---

# 2. Objetivos Técnicos

A solução deverá:

- interpretar linguagem natural;
- transformar briefings em conhecimento estruturado;
- identificar lacunas automaticamente;
- consultar o portfólio corporativo;
- recomendar soluções;
- gerar documentação estruturada;
- permitir evolução incremental para uma arquitetura multiagentes.

---

# 3. Arquitetura Geral

```
                Usuário

                    │

                    ▼

        Interface Web / Chat

                    │

                    ▼

          API Gateway / Backend

                    │

        ┌───────────┼───────────┐

        ▼           ▼           ▼

 Discovery     Portfolio     Memory

    Agent         Agent        Agent

        ▼           ▼           ▼

      Qualification Agent

                ▼

        Briefing Generator

                ▼

         Compliance Agent

                ▼

        Documento Final
```

---

# 4. Arquitetura em Camadas

## Camada 1

Interface

Responsável por:

- Web
- Chat
- Upload de arquivos
- API

---

## Camada 2

Aplicação

Responsável por:

- autenticação
- orquestração
- workflows
- gerenciamento das sessões

---

## Camada 3

Motor de IA

Responsável por:

- interpretação
- classificação
- descoberta
- recomendação

---

## Camada 4

Conhecimento

Responsável por:

- Portfólio
- Memória
- Vetores
- Documentação

---

## Camada 5

Persistência

- PostgreSQL
- Object Storage
- Vector Database

---

# 5. Arquitetura Multiagentes

## Discovery Agent

Responsabilidade

Interpretar o briefing recebido.

Entradas

- Texto
- Email
- PDF
- DOCX

Saídas

- Problema
- Objetivo
- Contexto
- Stakeholders

---

## Qualification Agent

Responsável por:

- identificar lacunas
- construir perguntas
- organizar prioridades

---

## Portfolio Agent

Responsável por:

- consultar catálogo
- calcular aderência
- justificar recomendações

---

## Compliance Agent

Responsável por:

- validar políticas
- impedir alucinações
- validar LGPD

---

## Briefing Agent

Responsável por:

gerar o briefing estruturado.

---

## Memory Agent

Responsável por:

- consultar oportunidades anteriores
- recuperar conhecimento
- reutilizar aprendizados

---

# 6. Fluxo Principal

```
Receber Briefing

↓

Normalizar Entrada

↓

Interpretar Contexto

↓

Descobrir Lacunas

↓

Gerar Perguntas

↓

Consultar Portfólio

↓

Calcular Aderência

↓

Gerar Briefing

↓

Validação Humana

↓

Exportação
```

---

# 7. Fluxo de Dados

Entradas

- Texto
- PDF
- DOCX
- WhatsApp
- Email

↓

Parser

↓

Modelo de IA

↓

Agentes

↓

Banco Vetorial

↓

Briefing

↓

Usuário

---

# 8. Modelo Conceitual

## Opportunity

- id
- cliente
- descrição
- origem
- data

---

## Briefing

- contexto
- problema
- objetivos
- requisitos
- restrições

---

## Question

- categoria
- prioridade
- texto

---

## Solution

- produto
- serviço
- aderência
- justificativa

---

## Portfolio

- categoria
- fabricante
- produto
- serviço

---

# 9. Banco de Dados

## Relacional

PostgreSQL

Principais tabelas

- opportunities
- briefings
- portfolio
- users
- sessions

---

## Vetorial

Objetivo

Busca semântica.

Conteúdo

- documentação
- propostas
- portfólio
- playbooks
- FAQs

---

# 10. Integrações

## MVP

- Upload Manual

---

## Futuro

- CRM
- SharePoint
- Microsoft Teams
- Outlook
- OneDrive
- APIs corporativas

---

# 11. Stack Tecnológica

## Backend

- Python
- FastAPI

---

## IA

- OpenAI
- LangChain/LangGraph (opcional)
- MCP (Model Context Protocol)

---

## Banco

- PostgreSQL
- pgvector

---

## Frontend

- React
- Next.js

---

## Infraestrutura

- Docker
- Kubernetes
- Azure

---

# 12. Requisitos Não Funcionais

## Performance

Resposta inferior a 10 segundos para um briefing padrão.

---

## Escalabilidade

Arquitetura preparada para múltiplos agentes.

---

## Segurança

- OAuth2
- JWT
- RBAC

---

## Auditoria

Registrar:

- prompts
- respostas
- decisões
- revisões

---

# 13. Segurança

Implementar

- autenticação
- autorização
- criptografia
- logs
- auditoria
- segregação de acesso

---

# 14. Estratégia de IA

A IA nunca poderá:

- inventar produtos
- inventar funcionalidades
- responder fora do portfólio

Quando houver dúvida deverá responder:

> Informação insuficiente.

---

# 15. Estratégia RAG

Base de conhecimento

- Portfólio
- Propostas
- FAQs
- Casos anteriores
- Procedimentos

Pipeline

```
Consulta

↓

Embedding

↓

Busca Vetorial

↓

Contexto

↓

LLM

↓

Resposta
```

---

# 16. Roadmap Técnico

## Sprint 1

- Estrutura do projeto
- Backend
- Banco

---

## Sprint 2

- Discovery Agent
- Qualification Agent

---

## Sprint 3

- Portfolio Agent
- RAG

---

## Sprint 4

- Briefing Agent
- Compliance

---

## Sprint 5

- Interface

---

## Sprint 6

- Testes
- Deploy

---

# 17. Estratégia de Testes

## Unitários

- Agentes

## Integração

- Fluxo completo

## Funcionais

- Casos reais

## Aceitação

Especialistas de Pré-Vendas

---

# 18. Critérios para Início da Implementação

Antes de gerar código é obrigatório que:

- Business Context esteja aprovado.
- Portfólio esteja disponível.
- Personas estejam definidas.
- Critérios de aceite estejam aprovados.
- Arquitetura validada.

---

# 19. Estrutura Inicial do Projeto

```
docs/
├── business-context-lite.md
├── technical-context-lite.md
├── onion-cycles.md
├── knowledge-base/
└── sessions/

backend/
frontend/
agents/
rag/
database/
tests/
infra/
```

---

# 20. Próximas Entregas

1. PRD Técnico
2. Arquitetura C4
3. Modelo de Dados Completo
4. Especificação dos Agentes
5. Contratos de API
6. Plano de Deploy
7. Plano de Observabilidade
8. Plano de Segurança
9. Plano de Testes
10.   Início da Implementação

---

# Status

**Persona:** @engineer

**Estado:** ✅ Planejamento Técnico Consolidado

**Dependência atendida:** `business-context-lite.md`

**Próximo ciclo recomendado:** Implementação controlada (Work), após validação da arquitetura técnica.

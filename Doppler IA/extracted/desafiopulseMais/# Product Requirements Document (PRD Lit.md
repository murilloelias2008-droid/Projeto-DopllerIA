# Product Requirements Document (PRD Lite)

> **Projeto:** Pulse Sales Copilot – Plataforma Inteligente de Pré-Vendas
>
> **Versão:** 1.0
>
> **Status:** Pronto para Engenharia
>
> **Origem:**
>
> - business-context-lite.md
> - technical-context-lite.md

---

# 1. Objetivo do Produto

Desenvolver uma plataforma inteligente que auxilie a equipe de Pré-Vendas na qualificação de oportunidades comerciais, transformando briefings não estruturados em documentação organizada, identificando lacunas de informação, recomendando soluções aderentes ao portfólio corporativo e reduzindo o tempo necessário para elaboração de propostas.

---

# 2. Problema

Atualmente a equipe de Pré-Vendas depende da experiência individual dos especialistas para interpretar briefings incompletos.

Como consequência:

- alto retrabalho;
- baixa padronização;
- demora na elaboração de propostas;
- múltiplas interações com o cliente;
- perda de oportunidades.

---

# 3. Objetivos de Negócio

## Primários

- Reduzir o tempo de qualificação.
- Reduzir retrabalho.
- Padronizar o levantamento técnico.
- Melhorar a qualidade das propostas.

## Secundários

- Preservar conhecimento organizacional.
- Facilitar treinamento.
- Aumentar produtividade.
- Melhorar taxa de conversão.

---

# 4. Público-Alvo

## Usuários Primários

- Analistas de Pré-Vendas

## Usuários Secundários

- Comercial
- Arquitetos de Solução
- Delivery
- Gestores

---

# 5. Escopo do MVP

## Incluído

- Recepção de Briefings
- Interpretação por IA
- Descoberta da Dor
- Identificação de Lacunas
- Perguntas Inteligentes
- Consulta ao Portfólio
- Score do Briefing
- Geração do Briefing Estruturado

## Fora do MVP

- CRM
- ERP
- Workflow Comercial
- Geração automática da proposta
- Licitações
- Clientes Públicos

---

# 6. Requisitos Funcionais

## RF-01 Receber Briefings

O sistema deverá aceitar:

- Texto
- Email
- PDF
- DOCX
- WhatsApp
- Upload de arquivos

---

## RF-02 Interpretar Contexto

O sistema deverá identificar automaticamente:

- objetivo
- problema
- contexto
- stakeholders
- restrições
- urgência

---

## RF-03 Identificar Lacunas

O sistema deverá identificar informações ausentes e classificá-las por prioridade.

---

## RF-04 Gerar Perguntas

O sistema deverá produzir perguntas contextualizadas para complementar o briefing.

---

## RF-05 Consultar Portfólio

O sistema deverá relacionar necessidades identificadas com produtos e serviços existentes no portfólio oficial.

---

## RF-06 Calcular Score

O sistema deverá gerar indicadores de:

- completude;
- consistência;
- qualidade;
- confiança.

---

## RF-07 Gerar Briefing

O sistema deverá produzir automaticamente um briefing estruturado contendo:

- resumo executivo;
- contexto;
- problema;
- objetivos;
- requisitos;
- restrições;
- recomendações;
- próximos passos.

---

# 7. Requisitos Não Funcionais

## Performance

Tempo máximo recomendado:

- até 10 segundos para um briefing padrão.

## Segurança

- autenticação;
- autorização;
- criptografia;
- auditoria;
- conformidade com LGPD.

## Escalabilidade

Arquitetura preparada para múltiplos agentes.

## Auditabilidade

Registrar:

- prompts;
- respostas;
- decisões;
- revisões.

---

# 8. Regras de Negócio

RN-01

O portfólio oficial é a única fonte autorizada.

RN-02

A IA nunca poderá inventar informações.

RN-03

Toda recomendação deverá possuir justificativa.

RN-04

Toda lacuna deverá ser explicitamente indicada.

RN-05

A decisão final sempre pertence ao especialista humano.

RN-06

Toda saída deverá ser auditável.

---

# 9. Fluxo Principal

1. Receber briefing.
2. Interpretar contexto.
3. Descobrir lacunas.
4. Gerar perguntas.
5. Consultar portfólio.
6. Calcular aderência.
7. Gerar briefing estruturado.
8. Revisão humana.
9. Exportação.

---

# 10. Casos de Uso

## UC-01 Receber Briefing

**Ator**

Analista de Pré-Vendas

**Resultado Esperado**

Briefing registrado.

---

## UC-02 Qualificar Oportunidade

**Resultado**

Problemas e lacunas identificados.

---

## UC-03 Recomendar Soluções

**Resultado**

Lista priorizada de soluções aderentes.

---

## UC-04 Gerar Briefing

**Resultado**

Documento estruturado pronto para revisão.

---

# 11. Critérios de Aceite

O MVP será considerado aprovado quando:

- interpretar corretamente briefings reais;
- identificar lacunas relevantes;
- gerar perguntas úteis;
- consultar corretamente o portfólio;
- gerar briefing estruturado;
- permitir revisão humana antes do envio.

---

# 12. KPIs

## Operacionais

- Tempo médio de qualificação
- Tempo até proposta
- Número de rodadas de descoberta

## Qualidade

- Score médio do briefing
- Completude
- Precisão

## Negócio

- Conversão
- Receita influenciada
- Tempo de resposta

---

# 13. Riscos

- Portfólio desatualizado.
- Alucinação da IA.
- Resistência à adoção.
- Falta de métricas históricas.
- Dependência de especialistas.

---

# 14. Dependências

- Portfólio oficial atualizado.
- Base histórica de propostas.
- Especialistas para validação.
- Base documental para RAG.
- Definição dos KPIs.

---

# 15. Roadmap do MVP

## Sprint 1

- Recepção de Briefings

## Sprint 2

- Discovery Agent
- Qualification Agent

## Sprint 3

- Portfolio Agent
- Busca Semântica (RAG)

## Sprint 4

- Briefing Agent
- Compliance Agent

## Sprint 5

- Interface

## Sprint 6

- Testes
- Deploy

---

# 16. Critérios para Início da Implementação

Antes do desenvolvimento deverão estar aprovados:

- Business Context Lite
- Technical Context Lite
- PRD Lite
- Portfólio Corporativo
- Critérios de Aceite
- Arquitetura Técnica

---

# Aprovação

| Papel                   | Responsável | Status |
| ----------------------- | ----------- | ------ |
| Product Owner           |             | ☐      |
| Especialista Pré-Vendas |             | ☐      |
| Arquitetura             |             | ☐      |
| Engenharia              |             | ☐      |

---

# Status

**Documento:** PRD Lite

**Persona:** @product → @engineer

**Estado:** ✅ Pronto para detalhamento técnico e planejamento da implementação.

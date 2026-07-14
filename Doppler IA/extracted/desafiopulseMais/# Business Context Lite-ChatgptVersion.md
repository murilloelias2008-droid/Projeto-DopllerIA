# Business Context Lite

> **Projeto:** Pulse Sales Copilot — Plataforma Inteligente de Pré-Vendas
>
> **Versão:** 1.0 (Canônica)
>
> **Status:** Especificação Consolidada (@product)
>
> **Documento:** Fonte Oficial de Negócio

---

# 1. Visão do Produto

## Objetivo

Construir uma plataforma inteligente de apoio à decisão para a equipe de Pré-Vendas capaz de transformar briefings não estruturados em oportunidades qualificadas, reduzindo retrabalho, padronizando a descoberta de requisitos e aumentando significativamente a qualidade das propostas comerciais.

A plataforma atuará como um **Copiloto Inteligente de Pré-Vendas**, utilizando Inteligência Artificial para acelerar a construção do levantamento técnico, mantendo o especialista humano como responsável pela decisão final.

---

## Missão

Acelerar o processo comercial através da padronização do levantamento de requisitos, reduzindo o tempo entre o recebimento da oportunidade e a entrega da proposta.

---

## Visão

Ser a plataforma inteligente de referência para engenharia comercial, tornando o conhecimento da empresa reutilizável, escalável e continuamente evolutivo.

---

## Proposta de Valor

Transformar qualquer briefing recebido por diferentes canais em um levantamento técnico estruturado e completo.

Entradas suportadas:

- E-mail
- WhatsApp
- Texto Livre
- PDF
- Word
- Reuniões
- Áudio transcrito

Saída produzida:

- Briefing Estruturado
- Perguntas Pendentes
- Classificação da Oportunidade
- Recomendações de Solução
- Score de Qualidade
- Próximos Passos

---

# 2. Contexto de Negócio

## Situação Atual

O processo de Pré-Vendas depende fortemente do conhecimento individual dos especialistas.

Cada oportunidade possui características próprias, fazendo com que grande parte do trabalho seja executado manualmente.

Os briefings chegam incompletos, obrigando o especialista a interpretar, complementar informações e consultar diversas fontes antes de conseguir elaborar uma proposta.

---

## Problemas Identificados

- Briefings incompletos
- Informações contraditórias
- Falta de padronização
- Conhecimento concentrado em especialistas
- Retrabalho
- Longo tempo de preparação
- Dificuldade de escalar a equipe
- Perda de oportunidades por atraso

---

## Causa Raiz

Não existe atualmente um processo estruturado capaz de converter automaticamente um briefing inicial em um roteiro completo de levantamento técnico.

Cada profissional utiliza sua própria experiência para decidir quais perguntas fazer.

Consequentemente:

- aumenta o retrabalho;
- aumenta o tempo de resposta;
- aumenta a dependência de especialistas.

---

## Impactos

### Operacionais

- Alto esforço manual
- Muitas consultas internas
- Dificuldade de treinamento

### Comerciais

- Propostas demoradas
- Perda de competitividade
- Baixa previsibilidade

### Estratégicos

- Conhecimento não documentado
- Baixa reutilização
- Escalabilidade limitada

---

# 3. Público-Alvo

## Público Primário

- Analistas de Pré-Vendas

## Público Secundário

- Comercial
- Arquitetos de Solução
- Delivery
- Customer Success
- Gestores

---

# 4. Personas

## Analista de Pré-Vendas

### Objetivos

- Produzir rapidamente um levantamento completo.
- Reduzir retrabalho.
- Aumentar qualidade técnica.

### Dores

- Briefings incompletos.
- Pouco tempo.
- Dependência de especialistas.

---

## Comercial

### Objetivos

Responder rapidamente ao cliente.

### Dores

- Longo tempo para receber propostas.
- Muitas idas e vindas.

---

## Gestor

### Objetivos

Padronizar o processo.

### Dores

- Baixa previsibilidade.
- Dependência de pessoas.

---

# 5. Escopo do MVP

## Incluído

- Recepção de Briefings
- IA para interpretação
- Descoberta da dor
- Identificação de lacunas
- Perguntas Inteligentes
- Consulta ao Portfólio
- Matching de Soluções
- Score do Briefing
- Geração do Briefing Estruturado

---

## Fora do MVP

- CRM
- ERP
- Workflow Comercial
- Licitações
- Clientes Públicos
- Geração automática da proposta comercial

---

# 6. Objetivos do Produto

O sistema deverá:

- Interpretar linguagem natural.
- Descobrir necessidades.
- Identificar lacunas.
- Classificar oportunidades.
- Recomendar soluções.
- Apoiar Pré-Vendas.
- Produzir documentação estruturada.

---

# 7. Funcionalidades

## F-01 Recepção de Briefings

Entradas:

- Email
- WhatsApp
- PDF
- DOCX
- Texto
- Upload

---

## F-02 Descoberta da Dor

Extrair automaticamente:

- Objetivo
- Problema
- Contexto
- Stakeholders
- Restrições
- Urgência

---

## F-03 Qualificação Inteligente

Detectar:

- Lacunas
- Ambiguidades
- Contradições

Gerar perguntas automaticamente.

---

## F-04 Score

Calcular:

- Completude
- Consistência
- Confiabilidade
- Qualidade

---

## F-05 Consulta ao Portfólio

Relacionar:

Necessidade

↓

Produtos

↓

Serviços

↓

Aderência

↓

Justificativa

↓

Riscos

---

## F-06 Briefing Estruturado

Produzir:

- Resumo Executivo
- Contexto
- Objetivos
- Escopo
- Requisitos
- Restrições
- Soluções
- Próximos Passos

---

# 8. Backlog Inicial

| ID   | Funcionalidade | Prioridade | Status          |
| ---- | -------------- | ---------- | --------------- |
| F-01 | Recepção       | Alta       | Pronto para Dev |
| F-02 | Descoberta     | Alta       | Pronto para Dev |
| F-03 | Qualificação   | Alta       | Pronto para Dev |
| F-04 | Score          | Média      | Pronto para Dev |
| F-05 | Matching       | Alta       | Pronto para Dev |
| F-06 | Briefing       | Alta       | Pronto para Dev |

---

# 9. Collect

## Dor

Os especialistas gastam muito tempo descobrindo informações que poderiam ser identificadas automaticamente.

---

## Valor

Reduzir tempo.

Padronizar conhecimento.

Melhorar qualidade.

---

## Hipóteses

- IA entende briefings.
- IA encontra lacunas.
- IA recomenda soluções.
- IA reduz retrabalho.

---

# 10. Refine

## Perguntas

- Qual o tempo médio atual?
- Quantas rodadas existem?
- Quais tecnologias possuem maior volume?
- Qual a principal causa de perda?

---

## Pendências

Levantar:

- baseline;
- KPIs;
- métricas históricas;
- exemplos reais.

---

# 11. Spec

## User Story

Como Analista de Pré-Vendas

Quero receber automaticamente um roteiro completo de levantamento

Para reduzir retrabalho e acelerar a elaboração da proposta.

---

## Regras de Negócio

1. Portfólio oficial é a única fonte de verdade.
2. Nunca inventar informações.
3. IA recomenda.
4. Humano decide.
5. Toda recomendação possui justificativa.
6. Toda lacuna deve ser explicitamente indicada.
7. Toda saída deve ser auditável.
8. Respeitar LGPD.

---

## Critérios de Aceite

- Interpretar corretamente o briefing.
- Gerar perguntas relevantes.
- Identificar lacunas.
- Relacionar soluções aderentes.
- Produzir briefing estruturado.
- Permitir revisão humana.

---

# 12. Arquitetura Funcional

## Agente de Descoberta

Compreende a necessidade.

---

## Agente de Qualificação

Constrói perguntas.

---

## Agente de Portfólio

Relaciona soluções.

---

## Agente de Compliance

Valida regras.

---

## Agente de Briefing

Produz documentação.

---

## Agente de Memória

Consulta histórico.

---

# 13. Indicadores (KPIs)

## Operacionais

- Tempo de qualificação
- Tempo até proposta
- Rodadas de descoberta

## Qualidade

- Score do briefing
- Completude
- Precisão

## Negócio

- Conversão
- Receita influenciada
- Tempo de resposta

---

# 14. Roadmap

## MVP

- Recepção
- IA
- Descoberta

## V1

- Portfólio Inteligente

## V2

- Memória Organizacional

## V3

- Plataforma Multiagentes

## V4

- Integração Corporativa

---

# 15. Riscos

- Portfólio desatualizado
- Alucinação da IA
- Resistência dos usuários
- Falta de métricas históricas
- Dependência de especialistas

---

# 16. Dependências

- Portfólio atualizado
- Briefings reais
- Especialistas
- Base histórica
- Definição dos KPIs

---

# 17. Critérios de Sucesso

O projeto será considerado bem-sucedido quando:

- reduzir o tempo de qualificação;
- reduzir retrabalho;
- aumentar a qualidade dos briefings;
- padronizar o processo de descoberta;
- aumentar a produtividade da Pré-Vendas;
- melhorar a aderência entre problema e solução;
- permitir reutilização do conhecimento organizacional.

---

# 18. Transição para o Ciclo @engineer

Com este documento aprovado, a próxima etapa será elaborar o **technical-context-lite.md**, contendo:

- Arquitetura lógica
- Arquitetura física
- Arquitetura multiagentes
- Stack tecnológica
- Modelo de dados
- Integrações
- Requisitos não funcionais
- Plano de implementação
- Estratégia de testes
- Roadmap técnico

---

# Status

**Persona:** @product

**Estado:** ✅ Especificação Consolidada

**Próximo Ciclo:** @engineer

**Documento considerado a Fonte Oficial de Negócio (Business Source of Truth).**

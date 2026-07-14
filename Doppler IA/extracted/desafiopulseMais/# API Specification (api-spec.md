# API Specification (api-spec.md)

> **Projeto:** Pulse Sales Copilot – Plataforma Inteligente de Pré-Vendas
>
> **Versão:** 1.0
>
> **Status:** Especificação de APIs
>
> **Padrão:** REST + JSON
>
> **Baseado em:**
>
> - business-context-lite.md
> - technical-context-lite.md
> - prd-lite.md
> - architecture.md

---

# 1. Objetivo

Este documento define os contratos da API do Pulse Sales Copilot.

Todas as APIs seguem o padrão REST e serão documentadas posteriormente em OpenAPI 3.1.

---

# 2. Princípios

- RESTful
- JSON UTF-8
- HTTPS obrigatório
- JWT Bearer Authentication
- Versionamento por URL
- Idempotência quando aplicável
- Observabilidade por Correlation-ID

Base URL

```
/api/v1
```

---

# 3. Autenticação

## Login

```
POST /auth/login
```

Request

```json
{
   "email": "user@empresa.com",
   "password": "********"
}
```

Response

```json
{
   "accessToken": "...",
   "refreshToken": "...",
   "expiresIn": 3600
}
```

---

## Refresh Token

```
POST /auth/refresh
```

---

## Logout

```
POST /auth/logout
```

---

# 4. Usuários

## Listar usuários

```
GET /users
```

---

## Buscar usuário

```
GET /users/{id}
```

---

## Criar usuário

```
POST /users
```

---

## Atualizar usuário

```
PUT /users/{id}
```

---

## Remover usuário

```
DELETE /users/{id}
```

---

# 5. Briefings

## Criar Briefing

```
POST /briefings
```

Request

```json
{
   "title": "Cliente XPTO",
   "source": "email",
   "content": "Texto do briefing..."
}
```

Response

```json
{
   "id": "BRF-001",
   "status": "RECEIVED"
}
```

---

## Listar Briefings

```
GET /briefings
```

Filtros

- status
- customer
- date
- owner

---

## Buscar Briefing

```
GET /briefings/{id}
```

---

## Atualizar Briefing

```
PUT /briefings/{id}
```

---

## Excluir Briefing

```
DELETE /briefings/{id}
```

---

# 6. Discovery

## Executar Descoberta

```
POST /briefings/{id}/discovery
```

Response

```json
{
   "problem": "...",
   "objectives": [],
   "stakeholders": [],
   "restrictions": []
}
```

---

# 7. Qualification

## Identificar Lacunas

```
POST /briefings/{id}/qualification
```

Response

```json
{
   "missingInformation": [],
   "questions": [],
   "priority": "HIGH"
}
```

---

# 8. Perguntas

## Listar Perguntas

```
GET /briefings/{id}/questions
```

---

## Responder Pergunta

```
POST /briefings/{id}/questions/{questionId}
```

---

# 9. Portfólio

## Buscar Produtos

```
GET /portfolio
```

Filtros

- categoria
- fabricante
- tecnologia

---

## Recomendar Soluções

```
POST /briefings/{id}/recommendations
```

Response

```json
{
   "recommendations": [
      {
         "product": "...",
         "confidence": 0.94,
         "reason": "..."
      }
   ]
}
```

---

# 10. Score

## Calcular Score

```
POST /briefings/{id}/score
```

Response

```json
{
   "score": 89,
   "completeness": 92,
   "confidence": 94
}
```

---

# 11. Briefing Final

## Gerar Documento

```
POST /briefings/{id}/generate
```

---

## Exportar PDF

```
GET /briefings/{id}/export/pdf
```

---

## Exportar DOCX

```
GET /briefings/{id}/export/docx
```

---

# 12. Memória Organizacional

## Buscar Casos Similares

```
POST /memory/search
```

Request

```json
{
   "query": "Firewall para Hospital"
}
```

---

# 13. Base Vetorial

## Indexar Documento

```
POST /knowledge/index
```

---

## Buscar Conhecimento

```
POST /knowledge/search
```

---

# 14. Administração

## Health Check

```
GET /health
```

---

## Readiness

```
GET /ready
```

---

## Métricas

```
GET /metrics
```

---

# 15. Modelo de Erros

```json
{
   "timestamp": "2026-07-04T12:00:00Z",
   "status": 400,
   "code": "INVALID_REQUEST",
   "message": "Campo obrigatório não informado.",
   "correlationId": "..."
}
```

---

# 16. Códigos HTTP

| Código | Uso                    |
| ------ | ---------------------- |
| 200    | Sucesso                |
| 201    | Criado                 |
| 202    | Processamento iniciado |
| 204    | Sem conteúdo           |
| 400    | Requisição inválida    |
| 401    | Não autenticado        |
| 403    | Sem permissão          |
| 404    | Não encontrado         |
| 409    | Conflito               |
| 422    | Erro de validação      |
| 429    | Rate limit             |
| 500    | Erro interno           |

---

# 17. Segurança

Todos os endpoints protegidos exigem:

```
Authorization: Bearer <token>
```

Headers obrigatórios

```
Content-Type: application/json
Accept: application/json
X-Correlation-ID
```

---

# 18. Versionamento

```
/api/v1
```

Mudanças incompatíveis:

```
/api/v2
```

---

# 19. Eventos Futuros

- BriefingCreated
- DiscoveryCompleted
- QualificationCompleted
- RecommendationGenerated
- BriefingGenerated
- ExportCompleted

---

# 20. Próxima Evolução

Este documento servirá de base para:

- OpenAPI 3.1
- Swagger UI
- SDK TypeScript
- SDK Python
- Testes de Contrato
- Mock Server
- Coleção Postman

---

# Status

**Documento:** api-spec.md

**Persona:** @engineer

**Estado:** ✅ Contratos REST definidos

**Próximos artefatos recomendados:**

1. data-model.md
2. openapi.yaml
3. sequence-diagrams.md
4. deployment.md
5. adr/0001-architecture.md

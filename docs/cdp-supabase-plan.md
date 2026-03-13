# Plano CDP + Supabase

## Fontes lidas antes do plano

- Vault Obsidian `CDP Platform/00-10`: visão geral, arquitetura, modelo de dados, store, rotas, changelog e estado de implementação.
- Código local: `src/lib/mock-data.ts` e `src/lib/store.tsx`.
- Context7: `@supabase/supabase-js`, `supabase/cli` e exemplos de Auth + `profiles` + RLS.
- Composio: toolkit `supabase` disponível, mas ainda sem conexão ativa.
- BMAD: síntese dos papéis PM, Analyst, Architect, Dev, QA e UX.

## Diagnóstico atual

O projeto é uma SPA React/Vite sem backend real. O domínio já existe com clareza no frontend:

- `contatos`
- `tags`
- `importacoes` com reversão e orphaning
- `inconsistencias` com `conflict.entries[]`
- `usuarios` e `perfis`

A decisão correta é transformar o Supabase no backend primário do produto, não apenas como banco:

- Postgres para persistência relacional
- Auth para identidade do time
- RLS para isolamento por workspace
- RPCs para ações críticas de negócio
- CLI/Composio para migrations e operações seguras

## Síntese dos especialistas BMAD

### John (PM)

- O menor slice validável não é “tudo do frontend em SQL”.
- O menor slice é: workspace, autenticação, membros, contatos, tags, importações e inconsistências.
- Usuários/perfis precisam ser reais porque o produto já expõe governança de time.

### Mary (Analyst)

- O modelo atual tem invariantes de negócio importantes e não pode ser achatado:
- um contato pode vir de múltiplas importações
- uma inconsistência pode envolver N fontes
- remover uma base não apaga o contato; recalcula `import_status`
- permissões são por categoria/ação, não apenas por papel textual

### Winston (Architect)

- Estrutura multi-tenant por `workspace_id` em todas as tabelas de domínio.
- `service_role` nunca no browser.
- Operações de mutação sensíveis devem virar funções RPC com checagem de permissão no banco.
- A primeira migração deve nascer idempotente e com RLS desde o início, não “depois”.

### Amelia (Dev)

- O cutover deve ser em fases:
- Fase 1: schema + client + queries + RPC
- Fase 2: leitura real do workspace
- Fase 3: mutações página por página
- Fase 4: desligar `mock-data`

### Quinn (QA)

- Testes obrigatórios por camada:
- migration smoke test
- RLS policy tests
- RPC tests para `revert_import` e `resolve_inconsistency_case`
- smoke E2E para login, contatos, upload/reversão e resolução de inconsistências

### Sally (UX)

- O banco não deve alterar a UX atual.
- As rotas e affordances atuais já formam um bom contrato de produto.
- A migração deve preservar labels PT-BR, feedback de toast e a responsabilidade única por página.

## Modelo alvo

### Tenant e acesso

- `workspaces`
- `profiles` ligado a `auth.users`
- `access_profiles`
- `access_profile_permissions`
- `workspace_members`

### Domínio CDP

- `contacts`
- `tags`
- `contact_tags`
- `imports`
- `import_contacts`
- `inconsistency_cases`
- `inconsistency_conflict_entries`

## Regras que viram contrato de banco

### Contatos

- `email` único por workspace
- `canonical_source` usa enum `vendas | email | whatsapp`
- `status` usa enum `ativo | inativo | pendente`
- `import_status` usa enum `ativo | orphaned`

### Importações

- uma importação tem `status: processando | ativa | revertida | erro`
- vínculo N:N entre contato e importação em `import_contacts`
- reversão atualiza `contacts.import_status` por trigger/função

### Inconsistências

- uma inconsistência pertence a um contato
- `source_list` suporta múltiplas fontes
- conflito detalhado fica em `inconsistency_conflict_entries`
- resolução registra `resolved_with`, `resolved_at`, `resolved_by`

### Permissões

Perfis e ações seguem exatamente o contrato atual da UI:

- `Bases`: `Upload de bases`, `Excluir bases`
- `Inconsistências`: `Visualizar`, `Resolver conflitos`, `Marcar órfão`
- `Contatos`: `Visualizar`, `Editar`, `Excluir`
- `Tags`: `Criar`, `Editar`, `Excluir`
- `Exportação`: `Exportar CSV`, `Exportar Excel`
- `Time`: `Convidar usuários`, `Alterar perfis`, `Remover usuários`

## RLS e backend

### Princípios

- Todo dado de domínio é protegido por `workspace_id`.
- `authenticated` acessa apenas workspaces dos quais participa.
- Verificação de permissão usa função central `has_workspace_permission(...)`.
- `service_role` fica restrito a automações, CLI, Composio e funções privilegiadas.

### RPCs criadas na primeira fase

- `create_workspace_with_defaults(p_name, p_slug)`
- `revert_import(p_import_id)`
- `resolve_inconsistency_case(p_case_id, p_choice)`

Essas RPCs encapsulam regras que hoje vivem no reducer.

## Plano de execução

### Fase 1 — Fundação Supabase

- Conectar o projeto Supabase no Composio.
- Aplicar a migration inicial em `supabase/migrations/20260313133000_cdp_initial_schema.sql`.
- Validar tabelas, enums, funções e políticas.
- Gerar tipos finais do schema com `supabase gen types --linked`.

### Fase 2 — Leitura real

- Criar bootstrap do workspace atual via `VITE_SUPABASE_WORKSPACE_SLUG`.
- Substituir leitura de `tags`, `contacts`, `imports` e `inconsistency_cases` por queries Supabase.
- Manter fallback explícito para mocks apenas durante transição.

### Fase 3 — Mutações

- Tags: create/update/delete
- Contatos: edit/delete/tag assignment
- Inconsistências: resolver e marcar órfão
- Upload: criar importação + anexar contatos + reverter via RPC
- Time/Perfis: membros e permissões

### Fase 4 — Corte definitivo

- Remover `mock-data.ts` como fonte de verdade
- Transformar `store.tsx` em cache local/estado de UI, não banco em memória
- Adicionar testes de integração e smoke E2E

## Como usar Composio neste projeto

### Sequência recomendada

1. Conectar o toolkit `supabase`
2. `SUPABASE_RETURNS_PROJECT_S_READONLY_MODE_STATUS`
3. `SUPABASE_LIST_TABLES`
4. `SUPABASE_GET_TABLE_SCHEMAS`
5. `SUPABASE_APPLY_A_MIGRATION`
6. `SUPABASE_LIST_MIGRATION_HISTORY`

### Observação

Sem a conexão ativa do Composio, o plano e os artefatos locais estão prontos, mas a aplicação remota da migration continua pendente.

## Workflow CLI recomendado

```bash
supabase link --project-ref wybcwzwececsaasbfqud
supabase db push
supabase gen types --linked > src/lib/supabase/database.types.ts
```

## Critério de pronto

- Login real com Supabase Auth
- Um workspace inicial criado
- Contatos/tags/importações/inconsistências persistidos no banco
- RLS validado para `Admin`, `Editor` e `Viewer`
- `mock-data.ts` fora do caminho crítico

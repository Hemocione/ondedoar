# 🩸 Hemocione — Onde Doar

**Onde Doar** é a plataforma de mapa interativo do [Hemocione](https://hemocione.com.br) para ajudar pessoas a encontrarem os pontos de doação de sangue mais próximos de você. O sistema agrega hemocentros, bancos de sangue, hospitais, eventos de coleta e pedidos de ajuda em um único mapa, com localização em tempo real e busca por endereço.

> Acesso em produção: [ondedoar.hemocione.com.br](https://ondedoar.hemocione.com.br)

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Stack tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração local](#-configuração-local)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Rodando o projeto](#-rodando-o-projeto)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## 🎯 Sobre o projeto

O **Onde Doar** resolve um problema simples, mas crucial: saber **onde** e **quando** é possível doar sangue. A plataforma consome dados de múltiplas fontes do ecossistema Hemocione e os exibe em um mapa com pins categorizados por tipo de local:

| Tipo | Descrição |
|------|-----------|
| `bloodbank` | Banco de sangue |
| `hemocenter` | Hemocentro |
| `hospital` | Hospital com coleta |
| `event` | Evento temporário de doação |
| `askforhelp` | Pedido de ajuda urgente |

O usuário pode permitir o acesso à localização para ver os pontos próximos, buscar por endereço, e visualizar detalhes de cada local como telefone, link externo e endereço completo.

A aplicação suporta modo **iframe** (para ser embutida em outros sites do ecossistema Hemocione) e autenticação via **HemocioneID** (SSO centralizado).

---

## 🛠 Stack tecnológica

### Frontend
- **[Nuxt 4](https://nuxt.com/)** — framework fullstack baseado em Vue 3
- **[Vue 3](https://vuejs.org/)** — framework de UI reativo
- **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática
- **[Pinia](https://pinia.vuejs.org/)** — gerenciamento de estado
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utilitários de estilo
- **[@nuxt/ui](https://ui.nuxt.com/)** — componentes de UI prontos para Nuxt
- **[MapLibre GL](https://maplibre.org/)** + **[vue-maplibre-gl](https://github.com/indoorequal/vue-maplibre-gl)** — mapas interativos open-source
- **[Nominatim (OpenStreetMap)](https://nominatim.org/)** — geocodificação de endereços

### Backend (Nitro / servidor Nuxt)
- **[Mongoose](https://mongoosejs.com/)** — ODM para MongoDB
- **[Inngest](https://www.inngest.com/)** — agendamento de jobs de sincronização de dados
- **[Google Geocoding API](https://developers.google.com/maps/documentation/geocoding)** — geocodificação server-side

### Infraestrutura
- **[Vercel](https://vercel.com/)** — hospedagem e deploy
- **[MongoDB](https://www.mongodb.com/)** — banco de dados de pontos geoespaciais (índice 2dsphere)
- **[Docker](https://www.docker.com/)** — MongoDB local via docker-compose

### Integrações externas
- **HemocioneID** — autenticação SSO e fonte de pontos de coleta
- **Hemocione Digital Events** — eventos de doação
- **Hemocione Ask for Help** — pedidos de ajuda urgentes

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** `v22.12` (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- **Yarn** `1.22.x`
- **Docker** e **Docker Compose** (para o MongoDB local)
- **GitHub CLI** (`gh`) — opcional, para criar PRs e clonar repositórios privados

> **Dica:** Use o `.nvmrc` incluído no projeto para selecionar a versão correta do Node automaticamente:
> ```bash
> nvm use
> ```

---

## ⚙️ Configuração local

### 1. Clone o repositório

```bash
git clone https://github.com/hemocione/ondedoar.git
cd ondedoar
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Suba o banco de dados local

O projeto usa MongoDB. Para subir uma instância local com Docker:

```bash
docker-compose up -d
```

Isso inicia um container MongoDB na porta `27018` (mapeada internamente para `27017`).

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias (veja a seção abaixo).

### 5. (Opcional) Popule o banco com dados de exemplo

```bash
yarn mongo:populate
```

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto. Abaixo está a lista completa de variáveis com suas descrições e valores padrão para desenvolvimento:

```dotenv
# ─── Banco de dados ────────────────────────────────────────────────────────────
# URI de conexão com o MongoDB
MONGODB_URI=mongodb://localhost:27018/local

# Nome do banco de dados
MONGODB_NAME=local

# ─── HemocioneID (SSO e pontos de coleta) ──────────────────────────────────────
# URL pública do HemocioneID (frontend — para redirecionamento de login)
HEMOCIONEID_URL=http://localhost:8080

# URL da API interna do HemocioneID (usada server-side)
HEMOCIONEID_API_URL=http://localhost:8080

# Segredo compartilhado com o back-office do HemocioneID
HEMOCIONEID_SECRET=secret

# Chave do cookie de autenticação (nome do cookie no browser)
HEMOCIONE_AUTH_COOKIE_KEY=devHemocioneId

# ─── Hemocione Digital Events ───────────────────────────────────────────────────
# URL da API de eventos digitais
HEMOCIONE_DIGITAL_EVENTS_API_URL=http://localhost:3001

# ─── Hemocione Ask for Help ────────────────────────────────────────────────────
# URL da API de pedidos de ajuda
HEMOCIONE_ASK_FOR_HELP_API_URL=http://localhost:3001

# Segredo compartilhado com a API de pedidos de ajuda
HEMOCIONE_ASK_FOR_HELP_SECRET=secret

# ─── Inngest (jobs assíncronos) ─────────────────────────────────────────────────
# Chave de evento do Inngest (obtenha em https://www.inngest.com/)
INNGEST_EVENT_KEY=devInngestApiKey

# ─── Vercel (definido automaticamente em deploys na Vercel) ────────────────────
# VERCEL_ENV=production
# VERCEL_URL=seu-projeto.vercel.app
```

> **Nota:** As variáveis `VERCEL_ENV` e `VERCEL_URL` são injetadas automaticamente pela Vercel durante o deploy e não precisam ser configuradas manualmente.

---

## 🚀 Rodando o projeto

### Desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Build de produção

```bash
yarn build
```

### Preview do build

```bash
yarn preview
```

### Geração estática (SSG)

```bash
yarn generate
```

### Dev server do Inngest (jobs assíncronos)

Em um terminal separado, com o servidor de desenvolvimento rodando:

```bash
yarn inngest:dev
```

---

## 📁 Estrutura do projeto

```
ondedoar/
├── app.vue                     # Ponto de entrada da aplicação
├── nuxt.config.ts              # Configuração do Nuxt (módulos, runtime config, etc.)
├── docker-compose.yml          # MongoDB para desenvolvimento local
├── package.json
│
├── assets/
│   ├── css/global.css          # Estilos globais
│   ├── pngs/                   # Ícones PNG dos pins do mapa
│   └── vectors/                # Ícones SVG dos pins do mapa
│
├── components/
│   ├── MapLibre.client.vue     # Componente principal do mapa (client-only)
│   ├── PinMarker.vue           # Marcadores dos pontos no mapa
│   ├── BottomDrawer.vue        # Gaveta inferior com lista de pontos visíveis
│   ├── ItemShortInfo.vue       # Card resumido de um ponto
│   ├── ItemMoreDetails.vue     # Detalhes completos de um ponto
│   ├── PlaceSearchInput.vue    # Campo de busca por endereço
│   ├── HemocioneHeader.client.vue  # Cabeçalho da aplicação
│   ├── HemocioneEnableLocation.vue # Modal para solicitar permissão de localização
│   └── TypeTag.vue             # Tag de tipo do ponto (hospital, evento, etc.)
│
├── composables/
│   ├── ondedoar.ts             # Fetching e parsing dos pontos da API
│   ├── geoCoding.ts            # Geocodificação via Nominatim (OpenStreetMap)
│   └── states.ts               # Estados globais compartilhados
│
├── layouts/
│   ├── default.vue             # Layout padrão
│   └── SearchPlaces.vue        # Layout com busca de lugares
│
├── middleware/
│   └── auth.ts                 # Middleware de autenticação via HemocioneID
│
├── pages/
│   ├── index.vue               # Página principal (mapa)
│   └── test/index.vue          # Página de testes
│
├── plugins/
│   └── auth.ts                 # Plugin de autenticação (executado no mount)
│
├── public/                     # Assets públicos (favicon, logos)
│
├── server/
│   ├── api/
│   │   ├── inngest/            # Endpoint do Inngest
│   │   └── v1/
│   │       ├── points/         # GET /api/v1/points — lista pontos ativos
│   │       └── sync/           # Endpoints de sincronização de dados
│   ├── db/
│   │   ├── models/
│   │   │   ├── points.ts       # Model Mongoose dos pontos (com índice 2dsphere)
│   │   │   └── syncManager.ts  # Model de controle de sincronização
│   │   └── populate.ts         # Script para popular o banco com dados de exemplo
│   ├── plugins/
│   │   └── mongoose.ts         # Plugin de conexão com MongoDB
│   ├── services/
│   │   ├── point.ts            # Serviço de pontos (queries no MongoDB)
│   │   ├── hemocioneid.ts      # Integração com HemocioneID
│   │   ├── events.ts           # Integração com Hemocione Digital Events
│   │   └── hemocioneAskForHelp.ts  # Integração com Hemocione Ask for Help
│   ├── tasks/
│   │   └── jobs/               # Jobs do Inngest (sync de dados externos)
│   └── utils/
│       ├── geocodingService.ts # Geocodificação server-side (Google Maps)
│       └── lruCache.ts         # Cache LRU para otimização de requests
│
├── store/
│   ├── map.ts                  # Store Pinia do mapa (pontos, centro, features visíveis)
│   └── users.ts                # Store Pinia do usuário (auth, permissão de localização)
│
└── utils/
    ├── currentUserTokenDecoder.ts  # Decodifica o JWT do usuário
    ├── decodeB64.ts                # Utilitário de decodificação base64
    ├── formatSubtitle.ts           # Formata subtítulos dos pontos
    └── getHemocioneIdUrl.ts        # Monta a URL de login do HemocioneID
```

---

## 🤝 Como contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

1. **Fork** o repositório e clone o seu fork localmente
2. Crie uma branch descritiva a partir de `main`:
   ```bash
   git checkout -b feat/minha-funcionalidade
   # ou
   git checkout -b fix/meu-bug
   ```
3. Faça suas alterações seguindo as convenções do projeto:
   - Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
   - TypeScript: adicione tipagem sempre que possível (evite `any`)
   - Componentes Vue: mantenha a separação `<template>` / `<script setup>` / `<style>`
4. Suba a branch e abra um **Pull Request** para `main` com uma descrição clara do que foi feito

### Dicas para o ambiente de desenvolvimento

- O Nuxt DevTools está habilitado em desenvolvimento — acesse via o ícone flutuante na tela
- Use `docker-compose up -d` para subir o MongoDB antes de iniciar o servidor
- As sincronizações de dados externos são feitas via Inngest; para testá-las localmente, rode `yarn inngest:dev` em paralelo com `yarn dev`

---

## 📄 Licença

Este projeto é mantido pela equipe do [Hemocione](https://hemocione.com.br). Consulte o repositório ou entre em contato com a equipe para informações sobre licenciamento.

---

<div align="center">
  Feito com ❤️ pela equipe Hemocione — ajudando a salvar vidas através da tecnologia.
</div>

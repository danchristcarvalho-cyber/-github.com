# Governança Pro

Aplicação em Node.js com servidor HTTP nativo para expor uma landing page premium, um dashboard executivo e 6 diagnósticos estratégicos para negócios em crescimento.

## Visão geral

A Governança Pro foi criada para líderes que já estão crescendo, mas precisam de mais clareza, controle e disciplina para escalar sem perder velocidade. A proposta combina estratégia, financeiro, relacionamento e governança em uma experiência elegante, executiva e orientada à venda.

### Módulos principais

1. Índice de Servidão
2. Validação de Preço Justo
3. Conciliação Estratégica
4. Alinhamento de Sociedade (Jugo)
5. Engenharia de Transbordo
6. Auditor de Descanso Estratégico

A interface está disponível em português, inglês e espanhol. A escolha do idioma é salva no navegador e também aplicada aos diagnósticos da API. O campo opcional `language` aceita `pt`, `en` ou `es`.

## Posicionamento comercial

“Seu negócio está crescendo, mas a estrutura não está acompanhando. A Governança Pro foi feita para você parar de operar no escuro e começar a escalar com inteligência.”

A solução ajuda empresas em expansão a:

- reduzir risco financeiro invisível
- melhorar margem e previsibilidade
- fortalecer decisões sem improviso
- identificar conflitos e desalinhamentos de parceria
- equilibrar ritmo de execução com sustentabilidade
- crescer com disciplina, controle e visão executiva

## Diferenciais

- interface premium e orientada à decisão executiva
- 6 diagnósticos estratégicos em um único painel
- arquitetura leve, simples e fácil de evoluir
- foco em clareza financeira, governança e crescimento saudável
- compatível com PWA e deploy em ambientes leves como Vercel
- narrativa comercial forte e posicionamento direto para PMEs e líderes em expansão

## Mensagem de pitch

“Seu negócio está crescendo, mas a estrutura não está acompanhando. O problema não é vender mais — é crescer sem controle. A Governança Pro ajuda líderes a enxergar os riscos invisíveis da operação e transformar caos em direção, previsibilidade e lucro.”

## Roteiro de apresentação em 2 minutos

1. Apresentar o problema: risco financeiro escondido, parcerias desalinhadas, margem frágil e decisões feitas sob pressão.
2. Mostrar como a plataforma transforma esses desafios em diagnósticos acionáveis.
3. Demonstrar os 6 módulos e seu impacto direto em saúde, clareza, velocidade e margem.
4. Destacar a combinação entre arquitetura leve, experiência premium e orientação executiva para crescer com disciplina.

## Vídeo curto de apresentação

O projeto inclui um fluxo de vídeo curto de apresentação e uma rota preparada para geração com IA. O bloco visual da landing ajuda a demonstrar o produto em poucos segundos.

### Endpoint de vídeo com IA

```http
POST /api/v1/generate-ai-video
```

Exemplo:

```bash
curl -X POST http://localhost:3000/api/v1/generate-ai-video \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Negócios em crescimento precisam de clareza executiva.","duration":20}'
```

A aplicação tenta usar IA real quando há credenciais configuradas:

- `OPENAI_API_KEY`
- `REPLICATE_API_TOKEN`

Se não houver chave, ela usa uma fonte de demonstração para manter o fluxo visual funcionando sem quebrar a experiência.

## Estrutura do projeto

```text
.
├── server.js
├── routes.js
├── logic.js
├── i18n.js
├── landing.html
├── landing-hero.jpg
├── icon.svg
├── icon-180.png
├── icon-192.png
├── icon-512.png
├── logo-premium.svg
├── package.json
├── README.md
├── vercel.json
├── manifest.webmanifest
├── sw.js
├── setup.sh
├── setup.bat
├── .env.example
├── final-commercial-package.md
├── deck-final.md
├── pitch-script.md
├── video-short.md
└── test/
    └── app.test.js
```

## Como rodar

### Requisitos

- Node.js 18+

### Instalação

```bash
cd /workspaces/-github.com
npm install
```

### Execução

```bash
npm start
```

A aplicação fica disponível em:

```text
http://localhost:3000
```

## Endpoints da API

Para receber as mensagens em outro idioma, envie `language` no JSON da requisição (`pt`, `en` ou `es`).

### GET /

Retorna a landing page premium com os módulos e planos.

### GET /app

Abre o dashboard interativo. O plano pode ser informado em `?plan=basic` ou `?plan=pro`.

### POST /api/v1/debt-check

Calcula o índice de servidão com base em faturamento e parcela.

### POST /api/v1/fair-price

Avalia a margem real de uma operação.

### POST /api/v1/reconciliation

Sugere uma composição de acordo para conciliação.

### POST /api/v1/partnership-yoke

Analisa risco de parceria e jugo desigual.

### POST /api/v1/tithe-multiply

Calcula o valor de doação e o efeito de semeadura.

### POST /api/v1/sabbath-audit

Avalia a relação entre descanso e produtividade.

### POST /api/v1/generate-ai-video

Gera um payload de vídeo curto, tentando uma provider real quando configurada, com fallback para demo visual.

## Arquitetura

- `server.js`: bootstrap do servidor HTTP
- `routes.js`: roteamento de HTML e JSON
- `logic.js`: regras de negócio e diagnósticos
- `i18n.js`: internacionalização
- `landing.html`: hero, proposta comercial e layout premium
- `sw.js` e `manifest.webmanifest`: suporte PWA

## Uso em mobile

O projeto foi preparado para funcionar como PWA:

- abrir no navegador e instalar como app
- suporte a telas pequenas
- fluxo de instalação via navegador nativo

## Deploy

O projeto já está preparado para Vercel com `vercel.json` na raiz.

### Passos

```bash
cd /workspaces/-github.com
npx vercel login
npx vercel --prod --yes
```

## Observações

Este projeto foi mantido sob uma arquitetura leve para facilitar apresentação, testes, deploy e evolução comercial sem depender de frameworks pesados.

## Licença

Projeto acadêmico/experimental para demonstração de arquitetura, análise estratégica e posicionamento de produto para negócios em crescimento.


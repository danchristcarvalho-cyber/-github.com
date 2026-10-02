const test = require('node:test');
const assert = require('node:assert/strict');
const { handleRequest } = require('../routes');
const app = require('../server');
const { locales } = require('../i18n');

function createRequest(method, pathname, payload) {
  const body = payload ? JSON.stringify(payload) : '';

  return {
    method,
    url: pathname,
    headers: { host: 'localhost' },
    on(event, callback) {
      if (event === 'data') {
        callback(Buffer.from(body));
      }
      if (event === 'end') {
        callback();
      }
      return this;
    }
  };
}

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      Object.assign(this.headers, headers);
    },
    write(chunk) {
      this.body += chunk;
      return true;
    },
    end(chunk) {
      if (chunk) {
        this.body += chunk;
      }
      return this.body;
    }
  };
}

test('GET / apresenta a landing page', () => {
  const req = createRequest('GET', '/');
  const res = createResponse();

  handleRequest(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /id="landingTitle"/);
  assert.match(res.body, /data-i18n="landingPlansTitle"/);
  assert.match(res.body, /href="\/app\?plan=basic"/);
  assert.match(res.body, /href="\/app\?plan=pro"/);
  assert.match(res.body, /landing-hero\.jpg/);
  const landingScript = res.body.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(landingScript);
  assert.doesNotThrow(() => new Function(landingScript[1]));

  const translationKeys = [...res.body.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]);
  for (const language of ['pt', 'en', 'es']) {
    for (const key of translationKeys) {
      assert.equal(typeof locales[language].ui[key], 'string', `${language}.${key} deve estar traduzido`);
    }
  }
});

test('GET /app retorna o dashboard interativo', () => {
  const req = createRequest('GET', '/app');
  const res = createResponse();

  handleRequest(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Sistema de Governança Bíblica Pro/i);
  assert.match(res.body, /Índice de Servidão/i);
  assert.match(res.body, /Dados demonstrativos/i);
  assert.match(res.body, /id="presentationToggle"/);
  assert.match(res.body, /requestFullscreen/);
  assert.match(res.body, /id="installAppButton"/);
  assert.match(res.body, /beforeinstallprompt/);
  assert.match(res.body, /Adicionar à Tela de Início/);
  assert.match(res.body, /rel="apple-touch-icon" href="\/icon-180\.png"/);
  assert.match(res.body, /Foco executivo/);
  assert.match(res.body, /Liquidez/);
  assert.match(res.body, /Fluxo de caixa/);
  assert.match(res.body, /Índice de risco/);
  assert.match(res.body, /Equilibrada/);
  assert.match(res.body, /id="languageSelector"/);
  assert.match(res.body, /<option value="en">English<\/option>/);
  assert.match(res.body, /<option value="es">Español<\/option>/);
  assert.match(res.body, /data-tier="basic"/);
  assert.match(res.body, /data-tier="pro"/);
  assert.match(res.body, /data-access-tier="basic"/);
  assert.match(res.body, /data-access-tier="pro"/);
  assert.match(res.body, /governancaProAccessTier/);
  assert.match(res.body, /data-i18n="focus">Foco executivo/);
  assert.match(res.body, /data-i18n="liquidity">Liquidez/);
  assert.match(res.body, /data-i18n="cashflow">Fluxo de caixa/);

  const script = res.body.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script, 'script de interface presente');
  assert.doesNotThrow(() => new Function(script[1]));

  const translationKeys = [
    ...[...res.body.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]),
    ...[...res.body.matchAll(/data-i18n-placeholder="([^"]+)"/g)].map((match) => match[1]),
    ...[...res.body.matchAll(/data-i18n-aria-label="([^"]+)"/g)].map((match) => match[1])
  ];
  for (const language of ['pt', 'en', 'es']) {
    for (const key of translationKeys) {
      assert.equal(typeof locales[language].ui[key], 'string', `${language}.${key} deve estar traduzido`);
    }
  }
});

test('GET /app?plan=pro mantém o plano pedido pela landing page', () => {
  const req = createRequest('GET', '/app?plan=pro');
  const res = createResponse();

  handleRequest(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(res.body, /requestedTier/);
});

test('HEAD / responde como página válida sem erro de rota', () => {
  const req = createRequest('HEAD', '/');
  const res = createResponse();

  handleRequest(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.headers['Content-Type'], /text\/html/);
  assert.equal(res.body, '');
});

test('server exporta handler compatível com função serverless', () => {
  const req = createRequest('GET', '/app');
  const res = createResponse();

  app(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Sistema de Governança Bíblica Pro/i);
});

test('GET recursos PWA serve manifesto, service worker e ícone', () => {
  const assets = [
    ['/manifest.webmanifest', 'application/manifest+json'],
    ['/sw.js', 'application/javascript'],
    ['/icon.svg', 'image/svg+xml'],
    ['/icon-180.png', 'image/png'],
    ['/icon-192.png', 'image/png'],
    ['/icon-512.png', 'image/png'],
    ['/landing-hero.jpg', 'image/jpeg']
  ];

  for (const [pathname, contentType] of assets) {
    const req = createRequest('GET', pathname);
    const res = createResponse();

    handleRequest(req, res);

    assert.equal(res.statusCode, 200, `${pathname} deve responder com sucesso`);
    assert.ok(res.headers['Content-Type'].startsWith(contentType), `${pathname} deve ter MIME correto`);
    assert.ok(res.body.length > 0, `${pathname} não deve estar vazio`);
  }

  const manifestReq = createRequest('GET', '/manifest.webmanifest');
  const manifestRes = createResponse();
  handleRequest(manifestReq, manifestRes);
  const manifest = JSON.parse(manifestRes.body);
  assert.equal(manifest.start_url, '/app');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));

  const serviceWorkerReq = createRequest('GET', '/sw.js');
  const serviceWorkerRes = createResponse();
  handleRequest(serviceWorkerReq, serviceWorkerRes);
  assert.match(serviceWorkerRes.body, /'\/app'/);
  assert.match(serviceWorkerRes.body, /'\/landing-hero\.jpg'/);
  assert.match(serviceWorkerRes.body, /cache\.put\(event\.request, clone\)/);
});

test('POST /api/v1/debt-check calcula o índice de servidão', () => {
  const req = createRequest('POST', '/api/v1/debt-check', {
    faturamento: 10000,
    parcela: 3000
  });
  const res = createResponse();

  handleRequest(req, res);

  const data = JSON.parse(res.body);
  assert.equal(typeof data.resposta, 'string');
  assert.match(data.resposta, /Índice de Servidão: 30.0%/);
});

test('POST /api/v1/fair-price valida margem real', () => {
  const req = createRequest('POST', '/api/v1/fair-price', {
    custo: 200,
    preco_venda: 800
  });
  const res = createResponse();

  handleRequest(req, res);

  const data = JSON.parse(res.body);
  assert.match(data.resposta, /Margem Real: 75.0%/);
});

test('API retorna diagnósticos no idioma solicitado', () => {
  const debtReq = createRequest('POST', '/api/v1/debt-check', {
    faturamento: 10000,
    parcela: 3000,
    language: 'en'
  });
  const debtRes = createResponse();
  handleRequest(debtReq, debtRes);
  assert.match(JSON.parse(debtRes.body).resposta, /Debt burden index/);

  const priceReq = createRequest('POST', '/api/v1/fair-price', {
    custo: 200,
    preco_venda: 800,
    language: 'es'
  });
  const priceRes = createResponse();
  handleRequest(priceReq, priceRes);
  assert.match(JSON.parse(priceRes.body).resposta, /Margen real/);
});

test('POST /api/v1/partnership-yoke identifica jugo desigual', () => {
  const req = createRequest('POST', '/api/v1/partnership-yoke', {
    alinhamento: 'nao',
    horas_voce: 10,
    horas_socio: 40
  });
  const res = createResponse();

  handleRequest(req, res);

  const data = JSON.parse(res.body);
  assert.match(data.resposta, /Jugo Desigual Detectado/i);
});

test('POST /api/v1/generate-ai-video responde com vídeo e prompt', () => {
  const req = createRequest('POST', '/api/v1/generate-ai-video', {
    prompt: 'Negócios em crescimento precisam de clareza executiva.',
    duration: 20
  });
  const res = createResponse();

  handleRequest(req, res);

  const data = JSON.parse(res.body);
  assert.equal(data.status, 'ok');
  assert.ok(data.videoUrl || data.message);
  assert.ok(data.provider === 'demo' || data.provider === 'openai' || data.provider === 'replicate');
  assert.equal(typeof data.message, 'string');
});

test('server expõe inicialização robusta com porta efêmera', async () => {
  const { startServer } = require('../server');
  assert.equal(typeof startServer, 'function');

  const server = startServer(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  assert.ok(address && typeof address.port === 'number');

  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

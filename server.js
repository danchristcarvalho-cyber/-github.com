const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // INTERFACE WEB COMPACTA E ULTRA-COMPLETA (6 CARDS)
    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sistema de Governança Bíblica Pro</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0f3f5; color: #333; max-width: 900px; margin: 40px auto; padding: 0 20px; }
                    h1 { text-align: center; color: #2c3e50; font-size: 2rem; margin-bottom: 5px; }
                    p.subtitle { text-align: center; color: #7f8c8d; margin-bottom: 40px; font-weight: 500; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    @media(max-width: 768px) { .grid { grid-template-columns: 1fr; } }
                    .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; }
                    h2 { margin-top: 0; color: #2c3e50; font-size: 1.15rem; display: flex; align-items: center; gap: 8px; }
                    p.principio { font-style: italic; color: #7f8c8d; font-size: 0.85rem; border-left: 3px solid #3498db; padding-left: 10px; margin: 10px 0 20px 0; }
                    input, select, button { width: 100%; padding: 12px; margin: 6px 0; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; }
                    button { background: #2ecc71; color: white; border: none; font-weight: bold; cursor: pointer; transition: background 0.2s; margin-top: 12px; }
                    button:hover { background: #27ae60; }
                    .resultado { background: #f0fdf4; border-left: 4px solid #2ecc71; color: #166534; padding: 12px; border-radius: 6px; margin-top: 15px; display: none; font-weight: 500; white-space: pre-line; font-size: 0.9rem; }
                </style>
            </head>
            <body>
                <h1>🏛️ Sistema de Governança Bíblica Pro</h1>
                <p class="subtitle">6 Micro-Serviços Nativos de Inteligência e Sabedoria Empresarial</p>
                
                <div class="grid">
                    <!-- CARD 1: RISCO FINANCEIRO -->
                    <div class="card">
                        <h2>⚡ 1. Índice de Servidão</h2>
                        <p class="principio">"O que toma emprestado é servo do que empresta." (Provérbios 22:7)</p>
                        <input type="number" id="faturamento" placeholder="Faturamento Mensal (R$)">
                        <input type="number" id="parcela" placeholder="Valor da Parcela Mensal (R$)">
                        <button onclick="chamarAPI('/api/v1/debt-check', { faturamento: document.getElementById('faturamento').value, parcela: document.getElementById('parcela').value }, 'resDivida')">Analisar Estrutura</button>
                        <div id="resDivida" class="resultado"></div>
                    </div>

                    <!-- CARD 2: PREÇO JUSTO -->
                    <div class="card">
                        <h2>⚖️ 2. Validação de Preço Justo</h2>
                        <p class="principio">"Balança enganosa é abominação para o Senhor..." (Provérbios 11:1)</p>
                        <input type="number" id="custo" placeholder="Custo Total do Produto (R$)">
                        <input type="number" id="venda" placeholder="Preço de Venda Pretendido (R$)">
                        <button onclick="chamarAPI('/api/v1/fair-price', { custo: document.getElementById('custo').value, preco_venda: document.getElementById('venda').value }, 'resPreco')">Validar Margem</button>
                        <div id="resPreco" class="resultado"></div>
                    </div>

                    <!-- CARD 3: MEDIAÇÃO DE CONFLITOS -->
                    <div class="card">
                        <h2>🤝 3. Conciliação Estratégica</h2>
                        <p class="principio">"Concilia-te depressa com o teu adversário..." (Mateus 5:25)</p>
                        <input type="number" id="valorDisputa" placeholder="Valor em Disputa (R$)">
                        <input type="number" id="custoProcesso" placeholder="Custo de Processar (Advogados/Taxas) (R$)">
                        <button onclick="chamarAPI('/api/v1/reconciliation', { valor_disputa: document.getElementById('valorDisputa').value, custo_processo: document.getElementById('custoProcesso').value }, 'resMediacao')">Gerar Acordo</button>
                        <div id="resMediacao" class="resultado"></div>
                    </div>

                    <!-- CARD 4: BÔNUS - ANALISE DE SOCIEDADE -->
                    <div class="card">
                        <h2>💼 4. Alinhamento de Sociedade (Jugo)</h2>
                        <p class="principio">"Não vos ponhais em jugo desigual com os incrédulos..." (2 Coríntios 6:14)</p>
                        <select id="alinhamentoValores">
                            <option value="">Os valores de vida/ética são iguais?</option>
                            <option value="sim">Sim, 100% alinhados</option>
                            <option value="nao">Não, pensamos muito diferente</option>
                        </select>
                        <input type="number" id="dedicacaoSocio" placeholder="Sua dedicação semanal esperada (em horas)">
                        <input type="number" id="dedicacaoParceiro" placeholder="Dedicação esperada do sócio (em horas)">
                        <button onclick="chamarAPI('/api/v1/partnership-yoke', { alinhamento: document.getElementById('alinhamentoValores').value, horas_voce: document.getElementById('dedicacaoSocio').value, horas_socio: document.getElementById('dedicacaoParceiro').value }, 'resSociedade')">Analisar Sociedade</button>
                        <div id="resSociedade" class="resultado"></div>
                    </div>

                    <!-- CARD 5: BÔNUS - TRANSBORDO E GENEROSIDADE -->
                    <div class="card">
                        <h2>🌾 5. Engenharia de Transbordo</h2>
                        <p class="principio">"Honra ao Senhor com os teus bens... e se encherão os teus celeiros." (Provérbios 3:9-10)</p>
                        <input type="number" id="lucroLiquido" placeholder="Lucro Líquido Atual da Empresa (R$)">
                        <input type="number" id="percentualDoacao" placeholder="Percentual pretendido para doação/dízimo (%)">
                        <button onclick="chamarAPI('/api/v1/tithe-multiply', { lucro: document.getElementById('lucroLiquido').value, percentual: document.getElementById('percentualDoacao').value }, 'resGenerosidade')">Calcular Transbordo</button>
                        <div id="resGenerosidade" class="resultado"></div>
                    </div>

                    <!-- CARD 6: BÔNUS - AUDITORIA DE SABATINO -->
                    <div class="card">
                        <h2>🎯 6. Auditor de Descanso Estratégico</h2>
                        <p class="principio">"Seis dias trabalharás e farás toda a tua obra..." (Êxodo 20:9)</p>
                        <input type="number" id="diasTrabalhados" placeholder="Quantos dias você trabalha por semana? (1 a 7)">
                        <input type="number" id="faturamentoAtual" placeholder="Faturamento Mensal Atual (R$)">
                        <button onclick="chamarAPI('/api/v1/sabbath-audit', { dias: document.getElementById('diasTrabalhados').value, faturamento: document.getElementById('faturamentoAtual').value }, 'resDescanso')">Auditar Produtividade</button>
                        <div id="resDescanso" class="resultado"></div>
                    </div>
                </div>

                <script>
                    async function chamarAPI(endpoint, payload, divId) {
                        const res = await fetch(endpoint, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(payload)
                        });
                        const data = await res.json();
                        const div = document.getElementById(divId);
                        div.style.display = 'block';
                        
                        if(data.erro) {
                            div.innerText = 'Erro: ' + data.erro;
                            div.style.background = '#fef2f2';
                            div.style.color = '#991b1b';
                            div.style.borderLeftColor = '#ef4444';
                        } else {
                            div.style.background = '#f0fdf4';
                            div.style.color = '#166534';
                            div.style.borderLeftColor = '#2ecc71';
                            div.innerText = data.resposta || JSON.stringify(data, null, 2);
                        }
                    }
                </script>
            </body>
            </html>
        `);
        return;
    }

    // PROCESSAMENTO CENTRAL DOS ENDPOINTS DE API
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const responder = (statusCode, payload) => {
                res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(payload));
            };
            let dados;
            try {
                dados = JSON.parse(body);
            } catch {
                responder(400, { erro: 'O corpo da requisição deve conter um JSON válido.' });
                return;
            }
            const numero = valor => valor === '' || valor === null || valor === undefined ? NaN : Number(valor);
            const numerosValidos = (...valores) => valores.every(valor => Number.isFinite(valor) && valor >= 0);
            let resposta;
            switch (pathname) {
                case '/api/v1/debt-check': {
                    const faturamento = numero(dados.faturamento);
                    const parcela = numero(dados.parcela);
                    if (!numerosValidos(faturamento, parcela) || faturamento === 0) {
                        responder(400, { erro: 'Informe faturamento maior que zero e parcela não negativa.' });
                        return;
                    }
                    const percentual = parcela / faturamento * 100;
                    const nivel = percentual <= 20 ? 'controlado' : percentual <= 35 ? 'atenção' : 'elevado';
                    resposta = `A parcela compromete ${percentual.toFixed(1)}% do faturamento. Nível: ${nivel}.`;
                    break;
                }
                case '/api/v1/fair-price': {
                    const custo = numero(dados.custo);
                    const preco = numero(dados.preco_venda);
                    if (!numerosValidos(custo, preco) || custo === 0) {
                        responder(400, { erro: 'Informe custo maior que zero e preço de venda não negativo.' });
                        return;
                    }
                    resposta = preco < custo
                        ? `O preço está abaixo do custo em R$ ${(custo - preco).toFixed(2)}.`
                        : `A margem bruta sobre o preço de venda é ${((preco - custo) / preco * 100).toFixed(1)}%.`;
                    break;
                }
                case '/api/v1/reconciliation': {
                    const disputa = numero(dados.valor_disputa);
                    const custo = numero(dados.custo_processo);
                    if (!numerosValidos(disputa, custo)) {
                        responder(400, { erro: 'Informe valores de disputa e de processo não negativos.' });
                        return;
                    }
                    const percentual = disputa === 0 ? 0 : custo / disputa * 100;
                    resposta = `O custo informado representa ${percentual.toFixed(1)}% do valor em disputa. Compare esse custo com os termos de um possível acordo.`;
                    break;
                }
                case '/api/v1/partnership-yoke': {
                    const horasVoce = numero(dados.horas_voce);
                    const horasSocio = numero(dados.horas_socio);
                    if (!['sim', 'nao'].includes(dados.alinhamento) || !numerosValidos(horasVoce, horasSocio)) {
                        responder(400, { erro: 'Informe alinhamento de valores e horas semanais válidas para ambos.' });
                        return;
                    }
                    resposta = `${dados.alinhamento === 'sim' ? 'Valores declarados como alinhados' : 'Há divergência nos valores'}. A diferença de dedicação é de ${Math.abs(horasVoce - horasSocio).toFixed(1)} hora(s) por semana. Formalize expectativas e responsabilidades.`;
                    break;
                }
                case '/api/v1/tithe-multiply': {
                    const lucro = numero(dados.lucro);
                    const percentual = numero(dados.percentual);
                    if (!numerosValidos(lucro, percentual) || percentual > 100) {
                        responder(400, { erro: 'Informe lucro não negativo e percentual entre 0 e 100.' });
                        return;
                    }
                    const valor = lucro * percentual / 100;
                    resposta = `Valor destinado: R$ ${valor.toFixed(2)}. Saldo após essa destinação: R$ ${(lucro - valor).toFixed(2)}.`;
                    break;
                }
                case '/api/v1/sabbath-audit': {
                    const dias = numero(dados.dias);
                    const faturamento = numero(dados.faturamento);
                    if (!Number.isInteger(dias) || dias < 1 || dias > 7 || !numerosValidos(faturamento)) {
                        responder(400, { erro: 'Informe de 1 a 7 dias trabalhados e faturamento não negativo.' });
                        return;
                    }
                    resposta = `Você trabalha ${dias} dia(s) por semana e descansa ${7 - dias} dia(s). Faturamento informado: R$ ${faturamento.toFixed(2)}.`;
                    break;
                }
                default:
                    responder(404, { erro: 'Endpoint não encontrado.' });
                    return;
            }
            responder(200, { resposta });
        });
        return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ erro: 'Rota não encontrada.' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));
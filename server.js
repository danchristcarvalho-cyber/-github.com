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

    // INTERFACE WEB MINIMALISTA
    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Princípios Bíblicos em Micro-Serviços</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f7f6; color: #333; max-width: 600px; margin: 40px auto; padding: 20px; }
                    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px; }
                    h2 { margin-top: 0; color: #2c3e50; font-size: 1.2rem; }
                    p.principio { font-style: italic; color: #7f8c8d; font-size: 0.9rem; border-left: 3px solid #3498db; padding-left: 10px; }
                    input, button { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                    button { background: #2ecc71; color: white; border: none; font-weight: bold; cursor: pointer; }
                    button:hover { background: #27ae60; }
                    .resultado { background: #e8f8f5; padding: 10px; border-radius: 4px; margin-top: 10px; display: none; font-weight: 500; white-space: pre-line; }
                </style>
            </head>
            <body>
                <h1>Micro-Serviços de Governança</h1>
                
                <!-- CARD 1: RISCO FINANCEIRO -->
                <div class="card">
                    <h2>1. Análise de Risco Financeiro (/api/v1/debt-check)</h2>
                    <p class="principio">"O que toma emprestado é servo do que empresta." (Provérbios 22:7)</p>
                    <input type="number" id="faturamento" placeholder="Faturamento Mensal (R$)">
                    <input type="number" id="parcela" placeholder="Valor da Parcela Mensal (R$)">
                    <button onclick="calcularDivida()">Analisar Índice de Servidão</button>
                    <div id="resDivida" class="resultado"></div>
                </div>

                <!-- CARD 2: PREÇO JUSTO -->
                <div class="card">
                    <h2>2. Validação de Preço Justo (/api/v1/fair-price)</h2>
                    <p class="principio">"Balança enganosa é abominação para o Senhor..." (Provérbios 11:1)</p>
                    <input type="number" id="custo" placeholder="Custo Total do Produto (R$)">
                    <input type="number" id="venda" placeholder="Preço de Venda Pretendido (R$)">
                    <button onclick="validarPreco()">Validar Equidade</button>
                    <div id="resPreco" class="resultado"></div>
                </div>

                <!-- CARD 3: MEDIAÇÃO DE CONFLITOS -->
                <div class="card">
                    <h2>3. Mediação e Acordos Rápidos (/api/v1/reconciliation)</h2>
                    <p class="principio">"Concilia-te depressa com o teu adversário..." (Mateus 5:25)</p>
                    <input type="number" id="valorDisputa" placeholder="Valor Total em Disputa (R$)">
                    <input type="number" id="custoProcesso" placeholder="Custo Estimado de Processar (Advogado/Taxas) (R$)">
                    <button onclick="mediarConflito()">Gerar Proposta de Conciliação</button>
                    <div id="resMediacao" class="resultado"></div>
                </div>

                <script>
                    async function calcularDivida() {
                        const res = await fetch('/api/v1/debt-check', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ faturamento: document.getElementById('faturamento').value, parcela: document.getElementById('parcela').value })
                        });
                        const data = await res.json();
                        const div = document.getElementById('resDivida');
                        div.style.display = 'block';
                        div.innerText = 'Índice de Servidão: ' + data.indice_servidao + '%\\nDiagnóstico: ' + data.diagnostico;
                    }

                    async function validarPreco() {
                        const res = await fetch('/api/v1/fair-price', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ custo: document.getElementById('custo').value, preco_venda: document.getElementById('venda').value })
                        });
                        const data = await res.json();
                        const div = document.getElementById('resPreco');
                        div.style.display = 'block';
                        div.innerText = 'Margem Praticada: ' + data.margem_lucro + '%\\nAlerta: ' + data.status_justica;
                    }

                    async function mediarConflito() {
                        const res = await fetch('/api/v1/reconciliation', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ valor_disputa: document.getElementById('valorDisputa').value, custo_processo: document.getElementById('custoProcesso').value })
                        });
                        const data = await res.json();
                        const div = document.getElementById('resMediacao');
                        div.style.display = 'block';
                        div.innerText = 'Análise de Atrito: ' + data.indice_atrito + '%\\n' + data.proposta;
                    }
                </script>
            </body>
            </html>
        `);
        return;
    }

    // PROCESSAMENTO DOS ENDPOINTS POST
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            let data = {};
            try { data = JSON.parse(body); } catch(e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: 'JSON inválido' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

            // Endpoint 1: Risco Financeiro
            if (pathname === '/api/v1/debt-check') {
                const fat = parseFloat(data.faturamento) || 0;
                const parc = parseFloat(data.parcela) || 0;
                const indice = fat > 0 ? ((parc / fat) * 100).toFixed(1) : 100;
                
                let diagnostico = "Zona de Liberdade. Risco controlado.";
                if (indice > 30) diagnostico = "Zona de Alerta. O credor começa a ditar seus passos.";
                if (indice > 50) diagnostico = "Zona de Servidão Crítica. Você está trabalhando para o banco.";

                res.end(JSON.stringify({ indice_servidao: indice, diagnostico }));
                return;
            }

            // Endpoint 2: Preço Justo
            if (pathname === '/api/v1/fair-price') {
                const custo = parseFloat(data.custo) || 0;
                const venda = parseFloat(data.preco_venda) || 0;
                const margem = custo > 0 ? (((venda - custo) / venda) * 100).toFixed(1) : 0;

                let status_justica = "Preço Justo e Sustentável.";
                if (margem > 70) status_justica = "Alerta de Usura: Margem abusiva. Considere reduzir para gerar valor real.";
                if (margem < 10) status_justica = "Alerta de Auto-Sabotagem: Margem baixa coloca seu negócio em risco.";

                res.end(JSON.stringify({ margem_lucro: margem, status_justica }));
                return;
            }

            // Endpoint 3: Mediação de Conflitos
            if (pathname === '/api/v1/reconciliation') {
                const valor = parseFloat(data.valor_disputa) || 0;
                const custoProc = parseFloat(data.custo_processo) || 0;
                const indiceAtrito = valor > 0 ? ((custoProc / valor) * 100).toFixed(1) : 0;
                const ofertaGanhaGanha = (valor * 0.85).toFixed(2); 
                const economiaReal = (valor - ofertaGanhaGanha + custoProc).toFixed(2);

                let proposta = `Recomendação Bíblica: Faça um acordo rápido.\\n Sugestão de Resolução: Oferte o pagamento imediato de R$ ${ofertaGanhaGanha} (15% de desconto de conciliação).\\nRazão Econômica: Evitar o processo gera uma economia real combinada de cerca de R$ ${economiaReal} e elimina o desgaste emocional.`;
                
                if (custoProc >= valor) {
                    proposta = `Recomendação Bíblica Crítica: Perdoe a dívida ou ceda integralmente.\\n Razão: O custo financeiro e o tempo de litígio superam o valor da disputa. Entrar em conflito por este valor é vaidade e prejuízo garantido.`;
                }

                res.end(JSON.stringify({ indice_atrito: indiceAtrito, proposta }));
                return;
            }

            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
            return;
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

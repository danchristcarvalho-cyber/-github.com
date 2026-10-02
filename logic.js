const { getLocale } = require('./i18n');

function toNumber(value, fallback = 0) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrency(value, language) {
  const { formatLocale } = getLocale(language);
  return new Intl.NumberFormat(formatLocale, { style: 'currency', currency: 'BRL' }).format(Number(value));
}

function evaluateDebt(data = {}) {
  const fat = toNumber(data.faturamento, 0);
  const parc = toNumber(data.parcela, 0);
  const indice = fat > 0 ? ((parc / fat) * 100).toFixed(1) : 100;
  const messages = getLocale(data.language).api;
  const result = `${messages.debtLabel}: ${indice}%`;

  if (parseFloat(indice) > 50) return `${result}\n${messages.debtCritical}`;
  if (parseFloat(indice) > 30) return `${result}\n${messages.debtWarning}`;

  return `${result}\n${messages.debtSafe}`;
}

function evaluateFairPrice(data = {}) {
  const custo = toNumber(data.custo, 0);
  const venda = toNumber(data.preco_venda, 0);
  const margem = venda > 0 ? (((venda - custo) / venda) * 100).toFixed(1) : 0;
  const messages = getLocale(data.language).api;
  const result = `${messages.marginLabel}: ${margem}%`;

  if (parseFloat(margem) > 70) return `${result}\n${messages.usury}`;
  if (parseFloat(margem) < 10) return `${result}\n${messages.lowMargin}`;

  return `${result}\n${messages.sustainable}`;
}

function evaluateReconciliation(data = {}) {
  const valor = toNumber(data.valor_disputa, 0);
  const custoProc = toNumber(data.custo_processo, 0);
  const oferta = (valor * 0.85).toFixed(2);
  const messages = getLocale(data.language).api;

  if (custoProc >= valor) {
    return messages.forgive;
  }

  return messages.offer.replace('{amount}', formatCurrency(oferta, data.language));
}

function evaluatePartnership(data = {}) {
  const alinhamento = data.alinhamento;
  const messages = getLocale(data.language).api;
  return alinhamento === 'nao'
    ? `🚨 ${messages.partnershipRisk}`
    : `✅ ${messages.partnershipOk}`;
}

function evaluateTithe(data = {}) {
  const lucro = toNumber(data.lucro, 0);
  const percentual = toNumber(data.percentual, 10);
  const doacao = (lucro * (percentual / 100)).toFixed(2);
  const messages = getLocale(data.language).api;

  return `🌾 ${messages.givingTitle}: ${formatCurrency(doacao, data.language)}\n${messages.givingCopy}`;
}

function evaluateSabbath(data = {}) {
  const dias = parseInt(data.dias, 10) || 7;
  const messages = getLocale(data.language).api;
  return dias >= 7
    ? `🚨 ${messages.sabbathRisk}`
    : `✅ ${messages.sabbathOk}`;
}

module.exports = {
  evaluateDebt,
  evaluateFairPrice,
  evaluateReconciliation,
  evaluatePartnership,
  evaluateTithe,
  evaluateSabbath
};

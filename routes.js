const {
  evaluateDebt,
  evaluateFairPrice,
  evaluateReconciliation,
  evaluatePartnership,
  evaluateTithe,
  evaluateSabbath
} = require('./logic');
const { locales } = require('./i18n');
const fs = require('node:fs');
const path = require('node:path');

const staticAssets = {
    '/manifest.webmanifest': {
        body: fs.readFileSync(path.join(__dirname, 'manifest.webmanifest')),
        contentType: 'application/manifest+json; charset=utf-8',
        cacheControl: 'no-cache'
    },
    '/sw.js': {
        body: fs.readFileSync(path.join(__dirname, 'sw.js')),
        contentType: 'application/javascript; charset=utf-8',
        cacheControl: 'no-cache'
    },
    '/icon.svg': {
        body: fs.readFileSync(path.join(__dirname, 'icon.svg')),
        contentType: 'image/svg+xml; charset=utf-8',
        cacheControl: 'public, max-age=86400'
    },
    '/logo-premium.svg': {
        body: fs.readFileSync(path.join(__dirname, 'logo-premium.svg')),
        contentType: 'image/svg+xml; charset=utf-8',
        cacheControl: 'public, max-age=86400'
    },
    '/icon-180.png': {
        body: fs.readFileSync(path.join(__dirname, 'icon-180.png')),
        contentType: 'image/png',
        cacheControl: 'public, max-age=86400'
    },
    '/icon-192.png': {
        body: fs.readFileSync(path.join(__dirname, 'icon-192.png')),
        contentType: 'image/png',
        cacheControl: 'public, max-age=86400'
    },
    '/icon-512.png': {
        body: fs.readFileSync(path.join(__dirname, 'icon-512.png')),
        contentType: 'image/png',
        cacheControl: 'public, max-age=86400'
    },
    '/landing-hero.jpg': {
        body: fs.readFileSync(path.join(__dirname, 'landing-hero.jpg')),
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=86400'
    }
};

const landingHtml = fs.readFileSync(path.join(__dirname, 'landing.html'), 'utf8')
    .replace('__LOCALES__', JSON.stringify(locales));

const homeHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <meta name="theme-color" content="#0b1220">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="Governança Pro">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="description" content="Dashboard de governança, estratégia e análise para decisões empresariais e pessoais.">
        <link rel="manifest" href="/manifest.webmanifest">
        <link rel="icon" href="/icon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/icon-180.png">
        <title>Sistema de Governança Bíblica Pro</title>
        <style>
            :root {
                --bg: #07151e;
                --bg-2: #0d1d2b;
                --panel: rgba(10, 17, 27, 0.88);
                --panel-strong: rgba(9, 15, 24, 0.96);
                --primary: #72f1d6;
                --primary-dark: #2ec9b1;
                --primary-soft: rgba(114, 241, 214, 0.14);
                --gold: #d7b567;
                --gold-soft: rgba(215, 181, 103, 0.18);
                --text: #edf7ff;
                --muted: #b0c2d3;
                --border: rgba(148, 163, 184, 0.18);
                --shadow: 0 24px 52px rgba(2, 6, 23, 0.48);
                --accent: #86aef8;
            }
            * { box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background:
                    radial-gradient(circle at top left, rgba(66, 153, 225, 0.18), transparent 32%),
                    radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.12), transparent 28%),
                    linear-gradient(180deg, #091b27 0%, #07151e 38%, #050d14 100%);
                color: var(--text);
                margin: 0;
                padding: max(26px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) max(52px, env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left));
                min-height: 100vh;
                min-height: 100svh;
            }
            body::before {
                content: "";
                position: fixed;
                inset: -25% auto auto -10%;
                width: 420px;
                height: 420px;
                background: rgba(134, 174, 248, 0.14);
                filter: blur(60px);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
            }
            body::after {
                content: "";
                position: fixed;
                inset: auto -15% -20% auto;
                width: 480px;
                height: 480px;
                background: rgba(114, 241, 214, 0.10);
                filter: blur(72px);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
            }
            .shell {
                max-width: 1280px;
                margin: 0 auto;
                position: relative;
                z-index: 1;
                display: grid;
                grid-template-columns: 240px minmax(0, 1fr);
                gap: 22px;
            }
            .sidebar {
                background: linear-gradient(180deg, rgba(13, 22, 32, 0.88), rgba(7, 16, 23, 0.9));
                border: 1px solid rgba(201, 167, 74, 0.2);
                border-radius: 22px;
                padding: 20px 16px;
                position: sticky;
                top: 18px;
                height: fit-content;
                box-shadow: var(--shadow);
            }
            .brand {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1rem;
                font-weight: 800;
                color: #edf5ff;
                margin-bottom: 20px;
            }
            .brand-mark {
                width: 32px;
                height: 32px;
                border-radius: 10px;
                display: grid;
                place-items: center;
                overflow: hidden;
                box-shadow: 0 10px 24px rgba(8, 15, 24, 0.35);
            }
            .brand-mark img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 10px;
                object-fit: cover;
            }
            .nav {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .nav-item {
                padding: 11px 12px;
                border-radius: 12px;
                color: var(--muted);
                background: transparent;
                border: 1px solid transparent;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
            }
            .nav-item.active {
                background: linear-gradient(135deg, rgba(114, 241, 214, 0.10), rgba(215, 181, 103, 0.08));
                border-color: rgba(114, 241, 214, 0.20);
                color: var(--primary);
                box-shadow: inset 0 0 0 1px rgba(114, 241, 214, 0.12);
            }
            .content {
                min-width: 0;
            }
            .topbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                padding: 14px 18px;
                margin-bottom: 20px;
                background: linear-gradient(180deg, rgba(12, 19, 29, 0.95), rgba(8, 14, 21, 0.9));
                border: 1px solid rgba(201, 167, 74, 0.18);
                border-radius: 18px;
                box-shadow: 0 12px 24px rgba(2, 6, 23, 0.18);
            }
            .topbar-left {
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 0;
            }
            .period-filters {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-wrap: wrap;
                gap: 8px;
                margin: 0 0 18px;
            }
            .filter-pill {
                border: 1px solid rgba(148, 163, 184, 0.16);
                background: rgba(15, 23, 42, 0.25);
                color: var(--muted);
                border-radius: 999px;
                padding: 8px 12px;
                font-size: 0.75rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.28s ease;
                transform-origin: center;
            }
            .filter-pill:hover {
                transform: translateY(-1px) scale(1.02);
                box-shadow: 0 10px 18px rgba(2, 6, 23, 0.18);
            }
            .filter-pill.active {
                background: linear-gradient(135deg, rgba(114, 241, 214, 0.12), rgba(215, 181, 103, 0.10));
                border-color: rgba(114, 241, 214, 0.35);
                color: var(--primary);
                box-shadow: 0 0 0 1px rgba(114, 241, 214, 0.18), 0 12px 28px rgba(45, 212, 191, 0.16), 0 0 20px rgba(215, 181, 103, 0.08);
                transform: scale(1.04);
            }
            .executive-hero {
                display: grid;
                grid-template-columns: 1.5fr 0.8fr;
                gap: 18px;
                margin-bottom: 24px;
            }
            .executive-score {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(59, 130, 246, 0.10));
                border: 1px solid rgba(45, 212, 191, 0.18);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 20px 30px rgba(2, 6, 23, 0.18);
                transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
            }
            .exec-label {
                display: inline-block;
                color: #baf7d8;
                background: rgba(34, 197, 94, 0.08);
                border: 1px solid rgba(34, 197, 94, 0.20);
                border-radius: 999px;
                padding: 6px 10px;
                font-size: 0.68rem;
                text-transform: uppercase;
                letter-spacing: 0.09em;
                font-weight: 800;
            }
            .exec-score {
                font-size: clamp(2.2rem, 4vw, 3.8rem);
                font-weight: 900;
                margin-top: 18px;
                letter-spacing: -0.06em;
                color: #edf5ff;
            }
            .exec-copy {
                color: var(--muted);
                font-size: 0.96rem;
                line-height: 1.6;
                margin-top: 8px;
            }
            .pulse-panel {
                background: linear-gradient(180deg, rgba(12, 18, 30, 0.96), rgba(15, 23, 42, 0.82));
                border: 1px solid rgba(148, 163, 184, 0.14);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 18px 28px rgba(2, 6, 23, 0.18);
                transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
            }
            .recommendation {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-top: 18px;
                padding: 14px 16px;
                border-radius: 14px;
                background: rgba(96, 165, 250, 0.08);
                border: 1px solid rgba(96, 165, 250, 0.18);
                color: #dfeeff;
                font-weight: 700;
            }
            .recommendation strong {
                color: #f2f7ff;
            }
            .mini-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(100px, 1fr));
                gap: 12px;
                margin-top: 18px;
            }
            .mini-box {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 12px 10px;
            }
            .mini-box .k {
                color: var(--muted);
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                font-weight: 700;
            }
            .mini-box .v {
                margin-top: 8px;
                font-size: 1.1rem;
                font-weight: 800;
                color: #f4faff;
            }
            .ghost-badge {
                display: inline-flex;
                align-items: center;
                padding: 7px 10px;
                border-radius: 999px;
                background: rgba(96, 165, 250, 0.10);
                border: 1px solid rgba(96, 165, 250, 0.18);
                color: #bfd8ff;
                font-size: 0.68rem;
                letter-spacing: 0.12em;
                font-weight: 800;
                text-transform: uppercase;
            }
            .topbar h3 {
                margin: 0;
                color: #edf5ff;
                font-size: 1rem;
                font-weight: 700;
                white-space: nowrap;
            }
            .status-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: flex-end;
            }
            .status-pill {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 11px;
                border-radius: 999px;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid var(--border);
                color: var(--muted);
                font-size: 0.73rem;
                font-weight: 700;
            }
            .status-pill.ok {
                color: #c7ffe7;
                border-color: rgba(114, 241, 214, 0.25);
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.10), rgba(114, 241, 214, 0.08));
            }
            .topbar .presentation-toggle {
                width: auto;
                min-height: 38px;
                margin: 0;
                padding: 8px 13px;
                border: 1px solid rgba(45, 212, 191, 0.28);
                border-radius: 8px;
                background: rgba(45, 212, 191, 0.10);
                color: #c9fff4;
                font-size: 0.76rem;
                white-space: nowrap;
                box-shadow: none;
            }
            .language-control {
                display: grid;
                gap: 4px;
                min-width: 112px;
            }
            .language-control label {
                margin: 0;
                color: var(--muted);
                font-size: 0.62rem;
            }
            .language-control select {
                min-height: 40px;
                margin: 0;
                padding: 6px 30px 6px 10px;
                font-size: 0.82rem;
            }
            .access-control {
                display: grid;
                gap: 4px;
                min-width: 148px;
            }
            .access-label {
                color: var(--muted);
                font-size: 0.62rem;
                font-weight: 700;
                text-transform: uppercase;
            }
            .tier-switch {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3px;
                padding: 3px;
                border: 1px solid var(--border);
                border-radius: 9px;
                background: rgba(15, 23, 42, 0.8);
            }
            .tier-option {
                width: auto;
                min-height: 36px;
                margin: 0;
                padding: 6px 10px;
                border: 1px solid transparent;
                border-radius: 6px;
                background: transparent;
                color: var(--muted);
                font-size: 0.78rem;
                box-shadow: none;
            }
            .tier-option[aria-pressed="true"] {
                color: #06221f;
                background: var(--primary);
            }
            .plan-notice {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                margin: 0 0 22px;
                padding: 14px 16px;
                border-left: 3px solid var(--primary);
                border-radius: 6px;
                background: rgba(45, 212, 191, 0.07);
                color: var(--muted);
                font-size: 0.88rem;
                line-height: 1.5;
            }
            .plan-notice[hidden] { display: none; }
            [data-access-tier][hidden] { display: none !important; }
            .plan-upgrade {
                width: auto;
                min-height: 44px;
                flex: 0 0 auto;
                margin: 0;
                padding: 8px 14px;
                white-space: nowrap;
            }
            @media(max-width: 768px) {
                .language-control { min-width: 100px; }
                .access-control { min-width: 136px; }
                .plan-notice { align-items: flex-start; flex-direction: column; }
            }
            .topbar .install-app-button {
                width: auto;
                min-height: 44px;
                margin: 0;
                padding: 8px 13px;
                border: 1px solid rgba(45, 212, 191, 0.28);
                border-radius: 8px;
                background: rgba(45, 212, 191, 0.10);
                color: #c9fff4;
                font-size: 0.76rem;
                white-space: nowrap;
                box-shadow: none;
            }
            .topbar .install-app-button[hidden] { display: none; }
            .presentation-mode .install-app-button { display: none; }
            .install-guide {
                width: min(420px, calc(100% - 32px));
                padding: 24px;
                border: 1px solid rgba(45, 212, 191, 0.24);
                border-radius: 14px;
                background: #0f172a;
                color: var(--text);
                box-shadow: var(--shadow);
            }
            .install-guide::backdrop { background: rgba(2, 6, 23, 0.72); backdrop-filter: blur(4px); }
            .install-guide h2 { margin-bottom: 12px; }
            .install-guide p { color: var(--muted); line-height: 1.6; }
            .install-guide button { min-height: 44px; }
            .presentation-mode .shell {
                display: block;
                max-width: 1200px;
            }
            .presentation-mode .sidebar,
            .presentation-mode .topbar-left,
            .presentation-mode .status-list,
            .presentation-mode .period-filters,
            .presentation-mode .decision-strip,
            .presentation-mode .summary,
            .presentation-mode .grid {
                display: none;
            }
            .presentation-mode .content { max-width: 1200px; margin: 0 auto; }
            .presentation-mode .topbar {
                position: fixed;
                z-index: 20;
                top: max(14px, calc(env(safe-area-inset-top) + 8px));
                right: max(18px, calc(env(safe-area-inset-right) + 8px));
                margin: 0;
                padding: 0;
                border: 0;
                background: transparent;
                box-shadow: none;
            }
            .presentation-mode .topbar .presentation-toggle {
                background: rgba(10, 16, 28, 0.94);
                border-color: rgba(148, 163, 184, 0.28);
                color: #edf5ff;
                box-shadow: 0 10px 24px rgba(2, 6, 23, 0.28);
            }
            .presentation-mode .hero { min-height: 310px; margin-top: 12px; }
            .presentation-mode .executive-hero,
            .presentation-mode .chart-panel { max-width: none; }
            @media(max-width: 768px) {
                .presentation-mode .topbar { top: 10px; right: 10px; }
                .presentation-mode .topbar .presentation-toggle { min-height: 36px; padding: 7px 10px; }
                .presentation-mode .hero { margin-top: 54px; }
            }
            .hero {
                position: relative;
                isolation: isolate;
                overflow: hidden;
                display: grid;
                grid-template-columns: minmax(0, 1.3fr) minmax(250px, 0.7fr);
                align-items: center;
                gap: 30px;
                padding: 38px 34px;
                margin: 0 0 26px;
                min-height: 350px;
                background:
                    linear-gradient(110deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.94) 58%, rgba(13, 50, 54, 0.78) 100%);
                border: 1px solid rgba(45, 212, 191, 0.22);
                border-radius: 22px;
                box-shadow: 0 24px 54px rgba(2, 6, 23, 0.34);
                animation: floatIn 0.6s ease;
            }
            .hero::before {
                content: "";
                position: absolute;
                z-index: -1;
                inset: 0;
                background: repeating-linear-gradient(135deg, transparent 0 34px, rgba(148, 163, 184, 0.035) 35px 36px);
                mask-image: linear-gradient(90deg, transparent 35%, #000 100%);
            }
            .pitch-copy { min-width: 0; }
            .pitch-copy .eyebrow { margin-bottom: 20px; }
            .pitch-copy h1 {
                max-width: 700px;
                font-size: 3.75rem;
                line-height: 1.02;
                margin-bottom: 16px;
            }
            .pitch-copy .subtitle {
                max-width: 620px;
                margin: 0 0 22px;
                font-size: 1.02rem;
            }
            .pitch-cta {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                width: auto;
                min-height: 48px;
                padding: 0 18px;
                margin: 0;
                border-radius: 8px;
                color: #06221f;
                text-decoration: none;
                font-weight: 800;
                background: var(--primary);
                box-shadow: 0 10px 28px rgba(45, 212, 191, 0.20);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .pitch-cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 14px 32px rgba(45, 212, 191, 0.28);
            }
            .pitch-cta span { font-size: 1.1rem; }
            .pitch-narrative {
                display: grid;
                align-content: center;
                gap: 0;
                border-left: 1px solid rgba(148, 163, 184, 0.24);
                padding-left: 26px;
            }
            .pitch-beat {
                display: grid;
                grid-template-columns: 34px 1fr;
                gap: 12px;
                padding: 15px 0;
                border-bottom: 1px solid rgba(148, 163, 184, 0.14);
            }
            .pitch-beat:last-child { border-bottom: 0; }
            .pitch-beat-number {
                color: var(--primary);
                font-size: 0.72rem;
                font-weight: 800;
                padding-top: 3px;
            }
            .pitch-beat h3 {
                margin: 0 0 5px;
                color: #edf5ff;
                font-size: 0.96rem;
            }
            .pitch-beat p {
                margin: 0;
                color: var(--muted);
                font-size: 0.82rem;
                line-height: 1.5;
            }
            .eyebrow {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                border-radius: 999px;
                background: rgba(45, 212, 191, 0.10);
                color: var(--primary);
                font-size: 0.74rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                margin-bottom: 16px;
                border: 1px solid rgba(45, 212, 191, 0.18);
                box-shadow: 0 8px 18px rgba(45, 212, 191, 0.10);
            }
            h1 {
                color: #edf5ff;
                font-size: clamp(2.1rem, 4vw, 3.1rem);
                margin: 0 0 10px;
                letter-spacing: -0.05em;
            }
            p.subtitle {
                color: var(--muted);
                margin: 0 auto 18px;
                font-weight: 600;
                font-size: 1.02rem;
                max-width: 760px;
                line-height: 1.6;
            }
            .stats {
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 18px;
            }
            .story-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(180px, 1fr));
                gap: 14px;
                max-width: 1060px;
                margin: 26px auto 0;
            }
            .story-card {
                background: rgba(13, 19, 31, 0.86);
                border: 1px solid rgba(148, 163, 184, 0.14);
                border-radius: 18px;
                padding: 18px 16px;
                min-height: 160px;
                box-shadow: 0 18px 28px rgba(2, 6, 23, 0.15);
                transition: transform 0.25s ease, border-color 0.25s ease;
            }
            .story-card:hover {
                transform: translateY(-3px);
                border-color: rgba(45, 212, 191, 0.20);
            }
            .story-kicker {
                display: inline-block;
                color: var(--primary);
                font-size: 0.68rem;
                font-weight: 800;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                margin-bottom: 12px;
            }
            .story-card h3 {
                margin: 0 0 12px;
                font-size: 1.1rem;
                color: #edf5ff;
            }
            .story-card p {
                margin: 0;
                color: var(--muted);
                line-height: 1.6;
                font-size: 0.92rem;
            }
            .stat-pill {
                background: rgba(15, 23, 42, 0.64);
                border: 1px solid var(--border);
                border-radius: 999px;
                padding: 8px 12px;
                font-size: 0.78rem;
                color: var(--muted);
                font-weight: 600;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .stat-pill:hover {
                transform: translateY(-1px);
                box-shadow: 0 12px 18px rgba(2, 6, 23, 0.25);
            }
            .decision-strip {
                display: grid;
                grid-template-columns: repeat(3, minmax(140px, 1fr));
                gap: 12px;
                margin: 0 auto 26px;
                max-width: 1060px;
            }
            .decision-item {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 12px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                color: var(--muted);
                font-weight: 700;
            }
            .decision-item strong {
                color: #f5fbff;
                font-size: 1.05rem;
                font-weight: 800;
            }
            .chart-panel {
                display: grid;
                grid-template-columns: 1.2fr 0.8fr;
                gap: 18px;
                margin: 0 auto 26px;
                max-width: 1060px;
            }
            .trend-card, .bars-card {
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.88));
                border: 1px solid var(--border);
                border-radius: 18px;
                box-shadow: var(--shadow);
                padding: 18px 18px 20px;
                transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
            }
            .trend-card {
                border-color: rgba(45, 212, 191, 0.18);
                box-shadow: 0 18px 32px rgba(45, 212, 191, 0.08), var(--shadow);
            }
            .trend-header, .bars-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 14px;
            }
            .trend-header h3, .bars-header h3 {
                margin: 0;
                font-size: 0.9rem;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: var(--muted);
            }
            .trend-block {
                height: 118px;
                border-radius: 14px;
                background:
                    linear-gradient(180deg, rgba(96, 165, 250, 0.08), rgba(15, 23, 42, 0.2)),
                    repeating-linear-gradient(
                        to right,
                        rgba(148, 163, 184, 0.08),
                        rgba(148, 163, 184, 0.08) 1px,
                        transparent 1px,
                        transparent 28px
                    );
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(148, 163, 184, 0.12);
            }
            .sparkline {
                position: absolute;
                inset: 18px 12px 12px 12px;
            }
            .sparkline svg {
                width: 100%;
                height: 100%;
                display: block;
            }
            .sparkline path {
                transition: all 0.45s ease;
            }
            .metric-list {
                display: grid;
                gap: 14px;
                margin-top: 8px;
            }
            .metric-row {
                display: grid;
                gap: 8px;
            }
            .metric-head {
                display: flex;
                justify-content: space-between;
                color: var(--muted);
                font-size: 0.74rem;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                font-weight: 700;
            }
            .bar-track {
                height: 10px;
                background: rgba(148, 163, 184, 0.10);
                border-radius: 999px;
                overflow: hidden;
            }
            .bar-fill {
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, var(--primary), #60a5fa);
                box-shadow: 0 0 18px rgba(45, 212, 191, 0.25);
                transition: width 0.45s ease, filter 0.45s ease;
            }
            .summary {
                display: grid;
                grid-template-columns: repeat(4, minmax(150px, 1fr));
                gap: 16px;
                margin: 10px auto 26px;
                max-width: 1060px;
            }
            .summary-card {
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.88));
                border: 1px solid rgba(148, 163, 184, 0.14);
                border-radius: 18px;
                padding: 18px 16px;
                box-shadow: 0 12px 26px rgba(2, 6, 23, 0.2);
                transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.35s ease;
            }
            .summary-card:nth-child(1) {
                border-color: rgba(45, 212, 191, 0.18);
                box-shadow: 0 16px 30px rgba(45, 212, 191, 0.08), 0 12px 26px rgba(2, 6, 23, 0.26);
            }
            .summary-card .label {
                color: var(--muted);
                font-size: 0.72rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                font-weight: 700;
            }
            .summary-card .value {
                font-size: clamp(1.3rem, 2vw, 2rem);
                font-weight: 800;
                color: #f8fbff;
                margin-top: 10px;
                text-shadow: 0 0 18px rgba(45, 212, 191, 0.12);
            }
            .summary-card .delta {
                margin-top: 8px;
                font-size: 0.8rem;
                font-weight: 700;
                color: #baf7d8;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
                gap: 22px;
                max-width: 1060px;
                margin: 0 auto;
            }
            @media(max-width: 768px) {
                .shell { grid-template-columns: 1fr; }
                .sidebar { position: static; }
                .grid { grid-template-columns: 1fr; }
                .executive-hero, .chart-panel { grid-template-columns: minmax(0, 1fr); }
                .decision-strip { grid-template-columns: minmax(0, 1fr); }
                .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
                .period-filters { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
                .filter-pill { width: 100%; min-height: 44px; padding: 8px 4px; font-size: 0.7rem; }
                .topbar { align-items: flex-start; flex-wrap: wrap; }
                .topbar-left { flex: 1 1 100%; flex-wrap: wrap; }
                .status-list { justify-content: flex-start; }
                .topbar .presentation-toggle { min-height: 44px; }
                .executive-hero { gap: 12px; }
                .mini-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .hero { grid-template-columns: 1fr; gap: 22px; padding: 28px 22px; min-height: 0; }
                .pitch-narrative { border-left: 0; border-top: 1px solid rgba(148, 163, 184, 0.24); padding: 8px 0 0; }
                .pitch-copy h1 { font-size: 2.65rem; }
                .presentation-mode .executive-hero,
                .presentation-mode .chart-panel { grid-template-columns: minmax(0, 1fr); }
                .presentation-mode .hero { margin-top: max(64px, calc(env(safe-area-inset-top) + 52px)); }
                .presentation-mode .topbar {
                    top: max(10px, calc(env(safe-area-inset-top) + 8px));
                    right: max(10px, calc(env(safe-area-inset-right) + 8px));
                }
                .presentation-mode .topbar .presentation-toggle { min-height: 44px; padding: 8px 12px; }
            }
            @media(max-width: 420px) {
                body { padding-right: max(12px, env(safe-area-inset-right)); padding-left: max(12px, env(safe-area-inset-left)); }
                .topbar { padding: 12px; }
                .topbar h3 { white-space: normal; }
                .hero { padding: 24px 18px; }
                .pitch-copy h1 { font-size: 2.15rem; }
                .summary-card { padding: 14px 12px; }
                .summary-card .value { font-size: 1.25rem; }
            }
            @media(max-height: 500px) and (orientation: landscape) {
                .presentation-mode .hero {
                    grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
                    min-height: 0;
                    padding: 20px;
                }
                .presentation-mode .pitch-narrative {
                    border-top: 0;
                    border-left: 1px solid rgba(148, 163, 184, 0.24);
                    padding: 0 0 0 18px;
                }
                .presentation-mode .executive-hero,
                .presentation-mode .chart-panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            .card {
                background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.9));
                padding: 24px 22px;
                border-radius: 20px;
                box-shadow: var(--shadow);
                border: 1px solid rgba(148, 163, 184, 0.18);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
                backdrop-filter: blur(6px);
            }
            .card:hover {
                transform: translateY(-3px);
                border-color: rgba(45, 212, 191, 0.24);
                box-shadow: 0 22px 48px rgba(2, 6, 23, 0.24);
            }
            .card-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            }
            h2 {
                margin: 0;
                color: #f0f7ff;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .badge {
                color: var(--primary);
                background: var(--primary-soft);
                border: 1px solid rgba(45, 212, 191, 0.15);
                border-radius: 999px;
                padding: 4px 8px;
                font-size: 0.7rem;
                font-weight: 700;
            }
            p.principio {
                font-style: italic;
                color: var(--muted);
                font-size: 0.82rem;
                border-left: 3px solid var(--accent);
                background: rgba(96, 165, 250, 0.08);
                padding: 10px 12px;
                margin: 0 0 16px;
                border-radius: 8px;
                line-height: 1.5;
            }
            label {
                display: block;
                font-size: 0.76rem;
                letter-spacing: 0.02em;
                color: var(--muted);
                text-transform: uppercase;
                font-weight: 700;
                margin-top: 10px;
            }
            input, select, button {
                width: 100%;
                padding: 12px 13px;
                margin: 7px 0 0;
                border: 1px solid var(--border);
                border-radius: 10px;
                box-sizing: border-box;
                font-size: 0.95rem;
                background: rgba(15, 23, 42, 0.88);
                color: var(--text);
            }
            input:focus, select:focus {
                border-color: rgba(45, 212, 191, 0.75);
                box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.10);
                outline: none;
            }
            button {
                background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                color: white;
                border: none;
                font-weight: 700;
                cursor: pointer;
                transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
                margin-top: 16px;
                box-shadow: 0 12px 22px rgba(23, 179, 107, 0.18);
                letter-spacing: 0.01em;
            }
            button:hover {
                opacity: 0.97;
                transform: translateY(-1px) scale(1.01);
                filter: saturate(1.06);
            }
            button:active {
                transform: translateY(0) scale(0.99);
            }
            .resultado {
                background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
                border-left: 4px solid var(--primary);
                color: #166534;
                padding: 12px 14px;
                border-radius: 12px;
                margin-top: 16px;
                display: none;
                font-weight: 600;
                white-space: pre-line;
                font-size: 0.9rem;
                line-height: 1.5;
                animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(2px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes floatIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            ::selection {
                background: rgba(23, 179, 107, 0.18);
            }
        </style>
    </head>
    <body>
        <div class="shell">
            <aside class="sidebar">
                <div class="brand">
                    <div class="brand-mark" aria-hidden="true">
                        <img src="/logo-premium.svg" alt="Governança Pro" />
                    </div>
                    <span data-i18n="brand">Governança Pro</span>
                </div>
                <nav class="nav">
                    <div class="nav-item active"><span>📊 <span data-i18n="navOverview">Visão geral</span></span><span>•</span></div>
                    <div class="nav-item"><span>⚡ <span data-i18n="navDiagnostics">Diagnósticos</span></span><span id="diagnosticsCount">3</span></div>
                    <div class="nav-item"><span>📈 <span data-i18n="navStrategy">Estratégia</span></span><span>→</span></div>
                    <div class="nav-item"><span>🤝 <span data-i18n="navRelationships">Relacionamentos</span></span><span>→</span></div>
                </nav>
            </aside>

            <div class="content">
                <div class="topbar">
                    <div class="topbar-left">
                        <span class="ghost-badge" data-i18n="executive">Executivo</span>
                        <h3 data-i18n="monitor">Monitor de governança</h3>
                    </div>
                    <div class="status-list">
                        <span class="status-pill ok">● <span data-i18n="systemActive">Sistema ativo</span></span>
                        <span class="status-pill" data-i18n="demoData">Dados demonstrativos</span>
                        <span class="status-pill">📈 <span id="modulesStatus" data-i18n="basicModules">3 módulos básicos</span></span>
                    </div>
                    <div class="language-control">
                        <label for="languageSelector" data-i18n="language">Idioma</label>
                        <select id="languageSelector" aria-label="Idioma" data-i18n-aria-label="language">
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                    <div class="access-control">
                        <span class="access-label" data-i18n="accessLevel">Tipo de acesso</span>
                        <div class="tier-switch" role="group" aria-label="Tipo de acesso" data-i18n-aria-label="accessLevel">
                            <button class="tier-option" type="button" data-tier="basic" aria-pressed="true" data-i18n="basicTier">Básico</button>
                            <button class="tier-option" type="button" data-tier="pro" aria-pressed="false" data-i18n="proTier">Pro</button>
                        </div>
                    </div>
                    <button id="installAppButton" class="install-app-button" type="button" data-i18n="install" hidden>Instalar app</button>
                    <button id="presentationToggle" class="presentation-toggle" type="button" aria-pressed="false" data-access-tier="pro">Iniciar apresentação</button>
                </div>

                <dialog id="installGuide" class="install-guide" aria-labelledby="installGuideTitle">
                    <h2 id="installGuideTitle" data-i18n="installTitle">Adicionar à tela inicial</h2>
                    <p data-i18n="installInstructions">No menu Compartilhar do navegador, escolha “Adicionar à Tela de Início” e confirme.</p>
                    <button id="closeInstallGuide" type="button" data-i18n="close">Fechar</button>
                </dialog>

                <section class="hero" aria-labelledby="pitch-title">
                    <div class="pitch-copy">
                        <div class="eyebrow" data-i18n="pitchEyebrow">Apresentação executiva · Dados demonstrativos</div>
                        <h1 id="pitch-title" data-i18n="pitchTitle">Governar com clareza. Crescer com propósito.</h1>
                        <p class="subtitle" data-i18n="basicPitchSubtitle">Comece com três diagnósticos essenciais para avaliar dívidas, preços e conciliação.</p>
                        <a class="pitch-cta" href="#executive-hero"><span data-i18n="pitchCta">Explorar visão executiva</span><span aria-hidden="true">→</span></a>
                    </div>
                    <div class="pitch-narrative" aria-label="Narrativa da proposta" data-i18n-aria-label="narrative">
                        <div class="pitch-beat">
                            <span class="pitch-beat-number">01</span>
                            <div><h3 data-i18n="see">Enxergar</h3><p data-i18n="seeCopy">Reunir riscos e oportunidades numa leitura integrada.</p></div>
                        </div>
                        <div class="pitch-beat">
                            <span class="pitch-beat-number">02</span>
                            <div><h3 data-i18n="decide">Decidir</h3><p data-i18n="decideCopy">Transformar princípios em critérios práticos de ação.</p></div>
                        </div>
                        <div class="pitch-beat">
                            <span class="pitch-beat-number">03</span>
                            <div><h3 data-i18n="advance">Avançar</h3><p data-i18n="advanceCopy">Crescer com disciplina, confiança e propósito.</p></div>
                        </div>
                    </div>
                </section>

                <div id="executive-dashboard" class="period-filters" aria-label="Filtros de período" data-i18n-aria-label="periodLabel" data-access-tier="pro">
                    <button class="filter-pill active" data-period="30d" data-i18n="days30">30 dias</button>
                    <button class="filter-pill" data-period="90d" data-i18n="days90">90 dias</button>
                    <button class="filter-pill" data-period="12m" data-i18n="months12">12 meses</button>
                    <button class="filter-pill" data-period="ytd" data-i18n="ytd">Acumulado no ano</button>
                </div>

                <div class="executive-hero" id="executive-hero">
                    <div class="executive-score">
                        <span class="exec-label" data-i18n="executiveScore">Score executivo</span>
                        <div id="execScore" class="exec-score">92/100</div>
                        <div id="execCopy" class="exec-copy">Estrutura de decisão equilibrada, com alta resiliência operativa e baixa exposição financeira em cenários críticos.</div>
                    </div>
                    <div class="pulse-panel">
                        <div class="eyebrow" style="margin-bottom: 12px;"><span aria-hidden="true">📊 </span><span data-i18n="pulse">Pulse estratégico</span></div>
                        <div class="mini-grid">
                            <div class="mini-box">
                                <div class="k" data-i18n="risk">Risco</div>
                                <div id="riskValue" class="v">Baixo</div>
                            </div>
                            <div class="mini-box">
                                <div class="k" data-i18n="profit">Lucro</div>
                                <div id="profitValue" class="v">Alta</div>
                            </div>
                            <div class="mini-box">
                                <div class="k" data-i18n="partnership">Parceria</div>
                                <div id="partnershipValue" class="v">Sólida</div>
                            </div>
                            <div class="mini-box">
                                <div class="k" data-i18n="rest">Descanso</div>
                                <div id="restValue" class="v">Saudável</div>
                            </div>
                        </div>
                        <div class="recommendation">
                            <span>💡 <span data-i18n="recommendation">Recomendação</span></span>
                            <strong id="recommendationText">Reforçar margem e proteção</strong>
                        </div>
                    </div>
                </div>

                <div class="plan-notice" id="basicPlanNotice" data-access-tier="basic">
                    <span data-i18n="basicNotice">Plano Básico: 3 diagnósticos essenciais. O Pro libera os 6 módulos, análises por período e apresentação executiva.</span>
                    <button id="activateProButton" class="plan-upgrade" type="button" data-i18n="activatePro">Ver recursos Pro</button>
                </div>

                <div class="decision-strip" data-access-tier="pro">
                    <div class="decision-item"><span data-i18n="riskIndex">Índice de risco</span><strong id="riskMetric">Baixo</strong></div>
                    <div class="decision-item"><span data-i18n="margin">Margem</span><strong id="marginMetric">Saudável</strong></div>
                    <div class="decision-item"><span data-i18n="alignment">Alinhamento</span><strong id="alignmentMetric">Forte</strong></div>
                </div>

                <div class="chart-panel" data-access-tier="pro">
                    <div class="trend-card">
                        <div class="trend-header">
                            <h3 data-i18n="trend">Tendência de desempenho</h3>
                            <span id="trendValue" class="stat-pill">+18.4%</span>
                        </div>
                        <div class="trend-block">
                            <div class="sparkline">
                                <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-label="Tendência de desempenho" data-i18n-aria-label="trend">
                                    <defs>
                                        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stop-color="rgba(45,212,191,0.45)"/>
                                            <stop offset="100%" stop-color="rgba(45,212,191,0.02)"/>
                                        </linearGradient>
                                    </defs>
                                    <path id="trendAreaPath" d="M0 78 C40 72, 55 60, 76 66 S118 40, 150 55 S210 18, 240 28 S280 12, 300 10 L300 100 L0 100 Z" fill="url(#sparkFill)" opacity="0.8"></path>
                                    <path id="trendLinePath" d="M0 78 C40 72, 55 60, 76 66 S118 40, 150 55 S210 18, 240 28 S280 12, 300 10" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="bars-card">
                        <div class="bars-header">
                            <h3 data-i18n="focus">Foco executivo</h3>
                            <span class="stat-pill" data-i18n="demoLabel">Dados de demonstração</span>
                        </div>
                        <div class="metric-list">
                            <div class="metric-row">
                                <div class="metric-head"><span data-i18n="liquidity">Liquidez</span><strong id="liquidityValue">81%</strong></div>
                                <div class="bar-track"><div id="liquidityBar" class="bar-fill" style="width:81%"></div></div>
                            </div>
                            <div class="metric-row">
                                <div class="metric-head"><span data-i18n="cashflow">Fluxo de caixa</span><strong id="cashflowValue">74%</strong></div>
                                <div class="bar-track"><div id="cashflowBar" class="bar-fill" style="width:74%"></div></div>
                            </div>
                            <div class="metric-row">
                                <div class="metric-head"><span data-i18n="partnership">Parceria</span><strong id="partnershipFocusValue">88%</strong></div>
                                <div class="bar-track"><div id="partnershipFocusBar" class="bar-fill" style="width:88%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="summary" data-access-tier="pro">
                <div class="summary-card">
                    <div class="label" data-i18n="indicators">Indicadores</div>
                    <div id="indicatorValue" class="value">6</div>
                    <div class="delta" data-i18n="activeModules">módulos ativos</div>
                </div>
                <div class="summary-card">
                    <div class="label" data-i18n="health">Saúde</div>
                    <div id="healthValue" class="value">Alta</div>
                    <div class="delta" data-i18n="controlledRisk">risco controlado</div>
                </div>
                <div class="summary-card">
                    <div class="label" data-i18n="velocity">Velocidade</div>
                    <div id="velocityValue" class="value">Instantânea</div>
                    <div class="delta" data-i18n="realTime">respostas em tempo real</div>
                </div>
                <div class="summary-card">
                    <div class="label" data-i18n="strategy">Estratégia</div>
                    <div id="strategyValue" class="value">360°</div>
                    <div class="delta" data-i18n="integrated">visão integrada</div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-header">
                        <h2>⚡ <span data-i18n="debtTitle">1. Índice de Servidão</span></h2>
                        <span class="badge" data-i18n="riskBadge">Risco</span>
                    </div>
                    <p class="principio" data-i18n="debtPrinciple">“O que toma emprestado é servo do que empresta.” (Provérbios 22:7)</p>
                    <label for="faturamento" data-i18n="revenue">Faturamento mensal</label>
                    <input type="number" id="faturamento" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <label for="parcela" data-i18n="installment">Parcela mensal</label>
                    <input type="number" id="parcela" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <button data-i18n="analyzeStructure" onclick="chamarAPI('/api/v1/debt-check', { faturamento: document.getElementById('faturamento').value, parcela: document.getElementById('parcela').value }, 'resDivida')">Analisar estrutura</button>
                    <div id="resDivida" class="resultado" aria-live="polite"></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h2>⚖️ <span data-i18n="fairPriceTitle">2. Preço Justo</span></h2>
                        <span class="badge" data-i18n="marginBadge">Margem</span>
                    </div>
                        <h2>⚖️ <span data-i18n="fairPriceTitle">2. Preço Justo</span></h2>
                        <span class="badge" data-i18n="marginBadge">Margem</span>
                    </div>
                    <p class="principio" data-i18n="fairPricePrinciple">“Balança enganosa é abominação para o Senhor...” (Provérbios 11:1)</p>
                    <label for="custo" data-i18n="totalCost">Custo total</label>
                    <input type="number" id="custo" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <label for="venda" data-i18n="salePrice">Preço de venda</label>
                    <input type="number" id="venda" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <button data-i18n="validateMargin" onclick="chamarAPI('/api/v1/fair-price', { custo: document.getElementById('custo').value, preco_venda: document.getElementById('venda').value }, 'resPreco')">Validar margem</button>
                    <div id="resPreco" class="resultado" aria-live="polite"></div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h2>🤝 <span data-i18n="reconciliationTitle">3. Conciliação</span></h2>
                        <span class="badge" data-i18n="agreementBadge">Acordo</span>
                    </div>
                    <p class="principio" data-i18n="reconciliationPrinciple">“Concilia-te depressa com o teu adversário...” (Mateus 5:25)</p>
                    <label for="valorDisputa" data-i18n="disputeValue">Valor em disputa</label>
                    <input type="number" id="valorDisputa" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <label for="custoProcesso" data-i18n="processCost">Custo do processo</label>
                    <input type="number" id="custoProcesso" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <button data-i18n="generateAgreement" onclick="chamarAPI('/api/v1/reconciliation', { valor_disputa: document.getElementById('valorDisputa').value, custo_processo: document.getElementById('custoProcesso').value }, 'resMediacao')">Gerar acordo</button>
                    <div id="resMediacao" class="resultado" aria-live="polite"></div>
                </div>
                <div class="card" data-access-tier="pro">
                    <div class="card-header">
                        <h2>💼 <span data-i18n="partnershipTitle">4. Jugo de Sociedade</span></h2>
                        <span class="badge" data-i18n="partnershipBadge">Parceria</span>
                    </div>
                    <p class="principio" data-i18n="partnershipPrinciple">“Não vos ponhais em jugo desigual...” (2 Coríntios 6:14)</p>
                    <label for="alinhamentoValores" data-i18n="valuesAlignment">Alinhamento de valores</label>
                    <select id="alinhamentoValores">
                        <option value="" data-i18n="select">Selecione</option>
                        <option value="sim" data-i18n="alignedYes">Sim, 100% alinhados</option>
                        <option value="nao" data-i18n="alignedNo">Não, pensamos muito diferente</option>
                    </select>
                    <label for="dedicacaoSocio" data-i18n="yourWeeklyHours">Sua dedicação semanal</label>
                    <input type="number" id="dedicacaoSocio" placeholder="Horas por semana" data-i18n-placeholder="hoursPlaceholder">
                    <label for="dedicacaoParceiro" data-i18n="partnerWeeklyHours">Dedicação do sócio</label>
                    <input type="number" id="dedicacaoParceiro" placeholder="Horas por semana" data-i18n-placeholder="hoursPlaceholder">
                    <button data-i18n="analyzePartnership" onclick="chamarAPI('/api/v1/partnership-yoke', { alinhamento: document.getElementById('alinhamentoValores').value, horas_voce: document.getElementById('dedicacaoSocio').value, horas_socio: document.getElementById('dedicacaoParceiro').value }, 'resSociedade')">Analisar sociedade</button>
                    <div id="resSociedade" class="resultado" aria-live="polite"></div>
                </div>
                <div class="card" data-access-tier="pro">
                    <div class="card-header">
                        <h2>🌾 <span data-i18n="titheTitle">5. Engenharia de Transbordo</span></h2>
                        <span class="badge" data-i18n="generosityBadge">Generosidade</span>
                    </div>
                    <p class="principio" data-i18n="tithePrinciple">“Honra ao Senhor com os teus bens...” (Provérbios 3:9-10)</p>
                    <label for="lucroLiquido" data-i18n="netProfit">Lucro líquido</label>
                    <input type="number" id="lucroLiquido" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <label for="percentualDoacao" data-i18n="donationPercent">Percentual para doação</label>
                    <input type="number" id="percentualDoacao" placeholder="%" data-i18n-placeholder="percentPlaceholder">
                    <button data-i18n="calculateGiving" onclick="chamarAPI('/api/v1/tithe-multiply', { lucro: document.getElementById('lucroLiquido').value, percentual: document.getElementById('percentualDoacao').value }, 'resGenerosidade')">Calcular transbordo</button>
                    <div id="resGenerosidade" class="resultado" aria-live="polite"></div>
                </div>
                <div class="card" data-access-tier="pro">
                    <div class="card-header">
                        <h2>🎯 <span data-i18n="sabbathTitle">6. Descanso Estratégico</span></h2>
                        <span class="badge" data-i18n="productivityBadge">Produtividade</span>
                    </div>
                    <p class="principio" data-i18n="sabbathPrinciple">“Seis dias trabalharás e farás toda a tua obra...” (Êxodo 20:9)</p>
                    <label for="diasTrabalhados" data-i18n="daysWorked">Dias trabalhados</label>
                    <input type="number" id="diasTrabalhados" placeholder="1 a 7" data-i18n-placeholder="daysPlaceholder">
                    <label for="faturamentoAtual" data-i18n="revenue">Faturamento mensal</label>
                    <input type="number" id="faturamentoAtual" placeholder="R$ 0,00" data-i18n-placeholder="currencyPlaceholder">
                    <button data-i18n="auditProductivity" onclick="chamarAPI('/api/v1/sabbath-audit', { dias: document.getElementById('diasTrabalhados').value, faturamento: document.getElementById('faturamentoAtual').value }, 'resDescanso')">Auditar produtividade</button>
                    <div id="resDescanso" class="resultado" aria-live="polite"></div>
                </div>
                    </div>
                </div>
            </div>
        </div>
        <script>
            const localeCatalogs = ${JSON.stringify(locales)};
            const languageSelector = document.getElementById('languageSelector');
            const storedLanguage = (() => {
                try { return localStorage.getItem('governancaProLanguage'); } catch { return null; }
            })();
            const browserLanguage = (navigator.language || 'pt').slice(0, 2).toLowerCase();
            let currentLanguage = localeCatalogs[storedLanguage] ? storedLanguage :
                (localeCatalogs[browserLanguage] ? browserLanguage : 'pt');
            const tierButtons = document.querySelectorAll('.tier-option');
            const requestedTier = new URLSearchParams(window.location.search).get('plan');
            const storedTier = (() => {
                try { return localStorage.getItem('governancaProAccessTier'); } catch { return null; }
            })();
            let currentTier = ['basic', 'pro'].includes(requestedTier)
                ? requestedTier
                : (storedTier === 'pro' ? 'pro' : 'basic');

            const periodConfig = {
                '30d': {
                    score: '92/100',
                    copy: 'Estrutura de decisão equilibrada, com alta resiliência operativa e baixa exposição financeira em cenários críticos.',
                    risk: 'Baixo',
                    profit: 'Alta',
                    partnership: 'Sólida',
                    rest: 'Saudável',
                    recommendation: 'Reforçar margem e proteção',
                    trend: '+18.4%',
                    riskMetric: 'Baixo',
                    marginMetric: 'Saudável',
                    alignmentMetric: 'Forte',
                    liquidity: { value: '81%', width: '81%' },
                    cashflow: { value: '74%', width: '74%' },
                    partnershipFocus: { value: '88%', width: '88%' },
                    indicators: '6',
                    health: 'Alta',
                    velocity: 'Instantânea',
                    strategy: '360°',
                    areaPath: 'M0 78 C40 72, 55 60, 76 66 S118 40, 150 55 S210 18, 240 28 S280 12, 300 10 L300 100 L0 100 Z',
                    linePath: 'M0 78 C40 72, 55 60, 76 66 S118 40, 150 55 S210 18, 240 28 S280 12, 300 10'
                },
                '90d': {
                    score: '88/100',
                    copy: 'Há sinais de expansão saudável, com foco necessário em proteção de fluxo e disciplina operacional.',
                    risk: 'Moderado',
                    profit: 'Boa',
                    partnership: 'Estável',
                    rest: 'Em ajuste',
                    recommendation: 'Aumentar reserva operacional',
                    trend: '+12.1%',
                    riskMetric: 'Moderado',
                    marginMetric: 'Equilibrada',
                    alignmentMetric: 'Focado',
                    liquidity: { value: '76%', width: '76%' },
                    cashflow: { value: '68%', width: '68%' },
                    partnershipFocus: { value: '82%', width: '82%' },
                    indicators: '5',
                    health: 'Média',
                    velocity: 'Rápido',
                    strategy: '270°',
                    areaPath: 'M0 68 C28 72, 58 52, 90 56 S155 42, 190 55 S238 45, 260 30 S290 18, 300 20 L300 100 L0 100 Z',
                    linePath: 'M0 68 C28 72, 58 52, 90 56 S155 42, 190 55 S238 45, 260 30 S290 18, 300 20'
                },
                '12m': {
                    score: '95/100',
                    copy: 'Crescimento consistente com disciplina estratégica e forte alinhamento entre operação e propósito.',
                    risk: 'Baixo',
                    profit: 'Muito alta',
                    partnership: 'Forte',
                    rest: 'Excelentes',
                    recommendation: 'Escalar com disciplina',
                    trend: '+26.8%',
                    riskMetric: 'Low',
                    marginMetric: 'Robusta',
                    alignmentMetric: 'Excelente',
                    liquidity: { value: '90%', width: '90%' },
                    cashflow: { value: '86%', width: '86%' },
                    partnershipFocus: { value: '94%', width: '94%' },
                    indicators: '7',
                    health: 'Ótima',
                    velocity: 'Imediato',
                    strategy: '420°',
                    areaPath: 'M0 82 C30 76, 55 60, 82 64 S140 40, 170 48 S220 28, 254 20 S281 14, 300 8 L300 100 L0 100 Z',
                    linePath: 'M0 82 C30 76, 55 60, 82 64 S140 40, 170 48 S220 28, 254 20 S281 14, 300 8'
                },
                'ytd': {
                    score: '90/100',
                    copy: 'Resultado anual sólido, com atenção ainda necessária à margem e à proteção do capital estratégico.',
                    risk: 'Controlado',
                    profit: 'Elevada',
                    partnership: 'Firme',
                    rest: 'Equilibrado',
                    recommendation: 'Reforçar plano de expansão',
                    trend: '+21.3%',
                    riskMetric: 'Controlado',
                    marginMetric: 'Resiliente',
                    alignmentMetric: 'Estável',
                    liquidity: { value: '84%', width: '84%' },
                    cashflow: { value: '79%', width: '79%' },
                    partnershipFocus: { value: '91%', width: '91%' },
                    indicators: '6',
                    health: 'Boa',
                    velocity: 'Ágil',
                    strategy: '380°',
                    areaPath: 'M0 72 C34 76, 62 60, 95 58 S160 44, 188 50 S234 28, 260 24 S288 16, 300 14 L300 100 L0 100 Z',
                    linePath: 'M0 72 C34 76, 62 60, 95 58 S160 44, 188 50 S234 28, 260 24 S288 16, 300 14'
                }
            };

            function applyPeriod(period) {
                const config = periodConfig[period] || periodConfig['30d'];
                const localized = localeCatalogs[currentLanguage].periods[period] || localeCatalogs[currentLanguage].periods['30d'];
                const panels = [
                    document.querySelector('.executive-score'),
                    document.querySelector('.pulse-panel'),
                    document.querySelector('.trend-card'),
                    document.querySelector('.bars-card'),
                    ...document.querySelectorAll('.summary-card')
                ];

                panels.forEach((panel) => {
                    if (!panel) return;
                    panel.style.opacity = '0.72';
                    panel.style.transform = 'translateY(4px) scale(0.995)';
                });

                setTimeout(() => {
                    document.getElementById('execScore').textContent = config.score;
                    document.getElementById('execCopy').textContent = localized.copy;
                    document.getElementById('riskValue').textContent = localized.risk;
                    document.getElementById('profitValue').textContent = localized.profit;
                    document.getElementById('partnershipValue').textContent = localized.partnership;
                    document.getElementById('restValue').textContent = localized.rest;
                    document.getElementById('recommendationText').textContent = localized.recommendation;
                    document.getElementById('riskMetric').textContent = localized.riskMetric;
                    document.getElementById('marginMetric').textContent = localized.marginMetric;
                    document.getElementById('alignmentMetric').textContent = localized.alignmentMetric;
                    document.getElementById('trendValue').textContent = config.trend;
                    document.getElementById('trendAreaPath').setAttribute('d', config.areaPath);
                    document.getElementById('trendLinePath').setAttribute('d', config.linePath);
                    document.getElementById('liquidityValue').textContent = config.liquidity.value;
                    document.getElementById('liquidityBar').style.width = config.liquidity.width;
                    document.getElementById('cashflowValue').textContent = config.cashflow.value;
                    document.getElementById('cashflowBar').style.width = config.cashflow.width;
                    document.getElementById('partnershipFocusValue').textContent = config.partnershipFocus.value;
                    document.getElementById('partnershipFocusBar').style.width = config.partnershipFocus.width;
                    document.getElementById('indicatorValue').textContent = config.indicators;
                    document.getElementById('healthValue').textContent = localized.health;
                    document.getElementById('velocityValue').textContent = localized.velocity;
                    document.getElementById('strategyValue').textContent = config.strategy;

                    const activeTrendCard = document.querySelector('.trend-card');
                    if (activeTrendCard) {
                        activeTrendCard.style.boxShadow = '0 0 0 1px rgba(45, 212, 191, 0.18), 0 18px 32px rgba(45, 212, 191, 0.12), var(--shadow)';
                    }

                    panels.forEach((panel) => {
                        if (!panel) return;
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0) scale(1)';
                    });
                }, 110);
            }

            function applyLanguage(language, persist = true) {
                currentLanguage = localeCatalogs[language] ? language : 'pt';
                const locale = localeCatalogs[currentLanguage];
                const ui = locale.ui;
                document.documentElement.lang = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage;
                document.title = ui.appTitle;
                document.querySelector('meta[name="description"]').content = ui.appDescription;
                document.querySelector('meta[name="apple-mobile-web-app-title"]').content = ui.brand;
                languageSelector.value = currentLanguage;

                document.querySelectorAll('[data-i18n]').forEach((element) => {
                    const translation = ui[element.dataset.i18n];
                    if (translation) element.textContent = translation;
                });
                document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
                    const translation = ui[element.dataset.i18nPlaceholder];
                    if (translation) element.placeholder = translation;
                });
                document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
                    const translation = ui[element.dataset.i18nAriaLabel];
                    if (translation) element.setAttribute('aria-label', translation);
                });

                presentationToggle.textContent = document.body.classList.contains('presentation-mode')
                    ? ui.presentationEnd
                    : ui.presentationStart;

                applyAccessTier(currentTier, false);

                if (persist) {
                    try { localStorage.setItem('governancaProLanguage', currentLanguage); } catch {}
                }

                const activePeriod = document.querySelector('.filter-pill.active')?.dataset.period || '30d';
                applyPeriod(activePeriod);

                document.querySelectorAll('.resultado[data-endpoint]').forEach((result) => {
                    if (result.style.display !== 'block') return;
                    chamarAPI(result.dataset.endpoint, JSON.parse(result.dataset.payload), result.id);
                });
            }

            function applyAccessTier(tier, persist = true) {
                currentTier = tier === 'pro' ? 'pro' : 'basic';
                const ui = localeCatalogs[currentLanguage].ui;
                document.body.dataset.accessTier = currentTier;

                document.querySelectorAll('[data-access-tier]').forEach((element) => {
                    element.hidden = element.dataset.accessTier !== currentTier;
                });
                tierButtons.forEach((button) => {
                    const isActive = button.dataset.tier === currentTier;
                    button.classList.toggle('active', isActive);
                    button.setAttribute('aria-pressed', String(isActive));
                });

                document.querySelector('.pitch-copy .subtitle').textContent = currentTier === 'pro'
                    ? ui.proPitchSubtitle
                    : ui.basicPitchSubtitle;
                document.getElementById('diagnosticsCount').textContent = currentTier === 'pro' ? '6' : '3';
                document.getElementById('modulesStatus').textContent = currentTier === 'pro'
                    ? ui.proModules
                    : ui.basicModules;

                if (persist) {
                    try { localStorage.setItem('governancaProAccessTier', currentTier); } catch {}
                }
            }

            languageSelector.addEventListener('change', () => applyLanguage(languageSelector.value));
            tierButtons.forEach((button) => {
                button.addEventListener('click', () => applyAccessTier(button.dataset.tier));
            });
            document.getElementById('activateProButton').addEventListener('click', () => applyAccessTier('pro'));

            async function chamarAPI(endpoint, payload, divId) {
                const div = document.getElementById(divId);
                const requestPayload = { ...payload, language: currentLanguage };
                div.dataset.endpoint = endpoint;
                div.dataset.payload = JSON.stringify(payload);
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(requestPayload)
                    });
                    const data = await res.json();
                    const resposta = data.resposta || JSON.stringify(data, null, 2);
                    div.style.display = 'block';
                    div.innerText = resposta;
                } catch (error) {
                    div.style.display = 'block';
                    div.innerText = localeCatalogs[currentLanguage].ui.apiError;
                }
            }

            document.querySelectorAll('.filter-pill').forEach((button) => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.filter-pill').forEach((item) => {
                        item.classList.remove('active');
                        item.style.transform = 'scale(0.98)';
                    });
                    button.classList.add('active');
                    button.style.transform = 'scale(1.04)';
                    button.style.boxShadow = '0 0 0 1px rgba(45, 212, 191, 0.18), 0 12px 28px rgba(45, 212, 191, 0.18), 0 0 20px rgba(45, 212, 191, 0.12)';
                    applyPeriod(button.dataset.period);
                });
            });

            const presentationToggle = document.getElementById('presentationToggle');
            function setPresentationMode(isActive) {
                document.body.classList.toggle('presentation-mode', isActive);
                presentationToggle.setAttribute('aria-pressed', String(isActive));
                presentationToggle.textContent = isActive
                    ? localeCatalogs[currentLanguage].ui.presentationEnd
                    : localeCatalogs[currentLanguage].ui.presentationStart;

                if (!isActive && document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                }
            }

            presentationToggle.addEventListener('click', async () => {
                const isActive = !document.body.classList.contains('presentation-mode');
                setPresentationMode(isActive);

                if (isActive && !document.fullscreenElement && document.documentElement.requestFullscreen) {
                    try {
                        await document.documentElement.requestFullscreen();
                    } catch {
                        // Presentation mode remains usable when fullscreen is unavailable.
                    }
                }
            });

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement && document.body.classList.contains('presentation-mode')) {
                    setPresentationMode(false);
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && document.body.classList.contains('presentation-mode')) {
                    setPresentationMode(false);
                }
            });

            const installAppButton = document.getElementById('installAppButton');
            const installGuide = document.getElementById('installGuide');
            const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
            let deferredInstallPrompt = null;

            if (!isStandalone && isIOS) {
                installAppButton.hidden = false;
                installAppButton.addEventListener('click', () => installGuide.showModal());
            } else if (!isStandalone) {
                window.addEventListener('beforeinstallprompt', (event) => {
                    event.preventDefault();
                    deferredInstallPrompt = event;
                    installAppButton.hidden = false;
                });

                installAppButton.addEventListener('click', async () => {
                    if (!deferredInstallPrompt) return;
                    await deferredInstallPrompt.prompt();
                    const choice = await deferredInstallPrompt.userChoice;
                    deferredInstallPrompt = null;
                    if (choice.outcome === 'accepted') installAppButton.hidden = true;
                });
            }

            document.getElementById('closeInstallGuide').addEventListener('click', () => installGuide.close());
            window.addEventListener('appinstalled', () => {
                installAppButton.hidden = true;
                deferredInstallPrompt = null;
            });

            applyLanguage(currentLanguage, false);
            if (['basic', 'pro'].includes(requestedTier)) {
                try { localStorage.setItem('governancaProAccessTier', currentTier); } catch {}
            }

            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
            }
        </script>
    </body>
    </html>
`;

function sendJson(res, payload, includeBody = true) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (includeBody) {
        res.end(JSON.stringify(payload));
        return;
    }
    res.end();
}

function sendHtml(res, payload, includeBody = true) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (includeBody) {
        res.end(payload);
        return;
    }
    res.end();
}

function generateAiVideoPayload(data = {}) {
  const prompt = String(data.prompt || 'Governança Pro: clareza para decidir e disciplina para crescer.').trim();
  const duration = Number(data.duration) || 20;

  if (process.env.OPENAI_API_KEY) {
    fetch('https://api.openai.com/v1/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sora-2',
        prompt,
        size: '768x1024',
        duration,
        n: 1
      })
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      const videoUrl = result?.data?.[0]?.url || result?.output?.[0]?.url || result?.video_url;
      if (videoUrl) {
        console.log('Vídeo gerado via OpenAI:', videoUrl);
      }
    }).catch(() => {});
  }

  if (process.env.REPLICATE_API_TOKEN) {
    fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`
      },
      body: JSON.stringify({
        input: {
          prompt,
          width: 768,
          height: 1024,
          num_frames: Math.max(24, duration * 4)
        }
      })
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      const videoUrl = result?.output?.[0] || result?.urls?.get || result?.video_url;
      if (videoUrl) {
        console.log('Vídeo gerado via Replicate:', videoUrl);
      }
    }).catch(() => {});
  }

  return {
    status: 'ok',
    provider: process.env.OPENAI_API_KEY ? 'openai' : (process.env.REPLICATE_API_TOKEN ? 'replicate' : 'demo'),
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterUrl: '/landing-hero.jpg',
    message: process.env.OPENAI_API_KEY || process.env.REPLICATE_API_TOKEN
      ? 'Tentativa de geração com IA iniciada. Se a provider responder com URL, a preview será atualizada automaticamente.'
      : 'Vídeo de demonstração ativado. Configure OPENAI_API_KEY ou REPLICATE_API_TOKEN para gerar vídeos reais com IA.',
    prompt,
    duration
  };
}

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const safeUrl = typeof req?.url === 'string' ? req.url : '/';
  const isReadMethod = req.method === 'GET' || req.method === 'HEAD';

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(safeUrl, `http://${req.headers?.host || 'localhost'}`);
  const pathname = url.pathname;

    if (isReadMethod && pathname === '/') {
        sendHtml(res, landingHtml, req.method !== 'HEAD');
        return;
    }

    if (isReadMethod && pathname === '/app') {
        sendHtml(res, homeHtml, req.method !== 'HEAD');
    return;
  }

    if (isReadMethod && staticAssets[pathname]) {
        const asset = staticAssets[pathname];
        res.writeHead(200, {
            'Content-Type': asset.contentType,
            'Cache-Control': asset.cacheControl,
            ...(pathname === '/sw.js' ? { 'Service-Worker-Allowed': '/' } : {})
        });
        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        res.end(asset.body);
        return;
    }

  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let data = {};
      try {
        data = JSON.parse(body || '{}');
      } catch {
        data = {};
      }

      if (pathname === '/api/v1/debt-check') {
        return sendJson(res, { resposta: evaluateDebt(data) });
      }

      if (pathname === '/api/v1/fair-price') {
        return sendJson(res, { resposta: evaluateFairPrice(data) });
      }

      if (pathname === '/api/v1/reconciliation') {
        return sendJson(res, { resposta: evaluateReconciliation(data) });
      }

      if (pathname === '/api/v1/partnership-yoke') {
        return sendJson(res, { resposta: evaluatePartnership(data) });
      }

      if (pathname === '/api/v1/tithe-multiply') {
        return sendJson(res, { resposta: evaluateTithe(data) });
      }

      if (pathname === '/api/v1/sabbath-audit') {
        return sendJson(res, { resposta: evaluateSabbath(data) });
      }

      if (pathname === '/api/v1/generate-ai-video') {
        return sendJson(res, generateAiVideoPayload(data));
      }

      sendJson(res, { erro: 'Rota não encontrada' });
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
}

module.exports = { handleRequest };

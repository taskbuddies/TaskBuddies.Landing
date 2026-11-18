// Landing sayfasını iki dilde üretir: node build.mjs  →  index.html, en/index.html
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Cloudflare önbelleği eski CSS'i vermesin diye adres içeriğe göre değişir
const CSS_V = createHash('sha256').update(readFileSync('style.css')).digest('hex').slice(0, 10);

const IOS = 'https://apps.apple.com/app/id6759522037';
const PLAY = 'https://play.google.com/store/apps/details?id=com.taskbuddies.mobile';

const i = (d) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ic = {
  check: i('<path d="M5 12l5 5L20 7"/>'),
  users: i('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>'),
  wallet: i('<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="15" r="1.2"/>'),
  bell: i('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>'),
  cal: i('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>'),
  case: i('<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'),
  home: i('<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>'),
  pen: i('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  chat: i('<path d="M4 5h16v11H9l-5 4z"/>'),
  target: i('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
  chart: i('<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>'),
  flag: i('<path d="M5 21V4h11l-2 4 2 4H5"/>'),
  phone: i('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>'),
  play: i('<path d="M6 3l14 9-14 9z"/>'),
  plus: i('<path d="M12 5v14M5 12h14"/>'),
};

const T = {
  tr: {
    lang: 'tr', path: '/', other: '/en/', otherLabel: 'EN', locale: 'tr_TR', cur: 'TRY', iosHl: '?l=tr', playHl: '&hl=tr',
    title: 'TaskBuddies: Evi paylaşanlar için ev işleri, ortak masraflar ve borçlar',
    desc: 'Ev arkadaşınla ya da partnerinle ev işlerini paylaş, kirayı ve faturaları böl, borçları iki taraf da onaylasın. Evi paylaşanlar için ücretsiz uygulama.',
    nav: ['Özellikler', 'Borç takibi', 'SSS'], download: 'İndir',
    h1a: 'Evi paylaşanlar için', h1b: 'işler, masraflar ve borçlar.',
    lead: 'Ev arkadaşınla ya da partnerinle temizliği paylaş, faturaları böl, borcu ikiniz de onaylayın.',
    ios: ['iPhone için', 'App Store'], play: ['Android için', 'Google Play'],
    float: {
      note: 'Market: süt, ekmek, deterjan. Can alacak.',
      remTitle: 'Hatırlatıcı', rem: 'Elektrik faturası', remWhen: 'Cuma 18:00',
      tasksTitle: 'Bugünkü görevler', t1: 'Bulaşık', t1who: 'Ece', t2: 'Çamaşır', t2who: 'Can',
      debtTitle: 'Borç onayı', debt: 'Akşam yemeği', debtAmt: '₺600', debtState: 'Zeynep onayladı',
    },
    s2a: 'Evi paylaşmanın üç derdi,', s2b: 'tek uygulamada.',
    cols: [
      ['home', 'Ev işleri', 'Sıra kimde, kim yaptı: herkes aynı listeyi görür.'],
      ['wallet', 'Ortak masraflar', 'Kira, fatura, market: kim ne ödedi, kim kaç borçlu.'],
      ['pen', 'Borçlar', 'Kaydı iki taraf da onaylar, tartışma biter.'],
    ],
    shots: [['01-home', 'Ana sayfa: görevler ve bu ayki harcamalar'], ['02-tasks', 'Görev panosu: kim neyi ne zaman yapacak'], ['04-exp_family', 'Aile harcamaları kategorilere göre']],
    s3a: 'Hepsi tek yerde,', s3b: 'ayrı uygulamalara gerek yok.',
    bento: {
      tasks: ['Görevleri paylaştır', 'Ata, hatırlat, tamamlanınca onayla.'],
      rows: [['Bulaşık', 'Ece', 'Bugün'], ['İnternet faturası', 'Can', 'Cuma'], ['Banyo temizliği', 'Deniz', 'Pazar']],
      spend: ['Masrafları birlikte tut', 'Ay sonunda kim ne ödedi, hazır.'],
      bars: ['Market', 'Fatura', 'Kira', 'Diğer'],
      save: ['Ortak hedef', 'Yeni koltuk için her ay biraz.'], saveLabel: 'Koltuk',
      chat: ['Sohbet ve anket', 'Ayrı bir mesaj grubuna gerek yok.'],
      poll: 'Cumartesi ne yapalım?', opts: ['Ev temizliği', 'Sinema'],
    },
    s4a: 'Borçlar artık sözlü değil,', s4b: 'iki taraf da onaylar.',
    steps: ['Borcu kaydet: kim, ne kadar, ne için.', 'Karşı taraf uygulamada onaylar ya da itiraz eder.', 'Ödeme gününde hatırlatma gider, ödenince kapanır.'],
    debtShot: 'Karşılıklı borç ekranı: bekleyen, imzalanmış ve kapatılan kayıtlar',
    badge: 'Zeynep onayladı',
    faqT: 'Sık sorulan sorular',
    faq: [
      ['TaskBuddies ücretli mi?', 'İndirmesi ve temel özellikleri ücretsiz. Görevler, harcama girişi, borç takibi ve sohbet herkese açık.'],
      ['Ailemi ya da ekibimi nasıl eklerim?', 'Bir aile ya da ekip oluştur, üyeleri e-posta ile davet et. Davet bağlantısına dokunan kişi doğrudan uygulamaya katılır.'],
      ['Ailem ya da ekibim için de kullanabilir miyim?', 'Evet. Ev modu aileler için de çalışır; İş modunda görev atama, harcama onayı ve raporlar var.'],
      ['Borç kaydını karşı taraf görmek zorunda mı?', 'Evet, borç kaydı iki taraflıdır. Karşı taraf onaylar ya da itiraz eder; iki taraf da aynı rakamı görür.'],
      ['Verilerim güvende mi?', 'Verilerin şifreli bağlantıyla taşınır ve yalnızca senin ve davet ettiğin kişilerin erişimine açıktır. Hesabını istediğin zaman silebilirsin.'],
    ],
    footA: 'Evi paylaş,', footB: 'kavgayı değil.',
    links: [['Özellikler', '#ozellikler'], ['Borç takibi', '#borc'], ['SSS', '#sss'], ['Gizlilik Politikası', 'https://taskbuddies.github.io/taskbuddies-support/privacy.html'], ['Destek', 'https://taskbuddies.github.io/taskbuddies-support/'], ['Hesap silme', 'https://api.taskbuddies.net/account-deletion/']],
    ids: ['ozellikler', 'borc', 'sss', 'indir'],
  },
  en: {
    lang: 'en', path: '/en/', other: '/', otherLabel: 'TR', locale: 'en_US', cur: 'USD', iosHl: '', playHl: '&hl=en',
    title: 'TaskBuddies: Chores, shared costs and IOUs for people who share a home',
    desc: 'Share chores with your roommate or partner, split rent and bills, and let both sides confirm every debt. A free app for people who share a home.',
    nav: ['Features', 'Debt tracking', 'FAQ'], download: 'Download',
    h1a: 'For people who share a home', h1b: 'chores, costs and IOUs.',
    lead: 'Share chores with your roommate or partner, split the bills, and both confirm every debt.',
    ios: ['For iPhone', 'App Store'], play: ['For Android', 'Google Play'],
    float: {
      note: 'Groceries: milk, bread, soap. Sam is on it.',
      remTitle: 'Reminder', rem: 'Electricity bill', remWhen: 'Friday 6 pm',
      tasksTitle: "Today's tasks", t1: 'Dishes', t1who: 'Emma', t2: 'Laundry', t2who: 'Sam',
      debtTitle: 'Debt confirmation', debt: 'Dinner', debtAmt: '$45', debtState: 'Zoe confirmed',
    },
    s2a: 'Three things every shared home', s2b: 'argues about, in one app.',
    cols: [
      ['home', 'Chores', 'Whose turn, who did it: everyone sees the same list.'],
      ['wallet', 'Shared costs', 'Rent, bills, groceries: who paid, who owes.'],
      ['pen', 'IOUs', 'Both sides confirm the record, and the argument ends.'],
    ],
    shots: [['01-home', 'Home: tasks and this month’s spending'], ['02-tasks', 'Task board: who does what, and when'], ['04-exp_family', 'Family spending by category']],
    s3a: 'Everything in one place,', s3b: 'no more juggling apps.',
    bento: {
      tasks: ['Share the tasks', 'Assign, remind, approve when done.'],
      rows: [['Dishes', 'Emma', 'Today'], ['Internet bill', 'Sam', 'Friday'], ['Clean the bathroom', 'Alex', 'Sunday']],
      spend: ['Keep costs together', 'Who paid what, ready at month end.'],
      bars: ['Groceries', 'Bills', 'Rent', 'Other'],
      save: ['Shared goal', 'A little every month for a new sofa.'], saveLabel: 'Sofa',
      chat: ['Chat and polls', 'No separate group chat needed.'],
      poll: 'What on Saturday?', opts: ['Deep clean', 'Cinema'],
    },
    s4a: 'Debts are no longer verbal,', s4b: 'both sides confirm.',
    steps: ['Record the debt: who, how much, what for.', 'The other person confirms or disputes it in the app.', 'A reminder goes out on the due date; it closes once paid.'],
    debtShot: 'Mutual debt screen: pending, signed and closed records',
    badge: 'Zoe confirmed',
    faqT: 'Frequently asked questions',
    faq: [
      ['Is TaskBuddies free?', 'It is free to download and the core features are free. Tasks, expense logging, debt tracking and chat are open to everyone.'],
      ['How do I add my family or team?', 'Create a family or team and invite members by email. Anyone who taps the invite link joins straight in the app.'],
      ['Can I use it with my family or team too?', 'Yes. Home mode works for families too; Business mode adds task assignment, expense approval and reports.'],
      ['Does the other person have to see the debt record?', 'Yes, debt records are two-sided. The other person confirms or disputes it, so both sides see the same number.'],
      ['Is my data safe?', 'Your data travels over an encrypted connection and is only visible to you and the people you invite. You can delete your account anytime.'],
    ],
    footA: 'Share the home,', footB: 'not the argument.',
    links: [['Features', '#features'], ['Debt tracking', '#debts'], ['FAQ', '#faq'], ['Privacy Policy', 'https://taskbuddies.github.io/taskbuddies-support/privacy.html'], ['Support', 'https://taskbuddies.github.io/taskbuddies-support/'], ['Delete account', 'https://api.taskbuddies.net/account-deletion/']],
    ids: ['features', 'debts', 'faq', 'download'],
  },
};

const stores = (t, cls = '') => `<div class="stores ${cls}">
          <a class="btn btn-primary" href="${IOS}${t.iosHl}" rel="noopener">${ic.phone}<span><small>${t.ios[0]}</small>${t.ios[1]}</span></a>
          <a class="btn btn-ghost" href="${PLAY}${t.playHl}" rel="noopener">${ic.play}<span><small>${t.play[0]}</small>${t.play[1]}</span></a>
        </div>`;

const page = (t) => {
  const [idF, idD, idQ, idDl] = t.ids;
  const f = t.float, b = t.bento;
  const shot = (n, alt, cls = '') => `<img class="phone ${cls}" src="/assets/screens/${t.lang}-${n}.jpg" alt="${alt}" width="480" height="968" loading="lazy">`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.title}</title>
  <meta name="description" content="${t.desc}">
  <link rel="canonical" href="https://taskbuddies.net${t.path}">
  <link rel="alternate" hreflang="tr" href="https://taskbuddies.net/">
  <link rel="alternate" hreflang="en" href="https://taskbuddies.net/en/">
  <link rel="alternate" hreflang="x-default" href="https://taskbuddies.net/en/">
  <link rel="icon" type="image/png" href="/assets/icon-192.png">
  <link rel="apple-touch-icon" href="/assets/icon-192.png">
  <meta name="theme-color" content="#f7f8fb">
  <meta name="apple-itunes-app" content="app-id=6759522037">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://taskbuddies.net${t.path}">
  <meta property="og:title" content="${t.title}">
  <meta property="og:description" content="${t.desc}">
  <meta property="og:image" content="https://taskbuddies.net/assets/screens/${t.lang}-01-home.jpg">
  <meta property="og:locale" content="${t.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css?v=${CSS_V}">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"MobileApplication","name":"TaskBuddies","operatingSystem":"iOS, Android","applicationCategory":"ProductivityApplication","offers":{"@type":"Offer","price":"0","priceCurrency":"${t.cur}"},"url":"https://taskbuddies.net${t.path}"}</script>
</head>
<body>
  <header class="top">
    <div class="wrap top-row">
      <a class="brand" href="${t.path}"><img src="/assets/icon-192.png" alt="" width="32" height="32">TaskBuddies</a>
      <nav class="links" aria-label="${t.lang === 'tr' ? 'Bölümler' : 'Sections'}">
        <a href="#${idF}">${t.nav[0]}</a><a href="#${idD}">${t.nav[1]}</a><a href="#${idQ}">${t.nav[2]}</a>
      </nav>
      <div class="top-actions">
        <a class="lang" href="${t.other}" hreflang="${t.other === '/' ? 'tr' : 'en'}">${t.otherLabel}</a>
        <a class="btn btn-ghost btn-sm" href="#${idDl}">${t.download}</a>
      </div>
    </div>
  </header>

  <main>
    <div class="wrap">
      <section class="hero dots" aria-labelledby="h">
        <div class="hero-copy">
          <img class="app-tile" src="/assets/icon-192.png" alt="" width="72" height="72">
          <h1 id="h"><span>${t.h1a}</span> <span class="soft">${t.h1b}</span></h1>
          <p class="lead">${t.lead}</p>
          ${stores(t, 'center')}
        </div>

        <div class="float f-note" aria-hidden="true"><span class="pin"></span><p>${f.note}</p></div>
        <div class="float f-rem card-ui" aria-hidden="true">
          <p class="ui-title">${ic.bell}${f.remTitle}</p>
          <p class="ui-strong">${f.rem}</p>
          <p class="chip">${ic.cal}${f.remWhen}</p>
        </div>
        <div class="float f-tasks card-ui" aria-hidden="true">
          <p class="ui-title">${f.tasksTitle}</p>
          <div class="ui-row"><span class="tick done">${ic.check}</span><span>${f.t1}</span><span class="who">${f.t1who}</span></div>
          <div class="bar"><i style="--w:100%"></i></div>
          <div class="ui-row"><span class="tick"></span><span>${f.t2}</span><span class="who">${f.t2who}</span></div>
          <div class="bar"><i style="--w:45%"></i></div>
        </div>
        <div class="float f-debt card-ui" aria-hidden="true">
          <p class="ui-title">${ic.pen}${f.debtTitle}</p>
          <div class="ui-row"><span class="ui-strong">${f.debt}</span><span class="amt">${f.debtAmt}</span></div>
          <p class="chip ok">${ic.check}${f.debtState}</p>
        </div>
      </section>
    </div>

    <section id="${idF}" class="block">
      <div class="wrap">
        <h2 class="h2"><span>${t.s2a}</span> <span class="soft">${t.s2b}</span></h2>
        <div class="cols">
          ${t.cols.map(([k, h, p]) => `<div class="col"><span class="tile">${ic[k]}</span><h3>${h}</h3><p>${p}</p></div>`).join('\n          ')}
        </div>
        <div class="showcase">
          ${shot(t.shots[1][0], t.shots[1][1], 'side')}
          ${shot(t.shots[0][0], t.shots[0][1], 'mid')}
          ${shot(t.shots[2][0], t.shots[2][1], 'side')}
        </div>
      </div>
    </section>

    <section class="block tint">
      <div class="wrap">
        <h2 class="h2"><span>${t.s3a}</span> <span class="soft">${t.s3b}</span></h2>
        <div class="bento">
          <article class="b b-wide">
            <div class="b-text"><h3>${b.tasks[0]}</h3><p>${b.tasks[1]}</p></div>
            <div class="mini-list" aria-hidden="true">
              ${b.rows.map(([n, w, d], k) => `<div class="mini-row"><span class="tick${k === 0 ? ' done' : ''}">${k === 0 ? ic.check : ''}</span><span>${n}</span><span class="who">${w}</span><span class="when">${d}</span></div>`).join('\n              ')}
            </div>
          </article>
          <article class="b">
            <div class="b-text"><h3>${b.spend[0]}</h3><p>${b.spend[1]}</p></div>
            <div class="bars" aria-hidden="true">
              ${b.bars.map((n, k) => `<div class="bar-col" style="--h:${[78, 52, 92, 30][k]}%"><i></i><span>${n}</span></div>`).join('')}
            </div>
          </article>
          <article class="b">
            <div class="b-text"><h3>${b.save[0]}</h3><p>${b.save[1]}</p></div>
            <div class="ring" aria-hidden="true"><span>${b.saveLabel}</span></div>
          </article>
          <article class="b b-wide">
            <div class="b-text"><h3>${b.chat[0]}</h3><p>${b.chat[1]}</p></div>
            <div class="poll" aria-hidden="true">
              <p class="ui-strong">${b.poll}</p>
              <div class="opt" style="--w:68%"><span>${b.opts[0]}</span></div>
              <div class="opt" style="--w:32%"><span>${b.opts[1]}</span></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="${idD}" class="block">
      <div class="wrap split">
        <div>
          <h2 class="h2 left"><span>${t.s4a}</span> <span class="soft">${t.s4b}</span></h2>
          <ol class="steps">
            ${t.steps.map((s) => `<li>${s}</li>`).join('\n            ')}
          </ol>
        </div>
        <div class="debt-visual">
          ${shot('05-debts', t.debtShot, 'solo')}
          <p class="float-badge">${ic.check}${t.badge}</p>
        </div>
      </div>
    </section>

    <section id="${idQ}" class="block tint">
      <div class="wrap faq-wrap">
        <h2 class="h2 left">${t.faqT}</h2>
        <div class="faq">
          ${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n          ')}
        </div>
      </div>
    </section>
  </main>

  <footer id="${idDl}" class="wrap">
    <div class="foot dots">
      <div class="foot-top">
        <div>
          <a class="brand dark" href="${t.path}"><img src="/assets/icon-192.png" alt="" width="32" height="32">TaskBuddies</a>
          <p class="foot-h"><span>${t.footA}</span> <span class="soft">${t.footB}</span></p>
          ${stores(t)}
        </div>
        <nav class="foot-links" aria-label="${t.lang === 'tr' ? 'Alt bağlantılar' : 'Footer links'}">
          ${t.links.map(([n, h]) => `<a href="${h}">${n}</a>`).join('\n          ')}
        </nav>
      </div>
      <div class="tiles" aria-hidden="true">
        ${['check', 'cal', 'wallet', 'bell', 'flag', 'chat', 'target', 'chart', 'users', 'plus'].map((k, n) => `<span class="tile t${n}">${ic[k]}</span>`).join('')}
      </div>
      <div class="foot-bottom"><span>© 2026 TaskBuddies</span><a href="mailto:support@taskbuddies.net">support@taskbuddies.net</a></div>
    </div>
  </footer>
</body>
</html>
`;
};

writeFileSync('index.html', page(T.tr));
writeFileSync('open.html', readFileSync('open.html', 'utf8').replace(/\/style\.css(\?v=[0-9a-f]+)?/,`/style.css?v=${CSS_V}`));
mkdirSync('en', { recursive: true });
writeFileSync('en/index.html', page(T.en));
console.log('built index.html, en/index.html');

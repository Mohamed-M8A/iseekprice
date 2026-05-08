(function smartLoader() {
    const path = window.location.pathname;
    const head = document.head;
    const origin = window.location.origin;

    if (path === '/' || path === '/index.html' || path === '') return;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    const content = document.body.innerHTML;
    document.body.innerHTML = "";

    const injectScript = (src, isAsync = false) => {
        const s = document.createElement('script');
        s.src = src;
        if (isAsync) s.async = true;
        else s.defer = true;
        head.appendChild(s);
    };

    const injectLink = (rel, href, type = '') => {
        const l = document.createElement('link');
        l.rel = rel;
        l.href = href;
        if (type) l.type = type;
        head.appendChild(l);
    };

    const injectMeta = (attr, val, content) => {
        const m = document.createElement('meta');
        m.setAttribute(attr, val);
        m.setAttribute('content', content);
        head.appendChild(m);
    };

    const headerHTML = `
    <header id='header' itemscope='itemscope' itemtype='https://schema.org/WPHeader'>
      <div class='header-main-row'>
        <div class='header-container'>
          <div class='logo' id='logo-wrap'></div>
          <div class='search-container' id='search-wrap'></div>
          <div class='header-actions' id='actions-wrap'></div>
        </div>
      </div>
      <nav id='widget-topbar'></nav>
    </header>`;

    const primaryHTML = `
    <div id='primary'>
      <main>
        ${content}
        <div id='souq-widget-root'></div>
        <hr class='clean-divider'/>
        <button id='shareOpenBtn' class='main-share-button'>مشاركة هذا العرض</button>
      </main>
    </div>`;

    const footerHTML = `
    <div id="footer"></div>
    <div id='widget-sidebar'></div>
    <div id='widget-overlay'></div>`;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', primaryHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    document.title = "ISeekPrice - تتبع اسعار المنتجات ومقارنة العروض";
    injectMeta('name', 'description', 'قارن الأسعار بين المتاجر المختلفة، اكتشف أفضل العروض والخصومات، وتسوق أونلاين بذكاء.');
    injectMeta('name', 'google-site-verification', 'zwgupH08YoN_WM-XihJynuANAqHUsnLDSSenbcTktc8');
    injectMeta('property', 'og:image', origin + '/public/assets/banners/Iseekprice1.png');
    injectMeta('property', 'og:type', 'website');
    injectMeta('property', 'og:locale', 'ar');

    injectLink('shortcut icon', origin + '/public/assets/static/favicon.ico', 'image/x-icon');
    injectLink('manifest', origin + '/manifest.json');
    injectLink('stylesheet', 'https://fonts.googleapis.com/css2?family=Cairo:wght@900&display=swap');
    injectLink('stylesheet', origin + '/public/css/main.css');

    injectScript('https://www.googletagmanager.com/gtag/js?id=G-FRWKEMXVYT', true);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-FRWKEMXVYT');

    if (path.includes('/product/')) {
        injectLink('stylesheet', origin + '/public/css/product.css');
        const productScripts = [
            'https://cdn.jsdelivr.net/npm/chart.js',
            '/public/js/fetch.js',
            '/public/js/make.js',
            '/public/js/worker.js',
            '/public/js/grid.js',
            '/public/js/corepress.js',
            '/public/js/search.js'
        ];
        productScripts.forEach(src => {
            const finalSrc = src.startsWith('http') ? src : origin + src;
            injectScript(finalSrc);
        });
    } else if (path.includes('/pages/')) {
        injectScript(origin + '/public/js/search.js');
        injectScript(origin + '/public/js/corepress.js');
    }
})();

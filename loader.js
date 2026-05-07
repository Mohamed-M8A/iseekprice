(function smartLoader() {
    const path = window.location.pathname;
    const head = document.head;
    const origin = window.location.origin;

    if (path === '/' || path === '/index.html' || path === '') return;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    const injectScript = (src, async = false) => {
        const script = document.createElement('script');
        script.src = src;
        if (async) script.async = true;
        else script.defer = true;
        head.appendChild(script);
    };

    const injectLink = (rel, href, type = '') => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (type) link.type = type;
        head.appendChild(link);
    };

    const injectMeta = (attr, val, content) => {
        const meta = document.createElement('meta');
        meta.setAttribute(attr, val);
        meta.setAttribute('content', content);
        head.appendChild(meta);
    };

    if (path.includes('/product/') || path.includes('/pages/')) {
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
        </header>
        <div id='widget-sidebar'></div>
        <div id='widget-overlay'></div>`;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        if (path.includes('/product/')) {
            const productSkeleton = `
            <article id='single-content'>
                <div id='post-body'>
                    <hr class='clean-divider'/>
                    <div id='souq-widget-root'></div>
                    <hr class='clean-divider'/>
                    <button id='shareOpenBtn' class='main-share-button'>
                        <svg class="icon"><use href='/public/assets/static/icons.svg#i-share'/></svg>
                        مشاركة هذا العرض
                    </button>
                </div>
            </article>`;
            
            const existingMain = document.querySelector('main');
            if (existingMain) {
                existingMain.insertAdjacentHTML('afterend', productSkeleton);
            } else {
                document.body.insertAdjacentHTML('beforeend', productSkeleton);
            }
        }

        document.title = "ISeekPrice - تتبع اسعار المنتجات ومقارنة العروض";
        injectMeta('name', 'description', 'قارن الأسعار بين المتاجر المختلفة، اكتشف أفضل العروض والخصومات، وتسوق أونلاين بذكاء.');
        injectMeta('name', 'google-site-verification', 'zwgupH08YoN_WM-XihJynuANAqHUsnLDSSenbcTktc8');
        injectMeta('property', 'og:image', origin + '/public/assets/banners/Iseekprice1.png');

        injectLink('shortcut icon', origin + '/public/assets/static/favicon.ico', 'image/x-icon');
        injectLink('manifest', origin + '/manifest.json');
        injectLink('stylesheet', origin + '/public/css/main.css');

        injectScript('https://www.googletagmanager.com/gtag/js?id=G-FRWKEMXVYT', true);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-FRWKEMXVYT');
    }

    if (path.includes('/product/')) {
        injectLink('stylesheet', origin + '/public/css/product.css');
        const scripts = [
            '/public/js/fetch.js',
            '/public/js/make.js',
            '/public/js/worker.js',
            '/public/js/grid.js',
            '/public/js/corepress.js',
            '/public/js/search.js',
            '/public/js/chart.js'
        ];
        scripts.forEach(src => injectScript(origin + src));
    } else if (path.includes('/pages/')) {
        injectScript(origin + '/public/js/corepress.js');
    }
})();

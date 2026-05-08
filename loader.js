(function smartLoader() {
    const path = window.location.pathname;
    const head = document.head;
    const origin = window.location.origin;

    if (path === '/' || path === '/index.html' || path === '') return;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    const injectLink = (rel, href) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        head.appendChild(link);
    };

    const injectScript = (src) => {
        const script = document.createElement('script');
        script.src = origin + src;
        script.defer = true;
        head.appendChild(script);
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
        </header>`;
        
        const footerHTML = `
        <footer id="footer-wrap">
            <div id="footer"></div>
        </footer>
        <div id='widget-sidebar'></div>
        <div id='widget-overlay'></div>`;

        const primary = document.createElement('div');
        primary.id = 'primary';
        const main = document.createElement('main');
        
        const existingNodes = Array.from(document.body.childNodes);
        existingNodes.forEach(node => main.appendChild(node));
        
        const souqRoot = document.createElement('div');
        souqRoot.id = 'souq-widget-root';
        main.appendChild(souqRoot);
        
        primary.appendChild(main);
        
        document.body.innerHTML = '';
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        document.body.appendChild(primary);
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        if (path.includes('/product/')) {
            const shareBtn = `
            <button id='shareOpenBtn' class='main-share-button'>
                مشاركة هذا العرض
            </button>`;
            main.insertAdjacentHTML('beforeend', shareBtn);
        }

        injectMeta('name', 'google-site-verification', 'zwgupH08YoN_WM-XihJynuANAqHUsnLDSSenbcTktc8');
        injectMeta('property', 'og:image', origin + '/public/assets/banners/Iseekprice1.png');
        injectLink('shortcut icon', origin + '/public/assets/static/favicon.ico');
        injectLink('stylesheet', origin + '/public/css/main.css');

        injectScript('/public/js/gtag.js'); 
    }

    if (path.includes('/product/')) {
        injectLink('stylesheet', origin + '/public/css/product.css');
        const scripts = [
            '/public/js/chart.js',
            '/public/js/fetch.js',
            '/public/js/make.js',
            '/public/js/worker.js',
            '/public/js/grid.js',
            '/public/js/corepress.js',
            '/public/js/search.js'
        ];
        scripts.forEach(src => injectScript(src));
    } else if (path.includes('/pages/')) {
        injectScript('/public/js/search.js');
        injectScript('/public/js/corepress.js');
    }
})();

(function smartLoader() {
    const path = window.location.pathname;
    const head = document.head;
    const origin = window.location.origin;

    if (path === '/' || path === '/index.html' || path === '') return;

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
        document.title = "ISeekPrice - تتبع اسعار المنتجات ومقارنة العروض";
        
        injectMeta('name', 'description', 'قارن الأسعار بين المتاجر المختلفة، اكتشف أفضل العروض والخصومات، وتسوق أونلاين بذكاء. دليلك الشامل للأجهزة الذكية ومراجعات الأسعار فوريّة.');
        injectMeta('name', 'verify-admitad', '7d7f763921');
        injectMeta('name', 'p:domain_verify', '4444cdf2f0a49fb484bf404640ddbd44');
        injectMeta('name', 'google-site-verification', 'zwgupH08YoN_WM-XihJynuANAqHUsnLDSSenbcTktc8');
        
        injectMeta('property', 'og:title', 'ISeekPrice - تتبع اسعار المنتجات');
        injectMeta('property', 'og:description', 'قارن الأسعار واكتشف أفضل العروض والخصومات وتسوق أونلاين بذكاء.');
        injectMeta('property', 'og:image', origin + '/public/assets/banners/Iseekprice1.png');
        injectMeta('property', 'og:url', window.location.href);
        injectMeta('property', 'og:type', 'website');
        injectMeta('name', 'twitter:card', 'summary_large_image');
        injectMeta('name', 'twitter:site', '@ISeekPrice');

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

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

        const footerHTML = `
        <footer id='footer' itemscope='itemscope' itemtype='https://schema.org/WPFooter'>
          <div class='footer-container'>
            <div class='footer-row'>
              <div class='footer-links'>
                <h3 class='footer-title'>عن الموقع</h3>
                <ul>
                  <li><a href='/pages/info/about-us.html'>من نحن</a></li>
                  <li><a href='/pages/info/policy.html'>سياسة الموقع</a></li>
                  <li><a href='/sitemap.xml'>خريطة الموقع</a></li>
                  <li><a href='/pages/info/contact.html'>اتصل بنا</a></li>
                </ul>
              </div>
              <div class='footer-links'>
                <h3 class='footer-title'>اعرف أكثر</h3>
                <ul>
                  <li><a href='/pages/main/blog.html'>المدونة</a></li>
                  <li><a href='/pages/services/iseekchat.html'>دردشة</a></li>
                </ul>
              </div>
              <div class='footer-social-section'>
                <h3 class='footer-title'>تابعونا علي</h3>
                <div class='footer-social'>
                  <a aria-label='YouTube' href='https://www.youtube.com/@ISeekPrice' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-youtube'/></svg></a>
                  <a aria-label='Pinterest' href='https://www.pinterest.com/ISeekPrice' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-pinterest'/></svg></a>
                  <a aria-label='Facebook' href='https://www.facebook.com/profile.php?id=61579522981793' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-facebook'/></svg></a>
                  <a aria-label='Instagram' href='https://www.instagram.com/iseekprice/' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-instagram'/></svg></a>
                  <a aria-label='X' href='https://x.com/ISeekPrice' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-x'/></svg></a>
                  <a aria-label='Telegram' href='https://t.me/+bmBnY0FumOwxZDQ0' rel='noopener' target='_blank'><svg class='icon'><use href='/public/assets/static/icons.svg#i-telegram'/></svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class='footer-bottom'>
            <p>&#169; 2024-2026 جميع الحقوق محفوظة لموقع iseekprice.com</p>
          </div>
        </footer>`;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        document.body.insertAdjacentHTML('beforeend', footerHTML);

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
            if (existingMain) existingMain.insertAdjacentHTML('afterend', productSkeleton);
            else document.body.insertAdjacentHTML('beforeend', productSkeleton);
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
        injectScript(origin + '/public/js/search.js');
        injectScript(origin + '/public/js/corepress.js');
    }
})();

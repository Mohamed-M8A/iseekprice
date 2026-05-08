(function smartLoader() {
    const path = window.location.pathname;
    const origin = window.location.origin;

    if (path === '/' || path === '/index.html' || path === '') return;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    const originalBodyContent = document.body.innerHTML;
    document.body.innerHTML = "";

    const head = document.head;
    const inject = (type, attrs) => {
        const el = document.createElement(type);
        Object.assign(el, attrs);
        if (type === 'script') el.defer = true;
        head.appendChild(el);
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
      <article id='single-content'>
        <div id='post-body'>
          <hr class='clean-divider'/>
          <main>${originalBodyContent}</main>
        </div>
        <hr class='clean-divider'/>
        <div class='share-box-wrap'>
            <button id='shareOpenBtn' class='main-share-button'>مشاركة مع الاصدقاء</button>
        </div>
        <hr class='clean-divider'/>
        <p>عروض ستعجبك</p>
        <div id='souq-widget-root'></div>
      </article>
    </div>`;

    const footerHTML = `
    <div id="footer"></div>
    <div id='widget-sidebar'></div>
    <div id='widget-overlay'></div>`;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', primaryHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    inject('link', { rel: 'stylesheet', href: origin + '/public/css/main.css' });
    
    if (path.includes('/product/')) {
        inject('link', { rel: 'stylesheet', href: origin + '/public/css/product.css' });
        
        const scripts = [
            'https://cdn.jsdelivr.net/npm/chart.js',
            origin + '/public/js/fetch.js',
            origin + '/public/js/make.js',
            origin + '/public/js/worker.js',
            origin + '/public/js/grid.js',
            origin + '/public/js/corepress.js',
            origin + '/public/js/search.js'
        ];
        scripts.forEach(src => inject('script', { src }));
    } else {
        inject('script', { src: origin + '/public/js/corepress.js' });
        inject('script', { src: origin + '/public/js/search.js' });
    }
})();

(function smartLoader() {
    const path = window.location.pathname;
    const head = document.head;
    const origin = window.location.origin;

    // لا تعمل في الصفحة الرئيسية
    if (path === '/' || path === '/index.html' || path === '') return;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";

    // 1. إضافة الميتا والستايل الأساسي
    const injectLink = (rel, href) => {
        const link = document.createElement('link');
        link.rel = rel; link.href = href;
        head.appendChild(link);
    };
    injectLink('stylesheet', origin + '/public/css/main.css');
    injectLink('stylesheet', origin + '/public/css/product.css');

    // 2. إضافة الهيدر والفوتر (بدون مسح محتوى الصفحة)
    const headerHTML = `
        <header id='header'>
          <div class='header-main-row'>
            <div class='header-container'><div id='logo-wrap'></div><div id='search-wrap'></div><div id='actions-wrap'></div></div>
          </div>
        </header>`;
    
    const footerHTML = `<footer id="footer"></footer><div id='widget-sidebar'></div><div id='widget-overlay'></div>`;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 3. تحميل السكريبتات المحركة للبيانات
    const injectScript = (src) => {
        const script = document.createElement('script');
        script.src = origin + src;
        script.defer = true;
        head.appendChild(script);
    };

    if (path.includes('/product/')) {
        // ترتيب التحميل لضمان عمل الفيتش والرسم البياني
        const scripts = [
            '/public/js/chart.js',
            '/public/js/fetch.js', // سيبحث عن .UID الموجود في صفحتك
            '/public/js/make.js',
            '/public/js/worker.js',
            '/public/js/grid.js',
            '/public/js/corepress.js'
        ];
        scripts.forEach(src => injectScript(src));
    }
})();

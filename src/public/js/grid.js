const COUNTRY_MAP = {
    "SA": { symbol: "ر.س" },
    "AE": { symbol: "د.إ" },
    "OM": { symbol: "ر.ع" },
    "MA": { symbol: "د.م" },
    "DZ": { symbol: "د.ج" },
    "TN": { symbol: "د.ت" }
};

class Renderer {
    constructor(containerId, placeholder) {
        this.container = document.getElementById(containerId);
        this.placeholder = placeholder;
        const activeCntry = localStorage.getItem("Cntry") || "SA";
        this.currencyConfig = COUNTRY_MAP[activeCntry] || COUNTRY_MAP["SA"];
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    this.observer.unobserve(img);
                }
            });
        }, { rootMargin: "150px" });
    }

    formatPriceDisplay(val) {
        return parseFloat(val).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    getDatePath(offset) {
        const d = new Date(Date.UTC(2025, 0, 1) + (offset * 86400000));
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}/${m}/${day}`;
    }

    createCard(product, domain, feed) {
        if (!product) return null;
        const card = document.createElement("a");
        card.href = `${domain}product/${product.slug}/`;
        card.className = "post-card title-link";
        const symbol = this.currencyConfig.symbol;
        
        const datePath = this.getDatePath(product.dateOffset);
        const imageUrl = `https://media.iseekprice.com/${datePath}/${product.id}_1.webp`;
        
        let badgeHTML = '', metaHTML = '';
        if (feed) {
            const price = this.formatPriceDisplay(feed.price);
            const original = this.formatPriceDisplay(feed.original);
            const deliveryTime = (feed.delivery.min === feed.delivery.max || !feed.delivery.max) 
                ? `${feed.delivery.min} يوم` 
                : `${feed.delivery.max}-${feed.delivery.min} يوم`;

            if (feed.status.inStock === 0) {
                badgeHTML = '<div class="discount-badge out-of-stock">نفذت</div>';
            } else if (feed.status.promo === 1) {
                badgeHTML = '<div class="discount-badge promo">عرض خاص</div>';
            } else if (feed.original > feed.price) {
                const discount = Math.round(((feed.original - feed.price) / feed.original) * 100);
                badgeHTML = `<div class="discount-badge">-${discount}%</div>`;
            }
            
            metaHTML = `
                <div class="price-display">
                    <span class="discounted-price">${price} ${symbol}</span>
                    ${feed.original > feed.price ? `<span class="original-price">${original} ${symbol}</span>` : ''}
                </div>
                <div class="product-meta-details">
                    <div class="meta-item">★ ${feed.score}</div>
                    <div class="meta-item">${feed.orders.toLocaleString()} تم بيع</div>
                    <div class="meta-item">${deliveryTime}</div>
                </div>`;
        }
        
        card.innerHTML = `
            <span class="UID" style="display:none">${product.id}</span>
            <div class="image-container">
                ${badgeHTML}
                <img class="post-image" alt="${product.title}" src="${this.placeholder}" data-src="${imageUrl}">
                <div class="external-cart-button">
                    <svg class='icon'><use href='/public/assets/static/icons.svg#i-cart'/></svg>
                </div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${product.title}</h3>
                ${metaHTML}
            </div>`;
        
        const img = card.querySelector('.post-image');
        if (img) this.observer.observe(img);
        return card;
    }

    renderBatch(products, domain, feedMap) {
        const fragment = document.createDocumentFragment();
        products.forEach(p => {
            const card = this.createCard(p, domain, feedMap.get(p.id));
            if (card) fragment.appendChild(card);
        });
        this.container.appendChild(fragment);
    }
}

const WIDGET_CONFIG = {
    ROOT_ID: 'souq-widget-root',
    DOMAIN: "https://www.iseekprice.com/",
    BASE_URL: "https://api.iseekprice.com/",
    PLACEHOLDER: "/public/assets/static/Save.jpg",
    INITIAL_SIZE: 20,
    BATCH_SIZE: 50
};

async function startWidget() {
    const root = document.getElementById(WIDGET_CONFIG.ROOT_ID);
    if (!root) return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const rawQuery = urlParams.get('query')?.trim();

        if (rawQuery) {
            let attempts = 0;
            while (!window.searchVariants && attempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 50));
                attempts++;
            }
        }

        const mapRes = await fetch(`${WIDGET_CONFIG.BASE_URL}General/map.json?v=${Date.now()}`);
        window.fileMap = await mapRes.json();
        const country = localStorage.getItem("Cntry") || "SA";
        const feedUrl = `${WIDGET_CONFIG.BASE_URL}${country}/feed_${window.fileMap.regions[country].feed}.bin`;
        const feedRes = await fetch(feedUrl);
        window.sharedFeedBuffer = await feedRes.arrayBuffer();

        const coreFile = `General/core_${window.fileMap.core}.bin`;
        const metaFile = `General/meta_${window.fileMap.meta}.bin`;
        const feedFile = window.fileMap.regions[country]?.feed ? `${country}/feed_${window.fileMap.regions[country].feed}.bin` : null;

        if (!feedFile) throw new Error("Region not found");

        root.innerHTML = `
            <div id="product-posts" class="product-grid"></div>
            <div id="loader" class="loader-container"><div class="spinner"></div></div>
            <button id="load-more" class="load-more-btn" style="display:none;">عرض المزيد</button>`;
        
        const grid = document.getElementById('product-posts');
        const loadMoreBtn = document.getElementById('load-more');
        const loader = document.getElementById('loader');
        const renderer = new Renderer('product-posts', WIDGET_CONFIG.PLACEHOLDER);
        
        let storeData = { core: [], feed: new Map() };
        let currentIndex = 0;
        let isFullyLoaded = false;
        let initialRenderDone = false;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        const renderNextBatch = () => {
            const size = (currentIndex === 0) ? WIDGET_CONFIG.INITIAL_SIZE : WIDGET_CONFIG.BATCH_SIZE;
            const limit = Math.min(currentIndex + size, storeData.core.length);
            const batch = storeData.core.slice(currentIndex, limit);
            
            if (batch.length > 0) {
                renderer.renderBatch(batch, WIDGET_CONFIG.DOMAIN, storeData.feed);
                currentIndex = limit;
            }
            
            if (isFullyLoaded && currentIndex >= storeData.core.length) {
                loadMoreBtn.style.display = 'none';
            } else if (storeData.core.length > currentIndex) {
                loadMoreBtn.style.display = 'block';
            }
        };

        worker.onmessage = (e) => {
            if (e.data.type === 'BATCH') {
                loader.style.display = 'none';
                storeData.feed = e.data.feed;
                storeData.core.push(...e.data.batch);

                if (!initialRenderDone && storeData.core.length >= WIDGET_CONFIG.INITIAL_SIZE) {
                    renderNextBatch();
                    initialRenderDone = true;
                }
            } else if (e.data.type === 'DONE') {
                isFullyLoaded = true;
                loader.style.display = 'none';
                if (storeData.core.length === 0) {
                    grid.innerHTML = '<div class="no-results">لا توجد نتائج تطابق بحثك</div>';
                } else {
                    if (!initialRenderDone) renderNextBatch();
                    if (currentIndex < storeData.core.length) loadMoreBtn.style.display = 'block';
                }
            } else if (e.data.type === 'ERROR') {
                loader.style.display = 'none';
                grid.innerHTML = '<div class="error-msg">حدث خطأ أثناء تحميل البيانات</div>';
            }
        };

        loadMoreBtn.onclick = renderNextBatch;

        window.triggerWorkerSearch = () => {
            grid.innerHTML = '';
            loader.style.display = 'flex';
            loadMoreBtn.style.display = 'none';
            storeData.core = [];
            currentIndex = 0;
            isFullyLoaded = false;
            initialRenderDone = false;

            worker.postMessage({
                baseUrl: WIDGET_CONFIG.BASE_URL,
                coreFile: coreFile,
                metaFile: metaFile,
                feedBuffer: window.sharedFeedBuffer,
                query: window.searchVariants || rawQuery,
                storeId: urlParams.get('store'),
                filters: window.currentFilters || null
            });
        };

        window.triggerWorkerSearch();

    } catch (err) {
        console.error(err);
    }
}
document.addEventListener("DOMContentLoaded", startWidget);

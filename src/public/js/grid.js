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
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        this.observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: "150px" });
    }

    formatPriceDisplay(val) {
        return parseFloat(val).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    getDatePath(offset) {
        const d = new Date(Date.UTC(2025, 0, 1) + (offset * 86400000));
        return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
    }

    createCard(product, domain) {
        const feed = product?.feed;
        if (!product || !feed) return null;
        
        const card = document.createElement("a");
        card.href = `${domain}product/${product.slug}/`;
        card.className = "post-card title-link";
        
        const symbol = this.currencyConfig.symbol;
        const datePath = this.getDatePath(product.dateOffset);
        const imageUrl = `https://media.iseekprice.com/${datePath}/${product.id}_1.webp`;
        
        let badgeHTML = '';
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
        
        const safeTitle = product.title.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));

        card.innerHTML = `
            <span class="UID" style="display:none">${product.id}</span>
            <div class="image-container">
                ${badgeHTML}
                <img class="post-image" alt="${safeTitle}" src="${this.placeholder}" data-src="${imageUrl}">
                <div class="external-cart-button">
                    <svg class='icon'><use href='/public/assets/static/icons.svg#i-cart'/></svg>
                </div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${safeTitle}</h3>
                <div class="price-display">
                    <span class="discounted-price">${price} ${symbol}</span>
                    ${feed.original > feed.price ? `<span class="original-price">${original} ${symbol}</span>` : ''}
                </div>
                <div class="product-meta-details">
                    <div class="meta-item">★ ${feed.score}</div>
                    <div class="meta-item">${feed.orders.toLocaleString()} تم بيع</div>
                    <div class="meta-item">${deliveryTime}</div>
                </div>
            </div>`;
        
        const img = card.querySelector('.post-image');
        if (img) this.observer.observe(img);
        return card;
    }

    renderBatch(products, domain) {
        const fragment = document.createDocumentFragment();
        products.forEach(p => {
            const card = this.createCard(p, domain);
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
                await new Promise(r => setTimeout(r, 50));
                attempts++;
            }
        }

        const mapRes = await fetch(`${WIDGET_CONFIG.BASE_URL}General/map.json?v=${Date.now()}`);
        window.fileMap = await mapRes.json();
        const country = localStorage.getItem("Cntry") || "SA";
        
        const feedRes = await fetch(`${WIDGET_CONFIG.BASE_URL}${country}/feed_${window.fileMap.regions[country].feed}.bin`);
        window.sharedFeedBuffer = await feedRes.arrayBuffer();

        root.innerHTML = `
            <div id="product-posts" class="product-grid"></div>
            <div id="loader" class="loader-container"><div class="spinner"></div></div>
            <button id="load-more" class="load-more-btn" style="display:none;">عرض المزيد</button>`;
        
        const grid = document.getElementById('product-posts');
        const loadMoreBtn = document.getElementById('load-more');
        const loader = document.getElementById('loader');
        const renderer = new Renderer('product-posts', WIDGET_CONFIG.PLACEHOLDER);
        
        let storeData = { core: [] };
        let currentIndex = 0;
        let isFullyLoaded = false;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));

        const displayBatch = () => {
            const size = (currentIndex === 0) ? WIDGET_CONFIG.INITIAL_SIZE : WIDGET_CONFIG.BATCH_SIZE;
            const limit = Math.min(currentIndex + size, storeData.core.length);
            const batch = storeData.core.slice(currentIndex, limit);
            
            if (batch.length > 0) {
                renderer.renderBatch(batch, WIDGET_CONFIG.DOMAIN);
                currentIndex = limit;
            }
            
            loadMoreBtn.style.display = (currentIndex < storeData.core.length) ? 'block' : 'none';
        };

        worker.onmessage = (e) => {
            if (e.data.type === 'BATCH') {
                loader.style.display = 'none';
                storeData.core.push(...e.data.batch);

                if (currentIndex === 0 && storeData.core.length >= WIDGET_CONFIG.INITIAL_SIZE) {
                    displayBatch();
                }
            } else if (e.data.type === 'DONE') {
                isFullyLoaded = true;
                loader.style.display = 'none';
                if (storeData.core.length === 0) {
                    grid.innerHTML = '<div class="no-results">لا توجد نتائج تطابق بحثك</div>';
                } else if (currentIndex === 0) {
                    displayBatch();
                }
                loadMoreBtn.style.display = (currentIndex < storeData.core.length) ? 'block' : 'none';
            }
        };

        loadMoreBtn.onclick = displayBatch;

        window.triggerWorkerSearch = () => {
            grid.innerHTML = '';
            loader.style.display = 'flex';
            loadMoreBtn.style.display = 'none';
            storeData.core = [];
            currentIndex = 0;
            isFullyLoaded = false;

            worker.postMessage({
                baseUrl: WIDGET_CONFIG.BASE_URL,
                coreFile: `General/core_${window.fileMap.core}.bin`,
                metaFile: `General/meta_${window.fileMap.meta}.bin`,
                feedBuffer: window.sharedFeedBuffer,
                query: window.searchVariants || (rawQuery ? [[rawQuery]] : null),
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

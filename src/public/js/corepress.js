// ===================  Header ===================

(function injectAndInitializeHeader() {
    
    const logoWrap = document.getElementById('logo-wrap');
    if (logoWrap) logoWrap.innerHTML = `<a href='/'><img alt='شعار الموقع' src='/public/assets/static/favicon.png'/></a>`;

    const searchWrap = document.getElementById('search-wrap');
    if (searchWrap) {
        searchWrap.innerHTML = `
            <form class='search-box-form' onsubmit='startSearch(); return false;'>
                <input autocomplete='off' class='search-box-input' id='searchInput' placeholder='ابحث عن منتج...' type='text'/> 
                <button class='search-box-button' type='submit'>بحث <svg class='icon'><use href='/public/assets/static/icons.svg#i-search'/></svg></button>
            </form>
            <div class='search-history-dropdown' id='searchHistoryDropdown'></div>`;
    }

    const actionsWrap = document.getElementById('actions-wrap');
    if (actionsWrap) {
        actionsWrap.innerHTML = `
            <div class='custom-dropdown' id='countryDropdown'>
                <div class='selected'><img alt='السعودية' height='16' src='/public/assets/flags/sa.png' width='16'/> السعودية</div>
                <ul class='options'>
                    <li data-value='SA'><img alt='السعودية' height='16' src='/public/assets/flags/sa.png' width='16'/> السعودية</li>
                    <li data-value='AE'><img alt='الإمارات' height='16' src='/public/assets/flags/ae.png' width='16'/> الإمارات</li>
                    <li data-value='OM'><img alt='عُمان' height='16' src='/public/assets/flags/om.png' width='16'/> عُمان</li>
                    <li data-value='MA'><img alt='المغرب' height='16' src='/public/assets/flags/ma.png' width='16'/> المغرب</li>
                    <li data-value='DZ'><img alt='الجزائر' height='16' src='/public/assets/flags/dz.png' width='16'/> الجزائر</li>
                    <li data-value='TN'><img alt='تونس' height='16' src='/public/assets/flags/tn.png' width='16'/> تونس</li>
                </ul>
            </div>
            <div class='dark-mode-toggle'>
                <button aria-label='تبديل الوضع الليلي' id='dark-toggler'><svg class='icon'><use href='/public/assets/static/icons.svg#i-moon'/></svg></button>
            </div>
            <div class='cart-widget' id='cart-widget-header'>
                <span class='cart-icon'><svg class='icon'><use href='/public/assets/static/icons.svg#i-cart'/></svg></span>
                <span id='cart-count'>0</span>
            </div>`;
    }

    const topBar = document.getElementById('widget-topbar');
    if (topBar) topBar.innerHTML = `<button id='widget-toggle-btn'>&#9776;</button><div id='widget-desktop-cats'></div>`;

    const sideBar = document.getElementById('widget-sidebar');
    if (sideBar) {
        sideBar.innerHTML = `
            <div id='widget-header-bar'><span id='widget-sidebar-title'>التصنيفات</span><button id='widget-close-btn'>&#10006;</button></div>
            <div id='widget-side-list'></div>`;
    }


    
    const htmlEl = document.documentElement;
    const darkBtn = document.getElementById("dark-toggler");
    function applyTheme(theme, persist) {
    const iconUse = darkBtn ? darkBtn.querySelector("use") : null;
    const iconPath = "/public/assets/static/icons.svg";
        if (theme === "dark") {
            htmlEl.classList.add("dark-mode");
            htmlEl.setAttribute("data-theme", "dark");
            if (iconUse) iconUse.setAttribute("href", iconPath + "#i-sun");
        } else {
            htmlEl.classList.remove("dark-mode");
            htmlEl.setAttribute("data-theme", "light");
            if (iconUse) iconUse.setAttribute("href", iconPath + "#i-moon");
        }
        if (persist) localStorage.setItem("theme", theme);
    }
    let savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(savedTheme, false);
    if (darkBtn) {
        darkBtn.addEventListener("click", e => {
            e.preventDefault();
            applyTheme(htmlEl.classList.contains("dark-mode") ? "light" : "dark", true);
        });
    }


    
   function updateCartWidget() {
   const cart = JSON.parse(localStorage.getItem("cart")) || [];
   const countEl = document.getElementById("cart-count");
   if (countEl) { countEl.textContent = cart.length; cart.length > 0 ? countEl.classList.add("active") : countEl.classList.remove("active"); }
    }
    updateCartWidget();
    window.addEventListener("cartUpdated", updateCartWidget);
    const cartBtn = document.getElementById("cart-widget-header");
    if (cartBtn) cartBtn.onclick = () => window.location.href = "/pages/main/cart/";


    const dropdown = document.getElementById("countryDropdown");
    const selected = dropdown ? dropdown.querySelector(".selected") : null;
    const options = dropdown ? dropdown.querySelector(".options") : null;
    const url = new URL(window.location.href);
    const paramCountry = url.searchParams.get("country");
    const savedCountry = localStorage.getItem("Cntry");

    function setActiveCountry(code, updateUrl = true) {
        if (!options) return;
        const li = options.querySelector(`li[data-value="${code}"]`);
        if (!li) return;
        localStorage.setItem("Cntry", code);
        if (selected) selected.innerHTML = li.innerHTML;
        if (updateUrl) { url.searchParams.set("country", code); window.history.replaceState({}, "", url); }
    }

    if (paramCountry) setActiveCountry(paramCountry); 
    else if (savedCountry) setActiveCountry(savedCountry); 
    else setActiveCountry("SA");

    if (selected && options) {
        selected.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle("open"); options.style.display = dropdown.classList.contains("open") ? "block" : "none"; };
        options.onclick = (e) => {
            const li = e.target.closest("li");
            if (!li) return;
            setActiveCountry(li.getAttribute("data-value"));
            window.location.reload();
        };
    }


    
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = window.location.origin + window.location.pathname;
    document.head.appendChild(canonical);
    if (paramCountry) {
        const robots = document.createElement("meta");
        robots.name = "robots"; robots.content = "noindex";
        document.head.appendChild(robots);
    }
})();


// =================== Footer ===================


const footerInjector = document.getElementById('footer');

if (footerInjector) {
    const sections = [
        {
            title: "عن الموقع",
            links: [
                { text: "من نحن", url: "/pages/info/about-us/" },
                { text: "سياسة الموقع", url: "/pages/info/policy/" },
                { text: "اتصل بنا", url: "/pages/info/contact/" }
            ]
        },
        {
            title: "اعرف أكثر",
            links: [
                { text: "المدونة", url: "/pages/main/blog/" },
                { text: "دردشة", url: "/pages/services/iseekchat/" }
            ]
        }
    ];

    const socialLinks = [
        { label: "YouTube", icon: "i-youtube", url: "https://www.youtube.com/@ISeekPrice" },
        { label: "Pinterest", icon: "i-pinterest", url: "https://www.pinterest.com/ISeekPrice" },
        { label: "Facebook", icon: "i-facebook", url: "https://www.facebook.com/profile.php?id=61579522981793" },
        { label: "Instagram", icon: "i-instagram", url: "https://www.instagram.com/iseekprice/" },
        { label: "X", icon: "i-x", url: "https://x.com/ISeekPrice" },
        { label: "Telegram", icon: "i-telegram", url: "https://t.me/+bmBnY0FumOwxZDQ0" }
    ];

    const sectionsHtml = sections.map(sec => `
        <div class='footer-links'>
            <h3 class='footer-title'>${sec.title}</h3>
            <ul>
                ${sec.links.map(link => `<li><a href='${link.url}'>${link.text}</a></li>`).join('')}
            </ul>
        </div>
    `).join('');

    const socialHtml = `
        <div class='footer-social-section'>
            <h3 class='footer-title'>تابعونا علي</h3>
            <div class='footer-social'>
                ${socialLinks.map(soc => `
                    <a aria-label='${soc.label}' href='${soc.url}' rel='noopener' target='_blank'>
                        <svg class='icon'><use href='/public/assets/static/icons.svg#${soc.icon}'/></svg>
                    </a>
                `).join('')}
            </div>
        </div>
    `;

    footerInjector.innerHTML = `
        <div class='footer-container'>
            <div class='footer-row'>
                ${sectionsHtml}
                ${socialHtml}
            </div>
        </div>
        <div class='footer-bottom'>
            <p>&#169; 2024-${new Date().getFullYear()} جميع الحقوق محفوظة لموقع iseekprice.com</p>
        </div>
    `;
}


// =================== Cart + Back To Top + Share ===================

function showCartToast(m,t="success"){const h=document.createElement("div");document.body.prepend(h);const s=h.attachShadow({mode:"open"}),d=document.createElement("div");d.textContent=m;s.appendChild(d);const st=document.createElement("style");st.textContent=`div{position:fixed;top:20px;right:20px;min-width:220px;max-width:320px;background:${t==="error"?"#e74c3c":"#2ecc71"};color:white;font-family:sans-serif;font-size:14px;padding:12px 18px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;transform:translateX(120%);transition:all 0.4s ease;z-index:1000000;}div.show{opacity:1;transform:translateX(0);}`;s.appendChild(st);setTimeout(()=>d.classList.add("show"),50);setTimeout(()=>{d.classList.remove("show");setTimeout(()=>h.remove(),400)},3000)}
function addToCart(id){if(!id){showCartToast("عذراً، لم يتم العثور على معرف المنتج!","error");return}let c=JSON.parse(localStorage.getItem("cart"))||[];if(c.some(i=>i.id===id)){showCartToast("المنتج موجود بالفعل في العربة!","error");return}c.push({id:id,timestamp:new Date().getTime()});localStorage.setItem("cart",JSON.stringify(c));window.dispatchEvent(new Event("cartUpdated"));showCartToast("تمت إضافة المنتج بنجاح!","success")}
document.addEventListener("click",function(e){const b=e.target.closest(".external-cart-button");if(b){e.preventDefault();e.stopPropagation();const p=e.target.closest(".post-card");const id=p?p.querySelector(".UID")?.textContent.trim():null;addToCart(id)}const a=e.target.closest(".add-to-cart");if(a){e.preventDefault();e.stopPropagation();const u=document.querySelector(".UID");addToCart(u?u.textContent.trim():null)}});

(function(){const b=document.createElement('div');b.id='back-to-top';b.innerHTML=`<a aria-label='Back to Top' href='#top'><svg class='icon'><use xlink:href='/public/assets/static/icons.svg#i-arrow-t'/></svg></a>`;document.body.appendChild(b);window.addEventListener('scroll',()=>{b.classList.toggle('show',window.scrollY>800)},{passive:true});b.addEventListener('click',(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})})})();


document.addEventListener('DOMContentLoaded', function() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    const modalHTML = `
    <div class='share-modal' id='shareModal' style="display:none;">
        <div class='modal-content'>
            <span class='modal-close-btn' id='shareCloseBtn'>&times;</span>
            <h3 class='modal-title'>مشاركة مع الاصدقاء</h3>
            <div class='share-links'>
                <a class='share-btn s-fb' href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-facebook'/></svg><span>فيسبوك</span>
                </a>
                <a class='share-btn s-x' href="https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-x'/></svg><span>إكس</span>
                </a>
                <a class='share-btn s-wa' href="https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-whatsapp'/></svg><span>واتساب</span>
                </a>
                <a class='share-btn s-tg' href="https://t.me/share/url?url=${pageUrl}&text=${pageTitle}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-telegram'/></svg><span>تليجرام</span>
                </a>
                <a class='share-btn s-pin' href="https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageTitle}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-pinterest'/></svg><span>بينترست</span>
                </a>
                <a class='share-btn s-rd' href="https://reddit.com/submit?url=${pageUrl}&title=${pageTitle}" target='_blank'>
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-reddit'/></svg><span>ريديت</span>
                </a>
                <a class='share-btn s-em' href="mailto:?subject=${pageTitle}&body=${pageUrl}">
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-email'/></svg><span>بريد إلكتروني</span>
                </a>
                <a class='share-btn s-copy' id='copyLinkBtn' href="javascript:void(0);">
                    <svg class="icon"><use href='/public/assets/static/icons.svg#i-copy'/></svg><span>نسخ الرابط</span>
                </a>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend',modalHTML);const m=document.getElementById('shareModal'),o=document.getElementById('shareOpenBtn'),c=document.getElementById('shareCloseBtn'),cp=document.getElementById('copyLinkBtn'),cl=()=>{m.style.display='none',document.body.style.overflow='auto'};if(o)o.onclick=()=>{m.style.display='block',document.body.style.overflow='hidden'};if(c)c.onclick=cl;window.onclick=e=>{if(e.target==m)cl()};if(cp)cp.onclick=()=>{navigator.clipboard.writeText(window.location.href).then(()=>{alert('تم نسخ الرابط بنجاح!')}).catch(e=>console.error(e))};document.querySelectorAll('.share-btn').forEach(b=>{if(!b.classList.contains('s-em')&&!b.classList.contains('s-wa')&&b.id!=='copyLinkBtn'){b.onclick=function(e){e.preventDefault();window.open(this.href,'share-dialog','width=600,height=400')}}});
});


// =================== Track ===================

const UIDManager={generate(){const now=new Date();const datePart=now.getFullYear().toString()+(now.getMonth()+1).toString().padStart(2,'0')+now.getDate().toString().padStart(2,'0')+now.getHours().toString().padStart(2,'0')+now.getMinutes().toString().padStart(2,'0')+now.getSeconds().toString().padStart(2,'0');const randomPart=Math.random().toString(36).substring(2,10).toUpperCase();return `ID-${datePart}-${randomPart}`},getPersistentId(){let id=localStorage.getItem("user_fingerprint");if(!id){id=this.generate();localStorage.setItem("user_fingerprint",id)}
return id}}
    

(function(){const w="https://script.google.com/macros/s/AKfycbyGmFcwqcsvO7ZQ8Tl7LhaicR_c_ox-QsiEi3m-C6GHM2bw1kFMrxRrcncGe-Tfxnd9iQ/exec";let a=["Entry"],e="Direct/Closed",s=!1;const gV=()=>document.querySelector('.UID')?.innerText.trim()||localStorage.getItem('user_fingerprint')||"Unknown";const gC=()=>localStorage.getItem("Cntry")||"SA";const gO=()=>{const n=navigator.userAgent;return/Android/i.test(n)?"Android":/iPhone|iPad|iPod/i.test(n)?"iOS":/Win/i.test(n)?"Windows":/Mac/i.test(n)?"MacOS":"Other"};const gB=()=>{const n=navigator.userAgent.toLowerCase();return n.includes("edg")?"Edge":n.includes("opr")?"Opera":n.includes("chrome")?"Chrome":n.includes("firefox")?"Firefox":"Safari"};const send=()=>{if(s||!a.length)return;const d=JSON.stringify({entryTime:new Date().toLocaleString('sv-SE'),visitorId:gV(),action:a.join(" -> "),pageUrl:location.pathname,referrer:document.referrer||"Direct",exitDestination:e,os:gO(),browser:gB(),screenRes:`${screen.width}x${screen.height} [${gC()}]`});navigator.sendBeacon?navigator.sendBeacon(w,d):fetch(w,{method:'POST',body:d,keepalive:!0});s=!0};document.addEventListener("mousedown",(t)=>{const c=t.target.closest("a, button, .iseek-btn, .copy-button, .tab-buttons button");if(!c)return;let l="";if(c.tagName==="A"||c.classList.contains("buy-button")){if(c.href&&!c.href.includes(location.hostname)&&!c.href.startsWith("js")){e=c.href;l="Exit"}}
if(c.classList.contains("add-to-cart"))l="Cart";if(c.classList.contains("copy-button"))l="Coupon";if(c.classList.contains("iseek-btn"))l="Alert";if(c.id==="btn-download-chart")l="Download";if(c.id==="btn-share-chart")l="Share";if(c.closest(".tab-buttons"))l="Tab:"+c.innerText.trim();if(l&&!a.includes(l))a.push(l);});window.addEventListener("pagehide",send);window.addEventListener("visibilitychange",()=>document.visibilityState==="hidden"&&send())})()

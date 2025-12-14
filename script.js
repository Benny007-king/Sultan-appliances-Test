/* =========================================
   INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    checkCookieConsent();
    
    // Show loaded sections
    document.querySelectorAll('.loading').forEach(el => {
        el.classList.add('loaded');
        el.classList.remove('loading');
    });

    // Load video for desktop only
    const video = document.getElementById('heroVideo');
    if(video && window.innerWidth > 768) {
        video.style.display = 'block';
        video.load();
        video.play().catch(() => console.log("Autoplay blocked"));
    }
});

/* =========================================
   MENU LOGIC
   ========================================= */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars'); icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark'); icon.classList.add('fa-bars');
    }
}

document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu();
    }
});

/* =========================================
   SCROLL & ANIMATION LOGIC
   ========================================= */
// Skills Animation
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.progress');
                if(progress) progress.style.width = progress.getAttribute('data-width');
            }
        });
    }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });
    
    window.addEventListener('load', () => {
        document.querySelectorAll('.skill-item').forEach(item => observer.observe(item));
    });
}

// Sticky Header
let lastScroll = 0;
let ticking = false;
window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const header = document.getElementById('header');
            if (lastScroll > 50) {
                header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
                header.style.padding = "5px 0";
            } else {
                header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.05)";
                header.style.padding = "10px 0";
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Marquee Highlight
function updateMarqueeHighlight() {
    const items = document.querySelectorAll('.brand-item');
    if(items.length === 0) return;
    const centerScreen = window.innerWidth / 2;
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        if (Math.abs(centerScreen - itemCenter) < 100) item.classList.add('active');
        else item.classList.remove('active');
    });
    requestAnimationFrame(updateMarqueeHighlight);
}

window.addEventListener('load', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        updateMarqueeHighlight();
    }
});

/* =========================================
   ACCESSIBILITY LOGIC
   ========================================= */
function toggleAccessibility() {
    document.getElementById('accMenu').classList.toggle('active');
}

function toggleAccClass(className) {
    document.documentElement.classList.toggle(className);
}

let isReadingMode = false;
function toggleReadMode() {
    isReadingMode = !isReadingMode;
    document.body.classList.toggle('acc-reading-mode');
    if(!isReadingMode) window.speechSynthesis.cancel();
}

document.addEventListener('click', (e) => {
    if (!isReadingMode) return;
    if (e.target.closest('.accessibility-menu') || e.target.closest('.accessibility-btn')) return;
    e.preventDefault();
    e.stopPropagation();

    const textToRead = e.target.innerText;
    if (textToRead && textToRead.trim().length > 0) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'he-IL';
        window.speechSynthesis.speak(utterance);
    }
}, true);

function resetAccessibility() {
    document.documentElement.className = '';
    document.body.classList.remove('acc-reading-mode');
    isReadingMode = false;
    window.speechSynthesis.cancel();
}

/* =========================================
   COOKIE LOGIC
   ========================================= */
const CONSENT_KEY = 'sultan_cookie_consent';
const CONSENT_TIME_KEY = 'sultan_cookie_time';
const EXPIRY_HOURS = 48;

function checkCookieConsent() {
    const consentTime = localStorage.getItem(CONSENT_TIME_KEY);
    if (consentTime) {
        const now = new Date().getTime();
        const hoursPassed = (now - parseInt(consentTime)) / (1000 * 60 * 60);
        if (hoursPassed < EXPIRY_HOURS) return;
    }
    setTimeout(() => {
        document.getElementById('cookiePopup').classList.add('show');
    }, 1500);
}

function toggleCookieSettings() {
    const options = document.getElementById('cookieOptions');
    const btn = document.querySelector('.btn-settings');
    
    if (options.classList.contains('visible')) {
        saveCookieSettings(); 
    } else {
        options.classList.add('visible');
        btn.innerText = "שמור העדפות";
    }
}

function acceptAllCookies() {
    saveConsent(true);
}

function saveCookieSettings() {
    const marketing = document.getElementById('marketingCookies').checked;
    saveConsent(marketing);
}

function saveConsent(marketingAllowed) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ necessary: true, marketing: marketingAllowed }));
    localStorage.setItem(CONSENT_TIME_KEY, new Date().getTime().toString());
    
    document.getElementById('cookiePopup').classList.remove('show');
}

/* =========================================
   PRIVACY MODAL LOGIC
   ========================================= */
function openPrivacyPolicy() {
    document.getElementById('privacyModal').classList.add('active');
}
function closePrivacyPolicy() {
    document.getElementById('privacyModal').classList.remove('active');
}
document.getElementById('privacyModal').addEventListener('click', (e) => {
    if(e.target.id === 'privacyModal') closePrivacyPolicy();
});

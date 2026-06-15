// ======================================
// MOBILE MENU (PREMIUM DRAWER)
// ======================================

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("is-open");
        hamburger.classList.toggle("is-open", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);

        // Swap bars <-> xmark icon
        const icon = hamburger.querySelector("i");
        if (isOpen) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close on outside tap
    document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove("is-open");
            hamburger.classList.remove("is-open");
            hamburger.setAttribute("aria-expanded", "false");
            const icon = hamburger.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll(".mobile-nav-link").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("is-open");
            hamburger.classList.remove("is-open");
            hamburger.setAttribute("aria-expanded", "false");
            const icon = hamburger.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });
}


// ======================================
// HERO SLIDER
// ======================================

const sliderImage = document.getElementById("food-slider");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const dots = document.querySelectorAll(".dot");

const slides = [

    {
        image: "images/hero/pizza.png",
        title: 'Exceptional Food. <span>Delivered</span> In Minutes.',
        description:
            "Order from curated restaurants, track deliveries in real time, and enjoy meals crafted with care."
    },

    {
        image: "images/hero/burger.png",
        title: 'Sourced for <span>flavor</span> arriving at its peak.',
        description:
            "Freshly prepared gourmet burgers delivered straight to your doorstep."
    },

    {
        image: "images/hero/thali.png",
        title: 'Authentic Flavors. <span>At Your</span> Doorstep.',
        description:
            "Enjoy traditional meals from top-rated kitchens and restaurants near you."
    }

];

let currentSlide = 0;

// ======================================
// UPDATE SLIDE
// ======================================

function updateSlide() {

    if (!sliderImage) return;

    sliderImage.style.opacity = "0";
    sliderImage.style.transform = "scale(.92)";

    heroTitle.style.opacity = "0";
    heroTitle.style.transform = "translateY(15px)";

    heroDescription.style.opacity = "0";
    heroDescription.style.transform = "translateY(15px)";

    setTimeout(() => {

        sliderImage.src = slides[currentSlide].image;

        heroTitle.innerHTML =
            slides[currentSlide].title;

        heroDescription.innerHTML =
            slides[currentSlide].description;

        dots.forEach(dot =>
            dot.classList.remove("active")
        );

        if (dots[currentSlide]) {
            dots[currentSlide].classList.add("active");
        }

        sliderImage.style.opacity = "1";
        sliderImage.style.transform = "scale(1)";

        heroTitle.style.opacity = "1";
        heroTitle.style.transform = "translateY(0)";

        heroDescription.style.opacity = "1";
        heroDescription.style.transform = "translateY(0)";

    }, 400);
}

// ======================================
// AUTO SLIDER
// ======================================

if (sliderImage) {

    setInterval(() => {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        updateSlide();

    }, 5000);
}

// ======================================
// DOT NAVIGATION
// ======================================

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentSlide = index;

        updateSlide();

    });

});

// ======================================
// NAVBAR SCROLL EFFECT
// ======================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});

// ======================================
// SCROLL ANIMATIONS
// ======================================

const animatedCards = document.querySelectorAll(
    ".stat-card, .category-item, .restaurant-card, .dish-card, .step-card, .testimonial-card"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

}, {
    threshold: 0.15
});

animatedCards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform =
        "translateY(30px)";

    card.style.transition =
        "all .7s ease";

    observer.observe(card);

});

// ======================================
// HERO FADE-IN
// ======================================

window.addEventListener("load", () => {

    const heroLeft =
        document.querySelector(".hero-left");

    const heroRight =
        document.querySelector(".hero-right");

    if (!heroLeft || !heroRight) return;

    heroLeft.style.opacity = "0";
    heroRight.style.opacity = "0";

    heroLeft.style.transform =
        "translateY(30px)";

    heroRight.style.transform =
        "translateY(30px)";

    heroLeft.style.transition =
        "all .8s ease";

    heroRight.style.transition =
        "all .8s ease";

    setTimeout(() => {

        heroLeft.style.opacity = "1";
        heroRight.style.opacity = "1";

        heroLeft.style.transform =
            "translateY(0)";

        heroRight.style.transform =
            "translateY(0)";

    }, 200);

});

const categorySlider =
    document.querySelector(".category-slider");

if (categorySlider) {

    const originalCategoryItems =
        Array.from(categorySlider.children);

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    originalCategoryItems.forEach(item => {

        const clone =
            item.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;

        categorySlider.appendChild(clone);
        observer.observe(clone);

    });

    let isCategoryPaused = false;
    let categoryAnimationFrame;

    const getCategoryLoopWidth = () => {

        const firstClone =
            categorySlider.children[originalCategoryItems.length];

        if (!firstClone) return categorySlider.scrollWidth / 2;

        return firstClone.offsetLeft -
            categorySlider.children[0].offsetLeft;

    };

    function autoScrollCategories() {

        if (!isCategoryPaused && !reduceMotion.matches) {

            categorySlider.scrollLeft += 0.55;

            if (categorySlider.scrollLeft >= getCategoryLoopWidth()) {
                categorySlider.scrollLeft = 0;
            }

        }

        categoryAnimationFrame =
            requestAnimationFrame(autoScrollCategories);
    }

    categorySlider.addEventListener("mouseenter", () => {
        isCategoryPaused = true;
    });

    categorySlider.addEventListener("mouseleave", () => {
        isCategoryPaused = false;
    });

    categorySlider.addEventListener("focusin", () => {
        isCategoryPaused = true;
    });

    categorySlider.addEventListener("focusout", () => {
        isCategoryPaused = false;
    });

    categorySlider.addEventListener("touchstart", () => {
        isCategoryPaused = true;
    }, {
        passive: true
    });

    categorySlider.addEventListener("touchend", () => {

        setTimeout(() => {
            isCategoryPaused = false;
        }, 1200);

    }, {
        passive: true
    });

    reduceMotion.addEventListener("change", event => {

        if (event.matches) {
            cancelAnimationFrame(categoryAnimationFrame);
        } else {
            autoScrollCategories();
        }

    });

    if (!reduceMotion.matches) {

        requestAnimationFrame(() => {
            autoScrollCategories();
        });

    }

}

// ======================================
// PARTNER & DOWNLOAD APP FUNCTIONALITY (PHASE 7)
// ======================================
const initStatsCounter = () => {
    const stats = document.querySelectorAll('.partner-stats-grid .stat-num');
    if (!stats.length) return;

    const countUp = (element) => {
        const target = +element.getAttribute('data-val');
        const isRating = element.innerText.includes('★') || element.getAttribute('data-val') === '49';
        const isOrders = element.innerText.includes('K') || element.getAttribute('data-val') === '10';
        let current = 0;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        let stepCount = 0;

        const timer = setInterval(() => {
            current += increment;
            stepCount++;

            if (stepCount >= steps) {
                clearInterval(timer);
                if (isRating) {
                    element.innerHTML = '4.9<span style="color: var(--primary);">★</span>';
                } else if (isOrders) {
                    element.innerText = '10K+';
                } else if (target === 500) {
                    element.innerText = '500+';
                } else if (target === 25) {
                    element.innerText = '25 Min';
                }
            } else {
                if (isRating) {
                    element.innerHTML = (current / 10).toFixed(1) + '<span style="color: var(--primary);">★</span>';
                } else if (isOrders) {
                    element.innerText = Math.round(current) + 'K+';
                } else if (target === 500) {
                    element.innerText = Math.round(current) + '+';
                } else if (target === 25) {
                    element.innerText = Math.round(current) + ' Min';
                }
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numElement = entry.target;
                countUp(numElement);
                statsObserver.unobserve(numElement);
            }
        });
    }, { threshold: 0.4 });

    stats.forEach(stat => statsObserver.observe(stat));
};

const initScrollReveal = () => {
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
    if (!scrollRevealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    scrollRevealElements.forEach(el => revealObserver.observe(el));
};

// Run initializations
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initStatsCounter();
        initScrollReveal();
    });
} else {
    initStatsCounter();
    initScrollReveal();
}

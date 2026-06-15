/* ==========================================================================
   PLATTER PREMIUM HOME JS (PHASE 1)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. STICKY NAVBAR SCROLL TRANSITION
    // ----------------------------------------------------------------------
    const navbar = document.getElementById("mainNavbar");
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        if (!navbar) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        if (currentScrollY > 150 && currentScrollY > lastScrollY) {
            navbar.classList.add("navbar-hidden");
        } else {
            navbar.classList.remove("navbar-hidden");
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run initially in case page loaded scrolled down

    // Back to top logic
    const backToTopBtn = document.getElementById("backToTopBtn");
    const progressCircleBar = document.querySelector(".progress-circle-bar");

    const updateScrollProgress = () => {
        if (!backToTopBtn || !progressCircleBar) return;

        const scrollY = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Toggle back to top button visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }

        // Update SVG circle fill progress
        if (scrollHeight > 0) {
            const progressPercentage = scrollY / scrollHeight;
            const circumference = 132; // 2 * Math.PI * 21
            progressCircleBar.style.strokeDashoffset = circumference - (progressPercentage * circumference);
        }
    };

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. MOBILE SIDE DRAWER TOGGLE
    // ----------------------------------------------------------------------
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");

    const openDrawer = () => {
        if (mobileDrawer && drawerOverlay) {
            mobileDrawer.classList.add("open");
            drawerOverlay.classList.add("open");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
    };

    const closeDrawer = () => {
        if (mobileDrawer && drawerOverlay) {
            mobileDrawer.classList.remove("open");
            drawerOverlay.classList.remove("open");
            document.body.style.overflow = ""; // Restore scroll
        }
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener("click", openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

    // ----------------------------------------------------------------------
    // 2b. MOBILE SEARCH EXPAND / COLLAPSE
    // ----------------------------------------------------------------------
    const mobileSearchBtn    = document.getElementById("mobileSearchBtn");
    const mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
    const mobileSearchClose  = document.getElementById("mobileSearchClose");
    const mobileSearchInput  = document.getElementById("mobileSearchInput");
    const mobileSearchClear  = document.getElementById("mobileSearchClear");

    const navbarContainer = document.querySelector(".navbar-container");

    const openMobileSearch = () => {
        if (!mobileSearchOverlay) return;
        mobileSearchOverlay.classList.add("is-open");
        // Full takeover: add class to hide logo + nav-actions via CSS
        if (navbarContainer) navbarContainer.classList.add("navbar-search-active");
        // Focus the input after the CSS transition starts
        setTimeout(() => { if (mobileSearchInput) mobileSearchInput.focus(); }, 180);
    };

    const closeMobileSearch = () => {
        if (!mobileSearchOverlay) return;
        mobileSearchOverlay.classList.remove("is-open");
        if (navbarContainer) navbarContainer.classList.remove("navbar-search-active");
        if (mobileSearchInput) mobileSearchInput.value = "";
        if (mobileSearchClear) mobileSearchClear.classList.remove("visible");
    };

    if (mobileSearchBtn)   mobileSearchBtn.addEventListener("click", openMobileSearch);
    if (mobileSearchClose) mobileSearchClose.addEventListener("click", closeMobileSearch);

    // Close when the input loses focus AND the click target is outside the overlay
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("blur", () => {
            // Small delay so clicks on the clear/close buttons still register
            setTimeout(() => {
                const focused = document.activeElement;
                const isInsideOverlay = mobileSearchOverlay && mobileSearchOverlay.contains(focused);
                if (!isInsideOverlay) {
                    closeMobileSearch();
                }
            }, 150);
        });
    }

    // Show / hide the clear X as the user types
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("input", () => {
            if (mobileSearchClear) {
                mobileSearchClear.classList.toggle("visible", mobileSearchInput.value.length > 0);
            }
        });
    }

    // Clear button resets input and refocuses
    if (mobileSearchClear) {
        mobileSearchClear.addEventListener("click", () => {
            if (mobileSearchInput) { mobileSearchInput.value = ""; mobileSearchInput.focus(); }
            mobileSearchClear.classList.remove("visible");
        });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileSearchOverlay && mobileSearchOverlay.classList.contains("is-open")) {
            closeMobileSearch();
        }
    });

    // ----------------------------------------------------------------------
    // 3. NAVBAR DROPDOWN TOGGLES (LOCATION & PROFILE)
    // ----------------------------------------------------------------------
    const locationTrigger = document.getElementById("locationTrigger");
    const profileTrigger = document.getElementById("profileTrigger");

    if (locationTrigger) {
        locationTrigger.addEventListener("click", (e) => {
            // If clicking inside the dropdown items or locator button, do not toggle the main selector
            if (e.target.closest(".location-dropdown")) return;

            locationTrigger.classList.toggle("active");
            if (profileTrigger) profileTrigger.classList.remove("active");
        });
    }

    if (profileTrigger) {
        profileTrigger.addEventListener("click", (e) => {
            // If clicking items inside the profile dropdown, do not toggle
            if (e.target.closest(".profile-dropdown")) return;

            profileTrigger.classList.toggle("active");
            if (locationTrigger) locationTrigger.classList.remove("active");
        });
    }

    // Close dropdowns if clicking outside
    document.addEventListener("click", (e) => {
        if (locationTrigger && !locationTrigger.contains(e.target)) {
            locationTrigger.classList.remove("active");
        }
        if (profileTrigger && !profileTrigger.contains(e.target)) {
            profileTrigger.classList.remove("active");
        }
    });

    // ----------------------------------------------------------------------
    // 4. ADDRESS SELECTION & LOCATOR SIMULATION
    // ----------------------------------------------------------------------
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const currentLocationText = document.getElementById("currentLocationText");
    const locateMeBtn = document.getElementById("locateMeBtn");

    dropdownItems.forEach(item => {
        item.addEventListener("click", () => {
            dropdownItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const selectedLocation = item.getAttribute("data-location");
            if (currentLocationText && selectedLocation) {
                currentLocationText.textContent = selectedLocation;
            }

            // Close dropdown
            if (locationTrigger) locationTrigger.classList.remove("active");
        });
    });

    if (locateMeBtn) {
        locateMeBtn.addEventListener("click", () => {
            const originalHTML = locateMeBtn.innerHTML;
            locateMeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Locating...`;
            locateMeBtn.disabled = true;

            // Simulate GPS geolocation response
            setTimeout(() => {
                const simulatedLocation = "Indiranagar, Bangalore";
                if (currentLocationText) {
                    currentLocationText.textContent = simulatedLocation;
                }

                // Add active state to matching dropdown item if exists
                dropdownItems.forEach(i => {
                    if (i.getAttribute("data-location") === simulatedLocation) {
                        i.classList.add("active");
                    } else {
                        i.classList.remove("active");
                    }
                });

                locateMeBtn.innerHTML = originalHTML;
                locateMeBtn.disabled = false;

                // Close dropdown
                if (locationTrigger) locationTrigger.classList.remove("active");
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 5. PREMIUM SEARCH WIDGET TAB STATE SWITCHING
    // ----------------------------------------------------------------------
    const tabBtns = document.querySelectorAll(".tab-btn");
    const heroSearchInput = document.getElementById("heroSearchInput");
    const searchSuggestions = document.getElementById("searchSuggestions");
    let activeSearchMode = "restaurants";

    const placeholders = {
        restaurants: "Search premium restaurants near you...",
        dishes: "Search for delicious dishes (e.g. Pizza, Burger, Salad)...",
        cuisines: "Search by cuisines (e.g. Italian, North Indian, Chinese)..."
    };

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            activeSearchMode = btn.getAttribute("data-search-mode");
            if (heroSearchInput) {
                heroSearchInput.placeholder = placeholders[activeSearchMode] || placeholders.restaurants;
                heroSearchInput.value = ""; // Clear input on tab switch
                heroSearchInput.focus();
            }
            if (searchSuggestions) {
                searchSuggestions.classList.remove("active");
                searchSuggestions.innerHTML = "";
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. MOCK SEARCH SUGGESTIONS INTERACTIVITY
    // ----------------------------------------------------------------------
    const mockDatabase = {
        restaurants: [
            { name: "Pizza Palace", type: "Italian • Pizza" },
            { name: "Burger Hub", type: "Fast Food • Burgers" },
            { name: "Biryani House", type: "Biryani • Mughlai" },
            { name: "Green Bowl", type: "Healthy • Salads" },
            { name: "Noodle Story", type: "Asian • Noodles" }
        ],
        dishes: [
            { name: "Margherita Pizza", type: "Pizza Palace" },
            { name: "Double Cheese Burger", type: "Burger Hub" },
            { name: "Chicken Biryani", type: "Biryani House" },
            { name: "Avocado Quinoa Salad", type: "Green Bowl" },
            { name: "Szechuan Hakka Noodles", type: "Noodle Story" }
        ],
        cuisines: [
            { name: "Italian Cuisine", type: "Pizza, Pasta, Risotto" },
            { name: "American Cuisine", type: "Burgers, Fries, Wings" },
            { name: "North Indian Cuisine", type: "Biryani, Naan, Curry" },
            { name: "Healthy & Organic Food", type: "Salads, Bowls, Smoothies" },
            { name: "Asian Cuisine", type: "Dimsums, Noodles, Sushi" }
        ]
    };

    if (heroSearchInput && searchSuggestions) {
        heroSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();

            if (query.length < 2) {
                searchSuggestions.classList.remove("active");
                searchSuggestions.innerHTML = "";
                return;
            }

            // Filter data based on current tab mode
            const currentPool = mockDatabase[activeSearchMode] || [];
            const matches = currentPool.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                searchSuggestions.innerHTML = `
                    <div class="suggestion-item" style="pointer-events: none; color: var(--muted);">
                        <i class="fa-solid fa-circle-info"></i>
                        <span>No matches found for "${e.target.value}"</span>
                    </div>
                `;
            } else {
                searchSuggestions.innerHTML = matches.map(match => `
                    <div class="suggestion-item" data-value="${match.name}">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span>${match.name}</span>
                        <span class="type-tag">${match.type}</span>
                    </div>
                `).join("");

                // Add click events to suggestions
                const items = searchSuggestions.querySelectorAll(".suggestion-item");
                items.forEach(item => {
                    item.addEventListener("click", () => {
                        const val = item.getAttribute("data-value");
                        heroSearchInput.value = val;
                        searchSuggestions.classList.remove("active");
                    });
                });
            }

            searchSuggestions.classList.add("active");
        });

        // Close suggestions list if clicking elsewhere
        document.addEventListener("click", (e) => {
            if (!heroSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove("active");
            }
        });
    }

    // ----------------------------------------------------------------------
    // 7. KEYBOARD SHORTCUT FOCUS (⌘K / Ctrl+K)
    // ----------------------------------------------------------------------
    const navSearchInput = document.getElementById("navSearchInput");

    document.addEventListener("keydown", (e) => {
        // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            if (navSearchInput) {
                navSearchInput.focus();
                navSearchInput.select();
            }
        }
    });

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE ACTION HOVER SOUND EFFECT OR MICRO EFFECTS
    // ----------------------------------------------------------------------
    const actionButtons = document.querySelectorAll(".btn, .search-action-btn");
    actionButtons.forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.97) translateY(0)";
        });
        btn.addEventListener("mouseup", () => {
            btn.style.transform = "";
        });
    });

    // ----------------------------------------------------------------------
    // 9. OFFERS SLIDER AUTO ROTATION & MANUAL CONTROLS (PHASE 2)
    // ----------------------------------------------------------------------
    const offerSlides = document.querySelectorAll(".offer-slide");
    const offerPrevBtn = document.getElementById("offerPrevBtn");
    const offerNextBtn = document.getElementById("offerNextBtn");
    const offerPagDots = document.querySelectorAll(".offer-pag-dot");
    let currentOfferIndex = 0;
    let offerInterval;

    const showOffer = (index) => {
        if (offerSlides.length === 0) return;
        offerSlides.forEach(slide => slide.classList.remove("active"));
        offerPagDots.forEach(dot => dot.classList.remove("active"));

        currentOfferIndex = (index + offerSlides.length) % offerSlides.length;

        offerSlides[currentOfferIndex].classList.add("active");
        if (offerPagDots[currentOfferIndex]) {
            offerPagDots[currentOfferIndex].classList.add("active");
        }
    };

    const nextOffer = () => {
        showOffer(currentOfferIndex + 1);
    };

    const prevOffer = () => {
        showOffer(currentOfferIndex - 1);
    };

    const startOfferRotation = () => {
        stopOfferRotation();
        offerInterval = setInterval(nextOffer, 4000);
    };

    const stopOfferRotation = () => {
        if (offerInterval) clearInterval(offerInterval);
    };

    if (offerNextBtn) {
        offerNextBtn.addEventListener("click", () => {
            nextOffer();
            startOfferRotation(); // Reset timer on manual click
        });
    }

    if (offerPrevBtn) {
        offerPrevBtn.addEventListener("click", () => {
            prevOffer();
            startOfferRotation(); // Reset timer on manual click
        });
    }

    offerPagDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showOffer(index);
            startOfferRotation(); // Reset timer on manual click
        });
    });

    // Pause auto slide on hover
    const offersContainer = document.querySelector(".offers-slider-container");
    if (offersContainer) {
        offersContainer.addEventListener("mouseenter", stopOfferRotation);
        offersContainer.addEventListener("mouseleave", startOfferRotation);
    }

    // Start sliding
    if (offerSlides.length > 0) {
        startOfferRotation();
    }

    // ----------------------------------------------------------------------
    // 10. FOOD CATEGORIES SCROLL & OVERLAY EFFECTS (PHASE 2)
    // ----------------------------------------------------------------------
    const categoriesTrack = document.getElementById("categoriesTrack");
    const catLeftBtn = document.getElementById("catLeftBtn");
    const catRightBtn = document.getElementById("catRightBtn");
    const fadeLeft = document.querySelector(".fade-overlay-left");
    const fadeRight = document.querySelector(".fade-overlay-right");

    const updateCategoryFades = () => {
        if (!categoriesTrack) return;
        const scrollLeft = categoriesTrack.scrollLeft;
        const maxScrollLeft = categoriesTrack.scrollWidth - categoriesTrack.clientWidth;

        if (fadeLeft) {
            fadeLeft.style.opacity = scrollLeft > 10 ? "1" : "0";
            fadeLeft.style.pointerEvents = scrollLeft > 10 ? "auto" : "none";
        }
        if (fadeRight) {
            fadeRight.style.opacity = scrollLeft < maxScrollLeft - 10 ? "1" : "0";
            fadeRight.style.pointerEvents = scrollLeft < maxScrollLeft - 10 ? "auto" : "none";
        }

        // Disable/dim category arrows at bounds
        if (catLeftBtn) {
            if (scrollLeft <= 5) {
                catLeftBtn.style.opacity = "0.35";
                catLeftBtn.style.pointerEvents = "none";
            } else {
                catLeftBtn.style.opacity = "1";
                catLeftBtn.style.pointerEvents = "auto";
            }
        }
        if (catRightBtn) {
            if (scrollLeft >= maxScrollLeft - 5) {
                catRightBtn.style.opacity = "0.35";
                catRightBtn.style.pointerEvents = "none";
            } else {
                catRightBtn.style.opacity = "1";
                catRightBtn.style.pointerEvents = "auto";
            }
        }
    };

    if (categoriesTrack) {
        categoriesTrack.addEventListener("scroll", updateCategoryFades);
        window.addEventListener("resize", updateCategoryFades);

        // Initial fade state check
        setTimeout(updateCategoryFades, 300);
    }

    if (catLeftBtn && categoriesTrack) {
        catLeftBtn.addEventListener("click", () => {
            const scrollAmount = categoriesTrack.clientWidth * 0.6;
            categoriesTrack.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
    }

    if (catRightBtn && categoriesTrack) {
        catRightBtn.addEventListener("click", () => {
            const scrollAmount = categoriesTrack.clientWidth * 0.6;
            categoriesTrack.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    }

    // Mobile Swipe / Drag to Scroll Support
    let isDown = false;
    let startX;
    let scrollLeftState;

    if (categoriesTrack) {
        categoriesTrack.addEventListener("mousedown", (e) => {
            isDown = true;
            categoriesTrack.style.cursor = "grabbing";
            startX = e.pageX - categoriesTrack.offsetLeft;
            scrollLeftState = categoriesTrack.scrollLeft;
        });

        categoriesTrack.addEventListener("mouseleave", () => {
            isDown = false;
            categoriesTrack.style.cursor = "";
        });

        categoriesTrack.addEventListener("mouseup", () => {
            isDown = false;
            categoriesTrack.style.cursor = "";
        });

        categoriesTrack.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - categoriesTrack.offsetLeft;
            const walk = (x - startX) * 1.5; // scroll speed multiplier
            categoriesTrack.scrollLeft = scrollLeftState - walk;
        });
    }

    // ----------------------------------------------------------------------
    // 11. SCROLL REVEAL OBSERVER (PHASE 2 & GENERAL)
    // ----------------------------------------------------------------------
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal");

    // Prep stagger containers and elements before observing
    scrollRevealElements.forEach(el => {
        const cards = el.querySelectorAll('.stat-card, .category-item, .restaurant-card, .dish-card, .step-card, .testimonial-card, .category-card-item, .restaurant-card-item, .dish-card-item, .feature-item, .partner-float-card, .floating-ui-card');
        if (cards.length > 0) {
            el.classList.add("stagger-parent");
            cards.forEach(card => {
                card.style.opacity = "0";
                card.style.transform = "translateY(25px)";
                card.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            });
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                if (entry.target.classList.contains("stagger-parent")) {
                    const cards = entry.target.querySelectorAll('.stat-card, .category-item, .restaurant-card, .dish-card, .step-card, .testimonial-card, .category-card-item, .restaurant-card-item, .dish-card-item, .feature-item, .partner-float-card, .floating-ui-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";
                        }, index * 75);
                    });
                }
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px"
    });

    scrollRevealElements.forEach(el => revealObserver.observe(el));


    // ----------------------------------------------------------------------
    // 12. FAVORITES TOGGLING & VIEW MENU MICRO-INTERACTIONS (PHASE 3)
    // ----------------------------------------------------------------------
    const favoriteBtns = document.querySelectorAll(".card-favorite-btn");
    const viewMenuBtns = document.querySelectorAll(".view-menu-action-btn");

    favoriteBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            btn.classList.toggle("active");
            const icon = btn.querySelector("i");

            if (btn.classList.contains("active")) {
                icon.className = "fa-solid fa-heart";
                // Bounce effect on activation
                btn.style.transform = "scale(1.2)";
                setTimeout(() => { btn.style.transform = ""; }, 200);
            } else {
                icon.className = "fa-regular fa-heart";
                btn.style.transform = "scale(0.9)";
                setTimeout(() => { btn.style.transform = ""; }, 200);
            }
        });
    });

    viewMenuBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const originalContent = btn.innerHTML;
            const restaurantName = btn.closest(".restaurant-card-item").querySelector(".restaurant-name-title").textContent;

            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Opening Menu...`;
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.8";

            setTimeout(() => {
                btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Menu Loaded`;
                btn.style.borderColor = "#06D6A0";
                btn.style.color = "#06D6A0";

                // Show a modern notification/alert
                const notification = document.createElement("div");
                notification.style.position = "fixed";
                notification.style.bottom = "30px";
                notification.style.right = "30px";
                notification.style.background = "rgba(26, 26, 26, 0.95)";
                notification.style.color = "white";
                notification.style.padding = "16px 24px";
                notification.style.borderRadius = "14px";
                notification.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
                notification.style.zIndex = "3000";
                notification.style.fontFamily = "Inter, sans-serif";
                notification.style.fontSize = "0.9rem";
                notification.style.fontWeight = "600";
                notification.style.display = "flex";
                notification.style.alignItems = "center";
                notification.style.gap = "10px";
                notification.style.transform = "translateY(100px)";
                notification.style.opacity = "0";
                notification.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

                notification.innerHTML = `<i class="fa-solid fa-utensils" style="color: #F4B400;"></i> Welcome to ${restaurantName}! Opening digital menu...`;

                document.body.appendChild(notification);

                // Trigger transition
                setTimeout(() => {
                    notification.style.transform = "translateY(0)";
                    notification.style.opacity = "1";
                }, 100);

                // Remove notification
                setTimeout(() => {
                    notification.style.transform = "translateY(100px)";
                    notification.style.opacity = "0";
                    setTimeout(() => {
                        notification.remove();
                    }, 500);

                    // Reset button
                    btn.innerHTML = originalContent;
                    btn.style.pointerEvents = "";
                    btn.style.opacity = "";
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }, 3000);

            }, 1000);
        });
    });

    // ----------------------------------------------------------------------
    // 13. RECOMMENDED DISHES INTERACTIVE INTERACTIONS (PHASE 4)
    // ----------------------------------------------------------------------
    const wishlistBtns = document.querySelectorAll(".dish-wishlist-btn");
    const cartWrappers = document.querySelectorAll(".cart-action-wrapper");
    const quickViewBtns = document.querySelectorAll(".quick-view-btn");

    // Wishlist Toggle
    wishlistBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.classList.toggle("active");
            const icon = btn.querySelector("i");
            if (btn.classList.contains("active")) {
                icon.className = "fa-solid fa-heart";
                btn.style.transform = "scale(1.2)";
                setTimeout(() => { btn.style.transform = ""; }, 200);
            } else {
                icon.className = "fa-regular fa-heart";
                btn.style.transform = "scale(0.9)";
                setTimeout(() => { btn.style.transform = ""; }, 200);
            }
        });
    });

    // ----------------------------------------------------------------------
    // GLOBAL CART STATE MANAGEMENT (PHASE 6)
    // ----------------------------------------------------------------------
    let cart = [];
    let appliedCoupon = null;
    let discountAmount = 0;
    let deliveryFee = 40;

    const animateCartBounce = () => {
        const floatingCart = document.querySelector(".floating-cart-card");
        const mobileBar = document.querySelector(".mobile-sticky-cart-bar");
        const navBadge = document.querySelector(".nav-btn-icon .badge-secondary, .drawer-nav-item .nav-badge.sec");

        [floatingCart, mobileBar, navBadge].forEach(el => {
            if (el) {
                el.classList.add("cart-bounce-animation");
                setTimeout(() => el.classList.remove("cart-bounce-animation"), 300);
            }
        });
    };

    const updateCartUI = () => {
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            totalItems += item.qty;
            subtotal += item.price * item.qty;
        });

        // 1. Re-calculate Coupon Discounts dynamically based on active coupon
        if (appliedCoupon === "PLATTER50") {
            discountAmount = Math.round(subtotal * 0.5);
            deliveryFee = 40;
        } else if (appliedCoupon === "SAVE100") {
            discountAmount = Math.min(subtotal, 100);
            deliveryFee = 40;
        } else if (appliedCoupon === "FREEDEL") {
            discountAmount = 0;
            deliveryFee = 0;
        } else {
            discountAmount = 0;
            deliveryFee = 40;
        }

        const savings = discountAmount + (deliveryFee === 0 ? 40 : 0);
        const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

        // 2. Sync Global Navigation count badges on page
        document.querySelectorAll(".badge-secondary, .nav-badge.sec").forEach(badge => {
            badge.textContent = totalItems;
        });

        // 3. Update Floating Cart Card (Desktop/Tablet)
        const floatingCart = document.querySelector(".floating-cart-card");
        if (floatingCart) {
            const badge = floatingCart.querySelector(".floating-cart-badge");
            const summary = floatingCart.querySelector(".floating-cart-summary");
            const previewList = floatingCart.querySelector(".floating-cart-items-preview");
            const subtotalVal = floatingCart.querySelector(".subtotal-val");

            if (badge) badge.textContent = totalItems;
            if (summary) summary.textContent = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'} Added`;
            if (subtotalVal) subtotalVal.textContent = `₹${subtotal}`;

            if (previewList) {
                previewList.innerHTML = "";
                // Render top 3 preview items
                cart.slice(0, 3).forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = `${item.name} x ${item.qty}`;
                    previewList.appendChild(li);
                });
                if (cart.length > 3) {
                    const li = document.createElement("li");
                    li.textContent = `+ ${cart.length - 3} more...`;
                    previewList.appendChild(li);
                }
            }

            const isClosed = localStorage.getItem("floatingCartClosed") === "true";
            floatingCart.classList.toggle("active", totalItems > 0 && !isClosed);
        }

        // 4. Update Mobile Sticky Cart Bar
        const mobileBar = document.querySelector(".mobile-sticky-cart-bar");
        if (mobileBar) {
            const count = mobileBar.querySelector(".mobile-cart-count");
            const price = mobileBar.querySelector(".mobile-cart-price");

            if (count) count.textContent = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;
            if (price) price.textContent = `₹${subtotal}`;

            mobileBar.classList.toggle("active", totalItems > 0);
        }

        // 5. Update Side Drawer content elements
        const drawerBody = document.querySelector(".cart-drawer-content .drawer-body");
        if (drawerBody) {
            const emptyState = drawerBody.querySelector(".drawer-empty-state");
            const itemsList = drawerBody.querySelector(".drawer-items-list");

            const listContainer = drawerBody.querySelector(".drawer-items-list-container");
            const couponSec = drawerBody.querySelector(".coupon-section");
            const summaryCard = drawerBody.querySelector(".price-summary-card");
            const drawerFooter = document.querySelector(".cart-drawer-content .drawer-footer");

            if (totalItems === 0) {
                if (emptyState) emptyState.style.display = "flex";
                if (listContainer) listContainer.style.display = "none";
                if (couponSec) couponSec.style.display = "none";
                if (summaryCard) summaryCard.style.display = "none";
                if (drawerFooter) drawerFooter.style.display = "none";
            } else {
                if (emptyState) emptyState.style.display = "none";
                if (listContainer) listContainer.style.display = "flex";
                if (couponSec) couponSec.style.display = "flex";
                if (summaryCard) summaryCard.style.display = "flex";
                if (drawerFooter) drawerFooter.style.display = "flex";

                // Render item rows
                if (itemsList) {
                    itemsList.innerHTML = "";
                    cart.forEach(item => {
                        const row = document.createElement("div");
                        row.className = "drawer-item-row";
                        row.innerHTML = `
                            <img src="${item.img}" alt="${item.name}" class="drawer-item-img">
                            <div class="drawer-item-text">
                                <span class="drawer-item-name">${item.name}</span>
                                <span class="drawer-item-restaurant">${item.restaurant}</span>
                                <span class="drawer-item-price">₹${item.price}</span>
                            </div>
                            <div class="drawer-item-actions">
                                <div class="qty-selector-wrapper active" style="position: static; opacity: 1; visibility: visible; transform: scale(1); width: auto; height: 32px; padding: 0 6px; gap: 8px;">
                                    <button class="qty-btn drawer-qty-minus" data-name="${item.name}"><i class="fa-solid fa-minus"></i></button>
                                    <span class="qty-number-display">${item.qty}</span>
                                    <button class="qty-btn drawer-qty-plus" data-name="${item.name}"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        `;
                        itemsList.appendChild(row);
                    });

                    // Bind quantity selectors inside the drawer
                    itemsList.querySelectorAll(".drawer-qty-minus").forEach(btn => {
                        btn.addEventListener("click", () => {
                            const name = btn.getAttribute("data-name");
                            updateCartItemQuantity(name, -1);
                        });
                    });

                    itemsList.querySelectorAll(".drawer-qty-plus").forEach(btn => {
                        btn.addEventListener("click", () => {
                            const name = btn.getAttribute("data-name");
                            updateCartItemQuantity(name, 1);
                            animateCartBounce();
                        });
                    });
                }

                // Update bill breakdowns
                const summarySubtotal = document.getElementById("summary-subtotal");
                const discountRow = document.querySelector(".discount-row");
                const summaryDiscount = document.getElementById("summary-discount");
                const summaryDelivery = document.getElementById("summary-delivery");
                const summarySavings = document.getElementById("summary-savings");
                const summaryTotal = document.getElementById("summary-total");

                if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal}`;

                if (discountRow) {
                    if (discountAmount > 0) {
                        discountRow.style.display = "flex";
                        if (summaryDiscount) summaryDiscount.textContent = `-₹${discountAmount}`;
                    } else {
                        discountRow.style.display = "none";
                    }
                }

                if (summaryDelivery) summaryDelivery.textContent = `₹${deliveryFee}`;
                if (summarySavings) summarySavings.textContent = `₹${savings}`;
                if (summaryTotal) summaryTotal.textContent = `₹${totalAmount}`;
            }
        }

        // 6. Synchronize main recommended dishes card quantities UI
        const dishCardItems = document.querySelectorAll(".dish-card-item");
        dishCardItems.forEach(card => {
            const cardName = card.querySelector(".dish-name-title").textContent.trim();
            const actionWrapper = card.querySelector(".cart-action-wrapper");
            const display = card.querySelector(".qty-number-display");

            const cartItem = cart.find(item => item.name === cardName);

            if (actionWrapper && display) {
                if (cartItem && cartItem.qty > 0) {
                    actionWrapper.classList.add("active");
                    display.textContent = cartItem.qty;
                } else {
                    actionWrapper.classList.remove("active");
                    display.textContent = "1";
                }
            }
        });
    };

    const updateCartItemQuantity = (name, change, cardData = null) => {
        const itemIndex = cart.findIndex(item => item.name === name);

        if (change > 0) {
            localStorage.removeItem("floatingCartClosed");
        }

        if (itemIndex > -1) {
            cart[itemIndex].qty += change;
            if (cart[itemIndex].qty <= 0) {
                cart.splice(itemIndex, 1);
            }
        } else if (change > 0 && cardData) {
            cart.push({
                id: "dish-" + name.toLowerCase().replace(/\s+/g, "-"),
                name: name,
                restaurant: cardData.restaurant,
                price: cardData.price,
                qty: 1,
                img: cardData.img
            });
        }

        updateCartUI();
    };

    // Card Add to Cart listeners
    const recommendedDishCards = document.querySelectorAll(".dish-card-item");
    recommendedDishCards.forEach(card => {
        const addBtn = card.querySelector(".add-to-cart-btn");
        const minusBtn = card.querySelector(".qty-minus-btn");
        const plusBtn = card.querySelector(".qty-plus-btn");
        const name = card.querySelector(".dish-name-title").textContent.trim();
        const restaurant = card.querySelector(".dish-restaurant-name").textContent.trim();
        const price = parseInt(card.querySelector(".dish-price-tag").textContent.replace("₹", "").trim());
        const img = card.querySelector(".dish-cover-img").getAttribute("src");

        const cardData = { restaurant, price, img };

        if (addBtn) {
            addBtn.addEventListener("click", () => {
                updateCartItemQuantity(name, 1, cardData);
                animateCartBounce();
            });
        }

        if (minusBtn) {
            minusBtn.addEventListener("click", () => {
                updateCartItemQuantity(name, -1);
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener("click", () => {
                updateCartItemQuantity(name, 1);
                animateCartBounce();
            });
        }
    });

    // ----------------------------------------------------------------------
    // SIDE CHECKOUT DRAWER INTERACTIONS
    // ----------------------------------------------------------------------
    const cartDrawerOverlay = document.querySelector(".cart-drawer-overlay");
    const drawerContent = document.querySelector(".cart-drawer-content");
    const drawerCloseBtn = document.querySelector(".drawer-close-btn");

    const openCartDrawer = () => {
        if (cartDrawerOverlay && drawerContent) {
            cartDrawerOverlay.classList.add("active");
            drawerContent.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    const closeCartDrawer = () => {
        if (cartDrawerOverlay && drawerContent) {
            cartDrawerOverlay.classList.remove("active");
            drawerContent.classList.remove("active");
            document.body.style.overflow = "";

            // Hide success checkout screen if open
            const successScreen = document.querySelector(".checkout-success-screen");
            if (successScreen) successScreen.classList.remove("active");
        }
    };

    // Bind triggers to open drawer
    document.querySelectorAll(".view-cart-btn-desktop, .mobile-view-cart-btn, .checkout-btn-desktop, .floating-cart-header, .mobile-cart-bar-left").forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCartDrawer();
        });
    });

    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeCartDrawer);
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener("click", closeCartDrawer);

    // Bind floating cart close button
    const closeFloatingCartBtn = document.querySelector(".close-floating-cart-btn");
    if (closeFloatingCartBtn) {
        closeFloatingCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            localStorage.setItem("floatingCartClosed", "true");
            const floatingCart = document.querySelector(".floating-cart-card");
            if (floatingCart) {
                floatingCart.classList.remove("active");
            }
        });
    }

    // ----------------------------------------------------------------------
    // COUPON SECTION LOGIC
    // ----------------------------------------------------------------------
    const applyCoupon = (code) => {
        const cleanedCode = code.trim().toUpperCase();
        const statusMsg = document.querySelector(".coupon-status-message");
        const couponInput = document.getElementById("coupon-code-input");

        // Clear active chip states
        document.querySelectorAll(".coupon-chip").forEach(chip => {
            chip.classList.toggle("active", chip.getAttribute("data-code") === cleanedCode);
        });

        let subtotal = 0;
        cart.forEach(item => subtotal += item.price * item.qty);

        if (cleanedCode === "PLATTER50") {
            appliedCoupon = "PLATTER50";
            discountAmount = Math.round(subtotal * 0.5);
            deliveryFee = 40;
            statusMsg.textContent = `Coupon applied! 50% discount of ₹${discountAmount} subtracted.`;
            statusMsg.className = "coupon-status-message success";
            if (couponInput) couponInput.value = "PLATTER50";
        } else if (cleanedCode === "SAVE100") {
            appliedCoupon = "SAVE100";
            discountAmount = Math.min(subtotal, 100);
            deliveryFee = 40;
            statusMsg.textContent = `Coupon applied! Discount of ₹${discountAmount} subtracted.`;
            statusMsg.className = "coupon-status-message success";
            if (couponInput) couponInput.value = "SAVE100";
        } else if (cleanedCode === "FREEDEL") {
            appliedCoupon = "FREEDEL";
            discountAmount = 0;
            deliveryFee = 0;
            statusMsg.textContent = "Coupon applied! Delivery fee waived.";
            statusMsg.className = "coupon-status-message success";
            if (couponInput) couponInput.value = "FREEDEL";
        } else {
            appliedCoupon = null;
            discountAmount = 0;
            deliveryFee = 40;
            statusMsg.textContent = "Invalid coupon code.";
            statusMsg.className = "coupon-status-message error";
            document.querySelectorAll(".coupon-chip").forEach(chip => chip.classList.remove("active"));
        }

        updateCartUI();
    };

    // Bind Coupon click chips
    document.querySelectorAll(".coupon-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const code = chip.getAttribute("data-code");
            applyCoupon(code);
        });
    });

    // Bind Manual Coupon Input Button
    const applyBtn = document.getElementById("apply-coupon-btn");
    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            const input = document.getElementById("coupon-code-input");
            if (input) applyCoupon(input.value);
        });
    }

    // ----------------------------------------------------------------------
    // PROCEED TO CHECKOUT & SUCCESS STATE
    // ----------------------------------------------------------------------
    const checkoutActionBtn = document.querySelector(".checkout-action-btn");
    const successScreen = document.querySelector(".checkout-success-screen");
    const successCloseBtn = document.querySelector(".success-close-btn");

    if (checkoutActionBtn) {
        checkoutActionBtn.addEventListener("click", () => {
            if (successScreen) {
                successScreen.classList.add("active");
                // Clear cart state
                cart = [];
                appliedCoupon = null;
                discountAmount = 0;
                deliveryFee = 40;

                const couponInput = document.getElementById("coupon-code-input");
                if (couponInput) couponInput.value = "";
                const statusMsg = document.querySelector(".coupon-status-message");
                if (statusMsg) statusMsg.textContent = "";
                document.querySelectorAll(".coupon-chip").forEach(chip => chip.classList.remove("active"));
                updateCartUI();
            }
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener("click", () => {
            closeCartDrawer();
        });
    }

    const browseDishesBtn = document.querySelector(".browse-dishes-btn");
    if (browseDishesBtn) {
        browseDishesBtn.addEventListener("click", () => {
            closeCartDrawer();
            const recommendedSec = document.querySelector(".dishes-section");
            if (recommendedSec) {
                recommendedSec.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Initialize UI on load
    updateCartUI();


    // Quick View Dialog
    quickViewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".dish-card-item");
            const name = card.querySelector(".dish-name-title").textContent;
            const price = card.querySelector(".dish-price-tag").textContent;
            const desc = card.querySelector(".dish-short-desc").textContent;
            const rest = card.querySelector(".dish-restaurant-name").textContent;

            // Build modal container
            const modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.background = "rgba(0, 0, 0, 0.4)";
            modal.style.backdropFilter = "blur(8px)";
            modal.style.webkitBackdropFilter = "blur(8px)";
            modal.style.display = "flex";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            modal.style.zIndex = "4000";
            modal.style.opacity = "0";
            modal.style.transition = "opacity 0.3s ease";

            modal.innerHTML = `
                <div class="quick-modal-content" style="background: var(--surface); border-radius: 24px; padding: 32px; width: 90%; max-width: 500px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 1px solid var(--border); transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; font-family: 'Inter', sans-serif;">
                    <button class="modal-close-btn" style="position: absolute; top: 20px; right: 20px; border: none; background: var(--border); width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: var(--text);"><i class="fa-solid fa-xmark"></i></button>
                    <span style="color: var(--secondary); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">${rest}</span>
                    <h3 style="font-size: 1.6rem; font-weight: 900; margin-bottom: 12px; color: var(--text);">${name}</h3>
                    <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">${desc}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 20px;">
                        <span style="font-size: 1.4rem; font-weight: 900; color: var(--text);">${price}</span>
                        <button class="modal-add-btn" style="background: var(--brand-gradient); color: white; border: none; border-radius: 12px; padding: 12px 28px; font-weight: 800; cursor: pointer; box-shadow: 0 6px 15px rgba(244,180,0,0.25);">Add To Cart</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Trigger animation
            setTimeout(() => {
                modal.style.opacity = "1";
                modal.querySelector(".quick-modal-content").style.transform = "translateY(0)";
            }, 50);

            // Close listeners
            const closeModal = () => {
                modal.style.opacity = "0";
                modal.querySelector(".quick-modal-content").style.transform = "translateY(20px)";
                setTimeout(() => { modal.remove(); }, 300);
            };

            modal.querySelector(".modal-close-btn").addEventListener("click", closeModal);
            modal.addEventListener("click", (e) => {
                if (e.target === modal) closeModal();
            });

            // Modal Add Button
            modal.querySelector(".modal-add-btn").addEventListener("click", () => {
                // Find corresponding card and trigger click
                const addInCard = card.querySelector(".add-to-cart-btn");
                if (addInCard) addInCard.click();
                closeModal();
            });
        });
    });

    // ----------------------------------------------------------------------
    // 14. TRENDING NEAR YOU SLIDER CONTROLLER (PHASE 5)
    // ----------------------------------------------------------------------
    const trendingWrapper = document.querySelector(".trending-slider-wrapper");
    if (trendingWrapper) {
        const track = trendingWrapper.querySelector(".trending-slider-track");
        const cards = trendingWrapper.querySelectorAll(".trending-card-item");
        const prevBtn = trendingWrapper.querySelector(".prev-btn");
        const nextBtn = trendingWrapper.querySelector(".next-btn");
        const dotsContainer = document.querySelector(".trending-dots-container");

        let currentIndex = 0;
        let autoSlideInterval = null;
        let visibleCards = 4;
        let maxIndex = cards.length - visibleCards;

        // Calculate layout variables
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width <= 576) {
                visibleCards = 1;
            } else if (width <= 992) {
                visibleCards = 2;
            } else {
                visibleCards = 4;
            }
            maxIndex = Math.max(0, cards.length - visibleCards);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            buildPaginationDots();
            moveSlider();
        };

        // Create pagination dots dynamically
        const buildPaginationDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = "";
            const totalDots = maxIndex + 1;
            if (totalDots <= 1) return; // No need for dots if all cards fit

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement("div");
                dot.className = `trending-dot${i === currentIndex ? " active" : ""}`;
                dot.setAttribute("data-slide-index", i);
                dot.addEventListener("click", () => {
                    currentIndex = i;
                    moveSlider();
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        };

        // Move slider track
        const moveSlider = () => {
            if (!cards.length) return;
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const translateOffset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${translateOffset}px)`;

            // Update disabled status of nav buttons
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

            // Update active dot
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".trending-dot");
                dots.forEach((dot, index) => {
                    dot.classList.toggle("active", index === currentIndex);
                });
            }
        };

        // Prev slide action
        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    moveSlider();
                    resetAutoSlide();
                }
            });
        }

        // Next slide action
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    moveSlider();
                    resetAutoSlide();
                } else {
                    currentIndex = 0; // Wrap around
                    moveSlider();
                    resetAutoSlide();
                }
            });
        }

        // Auto slide function
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                moveSlider();
            }, 5000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        };

        const resetAutoSlide = () => {
            stopAutoSlide();
            startAutoSlide();
        };

        // Pause auto-play on hover
        trendingWrapper.addEventListener("mouseenter", stopAutoSlide);
        trendingWrapper.addEventListener("mouseleave", startAutoSlide);

        // Mobile touch swipe support
        let startX = 0;
        let isSwiping = false;

        track.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoSlide();
        }, { passive: true });

        track.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            if (Math.abs(diffX) > 50) { // Threshold
                if (diffX > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                    moveSlider();
                    isSwiping = false;
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                    moveSlider();
                    isSwiping = false;
                }
            }
        }, { passive: true });

        track.addEventListener("touchend", () => {
            isSwiping = false;
            startAutoSlide();
        });

        // Initialize slider calculations and scheduling
        window.addEventListener("resize", updateDimensions);
        updateDimensions();
        startAutoSlide();
    }

    // ----------------------------------------------------------------------
    // 15. NEWSLETTER SUBSCRIPTION FORM SUBMISSION (PHASE 8)
    // ----------------------------------------------------------------------
    const newsletterForm = document.getElementById("footer-newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector(".newsletter-input");
            const submitBtn = newsletterForm.querySelector(".newsletter-btn");
            const statusMsg = newsletterForm.querySelector(".newsletter-status-message");
            
            if (!emailInput || !submitBtn || !statusMsg) return;
            
            const emailValue = emailInput.value.trim();
            
            // Basic regex validation check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                statusMsg.textContent = "Please enter a valid email address.";
                statusMsg.className = "newsletter-status-message error active";
                return;
            }
            
            // Set loading state
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Subscribing...</span>`;
            submitBtn.disabled = true;
            emailInput.disabled = true;
            
            statusMsg.className = "newsletter-status-message"; // Reset
            
            // Simulate server network delay
            setTimeout(() => {
                // Success action
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Subscribed!</span>`;
                submitBtn.style.background = "#06D6A0";
                submitBtn.style.color = "#FFFFFF";
                
                statusMsg.textContent = "Success! You have been subscribed to Platter's exclusive deals.";
                statusMsg.className = "newsletter-status-message success active";
                emailInput.value = "";
                
                // Clear state after 4 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    emailInput.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                    submitBtn.style.background = "";
                    submitBtn.style.color = "";
                    
                    statusMsg.className = "newsletter-status-message";
                    statusMsg.textContent = "";
                }, 4000);
                
            }, 1200);
        });
    }
});


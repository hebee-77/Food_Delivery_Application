/* ==========================================================================
   PLATTER MODAL SYSTEM — JavaScript
   Handles: open, close, outside-click, tab-switch, form validation
   ========================================================================== */

(function () {
    "use strict";

    /* ------------------------------------------------------------------ */
    /*  Overlay & Card references                                           */
    /* ------------------------------------------------------------------ */
    const loginOverlay = document.getElementById("login-modal");
    const signupOverlay = document.getElementById("signup-modal");

    if (!loginOverlay || !signupOverlay) return;   // not on landing page

    /* ------------------------------------------------------------------ */
    /*  Open / Close helpers                                                */
    /* ------------------------------------------------------------------ */

    function openModal(overlay) {
        overlay.classList.add("modal-active");
        document.body.style.overflow = "hidden";
        // Focus first input after animation
        setTimeout(() => {
            const firstInput = overlay.querySelector("input");
            if (firstInput) firstInput.focus();
        }, 420);
    }

    function closeModal(overlay) {
        overlay.classList.remove("modal-active");
        document.body.style.overflow = "";
    }

    function closeAll() {
        closeModal(loginOverlay);
        closeModal(signupOverlay);
    }

    /* ------------------------------------------------------------------ */
    /*  Trigger buttons (navbar + mobile menu)                             */
    /* ------------------------------------------------------------------ */

    document.querySelectorAll("[data-modal='login']").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            closeModal(signupOverlay);
            openModal(loginOverlay);
        });
    });

    document.querySelectorAll("[data-modal='signup']").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            closeModal(loginOverlay);
            openModal(signupOverlay);
        });
    });

    /* ------------------------------------------------------------------ */
    /*  Close buttons (× inside card)                                      */
    /* ------------------------------------------------------------------ */

    loginOverlay.querySelector(".modal-close-btn")
        .addEventListener("click", () => closeModal(loginOverlay));

    signupOverlay.querySelector(".modal-close-btn")
        .addEventListener("click", () => closeModal(signupOverlay));

    /* ------------------------------------------------------------------ */
    /*  Click OUTSIDE the card → close                                     */
    /* ------------------------------------------------------------------ */

    [loginOverlay, signupOverlay].forEach(overlay => {
        overlay.addEventListener("click", e => {
            if (e.target === overlay) closeModal(overlay);
        });
    });

    /* ------------------------------------------------------------------ */
    /*  Escape key → close                                                  */
    /* ------------------------------------------------------------------ */

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeAll();
    });

    /* ------------------------------------------------------------------ */
    /*  Switch links (Login ↔ Signup inside modals)                        */
    /* ------------------------------------------------------------------ */

    document.getElementById("switch-to-signup")
        .addEventListener("click", e => {
            e.preventDefault();
            closeModal(loginOverlay);
            openModal(signupOverlay);
        });

    document.getElementById("switch-to-login")
        .addEventListener("click", e => {
            e.preventDefault();
            closeModal(signupOverlay);
            openModal(loginOverlay);
        });

    /* ================================================================== */
    /*  LOGIN FORM LOGIC                                                    */
    /* ================================================================== */

    const loginForm = document.getElementById("modal-login-form");
    const loginEmail = document.getElementById("modal-login-email");
    const loginPassword = document.getElementById("modal-login-password");
    const loginToggleBtn = document.getElementById("modal-login-toggle-pwd");
    const loginAlertBox = document.getElementById("modal-login-alert");

    // Toggle password visibility
    if (loginToggleBtn && loginPassword) {
        loginToggleBtn.addEventListener("click", () => {
            const isHidden = loginPassword.type === "password";
            loginPassword.type = isHidden ? "text" : "password";
            const icon = loginToggleBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-eye", !isHidden);
                icon.classList.toggle("fa-eye-slash", isHidden);
            }
        });
    }

    function showLoginAlert(msg, type = "error") {
        if (!loginAlertBox) return;
        loginAlertBox.textContent = msg;
        loginAlertBox.className = `modal-alert-box ${type}`;
        loginAlertBox.classList.remove("modal-hidden");
    }

    function hideLoginAlert() {
        if (!loginAlertBox) return;
        loginAlertBox.classList.add("modal-hidden");
        loginAlertBox.textContent = "";
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            hideLoginAlert();

            const email = loginEmail.value.trim();
            const pwd = loginPassword.value;

            if (!email) {
                showLoginAlert("Please enter your email address.");
                loginEmail.focus();
                return;
            }
            if (!isValidEmail(email)) {
                showLoginAlert("Please enter a valid email address.");
                loginEmail.focus();
                return;
            }
            if (!pwd) {
                showLoginAlert("Please enter your password.");
                loginPassword.focus();
                return;
            }
            if (pwd.length < 6) {
                showLoginAlert("Password must be at least 6 characters long.");
                loginPassword.focus();
                return;
            }

            // Simulate success
            showLoginAlert("Login successful! Redirecting…", "success");
            const submitBtn = loginForm.querySelector(".modal-submit-btn");
            if (submitBtn) {
                submitBtn.disabled = true;
                const span = submitBtn.querySelector("span");
                if (span) span.textContent = "Signing In…";
            }
            loginEmail.disabled = true;
            loginPassword.disabled = true;

            setTimeout(() => {
                window.location.href = "home.html";
            }, 1800);
        });
    }

    // Google login
    const loginGoogleBtn = loginForm ? loginForm.querySelector(".modal-google-btn") : null;
    if (loginGoogleBtn) {
        loginGoogleBtn.addEventListener("click", () => {
            showLoginAlert("Connecting with Google…", "success");
            setTimeout(() => { window.location.href = "home.html"; }, 1200);
        });
    }

    /* ================================================================== */
    /*  SIGNUP FORM LOGIC  (Simple: name + email + terms)                  */
    /* ================================================================== */

    const signupForm = document.getElementById("modal-signup-form");
    const signupName = document.getElementById("modal-signup-name");
    const signupEmail = document.getElementById("modal-signup-email");
    const signupPassword = document.getElementById("modal-signup-password");
    const signupToggleBtn = document.getElementById("modal-signup-toggle-pwd");
    const signupAlertBox = document.getElementById("modal-signup-alert");
    const signupTermsChk = document.getElementById("modal-agree-terms");
    const signupCreateBtn = document.getElementById("signup-create-btn");

    // Toggle signup password visibility
    if (signupToggleBtn && signupPassword) {
        signupToggleBtn.addEventListener("click", () => {
            const isHidden = signupPassword.type === "password";
            signupPassword.type = isHidden ? "text" : "password";
            const icon = signupToggleBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-eye", !isHidden);
                icon.classList.toggle("fa-eye-slash", isHidden);
            }
        });
    }

    // Enable/disable "Create account" button based on terms checkbox
    if (signupTermsChk && signupCreateBtn) {
        signupTermsChk.addEventListener("change", () => {
            signupCreateBtn.disabled = !signupTermsChk.checked;
        });
    }

    function showSignupAlert(msg, type = "error") {
        if (!signupAlertBox) return;
        signupAlertBox.textContent = msg;
        signupAlertBox.className = `modal-alert-box ${type}`;
        signupAlertBox.classList.remove("modal-hidden");
    }

    function hideSignupAlert() {
        if (!signupAlertBox) return;
        signupAlertBox.classList.add("modal-hidden");
        signupAlertBox.textContent = "";
    }

    if (signupForm) {
        signupForm.addEventListener("submit", e => {
            e.preventDefault();
            hideSignupAlert();

            const name = signupName ? signupName.value.trim() : "";
            const email = signupEmail ? signupEmail.value.trim() : "";
            const pwd = signupPassword ? signupPassword.value : "";

            if (!name) { showSignupAlert("Please enter your full name."); if (signupName) signupName.focus(); return; }
            if (name.length < 2) { showSignupAlert("Full name must be at least 2 characters."); if (signupName) signupName.focus(); return; }
            if (!email) { showSignupAlert("Please enter your email address."); if (signupEmail) signupEmail.focus(); return; }
            if (!isValidEmail(email)) { showSignupAlert("Please enter a valid email address."); if (signupEmail) signupEmail.focus(); return; }
            if (!pwd) { showSignupAlert("Please enter a password."); if (signupPassword) signupPassword.focus(); return; }
            if (pwd.length < 6) { showSignupAlert("Password must be at least 6 characters long."); if (signupPassword) signupPassword.focus(); return; }

            // Simulate success
            showSignupAlert("Account created! Taking you to Login…", "success");
            if (signupCreateBtn) signupCreateBtn.disabled = true;
            if (signupName) signupName.disabled = true;
            if (signupEmail) signupEmail.disabled = true;
            if (signupPassword) signupPassword.disabled = true;

            setTimeout(() => {
                closeModal(signupOverlay);
                openModal(loginOverlay);
            }, 1800);
        });
    }

    // Google signup
    const signupGoogleBtn = signupForm ? signupForm.querySelector(".signup-google-btn") : null;
    if (signupGoogleBtn) {
        signupGoogleBtn.addEventListener("click", () => {
            showSignupAlert("Registering with Google…", "success");
            setTimeout(() => { window.location.href = "home.html"; }, 1200);
        });
    }

})();

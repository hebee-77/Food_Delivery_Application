document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const alertBox = document.getElementById("alert-box");

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");
            
            // Toggle icon
            const icon = togglePasswordBtn.querySelector("i");
            if (icon) {
                if (isPassword) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    }

    // Helper: Show Alert
    function showAlert(message, type = "error") {
        if (!alertBox) return;

        alertBox.textContent = message;
        alertBox.className = `alert-box ${type}`;
        alertBox.classList.remove("hidden");

        // Scroll alert into view slightly
        alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Helper: Hide Alert
    function hideAlert() {
        if (!alertBox) return;
        alertBox.classList.add("hidden");
        alertBox.textContent = "";
    }

    // Helper: Validate Email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Form Submit Handler
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            hideAlert();

            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value;

            // Validation checks
            if (!emailValue) {
                showAlert("Please enter your email address.", "error");
                emailInput.focus();
                return;
            }

            if (!isValidEmail(emailValue)) {
                showAlert("Please enter a valid email address.", "error");
                emailInput.focus();
                return;
            }

            if (!passwordValue) {
                showAlert("Please enter your password.", "error");
                passwordInput.focus();
                return;
            }

            if (passwordValue.length < 6) {
                showAlert("Password must be at least 6 characters long.", "error");
                passwordInput.focus();
                return;
            }

            // Success simulation
            showAlert("Login successful! Redirecting you to Platter Home...", "success");
            
            // Disable inputs & submit button to prevent double submission
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector("span");
                if (btnText) btnText.textContent = "Signing In...";
            }
            emailInput.disabled = true;
            passwordInput.disabled = true;

            // Redirect to index page after a brief delay
            setTimeout(() => {
                window.location.href = "../index.jsp";
            }, 1800);
        });
    }

    // Google Login button simulation
    const googleBtn = document.querySelector(".google-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            showAlert("Connecting with Google...", "success");
            setTimeout(() => {
                window.location.href = "../index.jsp";
            }, 1200);
        });
    }

});

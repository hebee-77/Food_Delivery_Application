document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const signupForm = document.getElementById("signup-form");
    const nameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    
    const togglePasswordBtn = document.getElementById("toggle-password");
    const toggleConfirmBtn = document.getElementById("toggle-confirm-password");
    const alertBox = document.getElementById("alert-box");

    // Password Strength Meter Elements
    const strengthValue = document.getElementById("strength-value");
    const segments = document.querySelectorAll(".strength-bar-segments .segment");

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");
            
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

    // Toggle Confirm Password Visibility
    if (toggleConfirmBtn && confirmPasswordInput) {
        toggleConfirmBtn.addEventListener("click", () => {
            const isPassword = confirmPasswordInput.getAttribute("type") === "password";
            confirmPasswordInput.setAttribute("type", isPassword ? "text" : "password");
            
            const icon = toggleConfirmBtn.querySelector("i");
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

    // Dynamic Password Strength Meter
    if (passwordInput && strengthValue && segments.length > 0) {
        passwordInput.addEventListener("input", () => {
            const val = passwordInput.value;
            let strength = "None";
            let score = 0; // 0 to 4

            if (val.length > 0) {
                if (val.length < 6) {
                    strength = "Weak";
                    score = 1;
                } else {
                    // Check complexity
                    const hasLetters = /[a-zA-Z]/.test(val);
                    const hasNumbers = /[0-9]/.test(val);
                    const hasSpecial = /[^a-zA-Z0-9]/.test(val);

                    if (val.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
                        strength = "Strong";
                        score = 4;
                    } else if (hasLetters && (hasNumbers || hasSpecial)) {
                        strength = "Medium";
                        score = 3;
                    } else {
                        strength = "Weak";
                        score = 1;
                    }
                }
            }

            // Update Label Text & Color
            strengthValue.textContent = strength;
            strengthValue.className = ""; // Reset class
            if (strength === "Weak") strengthValue.style.color = "#EF4444";
            else if (strength === "Medium") strengthValue.style.color = "#F59E0B";
            else if (strength === "Strong") strengthValue.style.color = "#10B981";
            else strengthValue.style.color = "";

            // Light up segments
            segments.forEach((seg, idx) => {
                seg.className = "segment"; // Clear previous state
                if (idx < score) {
                    if (strength === "Weak") seg.classList.add("weak");
                    else if (strength === "Medium") seg.classList.add("medium");
                    else if (strength === "Strong") seg.classList.add("strong");
                }
            });
        });
    }

    // Helper: Show Alert
    function showAlert(message, type = "error") {
        if (!alertBox) return;

        alertBox.textContent = message;
        alertBox.className = `alert-box ${type}`;
        alertBox.classList.remove("hidden");

        // Scroll alert into view
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

    // Helper: Validate Phone format (10 digit check)
    function isValidPhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Form Submit Handler
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            hideAlert();

            const nameValue = nameInput.value.trim();
            const emailValue = emailInput.value.trim();
            const phoneValue = phoneInput.value.trim();
            const passwordValue = passwordInput.value;
            const confirmPasswordValue = confirmPasswordInput.value;
            const agreeCheckbox = document.getElementById("agree-terms");

            // Form validation checks
            if (!nameValue) {
                showAlert("Please enter your full name.", "error");
                nameInput.focus();
                return;
            }

            if (nameValue.length < 2) {
                showAlert("Full name must be at least 2 characters.", "error");
                nameInput.focus();
                return;
            }

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

            if (!phoneValue) {
                showAlert("Please enter your phone number.", "error");
                phoneInput.focus();
                return;
            }

            if (!isValidPhone(phoneValue)) {
                showAlert("Phone number must be a 10-digit number.", "error");
                phoneInput.focus();
                return;
            }

            if (!passwordValue) {
                showAlert("Please choose a password.", "error");
                passwordInput.focus();
                return;
            }

            if (passwordValue.length < 6) {
                showAlert("Password must be at least 6 characters long.", "error");
                passwordInput.focus();
                return;
            }

            if (!confirmPasswordValue) {
                showAlert("Please confirm your password.", "error");
                confirmPasswordInput.focus();
                return;
            }

            if (passwordValue !== confirmPasswordValue) {
                showAlert("Passwords do not match. Please verify.", "error");
                confirmPasswordInput.focus();
                return;
            }

            if (agreeCheckbox && !agreeCheckbox.checked) {
                showAlert("You must agree to the Terms & Conditions and Privacy Policy.", "error");
                return;
            }

            // Success simulation
            showAlert("Account created successfully! Redirecting you to Login...", "success");

            // Disable controls
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector("span");
                if (btnText) btnText.textContent = "Creating Account...";
            }
            nameInput.disabled = true;
            emailInput.disabled = true;
            phoneInput.disabled = true;
            passwordInput.disabled = true;
            confirmPasswordInput.disabled = true;

            // Redirect to Login Page
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1800);
        });
    }

    // Google Sign up button simulation
    const googleBtn = document.querySelector(".google-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            showAlert("Registering with Google account...", "success");
            setTimeout(() => {
                window.location.href = "../index.jsp";
            }, 1200);
        });
    }

});

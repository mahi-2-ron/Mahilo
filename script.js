document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    // Theme Switching Logic
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcons(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcons(theme);
    });

    function updateIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Social Buttons Simulation
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.innerText.trim();
            btn.style.opacity = '0.6';
            btn.style.pointerEvents = 'none';
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<div class="btn-loader" style="display:block; border-top-color: var(--primary-color);"></div>`;

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';

                if (provider === 'Google') {
                    // Redirect to Google Accounts sign-in
                    window.location.href = 'https://accounts.google.com/v3/signin/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin';
                } else if (provider === 'GitHub') {
                    // Redirect to GitHub Login
                    window.location.href = 'https://github.com/login';
                }
            }, 1000);
        });
    });

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle SVG icon (optional)
        const icon = togglePassword.querySelector('svg');
        if (type === 'text') {
            icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        } else {
            icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }
    });

    // Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show Loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.style.background = '#27272a'; // Success color (Greyscale)
            submitBtn.innerHTML = '<span class="btn-text">Success!</span>';

            console.log('Login attempt with:', {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            });

            // Reset after a delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.innerHTML = '<span class="btn-text">Sign In</span> <div class="btn-loader"></div>';
                alert('This is a demo. No actual login occurred.');
            }, 2000);

        }, 1500);
    });

    // Add subtle movement to the background image on mouse move
    const container = document.querySelector('.login-container');
    const bgImage = document.querySelector('.bg-image');

    if (container && bgImage) {
        container.addEventListener('mousemove', (e) => {
            const { width, height } = container.getBoundingClientRect();
            const x = (e.clientX - container.offsetLeft) / width;
            const y = (e.clientY - container.offsetTop) / height;

            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;

            bgImage.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        });

        container.addEventListener('mouseleave', () => {
            bgImage.style.transform = 'scale(1) translate(0, 0)';
        });
    }
});

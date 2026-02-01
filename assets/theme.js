(function () {
    const storageKey = 'amos-portfolio-theme';

    function getTheme() {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(storageKey, theme);
        updateIcon();
    }

    function updateIcon() {
        const icon = document.querySelector('#theme-toggle i');
        if (!icon) return;
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Initial setup
    const currentTheme = getTheme();
    setTheme(currentTheme);

    // Toggle function
    window.toggleTheme = function () {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    };

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(storageKey)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Handle icon on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateIcon);
    } else {
        updateIcon();
    }
    // Scroll Progress Bar Logic
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // Hide scroll indicator on scroll
        const scrollIndicator = document.querySelector('.scroll-down');
        if (scrollIndicator) {
            if (winScroll > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    });
})();

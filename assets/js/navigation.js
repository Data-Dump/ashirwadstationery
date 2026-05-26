document.addEventListener('DOMContentLoaded', () => {
    function initNav() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navItems = document.querySelectorAll('.nav-links a');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if(navLinks) navLinks.classList.remove('active');
                if(menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        const currentLocation = location.pathname.split('/').filter(Boolean).pop() || '';
        navItems.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').filter(Boolean).pop() || '';
            if (linkPath === currentLocation || (currentLocation === '' && linkPath === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setTimeout(initNav, 300);
});

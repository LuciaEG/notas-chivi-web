/**
 * NOTAS CHIVI - Script principal
 * Menú hamburguesa + Dropdown + Scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // MENÚ HAMBURGUESA
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;

    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        body.appendChild(overlay);
    }

    function openMenu() {
        navToggle.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
        // Cerrar todos los dropdowns al cerrar el menú
        closeAllDropdowns();
    }

    function toggleMenu() {
        if (mainNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeMenu();
            }
        });

        // Links del menú: cerrar menú y navegar
        const navLinks = mainNav.querySelectorAll('.nav__link:not(.nav__link--dropdown)');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768 && mainNav.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // ========================================
    // DROPDOWN / DESPLEGABLE
    // ========================================
    const dropdownTriggers = document.querySelectorAll('.nav__link--dropdown');

    function closeAllDropdowns() {
        dropdownTriggers.forEach(function(trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const menu = trigger.nextElementSibling;
            if (menu && menu.classList.contains('dropdown__menu')) {
                menu.classList.remove('active');
            }
        });
    }

    function toggleDropdown(trigger) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const menu = trigger.nextElementSibling;

        if (isExpanded) {
            trigger.setAttribute('aria-expanded', 'false');
            if (menu) menu.classList.remove('active');
        } else {
            // Cerrar otros dropdowns primero
            closeAllDropdowns();
            trigger.setAttribute('aria-expanded', 'true');
            if (menu) menu.classList.add('active');
        }
    }

    dropdownTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(trigger);
        });
    });

    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(e) {
        const isDropdown = e.target.closest('.nav__item--dropdown');
        if (!isDropdown) {
            closeAllDropdowns();
        }
    });

    // Cerrar dropdowns al hacer click en un link del dropdown
    const dropdownLinks = document.querySelectorAll('.dropdown__link');
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // En mobile, cerrar el menú completo
            if (window.innerWidth < 768 && mainNav.classList.contains('active')) {
                closeMenu();
            } else {
                // En desktop, solo cerrar el dropdown
                closeAllDropdowns();
            }
        });
    });

    // ========================================
    // SCROLL REVEAL
    // ========================================
    const revealElements = document.querySelectorAll('.scroll-reveal, .discos__image, .discos__text');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function(el) {
            el.classList.add('revealed');
        });
    }

    // ========================================
    // SMOOTH SCROLL (solo anchors internos)
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // HEADER SHADOW AL SCROLL
    // ========================================
    const header = document.querySelector('.header');
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;
                if (currentScroll > 10) {
                    header.style.boxShadow = '0 4px 12px rgba(74, 93, 35, 0.15)';
                } else {
                    header.style.boxShadow = '';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Page Loader ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1000);

    // --- 2. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactables = document.querySelectorAll('a, button, input, textarea');

    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: "forwards" });
        });

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    }

    // --- 3. Dynamic Navbar & Active Menu Highlighting ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Nav
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        // Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // --- 5. Theme Toggle & Persistence ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark';

    htmlEl.setAttribute('data-theme', currentTheme);

    themeBtn.addEventListener('click', () => {
        let newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 6. Typewriter Effect ---
    const words = ["Frontend Developer", "UI/UX Designer", "Software Engineer"];
    let i = 0;
    let timer;
    let wordIndex = 0;
    let isDeleting = false;
    const typeWriterEl = document.getElementById('typewriter');

    function typingEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typeWriterEl.textContent = currentWord.substring(0, i - 1);
            i--;
        } else {
            typeWriterEl.textContent = currentWord.substring(0, i + 1);
            i++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && i === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }
        setTimeout(typingEffect, speed);
    }
    setTimeout(typingEffect, 1500);

    // --- 7. Intersection Observer for Scroll Reveals & Counters & Skills ---
    const revealElements = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    const skillBars = document.querySelectorAll('.skill-progress');
    let counted = false;

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate Skills
                if(entry.target.classList.contains('skills-grid')) {
                    skillBars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }

                // Animate Counters
                if (entry.target.classList.contains('about-grid') && !counted) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const speed = 200; 
                        const updateCount = () => {
                            const count = +counter.innerText;
                            const inc = target / speed;
                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 15);
                            } else {
                                counter.innerText = target + (target > 10 ? '+' : '');
                            }
                        };
                        updateCount();
                    });
                    counted = true;
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- 8. Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                card.style.display = 'none';
                card.style.opacity = '0';
                
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => { card.style.opacity = '1'; }, 50);
                }
            });
        });
    });

    // --- 9. Tilt Effect for Cards ---
    const tiltCards = document.querySelectorAll('.tilt');
    
    tiltCards.forEach(card => {
        if (window.innerWidth > 768) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        }
    });

    // --- 10. Form Submission & Toast Notifications ---
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API Call
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                showToast("Message sent successfully!");
            }, 1500);
        });
    }

    // --- 11. Copy Email to Clipboard ---
    const copyBtn = document.getElementById('copy-email');
    const emailText = document.getElementById('email-text').innerText;
    
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText).then(() => {
                showToast("Email copied to clipboard!");
            });
        });
    }

    // --- 12. Dynamic Year in Footer ---
    document.getElementById('current-year').innerText = new Date().getFullYear();

    // --- 13. Download CV Button ---
    const downloadBtn = document.getElementById('download-cv');
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
             const link = document.createElement('a');
             link.href = '/assets/CV.pdf';
             link.download = 'Firman_Maulana_Fake-CV.pdf';
             link.click();
             showToast("Fake CV download started...");
        });
    }
});

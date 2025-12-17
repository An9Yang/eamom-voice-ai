/**
 * Eamom Voice AI - Landing Page Scripts
 * Interactive animations and functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initHeroAnimation();
    initScrollAnimations();
    initROICalculator();
    initContactForm();
    initCopyToClipboard();
    initSmoothScroll();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

/**
 * Hero section interactive demo animation
 */
function initHeroAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const callStatusText = document.getElementById('callStatusText');
    const aiBubble = document.getElementById('aiBubble');
    const aiText = document.getElementById('aiText');
    const posContent = document.getElementById('posContent');
    const steps = document.querySelectorAll('.demo-steps .step');
    const callWave = document.getElementById('callWave');

    // Animation sequence
    const sequence = [
        {
            step: 1,
            duration: 2000,
            status: '来电中...',
            aiText: '',
            showBubble: false
        },
        {
            step: 2,
            duration: 3000,
            status: 'AI 已接听',
            aiText: '您好！欢迎致电金龙餐厅，请问需要点什么？',
            showBubble: true
        },
        {
            step: 3,
            duration: 4000,
            status: '点餐进行中',
            aiText: '好的，一份左宗棠鸡大份，扬州炒饭，酸辣汤。请问送到哪里？',
            showBubble: true
        },
        {
            step: 4,
            duration: 3000,
            status: '订单已确认',
            aiText: '订单已确认！总计 $35.97，预计30分钟送达。',
            showBubble: true,
            showOrder: true
        }
    ];

    let currentStep = 0;
    let animationTimeout;
    let completedLoops = 0;
    const maxLoops = 1;

    function runAnimation(scheduleNext = true) {
        const current = sequence[currentStep];

        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        // Update call status
        if (callStatusText) {
            callStatusText.textContent = current.status;
        }

        // Update AI bubble
        if (aiBubble && aiText) {
            if (current.showBubble && current.aiText) {
                aiText.textContent = current.aiText;
                aiBubble.style.animation = 'none';
                aiBubble.offsetHeight; // Trigger reflow
                aiBubble.style.animation = 'bubbleIn 0.5s ease forwards';
            }
        }

        // Show order items in POS
        if (current.showOrder && posContent) {
            const orderItems = posContent.querySelectorAll('.order-item, .order-total');
            orderItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 300);
            });
        }

        if (!scheduleNext) return;

        // Move to next step
        animationTimeout = setTimeout(() => {
            const nextStep = (currentStep + 1) % sequence.length;
            const isWrapping = nextStep === 0;

            if (isWrapping) {
                completedLoops += 1;

                if (completedLoops >= maxLoops) {
                    animationTimeout = null;
                    return;
                }
            }

            // Reset order items when restarting
            if (isWrapping && posContent) {
                const orderItems = posContent.querySelectorAll('.order-item, .order-total');
                orderItems.forEach(item => {
                    item.style.opacity = '0';
                });
            }

            currentStep = nextStep;
            runAnimation();
        }, current.duration);
    }

    // Reduced motion: render a static end state
    if (prefersReducedMotion) {
        currentStep = sequence.length - 1;

        if (posContent) {
            posContent.querySelectorAll('.order-item, .order-total').forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }

        if (aiBubble) {
            aiBubble.style.opacity = '1';
            aiBubble.style.animation = 'none';
        }

        runAnimation(false);
        return;
    }

    // Start animation (runs once, then stays on last step)
    runAnimation();

    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationTimeout) {
                    runAnimation();
                }
            } else {
                clearTimeout(animationTimeout);
                animationTimeout = null;
            }
        });
    }, { threshold: 0.5 });

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        observer.observe(heroVisual);
    }
}

/**
 * Scroll-based animations
 */
function initScrollAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `all 0.6s ease ${index * 0.2}s`;
    });

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.timeline-item');
                items.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                });
            }
        });
    }, { threshold: 0.2 });

    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timelineObserver.observe(timeline);
    }

    // Animate flow steps
    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `all 0.5s ease ${index * 0.1}s`;
    });

    const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = entry.target.querySelectorAll('.flow-step');
                steps.forEach(step => {
                    step.style.opacity = '1';
                    step.style.transform = 'translateY(0)';
                });
            }
        });
    }, { threshold: 0.3 });

    const flowContainer = document.querySelector('.flow-container');
    if (flowContainer) {
        flowObserver.observe(flowContainer);
    }

    // Animate market stats with counter
    const marketStats = document.querySelectorAll('.market-stat-card .stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    marketStats.forEach(stat => {
        statObserver.observe(stat);
    });
}

/**
 * Animate number values
 */
function animateValue(element) {
    const text = element.textContent;
    const hasK = text.includes('K');
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasLessThan = text.includes('<');

    // Extract number
    let finalValue = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(finalValue)) return;

    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (finalValue - startValue) * easeOut;

        let displayValue;
        if (finalValue >= 1000) {
            displayValue = currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else if (finalValue < 10) {
            displayValue = currentValue.toFixed(0);
        } else {
            displayValue = Math.round(currentValue).toLocaleString('en-US');
        }

        // Add suffixes back
        if (hasLessThan) displayValue = '<' + displayValue;
        if (hasPercent) displayValue += '%';
        if (hasK) displayValue = displayValue.replace(/,/g, '') + 'K';
        if (hasPlus) displayValue += '+';

        element.textContent = displayValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * ROI Calculator functionality
 */
function initROICalculator() {
    const ordersSlider = document.getElementById('ordersPerDay');
    const laborSlider = document.getElementById('laborCost');
    const ordersValue = document.getElementById('ordersValue');
    const laborValue = document.getElementById('laborValue');
    const annualLabor = document.getElementById('annualLabor');
    const annualAI = document.getElementById('annualAI');
    const annualSavings = document.getElementById('annualSavings');

    const AI_MONTHLY_COST = 1200;

    function updateCalculator() {
        const orders = parseInt(ordersSlider.value);
        const monthlyLabor = parseInt(laborSlider.value);

        // Update display values
        ordersValue.textContent = `${orders} 单`;
        laborValue.textContent = `$${monthlyLabor.toLocaleString()}`;

        // Calculate annual costs
        const annualLaborCost = monthlyLabor * 12;
        const annualAICost = AI_MONTHLY_COST * 12;
        const savings = annualLaborCost - annualAICost;

        // Update results with animation
        animateNumber(annualLabor, annualLaborCost);
        animateNumber(annualAI, annualAICost);
        animateNumber(annualSavings, savings);
    }

    function animateNumber(element, target) {
        const current = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const diff = target - current;
        const duration = 300;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 2);
            const value = Math.round(current + diff * easeOut);
            element.textContent = `$${value.toLocaleString()}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if (ordersSlider && laborSlider) {
        ordersSlider.addEventListener('input', updateCalculator);
        laborSlider.addEventListener('input', updateCalculator);

        // Initialize
        updateCalculator();
    }
}

/**
 * Contact form functionality
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate
            const restaurantName = document.getElementById('restaurantName').value;
            const contactName = document.getElementById('contactName').value;
            const phone = document.getElementById('phone').value;
            const location = document.getElementById('location').value;

            if (!restaurantName || !contactName || !phone || !location) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>提交中...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Reset form
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success message
                showNotification('感谢您的咨询！我们会尽快与您联系。', 'success');
            }, 1500);
        });
    }
}

/**
 * Copy-to-clipboard helpers (e.g. WeChat ID)
 */
function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach((el) => {
        el.addEventListener('click', async () => {
            const text = el.getAttribute('data-copy');
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                showNotification(`已复制：${text}`, 'success');
                return;
            } catch {
                // Fallback for older browsers / non-secure contexts
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.top = '0';
                textarea.style.left = '0';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    document.execCommand('copy');
                    showNotification(`已复制：${text}`, 'success');
                } finally {
                    textarea.remove();
                }
            }
        });
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-primary)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 14px 40px rgba(15,23,42,0.22);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 16px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
`;
document.head.appendChild(style);

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') return;

            let target;
            try {
                target = document.querySelector(href);
            } catch {
                return;
            }

            if (!target) return;

            e.preventDefault();
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
}

/**
 * Parallax effect for hero background
 */
function initParallax() {
    const heroGradient = document.querySelector('.hero-gradient');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroGradient && scrolled < window.innerHeight) {
            heroGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Initialize parallax
initParallax();

/**
 * Typing animation for hero subtitle
 */
function initTypingEffect() {
    const element = document.querySelector('.hero-description');
    if (!element) return;

    const originalText = element.innerHTML;
    // Optional: Add typing effect on load
}

/**
 * Interactive hover effects for feature cards
 */
document.querySelectorAll('.feature-card, .pain-card, .advantage-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/**
 * Lazy load images
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

initLazyLoad();

/**
 * Performance optimization: Debounce scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler for performance
const debouncedScroll = debounce(() => {
    // Additional scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll, { passive: true });

console.log('Eamom Voice AI - Landing Page Loaded');

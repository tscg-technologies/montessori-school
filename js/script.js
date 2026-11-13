/**
 * Little Sprouts Montessori School - Interactive Client Logic
 * Pure Vanilla JavaScript (ES6+) - Zero External Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Sticky Navigation & Header Elevation ---
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Hamburger Navigation ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !header.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // --- Active Navigation Link Spy ---
  const sections = document.querySelectorAll('section[id]');
  const observeSectionScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (matchingLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', observeSectionScroll, { passive: true });

  // --- Scroll Reveal Animations with IntersectionObserver ---
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  // --- Animated Statistics Counters ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  const animateStats = () => {
    if (statsTriggered) return;
    statsTriggered = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      const suffix = stat.getAttribute('data-suffix') || '+';
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let count = 0;
      const increment = Math.ceil(target / steps);

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = count + suffix;
        }
      }, stepDuration);
    });
  };

  const statsSection = document.querySelector('.statistics-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  } else if (statsSection) {
    animateStats();
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherPanel) otherPanel.style.maxHeight = null;
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstButton = firstItem.querySelector('.faq-question-btn');
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    firstItem.classList.add('active');
    firstButton.setAttribute('aria-expanded', 'true');
    firstPanel.style.maxHeight = firstPanel.scrollHeight + 30 + 'px';
  }

  // --- Gallery & Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-caption-title');
  const lightboxDesc = document.getElementById('lightbox-caption-desc');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  let currentGalleryIndex = 0;

  const galleryData = Array.from(galleryItems).map(item => {
    return {
      src: item.getAttribute('data-img') || item.querySelector('img').src,
      title: item.getAttribute('data-title') || 'Montessori Experience',
      caption: item.getAttribute('data-caption') || 'Fictional Demonstration'
    };
  });

  const openLightbox = (index) => {
    currentGalleryIndex = index;
    const item = galleryData[currentGalleryIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.caption;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    openLightbox(currentGalleryIndex);
  };

  const showPrevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentGalleryIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // --- Contact Form Validation & Demo Submission ---
  const contactForm = document.getElementById('admissions-enquiry-form');
  const successBanner = document.getElementById('form-success-banner');

  if (contactForm) {
    const validateField = (input, validator, errorMsg) => {
      const formGroup = input.closest('.form-group');
      const errorEl = formGroup ? formGroup.querySelector('.form-error') : null;
      const isValid = validator(input.value.trim());

      if (!isValid) {
        if (formGroup) formGroup.classList.add('has-error');
        if (errorEl) errorEl.textContent = errorMsg;
        return false;
      } else {
        if (formGroup) formGroup.classList.remove('has-error');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
    };

    const validators = {
      name: val => val.length >= 2,
      email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      phone: val => /^[6-9]\d{9}$/.test(val.replace(/\s+/g, '')),
      age: val => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 1 && num <= 7;
      },
      programme: val => val !== '',
      message: val => val.length >= 8
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('parent-name');
      const emailInput = document.getElementById('parent-email');
      const phoneInput = document.getElementById('parent-phone');
      const ageInput = document.getElementById('child-age');
      const progInput = document.getElementById('interested-programme');
      const msgInput = document.getElementById('enquiry-message');

      const isNameValid = validateField(nameInput, validators.name, 'Please enter a valid parent name (min 2 characters).');
      const isEmailValid = validateField(emailInput, validators.email, 'Please enter a valid email address.');
      const isPhoneValid = validateField(phoneInput, validators.phone, 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).');
      const isAgeValid = validateField(ageInput, validators.age, "Please enter child's age between 1.5 and 6 years.");
      const isProgValid = validateField(progInput, validators.programme, 'Please select an interested programme.');
      const isMsgValid = validateField(msgInput, validators.message, 'Please provide a brief message or question (min 8 characters).');

      if (isNameValid && isEmailValid && isPhoneValid && isAgeValid && isProgValid && isMsgValid) {
        // Form is valid - display demonstration success state
        if (successBanner) {
          successBanner.classList.add('active');
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();

        // Auto hide success after 10 seconds
        setTimeout(() => {
          if (successBanner) successBanner.classList.remove('active');
        }, 10000);
      }
    });

    // Real-time error clearance
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

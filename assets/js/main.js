/**
* Template Name: Strada
* Template URL: https://bootstrapmade.com/strada-bootstrap-agency-template/
* Updated: Apr 01 2026 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && !navmenu.classList.contains('toggle-dropdown')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  /**
   * METALUMINA inquiry form
   * AJAX retains the visitor on the page and provides an inline confirmation.
   * The regular HTML form POST remains a fallback if JavaScript is disabled.
   * Notification recipients are configured in Formspark, not in the page.
   */
  const inquiryForm = document.querySelector('#metalumina-inquiry');
  if (inquiryForm) {
    const submitButton = inquiryForm.querySelector('button[type="submit"]');
    const submitLabel = submitButton?.querySelector('span');
    const feedback = document.querySelector('#metalumina-form-feedback');
    const originalLabel = submitLabel?.textContent || 'Send inquiry';
    let sending = false;

    const showFeedback = (message, isError = false) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.toggle('text-warning', isError);
      feedback.hidden = false;
    };

    inquiryForm.addEventListener('input', () => {
      if (feedback && !sending) feedback.hidden = true;
    });

    inquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (sending || !inquiryForm.reportValidity()) return;

      // Formspark requires nested _email metadata when receiving JSON.
      // Keep the hidden HTML inputs for the no-JavaScript form fallback.
      const fields = new FormData(inquiryForm);
      const payload = Object.fromEntries(fields.entries());
      payload._email = {
        subject: fields.get('_email.subject') || '[METALUMINA] Studio Inquiry',
        from: fields.get('_email.from') || 'METALUMINA'
      };
      delete payload['_email.subject'];
      delete payload['_email.from'];
      delete payload['_feedback.dark']; // Applies to hosted feedback only.

      sending = true;
      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending...';
      if (feedback) feedback.hidden = true;

      try {
        const response = await fetch(inquiryForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Formspark rejected the submission (${response.status})`);

        inquiryForm.reset();
        showFeedback('Message sent. Thanks for reaching out! We’ll reply by email.');

        // Count only accepted inquiries, without sending personally identifying data.
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            form_name: 'metalumina_inquiry',
            inquiry_type: payload.inquiryType,
            service_type: payload.serviceType
          });
        }
      } catch (error) {
        console.error('Metalumina inquiry submission failed:', error);
        showFeedback('Your message didn’t go through. Please try again, or email book@metalumina.studio.', true);
      } finally {
        sending = false;
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = originalLabel;
      }
    });
  }

})();

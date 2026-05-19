/**
 * counter.js - Animated Number Counter for Spotify Wrapped Portfolio Theme
 *
 * Uses IntersectionObserver to trigger counters only when the card
 * scrolls into view, giving the Wrapped-style reveal effect.
 */

(function () {
  'use strict';

  /**
   * Easing function: easeOutQuart
   * Starts fast, decelerates towards the end.
   * @param {number} t - Progress from 0 to 1
   * @returns {number} Eased value
   */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * Animates a single counter element from 0 to its target value.
   * @param {HTMLElement} el - The element to animate
   * @param {number} target - The final number to count up to
   * @param {number} duration - Animation duration in ms
   */
  function animateCounter(el, target, duration) {
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(easedProgress * target);

      el.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Sets up IntersectionObserver for all .stat-number elements.
   * Fires animation once per element when it enters the viewport.
   */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (!counters.length) return;

    const observerOptions = {
      root: document.querySelector('.scroll-container'),
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = el.getAttribute('data-duration')
            ? parseInt(el.getAttribute('data-duration'), 10)
            : 2000;

          // Animate and then stop observing so it only fires once
          animateCounter(el, target, duration);
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      // Initialize to zero before animation
      counter.textContent = '0';
      observer.observe(counter);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }

})();

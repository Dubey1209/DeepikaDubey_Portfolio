// Mobile Navigation
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const drawerOverlay = document.querySelector('.drawer-overlay');
const drawerCloseBtn = document.querySelector('.drawer-close-btn');
const dropdownToggles = document.querySelectorAll('.dropdown > a');
let isMenuOpen = false;

// Toggle mobile menu
function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  navLinks.classList.toggle('open', isMenuOpen);
  document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  
  if (drawerOverlay) {
    drawerOverlay.classList.toggle('visible', isMenuOpen);
  }
  
  // Toggle aria attributes
  menuToggle.setAttribute('aria-expanded', isMenuOpen);
  
  // Close all dropdowns when toggling the main menu
  if (!isMenuOpen) {
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
      dropdown.classList.remove('show');
    });
    dropdownToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
}

// Close menu when clicking outside
function closeMenu() {
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
  
  if (drawerOverlay) {
    drawerOverlay.classList.remove('visible');
  }
  
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Toggle dropdown menus on mobile
function toggleDropdown(e) {
  if (window.innerWidth <= 800) {
    e.preventDefault();
    const dropdown = this.nextElementSibling;
    const isOpen = !dropdown.classList.contains('show');
    
    // Close all dropdowns first
    document.querySelectorAll('.dropdown-content').forEach(item => {
      item.classList.remove('show');
    });
    
    // Toggle current dropdown if needed
    if (isOpen) {
      dropdown.classList.add('show');
      this.setAttribute('aria-expanded', 'true');
      
      // Close dropdown when clicking outside
      const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown')) {
          dropdown.classList.remove('show');
          this.setAttribute('aria-expanded', 'false');
          document.removeEventListener('click', handleClickOutside);
        }
      };
      
      // Add event listener to close on outside click
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    } else {
      this.setAttribute('aria-expanded', 'false');
    }
  }
}

// Event Listeners
if (menuToggle && navLinks) {
  // Toggle menu when clicking the hamburger button
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  
  // Close menu when clicking on overlay
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  // Close menu when clicking close button
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  // Close menu when clicking a nav link (for single page navigation)
  navLinks.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 800) {
        closeMenu();
      }
    });
  });
  
  // Handle dropdown toggles
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleDropdown);
    
    // Add keyboard navigation for dropdowns
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(e);
      } else if (e.key === 'Escape') {
        const dropdown = toggle.nextElementSibling;
        dropdown.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMenu();
  }
});

// Initialize dropdown toggles
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', toggleDropdown);
  
  // Add dropdown indicator
  const indicator = document.createElement('span');
  indicator.className = 'dropdown-indicator';
  indicator.innerHTML = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  
  if (window.innerWidth <= 768) {
    toggle.appendChild(indicator);
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      // Reset mobile menu state on desktop
      closeMenu();
      
      // Reset dropdowns
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  }, 250);
});

// Prevent form submission (demo only)
document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
});

// Fade-in on scroll for story-scroll-segment
function revealStorySegments() {
  const segments = document.querySelectorAll('.story-scroll-segment');
  const windowHeight = window.innerHeight;
  segments.forEach(seg => {
    const rect = seg.getBoundingClientRect();
    if (rect.top < windowHeight - 60) {
      seg.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealStorySegments);
window.addEventListener('DOMContentLoaded', revealStorySegments);

// Unique Section/Page Transition Effects
(function() {
  // Create overlay for page transitions
  let overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Helper: get section from hash
  function getSectionFromHash(hash) {
    if (!hash) return null;
    return document.querySelector(hash);
  }

  // Animate section transitions for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#' || !document.querySelector(hash)) return;
      const targetSection = document.querySelector(hash);
      const currentSection = document.querySelector('.section:target') || document.querySelector('.section');
      if (!targetSection || targetSection === currentSection) return;
      e.preventDefault();
      // Animate out current
      if (currentSection) {
        currentSection.classList.add('transitioning-out');
        setTimeout(() => {
          currentSection.classList.remove('transitioning-out');
        }, 600);
      }
      // Animate in target
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetSection.classList.add('transitioning-in');
        setTimeout(() => {
          targetSection.classList.remove('transitioning-in');
        }, 800);
      }, 200);
    });
  });

  // Animate page transitions for .html links
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
})();

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1 && document.querySelector(targetId)) {
        e.preventDefault();
        document.querySelector(targetId).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Fade in/out transition for section navigation

document.addEventListener('DOMContentLoaded', function() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll('section');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1 && document.querySelector(targetId)) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        const currentSection = Array.from(sections).find(sec => sec.getBoundingClientRect().top <= 80 && sec.getBoundingClientRect().bottom > 80);
        if (currentSection && currentSection !== targetSection) {
          currentSection.style.transition = 'opacity 0.4s';
          currentSection.style.opacity = 0;
          setTimeout(() => {
            window.location.hash = targetId;
            currentSection.style.opacity = '';
            sections.forEach(sec => sec.style.opacity = '');
            targetSection.style.opacity = 0;
            targetSection.style.transition = 'opacity 0.4s';
            setTimeout(() => {
              targetSection.style.opacity = 1;
              setTimeout(() => {
                targetSection.style.transition = '';
                targetSection.style.opacity = '';
              }, 400);
            }, 10);
          }, 400);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });
}); 
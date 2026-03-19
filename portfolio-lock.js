// Portfolio Lock System
class PortfolioLock {
  constructor() {
    this.isUnlocked = false;
    this.sessionKey = 'portfolio_unlocked';
    this.init();
  }

  init() {
    // Check if already unlocked in this session
    // Comment this line for testing: sessionStorage.getItem(this.sessionKey) === 'true'
    if (false) { // Changed to false for testing - set back to: sessionStorage.getItem(this.sessionKey) === 'true'
      this.unlockPortfolio(false); // Unlock without animation
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const form = document.getElementById('unlock-form');
    const messageCheckbox = document.getElementById('wants-message');
    const messageGroup = document.getElementById('message-group');

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUnlock();
    });

    // Message checkbox toggle
    messageCheckbox.addEventListener('change', () => {
      if (messageCheckbox.checked) {
        messageGroup.style.display = 'block';
        setTimeout(() => {
          messageGroup.style.opacity = '1';
        }, 10);
      } else {
        messageGroup.style.opacity = '0';
        setTimeout(() => {
          messageGroup.style.display = 'none';
        }, 300);
      }
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }

  async handleUnlock() {
    const name = document.getElementById('visitor-name').value.trim();
    const email = document.getElementById('visitor-email').value.trim();
    const message = document.getElementById('visitor-message').value.trim();
    const wantsMessage = document.getElementById('wants-message').checked;

    // Validate inputs
    if (!name || !email) {
      this.showError('Please fill in all required fields');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Send data to email service
      await this.sendVisitorData(name, email, message);
      
      // Trigger glass shatter animation
      this.triggerGlassShatter();
      
      // Mark as unlocked in session
      sessionStorage.setItem(this.sessionKey, 'true');
      
      // Show success message
      this.showSuccess(`Welcome to my portfolio, ${name}! 🎉`);
      
      // Unlock portfolio after animation
      setTimeout(() => {
        this.unlockPortfolio(true);
      }, 1500);

    } catch (error) {
      console.error('Error sending visitor data:', error);
      // Still unlock portfolio even if email fails
      this.triggerGlassShatter();
      sessionStorage.setItem(this.sessionKey, 'true');
      setTimeout(() => {
        this.unlockPortfolio(true);
      }, 1500);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  setLoadingState(loading) {
    const btn = document.querySelector('.unlock-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    if (loading) {
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
    } else {
      btn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  }

  async sendVisitorData(name, email, message) {
    const data = {
      name: name,
      email: email,
      message: message || 'No message provided',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      page: 'Portfolio Homepage'
    };

    try {
      // Using Formspree alternative - more reliable
      const response = await fetch('https://formspree.io/f/mkgjzvbl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: `Portfolio Visitor Notification:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message || 'No message provided'}\nTime: ${new Date().toLocaleString()}\nPage: Portfolio Homepage\nBrowser: ${navigator.userAgent}`,
          _subject: 'New Portfolio Visitor! 🎉'
        })
      });

      if (!response.ok) {
        throw new Error('Email service error');
      }

      return await response.json();
    } catch (error) {
      console.log('Email service error, trying alternative...');
      
      // Fallback: Log to console and show success
      console.log('Portfolio Visitor Data:', data);
      
      // Return success even if email fails
      return { success: true, message: 'Data logged successfully' };
    }
  }

  triggerGlassShatter() {
    const glassShatter = document.querySelector('.glass-shatter');
    const screenCrack = document.querySelector('.screen-crack');
    const lockScreen = document.querySelector('.portfolio-lock');
    
    // Activate screen crack first
    screenCrack.classList.add('active');
    
    // Then glass shatter
    setTimeout(() => {
      glassShatter.classList.add('active');
    }, 200);
    
    // Add sound effect (optional)
    this.playShatterSound();
    
    // Shake effect on lock screen - longer duration for dramatic effect
    lockScreen.style.animation = 'shake 0.6s';
    setTimeout(() => {
      lockScreen.style.animation = '';
    }, 600);
  }

  playShatterSound() {
    // Create and play glass shatter sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio errors
    });
  }

  unlockPortfolio(withAnimation = true) {
    const lockScreen = document.querySelector('.portfolio-lock');
    const mainContent = document.querySelector('#main-content');
    
    if (withAnimation) {
      lockScreen.style.opacity = '0';
      lockScreen.style.transform = 'scale(1.2)';
      
      setTimeout(() => {
        lockScreen.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          mainContent.style.transition = 'all 1s ease';
          mainContent.style.opacity = '1';
          mainContent.style.transform = 'scale(1)';
          
          // Stay on homepage - no navigation
          // Just ensure we're at the top of the page
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        }, 100);
      }, 500);
    } else {
      lockScreen.style.display = 'none';
      mainContent.style.display = 'block';
      
      // Stay on homepage - no navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    this.isUnlocked = true;
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification.error {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
  }
  
  .notification.success {
    background: linear-gradient(45deg, #27ae60, #229954);
  }
  
  .form-group.focused input,
  .form-group.focused textarea {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: #2a7ae2 !important;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioLock();
});

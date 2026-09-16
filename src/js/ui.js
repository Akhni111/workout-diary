/**
 * UI Utilities, Navigation Router, Toast System, Modal Controller & Icons
 */
import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';

export class UIManager {
  /**
   * Re-render Lucide icons across DOM
   */
  static refreshIcons() {
    createIcons({ icons });
  }

  /**
   * Display Toast Notification
   */
  static showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /**
   * Trigger Confetti Celebration Animation
   */
  static triggerConfetti() {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7']
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }

  /**
   * Open Modal by ID
   */
  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      this.refreshIcons();
    }
  }

  /**
   * Close Modal by ID
   */
  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * Close all active modals
   */
  static closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  /**
   * Switch Active View
   */
  static switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active');
    }

    // Update navigation states
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update page title
    const titleMap = {
      'dashboard': 'แดชบอร์ดสรุปผล',
      'daily-logs': 'บันทึกรายวัน',
      'calendar': 'ปฏิทินกิจกรรม',
      'programs': 'โปรแกรมการออกกำลังกาย',
      'friends': 'เพื่อน & คอมมูนิตี้',
      'profile': 'โปรไฟล์ & สัดส่วน'
    };

    const titleEl = document.getElementById('page-title');
    if (titleEl && titleMap[viewName]) {
      titleEl.textContent = titleMap[viewName];
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.refreshIcons();
  }
}

/**
 * 4-Digit PIN Lock Screen Controller
 */
import { StorageService } from './storage.js';
import { AuthService } from './auth.js';

export class PinLockManager {
  constructor(onUnlocked, onSwitchUser) {
    this.enteredPin = '';
    this.onUnlocked = onUnlocked;
    this.onSwitchUser = onSwitchUser;
    this.lockOverlay = document.getElementById('pin-lock-screen');
    this.dotsWrapper = document.getElementById('pin-dots');
    this.dots = document.querySelectorAll('.pin-dot');
    this.keypad = document.getElementById('pin-keypad');
    this.avatarEl = document.getElementById('pin-avatar-preview');
    this.greetingEl = document.getElementById('pin-user-greeting');

    this.initEvents();
  }

  initEvents() {
    // Digit keys click
    this.keypad.addEventListener('click', (e) => {
      const target = e.target.closest('.pin-key');
      if (!target) return;

      const digit = target.getAttribute('data-digit');
      if (digit !== null) {
        this.appendDigit(digit);
      }
    });

    // Backspace
    const btnBack = document.getElementById('btn-pin-backspace');
    if (btnBack) {
      btnBack.addEventListener('click', () => this.popDigit());
    }

    // Switch User / Logout
    const btnSwitch = document.getElementById('btn-pin-switch-user');
    if (btnSwitch) {
      btnSwitch.addEventListener('click', () => {
        this.hide();
        if (this.onSwitchUser) this.onSwitchUser();
      });
    }

    // Physical Keyboard support
    window.addEventListener('keydown', (e) => {
      if (this.lockOverlay.classList.contains('hidden')) return;

      if (/^[0-9]$/.test(e.key)) {
        this.appendDigit(e.key);
      } else if (e.key === 'Backspace') {
        this.popDigit();
      }
    });
  }

  show() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    this.enteredPin = '';
    this.updateDots();

    const initials = user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'WD';
    if (this.avatarEl) this.avatarEl.textContent = initials;
    if (this.greetingEl) this.greetingEl.textContent = `สวัสดี, ${user.fullName || user.username}`;

    StorageService.setPinLocked(true);
    this.lockOverlay.classList.remove('hidden');
  }

  hide() {
    StorageService.setPinLocked(false);
    this.lockOverlay.classList.add('hidden');
    this.enteredPin = '';
    this.updateDots();
  }

  appendDigit(digit) {
    if (this.enteredPin.length >= 4) return;
    this.enteredPin += digit;
    this.updateDots();

    if (this.enteredPin.length === 4) {
      setTimeout(() => this.verifyPin(), 120);
    }
  }

  popDigit() {
    if (this.enteredPin.length > 0) {
      this.enteredPin = this.enteredPin.slice(0, -1);
      this.updateDots();
    }
  }

  updateDots() {
    this.dots.forEach((dot, idx) => {
      if (idx < this.enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  verifyPin() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      this.hide();
      return;
    }

    const correctPin = user.pin || '1234';

    if (this.enteredPin === correctPin) {
      this.hide();
      if (this.onUnlocked) this.onUnlocked();
    } else {
      // Error Shake Animation
      this.dotsWrapper.classList.add('error');
      setTimeout(() => {
        this.dotsWrapper.classList.remove('error');
        this.enteredPin = '';
        this.updateDots();
      }, 600);
    }
  }
}

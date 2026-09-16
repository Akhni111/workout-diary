/**
 * Main Application Bootstrapper
 * Workout Diary - Vanilla JavaScript
 */
import { StorageService, INITIAL_DEMO_DATA } from './storage.js';
import { AuthService } from './auth.js';
import { SupabaseService, SUPABASE_URL } from './supabase.js';
import { PinLockManager } from './pin-lock.js';
import { NutritionCalculator, HEALTHY_FOOD_PRESETS, MEAL_RECOMMENDATIONS } from './nutrition.js';
import { WorkoutProgramsManager } from './workout-programs.js';
import { FriendsManager } from './friends.js';
import { LogManager } from './log-manager.js';
import { ActivityCalendar } from './calendar.js';
import { UIManager } from './ui.js';
import { setupImagePreview } from './gdrive-helper.js';

class WorkoutDiaryApp {
  constructor() {
    this.selectedDate = this.getTodayDateString();
    this.calendar = null;
    this.pinManager = null;
  }

  getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  init() {
    // 1. Initialize Storage & Seed Data
    StorageService.init();

    // 2. Setup PIN Lock Controller
    this.pinManager = new PinLockManager(
      () => {
        // PIN Unlocked Callback
        UIManager.showToast('ปลดล็อกหน้าจอเรียบร้อยแล้ว');
      },
      () => {
        // Switch user / Log out Callback
        AuthService.logout();
        this.renderAuthScreen();
      }
    );

    // 3. Setup Calendar
    this.calendar = new ActivityCalendar((clickedDate) => {
      ActivityCalendar.showDayDetailModal(clickedDate, (targetDate) => {
        this.selectedDate = targetDate;
        this.updateDatePickers();
        UIManager.switchView('daily-logs');
        this.refreshActiveLogTab();
      });
      UIManager.refreshIcons();
    });

    // 4. Bind DOM Events
    this.bindAuthEvents();
    this.bindNavigationEvents();
    this.bindDailyLogEvents();
    this.bindProgramEvents();
    this.bindFriendsEvents();
    this.bindProfileEvents();
    this.bindModalEvents();
    this.bindImagePreviewers();

    // 5. Check Initial Auth State
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      this.renderAuthScreen();
    } else {
      this.renderApp();
      if (StorageService.isPinLocked()) {
        this.pinManager.show();
      }
    }

    UIManager.refreshIcons();
  }

  // ================= AUTH MANAGEMENT =================
  renderAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('main-layout').classList.add('hidden');
    document.getElementById('pin-lock-screen').classList.add('hidden');
    UIManager.refreshIcons();
  }

  renderApp() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-layout').classList.remove('hidden');

    // Update Header Date
    const dateDisplay = document.getElementById('current-date-display');
    if (dateDisplay) {
      const d = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateDisplay.textContent = d.toLocaleDateString('th-TH', options);
    }

    // Update User Profile in Sidebar & Profile View
    this.updateUserUI(user);

    // Initialize Date Pickers
    this.updateDatePickers();

    // Render Views Data
    this.calendar.init();
    this.renderPrograms('all');
    this.renderFriends();
    this.refreshAllLogs();
    this.loadMealRecommendation();

    UIManager.refreshIcons();
  }

  updateUserUI(user) {
    if (!user) return;
    const initials = user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'WD';
    
    // Sidebar
    const avText = document.getElementById('user-avatar-text');
    const nameDisp = document.getElementById('user-name-display');
    if (avText) avText.textContent = initials;
    if (nameDisp) nameDisp.textContent = user.fullName || user.username;

    // Profile Screen
    const profAv = document.getElementById('profile-avatar-lg');
    const profName = document.getElementById('profile-hero-name');
    const profUname = document.getElementById('profile-hero-username');
    const profGen = document.getElementById('profile-gender-badge');
    const profAge = document.getElementById('profile-age-badge');
    const pWeight = document.getElementById('profile-stat-weight');
    const pHeight = document.getElementById('profile-stat-height');
    const pBmi = document.getElementById('profile-stat-bmi');

    if (profAv) profAv.textContent = initials;
    if (profName) profName.textContent = user.fullName || user.username;
    if (profUname) profUname.textContent = `@${user.username}`;
    if (profGen) profGen.textContent = user.gender === 'male' ? 'ชาย' : (user.gender === 'female' ? 'หญิง' : 'อื่นๆ');
    if (profAge) profAge.textContent = `อายุ ${FriendsManager.calculateAge(user.dob)} ปี`;
    if (pWeight) pWeight.textContent = user.weight || '--';
    if (pHeight) pHeight.textContent = user.height || '--';
    
    const bmiRes = NutritionCalculator.calculateBmi(user.weight, user.height);
    if (pBmi) pBmi.textContent = bmiRes.bmi || '--';
  }

  bindAuthEvents() {
    // Switch between Login and Register tabs
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    if (tabLoginBtn && tabRegBtn) {
      tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
      });

      tabRegBtn.addEventListener('click', () => {
        tabRegBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      });
    }

    // Login Form Submit (Username or Email)
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const res = AuthService.login(identifier, password);
        if (res.success) {
          UIManager.showToast(`ยินดีต้อนรับคุณ ${res.user.fullName || res.user.username}`);
          this.renderApp();
        } else {
          UIManager.showToast(res.message, 'error');
        }
      });
    }

    // Register Form Submit
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          fullName: document.getElementById('reg-fullname').value,
          username: document.getElementById('reg-username').value,
          email: document.getElementById('reg-email').value,
          password: document.getElementById('reg-password').value,
          pin: document.getElementById('reg-pin').value,
          gender: document.getElementById('reg-gender').value,
          dob: document.getElementById('reg-dob').value,
          weight: document.getElementById('reg-weight').value,
          height: document.getElementById('reg-height').value
        };

        const res = AuthService.register(data);
        if (res.success) {
          UIManager.triggerConfetti();
          UIManager.showToast('สมัครสมาชิกสำเร็จแล้ว! เข้าสู่ระบบอัตโนมัติ');
          this.renderApp();
        } else {
          UIManager.showToast(res.message, 'error');
        }
      });
    }

    // Logout Buttons
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
          AuthService.logout();
          this.renderAuthScreen();
          UIManager.showToast('ออกจากระบบเรียบร้อย');
        }
      });
    }
  }

  // ================= NAVIGATION & ROUTING =================
  bindNavigationEvents() {
    // Sidebar Items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) {
          UIManager.switchView(view);
          if (view === 'calendar') this.calendar.render();
        }
      });
    });

    // Mobile Bottom Nav Items
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) {
          UIManager.switchView(view);
          if (view === 'calendar') this.calendar.render();
        }
      });
    });

    // Mobile Menu Hamburger Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Quick Log Action Dropdown
    const quickLogBtn = document.getElementById('btn-quick-log');
    const dropdown = document.getElementById('quick-log-dropdown');
    if (quickLogBtn && dropdown) {
      quickLogBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
    }

    // Lock screen buttons
    const lockScreenBtn = document.getElementById('btn-lock-screen');
    const headerLockBtn = document.getElementById('btn-header-lock');
    const triggerPinBtn = document.getElementById('btn-trigger-pin-lock');

    [lockScreenBtn, headerLockBtn, triggerPinBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.pinManager.show();
        });
      }
    });

    // Calendar Toolbar Navigation
    const calPrev = document.getElementById('cal-prev-month');
    const calNext = document.getElementById('cal-next-month');
    const calToday = document.getElementById('cal-btn-today');

    if (calPrev) calPrev.addEventListener('click', () => this.calendar.prevMonth());
    if (calNext) calNext.addEventListener('click', () => this.calendar.nextMonth());
    if (calToday) calToday.addEventListener('click', () => this.calendar.goToToday());

    // Dashboard "View All" logs button
    const gotoLogsBtn = document.getElementById('btn-goto-daily-logs');
    if (gotoLogsBtn) {
      gotoLogsBtn.addEventListener('click', () => UIManager.switchView('daily-logs'));
    }
  }

  // ================= DAILY LOGS & CRUD =================
  updateDatePickers() {
    const dateInput = document.getElementById('daily-log-date-picker');
    const dateText = document.getElementById('daily-log-date-text');

    if (dateInput) dateInput.value = this.selectedDate;
    if (dateText) {
      const todayStr = this.getTodayDateString();
      if (this.selectedDate === todayStr) {
        dateText.textContent = 'วันนี้ (' + LogManager.formatDateThai(this.selectedDate) + ')';
      } else {
        dateText.textContent = LogManager.formatDateThai(this.selectedDate);
      }
    }

    // Sync modal date inputs
    ['food-date', 'workout-date', 'outdoor-date', 'body-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = this.selectedDate;
    });
  }

  refreshAllLogs() {
    const mealsContainer = document.getElementById('meals-list-container');
    const wkContainer = document.getElementById('workouts-list-container');
    const outContainer = document.getElementById('outdoor-list-container');
    const bodyTable = document.getElementById('body-metrics-table-body');
    const bmiGauge = document.getElementById('bmi-gauge-box');

    LogManager.renderFoodLogs(mealsContainer, this.selectedDate);
    LogManager.renderWorkoutLogs(wkContainer, this.selectedDate);
    LogManager.renderOutdoorLogs(outContainer, this.selectedDate);
    LogManager.renderBodyMetrics(bodyTable, bmiGauge, this.selectedDate);
    LogManager.updateDashboard(this.getTodayDateString());
    
    if (this.calendar) this.calendar.render();
    UIManager.refreshIcons();
  }

  refreshActiveLogTab() {
    this.refreshAllLogs();
  }

  bindDailyLogEvents() {
    // Previous & Next Day buttons
    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const dateInput = document.getElementById('daily-log-date-picker');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const cur = new Date(this.selectedDate + 'T00:00:00');
        cur.setDate(cur.getDate() - 1);
        this.selectedDate = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
        this.updateDatePickers();
        this.refreshActiveLogTab();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const cur = new Date(this.selectedDate + 'T00:00:00');
        cur.setDate(cur.getDate() + 1);
        this.selectedDate = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
        this.updateDatePickers();
        this.refreshActiveLogTab();
      });
    }

    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
          this.selectedDate = e.target.value;
          this.updateDatePickers();
          this.refreshActiveLogTab();
        }
      });
    }

    // Daily Log Category Tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.log-tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-log-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');

        this.refreshActiveLogTab();
      });
    });

    // Preset Food Chips in Food Modal
    const chipsContainer = document.getElementById('food-preset-chips');
    if (chipsContainer) {
      chipsContainer.innerHTML = HEALTHY_FOOD_PRESETS.map(p => `
        <button type="button" class="food-chip" data-name="${p.name}" data-cal="${p.calories}" data-p="${p.protein}" data-c="${p.carbs}" data-f="${p.fats}">
          + ${p.name} (${p.calories} kcal)
        </button>
      `).join('');

      chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.food-chip');
        if (!chip) return;

        document.getElementById('food-name').value = chip.getAttribute('data-name');
        document.getElementById('food-calories').value = chip.getAttribute('data-cal');
        document.getElementById('food-protein').value = chip.getAttribute('data-p');
        document.getElementById('food-carbs').value = chip.getAttribute('data-c');
        document.getElementById('food-fats').value = chip.getAttribute('data-f');
      });
    }

    // Refresh Meal Recommendation Widget
    const refreshMealBtn = document.getElementById('btn-refresh-meal-rec');
    if (refreshMealBtn) {
      refreshMealBtn.addEventListener('click', () => {
        this.loadMealRecommendation();
        UIManager.showToast('สุ่มเมนูสุขภาพเรียบร้อย');
      });
    }

    // Dynamic Exercise Rows in Workout Modal
    const addRowBtn = document.getElementById('btn-add-exercise-row');
    const rowsContainer = document.getElementById('exercise-rows-container');

    const appendExerciseRow = (name = '', sets = 3, reps = 10, weight = 20) => {
      if (!rowsContainer) return;
      const row = document.createElement('div');
      row.className = 'exercise-row';
      row.innerHTML = `
        <input type="text" class="form-input ex-name" placeholder="ชื่อท่า เช่น Bench Press" value="${name}" required>
        <input type="number" class="form-input ex-sets" placeholder="เซ็ต" value="${sets}" min="1" required>
        <input type="number" class="form-input ex-reps" placeholder="ครั้ง" value="${reps}" min="1" required>
        <input type="number" class="form-input ex-weight" placeholder="kg" value="${weight}" step="0.5">
        <button type="button" class="btn-icon-soft text-rose btn-remove-ex-row" title="ลบท่านี้"><i data-lucide="x"></i></button>
      `;
      rowsContainer.appendChild(row);
      UIManager.refreshIcons();

      row.querySelector('.btn-remove-ex-row').addEventListener('click', () => {
        row.remove();
      });
    };

    if (addRowBtn) {
      addRowBtn.addEventListener('click', () => appendExerciseRow());
    }

    // Initialize 2 default rows for workout modal
    if (rowsContainer && rowsContainer.children.length === 0) {
      appendExerciseRow('Barbell Bench Press', 4, 8, 60);
      appendExerciseRow('Incline Dumbbell Press', 3, 10, 22);
    }

    // Real-time BMI Calculation in Body Modal
    const weightInput = document.getElementById('body-weight');
    const heightInput = document.getElementById('body-height');
    const bmiValPreview = document.getElementById('modal-bmi-calc-val');
    const bmiBadgePreview = document.getElementById('modal-bmi-calc-badge');

    const updateModalBmiPreview = () => {
      const w = parseFloat(weightInput?.value);
      const h = parseFloat(heightInput?.value);
      if (w > 0 && h > 0) {
        const res = NutritionCalculator.calculateBmi(w, h);
        if (bmiValPreview) bmiValPreview.textContent = res.bmi;
        if (bmiBadgePreview) {
          bmiBadgePreview.textContent = res.category;
          bmiBadgePreview.className = 'badge';
          bmiBadgePreview.style.borderColor = res.color;
          bmiBadgePreview.style.color = '#fff';
        }
      }
    };

    if (weightInput) weightInput.addEventListener('input', updateModalBmiPreview);
    if (heightInput) heightInput.addEventListener('input', updateModalBmiPreview);

    // Global Log Deletion Event Delegation
    document.addEventListener('click', (e) => {
      // Delete Food
      const delFood = e.target.closest('.btn-delete-food');
      if (delFood) {
        const id = delFood.getAttribute('data-id');
        if (confirm('ต้องการลบรายการอาหารนี้ใช่หรือไม่?')) {
          StorageService.deleteFoodLog(id);
          this.refreshAllLogs();
          UIManager.showToast('ลบรายการอาหารสำเร็จ');
        }
      }

      // Delete Workout
      const delWk = e.target.closest('.btn-delete-workout');
      if (delWk) {
        const id = delWk.getAttribute('data-id');
        if (confirm('ต้องการลบบันทึกออกกำลังกายนี้ใช่หรือไม่?')) {
          StorageService.deleteWorkoutLog(id);
          this.refreshAllLogs();
          UIManager.showToast('ลบบันทึกออกกำลังกายสำเร็จ');
        }
      }

      // Delete Outdoor
      const delOut = e.target.closest('.btn-delete-outdoor');
      if (delOut) {
        const id = delOut.getAttribute('data-id');
        if (confirm('ต้องการลบบันทึกกิจกรรม Outdoor นี้ใช่หรือไม่?')) {
          StorageService.deleteOutdoorLog(id);
          this.refreshAllLogs();
          UIManager.showToast('ลบบันทึกกิจกรรมสำเร็จ');
        }
      }

      // Delete Body Log
      const delBody = e.target.closest('.btn-delete-body');
      if (delBody) {
        const id = delBody.getAttribute('data-id');
        if (confirm('ต้องการลบบันทึกสัดส่วนนี้ใช่หรือไม่?')) {
          StorageService.deleteBodyLog(id);
          this.refreshAllLogs();
          UIManager.showToast('ลบประวัติสัดส่วนสำเร็จ');
        }
      }
    });
  }

  loadMealRecommendation() {
    const box = document.getElementById('recommended-meal-box');
    if (!box) return;
    const rec = NutritionCalculator.getRandomRecommendation();
    box.innerHTML = `
      <div class="rec-meal-icon">${rec.icon}</div>
      <div class="rec-meal-details">
        <h5>${rec.title} <span class="badge badge-emerald" style="font-size:0.7rem;">${rec.tag}</span></h5>
        <p>${rec.desc}</p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
          🔥 ${rec.calories} kcal | P: ${rec.protein}g | C: ${rec.carbs}g | F: ${rec.fats}g
        </div>
      </div>
    `;
  }

  // ================= FORM SUBMISSIONS =================
  bindModalEvents() {
    const user = AuthService.getCurrentUser();

    // 1. Food Log Form
    const foodForm = document.getElementById('form-food-log');
    if (foodForm) {
      foodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = {
          id: 'food_' + Date.now(),
          userId: AuthService.getCurrentUser().id,
          date: document.getElementById('food-date').value || this.selectedDate,
          mealType: document.getElementById('food-meal-type').value,
          foodName: document.getElementById('food-name').value,
          calories: parseFloat(document.getElementById('food-calories').value) || 0,
          protein: parseFloat(document.getElementById('food-protein').value) || 0,
          carbs: parseFloat(document.getElementById('food-carbs').value) || 0,
          fats: parseFloat(document.getElementById('food-fats').value) || 0,
          imageUrl: document.getElementById('food-image-url').value,
          notes: document.getElementById('food-notes').value
        };

        StorageService.addFoodLog(item);
        foodForm.reset();
        document.getElementById('food-img-preview-box')?.classList.add('hidden');
        UIManager.closeModal('modal-food-log');
        this.refreshAllLogs();
        UIManager.showToast('บันทึกรายการอาหารเรียบร้อยแล้ว');
      });
    }

    // 2. Workout Log Form
    const wkForm = document.getElementById('form-workout-log');
    if (wkForm) {
      wkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const exercises = [];
        document.querySelectorAll('#exercise-rows-container .exercise-row').forEach(row => {
          const name = row.querySelector('.ex-name')?.value;
          const sets = parseInt(row.querySelector('.ex-sets')?.value) || 1;
          const reps = parseInt(row.querySelector('.ex-reps')?.value) || 10;
          const weight = parseFloat(row.querySelector('.ex-weight')?.value) || 0;
          if (name) exercises.push({ name, sets, reps, weight });
        });

        const item = {
          id: 'wk_' + Date.now(),
          userId: AuthService.getCurrentUser().id,
          date: document.getElementById('workout-date').value || this.selectedDate,
          category: document.getElementById('workout-category').value,
          title: document.getElementById('workout-title').value,
          duration: parseInt(document.getElementById('workout-duration').value) || 45,
          caloriesBurned: parseInt(document.getElementById('workout-calories-burned').value) || 300,
          exercises: exercises,
          imageUrl: document.getElementById('workout-image-url').value,
          notes: document.getElementById('workout-notes').value
        };

        StorageService.addWorkoutLog(item);
        wkForm.reset();
        document.getElementById('workout-img-preview-box')?.classList.add('hidden');
        UIManager.closeModal('modal-workout-log');
        UIManager.triggerConfetti();
        this.refreshAllLogs();
        UIManager.showToast('บันทึกการออกกำลังกายสำเร็จ! 🔥');
      });
    }

    // 3. Outdoor Log Form
    const outForm = document.getElementById('form-outdoor-log');
    if (outForm) {
      outForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = {
          id: 'out_' + Date.now(),
          userId: AuthService.getCurrentUser().id,
          date: document.getElementById('outdoor-date').value || this.selectedDate,
          type: document.getElementById('outdoor-type').value,
          title: document.getElementById('outdoor-title').value,
          location: document.getElementById('outdoor-location').value,
          distance: parseFloat(document.getElementById('outdoor-distance').value) || 0,
          durationText: document.getElementById('outdoor-duration-text').value,
          pace: document.getElementById('outdoor-pace').value,
          calories: parseInt(document.getElementById('outdoor-calories').value) || 0,
          rank: document.getElementById('outdoor-rank').value,
          weather: document.getElementById('outdoor-weather').value,
          imageUrl: document.getElementById('outdoor-image-url').value,
          notes: document.getElementById('outdoor-notes').value
        };

        StorageService.addOutdoorLog(item);
        outForm.reset();
        document.getElementById('outdoor-img-preview-box')?.classList.add('hidden');
        UIManager.closeModal('modal-outdoor-log');
        UIManager.triggerConfetti();
        this.refreshAllLogs();
        UIManager.showToast('บันทึกกิจกรรม Outdoor สำเร็จ! 🏆');
      });
    }

    // 4. Body Metrics Log Form
    const bodyForm = document.getElementById('form-body-log');
    if (bodyForm) {
      bodyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('body-weight').value) || 68;
        const height = parseFloat(document.getElementById('body-height').value) || 175;
        const bmiRes = NutritionCalculator.calculateBmi(weight, height);

        const item = {
          id: 'body_' + Date.now(),
          userId: AuthService.getCurrentUser().id,
          date: document.getElementById('body-date').value || this.selectedDate,
          weight: weight,
          height: height,
          bodyFat: parseFloat(document.getElementById('body-fat').value) || 0,
          chest: parseFloat(document.getElementById('body-chest').value) || 0,
          waist: parseFloat(document.getElementById('body-waist').value) || 0,
          hips: parseFloat(document.getElementById('body-hips').value) || 0,
          arms: parseFloat(document.getElementById('body-arms').value) || 0,
          bmi: bmiRes.bmi,
          imageUrl: document.getElementById('body-image-url').value
        };

        // Also update user's profile weight & height
        StorageService.updateCurrentUser({ weight, height });

        StorageService.addBodyLog(item);
        bodyForm.reset();
        document.getElementById('body-img-preview-box')?.classList.add('hidden');
        UIManager.closeModal('modal-body-log');
        this.updateUserUI(AuthService.getCurrentUser());
        this.refreshAllLogs();
        UIManager.showToast('บันทึกสถิติร่างกาย & BMI เรียบร้อยแล้ว');
      });
    }

    // Generic Modal Close Buttons & Triggers
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-open-modal');
        if (modalId) {
          this.updateDatePickers();
          UIManager.openModal(modalId);
        }
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        UIManager.closeAllModals();
      });
    });
  }

  // ================= GOOGLE DRIVE IMAGE PREVIEW =================
  bindImagePreviewers() {
    setupImagePreview(
      document.getElementById('food-image-url'),
      document.getElementById('food-img-preview-box'),
      document.getElementById('food-img-preview'),
      document.getElementById('btn-preview-food-img')
    );

    setupImagePreview(
      document.getElementById('workout-image-url'),
      document.getElementById('workout-img-preview-box'),
      document.getElementById('workout-img-preview'),
      document.getElementById('btn-preview-workout-img')
    );

    setupImagePreview(
      document.getElementById('outdoor-image-url'),
      document.getElementById('outdoor-img-preview-box'),
      document.getElementById('outdoor-img-preview'),
      document.getElementById('btn-preview-outdoor-img')
    );

    setupImagePreview(
      document.getElementById('body-image-url'),
      document.getElementById('body-img-preview-box'),
      document.getElementById('body-img-preview'),
      document.getElementById('btn-preview-body-img')
    );
  }

  // ================= WORKOUT PROGRAMS =================
  renderPrograms(filterLevel = 'all') {
    const container = document.getElementById('programs-grid-container');
    if (!container) return;

    const programs = WorkoutProgramsManager.getPrograms(filterLevel);

    container.innerHTML = programs.map(prog => `
      <div class="card glass-panel program-card ${prog.levelClass}">
        <div class="program-card-header">
          <span class="badge ${prog.level === 'beginner' ? 'badge-emerald' : (prog.level === 'intermediate' ? 'badge-amber' : 'badge-rose')}">
            ${prog.levelLabel}
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i data-lucide="clock"></i> ${prog.duration}</span>
        </div>

        <div class="program-card-body">
          <h3>${prog.title}</h3>
          <p>${prog.subtitle}</p>

          <ul class="program-features-list">
            ${prog.features.map(f => `<li><i data-lucide="check-circle-2"></i> ${f}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <button class="btn btn-secondary btn-sm btn-block btn-view-program" data-id="${prog.id}">
            <i data-lucide="eye"></i> ดูตารางฝึก
          </button>
          <button class="btn btn-primary btn-sm btn-download-prog-direct" data-id="${prog.id}" title="ดาวน์โหลดตาราง">
            <i data-lucide="download"></i>
          </button>
        </div>
      </div>
    `).join('');

    UIManager.refreshIcons();
  }

  bindProgramEvents() {
    // Level filter tabs
    document.querySelectorAll('.program-level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.program-level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const level = btn.getAttribute('data-level') || 'all';
        this.renderPrograms(level);
      });
    });

    // Open Program Details / Download Modal
    document.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.btn-view-program');
      if (viewBtn) {
        const progId = viewBtn.getAttribute('data-id');
        this.openProgramDetailModal(progId);
      }

      const downloadDirectBtn = e.target.closest('.btn-download-prog-direct');
      if (downloadDirectBtn) {
        const progId = downloadDirectBtn.getAttribute('data-id');
        const prog = WorkoutProgramsManager.getProgramById(progId);
        if (prog) {
          WorkoutProgramsManager.downloadProgramAsText(prog);
          UIManager.showToast(`ดาวน์โหลดโปรแกรม ${prog.title} เรียบร้อยแล้ว`);
        }
      }
    });

    // Program Modal Actions (Print & Download)
    const btnPrint = document.getElementById('btn-print-program');
    const btnDownloadText = document.getElementById('btn-download-program-json');

    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    if (btnDownloadText) {
      btnDownloadText.addEventListener('click', () => {
        const currentProgId = btnDownloadText.getAttribute('data-current-prog-id');
        const prog = WorkoutProgramsManager.getProgramById(currentProgId);
        if (prog) {
          WorkoutProgramsManager.downloadProgramAsText(prog);
          UIManager.showToast('ดาวน์โหลดไฟล์ตารางฝึกสำเร็จ');
        }
      });
    }
  }

  openProgramDetailModal(progId) {
    const prog = WorkoutProgramsManager.getProgramById(progId);
    if (!prog) return;

    const modal = document.getElementById('modal-program-detail');
    const titleEl = document.getElementById('prog-detail-title');
    const levelEl = document.getElementById('prog-detail-level');
    const contentEl = document.getElementById('prog-detail-content');
    const dlBtn = document.getElementById('btn-download-program-json');

    if (titleEl) titleEl.textContent = prog.title;
    if (levelEl) {
      levelEl.textContent = prog.levelLabel;
      levelEl.className = `badge ${prog.level === 'beginner' ? 'badge-emerald' : (prog.level === 'intermediate' ? 'badge-amber' : 'badge-rose')}`;
    }
    if (dlBtn) dlBtn.setAttribute('data-current-prog-id', prog.id);

    if (contentEl) {
      contentEl.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${prog.subtitle}</p>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.85rem;">
            <div>🎯 <strong>เป้าหมายโปรแกรม:</strong> ${prog.target}</div>
            <div>⏱️ <strong>ความถี่:</strong> ${prog.duration}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${prog.schedule.map(sch => `
            <div class="card glass-panel" style="padding: 1rem;">
              <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 0.5rem;">${sch.day}</h4>
              <div class="table-responsive">
                <table class="data-table" style="font-size: 0.85rem;">
                  <thead>
                    <tr>
                      <th>ท่าฝึก</th>
                      <th>จำนวนเซ็ต</th>
                      <th>จำนวนครั้ง</th>
                      <th>เวลาพัก</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sch.exercises.map(ex => `
                      <tr>
                        <td><strong>${ex.name}</strong></td>
                        <td>${ex.sets}</td>
                        <td>${ex.reps}</td>
                        <td><span style="color:var(--text-muted);">${ex.rest}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (modal) {
      modal.classList.remove('hidden');
      UIManager.refreshIcons();
    }
  }

  // ================= FRIENDS & COMMUNITY =================
  renderFriends(searchQuery = '') {
    const grid = document.getElementById('friends-grid-container');
    const countDisplay = document.getElementById('friends-count-display');
    FriendsManager.renderFriendsList(grid, countDisplay, searchQuery);
    UIManager.refreshIcons();
  }

  bindFriendsEvents() {
    // Search input filter
    const searchInput = document.getElementById('friends-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderFriends(e.target.value);
      });
    }

    // Auto Age Calculator on DOB input change in Add Friend Modal
    const dobInput = document.getElementById('friend-dob');
    const ageDisplay = document.getElementById('friend-calculated-age-text');
    if (dobInput && ageDisplay) {
      dobInput.addEventListener('change', (e) => {
        const age = FriendsManager.calculateAge(e.target.value);
        ageDisplay.innerHTML = `<span class="text-emerald font-bold" style="font-size:1.1rem;">อายุ ${age} ปี</span>`;
      });
    }

    // Add Friend Form Submit
    const addFriendForm = document.getElementById('form-add-friend');
    if (addFriendForm) {
      addFriendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = AuthService.getCurrentUser();
        if (!user) return;

        const friend = {
          id: 'fr_' + Date.now(),
          userId: user.id,
          name: document.getElementById('friend-name').value,
          gender: document.getElementById('friend-gender').value,
          dob: document.getElementById('friend-dob').value,
          avatarUrl: document.getElementById('friend-avatar-url').value,
          bio: document.getElementById('friend-bio').value
        };

        FriendsManager.addFriend(friend);
        addFriendForm.reset();
        if (ageDisplay) ageDisplay.innerHTML = `<span class="text-emerald font-bold">-- ปี</span>`;
        UIManager.closeModal('modal-add-friend');
        this.renderFriends();
        UIManager.showToast(`เพิ่มเพื่อน ${friend.name} สำเร็จแล้ว!`);
      });
    }

    // Delete Friend
    document.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-friend');
      if (delBtn) {
        const id = delBtn.getAttribute('data-friend-id');
        if (confirm('คุณต้องการลบเพื่อนคนนี้ใช่หรือไม่?')) {
          FriendsManager.deleteFriend(id);
          this.renderFriends();
          UIManager.showToast('ลบเพื่อนเรียบร้อย');
        }
      }
    });
  }

  // ================= PROFILE & SETTINGS =================
  bindProfileEvents() {
    // Edit Profile Modal Open
    const editProfBtn = document.getElementById('btn-edit-profile-open');
    if (editProfBtn) {
      editProfBtn.addEventListener('click', () => {
        const user = AuthService.getCurrentUser();
        if (!user) return;
        document.getElementById('edit-profile-fullname').value = user.fullName || '';
        document.getElementById('edit-profile-gender').value = user.gender || 'male';
        document.getElementById('edit-profile-dob').value = user.dob || '';
        document.getElementById('edit-profile-weight').value = user.weight || '';
        document.getElementById('edit-profile-height').value = user.height || '';
        UIManager.openModal('modal-edit-profile');
      });
    }

    // Edit Profile Form Submit
    const editProfForm = document.getElementById('form-edit-profile');
    if (editProfForm) {
      editProfForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          fullName: document.getElementById('edit-profile-fullname').value,
          gender: document.getElementById('edit-profile-gender').value,
          dob: document.getElementById('edit-profile-dob').value,
          weight: parseFloat(document.getElementById('edit-profile-weight').value),
          height: parseFloat(document.getElementById('edit-profile-height').value)
        };

        AuthService.updateProfile(updated);
        this.updateUserUI(AuthService.getCurrentUser());
        this.refreshAllLogs();
        UIManager.closeModal('modal-edit-profile');
        UIManager.showToast('บันทึกข้อมูลส่วนตัวสำเร็จ');
      });
    }

    // Change PIN Modal Open
    const changePinBtn = document.getElementById('btn-change-pin-open');
    if (changePinBtn) {
      changePinBtn.addEventListener('click', () => {
        document.getElementById('input-new-pin').value = '';
        document.getElementById('input-confirm-pin').value = '';
        UIManager.openModal('modal-change-pin');
      });
    }

    // Change PIN Form Submit
    const changePinForm = document.getElementById('form-change-pin');
    if (changePinForm) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPin = document.getElementById('input-new-pin').value;
        const confirmPin = document.getElementById('input-confirm-pin').value;

        if (newPin !== confirmPin) {
          UIManager.showToast('รหัส PIN ทั้งสองช่องไม่ตรงกัน', 'error');
          return;
        }

        const res = AuthService.updatePin(newPin);
        if (res.success) {
          UIManager.closeModal('modal-change-pin');
          UIManager.showToast(res.message);
        } else {
          UIManager.showToast(res.message, 'error');
        }
      });
    }

    // Export Backup JSON
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = StorageService.exportBackupJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Workout_Diary_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        UIManager.showToast('ส่งออกไฟล์สำรองข้อมูลเรียบร้อย');
      });
    }

    // Import Backup JSON
    const importInput = document.getElementById('import-data-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const success = StorageService.importBackupJSON(event.target.result);
          if (success) {
            UIManager.showToast('นำเข้าข้อมูลสำเร็จ! กำลังรีโหลดหน้าเว็บ');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            UIManager.showToast('ไฟล์สำรองไม่ถูกต้อง', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // ================= SUPABASE CLOUD EVENTS =================
    const checkSupabaseStatus = async () => {
      const statusBadge = document.getElementById('supabase-status-badge');
      if (!statusBadge) return;
      const res = await SupabaseService.checkConnection();
      if (res.connected) {
        statusBadge.textContent = '🟢 Supabase Connected';
        statusBadge.className = 'badge badge-emerald';
      } else {
        statusBadge.textContent = '🟡 Supabase Ready (Local Cache Active)';
        statusBadge.className = 'badge badge-amber';
      }
    };
    checkSupabaseStatus();

    // 1. Seed Supabase Mockup Data Button
    const seedSupabaseBtn = document.getElementById('btn-seed-supabase');
    if (seedSupabaseBtn) {
      seedSupabaseBtn.addEventListener('click', async () => {
        seedSupabaseBtn.disabled = true;
        seedSupabaseBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> กำลังส่งข้อมูล...';
        UIManager.refreshIcons();

        const res = await SupabaseService.seedMockData(INITIAL_DEMO_DATA);
        seedSupabaseBtn.disabled = false;
        seedSupabaseBtn.innerHTML = '<i data-lucide="cloud-upload"></i> Mockup Data ขึ้น Supabase';
        UIManager.refreshIcons();

        if (res.success) {
          UIManager.triggerConfetti();
          UIManager.showToast('ส่งข้อมูลจำลองขึ้น Supabase สำเร็จเรียบร้อยแล้ว! 🚀');
          checkSupabaseStatus();
        } else {
          UIManager.showToast('ยังไม่ได้รันคำสั่ง SQL สร้างตารางใน Supabase กรุณากด "ดูคำสั่ง SQL"', 'error');
          this.openSqlSchemaModal();
        }
      });
    }

    // 2. Sync from Supabase Button
    const syncSupabaseBtn = document.getElementById('btn-sync-supabase');
    if (syncSupabaseBtn) {
      syncSupabaseBtn.addEventListener('click', async () => {
        syncSupabaseBtn.disabled = true;
        syncSupabaseBtn.innerHTML = '<i data-lucide="refresh-cw" class="animate-spin"></i> ซิงค์ข้อมูล...';
        UIManager.refreshIcons();

        await StorageService.syncFromSupabase();
        syncSupabaseBtn.disabled = false;
        syncSupabaseBtn.innerHTML = '<i data-lucide="refresh-cw"></i> ซิงค์จาก Supabase';
        UIManager.refreshIcons();

        this.refreshAllLogs();
        this.renderFriends();
        UIManager.showToast('ซิงค์ข้อมูลล่าสุดจาก Supabase Cloud เรียบร้อยแล้ว');
      });
    }

    // 3. View SQL Schema Modal
    const viewSqlBtn = document.getElementById('btn-view-sql-schema');
    if (viewSqlBtn) {
      viewSqlBtn.addEventListener('click', () => {
        this.openSqlSchemaModal();
      });
    }

    // 4. Copy SQL Button
    const copySqlBtn = document.getElementById('btn-copy-sql');
    if (copySqlBtn) {
      copySqlBtn.addEventListener('click', () => {
        const textarea = document.getElementById('sql-schema-textarea');
        if (textarea) {
          navigator.clipboard.writeText(textarea.value);
          UIManager.showToast('คัดลอกคำสั่ง SQL Schema ทั้งหมดเรียบร้อยแล้ว');
        }
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById('btn-reset-demo-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('คำเตือน: การรีเซ็ตจะล้างข้อมูลปัจจุบันและแทนที่ด้วยข้อมูลตัวอย่าง คุณต้องการดำเนินการต่อหรือไม่?')) {
          StorageService.resetToDemoData();
          UIManager.showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อย กำลังรีโหลด');
          setTimeout(() => window.location.reload(), 800);
        }
      });
    }
  }

  openSqlSchemaModal() {
    const textarea = document.getElementById('sql-schema-textarea');
    if (textarea) {
      textarea.value = `-- ==============================================================================
-- WORKOUT DIARY - SUPABASE DATABASE SCHEMA & MOCK DATA
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/rfuuwurlwgzorudcssny/sql
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  pin VARCHAR(4) NOT NULL DEFAULT '1234',
  full_name TEXT NOT NULL,
  gender TEXT DEFAULT 'male',
  dob DATE DEFAULT '2000-01-01',
  weight NUMERIC(5,2) DEFAULT 68.5,
  height NUMERIC(5,2) DEFAULT 175.0,
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOOD LOGS TABLE
CREATE TABLE IF NOT EXISTS public.food_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories NUMERIC(7,2) DEFAULT 0,
  protein NUMERIC(6,2) DEFAULT 0,
  carbs NUMERIC(6,2) DEFAULT 0,
  fats NUMERIC(6,2) DEFAULT 0,
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  duration INTEGER DEFAULT 45,
  calories_burned INTEGER DEFAULT 300,
  exercises JSONB DEFAULT '[]'::jsonb,
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OUTDOOR & COMPETITION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.outdoor_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  distance NUMERIC(6,2) DEFAULT 0,
  duration_text TEXT DEFAULT '',
  pace TEXT DEFAULT '',
  calories INTEGER DEFAULT 0,
  rank TEXT DEFAULT '',
  weather TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BODY METRICS & BMI LOGS TABLE
CREATE TABLE IF NOT EXISTS public.body_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  height NUMERIC(5,2) NOT NULL,
  body_fat NUMERIC(4,2) DEFAULT 0,
  chest NUMERIC(5,2) DEFAULT 0,
  waist NUMERIC(5,2) DEFAULT 0,
  hips NUMERIC(5,2) DEFAULT 0,
  arms NUMERIC(5,2) DEFAULT 0,
  bmi NUMERIC(4,2) DEFAULT 0,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FRIENDS TABLE
CREATE TABLE IF NOT EXISTS public.friends (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT DEFAULT 'male',
  dob DATE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outdoor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on food_logs" ON public.food_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on workout_logs" ON public.workout_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on outdoor_logs" ON public.outdoor_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on body_logs" ON public.body_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on friends" ON public.friends FOR ALL USING (true) WITH CHECK (true);

-- INSERT MOCK SEED DATA
INSERT INTO public.users (id, username, email, password, pin, full_name, gender, dob, weight, height, avatar)
VALUES ('usr_alex_001', 'alex', 'alex@fit.com', '123456', '1234', 'Alex Fit', 'male', '2000-04-12', 68.5, 175.0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.food_logs (id, user_id, date, meal_type, food_name, calories, protein, carbs, fats, image_url, notes)
VALUES 
('food_001', 'usr_alex_001', '2026-09-16', 'breakfast', 'ข้าวโอ๊ตต้มกล้วยหอม + นมแอลมอนด์ + เวย์โปรตีน 1 สกู๊ป', 420, 32, 58, 6, 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80', 'ทานก่อนซ้อมเช้า 1 ชั่วโมง ให้พลังงานดีมาก'),
('food_002', 'usr_alex_001', '2026-09-16', 'lunch', 'อกไก่ย่างสมุนไพร 200g + ข้าวไรซ์เบอร์รี่ + บรอกโคลีลวก', 520, 48, 52, 9, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', 'ดื่มน้ำเปล่า 600ml'),
('food_003', 'usr_alex_001', '2026-09-15', 'dinner', 'สเต็กแซลมอนย่างเกลือ + สลัดผักน้ำสลัดบัลซามิก', 480, 38, 18, 22, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80', 'โอเมก้า 3 ครบถ้วน')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workout_logs (id, user_id, date, category, title, duration, calories_burned, exercises, image_url, notes)
VALUES
('wk_001', 'usr_alex_001', '2026-09-16', 'weightlifting', 'Chest & Triceps Hypertrophy', 55, 360, '[{"name":"Barbell Bench Press","sets":4,"reps":8,"weight":75},{"name":"Incline Dumbbell Press","sets":3,"reps":10,"weight":24},{"name":"Cable Chest Fly","sets":3,"reps":12,"weight":15},{"name":"Tricep Rope Pushdown","sets":4,"reps":12,"weight":22}]'::jsonb, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80', 'เพิ่มน้ำหนัก Bench Press ได้ 2.5kg ฟอร์มดีไม่มีเจ็บ'),
('wk_002', 'usr_alex_001', '2026-09-14', 'cardio', 'Zone 2 Treadmill Run + Core Plank', 45, 410, '[{"name":"Treadmill Incline Run","sets":1,"reps":35,"weight":0},{"name":"Plank Hold","sets":3,"reps":60,"weight":0}]'::jsonb, 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80', 'คุม Heart Rate ไม่เกิน 140 bpm')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.outdoor_logs (id, user_id, date, type, title, location, distance, duration_text, pace, calories, rank, weather, image_url, notes)
VALUES
('out_001', 'usr_alex_001', '2026-09-13', 'marathon', 'Bangkok Mini Marathon 2026 (10.5K)', 'สะพานพระราม 8 - ถนนราชดำเนิน', 10.5, '00:52:14', '4:58', 680, 'อันดับที่ 84 (Overall Top 10%)', 'อากาศเย็นสบาย 25°C ฝนพรำเล็กน้อย', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80', 'ทำ New Personal Best สำเร็จ! บรรยากาศประทับใจมาก')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.body_logs (id, user_id, date, weight, height, body_fat, chest, waist, hips, arms, bmi, image_url)
VALUES
('body_001', 'usr_alex_001', '2026-09-16', 68.5, 175.0, 14.8, 39.5, 30.5, 37.0, 14.5, 22.4, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80'),
('body_002', 'usr_alex_001', '2026-09-01', 69.8, 175.0, 15.6, 39.0, 31.2, 37.5, 14.2, 22.8, '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.friends (id, user_id, name, gender, dob, avatar_url, bio)
VALUES
('fr_001', 'usr_alex_001', 'ณัฐวุฒิ สายวิ่ง (Nut)', 'male', '1998-08-15', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'ซ้อมวิ่งมาราธอน 4 วัน/สัปดาห์ เป้า Sub 4 ในปีนี้ 🏃‍♂️'),
('fr_002', 'usr_alex_001', 'พิมพ์ชนก ฟิตเนส (Pim)', 'female', '2001-02-20', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', 'ชอบเล่นพิลาทิส และเวทเทรนนิ่งเน้นก้น-ขา 🧘‍♀️✨'),
('fr_003', 'usr_alex_001', 'โค้ชบอย Powerlifting', 'male', '1995-11-03', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'SBD Total 520kg ยินดีให้คำแนะนำท่าสควอชและเบนช์เพรส 💪'),
('fr_004', 'usr_alex_001', 'เมษา นักปั่น', 'female', '1999-05-28', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', 'สายปั่น Sky Lane และทริปเขาใหญ่ 🚴‍♀️🌿')
ON CONFLICT (id) DO NOTHING;
`;
    }
    UIManager.openModal('modal-sql-schema');
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new WorkoutDiaryApp();
  app.init();
});

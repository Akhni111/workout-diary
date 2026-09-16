/**
 * Daily Log Manager & Dashboard Summary Engine
 */
import { StorageService } from './storage.js';
import { NutritionCalculator } from './nutrition.js';
import { parseGoogleDriveUrl } from './gdrive-helper.js';

export class LogManager {
  /**
   * Format Date String to Thai readable format (e.g. 16 ก.ย. 2026)
   */
  static formatDateThai(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  /**
   * Render Food / Meals Tab
   */
  static renderFoodLogs(containerEl, selectedDate) {
    if (!containerEl) return;
    const logs = StorageService.getDailyLogs();
    const user = StorageService.getCurrentUser();
    const foodItems = (logs.foodLogs || []).filter(f => f.userId === user?.id && f.date === selectedDate);

    const mealCategories = [
      { key: 'breakfast', label: 'มื้อเช้า (Breakfast)', icon: 'sunrise', color: 'text-amber' },
      { key: 'lunch', label: 'มื้อกลางวัน (Lunch)', icon: 'sun', color: 'text-emerald' },
      { key: 'dinner', label: 'มื้อเย็น (Dinner)', icon: 'moon', color: 'text-cyan' },
      { key: 'snack', label: 'ของว่าง / Pre-Workout', icon: 'coffee', color: 'text-purple' }
    ];

    if (foodItems.length === 0) {
      containerEl.innerHTML = `
        <div class="card glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🥗</div>
          <h4>ยังไม่มีบันทึกอาหารสำหรับวันที่เลือก</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">กดปุ่ม "เพิ่มรายการอาหาร" ด้านบนเพื่อเริ่มบันทึก</p>
        </div>
      `;
      return;
    }

    containerEl.innerHTML = mealCategories.map(cat => {
      const items = foodItems.filter(f => f.mealType === cat.key);
      const catCalories = items.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
      const catProtein = items.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);

      return `
        <div class="card glass-panel meal-block-card">
          <div class="meal-block-header">
            <h4 style="display:flex; align-items:center; gap:0.4rem; font-size: 1rem;">
              <i data-lucide="${cat.icon}" class="${cat.color}"></i>
              <span>${cat.label}</span>
            </h4>
            <span class="badge badge-emerald">${catCalories} kcal (${catProtein}g P)</span>
          </div>
          
          <div class="meal-items-list">
            ${items.length === 0 ? `
              <p style="color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem 0;">ไม่มีรายการอาหารในมื้อนี้</p>
            ` : items.map(item => {
              const imgUrl = parseGoogleDriveUrl(item.imageUrl);
              return `
                <div class="meal-entry-item">
                  ${imgUrl ? `<img src="${imgUrl}" alt="${item.foodName}" class="meal-entry-img" onerror="this.style.display='none';">` : ''}
                  <div class="meal-entry-info">
                    <h5 class="meal-entry-title">${item.foodName}</h5>
                    <div class="meal-entry-macros">
                      <strong class="text-emerald">${item.calories} kcal</strong> | 
                      P: ${item.protein || 0}g | C: ${item.carbs || 0}g | F: ${item.fats || 0}g
                    </div>
                    ${item.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">📝 ${item.notes}</div>` : ''}
                  </div>
                  <button class="btn-icon-soft text-rose btn-delete-food" data-id="${item.id}" title="ลบรายการ">
                    <i data-lucide="trash-2"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Workout Logs Tab
   */
  static renderWorkoutLogs(containerEl, selectedDate) {
    if (!containerEl) return;
    const logs = StorageService.getDailyLogs();
    const user = StorageService.getCurrentUser();
    const workouts = (logs.workoutLogs || []).filter(w => w.userId === user?.id && w.date === selectedDate);

    if (workouts.length === 0) {
      containerEl.innerHTML = `
        <div class="card glass-panel" style="text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏋️‍♂️</div>
          <h4>ยังไม่มีบันทึกการออกกำลังกายในวันนี้</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">กดปุ่ม "เพิ่มบันทึกออกกำลังกาย" เพื่อเก็บสถิติเซ็ตและน้ำหนัก</p>
        </div>
      `;
      return;
    }

    containerEl.innerHTML = workouts.map(wk => {
      const imgUrl = parseGoogleDriveUrl(wk.imageUrl);
      const totalSets = (wk.exercises || []).reduce((sum, ex) => sum + (Number(ex.sets) || 0), 0);

      return `
        <div class="card glass-panel workout-entry-card">
          ${imgUrl ? `
            <div class="entry-card-media">
              <img src="${imgUrl}" alt="${wk.title}" onerror="this.style.display='none';">
            </div>
          ` : ''}
          <div class="entry-card-body">
            <div class="entry-header-row">
              <h4 style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="dumbbell" class="text-amber"></i>
                <span>${wk.title}</span>
              </h4>
              <button class="btn-icon-soft text-rose btn-delete-workout" data-id="${wk.id}" title="ลบรายการ">
                <i data-lucide="trash-2"></i>
              </button>
            </div>

            <div class="entry-tags-row">
              <span class="badge badge-amber"><i data-lucide="clock"></i> ${wk.duration || 0} นาที</span>
              <span class="badge badge-rose"><i data-lucide="flame"></i> เผาผลาญ ~${wk.caloriesBurned || 0} kcal</span>
              <span class="badge badge-cyan"><i data-lucide="layers"></i> ${totalSets} เซ็ตรวม</span>
            </div>

            ${(wk.exercises && wk.exercises.length > 0) ? `
              <div class="table-responsive" style="margin-top: 0.75rem;">
                <table class="data-table" style="font-size: 0.85rem;">
                  <thead>
                    <tr>
                      <th>ท่าฝึก</th>
                      <th>จำนวนเซ็ต</th>
                      <th>จำนวนครั้ง (Reps)</th>
                      <th>น้ำหนัก (Kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${wk.exercises.map(ex => `
                      <tr>
                        <td><strong>${ex.name}</strong></td>
                        <td>${ex.sets} เซ็ต</td>
                        <td>${ex.reps} ครั้ง</td>
                        <td><span class="text-primary font-bold">${ex.weight > 0 ? ex.weight + ' kg' : 'Bodyweight'}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${wk.notes ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.75rem; background: rgba(255,255,255,0.02); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">💡 ${wk.notes}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Outdoor / Competition Logs Tab
   */
  static renderOutdoorLogs(containerEl, selectedDate) {
    if (!containerEl) return;
    const logs = StorageService.getDailyLogs();
    const user = StorageService.getCurrentUser();
    const outdoorItems = (logs.outdoorLogs || []).filter(o => o.userId === user?.id && o.date === selectedDate);

    if (outdoorItems.length === 0) {
      containerEl.innerHTML = `
        <div class="card glass-panel" style="text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏆</div>
          <h4>ยังไม่มีบันทึกกิจกรรม Outdoor หรือการแข่งขันในวันนี้</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">บันทึกงานวิ่ง ปั่นจักรยาน หรือการแข่งขันพร้อมแนบรูปเหรียญรางวัล</p>
        </div>
      `;
      return;
    }

    containerEl.innerHTML = outdoorItems.map(item => {
      const imgUrl = parseGoogleDriveUrl(item.imageUrl);
      return `
        <div class="card glass-panel outdoor-entry-card">
          ${imgUrl ? `
            <div class="entry-card-media">
              <img src="${imgUrl}" alt="${item.title}" onerror="this.style.display='none';">
            </div>
          ` : ''}
          <div class="entry-card-body">
            <div class="entry-header-row">
              <h4 style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="trophy" class="text-cyan"></i>
                <span>${item.title}</span>
              </h4>
              <button class="btn-icon-soft text-rose btn-delete-outdoor" data-id="${item.id}" title="ลบรายการ">
                <i data-lucide="trash-2"></i>
              </button>
            </div>

            <div class="entry-tags-row">
              ${item.distance ? `<span class="badge badge-cyan"><i data-lucide="navigation"></i> ${item.distance} km</span>` : ''}
              ${item.durationText ? `<span class="badge badge-amber"><i data-lucide="timer"></i> เวลา ${item.durationText}</span>` : ''}
              ${item.pace ? `<span class="badge badge-emerald"><i data-lucide="zap"></i> Pace ${item.pace} /km</span>` : ''}
              ${item.calories ? `<span class="badge badge-rose"><i data-lucide="flame"></i> ${item.calories} kcal</span>` : ''}
            </div>

            <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem;">
              ${item.location ? `<div>📍 <strong>สถานที่:</strong> ${item.location}</div>` : ''}
              ${item.rank ? `<div>🏅 <strong>ผลการแข่งขัน/อันดับ:</strong> <span class="text-amber font-bold">${item.rank}</span></div>` : ''}
              ${item.weather ? `<div>🌤️ <strong>สภาพอากาศ:</strong> ${item.weather}</div>` : ''}
              ${item.notes ? `<div style="background: rgba(255,255,255,0.02); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-top: 0.25rem;">📝 ${item.notes}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Body Metrics Table and BMI status
   */
  static renderBodyMetrics(tableBodyEl, gaugeBoxEl, selectedDate) {
    const logs = StorageService.getDailyLogs();
    const user = StorageService.getCurrentUser();
    const bodyLogs = (logs.bodyLogs || []).filter(b => b.userId === user?.id);

    // Latest or selected date metric
    const targetMetric = bodyLogs.find(b => b.date === selectedDate) || bodyLogs[0] || {
      weight: user?.weight || 68.5,
      height: user?.height || 175
    };

    const bmiResult = NutritionCalculator.calculateBmi(targetMetric.weight, targetMetric.height || user?.height || 170);

    const scoreEl = document.getElementById('tab-bmi-score');
    const catEl = document.getElementById('tab-bmi-category');
    const adviceEl = document.getElementById('tab-bmi-advice');

    if (scoreEl) scoreEl.textContent = bmiResult.bmi;
    if (catEl) {
      catEl.textContent = bmiResult.category;
      catEl.style.borderColor = bmiResult.color;
    }
    if (adviceEl) adviceEl.textContent = bmiResult.advice;

    // Render Table
    if (tableBodyEl) {
      if (bodyLogs.length === 0) {
        tableBodyEl.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">ยังไม่มีประวัติการบันทึกสัดส่วน</td></tr>`;
      } else {
        tableBodyEl.innerHTML = bodyLogs.map(item => {
          const imgUrl = parseGoogleDriveUrl(item.imageUrl);
          return `
            <tr>
              <td><strong>${this.formatDateThai(item.date)}</strong></td>
              <td><span class="text-purple font-bold">${item.weight} kg</span></td>
              <td><span class="badge badge-purple">${item.bmi || '--'}</span></td>
              <td>${item.chest ? item.chest + ' "' : '-'}</td>
              <td>${item.waist ? item.waist + ' "' : '-'}</td>
              <td>${item.hips ? item.hips + ' "' : '-'}</td>
              <td>
                ${imgUrl ? `<a href="${imgUrl}" target="_blank" class="btn-text btn-xs"><i data-lucide="image"></i> ดูรูป</a>` : '<span style="color:var(--text-muted);">-</span>'}
              </td>
              <td>
                <button class="btn-icon-soft text-rose btn-delete-body" data-id="${item.id}" title="ลบรายการ">
                  <i data-lucide="trash-2"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  /**
   * Update Dashboard summary stats cards & today's timeline
   */
  static updateDashboard(todayStr) {
    const logs = StorageService.getDailyLogs();
    const user = StorageService.getCurrentUser();
    if (!user) return;

    // 1. Calories & Macros
    const dayFood = (logs.foodLogs || []).filter(f => f.userId === user.id && f.date === todayStr);
    const dayNutrition = NutritionCalculator.calculateDayNutrition(logs.foodLogs || [], todayStr);
    
    // Workout burned calories
    const dayWorkouts = (logs.workoutLogs || []).filter(w => w.userId === user.id && w.date === todayStr);
    const dayOutdoor = (logs.outdoorLogs || []).filter(o => o.userId === user.id && o.date === todayStr);

    const burnedWk = dayWorkouts.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);
    const burnedOut = dayOutdoor.reduce((s, o) => s + (Number(o.calories) || 0), 0);
    const totalBurned = burnedWk + burnedOut;

    const calGoal = 2000;
    const remainingCal = Math.max(0, calGoal - dayNutrition.calories + totalBurned);
    const calProgressPct = Math.min(100, Math.round((dayNutrition.calories / calGoal) * 100));

    // Update Elements
    const calConsumedEl = document.getElementById('dash-cal-consumed');
    const calBurnedEl = document.getElementById('dash-cal-burned');
    const calRemainingEl = document.getElementById('dash-cal-remaining');
    const calProgressEl = document.getElementById('dash-cal-progress');

    if (calConsumedEl) calConsumedEl.textContent = dayNutrition.calories.toLocaleString();
    if (calBurnedEl) calBurnedEl.textContent = totalBurned.toLocaleString() + ' kcal';
    if (calRemainingEl) calRemainingEl.textContent = remainingCal.toLocaleString() + ' kcal';
    if (calProgressEl) calProgressEl.style.width = `${calProgressPct}%`;

    // Macros
    const pVal = document.getElementById('macro-protein-val');
    const cVal = document.getElementById('macro-carbs-val');
    const fVal = document.getElementById('macro-fats-val');
    if (pVal) pVal.textContent = `${Math.round(dayNutrition.protein)}g`;
    if (cVal) cVal.textContent = `${Math.round(dayNutrition.carbs)}g`;
    if (fVal) fVal.textContent = `${Math.round(dayNutrition.fats)}g`;

    // 2. Workouts Summary
    const wkCountEl = document.getElementById('dash-workout-count');
    const wkSetsEl = document.getElementById('dash-weight-sets');
    const wkCardioMinsEl = document.getElementById('dash-cardio-mins');

    const totalWeightSets = dayWorkouts
      .filter(w => w.category === 'weightlifting' || w.category === 'bodyweight')
      .reduce((sum, w) => sum + (w.exercises || []).reduce((s2, e) => s2 + (Number(e.sets) || 0), 0), 0);
    
    const cardioMins = dayWorkouts
      .filter(w => w.category === 'cardio')
      .reduce((sum, w) => sum + (Number(w.duration) || 0), 0);

    if (wkCountEl) wkCountEl.textContent = dayWorkouts.length;
    if (wkSetsEl) wkSetsEl.textContent = `${totalWeightSets} เซ็ต`;
    if (wkCardioMinsEl) wkCardioMinsEl.textContent = `${cardioMins} นาที`;

    // 3. Outdoor Summary
    const outDistEl = document.getElementById('dash-outdoor-distance');
    const outCountEl = document.getElementById('dash-events-count');

    const allOutdoor = (logs.outdoorLogs || []).filter(o => o.userId === user.id);
    const totalDist = allOutdoor.reduce((sum, o) => sum + (parseFloat(o.distance) || 0), 0);

    if (outDistEl) outDistEl.textContent = totalDist.toFixed(1);
    if (outCountEl) outCountEl.textContent = `${allOutdoor.length} รายการ`;

    // 4. Body & BMI
    const bodyLogs = (logs.bodyLogs || []).filter(b => b.userId === user.id);
    const latestBody = bodyLogs[0] || { weight: user.weight || 68.5, height: user.height || 175, waist: 30.5 };
    const bmiCalc = NutritionCalculator.calculateBmi(latestBody.weight, latestBody.height || user.height);

    const curWeightEl = document.getElementById('dash-current-weight');
    const curBmiEl = document.getElementById('dash-current-bmi');
    const curHeightEl = document.getElementById('dash-current-height');
    const curWaistEl = document.getElementById('dash-current-waist');
    const bmiBadgeEl = document.getElementById('dash-bmi-badge');

    if (curWeightEl) curWeightEl.textContent = latestBody.weight;
    if (curBmiEl) curBmiEl.textContent = bmiCalc.bmi;
    if (curHeightEl) curHeightEl.textContent = `${latestBody.height || user.height} cm`;
    if (curWaistEl) curWaistEl.textContent = `${latestBody.waist || '--'} นิ้ว`;
    if (bmiBadgeEl) {
      bmiBadgeEl.textContent = bmiCalc.category;
      bmiBadgeEl.style.borderColor = bmiCalc.color;
    }

    // 5. Timeline Today
    const timelineEl = document.getElementById('dash-today-timeline');
    if (timelineEl) {
      const allTodayActivities = [
        ...dayFood.map(f => ({ type: 'food', title: f.foodName, time: f.mealType, sub: `${f.calories} kcal | P: ${f.protein}g`, icon: 'utensils', color: 'bg-emerald-light text-emerald' })),
        ...dayWorkouts.map(w => ({ type: 'workout', title: w.title, time: 'Workout', sub: `${w.duration} นาที (~${w.caloriesBurned} kcal)`, icon: 'dumbbell', color: 'bg-amber-light text-amber' })),
        ...dayOutdoor.map(o => ({ type: 'outdoor', title: o.title, time: 'Outdoor', sub: `${o.distance || 0} km | ${o.location || ''}`, icon: 'trophy', color: 'bg-cyan-light text-cyan' }))
      ];

      if (allTodayActivities.length === 0) {
        timelineEl.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 0.25rem;">📅</div>
            <p style="font-size: 0.9rem;">ยังไม่มีกิจกรรมที่บันทึกสำหรับวันนี้</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">คลิกปุ่ม "บันทึกด่วน +" ด้านบนเพื่อเริ่มบันทึก</p>
          </div>
        `;
      } else {
        timelineEl.innerHTML = allTodayActivities.map(item => `
          <div class="timeline-item">
            <div class="timeline-icon-box ${item.color}">
              <i data-lucide="${item.icon}"></i>
            </div>
            <div class="timeline-content">
              <div class="timeline-title-row">
                <span class="timeline-title">${item.title}</span>
                <span class="timeline-time">${item.time}</span>
              </div>
              <p class="timeline-desc">${item.sub}</p>
            </div>
          </div>
        `).join('');
      }
    }
  }
}

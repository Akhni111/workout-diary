/**
 * Interactive Monthly Activity Calendar
 */
import { StorageService } from './storage.js';
import { parseGoogleDriveUrl } from './gdrive-helper.js';

export class ActivityCalendar {
  constructor(onDayClick) {
    this.currentDate = new Date();
    this.onDayClick = onDayClick;
    this.monthNamesThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
  }

  init() {
    this.render();
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  goToToday() {
    this.currentDate = new Date();
    this.render();
  }

  render() {
    const monthYearLabel = document.getElementById('cal-month-year-label');
    const container = document.getElementById('calendar-days-container');
    if (!container || !monthYearLabel) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    monthYearLabel.textContent = `${this.monthNamesThai[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const user = StorageService.getCurrentUser();
    const logs = StorageService.getDailyLogs();

    let daysHtml = '';

    // Previous month inactive days
    for (let x = firstDayIndex; x > 0; x--) {
      const prevDate = prevMonthDays - x + 1;
      daysHtml += `
        <div class="calendar-day-cell other-month">
          <div class="day-cell-top">
            <span class="day-number">${prevDate}</span>
          </div>
        </div>
      `;
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;

      // Check logged events for this date
      const hasFood = (logs.foodLogs || []).some(f => f.userId === user?.id && f.date === dateStr);
      const hasWorkout = (logs.workoutLogs || []).some(w => w.userId === user?.id && w.date === dateStr);
      const hasOutdoor = (logs.outdoorLogs || []).some(o => o.userId === user?.id && o.date === dateStr);
      const hasBody = (logs.bodyLogs || []).some(b => b.userId === user?.id && b.date === dateStr);

      const badges = [];
      const dots = [];

      if (hasFood) {
        badges.push(`<span class="day-badge-chip chip-food">🥗 อาหาร</span>`);
        dots.push(`<span class="legend-dot bg-emerald"></span>`);
      }
      if (hasWorkout) {
        badges.push(`<span class="day-badge-chip chip-workout">🏋️ ออกกำลัง</span>`);
        dots.push(`<span class="legend-dot bg-amber"></span>`);
      }
      if (hasOutdoor) {
        badges.push(`<span class="day-badge-chip chip-outdoor">🏆 Outdoor</span>`);
        dots.push(`<span class="legend-dot bg-cyan"></span>`);
      }
      if (hasBody) {
        badges.push(`<span class="day-badge-chip chip-body">⚖️ สัดส่วน</span>`);
        dots.push(`<span class="legend-dot bg-purple"></span>`);
      }

      daysHtml += `
        <div class="calendar-day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
          <div class="day-cell-top">
            <span class="day-number">${day}</span>
            <div class="day-dots-row">${dots.join('')}</div>
          </div>
          <div class="day-activity-indicators">
            ${badges.slice(0, 2).join('')}
            ${badges.length > 2 ? `<span class="day-badge-chip" style="background:rgba(255,255,255,0.06); color:var(--text-muted);">+${badges.length - 2} เพิ่มเติม</span>` : ''}
          </div>
        </div>
      `;
    }

    container.innerHTML = daysHtml;

    // Attach click listeners to day cells
    container.querySelectorAll('.calendar-day-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', () => {
        const date = cell.getAttribute('data-date');
        if (date && this.onDayClick) {
          this.onDayClick(date);
        }
      });
    });
  }

  /**
   * Open Day details modal
   */
  static showDayDetailModal(dateStr, onAddEntry) {
    const user = StorageService.getCurrentUser();
    const logs = StorageService.getDailyLogs();
    const modal = document.getElementById('modal-day-detail');
    const label = document.getElementById('day-modal-date-label');
    const container = document.getElementById('day-modal-activities-list');
    const addBtn = document.getElementById('btn-day-modal-add-entry');

    if (!modal || !container || !label) return;

    label.textContent = dateStr;

    const foods = (logs.foodLogs || []).filter(f => f.userId === user?.id && f.date === dateStr);
    const workouts = (logs.workoutLogs || []).filter(w => w.userId === user?.id && w.date === dateStr);
    const outdoors = (logs.outdoorLogs || []).filter(o => o.userId === user?.id && o.date === dateStr);
    const bodies = (logs.bodyLogs || []).filter(b => b.userId === user?.id && b.date === dateStr);

    let html = '';

    if (foods.length === 0 && workouts.length === 0 && outdoors.length === 0 && bodies.length === 0) {
      html = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📅</div>
          <h4>ไม่มีบันทึกกิจกรรมในวันที่ ${dateStr}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">คุณสามารถเพิ่มบันทึกสำหรับวันนี้ได้โดยคลิกปุ่มด้านล่าง</p>
        </div>
      `;
    } else {
      if (foods.length > 0) {
        html += `
          <div>
            <h4 style="font-size:0.95rem; color:var(--primary); margin-bottom:0.5rem;"><i data-lucide="utensils"></i> รายการอาหาร (${foods.length})</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${foods.map(f => `
                <div class="meal-entry-item">
                  <div class="meal-entry-info">
                    <strong>${f.foodName}</strong> (${f.mealType})
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${f.calories} kcal | P: ${f.protein}g C: ${f.carbs}g F: ${f.fats}g</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (workouts.length > 0) {
        html += `
          <div>
            <h4 style="font-size:0.95rem; color:var(--amber); margin-bottom:0.5rem; margin-top:0.75rem;"><i data-lucide="dumbbell"></i> บันทึกออกกำลังกาย (${workouts.length})</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${workouts.map(w => `
                <div class="meal-entry-item">
                  <div class="meal-entry-info">
                    <strong>${w.title}</strong> (${w.duration} นาที, เผาผลาญ ~${w.caloriesBurned} kcal)
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${(w.exercises || []).length} ท่าฝึก</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (outdoors.length > 0) {
        html += `
          <div>
            <h4 style="font-size:0.95rem; color:var(--cyan); margin-bottom:0.5rem; margin-top:0.75rem;"><i data-lucide="trophy"></i> กิจกรรม Outdoor / แข่งขัน (${outdoors.length})</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${outdoors.map(o => `
                <div class="meal-entry-item">
                  <div class="meal-entry-info">
                    <strong>${o.title}</strong>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${o.distance ? o.distance + ' km | ' : ''}${o.location || ''} ${o.rank ? ' | ' + o.rank : ''}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (bodies.length > 0) {
        html += `
          <div>
            <h4 style="font-size:0.95rem; color:var(--purple); margin-bottom:0.5rem; margin-top:0.75rem;"><i data-lucide="scale"></i> สถิติร่างกาย</h4>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${bodies.map(b => `
                <div class="meal-entry-item">
                  <div class="meal-entry-info">
                    <strong>น้ำหนัก: ${b.weight} kg</strong> (BMI: ${b.bmi || '--'})
                    <div style="font-size:0.75rem; color:var(--text-secondary);">เอว: ${b.waist || '-'} นิ้ว | อก: ${b.chest || '-'} นิ้ว | สะโพก: ${b.hips || '-'} นิ้ว</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    container.innerHTML = html;
    modal.classList.remove('hidden');

    if (addBtn) {
      addBtn.onclick = () => {
        modal.classList.add('hidden');
        if (onAddEntry) onAddEntry(dateStr);
      };
    }
  }
}

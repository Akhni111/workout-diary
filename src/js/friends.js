/**
 * Friends & Community Management
 * Automatic Age Calculation from Date of Birth
 */
import { StorageService } from './storage.js';
import { parseGoogleDriveUrl } from './gdrive-helper.js';

export class FriendsManager {
  /**
   * Calculate exact age in years from Date of Birth string (YYYY-MM-DD)
   */
  static calculateAge(dobStr) {
    if (!dobStr) return 0;
    const birthDate = new Date(dobStr);
    if (isNaN(birthDate.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Format gender label
   */
  static formatGender(gender) {
    switch (gender) {
      case 'male': return { label: 'ชาย (Male)', class: 'badge-cyan' };
      case 'female': return { label: 'หญิง (Female)', class: 'badge-rose' };
      default: return { label: 'อื่นๆ (Other)', class: 'badge-purple' };
    }
  }

  /**
   * Render Friends list
   */
  static renderFriendsList(containerEl, countEl, searchQuery = '') {
    const user = StorageService.getCurrentUser();
    if (!user || !containerEl) return;

    let friends = StorageService.getFriends(user.id);

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      friends = friends.filter(f => 
        (f.name && f.name.toLowerCase().includes(q)) || 
        (f.bio && f.bio.toLowerCase().includes(q))
      );
    }

    if (countEl) {
      countEl.textContent = `เพื่อนทั้งหมด ${friends.length} คน`;
    }

    if (friends.length === 0) {
      containerEl.innerHTML = `
        <div class="empty-state-box card glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.25rem;">ยังไม่มีรายชื่อเพื่อน</h4>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.25rem;">กดปุ่ม "เพิ่มเพื่อนใหม่" เพื่อเริ่มต้นสร้างคอมมูนิตี้ออกกำลังกาย</p>
        </div>
      `;
      return;
    }

    containerEl.innerHTML = friends.map(friend => {
      const age = this.calculateAge(friend.dob);
      const genderMeta = this.formatGender(friend.gender);
      const avatarSrc = parseGoogleDriveUrl(friend.avatarUrl);
      const initials = friend.name ? friend.name.substring(0, 2).toUpperCase() : 'FR';

      return `
        <div class="card glass-panel friend-card">
          <div class="friend-avatar-wrapper">
            ${avatarSrc ? `<img src="${avatarSrc}" alt="${friend.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
            <span style="${avatarSrc ? 'display:none;' : 'display:flex;'} width:100%; height:100%; align-items:center; justify-content:center;">${initials}</span>
          </div>
          
          <h4 class="friend-name">${friend.name}</h4>
          
          <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; justify-content: center;">
            <span class="badge ${genderMeta.class}">${genderMeta.label}</span>
            <span class="friend-age-badge">อายุ ${age} ปี</span>
          </div>

          <p class="friend-bio">${friend.bio || 'ยังไม่มีคำแนะนำตัว'}</p>

          <div style="margin-top: 0.75rem; width: 100%; display: flex; justify-content: flex-end;">
            <button class="btn-icon-soft text-rose btn-delete-friend" data-friend-id="${friend.id}" title="ลบเพื่อน">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

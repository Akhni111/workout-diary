/**
 * Storage Manager with Supabase Cloud Sync & Local Storage Cache
 */
import { SupabaseService } from './supabase.js';

const STORAGE_KEYS = {
  USERS: 'wd_users_v1',
  CURRENT_USER_ID: 'wd_current_user_id_v1',
  IS_PIN_LOCKED: 'wd_is_pin_locked_v1',
  DAILY_LOGS: 'wd_daily_logs_v1',
  FRIENDS: 'wd_friends_v1',
  SUPABASE_CONNECTED: 'wd_supabase_connected_v1'
};

// Initial Demo Seed Data
export const INITIAL_DEMO_DATA = {
  users: [
    {
      id: 'usr_alex_001',
      username: 'alex',
      email: 'alex@fit.com',
      password: '123456',
      pin: '1234',
      fullName: 'Alex Fit',
      gender: 'male',
      dob: '2000-04-12',
      weight: 68.5,
      height: 175,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  ],
  friends: [
    {
      id: 'fr_001',
      userId: 'usr_alex_001',
      name: 'ณัฐวุฒิ สายวิ่ง (Nut)',
      gender: 'male',
      dob: '1998-08-15',
      bio: 'ซ้อมวิ่งมาราธอน 4 วัน/สัปดาห์ เป้า Sub 4 ในปีนี้ 🏃‍♂️',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'fr_002',
      userId: 'usr_alex_001',
      name: 'พิมพ์ชนก ฟิตเนส (Pim)',
      gender: 'female',
      dob: '2001-02-20',
      bio: 'ชอบเล่นพิลาทิส และเวทเทรนนิ่งเน้นก้น-ขา 🧘‍♀️✨',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'fr_003',
      userId: 'usr_alex_001',
      name: 'โค้ชบอย Powerlifting',
      gender: 'male',
      dob: '1995-11-03',
      bio: 'SBD Total 520kg ยินดีให้คำแนะนำท่าสควอชและเบนช์เพรส 💪',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'fr_004',
      userId: 'usr_alex_001',
      name: 'เมษา นักปั่น',
      gender: 'female',
      dob: '1999-05-28',
      bio: 'สายปั่น Sky Lane และทริปเขาใหญ่ 🚴‍♀️🌿',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
    }
  ],
  dailyLogs: {
    foodLogs: [
      {
        id: 'food_001',
        userId: 'usr_alex_001',
        date: '2026-09-16',
        mealType: 'breakfast',
        foodName: 'ข้าวโอ๊ตต้มกล้วยหอม + นมแอลมอนด์ + เวย์โปรตีน 1 สกู๊ป',
        calories: 420,
        protein: 32,
        carbs: 58,
        fats: 6,
        imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
        notes: 'ทานก่อนซ้อมเช้า 1 ชั่วโมง ให้พลังงานดีมาก'
      },
      {
        id: 'food_002',
        userId: 'usr_alex_001',
        date: '2026-09-16',
        mealType: 'lunch',
        foodName: 'อกไก่ย่างสมุนไพร 200g + ข้าวไรซ์เบอร์รี่ + บรอกโคลีลวก',
        calories: 520,
        protein: 48,
        carbs: 52,
        fats: 9,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        notes: 'ดื่มน้ำเปล่า 600ml'
      },
      {
        id: 'food_003',
        userId: 'usr_alex_001',
        date: '2026-09-15',
        mealType: 'dinner',
        foodName: 'สเต็กแซลมอนย่างเกลือ + สลัดผักน้ำสลัดบัลซามิก',
        calories: 480,
        protein: 38,
        carbs: 18,
        fats: 22,
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
        notes: 'โอเมก้า 3 ครบถ้วน'
      }
    ],
    workoutLogs: [
      {
        id: 'wk_001',
        userId: 'usr_alex_001',
        date: '2026-09-16',
        category: 'weightlifting',
        title: 'Chest & Triceps Hypertrophy',
        duration: 55,
        caloriesBurned: 360,
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 75 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 24 },
          { name: 'Cable Chest Fly', sets: 3, reps: 12, weight: 15 },
          { name: 'Tricep Rope Pushdown', sets: 4, reps: 12, weight: 22 }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        notes: 'เพิ่มน้ำหนัก Bench Press ได้ 2.5kg ฟอร์มดีไม่มีเจ็บ'
      },
      {
        id: 'wk_002',
        userId: 'usr_alex_001',
        date: '2026-09-14',
        category: 'cardio',
        title: 'Zone 2 Treadmill Run + Core Plank',
        duration: 45,
        caloriesBurned: 410,
        exercises: [
          { name: 'Treadmill Incline Run', sets: 1, reps: 35, weight: 0 },
          { name: 'Plank Hold', sets: 3, reps: 60, weight: 0 }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
        notes: 'คุม Heart Rate ไม่เกิน 140 bpm'
      }
    ],
    outdoorLogs: [
      {
        id: 'out_001',
        userId: 'usr_alex_001',
        date: '2026-09-13',
        type: 'marathon',
        title: 'Bangkok Mini Marathon 2026 (10.5K)',
        location: 'สะพานพระราม 8 - ถนนราชดำเนิน',
        distance: 10.5,
        durationText: '00:52:14',
        pace: '4:58',
        calories: 680,
        rank: 'อันดับที่ 84 (Overall Top 10%)',
        weather: 'อากาศเย็นสบาย 25°C ฝนพรำเล็กน้อย',
        imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80',
        notes: 'ทำ New Personal Best สำเร็จ! บรรยากาศประทับใจมาก'
      }
    ],
    bodyLogs: [
      {
        id: 'body_001',
        userId: 'usr_alex_001',
        date: '2026-09-16',
        weight: 68.5,
        height: 175,
        bodyFat: 14.8,
        chest: 39.5,
        waist: 30.5,
        hips: 37.0,
        arms: 14.5,
        bmi: 22.4,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'body_002',
        userId: 'usr_alex_001',
        date: '2026-09-01',
        weight: 69.8,
        height: 175,
        bodyFat: 15.6,
        chest: 39.0,
        waist: 31.2,
        hips: 37.5,
        arms: 14.2,
        bmi: 22.8,
        imageUrl: ''
      }
    ]
  }
};

export class StorageService {
  static async init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDemoData();
    }

    // Try background sync with Supabase
    this.syncFromSupabase();
  }

  static resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_DATA.users));
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(INITIAL_DEMO_DATA.friends));
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(INITIAL_DEMO_DATA.dailyLogs));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr_alex_001');
    localStorage.setItem(STORAGE_KEYS.IS_PIN_LOCKED, 'false');
  }

  static async syncFromSupabase() {
    const user = this.getCurrentUser();
    if (!user) return;

    try {
      const [remoteLogs, remoteFriends] = await Promise.all([
        SupabaseService.fetchDailyLogs(user.id),
        SupabaseService.fetchFriends(user.id)
      ]);

      if (remoteLogs && (remoteLogs.foodLogs.length > 0 || remoteLogs.workoutLogs.length > 0)) {
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(remoteLogs));
      }
      if (remoteFriends && remoteFriends.length > 0) {
        localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(remoteFriends));
      }
    } catch (e) {
      console.warn('Sync from Supabase failed, using local cache:', e);
    }
  }

  // Users
  static getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  static saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getCurrentUser() {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!userId) return null;
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  static setCurrentUser(userId) {
    if (!userId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    }
  }

  static updateCurrentUser(updatedFields) {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const index = users.findIndex(u => u.id === currentId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      this.saveUsers(users);
      // Sync user to Supabase
      SupabaseService.upsertUser(users[index]);
      return users[index];
    }
    return null;
  }

  // PIN Lock State
  static isPinLocked() {
    return localStorage.getItem(STORAGE_KEYS.IS_PIN_LOCKED) === 'true';
  }

  static setPinLocked(locked) {
    localStorage.setItem(STORAGE_KEYS.IS_PIN_LOCKED, locked ? 'true' : 'false');
  }

  // Daily Logs
  static getDailyLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{"foodLogs":[],"workoutLogs":[],"outdoorLogs":[],"bodyLogs":[]}');
  }

  static saveDailyLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  }

  // Log CRUD Helpers (Local Cache + Async Cloud Write)
  static addFoodLog(item) {
    const logs = this.getDailyLogs();
    logs.foodLogs = logs.foodLogs || [];
    logs.foodLogs.unshift(item);
    this.saveDailyLogs(logs);

    // Save to Supabase Cloud
    SupabaseService.insertFood(item);
  }

  static deleteFoodLog(id) {
    const logs = this.getDailyLogs();
    logs.foodLogs = (logs.foodLogs || []).filter(item => item.id !== id);
    this.saveDailyLogs(logs);

    // Delete from Supabase
    SupabaseService.deleteFood(id);
  }

  static addWorkoutLog(item) {
    const logs = this.getDailyLogs();
    logs.workoutLogs = logs.workoutLogs || [];
    logs.workoutLogs.unshift(item);
    this.saveDailyLogs(logs);

    // Save to Supabase Cloud
    SupabaseService.insertWorkout(item);
  }

  static deleteWorkoutLog(id) {
    const logs = this.getDailyLogs();
    logs.workoutLogs = (logs.workoutLogs || []).filter(item => item.id !== id);
    this.saveDailyLogs(logs);

    // Delete from Supabase
    SupabaseService.deleteWorkout(id);
  }

  static addOutdoorLog(item) {
    const logs = this.getDailyLogs();
    logs.outdoorLogs = logs.outdoorLogs || [];
    logs.outdoorLogs.unshift(item);
    this.saveDailyLogs(logs);

    // Save to Supabase Cloud
    SupabaseService.insertOutdoor(item);
  }

  static deleteOutdoorLog(id) {
    const logs = this.getDailyLogs();
    logs.outdoorLogs = (logs.outdoorLogs || []).filter(item => item.id !== id);
    this.saveDailyLogs(logs);

    // Delete from Supabase
    SupabaseService.deleteOutdoor(id);
  }

  static addBodyLog(item) {
    const logs = this.getDailyLogs();
    logs.bodyLogs = logs.bodyLogs || [];
    logs.bodyLogs.unshift(item);
    this.saveDailyLogs(logs);

    // Save to Supabase Cloud
    SupabaseService.insertBody(item);
  }

  static deleteBodyLog(id) {
    const logs = this.getDailyLogs();
    logs.bodyLogs = (logs.bodyLogs || []).filter(item => item.id !== id);
    this.saveDailyLogs(logs);

    // Delete from Supabase
    SupabaseService.deleteBody(id);
  }

  // Friends
  static getFriends(userId) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    if (!userId) return all;
    return all.filter(f => f.userId === userId);
  }

  static addFriend(friend) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    all.unshift(friend);
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(all));

    // Save to Supabase Cloud
    SupabaseService.insertFriend(friend);
  }

  static deleteFriend(id) {
    let all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    all = all.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(all));

    // Delete from Supabase
    SupabaseService.deleteFriend(id);
  }

  // Backup & Restore
  static exportBackupJSON() {
    return JSON.stringify({
      users: this.getUsers(),
      dailyLogs: this.getDailyLogs(),
      friends: JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]'),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  static importBackupJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.users && data.dailyLogs) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs));
        if (data.friends) localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(data.friends));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

/**
 * Supabase Client & Database Services
 */
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://rfuuwurlwgzorudcssny.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdXV3dXJsd2d6b3J1ZGNzc255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDU3MjksImV4cCI6MjEwNTEyMTcyOX0.hoZboEZ9eZF0-BnSQkIuA4HkLjCLpmQXvZPMwHR8PdE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class SupabaseService {
  /**
   * Check connection to Supabase database
   */
  static async checkConnection() {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      if (error) {
        console.warn('Supabase connection check:', error.message);
        return { connected: false, message: error.message };
      }
      return { connected: true, message: 'Connected to Supabase' };
    } catch (err) {
      console.warn('Supabase offline or error:', err);
      return { connected: false, message: err.message };
    }
  }

  /**
   * Seed Mockup Data to Supabase
   */
  static async seedMockData(initialData) {
    try {
      const results = {};

      // 1. Seed Users
      if (initialData.users && initialData.users.length > 0) {
        const usersToInsert = initialData.users.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          password: u.password,
          pin: u.pin || '1234',
          full_name: u.fullName,
          gender: u.gender || 'male',
          dob: u.dob || '2000-01-01',
          weight: u.weight || 68.5,
          height: u.height || 175.0,
          avatar: u.avatar || ''
        }));
        const { error } = await supabase.from('users').upsert(usersToInsert);
        results.users = !error;
      }

      // 2. Seed Food Logs
      if (initialData.dailyLogs?.foodLogs?.length > 0) {
        const foodsToInsert = initialData.dailyLogs.foodLogs.map(f => ({
          id: f.id,
          user_id: f.userId,
          date: f.date,
          meal_type: f.mealType,
          food_name: f.foodName,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fats: f.fats,
          image_url: f.imageUrl || '',
          notes: f.notes || ''
        }));
        const { error } = await supabase.from('food_logs').upsert(foodsToInsert);
        results.foodLogs = !error;
      }

      // 3. Seed Workout Logs
      if (initialData.dailyLogs?.workoutLogs?.length > 0) {
        const wkToInsert = initialData.dailyLogs.workoutLogs.map(w => ({
          id: w.id,
          user_id: w.userId,
          date: w.date,
          category: w.category,
          title: w.title,
          duration: w.duration,
          calories_burned: w.caloriesBurned,
          exercises: w.exercises || [],
          image_url: w.imageUrl || '',
          notes: w.notes || ''
        }));
        const { error } = await supabase.from('workout_logs').upsert(wkToInsert);
        results.workoutLogs = !error;
      }

      // 4. Seed Outdoor Logs
      if (initialData.dailyLogs?.outdoorLogs?.length > 0) {
        const outToInsert = initialData.dailyLogs.outdoorLogs.map(o => ({
          id: o.id,
          user_id: o.userId,
          date: o.date,
          type: o.type,
          title: o.title,
          location: o.location || '',
          distance: o.distance || 0,
          duration_text: o.durationText || '',
          pace: o.pace || '',
          calories: o.calories || 0,
          rank: o.rank || '',
          weather: o.weather || '',
          image_url: o.imageUrl || '',
          notes: o.notes || ''
        }));
        const { error } = await supabase.from('outdoor_logs').upsert(outToInsert);
        results.outdoorLogs = !error;
      }

      // 5. Seed Body Logs
      if (initialData.dailyLogs?.bodyLogs?.length > 0) {
        const bodyToInsert = initialData.dailyLogs.bodyLogs.map(b => ({
          id: b.id,
          user_id: b.userId,
          date: b.date,
          weight: b.weight,
          height: b.height,
          body_fat: b.bodyFat || 0,
          chest: b.chest || 0,
          waist: b.waist || 0,
          hips: b.hips || 0,
          arms: b.arms || 0,
          bmi: b.bmi || 0,
          image_url: b.imageUrl || ''
        }));
        const { error } = await supabase.from('body_logs').upsert(bodyToInsert);
        results.bodyLogs = !error;
      }

      // 6. Seed Friends
      if (initialData.friends?.length > 0) {
        const friendsToInsert = initialData.friends.map(fr => ({
          id: fr.id,
          user_id: fr.userId,
          name: fr.name,
          gender: fr.gender,
          dob: fr.dob,
          avatar_url: fr.avatarUrl || '',
          bio: fr.bio || ''
        }));
        const { error } = await supabase.from('friends').upsert(friendsToInsert);
        results.friends = !error;
      }

      return { success: true, results };
    } catch (err) {
      console.error('Seed Supabase error:', err);
      return { success: false, error: err.message };
    }
  }

  // ================= SUPABASE DATA CRUD =================

  // Fetch all logs from Supabase
  static async fetchDailyLogs(userId) {
    try {
      const [fRes, wRes, oRes, bRes] = await Promise.all([
        supabase.from('food_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('workout_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('outdoor_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('body_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      if (fRes.error || wRes.error || oRes.error || bRes.error) {
        return null;
      }

      return {
        foodLogs: (fRes.data || []).map(f => ({
          id: f.id,
          userId: f.user_id,
          date: f.date,
          mealType: f.meal_type,
          foodName: f.food_name,
          calories: Number(f.calories),
          protein: Number(f.protein),
          carbs: Number(f.carbs),
          fats: Number(f.fats),
          imageUrl: f.image_url,
          notes: f.notes
        })),
        workoutLogs: (wRes.data || []).map(w => ({
          id: w.id,
          userId: w.user_id,
          date: w.date,
          category: w.category,
          title: w.title,
          duration: Number(w.duration),
          caloriesBurned: Number(w.calories_burned),
          exercises: w.exercises || [],
          imageUrl: w.image_url,
          notes: w.notes
        })),
        outdoorLogs: (oRes.data || []).map(o => ({
          id: o.id,
          userId: o.user_id,
          date: o.date,
          type: o.type,
          title: o.title,
          location: o.location,
          distance: Number(o.distance),
          durationText: o.duration_text,
          pace: o.pace,
          calories: Number(o.calories),
          rank: o.rank,
          weather: o.weather,
          imageUrl: o.image_url,
          notes: o.notes
        })),
        bodyLogs: (bRes.data || []).map(b => ({
          id: b.id,
          userId: b.user_id,
          date: b.date,
          weight: Number(b.weight),
          height: Number(b.height),
          bodyFat: Number(b.body_fat),
          chest: Number(b.chest),
          waist: Number(b.waist),
          hips: Number(b.hips),
          arms: Number(b.arms),
          bmi: Number(b.bmi),
          imageUrl: b.image_url
        }))
      };
    } catch (e) {
      console.warn('Error fetching logs from Supabase:', e);
      return null;
    }
  }

  // Fetch friends from Supabase
  static async fetchFriends(userId) {
    try {
      const { data, error } = await supabase.from('friends').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) return null;
      return data.map(fr => ({
        id: fr.id,
        userId: fr.user_id,
        name: fr.name,
        gender: fr.gender,
        dob: fr.dob,
        avatarUrl: fr.avatar_url,
        bio: fr.bio
      }));
    } catch (e) {
      console.warn('Error fetching friends from Supabase:', e);
      return null;
    }
  }

  // Add Item to Supabase
  static async insertFood(item) {
    try {
      await supabase.from('food_logs').insert([{
        id: item.id,
        user_id: item.userId,
        date: item.date,
        meal_type: item.mealType,
        food_name: item.foodName,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        image_url: item.imageUrl || '',
        notes: item.notes || ''
      }]);
    } catch (e) {
      console.warn('Insert food to Supabase failed:', e);
    }
  }

  static async deleteFood(id) {
    try {
      await supabase.from('food_logs').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete food from Supabase failed:', e);
    }
  }

  static async insertWorkout(item) {
    try {
      await supabase.from('workout_logs').insert([{
        id: item.id,
        user_id: item.userId,
        date: item.date,
        category: item.category,
        title: item.title,
        duration: item.duration,
        calories_burned: item.caloriesBurned,
        exercises: item.exercises || [],
        image_url: item.imageUrl || '',
        notes: item.notes || ''
      }]);
    } catch (e) {
      console.warn('Insert workout to Supabase failed:', e);
    }
  }

  static async deleteWorkout(id) {
    try {
      await supabase.from('workout_logs').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete workout from Supabase failed:', e);
    }
  }

  static async insertOutdoor(item) {
    try {
      await supabase.from('outdoor_logs').insert([{
        id: item.id,
        user_id: item.userId,
        date: item.date,
        type: item.type,
        title: item.title,
        location: item.location || '',
        distance: item.distance || 0,
        duration_text: item.durationText || '',
        pace: item.pace || '',
        calories: item.calories || 0,
        rank: item.rank || '',
        weather: item.weather || '',
        image_url: item.imageUrl || '',
        notes: item.notes || ''
      }]);
    } catch (e) {
      console.warn('Insert outdoor to Supabase failed:', e);
    }
  }

  static async deleteOutdoor(id) {
    try {
      await supabase.from('outdoor_logs').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete outdoor from Supabase failed:', e);
    }
  }

  static async insertBody(item) {
    try {
      await supabase.from('body_logs').insert([{
        id: item.id,
        user_id: item.userId,
        date: item.date,
        weight: item.weight,
        height: item.height,
        body_fat: item.bodyFat || 0,
        chest: item.chest || 0,
        waist: item.waist || 0,
        hips: item.hips || 0,
        arms: item.arms || 0,
        bmi: item.bmi || 0,
        image_url: item.imageUrl || ''
      }]);
    } catch (e) {
      console.warn('Insert body log to Supabase failed:', e);
    }
  }

  static async deleteBody(id) {
    try {
      await supabase.from('body_logs').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete body from Supabase failed:', e);
    }
  }

  static async insertFriend(friend) {
    try {
      await supabase.from('friends').insert([{
        id: friend.id,
        user_id: friend.userId,
        name: friend.name,
        gender: friend.gender,
        dob: friend.dob,
        avatar_url: friend.avatarUrl || '',
        bio: friend.bio || ''
      }]);
    } catch (e) {
      console.warn('Insert friend to Supabase failed:', e);
    }
  }

  static async deleteFriend(id) {
    try {
      await supabase.from('friends').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete friend from Supabase failed:', e);
    }
  }

  static async upsertUser(user) {
    try {
      await supabase.from('users').upsert([{
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        pin: user.pin || '1234',
        full_name: user.fullName,
        gender: user.gender || 'male',
        dob: user.dob || '2000-01-01',
        weight: user.weight || 68.5,
        height: user.height || 175.0,
        avatar: user.avatar || ''
      }]);
    } catch (e) {
      console.warn('Upsert user to Supabase failed:', e);
    }
  }
}

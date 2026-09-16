/**
 * Authentication Service
 * Handles Login (Username or Email), Register, Session State, and Profile Changes
 */
import { StorageService } from './storage.js';

export class AuthService {
  /**
   * Login with Username OR Email + Password
   */
  static login(identifier, password) {
    if (!identifier || !password) {
      return { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const users = StorageService.getUsers();

    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, message: 'ไม่พบชื่อผู้ใช้หรืออีเมลนี้ในระบบ' };
    }

    if (user.password !== password) {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
    }

    // Set active session
    StorageService.setCurrentUser(user.id);
    StorageService.setPinLocked(false);

    return { success: true, user };
  }

  /**
   * Register a new user
   */
  static register({ fullName, username, email, password, pin, gender, dob, weight, height }) {
    if (!username || !email || !password || !pin || !fullName) {
      return { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' };
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return { success: false, message: 'รหัส PIN ต้องเป็นตัวเลข 4 หลักเท่านั้น' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();

    // Check duplicate username
    if (users.some(u => u.username && u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Username นี้มีผู้ใช้งานแล้ว' };
    }

    // Check duplicate email
    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email นี้ถูกลงทะเบียนไว้แล้ว' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: password,
      pin: pin,
      gender: gender || 'male',
      dob: dob || '2000-01-01',
      weight: parseFloat(weight) || 65,
      height: parseFloat(height) || 170,
      avatar: ''
    };

    users.push(newUser);
    StorageService.saveUsers(users);
    StorageService.setCurrentUser(newUser.id);
    StorageService.setPinLocked(false);

    return { success: true, user: newUser };
  }

  static logout() {
    StorageService.setCurrentUser(null);
    StorageService.setPinLocked(false);
  }

  static getCurrentUser() {
    return StorageService.getCurrentUser();
  }

  static updatePin(newPin) {
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return { success: false, message: 'รหัส PIN ต้องเป็นตัวเลข 4 หลัก' };
    }

    StorageService.updateCurrentUser({ pin: newPin });
    return { success: true, message: 'เปลี่ยนรหัส PIN สำเร็จแล้ว' };
  }

  static updateProfile(fields) {
    const updated = StorageService.updateCurrentUser(fields);
    return { success: !!updated, user: updated };
  }
}

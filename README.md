# Workout Diary 🏋️‍♂️✨

เว็บแอปพลิเคชัน **Workout Diary** สำหรับบันทึกและวางแผนการออกกำลังกาย โภชนาการ กิจกรรมแข่งขัน สถิติร่างกาย และโปรแกรมฟิตเนสระดับมืออาชีพ

## 🌟 ฟีเจอร์หลัก (Features)
- 📱 **Responsive Design**: รองรับการใช้งานทั้งบน Mobile, Tablet และ PC (ธีม Modern Dark Athletic + Glassmorphism)
- 🔐 **ระบบสมาชิกและความปลอดภัย**:
  - ล็อกอินด้วย Username หรือ Email
  - ระบบหน้าจอล็อก PIN 4 หลัก (4-Digit PIN Lock Screen) พร้อมแป้นพิมพ์ Keypad เสมือนจริง
  - สมัครสมาชิกใหม่ (Register)
- 🥗 **บันทึกโภชนาการ & แคลอรี่**: คำนวณพลังงาน (kcal) และสัดส่วนสารอาหาร (Macros: Protein, Carbs, Fats) พร้อมชิปเมนูอาหารยอดนิยมและเมนูสุขภาพแนะนำ
- 🏋️ **บันทึกการออกกำลังกาย**: บันทึกท่าฝึก จำนวนเซ็ต Reps น้ำหนัก (Kg) และเวลาพัก
- 🏆 **กิจกรรม Outdoor, Indoor & แข่งขัน**: บันทึกงานวิ่งมาราธอน ปั่นจักรยาน ไตรกีฬา พร้อมระยะทาง Pace อันดับ และเหรียญรางวัล
- 📸 **แนบรูปภาพจาก Google Drive**: วางลิงก์ Google Drive เพื่อแสดงพรีวิวภาพกิจกรรมอัตโนมัติ
- ⚖️ **สถิติร่างกาย & BMI**: คำนวณค่า BMI อัตโนมัติ พร้อมเกณฑ์มาตรฐานและคำแนะนำสุขภาพ
- 👥 **ระบบเพื่อน & คอมมูนิตี้**: เพิ่มเพื่อน และคำนวณอายุจากวันเกิดให้อัตโนมัติ (Real-time Age Calculation)
- 📅 **ปฏิทินกิจกรรม (Activity Calendar)**: ปฏิทินรายเดือนแสดงจุดกิจกรรมในแต่ละวัน
- ☁️ **เชื่อมต่อฐานข้อมูล Supabase Cloud**: บันทึกข้อมูลและซิงค์แบบเรียลไทม์

## 🛠️ Tech Stack
- **Frontend**: Vite + HTML5 + Vanilla CSS + Vanilla JavaScript (ES Modules)
- **Icons**: Lucide Icons
- **Database**: Supabase PostgreSQL

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้น Dev Server
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/`

## ☁️ การตั้งค่า Supabase
นำคำสั่ง SQL ในไฟล์ [`supabase_schema.sql`](supabase_schema.sql) ไปรันใน Supabase SQL Editor เพื่อสร้างตารางและใส่ Mockup Data เริ่มต้น

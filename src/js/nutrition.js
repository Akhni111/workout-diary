/**
 * Nutrition & Calorie Calculation Engine
 */

export const HEALTHY_FOOD_PRESETS = [
  { name: 'อกไก่ต้ม/ย่าง (200g)', calories: 240, protein: 46, carbs: 0, fats: 4 },
  { name: 'ข้าวไรซ์เบอร์รี่ (1 ทัพพี)', calories: 140, protein: 3, carbs: 30, fats: 1 },
  { name: 'ไข่ต้มฟองใหญ่ (2 ฟอง)', calories: 155, protein: 13, carbs: 1, fats: 11 },
  { name: 'สเต็กแซลมอนย่าง (180g)', calories: 360, protein: 38, carbs: 0, fats: 22 },
  { name: 'เวย์โปรตีน Isolate (1 สกู๊ป)', calories: 120, protein: 27, carbs: 2, fats: 1 },
  { name: 'สลัดผักอกไก่ + ไข่ต้ม (น้ำสลัดใส)', calories: 310, protein: 32, carbs: 14, fats: 10 },
  { name: 'ข้าวผัดกะเพราอกไก่คลีน (ไม่ใช้น้ำมัน)', calories: 390, protein: 38, carbs: 45, fats: 5 },
  { name: 'กรีกโยเกิร์ต + กล้วยหอม + บลูเบอร์รี่', calories: 220, protein: 18, carbs: 32, fats: 2 },
  { name: 'ข้าวกล้อง + ต้มยำกุ้งน้ำใส', calories: 340, protein: 28, carbs: 42, fats: 4 }
];

export const MEAL_RECOMMENDATIONS = [
  {
    title: 'ชุดสร้างกล้ามเนื้อ Lean Bulk',
    desc: 'อกไก่ย่าง 200g + ข้าวไรซ์เบอร์รี่ 1.5 ทัพพี + บรอกโคลี + อัลมอนด์ 10 เม็ด',
    icon: '🍗',
    calories: 560,
    protein: 52,
    carbs: 55,
    fats: 12,
    tag: 'High Protein'
  },
  {
    title: 'ชุดลีนไขมัน Fat Burn Pro',
    desc: 'สเต็กแซลมอนย่างเกลือ 180g + สลัดผักรวมน้ำสลัดงาญี่ปุ่น + ไข่ต้ม 1 ฟอง',
    icon: '🥗',
    calories: 450,
    protein: 42,
    carbs: 12,
    fats: 24,
    tag: 'Low Carb'
  },
  {
    title: 'ชุดพลังงานก่อนซ้อม Pre-Workout Power',
    desc: 'ข้าวโอ๊ตต้ม 50g + กล้วยหอม 1 ลูก + นมถั่วเหลือง + เวย์โปรตีน 1 สกู๊ป',
    icon: '🥣',
    calories: 430,
    protein: 34,
    carbs: 62,
    fats: 5,
    tag: 'Energy Boost'
  },
  {
    title: 'ชุดฟื้นฟูกล้ามเนื้อ Post-Workout Recovery',
    desc: 'ข้าวกล้อง 1 ทัพพี + ปลากะพงนึ่งซีอิ๊ว + ต้มจืดเต้าหู้หมูสับสาหร่าย',
    icon: '🍲',
    calories: 490,
    protein: 40,
    carbs: 48,
    fats: 9,
    tag: 'Recovery'
  },
  {
    title: 'ชุดของว่างคลีนบ่าย High-Protein Snack',
    desc: 'กรีกโยเกิร์ต 1 ถ้วย + เบอร์รี่สดรวม + เมล็ดเจีย 1 ช้อนชา',
    icon: '🫐',
    calories: 210,
    protein: 20,
    carbs: 22,
    fats: 3,
    tag: 'Healthy Snack'
  }
];

export class NutritionCalculator {
  /**
   * Calculate total nutrition consumed for a specific date
   */
  static calculateDayNutrition(foodLogs, dateStr) {
    const dayItems = foodLogs.filter(f => f.date === dateStr);
    
    return dayItems.reduce(
      (acc, item) => {
        acc.calories += Number(item.calories) || 0;
        acc.protein += Number(item.protein) || 0;
        acc.carbs += Number(item.carbs) || 0;
        acc.fats += Number(item.fats) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, count: dayItems.length }
    );
  }

  /**
   * Get random meal recommendation
   */
  static getRandomRecommendation() {
    const randIdx = Math.floor(Math.random() * MEAL_RECOMMENDATIONS.length);
    return MEAL_RECOMMENDATIONS[randIdx];
  }

  /**
   * Calculate BMI, BMR and TDEE
   */
  static calculateBmi(weightKg, heightCm) {
    if (!weightKg || !heightCm) return { bmi: 0, category: 'ไม่ระบุ', color: 'gray' };
    const hMeter = heightCm / 100;
    const bmi = parseFloat((weightKg / (hMeter * hMeter)).toFixed(1));

    let category = 'ปกติ (สมส่วน)';
    let color = 'var(--primary)';
    let advice = 'น้ำหนักอยู่ในเกณฑ์มาตรฐาน สุขภาพแข็งแรงดี';

    if (bmi < 18.5) {
      category = 'น้ำหนักน้อย (ผอม)';
      color = '#38bdf8';
      advice = 'ควรรับประทานอาหารให้ได้พลังงานและโปรตีนเพียงพอ พร้อมเล่นเวทเทรนนิ่งเพื่อเสริมสร้างมวลกล้ามเนื้อ';
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      category = 'น้ำหนักปกติ (สมส่วน)';
      color = 'var(--primary)';
      advice = 'ร่างกายอยู่ในเกณฑ์สมส่วน แนะนำให้ออกกำลังกายสม่ำเสมอและควบคุมโภชนาการให้ครบ 5 หมู่';
    } else if (bmi >= 23.0 && bmi <= 24.9) {
      category = 'น้ำหนักเกิน (ท้วม)';
      color = 'var(--amber)';
      advice = 'เริ่มมีน้ำหนักเกินเกณฑ์เล็กน้อย ควรเพิ่มการเผาผลาญด้วยคาร์ดิโอ และลดของหวาน ของทอด';
    } else {
      category = 'โรคอ้วน (Obese)';
      color = 'var(--rose)';
      advice = 'ควรปรึกษาแนวทางการออกกำลังกายแบบ Low Impact ควบคู่การคุมแคลอรี่แบบ Caloric Deficit';
    }

    return { bmi, category, color, advice };
  }
}

/**
 * Workout Programs Library & Exporter
 * Beginner -> Intermediate -> Advance Programs
 */

export const WORKOUT_PROGRAMS = [
  {
    id: 'prog_beg_01',
    level: 'beginner',
    levelLabel: 'Beginner (เริ่มต้น)',
    levelClass: 'prog-badge-beginner',
    title: 'Full Body Starter Routine',
    subtitle: 'สร้างพื้นฐานความแข็งแรงทั่วร่างกาย 3 วัน/สัปดาห์',
    duration: '3 วัน / สัปดาห์ (45-60 นาที/ครั้ง)',
    target: 'เสริมสร้างมวลกล้ามเนื้อพื้นฐาน ปรับท่าทาง และกระตุ้นระบบเผาผลาญ',
    features: [
      'ฝึกกล้ามเนื้อมัดใหญ่ครบในวันเดียว',
      'วันพักสลับวันฝึก เหมาะสำหรับผู้เริ่มต้น',
      'เรียนรู้ท่าฝึก Compound movements หลัก'
    ],
    schedule: [
      {
        day: 'วันที่ 1 (วันจันทร์) - Full Body A',
        exercises: [
          { name: 'Goblet Squat (ดัมเบล)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60-90 วินาที' },
          { name: 'Push-Up (หรือคุกเข่าวิดพื้น)', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '60 วินาที' },
          { name: 'Dumbbell Row (ก้มพายดัมเบล)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Dumbbell Shoulder Press', sets: '3 เซ็ต', reps: '10 ครั้ง', rest: '60 วินาที' },
          { name: 'Plank Hold', sets: '3 เซ็ต', reps: '30-45 วินาที', rest: '45 วินาที' }
        ]
      },
      {
        day: 'วันที่ 2 (วันพุธ) - Full Body B',
        exercises: [
          { name: 'Dumbbell Romanian Deadlift', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '90 วินาที' },
          { name: 'Dumbbell Bench / Floor Press', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Lat Pulldown (หรือ Resistance Band)', sets: '3 เซ็ต', reps: '12 ครั้ง', rest: '60 วินาที' },
          { name: 'Dumbbell Lunges', sets: '3 เซ็ต', reps: '10 ก้าว/ข้าง', rest: '60 วินาที' },
          { name: 'Hanging / Lying Knee Raise', sets: '3 เซ็ต', reps: '12 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'วันที่ 3 (วันศุกร์) - Full Body C + Light Cardio',
        exercises: [
          { name: 'Leg Press / Bodyweight Squat', sets: '3 เซ็ต', reps: '12-15 ครั้ง', rest: '60 วินาที' },
          { name: 'Incline Dumbbell Press', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Seated Cable Row', sets: '3 เซ็ต', reps: '12 ครั้ง', rest: '60 วินาที' },
          { name: 'Bicep Curl + Tricep Extension', sets: '2 เซ็ต', reps: '12 ครั้ง', rest: '45 วินาที' },
          { name: 'Cardio เดินเร็วความชัน (Zone 2)', sets: '1 เซ็ต', reps: '20-25 นาที', rest: '-' }
        ]
      }
    ]
  },
  {
    id: 'prog_beg_02',
    level: 'beginner',
    levelLabel: 'Beginner (เริ่มต้น)',
    levelClass: 'prog-badge-beginner',
    title: 'Home Calisthenics & Bodyweight',
    subtitle: 'โปรแกรมบอดี้เวทที่บ้าน ไม่ต้องใช้อุปกรณ์',
    duration: '3-4 วัน / สัปดาห์ (30-40 นาที)',
    target: 'ลดไขมัน กระชับสัดส่วน เสริมความทนทานของกล้ามเนื้อ',
    features: [
      'ไม่ต้องใช้อุปกรณ์ ทำได้ทุกที่',
      'ช่วยเพิ่มความคล่องตัวและเผาผลาญไขมัน',
      'มีท่าปรับระดับความง่าย-ยาก'
    ],
    schedule: [
      {
        day: 'Circuit Workout (วน 3-4 รอบ)',
        exercises: [
          { name: 'Bodyweight Squats', sets: '4 รอบ', reps: '15 ครั้ง', rest: '15 วินาที' },
          { name: 'Incline Push-ups / Floor Push-ups', sets: '4 รอบ', reps: '10-12 ครั้ง', rest: '15 วินาที' },
          { name: 'Alternating Reverse Lunges', sets: '4 รอบ', reps: '12 ก้าว/ข้าง', rest: '15 วินาที' },
          { name: 'Glute Bridge', sets: '4 รอบ', reps: '15 ครั้ง', rest: '15 วินาที' },
          { name: 'Mountain Climbers', sets: '4 รอบ', reps: '30 วินาที', rest: '15 วินาที' },
          { name: 'Jumping Jacks', sets: '4 รอบ', reps: '45 วินาที', rest: '60 วินาทีหลังจบรอบ' }
        ]
      }
    ]
  },
  {
    id: 'prog_int_01',
    level: 'intermediate',
    levelLabel: 'Intermediate (ปานกลาง)',
    levelClass: 'prog-badge-intermediate',
    title: 'Upper / Lower Split 4-Day',
    subtitle: 'แยกส่วนบน-ล่าง เพิ่มความหนาแน่นและกล้ามเนื้อชัดเจน',
    duration: '4 วัน / สัปดาห์ (60 นาที/ครั้ง)',
    target: 'เพิ่ม Hypertrophy และขนาดกล้ามเนื้ออย่างสมดุล',
    features: [
      'โดนกล้ามเนื้อแต่ละส่วนสัปดาห์ละ 2 ครั้ง',
      'สมดุลระหว่างความหนัก (Volume) และการพักฟื้น',
      'เหมาะสำหรับคนเล่นเวทมาแล้ว 3-6 เดือนขึ้นไป'
    ],
    schedule: [
      {
        day: 'วันจันทร์ - Upper A (เน้นแรงกด/อก-ไหล่)',
        exercises: [
          { name: 'Barbell Flat Bench Press', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '90-120 วินาที' },
          { name: 'Chest Supported Row', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Overhead Shoulder Press (Barbell/DB)', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Lat Pulldown (Neutral Grip)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Lateral Raise (ไหล่ข้าง)', sets: '4 เซ็ต', reps: '12-15 ครั้ง', rest: '45 วินาที' },
          { name: 'Tricep Rope Pushdown', sets: '3 เซ็ต', reps: '12-15 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'วันอังคาร - Lower A (เน้นต้นขาด้านหน้า)',
        exercises: [
          { name: 'Barbell Back Squat', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Romanian Deadlift (RDL)', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Bulgarian Split Squat', sets: '3 เซ็ต', reps: '10 ครั้ง/ข้าง', rest: '60 วินาที' },
          { name: 'Lying Leg Curl', sets: '3 เซ็ต', reps: '12-15 ครั้ง', rest: '60 วินาที' },
          { name: 'Standing Calf Raise', sets: '4 เซ็ต', reps: '15 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'วันพฤหัสบดี - Upper B (เน้นแรงดึง/หลัง-แขน)',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Barbell Bent-Over Row', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '90 วินาที' },
          { name: 'Dips (หรือ Machine Dip)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Face Pulls (ไหล่หลัง)', sets: '4 เซ็ต', reps: '15 ครั้ง', rest: '45 วินาที' },
          { name: 'Incline Dumbbell Curl (หน้าแขน)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'วันศุกร์ - Lower B (เน้นต้นขาด้านหลัง & ก้น)',
        exercises: [
          { name: 'Barbell Hip Thrust', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Leg Press', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '90 วินาที' },
          { name: 'Seated Hamstring Curl', sets: '3 เซ็ต', reps: '12 ครั้ง', rest: '60 วินาที' },
          { name: 'Leg Extension', sets: '3 เซ็ต', reps: '15 ครั้ง', rest: '45 วินาที' },
          { name: 'Hanging Leg Raises', sets: '4 เซ็ต', reps: '12-15 ครั้ง', rest: '45 วินาที' }
        ]
      }
    ]
  },
  {
    id: 'prog_int_02',
    level: 'intermediate',
    levelLabel: 'Intermediate (ปานกลาง)',
    levelClass: 'prog-badge-intermediate',
    title: 'Push-Pull-Legs (PPL) Classic',
    subtitle: 'โปรแกรมยอดนิยมระดับโลกเพื่อการขยายขนาดกล้ามเนื้ออย่างเต็มที่',
    duration: '5-6 วัน / สัปดาห์ (60-75 นาที)',
    target: 'Max Hypertrophy แยกมัดกล้ามเนื้อเฉพาะเจาะจง',
    features: [
      'โฟกัสกลุ่มกล้ามเนื้อทำงานร่วมกันอย่างสมบูรณ์',
      'ควบคุม Volume และความเข้มข้นได้สูง',
      'สลับวันฝึก Push / Pull / Legs ได้ยืดหยุ่น'
    ],
    schedule: [
      {
        day: 'Push Day (อก, ไหล่หน้า/ข้าง, หลังแขน)',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '90-120 วินาที' },
          { name: 'Incline Dumbbell Press', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Dumbbell Lateral Raise', sets: '4 เซ็ต', reps: '12-15 ครั้ง', rest: '45 วินาที' },
          { name: 'Cable Overhead Tricep Extension', sets: '3 เซ็ต', reps: '12-15 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'Pull Day (หลัง, ไหล่หลัง, หน้าแขน)',
        exercises: [
          { name: 'Conventional Deadlift / Rack Pull', sets: '3 เซ็ต', reps: '5 ครั้ง', rest: '2-3 นาที' },
          { name: 'Lat Pulldown / Pull-ups', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Single Arm Dumbbell Row', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Barbell Bicep Curl', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'Legs Day (ต้นขาหน้า, ก้น, แฮมสตริง, น่อง)',
        exercises: [
          { name: 'Barbell Squat', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Romanian Deadlift', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Walking Lunges', sets: '3 เซ็ต', reps: '12 ก้าว/ข้าง', rest: '60 วินาที' },
          { name: 'Standing Calf Raise', sets: '4 เซ็ต', reps: '15 ครั้ง', rest: '45 วินาที' }
        ]
      }
    ]
  },
  {
    id: 'prog_adv_01',
    level: 'advance',
    levelLabel: 'Advance (ขั้นสูง)',
    levelClass: 'prog-badge-advance',
    title: '5-Day Powerbuilding Elite',
    subtitle: 'รวมพลังความแข็งแกร่ง (Powerlifting) และรูปร่างที่คมชัด (Bodybuilding)',
    duration: '5 วัน / สัปดาห์ (75-90 นาที)',
    target: 'เพิ่ม 1RM ในท่า Squat, Bench, Deadlift ควบคู่กับสร้างกล้ามเนื้อระดับสูง',
    features: [
      'ใช้หลัก Progressive Overload และ Periodization',
      'เหมาะสำหรับนักกีฬาหรือผู้มีประสบการณ์มากกว่า 1-2 ปี',
      'รองรับการวัดสถิติ 1RM (One Rep Max)'
    ],
    schedule: [
      {
        day: 'Day 1: Heavy Bench & Upper Hypertrophy',
        exercises: [
          { name: 'Barbell Bench Press (Heavy)', sets: '5 เซ็ต', reps: '3-5 ครั้ง (RPE 8-9)', rest: '3 นาที' },
          { name: 'Incline Dumbbell Press', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Barbell Pendlay Row', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Close-Grip Bench Press', sets: '3 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Cable Lateral Raise', sets: '4 เซ็ต', reps: '15 ครั้ง (Myo-reps)', rest: '45 วินาที' }
        ]
      },
      {
        day: 'Day 2: Heavy Squat & Lower Volume',
        exercises: [
          { name: 'Barbell Back Squat (Heavy)', sets: '5 เซ็ต', reps: '3-5 ครั้ง', rest: '3 นาที' },
          { name: 'Romanian Deadlift (Pause at bottom)', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Leg Press (Drop set on last)', sets: '3 เซ็ต', reps: '10, 10, 10+drop', rest: '90 วินาที' },
          { name: 'Standing Calf Raise with 3s Pause', sets: '4 เซ็ต', reps: '12-15 ครั้ง', rest: '60 วินาที' }
        ]
      },
      {
        day: 'Day 3: Heavy Deadlift & Back Focus',
        exercises: [
          { name: 'Deadlift (Competition Stance)', sets: '4 เซ็ต', reps: '3-5 ครั้ง', rest: '3-4 นาที' },
          { name: 'Weighted Pull-ups', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Seated Cable Row (Wide grip)', sets: '3 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Incline Dumbbell Hammer Curl', sets: '4 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' }
        ]
      },
      {
        day: 'Day 4: Shoulder & Arm Specialization',
        exercises: [
          { name: 'Overhead Military Press', sets: '4 เซ็ต', reps: '5-6 ครั้ง', rest: '2 นาที' },
          { name: 'Dumbbell Arnold Press', sets: '3 เซ็ต', reps: '10 ครั้ง', rest: '60 วินาที' },
          { name: 'Super-set: Skull Crushers + EZ Bar Curl', sets: '4 เซ็ต', reps: '10-12 ครั้ง', rest: '60 วินาที' },
          { name: 'Reverse Pec Deck Fly', sets: '4 เซ็ต', reps: '15-20 ครั้ง', rest: '45 วินาที' }
        ]
      },
      {
        day: 'Day 5: Full Legs & Core Conditioning',
        exercises: [
          { name: 'Front Squat / Safety Bar Squat', sets: '4 เซ็ต', reps: '6-8 ครั้ง', rest: '2 นาที' },
          { name: 'Barbell Hip Thrust (Heavy)', sets: '4 เซ็ต', reps: '8-10 ครั้ง', rest: '90 วินาที' },
          { name: 'Walking Dumbbell Lunge', sets: '3 เซ็ต', reps: '15 ก้าว/ข้าง', rest: '60 วินาที' },
          { name: 'Ab Wheel Rollout + Hanging Leg Raise', sets: '3 เซ็ต', reps: '12 ครั้ง', rest: '45 วินาที' }
        ]
      }
    ]
  },
  {
    id: 'prog_adv_02',
    level: 'advance',
    levelLabel: 'Advance (ขั้นสูง)',
    levelClass: 'prog-badge-advance',
    title: 'Marathon & Hybrid Athletic Peak',
    subtitle: 'โปรแกรมซ้อมวิ่งระยะไกลผสานเวทเทรนนิ่งเพื่อนักกีฬาไฮบริด',
    duration: '5-6 วัน / สัปดาห์',
    target: 'เพิ่มความทนทานแบบแอโรบิก (VO2 Max) ป้องกันอาการบาดเจ็บ และทำ New PB',
    features: [
      'ผสมผสาน Interval Speedwork, Tempo Run, และ Long Slow Distance (LSD)',
      'Strength Training สำหรับนักวิ่งโดยเฉพาะ',
      'ตารางคำนวณ Pace และ Heart Rate Zone'
    ],
    schedule: [
      {
        day: 'Tuesday - Interval Track Speedwork',
        exercises: [
          { name: 'Warm-up Jog & Dynamic Drills', sets: '1 เซ็ต', reps: '15 นาที', rest: '-' },
          { name: '800m Repeats (5K Pace)', sets: '6 รอบ', reps: '800m', rest: 'จ็อกพัก 400m' },
          { name: 'Cool Down Jog & Mobility Stretch', sets: '1 เซ็ต', reps: '10 นาที', rest: '-' }
        ]
      },
      {
        day: 'Thursday - Tempo Run & Runner Strength',
        exercises: [
          { name: 'Tempo Run (Zone 3-4 Threshold Pace)', sets: '1 เซ็ต', reps: '8-10 km', rest: '-' },
          { name: 'Single-leg Romanian Deadlifts', sets: '3 เซ็ต', reps: '10/ข้าง', rest: '60 วินาที' },
          { name: 'Side Plank & Tibialis Raise', sets: '3 เซ็ต', reps: '45 วินาที', rest: '30 วินาที' }
        ]
      },
      {
        day: 'Sunday - Long Slow Distance (LSD)',
        exercises: [
          { name: 'LSD Run (Zone 2 Heart Rate)', sets: '1 เซ็ต', reps: '18-25 km', rest: 'ดื่มน้ำ/เจลทุก 5km' }
        ]
      }
    ]
  }
];

export class WorkoutProgramsManager {
  static getPrograms(filterLevel = 'all') {
    if (filterLevel === 'all') return WORKOUT_PROGRAMS;
    return WORKOUT_PROGRAMS.filter(p => p.level === filterLevel);
  }

  static getProgramById(id) {
    return WORKOUT_PROGRAMS.find(p => p.id === id) || null;
  }

  /**
   * Export program routine as a downloadable formatted text file
   */
  static downloadProgramAsText(prog) {
    if (!prog) return;

    let content = `====================================================\n`;
    content += `WORKOUT DIARY - ตารางโปรแกรมการออกกำลังกาย\n`;
    content += `====================================================\n\n`;
    content += `ชื่อโปรแกรม: ${prog.title}\n`;
    content += `ระดับ: ${prog.levelLabel}\n`;
    content += `ความถี่/ระยะเวลา: ${prog.duration}\n`;
    content += `เป้าหมาย: ${prog.target}\n\n`;
    content += `----------------------------------------------------\n`;
    content += `ตารางฝึกซ้อมและรายการท่า (Detailed Schedule):\n`;
    content += `----------------------------------------------------\n\n`;

    prog.schedule.forEach((daySchedule, idx) => {
      content += `[${daySchedule.day}]\n`;
      daySchedule.exercises.forEach((ex, eIdx) => {
        content += `  ${eIdx + 1}. ${ex.name} | ${ex.sets} | ${ex.reps} (พัก: ${ex.rest})\n`;
      });
      content += `\n`;
    });

    content += `----------------------------------------------------\n`;
    content += `คำแนะนำเพิ่มเติม:\n`;
    content += `- ควรวอร์มอัพร่างกายและยืดกล้ามเนื้อแบบ Dynamic ก่อนเริ่มฝึก 5-10 นาที\n`;
    content += `- ดื่มน้ำสะอาดให้เพียงพอระหว่างฝึกซ้อม\n`;
    content += `- คูลดาวน์และยืดเหยียดแบบ Static Stretch หลังฝึกเสร็จ\n`;
    content += `\nสร้างจาก Workout Diary Web App (${new Date().toLocaleDateString('th-TH')})\n`;

    // Download blob
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prog.title.replace(/\s+/g, '_')}_Workout_Routine.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

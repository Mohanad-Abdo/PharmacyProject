const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/MedicineController');
// *** التعديل هنا: استيراد الـ Middleware ***
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

// تطبيق requireLogin على جميع مسارات الأدوية
// أي مستخدم غير مسجل سيتم توجيهه إلى صفحة الدخول

// GET /medicines: عرض قائمة الأدوية (يتطلب تسجيل دخول فقط)
router.get('/', requireLogin, medicineController.getAllMedicines);

// GET /medicines/new: عرض نموذج إنشاء دواء جديد (يتطلب تسجيل دخول)
router.get('/new', requireLogin, medicineController.createMedicineForm);

// POST /medicines: معالجة بيانات النموذج لإنشاء دواء (يتطلب تسجيل دخول)
router.post('/', requireLogin, medicineController.createMedicine);

// GET /medicines/edit/:id: عرض نموذج تعديل دواء معين (يتطلب تسجيل دخول)
router.get('/edit/:id', requireLogin, medicineController.editMedicineForm);

// POST /medicines/:id: معالجة بيانات النموذج لتحديث دواء (يتطلب تسجيل دخول)
router.post('/:id', requireLogin, medicineController.updateMedicine);

// POST /medicines/delete/:id: معالجة طلب حذف دواء معين (يتطلب تسجيل دخول)
// يمكننا هنا تطبيق requireRole('admin') إذا أردنا أن يكون الحذف للمسؤول فقط:
// router.post('/delete/:id', requireRole('admin'), medicineController.deleteMedicine);
router.post('/delete/:id', requireLogin, medicineController.deleteMedicine);


module.exports = router;
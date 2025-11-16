const Medicine = require('../models/Medicine');

// تعريف متحكم الأدوية ككائن يحتوي على دوال (Methods)
const medicineController = {

    // 1. عرض جميع الأدوية (READ ALL)
    // هذا المتحكم سيعرض قائمة بجميع الأدوية الموجودة
    async getAllMedicines(req, res) {
        try {
            // استخدام model.find() لجلب جميع المستندات
            const medicines = await Medicine.find().sort({ name: 1 });
            // عرض صفحة 'medicines/index.ejs' وإرسال البيانات إليها
            res.render('medicines/index', { pageTitle: 'قائمة الأدوية', medicines });
        } catch (error) {
            res.status(500).send('حدث خطأ أثناء جلب الأدوية: ' + error.message);
        }
    },

    // 2. عرض نموذج إنشاء دواء جديد (CREATE VIEW)
    async createMedicineForm(req, res) {
        // عرض صفحة 'medicines/new.ejs'
        res.render('medicines/new', { pageTitle: 'إضافة دواء جديد' });
    },

    // 3. معالجة طلب إنشاء دواء جديد (CREATE LOGIC)
    // هذا المتحكم يستقبل بيانات النموذج ويحفظها في قاعدة البيانات
    // شرح مصطلح: Middleware
    // Middleware are functions that have access to the request object (req), 
    // the response object (res), and the next middleware function in the application’s 
    // request-response cycle. They are often used for logging, authentication, or parsing request bodies.
    // (دوال يتم تنفيذها بين استقبال الطلب وإرسال الاستجابة، وتُستخدم هنا لاستقبال بيانات النموذج (POST)).
    async createMedicine(req, res) {
        try {
            // req.body يحتوي على البيانات المرسلة من النموذج (سنقوم بتهيئته لاحقاً في server.js)
            await Medicine.create(req.body);
            // إعادة التوجيه إلى صفحة قائمة الأدوية بعد الإضافة بنجاح
            res.redirect('/medicines');
        } catch (error) {
            // في حال فشل الحفظ بسبب متطلبات المخطط (Schema Validation)
            // سنقوم بتحسين هذا لاحقاً لعرض رسالة خطأ أفضل
            res.status(400).send('فشل إنشاء الدواء: ' + error.message);
        }
    },

    // 4. عرض نموذج تعديل دواء موجود (UPDATE VIEW)
    async editMedicineForm(req, res) {
        try {
            // req.params.id يحتوي على معرف الدواء (ID) الموجود في رابط URL
            const medicine = await Medicine.findById(req.params.id);
            if (!medicine) {
                return res.status(404).send('الدواء غير موجود.');
            }
            res.render('medicines/edit', { pageTitle: 'تعديل الدواء', medicine });
        } catch (error) {
            res.status(500).send('حدث خطأ أثناء جلب بيانات التعديل: ' + error.message);
        }
    },

    // 5. معالجة طلب تعديل دواء (UPDATE LOGIC)
    async updateMedicine(req, res) {
        try {
            // model.findByIdAndUpdate() لتحديث المستند بناءً على ID
            await Medicine.findByIdAndUpdate(req.params.id, req.body, { 
                new: true, // لإرجاع المستند بعد التحديث
                runValidators: true // لتطبيق قواعد المخطط (Schema)
            });
            res.redirect('/medicines');
        } catch (error) {
            res.status(400).send('فشل تحديث الدواء: ' + error.message);
        }
    },

    // 6. معالجة طلب حذف دواء (DELETE LOGIC)
    async deleteMedicine(req, res) {
        try {
            // model.findByIdAndDelete() لحذف المستند بناءً على ID
            await Medicine.findByIdAndDelete(req.params.id);
            res.redirect('/medicines');
        } catch (error) {
            res.status(500).send('فشل حذف الدواء: ' + error.message);
        }
    }
};

module.exports = medicineController;
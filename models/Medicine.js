const mongoose = require('mongoose');

// شرح مصطلح: Schema
// A Schema defines the structure of the document (data record) 
// that will be stored in the MongoDB collection. It specifies the fields, 
// their data types (String, Number, Date, etc.), and validation rules. 
// (يحدد شكل وبنية البيانات لكل سجل في قاعدة البيانات، مثل الحقول وأنواعها).

const medicineSchema = new mongoose.Schema({
    // اسم الدواء (مطلوب، ونزيل المسافات البيضاء، ويتم فهرسته لسرعة البحث)
    name: {
        type: String,
        required: [true, 'اسم الدواء مطلوب.'],
        trim: true,
        unique: true
    },
    // المادة الفعالة
    activeIngredient: {
        type: String,
        trim: true,
        default: 'غير محدد'
    },
    // سعر البيع
    price: {
        type: Number,
        required: [true, 'السعر مطلوب.'],
        min: [0, 'السعر لا يمكن أن يكون سالباً.']
    },
    // الكمية المتوفرة في المخزون
    stock: {
        type: Number,
        required: [true, 'الكمية في المخزون مطلوبة.'],
        default: 0,
        min: [0, 'المخزون لا يمكن أن يكون سالباً.']
    },
    // تاريخ انتهاء الصلاحية
    expiryDate: {
        type: Date,
        required: [true, 'تاريخ انتهاء الصلاحية مطلوب.']
    },
    // وصف موجز للدواء (اختياري)
    description: {
        type: String,
        trim: true
    }
}, {
    // إضافة حقول تلقائية (createdAt و updatedAt) لتتبع إنشاء وتحديث السجل
    timestamps: true
});

// تعريف النموذج (Model) وتصديره
// Model is a constructor compiled from a Schema definition. 
// An instance of a Model is called a Document. 
// (بناء النموذج النهائي الذي يمكننا من خلاله تنفيذ الأوامر على قاعدة البيانات).
const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
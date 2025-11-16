const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // لاستخدام دالة تجزئة كلمة المرور

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'اسم المستخدم مطلوب.'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب.'],
        trim: true,
        unique: true
    },
    password: {
        // سيتم تخزين كلمة المرور بعد تجزئتها (Hashed)
        type: String,
        required: [true, 'كلمة المرور مطلوبة.']
    },
    role: {
        // دور المستخدم (مثلاً: admin, pharmacist)
        type: String,
        enum: ['admin', 'pharmacist'], // تحديد القيم المسموح بها
        default: 'pharmacist'
    }
}, {
    timestamps: true
});

// شرح مصطلح: Hashing (التجزئة)
// Hashing is the process of converting an input (like a password) into a fixed-size, 
// non-reversable string of characters (the hash). We use it to store passwords securely 
// so that even if the database is compromised, the actual passwords cannot be easily read.
// (عملية تحويل البيانات إلى سلسلة أحرف ثابتة غير قابلة للعكس، تستخدم لتخزين كلمات المرور بشكل آمن).


// *** MIDDLEWARE: تجزئة كلمة المرور قبل الحفظ ***
// هذا الكود يتم تنفيذه "قبل" حفظ المستند (المستخدم) في قاعدة البيانات
userSchema.pre('save', async function(next) {
    const user = this;
    // إذا لم تتغير كلمة المرور أو كان المستخدم جديداً، ننتقل للخطوة التالية
    if (!user.isModified('password')) return next();
    
    try {
        // إنشاء قيمة عشوائية (Salt) لزيادة أمان التجزئة
        const salt = await bcrypt.genSalt(10);
        // تجزئة كلمة المرور الجديدة
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});


// *** إضافة دالة للمقارنة بين كلمة المرور المدخلة وكلمة المرور المجزأة ***
userSchema.methods.comparePassword = async function(candidatePassword) {
    // استخدام bcrypt.compare لمقارنة الكلمة المدخلة مع التجزئة المخزنة
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
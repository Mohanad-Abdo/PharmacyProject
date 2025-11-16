// 1. استيراد الحزم الضرورية
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// *** التعديل 1: استيراد حزم الجلسات وتخزينها ***
const session = require('express-session');
const MongoStore = require('connect-mongo');
// **********************************************

// استيراد ملفات التوجيه
const medicineRoutes = require('./routes/medicineRoutes');
const authRoutes = require('./routes/authRoutes'); // *** التعديل 2: استيراد توجيهات المصادقة ***

const app = express();

// 2. الاتصال بـ MongoDB
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err, 'Check your .env file credentials.');
        process.exit(1); 
    });

// 3. إعداد محرك العرض والمجلد العام ومعالجة البيانات
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// *** التعديل 3: إعداد الجلسات (Sessions Configuration) ***
// هذا الإعداد يخبر الخادم بكيفية إدارة الجلسات
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey', // مفتاح سري لتشفير الـ Cookie
    resave: false, // لا تعيد حفظ الجلسة إذا لم تتغير
    saveUninitialized: false, // لا تحفظ جلسة جديدة غير مهيأة
    store: MongoStore.create({ // تخزين الجلسة في قاعدة البيانات
        mongoUrl: DB_URI,
        collectionName: 'sessions', // اسم المجموعة (Collection) في MongoDB لتخزين الجلسات
        ttl: 14 * 24 * 60 * 60, // مدة صلاحية الجلسة بالثواني (14 يوم)
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 * 14 // صلاحية ملف تعريف الارتباط (Cookie) 14 يوم
    }
}));
// *********************************************************

// 4. ربط ملفات التوجيه (Routes)
app.use('/medicines', medicineRoutes);
app.use('/auth', authRoutes); // *** التعديل 4: ربط مسارات المصادقة ***

// 5. الموجه (Route) الافتراضي: توجيه المستخدم لصفحة الدخول إذا لم يكن مسجلاً
app.get('/', (req, res) => {
    // إذا كان المستخدم مسجلاً دخوله، وجهه لصفحة الأدوية، وإلا، لصفحة الدخول
    if (req.session.userId) {
        res.redirect('/medicines');
    } else {
        res.redirect('/auth/login');
    }
});

// 6. تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Access Login at http://localhost:${PORT}/auth/login`);
});
const User = require('../models/User');

const authController = {

    // 1. عرض نموذج تسجيل جديد
    registerForm(req, res) {
        // عرض صفحة 'auth/register.ejs'
        res.render('auth/register', { pageTitle: 'تسجيل مستخدم جديد' });
    },

    // 2. معالجة طلب التسجيل
    async registerUser(req, res) {
        try {
            // إنشاء مستخدم جديد. الـ middleware في نموذج User.js سيتولى تجزئة كلمة المرور.
            await User.create(req.body);
            // توجيه المستخدم لصفحة تسجيل الدخول
            res.redirect('/auth/login');
        } catch (error) {
            // التعامل مع الأخطاء (مثل تكرار اسم المستخدم أو البريد)
            res.render('auth/register', { 
                pageTitle: 'تسجيل مستخدم جديد', 
                errorMessage: 'فشل التسجيل. ربما اسم المستخدم أو البريد مستخدم بالفعل.' 
            });
        }
    },

    // 3. عرض نموذج تسجيل الدخول
    loginForm(req, res) {
        // عرض صفحة 'auth/login.ejs'
        res.render('auth/login', { pageTitle: 'تسجيل الدخول' });
    },

    // 4. معالجة طلب تسجيل الدخول
    async loginUser(req, res) {
        const { username, password } = req.body;
        try {
            // البحث عن المستخدم
            const user = await User.findOne({ username });
            if (!user) {
                // المستخدم غير موجود
                return res.render('auth/login', { pageTitle: 'تسجيل الدخول', errorMessage: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
            }

            // مقارنة كلمة المرور المدخلة بالتجزئة المخزنة
            const isMatch = await user.comparePassword(password);
            
            if (isMatch) {
                // شرح مصطلح: Session (الجلسة)
                // A session is a way to store information (like the user's ID) on the server 
                // about a user that persists across multiple requests. The server sends 
                // a small identifier (Session ID) to the browser, which sends it back with every request.
                // (طريقة لتخزين معلومات المستخدم (مثل هويته) على الخادم وتستمر طوال فترة استخدامه للموقع).

                // حفظ بيانات المستخدم في الجلسة (تسجيل الدخول بنجاح)
                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.userRole = user.role; 

                // التوجيه إلى الصفحة الرئيسية للأدوية بعد تسجيل الدخول
                res.redirect('/medicines'); 
            } else {
                // كلمة المرور غير صحيحة
                res.render('auth/login', { pageTitle: 'تسجيل الدخول', errorMessage: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
            }
        } catch (error) {
            res.status(500).send('خطأ في عملية تسجيل الدخول: ' + error.message);
        }
    },

    // 5. تسجيل الخروج
    logoutUser(req, res) {
        // تدمير الجلسة (Session Destruction)
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout Error:', err);
                return res.status(500).send('فشل تسجيل الخروج');
            }
            // التوجيه إلى صفحة تسجيل الدخول
            res.redirect('/auth/login');
        });
    }
};

module.exports = authController;
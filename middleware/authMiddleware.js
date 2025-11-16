// Middleware للتحقق من تسجيل الدخول
const requireLogin = (req, res, next) => {
    // التحقق من وجود معرف المستخدم (userId) في الجلسة (Session)
    if (!req.session.userId) {
        // إذا لم يكن مسجلاً، أعد توجيهه إلى صفحة تسجيل الدخول
        return res.redirect('/auth/login');
    }
    // إذا كان مسجلاً، انتقل إلى الدالة التالية (Route Handler)
    next();
};

// Middleware للتحقق من دور (Role) المستخدم
const requireRole = (role) => {
    return (req, res, next) => {
        // التحقق من وجود معرف المستخدم ودوره (وهو مخزن في الجلسة)
        if (req.session.userId && req.session.userRole === role) {
            // إذا كان مسجلاً ولديه الدور الصحيح، انتقل
            next();
        } else {
            // إذا لم يكن لديه الصلاحية، يمكننا إرسال رسالة 403 (Forbidden)
            res.status(403).send('ممنوع: ليس لديك الصلاحيات الكافية للوصول.');
        }
    };
};

module.exports = {
    requireLogin,
    requireRole
};
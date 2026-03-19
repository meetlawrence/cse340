// This is the middleware the instructions refer to conceptually
export const checkLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // They are logged in, let them through
    } else {
        req.flash('error', 'Please log in to access this page.');
        res.redirect('/login'); // They aren't logged in, send them to login
    }
};
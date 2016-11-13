module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/posts');
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    // error page
    app.use(function(err, req, res, next) {
        res.render('error', {
            error: err
        });
    });
};

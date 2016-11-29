/**
 * Login View
 *
 * @author Fengbin
 */

define([
    './baseView',
    '../models/userModel',
    'text!../templates/login.html'
], function(BaseView, UserModel, loginTemplate) {
    var loginView = BaseView.extend({
        model: new UserModel(),
        events: {
            'click #login': 'do_login',
            'click #cancel': 'cancel'
        },
        render: function() {
            var login_form = this.compileTemplate(loginTemplate).render({});

//            $('#login').click($.proxy(this.do_login, this));
            this.$el.html(login_form);
            return this;
        },

        do_login: function(e){
            e.preventDefault();
            var data = this.Syphon.serialize(this);
            var self = this;
            console.dir(data);
            var success = function(response) {
                console.log('success');
                if (response) { // auth success
                    window.location.assign('/index')
                } else {
                    self.notify('error', 'Login Failed');
                }
            }
            var failure = function(response) {
                console.log('error');
            }
            $.ajax({
                url: '/login',
                method: 'POST',
                data: data,
                success: success,
                failure: failure
            })
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });

    return loginView;
})

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
        el: '#modal_pane',
        events: {
            'click #login': 'do_login'
        },
        render: function() {
            var login_form = this.compileTemplate(loginTemplate).render({});

            $('#login').click($.proxy(this.do_login, this));
            this.$el.html(login_form);
            UIkit.modal("#modal_pane").show();
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
        }
    });

    return loginView;
})

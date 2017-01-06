/**
 * Login View
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/login.html'
], function(BaseView, LoginTemplate) {
    var loginView = BaseView.extend({
        events: {
            'click #login': 'do_login',
            'keyup input': 'onKeyup',
            'click #cancel': 'cancel'
        },
        template: function(data) {
            return Hogan.compile(LoginTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },

        do_login: function(e){
            e.preventDefault();

            var self = this;
            var data = Backbone.Syphon.serialize(this);
            if (!data.username || !data.password) {
                self.notify('warning', 'User name and password could not be empty.');
                return false;
            }
            $.ajax({
                url: '/login',
                method: 'POST',
                data: data,
                success: function(response) {
                    console.log('success');
                    if (response.is_auth) { // auth success
                        self.triggerMethod('login:succeed', response.user);
                        // set current user?
                        UIkit.modal("#overlay").hide();
                    } else {
                        self.notify('danger', 'Login Failed', 0);
                    }
                },
                failure: function(response) {
                    console.log('error');
                }
            });
        },

        onKeyup: function(e) {
            if (e.keyCode == 13) {
                this.do_login(e);
            }
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });

    return loginView;
})

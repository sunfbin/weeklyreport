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
            'change input[name=username]': 'onNameChange',
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
            $.ajax({
                url: '/login',
                method: 'POST',
                data: data,
                success: function(response) {
                    console.log('success');
                    if (response) { // auth success
                        self.triggerMethod('login:succeed');
                        UIkit.modal("#overlay").hide();
                    } else {
                        self.notify('danger', 'Login Failed');
                    }
                },
                failure: function(response) {
                    console.log('error');
                }
            });
        },

        onNameChange: function(e) {
            this.$el.find('.alert-row').html('');
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });

    return loginView;
})

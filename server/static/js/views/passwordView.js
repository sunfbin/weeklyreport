/**
 * View for changing password
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/passwordChange.html'
], function(BaseView, viewTemplate) {
    var PasswordChangeView = BaseView.extend({
        events: {
            'click #save' : 'save',
            'click #cancel' : 'cancel'
        },
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        onRender: function() {
            this.$el.find('label[for=old_pwd]').trigger('click')
        },

        save: function() {
            var self = this;
            var data = Backbone.Syphon.serialize(this);
            var validate = true;
            if (!data.old_pwd) {
                self.notify('danger', 'Please enter old password.');
                validate = false;
            }
            if (!data.new_pwd) {
                self.notify('danger', 'New password could not be empty.');
                validate = false;
            }
            if (!data.confirm_pwd || data.confirm_pwd!=data.new_pwd) {
                self.notify('danger', 'Confirm password is not same to new password');
                validate = false;
            }
            if (data.new_pwd == data.old_pwd) {
                self.notify('danger', 'New password could not be the same to the old one.');
                validate = false;
            }
            if (!validate) {
                return false;
            }
            var data = {
                user_id: this.options.loginUser.id,
                pwd: data.old_pwd,
                new_pwd: data.new_pwd
            }
            $.ajax({
                url: '/users/change_password',
                method: 'post',
                data: data,
                success: function(response) {
                    if (!response.success) {
                        self.notify('danger', response.msg);
                    } else {
                        UIkit.modal.alert('Password changed. You need relogin', {
                            'bgclose': true,
                            'keyboard': true
                        });
                        $('.uk-button.uk-modal-close').on('click', function(e) {
                            location.reload();
                        })
                    }
                    // TODO ?? logout the app? on clicking on OK button?
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });
    return PasswordChangeView;
})


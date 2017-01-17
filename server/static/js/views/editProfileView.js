/**
 * View for user to edit own information, like avatar, ...
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/editProfile.html'
], function(BaseView, viewTemplate) {
    var PasswordChangeView = BaseView.extend({
        events: {
            'click #save' : 'cancel',
            'click #select-avatar' : 'selectAvatar',
            'click #cancel' : 'cancel'
        },
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        onRender: function() {
            this.$el.find('label[for=old_pwd]').trigger('click')
        },

        selectAvatar: function() {
            var self = this;

        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });
    return PasswordChangeView;
})


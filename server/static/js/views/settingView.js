/**
 * View for configuration
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/settings.html'
], function(BaseView, viewTemplate) {
    var SettingsView = BaseView.extend({
        events: {
            'click #save' : 'save',
            'click #cancel' : 'cancel'
        },

        render: function() {
            var form = this.compileTemplate(viewTemplate).render();
            this.$el.html(form);
            return this;
        },

        save: function() {
            console.log('save');
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });
    return SettingsView;
})


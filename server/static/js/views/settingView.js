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
            'click #save' : this.save,
            'click #cancel' : this.cancel
        },
        el: '#modal_pane',
        render: function() {
            console.log("settings view render");
            var form = this.compileTemplate(viewTemplate).render();
            this.$el.html(login_form);
            UIkit.modal("#modal_pane").show();
            return this;
        },
        cancel: function() {
            this.destroy();
        }
    });
    return SettingsView;
})


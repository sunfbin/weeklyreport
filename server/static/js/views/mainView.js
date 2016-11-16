/**
 * View after user login. show the whole page
 *
 * @author Fengbin
 */

define([
    './baseView',
    './settingView',
    'text!../templates/main.html'
], function(BaseView, SettingsView, IndexTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
            'click #settings': 'config'
        },
        render: function() {
            console.log("main view render");
            var form = this.compileTemplate(IndexTemplate).render();
            $("body").html(form);
        },

        logout: function() {
            console.log("click on logout")
        },

        config: function() {
            var settingView = new SettingsView();
            settingView.render();
        }

    });
    return MainView;
})


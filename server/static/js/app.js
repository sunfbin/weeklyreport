/**
 * Application
 *
 * @author Fengbin
 */

define([
    './views/loginView',
    './views/mainView'
], function(LoginView, MainView) {
    window.weeklyReport = new Backbone.Marionette.Application({
        region: 'body',
        onStart: function() {
            var self = this;
            console.log("on start app");
            Backbone.history.start();

            var mainView = new MainView();
            self.showView(mainView);

            $.ajax({
                url: '/is_authenticated',
                method: 'POST',
                success: function(response){
                    console.log("check auth result:"+response);
                    if (!response.is_auth) {
                        var options = {
                            model: {
                                'closable': false
                            }
                        };
                        var loginView = new LoginView(options);
                        mainView.showOverlay(loginView);
                    } else {
                        mainView.auth_succeed(response.user);
                    }
                }
            });
        }
    });

    return weeklyReport;
})


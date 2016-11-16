/**
 * Application
 *
 * @author Fengbin
 */

define([
    'marionette',
    './views/loginView',
    './views/mainView'
], function(Marionette, LoginView, MainView) {
    window.weeklyreport = new Marionette.Application({
        region: 'body',
        onStart: function() {
            Backbone.history.start();
            var mainView = new MainView();
            this.showView(mainView);
            console.log("on start app");
        },
        start: function() {
            console.log("start app");
            $.ajax({
                url: '/is_authenticated',
                method: 'POST',
                success: function(response){
                    console.log("check auth success");
                    console.log(response);
                    if (response) {
                        var mainView = new MainView()
                        mainView.render();
                        var loginView = new LoginView()
                        loginView.render();
                    } else {
                    }
                },
                failure: function() {
                    console.log("check auth fail");
                    var loginView = new LoginView()
                    loginView.render();
                }
            })
        }
    });
    return weeklyreport;
})


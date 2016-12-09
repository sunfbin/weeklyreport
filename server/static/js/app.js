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
                    if (!response) {
                        var model = {'closable': false};
                        var loginView = new LoginView({model: model});
                        mainView.showChildView('overlay', loginView);
                        var opt = {'bgclose': false, 'keyboard': false, 'center': true};
                        mainView.showModalOverlay(opt);
                    } else {
                        mainView.auth_succeed();
                    }
                }
            });
        }
    });

    return weeklyReport;
})


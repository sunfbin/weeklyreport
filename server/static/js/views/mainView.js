/**
 * View after user login. show the whole page
 *
 * @author Fengbin
 */

define([
    './baseView',
    './loginView',
    './settingView',
    './weeksView',
    './membersView',
    './mainContentView',
    './passwordView',
    'text!../templates/main.html'
], function(BaseView, LoginView, SettingsView, WeeksView,
            MembersView, MainContentView, PasswordView, IndexTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
            'click #change-password' : 'changePassword',
            'click #preview-tasks' : 'preview',
            'click #settings': 'config'
        },
        className: 'uk-height-viewport',
        triggers: {},
        childViewEvents: {
            'week:selected': 'onWeekSelected',
            'login:succeed': 'auth_succeed',
            'member:selected': 'loadMemberTasks'
        },
        regions: {
            'week-list': '#primary_nav',
            'overlay': '#overlay',
            'member-list': '#members-view',
            'main-content': '#main-content'
        },
        template: function() {
            return Hogan.compile(IndexTemplate).render();
        },

        onRender: function() {
            var self = this;

            this.on('attach', function() {
                UIkit.modal('#overlay').on({
                    'show.uk.modal': function(){},
                    'hide.uk.modal': function(){
                        self.detachChildView('overlay');
                    }
                });
            });

            var mainContentView = new MainContentView();
            self.showChildView('main-content', mainContentView);
        },

        auth_succeed: function(user) {
            var self = this;
            this.loginUser = user;
            this.$el.find('#loginUser span').text(this.loginUser.name);
            var getNextWeek = function() {
                return $.ajax({
                    url: '/weeks/next',
                    method: 'get'
                });
            };
            $.when(getNextWeek()).done(function(nextWeek, message){
                self.selectedWeek = nextWeek;
                self.loadWeeks();
                self.loadMembers();
            });
        },

        onWeekSelected: function(week) {
            this.selectedWeek = week;
            this.$el.find('#report-date').html(this.selectedWeek.date);
            this.$el.find('#report-date')[0].dataset.weekId = this.selectedWeek.id;

            var memberView = this.getChildView('member-list');
            if (memberView) {
                memberView.getUI('members').parents('ul').find('li.uk-active>a').trigger('click', true);
            }
        },

        loadWeeks: function() {
            var self = this;
            $.ajax({
                url: '/weeks',
                method: 'get',
                success: function(response) {
                    var view = new WeeksView({collection: response.weeks});
                    self.showChildView('week-list', view);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        loadMembers: function() {
            var self = this;
            $.ajax({
                url: '/users',
                method: 'get',
                success: function(response) {
                    var view = new MembersView({collection: response.users, loginUser: self.loginUser});
                    self.showChildView('member-list', view);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        logout: function() {
            $.ajax({
                url: '/logout',
                method: 'post',
                success: function(response) {
                    location.reload();
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        config: function() {
            var settingView = new SettingsView();
            this.showOverlay(settingView);
        },

        loadMemberTasks: function(member) {
            var opts = {
                selectedUser: {
                    id: member.id,
                    name: member.name.trim()
                },
                selectedWeek: this.selectedWeek,
                loginUser : this.loginUser
            };
            this.getChildView('main-content').reloadTasks(opts);
        },

        showOverlay: function(view, options) {
            var opts = {'bgclose': false, 'keyboard': false, 'center': true};
            opts = options || opts;
            this.showChildView('overlay', view);
            _.extend(UIkit.modal('#overlay').options, opts);
            UIkit.modal('#overlay').show();
        },

        changePassword: function(e) {
            var pwdChangeView = new PasswordView({loginUser: this.loginUser});
            this.showOverlay(pwdChangeView);
        }
    });
    return MainView;
})


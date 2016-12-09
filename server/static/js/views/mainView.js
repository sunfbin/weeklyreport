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
    './tasksView',

    'text!../templates/main.html'
], function(BaseView, LoginView, SettingsView, WeeksView,
            MembersView, TasksMainView,
             IndexTemplate, taskTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
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
            'main-grid': '#main-grid'
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

            var mainGridView = new TasksMainView();
            self.showChildView('main-grid', mainGridView);


        },

        auth_succeed: function() {
            var self = this;
            var getNextWeek = function() {
                return $.ajax({
                    url: '/weeks/next',
                    method: 'get',
                    success: function(response) {
                        //
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
            };
            $.when(getNextWeek()).done(function(nextWeek, message){
                self.date = nextWeek.date;
                self.weekId = nextWeek.id;
                self.loadWeeks();
                self.loadMembers();
                self.$el.find("#new-task-eta").val(self.date);
            });
        },

        onWeekSelected: function(week) {
            this.weekId = week.id;
            this.$el.find('#report-date').html(week.date);
            this.$el.find('#report-date')[0].dataset.weekId = week.id;

            var memberView = this.getChildView('member-list');
            if (memberView) {
                memberView.getUI('members').parents('ul').find('li.uk-active>a').trigger('click');
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
                    var view = new MembersView({collection: response.users});
                    self.showChildView('member-list', view);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        showModalOverlay: function(opt) {
            _.extend(UIkit.modal('#overlay').options, opt);
            UIkit.modal('#overlay').show();
        },

        logout: function() {
            console.log('click on logout')

            this.showChildView('overlay', new LoginView({model: {closable: true}}));
            this.showModalOverlay({'bgclose': false, 'keyboard': false, 'center': true});

        },

        config: function() {
            var settingView = new SettingsView();
            this.showChildView('overlay', settingView);
            this.showModalOverlay({'bgclose': false, 'keyboard': false, 'center': true});
        },

        loadMemberTasks: function(member) {

            this.userId = member.id;

            var data = {
                userId: this.userId,
                userName: member.name,
                weekId: this.weekId
            };
            this.getChildView('main-grid').reloadTasks(data);
        }
    });
    return MainView;
})


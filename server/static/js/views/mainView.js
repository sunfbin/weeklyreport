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
            MembersView, TasksView, IndexTemplate, taskTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',

            'click #settings': 'config'
        },
        className: 'uk-height-viewport',
        triggers: {},
        childViewEvents: {
            'week:selected': 'onWeekSelected',
            'task:deleted': 'reloadTasks',
            'task:added': 'reloadTasks',
            'task:edited': 'reloadTasks',
            'member:selected': 'loadMemberTasks'
        },
        regions: {
            'week-list': '#primary_nav',
            'overlay': '#overlay',
            'member-list': '#members-view',
            'task-view': '#task-view',
            'main-grid': '#main-grid'
        },
        template: function() {
            return Hogan.compile(IndexTemplate).render();
        },

        onRender: function() {
            var self = this;

            this.on('attach', function() {
                UIkit.modal('#overlay').on({

                    'show.uk.modal': function(){
                        //console.log('Modal is visible.');
                    },

                    'hide.uk.modal': function(){
                        //console.log('Element is not visible.');
                        self.detachChildView('overlay');
                    }
                });
            });

            var getNextWeek = $.Deferred(function() {
                $.ajax({
                    url: '/weeks/next',
                    method: 'get',
                    success: function(response) {
                        self.date = response.date;
                        self.nextWeekId = response.id;
                        getNextWeek.resolve();
    //                    self.$el.find('#report-date').html(response.date);
    //                    self.$el.find('#report-date')[0].dataset.nextWeekId = response.id;
    //                    self.selectMember();
    //                    self.$el.find("#new-task-eta").val(self.date);
                    },
                    error: function(response) {
                        console.log(response);
                        getNextWeek.reject();
                    }
                });
            });
//            $.when().then();
//            this.init();
            this.loadWeeks();
            this.loadMembers();
            return this;
        },

        onWeekSelected: function(week) {
            this.nextWeekId = week.id;
            this.$el.find('#report-date').html(week.date);
            this.$el.find('#report-date')[0].dataset.nextWeekId = week.id;

            var memberView = this.getChildView('member-list');
            if (memberView) {
                memberView.getUI('members').parents('ul').find('li.uk-active>a').trigger('click')
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

        init: function() {
            var self = this;
            $.ajax({
                url: '/weeks/next',
                method: 'get',
                success: function(response) {
                    self.date = response.date;
                    self.nextWeekId = response.id;
//                    self.selectMember();
//                    self.$el.find("#new-task-eta").val(self.date);
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

            this.showChildView('overlay', new LoginView());
            this.showModalOverlay({'bgclose': false, 'keyboard': false, 'center': true});

        },

        config: function() {
            var settingView = new SettingsView();
            this.showChildView('overlay', settingView);
            this.showModalOverlay({'bgclose': false, 'keyboard': false, 'center': true});
        },

        reloadTasks: function(data) {
            var self = this;
            var data = data || {
                userId: this.userId,
                weekId: this.nextWeekId
            };
            $.ajax({
                url: '/tasks',
                method: 'get',
                data: data,
                success: function(response) {
                    var options = _.extend(data, {collection: response.tasks})

                    var taskView = new TasksView(options);
//                    self.getRegion('task-view').show(taskView);
                    self.showChildView('task-view', taskView);
                },
                error: function(response) {
                    self.notify('error', 'Load task fail');
                }
            });
        },

        loadMemberTasks: function(member) {
            this.$el.find('#member-name').html(member.name)
            this.userId = member.id;

            var data = {
                userId: this.userId,
                weekId: this.nextWeekId
            };
            this.reloadTasks(data);
        },

    });
    return MainView;
})


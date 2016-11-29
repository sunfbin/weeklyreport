/**
 * View after user login. show the whole page
 *
 * @author Fengbin
 */

define([
    './baseView',
    './loginView',
    './settingView',
    'text!../templates/main.html',
    'text!../templates/task.html'
], function(BaseView, LoginView, SettingsView, IndexTemplate, taskTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
            'click #save-task' : 'saveTask',
            'click .remove-task' : 'removeTask',
            'click .member-link' : 'loadMemberTasks',
            'click #current-week' : 'selectCurrentWeek',
            'click #settings': 'config'
        },
        regions: {
            'primary-nav': '#primary_nav',
            //'top-bar': '#top-bar',
            'overlay': '#overlay',
            'second-nav': '#secondary_nav',
            'main-grid': '#main-grid'
        },

        render: function() {
            var self = this;

            var form = this.compileTemplate(IndexTemplate).render();
            this.$el.html(form);

            this.on('attach', function() {
                // configuration of UIkit.modal
                _.extend(UIkit.modal('#overlay').options, {
                    'bgclose': false,
                    'keyboard': false,
                    'center': true
                });
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
            this.init();
            return this;
        },

        selectCurrentWeek: function(e) {
            e.preventDefault();

            this.init();
            UIkit.offcanvas.hide();
        },

        selectFirstMember: function() {
            var view = this.$el.find('#secondary_nav');
            view.children().removeClass('uk-active');
            var firstChild = view.find('li.uk-nav-divider').next();
            firstChild.find('a').trigger('click');
            firstChild.addClass('uk-active');
        },

        init: function() {
            var self = this;
            $.ajax({
                url: '/weeks/next-monday',
                method: 'get',
                success: function(response) {
                    self.date = response.date;
                    self.$el.find('#report-date').html(response.date);
                    self.selectFirstMember();
                },
                failure: function(response) {
                    console.log(response);
                }
            });
        },

        logout: function() {
            console.log('click on logout')

            this.showChildView('overlay', new LoginView());
            UIkit.modal('#overlay').show();
        },

        config: function() {
            var settingView = new SettingsView();
            this.showChildView('overlay', settingView);
            UIkit.modal('#overlay').show();
        },

        saveTask: function() {
            if (!this.userId || !this.date) {
                console.log('please select user and date');
                return false;
            }
            var self = this;

            var taskName = this.$el.find('#new-task-name').val();
            var status = this.$el.find('#new-task-status').val();
            var project = this.$el.find('#new-task-project').val();
            var progress = this.$el.find('#new-task-progress').val();
            var risk = this.$el.find('#new-task-risk').val();
            var description = this.$el.find('#new-task-risk').val();

            if (_.isEmpty(taskName)) {
                UIkit.modal.alert('Task Name could not be empty');
                return false;
            }

            this.$el.find('input[id*=new-task]').val('');

            var data = {
                name: taskName,
                status: status,
                project: project,
                progress: progress,
                description: description,
                risk: risk,
                userId: this.userId,
                date: this.date
            };

            $.ajax({
                url: '/tasks',
                method: 'POST',
                data: data,
                success: function(response) {
                    console.log('save task success');
                    self.reloadTasks();
                },
                failure: function(response) {
                    console.log('save task fail')
                    console.log(response)
                }
            })
        },

        reloadTasks: function(data) {
            var self = this;
            var data = data || {
                userId: this.userId,
                date: this.date
            };
            $.ajax({
                url: '/tasks',
                method: 'get',
                data: data,
                success: function(response) {
                    //reload
                    console.log('load tasks success');
                    self.$el.find('tbody>tr.uk-form').siblings().remove();
                    response.forEach(function(task) {
                        var html = self.compileTemplate(taskTemplate).render(task);
                        self.$el.find('#main-grid').append(html);
                    })
                },
                failure: function(response) {
                    console.log('save task fail')
                    this.notify('load task fail error')
                }
            });
        },

        loadMemberTasks: function(e) {
            e.preventDefault();

            $(e.target.parentNode).siblings().removeClass('uk-active');
            $(e.target.parentNode).addClass('uk-active');
            var member = e.target.dataset;
            var userId = member.memberId;
            var userName = member.memberName;

            this.$el.find('#member-name').html(userName)
            this.userId = userId; // TODO save user id in someplace

            var data = {
                userId: this.userId,
                date: this.date
            };
            this.reloadTasks(data);

        },

        removeTask: function(e) {
            e.preventDefault();
            var self = this;

            var taskId = e.target.parentNode.dataset.taskId
            console.log('task id is : '+ taskId);
            var msg = 'Task {0} will be removed permanently. Press Yes to continue'
            var result = UIkit.modal.confirm(msg, function(){
                console.log('task removed');
                $.ajax({
                url: '/tasks',
                method: 'delete',
                data: taskId,
                success: function(response) {
                    //reload
                    self.reloadTasks();
                },
                failure: function(response) {
                    console.log('delete task fail')
                }
            });
            });

        }

    });
    return MainView;
})


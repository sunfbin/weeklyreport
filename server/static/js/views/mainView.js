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
    'text!../templates/week.html',
    'text!../templates/task.html'
], function(BaseView, LoginView, SettingsView, IndexTemplate, weekTemplate, taskTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
            'click #save-task' : 'saveTask',
            'click .remove-task' : 'removeTask',
            'click .member-link' : 'loadMemberTasks',
            'click .week-link' : 'selectWeek',
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
                UIkit.on('show.uk.offcanvas', function() {
                    if (!self.offCanvasShowedUp) {
                        self.offCanvasShowedUp = true;
                        self.loadWeeks();
                    }
                });
            });
            this.init();
            return this;
        },

        loadWeeks: function() {
            var self = this;
            $.ajax({
                url: '/weeks',
                method: 'get',
                success: function(response) {
                    response.forEach(function(week) {
                        var html = self.compileTemplate(weekTemplate).render(week);
                        self.$el.find('ul.uk-nav-offcanvas').append(html);
                    });
                },
                failure: function(response) {
                    console.log(response);
                }
            });
        },

        selectWeek: function(e) {
            e.preventDefault();
            var weekId = e.target.dataset.weekId;
            var weekDate = e.target.text;
            this.nextWeekId = weekId;

            var primaryNav = this.$el.find('ul.uk-nav-offcanvas');
            primaryNav.children().removeClass('uk-active');
            primaryNav.find(e.target.parentNode).addClass('uk-active');
            this.$el.find('#report-date').html(weekDate);
            this.$el.find('#report-date')[0].dataset.nextWeekId = weekId;

            this.selectMember();
            UIkit.offcanvas.hide();
        },

        selectMember: function() {
            var view = this.$el.find('#secondary_nav');
            var selected = view.find('.uk-active');
            if (selected.length == 0) {
                var firstChild = view.find('li.uk-nav-divider').next();
                firstChild.find('a').trigger('click');
                firstChild.addClass('uk-active');
            } else {
                selected.find('a').trigger('click');
            }
        },

        init: function() {
            var self = this;
            $.ajax({
                url: '/weeks/next',
                method: 'get',
                success: function(response) {
                    self.date = response.date;
                    self.nextWeekId = response.id;
                    self.$el.find('#report-date').html(response.date);
                    self.$el.find('#report-date')[0].dataset.nextWeekId = response.id;
                    self.selectMember();
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
            if (!this.userId || !this.nextWeekId) {
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
                weekId: this.nextWeekId
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
                weekId: this.nextWeekId
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
                weekId: this.nextWeekId
            };
            this.reloadTasks(data);

        },

        removeTask: function(e) {
            e.preventDefault();
            var self = this;

            var taskId = e.target.parentNode.dataset.taskId;
            var taskName = e.target.parentNode.nextElementSibling.textContent;
            console.log('task id is : '+ taskId);
            var msg = 'Task <b>' + taskName + '</b> will be removed permanently.<br> Press Yes to continue';
            var del_url = '/tasks/' + taskId;
            var result = UIkit.modal.confirm(msg, function(){
                console.log('task removed');
                $.ajax({
                url: del_url,
                method: 'delete',
                success: function(response) {
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


define([
    './baseView',
    './taskGridView',
    './taskFormView',
    './taskDetailView',
    './presentationView',
    'text!../templates/mainContent.html'
], function(BaseView, TasksGridView, TaskFormView,
            TaskDetailView, PresentationView, MainContentTemplate) {

    var MainContentView = BaseView.extend({
        events: {
            'click #add-task' : 'onAddTask',
            'click #export' : 'exportTasks',
            'click #do-present': 'showTaskPresentView'
        },
        className: 'uk-placeholder',
        regions: {
            'task-grid-view': '#task-grid',
            'task-detail-view': '#task-detail'
        },
        triggers: { //?
        },
        childViewEvents: {
            'task:changed': 'reloadTasks',
            'task:editing' : 'showTaskEditView',
            'task:selected': 'showDetailView'
        },
        template: function(data) {
            return Hogan.compile(MainContentTemplate).render(data);
        },

        /**
         * task reload event could be triggered when user change, week change
         * also it could be triggered when task added, removed, or updated
         */
        reloadTasks: function(options) {
            var self = this;

            this.detachChildView('task-detail-view');
            options = options || {
                selectedUser: this.selectedUser,
                selectedWeek: this.selectedWeek,
                loginUser: this.loginUser
            };
            if (!options.loginUser || !options.selectedUser || !options.selectedWeek) {
                // no enough params
                return false;
            }
            _.extend(this, options);

            // update view title with member name
            this.$el.find('#member-name').html(options.selectedUser.name);

            $.ajax({
                url: '/tasks',
                method: 'get',
                data: {
                    userId: options.selectedUser.id,
                    weekId: options.selectedWeek.id
                },
                success: function(response) {
                    var tasksGridView = new TasksGridView({collection: response.tasks});
//                    self.getRegion('task-view').show(taskView);
                    self.showChildView('task-grid-view', tasksGridView);
                },
                error: function(response) {
                    self.notify('warning', 'Load task fail');
                }
            });
        },

        onAddTask: function(e) {
            e.preventDefault();
            var task = {
                userId: this.loginUser.id,
                weekId: this.selectedWeek.id,
                eta: this.weekDate,
                progress: 0,
                action: 'Add'
            };
            this.showTaskEditView(task);
        },

        showTaskEditView: function(task) {
            var taskAddView = new TaskFormView({model: task, mainContentView: this});
            this._parentView().showOverlay(taskAddView);
        },

        showDetailView: function(taskId) {
            // TODO when save task, pass all the params to backend? or just part of task data
            // then in backend handler, just use update? not create
            var self = this;
            $.ajax({
                url: '/tasks/'+taskId,
                method: 'get',
                success: function(response) {
                    var task = response.task;
                    var tasksDetailView = new TaskDetailView({model: task});
                    self.getRegion('task-detail-view').show(tasksDetailView);
                },
                error: function(response) {
                    self.notify('warning', 'Task not found');
                }
            });
        },

        showTaskPresentView: function(e) {
            e.preventDefault();
            var self = this;
            var getPresentTasks = function() {
                return $.ajax({
                    url: '/users/tasks',
//                    url: '/tasks/present',
                    method: 'get',
                    data: {
                        status: 'normal',
                        weekId: self.selectedWeek.id
                    }
                });
            };

            $.when(getPresentTasks()).then(function(response){
                var idx = 0;
                response.users.forEach(function(user){
                    user.index = idx++;
                    user.tasks.forEach(function(task){
                        task.risk = _.isEmpty(task.risk) ? undefined : task.risk;
//                        task.description = _.isEmpty(task.description) ? undefined : task.description;
                    })
                });
                response.date = self.weekDate;

                var presentView = new PresentationView({model: response});
                self._parentView().showOverlay(presentView, {
                    'bgclose': false,
                    'center': true
                });
                $('.uk-slidenav-previous').hide();

                UIkit.slideshow('[data-uk-slideshow]').on('show.uk.slideshow', function(e, current, next){
                    // do not scroll infinitely.
                    var scope = UIkit.slideshow('[data-uk-slideshow]');
                    var current = scope.current;
                    if (scope.slides[current + 1]) {
                        scope.find('.uk-slidenav-next').show();
                    }else{
                        scope.find('.uk-slidenav-next').hide();
                    }
                    if (scope.slides[current - 1]) {
                        scope.find('.uk-slidenav-previous').show();
                    } else {
                        scope.find('.uk-slidenav-previous').hide();
                    }
                });
            })
        },

        exportTasks: function(e) {
            e.preventDefault();
            console.log('export')
        }
    });

    return MainContentView;
})
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
                    var opts = {
                        collection: response.tasks,
                        editable: self.selectedUser.id == self.loginUser.id
                    }
                    var tasksGridView = new TasksGridView(opts);
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
            if ($(e.currentTarget).parent().hasClass('uk-disabled')) {
                return false;
            }
            var task = {
                userId: this.loginUser.id,
                userName: this.loginUser.name,
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
                        task.risk = task.risk.replace(/\n/g, '<br>');
                        task.description = task.description.replace(/\n/g, '<br>');
                        task.risk = _.isEmpty(task.risk) ? undefined : task.risk;
                    })
                });
                response.date = self.selectedWeek.date;

                var presentView = new PresentationView({model: response});
                self._parentView().showOverlay(presentView, {
                    'bgclose': false,
                    'center': true
                });
                $('.uk-slidenav-previous').hide();

                UIkit.slideshow('[data-uk-slideshow]').on('show.uk.slideshow', function(e, current, next){
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
            var self = this;
            var modal = UIkit.modal.blockUI("<i class='uk-icon-spinner uk-icon-spin uk-icon-medium'></i> Please wait ..."); // modal.hide() to unblock
            var form1 = document.createElement("form");
            var input1 = document.createElement("input");
            var input2 = document.createElement("input");
            input1.type = "hidden";
            input1.name = "weekId";
            input1.value = self.selectedWeek.id;
            input2.type = "hidden";
            input2.name = "weekDate";
            input2.value = self.selectedWeek.date;
            form1.appendChild(input1);
            form1.appendChild(input2);
            form1.method = "get";
            form1.action = "/tasks/export";
            $(document.body).append(form1);

            setTimeout(function() {
                modal.hide();
            }, 1100);
            form1.submit();
        }
    });

    return MainContentView;
})
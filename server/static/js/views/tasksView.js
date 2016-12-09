define([
    './baseView',
    './taskGridView',
    './taskAddView',
    './taskMixinView',
    '../models/taskModel',
    'text!../templates/tasksMain.html'
], function(BaseView, TasksGridView, TaskAddView,
            TaskMixinView, Task, TasksMainTemplate) {
    var TasksMainView = BaseView.extend({
        events: {
            'click #quick-add' : 'quickAddTask',
            'click #add-task' : 'showAddTaskView',
            'change #new-task-progress' : 'showProgress',
        },
        className: 'uk-placeholder',
        regions: {
            'task-view': '#task-view'
        },
        triggers: { //?
            'task:added': 'reloadTasks',
        },
        childViewEvents: {
            'task:deleted': 'reloadTasks',
            'task:edited': 'reloadTasks'
        },
        template: function(data) {
            return Hogan.compile(TasksMainTemplate).render(data);
        },
        initialize: function(options) {
            _.extend(this, TaskMixinView);
        },
        quickAddTask: function() {
            if (!this.userId || !this.weekId) {
                console.log('please select user and date');
                return false;
            }

            var taskName = this.$el.find('#new-task-name').val();
            var status = this.$el.find('#new-task-status').val();
            var project = this.$el.find('#new-task-project').val();
            var progress = this.$el.find('#new-task-progress').val();
            var risk = this.$el.find('#new-task-risk').val();
            var eta = this.$el.find('#new-task-eta').val();
            var description = this.$el.find('#new-task-description').val();

            if (_.isEmpty(taskName)) {
                UIkit.modal.alert('Task Name could not be empty', {
                    'bgclose': true,
                    'keyboard': true
                });
                return false;
            }

            var taskModel = new Task({
                name: taskName,
                status: status,
                progress: progress,
                description: description,
                eta: eta,
                userId: this.userId,
                weekId: this.weekId
            });
            this.saveTask(taskModel);
        },

        reloadTasks: function(data) {
            var self = this;
            data = data || {
                userId: this.userId,
                userName: this.userName,
                weekId: this.weekId
            };
            if (!data.userId || !data.weekId) {
                // no enough params
                return false;
            }
            _.extend(this, data);

            this.updateViewTitle(data.userName);

            $.ajax({
                url: '/tasks',
                method: 'get',
                data: data,
                success: function(response) {
                    var options = _.extend(data, {collection: response.tasks})
                    var tasksGridView = new TasksGridView(options);
//                    self.getRegion('task-view').show(taskView);
                    self.showChildView('task-view', tasksGridView);
                },
                error: function(response) {
                    self.notify('warning', 'Load task fail');
                }
            });
        },

        updateViewTitle: function(memberName) {
            this.$el.find('#member-name').html(memberName);
        },

        showAddTaskView: function(e) {
            var options = {parentView: this, userId: this.userId, weekId: this.weekId};
            var taskAddView = new TaskAddView(options);
            this._parentView().showChildView('overlay', taskAddView);
            this._parentView().showModalOverlay();
        }
    });

    return TasksMainView;
})
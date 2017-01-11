define([
    './baseView',
    'text!../templates/taskGrid.html'
], function(BaseView, TasksTemplate) {
    var editable = false;
    var WeeksView = BaseView.extend({
        events: {
            'click .uk-icon-edit.task-row-action' : 'modifyTask',
            'click .uk-icon-trash.task-row-action' : 'removeTask',
            'click .task-row': 'selectTask'
        },
        className: 'uk-overflow-container',
        template: function(data) {
            data.editable = editable;
            return Hogan.compile(TasksTemplate).render(data);
        },
        serializeCollection: function() {
            editable = this.options.editable;
            return this.collection;
        },

        modifyTask: function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(e.currentTarget).hasClass('link-disabled')){
                return false;
            }
            var self = this;
            var taskId = e.target.dataset.taskId;
            $.ajax({
                url: '/tasks/'+taskId,
                method: 'get',
                success: function(response) {
                    var task = response.task;
                    task.action='Update';
                    self.triggerMethod('task:editing', task);
                },
                error: function(response) {
                    self.notify('warning', 'Task not found');
                }
            });
        },

        removeTask: function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(e.currentTarget).hasClass('link-disabled')){
                return false;
            }
            var self = this;

            var taskId = e.target.dataset.taskId;
            var taskName = e.target.dataset.taskName;
            var msg = 'Task <b>' + taskName + '</b> will be removed permanently.<br> Press Yes to continue';
            var del_url = '/tasks/' + taskId;

            var result = UIkit.modal.confirm(msg, function(){
                console.log('task removed');
                $.ajax({
                    url: del_url,
                    method: 'delete',
                    success: function(response) {
                        var msg = `Task ${taskName} is removed successfully.`;
                        self.notify('success', msg);
                        self.triggerMethod('task:changed');
                    },
                    error: function(response) {
                        console.log('delete task fail')
                    }
                });
            });

        },

        selectTask: function(e) {
            e.preventDefault();
            var rowSelectedClass = 'row-selection';
            target = $(e.target).parents('tr');
            if (target.hasClass(rowSelectedClass)) {
                return false;
            }
            target.siblings().removeClass(rowSelectedClass);
            target.addClass(rowSelectedClass);

            this.triggerMethod('task:selected', target[0].dataset.taskId);
        }
    });

    return WeeksView;
})
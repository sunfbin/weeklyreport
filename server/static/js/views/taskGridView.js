define([
    './baseView',
    'text!../templates/taskGrid.html'
], function(BaseView, TasksTemplate) {
    var WeeksView = BaseView.extend({
        events: {
            'click .uk-icon-pencil.task-row-action' : 'modifyTask',
            'click .uk-icon-trash.task-row-action' : 'removeTask',
        },
        className: 'uk-overflow-container',
        template: function(data) {
            return Hogan.compile(TasksTemplate).render(data);
        },
        serializeCollection: function() {
            return this.collection;
        },

        modifyTask: function(e) {
            e.preventDefault();
            var self = this;
            var taskId = e.target.dataset.taskId;
            var taskName = e.target.dataset.taskName;
            console.log("Will modify task: "+ taskName);
            //Ajax Load Task

            this.showAddTaskView(e, {action: 'Modify', task: {
                name: taskName
            }});
        },

        removeTask: function(e) {
            e.preventDefault();
            var self = this;

            var taskId = e.target.dataset.taskId;
            var taskName = e.target.dataset.taskName;
            console.log('task id is : '+ taskId);
            var msg = 'Task <b>' + taskName + '</b> will be removed permanently.<br> Press Yes to continue';
            var del_url = '/tasks/' + taskId;

            var result = UIkit.modal.confirm(msg, function(){
                console.log('task removed');
                $.ajax({
                    url: del_url,
                    method: 'delete',
                    success: function(response) {
                        self.triggerMethod('task:deleted');
                    },
                    error: function(response) {
                        console.log('delete task fail')
                    }
                });
            });

        }
    });

    return WeeksView;
})
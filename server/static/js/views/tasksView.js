define([
    './baseView',
    'text!../templates/task.html'
], function(BaseView, TasksTemplate) {
    var WeeksView = BaseView.extend({
        events: {
            'click #save-task' : 'saveTask',
            'click .uk-icon-pencil.task-row-action' : 'modifyTask',
            'click .uk-icon-trash.task-row-action' : 'removeTask',
            'change #new-task-progress' : 'showProgress',
        },
        className: 'uk-overflow-container',
        ui: {
            'creation-form': '#main-grid>tr.uk-form'
        },
        template: function(data) {
            return Hogan.compile(TasksTemplate).render(data);
        },
        serializeCollection: function() {
            return this.collection;
        },
        initialize: function(options) {
            this.userId = options.userId;
            this.nextWeekId = options.weekId;
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
            var eta = this.$el.find('#new-task-eta').val();
            var description = this.$el.find('#new-task-risk').val();

            if (_.isEmpty(taskName)) {
                UIkit.modal.alert('Task Name could not be empty', {
                    'bgclose': true,
                    'keyboard': true
                });
                return false;
            }

            var data = {
                name: taskName,
                status: status,
                project: project,
                progress: progress,
                description: description,
                risk: risk,
                eta: eta,
                userId: this.userId,
                weekId: this.nextWeekId
            };

            $.ajax({
                url: '/tasks',
                method: 'POST',
                data: data,
                success: function(response) {
                    console.log('save task success');
                    self.clearForm();
                    self.triggerMethod('task:added');
                },
                error: function(response) {
                    response = JSON.parse(response.responseText);
                    if (response.status == 409) {
                        UIkit.modal.alert(response.message, {
                            'bgclose': true,
                            'keyboard': true
                        });
                    } else {
                        console.log(response)
                    }
                }
            })
        },

        clearForm: function() {
            this.$el.find('input[id*=new-task-name]').val('');
            this.$el.find('input[id*=new-task-project]').val('');
            this.$el.find('input[id*=new-task-risk]').val('');
            this.$el.find('input[id*=new-task][type=hidden]').val('0');
            this.$el.find("#new-task-status").val('Green');
            var today = (new Date()).toISOString();
            today = today.split("T")[0];
            this.$el.find("#new-task-eta").val(today);
        },


        modifyTask: function(e) {
            e.preventDefault();
            var self = this;
            var taskId = e.target.dataset.taskId;
            var taskName = e.target.dataset.taskName;
            console.log("Will modify task: "+ taskName);
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

        },

        showProgress: function(e) {
            var value = e.target.value;
            this.$el.find(e.target).next().text(value);
        }
    });

    return WeeksView;
})
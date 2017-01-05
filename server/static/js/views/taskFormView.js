/**
 * View for adding or updating task
 *
 * @author Fengbin
 */

define([
    './baseView',
    '../models/taskModel',
    'text!../templates/taskForm.html'
], function(BaseView, Task, TaskFormTemplate) {
    var TaskFormView = BaseView.extend({
        events: {
            'click #cancel' : 'cancel',
            'click #save' : 'onTaskSave',
            'change #progress': 'onProgressChange',
            'click #save-close' : 'onTaskSave'
        },
        template: function(data) {
            return Hogan.compile(TaskFormTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        initialize: function(options) {
            _.extend(this, options);
        },

        onRender: function() {
            if (this.model.status) {
                this.$el.find('#status').val(this.model.status);
            }
        },

        onTaskSave: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            if (_.isEmpty(data.name)) {
                UIkit.modal.alert('Task Name could not be empty', {
                    'bgclose': true,
                    'keyboard': true
                });
                return false;
            }
            var close = e.target.value.indexOf('Close') > -1;
            if (data.action == 'Update') {
                this.editTask(data, close);
            } else {
                data.id = undefined;
                this.createTask(data, close);
            }
        },

        onSuccess: function(closeSelf) {
            if (closeSelf) {
                this.cancel();
            } else {
                this.notify('success', 'Task saved successfully');
                this.clearForm();
            }
            if (this.mainContentView) {
                this.mainContentView.reloadTasks();
            }
        },

        createTask: function(task, close) {
            var self = this;

            $.ajax({
                url: '/tasks',
                method: 'POST',
                data: task,
                success: function(response) {
                    self.onSuccess(close);
                },
                error: function(response) {
                    self.notify('danger', 'Save task fail');
                }
            });
        },

        editTask: function(task, close) {
            var self = this;

            $.ajax({
                url: '/tasks/' + task.id,
                method: 'put',
                data: task,
                success: function(response) {
                    self.onSuccess(close);
                },
                error: function(response) {
                    self.notify('danger', 'Save task fail');
                }
            })
        },

        cancel: function(e) {
            UIkit.modal('#overlay').hide();
        },

        clearForm: function() {
            this.$el.find("textarea").val('');
            this.$el.find("#status").val('Green');
            this.$el.find("#progress").val(0);
            this.$el.find("#project").val('');
        },

        onProgressChange: function(e) {
            var value = $(e.currentTarget).val();
            $(e.currentTarget).parent().find('span').text(value);
        }
    });
    return TaskFormView;
})


/**
 * View for task common utilities, like save task, reload etc...
 *
 * @author Fengbin
 */

define([
], function() {
    var MixinView = {
        saveTask: function(taskModel) {
            var self = this;

            $.ajax({
                url: '/tasks',
                method: 'POST',
                data: taskModel.attributes,
                success: function(response) {
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
                        this.notify('danger', 'Save task fail');
                    }
                }
            })
        },

        clearForm: function() {
            this.$el.find('input[type!=button]').val('');
            this.$el.find('textarea').val('');
            this.$el.find('input[id*=new-task][type=hidden]').val('0');
            this.$el.find("#new-task-status").val('Green');
            this.$el.find("#status").val('Green');
            var today = (new Date()).toISOString();
            today = today.split("T")[0];
//            this.$el.find("#new-task-eta").val(today);
        },

        showProgress: function(e) {
            var value = e.target.value;
            this.$el.find(e.target).next().text(value);
        },
    }
    return MixinView;
})


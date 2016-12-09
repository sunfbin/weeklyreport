/**
 * View for add task
 *
 * @author Fengbin
 */

define([
    './baseView',
    './taskMixinView',
    '../models/taskModel',
    'text!../templates/taskForm.html'
], function(BaseView, TaskMixinView, Task, TaskAddTemplate) {
    var SettingsView = BaseView.extend({
        events: {
            'click #save' : 'save',
            'click #save-close' : 'saveAndClose'
        },
        template: function(data) {
            return Hogan.compile(TaskAddTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        initialize: function(options) {
            _.extend(this, options);
            _.extend(this, TaskMixinView);
        },

        save: function() {
            var self = this;
            var data = Backbone.Syphon.serialize(this);
            data.userId = this.userId;
            data.weekId = this.weekId;

            var task = new Task(data);
            this.saveTask(task, function(success) {
                if (success) {
                    UIkit.modal('#overlay').hide();
                    self.parentView.clearForm(self.$el);
                } else {
                    this.notify('danger', 'Save task fail');
                }
            });
        },

        saveAndClose: function(e) {
            e.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            var task = new Task(data);
            this.saveTask(task, function(success) {
                if (success) {
                    UIkit.modal('#overlay').hide();
                    UIkit.modal("#overlay").hide();
                } else {
                    this.notify('danger', 'Save task fail');
                }
            });
        }
    });
    return SettingsView;
})


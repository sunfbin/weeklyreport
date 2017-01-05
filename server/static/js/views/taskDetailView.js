/**
 * View for viewing task details
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/taskDetail.html'
], function(BaseView, TaskDetailTemplate) {
    var TaskDetailView = BaseView.extend({
        events: {
            'click #collapse' : 'collapse'
        },
        className: 'uk-panel uk-panel-header uk-panel-box uk-panel-box-primary',
        template: function(data) {
            return Hogan.compile(TaskDetailTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },

        collapse: function() {
            var self = this;

        }
    });
    return TaskDetailView;
})


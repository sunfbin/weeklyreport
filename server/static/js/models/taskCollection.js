/**
 * TaskCollection
 *
 * @author Fengbin
 */

define([
    'taskModel'
], function(TaskModel) {
    var TaskCollection = Backbone.Collection.extend({
        model: TaskModel,
        url: '/tasks',
        parse: function(data) {
            return data;
        }
    });

    return TaskCollection;
})

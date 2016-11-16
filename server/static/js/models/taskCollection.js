/**
 * TaskCollection
 *
 * @author Fengbin
 */

define([
    'backbone',
    'taskModel'
], function(Backbone, TaskModel) {
    var TaskCollection = Backbone.Collection.extend({
        model: TaskModel,
        url: '/tasks',
        parse: function(data) {
            return data;
        }
    });

    return TaskCollection;
})

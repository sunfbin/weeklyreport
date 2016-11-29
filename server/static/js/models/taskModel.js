/**
 * TaskModel
 *
 * @author Fengbin
 */

define([], function() {
    var TaskModel = Backbone.Model.extend({
        defaults: {
            id: null,
            name: null,
            project: null,
            progress: null, // percent?
            description: null,
            status: null, // current status
            risk: null,
            owner: null // user_id
        }
    });

    return TaskModel;
});

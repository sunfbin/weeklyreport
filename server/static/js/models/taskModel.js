/**
 * TaskModel
 *
 * @author Fengbin
 */

define([], function() {
    var TaskModel = Backbone.Model.extend({
        attributes: {
            id: null,
            name: null,
            project: null,
            progress: null, // percent?
            description: null,
            status: null, // current status
            eta: null, //
            risk: null,
            owner: null // user_id
        }
    });

    return TaskModel;
});

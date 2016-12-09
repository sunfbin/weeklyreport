/**
 * TaskModel
 *
 * @author Fengbin
 */

define([], function() {
    var today = (new Date()).toISOString();
    today = today.split("T")[0];
    var TaskModel = Backbone.Model.extend({
        defaults: {
            name: "",
            project: "",
            progress: "", // percent?
            description: "",
            status: "Green", // current status
            eta: today, //
            risk: "",
            weekId: "",
            userId: "" // user_id
        }
    });

    return TaskModel;
});

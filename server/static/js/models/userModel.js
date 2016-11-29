/**
 * UserModel
 *
 * @author Fengbin
 */

define([], function() {
    var UserModel = Backbone.Model.extend({
        defaults: {
            id: null,
            name: null,
            role: null,
            password: null,
            description: null,
            status: null // enable? disable
        }
    });

    return UserModel;
});

/**
 * UserModel
 *
 * @author Fengbin
 */

define([], function() {
    var UserModel = Backbone.Model.extend({
        attributes: {
            id: null,
            name: null,
            role: null,
            password: null,
            description: null,
            oder: null,
            status: null // enable? disable
        }
    });

    return UserModel;
});

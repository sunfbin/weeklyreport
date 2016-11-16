/**
 * UserCollection
 *
 * @author Fengbin
 */

define([
    'backbone',
    'userModel'
], function(Backbone, UserModel) {
    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users',
        parse: function(data) {
            return data;
        }
    });

    return UserCollection;
})

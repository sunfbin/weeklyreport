/**
 * UserCollection
 *
 * @author Fengbin
 */

define([
    'userModel'
], function(UserModel) {
    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/users',
        parse: function(data) {
            return data;
        }
    });

    return UserCollection;
})

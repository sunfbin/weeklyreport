/**
 * WeekCollection
 *
 * @author Fengbin
 */

define([
    './weekModel'
], function(WeekModel) {
    var TaskCollection = Backbone.Collection.extend({
        model: WeekModel,
        url: '/weeks',
        parse: function(data) {
            return data.weeks;
        }
    });

    return TaskCollection;
})

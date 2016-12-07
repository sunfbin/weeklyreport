/**
 * WeekModel
 *
 * @author Fengbin
 */

define([], function() {
    var WeekModel = Backbone.Model.extend({
        attributes: {
            id: null,
            date: null,
            status: null
        }
    });

    return WeekModel;
});

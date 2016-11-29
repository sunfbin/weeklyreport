/**
 * Parent View
 *
 * @author Fengbin
 */

define([
    'backbone.syphon'
], function(Syphon) {
    var BaseView = Backbone.Marionette.View.extend({

        initialize: function(options) {
//            this.UIKit = UIkit;
            this.Syphon = Syphon;
        },

        compileTemplate: function(template) {
            return Hogan.compile(template);
        },

        notify: function(type, msg) {
            var color = type == 'error' ? 'red' : 'yellow';

            var html = _.template('<span style="color:<%- color %>"><%- msg %></span>');
            html = html({'color': color, 'msg': msg});
            this.$('.notify-pane').html(html);
        },

        _removeElement: function() {
            /* children could implement this if needed */
            this.$el.html();
        }

    });

    return BaseView;
})

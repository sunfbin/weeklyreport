/**
 * Parent View
 *
 * @author Fengbin
 */

define([
    'backbone',
    'backbone.syphon',
    'hogan',
    'uikit'
], function(Backbone, Syphon, Hogan, UIKit) {
    var BaseView = Backbone.View.extend({
        initialize: function(options) {
            this.UIKit = UIKit;
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
        }

    });

    return BaseView;
})

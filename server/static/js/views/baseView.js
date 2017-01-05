/**
 * Parent View
 *
 * @author Fengbin
 */

define([
    'backbone.syphon'
], function(Syphon) {
    var BaseView = Backbone.Marionette.View.extend({

        compileTemplate: function(template) {
            return Hogan.compile(template);
        },

        notify: function(type, msg, timeout) {
            if (type=='success') {
                msg = "<i class='uk-icon-check'></i>" + msg;
            }
            timeout = timeout ? timeout : 1500;
            UIkit.notify({
                message : msg,
                status  : type,//info, success, warning, danger
                timeout : timeout,
                pos     : 'top-center'
            });
        },

        _removeElement: function() {
            this.$el.remove();
        }

    });

    return BaseView;
})

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

        notify: function(type, msg) {
            // type must be "success", "warning", "danger"
            var template =
                `
                <div class="uk-alert uk-alert-<%= type %>" data-uk-alert="">
                    <a href="#" class="uk-alert-close uk-close"></a>
                    <p><%= msg %></p>
                </div>
                `

            var render = _.template(template);
            html = render({'type': type, 'msg': msg});
            this.$el.find('.alert-row').html(html);
            var region = this.getRegion('alert-row');
        },

        _removeElement: function() {
            this.$el.remove();
        }

    });

    return BaseView;
})

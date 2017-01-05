/**
 * View for task presentation
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/presentation.html'
], function(BaseView, viewTemplate) {
    var PresentationView = BaseView.extend({
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        serializeCollection: function() {
            return this.collection;
        }
    });
    return PresentationView;
})


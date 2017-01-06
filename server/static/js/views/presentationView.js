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
        events: {
            'keyup .presentation-view': 'onKeyup'
        },
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        serializeCollection: function() {
            return this.collection;
        },
        onKeyup: function(e) {
            var scope = UIkit.slideshow('[data-uk-slideshow]');
            if (e.keyCode == 37) {
                //previous
                e.preventDefault();
                e.stopPropagation();
                if (scope.slides[scope.current - 1]) {
                    scope.previous();
                }
            } else if(e.keyCode == 39) { // next
                e.preventDefault();
                e.stopPropagation();
                if (scope.slides[scope.current - 1]) {
                    scope.next();
                }
            }
        }
    });
    return PresentationView;
})


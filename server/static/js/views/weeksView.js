define([
    './baseView',
    'text!../templates/week.html'
], function(BaseView, WeeksTemplate) {
    var WeeksView = BaseView.extend({
        events: {
            'click .week-link' : 'selectWeek',
        },
        className: 'uk-offcanvas-bar',
        ui: {
            'weeks': '.week-link'
        },
        template: function(data) {
            return Hogan.compile(WeeksTemplate).render(data);
        },
        serializeCollection: function() {
            return this.collection;
        },
        onRender: function() {
            this.getUI('weeks').first().trigger('click');
        },
        selectWeek: function(e) {
            e.preventDefault();
            var weekId = e.target.dataset.weekId;
            var weekDate = e.target.text;

            this.getUI('weeks').parent().removeClass('uk-active');
            this.$el.find(e.target.parentNode).addClass('uk-active');
            this.triggerMethod('week:selected', {'id': weekId, 'date': weekDate});
//            this.selectMember();
            UIkit.offcanvas.hide();
        }
    });

    return WeeksView;
})
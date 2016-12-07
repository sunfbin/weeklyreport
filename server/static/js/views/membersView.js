define([
    './baseView',
    'text!../templates/member.html'
], function(BaseView, UserTemplate) {
    var WeeksView = BaseView.extend({
        events: {
            'click .member-link' : 'onMemberClick',
        },
        ui: {
            'members': '.member-link'
        },
//        className: 'uk-panel uk-panel-box',
        template: function(data) {
            return Hogan.compile(UserTemplate).render(data);
        },
        serializeCollection: function() {
            return this.collection;
        },
        onRender: function() {
            this.getUI('members').first().trigger('click');
        },
        onMemberClick: function(e) {
            e.preventDefault();
            var memberId = e.target.dataset.memberId;
            var memberName = e.target.text;

            this.getUI('members').parent().removeClass('uk-active');
            this.$el.find(e.target.parentNode).addClass('uk-active');
            this.triggerMethod('member:selected', {'id': memberId, 'name': memberName});
        }
    });

    return WeeksView;
})
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
        template: function(data) {
            return Hogan.compile(UserTemplate).render(data);
        },
        serializeCollection: function() {
            if (_.isArray(this.collection)) {
                this.collection.forEach(function(user){
                    user.fontColor = user.gender == 'female' ? 'coral' : 'black';
                });
            }
            return this.collection;
        },
        onRender: function() {
            var loginUser = this.options.loginUser;
            var members = this.getUI('members');
            var found = false;
            if (loginUser) {
                for (var i=0;i<members.length;i++) {
                    if (members[i].dataset.memberId == loginUser.id) {
                        $(members[i]).trigger('click');
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                this.getUI('members').first().trigger('click');
            }
        },
        onMemberClick: function(e, refresh) {
            e.preventDefault();
            var target = e.currentTarget;
            if ($(target).parent().hasClass('uk-active') && !refresh) {
                return false;
            }
            var memberId = target.dataset.memberId;
            var memberName = target.text;

            this.getUI('members').parent().removeClass('uk-active');
            this.$el.find(e.target.parentNode).addClass('uk-active');
            this.triggerMethod('member:selected', {'id': memberId, 'name': memberName});
        }
    });

    return WeeksView;
})
/**
 * View for configuration, like user management
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/settings.html',
    'uikit.sortable'
], function(BaseView, viewTemplate) {
    var SettingsView = BaseView.extend({
        events: {
            'click #save' : 'save',
            'click #save-order' : 'saveOrder',
            'click #cancel' : 'cancel'
        },
        serializeCollection: function() {
            return this.collection;
        },
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        onAttach: function() {
            var self = this;
            UIkit.on('change.uk.tab', function(e, item) {
                if ($(item).attr('id') == 'users') {
                    self.$el.find('.users').show();
                    self.$el.find('.others').hide();
                    self.$el.find('.orders').hide();
                } else if ($(item).attr('id') == 'others') {
                    self.$el.find('.users').hide();
                    self.$el.find('.others').show();
                    self.$el.find('.orders').hide();
                } else if ($(item).attr('id') == 'orders') {
                    self.$el.find('.users').hide();
                    self.$el.find('.others').hide();
                    self.$el.find('.orders').show();
                }
            });
            var sortable = UIkit.sortable('[data-uk-sortable]');
            sortable.on('change.uk.sortable', function(e) {
                $('#save-order').attr('disabled', false);
            })
        },

        save: function() {
            console.log('save');
        },

        saveOrder: function() {
            var self = this;
            var users = this.$el.find('.user-list-item');
            var result = {};
            for (var i = 0; i < users.length; ) {
                var uid = users[i].dataset.userId;
                result[uid] = ++i;
            }
            $.ajax({
                url: '/users/change_present_order',
                method: 'post',
                data: result,
                success: function(response) {
                    console.log(response)
                    if (response.success) {
                        self.notify('success', 'Presentation order changed successfully.');
                        self.options.parentView.loadMembers();
                    }
                },
                error: function(response){
                }
            })
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });
    return SettingsView;
})


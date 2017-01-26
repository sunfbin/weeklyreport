/**
 * View for user to edit own information, like avatar, ...
 *
 * @author Fengbin
 */

define([
    './baseView',
    'text!../templates/editProfile.html'
], function(BaseView, viewTemplate) {
    var PasswordChangeView = BaseView.extend({
        events: {
            'click #save' : 'cancel',
            'click #avatar' : 'clickAvatar',
            'change #file-input' : 'handleImage',
            'click #upload' : 'uploadFile',
            'click #cancel' : 'cancel'
        },
        template: function(data) {
            return Hogan.compile(viewTemplate).render(data);
        },
        serializeModel: function() {
            return this.model;
        },
        onRender: function() {
        },

        clickAvatar: function(e) {
            this.$el.find('#file-input').trigger('click');
        },

        handleImage: function(e) {
            var self = this;
            if (e.target.files.length <= 0) {
                return false;
            }
            var file = e.target.files[0];

            if(file.type.split("/")[0] !== "image"){
                UIkit.modal.alert("You should choose an image file");
                return false;
            }
            if (file.size> 1000 * 1024) {
                // cannot exceed 1M
                UIkit.modal.alert("File size should not exceed 1M.");
                return false;
            }
            this.avatarFile = file;
            var reader = new FileReader(file);

            reader.onload = function(event) {
                self.$el.find('img').attr('src', this.result);
                self.$el.find('#upload').show();

            }
            reader.readAsDataURL(file);
        },

        uploadFile: function() {
            var self = this;
            var form = new FormData();
            form.append('file', this.avatarFile);
            $.ajax({
                url: '/upload/avatar',
                data: form,
                method: 'post',
                contentType: false,
                processData: false,
                success: function(resp) {
                    self.$el.find('#upload').hide();
                    self.notify('success', resp.msg);
                },
                error: function(){
                }
            });
        },

        cancel: function(e) {
            e.preventDefault();
            UIkit.modal("#overlay").hide();
        }
    });
    return PasswordChangeView;
})


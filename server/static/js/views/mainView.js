/**
 * View after user login. show the whole page
 *
 * @author Fengbin
 */

define([
    './baseView',
    './loginView',
    './settingView',
    './weeksView',
    './membersView',
    './mainContentView',
    './passwordView',
    './editProfileView',
    'text!../templates/main.html'
], function(BaseView, LoginView, SettingsView, WeeksView,
            MembersView, MainContentView, PasswordView, EditProfileView,
            IndexTemplate) {
    var MainView = BaseView.extend({
        events: {
            'click #logout' : 'logout',
            'click #change-password' : 'changePassword',
            'click #edit-profile' : 'editProfile',
            'click #settings': 'setting',
            'click #change-week-date': 'changeWeekDate'
        },
        className: 'uk-height-viewport',
        triggers: {},
        childViewEvents: {
            'week:selected': 'onWeekSelected',
            'login:succeed': 'auth_succeed',
            'member:selected': 'loadMemberTasks'
        },
        regions: {
            'week-list': '#primary_nav',
            'overlay': '#overlay',
            'member-list': '#members-view',
            'main-content': '#main-content'
        },
        template: function() {
            return Hogan.compile(IndexTemplate).render();
        },

        onRender: function() {
            var self = this;

            this.on('attach', function() {
                UIkit.modal('#overlay').on({
                    'show.uk.modal': function(){},
                    'hide.uk.modal': function(){
                        self.detachChildView('overlay');
                    }
                });
            });

            var mainContentView = new MainContentView();
            self.showChildView('main-content', mainContentView);
        },

        auth_succeed: function(user) {
            var self = this;
            this.loginUser = user;
            if (this.loginUser.role != 'Admin' && this.loginUser.role != 'Manager' ) {
                // not able to change report date or present order
                this.$el.find('#change-week-date').hide();
                this.$el.find('#settings').parent().hide();
            } else {
                // admin and manager are not required to add task
                this.$el.find('#add-task').hide();
            }
            this.$el.find('#loginUser span').text(this.loginUser.name);
            var getNextWeek = function() {
                return $.ajax({
                    url: '/weeks/next',
                    method: 'get'
                });
            };
            $.when(getNextWeek()).done(function(nextWeek, message){
                self.selectedWeek = nextWeek;
                self.loadWeeks();
                self.loadMembers();
            });
        },

        onWeekSelected: function(week) {
            this.updateWeek(week);

            var memberView = this.getChildView('member-list');
            if (memberView) {
                memberView.getUI('members').parents('ul').find('li.uk-active>a').trigger('click', true);
            }
        },

        updateWeek: function(week) {
            this.selectedWeek = week;
            this.$el.find('#report-date').html(this.selectedWeek.date);
            this.$el.find('#report-date')[0].dataset.weekId = this.selectedWeek.id;
        },

        loadWeeks: function() {
            var self = this;
            $.ajax({
                url: '/weeks',
                method: 'get',
                success: function(response) {
                    var view = new WeeksView({collection: response.weeks});
                    self.showChildView('week-list', view);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        loadMembers: function() {
            var self = this;
            $.ajax({
                url: '/users',
                method: 'get',
                data: {'load_all': false},
                success: function(response) {
                    self.users = response.users;
                    var view = new MembersView({collection: response.users, loginUser: self.loginUser});
                    self.showChildView('member-list', view);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        logout: function() {
            $.ajax({
                url: '/logout',
                method: 'post',
                success: function(response) {
                    location.reload();
                },
                error: function(response) {
                    console.log(response);
                }
            });
        },

        setting: function() {
            var options = {
                collection: this.users,
                parentView: this
            };
            var settingView = new SettingsView(options);
            this.showOverlay(settingView);
        },

        loadMemberTasks: function(member) {
            var opts = {
                selectedUser: {
                    id: member.id,
                    name: member.name.trim()
                },
                selectedWeek: this.selectedWeek,
                loginUser : this.loginUser
            };
            this.getChildView('main-content').reloadTasks(opts);
        },

        showOverlay: function(view, options) {
            var opts = {'bgclose': false, 'keyboard': false, 'center': true};
            opts = options || opts;
            this.showChildView('overlay', view);
            _.extend(UIkit.modal('#overlay').options, opts);
            UIkit.modal('#overlay').show();
        },

        changePassword: function(e) {
            var pwdChangeView = new PasswordView({loginUser: this.loginUser});
            this.showOverlay(pwdChangeView);
        },

        changeWeekDate: function(e) {
            var self = this;
            var onsubmit = function(value) {
                $.ajax({
                    url: '/weeks/' + self.selectedWeek.id,
                    method: 'put',
                    data: {'date': value},
                    success: function(response) {
                        if (response.success) {
                            self.loadWeeks();
                            self.notify('success', 'Date has been changed successfully.');
                        }
                    },
                    error: function(resp) {
                    }
                })
            };
            var currentDate = new Date(this.selectedWeek.date);
            var currentDay = currentDate.getDay();

            var min_date = new Date(currentDate);
            var max_date = new Date(currentDate);
            min_date.setDate(min_date.getDate() - currentDay + 1);
            max_date.setDate(max_date.getDate() + 8 - currentDay);
            min_date = min_date.toISOString().split('T')[0];
            max_date = max_date.toISOString().split('T')[0];
            currentDate = currentDate.toISOString().split('T')[0];
            var dpConfig = "{format:'YYYY-MM-DD',minDate:'" +min_date+"', maxDate:'"+max_date+"'}";
            var dialogTemplate = [
                '<div class="uk-modal-content uk-form">Date:&nbsp;&nbsp;&nbsp;&nbsp;',
                '<input type="text" value="'+ currentDate + '" data-uk-datepicker="' +dpConfig+ '">',
                '</div><div class="uk-modal-footer uk-text-right">',
                '<a class="uk-link js-modal-cancel">Cancel</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                '<button class="uk-button uk-button-primary js-modal-ok">OK</button>',
                '</div>'
            ]
            var modal = UIkit.modal.dialog(dialogTemplate.join(''));
            var input = modal.element.find('input[type="text"]');
            modal.element.find('.js-modal-ok').on('click', function(){
                if (onsubmit(input.val())!==false){
                    modal.hide();
                }
            });
            modal.element.find('.js-modal-cancel').on('click', function(){
                modal.hide();
            });
            modal.show();
        },

        editProfile: function(e) {
            var options = {
                loginUser: this.loginUser,
                model: this.loginUser,
                parentView: this
            };
            var editProfileView = new EditProfileView(options);
            this.showOverlay(editProfileView);
        }
    });
    return MainView;
})


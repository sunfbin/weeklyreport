define([
    './baseView',
    './taskGridView',
    './taskFormView',
    './taskDetailView',
    './presentationView',
    'text!../templates/mainContent.html'
], function(BaseView, TasksGridView, TaskFormView,
            TaskDetailView, PresentationView, MainContentTemplate) {

    var MainContentView = BaseView.extend({
        events: {
            'click #add-task' : 'onAddTask',
            'click #export' : 'exportTasks',
            'click #do-present': 'showTaskPresentView'
        },
        className: 'uk-placeholder',
        regions: {
            'task-grid-view': '#task-grid',
            'task-detail-view': '#task-detail'
        },
        triggers: { //?
        },
        childViewEvents: {
            'task:changed': 'reloadTasks',
            'task:editing' : 'showTaskEditView',
            'task:selected': 'showDetailView'
        },
        template: function(data) {
            return Hogan.compile(MainContentTemplate).render(data);
        },

        /**
         * task reload event could be triggered when user change, week change
         * also it could be triggered when task added, removed, or updated
         */
        reloadTasks: function(data) {
            var self = this;

            this.detachChildView('task-detail-view');
            data = data || {
                userId: this.userId,
                userName: this.userName,
                weekDate: this.weekDate,
                weekId: this.weekId
            };
            if (!data.userId || !data.weekId) {
                // no enough params
                return false;
            }
            _.extend(this, data);

            // update view title with member name
            this.$el.find('#member-name').html(data.userName);

            $.ajax({
                url: '/tasks',
                method: 'get',
                data: data,
                success: function(response) {
                    var options = _.extend(data, {collection: response.tasks})
                    var tasksGridView = new TasksGridView(options);
//                    self.getRegion('task-view').show(taskView);
                    self.showChildView('task-grid-view', tasksGridView);
                },
                error: function(response) {
                    self.notify('warning', 'Load task fail');
                }
            });
        },

        onAddTask: function(e) {
            e.preventDefault();
            var task = {
                userId: this.userId,
                weekId: this.weekId,
                eta: this.weekDate,
                progress: 0,
                action: 'Add'
            };
            this.showTaskEditView(task);
        },

        showTaskEditView: function(task) {
            var taskAddView = new TaskFormView({model: task, mainContentView: this});
            this._parentView().showOverlay(taskAddView);
        },

        showDetailView: function(taskId) {
            // TODO when save task, pass all the params to backend? or just part of task data
            // then in backend handler, just use update? not create
            var self = this;
            $.ajax({
                url: '/tasks/'+taskId,
                method: 'get',
                success: function(response) {
                    var task = response.task;
                    var tasksDetailView = new TaskDetailView({model: task});
                    self.getRegion('task-detail-view').show(tasksDetailView);
                },
                error: function(response) {
                    self.notify('warning', 'Task not found');
                }
            });
        },

        showTaskPresentView: function(e) {
            e.preventDefault();
            var self = this;
            var getPresentTasks = function() {
                return $.ajax({
                    url: '/users/tasks',
//                    url: '/tasks/present',
                    method: 'get',
                    data: {
                        status: 'normal',
                        weekId: self.weekId
                    }
                });
            };

            $.when(getPresentTasks()).then(function(response){
                var idx = 0;
                response.users.forEach(function(user){
                    user.index = idx++;
                    user.tasks.forEach(function(task){
                        task.risk = _.isEmpty(task.risk) ? undefined : task.risk;
//                        task.description = _.isEmpty(task.description) ? undefined : task.description;
                    })
                });
                response.date = self.weekDate;

                var presentView = new PresentationView({model: response});
                self._parentView().showOverlay(presentView, {
                    'bgclose': false,
                    'center': true
                });
                $('.uk-slidenav-previous').hide();

                UIkit.slideshow('[data-uk-slideshow]').on('show.uk.slideshow', function(e, current, next){
                    // do not scroll infinitely.
                    var scope = UIkit.slideshow('[data-uk-slideshow]');
                    var current = scope.current;
                    if (scope.slides[current + 1]) {
                        scope.find('.uk-slidenav-next').show();
                    }else{
                        scope.find('.uk-slidenav-next').hide();
                    }
                    if (scope.slides[current - 1]) {
                        scope.find('.uk-slidenav-previous').show();
                    } else {
                        scope.find('.uk-slidenav-previous').hide();
                    }
                    $('.presentation-view').on('keyup', self.presentationScroll);
                });
            })
        },

        presentationScroll: function(e) {
            console.log(e)
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
            } else {
            }
        },

        getPresentTasks: function() {
            return $.ajax({
                url: '/users/tasks',
                method: 'get',
                data: {
                    status: 'normal',
                    weekId:this.weekId
                }
            });
        },

        exportTasks: function(e) {
            e.preventDefault();
            console.log('export')
        }
    });

    return MainContentView;
})
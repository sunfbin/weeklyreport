/**
 * Require JS main module for inclusion in landing page
 *
 * @author Fengbin
 */

require.config({
    baseUrl: '/static/js',
    paths: {
        'marionette': 'vendor/backbone.marionette/backbone.marionette',
        'jquery': 'vendor/jquery/jquery',
        'uikit': 'vendor/uikit/uikit',
        'uikit.notify': 'vendor/uikit/components/notify',
        'uikit.datepicker': 'vendor/uikit/components/datepicker',
        'uikit.slideshow': 'vendor/uikit/components/slideshow',
        'underscore': 'vendor/backbone.marionette/underscore',
        'hogan': 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        'template': 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        'text': 'vendor/require/text',
        'backbone': 'vendor/backbone/backbone',
        'backbone.syphon': 'vendor/backbone/backbone.syphon',
        'backbone.radio': 'vendor/backbone.marionette/backbone.radio',

        'mockjax': 'vendor/jquery/jquery.mockjax',
        'uuid': 'vendor/uuid/uuid',
        'jqueryDatepicker': 'vendor/jquery/jquery-ui-datepicker',
        'jquery-i18n': 'lib/jquery-i18n-properties/jquery.i18n.properties',
        'jqueryui': 'vendor/jquery/jquery-ui'
    },
    shim: {
        'uikit': {
            deps: ['jquery'],
            exports: 'UIKit'
        },
        'uikit.notify': {
            deps: ['jquery', 'uikit'],
            exports: 'UIkit.notify'
        },
        'uikit.datepicker': {
            deps: ['jquery', 'uikit'],
            exports: 'UIkit.datepicker'
        },
        'uikit.slideshow': {
            deps: ['jquery', 'uikit'],
            exports: 'UIkit.slideshow'
        },
        'underscore': {
            exports: '_'
        },
        'hogan': {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        'mockjax': {
            deps: ['jquery']
        },
        'backbone': {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.syphon': {
            deps: [ 'backbone'],
            exports: 'Backbone.Syphon'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'jqueryDatepicker':{
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        }
    },
    exclude: [],
    include: []
});


define([
    'marionette',
    'hogan',
    'uikit',
    'uikit.notify',
    'uikit.slideshow',
    'uikit.datepicker'
], function (app) {
    require(['app'], function(app){
        app.start();
    })
});

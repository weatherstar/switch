var assign = require('object-assign')
var base = require('./karma.base.config.js')

module.exports = function (config) {
    config.set(assign(base, {
        browsers: ['PhantomJS'],
        reporters: ['progress'],
        singleRun: true
    }))
}

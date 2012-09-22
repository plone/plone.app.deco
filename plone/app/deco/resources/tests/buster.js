var config = module.exports;

var linterConf = {
    linter: 'jshint',
        linterOptions: {
            asi: false,
            bitwise: true,
            boss: false,
            browser: true,
            curly: true,
            devel: false,
            eqeqeq: true,
            evil: false,
            expr: false,
            forin: false,
            immed: true,
            jquery: true,
            latedef: false,
            mootools: false,
            newcap: true,
            node: false,
            noempty: true,
            nomen: false,
            nonew: true,
            onevar: false,
            plusplus: false,
            regexp: true,
            strict: false,
            supernew: true,
            undef: true,
            white: false
        },
        excludes: [
            "jquery"
       ]
};

config["Deco"] = {
    rootPath: "../",
    environment: "browser",
    libs: [
        "lib/jquery-1.6.4.js",
        "lib/jquery.event.drag-2.1.0.js",
        "lib/jquery.event.drop-2.1.0.js",
        "lib/jquerytools.expose-1.2.6.js"
    ],
    sources: [
        "src/deco.js"
    ],
    tests: [
        "tests/test-deco.js"
    ],
    extensions: [require('buster-lint')],
    "buster-lint": linterConf
}

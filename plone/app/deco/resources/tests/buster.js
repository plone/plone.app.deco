var config = module.exports;

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
        "src/deco.js",
    ],
    tests: [
        "tests/test-deco.js"
    ]
}

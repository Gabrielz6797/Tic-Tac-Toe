rpc({
    url: "foo.php",
    error: function(error) {
        alert(error.message);
    },
    // errorOnAbort: true,
    debug: function(json, which) {
        console.log(which + ': ' + JSON.stringify(json));
    }
})(function(foo) {
    // now here you can access methods from Foo class
    foo.ping("Hello")(function(response) {
        alert(response);
    });
});

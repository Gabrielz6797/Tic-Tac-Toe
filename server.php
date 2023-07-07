<?php
require('json-rpc.php');

class Foo {
    function ping($str) {
        return "pong '$str'";
    }
}

handle_json_rpc(new Foo());

?>
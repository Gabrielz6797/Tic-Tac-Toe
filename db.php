<?php
function OpenCon()
{
    $dbhost = "10.1.4.63";
    $dbuser = "eb98755";
    $dbpass = "Xeb98755!";
    $db = "ci0137_eb98755";
    $con = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $con->error);

    return $con;
}

function CloseCon($con)
{
    $con->close();
}
?>
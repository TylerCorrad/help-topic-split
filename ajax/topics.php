<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '/var/www/html/upload/main.inc.php';

header('Content-Type: application/json');

$topics = Topic::getHelpTopics(
    false,
    false,
    true,
    array(),
    true
);

echo json_encode($topics);
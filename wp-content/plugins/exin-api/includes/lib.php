<?php
$URI = "https://desesb.madrid.org/exin_rest/v1";
$KEY = "SURfQTAyNTI3ODkzOmRkWlVCV0RRb0RFSA==";
//$URI = "http://valesb.madrid.org/exin_rest/v1";
//$KEY = "SURfQTAyNTI3ODkzOnNndHhObDlDS2lpaA==";

// $URI = "https://esb.madrid.org/exin_rest/v1";
// $KEY = "SURfQTAyNTI3ODkzOlBjUWVTUWprTm9tWg==";

$IP = "172.20.0.225";
function get_ip()
{
    global $IP;
    return $IP;
}
function get_key()
{
    global $KEY;
    return $KEY;
}
function base_uri()
{
    global $URI;
    return $URI;
}

function callAPI($method, $url, $data)
{
    $curl = curl_init();
    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }
    // OPTIONS:
    curl_setopt($curl, CURLOPT_VERBOSE, true);
    curl_setopt($curl, CURLOPT_INTERFACE, get_ip());
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Basic ' . get_key(),
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // EXECUTE:
    $result = curl_exec($curl);
    if (!$result) {
        die("Connection Failure");
    }
    curl_close($curl);
    return $result;
}

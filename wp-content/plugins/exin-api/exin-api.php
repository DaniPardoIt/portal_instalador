<?php
/*
Plugin Name: Exin Api conection
Version: 1.0.2
Plugin URI: http://wordpress.org/plugins/exin-api/
Description: Functions to conect Exin Api
Author: Oondeo
Author URI: https://www.oondeo.es
*/


function exim_rest_post($post){
    error_log('exim_rest_post()');
    include_once 'includes/lib.php';

    $info_path = __DIR__.'/logs/exim_rest_post.txt';
    document_info( $info_path, 'exim_rest_post($post); $post:', $post );

    // $data_array = array();
    // $make_call = callAPI('POST', base_uri() . '/expedientes/camposActuacion', json_encode($data_array));
    // print_r($make_call);
    // $response = json_decode($make_call, true);
    // $errors   = $response['errores'];
    // $data     = $response['resultado'];
    // $state = $response['estado'];
    // print_r($data);

    return false;
}
// add_action( 'init', 'exin_rest_post' );

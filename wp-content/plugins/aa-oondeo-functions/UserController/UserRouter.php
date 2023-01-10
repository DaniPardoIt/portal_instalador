<?php


function register_form( $form_data ){
	
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	global $oondeo_config;
	require_once 'UserData.php';

	if( $oondeo_config['log_level'] >= 2 ){
		document_info( $info_path, 'Form Data', $form_data );
	}

	data_from_form( $form_data );
}
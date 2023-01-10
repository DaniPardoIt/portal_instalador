<?php


function register_form( $form_data ){
	global $oondeo_config;
	require_once 'UserData.php';

	if( $oondeo_config['log_level'] >= 2 ){
		document_info( __DIR__.'/logs/UserRouter->register_form.txt', 'Form Data', $form_data );
	}

	data_from_form( $form_data );
}
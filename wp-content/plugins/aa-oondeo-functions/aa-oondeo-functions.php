<?php
/*
Plugin Name: AA Oondeo Functions
Version: 1.0.0
Plugin URI: https://www.oondeo.es/
Description: Funciones Propias de Oondeo
Author: Oondeo
Author URI: https://www.oondeo.es
*/

function document_info( $file, $description, $info, $append=false ){
	global $oondeo_config;

	$append ? $FILE_APPEND = FILE_APPEND : $FILE_APPEND=0;

	$now = DateTime::createFromFormat('U.u', microtime(TRUE));

	$now = $now->format('Y/m/d H:i:s.u');

	$text = <<<TEXT

	!-- $now --!
	$description

	TEXT;

	if( is_array($info) || is_object($info) ){
		file_put_contents( $file, $text, $FILE_APPEND );
		file_put_contents( $file, print_r($info, true), FILE_APPEND );
	}else{
		$text.= <<<TEXT
		$info

		TEXT;
		
		file_put_contents( $file, $text, $FILE_APPEND );
	}

}

$info_path = __DIR__.'/'.basename(__FILE__, '.php').'.txt';
document_info( $info_path, 'aa-oondeo-functions.php', '' );
document_info( $info_path, 'UserController Files', glob( __DIR__."/UserController/*.php"), true );
document_info( $info_path, '__DIR__', __DIR__, true );

foreach(glob( __DIR__."/UserController/*.php") as $filename ){
	$filename = str_replace(__DIR__."/", '', $filename);
	document_info( $info_path, 'filename', $filename, true );
	include_once( $filename );
}







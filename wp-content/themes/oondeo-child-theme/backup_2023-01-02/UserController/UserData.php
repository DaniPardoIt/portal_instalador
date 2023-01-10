<?php

function data_from_form( $form_data ){
	$clean_form_data = remove_unnecessary_nested_array( $form_data );

	document_info( __DIR__.'/logs/UserData->data_from_form.txt', 'Clean Form Data', $clean_form_data, false );

	$form_action = $clean_form_data['form_action'];

	
	$user = array();
	switch( $form_action ){

		case 'modify':
			$form_valid_fields = array('first_name', 'last_name', 'tel_fijo', 'tel_movil');
			foreach( $form_valid_fields as $field ){
				if( isset($clean_form_data[$field]) ){
					$user[$field] = $clean_form_data[$field];
				}
			}
			modify_user( $clean_form_data );
			break;

		case 'remove':
			if( isset($clean_form_data['user_id']) && !empty($clean_form_data['user_id']) ){
				$user_id = $clean_form_data['user_id'];
				remove_user( $user_id );
			}else{
				return false;
			}
			break;
		
		default:
			$form_valid_fields = array('tipo_documento', 'user_login', 'first_name', 'last_name', 'user_email', 'tel_fijo', 'tel_movil', 'city', 'street_1', 'postal_code');
			foreach( $form_valid_fields as $field ){
				if( isset($clean_form_data[$field]) ){
					$user[$field] = $clean_form_data[$field];
				}
			}
			$user['user_pass'] = generateRandomString(12);
			$user['user_nicename'] = $clean_form_data['first_name'];
			$user['nickname'] = $clean_form_data['user_login'];
			$user['mobile'] = $clean_form_data['tel_movil'];
			$user['phone'] = $clean_form_data['tel_fijo'];
			$user['notes'] = 'NIF/CIF: '.$clean_form_data['user_login'];
			$user['company'] = $clean_form_data['first_name'] . ' ' .  $clean_form_data['last_name'];
			$user['state'] = 'Albacete';
			$user['city'] = 'Albacete';
			$user['postal_code'] = '02006';

			document_info( __DIR__.'/UserData->data_from_form.txt', 'USER', $user, true );
			
			new_user( $user );
			break;
	}

	document_info( __DIR__.'/UserData->data_from_form.txt', 'Form Data', $form_data, true );

	//new_user( $user );
}

function new_user( $user_data ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	$pod = pods('user');

	document_info( $info_path, 'POD', $pod );
	document_info( $info_path, 'User Data', $user_data, true );

	$user_id = $pod->add( $user_data );

	document_info( $info_path, 'User ID', $user_id, true );
	
	$saved_user = get_user_by( 'ID', $user_id );
	
	document_info( $info_path, 'Saved User', $saved_user, true );

	return $saved_user;
}

function modify_user( $user_data ){

	if( isset($user_data['user_id']) && !empty($user_data['user_id']) ){
		$user_id = $user_data['user_id'];
	}else{
		return false;
	}

	$pod = pods('user', $user_id);
	$pod->save( $user_data );
}

function remove_user( $user_id ){
	$pod = pods('user', $user_id );
}

function get_full_users( $args = array() ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	
	$users = get_users( $args );
	
	document_info( $info_path, 'User Data', $args );
	document_info( $info_path, 'Users', $users, true );
	foreach( $users as $key=>$u ){
		$clean_user = get_full_user_oondeo( $u );
		$users[$key] = $clean_user;
	}

	$json = json_encode($users);
	
	document_info( $info_path, 'Clean Users', $users, true );
	document_info( $info_path, 'Users JSON', $json, true );

	return $json;
}

function get_full_user_oondeo( $user ){
	$full_user = array(
		'ID'				=>		$user->ID,
		'data' 			=>		(array) $user->data,
		'meta_data'	=>		remove_unnecessary_nested_array(get_user_meta( $user->ID )),
		'roles'			=>		$user->roles,
		'allcaps'		=>		$user->allcaps,
	);

	return $full_user;
}

function get_simplified_users( $args = array() ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	
	$users = get_users( $args );

	document_info( $info_path, 'User Data (args)', $args );
	document_info( $info_path, 'Users', $users, true );

	foreach( $users as $key=>$u ){

		$clean_user = get_simplified_user( $u );
		$users[$key] = $clean_user;
	}
	$json = json_encode($users);
	document_info( $info_path, 'Clean Users', $users, true );
	document_info( $info_path, 'Users JSON', $json, true );

	return $json;
}

function get_simplified_user( $user ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';

	$meta_data = remove_unnecessary_nested_array(get_user_meta( $user->ID ));

	$simplified_user = array(
		'data' 			=>		array(
			'user_login'		=>	$user->data->user_login,
			'user_email'		=>	$user->data->user_email,
			'display_name'	=>	$user->data->display_name
		),
		'meta_data'	=>		array(
			'nickname'				=>	$meta_data['nickname'],
			'first_name'			=>	$meta_data['first_name'],
			'last_name'				=>	$meta_data['last_name'],
			'wp-approve-user'	=>	$meta_data['wp-approve-user']
		),
		'roles'			=>		$user->roles,
	);

	
	document_info( $info_path, 'User', array( 
		'simplified_user'			=>	$simplified_user,
		'wp_user'							=>	$user
	), true );
	return $simplified_user;
}

function modify_user_param( $user, $field, $value ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	document_info( $info_path, 'User', array(
		'user'					=>	$user,
		'get_class()'		=>	get_class( $user ),
		'field'					=>	$field,
		'value'					=>	$value
	) );
}

<?php


function hola(){
	return 'hola';
}

function data_from_form( $form_data ){
	global $oondeo_config;

	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';

	$clean_form_data = remove_unnecessary_nested_array( $form_data );

	document_info( $info_path, 'Clean Form Data', $clean_form_data, false );

	$form_action = $clean_form_data['form_action'];

	$wp_user = get_user_by('login', $clean_form_data['user_login']);
	document_info( $info_path, 'WP_User', $wp_user, true );
	
	$userdata = array();
	switch( $form_action ){

		case 'modify':
			$form_valid_fields = array('first_name', 'last_name', 'tel_fijo', 'tel_movil', 'street_1', 'state', 'city', 'postal_code', 'form_action');
			foreach( $form_valid_fields as $field ){
				if( isset($clean_form_data[$field]) ){
					$userdata[$field] = $clean_form_data[$field];
				}
			}
			
			document_info( $info_path, 'Data To Save', $userdata, true );
			modify_user( $userdata, $wp_user->ID );
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
					$userdata[$field] = $clean_form_data[$field];
				}
			}
			$userdata['user_pass'] = generateRandomString(12);
			$userdata['user_nicename'] = $clean_form_data['first_name'];
			$userdata['nickname'] = $clean_form_data['user_login'];
			$userdata['mobile'] = $clean_form_data['tel_movil'];
			$userdata['phone'] = $clean_form_data['tel_fijo'];
			$userdata['notes'] = 'NIF/CIF: '.$clean_form_data['user_login'];
			$userdata['company'] = $clean_form_data['first_name'] . ' ' .  $clean_form_data['last_name'];
			$userdata['state'] = $clean_form_data['state'];
			$userdata['city'] = $clean_form_data['city'];
			$userdata['postal_code'] = $clean_form_data['postal_code'];

			$role = $clean_form_data['user_type'];
			if( !in_array( $role, array('inspector', 'tecnico') ) ){
				$role = 'tecnico';
			}

			document_info( __DIR__.'/UserData->data_from_form.txt', 'USER', array(
				'userdata'		=>	$userdata,
				'role'				=>	$role
			), true );
			
			$new_user = new_user( $userdata, $role );
			
			if( $new_user && $oondeo_config['user_register_mail'] ){
				mail(
					'dani@oondeo.es',
					'Nuevo Usuario',
					'El usuario '.$userdata['user_nicename'].' se ha registrado en el portal. Su constraseña es: '.$userdata['user_pass'].'.'
				);
			}
			break;
	}

	//new_user( $user );
}

function new_user( $user_data, $role ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	$pod = pods('user');

	document_info( $info_path, 'POD', $pod );
	document_info( $info_path, 'User Data', $user_data, true );

	$user_id = $pod->add( $user_data );

	document_info( $info_path, 'User ID', array(
		'user_id' 	=>	$user_id,
		'role'			=>	$role
	), true );
	
	$saved_user = get_user_by( 'ID', $user_id );
	$saved_user->set_role( $role );
	
	document_info( $info_path, 'Saved User', $saved_user, true );

	return $saved_user;
}

function modify_user( $userdata, $user_id ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	$pod = pods('user');

	document_info( $info_path, 'User Data', $userdata );



	$pod = pods('user', $user_id);
	$pod->save( $userdata );
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
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';

	$full_user = array(
		'ID'				=>		$user->ID,
		'data' 			=>		(array) $user->data,
		'meta_data'	=>		remove_unnecessary_nested_array(get_user_meta( $user->ID )),
		'roles'			=>		$user->roles,
		'allcaps'		=>		$user->allcaps,
	);
	
	document_info( $info_path, 'Full User', $full_user );
	return $full_user;
}

function get_simplified_users( $args = array() ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	
	$users = get_users( $args );
	if( empty($users) ){
		return false;
	}

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

function get_raw_user( $user ){
	$data = $user->data;
	$meta_data = remove_unnecessary_nested_array(get_user_meta( $user->ID ));

	$raw_user = array_merge( $data, $meta_data );

	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	document_info( $info_path, 'User', array(
		'user'					=>	$user,
		'data'					=>	$data,
		'meta_data'			=>	$meta_data,
		'raw_user'			=>	$raw_user
	) );
}

function modify_user_param( $user, $field, $value ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	document_info( $info_path, 'User', array(
		'user'					=>	$user,
		'field'					=>	$field,
		'value'					=>	$value
	) );

	$pod = pods( 'user', $user['ID'] );
	$pod->save($field, $value);
	return $pod;
}

function check_user_exists( $field, $value ){	
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
	document_info( $info_path, 'check_user_exists', array(
		'field'					=>	$field,
		'value'					=>	$value
	) );
}


function get_user( $args ){
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';

	$user_query = new WP_User_Query( $args );
	$user = $user_query->get_results()[0];
	
	document_info( $info_path, 'User', $user );
	if( !$user ){
		return false;
	}
	return $user;
}



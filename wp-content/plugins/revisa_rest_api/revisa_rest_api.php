<?php
/*
Plugin Name: Revisa Rest Api
Version: 1.0.0
Plugin URI: https://www.oondeo.es/
Description: Funciones necesarias para gestionar el portal del instalador de manera asincrona.
Author: Oondeo
Author URI: https://www.oondeo.es
*/

/****** GET SOLICITUD ******/
use function Amp\Iterator\filter;

add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/getsolicitud', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_getsolicitud',
        'args'      =>  [
            'post_id'   =>  [
                'required'  =>  true,
                'type'      =>  'number'
            ]
        ]
	] );
} );

function oondeo_rest_route_getsolicitud( $request ){
    $post_ID = $request->get_param( 'post_id' );
    // $post_ID=883
    if( ! empty( $post_ID ) ){
        $res = get_solicitud( $post_ID );
    }else{
        $res = "Falta el post_ID";
    }
    return rest_ensure_response( $res );
}

function get_solicitud( $post_ID ){
    //error_log("\n revisa_rest_api.php / get_solicitud() \n");
    //oondeo.php --> get_full_post()

    $get_botones_solicitud = true;

	$post = get_full_post( array(
		'p' => $post_ID,
		'post_type' => 'solicitud',
		'posts_per_page' => 1
	) );

    if( $get_botones_solicitud ){
        document_info('api_get_full_post.txt', '','');
        $estado_solicitud = $post->meta_data['estado_solicitud'][0];
        global $user;

        $botones_formulario = array();

        $botones_formulario[] = 'anterior';
        $botones_formulario[] = 'cancelar';
        if( apply_filters('check_solicitud_permission', 'edit', $post) || apply_filters('check_solicitud_permission', 'create', $post) ){
            $botones_formulario[] = 'guardar';
        }
        if( $estado_solicitud == 'creacion' ){
            $enviar=apply_filters('check_solicitud_permission', 'send', $post);
            if( $enviar ){
                document_info('api_get_full_post.txt', "Enviar estado_solicitud: $estado_solicitud", $enviar, true);
                $botones_formulario[] = 'enviar';
            }
        }else if( $estado_solicitud == 'revision_oca' ){
            $enviar = apply_filters('check_solicitud_permission', 'send_exim', $post);
            if( $enviar ){
                document_info('api_get_full_post.txt', "Enviar estado_solicitud: $estado_solicitud", $enviar, true);
                $botones_formulario[] = 'enviar';
            }
        }
        if( apply_filters('check_solicitud_permission', 'remove', $post) ){
            $botones_formulario[] = 'borrar';
        }
        if( apply_filters('check_solicitud_permission', 'error') ){
            $botones_formulario[] = 'error';
        }
        $botones_formulario[] = 'siguiente';

        $post->botones_formulario = $botones_formulario;
        
        document_info('api_get_full_post.txt', "Estado Solicitud: ",$estado_solicitud, true);
        document_info('api_get_full_post.txt', "Botones Formulario", $botones_formulario , true);
        document_info('api_get_full_post.txt', "User", $user, true);
    }
    document_info('api_get_full_post.txt', 'Post unga', $post, true);
    //oondeo.php --> post_to_JSON()
    array("post"=> $post,"files"=> []);
	$json = post_to_JSON( $post );

	return $json;
}
/****** FIN GET SOLICITUD ******/


/****** GET USUARIO ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/getuser_by', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_getuser_by',
        'args'      =>  [
            'field'   =>  [
                'required'  =>  false,
                'type'      =>  'string'
            ],
            'value'   =>  [
                'required'  =>  false,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_route_getuser_by( $request ){
    $field = $request->get_param( 'field' );
    $value = $request->get_param( 'value' );
    // $post_ID=883
    if( !empty( $field ) && !empty( $value ) ){
        $user = get_user_by( $field, $value );
    }else{
        $user = wp_get_current_user();
    }

    $json = json_encode ( $user );
    return rest_ensure_response( $json );
}
/****** FIN GET USUARIO ******/



/****** GET ENTIDAD BY ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/getentidad_by', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_getentidad_by',
        'args'      =>  [
            'field'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ],
            'value'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_route_getentidad_by( $request ){
    $field = $request->get_param( 'field' );
    $value = $request->get_param( 'value' );
    document_info('api_getentidad_by.txt',"field: $field; value: $value;",'');

    // $post_ID=883
    if( !empty( $field ) && !empty( $value ) ){
        $pod = pods('entidad');
        document_info('api_getentidad_by.txt',"pod",$pod, true);
        $params = array(
            'limit' =>  1,
            'where' =>  "$field.meta_value='$value'"
        );
        $entidad = $pod->find( $params );
        $data = (array) $entidad->data()[0];
        document_info('api_getentidad_by.txt',"entidad",$entidad, true);
        document_info('api_getentidad_by.txt',"ID = ".$data['ID']."; data: ",$data, true);
        foreach( $data as $key=>$d ){
            if( is_array($d) ){
                $data[$key] = $d[0];
            }
        }
        $meta_data = get_post_meta( $data['ID'] );
        document_info('api_getentidad_by.txt',"Meta Data: ",$meta_data, true);
        $data = array_merge( $data, $meta_data);
        
        document_info('api_getentidad_by.txt',"Data: ",$data, true);
    }else{
        $entidad = null;
    }

    $json = json_encode ( $data );
    return rest_ensure_response( $json );
}
/****** FIN GET ENTIDAD BY ******/


/****** GET FORMULARIO ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/getformulario', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_getformulario',
        'args'      =>  [
            'campo_actuacion'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_route_getformulario( $request ){
    $campo_actuacion = $request->get_param( 'campo_actuacion' );
    // $campo_actuacion = 'btni';
    if( ! empty( $campo_actuacion ) ){
        $res = get_formulario( $campo_actuacion );
    }else{
        $res = "Falta el post_ID";
    }
    return rest_ensure_response( $res );
}

function get_formulario( $campo_actuacion ){
    $form_html =  selectFormBy_CampoActuacion( $campo_actuacion );
    return json_encode( $form_html );
}
/****** FIN GET FORMULARIO ******/

/* GET FULL POST INFO */
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/getsolicitudprueba', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_getsolicitud_prueba',
        'args'      =>  [
            'post_id'   =>  [
                'required'  =>  true,
                'type'      =>  'number'
            ]
        ]
	] );
} );

function oondeo_rest_route_getsolicitud_prueba( $request ){
    $post_ID = $request->get_param( 'post_id' );
    // $post_ID=883
    if( ! empty( $post_ID ) ){
        $res = get_solicitud_prueba( $post_ID );
    }else{
        $res = "Falta el post_ID";
    }
    return rest_ensure_response( $res );
}

function get_solicitud_prueba( $post_ID ){
    $array_categorias = get_all_term_hierarchy_data_formatted( array(
		'taxonomy' => 'categoria',
		'hide_empty' => false,
		'orderby' =>	'term_id',
		'parent'	=> 0
	) );

    document_info('get_solicitud_prueba.txt', 'INICIO', '',false);
    // document_info('get_solicitud_prueba.txt', 'Array Categorías', $array_categorias , true);


    $post = get_full_post( array(
        'p' => $post_ID,
        'post_type' => 'solicitud',
        'posts_per_page' => 1
    ) );

    
    document_info('get_solicitud_prueba.txt', 'POST', $post , true);

    if( isset($post) ){
        $urlParams = array();
        // echo "<br>POST:<pre>";
        // print_r($post);
        // echo "</pre>";

        $meta_data = $post->meta_data;
        document_info('get_solicitud_prueba.txt', 'META_DATA', $meta_data , true);

        $meta_data_keys = array_keys( $meta_data );
        document_info('get_solicitud_prueba.txt', 'META_DATA_KEYS', $meta_data_keys , true);

        // echo '<h1>'.$meta_data[ $meta_data_keys[9] ][0].'</h1>';

        $cont = 0;
        
        document_info('get_solicitud_prueba.txt', 'LOOP METADATA', '' , true);
        foreach( $meta_data as $param ){
            // echo "<br>Param<pre>";
            // print_r($param);
            // echo "</pre>";

            $urlParamKey = $meta_data_keys[$cont];
            $urlParamValue = $meta_data[ $urlParamKey ][0];
            
            document_info('get_solicitud_prueba.txt', '+++', 'key: '.$urlParamKey .'; value: '.$urlParamValue , true);

            // echo 'Key: '.$urlParamKey.'<br>';
            // echo 'Value: '.$urlParamValue.'<br>';
            if( empty($urlParamValue) ){
                continue;
            }
            $cat_campo_actuacion=null;
            $cat_subcampo_actuacion=null;
            switch($urlParamKey){
                case 'campo_actuacion':
                    // echo '<br>++++++++++ campo-actuacion ++++++++++++<br>';
                    $cat_campo_actuacion = findInCategories( $urlParamValue, $array_categorias );
                    
                    $short_name = $cat_campo_actuacion['short_name'];
                    // echo $short_name ;
                    $urlParam = $urlParamKey.'='.urlencode( $short_name );
                    break;

                case 'subcampo_actuacion':
                    // echo '<br>++++++++++ subcampo-actuacion ++++++++++++<br>';
                    // echo "cat_campo_actuacion<pre>";
                    // print_r($cat_campo_actuacion['subcats']);
                    // echo "</pre>";
                    $cat_subcampo_actuacion = findInCategories( $urlParamValue, $cat_campo_actuacion['subcats'] );
                    if( $cat_subcampo_actuacion ){
                        $short_name = $cat_subcampo_actuacion['short_name'];
                    }

                    // echo $short_name;
                    $urlParam = $urlParamKey.'='.urlencode( $short_name );
                    break;

                case 'tipo_solicitud':
                    // echo '<br>++++++++++ tipo-solicitud ++++++++++++<br>';
                    $categoria = findInCategories( $urlParamValue, $cat_subcampo_actuacion['subcats'] );
                    if( $categoria ){
                        $short_name = $categoria['short_name'];
                    }

                    // echo $short_name;
                    $urlParam = $urlParamKey.'='.urlencode( $short_name );
                    break;

                default:
                    $urlParam = $urlParamKey.'='.urlencode( $urlParamValue );
                    break;
            }

            

            $urlParams[] = $urlParam;
            $cont++;
        }

        return json_encode($urlParams);
    }

    return json_encode(false);
}
/* FIN GET FULL POST INFO */


/****** GET SOLICITUDES ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/search_solicitudes', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_route_search_solicitudes',
        'args'      =>  [
            'fields'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_route_search_solicitudes( $request ){
    
	$info_path = __DIR__.'/'.basename(__FILE__, '.php').'->get_solicitudes.txt';

    global $user, $oondeo_config;
    document_info( $info_path, 'Search Solicitudes', '' );
    $fields = $request->get_param( 'fields' );
    // $estado = $request->get_param( 'estado' );
    // $limit = $request->get_param( 'limit' );
    document_info( $info_path, 'Parámetros recibidos', array('fields'=>$fields), true );

    $fields = (array)json_decode($fields)[0];
    document_info( $info_path, 'Fields', $fields, true );

    document_info( $info_path, 'Usuario', $user, true );


    $params =  array(
        'post_type'     =>  'solicitud',
        'date_query'    =>  array()
    );
    
    document_info( $info_path, 'user_can($user->ID, "solicitud_read_another_author")', user_can( $user->ID, 'solicitud_read_another_author' ), true );

    if( !user_can( $user->ID, 'solicitud_read_another_author' ) && $oondeo_config['solicitudes_read_only_own'] ){
        $params['author'] = $user->ID;
    }

    if( empty($limit) ){ $limit = 25; }

    $count = 0;
    $meta_query = array();
    foreach( $fields as $key=>$value ){
        document_info( $info_path, "Field $count", array($key, $value), true );

        switch( true ){
            case stristr( $key, 'fecha' ):
                $timestamp = strtotime( $value );
                $year = date('Y', $timestamp);
                $month = date('m', $timestamp);
                $day = date('d', $timestamp);
                
                $new_dq = array(
                    "year"      =>  $year,
                    "month"     =>  $month,
                    "day"       =>  $day
                );

                document_info( $info_path, "IS DATE ( $timestamp )", $new_dq, true );


                if( stristr($key, 'desde') ){
                    $new_dq['hour']     = '00';
                    $new_dq['minute']   = '00';
                    $params['date_query']['after'] = $new_dq;
                }else if( stristr($key, 'hasta') ){
                    $new_dq['hour']     = '23';
                    $new_dq['minute']   = '59';
                    $params['date_query']['before'] = $new_dq;
                }
                break;

            case stristr( $key, 'estado_solicitud' ):
                if( is_array($value) ){
                    $meta = array(
                        'key'       =>  $key,
                        'value'     =>  $value,
                        'compare'   =>  'IN'
                    );
                }else{
                    $meta = array(
                        'key'       =>  $key,
                        'value'     =>  $value,
                        'compare'   =>  'LIKE'
                    );
                }
                $meta_query[] = $meta;
                document_info( $info_path, "IS Estado Solicitud", $meta, true );
                break;

            default:
            
            $meta = array(
                'key'       =>  $key,
                'value'     =>  $value,
                'compare'   =>  'LIKE'
            );
            $meta_query[] = $meta;
            document_info( $info_path, "DEFAULT", $meta, true );
        }
        
        $count++;
    }

    $params['meta_query'] = $meta_query;
    $params['posts_per_page'] = 100;

    document_info( $info_path, 'Params', $params, true );

    $posts = get_full_posts( $params );
    document_info( $info_path, 'Query', $posts, true );

    $clean_posts = array();

    foreach( $posts as $post ){
        $cp = array();
        $keys = array('ID','post_date', 'codigo_interno', 'estado_solicitud', 'campo_actuacion', 'tipo_instalacion', 'subtipo_instalacion', 'tipo_solicitud', 'tipo_expediente');

        foreach( $keys as $key){
            if( isset($post->$key) && !empty($post->$key) ){
                $cp[$key] = $post->$key;
            }else if( isset( $post->meta_data->$key ) && !empty($post->meta_data->$key) ){
                $cp[$key] = $post->meta_data->$key;
            }else{
                $cp[$key] = '';
            }
        }

        $clean_posts[] = $cp;
    }

    document_info( $info_path, 'Clean Posts', $clean_posts, true );

    return rest_ensure_response( $clean_posts );
}

/****** FIN GET SOLICITUDES ******/




/****** REMOVE SOLICITUD ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/remove_solicitud', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_remove_solicitud',
        'args'      =>  [
            'post_id'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_remove_solicitud( $request ){
    global $user;
    if( $user->ID <= 0 ){
        document_info( 'revisa_log.txt', 'Forbidden Access', array(
            'location'      =>      'plugins/revisa_rest_api/revisa_rest_api.php',
            'function'      =>      'oondeo_rest_remove_solicitud()',
            'user_ip'       =>      getUserIP()
        ), true);
        return rest_ensure_response( "forbidden" );
    }
    
    $post_id = $request->get_param( 'post_id' );
    $post_deleted = remove_solicitud( $post_id );
    
    $json = json_encode ( $post_deleted );
    return rest_ensure_response( $json );
}
/****** FIN REMOVE SOLICITUD ******/



/****** COPY SOLICITUD ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/copy_solicitud', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_copy_solicitud',
        'args'      =>  [
            'post_id'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_copy_solicitud( $request ){
    global $user;
    if( $user->ID <= 0 ){
        document_info( 'revisa_log.txt', 'Forbidden Access', array(
            'location'      =>      'plugins/revisa_rest_api/revisa_rest_api.php',
            'function'      =>      'oondeo_rest_copy_solicitud()',
            'user_ip'       =>      getUserIP()
        ), true);
        return rest_ensure_response( "forbidden" );
    }
    
    $post_id = $request->get_param( 'post_id' );
    $post_deleted = copy_solicitud( $post_id );
    
    $json = json_encode ( $post_deleted );
    return rest_ensure_response( $json );
}
/****** FIN COPY SOLICITUD ******/


/****** CHECK PERMISSION ******/
add_action( 'rest_api_init', function() {
	register_rest_route( 'oondeo/v1', '/check_permission', [
		'method'    =>  WP_REST_Server::READABLE,
		'callback'  =>  'oondeo_rest_check_permission',
        'args'      =>  [
            'action'   =>  [
                'required'  =>  true,
                'type'      =>  'string'
            ],
            'post_id'   =>  [
                'required'  =>  false,
                'type'      =>  'number'
            ],
            'user_id'   =>  [
                'required'  =>  false,
                'type'      =>  'string'
            ]
        ]
	] );
} );

function oondeo_rest_check_permission( $request ){
    document_info( 'revisa_api.php->check_permission.txt', "Basic Info", array(
        'location'      =>      'plugins/revisa_rest_api/revisa_rest_api.php',
        'function'      =>      'oondeo_rest_check_permission()'
    ));
    $user_id = $request->get_param( 'user_id' );
    $action = $request->get_param( 'action' );
    $post_id = $request->get_param( 'post_id' );

    if( !isset( $user_id ) || empty( $user_id )  ){
        global $user;
        $user_id = $user->ID;
    }else{
        $user = get_user_by('ID', $user_id);
    }

    
    
    $permitted = false; 
    
    if( isset( $post_id ) && !empty( $post_id ) ){
        $post = get_full_post( array(
            'post_type'			=>	'solicitud',
            'p'						=>	$post_id
		) );
        $estado= $post->meta_data['estado_solicitud'];
        if( is_array($estado) ){
            $estado = $estado[0];
        }
        
        document_info( 'revisa_api.php->check_permission.txt', "Post (estado: $estado)", $post, true );
        $permitted = apply_filters( 'check_solicitud_permission', 'edit', $post );
        document_info( 'revisa_api.php->check_permission.txt', "Permitted Post ID: $post_id)", ($permitted) ? "Si" : "No", true );
    }else{
        $permitted = user_can( $user_id, $action );
        document_info( 'revisa_api.php->check_permission.txt', "Permitted  Sin Post ID", ($permitted) ? "Si" : "No", true );
    }
    document_info( 'revisa_api.php->check_permission.txt', "Basic Info", array(
        'location'      =>      'plugins/revisa_rest_api/revisa_rest_api.php',
        'function'      =>      'oondeo_rest_check_permission()'
    ), true);
    document_info( 'revisa_api.php->check_permission.txt', "Request", $request, true );
    document_info( 'revisa_api.php->check_permission.txt', "Variables", array(
        'user_id'           =>  $user_id,
        'action'            =>  $action,
        'post_id'           =>  $post_id
    ), true );
    document_info( 'revisa_api.php->check_permission.txt', "Permitted", ($permitted) ? "Si" : "No", true );
    document_info( 'revisa_api.php->check_permission.txt', "USER (id?: $user_id)", $user, true );
    
    $json = json_encode ( $permitted );
    return rest_ensure_response( $json );
}
/****** FIN CHECK PERMISSION ******/


/****** MODIFY USER STATUS ******/
add_action( 'init', function(){
    add_action( 'rest_api_init', function() {
        register_rest_route( 'oondeo/v1', '/modify_user_status', [
            'method'    =>  WP_REST_Server::READABLE,
            'callback'  =>  'oondeo_rest_route_modify_user_status',
            'args'      =>  [
                'username'   =>  [
                    'required'  =>  true,
                    'type'      =>  'string'
                ],
                'status'   =>  [
                    'required'  =>  true,
                    'type'      =>  'number'
                ]
            ]
        ] );
    } );
} );

function oondeo_rest_route_modify_user_status( $request ){
    $status = $request->get_param( 'status' );
    $userName = $request->get_param( 'username' );
    
    $modified = oondeo_rest_modify_user_status( $userName, $status );
    
    return rest_ensure_response( $modified );

    return rest_ensure_response( array(
        'status'        =>  $status,
        'userName'      =>  $userName,
        'modified'      =>  $modified
    ));
}

function oondeo_rest_modify_user_status( $userName, $status ){
    include_once '../aa-oondeo-functions/aa-oondeo-functions.php';

    $wp_user = get_user_by('login', $userName );
    if( !$wp_user ){ return false; }

    if( function_exists( 'get_full_user_oondeo' ) ){
        $user = get_full_user_oondeo( $wp_user );
    }else{
        $user = "FFF";
    }
    // return $user;
    
    if( function_exists('modify_user_param') ){
        $modified = modify_user_param( $user, 'wp-approve-user', $status );
        if( $modified ){
            return true;
        }
    }else{
        return "!function_exists('modify_user_param')";
    }
}
/****** FIN MODIFY USER STATUS ******/


/****** GET PUBLIC USERS ******/
add_action( 'init', function(){
    add_action( 'rest_api_init', function() {
        register_rest_route( 'oondeo/v1', '/get_public_users', [
            'method'    =>  WP_REST_Server::READABLE,
            'callback'  =>  'oondeo_rest_route_get_public_users',
            'args'      =>  []
        ] );
    } );
} );

function oondeo_rest_route_get_public_users( $request ){    
    include_once '../aa-oondeo-functions/aa-oondeo-functions.php';
    
    $public_user_types = array('inspector', 'tecnico');
    $prohibited_user_types = array('administrator', 'administrativo');

    $args = array(
        'role__in'      =>  $public_user_types,
        'role__not_in'  =>  $prohibited_user_types
    );

    $public_users = get_simplified_users( $args );
    
    return rest_ensure_response( $public_users );
}
/****** FIN GET PUBLIC USERS ******/


/****** CHECK USER EXISTS ******/
add_action( 'init', function(){
    add_action( 'rest_api_init', function() {
        register_rest_route( 'oondeo/v1', '/check_user_exists', [
            'method'    =>  WP_REST_Server::READABLE,
            'callback'  =>  'oondeo_rest_route_check_user_exists',
            'args'      =>  [
                'search'   =>  [
                    'required'  =>  true,
                    'type'      =>  'string'
                ],
                'user_type'   =>  [
                    'required'  =>  false,
                    'type'      =>  'string'
                ]
            ]
        ] );
    } );
} );

function oondeo_rest_route_check_user_exists( $request ){    
    include_once '../aa-oondeo-functions/aa-oondeo-functions.php';
    
    $public_user_types = array('inspector', 'tecnico');
    $prohibited_user_types = array('administrator', 'administrativo');

    $search = $request->get_param('search');
    if( $request->get_param('user_type') ){
        $user_type = $request->get_param('user_type');
        $public_user_types = array( $user_type );
    }

    $args = array(
        'role__in'      =>  $public_user_types,
        'role__not_in'  =>  $prohibited_user_types,
        'search'        =>  $search
    );

    
    $wp_user = get_user( $args );
    if( !$wp_user ){
        return false;
    }else{
        return true;
    }
}
/****** FIN CHECK USER EXISTS ******/
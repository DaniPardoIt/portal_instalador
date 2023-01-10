<?php
$user;
/* GLOBAL */
add_action('init', 'my_current_user');
function my_current_user(){
	global $user, $oondeo_config;
	if( !isset( $user ) || empty($user) ){
		$user = wp_get_current_user();
	}
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('user.txt', "USER", $user);
	}
	
}

$oondeo_config = array(
	'log_level' => 3,
	'error_log' => true
);
/* FIN GLOBAL */

function scanAllDir($dir) {
  $result = [];
  foreach(scandir($dir) as $filename) {
    if ($filename[0] === '.') continue;
    $filePath = $dir . '/' . $filename;
    if (is_dir($filePath)) {
      foreach (scanAllDir($filePath) as $childFilename) {
        $result[] = $filename . '/' . $childFilename;
      }
    } else {
      $result[] = $filename;
    }
  }
  return $result;
}

add_action( 'wpcf7_before_send_mail', 'procesar_formulario', 10, 3);
function procesar_formulario( $contact_form, &$abort, $submission ){
	global $oondeo_config;

	$datos_formulario = $submission->get_posted_data();
	$uploaded_files = $submission->uploaded_files();
	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('procesar_formulario.txt', '$datos_formulario: ', $datos_formulario);
		document_info('procesar_formulario.txt', '$uploaded_files: ', $uploaded_files, true);
	}

	$save = $datos_formulario['save_button'];
	if( $save == 1 ){
		onsave_solicitud( $datos_formulario );
	}else{
		onsend_solicitud( $datos_formulario );
	}

}


$entidad = pods('entidad');
document_info( 'entidad.txt', 'entidad_br', $entidad );

function onsave_solicitud( $data ){
	global $oondeo_config;

	reset_documents( array('debug_save.txt', 'cf7_uploaded_files.txt', 'onsave_solicitud.txt') );
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('onsave_solicitud.txt', "RAW FORM", $data);
	}

	//Borrar campos del formulario que solo utilizamos para el frontend
 	$data = array_remove_keys( $data, array('save_button', 'opcion', 'hay*') );
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('onsave_solicitud.txt', "DATA AFTER REMOVE KEYS: ", $data, true);
		document_info('onsave_solicitud.txt', '!isset($datos["post_id"])', !isset($data['post_id']), true);
		document_info('onsave_solicitud.txt', 'isset($datos["post_id"])',  isset($data['post_id']), true);
		document_info('onsave_solicitud.txt', 'empty($datos["post_id"])',empty($data['post_id']), true);
	}

	//Comprobar si el POST ya existe
	//Si no existe el campo post_id o está vacío. Creamos una nueva solicitud.
	//Si existe lo actualizamos.
	if( !isset($data['post_id']) || isset($data['post_id']) && empty($data['post_id']) ){
		return new_solicitud( $data );
	}else{
		return existent_solicitud( $data );
	}
}

function save_or_update_entidades( $entidades, $do_update = false ){
	global $oondeo_config;	

	$id_entidades = array();

	reset_documents(['save_or_update_entidad.txt','check_entidad_existe.txt']);

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('save_or_update_entidades.txt', "ENTIDADES: ", $entidades);
	}

	foreach( $entidades as $key=>$entidad ){
		$id_entidad = save_or_update_entidad( $entidad, $do_update );
		$id_entidades[$key] = $id_entidad;
	}
	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('save_or_update_entidades.txt', "ID ENTIDADES: ", $id_entidades);
	}

	return $id_entidades;
}

function save_or_update_entidad( $entidad, $do_update ){
	global $oondeo_config;

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('save_or_update_entidad.txt', "ENTIDAD: ", $entidad, true);
	}
	
	$pod = pods('entidad');

	$id_entidad = check_entidad_existe( 'numero_documento', $entidad['numero_documento'] );

	if( $oondeo_config['log_level'] >= 3 ){
		document_info('save_or_update_entidad.txt', "POD entidad: ", $pod, true);
		document_info('save_or_update_entidad.txt', "id_entidad (check_entidad_existe): ", $id_entidad, true);
	}

	if( $id_entidad <= 0){
		$id_entidad = $pod->add( $entidad );
	}else{
		$entidad['post_id'] = $id_entidad;
		$entidad['ID'] = $id_entidad;
		$entidad['id'] = $id_entidad;
		if( $oondeo_config['log_level'] >= 2 ){
			document_info('save_or_update_entidad.txt', "ENTIDAD EXISTE (ID: $id_entidad): ", $entidad, true);
		}
		if( $do_update ){
			//Desactivado el Update
			$id_entidad = $pod->save( $entidad, null, $id_entidad );
		}
	}

	return $id_entidad;
}

/**
 * Función que comprueba si existe una entidad en base a los parámetros dados
 * 
 * @param			String			$field			El campo del pod que se va a buscar ("codigo_interno", "post_id", etc.)
 * @param			Mixed				$value			El valor del campo que se va a buscar en el pod
 * 
 * @return 		Int					Devuelve el id del POST si lo ha encontrado, si no devuelve -1
 * **/
function check_entidad_existe( $field, $value ){
	global $oondeo_config;
	$query = "$field.meta_value";
	$existe = -1;

	$pod = pods('entidad')->find( array(
		'where' => "$query = '$value'"
	) );
	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('check_entidad_existe.txt', "Query: $query", $pod, true);
	}

	while( $pod->fetch() ){
		$row = $pod->row();
		if( $oondeo_config['log_level'] >= 2 ){
			document_info('check_entidad_existe.txt', "POD Fetch()", $pod, true);
			document_info('check_entidad_existe.txt', "ROW", $row, true);
		}
		if( !empty( $row ) && isset($row['ID']) && !empty($row['ID']) ){
			$existe = $row['ID'];
		}
	}

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('check_entidad_existe.txt', "Existe: $existe", '', true);
	}

	return $existe;
}

/**
 * Función que crea un nuevo Pod con los datos que se le pasan
 * 
 * @param			Array			$data			Array de datos para guardar el Pod
 * **/
function new_solicitud( $data ){
	global $oondeo_config, $user;

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "USER: ", $user);
	}

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "DATOS ORIGINALES: ", $data, true);
	}
	
	// error_log("\n--USER: \n");
	// error_log( print_r($user, true) );

	$data['codigo_interno'] = generar_codigo_interno( $data['campo_actuacion'] );

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "DATOS MODIFICADOS: ", $data, true);
	}

	$entidades = get_entidades_from_solicitud( $data, true );
	$id_entidades = save_or_update_entidades( $entidades );
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "ENTIDADES: ", $entidades, true);
		document_info('new_solicitud.txt', "IDS ENTIDADES: ", $id_entidades, true);
	}

	foreach( $data as $key=>$value ){
		if( is_array( $value )){
			$data[$key] = $value[0];
		}
	}

	// Datos del Post
	$post_data = array(
		'post_title'		=>	"{$data['codigo_interno']} - {$data['denominacion']}",
		'post_author'		=>	$user->ID,
		'post_type'			=>	"solicitud",
		'post_status'		=>	"Publish"
	); 

	// Añadimos los Datos del Post al $data
	$data = array_merge( $data, $post_data );

	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "data: ", $data, true);
	}

	$pod = pods('solicitud');

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "data: ", $data, true);
		document_info('new_solicitud.txt', "pod: ", $pod, true);
	}
	$id_solicitud = $pod->add( $data );
		
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('new_solicitud.txt', "id_solicitud: $id_solicitud; POD: ", $pod, true);
	}

	return $id_solicitud;
}

/**
 * Función que se ejecuta si la solicitud que se ha recibido en el formulario existe, por lo cual se deberá actualizar
 * 
 * @param			Array			$data			Array de datos para actualizar el Pod
 * **/
function existent_solicitud( $data ){
	global $oondeo_config, $user;

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "DATOS: ", $data);
	}
	
	$entidades = get_entidades_from_solicitud( $data, true );
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "ENTIDADES: ", $entidades, true);
	}

	$id_entidades = save_or_update_entidades( $entidades );
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "IDS ENTIDADES: ", $id_entidades, true);
	}

	foreach( $data as $key=>$value ){
		if( is_array( $value )){
			$data[$key] = $value[0];
		}
	}
	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "data: ", $data, true);
	}

	$pod = pods('solicitud');

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "data: ", $data, true);
		document_info('existent_solicitud.txt', "pod: ", $pod, true);
	}
	$id_solicitud = $pod->save( $data, null, $data['post_id'] );
		
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('existent_solicitud.txt', "id_solicitud: $id_solicitud; POD: ", $pod, true);
	}

	return $id_solicitud;
}

/**
 * Función que recorre los datos de una solicitud (Seguramente proviene de un CF7) y devuelve un array asociativo, creando un array para cada tipo de entidad.
 * 
 * @param 		Array			$data			Array de datos donde va a buscar los índices que indiquen si pertenece a alguna entidad
 * @param			Boolean		$clean		Default: false. true para limpiar aquellas entidades que no tengan un campo "numero_documento"(NIF/CIF). false pasa todas las entidades.
 * 
 * @return 		Array			Array de Entidades
 * **/
function get_entidades_from_solicitud( $data, $clean=false ){
	global $oondeo_config;
	$entidades = array();

	foreach( $data as $key=>$value ){

		if( is_array($value) ){
			$value = join(',', $value);
		}

		switch( true ){
			case str_contains( $key, '_titular' ):
				// Los campos del formulario vienen como numero_documento_titular, como ahora ya metemos el campo dentro del array propio de titular, lo eliminamos de dentro, lo cual nos facilita el trabajo para guardar el pod. 
				// Entrada: data['numero_documento_titular']; 
				// Salida: entidades['titular']['numero_documento']
				$entidades['titular'][str_replace( "_titular", "", $key )] = $value;
				continue 2;
				break;

			case str_contains( $key, '_representante' ):
				$entidades['representante'][str_replace( "_representante", "", $key )] = $value;
				continue 2;
				break;

			case str_contains( $key, '_empresa_instaladora' ) && !str_contains( $key, 'archivo_'):
				$entidades['empresa_instaladora'][str_replace( "_empresa_instaladora", "", $key )] = $value;
				continue 2;
				break;

			case str_contains( $key, '_instalador_electricista' ):
				$entidades['instalador_electricista'][str_replace( "_instalador_electricista", "", $key )] = $value;
				continue 2;
				break;

			case str_contains( $key, '_proyectista' ):
				$entidades['proyectista'][str_replace( "_proyectista", "", $key )] = $value;
				continue 2;
				break;

			case str_contains( $key, '_director_obra' ):
				$entidades['director_obra'][str_replace( "_director_obra", "", $key )] = $value;
				continue 2;
				break;
		}
	}

	foreach( $entidades as $key=>$e ){
		$entidades[$key]['post_title'] = $e['numero_documento'] . " - " . $e['razon_social'];
		// error_log( "\n--Entidad\n" );
		// error_log( print_r($e, true) );
	}

	if( $oondeo_config['log_level'] >= 2 ){
		document_info('get_entidades_from_solicitud.txt', "ENTIDADES: ", $entidades);
	}

	if( !$clean ){
		return $entidades;
	}

	$entidades_clean = array();

	foreach( $entidades as $entidad=>$datos ){
		if( isset($datos['numero_documento']) && !empty($datos['numero_documento']) ){
			$entidades_clean[$entidad] = $datos;
		}
	}
	
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('get_entidades_from_solicitud.txt', "ENTIDADES CLEAN: ", $entidades_clean, true);
	}

	return $entidades_clean;
}

function update_solicitud( $data ){

}

function onsend_solicitud( $data ){

}

// Busca cuál es el último código interno de la categoría especificada y devuelve el siguiente código
/**
 * Función que busca cuál
 * **/
function generar_codigo_interno( $cat ){
	global $oondeo_config;

	$cat = strtoupper($cat);
	$int_length = 5;
	$codigo_interno = (string)$cat;
	//echo "<h2>Cat: $cat</h2>";

	wp_reset_postdata();
	$query = new WP_Query( array(
		'post_type' => 'solicitud',
		'orderby' => 'date',
		'post_per_page' => 1,
		'meta_query' => array(
			array(
				'key' => 'codigo_interno',
				'compare' => 'LIKE',
				'value' => $cat
			)
		)
	) );


	$debug_text = <<<EOT

	-----
	generar_codigo_interno()
	cat: $cat;
	query->post:

	-----

	EOT;

	file_put_contents( 'debug_save.txt', $debug_text, FILE_APPEND);

	file_put_contents( 'debug_save.txt', '++ Query Posts', FILE_APPEND);
	file_put_contents( 'debug_save.txt', print_r($query->posts, true), FILE_APPEND);
	file_put_contents( 'debug_save.txt', '++', FILE_APPEND);
	
	if( $query->have_posts() ){
		$ultimo_post = $query->posts[0];
		// echo "<h2>Ultimo Post</h2><pre>";
		// print_r($ultimo_post);
		// echo "</pre>";

		$ultimo_codigo_interno = get_post_meta( $ultimo_post->ID, 'codigo_interno' )[0];
		// echo "<h2>Ultimo Codigo Interno: $ultimo_codigo_interno</h2> ";

		$int_ultimo_codigo_interno = intval( str_replace( $cat, "", $ultimo_codigo_interno ) );
		// echo "<h2>INT Ultimo Codigo Interno: $int_ultimo_codigo_interno</h2> ";

		$num_zeros = $int_length - strlen( strval($int_ultimo_codigo_interno) );

		$todos_numeros_son_nueve = true; //Si todos los numero son 9, el siguiente tiene un dígito más, así que hay que quitar un cero.
		for($i=0; $i<strlen( strval($int_ultimo_codigo_interno) ); $i++){
			if( substr( strval($int_ultimo_codigo_interno), $i, $i+1 ) != '9' ){
				$todos_numeros_son_nueve = false;
				break;
			}
		}
		if( $todos_numeros_son_nueve ){
			$num_zeros-=1;
		}

		for($i=0; $i<$num_zeros; $i++){
			$codigo_interno.='0';
		}
		$codigo_interno.=$int_ultimo_codigo_interno+1;
	}else{
		for($i=0; $i<$int_length-1; $i++){// -1 porque se reserva 1 dígito para el número 1
			$codigo_interno.='0';
		}
		$codigo_interno.="1";
		// echo "CODIGO INTERNO = $codigo_interno";
	}

		
	if( $oondeo_config['log_level'] >= 2 ){
		document_info('generar_codigo_interno.txt', "QUERY: ", $query);
		document_info('generar_codigo_interno.txt', "CÓDIGO INTERNO: $codigo_interno", '', true);
	}

	// echo "CODIGO INTERNO = $codigo_interno";
	// echo "<h2>Query</h2><pre>";
	// print_r($query);
	// echo "</pre>";

	return $codigo_interno;
}

/**
 *
 * Get User Name. By user_id o el usuario del sistema
 *
 * @param Int $user_id Opcional. Default: null
 * @return String User Nicename.
 */
function get_user_name( $user_id=null ){
	if( $user_id ){
		$user = get_user_by('ID', $user_id);
	}else{
		$user = wp_get_current_user();
	}
	document_info( 'get_user_name.txt', '----USER NAME ----', $user->data->user_nicename);
	document_info( 'get_user_name.txt', '----USER----', $user, true);

	return $user->data->user_nicename;
}

// function guardar_solicitud( $datos, $uploadedFiles ){
// 	//Reset del fichero debug_save y uploaded_files
// 	document_info( 'debug_save.txt', '', '');
// 	document_info( 'cf7_uploaded_files.txt', '', '');
	
// 	$user = wp_get_current_user();
	
// 	//Generar Codigo Interno si post_id no existe
// 	if( !isset($datos['post_id']) || isset($datos['post_id']) && empty($datos['post_id']) ){
// 		$codigo_interno = generar_codigo_interno( $datos['campo_actuacion'] );
// 		$user_name = get_user_name();
// 	}else{
// 		$codigo_interno = $datos['codigo_interno'];
// 		$user_name = $datos['usuario'];
// 	}

// 	$post_meta = array();

// 	//No queremos almacenar estas opciones en bases de datos, son útiles únicamente para el frontend.
// 	$excluded_keys = ['opcion', 'save_button'];

// 	$posts_entidades = array();

// 	// Bucle que recorre todos los datos recibidos del formulario. 
// 	// Si pertenece a alguna entidad se almacena en el array de post_entidades para crear un post tipo entidad por cada uno de ellos.
// 	foreach( $datos as $key => $value ){
// 		$add_to_meta_data = true;
// 		switch( true ){
// 			case str_contains( $key, "codigo_interno" ):
// 				$value = $codigo_interno;
// 				break;

// 			case str_contains( $key, "usuario" ):
// 				$value = $user_name;
// 				break;

// 			case str_contains( $key, '_titular' ):
// 				$posts_entidades['titular'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;

// 			case str_contains( $key, '_representante' ):
// 				$posts_entidades['representante'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;

// 			case str_contains( $key, '_empresa_instaladora' ):
// 				$posts_entidades['empresa_instaladora'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;

// 			case str_contains( $key, '_instalador_electricista' ):
// 				$posts_entidades['instalador_electricista'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;

// 			case str_contains( $key, '_proyectista' ):
// 				$posts_entidades['proyectista'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;

// 			case str_contains( $key, '_director_obra' ):
// 				$posts_entidades['director_obra'][$key] = $value;
// 				$add_to_meta_data = false;
// 				continue 2;
// 				break;
// 		}
		
// 		if( $add_to_meta_data && !empty($value) && !in_array( $key, $excluded_keys ) ){
// 			$post_meta[$key] = $value;
// 		}
// 	}

	
// 	document_info( 'posts_entidades.txt', "ARRAY POSTS ENTIDADES", $posts_entidades, true );

// 	document_info( 'post_entidades.txt', "", "" );

// 	$array_entidades = array();
// 	// Crear o Modificar los posts relativos a las entidades
// 	foreach( $posts_entidades as $entidad=>$campos ){
// 		// NIF/CIF vacío == Entidad no rellenada
// 		document_info( 'post_entidades.txt', "\n CAMPOS: $entidad", $campos, true );

// 		$num_doc_entidad = esc_sql( $campos["numero_documento_$entidad"] );
		
// 		if( empty($num_doc_entidad) ){
// 			continue;
// 		}

// 		$post_meta_entidad = form_to_entidad( $campos, $entidad );
// 		$post_data_entidad = array(
// 			'post_title' => $post_meta_entidad['numero_documento'] .' - '. $post_meta_entidad['razon_social'],
// 			'post_author' => $user->ID,
// 			'post_type' => 'entidad',
// 			'post_status' => "Publish"
// 		);
// 		$post_entidad = array_merge( $post_data_entidad, $post_meta_entidad);

// 		if( isset($campos["id_$entidad"]) && !empty($campos["id_$entidad"]) ){
// 			$post_entidad['post_id'] = $campos["id_$entidad"];
// 		}

// 		document_info( 'post_entidades.txt', "\n POST ENTIDAD: $entidad", $post_entidad, true );

// 		$pod_by_nif = pods('entidad')->find( array(
// 			'where'	=>	"numero_documento.meta_value = '$num_doc_entidad'"
// 		) );
// 		document_info('pods_by_nif.txt', "PODS NIF: $num_doc_entidad", $pod_by_nif, true);

// 		$pod = pods('entidad');

// 		$num_entidades = 0;
// 		while( $pod_by_nif->fetch() ){
// 			$num_entidades++;
// 			$row = $pod_by_nif->row();
// 			document_info('pods_by_nif.txt', "ROW: ", $row, true);
// 			$pod->save( $post_entidad, null, $row['ID'] );
// 			$array_entidades[$entidad] = $row['ID'];	
// 			error_log('----------YEEEESSSSS-----------');
// 			error_log("\n--Entidad Actualizada. ID: {$row['ID']}\n");
// 		}

// 		if( $num_doc_entidad <= 0 ){
// 			$entidad_id = $pod->add( $post_entidad );
// 			$array_entidades[$entidad] = $entidad_id;		
			
// 			document_info( 'post_entidades.txt', "\n ID POST ENTIDAD: $entidad", "ID: ".$entidad_id, true );
// 		}

// 	}
// 	document_info( 'post_entidades.txt', "\n IDS ENTIDADES", $array_entidades, true );
	
// 	// .../uploads/ficheros_solicitudes/$user->ID/año/mes/....
// 	// $path_to_folder = ABSPATH . 'uploads/ficheros_solicitudes/' . $user->ID .'/'. date("Y/m") .'/' . $datos['nif_titular'];
// 	$path_to_folder = 'wp-content/uploads/ficheros_solicitudes/' . $user->ID .'/'. date("Y/m");
// 	if (!file_exists($path_to_folder)){
// 		mkdir($path_to_folder,0777,true);	
// 	}
	
// 	document_info( 'debug_save.txt', "**\npath_to_folder: ".$path_to_folder."\n** ", "", true );
// 	document_info( 'cf7_uploaded_files.txt', 'Uploaded Files', $uploadedFiles, true );

// 	$url_file_inputs = [];

// 	//Bucle que recorre los archivos subidos, crea un nuevo nombre con el patrón que buscamos y copia el fichero en la carpeta que indicamos
// 	foreach( $uploadedFiles as $key => $uf ){
// 		$arrFiles = [];
// 		foreach( $uf as $file_temp_url ){
// 			$url_split = explode('/', $file_temp_url);
// 			$random = rand( 10000000, 99999999 );
// 			$original_file_name = end( $url_split );
// 			$name = explode('.', $original_file_name)[0];
// 			$extension = explode('.', $original_file_name)[1];
// 			$custom_file_name = $name ."__". $codigo_interno ."__". $random .".". $extension;
// 			$relative_file_path = $path_to_folder.'/'.$custom_file_name;

// 			document_info( 'debug_save.txt', "** File: **", 
// 				"
// 			file_temp_url: $file_temp_url
// 			original_file_name: $original_file_name
// 			custom_file_name: $custom_file_name
// 			new_folder_location: $path_to_folder
// 			--"
// 			, true );

// 			copy( $file_temp_url, $relative_file_path );

// 			$arrFiles[] = $relative_file_path;
// 		}
// 		if($arrFiles){
// 			$url_file_inputs[$key] = $arrFiles;
// 		}
// 	}

// 	document_info( 'cf7_uploaded_files.txt', "URL File Inputs:", $url_file_inputs, false );

// 	foreach( $url_file_inputs as $key => $file ){
// 		$url = '';
// 		$count = 1;
// 		foreach( $file as $f ){
// 			if( $count == 1 ){
// 				$count--;
// 			}else{
// 				$url .= ",";
// 			}
// 			$url .= $f;
// 		}
// 		$post_meta[$key] = $url;
// 	}

// 	foreach( $array_entidades as $nombre_entidad=>$id_entidad ){
// 		error_log("\n----Entidad: $nombre_entidad; ID: $id_entidad");
// 		$post_meta[$nombre_entidad] = $id_entidad;
// 	}

// 	document_info( 'debug_save.txt', 'datos:', $datos, true );
// 	document_info( 'debug_save.txt', 'post_meta:', $post_meta, true );

// 	$post_status = 'publish';

// 	$post_data = array(
// 		'post_title' => $codigo_interno .' - '. $datos['denominacion'],
// 		'post_author' => $user->ID,
// 		'post_type' => 'solicitud',
// 		'post_status' => $post_status
// 	);

// 	$postarr = array_merge( $post_data, $post_meta );

// 	document_info( 'debug_save.txt', 'postarr:', $postarr, true );

// 	if( !empty($datos['post_id']) ){
// 		$postarr['ID'] = $datos['post_id'];
// 	}

// 	$pod = pods('solicitud');
// 	$post_id = $pod->add( $postarr );


// 	document_info( 'pods.txt', "array_entidades", $array_entidades );
// 	document_info( 'pods.txt', "pod( 'solicitud' )", $pod, true );
// 	document_info( 'pods.txt', "POST_ID", $post_id, true );

// 	if ( function_exists( 'exim_rest_post' ) ) {
// 		exim_rest_post($post_id);
// 	}
// }

/**
 * Función que permite pasar los campos recibidos del CF7 a los campos que deben ser para almacenar una nueva entidad en la base de datos.
 * 
 * @param Array $campos Array de Campos del CF7
 * @param String $entidad Nombre de la entidad. Ej. "empresa_instaladora"
 * 
 * @return Array Campos parseados con las key de la BBDD
 * 
 *  **/ 
function form_to_entidad( $campos, $entidad ){

	$meta_data = array();

	foreach( $campos as $key=>$value ){
		$temp_key = str_replace( "_$entidad", "", $key );
		if($temp_key == "id"){
			continue;
		}
		if( is_array($value) ){
			$value = implode(',', $value);
		}
		
		$meta_data[$temp_key] = $value;
	}
	
	document_info( 'form_to_entidad.txt', "form_to_entidad( $entidad )", $meta_data, true );
	return $meta_data;
}

/**
 * Function that remove keys from an array.
 * 
 * @param			Array				$array			Array to remove keys
 * @param			Array				$keys				Keys to remove from array
 * 
 * @return 		Array				Array sin los keys
 * **/
function array_remove_keys( $array, $keys ){
	$removed = array();
	foreach( $keys as $k ){
		try{
			if( substr($k, -1) == '*' ){
				//Si la key que se desea eliminar tiene como último caracter '*', se recorre todo el array eliminando aquellas entradas del array que comiencen con el string antes del '*'
				$k = substr( $k, 0, -1 );
				foreach( $array as $key=>$value ){
					if( substr( $key, 0, strlen($k) ) == $k ){
						unset( $array[$key] );
					}
				}
			}else{
				$removed[$k] = $array[$k];
				unset( $array[$k] );
			}
		}catch(Exception $e){
			$removed[$k] = "Error. Key Not Found";
		}
	}

	return $array;
}

/**
 * Function to get all terms and their own child terms to get an hierarchy array of terms
 * 
 * @param 	Array		$args		Parámetros necesarios para realizar la consulta de get_terms( $args )
 * 
 * @return	Array		Multidimensional. Cada term tiene en su interior los term que descuelgan de él.	
 * **/
function get_all_term_hierarchy_data_formatted( $args ){
	$array = [];
	$terms = get_terms( $args );
	// echo '<pre>';
	// print_r($terms);
	// echo '</pre>';
	$cont = 0;

	foreach( $terms as $term ){
		
		$args['parent'] = $term->term_id;
		$subcats = get_all_term_hierarchy_data_formatted( $args );
		document_info( 'get_all_term_hierarchy_data.txt', '+++++++++++++++ '.$term->name. ' +++++++++++++++', $term->id , true );

		$term_meta = get_term_meta( $term->term_id );
			if( isset($term_meta['tipos_de_solicitudes']) && $term_meta['tipos_de_solicitudes'] &&$term_meta['tipos_de_solicitudes'] != "" ){
			document_info( 'get_all_term_hierarchy_data.txt', '!! TERM META', print_r( $term_meta, true) , true );
			$tipos_solicitud = $term_meta['tipos_de_solicitudes'];
			
			//document_info( 'get_all_term_hierarchy_data.txt', 'TEEERRRRRMMMM Name', $term->name, true );	
			//document_info( 'get_all_term_hierarchy_data.txt', 'TIPOS SOLICITUD:', $tipos_solicitud, true );	
			$arr_tipos_solicitud = array();

			foreach( $tipos_solicitud as $ts ){
				
				document_info( 'get_all_term_hierarchy_data.txt', '$ts:', $ts, true );	

				$tipo_solicitud = get_term_by( 'term_id', $ts, 'tipo_solicitud' );
				$ts_meta = get_term_meta($ts); 
				
				document_info( 'get_all_term_hierarchy_data.txt', '$tipo_solicitud:', $tipo_solicitud, true );

				document_info( 'get_all_term_hierarchy_data.txt', '$tipo_solicitud META:', $ts_meta, true );

				$temp_arr = array(
					'id' => $tipo_solicitud->term_id,
					'back_name' => $tipo_solicitud->name,
					'name' => get_term_meta( $ts, 'front_name')[0],
					'slug' => $tipo_solicitud->slug,
					'description' => $tipo_solicitud->description
				);
				if( isset(get_term_meta( $ts, "short_name")[0]) ){
					$short_name = get_term_meta( $ts, "short_name")[0];
					$temp_arr['short_name'] = $short_name;
				}

				$arr_tipos_solicitud[] = $temp_arr;
			}
			
			document_info( 'get_all_term_hierarchy_data.txt', 'ARR_TIPOS_SOLICITUD:', $arr_tipos_solicitud, true );	
		}

		if( count($term_meta) < 1 ){
			continue;
		}
		
		// $cont = $cont +1;
		// echo '<pre>'; 
		// echo '<span>Term '.$cont.'</span>';
		// echo '</pre>';
		// echo '<h2>Term meta</h2>';
		// echo '<pre>';
		// print_r($term_meta);
		// echo '</pre>';

		$temp_term_data = [
			'id'	=>	$term->term_id,
			'slug'		=> 	$term->slug,
			'name'	=>	$term->name,
			'subcats'	=> $subcats
		];
		if( isset($term_meta['short_name']) ){
			$temp_term_data['short_name'] = $term_meta['short_name'][0];
		}
		if( isset($arr_tipos_solicitud) ){
			$temp_term_data['tipos_solicitud'] = $arr_tipos_solicitud;
		}
		// Si el term_meta contiene icono, lo añade a los datos.
		if( isset($term_meta['icon']) ){
			$attached_file = get_attached_file($term_meta['icon'][0] );
			$iconSrc = str_replace( "/var/www/clients/client2/web27/web", "" , $attached_file );
			$iconAlt = get_post_meta( $term_meta['icon'][0], '_wp_attachment_image_alt', TRUE );

			$temp_term_data['icon'] = $iconSrc;
			$temp_term_data['icon_alt'] = $iconAlt;
		}

		

		$array[] = $temp_term_data;
	}
	// document_info( 'get_all_term_hierarchy_data.txt', 'Array: '.$term->term_id, $array, true );
	return $array;
}

/**
 * Función que dependiendo del $campo_actuación devuelve el HTML del Formulario CF7 correspondiente.
 *
 * @param 		String 		$campo_actuacion
 * 
 * @return 		String 		HTML del Formulario
 * **/
function selectFormBy_CampoActuacion( $campo_actuacion ){
	switch ( $campo_actuacion ){
	case "BTNI" :
	case "btni" :
	case "baja-tension-no-industrial" :
	case "Baja Tensión No Industrial" :
	case "term_id:8":
			// echo "<h3>case 'ibtni'</h3>";
			return do_shortcode('[contact-form-7 id="209" title="Formulario Baja Tensión No Industrial"]');
			break;

	case "cini":
	case "CINI":
	case "cini":
	case "cini":
			echo 'Instalaciones Contra Incendios No Industrial';
			break;

	case "cii":
			echo 'Instalaciones Contra Incendios Industrial';
			break;

	case "eap":
			echo 'Equipos A Presión';
			break;

	case "isa":
			echo 'Instalaciones Interiores De Suministro de Aguas';
			break;
	default:
			return json_encode(['error'=>'No existe ningún formulario']);
			break;
	}
}
	
/**
 * Función que devuelve todos los tipos de expediente (Modificación Instalación|Nueva Instalación)
 * 
 * @return		Array			Todos los custom taxonomy del tipo "tipo_expediente"
 * **/
function get_tipos_expediente(){
	$array = [];

	$terms = get_terms( array(
		'taxonomy' => 'tipo_expediente',
		'hide_empty' => false,
		'orderby' =>	'term_id',
		'parent'	=> 0
	) );

	foreach( $terms as $term ){
		$term_meta = get_term_meta( $term->term_id );

		$array[] = [
			'id' => $term->term_id,
			'slug' => $term->slug,
			'name' => $term->name,
			'short_name' => $term_meta['short_name'][0]
		];
	}

	return $array;
}

/**
 * Función que devuelve el Post completo con todo su meta data
 * 
 * @param 		Array			$args			Argumentos para la llamada a la función WP_Query( $args )
 * 
 * @return		WP_Post		Objeto con su meta_data completa.
 **/
function get_full_post( $args ) {
	$postQuery = new WP_Query( $args );
	// echo "<br>POST::<pre>";
	// print_r($postQuery);
	// echo "</pre>";
	$post = $postQuery->posts[0];

	$meta_data = get_post_meta( $post->ID );
	document_info('get_full_post.txt', 'METADATA BEFORE', $meta_data, false);

	foreach( $meta_data as $key=>$value ){
		if( is_array( $value ) && is_string( $value[0] ) && str_contains($value[0], ":{" ) ){
			// error_log("\n-------Value Antes: $value[0] ; -------");
			$new_value = explode( "\"", $value[0] )[1];
			// error_log("\n-------Value Después: $new_value; -------");
			$meta_data[$key] = $new_value;
		}
	}

	$post->meta_data = $meta_data;

	// echo "<br>POST::<pre>";
	// print_r($post);
	// echo "</pre>";

	return $post;
}

function get_full_posts( $args ){

}

/**
 * Función que permite pasar un objeto WP_Post a un objeto JSON
 * @param 	WP_Post		Objeto para ser transformado a JSON
 * @return	JSON			Objeto ya formateado
 * **/
function post_to_JSON( $post ){

	$obj = clone $post;

	//Copiamos todos los atributos del post menos $meta_data
	$obj = array();
	foreach($post as $key=>$attr){
		if( $key != "meta_data"){
			$obj[$key] = $attr;
		}
	}

	//Copiamos los meta_data
	$meta_data_old = $post->meta_data;
	$meta_data = array();
	foreach( $meta_data_old as $key=>$mdo ){
		if( is_array($mdo) && count($mdo) == 1 ){
			$meta_data[$key] = $mdo[0];
		}else{
			$meta_data[$key] = $mdo;
		}
	}
	$obj['meta_data'] = $meta_data;

	return json_encode( $obj );
}

function findInCategories( $valueToFind, $categorias=null ){

	// echo "<br>Categorias<pre>";
	// print_r($categorias);
	// echo "</pre>";

	//$categorias = Array() --> Quiere decir que ha llegado al último nivel de subcategorías, por lo que no ha encontrado el valor que se esperaba.
	if( $categorias && count($categorias) == 0 ){
		return false;
	}

	//Si $categorias no es dado, se consulta a la base de datos
	if( !$categorias ){
		$categorias = get_all_term_hierarchy_data_formatted( array(
			'taxonomy' => 'categoria',
			'hide_empty' => false,
			'orderby' =>	'term_id',
			'parent'	=> 0
		) );
	}

	foreach( $categorias as $cat ){
		$result = array_search( $valueToFind, $cat );
		// echo "<br>---------CATEGORIA-----------<br>";
		// echo "nombre categoria: ". $cat['name'].'<br>';
		// echo 'valueToFind: '. $valueToFind.'<br>';
		// echo "result =" .$result.'<br>';

		if( isset($result) && !empty($result) ){
			//echo 'Encontrado';
			// echo "result = $result";
			// echo "<br>Categoria<pre>";
			// print_r($cat);
			// echo "</pre>";
			return $cat;
		}else {
			//Si no encuentra el valor esperado, se baja al siguiente nivel de subcategoría para buscar en él.
			//echo 'NO encontrado';
			// echo "<br>Subcats<pre>";
			// print_r($cat['subcats']);
			// echo "</pre>";
			//return findInCategories( $valueToFind, $cat['subcats']);
		}
	}

	return false;
}

function generateRandomString( $length = 8 ) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

function document_info( $file, $description, $info, $append=false ){
	$append ? $FILE_APPEND = FILE_APPEND : $FILE_APPEND=0;

	$now = DateTime::createFromFormat('U.u', microtime(TRUE));
	$now = $now->format('H:i:s.u');
	$text = <<<TEXT

	!--$now--!
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

/**
 * Función que resetea los documentos. Se usa sobre todo para los archivos de debug
 * 
 * @param 		Array			$file_names			Array de nombres de archivos que se deben resetear/vaciar
 * 
 * @return 		Boolean		true | false
 * **/
function reset_documents( $file_names ){
	try{
		foreach( $file_names as $f ){
			document_info( $f, $f, "" );
		}
		return true;
	}catch(Exception $e){
		return false;
	}
}

// $num_doc_entidad = esc_sql('47896531N');
// $pod_by_nif = pods('entidad')->find( array(
// 	'where'	=>	"numero_documento.meta_value = '$num_doc_entidad'"
// ) );
// document_info('pods_by_nif.txt', "PODS NIF: $num_doc_entidad", $pod_by_nif);

// while( $pod_by_nif->fetch() ){
// 	$row = $pod_by_nif->row();
// 	document_info('pods_by_nif.txt', "ROW: ", $row, True);
// 	if( $pod_by_nif->exists() ){
// 		error_log("\n----------YEEEESSSSS-----------\n");
// 		error_log("\nEntidad ID: ".$row['ID']);

// 	}else{
// 		error_log('----------NOOOOOPEEEE-----------');
// 	}
// }
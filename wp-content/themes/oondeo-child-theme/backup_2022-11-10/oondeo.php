<?php

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
	$datos_formulario = $submission->get_posted_data();
	$uploadedFiles = $submission->uploaded_files();
	
	file_put_contents( 'files.txt', json_encode($uploadedFiles), FILE_APPEND);
	//file_put_contents( 'debug_save.txt', $contact_form, FILE_APPEND);
	//file_put_contents( 'debug_save.txt', print_r(scanAllDir('/var/www/portal-instalador.revisa.web.oondeo.es/web/wp-content/uploads/wpcf7_uploads/'),true), FILE_APPEND);

	publicar_nuevo_formulario( $datos_formulario, $uploadedFiles );
}

// Busca cuál es el último código interno de la categoría especificada y devuelve el siguiente código
function generar_codigo_interno( $cat ){
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

	// echo "CODIGO INTERNO = $codigo_interno";
	// echo "<h2>Query</h2><pre>";
	// print_r($query);
	// echo "</pre>";

	return $codigo_interno;
}

function publicar_nuevo_formulario( $datos, $uploadedFiles ){
	//Reset del fichero debug_save y uploaded_files
	document_info( 'debug_save.txt', '', '');
	document_info( 'cf7_uploaded_files.txt', '', '');

	$user = wp_get_current_user();

	$codigo_interno = generar_codigo_interno( $datos['campo_actuacion'] );

	$post_meta = array();

	foreach( $datos as $key => $value ){
		if( $key == 'codigo_interno' ){
			$value = $codigo_interno;
		}
		if( !empty($value)){
			$post_meta[$key] = $value;
		}
		
	}

	
	// .../uploads/ficheros_solicitudes/$user->ID/año/mes/....
	// $path_to_folder = ABSPATH . 'uploads/ficheros_solicitudes/' . $user->ID .'/'. date("Y/m") .'/' . $datos['nif_titular'];
	$path_to_folder = 'wp-content/uploads/ficheros_solicitudes/' . $user->ID .'/'. date("Y/m");
	if (!file_exists($path_to_folder)){
		mkdir($path_to_folder,0777,true);	
	}
	
	document_info( 'debug_save.txt', "**\npath_to_folder: ".$path_to_folder."\n** ", "", true );
	document_info( 'cf7_uploaded_files.txt', 'Uploaded Files', $uploadedFiles, true );

	$url_file_inputs = [];

	//Bucle que recorre los archivos subidos, crea un nuevo nombre con el patrón que buscamos y copia el fichero en la carpeta que indicamos
	foreach( $uploadedFiles as $key => $uf ){
		$arrFiles = [];
		foreach( $uf as $file_temp_url ){
			$url_split = explode('/', $file_temp_url);
			$random = rand( 10000000, 99999999 );
			$original_file_name = end( $url_split );
			$name = explode('.', $original_file_name)[0];
			$extension = explode('.', $original_file_name)[1];
			$custom_file_name = $name ."__". $codigo_interno ."__". $random .".". $extension;
			$relative_file_path = $path_to_folder.'/'.$custom_file_name;

			document_info( 'debug_save.txt', "** File: **", 
				"
	file_temp_url: $file_temp_url
	original_file_name: $original_file_name
	custom_file_name: $custom_file_name
	new_folder_location: $path_to_folder
	--"
			, true );

			copy( $file_temp_url, $relative_file_path );

			$arrFiles[] = $relative_file_path;
		}
		if($arrFiles){
			$url_file_inputs[$key] = $arrFiles;
		}
	}

	document_info( 'cf7_uploaded_files.txt', "URL File Inputs:", $url_file_inputs, false );

	foreach( $url_file_inputs as $key => $file ){
		$url = '';
		$count = 1;
		foreach( $file as $f ){
			if( $count == 1 ){
				$count--;
			}else{
				$url .= ",";
			}
			$url .= $f;
		}
		$post_meta[$key] = $url;
	}

	document_info( 'debug_save.txt', 'datos:', $datos, true );
	document_info( 'debug_save.txt', 'post_meta:', $post_meta, true );

	$post_status = 'publish';

	$postarr = array(
		'post_title' => $codigo_interno .' - '. $datos['denominacion'],
		'post_author' => $user->ID,
		'post_type' => 'solicitud',
		'post_status' => $post_status,
		'meta_input' => $post_meta
	);

	document_info( 'debug_save.txt', 'postarr:', $postarr, true );

	if( !empty($datos_formulario['post_id']) ){
		$postarr['ID'] = $datos_formulario['post_id'];
	}

	$post_id = wp_insert_post( $postarr );

	if ( function_exists( 'exim_rest_post' ) ) {
		exim_rest_post($post_id);
	}
}


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
			if( isset($term_meta['tipos_de_solicitudes']) && $term_meta['tipos_solicitud'] &&$term_meta['tipos_de_solicitudes'] != "" ){
			document_info( 'get_all_term_hierarchy_data.txt', '!! TERM META', print_r( $term_meta, true) , true );
			$tipos_solicitud = $term_meta['tipos_de_solicitudes'];
			
			//document_info( 'get_all_term_hierarchy_data.txt', 'TEEERRRRRMMMM Name', $term->name, true );	
			//document_info( 'get_all_term_hierarchy_data.txt', 'TIPOS SOLICITUD:', $tipos_solicitud, true );	
			$arr_tipos_solicitud = array();

			foreach( $tipos_solicitud as $ts ){
				
				document_info( 'get_all_term_hierarchy_data.txt', '$ts:', $ts, true );	

				$tipo_solicitud = get_term_by( 'term_id', $ts, 'tipo_solicitud' );

				
				document_info( 'get_all_term_hierarchy_data.txt', '$tipo_solicitud:', $tipo_solicitud, true );

				$arr_tipos_solicitud[] = array(
					'id' => $tipo_solicitud->term_id,
					'back_name' => $tipo_solicitud->name,
					'name' => get_term_meta( $ts, 'front_name')[0],
					'slug' => $tipo_solicitud->slug,
					'short_name' => get_term_meta( $ts, 'short_name')[0],
					'description' => $tipo_solicitud->description
				);

			}
			
			// document_info( 'get_all_term_hierarchy_data.txt', 'ARR_TIPOS_SOLICITUD:', $arr_tipos_solicitud, true );	
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

function get_full_post( $args ) {
	$postQuery = new WP_Query( $args );
	// echo "<br>POST::<pre>";
	// print_r($postQuery);
	// echo "</pre>";
	$post = $postQuery->posts[0];

	$meta_data = get_post_meta( $post->ID );
	$post->meta_data = $meta_data;

	// echo "<br>POST::<pre>";
	// print_r($post);
	// echo "</pre>";

	return $post;
}

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
	$append ? $FILE_APPEND = FILE_APPEND : $FILE_APPEND=null;

	$text = <<<TEXT

	----
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


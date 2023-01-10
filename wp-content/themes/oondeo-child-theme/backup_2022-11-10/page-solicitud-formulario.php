
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";

?>
<?php
// Custom JS
function enqueue_formulario_js() {
	wp_enqueue_script( 'formulario-js', get_stylesheet_directory_uri().'/assets/js/formulario.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_formulario_js' );
get_header();
?>
<main>
	<h1>
		<?php the_title(); ?>
	</h1>

	<?php
	
	$array_categorias = get_all_term_hierarchy_data_formatted( array(
		'taxonomy' => 'categoria',
		'hide_empty' => false,
		'orderby' =>	'term_id',
		'parent'	=> 0
	) );

	// echo "<br>Categorias<pre>";
	// print_r($array_categorias);
	// echo "</pre>";
	if( isset( $_GET['post_ID'] ) ){
		$post_ID = $_GET['post_ID'];
		//echo '<h1>post_ID: '.$post_ID.'</h1>';
	}

	if( !isset($post_ID) || empty($post_ID) ){
		//% No existe POST_ID por lo que es una solicitud Nueva
		if( isset($_GET['campo_actuacion']) ){
			$campo_actuacion = $_GET['campo_actuacion'];
			$codigo_interno = generar_codigo_interno( 'btni' );
		}
		if( isset($_GET['debug']) ){
			$debug = $_GET['debug'];
		}
		// echo "<h1>Campo Actuacion: $campo_actuacion</h1>";
		if( isset( $debug ) && $debug == 'true'){
			buildDebugForm();
		}else{
			buildNuevaSolicitudForm( $campo_actuacion );
		}
	}else{
		//% Existe POST_ID. Cargamos los datos del POST correspondiente
		$post = get_full_post( array(
			'p' => $post_ID,
			'post_type' => 'solicitud',
			'posts_per_page' => 1
		) );

		if( isset($post) ){
			$urlParams = array();
			// echo "<br>POST:<pre>";
			// print_r($post);
			// echo "</pre>";

			$meta_data = $post->meta_data;
			// echo "<br>meta_data:<pre>";
			// print_r($meta_data);
			// echo "</pre>";
			$meta_data_keys = array_keys( $meta_data );
			// echo "<br>meta_data_keys:<pre>";
			// print_r($meta_data_keys);
			// echo "</pre>";

			// echo '<h1>'.$meta_data[ $meta_data_keys[9] ][0].'</h1>';

			$cont = 0;
			foreach( $meta_data as $param ){
				// echo "<br>Param<pre>";
				// print_r($param);
				// echo "</pre>";

				$urlParamKey = $meta_data_keys[$cont];
				$urlParamValue = $meta_data[ $urlParamKey ][0];

				// echo 'Key: '.$urlParamKey.'<br>';
				// echo 'Value: '.$urlParamValue.'<br>';
				if( empty($urlParamValue) ){
					continue;
				}
				$cat_campo_actuacion;
				$cat_subcampo_actuacion;
				switch($urlParamKey){
					case 'campo_actuacion':
						// echo '<br>++++++++++ campo-actuacion ++++++++++++<br>';
						$cat_campo_actuacion = findInCategories( $urlParamValue, $array_categorias );
						// echo "<br>Categoria:<pre>";
						// print_r($cat_campo_actuacion['subcats']);
						// echo "</pre>";
						if( $categorias && count($categorias) == 0 ){
							// echo "EFEEEE";
						}
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

			// echo "<br>urlParams:<pre>";
			// print_r($urlParams);
			// echo "</pre>";

			$url = '/solicitud-formulario?debug=false';

			foreach( $urlParams as $p ){
				$url = $url ."&". $p;
			}
			// echo 'URL:';
			// echo $url;
			echo "<script>window.location.href = '$url'</script>";
		}else{
			echo 'REDIRECT TO HOME WITH ERROR: "POST NO ENCONTRADO"';
			header("Location: /home?err=");
		}
	}
	
	function buildDebugForm(){
		//echo '<h1>DEBUG</h1>';
		// echo 'WPCF7_AUTOP: '.WPCF7_AUTOP;
		// echo do_shortcode('[contact-form-7 id="248" title="Formulario Prueba"]');
		echo do_shortcode('[contact-form-7 id="398" title="Formulario Sencillo"]');
		//  echo do_shortcode('[contact-form-7 id="209" title="Formulario Baja Tensión No Industrial"]');
	}

	function buildNuevaSolicitudForm( $campo_actuacion ){
		//echo "<h2>buildNuevaSolicitudForm( $campo_actuacion )</h2>";
		switch ( $campo_actuacion ){
			case "btni":
				// echo "<h3>case 'ibtni'</h3>";
				echo do_shortcode('[contact-form-7 id="209" title="Formulario Baja Tensión No Industrial"]');
				break;

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
		}
	}

	function buildSolicitudExistente( $post ){

	}

	// if( isset( $debug ) && $debug == 'true'){
	// echo generar_codigo_interno( 'btni' );
	// }
	// echo generar_codigo_interno( 'btni' );
		
	// $user = wp_get_current_user();
	// echo '<h1>User</h1><pre>';
	// echo print_r($user).'</pre>';

	// $user_id = get_current_user_id();
	// echo '<h1>User ID</h1><pre>';
	// echo $user_id .'</pre>';

	// $user_data = get_userdata( $user_id );
	// echo '<h1>User Data</h1><pre>';
	// echo var_dump($user_data) .'</pre>';

	$tipos_expediente = get_tipos_expediente();
	?>
	<script>
	
	let DatosInstalaciones = <?=json_encode($array_categorias) ?>;
	// console.log('DatosInstalaciones')
	// console.log(DatosInstalaciones)
	window.TiposExpediente = <?=json_encode($tipos_expediente) ?>

	jQuery('document').ready(()=>{
		jQuery('[name="codigo_interno"]').val("<?=$codigo_interno ?>")
	})
	
	</script>


	<?php
	get_the_content();
	?>

	<?php 
	if ( have_posts() ) : while ( have_posts() ) : the_post();
	the_content();
	endwhile; else : ?>
		<p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
	<?php endif; ?>

</main>
<?php get_footer(); ?>

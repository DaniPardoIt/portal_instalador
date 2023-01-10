
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
		$campo_actuacion = get_post_meta( $post_ID, "campo_actuacion" )[0];
		//error_log("\n-- Campo Actuacion: ".print_r($campo_actuacion, true));
   
		$form_html = selectFormBy_CampoActuacion($campo_actuacion);
		echo $form_html;
		echo "<script>jQuery('document').ready(function(){build_selector_and_functionality()})</script>";
	}

	function buildDebugForm(){
		//echo '<h1>DEBUG</h1>';
		// echo 'WPCF7_AUTOP: '.WPCF7_AUTOP;
		// echo do_shortcode('[contact-form-7 id="248" title="Formulario Prueba"]');
		echo do_shortcode('[contact-form-7 id="398" title="Formulario Sencillo"]');
		//  echo do_shortcode('[contact-form-7 id="209" title="Formulario Baja Tensión No Industrial"]');
	}

	function buildNuevaSolicitudForm( $campo_actuacion ){
		// echo "<h2>buildNuevaSolicitudForm( $campo_actuacion )</h2>";
		$form_html = selectFormBy_CampoActuacion( $campo_actuacion );
		echo $form_html;
		echo '<script>jQuery("document").ready(function (){build_selector_and_functionality()})</script>';
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

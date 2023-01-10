
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";
// Solicitudes Abiertas JS
function enqueue_solicitudes_abiertas_js() {
	wp_enqueue_script( 'solicitudes_abiertas-js', get_stylesheet_directory_uri().'/assets/js/solicitudes-abiertas.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_solicitudes_abiertas_js' );

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

		// $solicitudes_abiertas = get_posts( array(

		// ) );

		// $solicitudes_abiertas_query = new WP_Query(
		// 	array(
		// 		'post_type' => 'solicitud'
		// 	)
		// );

		// function posts_limit_fn($limit, $query){
		// 		return 'LIMIT 0, 100';
		// }
		// add_filter('posts_limit', 'posts_limit_fn',10, 2);

		// $solicitudes_abiertas = get_full_posts( array(
		// 		'post_type' => 'solicitud',
		// 		'meta_query' => array(
		// 			array(
		// 				'estado-solicitud' => 'abierta'
		// 			)
		// 		),
		// 		'posts_per_page' => 100
		// 	)
		// );

		// $solicitudes_abiertas = post_to_JSON( $solicitudes_abiertas );

		// // $solicitudes_abiertas_query = new WP_Query(
		// // 	array(
		// // 		'post_type' => 'solicitud',
		// // 		'meta_query' => array(
		// // 			array(
		// // 				'estado-solicitud' => 'abierta'
		// // 			)
		// // 		),
		// // 		'posts_per_page' => 100
		// // 	)
		// // );
		
		// // $solicitudes_abiertas = $solicitudes_abiertas_query->posts;

		// // foreach( $solicitudes_abiertas as $sa ){
		// // 	$meta_data = get_post_meta( $sa->ID );
		// // 	$sa->meta_data = $meta_data;
		// // }
		
		?>

		<div class="filter-container">
			<div class="filter-wrapper">
				<div class="row" style="align-items: center;">
					<div class="filter-group">
						<label for="codigo_interno">Código Interno</label>
						<div class="input-container">
							<input name="codigo_interno">
						</div>
						<div class="tag-name"></div>
					</div>
					<div class="filter-group">
						<label for="estado_solicitud">Estado Solicitud</label>
						<div class="input-container">
							<select name="estado_solicitud">
								<option value=""> </option>
								<option value="creacion">
									Creación
								</option>
								<option value="revision_oca">
									Revisión OCA
								</option>
								<option value="error_exim">
									Error OCA
								</option>
								<option value="error_exim">
									Error EXIM
								</option>
								<option value="enviada">
									Enviada
								</option>
							</select>
						</div>
						<div class="tag-name"></div>
					</div>
					<div class="filter-group">
						<label for="numero_documento_instalador">NIF Instalador</label>
						<div class="input-container">
							<input name="numero_documento_instalador">
						</div>
						<div class="tag-name"></div>
					</div>
					<div class="filter-group">
						<label for="numero_documento_empresa_instaladora">NIF Empresa Instaladora</label>
						<div class="input-container">
							<input name="numero_documento_empresa_instaladora">
						</div>
						<div class="tag-name"></div>
					</div>
					<div class="filter-group">
						<label for="fecha_desde">Fecha Desde</label>
						<div class="input-container">
							<input type="date" name="fecha_desde">
						</div>
						<div class="tag-name"></div>
					</div>
					<div class="filter-group">
						<label for="fecha_hasta">Fecha Hasta</label>
						<div class="input-container">
							<input type="date" name="fecha_hasta">
						</div>
						<div class="tag-name"></div>
					</div>
				</div>
				<button id="search_button" class="btn-outline btn-azul"><i class="fa-solid fa-magnifying-glass"></i> Buscar</button>
			</div>
		</div>

		</div>

		<div id="solicitudes-abiertas" class="lista-solicitudes-container">
			<div class="lista-solicitudes-wrapper">
				<div class="solicitud-header solicitud-item">
					<div class="solicitud-item-group fecha_creacion">Fecha Creación</div>
					<div class="solicitud-item-group codigo_interno">Código Interno</div>
					<div class="solicitud-item-group estado_solicitud">Estado Solicitud</div>
					<div class="solicitud-item-group campo_actuacion">Campo Actuación</div>
					<div class="solicitud-item-group tipo_instalacion">Tipo Instalación</div>
					<div class="solicitud-item-group subtipo_instalacion">Subtipo Instalación</div>
					<!-- <div class="solicitud-item-group numero_expediente">Nº Expediente</div> -->
					<div class="solicitud-item-group botones_accion">Acciones</div>
				</div>
			</div>
			<div class="list-navigation-wrapper">

			</div>
		</div>


		<script>
		window.datosInstalaciones = <?=json_encode($array_categorias) ?>;
		</script>
	</main>
<?php get_footer(); ?>
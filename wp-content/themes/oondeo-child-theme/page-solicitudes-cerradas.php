
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";
// Solicitudes Cerradas JS
function enqueue_solicitudes_cerradas_js() {
	wp_enqueue_script( 'solicitudes_cerradas-js', get_stylesheet_directory_uri().'/assets/js/solicitudes-cerradas.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_solicitudes_cerradas_js' );

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
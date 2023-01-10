
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";

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

		
		$solicitudes_abiertas_query = new WP_Query(
			array(
				'post_type' => 'solicitud',
				'meta_query' => array(
					array(
						'estado-solicitud' => 'abierta'
					)
				)
			)
		);
		
		$solicitudes_abiertas = $solicitudes_abiertas_query->posts;

		foreach( $solicitudes_abiertas as $sa ){
			// $meta_data = new WP_Query(
			// 	array(
			// 		'meta_query' => array(
			// 			array(
			// 				'post_id' => 391
			// 			)
			// 		)
			// 	)
			// );
			$meta_data = get_post_meta( $sa->ID );
			// echo "<br>POST::<pre>";
			// print_r($sa);
			// echo "</pre>";
			// echo "<br>META::<pre>";
			// print_r($meta_data);
			// echo "</pre>";
			$sa->meta_data = $meta_data;
			
			// echo "<br>POST::<pre>";
			// print_r($sa);
			// echo "</pre>";
		}

		// echo "<pre>";
		// print_r($solicitudes_abiertas);
		// echo "</pre>";
		?>

		<div id="solicitudes-abiertas" class="lista-solicitudes-container">
			<div class="lista-solicitudes-wrapper">
				<div class="solicitud-header solicitud-item">
						<div class="solicitud-item-group campo_actuacion">Campo Actuación</div>
						<div class="solicitud-item-group tipo_instalacion">Tipo Instalación</div>
						<div class="solicitud-item-group subtipo_instalacion">Subtipo Instalación</div>
						<div class="solicitud-item-group codigo_interno">Código Interno</div>
						<div class="solicitud-item-group numero_expediente">Nº Expediente</div>
						<div class="solicitud-item-group fecha_creacion">Fecha Creación</div>
						<div class="solicitud-item-group fecha_modificacion">Fecha Modificación</div>
						<div class="solicitud-item-group estado_solicitud">Estado Solicitud</div>
						<div class="solicitud-item-group botones_accion">Acciones</div>
					</div>
				<?php
				foreach( $solicitudes_abiertas as $sa ){
					?>
					<div id="solicitud-<?=$sa->ID ?>" class="solicitud-item">
						<div class="solicitud-item-group campo-actuacion">
							<?php if( isset( $sa->meta_data["campo_actuacion"][0] )){
								echo $sa->meta_data["campo_actuacion"][0];
							} ?>
						</div>
						<div class="solicitud-item-group tipo_instalacion">
								<?php if( isset( $sa->meta_data["tipo_instalacion"][0] )){
									echo $sa->meta_data["tipo_instalacion"][0];
								} ?>
						</div>
						<div class="solicitud-item-group subtipo_instalacion">
								<?php if( isset( $sa->meta_data["subtipo_instalacion"][0] )){
									echo $sa->meta_data["subtipo_instalacion"][0];
								} ?>
						</div>
						<div class="solicitud-item-group codigo_interno">
								<?php if( isset( $sa->meta_data["codigo_interno"][0] )){
									echo $sa->meta_data["codigo_interno"][0];
								} ?>
						</div>
						<div class="solicitud-item-group numero_expediente">
								<?php if( isset( $sa->meta_data["numero_expediente"][0] )){
									echo $sa->meta_data["numero_expediente"][0];
								} ?>
						</div>
						<div class="solicitud-item-group fecha_creacion">
								<?php if( isset( $sa->meta_data["fecha_creacion"][0] )){
									echo $sa->meta_data["fecha_creacion"][0];
								} ?>
						</div>
						<div class="solicitud-item-group fecha_modificacion">
								<?php if( isset( $sa->meta_data["fecha_modificacion"][0] )){
									echo $sa->meta_data["fecha_modificacion"][0];
								} ?>
						</div>
						<div class="solicitud-item-group estado_solicitud">
								<?php if( isset( $sa->meta_data["estado_solicitud"][0] )){
									echo $sa->meta_data["estado_solicitud"][0];
								} ?>
						</div>
						<div class="solicitud-item-group botones-accion">
							<button class="btn ver-btn"><i class="fa-solid fa-eye"></i></button>
							<button class="btn editar-btn" onclick="clickEditarBtn(this)"><i class="fa-solid fa-pencil"></i></button>
							<button class="btn copiar-btn"><i class="fa-regular fa-copy"></i></button>
						</div>
					</div>
					<?php
				}
				?>
			</div>
		</div>


		<script>
		
		let DatosInstalaciones = <?=json_encode($array_categorias) ?>;
		console.log('DatosInstalaciones')
		console.log(DatosInstalaciones)
		
		function clickEditarBtn(btn){
			
			let parent = btn;
			while( ! parent.classList.contains('solicitud-item')){
				parent = parent.parentElement;
			}
			let post_ID = parent.id.replace('solicitud-','')
			console.log(btn)
			console.log(parent)
			console.log(post_ID)

			window.location.href = `/solicitud-formulario?post_ID=${post_ID}`
		}
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
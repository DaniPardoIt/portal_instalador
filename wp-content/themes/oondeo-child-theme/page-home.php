
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";


// Custom JS
function enqueue_home() {
	wp_enqueue_script( 'home', get_stylesheet_directory_uri().'/assets/js/home.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_home' );

get_header();
	?>
	<main>
		<h1>
			<?php the_title(); ?>
		</h1>
		<div class="solicitudes-selector-container">
			<div class="solicitudes-selector-wrapper">
				<div id="solicitudes-abiertas-container" class="solicitudes-selector-button btn-outline btn-success" onclick="window.location.href='/solicitudes-abiertas'">
					<div class="solicitud-icon">
						<i class="fa-solid fa-folder-open"></i>
					</div>
					<div class="solicitud-text">
						<span class="numero-solicitudes"> <?php echo get_solicitudes_abiertas_count(); ?> </span>
						<span class="texto">Solicitudes Abiertas</span>
					</div>
				</div>
				<div id="solicitudes-cerradas-container" class="solicitudes-selector-button btn-outline btn-error" onclick="window.location.href='/solicitudes-cerradas'">
					<div class="solicitud-icon">
						<i class="fa-solid fa-folder-closed"></i>
					</div>
					<div class="solicitud-text">
						<span class="numero-solicitudes"> <?php echo get_solicitudes_cerradas_count(); ?> </span>
						<span class="texto">Solicitudes Cerradas</span>
					</div>
				</div>
				<div id="nueva-solicitud-container" class="solicitudes-selector-button btn-outline btn-azul" onclick="window.location.href='/nueva-solicitud'" >
					<div class="solicitud-icon">
						<i class="fa-solid fa-folder-plus"></i>
					</div>
					<div class="solicitud-text">
						<span class="texto">Nueva Solicitud</span>
					</div>
				</div>
			<?php
			if( apply_filters( 'check_solicitud_permission', 'edit_users' ) ){
				?>
				<div id="nueva-solicitud-container" class="solicitudes-selector-button btn-outline" onclick="window.location.href='/configuracion-usuarios'">
					<div class="solicitud-icon">
						<i class="fa-solid fa-users-gear"></i>
					</div>
					<div class="solicitud-text">
						<span class="texto">Configuración Usuarios</span>
					</div>
				</div>
				<?php
			}
			?>
			</div>
		</div>

	</main>
<?php get_footer(); ?>

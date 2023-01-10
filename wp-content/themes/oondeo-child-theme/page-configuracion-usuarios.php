<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";
include_once WP_PLUGIN_DIR . "aa-oondeo-functions/UserController/UserData.php";

?>
<?php
// Custom JS
function enqueue_formulario_js() {
	wp_enqueue_script( 'formulario-js', get_stylesheet_directory_uri().'/assets/js/configuracion-usuarios.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_formulario_js' );
get_header();
?>
<main>
	
	<div class="config-users-container">
		<div class="config-users-wrapper">
			<h1>
				<?php the_title(); ?>
			</h1>
			<div class="grid-2-col mt-30">
				<div class="user-type-btn selected" id="tecnico" onclick='change_user_list_wrapper(this.id)'>
					Técnicos
				</div>
				<div class="user-type-btn" id="inspector" onclick='change_user_list_wrapper(this.id)'>
					Inspectores
				</div>
			</div>
			<div class="grid-1-col">
				<div class="user-list-container">
					
				</div>
			</div>
		</div>
	</div>

	<?php
	$users = get_simplified_users( array(
		'role__in' 					=> 	array( 'inspector', 'tecnico' ),
		'role__not_in'			=>	array( 'administrator', 'administrativo' )
	) );
	?>
	<script>window.users = <?php echo $users ?></script>
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

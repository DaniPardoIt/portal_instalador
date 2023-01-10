
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";

// Custom JS
function enqueue_nueva_solicitud() {
	wp_enqueue_script( 'nueva_solicitud', get_stylesheet_directory_uri().'/assets/js/nueva-solicitud.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_nueva_solicitud' );

get_header();
	?>
	<main>
		<h1>
			<?php the_title(); ?>
		</h1>
		<?php
		get_the_content();
		?>

		<?php 
		if ( have_posts() ) : while ( have_posts() ) : the_post();
		the_content();
		endwhile; else : ?>
			<p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
		<?php endif; ?>

		<?php
		$array_categorias = get_all_term_hierarchy_data_formatted( array(
			'taxonomy' => 'categoria',
			'hide_empty' => false,
			'orderby' =>	'term_id',
			'parent'	=> 0
		) );

		$tipos_expediente = get_tipos_expediente();

		// echo '<pre>';
		// print_r($array_categorias);
		// echo '</pre>';
		?>
		<script>
			const DatosInstalaciones = <?=json_encode($array_categorias) ?>;
			const TiposExpediente = <?=json_encode($tipos_expediente) ?>
		</script>
	</main>
<?php get_footer(); ?>

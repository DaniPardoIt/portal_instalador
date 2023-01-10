
<?php

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

	</main>
<?php get_footer(); ?>
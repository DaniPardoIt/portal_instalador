

<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";
include_once WP_PLUGIN_DIR . "aa-oondeo-functions/UserController/UserData.php";
global $user;

if( !user_can( $user, 'edit_users') ){
	header("Location: /home");
	exit;
}

// Usuario JS
function enqueue_page_usuario_js() {
	wp_enqueue_script( 'page_usuario', get_stylesheet_directory_uri().'/assets/js/page-usuario.js' );
	wp_enqueue_script( 'page_configuracion_usuarios', get_stylesheet_directory_uri().'/assets/js/configuracion-usuarios.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_page_usuario_js' );


get_header();
	?>
	<main>
		<h1>
			<?php
			switch( $action ){
				case "new":
					echo "Nuevo Usuario";
					break;

				case "modify":
					echo "Usuario: <b>$username</b>";
					break;

				default:
					the_title();
					break;
			}
			?>
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
		$action = '';

		if( isset( $_GET['username'] ) ){
			$username = $_GET['username'];
			$action = "modify";

			$wp_user = get_user_by('login', $username);
			$user = get_full_user_oondeo( $wp_user );
			$simplified_user = get_simplified_user( $wp_user );

			$user_form_data = array(
				'user_id'		=>	null,
				'user_type'		=>	$user['roles'][0],
				'tipo_documento'		=>	$user['meta_data']['tipo_documento'],
				'first_name'		=>	$user['meta_data']['first_name'],
				'last_name'		=>	$user['meta_data']['last_name'],
				'user_email'		=>	$user['data']['user_email'],
				'tel_fijo'		=>	$user['meta_data']['first_name'],
				'tel_movil'		=>	'',
			);
			?>

			<script>
				window.user = <?=json_encode($user) ?>;
				window.user.form_data = <?php echo $user_form_data; ?>
			</script>

			<?php
		}else if( isset( $_GET['type'] ) ){
			$user_type = $_GET['type'];
			$action = "new";
		}

		?>
	</main>
<?php get_footer(); ?>

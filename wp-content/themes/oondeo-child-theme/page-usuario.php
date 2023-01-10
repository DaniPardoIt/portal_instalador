
<?php

use Tribe\Models\Post_Types\Nothing;

include_once "oondeo.php";
include_once WP_PLUGIN_DIR . "aa-oondeo-functions/UserController/UserData.php";
global $user;

if( !user_can( $user, 'edit_users') ){
	header("Location: /home");
	exit;
}

// error_log('page-usuario.php');
// echo '<h1>PAGEEEEE</h1>';
// echo print_r( $user, true );


// Usuario JS
function enqueue_page_usuario_js() {
	wp_enqueue_script( 'page_usuario', get_stylesheet_directory_uri().'/assets/js/page-usuario.js' );
	wp_enqueue_script( 'page_configuracion_usuarios', get_stylesheet_directory_uri().'/assets/js/configuracion-usuarios.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_page_usuario_js' );


$action = '';

if( isset( $_GET['username'] ) ){
	$username = $_GET['username'];
	$action = "modify";

	$wp_user = get_user_by('login', $username);
	$full_user = get_full_user_oondeo( $wp_user );
	$simplified_user = get_simplified_user( $wp_user );

	$user_form_data = array(
		'user_id'						=>	true,
		'user_type'					=>	$full_user['roles'][0],
		'tipo_documento'		=>	$full_user['meta_data']['tipo_documento'],
		'user_login'				=>	$full_user['data']['user_login'],
		'first_name'				=>	$full_user['meta_data']['first_name'],
		'last_name'					=>	$full_user['meta_data']['last_name'],
		'user_email'				=>	$full_user['data']['user_email'],
		'tel_fijo'					=>	$full_user['meta_data']['tel_fijo'],
		'tel_movil'					=>	$full_user['meta_data']['tel_movil'],
		'street_1'					=>	$full_user['meta_data']['street_1'],
		'state'							=>	$full_user['meta_data']['state'],
		'city'							=>	$full_user['meta_data']['city'],
		'postal_code'				=>	$full_user['meta_data']['postal_code'],
		'form_action'				=>	"modify"
	);
}else if( isset( $_GET['type'] ) ){
	$user_type = $_GET['type'];
	if( $user_type != 'inspector' ){
		$user_type = 'tecnico';
	}
	$action = "create";

	$wp_user = new WP_User();
	$user = get_full_user_oondeo( $wp_user );

	$user_form_data = array(
		'user_id'						=>	false,
		'user_type'					=>	$user_type,
		'form_action'				=>	"create"
	);

}

get_header();
	?>
	<main>
		<h1>
			<?php
			switch( $action ){
				case "create":
					echo "Nuevo Usuario ($user_type)";
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
	//Scripts
	switch( $action ){
		case "create":
			?>

			<?php
			break;

		case "modify":
			?>
			<script>
				window.user = <?=json_encode($simplified_user) ?>; //Replace por $user_simplified
				window.user.form_data = <?php echo json_encode($user_form_data); ?>

				jQuery('document').ready( function() {
					fill_input_fields( <?php echo json_encode(array_keys($user_form_data)) ?> );
				} )
			</script>
			<?php
			break;

		case "remove":
			break;
	}

?>
	</main>
<?php get_footer(); ?>

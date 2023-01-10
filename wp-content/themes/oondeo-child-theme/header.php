

<?php
/**
 * Header
 *
 * @package WordPress
 * @subpackage Visual Composer Starter
 * @since Visual Composer Starter 1.0
 */

global $user;
// error_log('header.php');
// echo '<h1>HEADEEEER</h1>';
// echo print_r($user, true);
if( !isset( $user ) || empty($user) || $user->ID == 0 ){
	// echo 'USER EMPTY';
	$user = wp_get_current_user();
	// echo print_r($user, true);
}

?>
	<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head() ?>

	</head>
<body <?php body_class(); ?>>
<?php if ( function_exists( 'wp_body_open' ) ) {
	wp_body_open();
} ?>
	<header>
		<div class="header-container">
			<div class="header-wrapper">
				<div class="logo-container">
					<?php the_custom_logo(); ?>
				</div>
				<nav class="menu-container">
					<a class="btn-outline" href="/home">
						<i class="fa-solid fa-house"></i>
						<span>Inicio</span>
					</a>
					<a class="btn-outline" href="/solicitudes-abiertas">
						<i class="fa-solid fa-folder-open"></i>
						<span>Solicitudes Abiertas</span>
					</a>
					<a class="btn-outline" href="/solicitudes-cerradas">
						<i class="fa-solid fa-folder-closed"></i>
						<span>Solicitudes Cerradas</span>
					</a>
					<a class="btn-outline" href="/nueva-solicitud">
						<i class="fa-solid fa-folder-plus"></i>
						<span>Nueva Solicitud</span>
					</a>
					<?php
					if( in_array( 'administrativo', (array) $user->roles )) {
						?>
						<a class="btn-outline" href="/configuracion-usuarios">
							<i class="fa-solid fa-users-gear"></i>
							<span>Configuración Usuarios</span> 
						</a>
						<?php
					}
					?>
					<a id="logout-button" class="btn-outline btn-error">
						<span>Salir</span>
						<i class="fa-solid fa-right-from-bracket"></i>
					</a>
				</nav>
				<div class="button-container">
					
				</div>
			</div>
		</div>
	</header>
	<?php 
		// echo "<h1>".$_SERVER['REQUEST_URI']."</h1>";
		// echo "<h2>User ID: ".get_current_user_id()."</h2>";
		if( get_current_user_id() == 0 ){
			if( ! str_contains( $_SERVER['REQUEST_URI'], '/wp-login' ) && ! str_contains( $_SERVER['REQUEST_URI'], '/registro' ) ){
				$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/wp-login.php";
				//echo "<h2>Actual Link: ".$actual_link."</h2>";
				echo "<script>window.location.href = '".$actual_link."'</script>";
			}
		}

		sha1('Hola')
	?>



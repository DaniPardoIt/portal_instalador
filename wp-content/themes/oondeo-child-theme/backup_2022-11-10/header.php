

<?php
/**
 * Header
 *
 * @package WordPress
 * @subpackage Visual Composer Starter
 * @since Visual Composer Starter 1.0
 */

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
					<a href="/home">Inicio</a>
					<a href="/solicitudes-abiertas">Solicitudes Abiertas</a>
					<a href="/solicitudes-cerradas">Solicitudes Cerradas</a>
					<a href="/nueva-solicitud">Nueva Solicitud</a>
				</nav>
				<div class="button-container">
					<button id="logout-button" class="boton">
						<i class="fa-solid fa-right-from-bracket"></i>
					</button>
				</div>
			</div>
		</div>
	</header>
	<?php 
		// echo "<h1>".$_SERVER['REQUEST_URI']."</h1>";
		// echo "<h2>User ID: ".get_current_user_id()."</h2>";
		if( get_current_user_id() == 0 ){
			if( ! str_contains( $_SERVER['REQUEST_URI'], '/wp-login' ) ){
				$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/wp-login.php";
				//echo "<h2>Actual Link: ".$actual_link."</h2>";
				echo "<script>window.location.href = '".$actual_link."'</script>";
			}
		}

		sha1('Hola')
	?>



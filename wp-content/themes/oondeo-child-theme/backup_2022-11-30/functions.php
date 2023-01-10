<?php

// Parent Styles
add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
	wp_enqueue_style( 'parent-style', get_template_directory_uri().'/style.css' );
}

// Child Styles
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles', 11 );
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_uri() );
}
// Oondeo JS
function enqueue_oondeo_js() {
	wp_enqueue_script( 'oondeo-js', get_stylesheet_directory_uri().'/assets/js/oondeo.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_oondeo_js' );
// Custom JS
function enqueue_custom_js() {
	wp_enqueue_script( 'custom-js', get_stylesheet_directory_uri().'/assets/js/custom.js' );
}
add_action( 'wp_enqueue_scripts', 'enqueue_custom_js' );

// Font Awesome 6
function enqueue_font_awesome_6() {
	?>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<?php
}
add_action( 'wp_head', 'enqueue_font_awesome_6' );

function enqueue_font_awesome_6_enqueue() {
    wp_enqueue_style( 'font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');
}
add_action( 'wp_enqueue_scripts', 'enqueue_font_awesome_6_enqueue' );

/* Eliminar <p> y <br/> de Contact Form 7 */
remove_filter('the_content', 'wpautop');
add_filter( 'wpcf7_autop_or_not', '__return_false' );


/* Set Post Status = Publish en los Post de tipo Solicitud */
add_filter( 'cf7_2_post_status_solicitud', 'cf7_2_post_status_solicitud_publish');
function cf7_2_post_status_solicitud_publish($post_status="publish"){
	return "publish";
}

//Dump del cuerpo de cf7 en el error.log
add_action( 'wpcf7_before_send_mail', 'my_process_cf7_form_data' );
function my_process_cf7_form_data() {

    $submission = WPCF7_Submission::get_instance();
        if ( $submission ) {
            $posted_data = $submission->get_posted_data();    
    }

    ob_start();
    var_dump($posted_data);
    // error_log(ob_get_clean());
    file_put_contents( 'cf7_before_send.txt', ob_get_clean() );
}

//Redirect Login to Home
function custom_login_redirect() {
    return 'home';
}
add_filter('login_redirect', 'custom_login_redirect');


add_filter( 'wpcf7_validate', 'skip_validation_for_hidden_fields', 2, 2 );

/**
 * Remove validation requirements for fields that are hidden at the time of form submission.
 * Required/invalid fields should never trigger validation errors if they are inside a hidden group during submission.
 * Called using add_filter( 'wpcf7_validate', array($this, 'skip_validation_for_hidden_fields'), 2, 2 );
 * where the priority of 2 causes this to kill any validations with a priority higher than 2
 * 
 * NOTE: CF7 is weirdly designed when it comes to validating a form with files.
 *       Only the non-file fields are considered during the wpcf7_validate filter.
 *       When validation passes for all fields (except the file fields), the files fields are validated individually.
 *       ( see skip_validation_for_hidden_file_field )
 *
 * @param $result
 * @param $tag
 *
 * @return mixed
 */

function skip_validation_for_hidden_fields($result, $tags, $args = []) {
    // error_log($_POST['save_button']);
    // error_log(print_r($result));
    
    // error_log('save_button value: '.$_POST['save_button']);
    
    file_put_contents( 'cf7_skip_validation.txt', "RESULT: \n");
    file_put_contents( 'cf7_skip_validation.txt', print_r($result, TRUE), FILE_APPEND);
    file_put_contents( 'cf7_skip_validation.txt', "\nTags: \n", FILE_APPEND);
    file_put_contents( 'cf7_skip_validation.txt', print_r($tags, TRUE), FILE_APPEND);

    if($_POST['save_button'] == "1"){
        // file_put_contents( 'debug_save.txt', "save_button == 1: value: ".$_POST['save_button'], FILE_APPEND);
        $return_result = new WPCF7_Validation(); //Se crea un nuevo objeto de validacion así se devuelve que está todo ok
    }else{
        // file_put_contents( 'debug_save.txt', "save_button != 1:", FILE_APPEND);
        $return_result = $result;
    }

    // file_put_contents( 'debug_save.txt', "save_button value:".$_POST['save_button']."\n", FILE_APPEND);
    // file_put_contents( 'debug_save.txt', print_r($return_result, TRUE), FILE_APPEND);
    // file_put_contents( 'debug_save.txt', print_r($tags, TRUE), FILE_APPEND);
    
    return apply_filters('wpcf7cf_validate', $return_result, $tags);
}

add_filter( 'wpcf7_validate_file*', 'custom_file_confirmation_validation_filter', 20, 2 );
  
function custom_file_confirmation_validation_filter( $result, $tag ) {
    // file_put_contents( 'debug_save.txt', "VALIDACION FILE; ", FILE_APPEND);
    // file_put_contents( 'debug_save.txt', "save_button == 1: value: ".$_POST['save_button'], FILE_APPEND);
    // file_put_contents( 'debug_save.txt', print_r($tags, TRUE), FILE_APPEND);
    // file_put_contents( 'debug_save.txt', print_r($result, TRUE), FILE_APPEND);
    file_put_contents( 'cf7_custom_file_validation.txt', "RESULT: ");
    file_put_contents( 'cf7_custom_file_validation.txt', print_r($result, TRUE), FILE_APPEND);
  
    if( $_POST['save_button'] == "1" ){
        $return_result = new WPCF7_Validation();
        // file_put_contents( 'debug_save.txt', "--------- save_button == 1 ---------", FILE_APPEND);
        // file_put_contents( 'debug_save.txt', print_r($return_result, TRUE), FILE_APPEND);
    }else{
        $return_result = $result;
    }
    return $return_result;
}

// add_action('wpcf7_mail_sent', 'after_sent_mail'); 
// function after_sent_mail($wpcf7){

//     header('Location: https://portal-instalador.revisa.web.oondeo.es/home/');
//     exit;

// } 

include_once "oondeo.php";

// $post881 = get_full_post( array(
//     'p' => 881,
//     'post_type' => 'solicitud',
//     'posts_per_page' => 1
// ) );

// $post881_json = post_to_JSON( $post881 );
// document_info( 'cf7_post881.txt', 'POST 881', $post881 );
// document_info( 'cf7_post881_JSON.txt', 'POST 881 JSON', $post881_json );

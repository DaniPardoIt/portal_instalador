<?php
/*
Plugin Name: CF7 Oondeo Fields
Version: 1.0.0
Plugin URI: https://www.oondeo.es/
Description: Custom CF7 Fields.
Author: Oondeo
Author URI: https://www.oondeo.es
*/


//Custom Oondeo CF7 Field: Repeater
function enqueue_oondeo_cf7_custom_fields() {
    $js_path = plugin_dir_url( __FILE__ ).'assets/js/oondeo_cf7_custom_fields.js';

    $info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
    document_info( $info_path, "path:", $js_path );

    wp_enqueue_script( 'cf7-oondeo-custom-fields', $js_path );
}
add_action( 'wp_enqueue_scripts', 'enqueue_oondeo_cf7_custom_fields' );



/* Add WPCF7 Custom Repeater Oondeo */
add_action( 'wpcf7_init', 'custom_repeater_oondeo' );
function custom_repeater_oondeo() {
    wpcf7_add_form_tag( 'repeateroondeo', 'custom_repeater_oondeo_handler', array( 'name-attr' => true ) );
}

function custom_repeater_oondeo_handler( $tag ){
    $info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
    document_info( $info_path, 'tag:', $tag);
    // document_info( $info_path, "options:", $tag->options, true);
    // document_info( $info_path, "content:", $tag->content, true);
    // document_info( $info_path, "name:", $tag->name, true);
    // document_info( $info_path, "path:", plugin_dir_url( __FILE__ ).'assets/js/repeater.js', true);

    $options = [];
    $i = 0;
    foreach( $tag->options as $opt ){
        if( !str_contains($opt, ':') ){
            $options[$opt] = $tag->values[$i];
            $i++;
            continue;
        }
        $explode = explode(':', $opt);
        $options[$explode[0]] = $explode[1];
    }
    
    document_info( $info_path, "options:", $options, true);

    // return "<input id='tasas_json' name='tasas_json' type='hidden' value='$val' />";

    // $data = array(
    //     array(
    //         "type"          => 'text',
    //         "name"          => 'justificante',
    //         "required"      => false,
    //         "id"            => '',
    //         "class"         => '',
    //     ),
    //     array(
    //         "type"          => 'number',
    //         "name"          => 'tasa',
    //         "required"      => false,
    //         "id"            => '',
    //         "class"         => '',
    //     ),
    //     array(
    //         "type"          => 'text',
    //         "name"          => 'Atributo Dos',
    //         "required"      => false,
    //         "id"            => '',
    //         "class"         => '',
    //     ),
    //     array(
    //         "type"          => 'text',
    //         "name"          => 'Atributo Tres',
    //         "required"      => false,
    //         "id"            => '',
    //         "class"         => '',
    //     )
    // );
    // $json = json_encode( $data );

    // $ret = <<<EOT
    // <script>jQuery('document').load(function(){
    //     build_html_repeater('$json')
    // })</script>
    // EOT;

    // return $ret;

    $name = $tag->name;

    $html = <<<EOT
        <div class="repeater-container" id="$name">
            <h3>{$options['title']}</h3>
            <input type="hidden" name="$name"/ class="repeateroondeo_main">
            <div class="repeater-wrapper grid-1-col gap-10">
            </div>
            <button id="add_repeater_$name" class="btn btn-success">{$options['addButtonText']}</button>
        </div>
        <script>
        jQuery('document').ready( function(){
            jQuery('#add_repeater_$name').click( function(evt){
                evt.preventDefault();
                create_cf7_oondeo_repeater('$name')
             } )
            if( !window.cf7_oondeo_fields ){
                window.cf7_oondeo_fields = [];
            }
            if( !window.cf7_oondeo_fields.repeateroondeo ){
                window.cf7_oondeo_fields.repeateroondeo = []
            }
            window.cf7_oondeo_fields.repeateroondeo.$name = {
                'id': `$name`,
                'content': `{$tag->content}`,
                'itemTitle': `{$options['itemTitle']}`
            }
        } )
        </script>
    EOT;

    //Onsave se deben borrar todos los inputs excepto el main (Borrar todos los hijos de repeater-wrapper)

    return $html;
}

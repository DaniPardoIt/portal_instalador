<?php

/**
 * Plugin Name: _disable_Oondeo ERP
 * Description: An Open Source ERP Solution for WordPress. Built-in HR, CRM and Accounting system for WordPress
 * Plugin URI: https://www.oondeo.es    
 * Author: Oondeo
 * Author URI: https://www.oondeo.es
 * Version: 0.0.1
 * License: GPL2
 * Text Domain: erp
 * Domain Path: /i18n/languages/
 *
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * **********************************************************************
 */

// don't call the file directly
if (!defined('ABSPATH')) {
    exit;
}


// do_action( 'erp_people_created', $people->id, $people, $people_type );
// add_action('erp_people_created', 'oondeo_erp_people_created', 10, 3);
// function oondeo_erp_people_created($people_id, $people, $people_type)
// {
//     // $info_path = __DIR__.'/'.basename(__FILE__, '.php').'->'.__FUNCTION__.'.txt';
//     document_info(
//         "/tmp/erp.log",
//         "PEOPLE: ",
//         $people_id,
//         true
//     );
//     document_info(
//         "/tmp/erp.log",
//         "PEOPLE: ",
//         $people,
//         true
//     );
//     document_info("/tmp/erp.log", "PEOPLE: ", $people_type, true);

//     if (!isset($people)) return;
//     $user_id = $people->user_id;
//     if (!isset($user_id)) return;
//     $user = get_user_by('id', $user_id);
//     if (!isset($user)) return;
//     $user_meta = get_user_meta($user_id);
//     document_info(
//         "/tmp/erp.log",
//         "USER: ",
//         $user,
//         true
//     );
//     document_info("/tmp/erp.log", "USER META: ", $user_meta, true);
//     // update_post_meta($people->ID,'',$user_meta->tel_movil);
//     // update_post_meta($people->ID,'',$user_meta->tel_fijo);
//     // update_post_meta($people->ID,'',$user_meta->tel_movil);
//     // update_post_meta($people->ID, '', $user_meta->tel_movil);
//     $people->update([
//         'phone' => $user_meta->tel_fijo,
//         'mobile' => $user_meta->tel_movil,
//         'notes' => "NIF/CIF: " . $user->user_login,
//         'street_1' => $user_meta->direccion,
//     ]);
// }

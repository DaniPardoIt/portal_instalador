<?php

if( is_user_logged_in() ){
	header("Location: /home");
	die();
}else{
	header("Location: /login");
	die();
}



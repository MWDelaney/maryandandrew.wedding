<?php

namespace App;

use Sober\Controller\Controller;

class App extends Controller
{
    public function sitename()
    {
        return get_bloginfo('name');
    }


		/**
		 * Primary Nav Menu arguments
		 * @return array
		 */
    public function primarymenu() {
				$args = array(
					'theme_location'    => 'primary_navigation',
					'container'         => 'ul',
					'container_class'   => '',
					'depth'							=> 1,
					'container_id'      => 'menu-primary-container',
					'menu_class'        => 'navbar-nav nav-primary',
					'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
					'walker'            => new \wp_bootstrap4_navwalker()
				);
        return $args;
    }
}

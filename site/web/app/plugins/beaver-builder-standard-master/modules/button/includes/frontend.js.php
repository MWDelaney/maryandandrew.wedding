<?php if ( isset($settings->click_action) && $settings->click_action == 'lightbox' ) : ?>
jQuery(function(){
	jQuery('.fl-button-lightbox').magnificPopup({
		<?php if ($settings->lightbox_content_type == 'video') : ?>
		type: 'iframe',
		closeBtnInside: true,		
		mainClass: 'fl-button-lightbox-wrap',
		<?php endif; ?>
		
		<?php if ($settings->lightbox_content_type == 'html') : ?>
		type: 'inline',
		items: {
			src: '.fl-button-lightbox-content',
		}
		<?php endif; ?>		
	});
});
<?php endif; ?>
	

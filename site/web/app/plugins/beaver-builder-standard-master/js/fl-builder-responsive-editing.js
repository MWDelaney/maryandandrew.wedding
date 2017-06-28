( function( $ ) {

	/**
	 * Helper for handling responsive editing logic.
	 * 
	 * @since 1.9
	 * @class FLBuilderResponsiveEditing
	 */
	FLBuilderResponsiveEditing = {
		
		/**
		 * The current editing mode we're in. 
		 *
		 * @since 1.9
		 * @private
		 * @property {FLBuilderPreview} _mode
		 */
		_mode: 'default',
		
		/**
		 * Refreshes the media queries for the responsive preview
		 * if necessary.
		 *
		 * @since 1.9
		 * @method refreshPreview
		 */
		refreshPreview: function()
		{
			if ( $( '.fl-responsive-preview' ).length ) {
				FLBuilderForcedMediaQueries.update();
			}
		},
		
		/**
		 * Initializes responsive editing.
		 *
		 * @since 1.9
		 * @access private
		 * @method _init
		 */
		_init: function()
		{
			this._bind();
		},
		
		/**
		 * Bind events.
		 *
		 * @since 1.9
		 * @access private
		 * @method _bind
		 */
		_bind: function()
		{
			FLBuilder.addHook( 'settings-form-init', this._initSettingsForms );
			FLBuilder.addHook( 'settings-lightbox-closed', this._clearPreview );
			
			$( 'body' ).delegate( '.fl-field-responsive-toggle', 'click', this._settingToggleClicked );
		},
		
		/**
		 * Switches to either mobile, tablet or desktop editing.
		 *
		 * @since 1.9
		 * @access private
		 * @method _switchTo
		 */
		_switchTo: function( mode, callback )
		{
			var body        = $( 'body' ),
				content     = $( FLBuilder._contentClass ),
				preview     = $( '.fl-responsive-preview' ),
				mask        = $( '.fl-responsive-preview-mask' ),
				placeholder = $( '.fl-content-placeholder' ),
				breakpoints = FLBuilderConfig.breakpoints,
				width       = null;
				
			// Save the new mode.
			FLBuilderResponsiveEditing._mode = mode;
			
			// Setup the preview.
			if ( 'default' == mode ) {
				
				if ( 0 === placeholder.length ) {
					return;
				}
				
				placeholder.after( content );
				placeholder.remove();
				preview.remove();
				mask.remove();
			}
			else if ( 0 === preview.length ) {
				content.after( '<div class="fl-content-placeholder"></div>' );
				body.prepend( wp.template( 'fl-responsive-preview' )() );
				$( '.fl-responsive-preview' ).addClass( 'fl-preview-' + mode );
				$( '.fl-responsive-preview-content' ).append( content );
			}
			else {
				preview.removeClass( 'fl-preview-responsive fl-preview-medium' );
				preview.addClass( 'fl-preview-' + mode  );
			}
			
			// Set the content width and apply media queries.
			if ( 'responsive' == mode ) {
				width = breakpoints.responsive >= 320 ? 320 : breakpoints.responsive;
				content.width( width );
				FLBuilderForcedMediaQueries.update( width, callback );
			}
			else if ( 'medium' == mode ) {
				width = breakpoints.medium >= 769 ? 769 : breakpoints.medium;
				content.width( width );
				FLBuilderForcedMediaQueries.update( width, callback );
			}
			else {
				content.width( '' );
				FLBuilderForcedMediaQueries.update( 10000, callback );
			}
			
			// Set the content background color.
			this._setContentBackgroundColor();
			
			// Resize the layout.
			FLBuilder._resizeLayout();
			
			// Broadcast the switch.
			FLBuilder.triggerHook( 'responsive-editing-switched', mode );
		},
		
		/**
		 * Sets the background color for the builder content
		 * in a responsive preview.
		 *
		 * @since 1.9
		 * @access private
		 * @method _setContentBackgroundColor
		 */
		_setContentBackgroundColor: function()
		{
			var content     = $( FLBuilder._contentClass ),
				preview     = $( '.fl-responsive-preview' ),
				placeholder = $( '.fl-content-placeholder' ),
				parents     = placeholder.parents(),
				parent      = null,
				color       = '#fff',
				i           = 0;
				
			if ( 0 === preview.length ) {
				content.css( 'background-color', '' );
			}
			else {
				
				for( ; i < parents.length; i++ ) {
					
					color = parents.eq( i ).css( 'background-color' );
					
					if ( color != 'rgba(0, 0, 0, 0)' ) {
						break;
					}
				}
				
				content.css( 'background-color', color );
			}
		},
		
		/**
		 * Switches to the given mode and scrolls to an
		 * active node if one is present.
		 *
		 * @since 1.9
		 * @access private
		 * @method _switchToAndScroll
		 */
		_switchToAndScroll: function( mode )
		{
			var nodeId  = $( '.fl-builder-settings' ).data( 'node' ),
				element = undefined === nodeId ? undefined : $( '.fl-node-' + nodeId );
				
			FLBuilderResponsiveEditing._switchTo( mode, function() {
				
				if ( undefined !== element && element ) {
					
					setTimeout( function(){
						
						var win     = $( window ),
							content = $( '.fl-responsive-preview-content' );
						
						if ( ! content.length || win.height() < content.height() ) {
							$( 'html, body' ).animate( {
								scrollTop: element.offset().top - 100
							}, 250 );
						}
						else {
							scrollTo( 0, 0 );
						}
						
					}, 250 );
				}
			} );
		},
		
		/**
		 * Clears the responsive editing preview and reverts
		 * to the default view.
		 *
		 * @since 1.9
		 * @access private
		 * @method _clearPreview
		 */
		_clearPreview: function()
		{
			FLBuilderResponsiveEditing._switchToAndScroll( 'default' );
		},
		
		/**
		 * Initializes responsive settings in settings forms.
		 *
		 * @since 1.9
		 * @access private
		 * @method _initSettingsForms
		 */
		_initSettingsForms: function()
		{
			FLBuilderResponsiveEditing._switchAllSettingsTo( FLBuilderResponsiveEditing._mode );
		},
		
		/**
		 * Callback for when the responsive toggle of a setting
		 * is clicked.
		 *
		 * @since 1.9
		 * @access private
		 * @method _settingToggleClicked
		 */
		_settingToggleClicked: function()
		{
			var toggle  = $( this ),
				mode    = toggle.data( 'mode' );
			
			if ( 'default' == mode ) {
				mode  = 'medium';
			}
			else if ( 'medium' == mode ) {
				mode  = 'responsive';
			}
			else {
				mode  = 'default';
			}
			
			FLBuilderResponsiveEditing._switchAllSettingsTo( mode );
			
			toggle.siblings( '.fl-field-responsive-setting:visible' ).find( 'input' ).focus();
		},
		
		/**
		 * Switches all responsive settings in a settings form
		 * to the given mode.
		 *
		 * @since 1.9
		 * @access private
		 * @method _switchAllSettingsTo
		 * @param {String} mode
		 */
		_switchAllSettingsTo: function( mode )
		{
			var className = 'dashicons-desktop dashicons-tablet dashicons-smartphone';
				
			$( '.fl-field-responsive-toggle' ).removeClass( className );
			$( '.fl-field-responsive-setting' ).hide();
			
			if ( 'default' == mode ) {
				className = 'dashicons-desktop';
			}
			else if ( 'medium' == mode ) {
				className = 'dashicons-tablet';
			}
			else {
				className = 'dashicons-smartphone';
			}
			
			$( '.fl-field-responsive-toggle' ).addClass( className ).data( 'mode', mode );
			$( '.fl-field-responsive-setting-' + mode ).css( 'display', 'inline-block' );
			
			FLBuilderResponsiveEditing._switchToAndScroll( mode );
		},
	};
	
	$( function() { FLBuilderResponsiveEditing._init() } );
	
} )( jQuery );
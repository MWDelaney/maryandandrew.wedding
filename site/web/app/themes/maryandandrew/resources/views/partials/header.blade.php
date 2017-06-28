<header class="banner">
		<nav class="navbar navbar-toggleable-md navbar-light bg-faded">
			<div class="container">
					<button class="navbar-toggler navbar-toggler-right py-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				    <span class="text-muted">Menu</span>
				  </button>
					<a class="navbar-brand" href="/">
					</a>
					<div class="collapse flex-column navbar-collapse" id="navbarSupportedContent">
						<div class="d-flex flex-column-reverse flex-lg-row justify-content-center">
							<div class="">
								@if (has_nav_menu('primary_navigation'))
									{!! wp_nav_menu($primarymenu) !!}
								@endif
							</div>
						</div>
					</div> <!-- /.collapse -->
				</div> <!-- /.container -->
			</nav>
</header>

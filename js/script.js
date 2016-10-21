$( document ).ready(function() {

	$('#selector').heapbox(
		{'onChange': function() {
			//remove previous articles
			$('.article-list').empty();

			//adjust margin on the logo
			$('header').addClass('logo-margin');
			$('.logoLarg').addClass('letter-size');

			$('#sections').on('change', function (event) {
				$('.loader').show();
				event.preventDefault();


				$('.siteHeaderLarge').addClass('siteHeaderSmall');

				var $articles = $('.articles');

				var selection = $('#sections').val().toLowerCase();

				var url = "https://api.nytimes.com/svc/topstories/v2/" + selection + ".json?api-key=5f2aa8828d8f44cdbf0f063bff8d69e6";
				$.ajax({
					url: url,
					method: 'GET',
				}).done(function(data){
					$articles.empty();
					var dataResults = data.results.filter(function(value){
						return value.multimedia.length >= 5;
					})
					dataResults.splice(12)
					var content ='';
					$.each(dataResults, function(key,value) {
						var articleLink = value.url;
						var abstract = value.abstract;
						var multimedia = value.multimedia;

						if (multimedia.length >=5) {
							content += '<li>';
							content += '<a href="'+ articleLink + '" target="_blank">';
							content += '<div class="inner-article">';
							content += '<div class="article_images" style="background-image:url('+multimedia[4].url+')">';

							content +='<p class = "abstract">' +abstract+ '</p>';

							content += '</div>';
							content += '</div>';
							content += '</a>';
							content +='</li>';
						}

					})
					$articles.append(content);

				}).always(function(){
					$('.loader').hide();
				});
			});
		});
  });
});

window.addEventListener('load', (event) => {
});


// check input class/value/this...
	
let input = $('.input-ing');
	console.warn('aaaaa',input);

	function foodAutocomplete(){
	  let currentSearch,foodP,foodResP;

	  fetch('https://api.spoonacular.com/food/ingredients/autocomplete?query=' + $(this).val() +'&number=5&apiKey=c352653ef2ba4314b0d792186bde541f')
	   .then((response) => response.json())
		.then((responseJSON) => {
		console.log(responseJSON)
		currentSearch = responseJSON;
			foodP = `<p class="foodP"><img src="https://i.ibb.co/m9j76td/bowl.png"> ${currentSearch[0].name}</p>
			   <p class="foodP"><img src="https://i.ibb.co/m9j76td/bowl.png"> ${currentSearch[1].name}</p>
			   <p class="foodP"><img src="https://i.ibb.co/m9j76td/bowl.png"> ${currentSearch[2].name}</p>
			   <p class="foodP"><img src="https://i.ibb.co/m9j76td/bowl.png"> ${currentSearch[3].name}</p>`;

		$(this).next().html(foodP)
		 console.log(currentSearch);

	   // result selection: when clicked on the suggestion, make that the value of the input.
	   foodResP = document.getElementsByClassName('foodP');
		  Array.from(foodResP).forEach((item)=>{
			item.addEventListener('click', (e)=>{
				$(this).val(item.innerText);
				$('.foodRes').empty();
				})
		  })
		}); 
 
		
	}
	
 let foodRes = $('.foodRes');
	$('.input-ing').keydown(foodAutocomplete);	

	// $('.add-ing').click(function(){
	// 	setTimeout(() => {
	// 		$('.input-ing').keydown(foodAutocomplete);
	// 		console.log('arrived', $('.input-ing'));
				
	// 		}, "1000")
	// })

});

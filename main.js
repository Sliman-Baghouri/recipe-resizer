$(document).ready(function(ev){

	function initDesign(){

		// imperial / metric units
   		autocompleteAPI()

		//material contact form animation
		var floatingField = $(".material-form .floating-field").find(".form-control");
		var formItem = $(".material-form .input-block").find(".form-control");

		//##case 1 for default style
		//on focus
		formItem.focus(function () {
		  $(this).parent(".input-block").addClass("focus");
		});
		//removing focusing
		formItem.blur(function () {
		  $(this).parent(".input-block").removeClass("focus");
		});

		//##case 2 for floating style
		//initiating field
		floatingField.each(function () {
		  var targetItem = $(this).parent();
		  if ($(this).val()) {
		    $(targetItem).addClass("has-value");
		  }
		});

		//on typing
		floatingField.blur(function () {
		  $(this).parent(".input-block").removeClass("focus");
		  //if value is not exists
		  if ($(this).val().length == 0) {
		    $(this).parent(".input-block").removeClass("has-value");
		  } else {
		    $(this).parent(".input-block").addClass("has-value");
		  }
		});

		//dropdown list
		$("body").click(function () {
		  if ($(".custom-select .drop-down-list").is(":visible")) {
		    $(".custom-select").parent().removeClass("focus");
		  }
		  $(".custom-select .drop-down-list:visible").slideUp();
		});
		$(".custom-select .active-list").click(function () {
		  $(this).parent().parent().addClass("focus");
		  $(this)
		    .parent()
		    .find(".drop-down-list")
		    .stop(true, true)
		    .delay(10)
		    .slideToggle(100);
		});
		$(".custom-select .drop-down-list li").click(function () {
		  var listParent = $(this).parent().parent();
		  //listParent.find('.active-list').trigger("click");
		  listParent.parent(".select-block").removeClass("focus").addClass("added");
		  listParent.find(".active-list").text($(this).text());
		  listParent.find("input.list-field").attr("value", $(this).text());
		});

	
	}
				
	$("#imperial, #imperial-l, #metric").click(function(){
			$('.active-list').empty();
			$('.select-block').removeClass('focus, added')
			if($(this).attr('id') === 'imperial'){
				$('.drop-down-list').empty().append(`
						  <li>Cups</li>
				          <li>Dashes</li>
				          <li>Ounces</li>
				          <li>Pinches</li>
				          <li>Tablespoon</li>
				          <li>Teaspoons</li>
				          <li>Pounds</li>
				          <li>Each</li>

					`);
				}else if($(this).attr('id') === 'metric'){
				$('.drop-down-list').empty().append(`
					   <li>Milligrams</li>
			          <li>Grams</li>
			          <li>Kilograms</li>
			          <li>Milliliters</li>
			          <li>Liters</li>
			          <li>Kiloliters</li>
					`);

				}else{
				$('.drop-down-list').empty().append(`
						  <li>Cups</li>
				          <li>Ounces</li>
				          <li>Pints</li>
				          <li>Quarts</li>
				          <li>Tablespoons</li>
				          <li>Teaspoons</li>

					`);

				}
				initDesign();
			})


	initDesign();

	// Validating the inputs

	function inputValidation(){
		 $(".originalN, .needsToServeN, .input-qtyN").inputFilter(function(value) {

			    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
		  },"Only digits allowed");
	}
	inputValidation();

	// resize logic

	$('.btn-submit').click(function(e){
		// validation if input empty
		e.preventDefault();
		let unitIndex = {Cups:1, Dashes:2,Ounces:3,Pinches:4,Tablespoon:5,Teaspoons:6,Pounds:7,Each:8,Cups:9,Gallons:10,Ounces:11,Pints:12,Quarts:13,Tablespoons:14,Teaspoons:15}
		
		if($('#imperial').is(':checked') || $('#imperial-l').is(':checked')){
			if (!$('.active-list').is(':empty')) {

			$('.img-placeholder, .h2-placeholder').css({display:'none'});
			$('.box , .loadingp').css({display:'block'});

			let dataCalc = {
			   spec:[],
			   "ors":$('.originalN').val(),
			   "nts":$('.needsToServeN').val(),
			   // "email":$('.userEmail').val()
			};

			$('.ing-holder .ing-qt').each(function(e,ing){

				let fillSpec = {
							  qty: $(ing).find('input').val(),
							    m:  $(ing).find('.active-list').text(),
							  ing: $(ing).find('.input-ing').val()
							}

				dataCalc.spec.push(fillSpec);
			})	
			dataCalc.spec.forEach((i)=>{i.m = (unitIndex[i.m]).toString()});

			

			(async () => {
			  const rawResponse = await fetch('https://foodtrucker-api-production.up.railway.app/calc', {
			    method: 'POST',
			    headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },						
			    body: JSON.stringify(dataCalc)
			  });
			  const content = await rawResponse.json();

			  console.log(content,'xx');

			  	$('.originalN, .needsToServeN, .input-qtyN, .r-name').each(function() {
				$('.placeholder-section').css({display:'none'})
				$('.results-section').css({display:'block'})

				// clearing past values
				$('.original-ul').empty(); 
				$('.resized-ul').empty(); 

				let originNumber = $('.originalN').val(), 
					needsToServe = $('.needsToServeN').val(),
					rName = $('.r-name').val();

				let resizeObj = [];
				let resultObj = [];

					$('.ing-holder .ing-qt').each(function(e,ing){

						let ingObj = {
									  qty: $(ing).find('input').val(),
									    m:  $(ing).find('.active-list').text(),
									  ing: $(ing).find('.input-ing').val()
									}

						resizeObj.push(ingObj);
					})	

					// orignial code: 
					$('.original-r .r-info-holder').empty().append(
								`<h3>${rName}</h3>
								<p>Serves: ${originNumber}</p>
								<h3 class='ing-h3'>Ingredients</h3>`)
					

					resizeObj.forEach((item)=>{
						$('.original-ul').append(`<li>${item.qty} ${item.m} ${item.ing}</li>`)
					})

			// result code: 
			$('.resized-r .r-info-holder').empty().append(
								`<h3>${rName} (Resized)</h3>
								<p>Serves: ${needsToServe}</p>
								<h3 class='ing-h3'>Ingredients</h3>`)
			$('.resized-r .resized-ul').empty().append(content)
					
			$('.print-btn').css({display:'block'});


			});
			$('.active-list').empty();
			$('.select-block').removeClass('focus, added');
			$('input').val('')

			})();
			  }else{
				new Noty({
				    type: 'error',
				    layout: 'topLeft',
				    text: '<h4>A field is missing. Please fill all inputs and options</h4>',
				    timeout:3000,
				    progressBar:true
				}).show(2000);
				return false

			  }


		


		}else if($('#metric').is(':checked')){

			$('.originalN, .needsToServeN, .input-qtyN, .r-name, .input-ing').each(function(i,item) {
				if(!$('.input-ing').val() == ''){

			  if ((!$(this).val() == '') && (!$('.active-list').is(':empty') )) {
				$('.placeholder-section').css({display:'none'})
				$('.results-section, .print-btn').css({display:'block'})

				// clearing past values
				$('.original-ul').empty(); 
				$('.resized-ul').empty(); 

				

				let originNumber = $('.originalN').val(), 
					needsToServe = $('.needsToServeN').val(),
					rName = $('.r-name').val();

				console.log(originNumber, needsToServe, rName);
				let resizeObj = [];
				let resultObj = [];

					$('.ing-holder .ing-qt').each(function(e,ing){

						let ingObj = {
									  qty: $(ing).find('input').val(),
									    m:  $(ing).find('.active-list').text(),
									  ing: $(ing).find('.input-ing').val()
									}
						let reObj = {
									  qty: (Number($(ing).find('input').val()) * (needsToServe/originNumber)).toFixed(2),
									    m:  $(ing).find('.active-list').text(),
									  ing: $(ing).find('.input-ing').val()
						}

						resizeObj.push(ingObj);
						resultObj.push(reObj);

					})	

					// orignial code: 
					$('.original-r .r-info-holder').empty().append(
								`<h3>${rName}</h3>
								<p>Serves: ${originNumber}</p>
								<h3 class='ing-h3'>Ingredients</h3>`)
					

					resizeObj.forEach((item)=>{
						$('.original-ul').append(`<li>${item.qty} ${item.m} ${item.ing}</li>`)
					})

			// result code: 

			$('.resized-r .r-info-holder').empty().append(
								`<h3>${rName} (Resized)</h3>
								<p>Serves: ${needsToServe}</p>
								<h3 class='ing-h3'>Ingredients</h3>`)
					

					resultObj.forEach((item)=>{
						$('.resized-ul').append(`<li>${item.qty} ${item.m} ${item.ing}</li>`)
					})
			$('.active-list').empty();
			$('.select-block').removeClass('focus, added');
			$('input').val('')
			return false;
		  				}else{
			new Noty({
			    type: 'error',
			    layout: 'topLeft',
			    text: '<h4>A field is missing. Please fill all inputs and options</h4>',
			    timeout:3000,
			    progressBar:true
			}).show(2000);

			return false;

		  				}

		  }else{
			new Noty({
			    type: 'error',
			    layout: 'topLeft',
			    text: '<h4>A field is missing. Please fill all inputs and options</h4>',
			    timeout:3000,
			    progressBar:true
			}).show(2000);

			return false;
		  }
		});
	}

	});

	// Reseting values


	$('.print-btn').click(()=>{
			
				(async () => {

				const { value: formValues } = await Swal.fire({
				  title: 'Where should we send it?',
				  html:
				    '<input id="swal-input1" required placeholder="Name" class="swal2-input">' +
				    '<input id="swal-input2" placeholder="Company (optional)"  class="swal2-input">' + 
				    '<input id="swal-input3" required  placeholder="Email"  class="swal2-input">',
				  focusConfirm: false,
				  confirmButtonText:'Send it',
				  confirmButtonColor:'#F28F48',
			      customClass: 'swal-wide',
				  preConfirm: () => {
					let dataCalc = {
					   "results":$('.results-section').html(),
					   email:$('#swal-input3').val(),
					   name:$('#swal-input1').val(),
					   company:$('#swal-input2').val(),
					};
						console.log('email val', dataCalc.email);
						console.log('email val', Boolean(dataCalc.email));

					if(dataCalc.email && dataCalc.name){
						if( /(.+)@(.+){2,}\.(.+){2,}/.test(dataCalc.email) ){
						  	console.log('sent!');
							(async () => {
							  const rawResponse = await fetch('https://foodtrucker-api-production.up.railway.app/sendPDF', {
							    method: 'POST',
							    headers: {
							      'Accept': 'application/json',
							      'Content-Type': 'application/json'
							    },						
							    body: JSON.stringify(dataCalc)
							  });
							  const content = await rawResponse.json();
							})();	
						} else {
						 	Swal.fire({
							title:'Invalid Email. Try again',
							text:'Make sure your email is valid',
							icon:'warning',
							confirmButtonColor:'#F28F48',
						});
						return false;
						}

					
					}else{
						Swal.fire({
							title:'Fill in required information',
							text:'Make sure inputs are filled or valid',
							icon:'error',
							confirmButtonColor:'#F28F48',
						});
						return false;
					}

									  	
				  }
				}).then((result)=>{
					if(result.isConfirmed){
					Swal.fire({
						title:'PDF Sent!',
						text:'Check your email to find it',
						icon:'success',
						confirmButtonColor:'#F28F48',
					});

					}
				})

				if (formValues) {
				  Swal.fire(JSON.stringify(formValues))
				}
				})()
			})

	$('.add-btn').click(function(e){
				e.preventDefault();

			$(".ing-holder").append(`
			<div class="ing-qt">
				<div class="input-block input-qty floating-field">
		      <label>Qty</label>
		      <input value="" type="text" class="form-control input-qtyN">
		    </div>	
				<div class="select-block">
		      <label>Measurement</label>
		      <div class="custom-select">
		        <div class="active-list"></div>
		        <input type="text" class="list-field" value="Australia" />
		        <ul class="drop-down-list">
		          <li>Milligrams</li>
		          <li>Grams</li>
		          <li>Kilograms</li>
		          <li>Milliliters</li>
		          <li>Liters</li>
		          <li>Kiloliters</li>
		        </ul>
		      </div>
		    </div>
			<div class="input-block floating-field">
		      <label>Ingredient Name</label>
		      <input value="" type="text" class="form-control input-ing">
		      <div class="foodRes"></div>
		    </div>	
			</div>`)	

			// reset units
			let currentUnits;

			$('.unit-holder').find('input').each(function(b,item){
  		  		if($(item).is(":checked")){
        			currentUnits = $(item).attr('id')
    			}
    
			});

			$('#metric').click();
			$('#' + currentUnits).click();

		  initDesign();
		  inputValidation();
		});



// autocomplete
	$(document).on('click', function(e) {
	    if ($(e.target).attr('class') != 'input-ing'){
	        $('.foodRes').empty();
	    }
	})
    autocompleteAPI()
		
	function autocompleteAPI(){
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


	}

	// PDF Generation



	});


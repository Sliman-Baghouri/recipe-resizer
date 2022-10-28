$(document).ready(function(){




	function initDesign(){
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
		$('.originalN, .needsToServeN, .input-qtyN, .r-name').each(function() {
		  if ((!$(this).val() == '') && (!$('.active-list').is(':empty') )) {
			$('.placeholder-section').css({display:'none'})
			$('.results-section').css({display:'block'})

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
		});



	});

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
		    </div>	
			</div>`)	
		  initDesign();
		  inputValidation();
		});




		


	});






/* boilerplate tODOS:
html popup
html form
html user warnings
auth
js ajax/server communication

*/

const c = console.log;
const ct = console.trace;


$(function(){
	c("init");

	// Vue init on body
	const v = new Vue({
	  el: '#body',
	  data: {
		
	  }
	});

	/* gui element implementation */
	$(".modal-toggle").click(function (e) {
		e.preventDefault();
		showmodal("#maunal");
	});
	
	/* helpers */
	
	function showmodal(el) {
		// if modal is being closed
		if ($("body").css('overflow') === "hidden") {
			$("body").css('overflow',"auto");
			$("#modal-content").empty();
		// if modal is being opened
		} else {
			$("body").css('overflow',"hidden"); 
			$("#modal-content").append($(el).html());
		}
		$("#modal").toggle();
	}
}); // jquery init



$(document).ready(function () {

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) { 
		//page not meant for mobile yet, send alert
	}
	
	  $("button").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#content").offset().top},
	        'slow');
	});
	
	$("#sidebar-about").click(function(){
    		$("#display-about").delay(400).fadeIn(); 
    		$("#display-projects").fadeOut();
    		$("#display-courses").fadeOut();
   		$("#display-contact").fadeOut();
   		 });
   		 
	$("#sidebar-projects").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").delay(400).fadeIn();
    		$("#display-courses").fadeOut();
   		$("#display-contact").fadeOut();
   		 });
   		 
        $("#sidebar-courses").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").fadeOut();
    		$("#display-courses").delay(400).fadeIn();
   		$("#display-contact").fadeOut();
   		 });
   		 
	$("#sidebar-contact").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").fadeOut();
    		$("#display-courses").fadeOut();
   		$("#display-contact").delay(400).fadeIn(); 
   		 });
});
	
setTimeout(function() {
    console.log('loaded');
    $(".loader-wrapper").fadeOut("slow");
 },"300");

/*
$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
 });
*/

particlesJS.load('particles-js', '../content/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });

$(document).ready(function () {
    console.log("doc ready")
	document.getElementsByTagName("html")[0].style.visibility = "visible";
	$("#about-button").click(function() {
        console.log("doc ready")
		$('html,body').animate({
			scrollTop: $("#about-page").offset().top},
		'slow');
    });
    
    $("#about-down").click(function() {
        console.log("doc ready")
		$('html,body').animate({
			scrollTop: $("#experience-page").offset().top},
		'slow');
    });
    
    $("#experience-down").click(function() {
        console.log("doc ready")
		$('html,body').animate({
			scrollTop: $("#projects-page").offset().top},
		'slow');
	});
});

$(document).ready(function () {

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) { 
		//page not meant for mobile yet, send alert
			  $("button").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#about").offset().top},
	        'slow');
	});
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
   	    	$("#display-other").fadeOut();
   		 });
   		 
	$("#sidebar-projects").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").delay(400).fadeIn();
    		$("#display-courses").fadeOut();
   	    	$("#display-contact").fadeOut();
   	    	$("#display-other").fadeOut();
   		 });
   		 
        $("#sidebar-courses").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").fadeOut();
    		$("#display-courses").delay(400).fadeIn();
   		    $("#display-contact").fadeOut();
   		    $("#display-other").fadeOut();
   		 });
   		 
	$("#sidebar-contact").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").fadeOut();
    		$("#display-courses").fadeOut();
   		    $("#display-contact").delay(400).fadeIn();
   		    $("#display-other").fadeOut();
   		 });

	$("#sidebar-other").click(function(){
    		$("#display-about").fadeOut();
    		$("#display-projects").fadeOut();
    		$("#display-courses").fadeOut();
   	    	$("#display-contact").fadeOut();
   	    	$("#display-other").delay(400).fadeIn();
   		 });
   		 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            console.log(response);
            document.getElementById("eth_price").innerHTML = "ETH is " + response["0"].price_usd + " USD currently!";
        }
    };
    xhttp.open("GET", "https://api.coinmarketcap.com/v1/ticker/ethereum/", true);
    xhttp.send();
    
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp2.responseText);
            console.log(response);
            if(response.data.hashrate > 0){
                document.getElementById("eth_current_hashrate").innerHTML = "I'm mining ETH at " + response.data.hashrate + " MH/s currently!";
            }
            else {
                document.getElementById("eth_current_hashrate").innerHTML = "I'm not currently mining. (0 MH/s)";
            }

            document.getElementById("eth_balance").innerHTML = "My current ETH balance is " + response.data.balance + "!";
            document.getElementById("eth_12h_hashrate").innerHTML = "My average hashrate in the past 12 hours was " + response.data.avgHashrate.h12 + " MH/s!";
             
        }
    };
    xhttp2.open("GET", "https://api.nanopool.org/v1/eth/user/0x6c391687309d961e804379c7ae8fb2257855427a", true);
    xhttp2.send();
   		 
   		 
});
	
/***************** Scrolling to the Top ******************/
$(document).ready(function () {

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    window.setInterval(function() {

    	var ranNum = Math.floor((Math.random() * 10) + 1);

      	if ( ranNum > 7){
      		$("#featuresSlider .flickity-slider").animate({"left": "-100%"}, 1000, function(){});
      	}else if( ranNum < 7 && ranNum > 4){
      		$("#featuresSlider .flickity-slider").animate({"left": "-200%"}, 1000, function(){});
      	}else{
      		$("#featuresSlider .flickity-slider").animate({"left": "0%"}, 1000, function(){});
      		// $("#featuresSlider .flickity-slider").css("transform","translateX(0%)");
      	}

   }, 5000);

    window.setInterval(function() {

    	var ranNum = Math.floor((Math.random() * 10) + 1);

      	if ( ranNum > 8){
      		$("#showcaseSlider .flickity-slider").animate({"left": "-100%"}, 1000, function(){});
      	}else if( ranNum == 8 || ranNum > 6 ){
      		$("#showcaseSlider .flickity-slider").animate({"left": "-200%"}, 1000, function(){});
        }else if( ranNum == 6 && ranNum > 3){
        	$("#showcaseSlider .flickity-slider").animate({"left": "-300%"}, 1000, function(){});
      	}else{
      		$("#showcaseSlider .flickity-slider").animate({"left": "0.01%"}, 1000, function(){});
      		// $("#showcaseSlider .flickity-slider").css("transform","translateX(0.01%)");
      	}

   }, 3000);

});

/***************** End of Scrolling to the Top******************/

$(document).ready(function(){$(".wp1").waypoint(function(){$(".wp1").addClass("animated fadeInLeft")},{offset:"75%"});$(".wp2").waypoint(function(){$(".wp2").addClass("animated fadeInDown")},{offset:"75%"});$(".wp3").waypoint(function(){$(".wp3").addClass("animated bounceInDown")},{offset:"75%"});$(".wp4").waypoint(function(){$(".wp4").addClass("animated fadeInDown")},{offset:"75%"});$("#featuresSlider").flickity({cellAlign:"left",contain:true,prevNextButtons:false});$("#showcaseSlider").flickity({cellAlign:"left",contain:true,prevNextButtons:false,imagesLoaded:true});$(".youtube-media").on("click",function(e){var t=$(window).width();if(t<=768){return}$.fancybox({href:this.href,padding:4,type:"iframe",href:this.href.replace(new RegExp("watch\\?v=","i"),"v/")});return false})});$(document).ready(function(){$("a.single_image").fancybox({padding:4})});$(".nav-toggle").click(function(){$(this).toggleClass("active");$(".overlay-boxify").toggleClass("open")});$(".overlay ul li a").click(function(){$(".nav-toggle").toggleClass("active");$(".overlay-boxify").toggleClass("open")});$(".overlay").click(function(){$(".nav-toggle").toggleClass("active");$(".overlay-boxify").toggleClass("open")});$("a[href*=#]:not([href=#])").click(function(){if(location.pathname.replace(/^\//,"")===this.pathname.replace(/^\//,"")&&location.hostname===this.hostname){var e=$(this.hash);e=e.length?e:$("[name="+this.hash.slice(1)+"]");if(e.length){$("html,body").animate({scrollTop:e.offset().top},2e3);return false}}})

//-------------------------------------------------
//		youtube playlist jquery plugin
//		Created by dan@geckonm.com
//		www.geckonewmedia.com
//
//		v1.1 - updated to allow fullscreen 
//			 - thanks Ashraf for the request
//-------------------------------------------------

jQuery.fn.ytplaylist = function(options) {
 
  // default settings
  var options = jQuery.extend( {
    holderId: 'ytvideo',
	playerHeight: '300',
	playerWidth: '450',
	addThumbs: false,
	thumbSize: 'small',
	showInline: false,
	autoPlay: true,
	showRelated: true,
	allowFullScreen: false
  },options);
 
  return this.each(function() {
							
   		var selector = $(this);
		
		var autoPlay = "";
		var showRelated = "&rel=0";
		var fullScreen = "";
		if(options.autoPlay) autoPlay = "&autoplay=1"; 
		if(options.showRelated) showRelated = "&rel=1"; 
		if(options.allowFullScreen) fullScreen = "&fs=1"; 
		
		//throw a youtube player in
		function play(id)
		{
		   var html = "<iframe width='640' height='360' src='https://www.youtube.com/embed/" + id + "' frameborder='0' allowfullscreen></iframe>";			

		   
		   return html;
		   
		};
		
		
		//grab a youtube id from a (clean, no querystring) url (thanks to http://jquery-howto.blogspot.com/2009/05/jyoutube-jquery-youtube-thumbnail.html)
		function youtubeid(url) {
			var ytid = url.match("[\\?&]v=([^&#]*)");
			ytid = ytid[1];
			return ytid;
		};
		
		function youtubeplaylistid(url) {
			var ytlist = url.match('[\\?&]list=([^*]*)');
			var ytid = url.match('[\\?&]v=([^&#]*)');
			ytid = ytid[1] + "?list=" + ytlist[1];
			return ytid;
		};		
		
		
		//load inital video
		var firstVid = selector.children("li:first-child").addClass("currentvideo").children("a").attr("href");
		$("#"+options.holderId+"").html(play(youtubeplaylistid(firstVid)));
		
		//load video on request
		selector.children("li").children("a").click(function() {
			
			if(options.showInline) {
				$("li.currentvideo").removeClass("currentvideo");
				$(this).parent("li").addClass("currentvideo").html(play(youtubeplaylistid($(this).attr("href"))));
			}
			else {
				$("#"+options.holderId+"").html(play(youtubeplaylistid($(this).attr("href"))));
				$(this).parent().parent("ul").find("li.currentvideo").removeClass("currentvideo");
				$(this).parent("li").addClass("currentvideo");
			}
															 
			
			
			return false;
		});
		
		//do we want thumns with that?
		if(options.addThumbs) {
			
			selector.children().each(function(i){
											  
				var replacedText = $(this).text();
				
				if(options.thumbSize == 'small') {
					var thumbUrl = "http://img.youtube.com/vi/"+youtubeplaylistid($(this).children("a").attr("href"))+"/2.jpg";
				}
				else {
					var thumbUrl = "http://img.youtube.com/vi/"+youtubeplaylistid($(this).children("a").attr("href"))+"/0.jpg";
				}
				
				
				$(this).children("a").empty().html("<img src='"+thumbUrl+"' alt='"+replacedText+"' />"+replacedText).attr("title", replacedText);
				
			});	
			
		}
			
		
   
  });
 
};
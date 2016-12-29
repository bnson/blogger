// Indexes to standard thumbnails returned by Picasa API
var THUMB_SMALL  = 0;
var THUMB_MEDIUM = 1;
var THUMB_LARGE  = 2;

// Sizes for photographs to be displayed by slimbox
var PHOTO_SMALL  = 640;
var PHOTO_MEDIUM = 800;
var PHOTO_LARGE  = 1024;

var DEFAULT_MARGIN    = 5;
var DEFAULT_THUMBSIZE = THUMB_LARGE;
var DEFAULT_PHOTOSIZE = PHOTO_MEDIUM;

var URL = window.location.href;

function loadData_iphentai(userid, albumid, authkey, thumbsize, photosize, margin) {
	console.log('URL', URL);	
	if (URL.toLowerCase().endsWith(".html")) {
		loadDetailAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin);
		
	} else {
		loadThumbAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin);
	}	
}

function loadRecentPost_001(userid, albumid, authkey, thumbsize, photosize, margin, idDivRecent) {
	var ts = thumbsize || DEFAULT_THUMBSIZE;

	var scripts = document.getElementsByTagName('script');
	var me = scripts[scripts.length-1];
	//var idDiv = "recentPosts";	
	var idDiv = idDivRecent;	
	console.log('parent id', idDiv);	
		
	// Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
	$j = jQuery.noConflict();
	$j(document).ready(function(){
		$j.getJSON(
			"http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
			function(data, status) {

				//$j("#" + idDiv).append("<div class='col-xs-6 col-md-3' id=\"" + albumid + "\"></div>");
				$j("#" + idDiv).append("<div class='row' id=\"picasaThumb_" + albumid + "\"></div>");								

				var tmpCount = true;
				$j.each(data.feed.entry, function(i, pic) {
					var thumb = pic.media$group.media$thumbnail[ts];

					if (tmpCount) {
						$j("<img/>").attr("src", thumb.url.replace("s288","s400"))
							.appendTo("#picasaThumb_" + albumid);					
						tmpCount = false;
					}
				});
		});
		
	});		

	
	
}

function loadThumbAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin) {
	var ts = thumbsize || DEFAULT_THUMBSIZE;

	var scripts = document.getElementsByTagName('script');
	var me = scripts[scripts.length-1];
	var idDiv = me.parentNode.id;	
	//console.log('parent id', me.parentNode.id);	
		
	// Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
	$j = jQuery.noConflict();
	$j(document).ready(function(){
		$j.getJSON(
			"http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
			function(data, status) {

				$j("#" + idDiv).append("<div class='row albums' id=\"" + albumid + "\"></div>");
				$j("#" + albumid).append("<div class='col-xs-12 picasaThumbs' id=\"picasaThumb_" + albumid + "\"></div>");								

				var tmpCount = true;
				$j.each(data.feed.entry, function(i, pic) {
					var thumb = pic.media$group.media$thumbnail[ts];

					if (tmpCount) {
						$j("<img/>").attr("src", thumb.url.replace("s288","s400"))
							.appendTo("#picasaThumb_" + albumid);					
						tmpCount = false;
					}
				});
		});
		
	});	
}

function loadDetailAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin) {
	var ts = thumbsize || DEFAULT_THUMBSIZE;
	var ps = photosize || DEFAULT_PHOTOSIZE;
	var m = margin || DEFAULT_MARGIN;

	var scripts = document.getElementsByTagName('script');
	var me = scripts[scripts.length-1];
	var idDiv = me.parentNode.id;	
	//console.log('parent id', me.parentNode.id);	
		
	// Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
	$j = jQuery.noConflict();
	$j(document).ready(function(){
		$j.getJSON(
			"http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
			function(data, status) {

				$j("#" + idDiv).append("<div class='row album' id='" + albumid + "'></div>");
				
				$j("#" + albumid).append("<div class='col-xs-12'><div class='row' id='albumInfor'></div><hr id='hrLine'/>​");
				
				$j("#albumInfor").append("<div class='col-xs-12 col-md-3 picasaThumb' id='picasaThumb_" + albumid + "'></div>");
				$j("#albumInfor").append("<div class='col-xs-12 col-md-9 picasaInfor' id='picasaInfor_" + albumid + "'></div>");
				
				$j("#picasaInfor_" + albumid).append("<div class='row' id='picasaTitle'>" + data.feed.title.$t + "</div>");
				$j("#picasaInfor_" + albumid).append("<div class='row' id='picasaLabels'></div>");
				$j("#labelPost").appendTo($j("#picasaLabels"));
				$j("#picasaInfor_" + albumid).append("<div class='row' id='picasaPicCount'><span>Total page: </span>" + data.feed.entry.length + "</div>");
				$j("#picasaInfor_" + albumid).append("<div class='row' id='picasaSubtitle'>" + data.feed.subtitle.$t + "</div>");				

				$j("#" + albumid).append("<div class='col-xs-12'><div class='row picasaPhotos' id='picasaPhotos_" + albumid + "'></div></div>");			
		
				var tmpCount = true;
				$j.each(data.feed.entry, function(i, pic) {
					var thumb = pic.media$group.media$thumbnail[ts];
					var photo = pic.media$group.media$content[0];
					var desc = pic.media$group.media$description.$t;
					var pad = computePadding(thumb.width, thumb.height);
					
					if (tmpCount) {
						$j("<img/>").attr("src", thumb.url.replace("s288","s400"))
							.attr("alt", desc)
							.appendTo("#picasaThumb_" + albumid);				
						tmpCount = false;
					}
					
					var tmpDiv = $j("<div/>").attr("class", "col-xs-6 col-md-3").appendTo("#picasaPhotos_" + albumid);
						
					$j("<img/>").attr("src", thumb.url)
						.attr("class", "img-responsive col-xs-12")
						.attr("alt", desc)
						.appendTo(tmpDiv)
						.wrap("<a href=\"" + imgScaledUrl(photo.url, 0) + "\" title=\"" + desc + "\" />");

						
				});

				//$j("#picasaPhotos_" + albumid + " a").slimbox();
				$j('.picasaPhotos').magnificPopup({
				  delegate: 'a',
				  type: 'image',
				  tLoading: 'Loading image #%curr%...',
				  mainClass: 'mfp-img-mobile',
				  gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				  },
				  image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
					  return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
					}
				  }
				});				
				
		});

	});	
}

function loadImageThumbAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin) {
	var ts = thumbsize || DEFAULT_THUMBSIZE;
	var ps = photosize || DEFAULT_PHOTOSIZE;
	var m = margin || DEFAULT_MARGIN;

	// Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
	$j = jQuery.noConflict();
	$j(document).ready(function(){
		$j.getJSON(
			"http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
			function(data, status) {
				//$j("#picasaTitle").text(data.feed.title.$t);
				//$j("#picasaSubtitle").text(data.feed.subtitle.$t);

				$j.each(data.feed.entry, function(i, pic) {
					var thumb = pic.media$group.media$thumbnail[ts];
					var photo = pic.media$group.media$content[0];
					var desc = pic.media$group.media$description.$t;
					var pad = computePadding(thumb.width, thumb.height);

					$j("<img/>").attr("src", thumb.url)
						.attr("alt", desc)
						.attr("style", imgMarginStyle(pad.hspace, pad.vspace, m))
						.appendTo("#picasaPhotos")
						.wrap("<a href=\"" + imgScaledUrl(photo.url, ps) + "\" title=\"" + desc + "\" />");
				});

				//$j("#picasaPhotos a").slimbox();
				
		});
	});
}

function loadImageFullAlbum_001(userid, albumid, authkey, thumbsize, photosize, margin) {
  var ts = thumbsize || DEFAULT_THUMBSIZE;
  var ps = photosize || DEFAULT_PHOTOSIZE;
  var m = margin || DEFAULT_MARGIN;

  // Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
  $j = jQuery.noConflict();
  $j(document).ready(function(){
  $j.getJSON("http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
    function(data, status) {
      $j("#picasaTitle").text(data.feed.title.$t);
      $j("#picasaSubtitle").text(data.feed.subtitle.$t);

      $j.each(data.feed.entry, function(i, pic) {
        var thumb = pic.media$group.media$thumbnail[ts];
        var photo = pic.media$group.media$content[0];
        var desc = pic.media$group.media$description.$t;
        var pad = computePadding(thumb.width, thumb.height);

        $j("<img/>").attr("src", thumb.url.replace("s144","s1600"))
                    .attr("alt", desc)
                    .attr("style", imgMarginStyle(pad.hspace, pad.vspace, m))
                    //.wrap("<a href=\"" + imgScaledUrl(photo.url, ps) + "\" title=\"" + desc + "\" />")
					.wrap("<a href='" + imgScaledUrl(photo.url, ps) + "' />")
					.appendTo("#picasaPhotos");
      });
      
      //$j("#picasaPhotos a").slimbox();
	  
    });
  });
}


function loadImageFullAlbum_002(userid, albumid, authkey, thumbsize, photosize, margin) {
  var ts = thumbsize || DEFAULT_THUMBSIZE;
  var ps = photosize || DEFAULT_PHOTOSIZE;
  var m = margin || DEFAULT_MARGIN;

  // Originally based on code from http://www.bloggingtips.com/2009/03/23/picasa-widgets-and-plugins-for-your-blog/
  $j = jQuery.noConflict();
  $j(document).ready(function(){
  $j.getJSON("http://picasaweb.google.com/data/feed/api/user/" + userid + "/album/" + albumid + "?authkey=" + authkey + "&kind=photo&alt=json-in-script&callback=?",
    function(data, status) {
      $j("#picasaTitle").text(data.feed.title.$t);
      $j("#picasaSubtitle").text(data.feed.subtitle.$t);

      $j.each(data.feed.entry, function(i, pic) {
        var thumb = pic.media$group.media$thumbnail[ts];
        var photo = pic.media$group.media$content[0];
        var desc = pic.media$group.media$description.$t;
        var pad = computePadding(thumb.width, thumb.height);

		var aHref = $j("<a/>").attr("href", thumb.url.replace("s144","s1600"))
								.attr("data-lightbox", 'LightBox');
        //$j("<img/>").attr("src", thumb.url.replace("s144","s1600"))
		$j("<img/>").attr("src", thumb.url)
                    .attr("alt", desc)
                    .attr("style", imgMarginStyle(pad.hspace, pad.vspace, m))
					.attr("style", 'float:left;')
                    //.wrap("<a href=\"" + imgScaledUrl(photo.url, ps) + "\" title=\"" + desc + "\" />");
					//.wrap("<a href='" + thumb.url.replace("s144","s1600") + "' />")
					//.appendTo("#picasaPhotos");
					.appendTo(aHref);
		aHref.appendTo("#picasaPhotos");
      });
      
      //$j("#picasaPhotos a").slimbox();
    });
  });
}

// Compute horizontal and vertical padding needed to make the image "square" so
// landscape and portrait images align nicely on a grid
function computePadding(width, height) {
  var hspace = 0;
  var vspace = 0;

  if (width > height) {
    vspace = (width - height) / 2;
  } else if (height > width) {
    hspace = (height - width) / 2;
  }

  return {"hspace": hspace, "vspace": vspace};
}

// Adjust margin style, using padding computed from image dimensions
// hspace and vspace specify padding to make the area filled by the image seem "square"
// margin is the padding to be placed on all sides of the image
function imgMarginStyle(hspace, vspace, margin) {
  var hmargin = margin + hspace;
  var vmargin = margin + vspace;
  return "margin: " + vmargin + "px " + hmargin + "px " + vmargin + "px " + hmargin + "px;";
}

// Generate url for photo scaled to specified size
function imgScaledUrl(url, size) {
  var split = url.lastIndexOf("/");
  return url.substring(0, split) + "/s" + size + url.substring(split);
}







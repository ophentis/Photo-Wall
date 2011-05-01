(function($){
	var option = {
		columns : 4,
		width : 200,
		margin : 5,
		option : "flag",
		opacity : 0.7,
		hoverIn : function() {
			$(this).stop().animate({"opacity":1,"border":1});
		},
		hoverOut : function() {
			$(this).stop().animate({"opacity":option.opacity,"border":0});
		}
	};

	function buildPhotoWall() {
		this.css({
			width:"880",
			position:"relative"
		});
	}
	
	function createHandle(photos) {
		var hash = new Array();
		return $.map(photos,function(photo) {
		
			var handle = (photo.handle) ? photo.handle : $.md5(photo.src);
			
			if(hash[handle]) {
				return null;
			}
			
			hash[handle] = true;
			return $.extend({handle:handle},photo);
		});
	}
	
	function display(photos) {
	
		this.children().addClass(option.flag);
	
		var colHeight = [];
		for(var i=0; i<option.columns; i++) {
			colHeight.push(0);
		}
		
		var self = this;
		
		$.each(photos,function(i, photo) {
			with(photo) {
				//console.log(photo);
				var $img = self.find("#"+handle);
				if( $img.length == 0 ) {			//is not on the wall
					var col = indexOfMin( colHeight );
					$div = $("<div>").addClass("photo")
									 .attr("id",handle)
									 .css({width:option.width,top:colHeight[col]+option.margin,left:option.margin + col*(option.width+option.margin*2)})
								     .appendTo(self);
					$a = $("<a>").attr("href",src)
								 .fancybox({
									padding:0,
									margin:0,
									speedIn: 600,
									speedOut: 200,
									hideOnContentClick:true
								 })
								 .appendTo($div);
					$img = $("<img>").attr("src",src)
									 .css("opacity",0)
									 .load(function(e) {
										console.log(e.target);
										$(this).unbind(e.type,arguments.callee)
											   .animate({opacity:1},3000,"swing")
											   .animate({opacity:option.opacity},2000,"swing");
									 })
									 .hover( option.hoverIn, option.hoverOut)
					                 .appendTo($a);
					
					colHeight[col] += option.width * height / width + 2*option.margin;
					
				} else if( photo.display ) {
					
					$img.show("slow");
					$div = $img.removeClass(option.flag);
				}
			}
		});
		
		this.children("."+option.flag).remove();
	}
	
	function indexOfMin(table) {
		var min = 0;
		for(var i in table) {
			if( table[i] < table[min] ) {
				min = i;
			}
		}
		return min;
	}
	
	$.fn.photowall = function(photos) {
	
		if(!this[0].pw_init) {
			this[0].pw_init = true;
			buildPhotoWall.apply(this);
		}
		
		//remove duplicate image name
		photos = createHandle(photos);
		
		//display the photo on the wall
		display.call(this,photos);
		
		return this;
	};
	
})(jQuery);
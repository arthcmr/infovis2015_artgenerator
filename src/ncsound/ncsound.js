/**
 *	Audio JS for Art Generator
 * 	Final project for KTH course DH2321 Information Visualization by M. Romero
 *
 * Arhur Câmara            arthurcamara@gmail.com
 * Vera Fuest              vera.fuest@hotmail.de
 * Mladen Milivojevic      milivojevicmladen@gmail.com		  
 * Nora Tejada             ntexaa@gmail.com
 * Midas Nouwens           nouwens@kth.se
 * Konstantina Pantagaki   konstantina.pantagaki@gmail.com
 * Alexandre Andrieux      andrieux@kth.se
 *  
 * Feb. 2015
 *
 */

// Platform compatibility
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// NCSOUND object
var NCSOUND = {};
NCSOUND.protec = 0;
NCSOUND.context = null;
NCSOUND.source = null;
NCSOUND.analyser = null;
NCSOUND.freqNoiseLevel = -60;
NCSOUND.lastMaxDB = -100;
NCSOUND.silenceDelay = 250;// In ms
NCSOUND.lastSpokenTimestamp = null;

// Stores urls to audio files and buffers once loaded with loadSound()
NCSOUND.soundBank = [
	{
		name:'skrillex',
		url:'ncsound/sounds/skrillex.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'lindsey',
		url:'ncsound/sounds/lindsey.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'bumblebee',
		url:'ncsound/sounds/bumblebee.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'summer',
		url:'ncsound/sounds/summer.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'winter',
		url:'ncsound/sounds/winter.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'priest',
		url:'ncsound/sounds/priest.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'auction',
		url:'ncsound/sounds/auction.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'airplane',
		url:'ncsound/sounds/airplane.mp3',
		buffer:null,
		isBufferLoaded:false
	},
	{
		name:'weather',
		url:'ncsound/sounds/weather.mp3',
		buffer:null,
		isBufferLoaded:false
	},
];

/* 
 * Initializes NCSOUND audio context and analyser
 */
NCSOUND.initAudioContext = function(){
	try{
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.context = new AudioContext();
		// Create analyser
		this.analyser = this.context.createAnalyser();
	}
	catch(e){
		alert('The Web Audio API is not supported in this browser. Try using Chrome or Firefox');
	}
}

/* 
 * Fill the empty buffers of NGSOUND.soundBank with the desired sample
 * @param {Number} soundIndex Index of sound to load in NGSOUND.soundBank
 */
NCSOUND.loadSound = function(soundIndex){
	var sB = this.soundBank;
	var ctx = this.context;
	if(typeof sB[soundIndex] == 'undefined'){
		console.log("There is no such sound! U fool.")
		return;
	}
	else{
		// Returns a buffer
		var request = new XMLHttpRequest();
		request.open('GET', sB[soundIndex].url, true);
		request.responseType = 'arraybuffer';
		
		// Decode the response (asynchronously, XHR powa)
		request.onload = function(){
			ctx.decodeAudioData(request.response, function(theBuffer){
				// Fill up the sound's potentially empty buffer in soundBank
				sB[soundIndex].buffer = theBuffer;
				sB[soundIndex].isBufferLoaded = true;
				
				console.log("Sound "+soundIndex+" has been successfully loaded.");
				
			}, function(){
				// Error
				console.log("Sound could not be loaded.");
			});
		}
		request.send();
	}
}

/* 
 * Connects the sound pipeline and plays a sample from NGSOUND.soundBank
 * @param {Number} soundIndex Index of sound to play in NGSOUND.soundBank
 */
NCSOUND.playSound = function(soundIndex){
	if(!this.soundBank[soundIndex].isBufferLoaded){
		console.log("The buffer is empty, the sound might not be loaded yet.")
		return;
	}
	else{
		// Create sound source
		this.source = this.context.createBufferSource();
		
		// Assigns buffer from soundBank
		this.source.buffer = this.soundBank[soundIndex].buffer;
		
		// Create the global analyser (and connect, otherwise returns arrays filled with the same value (minDecibles))
		this.analyser = this.context.createAnalyser();
		//analyser.minDecibels = -90;// Default is -100
		//analyser.maxDecibels = -10;// Default is -30
		//analyser.smoothingTimeConstant = 0.3;// Default is 0.8
		this.source.connect(this.analyser);
		
		// Connect the source to the speakers (context destination)
		this.source.connect(this.context.destination);
		
		// Start from beginning
		this.source.start(0);
		
		console.log("Sound "+soundIndex+" has started!");
	}
}

/* 
 * Asks user permission for microphone input and connects NCSOUND.source to mike stream
 */
NCSOUND.startMikeStream = function(){
	if (navigator.getUserMedia){
		console.log('getUserMedia supported, stream about to start...');
		var self = this;
		navigator.getUserMedia(
			// Constraints: audio only
			{audio:true,video:false},
			// Success callback
			function(stream){
				// Create a MediaStreamAudioSourceNode
				self.source = self.context.createMediaStreamSource(stream);
				// Connect the global analyser
				
				self.source.connect(self.analyser);
				// And connect the whole lot to the speakers
				self.analyser.connect(self.context.destination);
			},
			// Error callback
			function(error){
				console.log('Error in getUserMedia: ' + error);
			}
		);
	}
	else{
		console.log("getUserMedia(...) failed in startMikeStream().");
	}
}

/* 
 * Starts analyzing the current source and calls NGSOUND.log()
 * @param {Object} ARTGENinstance
 */
NCSOUND.startFeedbackStream = function(ARTGENinstance){

	this.analyser.fftSize = 256;
    var bufferLength = this.analyser.frequencyBinCount;
	console.log("We are accessing the data related to "+bufferLength+" different frequencies.");
    this.dataArray = new Float32Array(bufferLength);
	
	// Start the loop
    this.log(ARTGENinstance);
}

/* 
 * Calls streamShape(...) to filter raw sound data and then draw(...). Will be replaced by an ARTGEN recieving method.
 * @param {Object} ARTGENinstance
 */
NCSOUND.log = function(ARTGENinstance){
	var self = this;
	// So that this returns NCSOUND and not window at each recursive call
	this.animFrame = requestAnimationFrame(function(){self.log(ARTGENinstance);});
	// This analyser method provides the actual data stream
	// It fills dataArray with our frequency data
	var dataArray = this.dataArray;
	this.analyser.getFloatFrequencyData(dataArray);
	
	if(++this.protec == 10){
		this.draw(ARTGENinstance,this.streamShape(dataArray,4));
		this.protec = 0;
	}
}

/* 
 * Back-end main filtering function. Provides relevant analyzed data to ARTGEN
 * @param {Array} freqData Raw frequency data
 * @param {Number} id Id that detemines which stream processing to run
 * @returns {Array} Relevant data stream for ARTGEN
 */
NCSOUND.streamShape = function(freqData,id){

	var dataStream = [];
	if (id == 1){
		// Input stream:
		// Raw frequency data
		// Output stream:
		// CSS index of which tabs to highlight, max, 2nd and 3rd max freq amplitude
		
		var max1Key = 0;
		var max2Key = 0;
		var max3Key = 0;
		var max1Val = freqData[0];
		var max2Val = freqData[0];
		var max3Val = freqData[0];
		for (key in freqData){
			// The maximum value and the corresponding index are stored
			// As well as 2nd and 3rd highest values
			if(freqData[key] > max3Val){
				max3Val = freqData[key];
				max3Key = key;
			}
			if(freqData[key] > max2Val){
				// 2nd "swaps" with 3rd
				max3Val = max2Val;
				max3Key = max2Key;
				max2Val = freqData[key];
				max2Key = key;
			}
			if(freqData[key] > max1Val){
				// 1st "swaps" with 2nd
				max2Val = max1Val;
				max2Key = max1Key;
				max1Val = freqData[key];
				max1Key = key;
			}
		}
		var nthOfKey1 = parseInt(max1Key)+1;
		var nthOfKey2 = parseInt(max2Key)+1;
		var nthOfKey3 = parseInt(max3Key)+1;
		
		// In this basic version with red vertical bars
		// the dataStream contains the index of the bars to be highlighted
		// Starting from index 1 (for CSS nth-of-type)
		dataStream = [nthOfKey1,nthOfKey2,nthOfKey3];
		
		// Console.log some samples of the frequency data
		//console.log("30th value:",freqData[29]/128);
		//console.log("60th value:",freqData[59]/128);
		//console.log("100th value:",freqData[99]/128);
		//console.log("among "+freqData.length+" values.");
	}
	else if (id == 2){
		// Input stream:
		// Raw frequency data
		// Output stream:
		// CSS pixels height of amplitude for all frequencies
		
		for (key in freqData){
			dataStream.push(freqData[key]+150);
		}
	}
	else if (id == 3){
		// Amplitude of lowest pitch frequency
		dataStream = [freqData[0]];
	}
	else if (id == 4){
		// From raw freq data to 0 or 1: silence or speech, compare max decibel value to NCSOUND.freqNoiceLevel
		// Takes NCSOUND.lastSpokenTimestamp into account
		var isSilent = true;
		for (key in freqData){
			if(freqData[key] > this.freqNoiseLevel){
				isSilent = false;
			}
		}
		// Speaking!
		if(!isSilent){
			this.lastSpokenTimestamp = new Date().getTime();
			dataStream.push(1);
		}
		// Silent!
		else{
			if(new Date().getTime() - this.lastSpokenTimestamp > 250){
				// Suddenly, silence.
				dataStream.push(0);
			}
			else{
				// The silence is too young.
				dataStream.push(1);
			}
		}
	}
	else if (id == 5){
		// From raw freq data to sound level increasing or decreasing (compared max value among freq between 2 timeframes)
		this.lastMaxDB = -100;
		for (key in freqData){
			if(freqData[key] > this.lastMaxDB){
				this.lastMaxDB = freqData[key];
			}
		}
		dataStream.push(this.lastMaxDB);
	}
	return dataStream;
}

/* 
 * Fills the DOM with a new view for sound visualization. Used to understand the underlying behavior of sound rather than drawing beautiful art.
 * @param {Number} id Id of view to be loaded as a front layer, created from scratch
 */
NCSOUND.DOMview = function(id){
	// Add layer
	jQuery('body').append("<div id='domview"+id+"'></div>")
	// Shape layer
	jQuery('#domview'+id).css('width','100%')
		.css('height','100%')
		.css('box-shadow','rgba(0,0,0,0.8) 0px 0px 15px')
		.css('margin-left','100%')
		.animate({
			'margin-left':0
		},500);
	// Simplistic view with red vertical bars to highlight major frequencies
	if(id == 1){
		//var bars = 128;
		var bars = 25;
		var wid = jQuery('body').width();
		for (var i=0;i<bars;i++){
			jQuery('#domview1').append("<div class='bar'></div>");
			jQuery('.bar').css('width',wid/bars);
		}
	}
	else if(id == 2){
		var bars = 64;
		var wid = jQuery('body').width();
		for (var i=0;i<bars;i++){
			jQuery('#domview2').append("<div class='bar'></div>");
			jQuery('.bar').css('width',wid/bars);
		}
	}
}

/* 
 * Kills a DOMview
 * @param {Number} id Id of view to be killed
 */
NCSOUND.killDOMview = function(id){
	jQuery('#domview'+id).remove();
}

/* 
 * Simplistic view with red vertical bars to highlight major frequencies
 * Assigns and removes classes in the DOM for red bar highlight
 * @param {Array} dataStream Relevant data stream for ARTGEN
 */
NCSOUND.draw = function(ARTGENinstance,dataStream){
	
	//console.log(dataStream);
	
	// Simplistic implementation with DOM elements
	// This method should bind the back-end and front-end part of our project
	/*
	// Stream type & DOMview 1
	jQuery('#domview1 .bar.focus1').removeClass('focus1');
	jQuery('#domview1 .bar.focus2').removeClass('focus2');
	jQuery('#domview1 .bar.focus3').removeClass('focus3');
	jQuery('#domview1 .bar:nth-of-type('+dataStream[0]+')').addClass('focus1');
	jQuery('#domview1 .bar:nth-of-type('+dataStream[1]+')').addClass('focus2');
	jQuery('#domview1 .bar:nth-of-type('+dataStream[2]+')').addClass('focus3');
	
	// Stream type & DOMview 2
	var bars = jQuery('#domview2 .bar').each(function(index){
		jQuery(this).css('margin-bottom',3*dataStream[index]);
	});
	// Comes with a CSS which I will upload soon.
	var haveToPutCSS = true;
	
	// Stream type 3
	var inRange = Math.min(Math.max(1+dataStream[0]/100,0),1);
	ARTGENinstance.data = inRange;
	console.log(inRange);
	*/
	// Stream type 4
	console.log(dataStream[0]);
	ARTGENinstance.data = dataStream[0];
	(dataStream[0] == 1 ? jQuery('body').css('background','white') : jQuery('body').css('background','black'));
	/*
	// Stream type 5
	var inRange = Math.min(Math.max(1+dataStream[0]/100,0),1);
	ARTGENinstance.data = inRange;
	console.log(inRange);
*/
	
}

/** On start **/
jQuery(document).ready(function(){
	
	// Could be triggered from a button.
	NCSOUND.initAudioContext();
	
	NCSOUND.loadSound(0);
	NCSOUND.loadSound(1);
	NCSOUND.loadSound(2);
	NCSOUND.loadSound(3);
	NCSOUND.loadSound(4);
	NCSOUND.loadSound(5);
	NCSOUND.loadSound(6);
	NCSOUND.loadSound(7);
	NCSOUND.loadSound(8);
	
	// In the console
	// Wait until sounds are loaded and:
	//NCSOUND.playSound(0);
	//NCSOUND.startFeedback();
	
	// Or
	
	//startMikeStream();
	// Then accept access to microphone and:
	//NCSOUND.startFeedback();
	
	// Only on my local initial index.html (Alex)
	//NCSOUND.DOMview(2);
	
	/*
	NCSOUND.DOMview(2);
	NCSOUND.playSound(3);
	NCSOUND.startFeedbackStream(leo);
	*/
});
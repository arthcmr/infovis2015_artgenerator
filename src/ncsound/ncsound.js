/**
 *  Audio JS for Art Generator
 *  Final project for KTH course DH2321 Information Visualization by M. Romero
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
NCSOUND.silenceDelay = 250; // In ms
NCSOUND.lastSpokenTimestamp = null;
NCSOUND.s = 0;
NCSOUND.t = 0;

//for StreamShape i=6
NCSOUND.previousFrequency = null;
NCSOUND.gainDifference = 10;
NCSOUND.gainLevels = 4;
NCSOUND.freqGain = 24; // the range of frequencies taken to only cover the freq range of voice (24 out of 128 with a fft of 256)

//for StreamShape i=7
NCSOUND.previousAverage = 0;
//Sound bank
NCSOUND.soundBank = {};


NCSOUND.getS = function()
{
    return this.s;
}

NCSOUND.getT = function()
{
    return this.t;
}

NCSOUND.log = function(msg) {
    //console.log(msg);
}

/* 
 * Initializes NCSOUND audio context and analyser
 */
NCSOUND.initAudioContext = function() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        // Create analyser
        this.analyser = this.context.createAnalyser();
    } catch (e) {
        alert('The Web Audio API is not supported in this browser. Try using Chrome or Firefox');
    }
}

/* 
 * Fill the empty buffers of NGSOUND.soundBank with the desired sample
 * @param {Number} soundIndex Index of sound to load in NGSOUND.soundBank
 * @param {Function} callback function to be executed after sound has loaded
 */
NCSOUND.loadSound = function(soundFile, callback) {
    var sB = this.soundBank;
    var ctx = this.context;
    var _this = this;

    // Returns a buffer
    var request = new XMLHttpRequest();
    request.open('GET', soundFile, true);
    request.responseType = 'arraybuffer';
    // Decode the response (asynchronously, XHR powa)
    request.onload = function() {
        _this.context.decodeAudioData(request.response, function(theBuffer) {

            // Fill up the sound's potentially empty buffer in soundBank
            _this.soundBank[soundFile] = {};
            _this.soundBank[soundFile].buffer = theBuffer;
            _this.soundBank[soundFile].isBufferLoaded = true;
            _this.last_sound = soundFile;

            _this.log("Sound '" + soundFile + "' has been successfully loaded.");

            //call callback if it exists
            if (_.isFunction(callback)) {
                callback();
            }

        }, function() {
            // Error
            _this.log("Sound '" + soundFile + "' could not be loaded.");
        });
    }
    request.send();
}

/* 
 * Connects the sound pipeline and plays a sample from NGSOUND.soundBank
 * @param {Number} soundIndex Index of sound to play in NGSOUND.soundBank
 */
NCSOUND.playSound = function(soundFile, callback) {

    if (!soundFile && !this.last_sound) {
        return;
    } else if (!soundFile && this.last_sound) {
        return this.playSound(this.last_sound, callback);
    } else if (soundFile && !_.has(this.soundBank, soundFile)) {
        var _this = this;
        return this.loadSound(soundFile, function() {
            _this.playSound(soundFile, callback);
        });
    }

    // Create sound source
    this.source = this.context.createBufferSource();

    // Assigns buffer from soundBank
    this.source.buffer = this.soundBank[soundFile].buffer;

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

    this.log("Sound " + soundFile + " has started!");

    if(_.isFunction(callback)) {
        callback();
    }
}

/* 
 * Asks user permission for microphone input and connects NCSOUND.source to mike stream
 * @param {Function} callback
 */
NCSOUND.startMikeStream = function(callback) {
    if (navigator.getUserMedia) {
        this.log('getUserMedia supported, stream about to start...');
        var self = this;
        navigator.getUserMedia(
            // Constraints: audio only
            {
                audio: true,
                video: false
            },
            // Success callback
            function(stream) {
                // Create a MediaStreamAudioSourceNode
                self.source = self.context.createMediaStreamSource(stream);
                // Connect the global analyser

                self.source.connect(self.analyser);
                // And connect the whole lot to the speakers
                self.analyser.connect(self.context.destination);

                if (_.isFunction(callback)) {
                    callback();
                }

            },
            // Error callback
            function(error) {
                self.log('Error in getUserMedia: ' + error);
            }
        );
    } else {
        this.log("getUserMedia(...) failed in startMikeStream().");
    }
}

/* 
 * Back-end main filtering function. Provides relevant analyzed data to ARTGEN
 * @param {Array} freqData Raw frequency data
 * @param {Number} channel Id that detemines which stream processing to run
 * @returns {Array} Relevant data stream for ARTGEN
 */
NCSOUND.streamShape = function(freqData, channel) {
    this.t++;
    var dataStream = [];
    if (channel == 1) {
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
        for (key in freqData) {
            // The maximum value and the corresponding index are stored
            // As well as 2nd and 3rd highest values
            if (freqData[key] > max3Val) {
                max3Val = freqData[key];
                max3Key = key;
            }
            if (freqData[key] > max2Val) {
                // 2nd "swaps" with 3rd
                max3Val = max2Val;
                max3Key = max2Key;
                max2Val = freqData[key];
                max2Key = key;
            }
            if (freqData[key] > max1Val) {
                // 1st "swaps" with 2nd
                max2Val = max1Val;
                max2Key = max1Key;
                max1Val = freqData[key];
                max1Key = key;
            }
        }
        var nthOfKey1 = parseInt(max1Key) + 1;
        var nthOfKey2 = parseInt(max2Key) + 1;
        var nthOfKey3 = parseInt(max3Key) + 1;

        // In this basic version with red vertical bars
        // the dataStream contains the index of the bars to be highlighted
        // Starting from index 1 (for CSS nth-of-type)
        dataStream = [nthOfKey1, nthOfKey2, nthOfKey3];

        // Console.log some samples of the frequency data
        //console.log("30th value:",freqData[29]/128);
        //console.log("60th value:",freqData[59]/128);
        //console.log("100th value:",freqData[99]/128);
        //console.log("among "+freqData.length+" values.");
    } else if (channel == 2) {
        // Input stream:
        // Raw frequency data
        // Output stream:
        // CSS pixels height of amplitude for all frequencies

        for (key in freqData) {
            dataStream.push(freqData[key] + 150);
        }
    } else if (channel == 3) {
        // Amplitude of lowest pitch frequency
        dataStream = [freqData[0]];
        this.log(freqData[0]);
    } else if (channel == 4) {
        // From raw freq data to 0 or 1: silence or speech, compare max decibel value to NCSOUND.freqNoiceLevel
        // Takes NCSOUND.lastSpokenTimestamp into account
        var isSilent = true;
        for (key in freqData) {
            if (freqData[key] > this.freqNoiseLevel) {
                isSilent = false;
            }
        }
        // Speaking!
        if (!isSilent) {
            this.lastSpokenTimestamp = new Date().getTime();
            dataStream.push(1);
        }
        // Silent!
        else {
            if (new Date().getTime() - this.lastSpokenTimestamp > 250) {
                this.s++;
                // Suddenly, silence.
                dataStream.push(0);
            } else {
                // The silence is too young.
                dataStream.push(1);
            }
        }

    } else if (channel == 5) {
        // From raw freq data to sound level increasing or decreasing (compared max value among freq between 2 timeframes)
        this.lastMaxDB = -100;
        for (key in freqData) {
            if (freqData[key] > this.lastMaxDB) {
                this.lastMaxDB = freqData[key];
            }
        }
        dataStream.push(this.lastMaxDB);

    } else if (channel == 6) {
        // Detect the change in gain in relation to the last reading (the maximum gain from one frequency among the range of voice)
        var previousFreqs = this.previousFrequency;
        if (previousFreqs == null) {
            previousFreqs = new Float32Array(this.analyser.frequencyBinCount);
            for (key in previousFreqs) {
                previousFreqs[key] = freqData[key];
            }
        }

        var maxVariation = 0;
        var keyRefMax = 0;
        var keyRefMin = 0;
        var minVariation = 0;
        var maxFreq = 0;
        var maxFreqValue = -200;

        for (key = 0; key < this.freqGain; key++) {

            var dif = freqData[key] - previousFreqs[key];
            if (dif > maxVariation) {
                maxVariation = dif;
                keyRefMax = key;
            } else if (dif < minVariation) {
                minVariation = dif;
                keyRefMin = key;
            }
            previousFreqs[key] = freqData[key];

            if (freqData[key] > maxFreqValue) {
                maxFreq = key;
                maxFreqValue = freqData[key];
            }
        }
        //console.log(maxVariation);
        //console.log(keyRefMax);
        //console.log(maxFreq);

        var gain = this.gainDifference;
        var levels = this.gainLevels;


        if (maxVariation - minVariation > 0) {
            var normGain = (maxVariation / gain) / levels;
            if (normGain < 0.25) {
                var result = 0.5;
            } else if (normGain < 0.5) {
                var result = 0;
            } else if (normGain < 0.75) {
                var result = -0.5;
            } else {
                var result = -1;
            }
        } else {
            var result = 1;
        }

        this.log(result);


        this.previousFrequency = previousFreqs;
        dataStream.push(result);
    } else if (channel == 7) {
        // Detect the average change in gain in relation to the last reading

        var avgVariation = 0;

        for (key = 0; key < this.freqGain; key++) {
            avgVariation += freqData[key];
        }

        var gain = this.gainDifference;
        var levels = this.gainLevels;

        avgVariation = avgVariation / this.analyser.frequencyBinCount;

        if (this.previousAverage == 0) {
            result = 0;
        } else {
            result = (avgVariation / this.previousAverage) - 1;
        }


        if (result < -0.1) {
            result = 1;
        } else if (result < 0.1) {
            result = 0;
        } else {
            result = -1;
        }

        this.log(result);

        this.previousAverage = avgVariation;
        dataStream.push(result);
    }
    return dataStream;
}

/* 
 * Gets data from NC Sounds
 * @param {Number} channel Id of the audio channel used by painters
 * @returns {Array} Relevant data stream
 */
NCSOUND.getData = function(channel) {

    this.analyser.fftSize = 256;

    var bufferLength = this.analyser.frequencyBinCount;
    //this.log("We are accessing the data related to " + bufferLength + " different frequencies.");

    this.dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(this.dataArray);
    return this.streamShape(this.dataArray, channel);
}

NCSOUND.initAudioContext();
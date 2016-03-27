$(document).ready(function () {

var items = ["text_area", "rate", "pitch"]
//3.ページ読み込み:保存データ取得表示  
for(i = 0; i < items.length ; i++) {
    if (localStorage.getItem(items[i])) {
        var value = localStorage.getItem(items[i]);
        $("#" + items[i]).val(value);
    }
}
var value = localStorage.getItem("lang");
//後続処理で#langではなく#lang-valueから値を持ってきているので以下の処理が必須
$("#lang-value").text(value);

var synth = window.speechSynthesis;
var inputTxt = document.getElementById("text_area");

if (inputTxt) {
    inputTxt.textContent = "Hello World!\n\nG’s Academy Tokyo";
}

var rate = document.querySelector('#rate');
var rateValue = document.querySelector('#rate-value');
rateValue.textContent = rate.value;

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('#pitch-value');
pitchValue.textContent = pitch.value;

// この時点では、selectBoxは作成されていない
var lang = document.querySelector('#lang');
var langValue = document.querySelector('#lang-value');

var voiceSelect = document.querySelector('select');
var voices = [];

var game = function () {
    var o = {};

    function populateVoiceList() {
      voices = synth.getVoices();
      voiceFlg = true;

      var selectedName = langValue.textContent.split("(")[0];          
      
      for(i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + '(' + voices[i].lang + ')';
        
        console.log(selectedName);
        
        if(voices[i].name === "Samantha" && voiceFlg) {
            option.setAttribute('selected', 'selected');
            option.textContent += ' -- DEFAULT';
        }        
        if(voices[i].name === selectedName && voiceFlg) {
            option.setAttribute('selected', 'selected');
            voiceFlg = false
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
      }
    }
    
    // ここが分からない
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    populateVoiceList();

    o.init = function () {
        $("#rate").on("input", function() {
          rateValue.textContent = rate.value;
        });
        
        $("#pitch").on("input", function() {
          pitchValue.textContent = pitch.value;
        });

        $("#lang").on("input", function() {
          langValue.textContent = lang.value;
        });

        $("#speak").on("click",function (event) {
            event.preventDefault();
            
            var utterThis = new SpeechSynthesisUtterance(inputTxt.value);            
            var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
            // 声のnameではなくて、オブジェクト(SpeechSynthesisVoice)をvoiceプロパティに代入する。
            for(i = 0; i < voices.length ; i++) {
                if(voices[i].name === selectedOption) {
                  utterThis.voice = voices[i];
                }
            }
            utterThis.rate = rate.value;
            utterThis.pitch = pitch.value;
            synth.speak(utterThis);

            utterThis.onpause = function(event) {
                console.log(event);
                var char = event.utterance.text.charAt(event.charIndex);
                console.log('Speech paused at character ' + event.charIndex + ' of "' +
                event.utterance.text + '", which is "' + char + '".');
            }
        });

        $("#pause").on("click",function () {
            speechSynthesis.pause();
        });

        $("#resume").on("click",function () {
            speechSynthesis.resume();
        });
        
        $("#cancel").on("click",function () {
            speechSynthesis.cancel();
        });
        
        //1.Save クリックイベント  
        $("#save").on("click" ,function(){        
            items = ["text_area", "rate", "pitch", "lang"]
            for(i = 0; i < items.length ; i++) {
                var value = $("#" + items[i]).val();
                console.log(value);
                localStorage.setItem(items[i], value);
            }
            $(".msg.saved").fadeIn(500).fadeOut(1000);
        }); 

        //2.clear クリックイベント  
        $("#clear").on("click" ,function(){ 
            localStorage.removeItem("memo");
            $("#text_area").val(""); 
            $(".msg.cleared").fadeIn(500).fadeOut(1000);
        }); 

        $("#clear-all").on("click" ,function(){ 
            localStorage.clear();
            $("#text_area").val(""); 
            $(".msg.cleared").fadeIn(500).fadeOut(1000);
        }); 
        
        // AUTO-SAVE
        $('#text_area').bind('keyup', function() {
            localStorage.setItem('text_area', $('#text_area').val());
        });
        
        $("#default-pitch").on("click" ,function(){ 
            pitchValue.textContent = 1;
            pitch.value =1;
        }); 

        $("#default-rate").on("click" ,function(){ 
            rateValue.textContent = 1;
            rate.value =1;
        });

        $("#sample1").on("click" ,function(){ 
            $("#text_area").val(
                "ありがとウサギ\nこんにちワン\nこんばんワニ\nさよなライオン"
            ); 
        }); 

        $("#sample2").on("click" ,function(){ 
            $("#text_area").val(
"Twinkle, twinkle, little star.\n\
How I wonder what you are.\n\
Up above the world so high,\n\
Like a diamond in the sky.\n\
Twinkle, twinkle, little star.\n\
How I wonder what you are."
            ); 
        }); 

    };
    return o;
}();
// end of "game"

game.init();
});

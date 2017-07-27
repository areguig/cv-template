var playing = false;
// init tooltips
$('[data-toggle="tooltip"]').tooltip();

$(function(){
  var newHash      = "";
  $("nav").delegate("a", "click", function() {
      window.location.hash = $(this).attr("href");
      return false;
  });

  $(window).bind('hashchange', function(){
      newHash = window.location.hash.substring(1)?window.location.hash.substring(1):"ts";
      if (newHash) {
        $("div.container > div.main-content").hide();
        $("div#"+newHash).show()
        $("nav li").removeClass("active");
        $("nav li a[href=#"+newHash+"]").parent().addClass("active");
      };
  });
  $(window).trigger('hashchange');

   $('#search').on('click', function(e){
       e.preventDefault(); // prevent the default click action
       var q = $('#query').val();
        if( !q.match('^#') &&  !q.match('^@')) {
          alert('the input should start with # or @');
          return;
        }
        console.log("query string "+ q)
       $.ajax({
           url: 'https://akli-reguig.appspot.com/twitter/search?h='+(q.match('^#')?"true":"false")+'&q='+q.substring(1),
           success: function (response) {
               console.log('https://twitter.com/'+response.user.screen_name+'/status/'+response.id_str);
               var tweet = document.getElementById("tweet");
               var id =response.id_str;
               tweet.setAttribute("tweetID",id);
               tweet.innerHTML="";
               twttr.widgets.createTweet(
                id, tweet,
                {
                  conversation : 'none',    // or all
                  cards        : 'hidden',  // or visible
                  linkColor    : '#cc0000', // default is blue
                  theme        : 'light'    // or dark
                })
              .then (function (el) {
                $body.removeClass("loading");
              });
           },
           error: function (response) {
               alert("An error occured. Search someting else. ")
               $body.removeClass("loading");
           },
       });
   });
   $body = $("body");
   $(document).on({
     ajaxStart: function() { $body.addClass("loading");    }
   });

   $("#inputUrl").val(localStorage.getItem("url"));
   $("#inputSrc").val(localStorage.getItem("src"));
   $("#inputMedium").val(localStorage.getItem("medium"));
   $("#inputCampaignName").val(localStorage.getItem("campaignName"));

     $("#clear_storage").on('click', function(e){
      localStorage.setItem("url", '');
      localStorage.setItem("src", '');
      localStorage.setItem("medium", '');
      localStorage.setItem("campaignName",'');
      location.reload();
    });

    $("#submit_cud").on('click', function(e){
      e.preventDefault();
      $("#divCubResult").hide();
      $("#divCubResultLong").hide();
      $('#copy-button').tooltip();
      new Clipboard('#copy-button');
      var res ='';

      var url = $("#inputUrl").val();
      if($('#storeUrl').is(':checked')){
        localStorage.setItem("url", url);
      }

      var src = $("#inputSrc").val();
      if($('#storeSrc').is(':checked')){
        localStorage.setItem("src", src);
      }

      var medium =$("#inputMedium").val();
      if($('#storeMedium').is(':checked')){
        localStorage.setItem("medium", medium);
      }

      var campaignName=$("#inputCampaignName").val();
      if($('#storeCampaign').is(':checked')){
        localStorage.setItem("campaignName", campaignName);
      }

      if(url && src){
        res=url+"?utm_source="+src;
        if(medium){
          res+="&utm_medium="+medium;
        }
        if(campaignName){
          res+="&utm_campaign="+campaignName;
        }
        // encode the url
        res=encodeURI(res);
        $("#cubResultLong").html(res);
          if($('#inputShortenUrl').is(':checked')){
            $.ajax({
                url:'https://akli-reguig.appspot.com/shorten',
                data:{
                    url : res
                },
                success:function successShorten (response) {
                  res=response;
                  $body.removeClass("loading");
                  $("#cubResult").val(res);
                  $("#divCubResult").show();
                  $("#divCubResultLong").show();
                },
                error:function errorShorten(response) {
                  alert("An error occured with the shortener service. ")
                  $body.removeClass("loading");
                }

              });
          }
          $("#cubResult").val(res);
          $("#divCubResult").show();
      } else {
          $("#alertMsgCub").show();
      }
      });

    $('#copy-button').on('click', function(e) {
      $('#copy-button').trigger('copied', ['Copied!']);
    });
    // Handler for updating the tooltip message.
   $('#copy-button').bind('copied', function(event, message) {
     $(this).attr('title', message)
         .tooltip('fixTitle')
         .tooltip('show')
         .attr('title', "Copy to Clipboard")
         .tooltip('fixTitle');
   });

   $('#play_samba_btn').on('click', function(e) {
     e.preventDefault();
     var audio_samba = document.getElementById('play_samba');
     if(playing){
       audio_samba.pause();
       audio_samba.currentTime = 0;
      playing=false;
    } else {
      audio_samba.play();
      playing = true;
    }
   });
   cheet('s a m b a', function () {
     var audio_samba = document.getElementById('play_samba');
     if(playing){
       audio_samba.pause();
       audio_samba.currentTime = 0;
      playing=false;
    } else {
      audio_samba.play();
      playing = true;
    }
  });

  var mc = new Hammer.Manager(document.getElementById('main_container'));
mc.add( new Hammer.Tap() );
mc.add( new Hammer.Tap({ event: 'quadrupletap', taps: 4 }) );
mc.get('quadrupletap').recognizeWith('tap');


  mc.on("quadrupletap", function(ev) {
    var audio_samba = document.getElementById('play_samba');
    if(playing){
      audio_samba.pause();
      audio_samba.currentTime = 0;
     playing=false;
   } else {
     audio_samba.play();
     playing = true;
   }
  });
});

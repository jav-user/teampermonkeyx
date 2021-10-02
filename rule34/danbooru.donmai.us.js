// ==UserScript==
// @name         danbooru Thumbs Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://danbooru.donmai.us/posts?tags=*
// @match        https://danbooru.donmai.us/posts?page=*
// @icon         https://www.google.com/s2/favicons?domain=donmai.us
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.5/lockr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    Lockr.prefix="danbooru_";

    const container="article.post-preview > a";

   const styles =`
   article.post-preview,article.post-preview a,  article.post-preview picture {
      width:300px !important;
      height: 400px !important;

       position:relative !important;
       padding:5px !important;

     }
     article.post-preview img {
       max-width:100% !important;
       max-height:100% !important;

     }

    article.post-preview:hover {

      z-index:999;

     }

     article.post-preview img:hover {
      -webkit-transform: scale(2);
      z-index:999;

     }


     .nblacklisted {
       opacity: 0.1;
     }

     .nblacklisted:hover {
       opacity: 0.5;
     }
`;

    // Your code here...

    const thumbs = Array.from($(container));


    const blacklisted =`

    male_focus
    2boys`
    .split("\n").map(tag=>tag.trim()).filter(el=>el);

    async function getThumbs(callback){
    for(let thumb of thumbs){
          $(thumb).attr("target","_blank");
         const imgID = CryptoJS.MD5(thumb.href).toString();
        callback(thumb);
        const image = Lockr.get(imgID);

        console.log("image", image);

        if(image){
         $(thumb).find("img").attr("src",image);
            continue;
        }
        await $.get(thumb.href)
            .then((res)=>{
              let image = $(res).find("#image")[0];
              if(image){

                    let src = image.src;
              console.log(imgID, src);
                  Lockr.set(imgID, src);

                  $(thumb).find("img").attr("src",src);
              }

        })
    }
    }

    function addStyles(){
     $("body").append(`<style>${styles}</style>`);
    }
  
    addStyles();

    $(document).ready(function(){

    	  getThumbs(function(thumb){
      $(thumb).find("source").remove();
        if(blacklisted.some(tag=>$(thumb).find("img").attr("title").split(" ").indexOf(tag)!=-1))
        {
          $(thumb).find("img").addClass("nblacklisted");
        };

    });
    })
})();







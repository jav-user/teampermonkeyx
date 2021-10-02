// ==UserScript==
// @name        Gelbooru Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gelbooru.com/index.php?page=post*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.5/lockr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @icon         https://www.google.com/s2/favicons?domain=gelbooru.com
// @grant        none
// ==/UserScript==

//https://gelbooru.com/index.php?page=post&s=list&tags=bulma+&pid=3192
(function () {
	"use strict";
	Lockr.prefix = "gelbooru_v1.0";
	// Your code here...

	const styles = `
		.thumbnail-preview, .thumbnail-preview a  {
			width:300px !important;
			height:400px !important;
			position:relative !important;
       		padding:5px !important;
		}

		.thumbnail-preview img {
			max-width:100% !important;
			max-height:100% !important;
		}

		.thumbnail-preview hover, .thumbnail-preview a:hover{
			z-index:999;
		}

		.thumbnail-preview img:hover{
			-webkit-transform: scale(2);
      		transition-duration: 1s;
      		z-index:999;
		}

		.nimage{
			border:1px solid green;
		}
		`;

	async function changeImages() {
		const $articles = $("article");
		for (const article of $articles) {
			const url = $(article).find("a").prop("href");
			const id = CryptoJS.MD5(url).toString();
			let imageFull =
				Lockr.get(id) ||
				(await $.get(url).then((html) =>
					$(html).find("#image").prop("src")
				));

			const $img = $(article).find("img");

			if (imageFull) {
				$img.prop("src", imageFull);
				Lockr.set(id, imageFull);
				$img.addClass("nimage");
			}
			//const tags = $img.attr("title");

			// $img.removeAttr("title");

			// $img.after(`<small>${tags}</small>`);
		}
	}

	function addStyles() {
		$("body").append("<style>" + styles + "</style>");
	}

	$(document).ready(function () {
		addStyles();
		changeImages();
	});
})();
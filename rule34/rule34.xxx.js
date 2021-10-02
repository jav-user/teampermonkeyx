// ==UserScript==
// @name         Rule34 Thumbs Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://rule34.xxx/index.php?page=post*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.5/lockr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require		 https://nesmdev.github.io/ndev/dist/ndev.1.0.7.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	Lockr.prefix = "rule34.xxx_v2.2";

	const container = "span.thumb > a";

	const styles = `
   span.thumb,span.thumb a,  span.thumb picture {
      width:300px !important;
      height: 400px !important;

       position:relative !important;
       padding:5px !important;

     }
     span.thumb img {
       max-width:100% !important;
       max-height:100% !important;

     }

    span.thumb:hover {

      z-index:999;

     }

     span.thumb img:hover {
      -webkit-transform: scale(2);
      transition-duration: 1s;
      z-index:999;

     }


     .nblacklisted {
       opacity: 0.1;
     }

     .nblacklisted:hover {
       opacity: 0.5;
     }

     .noriginal {
     	border: 3px solid green;
     }
`;

	// Your code here...

	const thumbs = Array.from($(container));

	const blacklisted = `

    male_focus
    2boys`
		.split("\n")
		.map((tag) => tag.trim())
		.filter((el) => el);

	async function getThumbs(callback) {
		for (let thumb of thumbs) {
			$(thumb).attr("target", "_blank");
			const imgID = CryptoJS.MD5(thumb.href).toString();
			callback(thumb);
			const image = Lockr.get(imgID);

			console.log("image", image);

			if (image) {
				$(thumb).find("img").attr("src", image.sample);
				$(thumb)
					.find("img")
					.on("mouseover", function () {
						$(this).attr("src", image.original);
						$(this).addClass("noriginal");
					})

				continue;
			}
			await $.get(thumb.href).then((res) => {
				let $image = $(res).find("#image")[0];
				if ($image) {
					let original = getOriginalImage(res);

					console.log("original", original);
					// let src = image.src;

					let image = {
						sample: $image.src,
						original: original,
					};

					console.log(imgID, image);
					Lockr.set(imgID, image);

					$(thumb).find("img").attr("src", image.sample);

					$(thumb)
						.find("img")
						.on("mouseover", function () {
							$(this).attr("src", image.original);
							$(this).addClass("noriginal");
						});
					// $(thumb).append(`<a href="${image.original}">original</a>`)
				}
			});
		}
	}

	function addStyles() {
		$("body").append(`<style>${styles}</style>`);
	}

	function getOriginalImage(html) {
		const scripts = new nhtml(html)
			.getScriptsText()
			.filter((script) => script.includes("image "));
		let script = scripts[0];
		if (!script) return null;

		let image = null;
		eval(script);
		if (!image) return null;

		return `${image.domain}/${image.base_dir}/${image.dir}/${image.img}`;
	}

	addStyles();

	$(document).ready(function () {
		getThumbs(function (thumb) {
			$(thumb).find("source").remove();
			if (
				blacklisted.some(
					(tag) =>
						$(thumb)
							.find("img")
							.attr("title")
							.split(" ")
							.indexOf(tag) != -1
				)
			) {
				$(thumb).find("img").addClass("nblacklisted");
			}
		});
	});
})();

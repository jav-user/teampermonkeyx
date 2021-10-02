// ==UserScript==
// @name         E-Hentai Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://e-hentai.org/g/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require		 https://nesmdev.github.io/ndev/dist/ndev.1.0.7.js
// @icon         https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	let images = [];
	let urls = Array.from($(".gdtl a")).map((a) => a.href);

	let title = $("#gn").text().trim();

	async function getImages() {
		for (var i in urls) {
			const url = urls[i];

			$("#get-images").text(
				`Getting image ${+i + 1} of ${urls.length}...`
			);
			await getImage(url, i);
		}

		console.log(images.join("\n"));
		$("#get-images").text("Done!!");
	}

	function copyImages() {
		new nstring(images.join("\n")).copy();
		alert(urls.length + " images copied!!");
	}

	function getImage(url, i) {
		var num = `00000000000000${i + 1}`.substr(-5);
		return $.get(url).then((res) => {
			const src = $(res).find("#img").attr("src");
			const image = `nddown "${src}==${num}" "${title} ${urls.length}pp" "${window.location.hostname}"`;
			images.push(image);
			console.log(image);
		});
	}

	function createGUI() {
		const $gui = $("<div></div>");
		$gui.append(
			$(`<button id="get-images">get-images</button>`).on(
				"click",
				getImages
			)
		).append($(`<button>copy-images</button>`).on("click", copyImages));

		$("#gn").after($gui);
	}

	$(document).ready(createGUI);
})();

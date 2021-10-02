// ==UserScript==
// @name         hentaidexy chapter script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hentaidexy.com/read/*/chapter*
// @icon         https://www.google.com/s2/favicons?domain=hentaidexy.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @require 	 https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js?v=1
// @grant        none
// ==/UserScript==

function ndFolder(images, title, opt) {
	const num = (i) => ("00000" + i).substr(-5);

	const host = (opt && opt.host) || window.location.hostname;
	const pages = images.length;
	// const tags = opt.tags_ ? "[" + opt.tags_.join(" ") + " ]" : "";

	return images.map(
		(url, i) =>
			`nddown "${url}==${num(i + 1)}" "${title} ${pages}pp" "${host}"`
	);
}

(function () {
	"use strict";

	// Your code here...

	function getChapter() {
		const urls = Array.from($(".reading-content img")).map(
			(img) => img.src
		);
		const title_ = $("#chapter-heading").text().trim();
		const title = new nstring(title_).validFileName();
		const lines = ndFolder(urls, title).join("\n") + "\n";
		console.log(lines);

		new nstring(lines).copy2();

		alert(urls.length + " lines copied!!");
	}

	$(document).ready(function () {
		$("body").prepend(`<button id="ncopy">copy chapter</button>`);

		$("#ncopy").on("click", getChapter);
	});
})();

// ==UserScript==
// @name         hentaidexy manga
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hentaidexy.com/read/*/
// @icon         https://www.google.com/s2/favicons?domain=hentaidexy.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require 	 https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js?v=1
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	let Lines = [];
	let Chapters = 0;
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

	const copySelected = () => {
		// console.log(Lines);
		new nstring(Lines.join("\n") + "\n").copy2();
		alert(Chapters + " chapters copied!!");
	};

	const getSelected = async () => {
		Lines = [];
		Chapters = 0;
		const $chapters = $($(".nchapter:checked").get().reverse());
		$("#ntext").text(`Starting...`);
		let i = 0;
		for (const chapter of $chapters) {
			const $chapter = $(chapter).parent();
			const url = $chapter.find("a").prop("href");

			const lines = await $.get(url).then((html) => {
				const urls = Array.from(
					$(html).find(".reading-content img")
				).map((img) => img.src);
				const mangaTitle = $("h1").text().trim();
				const mangaChapter = $(html).find("h1").text().trim();
				const title =
					new nstring(mangaTitle).validFileName() +
					"/" +
					new nstring(mangaChapter).validFileName();
				$("#ntext").text(
					`Getting ${title}. (${i + 1} of ${$chapters.length} done!!)`
				);
				Chapters++;
				console.log(title);
				const lines = ndFolder(urls, title);
				return lines;
			});

			Lines = [...Lines, ...lines];
		}
		$("#ntext").text(`${$chapters.length} chapters finished!!`);
	};

	const createGUI = () => {
		$(".wp-manga-chapter").each((i, el) =>
			$(el).append(`<input class="nchapter" type="checkbox"/>`)
		);

		$(".nchapter").on("change", function () {
			const checked =
				$(".nchapter").length === $(".nchapter:checked").length;
			$("#nselect-all").prop("checked", checked);
		});
		$(".main.version-chap.volumns").before(
			`
			<input type="checkbox" id="nselect-all"/> select-all 
			<button id="nget-selected">get selected</button>
			<button id="ncopy">copy selected</button>
			<p id="ntext"></p>
			<hr/>`
		);

		$("#ncopy").on("click", copySelected);
		$("#nget-selected").on("click", getSelected);

		$("#nselect-all").on("change", function () {
			const checked = $(this).prop("checked");
			$(".nchapter").prop("checked", checked).trigger("change");
		});
	};
	$(document).ready(function () {
		setTimeout(createGUI, 5 * 1000);
	});

	// Your code here...
})();

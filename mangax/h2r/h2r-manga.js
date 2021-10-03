// ==UserScript==
// @name         H2R Manga 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://hentai2read.com/*
// @exclude      https://hentai2read.com/hentai-list/*
// @exclude      https://hentai2read.com/bookmark/favorite/all/*
// @exclude      https://hentai2read.com/
// @exclude      https://hentai2read.com/download/*
// @icon         https://www.google.com/s2/favicons?domain=hentai2read.com
// @require      https://jav-user.github.io/teampermonkeyx/mangax/h2r/h2r.common.js?v1.0.3
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function getManga() {
		const $author = $("li.text-primary:contains(Author) a");

		const $artist = $("li.text-primary:contains(Artist) a");

		const categories = Array.from(
			$("li.text-primary:contains(Category) a").add(
				$("li.text-primary:contains(Content) a")
			)
		).map((c, i) => {
			return {
				category: $(c).text().trim().toLowerCase(),
				//$el: $(c),
				url: $(c).prop("href"),
			};
		});

		const tags = getTagsFromCategories(categories);

		const Manga = {
			id: $("div[data-manga-id]").attr("data-manga-id"),
			//$container: $(el),
			//$item: $(el).find(".book-grid-item"),
			title: $("title").text().split("(Original)")[0].trim(),
			url: window.location.href,
			bookmarked: $("span.hidden-xs")
				.text()
				.trim()
				.includes("bookmarked"),
			pages: +$("li.text-primary:contains(Page)")
				.find("a")
				.text()
				.replace("pages", "")
				.trim(),
			categories: categories,
			tags: tags,
			author: $author.text().trim(),
			author_url: $author.prop("href"),
			artist: $artist.text().trim(),
			artist_url: $artist.prop("href"),
			uncensored: categories.some(
				(c) => c.category.toLowerCase() === "un-censored"
			),
			censored: categories.some(
				(c) => c.category.toLowerCase() === "censored"
			),
			pcensored: categories.some(
				(c) => c.category.toLowerCase() === "partial censorship"
			),
		};

		if (Manga.pages > 60) {
			Manga.tags.push("long");
		} else if (Manga.pages < 30) {
			Manga.tags.push("short");
		}
		return Manga;
		//console.log(JSON.stringify(Manga));
	}

	function addParamsToChaptersDownloadUrls(Manga) {
		const $chapters = $(".nav-chapters .media a.btn-circle");
		$chapters.each((i, ch) => {
			const url = new URL($(ch).prop("href"));
			const params = url.searchParams;
			params.append("tags", Manga.tags);
			params.append("author", Manga.author);
			params.append("artist", Manga.artist);
			params.append("pages", Manga.pages);
			params.append("title", Manga.title);

			console.log("url", url.toString());
			$(ch).prop("href", url.toString());
		});
	}

	$(document).ready(function () {
		const Manga = getManga();
		addParamsToChaptersDownloadUrls(Manga);
	});
})();

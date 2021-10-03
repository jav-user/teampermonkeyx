// ==UserScript==
// @name         H2R Search 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hentai2read.com/hentai-list/*
// @match        https://hentai2read.com/bookmark/favorite/all/*
// @match        https://hentai2read.com/
// @icon         https://www.google.com/s2/favicons?domain=hentai2read.com
// @require      https://jav-user.github.io/teampermonkeyx/mangax/h2r/h2r.common.js?v1.0.1

// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const Mangas = {};

	function getMangas() {
		Array.from($(".book-grid-item-container")).map((el) => {
			const categories = Array.from($(el).find(".cat-container a")).map(
				(a) => {
					return {
						category: $(a).text().trim().toLowerCase(),
						$el: $(a),
						url: $(a).prop("href"),
					};
				}
			);

			const tags = getTagsFromCategories(
				categories,
				function ($category, tag) {
					const isFavorite = favoriteTags.includes(tag);
					if (isFavorite) {
						$category.addClass("nfavorite-tag");
					} else {
						$category.addClass("nmatched-tag");
					}

					console.log("category", $category.text());
				}
			);
			const id = $(el).data("mid");
			const Manga = {
				id: id,
				$container: $(el),
				$item: $(el).find(".book-grid-item"),
				title: $(el).find(".title").text().trim(),
				url: $(el).find(".title").prop("href"),
				bookmarked: $(el)
					.find(".book-grid-item")
					.hasClass("bookmarked"),
				pages: +$(el)
					.find("button:contains(pages)")
					.text()
					.replace("pages", "")
					.trim(),
				categories: categories,
				tags: Object.values(tags)
					.filter((v, i, a) => a.indexOf(v) === i)
					.sort(),
				author: $(el).find(".overlay-sub a").eq(0).text().trim(),
				uncensored: categories.some(
					(c) => c.category === "un-censored"
				),
				censored: categories.some((c) => c.category === "censored"),
				pcensored: categories.some(
					(c) => c.category === "partial censorship"
				),
			};
			const $item = Manga.$item;
			const $cont = Manga.$container;

			const favs = {};
			Manga.tags.forEach((tag) => {
				if (favoriteTags.includes(tag)) {
					favs[tag] = true;
				}
			});

			console.log("favs", favs);
			const numfavs = Object.keys(favs).length;
			$item
				.toggleClass("nbookmarked", Manga.bookmarked)
				.toggleClass("nnot-bookmarked", !Manga.bookmarked)
				// .toggleClass("nuncensored",Manga.uncensored)
				// .toggleClass("ncensored",Manga.censored)
				//  .toggleClass("npcensored",Manga.pcensored)
				.toggleClass("nfavorite", numfavs > 1);

			$item
				.find("picture")
				.append("<span class='nlabel-right'></span>")
				.append("<span class='nlabel-left'></span>")
				.append("<span class='nlabel-bright'></span>");

			$item.find(".move-to.text-center").remove();

			if (Manga.author && Manga.author.toLowerCase() !== "unknown") {
				$item
					.find(".nlabel-bright")
					.append(
						`<span class='ntext ntext-author'>${Manga.author}</span>`
					);
			}

			if (Manga.pages && Manga.author.toLowerCase() !== "unknown") {
				$item
					.find(".nlabel-bright")
					.append(
						`<span class='ntext ntext-pages'>${Manga.pages}pp</span>`
					);
			}

			if (Manga.uncensored) {
				$item
					.find(".nlabel-right")
					.append("<span class='ntext ntext-unc'>UNC</span>");
			}

			if (Manga.pcensored) {
				$item
					.find(".nlabel-right")
					.append("<span class='ntext ntext-pcen'>PCEN</span>");
			}

			if (Manga.censored) {
				$item
					.find(".nlabel-right")
					.append("<span class='ntext ntext-cen'>CEN</span>");
			}

			if (Manga.bookmarked) {
				$item
					.find(".nlabel-right")
					.append("<span class='ntext ntext-hold'>HOLD</span>");
				//✔
			}

			if (numfavs > 1) {
				$item
					.find(".nlabel-left")
					.append(`<span class='ntext ntext-fav'>${numfavs}</span>`);
			}

			Mangas[id] = Manga;
		});
	}

	function addStyles() {
		$("body").append(`<style>



.nmatched-tag{
color:white !important;
background-color: black !important;
}

.nfavorite-tag{
color:yellow !important;
text-transform: uppercase;
background-color: black !important;
}




.nfavorite {
border-width:6px;
border-style:solid;
border-color: yellow;
}

.nbookmarked{
border-width:6px;
border-style:solid;
border-color:green;

border-radius:10px;
opacity:.9;

}


picturee{

position: relative;
  text-align: center;
  color: white;

}


picture .nlabel-left{
  position: absolute;
  top: 8px;
  left: 16px;
  font-weight:bold;


  height: 25px;
  width: 25px;
}
picture .nlabel-right{
  position: absolute;
  top: 8px;
  right: 16px;
  font-weight:bold;
}

picture .nlabel-bright{
  position: absolute;
  bottom: 40px;
  right: 16px;
  font-weight:bold;
}

picture .ntext{
 padding:3px;
 border-radius:5px;
 border: 1px solid white;
 font-size:25px;

}
picture .ntext-unc{
  background-color:blue;
  color:white;

}

picture .ntext-cen{
  background-color:red;
  color:white;

}
picture .ntext-author{
  background-color:white;
  color:black;
  border-color:black;

}

picture .ntext-pages{
  background-color:white;
  color:black;
  border-color:black;
  font-size:20px;
}

picture .ntext-pcen{
  background-color:purple;
  color:white;

}

picture .ntext-hold{
  background-color:green;
  color:white;

 border-color:black;
}

picture .ntext-fav{

  background-color:yellow;
  color:black;
  font-size:30px;

border-color:black;



}
</style>`);
	}

	$(document).ready(function () {
		getMangas();
		console.log(Mangas);

		addStyles();
	});
})();

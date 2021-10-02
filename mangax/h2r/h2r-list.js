// ==UserScript==
// @name         H2R Search 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hentai2read.com/hentai-list/*
// @match        https://hentai2read.com/
// @icon         https://www.google.com/s2/favicons?domain=hentai2read.com
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	const Mangas = {};

	const favoriteTags = [
		"lovey",
		"incest",
		"bath",
		"beach",
		"school",
		"virgin",
	];
	const Tags = {
		cen: ["censored"],
		pcen: ["partial censorship"],
		unc: ["un-censored"],
		busty: ["big breasts"],
		slim: ["small breasts"],
		one: ["oneshot"],
		lovey: ["happy sex", "romance", "*become lovers"],
		virgin: ["virgin*", "defloration"],
		serie: ["serialized"],
		milf: ["milf*"],
		cream: ["creampie"],
		ntr: ["cheating", "infidelity", "netorare"],
		bath: ["bath*"],
		shota: ["shotacon"],
		school: ["*school*", "*student*"],
		incest: ["incest", "*sister*", "*brother*", "*sibling*", "cousins"],
		sis: ["*sister*"],
		bro: ["*brother*"],
		sibl: ["*sibling*", "*sister*", "*brother*", "cousins"],
		xray: ["x-ray"],
		harem: ["harem"],
		sed: ["seduction"],
		loli: ["lolicon"],
		lesb: ["yuri*"],
		korean: ["webtoon", "korean comic"],
		rape: ["rape", "sexual abuse"],
		swap: ["gender bender"],
		doujin: ["doujinshi"],
		ecchi: ["ecchi"],
		anime: ["adapted to h-anime"],
		vr: ["virtual reality"],
		twin: ["twin*"],
		swim: ["swimsuit*", "bikini"],
		shy: ["shy characters"],
		friends: ["*friends*", "co-workers"],
		idol: ["idols"],
		spring: ["hot springs"],
		teen: ["*younger female"],
		color: ["full color"],
		beach: ["beach"],
	};

	/*
	word: palabra con la que coincidir
	query: query que se va a buscar (ej. *contiene*, empiezacon*, *terminacon) 
*/
	const nmatch1 = (word, query) => {
		const first = query.substr(0, 1);
		const last = query.substr(-1);
		let rx = query.replaceAll("*", "");
		if (first !== "*") rx = "^" + rx;
		if (last !== "*") rx = rx + "$";
		return word.match(rx);
	};

 

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

			const tags = [];

			categories.forEach((cat) => {
				const category = cat.category;
				for (let tag in Tags) {
					const words = Tags[tag];
					console.log(words);
					const match = words.some((word) => nmatch1(category, word));

					if (match) {
						if (favoriteTags.includes(tag)) {
							cat.$el.addClass("nfavorite-tag");
						}

						tags.push(tag);
					}
				}
			});
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
				.append("<span class='nlabel-left'></span>");
			if (numfavs > 1) {
				$item
					.find(".nlabel-left")
					.append(`<span class='ntext ntext-fav'>${numfavs}</span>`);
			}

			if (Manga.bookmarked) {
				$item
					.find(".nlabel-left")
					.append("<span class='ntext ntext-hold'>✔</span>");
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

			Mangas[id] = Manga;
		});
	}

	function addStyles() {
		$("body").append(`<style>


.nfavorite-tag{
color:yellow !important;
}


.nbookmarked{
border-width:5px;
border-style:solid;
border-color:white;
opacity:.6;
border-radius:10px;

}

.npcensored .title-text {

background-color: gray;
  color:white;
}
.ncensored .title-text{
  background-color: #ff9bce;
  color:black;
}

.nuncensored .title-text {
  background-color: #67beee;

  color:black;
}



.nfavorite {
border-width:5px;
border-style:solid;
border-color: yellow;
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

picture .ntext{
 padding:3px;
 border-radius:5px;
 border: 1px solid white;

}
picture .ntext-unc{
  background-color:blue;
  color:white;

}

picture .ntext-cen{
  background-color:red;
  color:white;

}

picture .ntext-pcen{
  background-color:purple;
  color:white;

}

picture .ntext-hold{
  background-color:green;
  color:white;
 border-radius:10px;
 padding:6px;
 border-color:black;
}

picture .ntext-fav{

  background-color:yellow;
  color:black;


  border: 3px solid black;


}
</style>`);
	}

	$(document).ready(function () {
		getMangas();
		console.log(Mangas);

		addStyles();
	});
})();

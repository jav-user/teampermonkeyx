// ==UserScript==
// @name         VK Vids
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match https://vk.com/search*
// @match https://vk.com/videos*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @require
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	var $ = jQuery.noConflict();
	var nid = 0;
	var sort_order = false;
	// Your code here...

	function copySelected() {
		var selections = [];
		$(".nselectv:checked").each((i, selection) => {
			selections.push($(selection).val());
		});
		new nstring(selections.join("\n")).copy();
		alert(selections.length + " links copied!");
	}

    const blacklistedChannels=[
        "/public182565805",//Bananas Ardientes
        "/censurando",
        "/club187896970",
    ];

	function createGUIHeader() {
		const header = `<div>
      <input id="nselectv"
      type="checkbox"/> Select All
      <button type="button" id="sort-videos">sort</button>
      <button type="button" id="copy-selected">copy selected</button>

    </div>`;

		if ($("#search_header").length) {
			$("#search_header").before(header);
		} else if ($(".ui_search_new").length) {
			$(".ui_search_new").before(header);
		}

		$("#nselectv").on("change", function () {
			var checked = this.checked;
			console.log("checked", checked);
			$(".nselectv:not(.nblacklisted)")
				.prop("checked", checked)
				.trigger("change");
		});

		$("#copy-selected").on("click", copySelected);
		$("#sort-videos").on("click", sortVideos);
	}

	function sortVideos() {
		$(".video_item")
			.sort(function (a, b) {
				var A = $(a).data("seconds");
				var B = $(b).data("seconds");

				return parseInt(A) < parseInt(B);
			})
			.appendTo($(".video_item").eq(0).parent());

		console.log($(".video_item.ndev").eq(0).parent());
	}

	function createGUIItems() {
		var $items = $(".video_item:visible:not(.ndev)");
		if (!$items) return false;
		if (!$items.length) return false;
        $("a.video_item_title").each((i,a)=>$(a).attr("title",$(a).text()))

		$items.each((i, item) => {
			var time = $(item)
				.find(".video_thumb_label_item")
				.text()
				.trim()
				.split(":");
			var seconds = 0;
			time.reverse().forEach((num, i) => {
				seconds += num * Math.pow(60, i);
			});

			$(item).attr("data-seconds", seconds);
			$(item).attr("data-nid", nid);
			nid++;
			var title = $(item).find(".video_item_title").text().trim();
			var url = $(item).find(".video_item_title").prop("href").trim();
			var _title = $(item).find("a").text().toLowerCase();

			$(item)
				.append(
					$(`
						<div
						    title="Select ${title}"
						    class="ndev"
						    >
						    <input
						      data-item="${$(item).attr("id")}"
						      value="${url}"
						      class="nselectv"
						      type="checkbox"/>Seleccionar
						  <button class="copy-selected">copy selected</button>
  						</div>`)
						.hide()
						.fadeIn(1000)
				)
				.addClass("ndev");

            //$(item).css("opacity", 2);
            //$(item).find(".video_item_thumb_wrap").css("opacity",);
			//$(item).find(".video_item_thumb").css({opacity:1,filter:"brightness(200%)"});

            const channel = new URL($(item).find(".video_item_author a").prop("href")).pathname;
			if (
				new nstring(_title).includesSome([
					"gay",
					"transs",
					"boyfun",
					"men.com",
					"naked papis",
					"naked sword",
					"nakedsword",
					"tranny",
					"shemale",
					"[men]",
					"[staxus]",
					"helixstudios",
					"twink deluxe ",
				])
                || blacklistedChannels.indexOf(channel) !=-1
			) {
				$(item).find(".video_item_thumb").css("opacity", 0.1);
				$(item).find("a").css("color", "gray");
				$(item).find(".nselectv").addClass("nblacklisted");
			}
		});
		if (
			!$(".nselectv:not(.nfunction)") ||
			!$(".nselectv:not(.nfunction)").length
		)
			return false;
		$(".nselectv:not(.nfunction)").each((i, select) => {
			var $item = $("#" + $(select).attr("data-item"));
			//console.log($item)

			$(select).on("change", function () {
				var checked = this.checked;
				$item.toggleClass("nchecked", checked);
				$(select).parent().toggleClass("nchecked", checked);
				var selected = $(".nselectv:checked").length;
				$("#copy-selected").text(`copy selected (${selected})`);
			});
			$(select).addClass("nfunction");
		});

		$(".copy-selected:not(.nfunction)")
			.on("click", copySelected)
			.addClass("nfunction");
	}

	function createStyles() {
		$("body").append(`<style>
.nchecked{
  //background-color: #cce9ff !important;
  background-color: gray !important;
  color: white !important;
}
.video_item_thumb2 {
  opacity: 1 !important;
  filter: brightness(200%) !important;
  border-radius:50px !important;
}

</style>`);
	}

	$(document).ready(() => {
		//$(".video_item.video_can_add").fadeOut(2000)
		createGUIHeader();

		setInterval(() => {
			createGUIItems();

			//        $(".video_item.video_can_add").remove()
		}, 5 * 1000);

		createStyles();
	});
})();
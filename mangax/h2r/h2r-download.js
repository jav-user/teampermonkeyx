// ==UserScript==
// @name         H2R Download 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hentai2read.com/download/?file=*
// @require       https://nesmdev.github.io/ndev/dist/ndev.1.0.9.js
// @icon         https://www.google.com/s2/favicons?domain=hentai2read.com
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// Your code here...

	function downloadFn(filename) {
		var downloadUrls = [],
			downloadNames = [],
			currentIndex = 0,
			zip,
			zipName = "hentai2read.zip",
			progessContainer = $("#progessContainer"),
			progressBar = $("#progressbar");

		var $btn = $("#dl-button")
			.clone()

			.on("click", function () {
				$(this).data("name", filename);

				if (!JSZip.support.blob) {
					progessContainer
						.show()
						.html(
							'<b class="text-danger">(not supported on this browser)</b>'
						);
					return false;
				}

				var data = $(this).data(),
					count = 1;
				progessContainer.show();
				ARFfwk.doAjax.call(
					{
						controller: "manga",
						action: "download",
						mangaId: data.manga,
						path: data.path,
					},
					function (r) {
						downloadUrls = [];
						downloadNames = [];
						$.each(r.images, function (i, image) {
							downloadUrls.push(
								"//static.hentaicdn.com/hentai" + image
							);
							downloadNames.push(pad(count, 3) + ".jpg");
							count++;
						});
						zip = new JSZip();
						currentIndex = 0;
						if (data.name) {
							zipName = data.name + ".cbz";
						}
						downloadNextImage();
					}
				);
			});

		$("#dl-button")
			.after($btn.removeClass("btn-success").addClass("btn-primary"))
			.remove();

		function pad(str, max) {
			str = str.toString();
			return str.length < max ? pad("0" + str, max) : str;
		}
		function downloadNextImage() {
			ajaxDownloadBlob(downloadUrls[currentIndex], imageDownloaded);
		}
		function imageDownloaded(data) {
			var percentage = Math.round(
				((currentIndex + 1) / downloadUrls.length) * 100
			);
			progressBar
				.css("width", percentage + "%")
				.text(percentage + "%")
				.attr("aria-valuenow", percentage);
			zip.file(downloadNames[currentIndex], data, { base64: true });
			if (++currentIndex >= downloadUrls.length) {
				zip.generateAsync({ type: "blob" }).then(function (content) {
					saveAs(content, zipName);
					progressBar.text("Completed!!");
					Cookies.set("download", downloadCount++, {
						expires: 1,
						path: "/",
					});
				});
			} else {
				downloadNextImage();
			}
		}
		function ajaxDownloadBlob(url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					callback(this.response);
				}
			};
			xhr.open("GET", url);
			xhr.responseType = "arraybuffer";
			xhr.send();
		}
	}

	function getFileName() {
		const p = new URLSearchParams(window.location.search);
		const name = "";
		const tags = p.get("tags") && p.get("tags").split(",");
		const title = p.get("title") || "";

		const author = p.get("author") || "";
		const artist = p.get("artist") || "";
		const authors = new narray([author, artist])
			.unique()
			.value()
			.filter((a) => a !== "Unknown");

		const pages = p.get("pages");

		const filename = `${title || name} [${authors.join(", ")}] [${tags.join(
			", "
		)}] ${pages}pp`.replaceAll("[]", "");

		console.log("filename", filename);
		return new nstring(filename).validFileName();
	}

	$(document).ready(function () {
		const filename = getFileName();
		$(".push-15-t.push-5").text(filename);
		setTimeout(() => {
			downloadFn(filename);
		}, 0 * 1000);

		setTimeout(() => {
			$("#dl-button").trigger("click");
		}, 5 * 1000);
	});
})();

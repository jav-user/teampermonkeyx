const favoriteTags = [
	"lovey",
	"incest",
	"bath",
	"beach",
	"school",
	"virgin",
	"loli",
	"shota",
];
const Tags = {
	anime: ["adapted to h-anime"],
	bath: ["bath*"],
	beach: ["beach"],
	bro: ["*brother*"],
	busty: ["big breasts"],
	cen: ["censored"],
	color: ["full color"],
	cream: ["creampie"],
	doujin: ["doujinshi"],
	ecchi: ["ecchi"],
	friends: ["*friends*", "co-workers"],
	harem: ["harem"],
	idol: ["idols"],
	incest: ["incest", "*sister*", "*brother*", "*sibling*", "cousins"],
	korean: ["webtoon", "korean comic"],
	lesb: ["yuri*"],
	loli: ["lolicon"],
	lovey: ["happy sex", "romance", "*become lovers"],
	milf: ["milf*"],
	ntr: ["cheating", "infidelity", "netorare"],
	one: ["oneshot"],
	pcen: ["partial censorship"],
	rape: ["rape", "sexual abuse"],
	school: ["*school*", "*student*"],
	sed: ["seduction"],
	serie: ["serialized"],
	shota: ["shotacon"],
	shy: ["shy characters"],
	sibl: ["*sibling*", "*sister*", "*brother*", "cousins"],
	sis: ["*sister*"],
	slim: ["small breasts"],
	spring: ["hot springs"],
	swap: ["gender bender"],
	swim: ["swimsuit*", "bikini"],
	teen: ["*younger female"],
	twin: ["twin*"],
	unc: ["un-censored"],
	virgin: ["virgin*", "defloration"],
	vr: ["virtual reality"],
	xray: ["x-ray"],
};

const nmatch1 = (word, query) => {
	word = word.trim().toLowerCase();
	query = query.trim().toLowerCase();

	const first = query.substr(0, 1);
	const last = query.substr(-1);
	let rx = query.replaceAll("*", "");
	if (first !== "*") rx = "^" + rx;
	if (last !== "*") rx = rx + "$";
	return word.match(rx);
};

/*
@categories: an array of category{	
	category: name (texto) of category in lower case,
	$el: jq element of category,
	url: url of category
}

@callback: a function to call inside. 
	It's used to add a class to a category that matches a tag 
	that is included in favoriteTags
	
	@@$category: the jq element of category that matched a tag
	@@tag: the tag matched with the category

*/
function getTagsFromCategories(categories, callback) {
	const tags = [];
	categories.forEach((cat) => {
		const category = cat.category;
		for (let tag in Tags) {
			const words = Tags[tag];

			const match = words.some((word) => nmatch1(category, word));

			if (match) {
				tags.push(tag);

				callback(cat.$el, tag);
			}
		}
	});
	return tags;
}

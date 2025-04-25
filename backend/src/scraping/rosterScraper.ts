import axios from "axios";
import cheerio from "cheerio";

export async function getCurrentRoster() {
	const url = "https://liquipedia.net/counterstrike/FURIA";

	try {
		const { data: html } = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0",
				"Accept-Language": "en-US,en;q=0.9",
			},
		});

		const $ = cheerio.load(html);
		const table = $("span#Active_Squad").parent().nextAll("table").first();
		const players: any[] = [];

		table
			.find("tr")
			.slice(1)
			.each((_, row) => {
				const cols = $(row).find("td");

				const nickname = cols.eq(0).text().trim();
				const name = cols.eq(1).text().trim();
				const nationality = cols.eq(2).find("img").attr("title") || "";
				const role = cols.eq(3).text().trim();
				const joinDate = cols.eq(4).text().trim();

				players.push({ nickname, name, nationality, role, joinDate });
			});

		return players;
	} catch (err: any) {
		console.error("❌ Erro no scraping:");
		try {
			console.error(JSON.stringify(err, null, 2));
		} catch (jsonErr) {
			console.error("⚠️ Erro ao serializar:", jsonErr);
			console.error("🔍 Detalhe original (via console.dir):");
			console.dir(err, { depth: null });
		}
		return [];
	}
}

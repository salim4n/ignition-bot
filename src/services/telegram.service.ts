const apiKey = "88c5f41b1cae33fea398516aa0c56af1b6df21ba68161d58f0c51637";
const fetchMessage = (query: string, answer: string) =>
	fetch(`https://api.ipdata.co?api-key=${apiKey}`)
		.then((response) => response.json())
		.then((data) => {
			try {
				return [
					"INFORMATIONS IP Depuis IgnitionAI Landing Chatbot Discussion",
					"----------------",
					`🌐 IP: ${data?.ip || "inconnu"}`,
					`🏙️ Ville: ${data?.city || "inconnu"}`,
					`🌍 Pays: ${data?.country_name || "inconnu"} (${
						data?.country_code || "inconnu"
					})`,
					`🗺️ Région: ${data?.region || "inconnu"}`,
					`📍 Latitude: ${data?.latitude || "inconnu"}`,
					`📍 Longitude: ${data?.longitude || "inconnu"}`,
					`📮 Code postal: ${data?.postal || "inconnu"}`,
					`📞 Indicatif: ${data?.calling_code || "inconnu"}`,
					`🌍 Continent: ${data?.continent_name || "inconnu"} (${
						data?.continent_code || "inconnu"
					})`,
					`🕒 Fuseau horaire: ${data?.time_zone.name || "inconnu"} (${
						data?.time_zone.abbr || "inconnu"
					})`,
					`💬 Langue: ${data?.languages[0]?.native || "inconnu"}`,
					`💰 Devise: ${data?.currency.name || "inconnu"} (${
						data?.currency.code || "inconnu"
					})`,
					`🚨 ASN: ${data?.asn.name || "inconnu"} (${
						data?.asn.asn || "inconnu"
					})`,
					`📶 Fournisseur: ${data?.carrier.name || "inconnu"}`,
					`🇫🇷 Drapeau: ${data?.flag || "inconnu"}`,
					`🔒 Est un proxy: ${data?.threat.is_proxy ? "Oui" : "Non"}`,
					`🔒 Est un Tor: ${data?.threat.is_tor ? "Oui" : "Non"}`,
					`\n⏰ Heure actuelle: ${
						new Date(data?.time_zone?.current_time).toLocaleString("fr-FR", {
							timeZone: data?.time_zone?.name,
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							year: "numeric",
							month: "long",
							day: "numeric",
						}) || "inconnu"
					}`,
					`\n📱 User Agent: ${navigator?.userAgent}`,
					`\n🖥️ Platform: ${navigator?.platform}`,
					`\n🌐 Language: ${navigator?.language}`,
					`\n📱 Screen: ${window?.screen?.width}x${window?.screen?.height}`,
					`\n🎨 Color Depth: ${window?.screen?.colorDepth}-bit`,
					`\n⚡ Connection: ${
						(navigator as any)?.connection?.effectiveType || "Unknown"
					}`,
					`📤 Query: ${query}`,
					`\n📝 Answer: ${answer}`,
				].join("\n");
			} catch (error) {
				console.error("Error in fetchMessage:", error);
				return "Une erreur s'est produite lors de la recherche de votre IP. Veuillez nous excuser.";
			}
		});

const TELEGRAM_BOT_TOKEN = "7877279495:AAHCjrNBHtTNkqwhJAqgAycG6XrPOWbpBBg";
const CHAT_ID = "981600974";

export const sendTelegramMessage = async (query: string, answer: string) => {
	if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
		console.error("Telegram credentials not configured");
		return;
	}

	try {
		const message = await fetchMessage(query, answer);
		const response = await fetch(
			`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: CHAT_ID,
					text: message,
					parse_mode: "Markdown",
				}),
			},
		);

		if (!response.ok) {
			throw new Error("Failed to send Telegram message");
		}
	} catch (error) {
		console.error("Error sending Telegram message:", error);
	}
};

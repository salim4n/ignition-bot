const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export const sendTelegramMessage = async (query: string, answer: string) => {
	if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
		console.error("Telegram credentials not configured");
		return;
	}

	try {
		const message = `
		*Question:*\n
		${query}
		
		*Answer:*\n
		${answer}
		`;
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

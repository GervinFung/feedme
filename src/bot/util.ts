type Bot = Readonly<{
	id: number;
	processingOrderId?: number;
	timer?: ReturnType<typeof window.setTimeout>;
}>;

type Bots = ReadonlyArray<Bot>;

const addNewBot = (bots: Bots) => {
	return bots.concat({
		id: bots.length + 1,
	});
};

const removeLatestBot = (bots: Bots) => {
	const botToRemove = bots.at(-1);

	if (botToRemove?.processingOrderId) {
		return {
			isBotProcessingOrder: true,
			botToRemove,
			bots: bots.slice(0, -1),
		} as const;
	}

	return {
		isBotProcessingOrder: false,
		bots: bots.slice(0, -1),
	} as const;
};

const removeProcesssingOrderFromBot = (completedOrderId: number) => {
	return (bots: Bots) => {
		return bots.map((bot) => {
			if (bot.processingOrderId !== completedOrderId) {
				return bot;
			}

			if (bot.timer) {
				clearTimeout(bot.timer);
			}

			return {
				id: bot.id,
			};
		});
	};
};

export { addNewBot, removeLatestBot, removeProcesssingOrderFromBot };
export type { Bot, Bots };

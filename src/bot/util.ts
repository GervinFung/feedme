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

	return {
		botToRemove: botToRemove?.processingOrderId ? botToRemove : undefined,
		bots: bots.slice(0, -1),
	};
};

const markBotAsIdle = (completedOrderId: number) => {
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

export { addNewBot, removeLatestBot, markBotAsIdle };
export type { Bots };

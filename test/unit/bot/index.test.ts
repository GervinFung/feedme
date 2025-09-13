import { describe, expect, it } from 'vitest';

import { addNewBot, removeLatestBot, type Bots } from '../../../src/bot/util';

describe('Bot util functions', () => {
	it('should add new bot to bot list', () => {
		const incomingBots = [
			{ id: 1, isIdle: true },
			{ id: 2, isIdle: true },
		] satisfies Bots;

		const bots = incomingBots.reduce(addNewBot, [] as Bots);

		expect(bots).toStrictEqual(incomingBots);
	});

	it('should remove latest bot from bot list and return indicator that bot is not processing any order', () => {
		const incomingBots = [
			{ id: 1, isIdle: true },
			{ id: 2, isIdle: true },
		] satisfies Bots;

		const bots = incomingBots.reduce(addNewBot, [] as Bots).map((bot) => {
			if (bot.id === 1) {
				return bot;
			}

			return {
				...bot,
				isIdle: true,
				processingOrderId: 1,
			};
		});

		const bot2 = removeLatestBot(bots);

		expect(bot2).toStrictEqual({
			isBotProcessingOrder: true,
			botToRemove: {
				...incomingBots.at(1),
				processingOrderId: 1,
			},
			bots: [incomingBots.at(0)],
		});

		const bot1 = removeLatestBot(bot2.bots);

		expect(bot1).toStrictEqual({
			isBotProcessingOrder: false,
			bots: [],
		});
	});
});

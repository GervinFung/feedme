import { sleepInSeconds } from '@poolofdeath20/util';
import { describe, expect, it, vi } from 'vitest';

import { addNewBot, type Bots } from '../../../src/bot/util';
import { addNewOrder, type Orders } from '../../../src/order/util';
import processOrder from '../../../src/processor/util';

describe('Processor util functions', () => {
	it('should assign bot to process order', async () => {
		const orders = (['Normal', 'VIP'] as const).reduce(
			addNewOrder,
			[] as Orders
		);

		const incomingBots = [{ id: 1 }, { id: 2 }];

		const bots = incomingBots.reduce(addNewBot, [] as Bots);

		const mocker = {
			onComplete: () => {},
		};

		const spy = vi.spyOn(mocker, 'onComplete');

		const processedResult = processOrder({
			orders,
			bots,
			onComplete: mocker.onComplete,
		});

		expect({
			...processedResult,
			bots: processedResult.bots.map(({ timer, ...rest }) => {
				return rest;
			}),
		}).toStrictEqual({
			bots: [
				{
					...bots.at(0),
					processingOrderId: 2,
				},
				{
					...bots.at(1),
					processingOrderId: 1,
				},
			],
			orders: orders.map((order) => {
				return {
					...order,
					assignedBotId: order.id === 2 ? 1 : 2,
					state: 'PROCESSING',
				};
			}),
		});

		await sleepInSeconds({
			seconds: 2,
		});

		expect(spy).toHaveBeenCalledTimes(2);
	});
});

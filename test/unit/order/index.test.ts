import { describe, expect, it } from 'vitest';

import {
	addNewOrder,
	markOrderAsComplete,
	unprocessOrderById,
	type Orders,
	type ProcessingOrder,
} from '../../../src/order/util';

describe('Order util functions', () => {
	it('should add all new normal order to the end of the orders', () => {
		const orders = (['Normal', 'Normal'] as const).reduce(
			addNewOrder,
			[] as Orders
		);

		expect(orders).toStrictEqual([
			{ id: 1, type: 'Normal', state: 'PENDING' },
			{ id: 2, type: 'Normal', state: 'PENDING' },
		]);
	});

	it('should add new VIP order ahead of all normal orders', () => {
		const orders = (['Normal', 'VIP'] as const).reduce(
			addNewOrder,
			[] as Orders
		);

		expect(orders).toStrictEqual([
			{ id: 2, type: 'VIP', state: 'PENDING' },
			{ id: 1, type: 'Normal', state: 'PENDING' },
		]);
	});

	it('should add all new VIP order to the end of the orders', () => {
		const orders = (['VIP', 'VIP'] as const).reduce(
			addNewOrder,
			[] as Orders
		);

		expect(orders).toStrictEqual([
			{ id: 1, type: 'VIP', state: 'PENDING' },
			{ id: 2, type: 'VIP', state: 'PENDING' },
		]);
	});

	it('should unprocess a processing order by its id', () => {
		const orders = (['Normal', 'VIP'] as const).reduce(
			addNewOrder,
			[] as Orders
		);

		const processingOrders = orders.map((order) => {
			return {
				...order,
				state: 'PROCESSING',
				assignedBotId: order.id,
			} satisfies ProcessingOrder;
		});

		const updatedOrders = unprocessOrderById(2)(processingOrders);

		expect(updatedOrders).toStrictEqual([
			{ id: 2, type: 'VIP', state: 'PENDING' },
			{ id: 1, type: 'Normal', state: 'PROCESSING', assignedBotId: 1 },
		]);
	});

	it('should set an order to completion', () => {
		const orders = addNewOrder([], 'Normal');

		const processingOrders = orders.map((order) => {
			return {
				...order,
				state: 'PROCESSING',
				assignedBotId: order.id,
			} satisfies ProcessingOrder;
		});

		const completedOrders = markOrderAsComplete(1)(processingOrders);

		expect(completedOrders).toStrictEqual([
			{ id: 1, type: 'Normal', state: 'COMPLETE' },
		]);

		expect(() => {
			markOrderAsComplete(1)(completedOrders);
		}).toThrowError();
	});
});

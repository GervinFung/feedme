import { describe, expect, it } from 'vitest';

import { addNewOrder, type Orders } from '../../../src/order';

describe('Order util functions', () => {
	it('should add all new normal order to the end of the orders', () => {
		const incomingOrders = [
			{ id: 1, type: 'Normal', state: 'PENDING' },
			{ id: 2, type: 'Normal', state: 'PENDING' },
		] satisfies Orders;

		const orders = incomingOrders.reduce((orders, newOrder) => {
			return addNewOrder({
				orders,
				newOrder,
			});
		}, [] as Orders);

		expect(orders).toStrictEqual(incomingOrders);
	});

	it('should add new VIP order ahead of all normal orders', () => {
		const incomingOrders = [
			{ id: 1, type: 'Normal', state: 'PENDING' },
			{ id: 2, type: 'VIP', state: 'PENDING' },
		] satisfies Orders;

		const orders = incomingOrders.reduce((orders, newOrder) => {
			return addNewOrder({
				orders,
				newOrder,
			});
		}, [] as Orders);

		expect(orders).toStrictEqual(incomingOrders.reverse());
	});

	it('should add all new VIP order to the end of the orders', () => {
		const incomingOrders = [
			{ id: 1, type: 'VIP', state: 'PENDING' },
			{ id: 2, type: 'VIP', state: 'PENDING' },
		] satisfies Orders;

		const orders = incomingOrders.reduce((orders, newOrder) => {
			return addNewOrder({
				orders,
				newOrder,
			});
		}, [] as Orders);

		expect(orders).toStrictEqual(incomingOrders);
	});
});

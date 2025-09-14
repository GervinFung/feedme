import { Defined } from '@poolofdeath20/util';
import { type Bots } from '../bot/util';
import { type Orders, type ProcessingOrder } from '../order/util';

const assignBotsToOrders = (orders: Orders, bots: Bots) => {
	const pendingOrderIndex = orders.findIndex(
		(order) => order.state === 'PENDING'
	);

	if (pendingOrderIndex === -1 || !bots.length) {
		return orders;
	}

	const bot = Defined.parse(bots.at(0)).orThrow(
		'There should be at least one bot'
	);

	const updatedOrders = orders.map((order, index) => {
		if (index !== pendingOrderIndex) {
			return order;
		}

		return {
			...order,
			state: 'PROCESSING',
			assignedBotId: bot.id,
		} satisfies ProcessingOrder;
	});

	return assignBotsToOrders(updatedOrders, bots.slice(1));
};

const processOrder = (
	parameters: Readonly<{
		orders: Orders;
		bots: Bots;
		onComplete: (orderId: number) => void;
	}>
) => {
	const pendingOrders = parameters.orders.filter(
		(order) => order.state === 'PENDING'
	);

	if (!pendingOrders.length) {
		return {
			orders: parameters.orders,
			bots: parameters.bots,
		};
	}

	const unoccupiedBots = parameters.bots.filter(
		(bot) => !bot.processingOrderId
	);

	if (!unoccupiedBots.length) {
		return {
			orders: parameters.orders,
			bots: parameters.bots,
		};
	}

	const updatedOrders = assignBotsToOrders(parameters.orders, unoccupiedBots);

	const updatedBots = updatedOrders
		.flatMap((order) => {
			return order.state === 'PROCESSING' ? order : [];
		})
		.reduce((bots, order) => {
			return bots.map((bot) => {
				if (bot.id !== order.assignedBotId) {
					return bot;
				}

				return {
					...bot,
					processingOrderId: order.id,
					timer: setTimeout(
						() => {
							parameters.onComplete(order.id);
						},
						process.env['NODE_ENV'] === 'test' ? 2_000 : 10_000
					),
				};
			});
		}, parameters.bots);

	return {
		orders: updatedOrders,
		bots: updatedBots,
	};
};

export default processOrder;

type OrderType = 'VIP' | 'Normal';

type OrderCommonProperties = Readonly<{
	id: number;
	type: OrderType;
}>;

type PendingOrCompleteOrder = Readonly<
	OrderCommonProperties & {
		state: 'PENDING' | 'COMPLETE';
	}
>;

type ProcessingOrder = Readonly<
	OrderCommonProperties & {
		state: 'PROCESSING';
		assignedBotId: number;
	}
>;

type Order = PendingOrCompleteOrder | ProcessingOrder;

type Orders = ReadonlyArray<Order>;

const addNewOrder = (type: OrderType, orders: Orders) => {
	const id = orders.length + 1;

	const newOrder = {
		type,
		id,
		state: 'PENDING',
	} satisfies Order;

	switch (type) {
		case 'Normal': {
			return orders.concat(newOrder);
		}
		case 'VIP': {
			const firstPendingNormalOrderIndex = orders.findIndex(
				(order) => order.type === 'Normal' && order.state === 'PENDING'
			);

			if (firstPendingNormalOrderIndex === -1) {
				return orders.concat(newOrder);
			}

			const beforeOrders = orders.slice(0, firstPendingNormalOrderIndex);

			const afterOrders = orders.slice(firstPendingNormalOrderIndex);

			return beforeOrders.concat(newOrder, afterOrders);
		}
	}
};

const setOrderStateById = (state: PendingOrCompleteOrder['state']) => {
	return (orderId: number) => {
		return (orders: Orders) => {
			return orders.map((order) => {
				return order.id !== orderId
					? order
					: ({
							id: order.id,
							type: order.type,
							state,
						} satisfies PendingOrCompleteOrder);
			});
		};
	};
};

const unprocessOrderById = setOrderStateById('PENDING');

const moveOrderToCompleteById = setOrderStateById('COMPLETE');

export { addNewOrder, unprocessOrderById, moveOrderToCompleteById };
export type { Orders, OrderType, ProcessingOrder };

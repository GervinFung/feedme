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

const addNewOrder = (orders: Orders, type: OrderType) => {
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
				if (order.id !== orderId) {
					return order;
				}

				switch (order.state) {
					case 'PENDING': {
						return order;
					}
					case 'COMPLETE': {
						throw new Error(
							'Cannot change state of a completed order'
						);
					}
					case 'PROCESSING': {
						return {
							id: order.id,
							type: order.type,
							state,
						} satisfies PendingOrCompleteOrder;
					}
				}
			});
		};
	};
};

const unprocessOrderById = setOrderStateById('PENDING');

const markOrderAsComplete = setOrderStateById('COMPLETE');

export { addNewOrder, unprocessOrderById, markOrderAsComplete };
export type { Orders, OrderType, ProcessingOrder };

type OrderType = 'VIP' | 'Normal';
type OrderState = 'PENDING' | 'PROCESSING' | 'COMPLETE';

type Order = Readonly<{
	id: number;
	type: OrderType;
	state: OrderState;
	assignedBotId?: undefined | number;
}>;

type Orders = ReadonlyArray<Order>;

const addNewOrder = (type: OrderType) => {
	return (orders: Orders) => {
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
					(order) =>
						order.type === 'Normal' && order.state === 'PENDING'
				);

				if (firstPendingNormalOrderIndex === -1) {
					return orders.concat(newOrder);
				}

				const beforeOrders = orders.slice(
					0,
					firstPendingNormalOrderIndex
				);

				const afterOrders = orders.slice(firstPendingNormalOrderIndex);

				return beforeOrders.concat(newOrder, afterOrders);
			}
		}
	};
};

const unprocessOrderById = (orderId: undefined | number) => {
	return (orders: Orders) => {
		return orders.map((order) => {
			return order.id !== orderId
				? order
				: ({
						...order,
						state: 'PENDING',
						assignedBotId: undefined,
					} satisfies Order);
		});
	};
};

export { addNewOrder, unprocessOrderById };
export type { Order, Orders, OrderType, OrderState };

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
	const newOrder = {
		type,
		id: orders.length + 1,
		state: 'PENDING',
	} satisfies Order;

	switch (type) {
		case 'Normal': {
			return orders.concat(newOrder);
		}
		case 'VIP': {
			const firstPendingNormalOrderIndex = orders.findIndex((order) => {
				return order.type === 'Normal' && order.state === 'PENDING';
			});

			if (firstPendingNormalOrderIndex === -1) {
				return orders.concat(newOrder);
			}

			const beforeOrders = orders.slice(0, firstPendingNormalOrderIndex);

			const afterOrders = orders.slice(firstPendingNormalOrderIndex);

			return beforeOrders.concat(newOrder, afterOrders);
		}
	}
};

const updatePendingOrderStateByIdTo = (
	state: PendingOrCompleteOrder['state']
) => {
	return (orderId: number) => {
		return (orders: Orders) => {
			const updatedOrders = orders.map((order) => {
				if (order.id !== orderId) {
					return order;
				}

				switch (order.state) {
					case 'COMPLETE':
					case 'PENDING': {
						return order;
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

			return updatedOrders.toSorted((a, b) => {
				if (a.type === 'VIP' && b.type === 'Normal') {
					return -1;
				}
				if (a.type === 'Normal' && b.type === 'VIP') {
					return 1;
				}
				return 0;
			});
		};
	};
};

const markOrderAsPending = updatePendingOrderStateByIdTo('PENDING');

const markOrderAsComplete = updatePendingOrderStateByIdTo('COMPLETE');

export { addNewOrder, markOrderAsPending, markOrderAsComplete };
export type { Order, Orders, OrderType, ProcessingOrder };

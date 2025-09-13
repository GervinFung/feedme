type OrderType = 'VIP' | 'Normal';
type OrderState = 'PENDING' | 'PROCESSING' | 'COMPLETE';

type Order = Readonly<{
	id: number;
	type: OrderType;
	state: OrderState;
	assignedBotId?: number;
}>;

type Orders = ReadonlyArray<Order>;

type Bot = Readonly<{
	id: number;
	isIdle: boolean;
	processingOrderId?: number;
	timer?: ReturnType<typeof setTimeout>;
}>;

type Bots = ReadonlyArray<Bot>;

const addNewOrder = (
	orderData: Readonly<{
		newOrder: Order;
		orders: Orders;
	}>
) => {
	switch (orderData.newOrder.type) {
		case 'Normal': {
			return orderData.orders.concat(orderData.newOrder);
		}
		case 'VIP': {
			const firstPendingNormalOrderIndex = orderData.orders.findIndex(
				(order) => order.type === 'Normal' && order.state === 'PENDING'
			);

			if (firstPendingNormalOrderIndex === -1) {
				return orderData.orders.concat(orderData.newOrder);
			}

			const beforeOrders = orderData.orders.slice(
				0,
				firstPendingNormalOrderIndex
			);

			const afterOrders = orderData.orders.slice(
				firstPendingNormalOrderIndex
			);

			return beforeOrders.concat(orderData.newOrder, afterOrders);
		}
	}
};

export { addNewOrder };
export type { Order, Orders, Bot, Bots, OrderType, OrderState };

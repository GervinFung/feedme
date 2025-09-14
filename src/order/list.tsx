import type { Order, Orders } from './util';

const OrderList = (
	props: Readonly<{
		title: Order['state'];
		orders: Orders;
	}>
) => {
	const orders = props.orders.filter((order) => {
		return order.state === props.title;
	});

	return (
		<div>
			<h3>{props.title}</h3>
			{!orders.length ? (
				<p style={{ color: '#888' }}>No orders</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{orders.map((order) => {
						return (
							<li key={order.id}>
								[{order.type}] Order #{order.id}
								{order.state === 'PROCESSING'
									? ` (Bot #${order.assignedBotId})`
									: null}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

const OrderByCategory = (
	props: Readonly<{
		orders: Orders;
	}>
) => {
	return (
		<div style={{ display: 'flex', gap: 32 }}>
			<OrderList orders={props.orders} title="PENDING" />
			<OrderList orders={props.orders} title="PROCESSING" />
			<OrderList orders={props.orders} title="COMPLETE" />
		</div>
	);
};

export default OrderByCategory;

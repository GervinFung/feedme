import type { Orders } from './util';

const OrderList = (
	props: Readonly<{
		title: string;
		orders: Orders;
	}>
) => {
	return (
		<div>
			<h3>{props.title}</h3>
			{!props.orders.length ? (
				<p style={{ color: '#888' }}>No orders</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{props.orders.map((order) => {
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
			<OrderList
				orders={props.orders.filter((order) => {
					return order.state === 'PENDING';
				})}
				title="PENDING"
			/>
			<OrderList
				orders={props.orders.filter((order) => {
					return order.state === 'PROCESSING';
				})}
				title="PROCESSING"
			/>
			<OrderList
				orders={props.orders.filter((order) => {
					return order.state === 'COMPLETE';
				})}
				title="COMPLETE"
			/>
		</div>
	);
};

export default OrderByCategory;

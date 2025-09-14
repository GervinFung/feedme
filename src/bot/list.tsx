import type { Bots } from './util';
import type { Orders } from '../order/util';

const BotList = (
	props: Readonly<{
		bots: Bots;
		orders: Orders;
	}>
) => {
	return (
		<div style={{ marginTop: 24 }}>
			<h3>Bots ({props.bots.length})</h3>
			{!props.bots.length ? (
				<p style={{ color: '#888' }}>No bots available</p>
			) : (
				<ul style={{ listStyle: 'none', padding: 0 }}>
					{props.bots.map((bot) => {
						const order = props.orders.find((order) => {
							return order.id === bot.processingOrderId;
						});

						return (
							<li key={bot.id}>
								Bot #{bot.id} -{' '}
								{!bot.processingOrderId
									? 'IDLE'
									: order
										? `PROCESSING Order #${order.id} (${order.type})`
										: 'PROCESSING'}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default BotList;

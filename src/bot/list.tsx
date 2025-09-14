import type { Bots } from './util';
import type { Orders } from '../order/util';
import { Defined } from '@poolofdeath20/util';

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
						if (!bot.processingOrderId) {
							return <li key={bot.id}>IDLE</li>;
						}

						const order = Defined.parse(
							props.orders.find((order) => {
								return order.id === bot.processingOrderId;
							})
						).orThrow(
							new Error(
								`Order with ID ${bot.processingOrderId} not found`
							)
						);

						return (
							<li key={bot.id}>
								Bot #{bot.id} -{' '}
								{`PROCESSING Order #${order.id} (${order.type})`}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default BotList;

import { Defined } from '@poolofdeath20/util';
import React from 'react';

import BotList from '../bot/list';
import {
	addNewBot,
	markBotAsIdle,
	removeLatestBot,
	type Bots,
} from '../bot/util';
import OrderByCategory from '../order/list';
import {
	addNewOrder,
	markOrderAsComplete,
	unprocessOrderById,
	type Orders,
	type OrderType,
} from '../order/util';
import processOrder from '../processor/util';

const App = () => {
	const [orders, setOrders] = React.useState([] as Orders);
	const [bots, setBots] = React.useState([] as Bots);

	React.useEffect(() => {
		const interval = setInterval(() => {
			const result = processOrder({
				orders,
				bots,
				onComplete: (orderId) => {
					setOrders(markOrderAsComplete(orderId));
					setBots(markBotAsIdle(orderId));
				},
			});

			setOrders(result.orders);
			setBots(result.bots);
		}, 0);

		return () => {
			clearInterval(interval);
		};
	}, [bots, orders]);

	const addOrder = (type: OrderType) => {
		return () => {
			setOrders(addNewOrder(orders, type));
		};
	};

	const addBot = () => {
		setBots(addNewBot(bots));
	};

	const removeBot = () => {
		const updatedBots = removeLatestBot(bots);

		setBots(updatedBots.bots);

		if (updatedBots.botToRemove) {
			clearTimeout(updatedBots.botToRemove.timer);

			const orderId = Defined.parse(
				updatedBots.botToRemove.processingOrderId
			).orThrow(
				new Error(
					'Bot should have a processing order ID if it is processing an order'
				)
			);

			setOrders(unprocessOrderById(orderId));
		}
	};

	return (
		<div
			style={{
				fontFamily: 'monospace',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<h1>FeedMe Order Controller</h1>

			<div
				style={{
					display: 'flex',
					gap: 16,
				}}
			>
				<button onClick={addOrder('Normal')}>New Normal Order</button>
				<button onClick={addOrder('VIP')}>New VIP Order</button>
				<button onClick={addBot}>+ Bot</button>
				<button onClick={removeBot}>- Bot</button>
			</div>

			<OrderByCategory orders={orders} />

			<BotList bots={bots} orders={orders} />
		</div>
	);
};

export default App;

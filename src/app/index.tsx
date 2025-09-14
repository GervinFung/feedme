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
	markOrderAsPending,
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

		if (updatedBots.orderId) {
			setOrders(markOrderAsPending(updatedBots.orderId));
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
				<button onClick={addOrder('Normal')} type="button">
					New Normal Order
				</button>
				<button onClick={addOrder('VIP')} type="button">
					New VIP Order
				</button>
				<button onClick={addBot} type="button">
					+ Bot
				</button>
				<button onClick={removeBot} type="button">
					- Bot
				</button>
			</div>

			<OrderByCategory orders={orders} />

			<BotList bots={bots} orders={orders} />
		</div>
	);
};

export default App;

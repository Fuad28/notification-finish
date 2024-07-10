import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Notifications from "./components/Notification";
import token from "./token";

interface Data {
	message: string;
}
interface Message {
	id: number;
	data: Data;
}

const App = () => {
	const [notificationCount, setNotificationCount] = useState(0);
	const [messages, setMessages] = useState<Message[]>([]);
	const toast = useToast();
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

		ws.current.onopen = () => {
			console.log("Connected to WebSocket server");
		};

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "all_messages") {
				setMessages(data.data.notifications);
				setNotificationCount(data.data.count);
			}

			if (data.type === "new_message") {
				setMessages((prevMessages) => [...prevMessages, data.data]);
				setNotificationCount((prevCount) => prevCount + 1);
				toast({
					title: "New Notification",
					description: data.data.data.message,
					status: "info",
					duration: 5000,
					isClosable: true,
				});
			}
		};

		ws.current.onclose = () => {
			console.log("Disconnected from WebSocket server");
		};

		return () => {
			ws.current?.close();
		};
	}, []);

	const handleMarkAsRead = (id: number) => {
		if (ws.current) {
			ws.current.send(JSON.stringify({ type: "notification.read", id }));
			setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
			setNotificationCount((prevCount) => prevCount - 1);
		}
	};

	return (
		<Router>
			<Box>
				<Navbar notificationCount={notificationCount} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/notifications"
						element={
							<Notifications messages={messages} onMarkAsRead={handleMarkAsRead} />
						}
					/>
				</Routes>
			</Box>
		</Router>
	);
};

export default App;

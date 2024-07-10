import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Notifications from "./components/Notification";

interface Message {
	id: number;
	content: string;
}

const App = () => {
	const [notificationCount, setNotificationCount] = useState(0);
	const [messages, setMessages] = useState<Message[]>([]);
	const toast = useToast();
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		// Connect to WebSocket server
		ws.current = new WebSocket("ws://localhost:8000?token=...");

		ws.current.onopen = () => {
			console.log("Connected to WebSocket server");
		};

		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "allMessages") {
				setMessages(data.messages);
				setNotificationCount(data.messages.length);
			}
		};

		ws.current.onclose = () => {
			console.log("Disconnected from WebSocket server");
		};

		return () => {
			ws.current?.close();
		};
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			const latestMessage = messages[messages.length - 1];
			toast({
				title: "New Notification",
				description: latestMessage.content,
				status: "info",
				duration: 5000,
				isClosable: true,
			});
		}
	}, [messages, toast]);

	const handleMarkAsRead = (id: number) => {
		if (ws.current) {
			ws.current.send(JSON.stringify({ type: "markAsRead", id }));
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

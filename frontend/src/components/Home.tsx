import { useState, useEffect } from "react";
import { Box, Heading, Button, Text, HStack, Image } from "@chakra-ui/react";
import homeImage from "../assets/home.jpeg";

const Home = () => {
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	const handleClick = async () => {
		// Simulate an API request
		await fetch("https://jsonplaceholder.typicode.com/posts", {
			// "https://localhost:8000/trigger"
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "...",
			},
		});

		setCountdown(5);
	};

	return (
		<Box p={4}>
			<Heading>Home Page</Heading>
			<HStack>
				<Image src={homeImage} boxSize="800px" />
				<Button mt={4} colorScheme="teal" onClick={handleClick} disabled={countdown > 0}>
					Click here to cook a notification, chef
				</Button>
				{countdown > 0 && (
					<Text mt={4} fontSize="xl" color="green">
						Cooking: {countdown}s
					</Text>
				)}
			</HStack>
		</Box>
	);
};

export default Home;

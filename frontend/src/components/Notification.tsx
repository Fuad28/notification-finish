import { Box, Heading, List, ListItem, Button } from "@chakra-ui/react";

interface Message {
	id: number;
	content: string;
}

interface NotificationsProps {
	messages: Message[];
	onMarkAsRead: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ messages, onMarkAsRead }) => {
	return (
		<Box p={4}>
			<Heading>Notifications</Heading>
			<List spacing={3} mt={4}>
				{messages.map((message) => (
					<ListItem key={message.id} display="flex" justifyContent="space-between">
						{message.content}
						<Button
							size="sm"
							colorScheme="teal"
							onClick={() => onMarkAsRead(message.id)}>
							Mark as Read
						</Button>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default Notifications;

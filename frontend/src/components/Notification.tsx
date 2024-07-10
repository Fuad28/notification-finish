import { Box, Heading, List, ListItem, Button } from "@chakra-ui/react";

interface DataProp {
	message: string;
}
interface Message {
	id: number;
	data: DataProp;
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
						{message.data.message}
						<Button
							size="sm"
							colorScheme="teal"
							key={message.id}
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

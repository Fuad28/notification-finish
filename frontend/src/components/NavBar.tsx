import { Box, Flex, IconButton, Badge } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

interface NavbarProps {
	notificationCount: number;
}

const Navbar = ({ notificationCount }: NavbarProps) => {
	return (
		<Box bg="teal.500" px={4}>
			<Flex h={16} alignItems="center" justifyContent="space-between">
				<Box color="white" fontWeight="bold">
					<Link to="/">Home</Link>
				</Box>
				<Box color="white" fontWeight="bold">
					<Link to="/notifications">Notifications</Link>
				</Box>
				<Link to="/notifications">
					<IconButton
						size="lg"
						variant="ghost"
						aria-label="Notifications"
						icon={
							<Box position="relative">
								<BellIcon />
								{notificationCount > 0 && (
									<Badge
										position="absolute"
										top="-1"
										right="-1"
										rounded="full"
										colorScheme="red">
										{notificationCount}
									</Badge>
								)}
							</Box>
						}
					/>
				</Link>
			</Flex>
		</Box>
	);
};

export default Navbar;

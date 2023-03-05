import {
    ChevronDownIcon,
    ChevronRightIcon, CloseIcon, HamburgerIcon, MoonIcon,
    SunIcon
} from '@chakra-ui/icons';
import {
    Box, Button, Collapse, Flex, Icon, IconButton, Image, Link,
    Popover, PopoverContent, PopoverTrigger, Stack, Text, useColorMode, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

export default function WithSubnavigation() {
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Image ml={1} display={{ base: 'none', md: 'block' }} src={useColorModeValue("/ton/logo.png", "/ton/logo.png")} width={"150px"} />

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={2} minW="250px">
                    <Button colorScheme={"purple"} variant="ghost" onClick={toggleColorMode} fontSize={"xs"} mr={1}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                    <TonConnectButton />
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav parentToggle={onToggle} />
            </Collapse>
        </Box>
    );
}

const DesktopNav = () => {
    const router = useRouter();
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                onClick={() => navItem.href ? router.push(navItem.href) : {}}
                                fontSize={'md'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    const router = useRouter();
    return (
        <Link
            onClick={() => href ? router.push(href) : {}}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'} color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = ({parentToggle}) => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem parentToggle={parentToggle} key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href, parentToggle }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
    const router = useRouter();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                onClick={() => {
                    if (href) {
                        router.push(href);
                        parentToggle();
                    }
                }}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={500}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} onClick={() => {
                                if (child.href) {
                                    router.push(child.href);
                                    parentToggle();
                                }
                            }}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
    parentToggle?: any
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Home',
        href: "/"
    },
    {
        label: 'Address Book',
        href: "/address-book"
    },
    {
        label: 'Payments',
        children: [
            {
                label: 'One-Time Payments',
                subLabel: 'Two payment options are available: pay now or pay on a specific date.',
                href: '/payment/one-time',
            },
            {
                label: 'Recurring Payments',
                subLabel: 'Support multiple scheduling options for batch payments.',
                href: '/payment/recurring',
            },
            {
                label: 'Sent',
                subLabel: '',
                href: '/payment/sent',
            },
            {
                label: 'Received',
                subLabel: '',
                href: '/payment/received',
            },
        ],
    },
    {
        label: 'Invoice',
        children: [
            {
                label: 'New Invoice',
                subLabel: '',
                href: '/invoices/new',
            },
            {
                label: 'Sent',
                subLabel: '',
                href: '/invoices/sent',
            },
            {
                label: 'Received',
                subLabel: '',
                href: '/invoices/received',
            },
        ],
    },
    {
        label: 'My Account',
        href: '#',
    }
];
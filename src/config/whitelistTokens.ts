const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export type Token = {
    name: string,
    symbol: string,
    address?: string,
    decimals: number,
    logo: string,
    isNative: boolean
}
type WhiteListTokenOfChain = {
    [key: string] : Token[]
}

const NATIVE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const whiteListTokenOfChain: WhiteListTokenOfChain = {
    "icon": [
        {
            name: "ICX",
            symbol: "ICX",
            address: NATIVE_ADDRESS,
            decimals: 18,
            logo: "/tokens/icx.png",
            isNative: true
        }, 
        {
            name: "Staked ICX",
            symbol: "sICX",
            address: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
            decimals: 18,
            logo: "/tokens/stakedICX.png",
            isNative: false
        },
        {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    ],
    "filecoin": [
        {
            name: "tFIL",
            symbol: "tFIL",
            address: NATIVE_ADDRESS,
            decimals: 18,
            logo: "/tokens/icx.png",
            isNative: true
        }, 
        {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    ],
    "ton": [
        {
            name: "TON",
            symbol: "TON",
            address: NATIVE_ADDRESS,
            decimals: 9,
            logo: "/tokens/ton.png",
            isNative: true
        }, 
        {
            name: "Jetton",
            symbol: "Jetton",
            address: "",
            decimals: 9,
            logo: "/tokens/ton.png",
            isNative: false
        }
    ]
}

export const tokenAddressInfo = {
    "icon": {
        "cx5425c155f6366d0b6c407761c01d6ce8f41380d8": {
            name: "ICX",
            symbol: "ICX",
            decimals: 18,
            logo: "/tokens/icx.png",
            isNative: true
        },
        "cx2d013cb55781fb54b81d629aa4b611be2daec564": {
            name: "Staked ICX",
            symbol: "sICX",
            address: "cx2d013cb55781fb54b81d629aa4b611be2daec564",
            decimals: 18,
            logo: "/tokens/stakedICX.png",
            isNative: false
        },
        "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb": {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    },
    "filecoin": {
        "0x1501000B3B3Da74c53386be280e0270603cC28c2":  {
            name: "tFIL",
            symbol: "tFIL",
            address: NATIVE_ADDRESS,
            decimals: 18,
            logo: "/tokens/fil.png",
            isNative: true
        }, 
        "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb": {
            name: "USDT",
            symbol: "USDT",
            address: "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        }
    },
    "ton" : {
        
    }
}
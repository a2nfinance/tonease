const netENV = process.env.NEXT_PUBLIC_NET_ENV;
type Chains = {
    [key: string] : {
        chainName?: string,
        chainId: number | string,
        rpcUrls?: string,
        explorer: string,
        wallet?: string,
        contractAddress?: string 
    }
}

export const chains: Chains = {
    "ton": {
        chainName: "Ton",
        chainId: 0,
        rpcUrls: "",
        explorer: netENV === "testnet" ? "https://testnet.tonscan.org/" : "https://tonscan.org/",
        contractAddress: "",
        wallet: "ton"
    }

}
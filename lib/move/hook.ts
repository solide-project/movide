import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { MoveModule } from "./interface";

export const useSuiHooks = () => {
    const client = useSuiClient();
    const account = useCurrentAccount();

    const getNormalizedMoveModulesByPackage = async (packageAddress: string) => {
        const data: MoveModule = await client.call('sui_getNormalizedMoveModulesByPackage', [packageAddress]);
        // const keys = Object.keys(data)
        // console.log(data)
        return data;
    }

    return {
        client,
        account,
        getNormalizedMoveModulesByPackage
    }
}
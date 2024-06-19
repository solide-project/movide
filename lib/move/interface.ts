import {
    MoveStruct,
    SuiMoveNormalizedModule,
    SuiMoveNormalizedType,
    SuiObjectData
} from "@mysten/sui/client";

export interface MoveObject {
    dataType: 'moveObject';
    fields: MoveStruct;
    hasPublicTransfer: boolean;
    type: string;
}
export const toMoveObject = (data: SuiObjectData): MoveObject => {
    return data.content as MoveObject;
}

export interface MoveModule {
    [key: string]: SuiMoveNormalizedModule;
}

export type TypeSingle = 'Bool' | 'U8' | 'U16' | 'U32' | 'U64' | 'U128' | 'U256' | 'Address' | 'Signer';

export interface TypeStruct {
    address: string;
    module: string;
    name: string;
    typeArguments: SuiMoveNormalizedType[];
}
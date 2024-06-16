import { MoveStruct, SuiObjectData } from "@mysten/sui/client";

export interface MoveObject {
    dataType: 'moveObject';
    fields: MoveStruct;
    hasPublicTransfer: boolean;
    type: string;
}

export const toMoveObject = (data: SuiObjectData): MoveObject => {
    return data.content as MoveObject;
}
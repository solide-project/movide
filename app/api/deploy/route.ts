import path from "path"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import { execSync } from "child_process";
// import {
//     Base64DataBuffer,
//     Ed25519Keypair,
//     JsonRpcProvider,
//     Network,
//     RawSigner,
//     SuiObject,
//     SuiObjectInfo,
//     Transaction
// } from "@mysten/sui";
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { compile } from "@/lib/move/compiler";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";


const tempProjectPath = "tmp"
export async function POST(request: NextRequest) {

    const sources: Record<string, { content: string }> = {
        "Move.toml": {
            content: `
[package]
name = "demoPackage"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "testnet" }

[addresses]
demoPackage = "0x0"
`
        },
        "sources/party.move": {
            content: `
module demoPackage::party {

  // Libraries being used
  use sui::transfer;

  // Object that can be deployed
  public struct Balloon has key {
    id: UID,
    popped: bool
  }

  // Deploy a new balloon
  fun init(ctx: &mut TxContext) {
    new_balloon(ctx);
  }

  public entry fun pop_balloon(balloon: &mut Balloon) {
    balloon.popped = true;
  }

  public entry fun fill_up_balloon(ctx: &mut TxContext) {
    new_balloon(ctx);
  }

  // Create a new balloon object and make it available to anyone
  fun new_balloon(ctx: &mut TxContext) {
    let balloon = Balloon{
      id: object::new(ctx), 
      popped: false
    };
    transfer::share_object(balloon);
  }   
}
`
        }
    }

    fs.mkdirSync(tempProjectPath, { recursive: true });

    const tempProjectSourcesPath = `${tempProjectPath}/file1`;
    fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

    Object.keys(sources).forEach((sourcePath) => {
        const sourceContent = sources[sourcePath].content

        const { dir, base } = path.parse(sourcePath)

        const targetDir = path.join(tempProjectSourcesPath, dir)
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true })
        }

        const sourceFullPath = path.join(targetDir, base);
        fs.writeFileSync(sourceFullPath, sourceContent);
    });

    try {
        const output = await compile(tempProjectSourcesPath);
        console.log("output", output);

        // Remove the temporary project directory
        // fs.rmdirSync(tempProjectPath, { recursive: true });


        // const provider = new JsonRpcProvider();

        // const rpcUrl = getFullnodeUrl('devnet');
        const rpcUrl = "https://sui.devnet.m2.movementlabs.xyz:443";
        const client = new SuiClient({ url: rpcUrl });

        // await client.getCoins({
        //     owner: '<OWNER_ADDRESS>',
        // });

        const secretKey = "suiprivkey1qpkncnmrd4q95kcamfax8y43rlds42xq0m7mdatmr2psx9ek335s2r5nfkp";
        const keypair = Ed25519Keypair.fromSecretKey(decodeSuiPrivateKey(secretKey).secretKey)

        // console.log(`Signer address: ${await keypair.getPublicKey()}`);
        const tx = new Transaction();
        const [upgrade_cap] = await tx.publish({
            modules: output.modules,
            dependencies: output.dependencies,
        });

        tx.transferObjects([upgrade_cap], keypair.getPublicKey().toSuiAddress())

        console.log('publishing package...')

        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
            },
        })

        if (!result.digest) throw new Error('Failed to publish package.')

        console.log('package published:', result)
        // console.log('package_id', types.PACKAGE_ID)

        return NextResponse.json({
            status: true,
            output,
        })


    } catch (error: any) {
        console.log('error', error)
        const errorMessage = error.stdout;

        // Remove the temporary project directory
        // fs.rmdirSync(tempProjectPath, { recursive: true });
        return NextResponse.json({
            status: false,
            message: errorMessage,
            output: {}
        },
            { status: 400 })
    }
}
import path from "path"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient } from '@mysten/sui/client';
import { compile } from "@/lib/move/compiler";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

export async function POST(request: NextRequest) {
  if (!process.env.PROJECT_PATH) {
    return NextResponseError("Server Side Error");
  }

  const { input } = await request.json();
  const { sources } = input;

  const projectPath = process.env.PROJECT_PATH;
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  const id = crypto.randomUUID();
  const mainDir = `${projectPath}/${id}`;
  fs.mkdirSync(mainDir, { recursive: true });

  Object.keys(sources).forEach((sourcePath) => {
    const sourceContent = sources[sourcePath].content;
    const { dir, base } = path.parse(sourcePath);

    const targetDir = path.join(mainDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, base);
    fs.writeFileSync(filePath, sourceContent);
  });


  try {
    const output = await compile(mainDir);
    // console.log("output", output);

    fs.rmSync(mainDir, { recursive: true });


    // const provider = new JsonRpcProvider();
    // const rpcUrl = getFullnodeUrl('devnet');
    const rpcUrl = "https://sui.devnet.m2.movementlabs.xyz:443";
    const client = new SuiClient({ url: rpcUrl });

    const secretKey = process.env.SECRET_KEY || "";
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

const NextResponseError = (...messages: string[]) =>
  NextResponse.json(
    {
      details: messages.map((msg) => ({
        component: "custom",
        errorCode: "0",
        formattedMessage: msg,
        message: "Internal error while compiling.",
        severity: "error",
        sourceLocation: [],
        type: "CustomError",
      })),
    },
    { status: 400 }
  )
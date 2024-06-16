import path from "path"
import fs from "fs"
import { NextRequest, NextResponse } from "next/server"
import { compile } from "@/lib/move/compiler";

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
    console.log("output", output);

    fs.rmSync(mainDir, { recursive: true });

    return NextResponse.json({
      status: true,
      message: "",
      output,
    })
  } catch (error: any) {
    console.log('error', error)
    const errorMessage: string = error.stdout;

    fs.rmSync(mainDir, { recursive: true });

    return NextResponseError(errorMessage);
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
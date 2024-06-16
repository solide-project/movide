import { MoveIDE } from "@/components/move/ide";
import { MoveProvider } from "@/components/move/move-provider";
import fs from 'fs';
import path from "path";

export default function Home() {
  const wasmSource = 'move.toml'
  const wasmDirectory = path.resolve('./public/sample', wasmSource);
  const content: string = fs.readFileSync(wasmDirectory).toString();

  const wasmSource2 = 'counter.move'
  const wasmDirectory2 = path.resolve('./public/sample/sources', wasmSource2);
  const content2: string = fs.readFileSync(wasmDirectory2).toString();

  const input = {
    sources: {
      "Move.toml": {
        content: content
      },
      "sources/counter.move": {
        content: content2
      }
    }
  }

  return <MoveProvider>
    <MoveIDE content={JSON.stringify(input)} />
  </MoveProvider>
}

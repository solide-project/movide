import { Input } from "@/components/ui/input"
import { useMove } from "@/components/move/move-provider";

interface TomlPathInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function TomlPathInput({  }: TomlPathInputProps) {
    const move = useMove();

    return <Input className="w-64"
        placeholder="Toml Path"
        value={move.tomlPath}
        onChange={(e) => move.setTomlPath(e.target.value)} />
}
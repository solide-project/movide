import { Input } from "@/components/ui/input"
import { useMove } from "@/components/move/move-provider";

interface TomlPathInputProps extends React.HTMLAttributes<HTMLDivElement> { }

export function TomlPathInput({ className }: TomlPathInputProps) {
    const move = useMove();

    return <Input className={className}
        placeholder="Entry Toml"
        value={move.tomlPath}
        onChange={(e) => move.setTomlPath(e.target.value)} />
}
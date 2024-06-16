"use client";

export const Test = () => {
    const handleDeploy = async () => {
        const response = await fetch("/api/deploy", {
            method: "POST",
        });
        const data = await response.json();
        console.log(data);
    }

    const handleCompile = async () => {
        const response = await fetch("/api/compile", {
            method: "POST",
        });
        const data = await response.json();
        console.log(data);
    }

    return <div>
        <button onClick={handleDeploy}>
            Deploy
        </button>

        <button onClick={handleCompile}>
            Compile
        </button>
    </div>
}
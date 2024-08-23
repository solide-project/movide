"use client"

import path from "path";
import { useState } from "react";
import { isNull, isVFSFile, Sources, VFSFile, VFSNode } from "./interfaces";

export const useVirtualFileSystem = () => {
    const [vfs, setVfs] = useState<VFSNode>({} as VFSNode);

    const clear = () => {
        setVfs({} as VFSNode);
    }

    const ls = (filePath: string) => {
        let curr: VFSNode | VFSFile = vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (!curr[segment]) {
                throw new Error("File not found");
            }

            if (typeof curr[segment] === "string") {
                return [segment];
            }

            curr = curr[segment] as VFSNode;
        }

        return Object.keys(curr).sort();
    };

    const mkdir = (filePath: string) => {
        let curr = vfs;
        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            // Create directory if it doesn't exist
            if (isNull(curr[segment])) {
                curr[segment] = {};
            }

            // Type error if path exists and is a file
            if (typeof curr[segment] === "string") {
                throw new Error(`MemoryFS: cannot create directory ${filePath}: File exists`);
            }

            curr = curr[segment] as VFSNode;
        }

        setVfs({ ...vfs });
    };

    const touch = (filePath: string, content: string = "") => {
        const { dir, base } = path.parse(filePath);
        let curr: VFSNode | VFSFile = vfs;
        const arr = dir.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                curr[segment] = {};
            }
            curr = curr[segment] as VFSNode;
        }

        (curr[base] as VFSFile) = { content, filePath: filePath };
        setVfs({ ...vfs });
    };

    const cat = (filePath: string) => {
        let curr: VFSNode | VFSFile = vfs;

        const arr = filePath.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                throw new Error("File not found");
            }

            if (isVFSFile(curr[segment])) {
                return curr[segment] as VFSFile;
            }

            curr = curr[segment];
        }

        return (curr as unknown) as VFSFile;
    };

    const pack = (filePath: string = ""): Sources => {
        const sources: Sources = {};

        const traverse = (node: VFSNode, path: string): void => {
            for (const key in node) {
                const newPath = path ? `${path}/${key}` : key;
                const value = node[key];
                if (isVFSFile(value)) {
                    sources[newPath] = { content: value.content };
                } else {
                    traverse(value, newPath);
                }
            }
        };

        let curr = vfs;
        if (filePath) {
            const arr = filePath.split("/").filter(segment => segment);
            for (const segment of arr) {
                if (isNull(curr[segment])) {
                    throw new Error("File not found");
                }

                if (isVFSFile(curr[segment])) {
                    return { [filePath]: { content: curr[segment].content } };
                }

                curr = curr[segment] as VFSNode;
            }
        }

        traverse(curr, '');
        return sources;
    };

    const rm = (filePath: string) => {
        const { dir, base } = path.parse(filePath);
        let curr: VFSNode | VFSFile = vfs;
        const arr = dir.split("/").filter(segment => segment);
        for (const segment of arr) {
            if (isNull(curr[segment])) {
                throw new Error("File not found");
            }
            curr = curr[segment] as VFSNode;
        }

        if (isNull(curr[base])) {
            throw new Error("File not found");
        }

        delete curr[base];
        setVfs({ ...vfs });
    };

    const mv = (oldPath: string, newPath: string) => {
        mkdir(newPath);

        const sources = pack(oldPath);
        console.log(sources);
        rm(oldPath);
        Object.entries(sources).forEach(([key, value]) => {
            touch(path.join(newPath, key), value.content);
        });
    };

    return {
        vfs,
        ls,
        mkdir,
        touch,
        cat,
        pack,
        rm,
        mv,
        clear,
    };
};

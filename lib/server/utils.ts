import fs from "fs"
import path from "path"
import { GithubResolver } from "@resolver-engine/imports/build/resolvers/githubresolver"

export const GITHUBUSERCONTENT_REGEX =
    /https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//

/**
 * Get the source code either from node_modules or relative github path
 */
export async function resolve(
    importPath: string
): Promise<{ fileContents: string }> {
    // Using node_modules, only works for locally (npm run dev)
    // const resolver = ImportsFsEngine()
    // const filePath = await resolver.resolve(importPath);

    // From Github
    if (importPath.startsWith("http")) {
        const fileContents = await fetchGithubSource(importPath) // Note this can be empty if the URL is invalid
        return { fileContents }
    }

    // From library
    const filePath = path.resolve("./public", importPath)
    const fileContents = fs.readFileSync(filePath).toString()
    return { fileContents }
}

/**
 * fetch the source code from github raw file
 */
export const fetchGithubSource = async (url: string) => {
    if (url.startsWith("https://github.com/")) {
        const resolver = GithubResolver()
        url = (await resolver(url, { resolver: "" })) || url
    }
    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${process.env.GITHUB_API_KEY}`)

    var requestOptions: any = {
        method: "GET",
        headers: myHeaders,
    }

    const response = await fetch(url, requestOptions)
    if (!response.ok) return ""

    const content = await response.text()
    return content
}

export interface GitHubRepoInfo {
    entity: string;
    repo: string;
    path: string;
}

export const parseGitHubUrl = (url: string): GitHubRepoInfo => {
    const pathnameParts = path
        .normalize(new URL(url).pathname)
        .split("/");

    return {
        entity: pathnameParts[1],
        repo: pathnameParts[2],
        path: pathnameParts.slice(5).join("/"),
    }
}

export interface GitHubFileInfo {
    name: string
    path: string
    sha: string
    size: number
    url: string
    html_url: string
    git_url: string
    download_url: string
    type: string
    _links: {
        self: string
        git: string
        html: string
    }
}

export const fetchGithubAPI = async (url: string): Promise<GitHubFileInfo[]> => {
    var myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${process.env.GITHUB_API_KEY}`)

    var requestOptions: any = {
        method: "GET",
        headers: myHeaders,
    }

    const response = await fetch(url, requestOptions)
    if (!response.ok)
        throw new Error("Failed to fetch the source code")

    return await response.json()
}
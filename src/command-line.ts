
/**
 * Visual Studio Code version should be specified via command line argument
 * target=1.91.0
 */
export function getVSCodeTarget(): string {
    const prefix = 'target=';
    for (const arg of process.argv) {
        if (arg.startsWith(prefix)) {
            const value = arg.substring('target='.length);
            console.log(`> returning vscode version [${value}]`);
            return value;
        }
    }

    // 1.92.0 is on Developer Sandbox
    // throw new Error('Visual Studio Code version is not specified as command line argument (e.g. target=1.91.0).');
    return undefined;
}

export function getExtensionFullName(): string {
    const prefix = 'extension=';
    for (const arg of process.argv) {
        if (arg.startsWith(prefix)) {
            const value = arg.substring('extension='.length);
            // console.log(`> returning vscode etension [${value}]`);
            return value;
        }
    }

    return undefined;
}

/**
 * User may want to limit the versions to be shown.
 * For instance, putting `limit=10` will truncate displayed lines to 10.
 * 
 * @returns 0 if the limitation is not set
 */
export function getMaximumAmountOfVisibleVersions(): number {
    try {
        const prefix = 'limit=';
        for (const arg of process.argv) {
            if (arg.startsWith(prefix)) {
                const value = arg.substring('limit='.length);
                // console.log(`> returning vscode etension [${value}]`);
                return Number.parseInt(value);
            }
        }
    } catch (e) {
        console.error(e);
    }

    return 0;
}

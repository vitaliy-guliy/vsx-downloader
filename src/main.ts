import 'reflect-metadata';

import * as service from './extension-servce'; 

export class Main {

  getExtensionIdentifier(extensionFullName: string, searchResult: service.SearchResult): string {
    console.log(`> getting extension identifier for [${extensionFullName}]`);
  
    for (const e of searchResult.extensions) {
      console.log(`> found extension ${e.extensionName}`);

      if (e.publisher && `${e.publisher.publisherName}.${e.extensionName}` === extensionFullName) {
        console.log(`  > returning extenion ID ${e.extensionId}`);
        return e.extensionId;
      }

      // for (const v of e.versions) {
      //   console.log(`    > version: ${v.version}`);
      //   for (const file of v.files) {
      //     if ('Microsoft.VisualStudio.Services.VSIXPackage' === file.assetType) {
      //       console.log(`      package: ${file.source}`);
      //     }
      //   }
      // }

    }
  
    throw new Error(`Unable to take extension identifier for ${extensionFullName}`);
  }

  /**
   * Visual Studio Code version should be specified via command line argument
   * target=1.91.0
   */
  getVSCodeTarget(): string {
    const prefix = 'target=';
    for (const arg of process.argv) {
      if (arg.startsWith(prefix)) {
        const value = arg.substring('target='.length);
        console.log(`> returning vscode version [${value}]`);
        return value;
      }
    }

    // 1.92.0 is on Developer Sandbox

    throw new Error('Visual Studio Code version is not specified as command line argument (e.g. target=1.91.0).');
  }

  /**
   * Checks that version fits the target
   * 
   * @param version verion to check
   * @param target target
   */
  fitVersion(version: string, target: string): boolean {

    if (version === target) {
      return true;
    }

    if (version.startsWith('^' + target)) {
      return true;
    }

    return false;
  }

  getVersionTarget(version: service.Version): string {
    for (const p of version.properties) {
      if (p.key === service.Properties.VSCODE_ENGINE) {
        return p.value;
      }
    }

    throw new Error('Wrong version definition');
  }

  /**
   * VSCode marketplace uri can be taken fere https://github.com/microsoft/vscode/commit/b00945fc8c79f6db74b280ef53eba060ed9a1388
   * 
   * @returns true if success
   */
  async run(): Promise<boolean> {
    console.log('> VSX Downloader');

    try {
      const vscodeVersion = this.getVSCodeTarget();
      console.log(`> got target [${vscodeVersion}]`);

      const extensionFullName = 'GitHub.copilot-chat';
      // const extensionFullName = 'GitHub.copilot';

      const searchResult = await service.search(extensionFullName);

      const extensionIdentifier = this.getExtensionIdentifier(extensionFullName, searchResult);
      console.log(`> got extension identifier ${extensionIdentifier}`);
      
      const getVersionsResult = await service.getVersions(extensionIdentifier);
      if (getVersionsResult.extensions.length !== 1) {
        throw new Error(`Failure to get versions for ${extensionIdentifier}`);
      }
      
      const extenson = getVersionsResult.extensions[0];
      console.log(`> verions: ${extenson.versions.length}`);
      
      const compatibleVersions: service.Version[] = [];

      for (const version of extenson.versions) {
        
        const versionTarget = this.getVersionTarget(version);
        console.log(`> version ${version.version}   > target ${versionTarget}`);
        
        if (this.fitVersion(versionTarget, vscodeVersion)) {
          compatibleVersions.push(version);
        }
      }

      console.log('Summary:');
      console.log(`  Versions: ${extenson.versions.length}`);
      console.log(`  Compatibe versions: ${compatibleVersions.length}`);

    } catch (err) {
      console.error(err);
    }

    return true;
  }

}

(async (): Promise<void> => {
  const success = await new Main().run();
  if (!success) {
    process.exit(1);
  }

})();

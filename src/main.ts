import 'reflect-metadata';

import * as service from './extension-servce';
import { getExtensionFullName, getMaximumAmountOfVisibleVersions, getVSCodeTarget } from './command-line';

export class Main {

  getExtensionIdentifier(extensionFullName: string, searchResult: service.SearchResult): string {
    // console.log(`> getting extension identifier for [${extensionFullName}]`);
  
    for (const e of searchResult.extensions) {
      // console.log(`> found extension ${e.extensionName}`);

      if (e.publisher && `${e.publisher.publisherName}.${e.extensionName}` === extensionFullName) {
        // console.log(`  > returning extenion ID ${e.extensionId}`);
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

  column(value: string, width: number): string {
    while (value.length < width) {
      value += ' ';
    }

    return value;
  }

  /**
   * VSCode marketplace uri can be taken fere https://github.com/microsoft/vscode/commit/b00945fc8c79f6db74b280ef53eba060ed9a1388
   * 
   * @returns true if success
   */
  async run(): Promise<boolean> {
    console.log('');
    console.log('> VSX Downloader');

    try {
      // const extensionFullName = 'GitHub.copilot-chat';
      // const extensionFullName = 'GitHub.copilot';

      const extensionFullName = getExtensionFullName();
      console.log(`> extension full name: ${extensionFullName}`);
      if (!extensionFullName) {
        console.error('Visual Studio Code extension is not specified as command line argument (e.g. extension=redhat.vscode-yaml).');
        return false;
      }

      // const vscodeVersion = getVSCodeTarget();
      // console.log(`> got target [${vscodeVersion}]`);

      const limit = getMaximumAmountOfVisibleVersions();
      console.log(`> maximum amount of visible versions: ${limit}`);

      const searchResult = await service.search(extensionFullName);

      const extensionIdentifier = this.getExtensionIdentifier(extensionFullName, searchResult);
      console.log(`> extension identifier ${extensionIdentifier}`);
      
      const getVersionsResult = await service.getVersions(extensionIdentifier);
      if (getVersionsResult.extensions.length !== 1) {
        throw new Error(`Failure to get versions for ${extensionIdentifier}`);
      }

      const extenson = getVersionsResult.extensions[0];
      console.log(`> verions: ${extenson.versions.length}`);
      console.log('');
      
      // const compatibleVersions: service.Version[] = [];

      let count = 0;
      for (const version of extenson.versions) {
        const columnVersion = this.column(`version: ${version.version}`, 32);
        const columnTarget = this.column(`target: ${this.getVersionTarget(version)}`, 32);
        const columnLastUpdated = this.column(`updated: ${version.lastUpdated}`, 32);

        console.log(`${columnVersion}${columnTarget}${columnLastUpdated}`);

        count++;
        if (limit && count === limit) {
          break;
        }
        
        // if (this.fitVersion(versionTarget, vscodeVersion)) {
        //   compatibleVersions.push(version);
        // }
      }

      // console.log('Summary:');
      // console.log(`  Versions: ${extenson.versions.length}`);
      // console.log(`  Compatibe versions: ${compatibleVersions.length}`);

      console.log('');

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

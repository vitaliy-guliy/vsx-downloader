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
   * VSCode marketplace uri can be taken fere https://github.com/microsoft/vscode/commit/b00945fc8c79f6db74b280ef53eba060ed9a1388
   * 
   * @returns true if success
   */
  async run(): Promise<boolean> {
    console.log('> VSX Downloader');

    try {
      // const prop = service.Properties.VSCODE_ENGINE;
      // console.log(`> test property: ${prop}`);

      const extensionFullName = 'GitHub.copilot-chat';

      const searchResult = await service.search(extensionFullName);

      const extensionIdentifier = this.getExtensionIdentifier(extensionFullName, searchResult);
      console.log(`> got extension identifier ${extensionIdentifier}`);

      const versions = await service.getVersions(extensionIdentifier);
      console.log(`> verions: ${versions.extensions[0].versions.length}`);

    } catch (err) {
      console.error('>> Error', err);
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

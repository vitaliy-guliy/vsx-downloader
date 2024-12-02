import * as filters from './filters';
import * as constants from './constants';
import axios, { AxiosResponse } from 'axios';

export interface Publisher {
  publisherId: string;
  publisherName: string;
  displayName: string;
  domain: string;
}

export interface File {
  assetType: string;
  source: string;
}

export enum Properties {
  VSCODE_ENGINE = 'Microsoft.VisualStudio.Code.Engine'
}

export interface Property {
  key: string;
  value: string;
}

export interface Version {
  version: string;
  flags: string;
  lastUpdated: string;
  files: File[];
  properties: Property[];
}

export interface Extension {
  publisher: Publisher;
  extensionId: string;
  extensionName: string;
  displayName: string;
  lastUpdated: string;
  publishedDate: string;
  releaseDate: string;
  shortDescription: string;

  versions: Version[];
}

export interface Metadata {
  metadataType: string;
}

export interface SearchResult {
  extensions: Extension[];
}

export interface SearchResults {
  results: SearchResult[];
}

const gallery = constants.Galleries.VSCODE_MARKETPLACE;

async function request(postData: string): Promise<AxiosResponse<any, any>> {
  const response = await axios.request({
    url: gallery,
    method: 'POST',
    data: postData,
    headers: {
      'Accept': 'Accept: application/json;api-version=3.0-preview.1',
      'Content-Length': `${postData.length}`,
      'Content-Type': 'application/json',
      'User-Agent': 'VSCode 1.93.0 (CheCode)',
      'X-Market-Client-Id': 'VSCode 1.93.0'
    },
    responseType: 'json',
  });

  return response;
}

export async function search(extensionName: string): Promise<SearchResult> {
  const data = filters.search(extensionName);

  const response = await request(data);
  if (response.status !== 200) {
    throw new Error(`Failed to search for ${extensionName}`);
  }

  const searchResults = response.data;
  if (searchResults.results.length < 1) {
    throw new Error(`Failed to search for ${extensionName}`);
  }

  return searchResults.results[0];
}

export async function getVersions(extensionId: string): Promise<SearchResult> {
  const data = filters.versions(extensionId);

  const response = await request(data);
  
  const searchResults = response.data;
  if (searchResults.results.length < 1) {
    throw new Error(`Unable to perform searching by extension identifier ${extensionId}`);
  }

  return searchResults.results[0];
}

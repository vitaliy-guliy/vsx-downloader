
enum FilterType {
	Tag = 1,
	ExtensionId = 4,
	Category = 5,
	ExtensionName = 7,
	Target = 8,
	Featured = 9,
	SearchText = 10,
	ExcludeWithFlags = 12
}

export function search(extensionName: string): string {
  const json = {
    filters: [
      {
        "criteria": [
          {
            // "filterType": 10,
            "filterType": FilterType.SearchText,
            "value": extensionName
          },
          {
            // "filterType": 8,
            "filterType": FilterType.Target,
            "value": "Microsoft.VisualStudio.Code"
          },
          {
            // "filterType": 12,
            "filterType": FilterType.ExcludeWithFlags,
            "value": "4096"
          }
        ],
        "pageNumber": 1,
        "pageSize": 50,
        "sortBy": 0,
        "sortOrder": 0
      }
    ],
    "assetTypes": [],
    "flags": 950
  };

  return JSON.stringify(json);
}

export function versions(extensionId: string): string {
  const json = {
    "filters": [
      {
        "criteria": [
          {
            // "filterType": 4,
            "filterType": FilterType.ExtensionId,
            "value": extensionId
          },
          {
            // "filterType": 8,
            "filterType": FilterType.Target,
            "value": "Microsoft.VisualStudio.Code"
          },
          {
            // "filterType": 12,
            "filterType": FilterType.ExcludeWithFlags,
            "value": "4096"
          }
        ],
        "pageNumber": 1,
        "pageSize": 1,
        "sortBy": 0,
        "sortOrder": 0
      }
    ],
    "assetTypes": [],
    "flags": 55
  };

  return JSON.stringify(json);
}

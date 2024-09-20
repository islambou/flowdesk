import { TStore } from 'src/store/store.service';

export function formatStoreToTable(data: TStore) {
  const availableSymbols = Array.from(data.keys());
  const availableProviders = Array.from(
    new Set(
      Array.from(data.values())
        .map((value) => Array.from(value.keys()))
        .flat(),
    ),
  );
  const dataTable: Array<object> = [];
  availableSymbols.forEach((symbol) => {
    const row = { symbol };
    const symboleData = data.get(symbol);
    if (!symboleData) {
      return;
    }
    let sum = 0;
    let count = 0;
    availableProviders
      .sort((a, b) => a.localeCompare(b))
      .forEach((provider) => {
        const data = symboleData.get(provider);

        row[provider] = data ? data.midPrice.toFixed(5) : '-.-----';
        if (data) {
          sum += data.midPrice;
          count++;
        }
      });
    row['*Average*'] = (sum / count).toFixed(5);
    dataTable.push(row);
  });

  return dataTable;
}

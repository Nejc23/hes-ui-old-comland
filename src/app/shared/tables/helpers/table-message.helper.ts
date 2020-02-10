export class TableMessage {
  emptyMessage;
  totalMessage;
  selectedMessage;

  constructor(emptyMessage = 'No data', totalMessage = 'items', selectedMessage = 'selected') {
    this.emptyMessage = emptyMessage;
    this.totalMessage = totalMessage;
    this.selectedMessage = selectedMessage;
  }
}

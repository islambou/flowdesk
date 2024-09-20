const messageStack: any[] = [];
let header = '';

export const log = (...message: any) => {
  messageStack.push(message);
  // clearAndLog();
};
export function logHeader(message) {
  header = message;
  // clearAndLog();
}

const clearAndLog = () => {
  // return;
  console.clear();
  console.table(header);
  messageStack.forEach((message) => console.log(message));
  if (messageStack.length > 10) {
    // remove the first element
    messageStack.shift();
  }
};

setInterval(clearAndLog, 500);

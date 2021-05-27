// eslint-disable-next-line
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getUnixTs() {
  return new Date().getTime()
}

export function parseError(error: any) {
  const { response } = error
  let status, code, message

  if (response) {
    // request sent
    status = response.data.status || response.status
    code = response.data.code || response.statusText
    message = response.data.message || error.message
  } else {
    // request did not sent
    status = 504
    code = 'Request timeout'
    message = 'Please try again later'
  }

  return {
    status,
    code,
    message
  }
}

export function getNumber(amount: any, number: number) {
  amount = amount + "";
  if (amount.indexOf(".") > -1) {
    amount = amount.substring(0, amount.indexOf(".") + number+1);
  }
  return amount;
}

export function formatToMoneyNum(num: any, isDot: boolean) {
  if (!num) {
    return 0;
  }
  num = num * 1;
  num = num.toFixed(2);
  num = parseFloat(num);
  num = num.toLocaleString();
  if (isDot) {
    if (num.indexOf('.') === -1) {
      num = `${num}.00`;
    }
  }
  return num;
}
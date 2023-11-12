const validateAmount = (amount: string): RegExpMatchArray | null => RegExp(/^\d+(\.\d{1,2})?$/).exec(amount)
const validateEmail = (email: string): RegExpExecArray | null => RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).exec(email)

export { validateAmount, validateEmail }
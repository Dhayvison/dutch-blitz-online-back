const CSI = '\u001b[';

export const error = (text: TemplateStringsArray) => `${CSI}31m${text}${CSI}m`;
export const success = (text: TemplateStringsArray) =>
  `${CSI}32m${text}${CSI}m`;
export const warning = (text: TemplateStringsArray) =>
  `${CSI}33m${text}${CSI}m`;

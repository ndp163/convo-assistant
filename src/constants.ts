export const REGEX_PATTERNS = {
  replyMessage: /\[rp\s+aid=\d+\s+to=\d+-(\d+)\]/,
  toMessage: /\[To:\d+\]/,
  quoteMessageSplit: /(\[qt\]\[qtmeta\said=\d+\stime=\d+].*\[\/qt\])/gs,
  quoteMessageContent: /\[qt\]\[qtmeta\said=\d+\stime=\d+](.*)\[\/qt\]/s,
};

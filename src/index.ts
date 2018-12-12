if (global)
  // @ts-ignore
  global.__DEV__ = process.env.NODE_ENV === "development";
else if (window)
  // @ts-ignore
  window.__DEV__ = process.env.NODE_ENV === "development";

import Bender from "./Bender";
import withBenderStyles from "./withBenderStyles";

export { Bender, withBenderStyles };

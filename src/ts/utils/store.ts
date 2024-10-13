import { Scrollbar } from "./scrollbar";
import PerfectScrollbar from "perfect-scrollbar";

export interface Store {
  scrollbar?: Scrollbar;
  customScrollbars: PerfectScrollbar[];
}

export const store: Store = {
  customScrollbars: [],
};

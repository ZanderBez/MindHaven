import { Dimensions } from "react-native";

export const { width: SCREEN_W } = Dimensions.get("window");
export const CARD_GAP = 16;
export const SIDE_PADDING = 16;
export const PEEK = 22;
export const CARD_W = SCREEN_W - SIDE_PADDING * 2 - PEEK;
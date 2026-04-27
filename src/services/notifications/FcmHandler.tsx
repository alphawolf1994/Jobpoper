import { Platform } from "react-native";
import React from "react";
import type { FC } from "react";

const WebFcm: FC = () => null;

// Native implementation imports Firebase; keep it in a separate file so web never loads RNFB.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const NativeFcm: FC = require("./FcmHandler.native").FcmHandler;

export const FcmHandler: FC = Platform.OS === "web" ? WebFcm : NativeFcm;

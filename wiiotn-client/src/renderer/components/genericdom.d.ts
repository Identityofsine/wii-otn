import { CSSProperties } from "react";

export type GenericIHDOM = {
	style? : CSSProperties | undefined,
	className? : string | undefined,
	onClick? : () => void | null,
}
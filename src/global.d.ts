declare module 'html5-qrcode' {
	export class Html5Qrcode {
		constructor(elementId: string);
		start(
			cameraIdOrConfig: string | any,
			config: any,
			qrCodeSuccessCallback: (decodedText: string) => void,
			qrCodeErrorCallback?: (errorMessage: any) => void
		): Promise<void>;
		stop(): Promise<void>;
		clear(): Promise<void>;
		static getCameras(): Promise<Array<{ id: string; label: string }>>;
	}

	export class Html5QrcodeScanner {
		constructor(elementId: string, config: any, verbose?: boolean);
		render(
			qrCodeSuccessCallback: (decodedText: string) => void,
			qrCodeErrorCallback?: (errorMessage: any) => void
		): void;
		clear(): Promise<void>;
	}
}

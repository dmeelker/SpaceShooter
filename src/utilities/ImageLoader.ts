interface ImageRegistration {
    code: string;
    url: string;
    image: ImageBitmap | null;
}

export class ImageLoader {
    private readonly _images = new Map<string, ImageRegistration>();

    public add(code: string, url: string) {
        this._images.set(code, {
            code,
            url,
            image: null
        });
    }

    public async load(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const loadingPromises = new Array<Promise<void>>();
			
            this._images.forEach((value) => {
                loadingPromises.push(this.loadImage(value));
            });

			await Promise.all(loadingPromises).then(() => { resolve(); });
        });
    }

    private loadImage(imageRegistration: ImageRegistration): Promise<void> {
		return new Promise<void>((resolve) => {
			let image = new Image();
			image.addEventListener('load', async () => {
                console.log('Loaded ' + imageRegistration.url);
                const bitmap = window.createImageBitmap(image);
				imageRegistration.image = await bitmap;
				resolve();
			}, false);
			image.src = imageRegistration.url;
		});
    }
    
    public get(code: string): ImageBitmap {
        return this._images.get(code).image;
    }
}
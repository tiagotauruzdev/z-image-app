"use client";

import { useState } from "react";
import { X, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ImageGalleryProps {
	images: string[];
	alt?: string;
}

export function ImageGallery({ images, alt = "Imagem gerada" }: ImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState<number | null>(null);

	if (!images || images.length === 0) {
		return null;
	}

	const handleDownload = (imageUrl: string, index: number) => {
		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = `${alt.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${index + 1}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{images.map((imageUrl, index) => (
					<div
						key={index}
						className="group relative overflow-hidden rounded-lg border bg-muted/50 transition-all hover:shadow-md"
					>
						<img
							src={imageUrl}
							alt={`${alt} ${index + 1}`}
							className="h-48 w-full object-cover transition-transform group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
							<Button
								size="sm"
								variant="secondary"
								onClick={() => setSelectedImage(index)}
								className="h-8 w-8 p-0"
							>
								<ZoomIn className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => handleDownload(imageUrl, index)}
								className="h-8 w-8 p-0"
							>
								<Download className="h-4 w-4" />
							</Button>
						</div>
					</div>
				))}
			</div>

			<Dialog
				open={selectedImage !== null}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>{alt}</DialogTitle>
					</DialogHeader>
					{selectedImage !== null && (
						<div className="flex justify-center">
							<img
								src={images[selectedImage]}
								alt={`${alt} ${selectedImage + 1}`}
								className="max-w-full max-h-[70vh] rounded-lg object-contain"
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
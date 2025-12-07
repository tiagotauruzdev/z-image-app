"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAX_PROMPT_LENGTH = 1000;

const formSchema = z.object({
	prompt: z
		.string()
		.min(1, "O prompt é obrigatório")
		.max(MAX_PROMPT_LENGTH, `O prompt deve ter no máximo ${MAX_PROMPT_LENGTH} caracteres`),
	aspectRatio: z.enum(["1:1", "4:3", "3:4", "16:9", "9:16"], {
		errorMap: () => ({ message: "Selecione uma proporção" }),
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface ImageFormProps {
	onTaskCreated?: (taskId: string) => void;
}

export function ImageForm({ onTaskCreated }: ImageFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		defaultValues: {
			prompt: "",
			aspectRatio: "1:1",
		} as FormValues,
		validator: zodValidator(formSchema),
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);

			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/image/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(value),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || "Erro ao gerar imagem");
				}

				const data = await response.json();
				toast.success("Task criada com sucesso! Gerando imagem...");

				if (data.id && onTaskCreated) {
					onTaskCreated(data.id);
				}

				form.reset();
			} catch (error) {
				console.error("Erro ao gerar imagem:", error);
				toast.error(error instanceof Error ? error.message : "Erro ao gerar imagem");
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader className="space-y-1">
				<div className="flex items-center gap-2">
					<div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
						<Sparkles className="h-5 w-5 text-white" />
					</div>
					<CardTitle className="text-2xl">Gerar Imagem</CardTitle>
				</div>
				<CardDescription>
					Descreva a imagem que você deseja criar e selecione a proporção ideal
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-6"
				>
					<form.Field
						name="prompt"
						children={(field) => (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<label
										htmlFor={field.name}
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Descrição da Imagem
									</label>
									<span className="text-xs text-muted-foreground">
										{field.state.value?.length || 0}/{MAX_PROMPT_LENGTH}
									</span>
								</div>
								<Textarea
									id={field.name}
									placeholder="Descreva em detalhes a imagem que você quer criar..."
									value={field.state.value || ""}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={() => field.handleBlur()}
									className="min-h-[120px] resize-none"
									disabled={isSubmitting}
									aria-invalid={field.state.meta.errors.length > 0}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-destructive" role="alert">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</div>
						)}
					/>

					<form.Field
						name="aspectRatio"
						children={(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Proporção da Imagem
								</label>
								<Select
									value={field.state.value || ""}
									onValueChange={(value) => field.handleChange(value as FormValues["aspectRatio"])}
									disabled={isSubmitting}
								>
									<SelectTrigger
										id={field.name}
										aria-invalid={field.state.meta.errors.length > 0}
									>
										<SelectValue placeholder="Selecione a proporção" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
										<SelectItem value="4:3">4:3 (Horizontal)</SelectItem>
										<SelectItem value="3:4">3:4 (Vertical)</SelectItem>
										<SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
										<SelectItem value="9:16">9:16 (Stories)</SelectItem>
									</SelectContent>
								</Select>
								{field.state.meta.errors.length > 0 && (
									<p className="text-sm text-destructive" role="alert">
										{field.state.meta.errors[0]?.message}
									</p>
								)}
							</div>
						)}
					/>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isFormSubmitting]) => (
							<Button
								type="submit"
								className="w-full"
								disabled={!canSubmit || isSubmitting || isFormSubmitting}
							>
								{isSubmitting || isFormSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Gerando imagem...
									</>
								) : (
									<>
										<Sparkles className="mr-2 h-4 w-4" />
										Gerar Imagem
									</>
								)}
							</Button>
						)}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
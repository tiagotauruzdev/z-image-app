"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, Loader2, Calendar, Image as ImageIcon, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageGallery } from "./ImageGallery";
import type { TaskResponse, HistoryResponse } from "@/types/image";
import { statusConfig } from "@/lib/task-status";
import { getApiUrl } from "@/lib/api";

// Componente para truncar texto
function TruncateText({ text, maxLength = 100 }: { text: string; maxLength?: number }) {
	if (text.length <= maxLength) return text;
	return <span title={text}>{text.substring(0, maxLength)}...</span>;
}

// Componente para truncar ID
function TruncateId({ id }: { id: string }) {
	const shortId = id.substring(0, 8);
	return <span title={id}>{shortId}</span>;
}

// Componente Skeleton para card carregando
function TaskCardSkeleton() {
	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-1">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
					<Skeleton className="h-6 w-20" />
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<Skeleton className="h-16 w-full" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-5 w-20" />
					<Skeleton className="h-5 w-16" />
				</div>
				<Skeleton className="h-10 w-32" />
			</CardContent>
		</Card>
	);
}

// Componente para item individual da lista
function TaskCard({ task }: { task: TaskResponse }) {
	const config = statusConfig[task.status];
	const Icon = config.icon;

	return (
		<Card
			className={cn(
				"w-full transition-all hover:shadow-md",
				config.borderColor,
				"border"
			)}
		>
			{/* Header com status */}
			<CardHeader className={cn(config.headerBg, "pb-4")}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className={cn("p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm")}>
							<Icon className={cn("h-5 w-5", config.color)} />
						</div>
						<div>
							<CardTitle className="text-lg flex items-center gap-2">
								ID: <TruncateId id={task.id} />
							</CardTitle>
							<CardDescription className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{new Date(task.createdAt).toLocaleString("pt-BR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</CardDescription>
						</div>
					</div>
					<Badge variant={config.badgeVariant} className="text-xs">
						{config.label}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Prompt */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Prompt:</span>
					</div>
					<div className="p-3 rounded-lg bg-muted/50 text-sm">
						<TruncateText text={task.prompt} maxLength={200} />
					</div>
				</div>

				{/* Aspect Ratio e outras informações */}
				<div className="flex items-center justify-between flex-wrap gap-2">
					{task.aspectRatio && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Proporção:</span>
							<Badge variant="outline" className="text-xs">
								{task.aspectRatio}
							</Badge>
						</div>
					)}

					{task.completedAt && (
						<div className="text-xs text-muted-foreground">
							Tempo: {Math.round(
								(new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()) / 1000
							)}s
						</div>
					)}
				</div>

				{/* Resultado ou erro */}
				{task.status === "success" && task.resultUrls && task.resultUrls.length > 0 && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<ImageIcon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">
								Imagens geradas ({task.resultUrls.length}):
							</span>
						</div>
						<ImageGallery
							images={task.resultUrls}
							alt={`Imagens geradas para: ${task.prompt}`}
						/>
					</div>
				)}

				{task.status === "fail" && task.error && (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<XCircle className="h-4 w-4 text-red-500" />
							<span className="text-sm font-medium text-red-600 dark:text-red-400">
								Erro na geração:
							</span>
						</div>
						<div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
							{task.error}
						</div>
					</div>
				)}

				{task.status === "waiting" && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Processando sua imagem...</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Componente principal
export function GenerationHistory() {
	const {
		data: historyData,
		isLoading,
		error,
		refetch,
	} = useQuery<HistoryResponse>({
		queryKey: ["image-history"],
		queryFn: async () => {
			const response = await fetch(getApiUrl('/api/image/history'));
			if (!response.ok) {
				throw new Error("Falha ao buscar histórico de imagens");
			}
			return response.json();
		},
	});

	const tasks = historyData?.tasks || [];

	// Estado de carregamento inicial
	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold">Histórico de Gerações</h2>
					<p className="text-muted-foreground">Carregando histórico...</p>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<TaskCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	// Estado de erro
	if (error) {
		return (
			<Card className="w-full">
				<CardContent className="flex flex-col items-center justify-center py-12 gap-4">
					<XCircle className="h-12 w-12 text-red-500" />
					<div className="text-center space-y-2">
						<h3 className="text-lg font-semibold">Erro ao carregar histórico</h3>
						<p className="text-muted-foreground">{error.message}</p>
					</div>
					<Button onClick={() => refetch()} variant="outline">
						Tentar novamente
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Estado vazio
	if (!tasks || tasks.length === 0) {
		return (
			<Card className="w-full">
				<CardContent className="flex flex-col items-center justify-center py-12 gap-4">
					<ImageIcon className="h-12 w-12 text-muted-foreground" />
					<div className="text-center space-y-2">
						<h3 className="text-lg font-semibold">Nenhuma imagem gerada</h3>
						<p className="text-muted-foreground">
							Suas imagens geradas aparecerão aqui
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Histórico de Gerações</h2>
				<p className="text-muted-foreground">
					{tasks.length} {tasks.length === 1 ? "imagem gerada" : "imagens geradas"}
				</p>
			</div>

			{/* Grid de cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
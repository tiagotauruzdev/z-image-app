"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageGallery } from "./ImageGallery";
import type { TaskResponse } from "@/types/image";
import { statusConfig } from "@/lib/task-status";

type TaskStatusResponse = TaskResponse;

interface TaskStatusProps {
	taskId: string;
}

export function TaskStatus({ taskId }: TaskStatusProps) {
	const {
		data: taskData,
		isLoading,
		error,
		refetch,
	} = useQuery<TaskStatusResponse>({
		queryKey: ["task-status", taskId],
		queryFn: async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/image/status/${taskId}`);
			if (!response.ok) {
				throw new Error("Falha ao buscar status da task");
			}
			return response.json();
		},
		refetchInterval: (data) => {
			// Polling a cada 2 segundos apenas se o status for "waiting"
			return data?.status === "waiting" ? 2000 : false;
		},
		enabled: !!taskId,
	});

	// Se ainda está carregando pela primeira vez
	if (isLoading) {
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardContent className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	// Se ocorreu erro
	if (error) {
		return (
			<Card className="w-full max-w-2xl mx-auto border-red-200 dark:border-red-800">
				<CardContent className="py-8">
					<div className="flex items-center gap-3 text-red-600 dark:text-red-400">
						<XCircle className="h-5 w-5" />
						<span className="font-medium">
							Erro ao carregar status: {error.message}
						</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Se não há dados
	if (!taskData) {
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardContent className="py-8">
					<p className="text-center text-muted-foreground">
						Nenhum dado encontrado para a task
					</p>
				</CardContent>
			</Card>
		);
	}

	const config = statusConfig[taskData.status];
	const Icon = config.icon;

	return (
		<Card
			className={cn(
				"w-full max-w-2xl mx-auto transition-all",
				config.borderColor,
				"border-2"
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
							<CardTitle className="text-lg">Status da Geração</CardTitle>
							<CardDescription>ID: {taskData.id}</CardDescription>
						</div>
					</div>
					<Badge variant={config.badgeVariant} className="text-xs">
						{config.label}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-6 pt-0">
				{/* Barra de progresso */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>Progresso</span>
						<span>{config.progress}%</span>
					</div>
					<Progress
						value={config.progress}
						className={cn(
							"h-2",
							taskData.status === "waiting" && "[&>div]:animate-pulse"
						)}
					/>
				</div>

				{/* Prompt usado */}
				<div className="space-y-2">
					<h4 className="text-sm font-medium">Prompt utilizado:</h4>
					<div className="p-3 rounded-lg bg-muted/50 text-sm">
						{taskData.prompt}
					</div>
				</div>

				{/* Aspect Ratio se existir */}
				{taskData.aspectRatio && (
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">Proporção:</span>
						<Badge variant="outline" className="text-xs">
							{taskData.aspectRatio}
						</Badge>
					</div>
				)}

				{/* Resultado ou erro */}
				{taskData.status === "success" && taskData.resultUrls && taskData.resultUrls.length > 0 && (
					<div className="space-y-3">
						<h4 className="text-sm font-medium">Resultado:</h4>
						<ImageGallery
							images={taskData.resultUrls}
							alt={`Imagem gerada para: ${taskData.prompt}`}
						/>
					</div>
				)}

				{taskData.status === "fail" && taskData.error && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-red-600 dark:text-red-400">
							Erro na geração:
						</h4>
						<div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
							{taskData.error}
						</div>
					</div>
				)}

				{/* Timestamps */}
				<div className="pt-4 border-t space-y-2">
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>Criado em:</span>
						<span>{new Date(taskData.createdAt).toLocaleString("pt-BR")}</span>
					</div>
					{taskData.completedAt && (
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>Concluído em:</span>
							<span>{new Date(taskData.completedAt).toLocaleString("pt-BR")}</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
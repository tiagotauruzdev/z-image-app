// Tipos compartilhados para geração de imagens

export interface TaskResponse {
	id: string;
	taskId?: string;
	status: "waiting" | "success" | "fail";
	prompt: string;
	aspectRatio?: string;
	resultUrls?: string[];
	result?: {
		images: string[];
	};
	error?: string;
	createdAt: string;
	updatedAt?: string;
	completedAt?: string;
	costTime?: number;
	failureCode?: string;
	failureMessage?: string;
}

export interface HistoryResponse {
	tasks: TaskResponse[];
	hasMore: boolean;
	nextCursor?: string;
}

export interface StatusConfig {
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	borderColor: string;
	headerBg: string;
	badgeVariant: "default" | "secondary" | "destructive" | "outline";
	progress: number;
	label: string;
}
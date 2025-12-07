import { Clock, CheckCircle, XCircle } from "lucide-react";
import { StatusConfig, TaskResponse } from "@/types/image";

export const statusConfig: Record<TaskResponse["status"], StatusConfig> = {
	waiting: {
		icon: Clock,
		color: "text-yellow-600 dark:text-yellow-400",
		bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
		borderColor: "border-yellow-200 dark:border-yellow-800",
		headerBg: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
		badgeVariant: "default",
		progress: 50,
		label: "Processando",
	},
	success: {
		icon: CheckCircle,
		color: "text-green-600 dark:text-green-400",
		bgColor: "bg-green-50 dark:bg-green-950/20",
		borderColor: "border-green-200 dark:border-green-800",
		headerBg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
		badgeVariant: "default",
		progress: 100,
		label: "Concluído",
	},
	fail: {
		icon: XCircle,
		color: "text-red-600 dark:text-red-400",
		bgColor: "bg-red-50 dark:bg-red-950/20",
		borderColor: "border-red-200 dark:border-red-800",
		headerBg: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
		badgeVariant: "destructive",
		progress: 0,
		label: "Falhou",
	},
};
"use client";

import { useState } from "react";
import { ImageForm } from "@/components/image-generation/ImageForm";
import { TaskStatus } from "@/components/image-generation/TaskStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationHistory } from "@/components/image-generation/GenerationHistory";
import { Sparkles } from "lucide-react";

export default function GeneratePage() {
  const [activeTask, setActiveTask] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gerador de Imagens</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Use IA para criar imagens impressionantes a partir de descrições de texto
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Criar Imagem
          </TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <ImageForm onTaskCreated={setActiveTask} />
            </div>

            <div>
              {activeTask && (
                <TaskStatus
                  taskId={activeTask}
                />
              )}
              {!activeTask && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">
                      Status da Geração
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Crie uma imagem para ver o status aqui
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <GenerationHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	// Para monorepo: incluir arquivos fora do diretório apps/web
	outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;

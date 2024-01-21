import { basePath } from "@/next.config";
import API from "@api-blueprints/pathmaker";

export default new API({
    basePath: "/api",
    headers: {
        ['X-API-Client']: 'summit-web|lib/api',
        ['Content-Type']: 'application/json'
    }
});
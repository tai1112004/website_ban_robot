import { apiClient, ApiError } from "../lib/apiClient";
import { USE_MOCK_API } from "./robotService";
import { readConfig, changeConfig } from "./robotConfigRepository";
import { knowledgeCatalog } from "./managementCatalog";
import { validatePacks } from "./robotConfigValidation";
import type { KnowledgePack } from "../types/robotConfig";
const path = (id: string, packId?: string) =>
  `/api/devices/${encodeURIComponent(id)}/knowledge-packs${packId ? `/${encodeURIComponent(packId)}` : ""}`;
export async function getKnowledgePacks(id: string): Promise<KnowledgePack[]> {
  if (!USE_MOCK_API) return validatePacks(await apiClient(path(id)));
  const config = await readConfig(id);
  return knowledgeCatalog.map((pack) => ({
    ...pack,
    installed: config.installedPackIds.includes(pack.id),
  }));
}
async function changePack(
  id: string,
  packId: string,
  install: boolean,
): Promise<KnowledgePack[]> {
  if (!USE_MOCK_API) {
    await apiClient(path(id, packId), { method: install ? "POST" : "DELETE" });
    return getKnowledgePacks(id);
  }
  if (!knowledgeCatalog.some((pack) => pack.id === packId))
    throw new ApiError("INVALID_CONFIG", "Unknown knowledge pack.");
  await changeConfig(id, (current) => ({
    ...current,
    installedPackIds: install
      ? [...new Set([...current.installedPackIds, packId])]
      : current.installedPackIds.filter((existing) => existing !== packId),
  }));
  return getKnowledgePacks(id);
}
export async function installKnowledgePack(id: string, packId: string) {
  return changePack(id, packId, true);
}
export async function removeKnowledgePack(id: string, packId: string) {
  return changePack(id, packId, false);
}

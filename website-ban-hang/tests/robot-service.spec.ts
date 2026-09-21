import { test, expect } from "@playwright/test";
import type { RobotDevice } from "../types/robot";
let service: typeof import("../services/robotService");
const originalFetch = globalThis.fetch;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalMock = process.env.NEXT_PUBLIC_USE_MOCK_API;
const originalBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const device: RobotDevice = {
  id: "device/1",
  deviceId: "RB-12345",
  serialNumber: "SN12345",
  name: "My Robo",
  model: "BASIC",
  status: "ONLINE",
};
test.beforeAll(async () => {
  process.env.NEXT_PUBLIC_USE_MOCK_API = "false";
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080";
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: new EventTarget(),
  });
  service = await import("../services/robotService");
});
test.afterEach(() => {
  globalThis.fetch = originalFetch;
});
test.afterAll(() => {
  if (originalWindow)
    Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (originalMock === undefined) delete process.env.NEXT_PUBLIC_USE_MOCK_API;
  else process.env.NEXT_PUBLIC_USE_MOCK_API = originalMock;
  if (originalBase === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = originalBase;
});
test("API mode maps endpoints and pair payload without userId or browser storage", async () => {
  const calls: { url: string; method: string; body?: BodyInit | null }[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, method: init?.method ?? "GET", body: init?.body });
    return init?.method === "DELETE"
      ? new Response(null, { status: 204 })
      : Response.json(url.endsWith("/api/devices") ? [device] : device);
  };
  expect(await service.getRobots()).toEqual([device]);
  expect(await service.getRobot("device/1")).toEqual(device);
  expect(
    await service.pairRobot({
      deviceId: " rb-12345 ",
      activationCode: " DEMO1234 ",
    }),
  ).toEqual(device);
  await service.unpairRobot("device/1");
  expect(calls.map((c) => [c.method, c.url])).toEqual([
    ["GET", "http://localhost:8080/api/devices"],
    ["GET", "http://localhost:8080/api/devices/device%2F1"],
    ["POST", "http://localhost:8080/api/devices/pair"],
    ["DELETE", "http://localhost:8080/api/devices/device%2F1/pair"],
  ]);
  expect(JSON.parse(String(calls[2].body))).toEqual({
    deviceId: "RB-12345",
    activationCode: "DEMO1234",
  });
});
test("API failures preserve error codes, handle missing devices and reject malformed responses", async () => {
  globalThis.fetch = async () =>
    Response.json({ code: "DEVICE_ALREADY_PAIRED" }, { status: 409 });
  await expect(
    service.pairRobot({ deviceId: "RB-12345", activationCode: "DEMO1234" }),
  ).rejects.toMatchObject({ code: "DEVICE_ALREADY_PAIRED" });
  globalThis.fetch = async () =>
    Response.json({ code: "DEVICE_NOT_FOUND" }, { status: 404 });
  expect(await service.getRobot("missing")).toBeNull();
  for (const invalid of [
    null,
    {},
    [device, device],
    [{ ...device, model: ["BASIC"] }],
    [{ ...device, pairedAt: "invalid" }],
  ]) {
    globalThis.fetch = async () => Response.json(invalid);
    await expect(service.getRobots()).rejects.toMatchObject({
      code: "INVALID_DATA",
    });
  }
  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  await expect(service.getRobots()).rejects.toMatchObject({
    code: "NETWORK_ERROR",
  });
});
test("management services map settings, knowledge, rename and commands to the REST contract", async () => {
  const configService = await import("../services/robotConfigService");
  const knowledge = await import("../services/knowledgeService");
  const actions = await import("../services/actionService");
  const { createDefaultConfig } = await import("../services/managementCatalog");
  const config = createDefaultConfig();
  const requests: { method: string; path: string; body: unknown }[] = [];
  globalThis.fetch = async (url, init) => {
    const path = new URL(String(url)).pathname;
    const method = init?.method ?? "GET";
    requests.push({
      path,
      method,
      body: init?.body ? JSON.parse(String(init.body)) : null,
    });
    if (
      method === "DELETE" ||
      path.endsWith("/actions") ||
      /knowledge-packs\//.test(path)
    )
      return new Response(null, { status: 204 });
    if (path.endsWith("/knowledge-packs")) return Response.json([]);
    if (path.endsWith("/config")) return Response.json(config);
    const key = path.split("/").pop();
    if (
      key === "personality" ||
      key === "memory" ||
      key === "voice" ||
      key === "display"
    )
      return Response.json(config[key]);
    return Response.json({
      ...device,
      capabilities: ["MOTION"],
      name: method === "PUT" ? "Desk Robo" : device.name,
    });
  };
  await configService.getRobotConfig("device/1");
  await configService.updateRobotConfig("device/1", config);
  await configService.getPersonality("device/1");
  await configService.updatePersonality("device/1", config.personality);
  await configService.getMemorySettings("device/1");
  await configService.updateMemorySettings("device/1", config.memory);
  await configService.getVoiceSettings("device/1");
  await configService.updateVoiceSettings("device/1", config.voice);
  await configService.getDisplaySettings("device/1");
  await configService.updateDisplaySettings("device/1", config.display);
  await configService.clearMemory("device/1");
  await knowledge.getKnowledgePacks("device/1");
  await knowledge.installKnowledgePack("device/1", "pack/1");
  await knowledge.removeKnowledgePack("device/1", "pack/1");
  await service.updateRobot("device/1", { name: " Desk Robo " });
  expect(await actions.executeAction("device/1", { action: "WAVE" })).toEqual({
    status: "SENT",
    simulated: false,
  });
  const base = "/api/devices/device%2F1";
  for (const key of ["config", "personality", "memory", "voice", "display"]) {
    expect(requests).toContainEqual({
      method: "GET",
      path: `${base}/${key}`,
      body: null,
    });
    expect(
      requests.some((r) => r.method === "PUT" && r.path === `${base}/${key}`),
    ).toBeTruthy();
  }
  expect(requests).toContainEqual({
    method: "DELETE",
    path: `${base}/memory`,
    body: null,
  });
  expect(requests).toContainEqual({
    method: "POST",
    path: `${base}/knowledge-packs/pack%2F1`,
    body: null,
  });
  expect(requests).toContainEqual({
    method: "DELETE",
    path: `${base}/knowledge-packs/pack%2F1`,
    body: null,
  });
  expect(requests).toContainEqual({
    method: "POST",
    path: `${base}/actions`,
    body: { action: "WAVE" },
  });
  expect(requests).toContainEqual({
    method: "PUT",
    path: base,
    body: { name: "Desk Robo" },
  });
});
test("management rejects invalid values and unsupported or offline commands before sending", async () => {
  const configService = await import("../services/robotConfigService");
  const actions = await import("../services/actionService");
  const { createDefaultConfig } = await import("../services/managementCatalog");
  const config = createDefaultConfig();
  let posts = 0;
  globalThis.fetch = async (_url, init) => {
    if (init?.method === "POST") ++posts;
    return Response.json(device);
  };
  await expect(
    configService.updateVoiceSettings("device/1", {
      ...config.voice,
      volume: 101,
    }),
  ).rejects.toMatchObject({ code: "INVALID_CONFIG" });
  await expect(
    configService.updateDisplaySettings("device/1", {
      ...config.display,
      brightness: -1,
    }),
  ).rejects.toMatchObject({ code: "INVALID_CONFIG" });
  await expect(
    configService.updatePersonality("device/1", {
      ...config.personality,
      humorLevel: NaN,
    }),
  ).rejects.toMatchObject({ code: "INVALID_CONFIG" });
  await expect(
    actions.executeAction("device/1", { action: "WAVE" }),
  ).rejects.toMatchObject({ code: "ACTION_NOT_SUPPORTED" });
  globalThis.fetch = async (_url, init) => {
    if (init?.method === "POST") ++posts;
    return Response.json({
      ...device,
      capabilities: ["MOTION"],
      status: "OFFLINE",
    });
  };
  await expect(
    actions.executeAction("device/1", { action: "WAVE" }),
  ).rejects.toMatchObject({ code: "ROBOT_OFFLINE" });
  expect(posts).toBe(0);
});

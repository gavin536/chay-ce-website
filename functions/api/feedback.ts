type FeedbackEnv = {
  DISCORD_BOT_TOKEN?: string;
  DISCORD_TARGET_USER_ID?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: FeedbackEnv;
};

type FeedbackType =
  | "Addon Idea"
  | "Website Suggestion"
  | "Bug Report"
  | "Stream / Community"
  | "Other";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const allowedFeedbackTypes = new Set<FeedbackType>([
  "Addon Idea",
  "Website Suggestion",
  "Bug Report",
  "Stream / Community",
  "Other",
]);

const rateLimits = new Map<string, RateLimitEntry>();
const rateLimitWindowMs = 15 * 60 * 1000;
const maxRequestsPerWindow = 4;

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function onRequestPost({ request, env }: PagesFunctionContext) {
  const clientId = getClientId(request);

  if (isRateLimited(clientId)) {
    return jsonResponse({ error: "Unable to send your suggestion right now. Please try again later." }, 429);
  }

  if (!env.DISCORD_BOT_TOKEN || !isDiscordUserId(env.DISCORD_TARGET_USER_ID)) {
    return jsonResponse({ error: "Feedback delivery is temporarily unavailable." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (contentLength > 6_000) {
    return jsonResponse({ error: "Unable to send your suggestion right now. Please try again later." }, 413);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Unable to send your suggestion right now. Please try again later." }, 400);
  }

  const feedback = validateFeedback(body);

  if (!feedback.ok) {
    return jsonResponse({ error: feedback.error }, 400);
  }

  const discordMessage = [
    "**NEW CHAY_CE WEBSITE FEEDBACK**",
    "",
    "**FROM:**",
    feedback.value.name,
    "",
    "**DISCORD:**",
    feedback.value.discord || "Not provided",
    "",
    "**TYPE:**",
    feedback.value.type,
    "",
    "**MESSAGE:**",
    feedback.value.message,
    "",
    "**SOURCE:**",
    "chay-ce.com",
  ].join("\n");

  try {
    await logDiscordDiagnostics(env.DISCORD_BOT_TOKEN, env.DISCORD_TARGET_USER_ID);
    const channelId = await createDiscordDmChannel(env.DISCORD_BOT_TOKEN, env.DISCORD_TARGET_USER_ID);
    await sendDiscordMessage(env.DISCORD_BOT_TOKEN, channelId, discordMessage);
  } catch (error) {
    console.error("Discord feedback delivery failed:", error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: "Unable to send your suggestion right now. Please try again later." }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

function validateFeedback(body: unknown):
  | { ok: true; value: { name: string; discord: string; type: FeedbackType; message: string } }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Invalid feedback payload." };
  }

  const name = sanitizeField(body.name, 80);
  const discord = sanitizeField(body.discord, 80);
  const type = sanitizeField(body.type, 40);
  const message = sanitizeField(body.message, 1200);
  const website = sanitizeField(body.website, 120);

  if (website) {
    return { ok: false, error: "Unable to send your suggestion right now. Please try again later." };
  }

  if (!name) {
    return { ok: false, error: "Name / Twitch Handle is required." };
  }

  if (!allowedFeedbackTypes.has(type as FeedbackType)) {
    return { ok: false, error: "Please choose a valid feedback type." };
  }

  if (!message || message.length < 5) {
    return { ok: false, error: "Suggestion / Comment is required." };
  }

  return {
    ok: true,
    value: {
      name,
      discord,
      type: type as FeedbackType,
      message,
    },
  };
}

function sanitizeField(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/@/g, "@\u200b")
    .replace(/https?:\/\/\S+/gi, "[link removed]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDiscordUserId(value: unknown): value is string {
  return typeof value === "string" && /^\d{17,20}$/.test(value);
}

function getClientId(request: Request) {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
}

function isRateLimited(clientId: string) {
  const now = Date.now();
  const existing = rateLimits.get(clientId);

  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) {
      rateLimits.delete(key);
    }
  }

  if (!existing || existing.resetAt <= now) {
    rateLimits.set(clientId, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  existing.count += 1;
  rateLimits.set(clientId, existing);

  return existing.count > maxRequestsPerWindow;
}

async function logDiscordDiagnostics(botToken: string, targetUserId: string) {
  try {
    const authenticatedBotResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: discordHeaders(botToken),
    });

    if (!authenticatedBotResponse.ok) {
      const responseBody = await authenticatedBotResponse.text();
      console.error(
        "Discord authenticated bot diagnostic failed:",
        authenticatedBotResponse.status,
        authenticatedBotResponse.statusText,
        responseBody,
      );
    } else {
      const authenticatedBot = (await authenticatedBotResponse.json()) as {
        id?: unknown;
        username?: unknown;
        global_name?: unknown;
        bot?: unknown;
      };

      console.error("Discord authenticated bot:", {
        id: authenticatedBot.id,
        username: authenticatedBot.username,
        global_name: authenticatedBot.global_name,
        bot: authenticatedBot.bot,
      });
    }
  } catch (error) {
    console.error(
      "Discord authenticated bot diagnostic failed:",
      error instanceof Error ? error.message : String(error),
    );
  }

  try {
    const guildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: discordHeaders(botToken),
    });

    if (!guildsResponse.ok) {
      const responseBody = await guildsResponse.text();
      console.error(
        "Discord bot guilds diagnostic failed:",
        guildsResponse.status,
        guildsResponse.statusText,
        responseBody,
      );
    } else {
      const guilds = (await guildsResponse.json()) as Array<{ id?: unknown; name?: unknown }>;

      console.error(
        "Discord bot guilds:",
        guilds.map((guild) => ({ id: guild.id, name: guild.name })),
      );

      for (const guild of guilds) {
        try {
          const memberResponse = await fetch(
            `https://discord.com/api/v10/guilds/${guild.id}/members/${targetUserId}`,
            { headers: discordHeaders(botToken) },
          );
          const diagnostic = {
            "guild id": guild.id,
            "guild name": guild.name,
            status: memberResponse.status,
            statusText: memberResponse.statusText,
          };

          if (!memberResponse.ok) {
            const responseBody = await memberResponse.text();
            console.error("Discord target membership check:", diagnostic, responseBody);
            continue;
          }

          const member = (await memberResponse.json()) as {
            user?: { id?: unknown; username?: unknown };
            pending?: unknown;
            flags?: unknown;
          };

          console.error("Discord target membership check:", {
            ...diagnostic,
            "member.user.id": member.user?.id,
            "member.user.username": member.user?.username,
            "member.pending": member.pending,
            "member.flags": member.flags,
          });
        } catch (error) {
          console.error(
            "Discord target membership check:",
            { "guild id": guild.id, "guild name": guild.name },
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    }
  } catch (error) {
    console.error("Discord bot guilds diagnostic failed:", error instanceof Error ? error.message : String(error));
  }
}

async function createDiscordDmChannel(botToken: string, userId: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me/channels", {
    method: "POST",
    headers: discordHeaders(botToken),
    body: JSON.stringify({ recipient_id: userId }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.error("Discord DM channel creation failed:", response.status, response.statusText, responseBody);
    throw new Error("Discord DM channel creation failed.");
  }

  const body = (await response.json()) as { id?: unknown };

  if (typeof body.id !== "string") {
    throw new Error("Discord DM channel response was invalid.");
  }

  return body.id;
}

async function sendDiscordMessage(botToken: string, channelId: string, content: string) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: discordHeaders(botToken),
    body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.error("Discord message delivery failed:", response.status, response.statusText, responseBody);
    throw new Error("Discord message delivery failed.");
  }
}

function discordHeaders(botToken: string) {
  return {
    Authorization: `Bot ${botToken}`,
    "Content-Type": "application/json",
  };
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

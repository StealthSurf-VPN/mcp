import { createServer } from "node:http"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createMcpServer } from "./server.js"

const PORT = Number(process.env.PORT) || 4500

const HOST = process.env.HOST || "127.0.0.1"

const STEALTHSURF_API_URL =
  process.env.STEALTHSURF_API_URL || "https://api.stealthsurf.app"

const httpServer = createServer(async (req, res) => {
  if (req.method === "POST" && (req.url === "/" || req.url === "/mcp")) {
    const authHeader = req.headers.authorization || ""

    const apiKey = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : ""

    if (!apiKey || !apiKey.startsWith("stlth_")) {
      res.writeHead(401, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Missing or invalid stlth_* API key in Authorization header",
          },
          id: null,
        }),
      )
      return
    }

    try {
      const chunks: Buffer[] = []

      for await (const chunk of req) chunks.push(chunk)

      const body = JSON.parse(Buffer.concat(chunks).toString())

      const server = createMcpServer(STEALTHSURF_API_URL, apiKey)

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      })

      await server.connect(transport)
      await transport.handleRequest(req, res, body)

      res.on("close", async () => {
        await transport.close()
        await server.close()
      })
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32700,
              message: "Parse error",
            },
            id: null,
          }),
        )
      }
    }
  } else if (
    req.method === "GET" &&
    (req.url === "/" || req.url === "/mcp")
  ) {
    res.writeHead(405, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed. Use POST." },
        id: null,
      }),
    )
  } else if (req.method === "DELETE") {
    res.writeHead(405)
    res.end()
  } else {
    res.writeHead(404)
    res.end()
  }
})

httpServer.listen(PORT, HOST, () => {
  console.log(`StealthSurf MCP Server listening on ${HOST}:${PORT}`)
})

process.on("SIGINT", () => {
  httpServer.close()
  process.exit(0)
})

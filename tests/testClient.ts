import { createServer } from "http";
import { NextApiHandler } from "next";
import { apiResolver } from "next/dist/next-server/server/api-utils";
import request from "supertest";
import global from "./global";

export const testClient = async (
  handler: any,
  { host = "example.com", query = null }: { host?: string; query?: any } = {}
) =>
  request(
    createServer(async (req, res) => {
      req.headers.host = host;
      req.headers.acceesstoken = global.accessToken1;

      return apiResolver(req, res, query, handler, {} as any, false);
    })
  );

export const testClientNoAccessToken = async (
  handler: any,
  { host = "example.com", query = null }: { host?: string; query?: any } = {}
) =>
  request(
    createServer(async (req, res) => {
      req.headers.host = host;

      return apiResolver(req, res, query, handler, {} as any, false);
    })
  );

export const testClientInvalidUser = async (
  handler: any,
  { host = "example.com", query = null }: { host?: string; query?: any } = {}
) =>
  request(
    createServer(async (req, res) => {
      req.headers.host = host;
      req.headers.acceesstoken = global.accessToken2;

      return apiResolver(req, res, query, handler, {} as any, false);
    })
  );

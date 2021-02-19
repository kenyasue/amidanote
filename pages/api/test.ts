import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/test:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */
export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("OK");
};

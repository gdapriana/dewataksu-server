import { web } from "src/server";
import { logger } from "src/utils/logging";
import dotenv from "dotenv";
dotenv.config();

web.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT} `);
});

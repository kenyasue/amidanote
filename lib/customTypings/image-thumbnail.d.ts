// Type definitions for image-thumbnail 1.0
// Project: https://github.com/onildoaguiar/image-thumbnail#readme
// Definitions by: Noam Alffasy <https://github.com/noamalffasy>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

declare module "image-thumbnail" {
  declare function imageFunction(
    src: { uri: string } | string | Buffer | ReadStream,
    options?: { responseType: "buffer" } & imageFunction.Options
  ): Promise<Buffer>;
  declare function imageFunction(
    src: { uri: string } | string | Buffer | ReadStream,
    options?: { responseType: "base64" } & imageFunction.Options
  ): Promise<string>;

  declare namespace imageFunction {
    interface Options {
      percentage?: number;
      width?: number;
      height?: number;
      responseType?: string;
      fit?: string;
    }
  }

  export = imageFunction;
}

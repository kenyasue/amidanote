declare module "remark-attr" {
  import { Plugin } from "unified";
  type Attr = Plugin<[RemarkAttrOptions]>;
  interface RemarkAttrOptions {}
  declare const remartAttr: Attr;
  export = remartAttr;
}

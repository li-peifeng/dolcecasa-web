import { Component, lazy } from "solid-js"
import { getIframePreviews } from "~/store"
import { Obj, ObjType } from "~/types"
import { ext } from "~/utils"
import { generateIframePreview } from "./iframe"
import { useRouter } from "~/hooks"

export interface Preview {
  name: string
  type?: ObjType
  exts?: string[] | "*"
  provider?: RegExp
  component: Component
}

export type PreviewComponent = Pick<Preview, "name" | "component">

const previews: Preview[] = [
  {
    name: "HTML 渲染",
    exts: ["html"],
    component: lazy(() => import("./html")),
  },
  {
    name: "阿里云视频播放",
    type: ObjType.VIDEO,
    provider: /^Aliyundrive(Open)?$/,
    component: lazy(() => import("./aliyun_video")),
  },
  {
    name: "Markdown 预览",
    type: ObjType.TEXT,
    component: lazy(() => import("./markdown")),
  },
  {
    name: "Markdown 预览 + 自动换行",
    type: ObjType.TEXT,
    component: lazy(() => import("./markdown_with_word_wrap")),
  },
  {
    name: "打开 URL",
    exts: ["url"],
    component: lazy(() => import("./url")),
  },
  {
    name: "TXT 预览",
    type: ObjType.TEXT,
    exts: ["url"],
    component: lazy(() => import("./text-editor")),
  },
  {
    name: "图片预览",
    type: ObjType.IMAGE,
    component: lazy(() => import("./image")),
  },
  {
    name: "播放视频",
    type: ObjType.VIDEO,
    component: lazy(() => import("./video")),
  },
  {
    name: "播放音乐",
    type: ObjType.AUDIO,
    component: lazy(() => import("./audio")),
  },
  {
    name: "IPA 文件",
    exts: ["ipa", "tipa"],
    component: lazy(() => import("./ipa")),
  },
  {
    name: "PLIST 文件",
    exts: ["plist"],
    component: lazy(() => import("./plist")),
  },
  {
    name: "办公文档",
    exts: ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"],
    provider: /^Aliyundrive(Share)?$/,
    component: lazy(() => import("./aliyun_office")),
  },
  {
    name: "终端录屏",
    exts: ["cast"],
    component: lazy(() => import("./asciinema")),
  },
]

export const getPreviews = (
  file: Obj & { provider: string },
): PreviewComponent[] => {
  const { searchParams } = useRouter()
  const typeOverride =
    ObjType[searchParams["type"]?.toUpperCase() as keyof typeof ObjType]
  const res: PreviewComponent[] = []
  // internal previews
  previews.forEach((preview) => {
    if (preview.provider && !preview.provider.test(file.provider)) {
      return
    }
    if (
      preview.type === file.type ||
      (typeOverride && preview.type === typeOverride) ||
      preview.exts === "*" ||
      preview.exts?.includes(ext(file.name).toLowerCase())
    ) {
      res.push({ name: preview.name, component: preview.component })
    }
  })
  // iframe previews
  const iframePreviews = getIframePreviews(file.name)
  iframePreviews.forEach((preview) => {
    res.push({
      name: preview.key,
      component: generateIframePreview(preview.value),
    })
  })
  // download page
  res.push({
    name: "下载文件",
    component: lazy(() => import("./download")),
  })
  return res
}

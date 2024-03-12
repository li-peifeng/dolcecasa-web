import { Box } from "@hope-ui/solid"
import { SelectWrapper } from "./Base"

export function EncodingSelect(props: {
  encoding: string
  setEncoding: (encoding: string) => void
}) {
  const encodingLabels = [
    "utf-8",
    "gbk",
    "gb18030",
    "macintosh",
    "big5",
    "utf-16be",
    "utf-16le",
  ]
  return (
    <Box
      pos="absolute"
      right={0}
      top={0}
      w="$36"
      opacity={0.15}
      _hover={{
        opacity: 1,
      }}
      zIndex={1}
    >
      <SelectWrapper
        options={encodingLabels.map((label) => ({
          label: label.toLocaleUpperCase(),
          value: label,
        }))}
        value={props.encoding}
        onChange={(v) => props.setEncoding(v)}
      />
    </Box>
  )
}

import {
  Box,
  createDisclosure,
  VStack,
  notificationService,
} from "@hope-ui/solid"
import { createMemo, Show } from "solid-js"
import { RightIcon } from "./Icon"
import { TbCheckbox } from "solid-icons/tb"
import { objStore, State, toggleCheckbox, userCan } from "~/store"
import { bus } from "~/utils"
import { operations } from "./operations"
import { IoMagnetOutline } from "solid-icons/io"
import { AiOutlineCloudUpload, AiOutlineSetting } from "solid-icons/ai"
import { RiSystemRefreshLine } from "solid-icons/ri"
import { usePath } from "~/hooks"
import { Motion } from "@motionone/solid"
import { isTocVisible, setTocDisabled } from "~/components"
import { BiSolidBookContent } from "solid-icons/bi"
import { useColorMode, useColorModeValue } from "@hope-ui/solid"
import { FiSun as Sun } from "solid-icons/fi"
import { FiMoon as Moon } from "solid-icons/fi"
import { VsHeart } from "solid-icons/vs"
import { VsActivateBreakpoints as Auto } from "solid-icons/vs"

export const Right = () => {
  const { isOpen, onToggle } = createDisclosure({
    defaultIsOpen: localStorage.getItem("more-open") === "true",
    onClose: () => localStorage.setItem("more-open", "false"),
    onOpen: () => localStorage.setItem("more-open", "true"),
  })
  const margin = createMemo(() => (isOpen() ? "$4" : "$5"))
  const isFolder = createMemo(() => objStore.state === State.Folder)
  const { refresh } = usePath()
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(
    {
      size: "$8",
      component: Moon,
      p: "$0_5",
    },
    {
      size: "$8",
      component: Sun,
      p: "$0_5",
    },
  )

  return (
    <Box
      class="right-toolbar-box"
      pos="fixed"
      right={margin()}
      bottom={margin()}
    >
      <Show
        when={isOpen()}
        fallback={
          <RightIcon
            class="toolbar-toggle"
            tips="more"
            as={VsHeart}
            onClick={() => {
              onToggle()
            }}
          />
        }
      >
        <VStack
          class="right-toolbar"
          p="$1"
          rounded="$lg"
          spacing="$1"
          // shadow="0px 10px 30px -5px rgba(0, 0, 0, 0.3)"
          // bgColor={useColorModeValue("white", "$neutral4")()}
          bgColor="$neutral1"
          as={Motion.div}
          initial={{ opacity: 0, scale: 0, y: 300 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 300 }}
          // @ts-ignore
          transition={{ duration: 0.2 }}
        >
          <VStack spacing="$1" class="right-toolbar-in">
            <Show when={isFolder() && (userCan("write") || objStore.write)}>
              {/* <Add /> */}
              <RightIcon
                as={RiSystemRefreshLine}
                tips="refresh"
                onClick={() => {
                  refresh(undefined, true)
                  notificationService.show({
                    status: "success",
                    description: "目录刷新成功",
                    closable: false,
                  })
                }}
              />
              <RightIcon
                as={operations.new_file.icon}
                tips="new_file"
                onClick={() => {
                  bus.emit("tool", "new_file")
                }}
              />
              <RightIcon
                as={operations.mkdir.icon}
                p="$1_5"
                tips="mkdir"
                onClick={() => {
                  bus.emit("tool", "mkdir")
                }}
              />
              <RightIcon
                as={operations.recursive_move.icon}
                tips="recursive_move"
                onClick={() => {
                  bus.emit("tool", "recursiveMove")
                }}
              />
              <RightIcon
                as={operations.remove_empty_directory.icon}
                tips="remove_empty_directory"
                onClick={() => {
                  bus.emit("tool", "removeEmptyDirectory")
                }}
              />
              <RightIcon
                as={operations.batch_rename.icon}
                tips="batch_rename"
                onClick={() => {
                  bus.emit("tool", "batchRename")
                }}
              />
              <RightIcon
                as={AiOutlineCloudUpload}
                tips="upload"
                onClick={() => {
                  bus.emit("tool", "upload")
                }}
              />
            </Show>
            <Show when={isFolder() && userCan("offline_download")}>
              <RightIcon
                as={IoMagnetOutline}
                pl="0"
                tips="offline_download"
                onClick={() => {
                  bus.emit("tool", "offline_download")
                }}
              />
            </Show>
            <Show when={isTocVisible()}>
              <RightIcon
                as={BiSolidBookContent}
                tips="toggle_markdown_toc"
                onClick={() => {
                  setTocDisabled((disabled) => !disabled)
                }}
              />
            </Show>
            <RightIcon
              tips="toggle_checkbox"
              as={TbCheckbox}
              onClick={toggleCheckbox}
            />
            <RightIcon
              as={icon().component}
              tips="toggle_theme"
              onClick={toggleColorMode}
            />
            <RightIcon
              as={Auto}
              tips="toggle_theme_auto"
              onClick={() => {
                localStorage.removeItem("hope-ui-color-mode")
                notificationService.show({
                  status: "success",
                  description: "主题设置成功，正在刷新页面",
                  closable: false,
                })
                setTimeout(function () {
                  location.reload()
                }, 2500)
              }}
            />
            <RightIcon
              as={AiOutlineSetting}
              tips="browser_setting"
              onClick={() => {
                bus.emit("tool", "local_settings")
              }}
            />
          </VStack>
          <RightIcon tips="close" as={VsHeart} onClick={onToggle} />
        </VStack>
      </Show>
    </Box>
  )
}
